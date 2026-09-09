# Limits of the Source Set, and Documentation Discrepancies

Load this before making any claim you are not sure the documentation supports.

---

## Part 1 — What Tellurium/RoadRunner does NOT support

| Capability | Status | Source |
|---|---|---|
| Algebraic rules | "not all simulators will support algebraic rules (roadrunner, for example, does not)"; Antimony can still translate them to/from SBML | `[T:antimony]` |
| Algebraic rules, delay differential equations | excluded from RoadRunner's SBML support (Level 2 to 3) | `[L:rr/index]` |
| Flux balance (`fbc`) models | creatable and manipulable in Antimony, **not simulatable** with roadrunner; pysces recommended | `[L:faq]` |
| `layout` / `render` packages | do not affect simulations; not directly manipulable with Antimony (libAntimony does import/export them at file level via SBMLNetwork) | `[L:faq]`, `[T:antimony]` |
| SBML packages other than `comp`, `distrib`, `fbc`, `layout`, `render` | "currently not supported" | `[L:faq]` |
| Constraint-based modelling | no built-in support; use cobrapy via `te.installPackage('cobra')` | `[L:faq]` |
| `r.draw()` on large networks | "Currently only the drawing of medium-size networks is supported" | `[T:tellurium_methods]` |
| `r.draw()` in the Tellurium notebook app | pygraphviz limitation — Jupyter notebook only | `[T:notebooks]` |
| Eigenvalue calls on models with rate rules / species rules / time-varying stoichiometry | `getFullEigenValues` and `getReducedEigenValues` are documented as "only valid for pure reaction kinetics models" | `[L:rr/cls_RoadRunner]` |
| `getReducedEigenValues` without moiety conversion | "only valid if moiety conversion is enabled" | `[L:rr/cls_RoadRunner]` |
| `SteadyStateScan` methods other than `plotArray()` | "Right now, the only working method is `plotArray()`" | `[T:paramscan]` |
| Antimony reaction rate vs irreversibility check | with `=>`, "that rate is not checked to ensure that it is compatible with an irreversible reaction" | `[T:antimony]` |
| Antimony interaction sign check | "libAntimony does not check to ensure this is true; the modeler must check manually" | `[T:antimony]` |
| Antimony duplicate-definition warning | deliberately not emitted; the last definition silently wins | `[T:antimony]` |
| Local parameters surviving a round trip | SBML local parameters become global in Antimony and "do not get converted back to local parameters" | `[T:antimony]` |
| Assignment rules on stoichiometries | generated automatically when one stoichiometry id is reused; "some simulators may balk" | `[T:antimony]` |
| Notebook cells with `%%crn` / `%%omex` in plain Jupyter | need the `temagics` package | `[T:walkthrough]` |
| SED-ML expressiveness | "a limited vocabulary of simulation types (timecourse and steady state)"; "not designed to replace scripting" | `[T:notebooks]` |

---

## Part 2 — Capabilities the permitted source graph does NOT establish

State these as gaps; do not fill them from memory.

1. **phraSED-ML grammar.** The repository Tellurium links (github.com/sys-bio/phrasedml)
   carries no retrievable README or specification, and the SED-ML L1V2 PDF was
   not used. Only the constructs demonstrated in Tellurium's own examples
   (`sedml_and_omex.md`) are established.
2. **KiSAO term ids.** Tellurium links `co.mbine.org/standards/kisao`, which
   returned HTTP 404 when the source graph was crawled. Individual KiSAO ids are
   not established, beyond the `KISAO:0000019` that appears inside a generated
   SED-ML sample on `notebooks.html` `[T:notebooks]`.
3. **MCA theorems.** The permitted sources define elasticities, control
   coefficients and response coefficients and give the calls that return them
   `[L:rr/metabolic]`. They do **not** state the summation theorem, the
   connectivity theorems, or bounds on coefficient magnitudes. Validating
   coefficients against those theorems needs a different source (this repository
   carries a separate `mca` Skill for the theory).
4. **rrplugins / AUTO2000 property list beyond the demonstrated ones.** The full
   list lives in the rrplugins documentation, which is linked from libRoadRunner,
   not from Tellurium `[L:rr/bifurcation]`.
5. **`r.reset(SelectionRecord.*)` argument set.** The variant is mentioned
   `[T:notebooks]` but its selection arguments are not enumerated anywhere in the
   permitted sources.
6. **Sensitivity analysis beyond parameter sweeps and MCA.** libRoadRunner has a
   `sensitivities` section in its own navigation, but no Tellurium page links to
   it and it was not consulted.
7. **Parallel / RoadRunnerMap execution.** Same situation as (6).
8. **Complete list of `getSettings()` keys per solver.** Discover them at runtime
   with `r.getIntegrator().getSettings()` and `getDescription()`
   `[L:rr/stochastic]` rather than asserting a list.
9. **`te.executeSEDML` signature.** It appears only in worked example code
   (`te.executeSEDML(sedml_str, workingDir=workingDir)`) `[T:notebooks]`, not in
   any autodoc block. Treat the two arguments shown as established and nothing
   more.
10. **Units semantics.** Antimony units are annotation only and Antimony "does
    not calculate any derived units" `[T:antimony]`. Nothing in the permitted
    sources validates unit consistency.

Wording to use:

> The Tellurium documentation and the sources it links do not establish this.

---

## Part 3 — Documentation discrepancies

### Discrepancy 1 — package versions differ between pages

**Source A** — `tellurium_methods.html`, `printVersionInfo()` transcript:
tellurium 2.1.0, roadrunner 1.5.1, antimony 2.9.4, libsbml 5.15.0,
libsedml 0.4.3, phrasedml 1.0.9 `[T:tellurium_methods]`.

**Source B** — `antimony.html`, `printVersionInfo()` transcript:
tellurium 2.2.10, roadrunner 2.7.0, antimony 2.14.0, rrplugins 2.7.0,
libsbml 5.20.2, libsedml 2.0.32, phrasedml 1.3.0 `[T:antimony]`.

**Difference:** the same documentation set contains executed notebooks from at
least two different Tellurium releases.

**Resolution:** neither transcript is a version requirement — both are captured
output. Use `te.printVersionInfo()` in the user's environment. Where a feature's
availability might be version-dependent, say so.

### Discrepancy 2 — the integrator list

**Source A** — `notebooks.html`: "RoadRunner supports `'cvode'`, `'gillespie'`,
and `'rk4'` for the integrator name" `[T:notebooks]`.

**Source B** — libRoadRunner Integrator class: "Currently, libRoadRunner supports
cvode, gillespie, rk4 and rk45 solvers" — and documents an `epsilon` setting
specific to `rk45` `[L:rr/cls_Integrator]`.

**Difference:** `rk45` appears in one and not the other.

**Resolution:** most likely a version difference (see Discrepancy 1); Tellurium's
own page is older. Do not assert `rk45` unconditionally. Call
`r.getAvailableIntegrators()` `[L:rr/cls_RoadRunner]`.

### Discrepancy 3 — the package-removal function name

**Source A** — `tellurium_methods.html` autodoc lists
`tellurium.uninstallPackage` `[T:tellurium_methods]`.

**Source B** — the example on the same page comments out
`# te.removePackage('cobra')` `[T:tellurium_methods]`.

**Difference:** two different names for the same intent, on one page.

**Resolution:** the autodoc block is generated from the code, so
`uninstallPackage` is the documented function; `removePackage` appears only in a
commented-out line. Prefer `uninstallPackage`.

### Discrepancy 4 — `variable_step_size` default

**Source A** — the printed cvode settings block shows `variable_step_size: false`
`[T:notebooks]`; libRoadRunner's cvode entry gives "Default value is false"
`[L:rr/cls_Integrator]`.

**Source B** — the gillespie entry in the same class reference gives "Default
value is true" `[L:rr/cls_Integrator]`.

**Difference:** the default is per-integrator, not global.

**Resolution:** not a contradiction — record it as integrator-specific and set it
explicitly whenever the grid matters (ensemble averaging, array stacking).

### Discrepancy 5 — `getEE` parameter names

The signature is `getEE(reactionId, parameterId, steadyState=True)` while the
parameter list below it documents `variable (str) – A reaction Id` and
`parameter (str) – The independent parameter` `[L:rr/cls_RoadRunner]`.

**Resolution:** the two describe the same two positional arguments under
different names. Use positional arguments; do not rely on those keyword names.

### Discrepancy 6 — layout/render manipulability

`antimony.html` describes libAntimony import/export of the SBML `layout` and
`render` packages via SBMLNetwork `[T:antimony]`; the FAQ says they "cannot be
manipulated directly with Antimony" `[L:faq]`.

**Resolution:** different scopes — file-level round-tripping (antimony.html) vs
direct manipulation of layout objects from Antimony syntax (FAQ). Preserve both
statements rather than merging them.

### Discrepancy 7 — dead links inside the permitted graph

Observed on 2026-08-26 while crawling:

| Link | Linked from | Result |
|---|---|---|
| `http://sys-bio.github.io/roadrunner/python_docs/index.html` | `quickstart.html`, `notebooks.html`, `walkthrough.html`, `tellurium_methods.html` | HTTP 404 |
| `http://sys-bio.github.io/roadrunner/python_docs/using_roadrunner.html` | `quickstart.html`, `walkthrough.html` | HTTP 404 |
| `https://libroadrunner.readthedocs.io/en/latest/api_reference.html` | `tellurium_methods.html` ("Model Reset") | HTTP 404 |
| `http://co.mbine.org/standards/kisao` | `notebooks.html` | HTTP 404 |

**Resolution:** Tellurium's index also links the live libRoadRunner
documentation at `https://libroadrunner.readthedocs.io/en/latest/`, whose Python
API reference is at `/en/latest/PythonAPIReference/api_reference.html`. That is
what this Skill used. If a user follows an old link from the Tellurium docs and
gets a 404, point them there.

---

## Rules

1. If a claim is not in a reference file of this Skill, do not assert it — say
   the documentation does not establish it and offer to check at runtime
   (`getAvailableIntegrators`, `getSettings`, `getIds`, `printVersionInfo`).
2. When two permitted sources disagree, present both with their pages and prefer
   the runtime check over either.
3. Never merge two incompatible APIs into one plausible-looking call.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/notebooks.html
- https://tellurium.readthedocs.io/en/latest/antimony.html
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/paramscan.html
- https://tellurium.readthedocs.io/en/latest/walkthrough.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/ , /metabolic.html , /bifurcation.html , /stochastic.html , /PythonAPIReference/cls_RoadRunner.html , /PythonAPIReference/cls_Integrator.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
- https://github.com/sys-bio/tellurium/wiki/FAQ
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "FAQ")
