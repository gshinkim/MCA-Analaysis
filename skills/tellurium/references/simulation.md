# Time-course Simulation

## The call

```python
r.simulate(start, end, points)
r.simulate(0, 50, 100)
r.simulate(start=0, end=10, points=6)
r.simulate(0, 10, 6, selections=['time', 'J1'])
```

`simulate` "accepts three positional arguments: start time, end time, and number
of points", plus keyword arguments `selections` (list of variables in the output)
and `steps` (number of integration time steps, specifiable **instead of** points)
`[T:notebooks]`.

RoadRunner's own reference documents up to five positional arguments — start,
end, number of points, list of selections, output file path — and states that any
positional argument that is a list of strings is interpreted as a selections list
`[L:rr/cls_RoadRunner]`.

- `points` and `steps` are **exclusive — do not pass both** `[T:notebooks]`.
- With no arguments, the options from the previous `simulate` call are reused;
  on a first call the defaults are `start = 0, end = 5` `[L:rr/cls_RoadRunner]`.
- If an output file path is given, `simulate()` does **not** return the result
  matrix and keeps no simulation data — so `r.plot()` with no argument will have
  nothing to draw `[L:rr/cls_RoadRunner]`.
- The maximum number of output rows defaults to 100 000; it is ignored when
  `variable_step_size` is false or when writing to a file, and is changed with
  the `max_output_rows` argument/setting `[L:rr/cls_RoadRunner]`,
  `[L:rr/cls_Integrator]`.

`r.getSimulationData()` returns the array of simulated data, or an empty array if
no simulation has been run `[L:rr/cls_RoadRunner]`.

## The result object

The result is a NamedArray: column 0 is `time`, remaining columns are the
selections `[T:notebooks]`, `[T:tellurium_methods]`.

```python
results = r.simulate(0, 0.5, 1000)
results['time']        # by name
results['[Nan2]']      # concentration selection name; brackets may or may not
                       # be needed depending on whether the column is a
                       # concentration or a count - print results to check
results[:, 0]          # by position
```
`[T:tellurium_methods]`

## Choosing an integrator

```python
r.setIntegrator('cvode')      # equivalent forms
r.integrator = 'rk4'
```
"RoadRunner supports `'cvode'`, `'gillespie'`, and `'rk4'` for the integrator
name" `[T:notebooks]`. libRoadRunner's Integrator reference states
"cvode, gillespie, rk4 and rk45" — see `limits_and_discrepancies.md`
`[L:rr/cls_Integrator]`.

Do not guess the available set: `r.getAvailableIntegrators()` returns the names
of available integrators, `r.getExistingIntegratorNames()` all integrators
`[L:rr/cls_RoadRunner]`.

CVODE "uses adaptive stepping internally, regardless of whether the output is
gridded or not. The size of these internal steps is controlled by the tolerances,
both absolute and relative." `[T:notebooks]`

## Integrator settings

Two equivalent forms `[T:notebooks]`:

```python
r.integrator.variable_step_size = True
r.integrator.setValue('relative_tolerance', 1e-1)
print(r.integrator)     # prints name + all current settings
```
There is also `r.setIntegratorSetting(name, key, value)` for a named integrator
`[L:rr/cls_RoadRunner]`, and `r.getIntegrator().getSettings()` /
`getDescription()` to discover them `[L:rr/stochastic]`.

Settings called out by Tellurium for **cvode** `[T:notebooks]`:

| Setting | Meaning |
|---|---|
| `variable_step_size` | adaptive step-size integration (True/False) |
| `stiff` | stiff solver, CVODE only; enabled by default |
| `absolute_tolerance` | absolute numerical tolerance for internal stepping |
| `relative_tolerance` | relative numerical tolerance for internal stepping |

For **gillespie**: `seed` — "Simulations initialized with the same seed will have
the same results" `[T:notebooks]`.

Fuller set, from libRoadRunner `[L:rr/cls_Integrator]`:

| Setting | Default | Note |
|---|---|---|
| `relative_tolerance` | `Config::CVODE_MIN_RELATIVE` | |
| `absolute_tolerance` | `Config::CVODE_MIN_ABSOLUTE` | scalar **or** per-state vector; a scalar is multiplied by each state element (roadrunner ≥ 2.4.0). `getAbsoluteToleranceVector()` returns the expanded vector; `setIndividualTolerance(sid, value)` sets one species (CVODE only) |
| `stiff` | true | |
| `maximum_bdf_order` | 5 | stiff path |
| `maximum_adams_order` | 12 | non-stiff path |
| `maximum_num_steps` | 20000 | max steps to reach `tout` |
| `initial_time_step` | 0.0 | 0 ⇒ CVODE estimates it |
| `minimum_time_step` / `maximum_time_step` | 0.0 | |
| `multiple_steps` | false | |
| `variable_step_size` | false for cvode; **true** for gillespie | |
| `max_output_rows` | 100000 | variable-step only |
| `nonnegative` | false | gillespie: prevents amounts going negative |
| `seed` | system clock (µs) | gillespie |
| `epsilon` | 1e-12 | rk45: maximum error tolerance |

Tuning guidance, verbatim in substance from libRoadRunner
`[L:rr/simulation_and_integration]`:

- as a general rule for numeric stability, a periodic function needs a time step
  of roughly 1/12 the period;
- stiffer systems need tighter tolerances, and very tight tolerances drastically
  reduce performance;
- the initial time step matters: too large and the integrator wastes time
  reducing it, too small and it wastes steps re-evaluating the system;
- **if the integrator raises an exception, first try specifying an initial time
  step and tighter absolute and relative tolerances.**

## Selections — what appears in the output

By default the output includes all SBML species and the time variable
`[T:notebooks]`.

```python
r.simulate(0, 10, 6, selections=r.getFloatingSpeciesIds())
r.selections = ['time', 'F'] + r.getBoundarySpeciesIds() + r.getFloatingSpeciesIds()
r.timeCourseSelections = ['time', 'SineWave', 'SquareWave']
```
`[T:notebooks]`

`r.timeCourseSelections` is the property that determines the result columns; it
looks like a list of strings but holds selection objects, so anything inserted or
appended must come from `r.createSelection(...)` `[L:rr/selecting_values]`.
`r.resetSelectionLists()` restores time-course and steady-state defaults
`[L:rr/cls_RoadRunner]`.

The full selection grammar (concentrations, rates of change, elasticities,
control coefficients, eigenvalues, `init()`, `stoich()`) is in
`model_access_and_editing.md`.

## Stepping manually

```python
newTime = r.oneStep(10, 0.5)              # returns currentTime + stepSize
r.internalOneStep(startTime, stepSize, reset)   # one internal solver step
```
`[L:rr/cls_RoadRunner]`

## Running several simulations in sequence

Continuing from the previous end state (do **not** reset in between):

```python
m1 = r.simulate(0, 15, 100, ["Time","S1"])
r.k1 = r.k1 * 6
m2 = r.simulate(15, 40, 100, ["Time","S1"])
m  = numpy.vstack([m1, m2])
```
`[T:notebooks]`

Restarting from the same initial state each time (reset in between) — see
`reset_and_state.md`, and `parameter_scans.md` for the scan idioms.

## Rules

1. State which integrator produced a result. A `cvode` trace and a `gillespie`
   trace are not comparable point-for-point.
2. Never pass `points` and `steps` together.
3. If a result looks like it "stopped early", check `variable_step_size` and
   `max_output_rows` before blaming the model.
4. An integrator exception is a numerical event first, a modelling event second:
   apply the tuning order above before editing the model.
5. Do not report a simulation as evidence of a steady state — use
   `steady_state.md`.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/notebooks.html
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/quickstart.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/simulation_and_integration.html
- https://libroadrunner.readthedocs.io/en/latest/selecting_values.html
- https://libroadrunner.readthedocs.io/en/latest/stochastic.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_Integrator.html
  - All linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents"); the API reference additionally from https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
