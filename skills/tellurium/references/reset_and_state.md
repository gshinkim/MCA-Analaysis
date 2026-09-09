# Reset and Model State

Getting reset wrong silently corrupts every repeated simulation, scan and
ensemble. There are **four** reset methods and they differ.

## The four resets

| Call | What it restores |
|---|---|
| `r.reset()` | "Resets time, all floating species, and rates to their initial values. **Does NOT reset changed global parameters.**" `[L:rr/cls_RoadRunner]` |
| `r.resetAll()` | "Resets time, all floating species, and rates to their **CURRENT** initial values. Also resets all global parameters back to the values they had when the model was first loaded." `[L:rr/cls_RoadRunner]` |
| `r.resetParameter()` | "Resets **only** global parameters to their CURRENT initial values." `[L:rr/cls_RoadRunner]` |
| `r.resetToOrigin()` | "Resets the model back to the state it was when FIRST loaded. The scope of this reset includes all initial values and parameters (everything)." `[L:rr/cls_RoadRunner]` |

Tellurium's own summary: "The `reset` function of a RoadRunner instance resets
the system variables (usually species concentrations) to their respective initial
values. `resetAll` resets variables to their CURRENT initial as well as resets
parameters. `resetToOrigin` completely resets the model." `[T:tellurium_methods]`

## "CURRENT initial value" — the part that trips people

A *current initial value* is one set through the `init()` selection:

```python
r.setValue('init(k1)', 0.3)
r.resetAll()
print(r.k1)      # 0.3   - resetAll went to the CURRENT initial, not the loaded one
```
`[T:tellurium_methods]`

"Setting this value does not reset the current value of the quantity. When
`resetAll` is called, the current values of all quantities will be reset to the
designated initial values, including any changes made to the initial values via
this syntax. This is in contrast to `resetToOrigin`, which resets all current and
initial values to the values specified in the SBML document."
`[L:rr/selecting_values]`

## The documented walk-through

```python
r = te.loada('S1 -> S2; k1*S1; k1 = 0.1; S1 = 10')
r.integrator.setValue('variable_step_size', True)

sim1 = r.simulate(0, 5)

r.k1 = 2.0
sim2 = r.simulate(0, 5)      # continues from sim1's final concentrations, new k1

r.reset()
sim3 = r.simulate(0, 5)      # initial concentrations back; k1 STILL 2.0

r.setValue('init(k1)', 0.3)
r.resetAll()
sim4 = r.simulate(0, 5)      # k1 == 0.3  (the current initial)

r.resetToOrigin()
sim5 = r.simulate(0, 5)      # everything back to load time
```
`[T:tellurium_methods]`

Note what `sim2` shows: **a simulation that is not preceded by a reset continues
from the previous end state.** That is sometimes what you want (sequential
protocols) and sometimes a bug (scans).

## Which reset for which task

| Task | Reset |
|---|---|
| repeat a stochastic run from identical initial conditions, same parameters | `r.reset()` |
| parameter scan: change one parameter, re-run from initial conditions | `r.reset()` (the changed parameter must survive) |
| repeat after having also changed parameters, back to load-time parameters | `r.resetAll()` |
| a clean slate, discarding every edit | `r.resetToOrigin()` |
| continue a protocol from where the last run stopped | **no reset** |

Both `r.reset()` and `r.resetToOrigin()` appear in documented repeat loops
`[T:notebooks]`, `[T:quickstart]` — the choice depends on whether parameters were
also changed.

`r.reset(SelectionRecord.*)` is mentioned as a variant for resetting the model's
state variables `[T:notebooks]`; the permitted sources do not enumerate its
selection arguments, so do not assert specific ones.

## Reset inside SED-ML

In a phraSED-ML repeated task, `reset=true` resets the model to its initial
conditions after each repeated simulation; leaving it off causes the model to
retain its current state between simulations — and **the time value is not reset**
`[T:notebooks]`:

```
task1 = repeat task0 for k1 in uniform(0.0, 5.0, 5), reset = true
task2 = repeat task0 for k1 in uniform(0.0, 5.0, 5)
```

## Time and state elsewhere

- `r.model.getTime()` / `setTime(time)` `[L:rr/cls_ExecutableModel]`
- `r.saveState(path)` / `r.loadState(path)` for full simulator state
  `[L:rr/cls_RoadRunner]` — see `model_access_and_editing.md`
- `r.getCurrentAntimony()` / `r.getCurrentSBML()` show the model **in its current
  state**, which is how you verify what a reset actually did
  `[T:antimony]`, `[T:tellurium_methods]`

The Antimony page's worked example uses exactly this to show that after
simulating past an event at t≥10, `getCurrentAntimony()` reports `p1 = 10` rather
than the loaded `p1 = 0` `[T:antimony]`.

## Rules

1. In any loop that re-simulates, state which reset you used and why.
2. Never assume `reset()` restores parameters — it does not.
3. Never assume `resetAll()` restores load-time initial values if `init(...)` was
   set — it restores the *current* initials.
4. If results drift run to run, check reset before blaming the integrator.
5. When reporting "the model", say whether it is the loaded model
   (`getAntimony()` / `getSBML()`) or the current state
   (`getCurrentAntimony()` / `getCurrentSBML()`).

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html
- https://tellurium.readthedocs.io/en/latest/quickstart.html
- https://tellurium.readthedocs.io/en/latest/antimony.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/tellurium_methods.html ("Model Reset" links `.../api_reference.html#RoadRunner.RoadRunner.reset`) and from https://tellurium.readthedocs.io/en/latest/index.html
- https://libroadrunner.readthedocs.io/en/latest/selecting_values.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_ExecutableModel.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
