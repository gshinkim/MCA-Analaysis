# Workflow: Analyze a Model (general MCA)

Use when given a pathway, a kinetic model, or a described network and asked what controls it.
Skip phases the question does not need, but never skip Phase 1, Phase 2 or Phase 5.

---

## PHASE 1 - MODEL INSPECTION

Establish, in writing, before touching any number:

- **Species**: every floating species.
- **Boundary species**: which are fixed (`$X` in Antimony). These are **parameters**; their
  influence is a *response*, not a *control*.
- **Reactions**: every one, including transport steps and both arms of every cycle. This list
  is what the summation theorems sum over - getting it wrong invalidates every later check.
- **Parameters**: enzyme levels, rate constants, `Km`, `Keq`, cycle totals `T`.
- **Rate laws**: for each reaction. Note the family (mass action, reversible/irreversible MM,
  Hill), and whether the enzyme appears as a **linear multiplicative factor** (needed for
  `ε^v_e = 1`).
- **Topology class**: linear / branched / cyclic (futile) / feedback / moiety-conserved /
  a combination. **This determines which theorem set is legal.** -> `references/linear_pathways.md`,
  `branched_and_cyclic_systems.md`, `negative_feedback.md`, `conserved_cycles.md`.
- **Conservation relationships**: compute `rank(N)`; number of laws = `m - rank(N)`.
  `r.conservedMoietyAnalysis = True; r.getConservationMatrix()`, or row-reduce the augmented `N`.
  -> `references/moiety_conservation.md`.
- **Regulatory interactions**: **read every rate law and list every species that appears in it.**
  A species in a rate law that is neither substrate nor product is a regulator and contributes
  an extra elasticity and an extra connectivity term. Diagrams routinely omit these.

Output of Phase 1: a species/reaction/parameter inventory, a topology label, a conservation
law list, and a regulator list.

## PHASE 2 - OPERATING STATE

- **Is a steady state required?** For control coefficients, elasticities-in-context, and every
  theorem: yes. For a pure rate-law elasticity question: no.
- **Solve for it**: `r.steadyState()` / `r.getSteadyStateValues()`.
- **Confirm convergence**: `ds/dt ≈ 0` for all floating species.
- **Confirm which steady state**: bistable systems have several, and the initial condition
  selects one. -> `references/stability.md`.
- **Confirm stability**: `r.getEigenvalues()`; all real parts negative.
- **Record** the steady-state concentrations, all fluxes, the conserved totals `T` and the mole
  fractions `M_i` if there are cycles.
- **Record the conditions**. Control is condition-dependent (Rubisco: 0.69-0.83 vs 0.05-0.2).

If no steady state can be established, stop and say so. Everything downstream is undefined.

## PHASE 3 - LOCAL ANALYSIS

- Decide **which** elasticities the question needs. You rarely need all of them.
- Decide **scaled or unscaled**. Scaled `ε` for the theorems; unscaled `E` for the Jacobian.
- Obtain them: analytically (differentiate + scale, or use the Table 2.3 rules), or numerically
  (`r.getEE(reaction, species)`, or a symmetric three-point perturbation).
- Note the **operating point** - elasticities are not constants.
- Where useful, note the **disequilibrium ratio** `ρ = Γ/Keq` per step: it summarises
  substrate/product elasticities as `1/(1-ρ)` and `-ρ/(1-ρ)`, and eq 6.9 lets you read the
  relative flux-control distribution off `ρ` values and equilibrium constants alone.
-> `references/elasticities.md`.

## PHASE 4 - GLOBAL CONTROL ANALYSIS

- **Flux control coefficients**, one full set **per flux**. `r.getCC(fluxId, enzymeParam)`, or
  from the theorems, or from an analytic flux expression.
- **Concentration control coefficients**, one full set per species.
- **Response coefficients** where an external factor matters:
  `R^J_x = Σ_i C^J_ei ε^{vi}_x`. Also `R^s_T`, `R^J_T` for cycle totals.
- If deriving symbolically, pick the method from
  `references/deriving_control_equations.md` and reuse Appendix B where the topology matches.
- Note explicitly whether each `getCC` second argument is an enzyme concentration (giving a
  control coefficient) or another parameter (giving a response coefficient).

## PHASE 5 - VALIDATION (mandatory)

Run `references/validation_rules.md` in order:
1. Steady state converged and stable; correct basin.
2. Summation: `ΣC^J = 1` per flux; `ΣC^s = 0` per species; **over all steps**.
3. Connectivity: `ΣC^J ε = 0`; `ΣC^{sk} ε_{sk} = -1`; `ΣC^{sm} ε_{sk} = 0`; **over interacting
   reactions only**, including regulatory ones.
4. Branch-point theorems at every branch; **modified cycle theorems** for conserved cycles
   (`Σ M_i C^{si}_{ej} = 0`, `Σ M_i R^{si}_T = 1`).
5. Conservation totals constant; `N^T Γ^T = 0`.
6. Signs and magnitudes against the expected patterns for this topology.
7. Numerical hygiene: symmetric perturbations, restored parameters, one steady state throughout.

Report residuals and the tolerance you judged them against, plus the basis for that tolerance.
**Do not proceed to Phase 6 on a failed check** - go to `diagnose_unexpected_result.md`.

## PHASE 6 - INTERPRETATION

Load `references/interpretation_rules.md`. Cover:

- **Distribution of control**: where it sits, how concentrated, average vs actual.
- **Dominant vs weak control**: rank only where differences exceed uncertainty; **report ties
  as ties**.
- **Metabolite responses**: which steps raise/lower which species, and by how much.
- **Effects of feedback**: is the regulated step a poor flux controller? What is the loop gain?
  Has control moved to the demand step?
- **Unexpected signs and magnitudes**: negative FCCs at branch points (competition); `|C| > 1`
  from asymmetric flux splits or cycles - explain the mechanism, do not just note the number.
- **Biological implications**: what an intervention would do (`δJ/J = Σ C^J_ei δe_i/e_i`, small
  changes only); which targets are viable given `R^J_x = C^J_ei ε^{vi}_x`; whether metabolite
  levels are bounded by a conservation law.

Keep the mathematical statements and the biological reading visibly separate.

## PHASE 7 - REPORT

```
OBSERVATIONS
  topology, species, reactions, boundary species, regulators, conservation laws, conditions

CALCULATIONS
  steady state; elasticities (with operating point); control coefficients (with mappings);
  response coefficients; method used for each

THEORETICAL CONCLUSIONS
  what the theorems entail, stated as mathematics

INTERPRETATION
  biological reading, clearly labelled as interpretation

ASSUMPTIONS
  steady state; ε^v_e = 1; irreversibility / product insensitivity where assumed;
  negligible sequestration; unit volumes; constant T; small-perturbation linearity;
  timescale separation for conserved moieties

UNRESOLVED
  what could not be determined and what would be needed
```

## Routing shortcuts
- Question is only about one rate's sensitivity -> Phases 1, 3 only.
- User already supplied the coefficients -> `interpret_mca_results.md`.
- User wants a symbolic equation -> `derive_control_relationship.md`.
- Only a consistency check is wanted -> `validate_mca_results.md`.
- A result looks impossible -> `diagnose_unexpected_result.md`.

## Source
Chapter: pipeline assembled from 3.2 (operational definition), 4.5 (derivation),
5.7 (simulation practice), 9 (steady state and stability), 11.7 (model reduction),
12.4 (cycle theorems)
Pages: book p35, p64-69, p84-85, p145-152, p215-217, p230-233
(PDF 43, 72-77, 92-93, 153-160, 223-225, 238-241)
