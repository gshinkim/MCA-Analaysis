# Allowed Source Registry

Every technical claim in this Skill must trace to an entry in this registry.
Crawl performed 2026-08-26.

## Provenance tag convention used throughout the Skill

| Tag | Meaning |
|---|---|
| `[T:<page>]` | Stated on an official Tellurium documentation page `https://tellurium.readthedocs.io/en/latest/<page>.html` |
| `[L:rr/<page>]` | Stated in the libRoadRunner documentation, which the Tellurium index toctree links to |
| `[L:faq]` | Stated in the Tellurium FAQ wiki, which the Tellurium index toctree links to |
| `[L:simplesbml]` | Stated in the SimpleSBML documentation, which the Tellurium index toctree links to |
| `[L:sedml]` | Stated on sed-ml.github.io, linked from `notebooks.html` and `walkthrough.html` |
| `[L:antimony-sf]` | Stated on antimony.sourceforge.net, linked from `antimony.html` |

A claim with no tag is not a technical claim about Tellurium (it is routing text
belonging to this Skill).

---

## Primary Source

https://tellurium.readthedocs.io/en/latest/index.html

---

## Tellurium Internal Documentation

The complete page set of the documentation tree (the `toctree` in `index.rst`
plus the generated index pages):

- https://tellurium.readthedocs.io/en/latest/index.html
- https://tellurium.readthedocs.io/en/latest/installation.html
- https://tellurium.readthedocs.io/en/latest/quickstart.html
- https://tellurium.readthedocs.io/en/latest/walkthrough.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html
- https://tellurium.readthedocs.io/en/latest/antimony.html
- https://tellurium.readthedocs.io/en/latest/paramscan.html
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/API.html
- https://tellurium.readthedocs.io/en/latest/appendix.html
- https://tellurium.readthedocs.io/en/latest/genindex.html (generated index, no content)
- https://tellurium.readthedocs.io/en/latest/py-modindex.html (generated index, no content)

`notebooks.html`, `quickstart.html`, `paramscan.html` and `tellurium_methods.html`
additionally embed executed Jupyter notebooks (`_notebooks/core/*.rst`, included
via the `.. include::` directive). Those notebook bodies are part of the
Tellurium documentation pages that include them and are cited by the including
page, e.g. `[T:notebooks]`.

---

## Tellurium-Linked External Sources

### Source
URL:
https://libroadrunner.readthedocs.io/en/latest/

Linked from:
https://tellurium.readthedocs.io/en/latest/index.html — as a `toctree` entry
titled "libRoadRunner Documents", and in the index body text
("To view the documentation on libRoadRunner, please go here").
Also linked from https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
("Model Reset" section) as
`https://libroadrunner.readthedocs.io/en/latest/api_reference.html#RoadRunner.RoadRunner.reset`.

Purpose:
Establishes the simulator API that Tellurium returns from `te.loada` and
friends: `simulate`, `steadyState`, selections, integrator and steady-state
solver settings, metabolic control analysis, stoichiometric/structural
analysis, Jacobian and eigenvalues, model editing, state save/load.

Scope note (direct-link boundary):
Tellurium places this documentation set inside its own navigation `toctree`.
This Skill therefore treats the pages of that documentation set, reached from
its own index, as the linked resource — not as a further external hop. Pages of
`libroadrunner.readthedocs.io` actually consulted:

- `/en/latest/` (index — feature list)
- `/en/latest/simulation_and_integration.html`
- `/en/latest/selecting_values.html`
- `/en/latest/steady_state.html`
- `/en/latest/stochastic.html`
- `/en/latest/metabolic.html`
- `/en/latest/stability.html`
- `/en/latest/stoichiometric.html`
- `/en/latest/bifurcation.html`
- `/en/latest/accessing_model.html`
- `/en/latest/read_write_functions.html`
- `/en/latest/utility_functions.html`
- `/en/latest/PythonAPIReference/api_reference.html`
- `/en/latest/PythonAPIReference/cls_RoadRunner.html`
- `/en/latest/PythonAPIReference/cls_ExecutableModel.html`
- `/en/latest/PythonAPIReference/cls_Integrator.html`
- `/en/latest/PythonAPIReference/cls_SteadyStateSolver.html`
- `/en/latest/PythonAPIReference/cls_Config.html`

Also retrieved from the same documentation set but **not drawn on** (nothing in
the Skill cites them): `PythonAPIReference/cls_SelectionRecord.html`,
`cls_LoadSBMLOptions.html`, `cls_Misc.html`,
`cls_PyConservedMoietyConverter.html`, `cls_Solver.html`.

Sources reached only from *inside* libRoadRunner's own pages and NOT linked
from Tellurium (for example the rrplugins AUTO2000 site, the doxygen C API
site, sundials/LLVM project pages, and libRoadRunner's own `sensitivities/` and
`parallel/` sections) were **not** used as evidence.

### Source
URL:
https://github.com/sys-bio/tellurium/wiki/FAQ

Linked from:
https://tellurium.readthedocs.io/en/latest/index.html — `toctree` entry "FAQ".

Purpose:
Establishes which SBML packages Tellurium supports (comp, distrib, fbc, layout,
render), the `tesbml` / `tesedml` / `tecombine` import names, constraint-based
modelling support, and installation/environment answers.

### Source
URL:
https://simplesbml.readthedocs.io/en/latest/

Linked from:
https://tellurium.readthedocs.io/en/latest/index.html — `toctree` entry
"SimpleSBML Documents".
Also referenced from https://tellurium.readthedocs.io/en/latest/appendix.html
(as `http://sys-bio.github.io/simplesbml/`, "A utility for creating SBML models
without the complexity of libSBML").

Purpose:
Establishes the programmatic SBML-construction alternative to Antimony:
`simplesbml.SbmlModel`, `addCompartment`, `addSpecies`, `addParameter`,
`addReaction`, `addEvent`, `addRateRule`, `toSBML`, `writeCodeFromString`,
`loadSBMLStr`.

### Source
URL:
https://sed-ml.github.io/

Linked from:
https://tellurium.readthedocs.io/en/latest/notebooks.html ("SED-ML" section) and
https://tellurium.readthedocs.io/en/latest/walkthrough.html ("COMBINE Archive Cells").

Purpose:
Establishes what SED-ML is and its current specification level/version.

### Source
URL:
http://antimony.sourceforge.net/

Linked from:
https://tellurium.readthedocs.io/en/latest/antimony.html
("Importing and Exporting Antimony Models", "Further Reading").

Purpose:
Establishes that `QTAntimony` and the `sbtranslate` command-line translator are
distributed from this site; the Antimony language description itself is taken
from the Tellurium `antimony.html` page directly, not from here.

---

## Tellurium-Linked Sources Inspected But Not Used As Evidence

| Source | Linked from | Why not used |
|---|---|---|
| `https://github.com/sys-bio/phrasedml` | `appendix.html` | Repository page carries no README or grammar document that could be retrieved; phraSED-ML syntax in this Skill is taken only from the worked examples on Tellurium's own pages. |
| `http://co.mbine.org/documents/archive` | `notebooks.html` | Redirects to an identifiers.org registry entry; adds nothing beyond what `notebooks.html` already states about COMBINE archives. |
| `http://co.mbine.org/standards/kisao` | `notebooks.html` | Returned HTTP 404 on 2026-08-26. |
| `http://sys-bio.github.io/roadrunner/python_docs/index.html` and `.../using_roadrunner.html` | `quickstart.html`, `notebooks.html`, `walkthrough.html`, `tellurium_methods.html` | Returned HTTP 404 on 2026-08-26. Superseded by `libroadrunner.readthedocs.io`, which Tellurium also links. |
| `https://libroadrunner.readthedocs.io/en/latest/api_reference.html` | `tellurium_methods.html` | Returned HTTP 404 on 2026-08-26; the live equivalent is `/en/latest/PythonAPIReference/api_reference.html`, reached from the libRoadRunner index. |
| `http://antimony.sourceforge.net/antimony__api_8h.html` | `tellurium_methods.html` | libAntimony C API header; Tellurium users go through `te.*` wrappers, so nothing was needed from it. |
| `http://sbml.org/*`, `https://www.cellml.org/`, `https://www.neuroml.org/` | `antimony.html`, `walkthrough.html`, `appendix.html` | Referenced for format definitions only; all format behaviour asserted in this Skill is asserted by Tellurium or libRoadRunner. |
| `http://sed-ml.sourceforge.net/documents/sed-ml-L1V2.pdf` | `notebooks.html` | Specification PDF; the SED-ML constructs used in this Skill are the ones Tellurium's own examples demonstrate. |
| `https://www.ebi.ac.uk/biomodels-main/`, `https://github.com/fbergmann/libSEDML`, `https://github.com/sbmlteam/libCombine`, `https://github.com/sys-bio/roadrunner`, `https://github.com/sys-bio/antimony`, `https://github.com/opencobra/cobrapy`, `http://www.graphviz.org/`, `https://www.spyder-ide.org/`, `http://jupyter.org/`, `https://www.anaconda.com/`, matplotlib pages, Python tutorials, YouTube/mailing-list/textbook links | various | Ecosystem, tooling, install and learning links. Used only where the Tellurium page itself states the relevant fact (e.g. that a BioModels download URL can be handed to `te.loadSBMLModel`). |

---

## Sources deliberately NOT consulted

No search engine, Stack Overflow, Reddit, PyPI, blog, independent GitHub search,
or literature search was used. No page outside the graph above contributed
technical content.
