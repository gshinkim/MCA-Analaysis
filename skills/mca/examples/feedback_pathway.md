# Example: Feedback-Controlled Pathway

The reasoning pattern for "this enzyme is heavily regulated - surely it controls the flux?"
Worked on the four-step end-product-inhibition motif that Ch 8 uses for the PFK paradox.

---

## INPUT

`Xo -v1-> S1 -v2-> S2 -v3-> S3 -v4-> X1`, with **`S3` inhibiting `v1`** (allosteric end-product
inhibition). Elasticity values at the operating point:

```
substrate elasticities:  ε^2_1 = ε^3_2 = ε^4_3 = 0.5      (substrates at their Km)
product elasticities:    ε^1_1 = ε^2_2 = ε^3_3 = -0.1     (weak product inhibition)
feedback elasticity:     ε^1_3 = -4.0                     (strong feedback)
```

Question asked: *"Is the regulated first step the rate-limiting step of this pathway?"*

---

## REASONING

1. **Topology first.** This is a linear chain **plus a regulatory arrow**. That single arrow
   means: front loading does not apply; the plain three/four-step control equations of
   Appendix B.1 do not apply; a fourth elasticity enters the connectivity theorem for `S3`.
   -> `references/negative_feedback.md`.

2. **Identify what is actually being asked.** "Rate limiting" is a claim about the **flux
   control coefficient** of step 1. It is not a claim about the elasticity, about position in
   the pathway, or about being regulated. -> `references/common_failure_modes.md` #1.

3. **Anticipate the trap.** The premise of the question is the trap: regulated -> important ->
   controlling. Ch 8.3 shows the implication runs the other way. Do not accept the premise.

4. **Recognise that two different questions are hiding in one.**
   - *Does this step control the flux?* -> flux control coefficient.
   - *Is the regulation effective?* -> **loop gain**.
   These have different answers here, and that is the whole point of Ch 8.4.

5. **Pick the equations.** From Ch 8.4 Table 8.2, the numerators for the four-step feedback
   pathway, over the common denominator `D`:
   ```
   C^{s3}_e1 : ε^2_1 ε^3_2
   C^{s3}_e4 : ε^1_1 ε^3_2 - ε^1_1 ε^2_2 - ε^2_1 ε^3_2
   C^J_e1    : ε^2_1 ε^3_2 ε^4_3
   C^J_e4    : -ε^1_1 ε^2_2 ε^3_3 - ε^2_1 ε^3_2 ε^1_3
   ```
   and the loop gain (eq 8.4, 8.5):
   ```
   Loop Gain = -ε^1_3 · uC^{s3}_e1 = -ε^2_1 ε^3_2 ε^1_3 / uD
   uD = ε^1_1 ε^2_2 ε^4_3 - ε^1_1 ε^2_2 ε^3_3 - ε^1_1 ε^3_2 ε^4_3 + ε^2_1 ε^3_2 ε^4_3
   ```
   `uD` is the denominator of the pathway **without** feedback; the feedback denominator adds
   the term `-ε^2_1 ε^3_2 ε^1_3`.

---

## CALCULATION

With the given values, evaluated per Ch 8.4:

| Quantity | Strong feedback `ε^1_3 = -4.0` | Weak feedback `ε^1_3 = -0.1` |
|---|---|---|
| `C^J_e1` | **0.11** | **0.8** |
| Loop gain | **6.4** | **0.16** |

Two further structural results from the same section, with product elasticities set to zero
for clarity (Table 8.1):

```
C^{s2}_e2 = 0        C^J_e2 = 0                 (disturbances inside the loop do not
                                                 reach the signal species or the flux)
C^{s2}_e1 = 1/(ε^3_2 - ε^1_2)                   (shrinks as |ε^1_2| grows -> buffering)
C^J_e3   = -ε^1_2/(ε^3_2 - ε^1_2)  -> 1         (all flux control moves to the demand step)
```

And the regulated-vs-unregulated comparison (adjusting `E1` so the concentrations and flux
match, so that only the feedback elasticity differs):
```
uC^J_1 / nC^J_1 = 1 - ε^1_2/ε^3_2  > 1      hence  uC^J_1 > nC^J_1
```

---

## VALIDATION

- **Summation**: with `C^J_e1 = 0.11` and `C^J_e3 -> 1` as feedback strengthens, the remaining
  coefficients must shrink toward zero. Consistent with `Σ C^J = 1`.
- **Sign of the extra denominator term**: `-ε^2_1 ε^3_2 ε^1_3` with `ε^1_3 < 0` is **positive**,
  so feedback enlarges `D` and shrinks the coefficients that gain no compensating numerator
  term. That is exactly what the numbers show (0.8 -> 0.11).
- **Direction check**: removing the feedback must *raise* `C^J_e1`. The ratio
  `uC^J_1/nC^J_1 > 1` says so, and 0.8 > 0.11 confirms it numerically.
- **Loop gain sanity**: strengthening the feedback forty-fold in `|ε^1_3|` (0.1 -> 4.0) raises
  the loop gain forty-fold (0.16 -> 6.4), as expected since `ε^1_3` enters linearly.
- **Stability**: `-ε^1_3 = 4.0`, and the four-step threshold is `-ε_feedback < 8`. So this
  system is **stable**; a feedback elasticity below -8 would make it oscillate
  (`references/stability.md`, eq 10.4). Worth stating, because the question is about a strongly
  regulated step and the reader may wonder whether "stronger is always better".
- **Connectivity** would need `S3`'s full interaction set: `v3` (production), `v4` (consumption)
  **and `v1` (inhibition)** - three terms, not two. Forgetting the third is the classic error
  here.

---

## INTERPRETATION

**Mathematics.** With strong end-product inhibition, the regulated first step has a flux control
coefficient of 0.11 - it is not rate limiting. Flux control has moved to the demand step outside
the loop. Disturbances applied inside the loop do not change the signal species or the flux.

**Biology.** The regulated step is nonetheless doing important work: its loop gain is 6.4,
forty times higher than the weakly regulated version, meaning changes in the regulator `S3`
strongly throttle the pathway. Two different senses of "important" are being conflated by the
original question:

> The loop gain gives a measure of how effective the regulation is. The higher the loop gain,
> the more effective the regulation.

**The PFK resolution.** Phosphofructokinase is early, non-equilibrium and heavily regulated -
which intuition converts into "rate limiting". Measurement repeatedly says its flux control
coefficient is small, and the theory above says it *should* be small precisely **because** it
sits in a negative feedback loop. The paradox dissolves once control and regulation are measured
with different instruments.

**Design reading (supply/demand).** Moving flux control out of the loop and onto the demand step
is functional, not accidental: it lets the demand block set the rate while the supply block
holds the intermediate at a nearly constant level, avoiding both starvation at high demand and
toxic accumulation at low demand.

**What would change the answer.** A weaker feedback elasticity (control returns to step 1); a
different operating point (elasticities are not constants); saturation changing the transmission
elasticities `ε^2_1, ε^3_2` (which would cut the loop gain even with strong feedback); a branch
downstream (different theorem set); an unverified steady state.

---

## The two-line version to reuse

> A step regulated by negative feedback will tend to have a **small flux control coefficient**;
> that is a prediction of the theory, not an anomaly. Measure its importance with the **loop
> gain**, which is `-ε_feedback` times the concentration control coefficient of the *unregulated*
> equivalent pathway - so it depends on the transmission through the whole loop, not on the
> regulated step alone.

## Answering-pattern for "is X rate limiting?"
1. Restate the question as a flux control coefficient question.
2. Ask for / establish: topology, steady state, elasticities or a model.
3. Compute `C^J_eX`, with conditions.
4. If the step is regulated, also compute the loop gain, and report both.
5. Never answer from position, slowness, irreversibility, distance from equilibrium, or the
   presence of allosteric effectors.

## Source
Chapter: 8 (Negative Feedback), especially 8.3 Negative Feedback in Biochemical Systems and
8.4 The PFK Paradox; 8.5 Robustness and Supply/Demand; 10.2-10.3 for the stability threshold;
Appendix B.1 for the three-step feedback control equations
Pages: book p132-143 (PDF 140-151); p176-185 (PDF 184-193); p260 (PDF 268);
PFK measurements also Ch 1.3 book p5 (PDF 13)
