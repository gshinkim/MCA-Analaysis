# Workflow: Validate MCA Results

Use before interpreting any set of computed or supplied coefficients. Run in order; stop at the
first failure and go to `diagnose_unexpected_result.md`.

Full reference: `references/validation_rules.md`.

---

## Checklist

### 0. Inputs are complete and mapped
- [ ] Every reaction in the model enumerated (transport steps, both arms of every cycle).
- [ ] Boundary vs floating species identified.
- [ ] Every regulatory interaction identified **from the rate laws**, not the diagram.
- [ ] Topology classified.
- [ ] Conservation laws detected (`m - rank(N)`).
- [ ] Every number labelled: which flux, which species, which parameter, scaled or unscaled.

### 1. Steady state
- [ ] Solver converged; `ds/dt ≈ 0` for every floating species.
- [ ] Correct basin (bistable systems).
- [ ] Stable: all eigenvalue real parts negative (`r.getEigenvalues()`).
- [ ] All quantities taken at the **same** steady state.
- [ ] Conserved totals as intended and constant.

### 2. Summation
- [ ] `Σ_i C^J_ei = 1` for **each** flux, summed over **all** steps.
- [ ] `Σ_i C^sj_ei = 0` for **each** floating species.
- [ ] Coefficients are all w.r.t. enzyme concentrations with `ε^v_e = 1` (else convert to
      canonical coefficients first).

### 3. Connectivity
- [ ] `Σ_i C^J_ei ε^{vi}_{sk} = 0` for each species, over interacting reactions only.
- [ ] `Σ_i C^{sk}_ei ε^{vi}_{sk} = -1`.
- [ ] `Σ_i C^{sm}_ei ε^{vi}_{sk} = 0` for `m ≠ k`.
- [ ] Regulatory interactions included in the sums.
- [ ] Cycle species excluded - they use the modified form (check 5).

### 4. Branch points
- [ ] `α = J2/J1` computed from the actual steady-state fluxes.
- [ ] `C^{J1}_e2 (1-α) - C^{J1}_e3 α = 0`
- [ ] `C^{J2}_e1 (1-α) + C^{J2}_e3 = 0`
- [ ] `C^{J3}_e1 α + C^{J3}_e2 = 0`
- [ ] `C^s_e2 (1-α) + C^s_e3 α = 0`, `C^s_e1 (1-α) + C^s_e3 = 0`, `C^s_e1 α + C^s_e2 = 0`

### 5. Conserved cycles
- [ ] `C^p_e1 + C^p_e2 = 0` (summation, unmodified).
- [ ] Modified connectivity: `-1 = -C^p_e1 ε^1_s (p/s) + C^p_e2 ε^2_p`.
- [ ] `Σ_i M_i C^{si}_{ej} = 0` for each perturbed enzyme (eq 12.8).
- [ ] `Σ_i M_i R^{si}_T = 1` (eq 12.9).
- [ ] `N^T Γ^T = 0` for the conservation matrix.
- [ ] Totals numerically constant across the simulation.
- [ ] Model reduced (or `conservedMoietyAnalysis` enabled) so the Jacobian is non-singular.

### 6. Signs and magnitudes
- [ ] Elasticity signs: substrate `+`, product `-`, inhibitor `-`, enzyme `= 1`.
- [ ] Reversible mass action: `ε^v_s + ε^v_p = 1`, `|ε^v_s| > |ε^v_p|`.
- [ ] Irreversible MM: `0 <= ε^v_s <= 1`; exactly 0.5 at `s = Km`.
- [ ] FCC/CCC signs consistent with upstream/downstream position.
- [ ] Magnitudes judged against the **topology's** bounds, not the linear-pathway bound.

### 7. Numerical hygiene
- [ ] Symmetric (three-point) perturbations where finite differences were used.
- [ ] Perturbation size small relative to local curvature.
- [ ] Each perturbed parameter restored before the next.
- [ ] Steady state re-solved after every parameter change.

### 8. Symbolic results (if applicable)
- [ ] Flux numerators sum to the common denominator.
- [ ] Concentration numerators sum to zero.
- [ ] Every numerator term appears in the common denominator (linear chains).
- [ ] Limiting cases reproduce the known qualitative results.

---

## Reporting

```
VALIDATION REPORT
  Steady state:     converged, eigenvalues [...], stable
  Steps included:   v1..vn  (list them - this is what makes the summation check meaningful)
  Flux summation:   J1: 1.000000 (residual 2e-9) ; J2: ...
  Conc. summation:  S1: 0.000000 (residual 5e-10) ; S2: ...
  Connectivity S1:  0.0000 (reactions v1, v2, v4[inhibition])
  Branch (α=0.05):  all three theorems satisfied to <1e-8
  Cycle checks:     n/a  |  Σ M_i C = ...
  Signs:            as expected, except C^{J2}_e3 = -8.51 (expected: branch competition)
  Method:           r.getCC / r.getEE, analytic
  Tolerance:        1e-6, chosen from solver convergence tolerance - NOT specified by the source
  VERDICT:          pass / fail (with the first failing check named)
```

## On tolerance
The source specifies none. It depends on numerical precision, the steady-state solver, and the
computation method. Always state the tolerance you used and its basis, and never call
approximate numerical equality exact mathematical equality.

## Source
Chapter: 3.5; 4.2, 4.5; 7.1; 9; 11.4, 11.7; 12.4
Pages: book p41-49, p55-66, p113-118, p145-152, p195-217, p230-233
(PDF 49-57, 63-74, 121-126, 153-160, 203-225, 238-241)
