# Stochastic Simulation

"RoadRunner supports stochastic simulation through the use of Gillespie
algorithm, which is a variation of Monte Carlo method" `[L:rr/stochastic]`.
Tellurium's Quick Start states the underlying engine "implements a Gibson direct
method" for the stochastic example shown there `[T:quickstart]`.

## Two entry points

```python
r.integrator = 'gillespie'      # or r.setIntegrator('gillespie')
s = r.simulate(0, 40)
```
```python
result = r.gillespie(0, 40)     # sets the integrator to gillespie, then simulates
```
`[T:notebooks]`, `[T:tellurium_methods]`

`gillespie` accepts the same shapes as `simulate` `[T:tellurium_methods]`:

```python
result = rr.gillespie(0, 40)                              # variable step sizes
result = rr.gillespie(0, 40, 10)                          # grid of 10 points
result = rr.gillespie(0, 40, selections=['time', 'S1'])   # variable step + selections
result = rr.gillespie(0, 40, 20, ['time', 'S1'])          # grid + selections
```

Gridding rule for the gillespie output `[L:rr/cls_RoadRunner]`:

| Given | Behaviour |
|---|---|
| end time **and** number of steps | output constrained to a grid |
| end time only | variable number of steps until end time or max output rows |
| number of steps only | that many variable steps |

## Seeding

```python
r.integrator.seed = 1234        # property form              [T:quickstart]
r.setSeed(1234)                 # method form                [T:notebooks]
seed = r.getSeed()              #                            [T:tellurium_methods]
```

`setSeed(seed, resetModel=True)` sets the seed for **all** random number
generators: any use of `distrib` in the model, any simultaneously-firing events,
and the `gillespie` integrator. It also sets the global seed in the configuration
object, so subsequently created roadrunner objects get the same seed. A negative
seed tells the generators to use a system-clock-based seed instead
`[T:tellurium_methods]`.

`getSeed(integratorName='')` — the integrator argument is now ignored; the
function returns the seed used for the existing model and the global
configuration option `[T:tellurium_methods]`.

Setting the identical seed for all repeats produces identical traces
`[T:notebooks]`. Without a seed, a different value is used each time
`[T:notebooks]`.

## Repeated runs

```python
r = te.loada('S1 -> S2; k1*S1; k1 = 0.1; S1 = 40')
r.integrator = 'gillespie'
r.integrator.seed = 1234

results = []
for k in range(1, 50):
    r.reset()
    s = r.simulate(0, 40)
    results.append(s)
    r.plot(s, show=False, alpha=0.7)
te.show()
```
`[T:notebooks]` — `r.reset()` between runs, `show=False` to overlay, `te.show()`
once at the end.

RoadRunner's own note on `gillespie`: "Use `RoadRunner.reset()` to reset the
model each time" `[L:rr/cls_RoadRunner]`.

## Ensemble mean

The Quick Start's documented pattern for a mean curve over repeats
`[T:quickstart]`:

```python
r.integrator.variable_step_size = False        # required: fixed grid to sum over
selections = ['time'] + r.getBoundarySpeciesIds() + r.getFloatingSpeciesIds()
Ncol, Nsim, points = len(r.selections), 30, 101
s_sum = np.zeros(shape=[points, Ncol])
for k in range(Nsim):
    r.resetToOrigin()
    s = r.simulate(0, 50, points, selections=selections)
    s_sum += s
    r.plot(s, alpha=0.5, show=False)
fig = te.plot(s[:,0], s_sum[:,1:]/Nsim,
              names=[x + ' (mean)' for x in selections[1:]],
              title="Stochastic simulation", xlabel="time", ylabel="concentration")
```

**`variable_step_size = False` is not optional here** — summing result arrays
requires every run to be on the same time grid.

## Changing parameters mid-run

```python
r.setSeed(1234)
for k in range(1, 20):
    r.resetToOrigin()
    res1 = r.gillespie(0, 10)
    r.plot(res1, show=False)
    r.k1 = r.k1*20            # change between the two halves
    res2 = r.gillespie(10, 20)
    r.plot(res2, show=False)
te.show()
```
`[T:notebooks]` — the docs note an Antimony `event` would be the alternative.

## Deterministic vs stochastic comparison

```python
m1 = r.simulate(0, 20, 100)          # deterministic
r.resetToOrigin()
r.setSeed(1234)
m2 = r.gillespie(0, 20, 100, ['time', 'S1'])
te.plotArray(m1, color="black", show=False)
te.plotArray(m2, color="blue")
```
`[T:notebooks]`

## Gillespie settings

`r.getIntegrator().getSettings()` for the gillespie solver returns
`('seed', 'variable_step_size', 'initial_time_step', 'minimum_time_step',
'maximum_time_step', 'nonnegative')` `[L:rr/stochastic]`.
`variable_step_size` defaults to **true** for gillespie; `nonnegative` (default
false) prevents species amounts going negative `[L:rr/cls_Integrator]`.

For seeding inside a SED-ML / phraSED-ML experiment, use
`<simulation-name>.algorithm.seed = <value>` — see `sedml_and_omex.md`
`[T:notebooks]`.

## Rules

1. Never present a single stochastic trace as the model's behaviour. Repeat, and
   say how many repeats.
2. State the seed, or state that none was set.
3. Reset (`reset` / `resetToOrigin`) between repeats, and say which was used —
   they differ (see `reset_and_state.md`).
4. Do not average variable-step traces without first fixing the grid.
5. Do not compare a stochastic trace point-for-point with a deterministic one;
   compare distributions or means.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/quickstart.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/stochastic.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_Integrator.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
