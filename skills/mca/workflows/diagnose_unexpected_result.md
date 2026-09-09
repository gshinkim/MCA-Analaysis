# Workflow: Diagnose an Unexpected Result

Use when an MCA number looks wrong, impossible, or surprising: a theorem does not hold, a sign
is inverted, a coefficient is enormous or negative, a solver fails, or the biology "does not
make sense".

**Debug the assumptions and the calculation before inventing a biological explanation.** The
book models this discipline on the citrate synthase data (Ch 5.3), where a counter-intuitive
result is met with three candidate *methodological* explanations and the conclusion
*"there isn't enough data to make any firm conclusion"* - not a new hypothesis about E. coli.

Work the list in order. Most failures are found in the first four steps.

---

## 1. Was the model interpreted correctly?
- Is the **reaction list** complete? Transport steps, boundary-facing steps, both arms of every
  cycle. A missing step is the single most common cause of a failed summation check.
- Are **boundary vs floating** species correctly assigned? A floating species treated as fixed
  removes a whole summation/connectivity relation.
- Are **all regulatory interactions** identified? Read every rate law and list every species in
  it. A missing inhibition arrow breaks connectivity while leaving summation intact - that
  signature (summation passes, connectivity fails) points straight here.
- Is the **enzyme a linear multiplicative factor** in the rate law? If not, `ε^v_e ≠ 1` and the
  enzyme-based theorems do not apply as stated.

## 2. Was the correct operating point used?
- Elasticities are **not constants** - one measured at 2 mM cannot be reused at 20 mM.
- Are the elasticities and control coefficients from the **same** steady state?
- Were the conditions (illumination, feeding state, medium) the ones the question is about?
  Control is condition-dependent - Rubisco: 0.69-0.83 vs 0.05-0.2 depending on illumination.

## 3. Is the system actually at steady state?
- Did the solver converge? Is `ds/dt ≈ 0` everywhere?
- Is it the **intended** steady state? Bistable systems have several; the initial condition
  chooses. A time-course simulation can never land on an unstable one.
- Is the steady state **stable**? Compute the eigenvalues. An unstable state can still be
  returned by a solver.
- If the system is oscillating, there is no steady state to define coefficients at. Check for
  complex eigenvalues with positive real parts; check the feedback strength against the
  pathway-length threshold `-ε_feedback < sec^n(π/n)`.

## 4. Were species/reaction mappings preserved?
- Row/column orientation (eq 4.18 vs eq 4.19 layouts sum along different axes).
- Enzyme index vs metabolite index confusion (`E2` vs `S2`).
- Which flux does this FCC set belong to? Branched systems have one set per flux.
- After a **QR permutation** in conservation analysis, the species labels on the conservation
  columns are set by the permutation matrix - easy to lose.
- Did `getCC`'s second argument name an enzyme, or another parameter? The latter gives a
  response coefficient.

## 5. Are scaled and unscaled quantities being confused?
- The theorems are stated for **scaled** quantities. Unscaled `E^v_s` carries units and will not
  satisfy them.
- Jacobian construction uses **unscaled** elasticities: `J = N ∂v/∂s`, with
  `E^i_j = ε^i_j (v_i/s_j)`.
- A mixed expression is always wrong.

## 6. Was the coefficient computed correctly?
- Finite differences: one-sided or symmetric? Ch 2.2's comparison at a high-curvature point:
  5% step gave 2.55% error one-sided vs 0.7% three-point.
- Was the perturbation small enough for the local nonlinearity, and large enough to beat
  round-off?
- Was the parameter **restored** before the next perturbation?
- Was the steady state re-solved after each change?
- If derived symbolically: does the symbolic result pass the summation and connectivity checks?
  Check the limiting cases too.
- Double modulation specifically: the book's own worked example got `1.531` vs a true `1.69`
  from using 30% perturbations. Large perturbations break eq 5.3.

## 7. Does a conservation law alter the analysis?
- Compute `m - rank(N)`. If non-zero:
  - the **full Jacobian is singular**, so steady-state solvers, stiff integrators, sensitivity
    calculations and anything inverting the Jacobian will misbehave. This is the standard
    explanation for "the solver fails on my cycle model";
  - the implicit-differentiation route via eq 4.22 is unusable without modification;
  - the **standard connectivity theorems do not apply** to cycle species - use the modified
    form plus `Σ M_i C^{si}_{ej} = 0`;
  - species levels are **bounded** by `T`, so an "impossible" saturation may simply be the
    conservation limit.
- Fix: reduce the model (`s_d = L0 s_i + T`, `ds_i/dt = NR v`), or enable
  `conservedMoietyAnalysis`.
- Multicompartment models: the conserved quantity is **mass**, `Σ V_i s_i = T`, not the sum of
  concentrations.

## 8. Does the pathway topology invalidate a simple formula?
- `0 <= C^J <= 1` is a **linear-pathway** result. Branched and cyclic systems break it routinely
  (8.34, -8.51 in Ch 7.1). A negative FCC at a branch point is expected competition, not an error.
- **Front loading** applies only to unregulated pathways.
- Concentration control attenuating with distance fails for strictly linear kinetics, where all
  downstream `C^{sj}_{e1}` are equal.
- Summation applies per flux; do not mix coefficients from different fluxes.
- A branch point needs the **branch theorem** as a third equation - without it the system is
  under-determined and any "solution" is arbitrary.
- Under strong negative feedback, `C^J` of steps inside the loop legitimately goes to zero and
  the demand step legitimately goes to 1. That is theory, not a bug.

## 9. Are numerical precision or finite-difference errors important?
- Size of the residual vs the precision the inputs are quoted to.
- Round-off in row reduction of large stoichiometry matrices - the book warns of "dramatic
  failures" for genome-scale models and recommends SVD, QR-via-`L0`, or RRQR instead.
- Ill-conditioned elasticity matrix inversion (near-singular because of an unreduced cycle, or
  a near-equilibrium step driving elasticities to very large values).
- Differences smaller than the numerical uncertainty are not rankings.

## 10. Does the result genuinely represent unusual system behaviour?
Only reach here after 1-9 pass. Legitimate "surprising" results the source documents:
- **Negative flux control coefficients** at branch points - branches steal flux from each other.
- **Flux control coefficients far above 1** when the flux split is very asymmetric
  (`C^{J2}_e1 = 8.34`): a small stream beside a large river.
- **Every step "equally rate limiting"** (`+1, +1, -1`) with the right kinetic constants.
- **The regulated step having almost no flux control** while having a large loop gain
  (`C^J_e1 = 0.11`, loop gain 6.4).
- **Near-equilibrium steps carrying substantial flux control** in context (0.46 in the serine
  pathway under a glucose/ethanol regime).
- **Ultrasensitivity from linear kinetics** in dual cycles (first-order ultrasensitivity).
- **Bistability with no explicit positive feedback**, from competitive sequestration alone
  (the Markevich switch).
- **Identical concentration control coefficients** for every species downstream of a
  perturbation, under strictly linear kinetics.
- **Control shifting substantially** with external conditions.

If the result matches one of these, explain the **mechanism**, cite it, and say what would
distinguish it from an artefact.

---

## Fast triage by symptom

| Symptom | Look first at |
|---|---|
| `ΣC^J ≠ 1` | step 1 (missing reaction), step 3 (steady state), step 5 (scaling) |
| summation passes, connectivity fails | step 1 (missing regulatory arrow), step 7 (cycle) |
| connectivity gives 0 where -1 expected | step 4 (common vs distant species swapped) |
| sign inverted | step 4 (mapping), step 5 (scaling), step 8 (branch competition is real) |
| `|C^J| >> 1` | step 8 (branch/cycle - may be correct), step 6 (perturbation size) |
| solver fails / Jacobian singular | step 7 (unreduced conserved moiety) |
| coefficients drift between runs | step 3 (basin), step 6 (parameters not restored) |
| no steady state found | step 3 (oscillation/instability), step 1 (no sink, or a boundary species missing) |
| elasticity outside `[0,1]` for an irreversible MM step | step 1 (rate law is not what you assumed) |
| "biologically impossible" saturation | step 7 (conservation bound `T`) |

## What to report
State which check failed, what you changed, and whether the result survived. If it survives all
ten, present it as a genuine system property **with the mechanism named** - and, following the
source's example, say plainly if the data are insufficient to conclude.

## Source
Chapter: 2.2 (finite differences); 4.5 (matrix layouts, eq 4.22 limitation); 5.3, 5.5
(counter-intuitive data, perturbation size); 6.1-6.5 (linear-pathway bounds and caveats);
7.1 (negative and large FCCs); 8.3-8.4 (feedback moving control); 9.4 (bistability, basins);
11.4, 11.7 (numerical instability, singular Jacobian); 12.3-12.5 (cycle theorems, sequestration)
Pages: book p13, p65-69, p77-83, p93-106, p116-118, p135-142, p158-167, p195-217, p226-241
(PDF 21, 73-77, 85-91, 101-114, 124-126, 143-150, 166-175, 203-225, 234-249)
