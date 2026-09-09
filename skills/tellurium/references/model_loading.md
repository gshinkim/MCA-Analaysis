# Loading Models

Every loader returns a **RoadRunner simulator instance** — in Tellurium it is a
`tellurium.tellurium.ExtendedRoadRunner`, which is a RoadRunner object plus the
Tellurium-added methods (plotting, export, jarnac shortcuts) `[T:tellurium_methods]`.
Bind it to a variable (conventionally `r` or `rr`) and everything else in this
Skill is a method or property on that object.

```python
import tellurium as te
r = te.loada('S1 -> S2; k1*S1; k1 = 0.1; S1 = 10')
```
`[T:quickstart]`

## Loader table

| Input | Call | Notes |
|---|---|---|
| Antimony string or file | `te.loada(ant)` | shortcut for `loadAntimonyModel` `[T:tellurium_methods]` |
| Antimony string or file | `te.loadAntimonyModel(ant)` | `[T:tellurium_methods]` |
| SBML string or file | `te.loadSBMLModel(sbml)` | `[T:tellurium_methods]` |
| SBML string or file | `te.loads(ant)` | "Load SBML model with tellurium. See also: `loadSBMLModel()`" `[T:API]` |
| CellML string or file | `te.loadCellMLModel(cellml)` | `[T:tellurium_methods]` |
| Built-in test model | `te.loadTestModel('feedback.xml')` | `[T:tellurium_methods]` |
| Already-loaded model by name | `te.model(model_name)` | "Retrieve a model which has already been loaded" `[T:API]` |

All of the loader functions accept **either a model string or a file path**
`[T:tellurium_methods]`.

## Loading through RoadRunner directly

`te.loada` is a convenience layer. The documented lower-level path is to convert
to SBML first and construct a RoadRunner instance `[T:tellurium_methods]`:

```python
import roadrunner
sbml_model = te.antimonyToSBML(ant_model)
r = roadrunner.RoadRunner(sbml_model)
result = r.simulate(0, 10, 100)
```

`RoadRunner.load(uriOrDocument)` accepts a local path, a URI, or the contents of
an SBML document; HTTP URIs are documented as supported, with the note that the
feature was at the time limited to the Mac version `[L:rr/cls_RoadRunner]`.

## Loading a model from BioModels

Two documented routes:

```python
# 1. direct download URL handed to the SBML loader
r = te.loadSBMLModel("https://www.ebi.ac.uk/biomodels-main/download?mid=BIOMD0000000010")
```
The Tellurium example carries the caveat "(may not work with https)" `[T:notebooks]`.

```python
# 2. via a MIRIAM URN
import tellurium.temiriam as temiriam
sbml_str = temiriam.getSBMLFromBiomodelsURN(urn="urn:miriam:biomodels.db:BIOMD0000000012")
```
`[T:notebooks]`

## Test models

```python
print(te.listTestModels())          # list of test model paths        [T:tellurium_methods]
sbml = te.getTestModel('feedback.xml')   # SBML string of a test model [T:tellurium_methods]
r    = te.loadTestModel('feedback.xml')  # loaded RoadRunner instance  [T:tellurium_methods]
```
These are RoadRunner's built-in predefined models, provided so Tellurium can be
tried and tested easily `[T:tellurium_methods]`.

## After loading

- `r.isModelLoaded()` → True/False `[L:rr/cls_RoadRunner]`
- `r.clearModel()` frees the loaded model; returns True if memory was freed,
  False if no model was loaded `[L:rr/cls_RoadRunner]`
- `r.getInfo()` returns a string about the current state of the object
  (model loaded, conservation analysis flag, libSBML version, folders)
  `[L:rr/utility_functions]`
- `r.getIds()` returns the list of selection ids the object can select on
  `[L:rr/cls_RoadRunner]`

## Rules

1. Do not claim a loader exists that is not in the table above.
2. `te.loada` on a syntactically invalid Antimony string is a **model-building**
   failure, not a simulation failure — go to `workflows/diagnose_failure.md`.
3. Loading does not put the model at steady state and does not run anything.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/quickstart.html
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/API.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents") and https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://libroadrunner.readthedocs.io/en/latest/utility_functions.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
