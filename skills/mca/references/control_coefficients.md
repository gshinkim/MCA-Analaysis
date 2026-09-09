# Control Coefficients

## Definition
A control coefficient measures how much influence a given reaction step has on a
**steady-state** flux or species concentration. It is a **system** property: it can only be
computed or measured on the intact network.

## Mathematical definition

**Flux control coefficient (FCC)** - eq 3.1:
```
C^J_ei = (dJ/dei)(ei/J) = dln J / dln ei  ≈  J% / ei%
```

**Concentration control coefficient (CCC)** - eq 3.2:
```
C^sj_ei = (dsj/dei)(ei/sj) = dln sj / dln ei  ≈  sj% / ei%
```

`J` is the steady-state flux; `ei` is the concentration of the enzyme catalysing step `i`.
Both are dimensionless. Note `d`, not `∂`: the system is allowed to relax to a *new steady
state* before the response is read.

**Canonical (parameterless) control coefficient** - eq 4.16:
```
C^J_vi = (dJ/dvi)(vi/J) = C^J_ei / ε^vi_ei
```
Here `dvi` means a change in the local rate of step `i` produced by *some* parameter, with
reactants, products and other effectors held constant - "the change in the reaction rate we
could impose if the reaction were not connected to the rest of the network". The parameter
could be enzyme concentration, `kcat`, or an external inhibitor. Since `ε^vi_ei = 1` in most
cases, `C^J_ei = C^J_vi`. **Strictly, the summation and connectivity theorems apply to the
canonical coefficients**; using enzyme-based coefficients is safe only because `ε^vi_ei = 1`.
(Ch 4.4, book p63-64.)

## What is perturbed, what is measured, what is held constant

| | FCC | CCC | Response coefficient |
|---|---|---|---|
| perturbed | enzyme concentration/activity `ei` | `ei` | external factor `x` (drug, nutrient, boundary species) |
| measured | steady-state flux `J` | steady-state concentration `sj` | `J` or `s` |
| held constant | all other enzymes, boundary conditions | same | all enzyme levels |
| local or systemic | **systemic** | **systemic** | **systemic**, and factorises into local × systemic |
| needs steady state | yes | yes | yes |

Operational procedure (Ch 3.2, book p35): make a small change to `Ei`, **wait for the
system to reach a new steady state**, take the ratio of fractional changes. **Restore `Ei`
to its original value before moving to the next step.**

## Intuition
Ch 3.2 walks a five-step chain from empty pools to steady state, then doubles `E2`. `v2`
rises, `S1` falls, `S2` rises, downstream species rise, and product inhibition of step 1 is
relieved so `v1` rises. Net: flux up, `S1` down, everything downstream of `v2` up. The
control coefficient is the scaled limit of that whole system response.

Ch 3.3 gives the graphical version for `Xo -> S -> X1`: plot `v1` and `v2` against `s`;
their intersection is the steady state. Raising `E2` scales the `v2` curve up and moves the
intersection **left** (`s` falls). Raising `E1` scales `v1` up and moves it **right**
(`s` rises). Raising **both** by the same fraction moves the intersection straight up: flux
rises by that fraction, `s` does not change at all.

## Operational meaning
`C^J_e = 0.2` means: increasing that enzyme's activity by 1% increases the steady-state flux
through the pathway by 0.2% (Example 3.1).

## Prediction equations (Ch 3.4, eq 3.3, 3.4)

For small changes at several steps at once, responses add:
```
dJ/J = Σ_{i=1..n} C^J_ei (dei/ei)
ds/s = Σ_{i=1..n} C^s_ei (dei/ei)
```
Proof is the scaled total derivative (Box 7.1, book p40). Worked examples: FCCs 0.2 and 0.4
with `E1` up 10% and `E3` up 20% give `δJ/J = 0.1·0.2 + 0.2·0.4 = 0.1`, i.e. 10%. With FCCs
{0.15, 0.4, 0.1, 0.3, 0.05} and a 20% increase allowed on two steps, engineer steps 2 and 4
for `0.2·0.4 + 0.2·0.3 = 14%`.

## Assumptions
- **A steady state exists and the system is at it.**
- Changes are infinitesimal; finite changes are approximations that hold while changes are
  small. Defining them with large finite changes `ΔJ/ΔE` makes the value depend on the size
  of the perturbation, because rate laws are nonlinear (Ch 3.2 book p34; Exercise 2 book p50).
- If expressed via enzyme concentration: `vi ∝ Ei`, and changing one `Ei` does not change any
  other enzyme's concentration (Ch 3.5, book p45). The canonical definition relaxes this.

## What determines the value (Ch 3.5, book p47-48)
For a middle step `v2` of a three-step chain, the local equation reads
```
δv2/v2 = ε^2_1 (δs1/s1) + ε^2_2 (δs2/s2) + ε^2_e2 (δe2/e2)
```
The enzyme term pushes the rate up; `S1` falls and `S2` rises, and both changes push the
rate back down through the elasticities. **If both flanking elasticities are large, the
enzyme's effect is largely zeroed out and the FCC is small. If they are small, the FCC is
larger.** That is the mechanism behind the connectivity theorem.

## How to interpret

**Sign**
- FCC positive: raising that enzyme raises the flux. Usual case in an unbranched chain.
- FCC negative: raising that enzyme *lowers* that flux. Occurs at branch points, where
  branches compete for flux (Ch 7.1).
- CCC positive: the step is (net) upstream of that metabolite in effect - raising the enzyme
  raises the metabolite. CCC negative: raising the enzyme consumes the metabolite faster.
- For a linear chain: for a given species `S`, the CCC is negative w.r.t. exactly the step
  that consumes it downstream-of-production and positive w.r.t. upstream steps - Ch 3
  Exercise 9 uses this to locate `S` in the pathway.

**Magnitude**
- In a linear pathway with the usual sign pattern (reactants raise rates, products lower
  them), `0 <= C^J_i <= 1` (Ch 6.1, book p93). The average in an `n`-step chain is `1/n`.
- **In branched and cyclic systems FCCs can greatly exceed 1 and can be negative**
  (Ch 3.5 book p49; Ch 7.1 book p117-118). Do not carry the linear bound across.
- CCCs are not bounded by 1 in general. Table 6.3 shows values around ±2 for a plain
  three-step chain, and Ch 12.3 shows cycle CCCs of 4.5 and higher.

**Distribution**
- Flux control is shared. It is unlikely a single step has exclusive control.
- If one step gains flux control, one or more others must lose it (summation theorem).
- Control is dynamic: it changes as pathway conditions change.
- The book's own three-step Tellurium example (Table 3.1) gives
  `C^J_e1 = 0.3677, C^J_e2 = 0.1349, C^J_e3 = 0.4989` - almost half the control on the
  **last** step, showing the committed step need not carry the control.

**Biological reading the book highlights**: if most control coefficients in a pathway are
small, a 50% loss of one enzyme's activity has little effect - suggested as the molecular
basis of metabolic dominance/recessiveness in heterozygotes (Ch 3.5, book p46).

## How to calculate
1. **From elasticities via the theorems** - summation + connectivity (+ branch/cycle
   theorems as topology requires). See [[deriving_control_equations]].
2. **By matrix inversion** of the elasticity/theorem matrix. Same file.
3. **By implicit differentiation** of `ds/dt = N v(s(e), e) = 0`. Same file.
4. **From an analytic flux expression**, where one exists (linear chains with linear
   kinetics): eq 6.5 -> eq 6.6. See [[linear_pathways]].
5. **Numerically by simulation**: perturb, re-solve the steady state, take the ratio; or use
   `roadrunner.getCC()`. See [[computational_mca]].
6. **Experimentally**: genetics, inhibitor titration, reconstitution, expression control.
   See [[experimental_mca]].

## Validation
Always available: the summation theorems (`Σ C^J = 1`, `Σ C^s = 0`). If elasticities are
known, also the connectivity theorems. In branches, also the branch-point theorems; in
cycles, the modified cycle theorems. Full checklist: [[validation_rules]].

Extra internal check when you have symbolic control equations for a linear chain: **every
term in a numerator also appears in the common denominator** (Ch 6.1, book p93), and the
denominator is the same for every coefficient of the pathway.

## Common mistakes
- Reporting a control coefficient without saying **which flux** it refers to. In a branched
  system there is one full set per flux (Table 7.1: 9 FCCs + 3 CCCs for a single branch point).
- Confusing `C^J_e` (systemic) with `ε^v_e` (local, and equal to 1).
- Assuming the coefficient is a fixed property of the enzyme. It depends on the state of the
  whole system, including external conditions (Ch 5.3: Rubisco flux control was 0.69-0.83 at
  high illumination but 0.05-0.2 at moderate illumination or high CO2).
- Using finite 20-50% perturbations and calling the ratio "the" control coefficient without
  flagging the approximation.
- Reading `C^J_e1 = 1` as proof of a classic rate-limiting step without checking whether
  step 1 is simply product-insensitive (`ε^1_1 = 0`), which forces that result (Ch 6.4).

## Related concepts
[[elasticities]], [[summation_theorems]], [[connectivity_theorems]], [[response_coefficients]],
[[deriving_control_equations]], [[branched_and_cyclic_systems]], [[interpretation_rules]],
[[common_failure_modes]]

## Source
Chapter: 3 (Introduction to Biochemical Control); 4.4 (canonical control coefficients)
Section: 3.1 What do we mean by Control?; 3.2 Control Coefficients; 3.3 Distribution of
Control; 3.4 Predicting Flux and Concentration Changes; 3.5 (summary list, rate-limiting
steps); 4.4 Canonical Control Coefficients
Pages: book p31-49 (PDF 39-57); book p63-64 (PDF 71-72); bounds Ch 6.1 book p93 (PDF 101)
