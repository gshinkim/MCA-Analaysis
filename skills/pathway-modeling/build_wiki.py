#!/usr/bin/env python3
"""Build index.md (the wiki hub) and cross-link footers from the converted references."""
import re, sys
from pathlib import Path

OUT = Path(sys.argv[1])
REF = OUT / "references"

sys.argv = ["x", "latex/LaTeX Files", str(OUT)]
g = {"__name__": "lib"}
exec(compile(Path("tex2md.py").read_text().replace("main()\n", "", 1), "tex2md", "exec"), g)
FILES = g["FILES"]

GROUPS = [
    ("chapter",     "Chapters (the book proper)"),
    ("appendix",    "Appendices"),
    ("supplement",  "Supplementary chapters (present in the source, not in the printed book)"),
    ("draft",       "Unpublished drafts"),
    ("notes",       "Standalone note files (self-contained LaTeX articles)"),
    ("frontmatter", "Front matter and book metadata"),
]

def sections(slug):
    out = []
    for line in (REF / f"{slug}.md").read_text().split("\n"):
        m = re.match(r"^## (.+)$", line)
        if m:
            t = re.sub(r"\s*<a id=.*$", "", m.group(1)).strip()
            if t and not t.startswith("Index terms"):
                out.append(t)
    return out

lines = [
    "# Pathway Modeling — Wiki Index",
    "",
    "Complete, verbatim conversion of the LaTeX source of Herbert M. Sauro, "
    "*Systems Biology: An Introduction to Pathway Modeling*, First Python Edition v1.22 "
    "(Ambrosius Publishing, ISBN 978-0-9824773-7-3).",
    "",
    "One `.md` per source `.tex` file. **Nothing was removed.** Prose, equations, TikZ and "
    "pgfplots figure sources, tabular data, code listings, LaTeX comments and index terms "
    "are all preserved; `\\ref` cross-references became `[[wiki links]]`.",
    "",
    "Skill entry point: [[SKILL]]",
    "",
]

for key, heading in GROUPS:
    members = [(slug, title) for _, slug, title, grp in FILES if grp == key]
    if not members:
        continue
    lines += [f"## {heading}", ""]
    for slug, title in members:
        secs = sections(slug)
        nlines = len((REF / f"{slug}.md").read_text().split("\n"))
        lines.append(f"### [[{slug}|{title}]]")
        lines.append("")
        lines.append(f"`references/{slug}.md` — {nlines} lines")
        lines.append("")
        if secs:
            lines.append("Sections: " + " · ".join(secs))
            lines.append("")
    lines.append("")

(OUT / "index.md").write_text("\n".join(lines), encoding="utf-8")

# footer: previous / next / index on every reference file
order = [slug for _, slug, _, _ in FILES]
titles = {slug: t for _, slug, t, _ in FILES}
for i, slug in enumerate(order):
    p = REF / f"{slug}.md"
    txt = p.read_text().rstrip("\n")
    nav = ["", "", "---", ""]
    bits = []
    if i:
        bits.append(f"← [[{order[i-1]}|{titles[order[i-1]]}]]")
    bits.append("[[index|Wiki index]]")
    if i + 1 < len(order):
        bits.append(f"[[{order[i+1]}|{titles[order[i+1]]}]] →")
    nav.append(" · ".join(bits))
    p.write_text(txt + "\n".join(nav) + "\n", encoding="utf-8")

print("index.md written;", len(order), "files linked")
