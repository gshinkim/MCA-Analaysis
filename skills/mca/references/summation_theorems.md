# Summation Theorems

## NAME
Flux summation theorem; concentration summation theorem. (Ch 3.5, eq 3.10.)

## PURPOSE
They state that there is a fixed **total amount of control** available in a pathway, and
they supply the equations needed - together with the connectivity theorems - to solve for
control coefficients in terms of elasticities. They are also the cheapest numerical check
on any computed set of control coefficients.

## FORMULA

```
Σ_{i=1..n} C^J_ei   = 1          (flux summation theorem)
Σ_{i=1..n} C^sj_ei  = 0          (concentration summation theorem)
```

`n` = number of reaction steps in the pathway. The concentration theorem holds separately
for **each** floating species `sj`.

## WHAT EACH INDEX MEANS
- `i` runs over **every reaction step in the pathway**, not just the steps near the species
  of interest. Omitting a step breaks the theorem.
- `J` is a particular steady-state flux. In a branched system there is one flux summation
  theorem per flux (Ch 7.1): `Σ_i C^{J1}_ei = 1`, `Σ_i C^{J2}_ei = 1`, `Σ_i C^{J3}_ei = 1`.
- `sj` is one floating species. Boundary (fixed) species have no summation theorem - they
  are parameters, and their influence is a *response* coefficient.

## ASSUMPTIONS
- The system is at a steady state.
- Control coefficients are expressed with respect to enzyme concentrations, **and**
  `vi ∝ Ei`, **and** changing one `Ei` does not change any other `Ei`. The book states this
  caveat explicitly (Ch 3.5, book p45) and notes it can be relaxed by using the canonical
  control coefficients `C^J_vi` instead (Ch 4.4) - strictly, the theorems apply to those.
- The book states without full proof that the theorems hold "to pathways of any shape or
  size with any number of regulatory loops" and "to networks of arbitrary complexity". The
  operational proofs it gives cover one-step, two-step, and simple branched pathways; a
  fully general proof needs matrix algebra and is referred out.
- Flux summation requires a **non-zero** flux (Ch 6.4, book p99: "unless the flux is zero").

## THE UNDERLYING THOUGHT EXPERIMENT
Increase **every** enzyme by the same fraction `α`. Because each reaction rate is
proportional to its enzyme, all rate curves scale equally, the steady-state intersection
moves only vertically, and:

```
if all enzymes increased by α:   δJ = αJ   and   δsj = 0  for every j
```

"This observation is true no matter how complex the pathway topology" (Ch 3.3, book p38).
Since no species changed, the only thing that could have changed the flux is the enzyme
level itself, and rates are proportional to enzyme, so the flux scales by `α` too.

Formal operational derivations in the book:
- **One-step pathway** `Xo -E1-> X1`: only `E1` changes, no `δsj` terms, so `dv/v = dJ/J =
  de1/e1` (using `ε^v_e1 = 1`, eq 3.7). Hence `C^J_e1 = 1`: a single enzyme has complete
  proportional control, and the total control is one.
- **Two-step pathway** `Xo -> S -> X1`: raise `E1`, then raise `E2` until `δs = 0`. Local
  equations reduce to `δe1/e1 = δv1/v1`, `δe2/e2 = δv2/v2`. At steady state `v1 = v2 = J`,
  so both fractional rate changes equal a common `α ≠ 0`, and the system equations collapse
  to `1 = C^J_e1 + C^J_e2`, `0 = C^s_e1 + C^s_e2`.
- **Branched pathway** `v1 -> S -> (v2, v3)`: raise `E1`, then adjust `E2` and `E3` until
  `δs = 0`. Using `δv1 = δv2 + δv3` and `α = v2/v1`, one shows
  `δv1/v1 = δv2/v2 = δv3/v3`, giving `1 = C^J_e1 + C^J_e2 + C^J_e3` and
  `0 = C^s_e1 + C^s_e2 + C^s_e3`.

## EXPECTED RESULT
Flux coefficients for a given flux sum to exactly 1. Concentration coefficients for a given
species sum to exactly 0. In floating-point arithmetic, to within the numerical accuracy of
the method used - **not** to bitwise equality.

## HOW TO TEST NUMERICALLY
1. Enumerate **all** reaction steps in the model, including transport steps, boundary-facing
   steps and both arms of every cycle.
2. Compute `C^J_ei` for each (`r.getCC('J1','E1')` etc., or by small symmetric perturbation).
3. Sum. Compare against 1 (flux) or 0 (concentration).
4. Repeat per flux and per species.
5. Report the residual, and report it as a residual, not as "the theorem is satisfied/violated"
   without qualification.

**On tolerance:** the source does not state a universal numerical tolerance. Any threshold
you use depends on the floating-point precision, the steady-state solver's convergence
criterion, and - if the coefficients came from finite differences - the perturbation size
and the local curvature. State the tolerance you used and why; never present an invented
constant as if it came from the source.

## COMMON REASONS FOR FAILURE
1. **A reaction step was left out of the sum** - the most frequent cause. Boundary transport
   steps and the reverse arm of a cycle are the usual omissions.
2. **The system is not actually at a steady state**, or the solver did not converge.
3. Coefficients were taken with respect to different parameters (some w.r.t. `Vm`, some
   w.r.t. `e`) with different `ε^v_p ≠ 1`. Convert to canonical coefficients first.
4. `vi ∝ Ei` is violated (e.g. the parameter perturbed also affects another reaction).
5. Coefficients from different steady states, or from different parameter sets, were mixed.
6. Finite-difference perturbations were too large (nonlinearity) or too small (round-off).
7. Unscaled coefficients were summed. The theorems are stated for **scaled** coefficients.
8. Rows and columns of a control matrix were transposed - summing the wrong axis. In the
   book's layout of eq 4.18 the **columns** sum (first column to 1, later columns to 0);
   in the transposed layout of eq 4.19 the **rows** do.

## WHAT FAILURE DOES AND DOES NOT IMPLY
- **Does imply**: something in your setup is wrong - missing step, wrong steady state,
  wrong scaling, or wrong mapping. Fix that before interpreting anything.
- **Does not imply**: that MCA is wrong, or that the pathway is "unusual", or that a
  biological explanation is needed. Treat a summation failure as a bug signal first.
- A *small* residual does not prove correctness. The summation theorem is satisfied by many
  wrong sets of numbers (e.g. any permutation of a correct set). Pair it with the
  connectivity theorems, which are far more discriminating.

## INTERPRETING THE THEOREMS (Ch 3.5, book p45-46)
- If one step has a high flux control coefficient, the rest must have small ones - assuming
  none are negative, which is **not** guaranteed in branched pathways.
- Average FCC in a linear chain of `n` steps is `1/n`.
- Total control is a fixed budget of one; raising one enzyme's control forces others down.
  The distribution of control is therefore dynamic.
- "Rate-limiting step" in this language means `C^J_e = 1`, forcing all others in a linear
  chain to zero. In branched and cyclic systems FCCs can exceed 1 (with others negative to
  compensate), which makes the term incoherent - the book's rhetorical question:
  "hyper-rate-limiting steps, super-bottleneck, extreme-choke points?"

## Related concepts
[[connectivity_theorems]], [[control_coefficients]], [[branched_and_cyclic_systems]],
[[conserved_cycles]], [[validation_rules]]

## Source
Chapter: 3.5 Summation Theorems; also Ch 7.1 (per-flux versions), Ch 12.4 (cycle version
of the concentration summation is *unmodified*, but see the extra cycle relations)
Section: One step pathway; Two-step pathway; Simple branched pathway; Interpreting the
summation theorems; Rate-limiting steps
Pages: book p41-49 (PDF 49-57); caveat book p45 (PDF 53); canonical coefficients book p64 (PDF 72)
