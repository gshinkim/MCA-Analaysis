# Moiety Conserved Cycles - MCA

Detection of conservation laws and model reduction: [[moiety_conservation]]. This file covers
what conservation does to **behaviour** and to the **MCA relationships**.

## How to recognise it
Two or more species interconverting with a fixed total: `s1 + s2 = T` (or
`s1 + ... + sm = T`). Canonically a covalent-modification cycle: kinase phosphorylates,
phosphatase dephosphorylates, total protein constant over the timescale of interest.

## Effect 1 - Species levels are bounded
The simplest consequence: `T` puts an **upper limit** on every participant. In the simple
cycle, neither `S` nor `P` can exceed `s + p = T`.

**Trypanosoma brucei case study.** Much of glycolysis sits in the glycosome; many intermediates
are phosphorylated, which constrains phosphate. Analysis of the network finds **four**
conservation laws:
```
1. ATPc + ADPc + AMPc
2. ATPg + ADPg + AMPg
3. NADg + NADHg
4. glycerol-3-Pc + DHAPc + glycerol-3-Pg + DHAPg + G6Pg + F6Pg
   + F1,6BPg + GA3P + 1,3BPG + ATPg + ADPg
```
(`c` = cytoplasm, `g` = glycosome.) Because phosphate is a conserved moiety, every species
containing it is constrained by the total.

**Why this matters for drug targeting** (Eisenthal & Cornish-Bowden on Bakker et al.): an
organism can be disrupted metabolically either by driving a flux very low, or by driving
metabolite levels toxically high. Bakker's analysis put most flux control on **glucose
transport**, limiting the sites for flux disruption; only one step had a significant
concentration control coefficient, **pyruvate transport**, limiting the sites for
concentration disruption. *"The reason why pyruvate transport is a susceptible target is
because it is one of the few steps where the reactants are not involved in the conservation
laws."*

## Effect 2 - Response shape

**Linear kinetics** (`v1 = k1 s`, `v2 = k2 p`): plotting steady-state `s` and `p` against `k1`
gives **hyperbolic** curves. `p` rises and levels off at `T`; `s` falls. The limit exists
because the mass in the cycle is fixed.

**Saturable kinetics** (`v1 = k1 s/(Km1+s)`, `v2 = k2 p/(Km2+p)`): the response becomes
**sigmoidal** - **zero-order ultrasensitivity**. Mechanism (Fig 12.6): plot `v1` against `s`
and `v2` against `T - s` on the same axis; the intersection is the steady state. Increasing
`k1` by 20% shifts the `v1` curve up; **the closer the intersection is to the saturated part
of the curve, the further the steady state moves**. Since `k1` enters linearly, it can be read
as the kinase concentration - so a cycle converts changes in kinase activity into switch-like
changes in the phosphorylated fraction. Studied theoretically by Goldbeter & Koshland; observed
experimentally.

**Two definitions of gain - keep them apart** (Ch 12.2):
- Classical: `R = S_0.9 / S_0.1`, the fold change in ligand needed to go from 10% to 90% of
  maximum. For a Hill system `R = 81^{1/n}`. `R = 81` (n=1) is hyperbolic, *not*
  ultrasensitive; `R < 81` is ultrasensitive; `R -> 1` at the asymptotic limit. The book flags
  in a footnote that this `R` is **not** the MCA response coefficient.
- MCA-style: `R^Y_X = dln Y/dln X`. **Ultrasensitive when `R^Y_X > 1`.** This is the definition
  the rest of the chapter uses.

## Effect 3 - Modified control equations for a cycle

### The key derivation (Ch 12.3)
Simple cycle, `v1` catalysed by kinase `E1`, both arms irreversible and not product inhibited.
Local equations:
```
δv1/v1 = δe1/e1 + ε^1_s (δs/s)        δv2/v2 = ε^2_p (δp/p)
```
At steady state `δv1/v1 = δv2/v2`. **The conservation law forces `δs = -δp`** (`T` unchanged).
Substituting and solving:
```
C^p_e1 = s / ( p ε^1_s + s ε^2_p )                                     (eq 12.1)
       = M_s / ( M_p ε^1_s + M_s ε^2_p )      with M_s = s/T, M_p = p/T (eq 12.2)
```
An arbitrary effector `X` of `v1`:
```
R^p_x = C^p_e1 ε^1_x = ε^1_x · M_s/(M_p ε^1_s + M_s ε^2_p)             (eq 12.3)
```
Cycling flux:
```
C^J_e1 = ε^2_p C^p_e1 = ε^2_p M_s/(M_p ε^1_s + M_s ε^2_p)
```
The cycling flux is **less** sensitive than `p`, because `ε^2_p` is small when the cycle is
ultrasensitive.

Sensitivity to the cycle total (treating `T` as an external factor, since `δT = δs + δp`):
```
R^p_T = ε^1_s / ( ε^1_s M_p + ε^2_p M_s )                              (eq 12.4)
R^J_T = ε^2_p R^p_T                                                    (eq 12.5)
```

> **The advantage of this approach is that it is kinetic mechanism independent.** Nothing was
> assumed about the mechanism of the cycle steps - only the local sensitivity of each rate to
> its substrate.

An alternative derivation by implicit differentiation of `dp/dt = v1(e1, s(e1)) - v2(p(e1))`
is given, using `ds/de1 = -dp/de1` from the conservation law. It reaches the same result.

> *Source note*: the implicit-differentiation box on book p229 prints the last two lines with
> minus signs (`C^p_e1 = 1/(ε^1_s p/s - ε^2_p)`), which does not follow from the line above it
> (`0 = ε^1_e1 - ε^1_s (p/s) C^p_e1 - ε^2_p C^p_e1`) and contradicts eq 12.1, which the box
> itself says it reproduces. **Use eq 12.1, with the plus signs.**

### When is a cycle ultrasensitive?
If both steps operate far below saturation, `ε^1_s ≈ ε^2_p ≈ 1` and
```
C^p_e1 = M_s/(M_p + M_s) <= 1
```
**No ultrasensitivity is possible when both enzymes are in their first-order regime.**
Near saturation the elasticities fall below 1 and the coefficient grows. Book's numbers with
`s = 9`, `p = 1`:

| `ε^1_s = ε^2_p` | `C^p_e1` |
|---|---|
| 1.0 | ~1 |
| 0.5 | 1.8 |
| 0.2 | 4.5 |

A 1% increase in `E1` gives a 4.5% increase in `P`; and `P` is itself typically a kinase.

> If the initial steady-state mole fractions are `M_s = 0.9`, `M_p = 0.1`, the threshold where
> the system starts to display ultrasensitivity is when both elasticities equal 0.9. **In
> general the threshold equals the initial steady-state mole fraction of `S`.**

## Effect 4 - Modified connectivity theorem (Ch 12.4)

> Moiety conserved cycles possess **modified** connectivity theorems. This is because the
> species in the cycle cannot have arbitrary values but are constrained by the total mass.

Thought experiment: change `s` by `δs` **and** compensate with `δp = -δs` so `T` is unchanged;
then adjust `E1` and `E2` so both rates are unchanged. With irreversible, product-insensitive
arms (`ε^2_1 = 0`, `ε^1_2 = 0`) the local equations reduce to
`δe1/e1 = -ε^1_s (δs/s)` and `δe2/e2 = -ε^2_p (δp/p)`. Substituting into the system equation
`δp/p = C^p_e1 (δe1/e1) + C^p_e2 (δe2/e2)` and using `δs = -δp`:

```
-1 = -C^p_e1 ε^1_s (p/s) + C^p_e2 ε^2_p          (covalent modification connectivity theorem)

equivalently   1/p = C^p_e1 ε^1_s (1/s) - C^p_e2 ε^2_p (1/p)          (eq 12.7)
```

**The summation theorem is unmodified**: `C^p_e1 + C^p_e2 = 0`. Combining the two gives an
alternative route to `C^p_e1`.

## Effect 5 - Extra cycle summation relations

For a cycle of `m` species with `s1 + ... + sm = T`, perturbing one enzyme `e_i` cannot change
`T`, so `δs1 + ... + δsm = 0`. Scaling each term by its species and dividing by `δe_i/e_i`:

```
s1 C^{s1}_{ei} + s2 C^{s2}_{ei} + ... + sm C^{sm}_{ei} = 0
M1 C^{s1}_{ei} + M2 C^{s2}_{ei} + ... + Mm C^{sm}_{ei} = 0             (eq 12.8)
```

> Note the difference with the usual concentration summation theorem where the summation is
> over a single species and all enzymes. **Here the summation is over all cycle species and a
> single enzyme.**

Perturbing the total instead (`δs1 + ... + δsm = δT`):
```
M1 R^{s1}_T + M2 R^{s2}_T + ... + Mm R^{sm}_T = 1                      (eq 12.9)
```

**These two relations are among the most useful validation checks for a cycle model.**

## Dual cycles - first-order ultrasensitivity

Dual phosphorylation (`S1 <-> S2 <-> S3`, `s1+s2+s3 = T`, signal `S` acting on `v1` and `v3`
by the same factor):
```
      [ -1   1   0   0 ]
N =   [  1  -1  -1   1 ]
      [  0   0   1  -1 ]
```
Deriving `C^{s3}_{e1}` needs three equations: two from the local/steady-state relations
(`ε^1_1 C^{s1}_{e1} + 1 = ε^2_2 C^{s2}_{e1}` and `C^{s2}_{e1} = C^{s3}_{e1}`) plus eq 12.8.
Results:
```
C^{s3}_{e1} = s1 ε^3_2 / ( s1 ε^2_2 ε^4_3 + s2 ε^1_1 ε^4_3 + s3 ε^1_1 ε^3_2 )
C^{s3}_{e3} = (s1 ε^2_2 + s2 ε^1_1) / ( s1 ε^2_2 ε^4_3 + s2 ε^1_1 ε^4_3 + s3 ε^1_1 ε^3_2 )
R^{s3}_s    = C^{s3}_{e1} + C^{s3}_{e3}
            = ( s1(ε^3_2 + ε^2_2) + s2 ε^1_1 ) / ( same denominator )    (eq 12.10)
```
(The book prints the second expression with the label `C^{s3}_{e1}` a second time; it is
plainly `C^{s3}_{e3}`, as the surrounding text says.)

With **all reactions first-order** (all elasticities = 1):
```
R^{s3}_s = (2 s1 + s2)/(s1 + s2 + s3)
```
Maximum **2**, reached as `s2, s3 -> 0`.

> **Doubly phosphorylated cycles can generate ultrasensitivity using linear kinetic laws. This
> is called first-order ultrasensitivity** - distinguishing it from zero-order ultrasensitivity,
> which requires saturable kinetics in a single cycle.

**Generalisation to `n-1` cycles.** Assuming first-order kinetics and invoking eq 12.8:
```
C^{sm}_{e1} = M1/(M1 + M2 + ... + Mm)
C^{sm}_{e3} = (M1 + M2)/(M1 + ... + Mm)
C^{sm}_{en} = (M1 + ... + M_{m-1})/(M1 + ... + Mm)
R^{sm}_s = Σ over all forward-arm control coefficients
```
For three cycles (output `s4`):
```
R^{s4}_s = (3M1 + 2M2 + M3)/(M1 + M2 + M3 + M4)   -> maximum 3
```
**A system with `n-1` cycles has a maximum response of `n-1`.** Six cycles -> maximum 6.

## Sequestration

The models above assume **negligible sequestration** of cycle species by the kinase and
phosphatase. In reality enzyme and cycle-species concentrations are comparable. Sequestration
creates **new regulatory feedback loops** that can change behaviour markedly. The book states
this is an area of theoretical analysis that "has not received much attention in the literature."

**Simplest sequestration ultrasensitivity**: `A + B <-> AB`. At low `A`, added `A` is mopped up
by `B`. Once `B` is nearly exhausted, free `A` rises rapidly - that is where the
ultrasensitivity appears. Measured with `R^a_T`.

**Sequestration in a pathway** (Fig 12.14): a dead-end complex `X + I <-> XI` on a linear
pathway. Sigmoid behaviour appears in both free `X` and complex `XI`. Saturation of `XI` comes
from the conservation law on the `I` moiety. To saturate `X` as well, the second step needs a
Michaelis-Menten rate law (itself based on an E/ES conservation law), and the first step must
be **reversible** so a steady state still exists at high stimulus (otherwise `X` diverges).
Simulated response coefficient reaches a maximum of about **4**.

## The Markevich switch - bistability from conservation alone

Double cycle with the catalytic cycles written out explicitly (binding to `E1`/`E2`, complexes
`ES1..ES4`). Three conservation laws:
```
S1 + S2 + S3 + ES1 + ES2 + ES3 + ES4 = T1                             (12.11)
E1 + ES1 + ES2                        = T2                             (12.12)
E2 + ES3 + ES4                        = T3                             (12.13)
```
**Bistability emerges with no explicit positive feedback.** Mechanism:
- Raising the forward limbs makes more `S2` and `S3`. Extra `S3` binds `E2` to form `ES3`;
  by (12.13), `ES4` and free `E2` decline. **`S3` therefore competes with `S2` for `E2`**,
  leaving less `E2` for `v4` - an effective inhibition of `v4` by `S3`.
- With `S2` and `S3` up, `S1` is down, so less `S1` binds `E1`, freeing `E1` to drive `v2` -
  inverted: increases in `S1` decrease `v2`.

The book names this **apparent regulation**: *"there is no direct molecular mechanism involved,
such as allosteric regulation, it is simply an effect brought about by competitive
sequestration."* Degree of saturation also plays a role, but the conservation constraints are
critical.

Reduced picture: two opposing repression loops around the pathway - a **toggle switch**. With
`S1` low, repression of the forward limb is relieved, keeping `S1` low and `S3` high, which
represses the lower limb - stable. With `S1` high the reverse logic applies - also stable.

The bifurcation plot of `S3` vs total `E1` shows two saddle-node turning points, a high stable
branch, a low stable branch and an unstable middle branch.

## Cascades

**Notation the book defines** (use it):
- A **layer** is one cycle. Layers numbered top to bottom.
- Within layer `i`: `S_i` (unphosphorylated) and `P_i` (phosphorylated, active).
- `v_{if}` forward (phosphorylation) rate, `v_{ir}` reverse rate.
- `M_{si} = s_i/T_i`, `M_{pi} = p_i/T_i`, with `T_i` the total protein in layer `i`.

**Local (per-layer) response coefficient** (eq 12.17):
```
r^{pi}_{p_{i-1}} = M_{si} ε^{v_if}_{p_{i-1}} / ( M_{si} ε^{v_ir}_{pi} + M_{pi} ε^{v_if}_{si} )
```
Assumptions: irreversible reaction steps, negligible sequestration of `P_{i-1}` by `S_i`,
no feedback/feedforward loops.

**Overall sensitivity is the product of the local ones:**
```
R^{pn}_s = r^{p1}_s · r^{p2}_{p1} · r^{p3}_{p2} · ... · r^{pn}_{p_{n-1}}
```
> if each cycle is operating in an ultrasensitivity mode where an individual `r` is high, the
> overall sensitivity will be significantly higher.

Three cycles each with `r ≈ 4.0` give an overall sensitivity of `4·4·4 = 64`.
**Layered cascades have the potential to generate very strong ultrasensitivity.**

**Response to cycle totals** (therapeutic drugs effectively alter total protein mass):
```
R^{pn}_{T1} = R^{p1}_{T1} · r^{p2}_{p1} · r^{p3}_{p2} · ... · r^{pn}_{p_{n-1}}
R^{pn}_{T2} = R^{p2}_{T2} · r^{p3}_{p2} · ... · r^{pn}_{p_{n-1}}
```
> perturbations of the cycle totals that are **farther away from the output** lead to higher
> responses, because each layer has the potential to amplify.

**Cascades with negative feedback.** Write the functional dependencies and use the conservation
laws to eliminate `s1, s2`:
```
p1 = p1(p2, s),   p2 = p2(p1)
```
Total-derivative, scale, divide by `ds/s`:
```
R^{p1}_s = r^{p1}_{p2} R^{p2}_s + r^{p1}_s
R^{p2}_s = r^{p2}_{p1} R^{p1}_s
```
Solve:
```
R^{p2}_s = r^2_1 r^1_s / ( 1 - r^2_1 r^1_2 )                          (eq 12.19)
```
- Note the structural similarity to eq 8.1. The denominator term `r^2_1 r^1_2` **is the loop
  gain**.
- `r^1_2` is negative, so `-r^2_1 r^1_2` is positive: negative feedback **reduces** the
  sensitivity of `P2` to the signal, locking `P2` into a narrow range.
- Set the feedback term to zero and eq 12.19 collapses to `R^{p2}_s = r^2_1 r^1_s`.
- If the loop gain is large (`-r^2_1 r^1_2 >> 0`):
```
R^{p2}_s = r^1_s / r^1_2       and for n layers    R^{pn}_s = r^1_s / r^1_n
```
> the cascade acts as a **negative feedback amplifier** ... If the two gains remain relatively
> constant over the operating range, then the cascade acts as a **tracking device** ...
> **the feedback response depends only on the feedback sensitivity and the effect of the input
> on the first layer** ... the performance of the cascade is independent of the middle layers
> ... immune to noise or natural genetic variation in the protein levels in the middle layers.

Exactly the generic feedback result of Ch 8, now in cascade form.

## Quantities to calculate for a cycle / cascade
`T` and the mole fractions `M_i`; both arm elasticities at the operating point; `C^p_e1`,
`C^J_e1`; `R^p_T`, `R^J_T`; for cascades, each layer's `r`, then their product; for feedback
cascades, the loop gain.

## Validation
- `Σ_i M_i C^{si}_{ej} = 0` (eq 12.8) for each perturbed enzyme.
- `Σ_i M_i R^{si}_T = 1` (eq 12.9).
- Cycle summation `C^p_e1 + C^p_e2 = 0` (unmodified).
- **Modified** connectivity (eq 12.7) - do not use the standard form on cycle species.
- Conservation totals numerically constant across the simulation.
- Ultrasensitivity claim: check `R^Y_X > 1` on the MCA definition, and say which definition.

## Common mistakes
- Applying the **standard** connectivity theorem to species in a conserved cycle.
- Claiming ultrasensitivity for a single cycle whose enzymes are unsaturated - impossible
  (`C^p_e1 <= 1`).
- Confusing zero-order ultrasensitivity (single cycle, saturable kinetics) with first-order
  ultrasensitivity (multiple cycles, linear kinetics).
- Mixing the two `R` definitions (`S_0.9/S_0.1` vs `dln Y/dln X`).
- Ignoring sequestration, then being unable to explain emergent bistability - see the
  Markevich switch, where **conservation constraints alone** produce apparent regulation.
- Forgetting that `T` is a perturbable parameter, and a realistic drug target.
- In cascades, treating the layer-level `r` coefficients as reaction-level elasticities.

## Related concepts
[[moiety_conservation]], [[connectivity_theorems]], [[summation_theorems]],
[[response_coefficients]], [[negative_feedback]], [[stability]], [[validation_rules]]

## Source
Chapter: 12 (Moiety Conserved Cycles)
Section: 12.1 Moiety Conserved Cycles (Constraining Species Levels; Simple Cycle with
Non-Linear Kinetics); 12.2 MCA of Conserved Cycles; 12.3 Using MCA to Understand
Ultrasensitivity (Derivation by Implicit Differentiation; Sensitivity of the Cycle to Changes
in T); 12.4 Cycle Connectivity Theorems (Other Relationships; Dual Cycles - First-Order
Ultrasensitivity); 12.5 Sequestration (Ultrasensitivity via Sequestration; The Markevich
Switch); 12.6 Cascades (Effect of Modulating the Input Signal; Effect of Modulating the Cycle
Totals; Cascades with Negative Feedback)
Pages: book p221-249 (PDF 229-257); cycle control equations Appendix B.2 book p261-262 (PDF 269-270)
