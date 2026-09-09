# Workflow: Interpret Supplied MCA Results

Use when the user hands over numbers - an FCC table, a CCC table, an elasticity matrix, raw
`getCC`/`getEE` output, a control-coefficient heat map, a paper's table.

**Do not narrate the numbers.** Establish the mapping, then validate, then interpret. Narrating
first is how row/column errors, FCC/CCC swaps and sign flips become confident wrong answers.

---

## Step 1 - Determine dimensions
Count rows and columns. Compare against the model: `n` reactions, `m` floating species, `f`
fluxes. A control coefficient matrix is typically `m+1` or `f+m` by `n`; an elasticity matrix
is `n x m` (reactions x species). If the shape does not match, **stop and ask** rather than
guessing an orientation.

## Step 2 - Identify rows and columns
Which axis is the perturbed thing (enzymes / parameters) and which is the observed thing
(fluxes / species)? If unlabelled, do not assume. Two book layouts differ:
- eq 4.18 layout: **columns** are `C^J, C^{s1}, C^{s2}, ...` and rows are enzymes -> **columns**
  sum to 1, 0, 0.
- eq 4.19 layout: rows are `C^J, C^{s1}, ...` and columns are enzymes -> **rows** sum.

Use the summation theorem itself as the orientation test: whichever axis sums to 1 (for the
flux row/column) and 0 (for concentration rows/columns) is the axis over reaction steps.

## Step 3 - Map reactions, enzymes, fluxes and metabolites
Write the mapping explicitly:
```
row i  = perturbation of enzyme E_i catalysing reaction v_i
col j  = observed variable: J1 / J2 / S1 / S2 ...
```
Check for the classic confusions:
- **enzyme vs metabolite**: `E2` and `S2` both index 2 - confirm which is which.
- **flux id vs reaction id**: `J1` may or may not be the flux through `v1`.
- **FCC vs CCC**: a column headed `S1` is a concentration control coefficient, not a flux one.
- **branched systems**: there is one FCC set **per flux**. A single table may hold several.
- **`getCC` second argument**: if it is not an enzyme concentration with `ε^v_p = 1`, the number
  is a **response** coefficient.
- **scaled vs unscaled**: unscaled coefficients carry units and do **not** satisfy the theorems.

## Step 4 - Check signs
Against the expectations in `references/interpretation_rules.md` Rule 3:
- FCCs positive in an unbranched chain; **negative FCCs are expected at branch points**.
- CCC positive for net-supplying steps, negative for net-consuming ones. In a linear chain, the
  single negative CCC for a species locates the step just downstream of it.
- Elasticities: substrate positive, product negative, inhibitor negative, enzyme = 1.
A sign that contradicts the topology is a **mapping error until proven otherwise**.

## Step 5 - Check magnitudes
- Linear pathway, normal signs: `0 <= C^J <= 1`. Outside that in a linear pathway -> investigate.
- Branch/cycle: `|C^J| > 1` and negatives are legitimate (Ch 7.1: 8.34, 0.99, -8.51).
- `C^J ≈ 1/n` is the linear-chain average.
- Cycle CCCs above 1 indicate ultrasensitivity; check the elasticities support it (both arms
  unsaturated makes `C^p_e1 <= 1` impossible to exceed).
- Compare magnitudes against the precision the numbers are quoted to.

## Step 6 - Rank, and respect ties
- Rank only within one flux's set, and only where differences exceed the numerical uncertainty.
- **Identify ties and near-ties and report them as ties.** The book's serine-pathway example
  under one feeding regime gives 0.46 and 0.54 and reads it as *"neither step dominates"*.
- Do not sort a table and present the order as a finding without saying how precise the numbers
  are.
- Do not compare a coefficient from one flux against one from another flux.

## Step 7 - Test the summation relationships
```
Σ over all steps of C^J   = 1     (per flux)
Σ over all steps of C^sj  = 0     (per species)
```
If the table is partial, say so: a partial table cannot be summation-checked, and any
"remaining control" claim is an inference, not a measurement. (Ch 3 Exercise 10 is exactly this
inference: four CCCs of -0.1, -0.2, -0.5, -0.05 imply the fifth is +0.85.)

## Step 8 - Inspect connectivity if there is enough information
If elasticities are also supplied:
```
Σ_i C^J_ei   ε^{vi}_{sk} = 0
Σ_i C^{sk}_ei ε^{vi}_{sk} = -1
Σ_i C^{sm}_ei ε^{vi}_{sk} = 0
```
summing over **only the reactions `sk` interacts with**. This is the check that catches missing
regulatory arrows and mapping errors. **Use the modified cycle form for conserved-cycle species.**

If elasticities are not supplied, say that connectivity could not be checked and what would be
needed.

## Step 9 - Only now, interpret
Load `references/interpretation_rules.md`. Report distribution of control, dominant vs weak
steps, metabolite responses, feedback effects, mechanism behind any unusual sign or magnitude,
and biological implications - each labelled as mathematics or as interpretation.

---

## Explicit protections

| Hazard | Protection |
|---|---|
| row/column mapping error | Step 2 orientation test via the summation theorem; never assume from shape alone |
| enzyme/metabolite confusion | Step 3 explicit mapping; watch shared indices |
| FCC/CCC confusion | Step 3; a flux column sums to 1, a species column to 0 |
| sign reversal | Step 4 against topology-derived expectations |
| sorting errors | Step 6; rank only within one flux set, only above uncertainty |
| ignoring ties | Step 6; report near-ties as ties, following the source's own reading |
| numerical noise read as biology | Steps 5-7; compare differences against quoted precision and residuals |
| partial table treated as complete | Step 7; say what cannot be checked |
| response coefficient read as control coefficient | Step 3; check what was perturbed |
| unscaled numbers fed to the theorems | Step 3; unscaled quantities carry units |
| linear-pathway bounds applied to a branch | Step 5; classify topology before judging magnitude |

## If the mapping cannot be established
Say so and ask for exactly what is missing: row/column labels, the reaction list, which species
are boundary, which flux each set refers to, whether values are scaled, and the conditions the
steady state was computed at. **Do not interpret an unmapped table.**

## Source
Chapter: 3.2, 3.5 (definitions, distribution, exercises); 4.5 (matrix layouts and the
column-sum check); 5.8 (ties); 7.1 (branch magnitudes and sign patterns);
12.3 (cycle magnitudes)
Pages: book p35, p46-50, p65-66, p87, p116-118, p227-228
(PDF 43, 54-58, 73-74, 95, 124-126, 235-236)
