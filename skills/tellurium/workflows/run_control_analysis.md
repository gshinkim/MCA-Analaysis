# Workflow — Metabolic control analysis with Tellurium

Use for "which step controls the flux", "compute the control coefficients",
"how sensitive is S2 to k1", "get the elasticity matrix".

Reference: `metabolic_control_analysis.md`. The theory of what the coefficients
mean beyond libRoadRunner's definitions is **not** in this Skill's source set —
see PHASE 6.

## PHASE 0 — Decide which quantity is actually wanted

| The question | The quantity |
|---|---|
| how one reaction rate responds to a metabolite/effector, everything else clamped | **elasticity** — `getEE` / `getScaledElasticityMatrix` |
| how a steady-state **flux** responds to a perturbation at one step | **flux control coefficient** — `getCC('J..', p)` / `getScaledFluxControlCoefficientMatrix` |
| how a steady-state **concentration** responds to a perturbation at one step | **concentration control coefficient** — `getCC('S..', p)` / `getScaledConcentrationControlCoefficientMatrix` |
| response to an external effector (boundary species, drug) | control coefficient with respect to that parameter — the parameter argument may be a boundary species `[L:rr/cls_RoadRunner]` |
| how the output spreads under a ±X% parameter sweep | **not** a control coefficient — `parameter_scans.md` |

Write down which one before computing anything.

## PHASE 1 — Reach and verify a steady state

Run `workflows/analyze_steady_state.md` first. These routines run the
steady-state solver internally — `getSteadyStateThreshold()` is described as "the
threshold used in steady state solver in routines such as `getCC()`"
`[L:rr/cls_RoadRunner]` — so a model that will not converge produces numbers that
mean nothing.

```python
if r.getNumConservedMoieties() > 0:
    r.conservedMoietyAnalysis = True
residual = r.steadyState()
assert residual < 1e-6, residual
```

## PHASE 2 — Fetch the labels first

```python
rxn_ids = r.getReactionIds()
sp_ids  = r.getFloatingSpeciesIds()
par_ids = r.getGlobalParameterIds()
```
`[T:tellurium_methods]`

Matrix rows and columns follow these orders. Antimony has renamed reaction-local
parameters to `<reaction>_<param>` `[T:antimony]` — `par_ids` is where you find
the real names to pass to `getCC`/`getEE`.

## PHASE 3 — Compute

```python
E   = r.getScaledElasticityMatrix()                        # rows: reactions, cols: species
FCC = r.getScaledFluxControlCoefficientMatrix()            # n x n, reactions
CCC = r.getScaledConcentrationControlCoefficientMatrix()   # m x n, species x reactions
```
`[L:rr/cls_RoadRunner]`

Or single coefficients:

```python
r.getCC('J1', 'Vmax')
r.getEE('J1', 'Vmax')
r.getValue("cc(S1, J4_KS4)")     # selection form
```
`[L:rr/cls_RoadRunner]`, `[L:rr/selecting_values]`

**Pick scaled or unscaled once and stay there.** Never put both in one table.

## PHASE 4 — Test the numbers before interpreting them

These are numerical derivatives. Vary the step and see whether the answer moves:

```python
h0 = r.getDiffStepSize()
for h in (h0/10, h0, h0*10):
    r.setDiffStepSize(h)
    r.steadyState()
    print(h, r.getScaledFluxControlCoefficientMatrix())
r.setDiffStepSize(h0)
```
`[L:rr/metabolic]`, `[L:rr/cls_RoadRunner]`

A coefficient that changes materially with the step size is a numerical artefact.
Also re-check the steady-state residual after changing the step.

## PHASE 5 — Present as a labelled table

Never hand back a bare matrix. Build the table with the id lists from PHASE 2,
and state in the caption:

- scaled or unscaled;
- rows and columns (which flux, which species, which reaction);
- the steady-state residual it was computed at;
- the `DiffStepSize` used, and whether the values were stable across step sizes;
- whether conservation analysis was enabled.

Rank coefficients only when the differences survive PHASE 4, and call near-ties
near-ties.

## PHASE 6 — Interpret, and mark the boundary

The permitted sources define elasticities (local, other effectors unchanged) and
control/response coefficients (systemic, at a steady state) `[L:rr/metabolic]`.
Interpretation that stays inside those definitions is supported.

They do **not** state the summation theorem, the connectivity theorems, or bounds
on magnitude. If asked to check that flux control coefficients sum to 1, or to
infer control from elasticities via connectivity, say:

> The Tellurium documentation and the sources it links define these coefficients
> and provide the calls that compute them, but do not state the MCA theorems.

and hand off to a dedicated MCA source (this repository has an `mca` Skill for
the theory).

## Non-negotiables

1. No coefficient without a verified steady state and its residual.
2. No mixing of scaled and unscaled.
3. No matrix element read without its id labels.
4. Elasticity ≠ control coefficient. Never substitute one for the other.
5. `getCC('J..', p)` and `getCC('S..', p)` are different coefficients — say which.
6. No biological story about a difference that has not survived a change of
   `DiffStepSize`.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/antimony.html (local → global parameter renaming)

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/metabolic.html
- https://libroadrunner.readthedocs.io/en/latest/selecting_values.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
