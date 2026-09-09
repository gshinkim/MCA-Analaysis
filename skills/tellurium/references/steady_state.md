# Steady State

## What is being solved

The dynamics are `dS/dt = N v(S, p, t)` where `S` is the vector of species
concentrations, `N` the stoichiometry matrix, `p` time-independent parameters,
and `v` the reaction fluxes. **The steady state is the solution when all rates of
change are zero** `[L:rr/steady_state]`.

## The call

```python
r.steadyState()
```
Returns "a value that indicates how close the solution is to the steady state.
The smaller the value the better." — it is the **sum of squares of the rates of
change**. "Values less than 1E-6 usually indicate a steady state has been found.
If necessary the method can be called a second time to improve the solution."
After a successful call all species levels are at their steady state values
`[L:rr/steady_state]`, `[L:rr/cls_RoadRunner]`.

**Always look at the returned value.** A call that returns 3.7 has not found a
steady state, and every control coefficient computed after it is meaningless.

## Reading the steady state off

```python
r.steadyStateSelections = ['S1']
r.getSteadyStateValues()             # numpy array
r.getSteadyStateValuesNamedArray()   # same, with labels
```
Both **perform the steady state calculation first** ("evolves the system to a
steady state"), then return the values named by `steadyStateSelections`
`[L:rr/cls_RoadRunner]`. `steadyStateSelections` accepts the ordinary selection
syntax: `['S1', '[S2]', 'P1']` `[L:rr/cls_RoadRunner]`.

The value of a species after `steadyState()` can also be read directly:
`r.S2` `[T:notebooks]`.

## Moiety conservation — the standard failure

"If the model in question contains moiety conserved cycles, traditional approach
to obtain steady state solution fails as it is impossible to calculate the
inverse of Jacobian. In such case, we use a walkaround and split the species in a
cycle into groups." `[L:rr/steady_state]`

```python
r.conservedMoietyAnalysis = True
```
`[L:rr/steady_state]`, `[T:notebooks]`

Enabling it converts the SBML document with the ConservedMoietyConverter: all
linearly dependent species are replaced with assignment rules and a new set of
conserved moiety parameters is introduced `[L:rr/cls_RoadRunner]`.

The Tellurium protein-phosphorylation-cycle example sets
`r.conservedMoietyAnalysis = True` before scanning `r.steadyState()` over a
parameter, which is exactly this case `[T:notebooks]`.

Equivalent load-time switch:
`Config.setValue(Config.LOADSBMLOPTIONS_CONSERVED_MOIETIES, True)`
— "Perform conservation analysis. By default, this attribute is set as False."
`[L:rr/cls_Config]`. Tellurium's waveform example uses the same switch to turn
conservation analysis **off** for a model where it is unwanted `[T:notebooks]`.

See `structural_analysis.md` for what conservation analysis exposes.

## Solvers

Four steady-state solvers: **`nleq2` (the default)**, `nleq1`, `newton`
(sundials basic newton) and `newton_linesearch` (sundials newton with line search
globalization) `[L:rr/steady_state]`.

```python
r.setSteadyStateSolver('nleq1')          # or 'nleq2', 'newton', 'newton_linesearch'
solver = r.getSteadyStateSolver()
solver.settingsPyDictRepr()
r.getRegisteredSteadyStateSolverNames()  # ('nleq1','nleq2','newton','newton_linesearch')
r.steadyStateSolverExists(name)          # bool
```
`[L:rr/steady_state]`, `[L:rr/cls_RoadRunner]`

## Solver settings

Set through `r.getSteadyStateSolver().setValue(<name>, <value>)`
`[L:rr/cls_SteadyStateSolver]`:

| Setting | Default | Meaning |
|---|---|---|
| `allow_presimulation` | false | start the analysis by simulating first |
| `presimulation_time` | 100 | end time for that presimulation |
| `presimulation_maximum_steps` | 100 | takes priority over `presimulation_time` |
| `allow_approx` | true | use the approximation routine **only if** the solver fails |
| `approx_tolerance` | 1e-12 | absolute tolerance of the approximation routine |
| `approx_time` | 10000 | end time for the approximation routine |
| `approx_maximum_steps` | 10000 | takes priority over `approx_time` |
| `broyden_method` | 0 | quasi-Newton rank-1 updates |
| `linearity` | 3 | 1 = linear … 4 = extremely nonlinear |
| `maximum_iterations` | 100 | hard cap, reached whether or not a solution was found |
| `minimum_damping` | 1e-4 | |
| `relative_tolerance` | 1e-16 | |

Note `allow_approx` is on by default: **a "successful" call may have fallen back
to the approximation routine.** Check the returned sum of squares.

`r.getSteadyStateThreshold()` / `r.setSteadyStateThreshold(val)` set the
threshold used by the steady state solver in routines such as `getCC()`
`[L:rr/cls_RoadRunner]` — relevant to control analysis, see
`metabolic_control_analysis.md`.

## Escalation order when `steadyState()` will not converge

1. Read the returned residual — is it 1e-3 or 1e+3?
2. Does the model have conserved cycles? → `r.conservedMoietyAnalysis = True`.
3. Move the starting point closer: `allow_presimulation = True`, or simulate for
   a while first and then call `steadyState()`.
4. Try another solver (`nleq1`, `newton`, `newton_linesearch`).
5. Loosen/raise `maximum_iterations`, adjust `linearity`, `minimum_damping`.
6. Only then ask whether the model **has** a stable steady state at these
   parameters — that is a `stability_and_dynamics.md` question, and a system with
   sustained oscillations or bistability will not settle from every start point.

## Scanning the steady state over a parameter

```python
r.conservedMoietyAnalysis = True
for value in np.linspace(0, 1.2, 200):
    r.k1 = value
    r.steadyState()
    row = np.array([value, r.S2])
    result = np.vstack((result, row))
```
`[T:notebooks]` — see `parameter_scans.md` for `te.SteadyStateScan`, the packaged
version of this loop.

## Rules

1. Never say "the steady state is X" without having called `steadyState()` and
   read its return value.
2. Never compute control coefficients, a Jacobian, or eigenvalues for
   interpretation without first establishing the steady state.
3. Never assume the last point of a time course is a steady state.
4. A model with moiety conservation needs `conservedMoietyAnalysis = True`
   before the solver, not after a failure is explained away.
5. Multiple steady states are possible — a bistable model reaches a different one
   depending on initial conditions `[T:notebooks]`. Say which one you found.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/notebooks.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/steady_state.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_SteadyStateSolver.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_Config.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents"); the API reference additionally from https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
