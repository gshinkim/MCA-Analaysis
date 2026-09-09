# Example — Linear pathway: build → simulate → steady state → control

A worked reasoning pattern, assembled entirely from constructs the Tellurium
documentation demonstrates. Follow the shape, not the numbers.

## INPUT

A three-step chain fed by a fixed source and draining to a fixed sink.

## REASONING

- The source and sink are **fixed** → boundary species, marked `$`
  `[T:antimony]`.
- Mass-action rate laws are an assumption; state it.
- Three reactions, two floating species → no conserved cycle expected; verify
  rather than assume.

## MODEL

```python
import tellurium as te
import numpy as np

r = te.loada('''
model pathway()
  J0: $X0 -> S1;  k1*X0
  J1: S1  -> S2;  k2*S1
  J2: S2  -> $X1; k3*S2

  X0 = 10; X1 = 0
  S1 = 0;  S2 = 0
  k1 = 0.1; k2 = 0.3; k3 = 0.15
end
''')
```
Model shape follows the documented boundary-species example `[T:antimony]`.

## VERIFY THE MODEL

```python
print(r.getFloatingSpeciesIds())    # expect ['S1', 'S2']
print(r.getBoundarySpeciesIds())    # expect ['X0', 'X1']
print(r.getReactionIds())           # expect ['J0', 'J1', 'J2']
print(r.getGlobalParameterIds())
print(r.getFullStoichiometryMatrix())
print(te.getODEsFromModel(r))
```
`[T:tellurium_methods]`, `[T:notebooks]`

If `X0` shows up as floating, the `$` was missed. Stop and fix it — every later
number depends on this.

## SIMULATE

```python
s = r.simulate(0, 100, 201, selections=['time', '[S1]', '[S2]', 'J0', 'J1', 'J2'])
r.plot(s, xlabel='time', ylabel='concentration / flux',
       title='Linear pathway approach to steady state', grid=True)
```
`[T:notebooks]`, `[T:tellurium_methods]`

Reading it: the three fluxes converge on one another. **That convergence is the
visual signature of a steady state in a linear chain — it is not proof.**

## STEADY STATE

```python
print(r.getNumConservedMoieties())        # expect 0 here
residual = r.steadyState()
print('residual =', residual)             # must be small; <1e-6 usually means found
print(r.getRatesOfChange())               # independent check: ~0 for S1, S2
r.steadyStateSelections = ['[S1]', '[S2]', 'J0', 'J1', 'J2']
print(r.getSteadyStateValuesNamedArray())
```
`[L:rr/steady_state]`, `[L:rr/cls_RoadRunner]`, `[T:tellurium_methods]`

Do not continue until the residual is small **and** the rates of change are ~0.

## CONTROL ANALYSIS

```python
rxn_ids = r.getReactionIds()
sp_ids  = r.getFloatingSpeciesIds()

FCC = r.getScaledFluxControlCoefficientMatrix()
CCC = r.getScaledConcentrationControlCoefficientMatrix()
E   = r.getScaledElasticityMatrix()
```
`[L:rr/cls_RoadRunner]`

Label before reading:

```python
import pandas as pd
print(pd.DataFrame(FCC, index=rxn_ids, columns=rxn_ids))   # flux x reaction
print(pd.DataFrame(CCC, index=sp_ids,  columns=rxn_ids))   # species x reaction
print(pd.DataFrame(E,   index=rxn_ids, columns=sp_ids))    # reaction x species
```

Single coefficients, by name — note the parameter must be a global parameter id,
and Antimony has already made reaction-local parameters global with the reaction
name prepended `[T:antimony]`, `[L:rr/cls_RoadRunner]`:

```python
print(r.getCC('J1', 'k1'))     # flux control coefficient of J1 wrt k1
print(r.getCC('S1', 'k1'))     # concentration control coefficient of S1 wrt k1
print(r.getEE('J1', 'k2'))     # elasticity of J1 wrt k2
```

## VALIDATE THE NUMBERS

```python
h0 = r.getDiffStepSize()
for h in (h0/10, h0, h0*10):
    r.setDiffStepSize(h)
    print(h, r.steadyState(), r.getScaledFluxControlCoefficientMatrix()[0])
r.setDiffStepSize(h0)
```
`[L:rr/metabolic]`, `[L:rr/cls_RoadRunner]`

Rows that move materially with `h` are numerical artefacts and must not be
interpreted.

## INTERPRETATION — and where it stops

Supported by the permitted sources: the elasticity is a **local** sensitivity,
computed with all other effectors unchanged; the flux and concentration control
coefficients are **systemic** sensitivities of a steady-state flux or
concentration to a perturbation at one step `[L:rr/metabolic]`. Reporting the
labelled coefficients with that framing is within scope.

Not supported here: that the flux control coefficients sum to 1, that
coefficients are bounded, or any connectivity relation between elasticities and
control coefficients. The Tellurium documentation and the sources it links do not
state the MCA theorems. Hand that part to a dedicated MCA source (this repository
has an `mca` Skill).

## WHAT TO REPORT

1. The model, and that mass-action kinetics were assumed.
2. Boundary vs floating species, from `get*SpeciesIds()`.
3. Steady-state residual and the rates-of-change check.
4. Steady-state concentrations and fluxes, labelled.
5. Scaled control coefficient tables with row/column ids and the `DiffStepSize`
   they were stable across.
6. The interpretive boundary above.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/antimony.html (boundary-species model shape; local → global parameter renaming)
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html (model enumeration, `getODEsFromModel`, plotting)
- https://tellurium.readthedocs.io/en/latest/notebooks.html (simulate/selections, stoichiometry printing)

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/steady_state.html
- https://libroadrunner.readthedocs.io/en/latest/metabolic.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")

Note: `pandas` is used only to print a labelled table; the permitted sources do
not mention it. Any equivalent labelling is fine — the requirement is that the
axes are labelled from the model's own id lists.
