#!/usr/bin/env python3
"""Convert Sauro's Pathway Modeling LaTeX sources to a wiki-linked Skill reference set.

Lossless bias: nothing is deleted. Figures, TikZ, pgfplots and tabular bodies are
preserved verbatim inside fenced blocks; LaTeX comments become HTML comments;
\\label/\\ref survive as anchors and [[wiki links]].
"""
import re, sys, os, json
from pathlib import Path

SRC = Path(sys.argv[1])
OUT = Path(sys.argv[2])
REF = OUT / "references"

# tex stem -> (output slug, human title, group)
FILES = [
    ("chapter1",  "01_cellular_networks",              "Cellular Networks",                 "chapter"),
    ("chapter2",  "02_kinetics_in_a_nutshell",         "Kinetics in a Nutshell",            "chapter"),
    ("chapter3",  "03_stoichiometric_networks",        "Stoichiometric Networks",           "chapter"),
    ("chapter4",  "04_introduction_to_modeling",       "Introduction to Modeling",          "chapter"),
    ("chapter5",  "05_differential_equation_models",   "Differential Equation Models",      "chapter"),
    ("chapter6",  "06_stochastic_models",              "Stochastic Models",                 "chapter"),
    ("chapter7",  "07_how_systems_behave",             "How Systems Behave",                "chapter"),
    ("chapter8",  "08_multicompartmental_systems",     "Multicompartmental Systems",        "chapter"),
    ("chapter9",  "09_fitting_models",                 "Fitting Models",                    "chapter"),
    ("chapter10", "10_parameter_estimation",           "Parameter Estimation",              "chapter"),
    ("chapter11", "11_bayesian_inference",             "Introduction to Bayesian Inference","chapter"),
    ("chapter12", "12_the_steady_state",               "The Steady State",                  "chapter"),
    ("chapter13", "13_stability",                      "Stability",                         "chapter"),
    ("chapter14", "14_modeling_feedforward_networks",  "Modeling FeedForward Networks",     "chapter"),
    ("chapter15", "15_behavior_of_stochastic_models",  "Behavior of Stochastic Models",     "chapter"),
    ("chapter16", "16_understanding_metabolism",       "Understanding Metabolism",          "chapter"),
    ("chapter17", "17_moiety_conserved_cycles",        "Moiety Conserved Cycles",           "chapter"),
    ("appendixA", "appendix_a_list_of_symbols",        "List of Symbols and Abbreviations", "appendix"),
    ("appendixB", "appendix_b_useful_numbers",         "Useful Numbers",                    "appendix"),
    ("appendixC", "appendix_c_answers_to_questions",   "Answers to Questions",              "appendix"),
    ("appendixD", "appendix_d_kinetics_in_a_nutshell", "Kinetics in a Nutshell",            "appendix"),
    ("appendixE", "appendix_e_enzyme_kinetics_in_a_nutshell", "Enzyme Kinetics in a Nutshell", "appendix"),
    ("appendixF", "appendix_f_math_fundamentals",      "Math Fundamentals",                 "appendix"),
    ("appendixG", "appendix_g_statistics_reminder",    "Statistics Reminder",               "appendix"),
    ("appendixH", "appendix_h_modeling_standards_and_databases", "Modeling Standards and Databases", "appendix"),
    ("appendixI", "appendix_i_modeling_with_python",   "Modeling with Python",              "appendix"),
    ("chapter14a","draft_branched_and_cyclic_systems", "Branched and Cyclic Systems (unpublished draft)", "draft"),
    ("chapter2_Old","draft_kinetics_in_a_nutshell_old","Kinetics in a Nutshell (earlier draft)", "draft"),
    ("chapterNumericalMethods","supplement_computer_simulation_methods","Computer Simulation Methods", "supplement"),
    ("chapterSimulationSoftware","supplement_simulation_software","Simulation Software",    "supplement"),
    ("BurstingModel",     "notes_bursting_model",        "Bursting Model (standalone notes)", "notes"),
    ("StochastiChatterA", "notes_stochastic_chatter_a",  "Stochastic Chatter A (standalone notes)", "notes"),
    ("StochasticChatterB","notes_stochastic_chatter_b",  "Stochastic Chatter B (standalone notes)", "notes"),
    ("StochasticFocusing", "notes_stochastic_focusing",  "Stochastic Focusing (standalone notes)", "notes"),
    ("coverInfo",  "front_matter_cover_image",          "Cover Image",                       "frontmatter"),
    ("Main",       "book_structure_and_history",        "Book Structure, Front Matter and Revision History", "frontmatter"),
]
SLUG = {stem: slug for stem, slug, _, _ in FILES}
TITLE = {slug: t for _, slug, t, _ in FILES}

# ---------------------------------------------------------------- pass 1: labels
label_home = {}          # label -> slug
label_text = {}          # label -> nearest heading text


def scan_labels(stem, slug, text):
    # figure / table labels: link text comes from the caption, not the heading
    for blk in re.findall(r"\\begin\{(?:figure|table)\*?\}.*?\\end\{(?:figure|table)\*?\}", text, re.S):
        lab = re.search(r"\\label\{([^}]*)\}", blk)
        cap = extract_braced(blk, r"\\caption\{")
        if lab:
            label_home.setdefault(lab.group(1), slug)
            kind = "Table" if blk.lstrip().startswith("\\begin{table}") else "Figure"
            short = clean_inline(cap or "").strip() if cap else ""
            short = re.split(r"(?<=[.;:])\s", short)[0][:70].rstrip(" .") if short else lab.group(1)
            label_text.setdefault(lab.group(1), f"{kind}: {short}")
    heading = TITLE[slug]
    for m in re.finditer(r"\\(chapter|section|subsection|subsubsection)\*?(?:\[[^\]]*\])?"
                         r"\{((?:[^{}]|\{[^{}]*\})*)\}|\\label\{([^}]*)\}", text):
        if m.group(3) is None:
            heading = clean_inline(m.group(2))
        else:
            label_home.setdefault(m.group(3), slug)
            label_text.setdefault(m.group(3), heading)


# ---------------------------------------------------------------- inline macros
def clean_inline(s):
    s = re.sub(r"\\index\{(?:[^{}]|\{[^{}]*\})*\}", "", s)
    s = re.sub(r"\\(?:emph|textit|textsl|textsc)\{([^{}]*)\}", r"*\1*", s)
    s = re.sub(r"\\(?:textbf|bfseries)\{([^{}]*)\}", r"**\1**", s)
    s = re.sub(r"\\(?:texttt|lstinline|verb)\{([^{}]*)\}", r"`\1`", s)
    s = re.sub(r"\\(?:mbox|text|textnormal|textsf|hbox)\{([^{}]*)\}", r"\1", s)
    s = re.sub(r"\{\\em\s+([^{}]*)\}", r"*\1*", s)
    s = re.sub(r"\{\\(?:bf|bfseries)\s+([^{}]*)\}", r"**\1**", s)
    s = re.sub(r"\{\\(?:tt|ttfamily)\s+([^{}]*)\}", r"`\1`", s)
    s = re.sub(r"\\url\{([^}]*)\}", r"<\1>", s)
    s = re.sub(r"\\href\{([^}]*)\}\{([^}]*)\}", r"[\2](\1)", s)
    s = re.sub(r"\\footnote\{", "(footnote: ", s)   # closing brace handled loosely below
    s = s.replace(r"\ldots", "...").replace(r"\dots", "...")
    s = s.replace(r"\&", "&").replace(r"\%", "%").replace(r"\$", "$")
    s = s.replace(r"\#", "#").replace(r"\_", "_")
    s = s.replace("``", '"').replace("''", '"')
    s = re.sub(r"\\(?:vskip|vspace|hspace|hfill|vfill|noindent|medskip|bigskip|smallskip"
               r"|centering|raggedright|raggedbottom|clearpage|newpage|pagebreak"
               r"|phantomsection|myclearpage|maketitle)\b\*?(?:\{[^{}]*\}|-?[\d.]+\s*(?:in|pt|cm|em|ex|mm))?", "", s)
    s = re.sub(r"\\my(?:Copyright(?:FinalDraft|OneLastRead)?)\b(?:\{[^{}]*\})?", "", s)
    s = re.sub(r"\\(?:vs|ie|eg)\b", lambda m: {"vs": "vs", "ie": "i.e.", "eg": "e.g."}[m.group(0)[1:]], s)
    s = re.sub(r"\\addcontentsline\{[^{}]*\}\{[^{}]*\}\{(?:[^{}]|\{[^{}]*\})*\}", "", s)
    s = re.sub(r"\\hrule\b[^\\\n]*(?:\\[a-zA-Z]+[^\\\n]*)*", "", s)
    s = re.sub(r"\\rule\{[^{}]*\}\{[^{}]*\}", "", s)
    s = re.sub(r"\\(?:Large|large|LARGE|Huge|huge|normalsize|small|footnotesize|scriptsize"
               r"|sffamily|slshape|bfseries|itshape|ttfamily|rmfamily|upshape|mdseries"
               r"|thispagestyle|pagestyle|fancypagestyle|setcounter|addtocounter"
               r"|frontmatter|mainmatter|backmatter|tableofcontents|printindex"
               r"|printbibliography|cleardoublepage|makeindex|listoffigures)\b"
               r"(?:\{[^{}]*\})*", "", s)
    s = re.sub(r"\\color\{[^{}]*\}", "", s)
    s = re.sub(r"\\(?:em|it|sl|sc|rm|sf)\b", "", s)
    s = s.replace("\\ ", " ").replace("\\,", " ").replace("\\;", " ")
    s = s.replace("~", " ")
    return s


def link_refs(s, self_slug):
    """\\ref/\\eqref/\\pageref -> [[wiki link]] into the file that owns the label."""
    def repl(m):
        lbl = m.group(2)
        home = label_home.get(lbl)
        shown = label_text.get(lbl, lbl)
        if home is None:
            return f"`{lbl}`"
        if home == self_slug:
            return f"[{shown}](#{anchor(lbl)})"
        return f"[[{home}|{shown}]]"
    return re.sub(r"\\(ref|eqref|pageref|autoref|nameref)\{([^}]*)\}", repl, s)


def cites(s):
    return re.sub(r"\\(?:cite|citep|citet|textcite|parencite)\*?(?:\[[^\]]*\])?\{([^}]*)\}",
                  lambda m: "[" + ", ".join(k.strip() for k in m.group(1).split(",")) + "]", s)


def anchor(label):
    return re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")


VERBATIM_ENVS = ("lstlisting", "verbatim", "Verbatim", "code")
MATH_ENVS = ("equation", "equation*", "align", "align*", "eqnarray", "eqnarray*",
             "multline", "multline*", "gather", "gather*", "displaymath")
KEEP_ENVS = ("tikzpicture", "axis", "semilogyaxis", "loglogaxis", "tabular", "longtable",
             "array", "algorithm", "algorithmic", "pgfpicture")


def convert(stem, slug, text):
    out, i, n = [], 0, len(text)
    lines = text.split("\n")
    body = []
    idx = 0
    while idx < len(lines):
        line = lines[idx]
        m = re.match(r"\s*\\begin\{([A-Za-z*]+)\}", line)
        if m and m.group(1) in VERBATIM_ENVS + MATH_ENVS + KEEP_ENVS + ("figure", "table", "center", "minipage"):
            env = m.group(1)
            start = idx
            # the opening line may also close the environment (single-line \begin..\end)
            depth = 1 - len(re.findall(r"\\end\{" + re.escape(env) + r"\}", line))
            block = [line]
            idx += 1
            while idx < len(lines) and depth > 0:
                l2 = lines[idx]
                depth += len(re.findall(r"\\begin\{" + re.escape(env) + r"\}", l2))
                depth -= len(re.findall(r"\\end\{" + re.escape(env) + r"\}", l2))
                block.append(l2)
                idx += 1
            if depth > 0:
                # unbalanced source: do not swallow the rest of the file
                idx = start + 1
                body.append(("text", line))
                continue
            body.append(render_env(env, block, slug))
            continue
        body.append(("text", line))
        idx += 1
    return assemble(body, slug)


def render_env(env, block, slug):
    inner = "\n".join(block[1:-1]) if len(block) > 2 else ""
    if env in VERBATIM_ENVS:
        lang = "python"
        if re.search(r"language\s*=\s*\{?(Matlab|Java|C\+\+|XML)", block[0], re.I):
            lang = ""
        return ("raw", f"```{lang}\n{inner.rstrip()}\n```")
    if env in MATH_ENVS:
        return ("raw", "$$\n" + "\n".join(block) + "\n$$")
    if env in ("figure", "table"):
        return ("figure", block)
    if env in ("center", "minipage"):
        return ("group", block)
    return ("raw", "```latex\n" + "\n".join(block) + "\n```")


def flatten_figure(block, slug):
    """Keep every piece of a float: caption as prose, graphic as a note, body verbatim."""
    txt = "\n".join(block)
    caps = re.findall(r"\\caption\{", txt)
    out = []
    cap = extract_braced(txt, r"\\caption\{")
    lab = re.search(r"\\label\{([^}]*)\}", txt)
    gfx = re.findall(r"\\includegraphics(?:\[[^\]]*\])?\{([^}]*)\}", txt)
    kind = "Table" if block[0].lstrip().startswith("\\begin{table}") else "Figure"
    head = f"**{kind}"
    if lab:
        head += f"** <a id=\"{anchor(lab.group(1))}\"></a> `{lab.group(1)}`"
    else:
        head += "**"
    out.append(head)
    if gfx:
        out.append(f"*Graphic (not in the LaTeX source, referenced by name): "
                   + ", ".join(f"`{g}`" for g in gfx) + "*")
    if cap:
        out.append("*Caption:* " + cites(link_refs(clean_inline(cap), slug)))
    # body verbatim so tikz / pgfplots / tabular data survive intact
    out.append("```latex\n" + txt.rstrip() + "\n```")
    return "\n\n".join(out)


def extract_braced(s, startpat):
    m = re.search(startpat, s)
    if not m:
        return None
    i = m.end()
    depth, buf = 1, []
    while i < len(s) and depth:
        c = s[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                break
        buf.append(c)
        i += 1
    return "".join(buf)


def assemble(body, slug):
    md = []
    text_buf = []

    def flush():
        if not text_buf:
            return
        chunk = "\n".join(text_buf)
        text_buf.clear()
        md.append(render_text(chunk, slug))

    for kind, payload in body:
        if kind == "text":
            text_buf.append(payload)
        elif kind == "raw":
            flush()
            md.append(payload)
        elif kind == "figure":
            flush()
            md.append(flatten_figure(payload, slug))
        elif kind == "group":
            flush()
            inner = "\n".join(payload[1:-1])
            md.append(convert(None, slug, inner))
    flush()
    return "\n\n".join(x for x in md if x.strip())


LISTMAP = {"itemize": "-", "enumerate": "1.", "description": "-"}


def render_text(chunk, slug):
    out = []
    for line in chunk.split("\n"):
        s = line

        # full-line comments preserved, not dropped
        if re.match(r"^\s*%", s):
            c = s.strip().lstrip("%").strip()
            out.append(f"<!-- {c} -->" if c else "")
            continue
        s = re.sub(r"(?<!\\)%.*$", "", s)

        h = re.search(r"\\(chapter|section|subsection|subsubsection|paragraph)\*?"
                     r"(?:\[[^\]]*\])?\{", s)
        if h:
            level = {"chapter": 1, "section": 2, "subsection": 3,
                     "subsubsection": 4, "paragraph": 5}[h.group(1)]
            title = extract_braced(s, r"\\" + h.group(1) + r"\*?(?:\[[^\]]*\])?\{") or ""
            lab = re.search(r"\\label\{([^}]*)\}", s)
            hd = "#" * level + " " + clean_inline(title).strip().strip("{} ").strip()
            if lab:
                hd += f' <a id="{anchor(lab.group(1))}"></a>'
            out.append("")
            out.append(hd)
            out.append("")
            continue

        m = re.match(r"^\s*\\begin\{(itemize|enumerate|description)\}", s)
        if m:
            out.append("")
            continue
        if re.match(r"^\s*\\end\{(itemize|enumerate|description)\}", s):
            out.append("")
            continue
        s = re.sub(r"^\s*\\item\s*\[([^\]]*)\]\s*", lambda m: f"- **{clean_inline(m.group(1))}** ", s)
        s = re.sub(r"^\s*\\item\s*", "- ", s)

        s = re.sub(r"\\begin\{exmp\}(?:\[([^\]]*)\])?",
                   lambda m: f"**Example — {m.group(1)}**" if m.group(1) else "**Example**", s)
        s = re.sub(r"\\begin\{solution\}", "**Solution**", s)
        s = re.sub(r"\\begin\{(chapquote|mdframed|quote|quotation)\}", "> ", s)
        s = re.sub(r"\\end\{(exmp|solution|chapquote|mdframed|quote|quotation)\}", "", s)
        s = re.sub(r"\\label\{([^}]*)\}", lambda m: f'<a id="{anchor(m.group(1))}"></a>', s)
        s = cites(link_refs(clean_inline(s), slug))
        s = re.sub(r"\\\\\s*$", "  ", s)
        out.append(s)
    txt = "\n".join(out)
    txt = re.sub(r"\n{3,}", "\n\n", txt)
    return txt.strip()


def main():
    REF.mkdir(parents=True, exist_ok=True)
    raw = {}
    for stem, slug, title, group in FILES:
        p = SRC / f"{stem}.tex"
        if not p.exists():
            print("MISSING", p); continue
        raw[slug] = p.read_text(encoding="utf-8", errors="replace").replace("\r\n", "\n").replace("\r", "\n")
        scan_labels(stem, slug, raw[slug])

    stats = []
    for stem, slug, title, group in FILES:
        if slug not in raw:
            continue
        md = convert(stem, slug, raw[slug])
        header = [f"# {title}", ""]
        header.append(f"*Source: `{stem}.tex` — Herbert M. Sauro, "
                      f"“Systems Biology: An Introduction to Pathway Modeling”, "
                      f"First Python Edition v1.22. Converted verbatim; nothing removed.*")
        header.append("")
        header.append(f"Back to the wiki index: [[index]] · [[SKILL]]")
        header.append("")
        header.append("---")
        header.append("")
        # index entries are part of the book: keep them rather than dropping them
        terms = set()
        for raw_term in re.findall(r"\\index\{((?:[^{}]|\{[^{}]*\})*)\}", raw[slug]):
            t = clean_inline(raw_term).replace("!", " > ").replace("@", " ").strip()
            t = re.sub(r"\s+", " ", t)
            if t:
                terms.add(t)
        tail = ""
        if terms:
            tail = ("\n\n---\n\n## Index terms recorded in this chapter\n\n"
                    + "\n".join(f"- {t}" for t in sorted(terms, key=str.lower)) + "\n")
        (REF / f"{slug}.md").write_text("\n".join(header) + md + tail + "\n", encoding="utf-8")
        stats.append((slug, title, group, len(md.split("\n"))))

    (OUT / "_labels.json").write_text(json.dumps(label_home, indent=1))
    print(json.dumps(stats, indent=1))


main()
