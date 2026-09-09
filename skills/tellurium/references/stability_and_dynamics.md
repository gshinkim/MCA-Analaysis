# Stability, Eigenvalues and Bifurcation

## Definition

"The stability of a biochemical system is determined by the eigenvalues of the
Jacobian matrix. Given *m* floating species and *n* reactions, the Jacobian
matrix is defined as ∂f_i/∂S_j, where f_i is the *i*th differential equation and
S_j the *i*th floating species." `[L:rr/stability]`

## Jacobian

```python
Jac = r.getFullJacobian()      # full Jacobian at the current operating point
```
"This is the Jacobian of ONLY the floating species." `[L:rr/cls_RoadRunner]`,
`[T:tellurium_methods]` (also available as the jarnac shortcut `r.fjac()`).

```python
r.getReducedJacobian()
```
"It is possible for the full Jacobian to be singular. In these situations one
should call the related method `getReducedJacobian()`." `[L:rr/stability]`
The reduced Jacobian "will be non-singular for models that include
moiety-conserved cycles" `[L:rr/cls_RoadRunner]`.

**A singular full Jacobian is the signature of a conservation law**, not a broken
model — see `structural_analysis.md`.

## Eigenvalues

```python
r.getFullEigenValues()       # eigenvalues of the full Jacobian
r.getReducedEigenValues()    # eigenvalues of the reduced Jacobian
r.getEigenValueIds()         # selection symbols, of the form eigen(XX)
```
Both eigenvalue calls return "a real matrix, first column real part, second
column imaginary part" `[L:rr/cls_RoadRunner]`.

Two documented restrictions `[L:rr/cls_RoadRunner]`:

- both are "only valid for **pure reaction kinetics models** (no rate rules, no
  floating species rules and time invariant stoichiometry)";
- `getReducedEigenValues()` is "only valid if moiety conversion is enabled".

As selections `[L:rr/selecting_values]`: `eigen(identifier)` is the complex
eigenvalue, `eigenReal(identifier)` its real part, `eigenImag(identifier)` its
imaginary part.

Tellurium also exposes a plain numeric helper, `te.getEigenvalues(m)`, which
computes the eigenvalues of a numpy matrix using numpy `eig`
`[T:tellurium_methods]` — that is for a matrix you already have, not a model.

## Operating point matters

`getFullJacobian` is computed "at the current operating point"
`[L:rr/cls_RoadRunner]`. A Jacobian read from an arbitrary state says nothing
about the stability of a steady state. Call `steadyState()` first and check its
residual (`steady_state.md`).

## Rates of change — is this actually a steady state?

```python
r.getRatesOfChange()              # all floating species; order = getFloatingSpeciesIds()
r.getIndependentRatesOfChange()   # order = getIndependentFloatingSpeciesIds()
r.getDependentRatesOfChange()     # order = getDependentFloatingSpeciesIds()
r.dv()                            # jarnac shortcut for getRatesOfChange()
```
`[L:rr/cls_RoadRunner]`, `[T:tellurium_methods]`

The rates-of-change vector is the direct check on a claimed steady state, and
`"S1'"` is available as a time-course selection `[L:rr/selecting_values]`.

## Multiple steady states

A bistable model reaches different steady states from different initial
conditions; the documented demonstration sweeps the initial `[S1]` and overlays
the traces `[T:notebooks]`:

```python
r = te.loada('''
$Xo -> S1; 1 + Xo*(32+(S1/0.75)^3.2)/(1 +(S1/4.3)^3.2);
S1 -> $X1; k1*S1;
Xo = 0.09; X1 = 0.0; S1 = 0.5; k1 = 3.2;
''')
initValue = 0.05
m = r.simulate(0, 4, 100, selections=["time", "[S1]"])
for i in range(0, 12):
    r.reset()
    r['[S1]'] = initValue
    res = r.simulate(0, 4, 100, selections=["[S1]"])
    m = np.concatenate([m, res], axis=1)
    initValue += 1
```

## Bifurcation analysis

RoadRunner supports bifurcation analysis "through the `rrplugins` package, which
is an extension package to RoadRunner and provides an interface to AUTO2000"
`[L:rr/bifurcation]`.

```python
from rrplugins import *
auto = Plugin("tel_auto2000")
auto.setProperty("SBML", readAllText(sbmlModel))
auto.setProperty("NMX", 5000)                       # max number of steps
auto.setProperty("ScanDirection", "Positive")
auto.setProperty("PrincipalContinuationParameter", A)
auto.setProperty("PCPLowerBound", 10)
auto.setProperty("PCPUpperBound", 200)
auto.execute()

pts    = auto.BifurcationPoints
lbls   = auto.BifurcationLabels
biData = auto.BifurcationData
biData.plotBifurcationDiagram(pts, lbls)
```
`[L:rr/bifurcation]`

The full property list lives in the rrplugins AUTO2000 documentation, which is
**not** in the permitted source graph (it is linked from libRoadRunner, not from
Tellurium). Do not assert properties beyond those above.

## Oscillation

The documented feedback-oscillator model and its use of variable step size
`[T:notebooks]`, `[T:tellurium_methods]`:

```python
r = te.loada('''
model feedback()
   J0: $X0 -> S1; (VM1 * (X0 - S1/Keq1))/(1 + X0 + S1 + S4^h);
   J1: S1 -> S2; (10 * S1 - 2 * S2) / (1 + S1 + S2);
   J2: S2 -> S3; (10 * S2 - 2 * S3) / (1 + S2 + S3);
   J3: S3 -> S4; (10 * S3 - 2 * S4) / (1 + S3 + S4);
   J4: S4 -> $X1; (V4 * S4) / (KS4 + S4);
  S1 = 0; S2 = 0; S3 = 0; S4 = 0; X0 = 10; X1 = 0;
  VM1 = 10; Keq1 = 10; h = 10; V4 = 2.5; KS4 = 0.5;
end''')
r.integrator.setValue('variable_step_size', True)
res = r.simulate(0, 40)
```
The same model with `h` (`J0_h`) scanned upward is the documented way to show a
feedback strength sweep `[T:notebooks]`.

Remember the integration guidance: a periodic function needs a step of roughly
1/12 the period `[L:rr/simulation_and_integration]`. An oscillator sampled on a
coarse grid can look like anything.

## Rules

1. Establish the steady state before interpreting a Jacobian or eigenvalues.
2. If the full Jacobian is singular, do not "fix" it numerically — enable moiety
   conservation and use the reduced Jacobian.
3. Eigenvalue calls are documented as valid only for pure reaction-kinetics
   models. If the model has rate rules or species assignment rules, say the
   documented validity conditions are not met rather than reporting the numbers.
4. Report eigenvalues as real/imaginary pairs; complex pairs and real parts carry
   different information.
5. A simulation that "settles" is not proof of stability, and a simulation that
   wobbles is not proof of oscillation — check step size first.
6. Do not claim a bifurcation from a parameter scan of time courses alone.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/stability.html
- https://libroadrunner.readthedocs.io/en/latest/bifurcation.html
- https://libroadrunner.readthedocs.io/en/latest/selecting_values.html
- https://libroadrunner.readthedocs.io/en/latest/simulation_and_integration.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
