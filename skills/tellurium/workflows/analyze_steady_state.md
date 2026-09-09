# Workflow — Steady-state analysis

Use for "what is the steady state", "where does this settle", "how does the
steady state depend on p".

## PHASE 1 — Is a steady state the right question?

A steady state exists only if the system settles. Oscillators, bistable systems
and systems being driven by a time-varying input need different treatment
(`stability_and_dynamics.md`). Say which case you are in before computing.

## PHASE 2 — Prepare the model

```python
r.getNumConservedMoieties()          # > 0 => conserved cycles present
r.conservedMoietyAnalysis = True     # enable BEFORE solving, if so
```
Moiety-conserved models make the Jacobian non-invertible and the ordinary
approach fails `[L:rr/steady_state]`. See `structural_analysis.md`.

## PHASE 3 — Solve, and read the residual

```python
residual = r.steadyState()
print(residual)
```
The return is the **sum of squares of the rates of change**; "values less than
1E-6 usually indicate a steady state has been found. If necessary the method can
be called a second time to improve the solution." `[L:rr/steady_state]`

**Do not proceed on a large residual.** Escalate in this order
(`steady_state.md`):

1. call `steadyState()` again;
2. `r.conservedMoietyAnalysis = True` if not already;
3. `r.getSteadyStateSolver().setValue("allow_presimulation", True)`, or simulate
   for a while first and then solve;
4. try `nleq1`, `newton`, `newton_linesearch`;
5. adjust `maximum_iterations`, `linearity`, `minimum_damping`;
6. conclude that the model may have no stable steady state at these parameters.

Remember `allow_approx` is **on** by default — a returned value may come from the
approximation routine `[L:rr/cls_SteadyStateSolver]`.

## PHASE 4 — Confirm independently

```python
print(r.getRatesOfChange())     # should be ~0 for every floating species
print(r.getReactionRates())     # the steady-state fluxes
```
`[T:tellurium_methods]`, `[L:rr/cls_RoadRunner]`

A residual can be small while one species is still drifting; the rates-of-change
vector shows which.

## PHASE 5 — Read the values off

```python
r.steadyStateSelections = ['[S1]', '[S2]', 'J1']
r.getSteadyStateValuesNamedArray()
```
`[L:rr/cls_RoadRunner]`

Use the labelled variant, and use explicit `[S]` concentration selections rather
than bare ids (`model_access_and_editing.md`).

## PHASE 6 — Dependence on a parameter

```python
for value in np.linspace(lo, hi, n):
    r.k1 = value
    residual = r.steadyState()
    if residual > 1e-6:
        # record the failure - do not silently keep the point
        ...
    rows.append((value, r.S2))
```
`[T:notebooks]` — check the residual at every point, not just the first.
`te.SteadyStateScan` packages this (`parameter_scans.md`).

## PHASE 7 — Report

State, in this order:

1. whether conservation analysis was enabled;
2. the solver used and the final residual;
3. the steady-state concentrations **and** fluxes, labelled;
4. the confirmation from `getRatesOfChange()`;
5. whether other steady states may exist (bistability) and what initial condition
   this one was reached from;
6. anything the escalation ladder had to change to make it converge.

## Non-negotiables

- Never report a steady state without its residual.
- Never call the last point of a time course "the steady state".
- Never compute control coefficients, a Jacobian or eigenvalues for
  interpretation before this workflow has succeeded.
- If the scan stops converging partway, report where — that boundary is a result,
  not a nuisance.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/notebooks.html
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/steady_state.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_SteadyStateSolver.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
