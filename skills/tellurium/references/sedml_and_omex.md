# SED-ML, phraSED-ML, COMBINE / inline OMEX

## What each format is for

- **SBML encodes models. SED-ML encodes simulations** — the solver (deterministic
  or stochastic), the type of simulation (timecourse or steady state), and
  parameters such as start/end time and ODE solver tolerances `[T:notebooks]`.
- SED-ML is "an XML-based format for encoding simulation setups, to ensure
  exchangeability and reproducibility of simulation experiments" `[L:sedml]`.
- **COMBINE archives** (`.omex`) "package related standards such as SBML models
  and SED-ML simulations together so that they can be easily exchanged between
  software tools" `[T:notebooks]`. Tellurium supports importing COMBINE archives
  containing SBML and SED-ML `[T:walkthrough]`.
- **"SED-ML files are not very useful in isolation. Since SED-ML always references
  external SBML and CellML files, software which supports exchanging SED-ML files
  should use COMBINE archives"** `[T:notebooks]`.

The four basic elements of a SED-ML document `[T:notebooks]`:

1. **Models** — reference external SBML/CellML files, or previously defined
   models in the same document (creating instances that may have different
   parameters);
2. **Simulations** — reference specific numerical solvers from the KiSAO ontology;
3. **Tasks** — apply a simulation to a model;
4. **Outputs** — plots or reports.

Scope statement worth repeating to users: "SED-ML has a limited vocabulary of
simulation types (timecourse and steady state) [and] is not designed to replace
scripting with Python or other general-purpose languages. Instead, SED-ML is
designed to provide a rudimentary way to reproduce the dynamics of a model across
different tools." `[T:notebooks]`

Tellurium's implementation strategy: "Tellurium's approach to handling SED-ML is
to first convert the SED-ML document to a Python script, which contains all the
Tellurium-specific function calls to run all tasks described in the SED-ML. For
authoring SED-ML, Tellurium uses PhraSEDML, a human-readable analog of SED-ML."
`[T:notebooks]`

## phraSED-ML constructs demonstrated in the Tellurium documentation

These are the constructs the permitted sources actually show. Do not invent
others (see "Limits" below).

```
model1  = model "myModel"                       # reference a model by name
model2  = model model1 with ps_0=1.3E-5, ps_a=0.013   # derived model with changes

sim1    = simulate uniform(0, 5, 100)           # deterministic timecourse
timecourse1 = simulate uniform_stochastic(0, 4000, 1000)
timecourse1.algorithm.seed = 1003               # RNG seed
stepper = simulate onestep(0.1)                 # single-step simulation

task1   = run sim1 on model1                    # apply a simulation to a model

# repeated tasks
task1 = repeat task0 for J0_v0 in [8, 4, 0.4], reset=true
task1 = repeat task0 for k1 in uniform(0.0, 5.0, 5), reset = true
repeatedtask_2 = repeat repeatedtask_1 for J4_KK5 in uniform(1, 40, 10), reset=true
task1 = repeat task0 for local.x in uniform(0, 10, 100), J0_v0 = piecewise(8, x<4, 0.1, 4<=x<6, 8)
task2 = repeat task0 for local.index in uniform(0, 10, 1000), \
        local.current = index -> abs(sin(1 / (0.1 * index + 0.1))), \
        model1.J0_v0 = current : current

# outputs
plot "Figure 1" time vs S1, S2
plot task1.time vs task1.S1, task1.S2
plot "Fig" task1.PX/max(task1.PX) vs task1.PZ/max(task1.PZ)     # post-processing
plot repeatedtask_2.J4_KK5 vs repeatedtask_2.J1_KK2
```
`[T:notebooks]`

3D plotting: "The syntax is `plot <x> vs <y> vs <z>`, where `<x>`, `<y>`, and
`<z>` are references to model state variables used in specific tasks."
`[T:notebooks]`

Repeated-task reset semantics: `reset=true` resets the model to its initial
conditions after each repeated simulation; without it the model retains its
current state between simulations, and **the time value is not reset**
`[T:notebooks]`.

Seeding: "It is possible to programmatically set the RNG seed of a stochastic
simulation in PhraSEDML using the `<simulation-name>.algorithm.seed = <value>`
directive. Simulations run with the same seed are identical. If the seed is not
specified, a different value is used each time" `[T:notebooks]`.

## Authoring SED-ML from phraSED-ML

```python
import tellurium as te
import phrasedml

sbml_str = te.antimonyToSBML(antimony_str)
phrasedml.setReferencedSBML("myModel", sbml_str)     # REQUIRED for external model refs
sedml_str = phrasedml.convertString(phrasedml_str)
if sedml_str is None:
    print(phrasedml.getLastPhrasedError())
```
`[T:notebooks]`

"**Whenever a PhraSEDML script references an external model, you should use
`phrasedml.setReferencedSBML` to ensure that the PhraSEDML script can be properly
converted into a SED-ML file.**" `[T:notebooks]`

`phrasedml.getLastError()` is also used in the documented examples
`[T:notebooks]`.

## Executing SED-ML

```python
te.executeSEDML(sedml_str, workingDir=workingDir)
```
`[T:notebooks]` — the working directory must contain the referenced SBML file
under the name used in the SED-ML `model source` attribute.

Reading SED-ML with libSEDML, and the import shim Tellurium needs
`[T:notebooks]`:

```python
try:
    import libsedml
except ImportError:
    import tesedml as libsedml
sedml_doc = libsedml.readSedML(sedml_file)
n_errors = sedml_doc.getErrorLog().getNumFailsWithSeverity(libsedml.LIBSEDML_SEV_ERROR)
if n_errors > 0:
    print(sedml_doc.getErrorLog().toString())
```
"For technical reasons, any software which uses libSEDML must provide a custom
build — Tellurium uses `tesedml`." `[T:notebooks]` The FAQ gives the same rule for
all three: the packages are available as **`tesbml`, `tesedml`, `tecombine`**, so
as not to conflict with the official packages `[L:faq]`.

Related helpers: `te.getLastReport()` ("Get the last report generated by SED-ML")
and `te.setLastReport(report)` ("Used by SED-ML to save the last report created
(for validation)") `[T:API]`.

## Inline OMEX

"Tellurium provides a way to easily edit the contents of COMBINE archives in a
human-readable format called inline OMEX. To create a COMBINE archive, simply
create a string containing all models (in Antimony format) and all simulations
(in PhraSEDML format). Tellurium will transparently convert the Antimony to SBML
and PhraSEDML to SED-ML, then execute the resulting SED-ML." `[T:notebooks]`

```python
inline_omex = '\n'.join([antimony_str, phrasedml_str])
te.executeInlineOmex(inline_omex)
te.exportInlineOmex(inline_omex, os.path.join(workingDir, 'archive.omex'))
te.convertAndExecuteCombineArchive(archive_name)
```
`[T:notebooks]`

That four-line block is the whole workflow: **build the string, run it, export
it, round-trip it.**

## The OMEX / COMBINE API

`[T:API]`, `[T:notebooks]`:

| Call | Purpose |
|---|---|
| `te.executeInlineOmex(inline_omex, comp=False)` | "Execute inline phrasedml and antimony." |
| `te.executeInlineOmexFromFile(filepath)` | same, from a file |
| `te.exportInlineOmex(inline_omex, export_location)` | write a COMBINE archive |
| `te.convertCombineArchive(location)` | archive → inline OMEX string |
| `te.convertAndExecuteCombineArchive(location)` | read and execute an archive |
| `te.extractFileFromCombineArchive(archive_path, entry_location)` | one entry, as a string |
| `te.createCombineArchive(archive_path, file_names, entry_locations, file_formats, master_attributes, description=None)` | build an archive from files |
| `te.addFileToCombineArchive(archive_path, file_name, entry_location, file_format, master, out_archive_path)` | add one file, writing a **new** archive |
| `te.addFilesToCombineArchive(archive_path, file_names, entry_locations, file_formats, master_attributes, out_archive_path)` | add several |
| `te.DumpJSONInfo()` | "Tellurium dist info. Goes into COMBINE archive." |

`file_format` "can use `libcombine.KnownFormats.lookupFormat` for common formats"
`[T:API]`. The `add*` calls "add a file to an existing COMBINE archive on disk
and save the result as a **new** archive" — they do not modify in place
`[T:API]`.

## Forcing functions

"A common task in modeling is to represent the influence of an external,
time-varying input on the system. In SED-ML, this can be accomplished using a
repeated task to run a simulation for a short amount of time and update the
forcing function between simulations." The documented pulse uses `onestep` +
`repeat` + `piecewise` `[T:notebooks]`:

```
stepper = simulate onestep(0.1)
task0 = run stepper on model1
task1 = repeat task0 for local.x in uniform(0, 10, 100), \
        J0_v0 = piecewise(8, x<4, 0.1, 4<=x<6, 8)
```
For an arbitrary function, the second documented form maps an index through an
expression: `local.current = index -> abs(sin(1 / (0.1 * index + 0.1)))`
`[T:notebooks]`.

The equivalent purely-Antimony approach (assignment rule + events) is in
`antimony_basics.md` under "Building signals" — use that when the experiment does
not need to be portable.

## Notebook cell types

The Tellurium notebook viewer offers dedicated SBML and COMBINE-archive (OMEX)
cells, importable from `Import -> Import SBML...` / `Import COMBINE archive
(OMEX)...`, editable inline, and re-exportable with the diskette icon
`[T:walkthrough]`. Notebooks containing those cells "cannot be properly read by
Jupyter"; `File -> Export to Jupyter...` produces a Jupyter-readable notebook
using `%%crn` and `%%omex` cell magics, which need the `temagics` package
installed alongside tellurium `[T:walkthrough]`, `[L:faq]`.

## Limits of what the sources establish

The permitted source graph contains **no phraSED-ML grammar document** — the
repository Tellurium links from its appendix carries no retrievable README or
specification, and the SED-ML L1V2 PDF was not used. Everything above is taken
from Tellurium's own worked examples. If asked for a construct not shown here,
say the documentation does not establish it rather than guessing.

## Rules

1. Call `phrasedml.setReferencedSBML` before `convertString` whenever a model is
   referenced by name.
2. Check `convertString`'s return for `None` and print
   `getLastPhrasedError()`/`getLastError()` — silent `None` is the normal failure
   mode.
3. Ship SED-ML inside a COMBINE archive, not on its own.
4. State whether a repeated task used `reset=true`; without it the model state
   and the time axis carry over.
5. Use `tesbml`/`tesedml`/`tecombine` in the import fallback, not the official
   package names alone.
6. Do not invent phraSED-ML syntax.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/notebooks.html
- https://tellurium.readthedocs.io/en/latest/API.html
- https://tellurium.readthedocs.io/en/latest/walkthrough.html

### Tellurium-linked external sources
- https://sed-ml.github.io/
  - Linked from: https://tellurium.readthedocs.io/en/latest/notebooks.html ("SED-ML" section) and https://tellurium.readthedocs.io/en/latest/walkthrough.html
- https://github.com/sys-bio/tellurium/wiki/FAQ
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "FAQ")
