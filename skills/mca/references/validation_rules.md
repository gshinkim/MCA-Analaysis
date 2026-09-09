# Validation Rules

**Validate before interpreting.** Run these in order; stop and fix at the first failure.

---

## Level 0 - Structural checks (before any number)

| Check | How | Failure means |
|---|---|---|
| Every reaction enumerated | list reactions from the rate laws, not the diagram | summation will fail |
| Boundary vs floating species identified | boundary species are parameters (`$X` in Antimony) | wrong summation set; response vs control confusion |
| All regulatory interactions found | read each rate law and note **every** species appearing in it | connectivity will fail |
| Conservation laws detected | `rank(N)` vs number of species; `getConservationMatrix()` | singular Jacobian; wrong connectivity theorems |
| Topology classified | linear / branched / cyclic / feedback / moiety-conserved | wrong theorem set applied |
| Scaled vs unscaled known for every quantity | | theorems are stated for **scaled** quantities |

## Level 1 - Steady state

- Did the solver converge? Is `ds/dt ≈ 0` for every floating species?
- Is this the **intended** steady state? Bistable systems have more than one, and the initial
  condition selects which one you reach (Ch 9.4).
- Is it **stable**? `r.getEigenvalues()`; all real parts negative. An unstable state can be
  found by the solver but never by simulation.
- For cycles: are the conserved totals what you intended, and constant?

Control coefficients are undefined away from a steady state.

## Level 2 - Summation theorems

```
For each flux J:      Σ_{i over ALL steps} C^J_ei  = 1
For each species sj:  Σ_{i over ALL steps} C^sj_ei = 0
```
Branched systems: **one flux summation per flux.**

Diagnostics if it fails: missing step; not at steady state; mixed parameters
(`getCC` w.r.t. a non-enzyme parameter is a response coefficient, not a control coefficient);
`v ∝ e` violated; unscaled coefficients; wrong matrix axis summed.

## Level 3 - Connectivity theorems (the discriminating check)

For each floating species `sk`, summing over **only the reactions `sk` interacts with**:
```
Σ_i C^J_ei   ε^{vi}_{sk} = 0
Σ_i C^{sk}_ei ε^{vi}_{sk} = -1
Σ_i C^{sm}_ei ε^{vi}_{sk} = 0        (m ≠ k)
```
Include regulatory interactions. Exclude reactions the species does not touch.

**Do not use these forms for species in a moiety-conserved cycle** - use the modified cycle
theorem instead (Level 5).

## Level 4 - Topology-specific theorems

**Branch point** (`α = J2/J1`):
```
C^{J1}_e2 (1-α) - C^{J1}_e3 α = 0
C^{J2}_e1 (1-α) + C^{J2}_e3   = 0
C^{J3}_e1 α     + C^{J3}_e2   = 0
C^s_e2 (1-α) + C^s_e3 α = 0
C^s_e1 (1-α) + C^s_e3   = 0
C^s_e1 α     + C^s_e2   = 0
```

## Level 5 - Conserved cycles

```
Modified connectivity:  -1 = -C^p_e1 ε^1_s (p/s) + C^p_e2 ε^2_p
Cycle summation:        C^p_e1 + C^p_e2 = 0             (unmodified)
Species-wise summation: Σ_i M_i C^{si}_{ej} = 0         (eq 12.8)
Total response:         Σ_i M_i R^{si}_T   = 1          (eq 12.9)
Conservation matrix:    N^T Γ^T = 0
Totals numerically constant across the simulation
```

## Level 6 - Sign and magnitude sanity

- Substrate elasticities positive, product elasticities negative, inhibitors negative,
  `ε^v_e = 1`.
- Reversible mass action: `ε^v_s + ε^v_p = 1`, `|ε^v_s| > |ε^v_p|`.
- Irreversible MM: `0 <= ε^v_s <= 1`, exactly `0.5` at `s = Km`.
- Raising an upstream enzyme raises downstream metabolites; raising a consuming enzyme lowers
  its substrate.
- Linear pathway with normal signs: `0 <= C^J <= 1`. **Outside that range in a linear
  pathway = investigate.** In a branch or cycle, expected.
- Symbolic control equations for a chain: every numerator term appears in the common
  denominator, and all coefficients share that denominator.

## Level 7 - Numerical hygiene

- If coefficients came from finite differences: was a **three-point** (symmetric) estimate used?
  Was the step small enough for the local curvature? (Ch 2.2: 5% step gave 2.55% error with the
  one-sided quotient vs 0.7% with three-point, at a high-curvature point.)
- Was each perturbed parameter **restored** before the next perturbation?
- Was the steady state re-solved after every parameter change?
- Were all quantities taken at the **same** steady state?
- For conserved models, was `conservedMoietyAnalysis` enabled / the model reduced? An
  un-reduced conserved model has a singular Jacobian and every Jacobian-inverting routine
  will misbehave.

## On tolerance

**The source specifies no universal numerical tolerance.** Any threshold depends on:
- floating-point precision;
- the steady-state solver's convergence criterion;
- the method used to obtain the coefficients (analytic, matrix inversion, finite difference);
- for finite differences, the perturbation size and the local nonlinearity.

State the tolerance you used and why. Never present an invented constant as sourced. Never
call an approximate numerical equality an exact mathematical equality.

## Reporting template

```
VALIDATION
  Steady state:      converged / eigenvalues all negative real parts
  Flux summation:    ΣC^J1 = 1.0000 (residual 3e-9)  [n steps included: ...]
  Conc. summation:   ΣC^s1 = ...    (residual ...)
  Connectivity S1:   Σ C^J ε = ...  [reactions included: v1, v2, v5(inhibition)]
  Branch/cycle:      ...
  Signs:             all as expected / exception: C^{J2}_e3 = -8.51, expected (branch competition)
  Method & tolerance: coefficients from r.getCC (analytic); residuals judged against 1e-6,
                      chosen from solver convergence, not from the source
```

## Related concepts
[[summation_theorems]], [[connectivity_theorems]], [[branched_and_cyclic_systems]],
[[conserved_cycles]], [[computational_mca]], [[common_failure_modes]], [[interpretation_rules]]

## Source
Chapter: 3.5; 4.2; 4.5 (matrix check); 7.1; 9; 11.4, 11.7; 12.4
Section: as cited inline
Pages: book p41-49 (PDF 49-57); p55-61 (PDF 63-69); p65-66 (PDF 73-74); p113-118 (PDF 121-126);
p145-152 (PDF 153-160); p195-217 (PDF 203-225); p230-233 (PDF 238-241)
