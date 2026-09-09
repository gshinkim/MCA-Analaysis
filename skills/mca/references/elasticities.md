# Elasticity Coefficients

## Definition
The elasticity coefficient measures how sensitive a **single reaction rate** is to a change
in the concentration of one of its effectors - substrate, product, other modifier, or the
enzyme itself - with everything else held constant. It is a **local** property of one
reaction, not a property of the network.

## Mathematical definition

Scaled elasticity (the default; dimensionless because of the scaling):

```
ε^v_si = (∂v/∂si)(si/v) |_{sj, sk, ...}  =  ∂ln v / ∂ln si  ≈  v% / si%      (eq 2.2)
```

Unscaled elasticity (used in Ch 9-10 for the Jacobian):

```
E^v_si = (∂v/∂si) |_{sj, sk, ...}                                            (eq 2.3)
```

Conversion: `E^i_j = ε^i_j · (v_i / s_j)`  (Ch 10.2, book p176).

Equivalent forms, each emphasising something different (Ch 2.8):

```
ε^vi_sj = (∂vi/vi)/(∂sj/sj)   ratio of fractional changes
        = (sj/vi)(∂vi/∂sj)    scaled slope on a linear plot
        = ∂ln vi / ∂ln sj     slope of a log/log plot
```

Notation: subscript = the modulating factor; superscript = the effect measured. From Ch 4
onward the book abbreviates `ε^{v2}_{s1}` to `ε^2_1`.

## Intuition
The elasticity is the scaled slope of the rate-vs-concentration curve at the current
operating point. On a log-log plot of `v` against `s`, it is simply the slope, which is why
log-log plots of enzyme rate data let you read elasticities off directly (Fig 2.3, 2.4).

## Operational meaning

> The elasticity is the fractional change in reaction rate in response to a fractional
> change in a given reactant or product, while keeping all other reactants, products, and
> other effectors constant. (Ch 2.2, book p11)

Approximate percentage form: `ε^v_si ≈ (% change in v)/(% change in si)` (eq 2.4). Example
from the book: substrate up 2%, rate up 1.5% gives `ε ≈ 0.75`.

**Warning about finite changes.** The elasticity is strictly defined for infinitesimal
changes. The percentage form is only a good estimate while the changes are small; the
larger the perturbation and the greater the local curvature, the worse the estimate
(Ch 2.2, book p12; Ch 2.2 Example 2.3).

## Signs
- Effectors that **increase** a rate have **positive** elasticity.
- Effectors that **decrease** a rate have **negative** elasticity.
- So reactants generally have positive elasticities, products generally negative (Fig 2.2).
- Enzyme elasticity: `ε^v_e = 1` whenever `v ∝ e` (eq 2.13, eq 3.7). This holds for
  irreversible and reversible Briggs-Haldane forms.

Counting: there are as many elasticities for a reaction as there are effectors that
influence it - substrates, products, allosteric effectors, and also pH, ionic strength etc.

## Assumptions
- Partial derivative: **every other effector is clamped**. Algebraically this is partial
  differentiation; experimentally it means clamping those concentrations.
- The elasticity is **not a constant**. Unlike `Km` or `Ki`, it depends on the
  concentrations of all effectors. An elasticity measured at 2 mM substrate must not be
  reused at 20 mM (Ch 2.8, book p29).
- **Elasticities must be measured under in vivo conditions**: if an enzyme is purified to
  measure elasticities, substrate/product concentrations, pH, ionic strength etc. must be
  recreated to mimic the in vivo state, or the numbers are useless (Ch 2.1, book p9-10).

## How to calculate

### 1. Analytically, from a known rate law
Differentiate and scale. Worked results the book gives:

| Rate law | `ε^v_s` | Source |
|---|---|---|
| `v = k` | 0 | Ex 2.1 |
| `v = k s` | 1 | Ex 2.1 |
| `v = k s^2` | 2 | Ex 2.1 |
| `v = k s^n` | `n` | Ex 2.1 |
| `v = k ∏ si^ni` (irreversible mass action) | `ni` | Ch 2.3 |
| `v = k1 s - k2 p` | `ε^v_s = k1 s/(k1 s - k2 p) = vf/v`; `ε^v_p = -k2 p/(k1 s - k2 p) = -vr/v` | eq 2.6, 2.7 |
| same, in terms of `ρ` | `ε^v_s = 1/(1-ρ)`; `ε^v_p = -ρ/(1-ρ)` | eq 2.9 |
| `v = k1 ∏ si^ni - k2 ∏ pi^mi` | `ε^v_si = ni/(1-ρ)`; `ε^v_pi = -mi/(1-ρ)` | eq 2.12 |
| `v = Vm s/(Km + s)` (irreversible Briggs-Haldane) | `Km/(Km + s)` | Ch 2.4 |
| `v = Vm s^n/(Kd + s^n)` (Hill) | `n Kd/(Kd + s^n) = n/(1 + (s/KH)^n)` | eq 2.15 |
| `v = e kcat s/(Km + s)`, w.r.t. `e` | 1 | eq 2.13 |
| `v = Vm s/((Km+s)(1+i/Ki))` (non-competitive I) | `ε^v_i = -i/(Ki + i)` | Ch 5.4 |
| `v = Vm s/(s + Km(1+i/Ki))` (competitive I) | `ε^v_i = -(i/Ki)/(1 + s/Km)` | Ch 5.4 |
| `v = Vmax xo/(s^n + xo + Km)` (feedback form) | `ε^v_s = n xo Km/(Km + (s/Km)^n)` | Ch 8.4 book p137 |

Key limits worth memorising:
- Irreversible MM: elasticity runs from **1** at low `s` (first-order regime) down to **0**
  at saturation (zero-order regime). At `s = Km`, `ε = 0.5` exactly.
- Hill: elasticity approaches **n** at low `s` (`s << Kd`), then falls to 0 on saturation.
  Cooperativity and allostery produce **high** elasticities, which matters for pathway behaviour.
- Near equilibrium (`ρ → 1`), substrate and product elasticities tend to `+∞` and `-∞`.

### 2. Using the elasticity algebra (Table 2.3, Ch 2.7)
`a` = constant, `x` = variable, `ε(f)` = elasticity of expression `f` w.r.t. the variable:

```
1.  ε(a) = 0
2.  ε(x) = 1
3.  ε(f ± g) = ε(f)·f/(f+g) ± ε(g)·g/(f+g)
4.  ε(x^a) = a
5.  ε(f^a) = a·ε(f)
6.  ε(f·g) = ε(f) + ε(g)
7.  ε(f/g) = ε(f) - ε(g)
```

These reduce messy rate laws quickly. Worked in the book for `k1 s - k2 p` and for
`Vm s/(Km+s)`. The book also gives a Mathematica script encoding these rules (Fig 2.9),
extended with log, sin, cos and power cases.

### 3. Numerically, by perturbation
Newton's difference quotient (one perturbation):
```
ε^v_s ≈ ((v1 - vo)/vo) / ((s1 - so)/so)
```
Three-point estimate (two perturbations, one up one down) - **the better method**:
```
ε^v_s ≈ (1/2)·((v1 - v2)/(s1 - so))·(so/vo)
```
Book's worked comparison (`v = s/(0.5+s)` at `s = 0.6`, 5% step): exact 0.4546,
difference quotient 0.443 (2.55% error), three-point 0.4549 (0.7% error). Error grows with
local curvature. (Ch 2.2, book p13.)

### 4. Experimentally
Protocol the book gives (Ch 2.2, book p14-15):
1. Set substrate and product to their operating points.
2. Record the reaction rate at that operating point.
3. Restore all concentrations to their original starting points.
4. Increase the substrate concentration by a small amount.
5. Record the new reaction rate.
6. Elasticity = fractional change in rate / fractional change in substrate.
7. At all times keep other substrate, product and effector concentrations at the operating point.

Take care that only a small amount of substrate is consumed during the measurement,
otherwise the estimate is inaccurate. The product must be reset to its first-experiment
value. The same experiment run on the product gives the product elasticity.

For estimating elasticities *in vivo* from perturbation data, see the **double modulation
method** in [[experimental_mca]].

## The disequilibrium ratio and elasticity magnitudes

Definitions (eq 2.8): `Keq = p/s` at equilibrium; `Γ = p/s` (mass-action ratio, not
necessarily at equilibrium); `ρ = Γ/Keq` (disequilibrium ratio). Also `ρ = vr/vf`.

Then `ε^v_p / ε^v_s = -vr/vf = -ρ`, and for reversible mass action:

```
ε^v_s + ε^v_p = 1                                                  (eq 2.10)
```

Consequences the book draws:
- `|ε^v_s| > |ε^v_p|` always for mass-action kinetics. Substrate changes affect the rate
  more than product changes do.
- Therefore signal propagation **amplifies going downstream** and is **attenuated going
  upstream**. This underlies front loading ([[linear_pathways]]).
- Far from equilibrium `ρ ≈ 0`: `ε^v_s ≈ 1`, `ε^v_p ≈ 0`. Near equilibrium `ρ ≈ 1`:
  `ε^v_s → +∞`, `ε^v_p → -∞`. Selected values (Table 2.1): `ρ = 0.98` gives (50, -49);
  `ρ = 0.5` gives (2, -1); `ρ = 0.1` gives (1.111, -0.111).

Reversible Briggs-Haldane summary (Table 2.2, for `Vm/Ks(s - p/Keq)/(1 + s/Ks + p/Kp)`):

| Equilibrium state | Saturation | Elasticities |
|---|---|---|
| near equilibrium | any | `ε^v_s` large positive, `ε^v_p` large negative, `ε^v_s + ε^v_p ≈ 1` |
| far from equilibrium | `s << Ks`, `p << Kp` | `ε^v_s ≈ 1`, `ε^v_p ≈ 0` |
| far from equilibrium | `s >> Ks`, `p >> Kp` | `ε^v_s ≈ 0`, `ε^v_p ≈ 0` |
| far from equilibrium, `p << Kp` | `s/Ks << p/Kp` | `ε^v_s ≈ 1`, `ε^v_p ≈ -1` |
| | `s/Ks ≈ p/Kp` | `ε^v_s ≈ 0.5`, `ε^v_p ≈ -0.5` |
| | `s/Ks > p/Kp` | `ε^v_s < 0.5`, `ε^v_p > -0.5` |

## The local equation - the main use of elasticities

For small changes in several effectors at once, contributions add:

```
δv/v ≈ Σ_j ε^v_sj (δsj/sj)
```

Exact differential form including the enzyme (eq 2.16, "one of the most important
mathematical relations used in MCA"):

```
dv/v = Σ_{j=1..m} ε^v_sj (dsj/sj) + ε^v_e (de/e)                    (Local Equation)
```

This is a scaled total derivative. It is the workhorse in the operational proofs of the
summation, connectivity, response and branch-point theorems. Worked example (Ch 2.6):
`ε^v_s = 0.4, ε^v_p = -0.5, ε^v_i = -0.2` with `δs/s = 0.05, δp/p = 0.03, δi/i = 0.01`
gives `δv/v ≈ 0.003` - a 0.3% change, because product inhibition cancels most of the
substrate effect. Contribution shares: S +54%, P -41%, I -5%.

## How to interpret
- **Sign** tells you the direction: does this species speed the reaction up or slow it down.
- **Magnitude** tells you how strongly. `|ε| ≈ 0`: the step is insensitive (saturated, or
  product-insensitive). `|ε| ≈ 1`: first-order-like, rate roughly proportional. `|ε| >> 1`:
  cooperative/allosteric, or near equilibrium.
- An elasticity is a statement about **one reaction**, not about the pathway. Converting it
  into a statement about pathway control requires the connectivity + summation theorems.

## Validation
- For reversible mass action, check `ε^v_s + ε^v_p = 1`.
- Check signs against the role of the species (substrate positive, product negative,
  inhibitor negative).
- For an irreversible MM step, `0 <= ε^v_s <= 1`; a value outside that range means the rate
  law is not what you assumed.
- If an elasticity is huge, check whether the step is near equilibrium (`ρ → 1`) - and if so
  say so, because it drives the connectivity results.
- Numerically: compare a three-point estimate against the analytic value if the rate law is known.

## Common mistakes
- Reusing an elasticity measured at a different operating point. Elasticities are not
  kinetic constants ([[common_failure_modes]] #6).
- Treating a large elasticity as evidence of large flux control - the connectivity theorem
  says the opposite tendency holds ([[connectivity_theorems]]).
- Forgetting the clamping condition and computing a total rather than partial derivative.
- Using a finite-difference estimate with a large step in a high-curvature region.
- Mixing scaled `ε` with unscaled `E` in the same expression.

## Related concepts
[[control_coefficients]], [[connectivity_theorems]], [[deriving_control_equations]],
[[linear_pathways]], [[stability]], [[experimental_mca]]

## Source
Chapter: 2 (Elasticities); enzyme elasticity restated Ch 3.5; inhibitor elasticities Ch 5.4;
unscaled form used Ch 9.1, 10.2
Section: 2.1 Introduction; 2.2 Elasticity Coefficients; 2.3 Mass-action Kinetics;
2.4 Enzyme Catalyzed Reactions; 2.5 Cooperativity; 2.6 Local Equations;
2.7 General Elasticity Rules; 2.8 Summary
Pages: book p7-29 (PDF 15-37); eq 3.7 book p41 (PDF 49); Ch 5.4 book p79-80 (PDF 87-88)
