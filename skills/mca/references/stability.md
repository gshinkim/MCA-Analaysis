# Stability

## Definition
> A biochemical pathway is **internally stable** if at steady state, small perturbations to
> the floating species relax back to the steady state.

**Caveat stated with the definition**: if the perturbed species is part of a conserved cycle,
the total mass in the cycle must remain constant during the perturbation. That may require
perturbing one species positively and another negatively.

**External stability**: a finite change to an input produces a finite change to the internal
state. In control theory, BIBO (Bounded Input Bounded Output). *"It is very important to bear
in mind that the finite change in the internal state refers to a linearized system"* - a
nonlinear system's output may be bounded by physical constraints instead. A system that is
internally unstable is also unstable to changes in inputs. **Same test**: real parts of the
Jacobian eigenvalues all negative. Relevant inputs include boundary species, a drug
intervention, or the total mass of a conserved cycle.

## The one-variable intuition
For `Xo -k1xo-> S1 -k2s1-> X1`: `ds1/dt = k1xo - k2s1`, steady state `s1 = k1xo/k2`.
Perturb by `δs1`:
```
d(δs1)/dt = -k2 δs1
```
Negative, so the disturbance decays: **stable**. Graphically (Fig 9.2), plot `ds1/dt` against
`s1`: below the steady state the net rate is positive (S rises), above it the net rate is
negative (S falls). The larger `k2`, the faster the relaxation.

Dividing by `δs1` and taking the limit: `∂(ds1/dt)/∂s1 = -k2` - a one-element Jacobian.

## The Jacobian

```
J = d(ds/dt)/ds ,  entries  J_ij = ∂(ds_i/dt)/∂s_j                    (eq 9.4)
d(δs)/dt = J δs                                                       (eq 9.5)
```

**For biochemical systems** the Jacobian factorises (eq 9.7):
```
J = N · (∂v/∂s)
```
`N` = stoichiometry matrix; `∂v/∂s` = matrix of **unscaled** elasticities `E^{vi}_{sj}`,
`n` reactions (rows) x `m` species (columns). Many entries are zero because not every species
affects every reaction.

> This is a very important result. Given that stability is determined from the Jacobian, this
> result indicates that **stability is a function of network topology and the kinetics of the
> individual reactions.** ... it is not always possible to discern the functional dynamics of a
> motif just from the topological structure.

**Footnote in the source**: `∂(ds/dt)/∂s = N ∂v/∂s` "is modified if there are conserved cycles
in the pathway." See [[moiety_conservation]] - the full Jacobian is then singular.

Worked example (branched, `v1,v2,v3` on `S1`, `v3,v4,v5` on `S2`):
```
      [ -1 -1 -1  0  0 ]            [ E^{v1}_{s1}   0          ]
N =   [  0  0  1 -1 -1 ]   ∂v/∂s =  [ E^{v2}_{s1}   0          ]
                                    [ E^{v3}_{s1}  E^{v3}_{s2} ]
                                    [  0           E^{v4}_{s2} ]
                                    [  0           E^{v5}_{s2} ]

N ∂v/∂s = [ -E^{v1}_{s1} - E^{v2}_{s1} - E^{v3}_{s1}    -E^{v3}_{s2}                       ]
          [  E^{v3}_{s1}                                 E^{v3}_{s2} - E^{v4}_{s2} - E^{v5}_{s2} ]
```

## The stability criterion

> The steady state for the biochemical system `ds/dt = N v(s, p)` (eq 9.6) is **stable if all
> the eigenvalues of the system's Jacobian matrix have negative real parts**. The system is
> **unstable if at least one of the eigenvalues has a positive real part.**

Solutions of `dx/dt = Ax` are sums `x_j(t) = Σ c_i K_i e^{λ_i t}` with `λ_i` the eigenvalues
and `K_i` the eigenvectors; negative real parts make the exponentials decay.

**The Jacobian entries are usually functions of the species levels, so the Jacobian must be
evaluated at the steady state of interest.**

## How to test
```python
r.steadyState()
r.getEigenvalues()        # e.g. [[-0.3  0.]]  -> one negative eigenvalue -> stable
```
By hand: write `ds/dt`, differentiate w.r.t. each species, substitute the steady-state values,
compute eigenvalues (`det(λI - A) = 0`).

Book examples:
- `ds1/dt = -2s1; ds2/dt = 2s1 - 4s2` -> eigenvalues -2, -4 -> stable.
- `ds1/dt = 3 - 2s1; ds2/dt = 2s1 - 4s2` -> Jacobian `[[-2,0],[2,-4]]` -> -2, -4 -> stable.
- `ds1/dt = vo - s1 - s1(1+s2^3)`, `ds2/dt = s1(1+s2^3) - 5s2`, at `s1 = 2.295, s2 = 1.14,
  vo = 8` -> Jacobian `[[-3.4815, -8.948],[2.482, 3.948]]` -> `0.2333 ± 2.9i` -> **unstable**,
  and complex, so **periodic behaviour**.

## Phase portraits - reading the eigenvalue pattern

| Description | Eigenvalues | Behaviour |
|---|---|---|
| both positive | `r1 > r2 > 0` | unstable node |
| both negative | `r1 < r2 < 0` | stable node |
| opposite signs | `r1 < 0 < r2` | saddle point (**unstable**) |
| complex conjugate, positive real part | | unstable spiral (focus) |
| complex conjugate, negative real part | | stable spiral (focus) |
| pure imaginary | real part 0 | centre |

(Table 9.1; also summarised diagrammatically in Fig 9.11 as stable node / stable focus /
saddle point / unstable focus / unstable node.)

Notes the book adds:
- **Saddle point**: trajectories approach along the *stable manifold* only; every other
  direction diverges. Counted as unstable.
- **Complex eigenvalues always come in conjugate pairs**, because for a 2x2 matrix
  `λ = [tr(A) ± sqrt(tr²(A) - 4det(A))]/2` and a negative discriminant forces the `±` pair.
  Euler's formula `e^{(a+bi)t} = e^{at}(cos bt + i sin bt)` turns them into real trigonometric
  solutions: **complex eigenvalues mean periodic behaviour** (proof in the Ch 9 appendix).
- **Unstable spiral**: in a purely linear system trajectories expand forever; they converge to
  a stable oscillation only if nonlinear elements limit the expansion - that is a **limit cycle**.
- **Centre**: zero damping, zero energy loss; the oscillation amplitude depends on the initial
  conditions. *"Such a situation is rare in biology ... Biological oscillators are invariably
  energy dependent and the frequency is independent of the initial conditions. Biological
  oscillators therefore tend not to be center types."*
- **A simple three-step pathway with linear mass-action kinetics cannot exhibit anything other
  than a stable node** (`J = [[-k1,0],[k1,-k2]]`, eigenvalues `-k1`, `-k2`).

## Bifurcation plots and bistability
A bifurcation plot is the steady-state value of a variable plotted against a parameter. Simple
systems have one steady state per parameter set, so their plots are unremarkable; the interest
lies in **multiple steady states**.

**Positive-feedback model** (Ch 9.4): `v1 = b + k1 s1^4/(k2 + s1^4)`, `v2 = k3 s1`, with
`k1 = 0.9, k2 = 0.3, k3 = 0.7, b = 0.1`. Plotting `v1` and `v2` against `s1` gives up to three
intersections (steady states) at `s ≈ 0.145, 0.683, 1.309`. Varying `k3` moves them:
`k3 = 0.26` leaves only a high state; `k3 = 0.7` gives three; `k3 = 1.2` leaves only a low state.

**Graphical stability test at each intersection**: perturb `s` upward. If `v2 > v1` afterwards,
`ds/dt < 0` and the perturbation is restored (**stable**). If `v1 > v2`, `ds/dt > 0` and the
perturbation grows (**unstable**). Lower and upper states are stable; the middle one is
unstable. This is a **bistable** system.

**Stability criterion for positive feedback**, from the single-element Jacobian:
```
(ds/dt)/ds = ∂v1/∂s - ∂v2/∂s ,   scaled:   Js = ε^1_s - ε^2_s
```
The system is unstable when `ε^1_s > ε^2_s`.
> If the positive feedback elasticity is larger than the elasticity of the degradation step
> then the system can admit unstable states.

Kinetic-order guide (Table 9.2): first-order -> elasticity 1.0; zero-order -> 0.0;
sigmoidal -> > 1.0. Two ways to arrange instability: (1) `v1` Hill with `n > 1` and `v2`
first-order or less; (2) `v1` Hill with `n = 1` and `v2` saturable Michaelis-Menten so its
kinetics are less than first-order.

Computed values (Table 9.3):

| steady-state `s` | Jacobian element | `ε^1_s` |
|---|---|---|
| 0.145 | -0.664 | 0.052 |
| 0.683 | +0.585 | 1.835 |
| 1.309 | -0.47 | 0.33 |

The unstable state has `ε^1_s = 1.835 > 1`, the elasticity of the first-order degradation step.

**Hysteresis.** Traversing `k3` downward from 1.4: single low state, then three states from
`k3 ≈ 0.8`, then at `k3 ≈ 0.4` a jump to the high state. Traversing back up, the system stays
on the high branch until `k3 ≈ 0.8` before dropping. *"Hysteresis is where the behavior of a
system depends on its past history."*

**Irreversible bistability**: a bifurcation plot whose lower turning point sits in the
physically inaccessible negative-signal quadrant. Once switched on it can never be switched
off by lowering the signal.

**Practical notes on finding steady states**
- A time-course simulation can never reach an unstable steady state - all trajectories diverge
  from it. (The book notes, second hand and untested by the author, that running time backwards
  converges on it.)
- A steady-state **solver** can find unstable states "providing the initial starting point is
  close enough" - e.g. starting `S1` at 0.43 locates the unstable state at 0.683.
- In a bistable system, **the initial condition selects which stable state you land on.**
- Tools named for bifurcation diagrams: SBW Auto C#, Oscill8, and the `tel_auto2000` roadrunner
  plugin. All read SBML.

## Stability of negative feedback systems (Ch 10)

**Why feedback destabilises.** If the feedback acts too late, it can act in the same direction
as the disturbance and amplify it. Sustained oscillation needs two things: **loop gain at
least 1.0**, and a total phase delay of **-360°**. The inverting feedback supplies -180°; each
reaction step can contribute up to -90°, so two steps give up to -180°, three up to -270°, and
so on. Random disturbances contain all frequencies, so a system with enough gain will find the
frequency at which the reaction steps contribute exactly -180°. *"a -360° delay ... means that
the negative feedback is effectively behaving as a positive feedback."*

**Three-step pathway with feedback `S2 -| v1`** (two steps inside the loop). Substituting
`E^i_j = ε^i_j v_i/s_j = ε^i_j F_i` and taking `ε^2_1 = ε^3_2 = 1`:
```
N ∂v/∂s = [ -F2        ε^{v1}_{s2} F1 ]
          [  F2       -F3            ]
```
Characteristic equation: `λ² + (F2 + F3)λ + F2F3 - F1F2 ε^{v1}_{s2} = 0`. All `F_i > 0`, and
`ε^{v1}_{s2} < 0` makes the constant term positive, so all coefficients are positive and both
roots are negative.

> **A linear pathway of three steps with a negative feedback loop from the second species to
> the first reaction will always be stable so long as the elasticities do not change sign.**

Relaxing the first-order assumption does not change the signs, so stability still holds.

**Four-step pathway** (three species, feedback `S3 -| v1`). The characteristic cubic is
```
λ³ + λ²(F2+F3+F4) + λ(F2F4+F2F3+F3F4) + F2F3F4(1 - ε^1_3) = 0
```
(using `F1 = F4` because `v1 = v4` at steady state). For `a0x³+a1x²+a2x+a3 = 0` all roots are
negative when `a0, a1, a3 > 0` **and** `a1 a2 > a0 a3`. That last condition becomes
```
F2/F3 + F2/F4 + F3/F4 + F3/F2 + F4/F3 + F4/F2 + 2  >  -ε^1_3                (eq 10.3)
```
Each pair is of the form `a + 1/a >= 2`, so three pairs give at least 6, plus 2 gives **8**.
Therefore:
```
ε^1_3 > -8   for stability                                                 (eq 10.4)
```
Confirmed numerically (Fig 10.3: no combination of the `F` terms falls below 8).

**Reintroducing the intermediate elasticities**: the threshold becomes
`ε^1_3 ε^2_1 ε^3_2 > -8`. With `ε^2_1 = ε^3_2 = 0.5` this is `(1/4)ε^1_3 > -8`, i.e.
`ε^1_3 > -32` - **instability becomes much harder to reach**. And if any intermediate step is
close to equilibrium its elasticities go to infinity, "dashing any hopes of instability" -
equivalently, the pathway is effectively shortened by one step, back to the always-stable
three-step case.

**General pathway-length result.** For `n` species (`n+1` steps), assuming all non-feedback
reactions first-order with equal rate constants (so all `ε^i_j = 1`, all `s_j` equal, all
`F_i = F`), the characteristic equation is `(λ + F)^n - ε^1_n F^n = 0`. Using de Moivre:
```
λ_m = [ (-ε^1_n)^{1/n} ( cos((2m+1)π/n) + i sin((2m+1)π/n) ) - 1 ] F ,  m = 0..n-1
```
The transition to instability happens at `m = 0` (cosine maximal), giving the stability
condition `(-ε^1_n)^{1/n} cos(π/n) < 1` (eq 10.6), usually written:

```
-ε^1_n  <  sec^n(π/n)                                                      (eq 10.7)
```

| Steps in pathway | Instability threshold `-ε_feedback` |
|---|---|
| 2 | stable (always) |
| 3 | stable (always) |
| 4 | 8 |
| 5 | 4.0 |
| 6 | 2.9 |
| 7 | 2.4 |
| 8 | 2.1 |
| 9 | 1.9 |
| ... | ... |
| ∞ | 1.0 |

> **As the length of the pathway increases, it becomes easier for the system to be unstable.**

Context: many allosteric enzymes have effector elasticities in the range -1 to -4, so a
four-step loop (threshold -8) needs unusually strong feedback to destabilise, while an
eight-step loop (threshold -2.1) does not.

Table 10.1's assumptions, stated by the book: first-order kinetics for all reactions other
than the feedback reaction, and equal rate constants for those first-order reactions (so that
species levels are equal and the algebra simplifies).

An equivalent form found in the literature, `nH > A/cos^n(π/n)`, applies to the specific
inhibition rate law `vo/(1 + kS^{nH})`; **eq 10.7 is more general and does not depend on a
specific feedback mechanism.**

Much of Ch 10 is taken, with modification, from Savageau's *Biochemical Systems Analysis* (1976).

## Common mistakes
- Evaluating the Jacobian away from the steady state.
- Computing eigenvalues of the **full** Jacobian of a model with conserved moieties. It is
  singular by construction - reduce the model first ([[moiety_conservation]]).
- Reading a complex eigenvalue with a negative real part as "oscillatory therefore unstable".
  It is a damped oscillation - stable.
- Treating a saddle point as stable because one eigenvalue is negative.
- Assuming topology alone determines dynamics. `J = N ∂v/∂s` says kinetics matter equally.
- Applying the `-8` threshold to a pathway of a different length, or one where the
  intermediate elasticities are not 1.
- Trying to locate an unstable steady state by time-course simulation.

## Related concepts
[[negative_feedback]], [[elasticities]], [[moiety_conservation]], [[computational_mca]],
[[conserved_cycles]], [[diagnose_unexpected_result]]

## Source
Chapter: 9 (Stability); 10 (Stability of Negative Feedback Systems)
Section: 9 intro (internal stability); 9.1 Jacobian for Biochemical Systems; 9.2 External
Stability; 9.3 Phase Portraits; 9.4 Bifurcation Plots (Bistable Systems; Stability of Positive
Feedback; Hysteresis; Irreversible Bistability); 9.5 Appendix (complex eigenvalue proof);
10.1 Introduction; 10.2 Stability using MCA; 10.3 Effect of Pathway Length
Pages: book p145-174 (PDF 153-182); book p175-185 (PDF 183-193)
