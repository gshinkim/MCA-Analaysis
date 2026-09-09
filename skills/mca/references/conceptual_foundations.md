# Conceptual Foundations

## Definition
What "control" means in this book, where the modern framework came from, and what it
replaced. This is the framing every other reference file assumes.

## What the book means by control

> The amount of control (i.e. influence) that a particular reaction step has on a flux or
> species concentration is called the control coefficient.

The system is considered **at steady state**, so control refers to influence over the
steady state: over fluxes and over species concentrations. Influence from *external*
factors (nutrients, hormones, drugs, boundary species) is called a **response**, measured
by response coefficients, not control coefficients. (Ch 3.1, book p31-32.)

The word is used in the everyday sense of "influence over", not in the engineering-control
sense of designing a controller - although Ch 8 does make the engineering connection explicit.

## The two-level structure of MCA

1. **Elasticities** describe how individual reactions respond to their reactants,
   products, effectors and enzyme. Local. (Ch 2.)
2. **Control coefficients** describe how much influence individual reactions have on the
   response of the whole pathway. Global. (Ch 3.)
3. Ch 4 bridges them: *"we seek to understand phenotype from genotype."*

Elasticities are called "the building blocks with which we can begin to understand the
properties of intact pathways" (Ch 2.1, book p10).

## Historical background: the rate-limiting step doctrine

- Blackman (1905) axiom: *"when a process is conditioned as to its rapidity by a number of
  separate factors, the rate of the process is limited by the pace of the slowest factor."*
  This produced the ideas of the rate-limiting step, the pacemaker, the bottleneck, the
  master reaction.
- Opposition began early: Burton ("In the steady state of reaction chains, the principle of
  the master reaction has no application"), Hearon, Webb, Waley (rate-limitingness is a
  *shared commodity*), Higgins, and Heinrich & Rapoport.
- Sewall Wright's work on dominance was taken up by **Kacser and Burns** (Edinburgh) into a
  theory of control in pathways. **Heinrich and Rapoport** (Berlin) reached the same result
  from a biochemical angle; **Savageau** (USA), an engineer, reached similar conclusions.
- Despite this, the biochemical community built an intuitive framework "derived largely
  through an intuitive approach using faulty analogies, and based neither on experimental
  evidence or mathematical reasoning."

(Ch 1.1-1.3, book p3-5.)

## The traditional criteria for "the rate-limiting step" - and why they fail

The book lists the criteria that were used, noting there is no definitive test:
- it is the slowest step;
- it has the lowest substrate affinity (highest `Km`);
- it is the regulated step;
- it is an irreversible reaction;
- it is usually the first step;
- it is far from equilibrium.

Plus the **cross-over theorem**: perturb with an inhibitor, and if metabolites upstream of
the inhibited step rise while those downstream fall, that step is called rate limiting.
Developed by Britton Chance in the 1950s for the electron transport chain. Its subsequent
use to identify sites of regulation in metabolic pathways "has been considered on
theoretical grounds to be untrustworthy" (Heinrich et al, 1974).

The book's diagnosis of the underlying error: the confusion *"stems from a failure to
realize that rates in cellular networks are governed by the law of mass-action. That is, if
a concentration changes, then so does its rate of reaction."* Traffic-jam and
checkout-queue analogies fail precisely because those systems are **not** governed by
mass action - there the flow does not depend on how many cars or customers are waiting.
(Ch 3.5, book p49.)

Concrete counter-example the book returns to repeatedly: phosphofructokinase is heavily
regulated and repeatedly measured to have a small flux control coefficient (Ch 1.3 book p5;
Ch 8.4 book p139). See [[negative_feedback]].

## What replaces it

- Control (rate-limitingness) is **shared** and **distributed**.
- It is a **system property**: "they can only be computed or measured in an intact system.
  Inspection of a single enzymatic step will not reveal its degree of control."
- It is **dynamic**: because total flux control sums to one, an effect that raises one
  enzyme's control forces others to fall. The distribution shifts as pathway conditions shift.
- Better practice: *"assign a value to the rate-limitingness of a particular step in a
  pathway rather than designate a given reaction step as either rate-limiting or not."*

(Ch 3.5, book p46-49.)

## Operational proofs
Ch 3.5 introduces the book's characteristic method: carry out a **thought experiment** on
the system, write the experiment in algebraic form using local equations plus system
equations, and derive the theorem. The preface states this operational style was chosen
over purely algebraic proofs because it is "much more illuminating and biologically
insightful." When deriving anything in this Skill, prefer that style - it exposes the
assumptions.

## Relationship to Biochemical Systems Theory (BST / S-systems)
Savageau's BST overlaps heavily with MCA and yields identical results for the same system.
Term correspondence (Ch 4.6 Table 4.1, book p72):

| MCA | BST |
|---|---|
| control coefficient `C^s_e1` | logarithmic gain `∂log(s)/∂log(α)` |
| control coefficient `C^s_e2` | logarithmic gain `∂log(s)/∂log(β)` |
| response coefficient `R^s_xo` | logarithmic gain `∂log(s)/∂log(xo)` |
| elasticity `ε^1_s` | kinetic order `g2` |
| elasticity `ε^2_s` | kinetic order `h` |
| elasticity `ε^1_xo` | kinetic order `g1` |

Differences the book draws: BST aggregates all production terms into one power law and all
consumption into another, which loses information about the relative magnitudes of the
aggregated rates but makes an analytical steady-state solution possible. BST gets stability
"for free" from the S-system solution, while MCA must compute the Jacobian separately. MCA
emphasises theorems that BST rarely mentions, and handles branches and moiety-conserved
cycles more comfortably. (Ch 4.6, book p69-71.)

## Common mistakes
- Treating "control" and "regulation" as synonyms. Ch 8.4 separates them: an enzyme can be
  an ineffective *flux controller* (small `C^J_e`) yet an effective *regulator* (large loop
  gain). Both are systemic properties.
- Reading the summation theorem as a claim that no step ever has high control. It only says
  the total is one; a step *can* have a coefficient near 1, and in branches coefficients can
  exceed 1 or go negative.

## Related concepts
[[control_coefficients]], [[elasticities]], [[common_failure_modes]], [[negative_feedback]],
[[source_map]]

## Source
Chapter: 1 (Traditional Concepts in Metabolic Regulation); 3.1, 3.5; 4.6
Section: 1.1-1.4; 3.1 What do we mean by Control?; 3.5 Rate-limiting steps; 4.6 Relationship to S-Systems
Pages: book p3-6 (PDF 11-14); book p31-32 (PDF 39-40); book p46-49 (PDF 54-57); book p69-72 (PDF 77-80)
