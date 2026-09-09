# Deriving Control Equations

## Definition
"Control equations" are the algebraic expressions that give control coefficients in terms of
elasticities. Being able to derive them is described by the book as "a key aspect of MCA"
(Ch 4.5). This file gives the four methods, then a catalogue of ready-made equations
(the book's Appendix B).

---

# Method 1 - Local + system equations (the operational method)

Used at the start of Ch 4 for `Xo -v1-> S1 -v2-> X1`, with `E1` perturbed by `δe1`.

**Local equations** (from the local equation, eq 2.16):
```
δv1/v1 = δe1/e1 + ε^1_1 (δs/s)
δv2/v2 =           ε^2_1 (δs/s)
```
**System equations** (from the control coefficient definitions):
```
δs/s = C^s_e1 (δe1/e1)
δJ/J = C^J_e1 (δe1/e1)
```
At the new steady state `δv1/v1 = δv2/v2`. Equate, substitute `δs/s`, cancel `δe1/e1`:

```
C^s_e1 = 1 / (ε^2_1 - ε^1_1)                                        (4.1)
```
Since `δv1/v1 = δJ/J`, equate the first system and first local equations:
`C^J_e1 = 1 + ε^1_1 C^s_e1`, hence
```
C^J_e1 = ε^2_1 / (ε^2_1 - ε^1_1)                                    (4.3)
```
and by the summation theorems (`C^J_e2 = 1 - C^J_e1`, `C^s_e2 = -C^s_e1`):
```
C^J_e2 = -ε^1_1 / (ε^2_1 - ε^1_1)      C^s_e2 = -1/(ε^2_1 - ε^1_1)  (4.4)
```

**Procedure to reuse this method**
1. Draw the fragment; name every elasticity including regulatory ones.
2. Write one local equation per reaction, dropping terms the thought experiment forces to zero.
3. Write one system equation per observed variable.
4. Impose the steady-state constraints (equal fractional rate changes in a chain;
   `δv1 = δv2 + δv3` at a branch; `δs = -δp` in a two-species cycle).
5. Eliminate the perturbation, cancel, solve.

---

# Method 2 - Combine the theorems

For `Xo -> S -> X1`, one flux connectivity plus one flux summation:
```
C^J_e1 ε^1_s + C^J_e2 ε^2_s = 0
C^J_e1 + C^J_e2 = 1
```
gives eq 4.17:
```
C^J_e1 = ε^2_s/(ε^2_s - ε^1_s)        C^J_e2 = -ε^1_s/(ε^2_s - ε^1_s)
```
Concentration versions from `C^s_e1 + C^s_e2 = 0` and `C^s_e1 ε^1_s + C^s_e2 ε^2_s = -1`.

**For pathways with branches and cycles, additional theorems are required** to close the
system - branch-point theorems ([[branched_and_cyclic_systems]]) and cycle theorems
([[conserved_cycles]]).

## Matrix form
The theorems can be assembled into a matrix and inverted. For a three-step linear chain
(eq 4.18):

```
[ 1      1      1    ] [ C^J_1  C^s1_1  C^s2_1 ]   [ 1   0   0 ]
[ ε^1_1  ε^2_1  0    ] [ C^J_2  C^s1_2  C^s2_2 ] = [ 0  -1   0 ]
[ 0      ε^2_2  ε^3_2] [ C^J_3  C^s1_3  C^s2_3 ]   [ 0   0  -1 ]
```
Row 1 x column 1 is the flux summation theorem. Extend by following the pattern; the
four-step version is given explicitly in the book. Multiply both sides by the inverse of the
elasticity matrix to get the control coefficients.

**Numerical example from the book.** Elasticity matrix
```
[  1     1    1  ]
[ -0.6   1.2  0  ]
[  0    -0.2  0.5]
```
inverted and multiplied by `diag(1,-1,-1)` gives
```
[ 0.192   1.347   0.385 ]
[ 0.577  -0.962   1.154 ]
[ 0.231  -0.385  -1.538 ]
```
Left column sums to one (flux summation); second and third columns sum to zero
(concentration summation). **This is exactly the check to run on any inverted matrix.**

**Transposed layout (eq 4.19)** - more convenient for branches and cycles; flux coefficients
along the top row, negatives absorbed into the elasticity matrix so the right-hand side is
the identity:
```
[ C^J_1   C^J_2   C^J_3  ] [ 1  -ε^1_1   0    ]   [ 1 0 0 ]
[ C^s1_1  C^s1_2  C^s1_3 ] [ 1  -ε^2_1  -ε^2_2] = [ 0 1 0 ]
[ C^s2_1  C^s2_2  C^s2_3 ] [ 1   0      -ε^3_2]   [ 0 0 1 ]
```

Mathematica idiom given in the book for symbolic inversion:
```
ee = {{1, -e1, 0}, {1, -e2, -e3}, {1, 0, -e4}}
Inverse[ee]
```

---

# Method 3 - Implicit differentiation (algebraic method, "advanced topic")

For `Xo -v1-> S -v2-> X1` at steady state:
```
ds/dt = v1(s(e1), e1) - v2(s(e1)) = 0
```
Note the functional dependencies: `v1` depends on `s` **and** directly on `e1`; `v2` depends
on `e1` only indirectly through `s`. Differentiate implicitly w.r.t. `e1`:
```
0 = (∂v1/∂s)(ds/de1) + ∂v1/∂e1 - (∂v2/∂s)(ds/de1)
```
Scale each derivative by the appropriate factors:
```
0 = C^s_e1 ε^1_s + ε^1_e1 - C^s_e1 ε^2_s
```
With `ε^1_e1 = 1`:
```
C^s_e1 = 1/(ε^2_s - ε^1_s)                                          (4.20)
```
For the flux: differentiate `J = v1(s(e1), e1)` to get `C^J_e1 = C^s_e1 ε^1_s + 1`, then
substitute. `C^s_e2` comes from differentiating `ds/dt = v1(s(e2)) - v2(s(e2), e2) = 0`.

> **Source discrepancy to be aware of.** After eq 4.20 the book prints the flux result as
> `C^J_e1 = ε^1_s/(ε^2_s - ε^1_s)`. Substituting eq 4.20 into `C^J_e1 = C^s_e1 ε^1_s + 1`
> gives `ε^1_s/(ε^2_s - ε^1_s) + 1 = ε^2_s/(ε^2_s - ε^1_s)`, which is what eq 4.3, eq 4.17
> and Appendix B.1 all give. Treat the p67 line as a typographical slip and use
> `C^J_e1 = ε^2_s/(ε^2_s - ε^1_s)`.

## Matrix form of implicit differentiation
Starting from the system equation `ds/dt = N v(s(e), e)` (eq 4.21), differentiate at steady
state:
```
0 = N (∂v/∂s)(ds/de) + N (∂v/∂e)
ds/de = (N ∂v/∂s)^-1 N (∂v/∂e)                                      (4.22, as printed)
```
`∂v/∂s` is the `n x m` matrix of **unscaled** elasticities; `∂v/∂e` is `n x n`, diagonal in
the simple case (enzyme `i` affects only reaction `i`). `ds/de` is the unscaled concentration
control coefficient matrix; scale entry by entry to get `C^s_e`.

> **Source discrepancy.** Solving `0 = A x + b` gives `x = -A^-1 b`, so the correct
> rearrangement is `ds/de = -(N ∂v/∂s)^-1 N (∂v/∂e)`. The book's printed eq 4.22 omits the
> minus sign, and the sign then flips again in the worked scaling on p68, which ends at
> `C^s_e1 = 1/(ε^1_s - ε^2_s)` where eq 4.20 gives `1/(ε^2_s - ε^1_s)`. **Use
> `C^s_e1 = 1/(ε^2_s - ε^1_s)`** - that is the form used everywhere else in the book,
> including Appendix B.1, and it is the one that gives the right sign (raising `e1` raises `s`).

Flux version:
```
J = v(s(e), e)  ->  dJ/de = (∂v/∂s)(ds/de) + ∂v/∂e
C^J_e = ε^v_s C^s_e + ε^v_e,  and with v ∝ ei, ε^v_e = I, so   C^J_e = ε^v_s C^s_e + I
```

**Limitation stated by the source**: this approach "cannot, without a minor modification, be
used on pathways that include conserved moieties. This is because the inverse in equation
(4.22) cannot be evaluated." Use the reduced (link-matrix) system - see
[[moiety_conservation]] and [[conserved_cycles]].

The book notes the approach can be encoded in symbolic tools: Mathematica, Maxima, or the
Python tool PySCeSToolbox.

---

# Method 4 - Differentiate an analytic flux expression

Where an analytic steady-state flux exists (linear chains with linear reversible kinetics),
differentiate it w.r.t. a rate constant used as a proxy for enzyme activity. This gives
eq 6.6 directly; see [[linear_pathways]].

---

# Choosing a method

| Situation | Method |
|---|---|
| small fragment, want insight into the mechanism | 1 (local + system equations) |
| you already have all elasticities and want numbers | 2, matrix form + inversion |
| you want symbolic equations for a chain/branch/cycle | 2, symbolic matrix inversion |
| general network, tool-assisted | 3, matrix implicit differentiation |
| you have an analytic flux solution | 4 |
| network has conserved moieties | 3 on the **reduced** system, or the cycle theorems |

---

# Catalogue of control equations (Appendix B)

Generated with Mathematica by the author. Shorthand `ε^i_j` = elasticity of `v_i` w.r.t. `s_j`.

## B.1 Linear pathways

### Two-step `Xo -> S1 -> X1`
```
C^J_e1  =  ε^2_1/(ε^2_1 - ε^1_1)          C^J_e2  = -ε^1_1/(ε^2_1 - ε^1_1)
C^s1_e1 =     1/(ε^2_1 - ε^1_1)           C^s1_e2 =    -1/(ε^2_1 - ε^1_1)
```

### Three-step `Xo -> S1 -> S2 -> X1`
```
D = ε^2_1 ε^3_2 - ε^1_1 ε^3_2 + ε^1_1 ε^2_2

C^J_e1  =  ε^2_1 ε^3_2 / D      C^J_e2  = -ε^1_1 ε^3_2 / D      C^J_e3  = ε^1_1 ε^2_2 / D
C^s1_e1 = (ε^3_2 - ε^2_2)/D     C^s1_e2 = -ε^3_2 / D            C^s1_e3 = ε^2_2 / D
C^s2_e1 =  ε^2_1 / D            C^s2_e2 = -ε^1_1 / D            C^s2_e3 = (ε^1_1 - ε^2_1)/D
```

### Three-step with negative feedback (`S2` inhibits `v1`, elasticity `ε^1_2`)
```
D = ε^1_1 ε^2_2 - ε^1_1 ε^3_2 + ε^2_1 ε^3_2 - ε^1_2 ε^2_1

C^J_e1  = ε^2_1 ε^3_2 / D                 C^J_e2  = -ε^1_1 ε^3_2 / D
C^J_e3  = (ε^1_1 ε^2_2 - ε^1_2 ε^2_1)/D
C^s1_e1 = (ε^3_2 - ε^2_2)/D               C^s1_e2 = (-ε^3_2 - ε^1_2)/D
C^s1_e3 = (ε^2_2 - ε^1_2)/D
C^s2_e1 = ε^2_1 / D                       C^s2_e2 = -ε^1_1 / D
C^s2_e3 = (ε^1_1 - ε^2_1)/D
```
The feedback contributes the extra denominator term `-ε^1_2 ε^2_1`, which is **positive**
(because `ε^1_2 < 0`) and therefore enlarges `D` and shrinks most coefficients.

### Three-step with feedforward loop (`S1` also affects `v3`, elasticity `ε^3_1`)
```
D = ε^1_1 ε^2_2 + ε^2_1 ε^2_2 - ε^1_1 ε^3_2 + ε^2_1 ε^3_2

C^J_e1  = (ε^2_2 ε^3_1 + ε^2_1 ε^3_2)/D   C^J_e2  = -ε^1_1 ε^3_2 / D
C^J_e3  = ε^1_1 ε^2_2 / D
C^s1_e1 = (ε^3_2 - ε^2_2)/D               C^s1_e2 = -ε^3_2 / D       C^s1_e3 = ε^2_2 / D
C^s2_e1 = (ε^2_1 + ε^3_1)/D               C^s2_e2 = (ε^1_1 + ε^3_1)/D
C^s2_e3 = (ε^1_1 - ε^2_1)/D
```

### Four-step `Xo -> S1 -> S2 -> S3 -> X1`
```
D = ε^1_1 ε^2_2 ε^3_3 - ε^1_1 ε^2_2 ε^4_3 + ε^1_1 ε^3_2 ε^4_3 - ε^2_1 ε^3_2 ε^4_3
```
(D omitted from every expression below for readability - divide each by D.)
```
C^J_e1  = -ε^2_1 ε^3_2 ε^4_3        C^J_e2  =  ε^1_1 ε^3_2 ε^4_3
C^J_e3  = -ε^1_1 ε^2_2 ε^4_3        C^J_e4  =  ε^1_1 ε^2_2 ε^3_3

C^s1_e1 = -ε^2_2 ε^3_3 + ε^2_2 ε^4_3 - ε^3_2 ε^4_3      C^s1_e2 = -ε^3_2 ε^4_3
C^s1_e3 = -ε^2_2 ε^4_3                                   C^s1_e4 =  ε^2_2 ε^3_3

C^s2_e1 =  ε^2_1 ε^3_3 - ε^2_1 ε^4_3                     C^s2_e2 = -ε^1_1 ε^3_3 + ε^1_1 ε^4_3
C^s2_e3 = -ε^1_1 ε^4_3 + ε^2_1 ε^4_3                     C^s2_e4 =  ε^1_1 ε^3_3 - ε^2_1 ε^3_3

C^s3_e1 = -ε^2_1 ε^3_2              C^s3_e2 =  ε^1_1 ε^3_2
C^s3_e3 = -ε^1_1 ε^2_2              C^s3_e4 =  ε^1_1 ε^2_2 - ε^1_1 ε^3_2 + ε^2_1 ε^3_2
```

## B.2 Simple conserved cycle `S1 <-> S2`, `s1 + s2 = T`, `M1 = s1/T`, `M2 = s2/T`
```
C^s2_e1 =  M1 /(M2 ε^1_1 + M1 ε^2_2)        C^s2_e2 = -M2 /(M2 ε^1_1 + M1 ε^2_2)
C^J_e1  =  M1 ε^2_2 /(M2 ε^1_1 + M1 ε^2_2)  C^J_e2  = -M2 ε^1_1 /(M2 ε^1_1 + M1 ε^2_2)
R^s2_T  =  ε^1_1 /(M2 ε^1_1 + M1 ε^2_2)     R^J_T   = -ε^2_2 ε^1_1/(M2 ε^1_1 + M1 ε^2_2)
```
(These match Ch 12.3 eq 12.2, 12.4, 12.5 with the chapter's `s/p` naming;
`R^J_T` is printed with a leading minus in Appendix B.2 while Ch 12.3 eq 12.5 gives
`R^J_T = ε^2_p · ε^1_s/(ε^1_s M_p + ε^2_p M_s)` - use the Ch 12.3 form, which follows from
`R^J_T = ε^2_p R^p_T` with both elasticities positive, and note the discrepancy if it matters.)

## B.3 Simple branch `Xo -v1-> S1 -> (v2 -> X1, v3 -> X2)`
With `α = v2/v1`, `ε1 ≡ ε^1_1`, `ε2 ≡ ε^2_1`, `ε3 ≡ ε^3_1`, and
```
d = ε2 α + ε3 (1-α) - ε1        (positive, since ε1 < 0, ε2 > 0, ε3 > 0)
```
Coefficients with respect to the **feed flux `J1`**:
```
C^J1_e1 = (ε3(1-α) + ε2 α)/d
C^J1_e2 = -ε1 α/d
C^J1_e3 = -ε1 (1-α)/d
```
Coefficients with respect to the **branch flux `J2`** (also eq 7.1):
```
C^J2_e1 =  ε2/d                     > 0
C^J2_e2 = (ε3(1-α) - ε1)/d          > 0
C^J2_e3 = -ε2(1-α)/d                < 0
```
Concentration control coefficients (eq 7.2):
```
C^s_e1 =  1/d          > 0
C^s_e2 = -α/d          < 0
C^s_e3 = -(1-α)/d      < 0
```

> **Source discrepancies in Appendix B.3.** (a) All three feed-flux coefficients are printed
> with the label `C^J1_e1`; they are plainly `C^J1_e1`, `C^J1_e2`, `C^J1_e3` in order.
> (b) The third is printed as `(-ε1(1-α) + ε2 α)/d`. Summation requires
> `C^J1_e1 + C^J1_e2 + C^J1_e3 = 1`, i.e. the numerators must sum to `d`;
> `(ε3(1-α)+ε2α) + (-ε1α) + X = ε2α + ε3(1-α) - ε1` forces `X = -ε1(1-α)`. The form given
> above is the one consistent with the theorems in Ch 7.1; use it and note the discrepancy.
> Derivation: from the branch theorem `C^J1_e2(1-α) - C^J1_e3 α = 0`, the flux connectivity
> `Σ C^J1_ei εi = 0` and the flux summation `Σ C^J1_ei = 1`.

---

## Assumptions carried by every equation above
Steady state; `ε^vi_ei = 1`; elasticities evaluated at the operating point; no moiety
conservation among the species (except B.2, which is the cycle case); the network is exactly
the one drawn - **adding one regulatory arrow changes every equation** (compare the plain
three-step case with the feedback and feedforward variants above).

## Validation of a derived equation
1. Check the summation theorem symbolically: numerators must sum to the denominator for a
   flux set, and to zero for a concentration set.
2. Check the connectivity theorem symbolically for each species.
3. Check signs against physical expectation (raising an upstream enzyme raises a downstream
   metabolite; raising a consuming enzyme lowers its substrate).
4. Set an elasticity to a limiting value (0 for product-insensitive, ±∞ for near-equilibrium)
   and check the result matches the qualitative statements in [[linear_pathways]].
5. Substitute numbers and compare against a simulation (`getCC`).

## Common mistakes
- Using a linear-chain equation on a branched or cyclic system.
- Forgetting that a feedback arrow adds an elasticity **and** a denominator term.
- Sign errors from the `-` conventions in eq 4.18 vs eq 4.19; pick one layout and stay in it.
- Inverting the elasticity matrix without checking it is non-singular. A singular matrix
  usually means a conserved moiety was not reduced out.

## Related concepts
[[summation_theorems]], [[connectivity_theorems]], [[linear_pathways]],
[[branched_and_cyclic_systems]], [[conserved_cycles]], [[computational_mca]],
[[moiety_conservation]]

## Source
Chapter: 4.1, 4.5; Appendix B; Ch 6.4, 7.1, 8.3, 12.3 for the specialised forms
Section: 4.1 Control Coefficients in Terms of Elasticities; 4.5 How to Derive Control
Equations (Derivation using the Theorems; Pure Algebraic Method); B.1 Linear Pathways;
B.2 Cycles; B.3 Branches
Pages: book p53-55 (PDF 61-63); book p64-69 (PDF 72-77); book p259-263 (PDF 267-271)
