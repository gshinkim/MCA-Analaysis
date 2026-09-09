# Interpretation Rules

Load this before stating any conclusion. It converts numbers into claims that the source
actually supports.

## Rule 0 - Separate the layers explicitly
Every answer should keep four things visibly apart:
1. **Observations** - what the model/data says (topology, values, conditions).
2. **Calculations** - what you computed, and how.
3. **Mathematical conclusions** - what the theorems entail.
4. **Biological interpretation** - what it might mean in the cell.
Plus **assumptions** and **unresolved issues**.

Never let (4) contaminate (3). *"Regulation and control are systemic properties of a pathway"*
is a mathematical statement; "PFK is not the pacemaker of glycolysis" is a biological claim
that rests on it plus experimental data.

## Rule 1 - Name the mapping before you name the meaning
Before interpreting any coefficient, state:
- which **flux** (branched systems have one full set per flux);
- which **species**;
- which **enzyme/parameter** was perturbed;
- **scaled or unscaled**;
- at which **operating point / conditions**.

## Rule 2 - Elasticity is not control
A large elasticity does **not** mean a large control coefficient. The connectivity theorem
implies the opposite tendency: `C^J_e1/C^J_e2 = -ε^2_1/ε^1_1`, so large elasticities go with
small flux control. But it is the **ratio**, considered along the whole pathway together with
the summation theorem, that fixes an absolute value.

> The examination of a single enzyme will not give an indication of the ability of that enzyme
> to control the flux or species concentrations. (Ch 4.2)

## Rule 3 - Signs

| Observation | Reading supported by the source |
|---|---|
| `ε` positive | that effector speeds this reaction up (reactant, activator) |
| `ε` negative | slows it down (product, inhibitor, feedback signal) |
| `ε^v_e = 1` | rate is proportional to enzyme - expected, not informative |
| `C^J_e > 0` | raising this enzyme raises this flux |
| `C^J_e < 0` | **expected at branch points**: branches compete for flux; also occurs in cycles |
| `C^s_e > 0` | this step, in net effect, supplies the metabolite |
| `C^s_e < 0` | this step, in net effect, drains it |
| in a linear chain, one negative CCC and the rest positive | the species sits immediately downstream of the negative step (Ch 3 Ex 9) |

## Rule 4 - Magnitudes

| Range | Reading | Where it is valid |
|---|---|---|
| `0 <= C^J <= 1` | ordinary shared control | **linear pathways with normal sign patterns only** (Ch 6.1) |
| `C^J = 1` for one step, 0 for the rest | classic rate-limiting step | occurs when step 1 is product-insensitive; "almost never been observed experimentally" |
| `C^J >> 1` or `<< 0` | branch or cycle amplification | branched/cyclic systems (Ch 7.1: 8.34 and -8.51) |
| `C^J ≈ 1/n` | the average in an n-step chain | linear chains |
| `R^Y_X > 1` | ultrasensitive (MCA definition) | cycles, cascades, branch points |

**Never quote a bound without the topology it belongs to.**

## Rule 5 - Ranking and ties
When ranking coefficients:
- Rank only when the differences exceed the numerical uncertainty of how they were obtained.
- **Report ties and near-ties as ties.** Ch 5.8 serine pathway at one feeding state gives 0.46
  and 0.54 - the book's reading is *"neither step dominates"*, not "step 3 is the controlling step".
- Do not manufacture a strict ordering from noise.
- Rank within one flux's set. Do not rank across different fluxes.

## Rule 6 - Distribution statements the source licenses
- Flux control is shared; a single step having exclusive control is unlikely.
- If one step gains control, others must lose it (summation).
- The distribution is dynamic and condition-dependent (Rubisco: 0.69-0.83 vs 0.05-0.2).
- The committed/first step is **not** necessarily the controlling step (Ch 3.5 example puts
  ~50% on the last step; Ch 5.8 serine pathway puts 0.97 on the last step).
- Many small coefficients explain why a 50% loss of one enzyme often has no phenotype
  (metabolic dominance/recessiveness).

## Rule 7 - Near-equilibrium and product-insensitive steps
- Near equilibrium -> **likely** small flux control, and little influence over concentrations
  in a linear pathway. Say "likely", and check the context: *"there may be other steps that are
  even closer to equilibrium"*, and Ch 5.8 shows a near-equilibrium group carrying 0.46.
- Downstream of a product-insensitive step -> **no** flux control (linear, unregulated).
- A product-insensitive step carries `C^J = 1` only if it is the **first** step.

## Rule 8 - Feedback
- A step regulated by negative feedback **tends to have small flux control**. Do not read that
  as "unimportant".
- Measure regulatory importance by the **loop gain** `= -ε_feedback · uC^s_e1`, which includes
  the transmission elasticities. A strongly regulated step with weak transmission is a weak
  regulator.
- Under strong feedback, flux control migrates to the **demand** step outside the loop, and
  disturbances inside the loop stop affecting the signal species or the flux.
- Front loading does not apply to regulated pathways.

## Rule 9 - Conserved cycles
- Species levels are bounded by `T`. Say so before discussing "increases".
- A single cycle with unsaturated enzymes **cannot** be ultrasensitive.
- Distinguish zero-order (one cycle, saturable) from first-order (multiple cycles, linear
  kinetics) ultrasensitivity.
- Apparent regulation can arise from competitive sequestration with no allosteric mechanism
  at all (Markevich switch). Do not invent a molecular mechanism for it.
- `T` is a legitimate perturbation and a realistic drug target.

## Rule 10 - Response coefficients and interventions
`R^J_x = C^J_ei ε^{vi}_x`. Both factors must be non-negligible for an intervention to work.
State both when advising on a drug target or an engineering target. A potent inhibitor on a
step with `C^J_e ≈ 0` will do nothing to the flux.

For metabolic engineering, the actionable prediction is
`δJ/J = Σ_i C^J_ei (δe_i/e_i)` - and it is only valid for **small** changes.

## Rule 11 - Approximate equality is approximate
Summation and connectivity residuals are numerical. Report the residual, state how the
coefficients were obtained, and do not present "1.0000" as proof. The source specifies no
universal tolerance.

## Rule 12 - Say what would change the answer
Close an interpretation by naming the assumption most likely to overturn it: a missing
regulatory arrow, an unverified steady state, an operating point different from in vivo, a
neglected conserved moiety, an unmodelled branch.

## Rule 13 - Do not import outside theory
If the question needs machinery the book does not contain (hierarchical control analysis with
genetic regulation, frequency-domain MCA, general matrix-based MCA, detailed sequestration and
channeling, complex branched systems), say so in the standard wording - see [[source_map]].

## Related concepts
[[validation_rules]], [[common_failure_modes]], [[control_coefficients]],
[[response_coefficients]], [[negative_feedback]], [[conserved_cycles]]

## Source
Chapter: distilled from 3.5, 4.2, 4.3, 5.3, 5.8, 6.1-6.5, 7.1, 8.3-8.5, 12.2-12.6
Section: as cited inline
Pages: book p46-49, p60-63, p77-78, p85-87, p93-106, p117-118, p135-142, p223-249
(PDF 54-57, 68-71, 85-86, 93-95, 101-114, 125-126, 143-150, 231-257)
