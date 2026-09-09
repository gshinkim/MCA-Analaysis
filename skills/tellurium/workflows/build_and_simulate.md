# Workflow — Build a model and simulate it

The default path for "model X in Tellurium" / "simulate this pathway".

## PHASE 1 — Establish what the model is

Before writing Antimony, pin down and write out:

- species, and which of them are **boundary/fixed** vs floating;
- reactions, with stoichiometry;
- rate laws (or say explicitly that they are being assumed);
- compartments, and whether any volume is not 1;
- parameters and initial values;
- any events, assignment rules or rate rules;
- regulatory interactions that do not appear as reactants/products.

If any of these is unknown, ask or state the assumption — do not silently pick a
rate law.

## PHASE 2 — Write the Antimony

Reference: `antimony_basics.md`, and `antimony_reference.md` for anything beyond
reactions/rules/events.

```python
import tellurium as te
r = te.loada('''
model pathway()
  J0: $X0 -> S1; k1*X0
  J1: S1 -> S2;  k2*S1
  J2: S2 -> $X1; k3*S2

  X0 = 10; X1 = 0; S1 = 0; S2 = 0
  k1 = 0.1; k2 = 0.3; k3 = 0.15
end
''')
```

Checks at this point:

- fixed species marked `$` or `const`;
- reaction rates in **amount/time** — multiply by compartment volume when the
  volume is not 1 `[T:antimony]`;
- no algebraic rules if the model will be simulated (roadrunner does not support
  them) `[T:antimony]`;
- no symbol defined twice with different intent — the last definition silently
  wins `[T:antimony]`.

## PHASE 3 — Verify the model loaded is the model you meant

```python
print(r.getCurrentAntimony())          # what Antimony actually built
print(r.getFloatingSpeciesIds())
print(r.getBoundarySpeciesIds())
print(r.getReactionIds())
print(r.getGlobalParameterIds())
print(r.getFullStoichiometryMatrix())
print(te.getODEsFromModel(r))          # the equations that will be integrated
```
`[T:tellurium_methods]`, `[T:notebooks]`

This phase catches the most common modelling error: a symbol that was meant to be
a species became a parameter, or a boundary species is floating.

Optionally `r.draw(width=200)` for a network diagram (needs graphviz/pygraphviz,
Jupyter only, medium-size networks) `[T:notebooks]`, `[T:tellurium_methods]`.

## PHASE 4 — Choose the simulation

Reference: `simulation.md`.

```python
r.setIntegrator('cvode')                     # or 'gillespie', 'rk4'
r.integrator.variable_step_size = False      # decide deliberately
s = r.simulate(0, 50, 100, selections=['time'] + r.getFloatingSpeciesIds())
```

Decide and state: integrator, time span, points (or steps), selections, and
whether variable step size is on. For an oscillator, remember the ~1/12-of-period
step guidance `[L:rr/simulation_and_integration]`.

For stochastic models go to `stochastic_simulation.md` instead — and repeat runs.

## PHASE 5 — Plot

Reference: `plotting.md`.

```python
r.plot(s, xlabel='time', ylabel='concentration', title='...', grid=True)
```

Label both axes. If overlaying, `show=False` on each and one `te.show()`.

## PHASE 6 — Report

Separate, explicitly:

1. **Model** — the Antimony, and which parts were given vs assumed.
2. **Setup** — integrator, tolerances if changed, time span, points, selections,
   seed if stochastic.
3. **Observations** — what the trace does, in terms of the plotted variables.
4. **Interpretation** — clearly marked as interpretation.
5. **Assumptions and limits** — rate laws assumed, units unchecked (Antimony does
   not derive units `[T:antimony]`), single realisation vs ensemble, etc.

Do not report a trace as "the steady state", "the control distribution", or
"stable" — those are the other workflows.

## Common failures at each phase

| Symptom | Look at |
|---|---|
| `loada` raises | Antimony syntax; `antimony_basics.md` |
| a species is missing from the output | it became a parameter, or it is a boundary species; check `getFloatingSpeciesIds()` |
| the trace is flat | initial values, boundary species, or a rate law evaluating to 0 |
| trace has too few points / stops early | `variable_step_size`, `max_output_rows` `[L:rr/cls_RoadRunner]` |
| integrator exception | tighter tolerances and an initial time step, in that order `[L:rr/simulation_and_integration]` |
| results differ between runs | reset — `reset_and_state.md` |

Full triage: `workflows/diagnose_failure.md`.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/antimony.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/simulation_and_integration.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
- https://libroadrunner.readthedocs.io/en/latest/ (SBML support excludes algebraic rules)
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
