# Example — A reproducible parameter scan as a COMBINE archive

Turning a Python loop into an artefact another tool can run. Built from the
documented 1D parameter scan `[T:notebooks]`.

## INPUT

"Run this scan, and make it reproducible outside my notebook."

## REASONING

- The scan itself is a **simulation experiment**, so it belongs in SED-ML, not in
  a script `[T:notebooks]`.
- SED-ML references an external model, so it must ship inside a COMBINE archive
  `[T:notebooks]`.
- Inline OMEX is the human-readable way to author both halves at once
  `[T:notebooks]`.
- SED-ML's vocabulary is limited to timecourse and steady state, and is "not
  designed to replace scripting" `[T:notebooks]` — if the analysis needs more
  than a repeated task, keep the Python and export only the model.

## THE ARCHIVE

```python
import tellurium as te, tempfile, os

antimony_str = '''
// Created by libAntimony v2.9
model *parameterScan1D()

// Compartments and Species:
compartment compartment_;
species S1 in compartment_, S2 in compartment_, $X0 in compartment_;
species $X1 in compartment_, $X2 in compartment_;

// Reactions:
J0: $X0 => S1; J0_v0;
J1: S1 => $X1; J1_k3*S1;
J2: S1 => S2; (J2_k1*S1 - J2_k_1*S2)*(1 + J2_c*S2^J2_q);
J3: S2 => $X2; J3_k2*S2;

// Species initializations:
S1 = 0; S2 = 1; X0 = 1; X1 = 0; X2 = 0;

// Compartment initializations:
compartment_ = 1;

// Variable initializations:
J0_v0 = 8; J1_k3 = 0; J2_k1 = 1; J2_k_1 = 0;
J2_c = 1; J2_q = 3; J3_k2 = 5;

// Other declarations:
const compartment_, J0_v0, J1_k3, J2_k1, J2_k_1, J2_c, J2_q, J3_k2;
end
'''

phrasedml_str = '''
model1 = model "parameterScan1D"
timecourse1 = simulate uniform(0, 20, 1000)
task0 = run timecourse1 on model1
task1 = repeat task0 for J0_v0 in [8, 4, 0.4], reset=true
plot task1.time vs task1.S1, task1.S2
'''

inline_omex = '\n'.join([antimony_str, phrasedml_str])
te.executeInlineOmex(inline_omex)
```
`[T:notebooks]`

Four things to check in this pairing:

1. the model name in the Antimony (`parameterScan1D`) matches the phraSED-ML
   reference (`model "parameterScan1D"`);
2. the scanned id is `J0_v0` — the global name Antimony gave the reaction-local
   parameter `[T:antimony]`;
3. `reset=true` is present, so each value starts from the same initial conditions
   — without it the model state **and the time value** carry over `[T:notebooks]`;
4. the plot references task-qualified variables (`task1.time`, `task1.S1`).

## EXPORT AND ROUND-TRIP

```python
workingDir  = tempfile.mkdtemp(suffix="_omex")
archive_name = os.path.join(workingDir, 'archive.omex')
te.exportInlineOmex(inline_omex, archive_name)

# read the archive back and execute it - the reproducibility check
te.convertAndExecuteCombineArchive(archive_name)

# or recover the editable inline form
inline_again = te.convertCombineArchive(archive_name)
```
`[T:notebooks]`

**The round-trip is the test.** An archive that has not been re-opened and re-run
has not been verified.

## VARIATIONS THE DOCUMENTATION ESTABLISHES

Two nested parameters — one discrete list, one uniform range `[T:notebooks]`:

```
repeatedtask_1 = repeat task_1 for J1_KK2 in [1, 5, 10, 50, 60], reset=true
repeatedtask_2 = repeat repeatedtask_1 for J4_KK5 in uniform(1, 40, 10), reset=true
plot repeatedtask_2.J4_KK5 vs repeatedtask_2.J1_KK2
plot repeatedtask_2.time vs repeatedtask_2.MKK, repeatedtask_2.MKK_P
```

Seeded stochastic repeats `[T:notebooks]`:

```
timecourse1 = simulate uniform_stochastic(0, 4000, 1000)
timecourse1.algorithm.seed = 1003
repeat1 = repeat task1 for local.x in uniform(0, 10, 10), reset=true
```

Showing the effect of reset, side by side `[T:notebooks]`:

```
task1 = repeat task0 for k1 in uniform(0.0, 5.0, 5), reset = true
task2 = repeat task0 for k1 in uniform(0.0, 5.0, 5)
plot "Repeated task with reset"    task1.time vs task1.S1, task1.S2
plot "Repeated task without reset" task2.time vs task2.S1, task2.S2
```

A forcing function, via `onestep` + `piecewise` `[T:notebooks]`:

```
stepper = simulate onestep(0.1)
task0 = run stepper on model1
task1 = repeat task0 for local.x in uniform(0, 10, 100), \
        J0_v0 = piecewise(8, x<4, 0.1, 4<=x<6, 8)
```

## WHAT TO REPORT

1. What the archive contains — model and simulation description.
2. The scanned parameter id, its values, and the reset policy.
3. The seed, for anything stochastic.
4. That the archive was re-opened and re-run, and matched.
5. `te.printVersionInfo()` output, so a future reader knows what produced it.

## WHAT NOT TO DO

- Do not invent phraSED-ML syntax. The permitted sources contain no grammar
  document — only the constructs shown in Tellurium's own examples
  (`references/limits_and_discrepancies.md`).
- Do not ship SED-ML outside an archive.
- Do not treat `phrasedml.convertString` returning `None` as success — print
  `getLastPhrasedError()` `[T:notebooks]`.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/notebooks.html (the 1D and 2D parameter scans, forcing functions, reset comparison, seeded stochastic repeats, inline OMEX export/round-trip)
- https://tellurium.readthedocs.io/en/latest/API.html (COMBINE archive functions)
- https://tellurium.readthedocs.io/en/latest/antimony.html (local → global parameter renaming)
