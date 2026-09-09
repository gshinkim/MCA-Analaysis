# Prerequisites

## Definition
Background the textbook explicitly assumes the reader already has. The book states it
keeps introductory content to a minimum to hold printing costs down, so these topics are
*assumed*, not taught.

## The list, as the source gives it

**Kinetics**
- Basic chemical kinetics: the difference between *rates of change* and *reaction rates*;
  mass-action kinetics; the equilibrium constant; the mass-action ratio; the
  disequilibrium ratio.
- Basic enzyme kinetics: irreversible and reversible Michaelis-Menten kinetics for
  single-substrate/single-product reactions; product inhibition; competitive and
  uncompetitive inhibition; cooperativity and allostery (e.g. the MWC model); the Hill equation.

**Biology**
- Metabolic pathways, the role of enzymes in them, allosteric control. Protein signaling
  networks for the more advanced topics.
- Stoichiometric networks, the stoichiometry matrix `N`, mass-balance equations, and the
  systems equation `ds/dt = N v(s(p), p)`.
- The concept of the steady state; concentrations and fluxes; boundary and floating
  species; the effect of parameter and species perturbations on the steady state.

**Mathematics**
- Elementary differential calculus, partial derivatives, differential equations, logarithms.
- For more advanced topics: matrices and vectors; matrix addition, multiplication, inversion.
- For some advanced topics: eigenvalues, eigenvectors, and de Moivre's theorem.

Recommended companion text named by the source: Sauro HM (2014) *Systems Biology:
Introduction to Pathway Modeling*, Ambrosius Publishing.

## Notation the book establishes here
Upper case (`S`) names a molecular species; lower case italic (`s`) is its concentration.
This avoids square brackets (`[S]`). Bold is used for emphasis and for new terminology.

## How to use this file (agent procedure)

When a user's confusion is really a prerequisite gap, fix the prerequisite **before**
continuing the MCA analysis. Diagnostic mapping:

| Symptom in the user's question | Prerequisite actually missing |
|---|---|
| conflates `dv/dt` with `v`, or "rate of change" with "reaction rate" | basic chemical kinetics |
| thinks a step at steady state can be "slow" while others are "fast" | steady state concept (Ch 3.2: all rates in a linear chain are equal at steady state) |
| expects product concentration not to affect a rate | reversible MM / product inhibition |
| cannot say which species are fixed | boundary vs floating species |
| cannot write `ds/dt = N v` for their own model | stoichiometric networks, `N` |
| asks why an elasticity is a *partial* derivative | partial derivatives |
| confused that elasticity is a log-log slope | logarithms |
| asks how the control matrix is "inverted" | matrix inversion |
| asks what "the eigenvalues are negative" means | eigenvalues/eigenvectors |
| asks why complex eigenvalues imply oscillation | de Moivre / Euler's formula (Ch 9 Appendix) |

State the prerequisite in one or two sentences using the book's own framing, then resume.
Do not silently paper over it: a wrong prerequisite quietly corrupts every downstream
elasticity and control coefficient.

## Common mistakes
- Assuming the reader knows what "disequilibrium ratio" means because the symbol is short.
- Treating `Km`/`Ki` and elasticities as the same kind of object. Kinetic constants are
  characteristic of the enzyme; elasticities are not constants and depend on the current
  effector concentrations (Ch 2.8).

## Related concepts
[[conceptual_foundations]], [[elasticities]], [[moiety_conservation]], [[stability]]

## Source
Chapter: front matter, "Expected Prerequisites"
Section: Kinetics / Biology / Mathematics / Notation
Pages: book p1 (PDF p9); notation also restated Ch 3.2, book p32 (PDF p40)
