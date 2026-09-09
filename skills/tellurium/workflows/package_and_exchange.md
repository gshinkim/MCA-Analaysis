# Workflow — Package a model and its simulation for exchange

Use for "make this reproducible", "export to SBML", "build a COMBINE archive",
"run this SED-ML".

Reference: `format_conversion.md`, `sedml_and_omex.md`.

## PHASE 1 — Decide what has to travel

| What must be reproducible | Format |
|---|---|
| the model only | SBML (`exportToSBML`) |
| the model, human-readable | Antimony (`exportToAntimony`) |
| the model **and** the simulation experiment | SED-ML + SBML inside a COMBINE archive (`.omex`) |
| a one-off Python analysis | a Python script — SED-ML is not designed to replace scripting `[T:notebooks]` |

"SED-ML files are not very useful in isolation. Since SED-ML always references
external SBML and CellML files, software which supports exchanging SED-ML files
should use COMBINE archives." `[T:notebooks]`

## PHASE 2 — Decide current state vs loaded state

```python
r.exportToSBML(path)                 # current=True by default: CURRENT state
r.exportToSBML(path, current=False)  # the model as loaded
```
`[T:tellurium_methods]`

After a simulation, especially one that crossed an event, the current state is
**not** the loaded state `[T:antimony]`. Choose deliberately, and say which one
the artefact contains.

Verify before shipping:
```python
print(r.getCurrentAntimony())     # or diff against r.getAntimony()
```

## PHASE 3a — Inline OMEX (the short path)

```python
import tellurium as te, tempfile, os

antimony_str = '''
model myModel
  S1 -> S2; k1*S1
  S1 = 10; S2 = 0
  k1 = 1
end
'''

phrasedml_str = '''
  model1 = model "myModel"
  sim1 = simulate uniform(0, 5, 100)
  task1 = run sim1 on model1
  plot "Figure 1" time vs S1, S2
'''

inline_omex = '\n'.join([antimony_str, phrasedml_str])
te.executeInlineOmex(inline_omex)                       # run it
workingDir = tempfile.mkdtemp(suffix="_omex")
te.exportInlineOmex(inline_omex, os.path.join(workingDir, 'archive.omex'))
```
`[T:notebooks]`

The model name in the Antimony (`model myModel`) must match the name the
phraSED-ML references (`model "myModel"`).

Round-trip check:
```python
te.convertAndExecuteCombineArchive(archive_name)   # read back and run
inline = te.convertCombineArchive(archive_name)    # archive -> inline OMEX text
```
`[T:notebooks]`

## PHASE 3b — Explicit SED-ML (when you need the XML)

```python
import phrasedml
sbml_str = te.antimonyToSBML(antimony_str)
phrasedml.setReferencedSBML("myModel", sbml_str)      # REQUIRED
sedml_str = phrasedml.convertString(phrasedml_str)
if sedml_str is None:
    print(phrasedml.getLastPhrasedError())
```
`[T:notebooks]`

Then write the SBML into the working directory under the name the SED-ML's
`model source` attribute uses, and:

```python
te.executeSEDML(sedml_str, workingDir=workingDir)
```
`[T:notebooks]`

Validate with libSEDML before shipping `[T:notebooks]`:
```python
try:
    import libsedml
except ImportError:
    import tesedml as libsedml
doc = libsedml.readSedML(sedml_file)
n = doc.getErrorLog().getNumFailsWithSeverity(libsedml.LIBSEDML_SEV_ERROR)
if n: print(doc.getErrorLog().toString())
```

## PHASE 3c — Assemble an archive from existing files

```python
te.createCombineArchive(archive_path, file_names, entry_locations,
                        file_formats, master_attributes, description=None)
te.addFilesToCombineArchive(archive_path, file_names, entry_locations,
                            file_formats, master_attributes, out_archive_path)
te.extractFileFromCombineArchive(archive_path, entry_location)
```
`[T:API]` — `file_format` "can use `libcombine.KnownFormats.lookupFormat` for
common formats"; the `add*` calls write a **new** archive rather than editing in
place `[T:API]`.

## PHASE 4 — Make the experiment deterministic where it can be

- stochastic simulations: `timecourse1.algorithm.seed = 1003` in the phraSED-ML
  `[T:notebooks]`;
- repeated tasks: decide `reset=true` or not, and say which — without it the
  model state **and the time value** carry over `[T:notebooks]`;
- record the versions the archive was produced with (`te.printVersionInfo()`).

## PHASE 5 — Verify the artefact, then report

1. Re-open and re-run what you produced
   (`convertAndExecuteCombineArchive`, or reload the SBML and simulate).
2. Compare against the original run.
3. Report: what is inside the archive, which entry is `master`, whether it holds
   the current or the loaded model state, the seeds, and the versions used.

## Non-negotiables

1. Never ship SED-ML without the model it references.
2. Never skip `setReferencedSBML` when a model is referenced by name.
3. Never treat a `None` from `convertString` as success — print the error.
4. Always say whether an exported model is the current or the loaded state.
5. Always re-open and re-run before calling an archive done.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/notebooks.html
- https://tellurium.readthedocs.io/en/latest/API.html
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/antimony.html
