# Format Conversion, Import and Export

Tellurium sits between Antimony, SBML, CellML and MATLAB. Two families of calls:
**module-level converters** (string → string, no model loaded) and
**instance-level exporters** (from a loaded RoadRunner instance).

## Module-level converters

All accept "str | file" — a string **or** a file path `[T:tellurium_methods]`:

| Call | Direction |
|---|---|
| `te.antimonyToSBML(ant)` | Antimony → SBML |
| `te.antimonyToCellML(ant)` | Antimony → CellML |
| `te.sbmlToAntimony(sbml, removeFunctionDefinitions=None)` | SBML → Antimony |
| `te.sbmlToCellML(sbml)` | SBML → CellML |
| `te.cellmlToAntimony(cellml)` | CellML → Antimony |
| `te.cellmlToSBML(cellml)` | CellML → SBML |

```python
sbml_model   = te.antimonyToSBML(ant_model)
cellml_model = te.antimonyToCellML(ant_model)
cellml_model = te.sbmlToCellML(sbml_model)     # or via SBML
```
`[T:tellurium_methods]`

## Instance-level: current state vs loaded state

Every exporter takes `current` `[T:tellurium_methods]`:

| Export to file | Get as string (loaded model) | Get as string (current state) |
|---|---|---|
| `r.exportToSBML(filePath, current=True)` | `r.getSBML()` `[L:rr/cls_RoadRunner]` | `r.getCurrentSBML()` `[L:rr/cls_RoadRunner]` |
| `r.exportToAntimony(filePath, current=True)` | `r.getAntimony(current=False, removeFunctionDefinitions=None)` | `r.getCurrentAntimony(removeFunctionDefinitions=None)` |
| `r.exportToCellML(filePath, current=True)` | `r.getCellML(current=False)` | `r.getCurrentCellML()` |
| `r.exportToMatlab(filePath, current=True)` | `r.getMatlab(current=False)` | `r.getCurrentMatlab()` |

- `exportTo*` default to `current=True`: "To save the original model loaded into
  roadrunner use `current=False`" `[T:tellurium_methods]`.
- `get*` (without "Current") default to `current=False` — the *original* model
  `[T:tellurium_methods]`.
- `getSBML()` returns the original SBML; if the model was edited with the model
  editing API it returns the most updated model **with the initial model
  parameters**. `getCurrentSBML()` returns SBML with the current parameter values
  `[L:rr/cls_RoadRunner]`.

Documented pattern `[T:tellurium_methods]`:

```python
r = te.loada('S1 -> S2; k1*S1; k1 = 0.1; S1 = 10')
r.exportToSBML(ftmp.name)                  # current model state
r.exportToSBML(ftmp.name, current=False)   # the state at load time
sbml_str  = r.getCurrentSBML()
sbml_str0 = r.getSBML()
```

Verifying what changed — the docs diff the two Antimony strings before and after
a simulation to show that after crossing an event at t≥10, the current model has
`p1 = 10` rather than the loaded `p1 = 0` `[T:antimony]`.

## Files

```python
te.saveToFile(filePath, str)     # save a string to a file
te.readFromFile(filePath)        # read a file back as a string
```
`[T:tellurium_methods]`

```python
te.saveToFile(ftmp.name, r.getMatlab())
# or, more directly:
r.exportToMatlab(ftmp.name)
```
`[T:tellurium_methods]`

## MATLAB export

The generated MATLAB file exposes `__main(tspan, solver, options)` returning
`[t x rInfo]`, where `rInfo` carries `stoich`, `floatingSpecies`, `compartments`,
`params`, `boundarySpecies` and `rateRules` `[T:tellurium_methods]`.

## Antimony ↔ SBML round-trip caveats

Conversion is not lossless in both directions. The differences (local → global
parameters, `const`/`boundary` mapping, flattening of modules, disappearing DNA
strands, `time`/`delay` csymbols, keyword renaming) are listed in
`antimony_reference.md` under "SBML ↔ Antimony conversion differences"
`[T:antimony]`.

The Antimony change log states that as of the 3.2 release the entire SBML Test
Suite (except deprecated `fast` reactions) round-trips through Antimony without
loss of information, though hierarchical models may change structurally
`[T:antimony]`.

## Command-line and GUI translation

`sbtranslate` and `QTAntimony`, from antimony.sourceforge.net — see
`antimony_reference.md` `[T:antimony]`, `[L:antimony-sf]`.

## Getting the ODEs instead of a file format

```python
te.getODEsFromModel(r)
te.getODEsFromSBMLString(sbmlStr)
te.getODEsFromSBMLFile('mymodel.xml')
```
`[T:tellurium_methods]`

## COMBINE archives / OMEX

Packaging a model **together with its simulation** is a different problem — see
`sedml_and_omex.md`.

## Rules

1. State whether an exported artefact is the loaded model or the current state.
   `current=True` is the default for `exportTo*` and it is not the default for
   `get*`.
2. After any simulation, `getCurrentAntimony()` ≠ `getAntimony()` in general.
3. Do not promise a lossless round trip through CellML or MATLAB; the docs
   establish a round-trip claim only for SBML ↔ Antimony.
4. Converting Antimony → SBML makes local parameters global with the reaction
   name prepended. Downstream ids change; anything referring to them (selections,
   `getCC` parameters) must use the new names.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/API.html
- https://tellurium.readthedocs.io/en/latest/antimony.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/read_write_functions.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
- http://antimony.sourceforge.net/
  - Linked from: https://tellurium.readthedocs.io/en/latest/antimony.html
