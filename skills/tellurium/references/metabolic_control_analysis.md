# Metabolic Control Analysis in Tellurium

## What the simulator defines

libRoadRunner's own framing `[L:rr/metabolic]`:

> Metabolic control analysis is the study of how sensitive the system is to
> perturbations in parameters and how those perturbations propagate through the
> network. Two kinds of sensitivity are defined, system and local.

- **Local** sensitivities are the **elasticities**: how a given effector of a
  reaction step affects that reaction rate. Because the definition is in terms of
  partial derivatives, perturbing one effector assumes all other potential
  effectors are unchanged `[L:rr/metabolic]`.
- **System** sensitivities are the **control and response coefficients**, in flux
  and concentration form. The flux control coefficient measures how sensitive a
  given flux is to a perturbation in the local rate of a reaction step — often
  perturbed by changing the enzyme concentration at that step. The concentration
  control coefficient is the analogue for a species. **Response coefficients**
  measure the sensitivity of a flux or a species concentration to a perturbation
  in some external effector `[L:rr/metabolic]`.

"Supports Metabolic Control Analysis" is listed as a RoadRunner feature
`[L:rr/index]`.

## Prerequisite

Control coefficients are steady-state quantities. Establish the steady state
first (`steady_state.md`), and if the model has conserved cycles set
`r.conservedMoietyAnalysis = True` before you compute anything.

`r.getSteadyStateThreshold()` / `setSteadyStateThreshold(val)` set "the threshold
used in steady state solver in routines such as `getCC()`" `[L:rr/cls_RoadRunner]`
— i.e. these routines run the steady-state solver internally.

## Single coefficients

```python
r.getCC('J1', 'Vmax')      # scaled flux control coefficient of flux J1 wrt Vmax
r.getCC('S1', 'Xo')        # scaled concentration control coefficient
r.getCC('S2', 'Km')
r.getuCC(variableId, parameterId)          # unscaled
r.getEE('J1', 'Vmax')                      # scaled elasticity of J1 wrt Vmax
r.getEE(reactionId, parameterId, steadyState=True)
r.getuEE(reactionId, parameterId)          # unscaled
```

- `getCC(variable, parameter)` — "Returns a scaled control coefficient with
  respect to a **global parameter**." `variable` is the id of a dependent
  variable (a reaction/flux or a species concentration); `parameter` is the id of
  the independent parameter, for example a kinetic constant or a boundary species
  `[L:rr/cls_RoadRunner]`.
- `getEE(reactionId, parameterId, steadyState=True)` — "Retrieve a single
  elasticity coefficient with respect to a global parameter." The parameter may
  be a kinetic constant, a floating species, or a boundary species. The
  `steadyState` flag controls whether the steady state value is computed
  `[L:rr/cls_RoadRunner]`.
- `getuEE(reactionId, parameterId)` — unscaled elasticity with respect to a
  global parameter or species `[L:rr/cls_RoadRunner]`.

**The first argument decides which coefficient you get.** `getCC('J1', ...)` is a
flux control coefficient; `getCC('S1', ...)` is a concentration control
coefficient. Nothing in the return value tells you which — you must carry the
mapping yourself.

## Whole matrices

Parameter-independent (structural) coefficients `[L:rr/metabolic]`,
`[L:rr/cls_RoadRunner]`:

| Call | Returns |
|---|---|
| `r.getScaledFluxControlCoefficientMatrix()` | n × n matrix of scaled FCCs, n = number of reactions |
| `r.getUnscaledFluxControlCoefficientMatrix()` | unscaled FCC matrix |
| `r.getScaledConcentrationControlCoefficientMatrix()` | m × n matrix of scaled CCCs, m = floating species, n = reactions |
| `r.getUnscaledConcentrationControlCoefficientMatrix()` | unscaled CCC matrix |
| `r.getScaledElasticityMatrix()` | scaled elasticity matrix at the current operating point |
| `r.getUnscaledElasticityMatrix()` | unscaled species elasticity matrix at the current operating point |
| `r.getScaledFloatingSpeciesElasticity(reactionId, speciesId)` | one scaled elasticity, by id |
| `r.getUnscaledSpeciesElasticity(reactionIndx, speciesIndx)` | one unscaled elasticity, **by integer index** |
| `r.getUnscaledParameterElasticity(reactionId, parameterId)` | unscaled elasticity wrt a named parameter |

Row/column order is the model's own id order: reactions in
`r.getReactionIds()` order, floating species in `r.getFloatingSpeciesIds()` order
(`model_access_and_editing.md`). **Fetch the id lists and label the matrix before
you read a single number off it.**

Note the asymmetry: `getScaledFloatingSpeciesElasticity` takes **ids**,
`getUnscaledSpeciesElasticity` takes **indices** `[L:rr/cls_RoadRunner]`.

## Coefficients as selections

Control-analysis quantities are first-class selections and can be put in a
time-course output or read with `getValue` `[L:rr/selecting_values]`:

| Selection | Meaning |
|---|---|
| `ee(ReactionId, ParameterId)` | scaled elasticity — selects `getEE()` |
| `uee(ReactionId, ParameterId)` | unscaled elasticity — selects `getuEE()` |
| `cc(Id, ParameterId)` | control coefficient — selects `getCC()`; `Id` is a flux or species name |
| `ucc(Id, ParameterId)` | unscaled control coefficient — selects `getuCC()` |

```python
r.getValue("cc(S1, J4_KS4)")             # -0.42955738179207886
sel = r.createSelection("cc(S1, J4_KS4)")
sel   # SelectionRecord({'index': -1, 'p1': 'S1', 'p2': 'J4_KS4', 'selectionType': CONTROL})
r.timeCourseSelections = ['time', '[S1]', "ee(J1, P1)"]
```
`[L:rr/selecting_values]`

In all four forms `ParameterId` is documented as a **global parameter id**
`[L:rr/selecting_values]`. Antimony makes reaction-local parameters global with
the reaction name prepended (`J0_v0`, `J1_KK2`) `[T:antimony]` — that is the id to
use, and it is why the doc examples read `cc(S1, J4_KS4)`.

## Numerical differentiation step

These coefficients are computed by numerical differentiation:

```python
r.getDiffStepSize()        # "the differential step size used in routines such as getCC()"
r.setDiffStepSize(val)
```
`[L:rr/metabolic]`, `[L:rr/cls_RoadRunner]`

If a coefficient looks like numerical noise, vary `DiffStepSize` and
`SteadyStateThreshold` and see whether the value moves. A number that changes
with the step size is a numerical artefact, not a biological result.

## Frequency-domain response

```python
r.getFrequencyResponse(startFrequency, numberOfDecades, numberOfPoints,
                       parameterName, variableName, useDB, useHz)
```
Returns three columns: frequency, amplitude, phase. `parameterName` is where the
input frequency is applied (usually a boundary species, e.g. `'Xo'`),
`variableName` is the output (usually a floating species, e.g. `'S1'`); `useDB`
selects decibels on the amplitude axis, `useHz` selects Hertz rather than
rad/sec on the x axis `[L:rr/cls_RoadRunner]`. "Supports Frequency Domain
Analysis" is a listed RoadRunner feature `[L:rr/index]`.

## Procedure

```
LOAD  ->  (conservedMoietyAnalysis if conserved cycles)
      ->  steadyState()  and CHECK the returned residual
      ->  getReactionIds() / getFloatingSpeciesIds()   [label the axes]
      ->  elasticities (local)   and/or   control coefficients (global)
      ->  vary DiffStepSize to confirm the numbers are not step-size artefacts
      ->  interpret, stating scaled vs unscaled and which flux/species
```

## Rules

1. **Never report a control coefficient without the steady-state residual that
   preceded it.**
2. Never mix scaled and unscaled quantities in one statement, one table, or one
   sum. Say which you used.
3. Never read a matrix element without first fetching the id lists that label its
   rows and columns.
4. Never substitute an elasticity for a control coefficient. Elasticities are
   local (one reaction, everything else clamped); control coefficients are
   systemic (the whole network at a steady state) `[L:rr/metabolic]`.
5. `getCC('J1', p)` and `getCC('S1', p)` are different kinds of coefficient —
   record which was asked for.
6. Do not attribute a small difference between two coefficients to biology until
   it survives a change of `DiffStepSize`.
7. The permitted source set defines these quantities and the calls that return
   them. It does **not** state the MCA summation or connectivity theorems — if
   asked to validate coefficients against those, say so and use a dedicated MCA
   source (this repository has an `mca` Skill for the theory).

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/antimony.html (local → global parameter renaming)

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/metabolic.html
- https://libroadrunner.readthedocs.io/en/latest/selecting_values.html
- https://libroadrunner.readthedocs.io/en/latest/ (feature list)
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents"); the API reference additionally from https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
