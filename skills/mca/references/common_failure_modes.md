# Common Failure Modes

Ranked by how much damage they do. Each entry: the error, why it is wrong per the source, and
the correct move.

---

## 1. THE RATE-LIMITING STEP FALLACY (the big one)

**The error.** Concluding that a reaction controls a pathway's flux because it is:
- slow,
- irreversible,
- near the start of the pathway / the "committed step",
- highly regulated / allosteric,
- far from equilibrium,
- has the lowest substrate affinity (highest `Km`),
- traditionally described as rate-limiting,
- identified by a cross-over experiment.

**Why it is wrong.** Those are exactly the criteria the book lists as the traditional
framework and then dismantles (Ch 1.3, Ch 3.5). Its diagnosis: the framework was *"derived
largely through an intuitive approach using faulty analogies, and based neither on
experimental evidence or mathematical reasoning."* The root confusion is *"a failure to
realize that rates in cellular networks are governed by the law of mass-action. That is, if a
concentration changes, then so does its rate of reaction."* Traffic-jam and checkout-queue
analogies work only because those systems are **not** mass-action systems - there the flow
genuinely does not depend on how many cars or customers are queued.

Specifics the source supplies:
- **At steady state there are no slow or fast steps.** In a linear chain
  `v1 = v2 = ... = vn = J` (Ch 3.2).
- **The committed step is not necessarily the controlling step.** The book's own three-step
  Tellurium example gives `C^J_e1 = 0.37, C^J_e2 = 0.13, C^J_e3 = 0.50` - "almost 50% of
  control is located on the last step". The serine pathway gives `C^J_{1,2} = 0.03`,
  `C^J_3 = 0.97`.
- **Regulated steps tend to have SMALL flux control.** Ch 8.3 proves it: as feedback strengthens,
  `C^J_e3 -> 1` (the demand step) and `C^J_e1, C^J_e2 -> 0`. *"Allosteric enzymes, when part of a
  negative feedback loop, are very poor controllers of flux."*
- **PFK.** Heavily regulated, non-equilibrium, early in glycolysis - and repeatedly measured
  to have a small flux control coefficient. Ten citations are given for this.
- **Rubisco.** Long asserted to be rate limiting; measured flux control 0.69-0.83 at high
  illumination but **0.05-0.2** at moderate illumination or high CO2. Control is not fixed.
- **Near-equilibrium steps can still carry substantial control**, depending on context - the
  serine pathway under a glucose/ethanol regime gives 0.46 to a near-equilibrium group.
- **In branched and cyclic systems FCCs can exceed 1 and be negative**, which makes the binary
  label incoherent: *"what adjective should we use: hyper-rate-limiting steps, super-bottleneck,
  extreme-choke points?"*
- **The cross-over theorem** is applicable to the electron transport chain, but its use to
  identify sites of regulation in metabolic pathways "has been considered on theoretical
  grounds to be untrustworthy".
- **The classic rate-limiting step** (`C^J_e1 = 1`) requires complete product insensitivity of
  the first step. *"Such a situation is likely to be rare in real pathways. In fact, the classic
  rate limiting step has almost never been observed experimentally."*

**The correct move.** Determine control **quantitatively**: compute or measure the control
coefficients, or derive them from elasticities via the theorems. Then report a value, not a
label. The book's own recommendation: *"it is better to assign a value to the
rate-limitingness of a particular step in a pathway rather than designate a given reaction step
as either rate-limiting or not."*

If asked "is X rate limiting?", answer with the coefficient and its conditions; if you have no
coefficient, say what you would need to compute one.

---

## 2. Substituting a local quantity for a global one
Treating a large elasticity as evidence of large flux control. The connectivity theorem gives
the opposite tendency (`C^J_e1/C^J_e2 = -ε^2_1/ε^1_1`): large elasticities tend to go with
small flux control, because species with high elasticities oppose rate changes effectively.
And the ratio alone is not enough - all ratios along the pathway plus the summation theorem
are needed to fix an absolute value.
**Correct move**: write the theorem down. Never convert `ε` into `C` by intuition.

## 3. Assuming a steady state that was never established
Control coefficients are defined only at a steady state. A transient, an unconverged solve, or
the wrong basin of a bistable system all silently produce meaningless numbers.
**Correct move**: verify `ds/dt ≈ 0`, verify the eigenvalues, and say which steady state.

## 4. Generalising a linear-pathway result to another topology
The most frequent instances:
- `0 <= C^J <= 1` - a **linear-pathway** result. Branches routinely break it (8.34, -8.51).
- Front loading - only for **unregulated** pathways. Adding feedback changes the picture.
- Concentration control attenuating with distance - **false** for strictly linear kinetics,
  where all `C^{sj}_{e1}` downstream of the perturbation are equal.
- Standard connectivity theorems - **modified** for moiety-conserved cycles.
- Summation across coefficients belonging to different fluxes in a branched system.
**Correct move**: classify the topology first, then pick the theorem set.

## 5. Losing the mapping
Reporting "the control coefficient" without saying which flux, which species, which enzyme,
scaled or unscaled. In a single branch point there are 9 FCCs and 3 CCCs.
**Correct move**: label every number fully before interpreting it.

## 6. Reusing an elasticity from a different operating point
> An elasticity is not like a `Km` or `Ki` ... Kinetic constants do not in general depend on
> the concentrations of the effectors; **elasticities do**.

The book's example: it makes no sense to use an elasticity measured at 2 mM substrate at a
substrate concentration of 20 mM.
**Correct move**: recompute at the current operating point; state the operating point.

## 7. Ignoring conserved moieties
Consequences: a **singular Jacobian**, so steady-state solvers, stiff integrators, sensitivity
calculations and frequency analysis all fail; the implicit-differentiation route (eq 4.22)
becomes unusable; and the standard connectivity theorems give wrong answers for cycle species.
**Correct move**: detect conservation laws, reduce the model, use the modified cycle theorems.

## 8. Treating approximate equality as exact
`ΣC^J = 0.99997` is a residual, not a proof, and not a violation either. The source gives no
universal tolerance; it depends on precision, method and step size.
**Correct move**: report the residual and the method; state your tolerance and its basis.

## 9. Finite perturbations treated as infinitesimal
Both elasticities and control coefficients are defined for infinitesimal changes. Using
`ΔJ/ΔE` with large finite changes makes the value depend on the perturbation size, because
rate laws are nonlinear.
The book's own worked failure: **double modulation** with 30% perturbations returned
`ε^2_1 = 1.531, ε^2_2 = -1.144` against true values `1.69, -1.3`. Its diagnosis names both
rounding and, "more importantly, relatively large perturbations".
**Correct move**: small symmetric perturbations, three-point estimates, and where possible
several perturbation sizes extrapolated back to zero.

## 10. Inventing biology to explain a numerical artefact
The book models the right instinct on the citrate synthase data: an FCC that *decreases* as
enzyme activity decreases is counter-intuitive, and the three candidate explanations offered
are (i) the data could be wrong, (ii) the straight-line fit is inappropriate, (iii) unrecorded
changes to other enzymes. Conclusion: *"there isn't enough data to make any firm conclusion."*
**Correct move**: run [[diagnose_unexpected_result]] before reaching for biology.

## 11. Confusing control with regulation
An enzyme can be a poor **flux controller** and an excellent **regulator**. The measure of
regulatory effectiveness is the **loop gain**, not the flux control coefficient. In the book's
worked case: strong feedback gives `C^J_e1 = 0.11` and loop gain `6.4`; weak feedback gives
`C^J_e1 = 0.8` and loop gain `0.16`.
**Correct move**: when the question is "does this enzyme matter?", compute both.

## 12. Judging a regulator from its own elasticity
The loop gain has two factors: the signal's effect on the regulated step, **and** the
transmission of that signal through the pathway. Weak transmission elasticities make even a
strongly regulated step an ineffective regulator.

## 13. Modelling with product-insensitive rate laws
> This highlights again the danger of using rate laws in models that are product insensitive
> because the use of such rate laws often give misleading or trivial results of no real
> interest. (Ch 7.2)

Product insensitivity on the first step forces `C^J_e1 = 1` and zeroes everything downstream -
an artefact of the rate law, not a finding.

## 14. Ultrasensitivity claims that cannot hold
A single conserved cycle with both enzymes unsaturated has `C^p_e1 = M_s/(M_p + M_s) <= 1` -
**no ultrasensitivity is possible**. Claiming it means either the enzymes are saturated (check
the elasticities), or there are multiple cycles (first-order ultrasensitivity), or
sequestration is at work.
Also: mixing the two definitions of `R` (`S_0.9/S_0.1` vs `dln Y/dln X`) inverts the direction
of the inequality - `R < 81` versus `R > 1`.

## 15. Advising an intervention from binding affinity alone
`R^J_x = C^J_ei · ε^{vi}_x`. A potent inhibitor of a step with no control changes nothing.
> an effective external factor, such as a pharmaceutical drug, must not only be able to bind and
> inhibit the enzyme or protein being targeted, but the step itself must be able to transmit the
> disturbance to the rest of the pathway and ultimately affect the phenotype.

## 16. Trusting a fitted model
Ch 5.7: models built by fitting all parameters simultaneously "fitted the experimental data but
failed when an attempt was made to use the model to predict behaviour beyond the scope of the
fitted model, indicating that the model had failed to generalize." The validated approach is
iterative: compute FCCs, re-measure the high-control enzymes' kinetics **under physiological
conditions**, update, repeat.

## 17. Importing MCA theory the source does not contain
See [[source_map]] for the list and the required wording.

## Related concepts
[[conceptual_foundations]], [[interpretation_rules]], [[validation_rules]],
[[control_coefficients]], [[elasticities]], [[negative_feedback]], [[conserved_cycles]]

## Source
Chapter: 1.2-1.3; 3.2, 3.5; 4.2, 4.3; 5.3, 5.5, 5.7, 5.8; 6.1-6.5; 7.1-7.2; 8.3-8.4;
11.7; 12.3
Section: Prevailing Ideas; Rate-limiting steps; Interpretation; Sensitivity Control;
Double Modulation Technique; By Computer Simulation; Numerical Stability
Pages: book p3-5 (PDF 11-13); p33 & p46-49 (PDF 41, 54-57); p60-63 (PDF 68-71);
p77-87 (PDF 85-95); p93-106 (PDF 101-114); p117-122 (PDF 125-130); p135-142 (PDF 143-150);
p216-217 (PDF 224-225); p227 (PDF 235)
