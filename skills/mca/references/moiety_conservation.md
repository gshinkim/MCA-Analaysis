# Moiety Conservation Laws

## Definition
> **Moiety**: a subgroup of a larger molecule.
> **Conserved moiety**: a subgroup whose interconversion through a sequence of reactions
> leaves it unchanged.

As a moiety is redistributed through a network the **total amount of the moiety is constant**
and does not change during the time evolution of the system. For any particular subgroup the
total is determined **solely by the initial conditions** imposed on the model.

## Why they exist - the timescale argument
Cell processes run on different timescales. Within the timescale of phosphorylation and
dephosphorylation, protein synthesis and degradation are negligible, so total protein
(phosphorylated + unphosphorylated) is constant. Same for ATP/ADP/AMP: the adenosine group is
conserved over the timescale of energy metabolism, even though AMP degradation and biosynthesis
via the purine nucleotide pathway happen slowly.

> in reality conserved moieties do not exist since all molecular subgroups will at some point
> be subject to synthesis and degradation. However, over sufficiently short time scales, the
> sum total of these groups can be considered constant.

**A conserved moiety is therefore an approximation deliberately introduced into a model** -
but one with profound behavioural consequences (hyperbolic enzyme response via E/ES
conservation; sigmoid behaviour in signalling networks).

Examples the book gives: phosphorylated/unphosphorylated protein; ATP/ADP/AMP (adenosine);
enzyme/enzyme-substrate complexes; NAD/NADH; phosphate; coenzyme A.

## Not always a real moiety
> There are rare cases when a 'conservation' relationship arises out of a non-moiety cycle.
> This does not affect the mathematic analysis, only the physical interpretation.

The book's example gives `b - c = constant` from stoichiometric matching in a network with no
shared moiety. So a **negative coefficient** in a conservation law may be legitimate.

## Recognising it in a model
- Two or more species interconvert with no net synthesis or degradation on the modelled timescale.
- Algebraically: **linearly dependent rows in the stoichiometry matrix `N`**.
- Number of conservation laws = `m - rank(N)`, where `m` is the number of species.
- Rows can be arranged so the first `rank(N)` rows are linearly independent; those species are
  the **independent species** `s_i`, the remaining `m - rank(N)` are the **dependent species** `s_d`.

Worked recognitions:
- Simple cycle `S1 <-> S2`: `N = [[-1, 1], [1, -1]]`. One row is `-1` times the other -> one
  conservation law, `s1 + s2 = T`.
- Three-species cycle: rows sum to zero -> `s1 + s2 + s3 = constant`.
- Linear pathway `N = [[1,-1,0],[0,1,-1]]`: rows independent -> **no** conserved cycles.
- Enzyme mechanism (`S1, S2, E, ES` with `v1, v2, v3`): two laws, `e + es = T1` and
  `es + s1 + s2 = T2`.

## What changes mathematically
1. `N` is rank deficient; there are linear relations among the `ds/dt`.
2. The **full Jacobian is singular** - see below.
3. The model can and should be **reduced**: integrate only the independent species and compute
   the dependent ones algebraically.
4. **Connectivity theorems for the cycle species are modified** - see [[conserved_cycles]].
5. The implicit-differentiation route of Ch 4.5 needs modification, because `(N ∂v/∂s)^{-1}`
   does not exist.

For the simple cycle, instead of two ODEs:
```
s2 = T - s1
ds1/dt = v1 - v2                                                       (eq 11.2)
```
`T` is computed from the initial amounts at the start of the simulation.

## How to find the conservation laws

### Method 1 - Row reduction (easiest; the book's recommended manual method)
Augment `N` with an identity matrix, reduce `N` to **row echelon form** while applying the
same elementary operations to the identity, then read the conservation laws off the rows of
the transformed identity that correspond to the **zero rows** of the reduced `N`.

```
[ M ]        [ X ]  ds
[ 0 ] v  =   [ Y ]  --                                       (eq 11.7)
                    dt
Y (ds/dt) = 0        -> the conservation laws                (eq 11.8)
```

**Algorithm as stated in the source:**
1. Apply elementary operations to `N` until it is in row echelon form; apply the same
   operations simultaneously to an identity matrix of size = number of rows of `N`.
2. If there are zero rows at the bottom of the reduced `N` there are conservation laws;
   otherwise there are none. **The number of conservation laws equals the number of zero rows.**
3. Extract the rows of the transformed identity that correspond to the zero rows. Those are
   the conservation laws.

**Two practical points the source insists on:**
- Row swaps in `N` do **not** change the species labels attached to the columns of the
  conservation matrix.
- When eliminating below a leading entry, **add rather than subtract wherever possible**, so
  the entries stay positive and the conservation laws are physically interpretable.
- Strategy to avoid negative terms: **order the rows of `N` so that any species likely to
  appear in more than one conservation relationship (complexes, shared species) is at the
  bottom.** This makes the independent species the "free variables" and the dependent species
  the "shared variables". A brute-force alternative for small models (< 10 species) is to try
  all row permutations until a positive set is found.

Worked example in the book: with `ES` in the middle of `N` the laws come out as
`s2 + s1 - e = T1`, `es + e = T2`; moving `ES` to the bottom gives the all-positive
`s2 + s1 + es = T1`, `es + e = T2`. **These are the same laws** - substitute one into the other.

### Method 2 - Null space of `N^T`
```
Γ N = 0   ->   N^T Γ^T = 0                                            (eq 11.14)
```
The conservation matrix `Γ` is the **left null space of `N`**. Many tools compute this
directly. Most return an **orthonormal** basis, which must be row-reduced (`rref`) to get an
interpretable rational basis. Verified per-tool notes from the source:

| Tool | Command | Basis returned |
|---|---|---|
| Scilab | `kernel(N')` | orthonormal - follow with `rref(ns')'` |
| Matlab | `null(N)` / `null(N,'r')` | `'r'` gives a rational basis directly |
| Octave | `null` | no `'r'` option |
| Mathematica | `NullSpace[A]` | v7 rational; v11 appears orthonormal |
| Python (sympy) | `sympy.Matrix.nullspace(sympy.Matrix.transpose(n))` | normalised rational basis |
| Tellurium | `r.conservedMoietyAnalysis = True; r.getConservationMatrix()` | labelled |

`scipy.linalg` deliberately provides neither `rref` nor a null-space routine - use `sympy`.

**Use `N^T Γ^T = 0` as a correctness test on any conservation matrix you obtain.**

### Method 3 - SVD
`A = U S V^T`. The rows of `V^T` corresponding to zero singular values form an orthonormal
basis for the null space of `A`. Apply to `N^T`; extract the bottom `n - r` rows; row-reduce
for a rational basis. Robust; no row or column exchanges, so **species labels stay aligned
with the original row order of `N`** - which means row ordering can still be used to steer the
form of the laws. Expensive on large systems and needs a final Gauss-Jordan step.

### Method 4 - QR factorisation via `L0`
`A P = Q R`. Applied to `N^T`, the permutation `P` reorders columns of `N^T` (equivalently rows
of `N`) so independent ones come first. Then
```
R12 = R11 L0^T ,  and after reducing R to echelon form (R11 = I),   L0 = R12^T
```
Augment with an identity to get `Γ = [-L0  I]`. Robust and faster than SVD, but the
permutation matrix determines the row order, so you cannot fully prescribe the form of the
laws. **The permutation matrix determines the species labels on the conservation columns** -
this is easy to get wrong.

### Method 5 - RRQR (rank-revealing QR)
```
A P [ -R11^{-1} R12 ; I ] = 0                                         (eq 11.18)
```
Generates a **rational** basis directly because of the identity block, so no Gauss-Jordan step.
Requires inverting `R11`, but `R11` is triangular so efficient routines exist.
> For any new software implementation I would probably recommend this approach.

### Comparison (Table 11.1)

| Method | Advantages | Disadvantages |
|---|---|---|
| Row reduction | simple; fast; row order controllable | potential numerical instability |
| SVD | robust | expensive on large systems; needs a final Gauss-Jordan step |
| QR by `L0` | robust; faster than SVD | needs a final Gauss-Jordan step |
| QR by RRQR | robust; row order | (no Gauss-Jordan step required) |

Most modern simulators use row reduction or, more commonly in recent years, QR via `L0`.
Also mentioned: Schuster and colleagues' **convex analysis** approach, used primarily to
generate conservation laws with (where possible) only positive entries.

**Numerical warning**: for large genome-scale models with hundreds or thousands of reactions,
row reduction "can suffer dramatic failures due to rounding errors".

## The link matrix formalism (Ch 11.5, "Advanced Theory - Optional")
Partition `N` into independent rows `NR` (full rank) and dependent rows `N0`:
```
N0 = L0 NR                                                            (eq 11.11)
L = [ I ; L0 ]        (the link matrix, m x mo)
N = L NR
L = NC NRC^{-1}
```
Also `NC` = the partition of `N` containing the last `mo` columns; `NRC` = independent rows and
columns, an `mo x mo` **invertible** matrix. If there are no conserved cycles, `rank(N) = m`,
`N = NR`, and `L = I`.

Partitioning the system equation:
```
ds_d/dt = L0 (ds_i/dt)
s_d(t) - s_d(0) = L0 [ s_i(t) - s_i(0) ]
[ -L0  I ] [ s_i ; s_d ] = T ,   with T = s_d(0) - L0 s_i(0)          (eq 11.12)
Γ s = T ,   Γ = [ -L0  I ]  (the conservation matrix)
s_d = L0 s_i + T                                                      (eq 11.15)
```
Each row of `Γ` is one conserved cycle; the number of rows is the number of cycles; the entries
say which species contribute.

**Scaled link matrix** (used in MCA sensitivity formulations):
```
L~ = (D_s)^{-1} · L · D_{sI}
```
where `D_s` is a diagonal matrix of reciprocal species concentrations and `D_{sI}` a diagonal
of the independent species.

## Design of simulation software (Ch 11.7)

### Reduced systems
```
s_d      = L0 s_i + T
ds_i/dt  = NR v(s_i, s_d)                                             (eq 11.19)
```
> This modified equation constitutes the most general expression for a temporal model that
> uses differential equations.

**Order matters**: compute the dependent species first, then evaluate the reduced ODEs.
Compute `T` at the start of a simulation from the initial conditions. In multi-compartment
systems, **sum amounts, not concentrations**.

Gain: an E. coli model from the BiGG repository has ~5% redundant differential equations.

### Numerical stability - the more important reason
For a simple cycle `S1 <-> S2` with `v1 = k2 s2`, `v2 = k1 s1`:
```
J = [ -k1   k2 ]
    [  k1  -k2 ]
```
**Singular.** The row dependencies in `N` reappear as dependencies in the Jacobian, so any
calculation requiring the Jacobian's inverse fails - stiff ODE solvers, steady-state solvers,
sensitivity calculations, frequency analysis, some optimisation algorithms.
> The solution is to work with the reduced model.

Compare the non-conserved linear chain, whose Jacobian `[[-k2,0],[k2,-k3]]` is always
invertible for non-zero rate constants.

### Multicompartment systems
> when conservation laws cross compartment boundaries ... the sum must be with respect to the
> total mass.
```
Σ_i V_i s_i = T
```
Models often assume unit volumes so the law can be written as a sum of concentrations - "it is
easy to forget that what is actually conserved is in fact mass, not concentration."

## Assumptions
- Interconversion of the moiety is fast compared with net synthesis and degradation of the
  moiety-bearing species.
- Unit volumes, unless volumes are handled explicitly.
- `T` is set by the initial conditions and is a **parameter** of the reduced model - which is
  why `R^s_T` and `R^J_T` are response coefficients ([[conserved_cycles]]).

## Validation
- `N^T Γ^T = 0` for the computed conservation matrix.
- Each law's entries should match the moiety composition you can draw on the network diagram.
- `Σ V_i s_i` should be numerically constant across a simulation.
- Number of laws should equal `m - rank(N)`.
- If a steady-state solve or Jacobian inversion fails on a model with cycles, suspect that the
  reduction was not applied.

## Common mistakes
- **Not reducing the model**, then hitting a singular Jacobian and blaming the solver.
- Reading a **negative entry** in a conservation law as an error. It can be legitimate
  (stoichiometric matching) or an artefact of row ordering - re-order and re-derive before
  concluding anything.
- Losing track of which species each column of `Γ` refers to after a QR permutation.
- Summing concentrations across compartments of different volumes.
- Assuming a conservation law is exactly true rather than a timescale approximation.
- Forgetting that `T` is a parameter you can perturb - a legitimate and biologically meaningful
  intervention (drugs change total protein mass; Ch 12.6).

## Related concepts
[[conserved_cycles]], [[stability]], [[computational_mca]], [[deriving_control_equations]],
[[validation_rules]]

## Source
Chapter: 11 (Moiety Conservation Laws)
Section: 11.1 Moiety Constraints; 11.2 Moiety Conserved Cycles; 11.3 Basic Theory;
11.4 Computational Approaches (Null Space of N^T); 11.5 Advanced Theory - Optional (Scaled L);
11.6 Numerical Methods (SVD; QR Factorization; RRQR); 11.7 Design of Simulation Software
(Reduced Systems; Numerical Stability; Multicompartment Systems)
Pages: book p187-219 (PDF 195-227); Jacobian footnote Ch 9.1 book p151 (PDF 159);
implicit-differentiation limitation Ch 4.5 book p69 (PDF 77)
