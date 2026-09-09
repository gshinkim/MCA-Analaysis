# Source Map

## The source
Herbert M. Sauro, *Systems Biology: Introduction to Metabolic Control Analysis*,
Ambrosius Publishing, First Edition v1.02. Copyright 2013-2019. ISBN 978-0-9824773-6-6.
Dated August 2018, Seattle, WA. PDF: `MCA_1_02.pdf`, 284 pages.

**Page convention used everywhere in this Skill: book page = PDF page - 8.**
(Book p1 = PDF p9; book p3 = PDF p11; book p255 = PDF p263.)

Free software used in the book: `tellurium.analogmachine.org`.

## Skill topic -> book location

| Skill topic | Chapter | Book pages | PDF pages |
|---|---|---|---|
| Prerequisites | Expected Prerequisites | 1 | 9 |
| Conceptual foundations, history, rate-limiting step doctrine | 1 | 3-6 | 11-14 |
| Elasticities | 2 | 7-30 | 15-38 |
| Control coefficients, summation theorems | 3 | 31-52 | 39-60 |
| Connectivity theorems, response coefficients, canonical CCs, deriving control equations, S-systems | 4 | 53-74 | 61-82 |
| Experimental MCA | 5 | 75-88 | 83-96 |
| Linear pathways, front loading, protein allocation | 6 | 89-112 | 97-120 |
| Branched and cyclic (futile) systems | 7 | 113-124 | 121-132 |
| Negative feedback, PFK paradox, supply/demand | 8 | 125-144 | 133-152 |
| Stability, Jacobian, phase portraits, bifurcation, bistability | 9 | 145-174 | 153-182 |
| Stability of negative feedback systems, pathway length | 10 | 175-186 | 183-194 |
| Moiety conservation laws, computational methods, software design | 11 | 187-220 | 195-228 |
| Moiety conserved cycles, ultrasensitivity, sequestration, cascades | 12 | 221-252 | 229-260 |
| Symbols and abbreviations | Appendix A | 255-257 | 263-265 |
| Control-equation reference | Appendix B | 259-263 | 267-271 |
| References | - | 265-270 | 273-278 |
| History | - | 271 | 279 |
| Index | - | 273 | 281 |

## Section-level map

**Ch 2 Elasticities** - 2.1 Introduction (7); 2.2 Elasticity Coefficients (10); 2.3 Mass-action
Kinetics (18); 2.4 Enzyme Catalyzed Reactions (21); 2.5 Cooperativity (23); 2.6 Local Equations
(24); 2.7 General Elasticity Rules (25); 2.8 Summary (28); Exercises (30).

**Ch 3 Introduction to Biochemical Control** - 3.1 What do we mean by Control? (31);
3.2 Control Coefficients (32); 3.3 Distribution of Control (36); 3.4 Predicting Flux and
Concentration Changes (39); 3.5 Summation Theorems (41), incl. Interpreting the summation
theorems (45), What determines the value of a flux control coefficient? (47), Rate-limiting
steps (48); 3.6 Appendix - Tellurium scripts (51).

**Ch 4 Linking the Parts to the Whole** - 4.1 Control Coefficients in Terms of Elasticities
(53); 4.2 Connectivity Theorems (55) incl. Interpretation (60); 4.3 Response Coefficients (61);
4.4 Canonical Control Coefficients (63); 4.5 How to Derive Control Equations (64) incl. matrix
form and the Pure Algebraic Method (66); 4.6 Relationship to S-Systems (69); Appendix 4.A
Python/Tellurium Scripts (73).

**Ch 5 Experimental Methods** - 5.1 Introduction (75); 5.2 Using Classical Genetics (76);
5.3 Genetic Engineering (76); 5.4 Titration by Inhibitors (79); 5.5 Double Modulation Technique
(81); 5.6 Reconstituted Systems (83); 5.7 By Computer Simulation (84); 5.8 By Calculation -
Serine Pathway (85).

**Ch 6 Linear Pathways** - 6.1 Basic Properties (89); 6.2 Product Insensitive Steps (95);
6.3 Steps Close to Equilibrium (96); 6.4 Saturable Enzyme Kinetics (97); 6.5 Front Loading
(102); 6.6 Optimal Allocation of Protein (106); 6.7 Appendix (110).

**Ch 7 Branched and Cyclic Systems** - 7.1 Branched Pathways (113); 7.2 Futile or Substrate
Cycles (120); Tellurium Scripts (123).

**Ch 8 Negative Feedback** - 8.1 Historical Background (125); 8.2 Simple Quantitative Analysis
(128); 8.3 Negative Feedback in Biochemical Systems (132); 8.4 The PFK Paradox (138);
8.5 Robustness and Supply/Demand (142); 8.6 Instability (143).

**Ch 9 Stability** - intro incl. internal stability (145); 9.1 Jacobian for Biochemical Systems
(150); 9.2 External Stability (153); 9.3 Phase Portraits (153); 9.4 Bifurcation Plots (158);
9.5 Appendix (171).

**Ch 10 Stability of Negative Feedback Systems** - 10.1 Introduction (175); 10.2 Stability using
MCA (176); 10.3 Effect of Pathway Length (181).

**Ch 11 Moiety Conservation Laws** - 11.1 Moiety Constraints (187); 11.2 Moiety Conserved Cycles
(189); 11.3 Basic Theory (191); 11.4 Computational Approaches (195); 11.5 Advanced Theory -
Optional (205); 11.6 Numerical Methods (209); 11.7 Design of Simulation Software (215).

**Ch 12 Moiety Conserved Cycles** - 12.1 Moiety Conserved Cycles (221); 12.2 MCA of Conserved
Cycles (223); 12.3 Using MCA to Understand Ultrasensitivity (226); 12.4 Cycle Connectivity
Theorems (230); 12.5 Sequestration (237); 12.6 Cascades (242); Appendix 12.A Python/Tellurium
Scripts (250).

**Appendix B Control Equations** - B.1 Linear Pathways (259); B.2 Cycles (261); B.3 Branches (262).

## Numbered equations referenced by this Skill

| Eq | What | Book page |
|---|---|---|
| 2.2, 2.3 | scaled and unscaled elasticity | 10 |
| 2.4 | percentage form | 17 |
| 2.6-2.9 | reversible mass-action elasticities; disequilibrium ratio | 18 |
| 2.10 | `ε^v_s + ε^v_p = 1` | 19 |
| 2.12 | general reversible mass action | 20 |
| 2.13 | `ε^v_e = 1` | 21 |
| 2.15 | Hill elasticity | 23 |
| 2.16 | the Local Equation | 25 |
| 3.1, 3.2 | FCC, CCC definitions | 35 |
| 3.3, 3.4 | prediction equations | 39 |
| 3.7 | enzyme elasticity = 1 | 41 |
| 3.10 | summation theorems | 45 |
| 4.1, 4.3, 4.4 | two-step control equations | 54-55 |
| 4.8-4.10 | connectivity theorems | 59 |
| 4.11-4.13 | three-step connectivity sets | 61 |
| 4.14, 4.15 | response coefficient relations | 62-63 |
| 4.16 | canonical control coefficient | 63 |
| 4.17 | two-step FCCs from theorems | 64 |
| 4.18, 4.19 | matrix forms | 65-66 |
| 4.20 | `C^s_e1` by implicit differentiation | 67 |
| 4.21, 4.22 | system equation, matrix implicit differentiation | 67 |
| 5.1, 5.2 | inhibitor titration | 79, 81 |
| 5.3 | double modulation | 82 |
| 5.4 | serine pathway FCCs | 86 |
| 6.3 | linear reversible rate law | 90 |
| 6.5, 6.6 | steady-state flux and FCC for a linear chain | 92 |
| 6.7 | adjacent FCC ratio = `q` | 93 |
| 6.8, 6.9 | FCC ratios from disequilibrium ratios | 94-95 |
| 6.10 | three-step FCCs from elasticities | 99 |
| 6.11 | four-step engineering exercise pathway | 109 |
| 7.1, 7.2 | branch control equations | 116-117 |
| 7.3 | substrate-cycle amplification ceiling | 121 |
| 8.1, 8.2 | closed-loop gain; open-loop and loop gain | 129 |
| 8.3 | closed-loop transfer function | 138 |
| 8.4, 8.5, 8.6 | loop gain in MCA terms | 140-141 |
| 9.4-9.7 | Jacobian definitions; `J = N ∂v/∂s` | 147-152 |
| 9.8 | Euler/de Moivre expansion | 155 |
| 10.1, 10.3, 10.4 | eigenvalue determinant; four-step stability condition | 177-180 |
| 10.5-10.7 | de Moivre roots; general stability condition | 183-184 |
| 11.2 | reduced cycle system | 191 |
| 11.7, 11.8 | echelon partition; conservation laws | 198 |
| 11.10-11.15 | link matrix formalism | 203-208 |
| 11.14 | `N^T Γ^T = 0` | 207 |
| 11.18 | RRQR null space | 214 |
| 11.19 | reduced simulation system | 216 |
| 12.1-12.5 | cycle control and response coefficients | 227-230 |
| 12.7 | modified cycle connectivity | 231 |
| 12.8, 12.9 | cycle summation relations | 233 |
| 12.10 | dual-cycle response | 235 |
| 12.16, 12.17 | local cascade response coefficients | 245 |
| 12.18, 12.19 | cascade product rule; cascade with feedback | 245, 248 |

---

# KNOWN LIMITATIONS OF THE SOURCE

## Stated by the author in the Preface (book pvii, PDF p7)

> There are however a number of topics missing from this edition. These include **control in
> complex branched systems**, a detailed look at the effect of **sequestration, including
> metabolic channeling**, and **hierarchical control analysis that includes genetic regulation**
> as part of the analysis. More advanced mathematical topics that involve **extensive use of
> matrix algebra** is also omitted. These may be included, together with the recent
> **frequency domain extensions**, in a later edition.

So the source does **not** provide a complete treatment of:
1. Control in complex branched systems (only the single branch point of Ch 7.1).
2. Sequestration in detail, including metabolic channeling (Ch 12.5 is explicitly partial and
   says the area "has not received much attention in the literature").
3. Hierarchical control analysis including genetic regulation.
4. Advanced matrix-algebra treatments of MCA.
5. Frequency-domain extensions.

## Further scope limits stated inside the chapters
- The **general proof of the summation theorems** for arbitrary networks: *"A full justification
  would require the use of matrix algebra which is beyond the scope of the current edition"*
  (Ch 3.5, book p43). Only one-step, two-step and simple-branch operational proofs are given.
- **Implicit differentiation via eq 4.22 does not work on pathways with conserved moieties**
  without modification (Ch 4.5, book p69).
- Ch 8.4 gives only "a flavor of the connection" between MCA/BST and engineering control theory,
  referring out to Ingalls and Rao. *"Not all effects of negative feedback will be discussed."*
- Ch 10.3's pathway-length stability result assumes first-order kinetics with **equal** rate
  constants for all non-feedback steps.
- Ch 11.5 and 11.6 are marked "Advanced Theory - Optional".
- Ch 12.5: *"Interlocked cycles that also incorporate sequestration effects are likely to be
  able to display an extremely wide range of behaviors. This is an area of theoretical analysis
  [that] has not received much attention in the literature."*
- Reversible Briggs-Haldane elasticity details are referred to the companion book
  (*Enzyme Kinetics for Systems Biology*); Ch 2.4 gives only Table 2.2's summary.
- Linearisation theory is referred to *Systems Biology: Introduction to Pathway Modeling*.

## Required wording when a question falls outside
When asked about any of the topics above, or about MCA machinery the book does not contain,
respond with:

> The primary MCA source used by this Skill does not provide a complete treatment of this topic.

Then say what the source **does** cover that is adjacent (e.g. for hierarchical control: the
book covers enzyme-level control coefficients and response coefficients, but not gene-expression
layers), and offer to work from what is there under stated assumptions. Do not silently fill the
gap with outside MCA theory.

---

# TYPOGRAPHICAL DISCREPANCIES FOUND IN THE SOURCE

Recorded so the Skill does not propagate them. Each is resolved by internal consistency with
other equations in the same book.

| Location | As printed | Resolution used by this Skill |
|---|---|---|
| Book p67 (PDF 75), after eq 4.20 | `C^J_e1 = ε^1_s/(ε^2_s - ε^1_s)` | `ε^2_s/(ε^2_s - ε^1_s)`. Substituting eq 4.20 into `C^J_e1 = C^s_e1 ε^1_s + 1` gives this, and it matches eq 4.3, eq 4.17 and Appendix B.1. |
| Book p67 (PDF 75), eq 4.22 | `ds/de = (N ∂v/∂s)^{-1} N ∂v/∂e` | Solving `0 = Ax + b` requires `x = -A^{-1}b`; the minus sign is missing. |
| Book p68 (PDF 76), scaled result | `C^s_e1 = 1/(ε^1_s - ε^2_s)` | `1/(ε^2_s - ε^1_s)` - consistent with eq 4.1, eq 4.20 and Appendix B.1, and gives the physically correct sign. |
| Book p229 (PDF 237), implicit-differentiation box | `C^p_e1 = 1/(ε^1_s p/s - ε^2_p)`, `= s/(ε^1_s p - ε^2_p s)` | Plus signs. The line above it, `0 = ε^1_e1 - ε^1_s(p/s)C^p_e1 - ε^2_p C^p_e1`, gives `C^p_e1 = s/(ε^1_s p + ε^2_p s)`, which is eq 12.1 - the result the box itself claims to reproduce. |
| Book p235 (PDF 243) | second dual-cycle expression labelled `C^{s3}_{e1}` a second time | It is `C^{s3}_{e3}`; the surrounding text says so explicitly. |
| Appendix B.3, book p262 (PDF 270) | three feed-flux coefficients all labelled `C^{J1}_{e1}`; third numerator printed as `-ε1(1-α) + ε2α` | Labels are `C^{J1}_{e1}, C^{J1}_{e2}, C^{J1}_{e3}`; third numerator is `-ε1(1-α)`, forced by the flux summation theorem together with the Ch 7.1 connectivity and branch-point theorems. |
| Appendix B.2, book p262 (PDF 270) | `R^J_T = -ε^2_2 ε^1_1/(M2 ε^1_1 + M1 ε^2_2)` | Ch 12.3 eq 12.5 gives `R^J_T = ε^2_p R^p_T`, i.e. without the leading minus. Use eq 12.5. |
| Book p247 (PDF 255), restatement of eq 12.17 | `r^{p2}_{p1} = Ms2 ε^{2f}_{p1}/(Ms2 ε^{2r}_{p2} + Mp2 ε^{2r}_{p2})`, and in the next line `... + Mp2 ε^{2f}_{p2})` | **eq 12.17 is authoritative**: `r^{pi}_{p(i-1)} = M_si ε^{vif}_{p(i-1)} / (M_si ε^{vir}_{pi} + M_pi ε^{vif}_{si})`. The p247 restatements each drop the `ε^{vif}_{si}` term. |
| Book p247 (PDF 255) | `R^{p2}_{T2} = R^{p2}_{T2} r^{p3}_{p2} r^{p4}_{p3} ... r^{pn}_{p(n-1)}` | Left-hand side is `R^{pn}_{T2}`; the surrounding text is about the response of the output `pn` to a middle layer's total. |
| Ch 3.5 listing 3.1 (book p46) | the three-step model assigns `e1` in all three rate laws while `e2, e3` are defined but unused | Read as a transcription slip in the listing; the printed FCC values in Table 3.1 are what the chapter reasons from. Do not re-derive numbers from that listing. |

## Symbol collision to watch
`Γ` is used for the **mass-action ratio** in Ch 2.3 and for the **conservation matrix** in
Ch 11.5. `T` is the total moles in a conserved cycle (Ch 11-12) and also temperature in
Appendix A. `R` is the response coefficient (Ch 4.3), the gas constant (Appendix A), and the
Goldbeter-Koshland `S_0.9/S_0.1` gain (Ch 12.2). Disambiguate by context and say which you mean.

## Related concepts
[[conceptual_foundations]], [[prerequisites]], [[deriving_control_equations]],
[[common_failure_modes]]

## Source
Chapter: whole book; Preface for the stated omissions
Section: Preface; Contents; Appendix A; Appendix B
Pages: book pvii (PDF 7); Contents PDF 3-6; book p255-263 (PDF 263-271)
