# Installation, Environment and Housekeeping

## Install

```bash
pip install tellurium
```
`[T:quickstart]`, `[T:installation]`

"Tellurium can be used with variety of Python front-ends, for example Spyder,
PyCharm, Visual Studio Code, Jupyter Notebooks and Jupyter Lab." For Windows the
docs recommend the Windows Installer, which brings Spyder plus one-click Jupyter
Notebook / Lab access; for Mac, Linux and Windows the pip install works
`[T:installation]`.

Python versions: "As of March 2021, we currently support Python 3.7, 3.8 and 3.9
for Windows, Mac and Linux." New versions no longer support Python 2.7; users
needing 2.7 must install previous versions of Tellurium `[T:installation]`.

Anaconda: install Anaconda, then `conda install python`, then
`pip install tellurium` — mixing conda and pip packages, which the FAQ says has
not caused issues recently. A separate conda environment is suggested `[L:faq]`.

## Front ends

| Front end | Notes |
|---|---|
| Tellurium notebook viewer (nteract-based) | SBML and OMEX cells, Import/Export menus, ctrl+F / ctrl+shift+R find & replace with `/\bword\b` for whole words `[T:walkthrough]` |
| Tellurium Spyder IDE | Windows; Mac support is legacy only, no new binaries from 1.3.5 onward `[T:walkthrough]`, `[L:faq]` |
| Jupyter Notebook / JupyterLab | including Colab, NanoHub, binder `[T:installation]` |

## What Tellurium actually is

"Tellurium is a collection of Python packages developed inside and outside our
group, including simulators, libraries for reading and writing standards like
SBML and SED-ML, and various utilities. Tellurium itself is a Python module that
provides integration between these various subpackages." `[T:appendix]`

Constituent packages `[T:appendix]`:

| Package | Role |
|---|---|
| `tellurium` | the integrating module |
| `libroadrunner` | SBML ODE / stochastic simulator |
| `antimony` | human-readable representation of SBML |
| `phrasedml` | human-readable representation of SED-ML |
| `libcombine` | reading/writing COMBINE archives |
| `sbml2matlab` | SBML → MATLAB ODE simulations |
| `simplesbml` | creating SBML without the complexity of libSBML |
| `libsbml` | reading/writing SBML |
| `libsedml` | reading/writing SED-ML |

Licence: the Tellurium source code is under Apache License 2.0; third-party
dependencies may differ `[T:appendix]`. Funded by NIH/NIGMS grant GM081070
`[T:appendix]`; the documentation index also notes support by NIGMS R01-GM123032
`[T:index]`.

Underlying numerics acknowledged by the project: CVODE, NLEQ, AUTO2000, LAPACK,
LLVM, POCO, numpy `[T:appendix]`.

## Versions

```python
te.__version__
te.getTelluriumVersion()
te.printVersionInfo()      # tellurium + constituent packages
te.getVersionInfo()        # list of (package, version) tuples
```
`[T:tellurium_methods]`

`printVersionInfo()` output includes tellurium, roadrunner, antimony, libsbml,
libsedml, phrasedml (and, in the newer transcript, rrplugins)
`[T:tellurium_methods]`, `[T:antimony]`. **The two pages show different versions —
see `limits_and_discrepancies.md`. Print the version rather than assuming it.**

RoadRunner-side: `r.getExtendedVersionInfo()`, `roadrunner.__version__`, and
`roadrunner.getVersionStr(...)` with `VERSIONSTR_BASIC | VERSIONSTR_COMPILER |
VERSIONSTR_DATE | VERSIONSTR_LIBSBML` flags `[L:rr/utility_functions]`.

## Notices

"Roadrunner will often issue warning or informational messages. For repeated
simulation such messages will clutter up the outputs. `noticesOff` and
`noticesOn` can be used to turn on and off the messages." `[T:tellurium_methods]`

```python
te.noticesOff()
for i in range(0, 20):
    result = r.simulate(0, 10)
    r.reset()
    r.plot(result, show=False)
    r.k1 = r.k1 + 0.2
te.noticesOn()
```
`[T:tellurium_methods]`

Turn them back on. Silencing warnings for a whole session hides real problems.

## Installing extra packages from inside Tellurium

"Tellurium provides utility methods for installing Python packages from PyPI.
These methods simply delegate to `pip`, and are usually more reliable than
running `!pip install xyz`." `[T:tellurium_methods]`

```python
te.installPackage('cobra')
te.upgradePackage('cobra')
te.uninstallPackage('cobra')
te.searchPackage(...)
```
`[T:tellurium_methods]`

Constraint-based modelling: "Tellurium does not have built-in support for
constraint-based modeling per se. However, cobrapy is a Python package which does
support constraint-based modeling. It can be installed in Tellurium by running
`te.installPackage('cobra')`. […] The windows version of Tellurium comes bundled
with cobrapy already." `[L:faq]`

## Running an external tool

```python
returnString = te.runTool(['myplugin', 'arg1', 'arg2'])
```
"Call an external application called `toolFileName`. Note that `.exe` extension
may be omitted for windows applications. […] If the external tool writes to
stdout, this will be captured and returned." `[T:tellurium_methods]`

## Environment predicates

`te.inIPython()` — "Checks if tellurium is used in IPython" `[T:API]`.

## Known environment problems (from the FAQ) `[L:faq]`

| Symptom | Answer |
|---|---|
| `import libsbml` / `libsedml` / `libcombine` fails | they are packaged as `tesbml`, `tesedml`, `tecombine` to avoid conflicting with the official packages |
| "The Tellurium Python kernel failed to start … installation may be corrupt" | wipe/move the app data directory: Windows `C:\Users\<username>\AppData\Roaming\Tellurium`, Mac `~/Library/Application Support/Tellurium`, Linux `~/.config/Tellurium` |
| Spyder segfaults on Anaconda | `conda install pyopengl`, then relaunch |
| `AttributeError: dlsym: symbol not found` on import (Mac) | a manually installed libRoadRunner is on `DYLD_LIBRARY_PATH`; check `echo $DYLD_LIBRARY_PATH` |
| Mac "unidentified developer" | documented Gatekeeper workaround |
| Does installation change my Python? | notebook and IDE front ends install a private Python environment; the pip packages install into site-packages like any pip package |
| Textbook examples no longer run | there have been API changes since publication of *Systems Biology: Introduction to Pathway Modeling*; install an older Tellurium (e.g. 1.2) or use an updated edition |

## Where to ask

`tellurium-discuss` Google group for questions; GitHub issues for bugs and
feature requests `[T:appendix]`, `[T:walkthrough]`.

## Rules

1. Print the version before asserting that any API exists in the user's install.
2. Prefer `te.installPackage` to `!pip install` inside Tellurium front ends.
3. Re-enable notices after a quiet loop.
4. If an import of `libsbml`/`libsedml`/`libcombine` fails, try the `te*` names
   before concluding the install is broken.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/index.html
- https://tellurium.readthedocs.io/en/latest/installation.html
- https://tellurium.readthedocs.io/en/latest/quickstart.html
- https://tellurium.readthedocs.io/en/latest/walkthrough.html
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/API.html
- https://tellurium.readthedocs.io/en/latest/appendix.html
- https://tellurium.readthedocs.io/en/latest/antimony.html

### Tellurium-linked external sources
- https://github.com/sys-bio/tellurium/wiki/FAQ
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "FAQ")
- https://libroadrunner.readthedocs.io/en/latest/utility_functions.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
