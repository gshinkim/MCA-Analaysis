# Example: Linear Pathway

Generalised reasoning patterns for unbranched, unregulated chains. Three patterns, each in the
form INPUT -> REASONING -> CALCULATION -> VALIDATION -> INTERPRETATION.

---

# Pattern A - Control from thermodynamics and metabolite levels alone

## INPUT
A four-step pathway `Xo -> S1 -> S2 -> S3 -> X1` with **no known negative feedback loops**.
Metabolic engineers want to raise the flux and have measured standard free energies and
steady-state pool sizes at 25 °C.

| Step | ΔG° (kJ/mol) | Metabolite | Conc. (mM) |
|---|---|---|---|
| 1 | -4.067 | Xo | 5 |
| 2 | -6.387 | S1 | 13.487 |
| 3 | 11.27 | S2 | 136.75 |
| 4 | -11.519 | S3 | 0.918 |
| | | X1 | 0.1 |

`R = 8.31446e-3 kJ K^-1 mol^-1`.

## REASONING
1. **Topology**: linear, unregulated. Standard theorem set applies;
   `0 <= C^J <= 1` is legitimate here.
2. **What is being asked**: which steps to over-express. That is a **flux control coefficient**
   question, so it is global - `references/control_coefficients.md`.
3. **Do I have enough to compute?** No rate laws are given, so the analytic flux route (eq 6.5)
   is out. But `references/linear_pathways.md` eq 6.9 gives the **relative** distribution from
   equilibrium constants and pool sizes alone:
   ```
   C^J_1 : C^J_2 : ... ,   nth term = ( Π_{i<n} ρ_i )·(1 - ρ_n)
   ```
4. **Assumption this carries**: each enzyme operates **below** its substrate and product `Km`,
   so `ε_s = 1/(1-ρ)` and `ε_p = -ρ/(1-ρ)`. State it - it is the whole basis of the answer.
5. Convert `ΔG°` to `Keq`, form the mass-action ratios from the measured pools, then
   `ρ = Γ/Keq`.

## CALCULATION
`RT = 8.31446e-3 × 298.15 = 2.47896 kJ/mol`; `Keq = exp(-ΔG°/RT)`; `Γ_i = s_i/s_{i-1}`.

| Step | `Keq` | `Γ` | `ρ = Γ/Keq` |
|---|---|---|---|
| 1 | 5.158 | 2.6974 | 0.5229 |
| 2 | 13.151 | 10.1394 | 0.7710 |
| 3 | 0.01060 | 0.006713 | 0.6329 |
| 4 | 104.24 | 0.10893 | 0.00104 |

Ratio terms from eq 6.9:
```
term1 = (1-ρ1)                = 0.4771
term2 = ρ1(1-ρ2)              = 0.1198
term3 = ρ1ρ2(1-ρ3)            = 0.1480
term4 = ρ1ρ2ρ3(1-ρ4)          = 0.2549
```
The terms telescope: `Σ terms = 1 - ρ1ρ2ρ3ρ4 = 0.99973`. Normalising so the flux summation
theorem holds:
```
C^J_1 = 0.477   C^J_2 = 0.120   C^J_3 = 0.148   C^J_4 = 0.255
```
(The telescoping identity is not printed in the source; it follows from eq 6.9 plus the flux
summation theorem, both of which are.)

## VALIDATION
- `Σ C^J_i = 1.000` by construction of the normalisation - so this check is **not** independent
  evidence here. Say so.
- **Independent check**: all four coefficients lie in `[0,1]`, as required for a linear
  unregulated pathway with normal sign patterns (Ch 6.1).
- **Sign check**: all `ρ_i < 1`, consistent with a positive net flux in the forward direction
  (`ρ = vr/vf`).
- **Structural check**: step 4 is far from equilibrium (`ρ4 ≈ 0.001`) and step 2 is closest to
  equilibrium (`ρ2 = 0.77`) - and indeed step 2 has the smallest coefficient, exactly as
  `references/linear_pathways.md` predicts for near-equilibrium steps.
- **Not checkable without more data**: connectivity (needs the elasticities individually, which
  requires the below-`Km` assumption to be verified rather than assumed).

## INTERPRETATION
*Mathematics.* Under the stated assumption, flux control is distributed
`0.48 / 0.12 / 0.15 / 0.25`. No step is rate limiting: the largest coefficient is under 0.5.

*Biology / engineering advice.* Step 1 carries the most control and step 4 the second most;
raising both by 20% predicts `δJ/J = 0.2(0.477) + 0.2(0.255) = 14.6%` (eq 3.3, valid only for
small changes). Step 2 is the worst target - it is closest to equilibrium and carries the least
control. Note that this is **not** the naive "the committed step controls the pathway" answer
arriving by luck: step 4 beats steps 2 and 3, which the naive rule would never predict.

*Assumptions and limits.* Below-`Km` operation for every enzyme; no feedback (stated in the
problem, and front loading holds only for unregulated pathways); one steady state at the
measured pool sizes; `ΔG°` at 25 °C matching the in vivo condition; prediction linear only for
small changes. If any enzyme is actually saturated, its elasticities are not `1/(1-ρ)` and the
distribution changes.

---

# Pattern B - Control from elasticities (saturable kinetics)

## INPUT
`Xo -> S1 -> S2 -> X1`. Each substrate sits near its enzyme's `Km`; each step has weak product
inhibition.

## REASONING
No analytic flux exists for saturable kinetics, so use summation + connectivity
(`references/deriving_control_equations.md`). Two species -> two connectivity theorems; one
flux summation. Three equations, three unknowns.

```
C^J_e1 + C^J_e2 + C^J_e3 = 1
C^J_e1 ε^1_1 + C^J_e2 ε^2_1 = 0
C^J_e2 ε^2_2 + C^J_e3 ε^3_2 = 0
```

## CALCULATION
Solving (eq 6.10):
```
D = ε^2_1 ε^3_2 - ε^1_1 ε^3_2 + ε^1_1 ε^2_2
C^J_e1 = ε^2_1 ε^3_2 / D      C^J_e2 = -ε^1_1 ε^3_2 / D      C^J_e3 = ε^1_1 ε^2_2 / D
```
Substrate elasticities at `Km`: `ε^2_1 = ε^3_2 = 0.5`. Product elasticities `ε^1_1 = ε^2_2`:

| Product inhibition | `C^J_1` | `C^J_2` | `C^J_3` |
|---|---|---|---|
| -0.1 | 0.806 | 0.161 | 0.032 |
| -0.2 | 0.64 | 0.26 | 0.1 |

Concentration control at -0.1 (Table 6.3):

| Step | `C^s1` | `C^s2` |
|---|---|---|
| e1 | 1.982 | 1.802 |
| e2 | -1.802 | 0.180 |
| e3 | -0.180 | -1.982 |

## VALIDATION
- Flux summation: `0.806 + 0.161 + 0.032 = 0.999` ✓ (rounding).
- Concentration summation: each column sums to 0 ✓.
- Connectivity, `S1`: `0.806(-0.1) + 0.161(0.5) = -0.0806 + 0.0805 ≈ 0` ✓.
- Connectivity, `S2`: `0.161(-0.1) + 0.032(0.5) = -0.0161 + 0.016 ≈ 0` ✓.
- Signs: enzymes upstream of a metabolite give positive CCCs, downstream give negative ✓.
- Magnitudes: all FCCs in `[0,1]` ✓; CCCs are not bounded by 1 and are not expected to be.

## INTERPRETATION
*Mathematics.* Front loaded, but not exclusively: control leaks downstream, and **strengthening
product inhibition from -0.1 to -0.2 shifts control markedly** (0.806 -> 0.64 on step 1).

*Limits worth checking.* Set `ε^1_1 = 0` (product-insensitive first step) and the equations give
`C^J_e1 = 1`, everything else 0 - the classic rate-limiting step, and a direct demonstration
that the classic case is an artefact of complete product insensitivity. Set `ε^2_1 -> 1`,
`ε^2_2 -> -1` (step 2 near equilibrium) and `C^J_e2 -> 0`.

*Biology.* Product inhibition strength is the dial that redistributes flux control in an
unregulated chain. That is a design parameter, not a fixed property of the pathway.

---

# Pattern C - Computed control in a real model

## INPUT
A three-step chain modelled with reversible Michaelis-Menten kinetics (Ch 3.5 listing 3.1),
solved and analysed with Tellurium.

## REASONING
Follow `workflows/analyze_model.md`. Verify the model, solve the steady state, call `getCC`,
validate.

## CALCULATION
```python
r.steadyState()
r.getCC("J1","e1"), r.getCC("J1","e2"), r.getCC("J1","e3")
```
Result (Table 3.1):
```
C^J_e1 = 0.3677     C^J_e2 = 0.1349     C^J_e3 = 0.4989
```

## VALIDATION
`0.3677 + 0.1349 + 0.4989 = 1.0015` - a residual of `1.5e-3`, which is larger than a
well-converged analytic calculation should give and is consistent with the values being quoted
to four decimal places. **Report it as a rounding residual, not as a violation, and not as a
perfect result.** Connectivity cannot be checked without the elasticities.

> *Source caution*: the Antimony listing that accompanies this table uses `e1` in all three rate
> laws while defining `e2` and `e3` unused. Treat the printed coefficients as the chapter's
> result and do not attempt to re-derive them from that listing verbatim.

## INTERPRETATION
*Mathematics.* Control is distributed across all three steps.

*Biology.* **Almost 50% of control is on the last step.** The book's own reading:
> This shows that in a linear pathway the committed step (i.e. the first step) is not
> necessarily the step with the most control. By varying the values of the various kinetic
> parameters, it is possible to obtain almost any pattern of control.

This is the counter-example to carry whenever someone asserts that the committed step controls
the pathway.

---

## Reusable checklist for linear pathways
1. Confirm unbranched and unregulated. If there is a feedback arrow, this file does not apply -
   go to `feedback_pathway.md`.
2. Choose the route by what data exist: `ρ` and `Keq` (Pattern A), elasticities (Pattern B),
   a full kinetic model (Pattern C).
3. Expect front loading in an unregulated chain; expect it to be broken by regulation.
4. Expect near-equilibrium steps to have small control - **and check the context**.
5. Expect no flux control downstream of a product-insensitive step.
6. Validate summation and, if you have elasticities, connectivity.
7. State the below-`Km` / rate-law-family assumptions explicitly - most of the qualitative
   results in Ch 6 depend on them.

## Source
Chapter: 3.5 (Table 3.1 and listing 3.1); 6.1-6.5 (eq 6.5-6.10, Tables 6.1-6.3);
Ch 6 Exercise 9 (the thermodynamic data set); Appendix B.1
Pages: book p46-47 (PDF 54-55); p89-106 (PDF 97-114); p109 (PDF 117); p259-261 (PDF 267-269)
