# Connectivity Theorems

## NAME
Flux connectivity theorem; concentration connectivity theorem (own-species and
distant-species forms). "One of the most important results in metabolic control analysis."

## PURPOSE
They connect the **local** description (elasticities) to the **global** description (control
coefficients). Combined with the summation theorems they are enough to solve for all control
coefficients of a pathway in terms of its elasticities.

## FORMULA

For a common metabolite `Sk` that interacts with `r` neighbouring reaction steps:

```
Σ_{i=1..r} C^J_ei · ε^vi_sk    = 0        (flux connectivity, eq 4.8)

Σ_{i=1..r} C^sk_ei · ε^vi_sk   = -1       (concentration connectivity, own species, eq 4.9)

Σ_{i=1..r} C^sm_ei · ε^vi_sk   = 0        (concentration connectivity, distant species,
                                           eq 4.10, k ≠ m)
```

## WHAT EACH INDEX MEANS
- `sk` - the **common metabolite**: the one species whose concentration is allowed to change
  in the thought experiment.
- `i` runs over **the reactions that `Sk` interacts with**, and only those. "The number of
  terms in the connectivity theorem will equal the number of interactions a species makes."
  That includes *regulatory* interactions, not only substrate/product ones: for a species
  that is produced by `v1`, consumed by `v2` and inhibits `v3`, the theorem has three terms
  (Fig 4.2).
- `sm` - any *other* floating species (`m ≠ k`), which the thought experiment leaves unchanged.
- `J` - a particular flux.

Note the contrast with the summation theorems, where `i` runs over **all** steps.

## ASSUMPTIONS
- Steady state; `vi ∝ Ei` and `ε^vi_ei = 1` (or use canonical coefficients).
- The elasticities are those at the operating point in question.
- Standard form assumes no moiety conservation among the species involved. **Conserved
  cycles have modified connectivity theorems** - see [[conserved_cycles]].

## THE UNDERLYING THOUGHT EXPERIMENT (Ch 4.2)
The summation theorems come from operations that change the flux while leaving all
concentrations fixed (`δJ/J ≠ 0`, `δs/s = 0`). The connectivity theorems come from the
complementary operations: **change concentrations while leaving the flux fixed**
(`δJ/J = 0`, `δs/s ≠ 0`).

For `v1 -> S1 -> v2 -> S2 -> v3 -> S3 -> v4`:
1. Raise `E2` by `δe2`. Flux rises, `S2` and `S3` rise, `S1` falls.
2. Lower `E3` until the flux is restored to its original value.
3. Because the flux through `v1` is back to its original value and `E1` was never touched,
   `S1` - and everything upstream of it - must be back to its original value. Same argument
   downstream of `v4` for `S3`. **Only `S2` has changed.**

System equation: `0 = C^J_e2 (δe2/e2) + C^J_e3 (δe3/e3)`.
Local equations: `0 = δe2/e2 + ε^2_2 (δs2/s2)` and `0 = δe3/e3 + ε^3_2 (δs2/s2)`.
Substituting and cancelling the non-zero `δs2/s2` gives `0 = C^J_e2 ε^2_2 + C^J_e3 ε^3_2`.

For the concentration versions the same substitutions are made into the system equation for
`s2` (whose change is non-zero, giving `-1`) and for a distant species `s3` (whose change is
zero, giving `0`).

If a species is made and consumed by many steps, the same manipulation can be done on all
its adjacent enzymes so that only that shared species changes.

## EXPECTED RESULT
Exactly `0`, `-1`, `0` respectively, at a steady state, within numerical accuracy.

## HOW TO TEST NUMERICALLY
1. Pick a species `Sk`. **Enumerate every reaction it touches**, including regulatory arrows -
  look at the model's rate laws, not just the arrows in the diagram.
2. Get `ε^vi_sk` for each of those reactions (`r.getEE('J2','S1')`, or analytically).
3. Get `C^J_ei` (or `C^sk_ei`, or `C^sm_ei`) for the same reactions.
4. Form the sum; compare with 0 / -1 / 0.
5. Repeat for every species and, in branched systems, every flux.

This is a much stronger check than summation: it is sensitive to signs, to magnitudes, and
to row/column mapping errors. **Tolerance is not specified by the source**; it depends on
numerical precision and the method used to obtain both the elasticities and the coefficients.

## COMMON REASONS FOR FAILURE
1. **A regulatory interaction was missed.** An inhibitor arrow adds a term. This is the most
   common connectivity-specific failure.
2. Terms were included for reactions the species does **not** interact with (they belong in
   summation, not connectivity).
3. The `-1` and `0` forms were swapped: `-1` is for the **common** species, `0` for a distant one.
4. Elasticity signs wrong (product elasticities are negative).
5. Elasticity and control coefficient evaluated at different steady states.
6. Species is part of a **moiety-conserved cycle**, so the standard theorem does not apply;
   use the modified cycle connectivity theorem (Ch 12.4).
7. Scaled/unscaled mismatch.

## WHAT FAILURE DOES AND DOES NOT IMPLY
- **Does imply**: a missing interaction, a sign error, a mapping error, or a topology
  (cycle) that needs the modified theorem.
- **Does not imply**: novel biology. Check the model before inventing an explanation.
- A distant-species connectivity that fails while the own-species one passes is a strong hint
  that you mislabelled which species is "common".

## INTERPRETATION - what the theorems buy you (Ch 4.2, book p60)

For a two-step fragment `v1 -> S1 -> v2`:
```
C^J_e1 / C^J_e2 = - ε^2_1 / ε^1_1
```
The ratio of two adjacent flux control coefficients is inversely related to the ratio of the
corresponding elasticities. Therefore:

> high flux control coefficients tend to be associated with **small** elasticities, and small
> flux control coefficients with **large** elasticities.

Mechanism: species with high elasticities oppose rate changes more effectively, so they damp
out the effect of a perturbation at that step.

A step operating **near equilibrium** has very large elasticities relative to its neighbours,
so its flux control coefficient is likely to be small. **But** the book immediately guards
this:

> it is the ratio of elasticities which is important and not their absolute values. Simply
> examining the elasticity of a single reaction is not sufficient to draw a firm conclusion.
> ... one must also consider all the ratios of the elasticities along a pathway ... coupled
> to the flux summation theorem.

And the headline conclusion:

> **The examination of a single enzyme will not give an indication of the ability of that
> enzyme to control the flux or species concentrations.**

Also for the concentration control coefficients of a two-step fragment: `C^s_e1 / C^s_e2 = -1`.

## USING THE THEOREMS TO REASON QUALITATIVELY (Ch 4.2, three-step chain `Xo->S1->S2->X1`)

The available theorems are:
```
C^J_1 ε^1_1 + C^J_2 ε^2_1 = 0            C^J_2 ε^2_2 + C^J_3 ε^3_2 = 0        (4.11)
C^s1_1 ε^1_1 + C^s1_2 ε^2_1 = -1         C^s2_2 ε^2_2 + C^s2_3 ε^3_2 = -1     (4.12)
C^s2_1 ε^1_1 + C^s2_2 ε^2_1 = 0          C^s1_2 ε^2_2 + C^s1_3 ε^3_2 = 0      (4.13)
```

Consequences the book derives by setting elasticities to zero:
- **No product inhibition on step 1** (`ε^1_1 = 0`, `ε^2_1 ≠ 0`) forces `C^J_2 = 0`, then
  `C^J_3 = 0`, and by summation `C^J_1 = 1`. *"if there is no product inhibition in the first
  reaction then the first step fully controls the flux."*
- If `ε^2_2 = 0` then `C^J_3 = 0` and `C^J_1 + C^J_2 = 1`.
- With `ε^1_1 = 0`: `C^s2_2 = 0` (without product inhibition it is impossible to change the
  steady-state flux, and since flux through `v3` is unchanged, `S2` is unchanged), and
  `C^s1_2 = -1/ε^2_1` - the smaller `ε^2_1`, the larger step 2's influence on `S1`; the
  negative sign says raising step 2 lowers `S1`, as expected.
- If `ε^3_2 = 0` (step three saturated): `C^J_2 = 0`, `C^J_1 = 0`, so `C^J_3 = 1`, `C^s1_2 = 0`.

This pattern - set an elasticity to a limiting value, read off the control structure - is one
of the most useful reasoning moves in the whole method.

## Related concepts
[[summation_theorems]], [[elasticities]], [[control_coefficients]],
[[deriving_control_equations]], [[linear_pathways]], [[conserved_cycles]], [[validation_rules]]

## Source
Chapter: 4.2 Connectivity Theorems (with Interpretation subsection)
Section: Flux Connectivity Theorem; Concentration Connectivity Theorem; Interpretation
Pages: book p55-61 (PDF 63-69); modified cycle form Ch 12.4, book p230-231 (PDF 238-239)
