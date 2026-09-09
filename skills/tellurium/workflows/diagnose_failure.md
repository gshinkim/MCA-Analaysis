# Workflow — Diagnose a failure or a surprising result

Work down this list. **Debug the setup before inventing biology.**

## 1. Did the model load, and is it the model you meant?

```python
print(r.getCurrentAntimony())
print(r.getFloatingSpeciesIds(), r.getBoundarySpeciesIds())
print(r.getReactionIds(), r.getGlobalParameterIds())
print(te.getODEsFromModel(r))
```
Classic causes: a symbol silently became a parameter instead of a species; a
species that should be fixed is floating (or vice versa); a definition was
overwritten later in the string and the **last** one won `[T:antimony]`; local
parameters were renamed `<reaction>_<param>` by the SBML conversion
`[T:antimony]`.

## 2. Are you reading amounts or concentrations?

`r.S1` (attribute) is the **concentration**; the selection string `S1` is the
**amount**; `[S1]` is the concentration `[L:rr/selecting_values]`. Mixing them
produces results wrong by exactly the compartment volume.

## 3. Is the state what you think it is?

Which reset ran, if any? `reset()` does not restore parameters; `resetAll()`
restores *current* initials (which `init(...)` may have changed);
`resetToOrigin()` restores load time; no reset means the run continued from the
previous end state `[L:rr/cls_RoadRunner]`, `[T:tellurium_methods]`. See
`reset_and_state.md`.

## 4. Is it a numerical/integration problem?

- Integrator exception → "the first thing that one should try is specifying an
  initial time step and tighter absolute and relative tolerances"
  `[L:rr/simulation_and_integration]`.
- Trace stops before the end time, or has too few rows → `variable_step_size` and
  `max_output_rows` (default 100 000) `[L:rr/cls_RoadRunner]`.
- Oscillator looks wrong → step size; a periodic function needs roughly 1/12 of
  the period `[L:rr/simulation_and_integration]`.
- Stiff system → `stiff` is true by default for cvode; check it was not turned
  off `[T:notebooks]`.
- Negative amounts in a stochastic run → `nonnegative`
  `[L:rr/cls_Integrator]`.

## 5. Is `steadyState()` failing, or lying?

- Read the returned residual; < 1e-6 "usually" indicates success
  `[L:rr/steady_state]`.
- Conserved cycles? The ordinary approach fails because the Jacobian cannot be
  inverted → `r.conservedMoietyAnalysis = True` `[L:rr/steady_state]`.
- `allow_approx` is on by default — the answer may come from the approximation
  routine `[L:rr/cls_SteadyStateSolver]`.
- Try presimulation, then another solver (`nleq1`, `newton`,
  `newton_linesearch`) `[L:rr/steady_state]`.
- Confirm with `r.getRatesOfChange()`.

## 6. Is a matrix or vector mis-mapped?

Every value vector is ordered by the corresponding `...Ids()` list
`[T:tellurium_methods]`, `[L:rr/cls_ExecutableModel]`. Fetch the ids and label the
axes before reading anything off. Also check full vs reduced vs extended
stoichiometry — they have different row counts `[L:rr/stoichiometric]`.

## 7. Is the Jacobian singular / are eigenvalues odd?

A singular full Jacobian is the signature of a conservation law; use
`getReducedJacobian()` with moiety conversion enabled `[L:rr/stability]`,
`[L:rr/cls_RoadRunner]`. Eigenvalue calls are documented as valid only for pure
reaction-kinetics models — no rate rules, no floating species rules, time
invariant stoichiometry `[L:rr/cls_RoadRunner]`.

## 8. Is a control coefficient just numerical noise?

Vary `setDiffStepSize` and re-check; also check `getSteadyStateThreshold`
`[L:rr/metabolic]`, `[L:rr/cls_RoadRunner]`. Confirm scaled vs unscaled, and
confirm the first argument of `getCC` is the flux/species you meant.

## 9. Is the feature actually supported?

Check `references/limits_and_discrepancies.md` before concluding a bug:
algebraic rules (not supported by roadrunner), `fbc` models (not simulatable),
`layout`/`render`, non-supported SBML packages, `r.draw()` limits,
`SteadyStateScan` methods other than `plotArray`.

## 10. Is it an environment problem?

`import libsbml`/`libsedml`/`libcombine` failing → use `tesbml`/`tesedml`/
`tecombine` `[L:faq]`. Kernel won't start, Spyder segfault, Mac `dlsym` error,
Gatekeeper → the FAQ table in `setup_and_environment.md` `[L:faq]`.
Print `te.printVersionInfo()` before blaming an API `[T:tellurium_methods]`.

## 11. Only now: is the result real?

If 1–10 are clean and reproducible, the behaviour may be genuine — bistability,
oscillation, a threshold, a non-monotone response. Say what you ruled out, then
state the finding as a finding.

## Reporting a diagnosis

1. Symptom, verbatim (error text, or the number that surprised you).
2. Which checks above you ran and what each showed.
3. The cause, or the shortest list of remaining candidates.
4. The fix, and what re-running proved.
5. What you could **not** rule out.

## Anti-patterns

- Widening tolerances until the error goes away, without saying so.
- Calling `steadyState()` twice and reporting the second number without the
  residual.
- Explaining a suspicious coefficient biologically before varying the
  differentiation step.
- Silencing notices (`te.noticesOff()`) and never turning them back on
  `[T:tellurium_methods]`.
- Asserting an API exists because it "should" — check `references/api_index.md`.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/antimony.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/selecting_values.html
- https://libroadrunner.readthedocs.io/en/latest/simulation_and_integration.html
- https://libroadrunner.readthedocs.io/en/latest/steady_state.html
- https://libroadrunner.readthedocs.io/en/latest/stability.html
- https://libroadrunner.readthedocs.io/en/latest/stoichiometric.html
- https://libroadrunner.readthedocs.io/en/latest/metabolic.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_Integrator.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_SteadyStateSolver.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_ExecutableModel.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
- https://github.com/sys-bio/tellurium/wiki/FAQ
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "FAQ")
