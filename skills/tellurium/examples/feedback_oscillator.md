# Example — Negative-feedback oscillator: simulate, scan, inspect stability

Built on the feedback model that appears in the Tellurium documentation
`[T:notebooks]`, `[T:tellurium_methods]`.

## INPUT

A four-step chain whose first step is inhibited by the last species, with Hill
coefficient `h`.

## MODEL

```python
import tellurium as te
import numpy as np

r = te.loada('''
model feedback()
   // Reactions:
   J0: $X0 -> S1; (VM1 * (X0 - S1/Keq1))/(1 + X0 + S1 + S4^h);
   J1: S1 -> S2; (10 * S1 - 2 * S2) / (1 + S1 + S2);
   J2: S2 -> S3; (10 * S2 - 2 * S3) / (1 + S2 + S3);
   J3: S3 -> S4; (10 * S3 - 2 * S4) / (1 + S3 + S4);
   J4: S4 -> $X1; (V4 * S4) / (KS4 + S4);

  // Species initializations:
  S1 = 0; S2 = 0; S3 = 0; S4 = 0; X0 = 10; X1 = 0;

  // Variable initialization:
  VM1 = 10; Keq1 = 10; h = 10; V4 = 2.5; KS4 = 0.5;
end''')
```
`[T:notebooks]`

Note where the feedback lives: `S4^h` in the **denominator** of J0. There is no
inhibition arrow; the regulation is in the rate law. (An Antimony `-|`
interaction could be added for visualisation — it does not change the maths
`[T:antimony]`.)

## REASONING before simulating

An oscillator is exactly the case where the integration settings decide what you
see. Variable step size lets the integrator resolve the peaks; a coarse fixed
grid can alias them away. The documented setup uses variable stepping
`[T:notebooks]`:

```python
r.integrator.setValue('variable_step_size', True)
res = r.simulate(0, 40)
r.plot(res, title="Feedback Oscillations", ylabel="concentration",
       xlabel="time", alpha=0.9)
```

If you need a fixed grid (for stacking arrays, or averaging), remember the
guidance: a periodic function wants a step of roughly 1/12 of the period
`[L:rr/simulation_and_integration]`. Estimate the period from the variable-step
run first, then choose `points` accordingly.

## SCAN THE FEEDBACK STRENGTH

The documented Hill-coefficient scan, on the same model with the parameters
renamed by SBML conversion (`J0_h`) `[T:notebooks]`:

```python
result = r.simulate(0, 20, 201, ['time'])
h_values = [r.J0_h + k for k in range(0, 8)]
for h in h_values:
    r.reset()               # species back to initial; parameter change persists
    r.J0_h = h
    m = r.simulate(0, 20, 201, ['S1'])
    result = np.hstack([result, m])
te.plotArray(result, labels=['h={}'.format(int(h)) for h in h_values],
             xlabel='time', ylabel='S1')
```

Two things to note and to state in any report:

- `r.reset()` (not `resetAll()`) — the scanned parameter must survive the reset
  `[L:rr/cls_RoadRunner]`;
- `np.hstack` requires identical time grids, so `points=201` is fixed and
  variable stepping must be off for this loop.

The parameter id is `J0_h`, not `h`: Antimony promotes reaction-local parameters
to global with the reaction name prepended `[T:antimony]`. Confirm with
`r.getGlobalParameterIds()`.

## STEADY STATE AND STABILITY

An oscillating system still has a steady state — it is just not attracting.
Handle that explicitly rather than treating non-convergence as an error.

```python
residual = r.steadyState()
print('residual =', residual)          # may NOT be small for an oscillator
```

If it does converge, the eigenvalues of the Jacobian at that point are the
stability question `[L:rr/stability]`:

```python
Jac = r.getFullJacobian()
print(Jac)
ev = r.getFullEigenValues()            # col 0 real part, col 1 imaginary part
print(ev)
```
`[L:rr/cls_RoadRunner]`

Guards before quoting eigenvalues:

- the model must be pure reaction kinetics — no rate rules, no floating species
  rules, time invariant stoichiometry — which is the documented validity
  condition `[L:rr/cls_RoadRunner]`. This model satisfies it;
- if the full Jacobian is singular, that indicates a conservation law → use
  `getReducedJacobian()` with `conservedMoietyAnalysis = True`
  `[L:rr/stability]`, `[L:rr/cls_RoadRunner]`;
- the eigenvalues describe the point you computed them at. Say which state that
  was.

## WHAT NOT TO CLAIM

- Do **not** claim a Hopf bifurcation, a critical `h`, or a stability boundary
  from a scan of time courses. Bifurcation analysis is a separate tool
  (`rrplugins` / AUTO2000) `[L:rr/bifurcation]`.
- Do **not** read a period off a variable-step plot without saying it was
  variable-step.
- Do **not** report that the system "reaches steady state" because a coarse grid
  made it look flat.

## WHAT TO REPORT

1. The model and where the feedback enters (denominator of J0, exponent `h`).
2. Integration settings: variable step for the qualitative run, the fixed grid
   and its resolution for the scan.
3. The scan: parameter id (`J0_h`), range, reset policy, and how the trajectory
   shape changes across it.
4. Steady-state residual — including the case where it does not converge, which
   is itself informative.
5. Jacobian/eigenvalues if the validity conditions hold, with the state they were
   computed at.
6. Explicitly: what would be needed to make a bifurcation claim, and that it was
   not done.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/notebooks.html (the feedback model, the Hill-coefficient scan, variable step size)
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html (the same model under "Draw diagram"; plotting)
- https://tellurium.readthedocs.io/en/latest/antimony.html (interaction syntax; local → global parameter renaming)

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/stability.html
- https://libroadrunner.readthedocs.io/en/latest/bifurcation.html
- https://libroadrunner.readthedocs.io/en/latest/simulation_and_integration.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
