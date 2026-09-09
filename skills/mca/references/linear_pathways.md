# Linear Pathways

## How to recognise it
An unbranched chain `Xo -v1-> S1 -v2-> S2 -> ... -> Sm -vn-> X1` with `m` floating species
and `n = m+1` reactions. `Xo` and `X1` are fixed. Ch 6 assumes **no feedback loops**: each
step is affected only by its immediate reactant and product.

## What changes mathematically
- At steady state **all rates are equal**: `v1 = v2 = ... = vn = J`. There are no "slow" or
  "fast" steps at steady state (Ch 3.2).
- The stoichiometry matrix has full row rank - **no conserved moieties**, so the full Jacobian
  is invertible and no model reduction is needed (Ch 11.3 Ex 11.2).
- With linear reversible kinetics an **analytic steady-state flux exists**, so control
  coefficients can be obtained by differentiation rather than only through the theorems.

## Which MCA relationships apply
All of them in their standard form: flux and concentration summation, flux and concentration
connectivity (own and distant species), response coefficients. No branch or cycle theorems
are needed. Control equations: [[deriving_control_equations]] Appendix B.1.

## Analytic results for linear reversible kinetics

Rate law `v_i = k_i s_{i-1} - k_{-i} s_i = k_i (s_{i-1} - s_i/q_i)` with `q_i = Keq_i` (eq 6.3).

**Steady-state flux for a chain of `n` steps** (eq 6.5):
```
        xo·Π_{i=1..n} q_i  -  x1
J = ----------------------------------
       Σ_{i=1..n} (1/k_i)·Π_{j=i..n} q_j
```
Four-step instance:
```
J = (xo q1q2q3q4 - x1) / ( q1q2q3q4/k1 + q2q3q4/k2 + q3q4/k3 + q4/k4 )
```

**Flux control coefficient of step `i`** (eq 6.6), obtained by differentiating w.r.t. `k_i`
as a proxy for enzyme activity:
```
             (1/k_i)·Π_{j=i..n} q_j
C^J_i = -------------------------------------
         Σ_{j=1..n} (1/k_j)·Π_{k=j..n} q_k
```
These sum to 1, and **in this case** `0 <= C^J_i <= 1`:

> For a linear chain where an increase in reactant concentration results in increases in the
> reaction rate and products cause reaction rates to decrease, then the flux control
> coefficients are limited in range between 0 and 1.0.

**This bound is a linear-pathway result. Do not export it** - see
[[branched_and_cyclic_systems]].

Structural note worth using as a check: *"each term in a numerator can be found in the common
denominator."*

## Front loading

**Adjacent-coefficient ratio.** If all `q_i > 1`, all forward rate constants equal, all
reverse rate constants equal (so all `q` equal), then (eq 6.7):
```
C^J_i / C^J_{i+1} = q
```
So `C^J_i > C^J_{i+1}`: earlier steps carry more control. The book calls this **front loading**
and notes it "gives some credence to the traditional idea that the first or committed step is
the most important step in a pathway. **However, front loading only applies to unregulated
pathways; the moment we add regulation to the pathway, this picture changes.**"

Illustration, five steps with `q = 2`:

| Step | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| `C^J_i` | 0.52 | 0.26 | 0.13 | 0.06 | 0.03 |

**Elasticity-ratio form.** From the connectivity theorems, with `ε1..ε6` labelling
`ε^1_1, ε^2_1, ε^2_2, ε^3_2, ...`:
```
C^J_1 : C^J_2 : C^J_3 : C^J_4 = 1 : (-ε1/ε2) : (-ε1/ε2)(-ε3/ε4) : (-ε1/ε2)(-ε3/ε4)(-ε5/ε6)
nth term = Π_{i=1..n-1} ( -ε_i/ε_{i+1} )
```

**Disequilibrium form.** With `Γ = s_i/s_{i-1}`, `ρ = Γ/Keq`, and enzymes below saturation
(`v_i = Vm_i/Km_i (s_{i-1} - s_i/Keq_i)`), substitute `ε_substrate = 1/(1-ρ)`,
`ε_product = -ρ/(1-ρ)` to get (eq 6.8):
```
C^J_1 : C^J_2 : C^J_3 : C^J_4 = (1-ρ1) : ρ1(1-ρ2) : ρ1ρ2(1-ρ3) : ρ1ρ2ρ3(1-ρ4)
nth term = ( Π_{i=1..n-1} ρ_i )·(1-ρ_n)                                        (eq 6.9)
```

> **This is an important result**, because knowing only the equilibrium constants and the
> intermediate pool concentrations gives the relative distribution of flux control across the
> pathway.

**Why front loading happens (mechanism).** In the symbolic control equations, the numerator of
`C^J_1` is the product of all **substrate** elasticities; the numerator of `C^J_n` is the
product of all **product** elasticities; intermediate steps carry a mixture. *"The pattern of
elasticities in the numerator reflects the path taken by the disturbance"* - a perturbation
hops enzyme to enzyme, downstream via substrate elasticities and upstream via product
elasticities. Since `|ε^v_s| > |ε^v_p|` for reversible mass action (eq 2.10), upstream
enzymes have larger numerators. *"It is easier for a disturbance to travel downstream than
upstream."* The origin is **thermodynamic**: reverse the thermodynamic gradient and the
loading reverses with it.

## Product-insensitive steps
A step is product insensitive when `ρ_i = 0` (and, by the book's convention, irreversible).

> In a linear pathway governed by linear kinetics and without the presence of regulatory
> interactions, all steps **downstream** of a product insensitive step have no flux control.

Because `ρ_i` multiplies every downstream term in eq 6.9. Steps **upstream** may still have
control, so a product-insensitive step does **not** automatically have `C^J = 1` - unless it
is the **first** step, in which case `C^J_1 = 1` and everything else is zero (the classic
rate-limiting step). The book stresses this is "likely to be rare in real pathways" and that
"the classic rate limiting step has almost never been observed experimentally."

Mechanism: a perturbation downstream changes the product of the insensitive step, which by
definition does not change its rate, so no upstream rate changes and the flux cannot change.

Although derived for linear kinetics, the result generalises to Michaelis-Menten and
cooperative kinetics (shown in Ch 6.4 via the control equations).

## Steps close to equilibrium
If `ρ_i ≈ 1`, `(1-ρ_i) ≈ 0`, so `C^J_i ≈ 0`, and the other steps behave "as if step `i` is not
part of the pathway - the pathway appears shortened."

> In a linear pathway governed by linear kinetics and without regulation, any step that is
> very close to equilibrium is likely to have a flux control coefficient close to zero.

Since `ρ = vr/vf` and `vf > vr` for a positive net flux, `ρ < 1` always.

**Immediate caveat the book insists on:**
> Although a step may be close to equilibrium, the step must be considered in the context of
> all the others in order to determine the absolute flux control coefficient.

And in Ch 6.4: if **all** steps are close to equilibrium, control is still distributed - by
the relative degree of equilibrium - because the summation theorem must hold.
> **It is possible for steps close to equilibrium to have significant flux control depending
> on the context of the reaction.** (Confirmed experimentally in the serine pathway,
> [[experimental_mca]] Ch 5.8.)

## Relaxation times
For `A <-> B`, `τ = 1/(k1 + k_-1)`. If all `q_i = 1` (so `k_i = k_{-i}`), then `τ_i = 1/(2k_i)`
and eq 6.6 collapses to:
```
C^J_i = τ_i / (τ_1 + ... + τ_n)
```
The higher a step's relaxation time relative to the total, the larger its flux control. Steps
close to equilibrium necessarily have small relaxation times.

## Saturable kinetics - control equations by theorem
No analytic flux exists, so derive from summation + connectivity. Two-step results and their
limits (Table 6.1):

| State of `v1` | `C^J_e1` | `C^J_e2` | `C^s_e1` | `C^s_e2` |
|---|---|---|---|---|
| product insensitive (`ε^1_1 = 0`) | 1 | 0 | `1/ε^2_1` | `-1/ε^2_1` |
| close to equilibrium (`ε^1_1 -> -∞`) | 0 | 1 | 0 | ~0 |

If `s ≈ Km` of step 2 then `ε^2_1 ≈ 0.5` and the CCCs are `+2` and `-2`.

Three-step chain with realistic elasticities (`ε^2_1 = ε^3_2 = 0.5` at `s ≈ Km`; product
elasticities `ε^1_1 = ε^2_2` as shown):

| Step | product inhibition = -0.1 | = -0.2 |
|---|---|---|
| J1 | 0.806 | 0.64 |
| J2 | 0.161 | 0.26 |
| J3 | 0.032 | 0.1 |

*"when the product inhibition is strengthened to -0.2, there is a significant shift in flux
control."* Front-loaded, but not exclusively so.

Concentration control for the same three-step case (Table 6.3):

| Step | `C^s1_i` | `C^s2_i` |
|---|---|---|
| e1 | 1.982 | 1.802 |
| e2 | -1.802 | 0.180 |
| e3 | -0.180 | -1.982 |
| Sum | 0 | 0 |

Sign reading: enzymes **downstream** of a metabolite give negative coefficients (they consume
it); enzymes **upstream** give positive ones.

> **Reaction steps which are close to equilibrium have little influence over species
> concentrations in a linear pathway.** (If `v2` is near equilibrium, `ε^2_1` and `ε^2_2` appear
> only in the denominator, so `C^s1_e2, C^s2_e2 -> 0`.)

## Concentration control in terms of flux control (Heinrich & Schuster)
For steps at or before `i` (`1 <= j <= i`):
```
C^si_j = ( C^J_j / (C^J_{i+1} ε^{i+1}_i) ) · Σ_{k=i+1..n+1} C^J_k
```
For steps downstream of `i` (`i+1 <= j <= n+1`):
```
C^si_j = ( C^J_j / (C^J_i ε^i_i) ) · Σ_{k=1..i} C^J_k
```
Reading: a concentration control coefficient at step `j` is proportional to the flux control
coefficient at step `j`. So low flux control implies diminished concentration control - but
because elasticity terms sit in the denominator, low flux control is **not sufficient** for
low concentration control.

## Distance attenuation
For a four-step chain, the numerators of `C^s1_e1`, `C^s2_e1`, `C^s3_e1` lose one term each
step downstream while the denominator is unchanged, so:
```
C^s1_e1 > C^s2_e1 > C^s3_e1 > ... > C^sn_e1
```
> In a linear pathway without regulation, concentration control diminishes the further away
> the species is from the disturbance.

The book confirms this by sampling 1000 random elasticity sets (product elasticities uniform
on [0,-1], substrate on [0,1]) for a four-step chain, obtaining mean values
`C^s1_e1 = 2.6128`, `C^s2_e1 = 2.1083`, `C^s3_e1 = 1.1886`.

Because `R^si_xo = ε^1_xo · C^si_e1`, response coefficients attenuate the same way.

**Important caveat - strictly linear kinetics.** With `v_i = k_i(s_{i-1} - s_i/q_i)` the
elasticities are constrained by `ε^v_{i-1} + ε^v_i = 1`. If the last step is irreversible
(`ε^3_3 = 0` so `ε^3_2 = 1`) and `ε^2_1 = 1 - ε^2_2`, then for a three-step chain
```
C^s1_e1 = C^s2_e1 = 1/(1 - ε^1_1)
```
**all equal**. *"no matter how far the species is from the disturbance, the species will
respond in the same way as the species closest to the disturbance"* - because transmission
through linear kinetic laws is not attenuated. Downstream of a perturbation point all
responses are identical (heat-map Fig 6.6, six-step pathway). Response coefficients `R^s1_xo,
R^s2_xo, ...` are then equal too. With **reversible Michaelis-Menten** laws the elasticities
are less constrained, saturation attenuates the signal, and the diminishing pattern returns.

**This is the single most important "do not over-generalise" caution in Ch 6**: whether
concentration control attenuates with distance depends on the rate-law family.

## Optimal allocation of protein
Motivation: protein synthesis costs ~7.5 ATP per peptide bond; one glucose yields ~36 ATP; a
300-residue protein therefore costs ~62 glucose molecules excluding amino acids. In some
cultured mammalian cells protein synthesis consumes 35-50% of all ATP production, and protein
occupies 20-30% of cell volume, near the solubility limit. There is therefore a fixed protein
budget, likely under evolutionary selection, and shifting with environment.

Result: if the protein distribution is optimal for flux (total `Σe_i` minimal for a given
flux), then for a two-step pathway `δe1 + δe2 = 0` with `δJ = 0` gives
`C^J_e1(1/e1) = C^J_e2(1/e2)`, and with the summation theorem:
```
C^J_ei = e_i / Σ_j e_j
```
So under optimal allocation, **flux control coefficients equal protein mass fractions**.
(Ch 6 Exercise 12 makes the practical point: if you know the distribution is optimised, that
is the easiest way to estimate all the FCCs.)

## Quantities to calculate for a linear pathway
Elasticities at the operating point (or `ρ_i` and `q_i` if kinetics are near-linear); all
FCCs; all CCCs per species; response coefficients w.r.t. `Xo`; check summation and connectivity.

## Common interpretational errors
- Assuming front loading holds when the pathway has feedback. It does not (Ch 8).
- Reading "near equilibrium implies no control" as absolute. It is contextual.
- Assuming a product-insensitive step must be rate limiting - only true if it is the first step.
- Exporting `0 <= C^J <= 1` to branched or cyclic systems.
- Assuming concentration control always attenuates with distance - false for strictly linear
  kinetics.
- Concluding "the first step is committed, so it controls the flux". Ch 3.5's own three-step
  example puts ~50% of control on the **last** step.

## Related concepts
[[control_coefficients]], [[elasticities]], [[connectivity_theorems]],
[[deriving_control_equations]], [[branched_and_cyclic_systems]], [[negative_feedback]],
[[common_failure_modes]]

## Source
Chapter: 6 (Linear Pathways)
Section: 6.1 Basic Properties (Simulations; Algebraic Analysis; Relaxation Times);
6.2 Product Insensitive Steps; 6.3 Steps Close to Equilibrium; 6.4 Saturable Enzyme Kinetics;
6.5 Front Loading (Distribution of Concentration Control); 6.6 Optimal Allocation of Protein;
6.7 Appendix (four-step steady-state concentrations)
Pages: book p89-112 (PDF 97-120); steady state / equal rates Ch 3.2 book p33 (PDF 41)
