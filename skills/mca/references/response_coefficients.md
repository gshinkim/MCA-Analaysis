# Response Coefficients

## Definition
A response coefficient measures how sensitive a steady-state flux or concentration is to an
**external factor** - something that is a parameter of the system rather than an enzyme
level. Examples the book gives: nutrients, hormones, therapeutic drugs, inhibitors, boundary
species.

The book's terminological split (Ch 3.1): influence of a *reaction step* on the steady state
is **control**; influence of an *external input* is **response**.

## Mathematical definition

```
R^J_x = (dJ/dx)(x/J)          flux response coefficient
R^s_x = (ds/dx)(x/s)          concentration response coefficient
```
where `x` is the concentration of the external factor.

## The partitioned response relation

For a factor acting on a single step (eq 4.14):
```
R^J_x = C^J_ei · ε^vi_x
```
Generalised to a factor acting at several sites simultaneously:
```
R^J_x = Σ_{i=1..n} C^J_ei ε^vi_x
R^s_x = Σ_{i=1..n} C^s_ei ε^vi_x                                    (eq 4.15)
```

### Derivation sketch (operational, Ch 4.3)
For `X -v1,E1-> S -v2,E2->`: raise `E1` by `δe1`; then lower `X` until the flux and `s` are
restored. The local equation is `δv1/v1 = ε^1_x (δx/x) + ε^1_e1 (δe1/e1) = 0` and the system
equation `δJ/J = R^J_x (δx/x) + C^J_e1 (δe1/e1) = 0`. Eliminate `δe1/e1`, use `ε^1_e1 = 1`,
cancel the non-zero `δx/x`.

## Intuition and operational meaning

> The ability of an external factor to influence a given species or flux depends on:
> 1. The ability of the external factor to influence its immediate target.
> 2. The ability of the target to influence the network it is connected to.

The elasticity `ε^vi_x` is the *local* half (does the drug bind and inhibit the enzyme?); the
control coefficient `C^J_ei` is the *systemic* half (can that step transmit the disturbance
to the rest of the pathway and change the phenotype?). Either being near zero kills the
response. This is the book's central lesson for drug design (Ch 4.3, book p63).

## Assumptions
- Steady state.
- `ε^vi_ei = 1` where the derivation uses it.
- `x` is a genuine **parameter** (fixed/boundary species, external inhibitor, cofactor held
  constant by other processes), not a floating variable of the model.

## How to calculate
1. **Factorise**: get `ε^vi_x` from the rate law (or numerically), get `C^J_ei` or `C^s_ei`
   from the system, multiply and sum over the sites of action.
2. **Directly by simulation**: perturb `x`, re-solve the steady state, take the scaled ratio.
   In roadrunner, `r.getCC('J1','Xo')` computes the coefficient of the flux w.r.t. the
   parameter `Xo` - the book uses `getCC` with a parameter argument this way in Ch 12
   (`r.getCC('XI','Xo')`), and the same call form appears with `Vm` parameters in Ch 7.
3. **From BST**: the logarithmic gain `∂log(s)/∂log(xo)` is the same quantity (Ch 4.6).

## How to interpret
- **Sign**: negative for an inhibitor acting on a step with positive flux control; can flip
  sign if the target step has a negative control coefficient (branch competition).
- **Magnitude near zero for either factor means the intervention will not work.** A potent
  binder on a step with `C^J_e ≈ 0` produces no phenotype.
- Distance effects: because `C^si_e1 > C^s2_e1 > ... ` in an unregulated linear pathway, the
  response `R^si_xo` also decreases the further the species is from `Xo` (Ch 6.5, book p105).
  **Caveat**: with strictly *linear* kinetics the concentration control coefficients are all
  equal, so `R^s1_xo = R^s2_xo = ...` (Ch 6.5, book p106).
- Under strong negative feedback the response of the regulated species to the source can be
  driven very small: `R^s2_xo = C^s2_e1 ε^1_xo`, and `C^s2_e1 = 1/(ε^3_2 - ε^1_2)` shrinks as
  the feedback elasticity `ε^1_2` becomes strongly negative (Ch 8.3, Table 8.1).

## Special cases in the source

**Inhibitor titration.** `R^J_x = C^J_e ε^v_x` is rearranged to *measure* `C^J_e`
experimentally by extrapolating a titration curve to zero inhibitor. See [[experimental_mca]].

**Response to a conserved-cycle total `T`.** The book treats `T` as an external factor and
defines `R^p_T`, `R^J_T` for a cycle (Ch 12.3, eq 12.4, 12.5), with a summation relation
`Σ_i M_i R^si_T = 1` (eq 12.9). See [[conserved_cycles]].

**A clash of names.** In the ultrasensitivity literature the symbol `R` is also used for
`R = S_0.9/S_0.1`, the fold change in ligand needed to move the response from 10% to 90% of
maximum (Goldbeter-Koshland style). The book flags this in a footnote: *"Not to be confused
with the response coefficient defined in MCA."* `R = 81^(1/n)` for a Hill system; `R = 81` is
hyperbolic/not ultrasensitive; `R < 81` indicates ultrasensitivity. The MCA-style gain
`R^Y_X = dln Y/dln X` calls a system ultrasensitive when `R^Y_X > 1`. **Always say which
definition you are using.** (Ch 12.2, book p225-226.)

**Local response coefficients `r` in cascades.** Ch 12.6 writes cascade sensitivities as
products of *local* response coefficients `r^{pi}_{pi-1}`, each covering one cycle layer:
`R^{pn}_s = r^{p1}_s r^{p2}_{p1} ... r^{pn}_{pn-1}`. These `r` terms are cycle-level, not
reaction-level, quantities. See [[conserved_cycles]].

## Validation
- Check the factorisation reproduces the directly simulated value.
- Check the elasticity `ε^v_x` sign matches the pharmacology (inhibitor negative).
- If a response coefficient is large, confirm both factors are large; if one is near zero,
  suspect an error in the other.

## Common mistakes
- Calling `R^J_x` a control coefficient. Reserve "control" for reaction steps.
- Applying a summation theorem to response coefficients. There is none of the `Σ = 1` kind;
  the summation in eq 4.15 is over *sites of action of the same factor*, and it has no fixed value.
- Treating a floating species as an external factor.
- Confusing the two meanings of `R` (see above).
- Concluding a drug will work from binding affinity alone.

## Related concepts
[[control_coefficients]], [[elasticities]], [[experimental_mca]], [[conserved_cycles]],
[[negative_feedback]], [[interpretation_rules]]

## Source
Chapter: 4.3 Response Coefficients; 3.1 (control vs response); 5.4 (use in inhibitor
titration); 6.5 (distance effect); 8.3 (under feedback); 12.2-12.3, 12.6 (cycles and cascades)
Section: 4.3 Response Coefficients; 4.4 Canonical Control Coefficients
Pages: book p61-63 (PDF 69-71); book p31-32 (PDF 39-40); book p79-81 (PDF 87-89);
book p105-106 (PDF 113-114); book p225-230 (PDF 233-238); book p243-249 (PDF 251-257)
