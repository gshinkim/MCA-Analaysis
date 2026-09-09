# Inspecting and Editing a Loaded Model

## Selection syntax — the addressing scheme for everything

Case sensitive (SBML ids are), whitespace ignored `[L:rr/selecting_values]`:

| Form | Meaning |
|---|---|
| `time` | current model time |
| `S1` | a plain identifier is the **species amount** |
| `[S1]` | brackets mean **concentration** |
| `S1'` | rate of change (also valid for elements defined by rate rules); in Python mix quote styles: `"S1'"` |
| `ee(ReactionId, ParameterId)` | scaled elasticity |
| `uee(ReactionId, ParameterId)` | unscaled elasticity |
| `cc(Id, ParameterId)` | control coefficient |
| `ucc(Id, ParameterId)` | unscaled control coefficient |
| `eigen(id)` / `eigenReal(id)` / `eigenImag(id)` | eigenvalue, real part, imaginary part |
| `init(id)` | initial value of a species or global parameter |
| `stoich(ParameterId, ReactionId)` | stoichiometric coefficient |

If a string is not a valid SBML identifier, an exception is raised
`[L:rr/selecting_values]`.

### The amount/concentration trap

```python
r.S1_amt        # amount
r["S1"]         # amount
r.getValue("S1")

r.S1_conc       # concentration
r["[S1]"]
r.getValue("[S1]")

r.S1            # gets CONCENTRATION - backwards-compatibility behaviour
```
`[L:rr/selecting_values]` — `S1` as a *selection string* means amount, but
`r.S1` as an *attribute* returns concentration. Never let this ambiguity sit
inside a claim; use the explicit form.

Setting is analogous: `r.S1_amt = 42`, `r["[S1]"] = 1.4`
`[L:rr/selecting_values]`.

### `init()` vs reset

"Setting `init(...)` does not reset the current value of the quantity. When
`resetAll` is called, the current values of all quantities will be reset to the
designated initial values, including any changes made to the initial values via
this syntax. This is in contrast to `resetToOrigin`, which resets all current and
initial values to the values specified in the SBML document."
`[L:rr/selecting_values]` — see `reset_and_state.md`.

## Getting and setting values

```python
r.S1                                  # attribute access                [L:rr/cls_RoadRunner]
r.S1 = 2.9
r.getValue(sel)                       # sel is a string or a SelectionRecord
r.setValue(sel, value)
r.setValues({'a': 7, 'b': 8})         # dict form
r.setValues(keys, values)             # parallel-lists form
r.getSelectedValues()                 # values of the current time-course selections
r.createSelection("cc(S1, J4_KS4)")   # build a SelectionRecord
r.getIds()                            # every id this object can select on
```
`[L:rr/cls_RoadRunner]`

All model elements with mathematical meaning — species, compartments,
parameters — can be read and set this way `[L:rr/cls_RoadRunner]`.

## Enumerating the model

Tellurium flattens these onto the RoadRunner instance "to save typing"
`[T:tellurium_methods]`:

| Species | Reactions | Parameters | Compartments | Other |
|---|---|---|---|---|
| `getFloatingSpeciesIds()` | `getReactionIds()` | `getGlobalParameterIds()` | `getCompartmentIds()` | `getNumEvents()` |
| `getFloatingSpeciesConcentrations([index])` | `getReactionRates([index])` | `getGlobalParameterValues([index])` | `getCompartmentVolumes([index])` | `getNumRateRules()` |
| `getNumFloatingSpecies()` | `getNumReactions()` | `getNumGlobalParameters()` | `getNumCompartments()` | `getRatesOfChange()` |
| `getBoundarySpeciesIds()` | | | | `getConservedMoietyValues([index])` |
| `getBoundarySpeciesConcentrations([index])` | | | | `getNumConservedMoieties()` |
| `getNumBoundarySpecies()` | | | | `getNumDepFloatingSpecies()` |
| | | | | `getNumIndFloatingSpecies()` |

Plus the simulation-window accessors `setStartTime`, `setEndTime`,
`getStartTime`, `getEndTime`, `getNumberOfPoints`, `setNumberOfPoints`
`[T:tellurium_methods]`.

**Ordering rule, stated repeatedly in the docs:** the order of any value vector
is the order of the corresponding `...Ids()` list `[T:tellurium_methods]`,
`[L:rr/cls_ExecutableModel]`. Never assume alphabetical or declaration order —
fetch the ids.

From the ExecutableModel reference, additionally `[L:rr/cls_ExecutableModel]`:
`getDependentFloatingSpeciesIds()`, `getIndependentFloatingSpeciesIds()`,
`getFloatingSpeciesConcentrationIds()`, `getBoundarySpeciesConcentrationIds()`,
`getFloatingSpeciesAmounts` / `setFloatingSpeciesAmounts`,
`setFloatingSpeciesConcentrations`, `setBoundarySpeciesConcentrations`,
`setCompartmentVolumes`, `setGlobalParameterValues`,
`getFloatingSpeciesInitAmounts` / `Concentrations` (+ setters and their id
lists), `getStoichiometry(speciesIndex, reactionIndex)`, `getEventIds()`,
`getConservedMoietyIds()`, `setConservedMoietyValues()`,
`getAllTimeCourseComponentIds()`, `getModelName()`, `getTime()`, `setTime(time)`,
`getInfo()`, plus dict-like `keys()`, `items()`, `__getitem__`, `__setitem__`.
The model object itself is `r.model` / `r.getModel()` `[L:rr/cls_RoadRunner]`.

## Jarnac short-cuts

Tellurium's Jarnac compatibility layer `[T:tellurium_methods]`:

| Shortcut | Equivalent |
|---|---|
| `r.fs()` | `getFloatingSpeciesIds()` |
| `r.bs()` | `getBoundarySpeciesIds()` |
| `r.rs()` | `getReactionIds()` |
| `r.ps()` | `getGlobalParameterIds()` |
| `r.vs()` | `getCompartmentIds()` |
| `r.sv()` | `getFloatingSpeciesConcentrations()` |
| `r.rv()` | `getReactionRates()` |
| `r.dv()` | `getRatesOfChange()` |
| `r.sm()` | `getFullStoichiometryMatrix()` |
| `r.fjac()` | `getFullJacobian()` |

Use them in exploration; use the long names in anything you hand back to a user.

## Extracting the ODEs

```python
te.getODEsFromModel(r)                 # from a loaded RoadRunner instance
te.getODEsFromSBMLString(sbmlStr)
te.getODEsFromSBMLFile('mymodel.xml')
```
Each "returns the model as a string of rules and ODEs" `[T:tellurium_methods]`.
This is the documented way to show a user what the model actually integrates.

## Editing the model in place

RoadRunner's model-editing API `[L:rr/cls_RoadRunner]`. Every call takes a
trailing `forceRegenerate` flag:

```
addSpeciesConcentration(sid, compartment, initValue, substanceUnits, forceRegenerate)
removeSpecies(sid, forceRegenerate)
addReaction(rid, reactants, products, kineticLaw, forceRegenerate)
addReaction(sbmlRep, forceRegenerate)
removeReaction(rid, forceRegenerate)
addParameter(pid, value, forceRegenerate)      /  removeParameter(pid, forceRegenerate)
addCompartment(cid, initVolume, forceRegenerate) / removeCompartment(cid, forceRegenerate)
setKineticLaw(rid, kineticLaw, forceRegenerate)
addAssignmentRule(vid, formula, forceRegenerate)
addRateRule(vid, formula, forceRegenerate)
removeRules(vid, forceRegenerate)
addEvent(eid, useValuesFromTriggerTime, trigger, forceRegenerate)
addTrigger(eid, trigger, forceRegenerate)      /  addPriority(eid, priority, forceRegenerate)
addDelay(eid, delay, forceRegenerate)
addEventAssignment(eid, vid, formula, forceRegenerate) / removeEventAssignment(eid, vid, forceRegenerate)
removeEvent(eid, forceRegenerate)
```

**After building with this API, JIT-compile before simulating**
`[L:rr/cls_RoadRunner]`:

```python
rr.addCompartment('c1', 0.1)
rr.addSpeciesConcentration('s1', 'c1', 1.5, False, False)
rr.addSpeciesConcentration('s2', 'c1', 0.0, False, False)
rr.addParameter('k1', 0.2)
rr.addReaction('r1', ['s1'], ['s2'], 's1*k1')
rr.regenerateModel()
rr.simulate()
```

`r.getSBML()` returns the original SBML; if the model was edited by these
methods it returns the most updated model **with the initial model parameters**.
`r.getCurrentSBML()` returns SBML with the current parameter values
`[L:rr/cls_RoadRunner]`.

For most work, editing the Antimony string and reloading is simpler and easier to
audit than the in-place editing API.

## Building SBML programmatically without Antimony

SimpleSBML, which Tellurium's index links, is "an intuitive interface for users
who are not already familiar with libSBML" that constructs SBML "with only a few
lines of code" `[L:simplesbml]`:

```python
import simplesbml
model = simplesbml.SbmlModel()
model.addCompartment(1e-14, comp_id='comp')
model.addSpecies('E', 5e-21, comp='comp')
model.addParameter('kon', 1000000.0)
model.addReaction(['E', 'S'], ['ES'], 'comp*(kon*E*S-koff*ES)',
                  local_params={'koff': 0.2}, rxn_id='veq')
model.addEvent(trigger='P1 > tau', assignments={'G2': '1'})
model.addRateRule('P1', 'k1 * (G1 - P1)')
sbml = model.toSBML()
code = simplesbml.writeCodeFromString(sbml)   # SBML -> SimpleSBML script
model = simplesbml.loadSBMLStr(sbml_string)
```
`[L:simplesbml]`

## Saving and restoring simulator state

```python
r.saveState("current_state.txt")        # binary by default; platform specific
r.saveState("current_state.txt", 'r')   # human-readable, for debugging, NOT reloadable
r.loadState("current_state.txt")
```
Saves/restores integrator, steady state solver and simulation results; all
simulation calls after `loadState` start from the resumed state
`[L:rr/cls_RoadRunner]`.

## Rules

1. Fetch the id list before indexing any vector or matrix.
2. Write `[S1]` or `S1_amt`, never bare `S1`, in anything a user will read.
3. After model editing, call `regenerateModel()` before simulating.
4. Distinguish `getSBML()` (original / initial parameters) from
   `getCurrentSBML()` (current values) when reporting a model.
5. Do not describe a value as "the concentration" if it came from an amount
   selection.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/selecting_values.html
- https://libroadrunner.readthedocs.io/en/latest/accessing_model.html
- https://libroadrunner.readthedocs.io/en/latest/read_write_functions.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_ExecutableModel.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents"); the API reference additionally from https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://simplesbml.readthedocs.io/en/latest/
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "SimpleSBML Documents")
