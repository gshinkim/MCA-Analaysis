# Workflow: Derive a Control Relationship

Use when the answer wanted is an **equation** - a control coefficient in terms of elasticities,
a loop gain, a response coefficient, a stability threshold.

---

## Step 1 - Check the catalogue first
Before deriving anything, check `references/deriving_control_equations.md` Appendix B. It has
ready-made equations for: two-, three- and four-step linear chains; three-step with negative
feedback; three-step with feedforward; the simple conserved cycle; the simple branch.
`references/negative_feedback.md` has the three-step feedback set and the loop gain;
`references/conserved_cycles.md` has the cycle and cascade forms.

**If the topology matches exactly, use the catalogue and skip to Step 6.** "Exactly" means the
same number of steps *and* the same set of regulatory interactions - one extra arrow changes
every equation.

## Step 2 - Draw the fragment and name every elasticity
Include the enzyme elasticities and **every regulatory interaction**. Use the book's shorthand
`ε^i_j` = elasticity of `v_i` w.r.t. `s_j`. Mark expected signs: substrate `+`, product `-`,
inhibitor `-`, `ε^v_e = 1`.

## Step 3 - Count the equations you need
Unknowns = number of coefficients in the set you want.
Available:
- 1 summation theorem per flux, 1 per species;
- 1 connectivity theorem per species per observed variable;
- **+1 branch-point theorem per branch** ([[branched_and_cyclic_systems]]);
- **modified connectivity + the mole-fraction summation for conserved cycles**
  ([[conserved_cycles]]).

If unknowns exceed equations, you are missing a topology-specific theorem. A branch point with
three enzymes gives only 2 equations per flux from summation + connectivity - the branch
theorem is the third.

## Step 4 - Pick a method

| Situation | Method |
|---|---|
| small fragment, want the mechanism visible | **local + system equations** (thought experiment) |
| all theorems available, want the algebra | **combine the theorems** |
| 3+ steps, want it systematic | **matrix form + inversion** (eq 4.18 or the transposed eq 4.19) |
| general network, tool-assisted | **implicit differentiation**, scalar or matrix |
| an analytic steady-state flux exists | **differentiate the flux expression** (linear chains) |
| conserved moieties present | implicit differentiation on the **reduced** system, or the cycle theorems - eq 4.22 is not usable |

### Method A - local + system equations
1. Choose a thought experiment that isolates what you want:
   - **summation-type**: change all enzymes together, or change one and compensate so `δs = 0`.
   - **connectivity-type**: change two enzymes so the **flux** is restored and only one species
     has changed.
   - **response-type**: change an enzyme, then change the external factor to restore both flux
     and concentration.
   - **cycle**: impose `δs = -δp` so `T` is unchanged.
   - **branch**: impose `δv1 = δv2 + δv3` and use `α = J2/J1`.
2. Write one **local equation** per reaction (eq 2.16), dropping the terms the experiment zeroes.
3. Write one **system equation** per observed variable (the control coefficient definitions).
4. Apply the steady-state constraint (equal fractional rate changes in a chain; node balance at
   a branch; `δs = -δp` in a cycle).
5. Substitute the local equations into the system equations.
6. Cancel the common non-zero factor and solve.

### Method B - combine the theorems
Assemble summation + connectivity (+ branch/cycle) as simultaneous linear equations in the
control coefficients and solve.

### Method C - matrix inversion
Build the theorem matrix (eq 4.18 layout, or eq 4.19 with signs absorbed so the RHS is the
identity), invert, read off. For symbolic work:
```
ee = {{1, -e1, 0}, {1, -e2, -e3}, {1, 0, -e4}}
Inverse[ee]
```
Verify the inverse: in the eq 4.18 layout the first column must sum to 1 and the rest to 0.

### Method D - implicit differentiation
```
ds/dt = v1(s(p), p) - v2(s(p)) = 0
```
Differentiate w.r.t. the parameter, being careful about which rates depend on it directly and
which only through `s`. Scale each derivative into elasticities and control coefficients. Set
`ε^v_e = 1`. Solve.
Matrix version: `ds/de = -(N ∂v/∂s)^{-1} N (∂v/∂e)`, then `C^J_e = ε^v_s C^s_e + I`.
(See the sign note in `references/deriving_control_equations.md`.)
**Not usable as-is with conserved moieties** - the inverse does not exist. Reduce first.

## Step 5 - Simplify with stated assumptions
Common, legitimate simplifications - **state each one you use**:
- `ε^v_e = 1` (rate proportional to enzyme).
- Irreversible / product-insensitive steps: set the relevant product elasticity to 0.
- Steps at their `Km`: substrate elasticity 0.5.
- First-order steps: elasticity 1.
- Near-equilibrium steps: `ε_s -> +∞`, `ε_p -> -∞`, or work with `ρ -> 1`.
- Negligible sequestration in cycles.
- `v1 = v2` at steady state in a chain (used to set `F1 = F4` in Ch 10.2).

## Step 6 - Validate the derived equation
1. **Summation, symbolically**: flux numerators must sum to the common denominator;
   concentration numerators to zero.
2. **Connectivity, symbolically**, per species.
3. **Signs**: check against physical expectation.
4. **Limits**: set an elasticity to 0 or ±∞ and check the result matches the qualitative
   statements in `references/linear_pathways.md` (e.g. `ε^1_1 = 0` must give `C^J_e1 = 1`).
5. **Numerically**: substitute values and compare with `r.getCC` on a matching model.
6. Structural check for a chain: every numerator term appears in the common denominator.

## Step 7 - Report
Give the equation, the denominator once, the assumptions, the sign of each elasticity used, and
what the equation says qualitatively (which elasticity, if changed, moves control where).

## Worked patterns to imitate
- Two-step chain, local+system: `references/deriving_control_equations.md` Method 1.
- Branch point, thought experiment: `references/branched_and_cyclic_systems.md`.
- Conserved cycle, `δs = -δp`: `references/conserved_cycles.md` eq 12.1.
- Loop gain from the control coefficient: `references/negative_feedback.md`.
- Stability threshold via the characteristic polynomial: `references/stability.md` Ch 10.2.

## Source
Chapter: 4.1, 4.5; 3.5 (operational proof style); 7.1; 12.3-12.4; 10.2; Appendix B
Pages: book p41-45, p53-55, p64-69, p113-117, p176-181, p227-233, p259-263
(PDF 49-53, 61-63, 72-77, 121-125, 184-189, 235-241, 267-271)
