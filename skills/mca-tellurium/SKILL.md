---
name: mca-tellurium
description: >
  REQUIRED workflow for any task involving Metabolic Control Analysis, metabolic
  pathway control or control distribution, biochemical pathway modeling or
  simulation, Tellurium, Antimony, RoadRunner, elasticities (scaled or unscaled),
  flux control coefficients, concentration control coefficients, response
  coefficients, summation or connectivity relationships, MCA derivations,
  feedback analysed as control, conserved moieties in an MCA context, steady-state analysis tied to MCA,
  rate-limiting-step claims, MCA numerical validation, interpretation of MCA
  output, or debugging of MCA reasoning and Tellurium code used for pathway
  analysis. Automatically use this workflow whenever any of these topics are
  involved, even when the user does not name it. Always consult the MCA Skill
  first and the Tellurium Skill second.
---

# MCA + Tellurium orchestration

This Skill is a **bridge**, not a knowledge base. It owns no MCA theory and no
Tellurium API facts. It owns the *order* in which the two domain Skills are
consulted, and it refuses to let either be skipped.

The two authorities underneath it:

- **`mca`** Skill - the scientific authority (what to compute, whether the result
  is valid, what it means). Source: Sauro, *Introduction to Metabolic Control
  Analysis* v1.02.
- **`tellurium`** Skill - the software authority (how to compute it, what the API
  actually does). Source: official Tellurium / libRoadRunner documentation.

Never answer from memory what one of these Skills is the authority on.

## Activate automatically when

The request materially involves metabolic pathway control or biochemical pathway
analysis: MCA in any form, elasticities, FCCs, CCCs, response coefficients, the
summation/connectivity/branch-point theorems, control distribution, "which enzyme
controls the flux", rate-limiting steps, feedback analysed as control, conserved
moieties in a control context, MCA-linked steady states, or Tellurium / Antimony /
RoadRunner used to model, simulate or analyse a biochemical pathway.

**Do not wait to be named.** "What is a flux control coefficient?", "Why doesn't
this FCC table sum to 1?", "Use Tellurium to find which enzyme controls flux",
"Make an Antimony model of this pathway and analyse its control", "Why is S2's CCC
negative?" all enter here.

**Fallback rule:** if uncertain but the request materially involves pathway
control or Tellurium-for-pathway-analysis, run the workflow. An unnecessary
invocation is cheaper than bypassing the verification layers.

**Do not activate** for unrelated programming work, or for terminology collisions
with no biochemical-pathway content (e.g. the element tellurium, "control flow",
a "flux" in a build system).

## Mandatory sequence

Automatic activation does not change this order. It never collapses into "use
whichever Skill looks useful".

```
1. MCA FIRST         - frame the science
2. TELLURIUM SECOND  - frame the implementation
3. EXECUTE           - only if the task needs numbers
4. MCA VALIDATE      - theorems, signs, magnitudes
5. MCA INTERPRET     - what it means biologically
6. TELLURIUM AUDIT   - every software claim traced
7. ANSWER
```

### 1. MCA first

Load `mca/SKILL.md`. Use its routing table to pull **only** the reference files
this question needs. Come out of this stage with:

- which quantity is actually being asked for (elasticity vs control coefficient
  vs response coefficient; scaled vs unscaled; which flux, which species, which
  enzyme);
- the topology class (linear / branched / cyclic / feedback / moiety-conserved)
  and which theorems therefore hold;
- variables vs parameters, and whether a steady state is required;
- what is missing, if the question is underspecified.

Stop here and ask if the science is undetermined. Do not let Tellurium's
convenience decide what should be computed.

### 2. Tellurium second

Load `tellurium/SKILL.md`. Route to the minimum set of its references for the
analysis stage 1 specified. Come out with:

- the documented calls and arguments (never a remembered signature);
- the model-building path if a model must be written (Antimony);
- the traps that apply here - amounts vs concentrations, scaled vs unscaled,
  full vs reduced, reset semantics, steady state vs last time point.

Even a pure-theory question passes through this stage: it establishes the
computational context, and confirms whether a claim about the software is being
made at all. Keep it proportionate - a definition question needs a glance, not a
full API sweep.

### 3. Execute

Only when the task calls for numbers. Reach a steady state before reading any
control coefficient. Report the residual. Keep the code minimal and runnable.

### 4. Return to MCA - validate

Back to the `mca` Skill (`references/validation_rules.md`,
`references/summation_theorems.md`, `references/connectivity_theorems.md`, plus
whatever the topology needs). Check summation, connectivity, branch-point and
cycle relations that hold for *this* topology, signs, magnitudes, conservation
constraints. A number that fails validation is not reported as a result - it is
diagnosed (`mca/workflows/diagnose_unexpected_result.md`, then
`tellurium/workflows/diagnose_failure.md`).

### 5. Return to MCA - interpret

`mca/references/interpretation_rules.md` and `common_failure_modes.md`. Keep the
mathematics and the biology labelled separately. State assumptions.

### 6. Tellurium software audit

Before answering, re-check every software-specific claim against the
`tellurium` Skill. Anything the documentation does not establish is stated as
not established, with the runtime check offered instead.

## Progressive disclosure

Both Skills are mandatory on every run. **Every reference file is not.** Let each
Skill's own routing table pick the smallest relevant set. Loading either
knowledge base wholesale is a defect, not thoroughness.

## Hand-off shortcuts

| Task | MCA entry | Tellurium entry |
|---|---|---|
| analyse a pathway end to end | `workflows/analyze_model.md` | `workflows/build_and_simulate.md`, `workflows/run_control_analysis.md` |
| compute FCCs / CCCs / elasticities | `references/computational_mca.md` | `workflows/run_control_analysis.md`, `references/metabolic_control_analysis.md` |
| user pasted numbers or a table | `workflows/interpret_mca_results.md` | `references/metabolic_control_analysis.md` (only if provenance is in doubt) |
| result looks wrong | `workflows/diagnose_unexpected_result.md` | `workflows/diagnose_failure.md` |
| build the model | `references/linear_pathways.md` / topology file | `references/antimony_basics.md` |
| steady state in question | `references/stability.md` | `references/steady_state.md` |
| conserved moieties | `references/moiety_conservation.md` | `references/structural_analysis.md` |
| pure definition / theory | routing table of `mca/SKILL.md` | glance only |

## Non-negotiable

1. No MCA claim that is not traceable to the `mca` Skill's source.
2. No Tellurium claim that is not traceable to the `tellurium` Skill's source.
3. MCA before Tellurium, always. Validation before interpretation, always.
4. Never guess theory, syntax, an API signature, or a numerical result.
5. Never report a coefficient obtained away from a verified steady state.
6. Say what is missing rather than filling a gap with a plausible invention.
