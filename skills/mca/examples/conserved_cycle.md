# Example: Moiety-Conserved Cycle

The reasoning pattern for covalent-modification cycles: when is the response switch-like, and
why do the ordinary theorems stop working?

---

## INPUT

A protein phosphorylation cycle:
```
S --v1 (kinase E1)--> P
P --v2 (phosphatase E2)--> S          with   s + p = T  (constant)
```
Question: *"A 1% increase in kinase gives a 4.5% increase in phosphorylated protein. Is that
plausible, and what does it require?"*

---

## REASONING

1. **Recognise the topology.** Two species interconverting with no net synthesis or
   degradation on this timescale -> **moiety-conserved cycle**. Check it structurally:
   `N = [[-1, 1], [1, -1]]`, rows linearly dependent, `rank(N) = 1`, so
   `2 - 1 = 1` conservation law: `s + p = T`.
   -> `references/moiety_conservation.md`.

2. **Consequences to flag immediately.**
   - Species levels are **bounded**: neither `s` nor `p` can exceed `T`.
   - The **full Jacobian is singular** (`[[-k1, k2],[k1, -k2]]`), so the model must be reduced
     before any solver or sensitivity calculation.
   - The **standard connectivity theorem does not apply** to `S` and `P`.
   - `T` is a **parameter**, so its effect is a response coefficient `R^p_T`, not a control
     coefficient.

3. **Which quantity answers the question?** "1% in kinase -> 4.5% in phospho-protein" is
   `C^p_e1 = 4.5`. So this is a concentration control coefficient question, and 4.5 > 1 is the
   MCA definition of **ultrasensitivity**. -> `references/conserved_cycles.md`.

4. **Set up the derivation.** Local equations for the two arms, assuming both irreversible and
   not product inhibited:
   ```
   δv1/v1 = δe1/e1 + ε^1_s (δs/s)          δv2/v2 = ε^2_p (δp/p)
   ```
   At steady state `δv1/v1 = δv2/v2`. **The conservation law supplies the extra constraint**:
   `T` is unchanged, so `δs = -δp`. Without that constraint the system is under-determined -
   this is exactly where a conserved cycle differs from a two-step chain.

---

## CALCULATION

Substituting `δs = -δp` and solving (eq 12.1, 12.2):
```
C^p_e1 = s / ( p ε^1_s + s ε^2_p )  =  M_s / ( M_p ε^1_s + M_s ε^2_p )
```
with `M_s = s/T`, `M_p = p/T`.

**When can this exceed 1?** If both arms are far below saturation, `ε^1_s ≈ ε^2_p ≈ 1` and
```
C^p_e1 = M_s/(M_p + M_s) = M_s  <= 1
```
**No ultrasensitivity is possible with unsaturated enzymes.** Near saturation the elasticities
fall below 1 and the coefficient grows. With `s = 9`, `p = 1`:

| `ε^1_s = ε^2_p` | `C^p_e1` |
|---|---|
| 1.0 | ~1 |
| 0.5 | 1.8 |
| **0.2** | **4.5** |

So the observation is plausible, and it requires **both cycle enzymes to be operating near
saturation** (zero-order ultrasensitivity).

**Threshold rule.** For `M_s = 0.9, M_p = 0.1`, ultrasensitivity begins when both elasticities
fall below 0.9 - *"In general the threshold is equal to the initial steady state level of the
mole fraction of S."*

**Related quantities**, from the same derivation:
```
C^J_e1 = ε^2_p C^p_e1                          cycling flux is LESS sensitive than p
R^p_x  = ε^1_x C^p_e1                          response to any effector of v1
R^p_T  = ε^1_s /(ε^1_s M_p + ε^2_p M_s)        response to the cycle total
R^J_T  = ε^2_p R^p_T
```

---

## VALIDATION

- **Cycle summation** (unmodified): `C^p_e1 + C^p_e2 = 0`.
- **Modified connectivity** (eq 12.7) - **use this, not the standard form**:
  ```
  -1 = -C^p_e1 ε^1_s (p/s) + C^p_e2 ε^2_p
  ```
- **Mole-fraction summation** (eq 12.8): `Σ_i M_i C^{si}_{ej} = 0` for each perturbed enzyme.
  For a two-species cycle: `M_s C^s_e1 + M_p C^p_e1 = 0`.
- **Total response summation** (eq 12.9): `Σ_i M_i R^{si}_T = 1`.
- **Conservation matrix**: `N^T Γ^T = 0`.
- **Numerically**: `s + p` constant across the simulation; `r.conservedMoietyAnalysis = True`
  enabled so the reduced model is used.
- **Plausibility of the elasticities**: `ε = 0.2` for an irreversible Michaelis-Menten step
  means `Km/(Km+s) = 0.2`, i.e. `s = 4·Km` - genuinely saturated. Check that against the model's
  `Km` values rather than assuming.

If someone reports `C^p_e1 = 4.5` with elasticities near 1, the number and the elasticities are
inconsistent -> `workflows/diagnose_unexpected_result.md` step 6.

---

## INTERPRETATION

**Mathematics.** `C^p_e1 = M_s/(M_p ε^1_s + M_s ε^2_p)`. It is bounded by 1 when both arms are
first-order and grows without bound as the arms saturate. The derivation is
**mechanism-independent**: nothing was assumed about the kinase or phosphatase mechanism beyond
the local sensitivity of each rate to its substrate.

**Biology.** A saturated covalent-modification cycle converts a graded change in kinase activity
into a switch-like change in the phosphorylated fraction - zero-order ultrasensitivity. Since
`P` is itself typically a kinase, this is the amplification element of signalling cascades. In a
cascade of `n` layers the overall gain is the **product** of the layer gains
(`R^{pn}_s = r^{p1}_s r^{p2}_{p1} ... r^{pn}_{pn-1}`), so three layers at `r ≈ 4` give `≈ 64`.

**What conservation buys you, and what it costs.** It bounds the species levels (useful: the
Trypanosoma analysis shows conserved-moiety involvement is exactly what makes most steps poor
drug targets, leaving pyruvate transport as one of the few whose reactants sit outside the
conservation laws). It also breaks the standard theorems and the Jacobian.

**What would change the answer.**
- Enzymes not actually saturated -> no ultrasensitivity possible at all.
- Significant **sequestration** of cycle species by the kinase/phosphatase - the models above
  assume it is negligible, and the book states experimental evidence indicates enzyme and cycle
  species concentrations are comparable. Sequestration creates new effective feedback loops and
  can even produce bistability with no explicit positive feedback (the Markevich switch).
- More than one cycle: **first-order ultrasensitivity** appears with purely linear kinetics in
  dual cycles (`R^{s3}_s = (2s1 + s2)/(s1+s2+s3)`, maximum 2; `n-1` cycles give a maximum of
  `n-1`).
- A different definition of "ultrasensitive": the classical `R = S_0.9/S_0.1` calls a system
  ultrasensitive when `R < 81`; the MCA gain calls it ultrasensitive when `R^Y_X > 1`. **Say
  which you mean.**

---

## Reusable checklist for conserved cycles
1. Detect the conservation law (`m - rank(N)`); write it down with its `T`.
2. Reduce the model / enable conservation analysis before solving anything.
3. Record `T` and the mole fractions `M_i`.
4. Get both arm elasticities **at the operating point**, and check whether they are consistent
   with saturation.
5. Use eq 12.1/12.2 for `C^p_e1`; use `R^p_T` for perturbations of the total.
6. Validate with the **modified** connectivity theorem plus eq 12.8 and eq 12.9 - never the
   standard connectivity form.
7. Before claiming ultrasensitivity, confirm the elasticities permit it and say which definition
   of "ultrasensitive" you are using.
8. State the sequestration assumption explicitly.

## Source
Chapter: 11.1-11.3, 11.7 (conservation, reduction, singular Jacobian);
12.1 Moiety Conserved Cycles; 12.2 MCA of Conserved Cycles; 12.3 Using MCA to Understand
Ultrasensitivity; 12.4 Cycle Connectivity Theorems; 12.5 Sequestration; 12.6 Cascades;
Appendix B.2
Pages: book p187-194 & p215-218 (PDF 195-202, 223-226); p221-249 (PDF 229-257);
p261-262 (PDF 269-270)
