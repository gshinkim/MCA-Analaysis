# Workflow — Parameter scans and sensitivity

Reference: `parameter_scans.md`.

## PHASE 1 — Decide what kind of scan

| Goal | Route |
|---|---|
| see how a **time course** changes with p | plain loop + `r.reset()`, overlay with `show=False` |
| see how a **steady state** changes with p | loop + `r.steadyState()`, or `te.SteadyStateScan` |
| two parameters at once | `plotMultiArray` / `plot2DParameterScan`, or nested phraSED-ML `repeat` |
| a 3D surface | `ParameterScan.plotSurface()` |
| a portable, reproducible experiment | phraSED-ML repeated task in a COMBINE archive (`sedml_and_omex.md`) |
| "which parameters matter" | one-at-a-time uncertainty sweep, **or** control coefficients (`run_control_analysis.md`) — they answer different questions |

## PHASE 2 — Get the reset right

This is where scans go wrong.

```python
for value in values:
    r.reset()          # restores species; does NOT restore parameters
    r.k1 = value       # set the scanned parameter each iteration
    m = r.simulate(0, 50, 100, ['time', 'S1'])
```
`[T:tellurium_methods]`

- `r.reset()` — species and time back to initial, **parameters untouched**. Right
  for a scan.
- `r.resetAll()` — also resets parameters to their load-time values. Set the
  scanned parameter *after* it.
- `r.resetToOrigin()` — everything, including any `init()` changes. Right when
  each point must be fully independent.
- **no reset** — each run continues from the last; that is a sequential protocol,
  not a scan.

`reset_and_state.md` has the full semantics.

## PHASE 3 — Run and collect

Overlay:
```python
te.plotArray(m, show=False, labels=['k1='+str(value)], resetColorCycle=False)
...
te.show()
```
Or merge into one array:
```python
result = np.hstack([result, r.simulate(0, 20, 201, ['S1'])])
```
`[T:tellurium_methods]`, `[T:notebooks]`

Merging requires **identical time grids** — fix `points` and turn
`variable_step_size` off.

For a steady-state scan, check `steadyState()`'s residual at every point and
record where it stops converging.

## PHASE 4 — Report

State: the parameter(s), the range, the number of points, linear or log spacing,
which reset, the integrator, and — for steady-state scans — the residual
behaviour across the range.

Describe the shape (monotone, saturating, threshold, non-monotone) and mark the
point where behaviour changes qualitatively. A qualitative change is a result;
do not smooth over it.

## Non-negotiables

1. A scan without a stated reset policy is not reportable.
2. A one-at-a-time sweep says nothing about parameter interactions. Say so.
3. Spread-of-output under a sweep is not a control coefficient.
4. Report range and resolution — a 5-point and a 200-point scan support different
   claims.
5. Non-convergence inside the range is a finding, not a gap to interpolate over.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/paramscan.html
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
