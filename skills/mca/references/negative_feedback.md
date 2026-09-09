# Negative Feedback

## Definition
> Negative feedback is where part of the output of a system is used to reduce the magnitude
> of the system input.

In biochemical pathways this is typically end-product inhibition of an early, allosteric
enzyme.

## How to recognise it in a model
A species that is **not** a substrate or product of a reaction nevertheless appears in that
reaction's rate law with a negative elasticity. In the control matrices this shows up as an
extra non-zero elasticity `ε^1_k` where the plain chain would have a zero.

## Two modes of negative feedback (Ch 8.1)
- **Regulator**: hold a variable at a constant level despite disturbances (thermostat; pupil
  reflex).
- **Servo**: track a reference input (op amp voltage follower; eye tracking an object).

Both use the same mechanism: an **error signal** = set point - actual output, fed to a
controller that changes process activity.

**Mapping the block diagram onto a pathway** (Ch 8.3, four-step pathway `Xo->S1->S2->S3->X1`
with `S3` inhibiting `v1`):

| Block-diagram element | Biochemical counterpart |
|---|---|
| output `yo` | concentration of `S3` (the flux is also an output, since `v4` is a function of `S3`) |
| feedback `K` | interaction of `S3` with the allosteric first enzyme |
| **set point `yi`** | **most problematic - most likely embedded in the kinetic characteristics of the allosteric enzyme**, possibly its half-saturation constant for the regulator |
| controller `A` | steps `v1, v2, v3` |
| load | the last step `v4` |
| disturbances | `v1..v3` and the input concentration `Xo` |

> In naturally evolved systems it is sometimes difficult to identify the various parts in a
> negative feedback circuit.

## The generic algebra (Ch 8.2)
With `yo = Ae`, feedback `Kyo`, error `e = yi - Kyo`:
```
yo = A yi/(1 + AK) = G yi                                             (eq 8.1)
G  = closed loop gain
A  = open loop gain            AK = loop gain                         (eq 8.2)
```
Consequences:
- If `AK >> 1` then `G ≈ 1/K`: behaviour depends on the feedback, not on `A`.
- Sensitivity of gain to `A`: `(∂G/∂A)(A/G) = 1/(1 + AK)` - **robustness to component
  variation** (noise, manufacturing spread, genetic variation).
- Sensitivity of output to a disturbance `d`: `∂y/∂d = -1/(1 + AK)` - **disturbance rejection**;
  loads (current drain, protein sequestration, increased amino-acid demand) matter less as
  feedback strengthens.
- **Linearisation**: `G'(yi) = A'(yi)/(1 + A'(yi)K)`, so if `A'K >> 1`, `G' ≈ 1/K` and the
  response is nearly linear, with the active range "stretched out".

The objection "sensitivity is only shifted from `A` to `K`" is answered: it is the **loop
gain** `AK`, not `K` alone, that governs the effect - hence the engineering strategy of a
large sloppy amplifier with a stable feedback (a 741 op amp has open-loop gain ~200,000 and
is nearly useless without feedback).

Summary of useful properties: amplification of signal; robustness to internal component
variation; high fidelity of signal transfer; low output impedance (the load does not affect
circuit performance).

## Graphical understanding in a pathway (Ch 8.3, Fig 8.8)
Two-step model `v1 = 1/(1+s1^n)`, `v2 = k2 s1`. Plot both against `s1`; the intersection is
the steady state. Perturb `k2` (changes the slope of `v2`):
- **Strong feedback** (`n = 4`, steep `v1` decline): the intersection barely moves - `S1` is
  held nearly constant. Homeostasis.
- **Weak feedback** (`n = 1`, shallow decline): the same `k2` change moves `S1` a lot.

## MCA of a feedback pathway (Ch 8.3)
For the three-step pathway `Xo->S1->S2->X1` with `S2` inhibiting `v1` (`ε^1_2 < 0`), the
theorem matrix gains the feedback term (shown in red in the book):
```
[ C^J_1   C^J_2   C^J_3  ] [ 1  -ε^1_1  -ε^1_2 ]   [ 1 0 0 ]
[ C^s1_1  C^s1_2  C^s1_3 ] [ 1  -ε^2_1  -ε^2_2 ] = [ 0 1 0 ]
[ C^s2_1  C^s2_2  C^s2_3 ] [ 1   0      -ε^3_2 ]   [ 0 0 1 ]
```
Flux control coefficients, with and without feedback:

| | with feedback | without feedback |
|---|---|---|
| `C^J_e1` | `ε^2_1 ε^3_2 / D_f` | `ε^2_1 ε^3_2 / D_u` |
| `C^J_e2` | `-ε^1_1 ε^3_2 / D_f` | `-ε^1_1 ε^3_2 / D_u` |
| `C^J_e3` | `(ε^1_1 ε^2_2 - ε^2_1 ε^1_2)/D_f` | `ε^1_1 ε^2_2 / D_u` |

```
D_u = ε^2_1 ε^3_2 - ε^1_1 ε^3_2 + ε^1_1 ε^2_2
D_f = D_u - ε^2_1 ε^1_2
```
The extra denominator term `-ε^2_1 ε^1_2` is **positive** (since `ε^1_2 < 0`), so feedback
**increases the denominator** and shrinks the coefficients that do not gain a compensating
numerator term.

Setting the product elasticities `ε^1_1 = ε^2_2 = 0` for clarity (Table 8.1):

| Enzyme step | `C^s1` | `C^s2` | `C^J` |
|---|---|---|---|
| E1 | `ε^3_2 / (ε^2_1(ε^3_2 - ε^1_2))` | `1/(ε^3_2 - ε^1_2)` | `ε^3_2/(ε^3_2 - ε^1_2)` |
| E2 | `-1/ε^2_1` | `0` | `0` |
| E3 | `-ε^1_2/(ε^2_1(ε^3_2 - ε^1_2))` | `-1/(ε^3_2 - ε^1_2)` | `-ε^1_2/(ε^3_2 - ε^1_2)` |

**Readings:**
1. `C^{s2}_{e2} = 0` and `C^J_{e2} = 0`: **disturbances inside the feedback loop have no
   effect on the signal species `S2` or on the flux.**
2. `C^{s2}_{e1}` and `C^{s2}_{e3}` both shrink as `|ε^1_2|` grows: the **buffering capacity**
   of the loop locks `S2` into a narrow range.
3. As the feedback strengthens (`ε^1_2 << 0`), `C^J_{e3} -> 1`: **all flux control moves out
   of the feedback loop** to the demand step. By summation `C^J_{e1}, C^J_{e2} -> 0`.
   "In terms of a steam engine analogy, it is equivalent to being able to change the work load
   on the steam engine without loss of power."
4. Control over `S2` and over `J` are complementary: `C^J_{e3} -> 1` while `C^{s2}_{e3} -> 0`.

> **Steps regulated via negative feedback will tend to have small flux control coefficients.**

The response to the source, `R^{s2}_{xo} = C^{s2}_{e1} ε^1_{xo}`, is also small for a
Michaelian `ε^1_{xo}` of 0.5-1.0. The book speculates that enzymes regulated by feedback
inhibition often also show **cooperativity toward the source species**, so `ε^1_{xo}` can be
of order 4.0 or more, "suggesting that the cooperativity attempts to restore some control by
the source species."

## Feedback compared against the equivalent unregulated pathway
To compare fairly, remove the feedback and then adjust `E1` so that `S1`, `S2` and the flux
return to their original values - all elasticities except the feedback one are then identical.
Write `uC^J_e` (unregulated) and `nC^J_e` (with feedback). For a four-step pathway:
```
uC^J_e1 / nC^J_e1 = 1 - ε^2_1 ε^3_2 ε^1_2 / ( ε^1_1 ε^2_2 ε^4_3 - ε^1_1 ε^2_2 ε^3_3
                                              - ε^1_1 ε^3_2 ε^4_3 + ε^2_1 ε^3_2 ε^4_3 )
```
The subtracted term is negative over a positive denominator, so the ratio is `> 1`. With
`ε^1_1 = ε^2_2 = 0` for a three-step pathway it simplifies beautifully:
```
uC^J_1 / nC^J_1 = 1 - ε^1_2/ε^3_2       >  1     hence   uC^J_1 > nC^J_1
```
> For a negative feedback loop to be effective, the flux control coefficient in the
> unregulated pathway must be higher than the flux control coefficient with feedback.

## The PFK paradox and the loop gain (Ch 8.4)

**The paradox.** Phosphofructokinase is not rate-limiting in situ - shown experimentally many
times and consistent with theory - yet textbooks, Wikipedia and much of the literature still
call it the rate-limiting or pacemaker step of glycolysis, on the grounds that it is early, is
a non-equilibrium reaction, and is heavily regulated. *"Intuition suggests that
phosphofructokinase should be controlling glycolytic flux ... On the other hand, experimental
evidence and theory suggests the opposite."*

**Resolution: use a different measure of importance - the loop gain.**

Mapping MCA onto the engineering diagram for a two-step feedback system, from
`C^s_e1 = 1/(ε^2_s - ε^1_s)`:
```
input  = δe1/e1          output = δs/s
A = 1/ε^2_s              K = -ε^1_s
```
`A` is exactly the concentration control coefficient of the **unregulated** system
(set `ε^1_s = 0`). This generalises: **the feedback term `K` always equals the negative of the
feedback elasticity.** Hence
```
Loop Gain = A K = -ε^1_s · uC^s_e1
```
and for a four-step pathway with `S3` as the return signal (eq 8.4, 8.5):
```
Loop Gain = -ε^1_3 · uC^{s3}_{e1}  =  -ε^2_1 ε^3_2 ε^1_3 / uD
uD = ε^1_1 ε^2_2 ε^4_3 - ε^1_1 ε^2_2 ε^3_3 - ε^1_1 ε^3_2 ε^4_3 + ε^2_1 ε^3_2 ε^4_3
```
(`uD` is the denominator of the pathway **without** feedback - it simply lacks the last term
of the feedback denominator.)

**Worked comparison.** Four-step pathway; all substrate elasticities `ε^2_1 = ε^3_2 = ε^4_3 = 0.5`
(substrates at their `Km`); product elasticities `ε^1_1 = ε^2_2 = ε^3_3 = -0.1`.

| Feedback elasticity `ε^1_3` | `C^J_e1` | Loop gain |
|---|---|---|
| -4.0 (strong) | **0.11** | **6.4** |
| -0.1 (weak) | **0.8** | **0.16** |

Flux control rises about eight-fold when feedback is removed, while the loop gain falls
about forty-fold.

> **The loop gain gives a measure of how effective the regulation is. The higher the loop
> gain, the more effective the regulation.**

**Two contributions to the loop gain**: the action of the signal on the regulated step
(`ε^1_3`, the "signal throttle") and the **transmission** of the signal through the pathway
(`-ε^2_1 ε^3_2 / uD`, the "signal transmission"). If the transmission elasticities are small,
the loop gain is small even with a strongly regulated step.

> An examination of the elasticity of the regulated step is therefore insufficient to
> ascertain the effectiveness of the regulation ... **Regulation and control are systemic
> properties of a pathway.**

Also relevant: the alternative measure of a regulated step's importance is that the feedback
elasticity itself is strongly negative. For `v = Vmax·xo/(s^n + xo + Km)`,
`ε^v_s = n xo Km/(Km + (s/Km)^n)`, so at low signal the elasticity is proportional to the
Hill coefficient `n`.

**Control switch-over.** Fig 8.13 plots `C^J_e1` and `C^J_e2` against `-ε^1_s`: flux control
transfers from the first step to the second as feedback strength grows.

## Robustness and supply/demand (Ch 8.5)
Split a system into a **supply** block and a **demand** block joined by intermediate `P`.
Economically, demand should set the rate (a car factory should not stockpile cars).

**Without feedback**: high demand drops `P`, making it progressively harder to supply; low
demand raises the flux-limited `P`, and since the equilibrium constant across the supply block
is likely large, `P` "could rise to toxic high levels as the supply block approaches
equilibrium at low fluxes."

**With feedback**: high demand lowers `P`, which relieves repression of supply and restores
some of the loss; low demand raises `P`, which suppresses its own production. Both failure
modes are avoided. This is why the analysis above - all flux control moving to the demand step
- *"For demand driven systems this is a logical arrangement."*

## Instability
Too much feedback plus delay causes sustained oscillations. See [[stability]] for the
quantitative thresholds (`-ε_feedback < sec^n(π/n)`).

## Quantities to calculate for a feedback pathway
The feedback elasticity `ε^1_k`; all forward transmission elasticities; the FCC of the
regulated step; the FCC of the demand step; **the loop gain**; and, if the question is about
regulatory effectiveness, the unregulated comparison `uC^J_e1`.

## Common interpretational errors
- **Concluding a regulated step controls the flux.** The theory says the opposite: allosteric
  enzymes in a negative feedback loop are poor flux controllers.
- Concluding a regulated step is unimportant because its FCC is small. Use the loop gain.
- Judging regulatory effectiveness from the feedback elasticity alone - transmission matters.
- Carrying **front loading** ([[linear_pathways]]) into a regulated pathway. Ch 6.1 explicitly
  restricts front loading to unregulated pathways.
- Forgetting that adding a feedback arrow changes **every** control equation of the pathway,
  numerator and denominator (compare Appendix B.1's plain and feedback three-step sets).
- Treating an MCA loop gain as equivalent to a frequency-domain loop gain. Ch 8.4 notes the
  control coefficients correspond to the closed-loop transfer function **only at zero
  frequency** (the DC response).

## Related concepts
[[control_coefficients]], [[connectivity_theorems]], [[deriving_control_equations]],
[[stability]], [[conserved_cycles]], [[conceptual_foundations]], [[common_failure_modes]]

## Source
Chapter: 8 (Negative Feedback)
Section: 8.1 Historical Background; 8.2 Simple Quantitative Analysis; 8.3 Negative Feedback in
Biochemical Systems (Graphical Understanding; Control Analysis); 8.4 The PFK Paradox;
8.5 Robustness and Supply/Demand; 8.6 Instability
Pages: book p125-143 (PDF 133-151); feedback control equations Appendix B.1 book p260 (PDF 268);
PFK measurements also cited Ch 1.3 book p5 (PDF 13)
