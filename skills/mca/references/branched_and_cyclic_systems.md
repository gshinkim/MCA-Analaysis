# Branched and Cyclic Systems

Moiety-conserved cycles are treated separately in [[conserved_cycles]]. This file covers
branch points and futile/substrate cycles.

---

# Part 1 - Branched pathways

## How to recognise it
Any node species where more than one reaction produces or consumes it. Branching is
"one of the most common patterns in biochemical networks. Even a pathway such as glycolysis,
often depicted as a straight chain in textbooks, is in fact a highly branched pathway."

## What changes mathematically
Mass conservation at a node with `b` entering and `d` leaving branches:
```
Σ_{i=1..b} v_i - Σ_{j=1..d} v_j = ds_i/dt ,  and at steady state  Σ v_in = Σ v_out
```
For the simple branch `v1 -> S -> (v2 -> J2, v3 -> J3)`: `J1 = J2 + J3`.

**There are now multiple fluxes, so multiple full sets of control coefficients.** For the
simple branch: 9 flux control coefficients (3 fluxes x 3 enzymes) and 3 concentration
control coefficients - 12 in all (Table 7.1). **Always state which flux a coefficient
refers to.**

## Which relationships still apply
- Flux summation, **once per flux**: `Σ_i C^{J1}_ei = 1`, `Σ_i C^{J2}_ei = 1`, `Σ_i C^{J3}_ei = 1`.
- Concentration summation, per species.
- Flux connectivity, **once per flux**: `Σ_i C^{Jk}_ei ε^{vi}_s = 0`.
- Concentration connectivity as usual.

## The extra constraints - branch-point theorems
Summation plus connectivity give 2 equations for 3 unknowns per flux. A third relation is
needed. Define `α = J2/J1` (fraction down the upper branch), `1-α = J3/J1`.

**Thought experiment**: raise `E2` by `δe2` (S falls, `J1` rises through relief of product
inhibition, `J3` falls); then adjust `E3` so `S` is restored, giving `δs = 0`; since `E1` was
untouched and `δs = 0`, `δJ1 = 0`.

**Flux branch-point theorems**
```
C^{J1}_e2 (1-α) - C^{J1}_e3 α = 0
C^{J2}_e1 (1-α) + C^{J2}_e3     = 0
C^{J3}_e1 α     + C^{J3}_e2     = 0
```
**Concentration branch-point theorems**
```
C^s_e2 (1-α) + C^s_e3 α = 0
C^s_e1 (1-α) + C^s_e3   = 0
C^s_e1 α     + C^s_e2   = 0
```

## Matrix form
Using the `J2` set (one summation, one connectivity, one branch theorem):
```
[ C^{J2}_e1  C^{J2}_e2  C^{J2}_e3 ] [ 1  -ε^1_1   0    ]   [ 1  0  0 ]
[ C^s_e1     C^s_e2     C^s_e3    ] [ 1  -ε^2_1  (1-α) ] = [ 0  1  0 ]
                                    [ 1  -ε^3_1   1    ]
```
Invert the elasticity matrix to obtain the control equations.

## The control equations (eq 7.1, 7.2)
With `ε1 ≡ ε^1_s`, `ε2 ≡ ε^2_s`, `ε3 ≡ ε^3_s` and
```
d = ε2 α + ε3 (1-α) - ε1        (positive: ε1 < 0, ε2 > 0, ε3 > 0)
```
```
C^{J2}_e1 = ε2 / d                     > 0
C^{J2}_e2 = (ε3(1-α) - ε1)/d           > 0
C^{J2}_e3 = -ε2(1-α)/d                 < 0

C^s_e1 = 1/d           > 0
C^s_e2 = -α/d          < 0
C^s_e3 = -(1-α)/d      < 0
```
Also derivable by implicit differentiation of `ds/dt = v1 - v2 - v3 = 0`, which gives the
same `C^s_e1 = 1/d`.

## What the signs mean
- `C^s_e1 > 0`: the feed step raises the branch metabolite. `C^s_e2, C^s_e3 < 0`: consuming
  steps lower it. Each output branch's effect on the metabolite is **in proportion to the
  flux it carries** (`α` and `1-α`), so a branch carrying little flux barely affects the
  branch-point metabolite.
- **`C^{J2}_e3 < 0`**: raising the activity of one output branch **decreases** the flux in the
  other. *"There is competition between the output branch for flux. If one branch becomes
  more active, then it can 'steal' flux from the other branch."*

## Magnitudes - the linear-pathway bound does not hold

> Unlike a linear pathway, the values for `C^{J2}_e2` and `C^{J2}_e1` are not bounded between
> zero and one. Depending on the values of the elasticities, it is possible for the control
> coefficients in a branched system to greatly exceed one.

### Limit A: most flux through `J3` (`α -> 0`, `1-α -> 1`)
```
C^{J2}_e2 -> (ε1 - ε3)/(ε1 - ε3) = 1
C^{J2}_e3 -> ε2/(ε1 - ε3)
```
`E2` acquires proportional control over its own small flux (changes in `E2` barely move `S`).
By summation, the other two must be equal and opposite; `C^{J2}_e3` is negative so
`C^{J2}_e1` is positive. This regime produces **ultrasensitivity**: coefficients much greater
than one. The book's Tellurium example (Table 7.2):

| Coefficient | Value |
|---|---|
| `C^{J2}_e1` | 8.34 |
| `C^{J2}_e2` | 0.99 |
| `C^{J2}_e3` | -8.51 |

A 1% increase in `E1` gives an 8% increase in `J2`. *"Imagine a small stream coming off a
large river. Any flooding in the large river is likely to have a huge impact on the small
stream."*

It is also possible to arrange constants so every step has `|C^{J2}| = 1` (one of them -1),
i.e. **every step is equally "rate limiting"** - which the book uses to show again that rate
limitation is not the simple concept it is taken to be.

### Limit B: most flux through `J2` (`α -> 1`)
```
C^{J2}_e2 -> ε1/(ε1 - ε2)          C^{J2}_e3 -> 0
```
The system "has effectively become a simple linear chain"; the minor branch has negligible
influence on the major one.

### What raises branch-point sensitivity
Besides an asymmetric flux split, raising `ε2` relative to `ε3`:
1. `E2` shows **positive cooperativity** w.r.t. the branch species, amplifying changes;
2. `v3` operates more **saturated** than `v2` (i.e. `Km` of `v2` higher than `Km` of `v3`),
   making `ε3 < ε2`;
3. **product inhibition on `v1` is very small**.

## Quantities to calculate at a branch
`α = J2/J1`; all three elasticities at the node; the full FCC set for **each** flux; the CCC
set for the node species; then check summation, connectivity **and** the branch theorems.

## Interpretational errors specific to branches
- Reporting "the" flux control coefficient without naming the flux.
- Treating a negative FCC as an error. It is expected for competing branches.
- Treating `|C| > 1` as an error. It is expected when the flux split is very asymmetric.
- Applying `Σ C^J = 1` across coefficients belonging to **different** fluxes.
- Forgetting the branch theorem and trying to solve an under-determined system.
- Reading a big `C^{J2}_e1` as "step 1 controls the pathway" when it really means "the minor
  branch is hypersensitive to the major limbs."

---

# Part 2 - Futile / substrate cycles

## How to recognise it
Two chemically distinct opposing reactions interconverting the same pair of species, embedded
in a chain: `S1 -v2-> S2` and `S2 -v3-> S1`, with `v1` feeding `S1` and `v4` draining `S2`.
Typically one direction is ATP-driven and the other is a hydrolysis. Metabolic examples:
glucose/glucose-6-phosphate; fructose-6-phosphate/fructose 1,6-bisphosphate.

Called "futile" because of ATP expenditure with no apparent benefit. Proposed rationales the
book lists: heat production, control of flux direction, metabolite buffering, and **more
sensitive control of net flux** - the only one it analyses.

## Maximum amplification (simple argument)
Flux constraint `v1 = v2 - v3`. Assume a perturbation in `v2` appears entirely in `v1`
(`δv2 = δv1`) and `v3` is unchanged (e.g. `v3` saturated by `S2`):
```
(δv1/v1)/(δv2/v2) = v2/v1 = (v1 + v3)/v1 = 1 + v3/v1                       (eq 7.3)
```
> The higher the cycling rate (`v3`) compared to the through flux, the greater the amplification.

Book's numeric illustration: `v1 = v4 = 10`, `v2 = 200`, `v3 = 190`. Activating `v2` by 5%
(to 210) with `v3` fixed gives `v1 = v4 = 20` - a **100% change, a twenty-fold amplification**.

**Eq 7.3 gives only the maximum.** In practice `v3` will not stay fixed because `S2` rises,
and `S1` falls (raising `v1` through reduced product inhibition and lowering `v2`), so the
real amplification is smaller and more complicated.

## Full MCA treatment
```
C^{J1}_2 = ε^1_1 ε^4_2 (1 + v3/v1) / D
D = ε^1_1 ε^4_2 (1 + v3/v1) - ε^1_1 ε^2_2 + ε^4_2 ε^2_1 + (v3/v1)(ε^1_1 ε^3_2 + ε^4_2 ε^3_1)
```
Simplify by assuming no product inhibition of `S2` on `v2` and of `S1` on `v3`
(`ε^3_1 = 0`, `ε^2_2 = 0`), multiply through by `v1`, and use `v1 + v3 = v2`:
```
C^{J1}_2 = ε^1_1 ε^4_2 v2 / D
D = ε^1_1 ε^4_2 v1 - ε^4_2 ε^2_1 v2 + ε^1_1 ε^3_2 v3
```

**Two immediate readings:**
1. **There must be product inhibition on the first step.** If `ε^1_1 = 0` then `C^{J1}_2 = 0`,
   because all control is then on the first step. *"This highlights again the danger of using
   rate laws in models that are product insensitive because the use of such rate laws often
   give misleading or trivial results of no real interest."*
2. **`ε^3_2` matters.** It is the activation of the reverse arm by `S2`. The larger it is, the
   **smaller** the amplification, because flux that returns along the reverse cycle instead of
   going into `v4` is lost amplification.

If `v2, v3 >> v1`:
```
C^{J1}_2 = v2 / ( v3 ε^3_2/ε^4_2 - v2 ε^2_1/ε^1_1 )
```
and with `v2 ≈ v3` (very high cycling), maximal sensitivity when
```
ε^3_2/ε^4_2 + ε^2_1/ε^1_1  ≈ 1
```
Reading: substrate activation of `v4` by `S2` should be **stronger** than substrate activation
of `v3` by `S2`; and product inhibition of `S1` on `v1` should be **stronger** than substrate
activation of `S1` on `v2`.

The book's own verdict: *"The requirements for amplification in substrate cycles is fairly
complicated and questions remain whether real pathways use this mechanism in vivo."*

## Interpretational errors specific to cycles
- Quoting eq 7.3 as the actual amplification rather than the ceiling.
- Building a model with product-insensitive rate laws and then being surprised by trivial or
  misleading control results.
- Confusing a **futile/substrate cycle** (net through-flux, chemically distinct arms, no
  conservation constraint required) with a **moiety-conserved cycle** (fixed total mass,
  `s1 + s2 = T`, treated in [[conserved_cycles]]).

## Related concepts
[[summation_theorems]], [[connectivity_theorems]], [[deriving_control_equations]],
[[conserved_cycles]], [[interpretation_rules]], [[common_failure_modes]]

## Source
Chapter: 7 (Branched and Cyclic Systems)
Section: 7.1 Branched Pathways (Most Flux Through J3; Most Flux Through J2; Derivation by
Implicit Differentiation); 7.2 Futile or Substrate Cycles (Sensitivity Control)
Pages: book p113-124 (PDF 121-132); Appendix B.3 book p262-263 (PDF 270-271);
FCCs > 1 also noted Ch 3.5 book p49 (PDF 57)
