# Experimental MCA

## Definition
How control coefficients and elasticities are actually measured. All approaches revolve
around perturbing the concentration or activity of an enzyme (or an external factor) and
observing the steady-state response. The book lists six general approaches (Table 5.1):

1. Use of classical genetics to manipulate gene expression
2. Titration of enzymes with specific inhibitors
3. Double modulation method
4. in vitro reconstitution and enzyme titration
5. Gene engineering to change enzyme levels in vivo
6. Computer modeling (*"not really an experimental method"*)

## 1. Classical genetics
Change gene copy number and assume activity/concentration is proportional to copy number.
- *Neurospora crassa* arginine biosynthesis (the Kacser lab). Multinucleate mycelia and
  polyploid spores let wild-type and mutant spores be mixed in ratios. Four enzymes
  (acetyl-ornithine aminotransferase, ornithine transcarbamoylase, arginine succinate
  synthetase, arginine-succinate lyase) had flux control in the range **0.02 to 0.2** - none
  exerted significant control over arginine synthesis.
- *Drosophila melanogaster* alcohol dehydrogenase: three alleles of differing maximal
  activity were combined; ADH was concluded to have a flux control coefficient of **zero**.

**Origin story worth carrying**: a mutation costing 95% of an amino-acid biosynthesis enzyme's
activity barely affected phenotype. The answer was not in the enzyme but in "the enzyme's
cellular context. That is, the network within which the enzyme operated."

## 2. Genetic engineering / expression control
Inducible or repressor operator sites, RNA antisense, CRISPR, dCas9+gRNA, promoter consensus
changes.
- **Rubisco** in tobacco, by RNA antisense: flux control **0.69-0.83** under high
  illumination but **0.05-0.2** at moderate illumination or high CO2. Two lessons the book
  draws: *control is not fixed but depends on external conditions*, and *rate-limitingness
  cannot be determined by inspection - it must be actively measured*.
- **Citrate synthase** in *E. coli* under a tac promoter with IPTG (Walsh & Koshland). Flux
  measured by radiolabel incorporation. Straight-line fit `y = 87.49x + 87.49`; wild type at
  0.675 units/mg. Converting slope to a control coefficient (multiply by enzyme activity,
  divide by flux) gives `C^J_e = 0.65` at the wild-type point - **not** completely rate
  limiting, so control must reside elsewhere too.

  The book then models good practice in scepticism: the computed FCC *decreases* as enzyme
  activity decreases, the opposite of the usual expectation. Three candidate explanations
  are offered - (i) the data could be wrong; (ii) the straight-line fit is inappropriate (the
  true response is probably hyperbolic, and the fit does not pass through zero flux at zero
  enzyme); (iii) unrecorded changes to other enzymes transfer control. Conclusion:
  *"there isn't enough data to make any firm conclusion"*. **Copy this discipline.**

## 3. Titration by inhibitors
Titrate an inhibitor, measure the steady-state response, extrapolate back to zero inhibitor.
Each inhibitor type must be treated differently. Widely used on oxidative phosphorylation
because of the inhibitor repertoire (cyanide/cytochrome c oxidase; rotenone/NADH-CoQ
oxidoreductase; antimycin/CoA-cytochrome c oxidoreductase; malate/dicarboxylate transporter).

Starting point (eq 5.1), from `R^J_x = C^J_e ε^v_x`:
```
(dJ/dx)(x/J) = C^J_e (∂v/∂x)(x/v)
C^J_e = [ (dJ/dx)(1/J) ] / [ (∂v/∂x)(1/v) ]
```
Both terms are evaluated at `x = 0`, since the coefficient wanted is the uninhibited one.
`(dJ/dx)/J` comes from the **initial slope** of the inhibition curve; the denominator comes
from the inhibitor's kinetics.

| Inhibitor type | Rate law | `ε^v_i` | Working formula for `C^J_e` |
|---|---|---|---|
| non-competitive | `Vm s/((Km+s)(1+i/Ki))` | `-i/(Ki+i)` | `C^J_e = -(Ki/J)(dJ/dx)` |
| competitive (irreversible) | `Vm s/(s + Km(1+i/Ki))` | `-(i/Ki)/(1+s/Km)` | `C^J_e = -(Ki/J)(1 + s/Km)(dJ/di)` |
| competitive (reversible case) | - | - | `C^J_e = -(Ki/J)(1 + s/Ks + p/Kp)(dJ/di)` |
| **irreversible** | one inhibitor molecule fully inactivates one enzyme, so `xmax = e` | - | `C^J_e = -(xmax/J)(dJ/dx)`  (eq 5.2) |

Worked example (Ex 5.1, irreversible inhibitor, simulated data with noise): fit a straight
line through the **first four** low-inhibitor points, slope `-0.553`; `J(0) = 1.5`;
`Imax = 0.94`. Then `C^J_e = 0.553 · 0.94 / 1.5 = 0.35`, against a true model value of 0.367.

> Practical rule from the source: *"The key to obtaining a reasonable estimate is to secure
> sufficient points at low inhibitor concentration in order to compute a best line fit
> through the first few points. Attempts to fit polynomials, logistic curves, or hyperbolic
> curves will likely yield poor estimates."*

## 4. Double modulation (Kacser & Burns, 1979) - measuring **elasticities** in vivo
For a reaction `v3` flanked by `S2` and `S3`, perform **two independent perturbations**
(e.g. one upstream at `Xo`, one downstream at `X4` - or any two perturbations from different
sources; enzyme changes and inhibitors are equally valid). Each gives a local equation:
```
δJ*/J*  = ε^3_2 (δs2*/s2*) + ε^3_3 (δs3*/s3*)          (perturbation 1)      (5.3)
δJ#/J#  = ε^3_2 (δs2#/s2#) + ε^3_3 (δs3#/s3#)          (perturbation 2)
```
Two equations, two unknown elasticities. Solve. In principle, measuring all metabolite
changes across the pathway yields all elasticities; the control coefficients then follow from
the Ch 4 methods.

Worked example (Ex 5.2). Reference `J = 1.5`, `s1 = 0.74`, `s2 = 0.92`. Perturbation 1
(input pool +30%): `J = 1.6`, `s1 = 0.91`, `s2 = 1.15`. Perturbation 2 (downstream
inhibitor): `J = 1.28`, `s1 = 0.905`, `s2 = 1.32`. Equations:
```
0.066 = 0.23 ε^2_1 + 0.25 ε^2_2
-0.14 = -0.23 ε^2_1 + 0.43 ε^2_2
```
giving `ε^2_1 = 1.531`, `ε^2_2 = -1.144` against true values `1.69` and `-1.3`.

**Why the discrepancy** - and this is the lesson: values were rounded to two decimals, and
more importantly *"relatively large perturbations were made. The double modulation method
depends on making small enough changes such that the relationship described by equation (5.3)
remains true."* Better practice: multiple perturbations of different strengths, plot the
responses, extrapolate back to the zero axis. The method is difficult to execute experimentally.
Generalised by Acerenza & Cornish-Bowden; experimental application by Giersch.

## 5. Reconstituted systems
Purified enzymes in a controlled vessel. The book's examples: partial reconstitution of
glycolysis by East German groups in the late 1970s-80s (pyruvate kinase, adenylate kinase,
phosphofructokinase, fructose 1,6-bisphosphatase, glucose-6-phosphatase) in a continuously
fed stirred tank reactor, used to study bistability and sustained oscillations; Torres et al.
applied MCA to a six-enzyme rat liver extract, titrating with additional enzyme to calculate
FCCs; Panke's group combined a reconstituted glycolysis with **online mass spectrometry** for
real-time measurement of fourteen metabolites plus enzyme titration. The book calls this
"probably the most exciting potential" among experimental approaches.

## 6. By computer simulation
Build a kinetic model, let the computer perform the perturbations. Historical: Heinrich and
colleagues' red blood cell models. The key modern lesson:

- **Impediments** were data availability and, more significantly, **lack of validation**.
- **Iterative validated modelling** (Smallbone, Mendes et al., yeast glycolysis): build an
  initial literature-based model -> compute control coefficients -> take the steps with the
  **largest flux control** and re-measure their kinetics experimentally **under physiological
  conditions** -> update the model -> repeat until all enzymes are characterised. Same
  approach applied by Penkler, Snoep et al. to *Plasmodium falciparum* glycolysis.
- **The single most important modelling lesson**: measure enzyme kinetic properties under
  physiological conditions. Global fitting of all parameters simultaneously produced models
  that fitted the training data but failed to generalise beyond it.

## 7. By calculation - the serine pathway (Fell & Snell)
Rabbit liver serine biosynthesis, branching off glycolysis at 3-phosphoglycerate:
```
3-phosphoglycerate -> 3-phosphohydroxypyruvate -> 3-phosphoserine -> serine
```
Assumptions the authors had to make - **note them, they are the model of good practice**:
- serine pathway flux is small relative to glycolysis, so 3-phosphoglycerate is unaffected;
- cofactor couples (NAD/NADH, glutamate/2-oxoglutarate) are held constant by other processes;
- 3-phosphohydroxypyruvate is too low to measure, so the first two steps are **merged into a
  single grouped step**, yielding one FCC for the group and one for the last step.

Elasticity of the grouped step w.r.t. 3-phosphoserine: high maximal activities justified
assuming low saturation, so the near-linear forms `ε^v_s = 1/(1-ρ)`, `ε^v_p = -ρ/(1-ρ)`
(eq 2.9) apply. `Γ` came from literature concentrations; the joint `Keq` from the product of
the two individual equilibrium constants. Result: **-1.43**.

Elasticity of 3-phosphoserine phosphatase w.r.t. 3-phosphoserine: kinetic fitting showed
uncompetitive inhibition by serine, rate law
```
v = Vm·PSer·a/(PSer + Km·a),   a = (1 + Ser/K1)/(1 + Ser/K2)
Km = 0.089 mM, K1 = 16.5 µM, K2 = 0.6 mM
```
giving **0.041** - low because of strong serine inhibition.

Combining the summation and connectivity theorems:
```
C^J_{1,2} = 0.03        C^J_3 = 0.97                                (5.4)
```
The committed step is **not** the rate-determining step here. Under a glucose/ethanol feed
regime the coefficients become **0.46 and 0.54** - neither dominates, and the first two steps
are then *closer to equilibrium* yet carry 0.46 of the control. The book's conclusion:
**it is possible for near-equilibrium steps to acquire significant flux control.**

## Agent procedure for experimental questions
1. Identify which quantity the experiment yields: an FCC, a CCC, or an elasticity.
2. Identify the perturbation and confirm it is a genuine parameter change.
3. Check the perturbation is small enough for the linear relations to hold - if not, say so
   and quantify the likely error the way Ex 5.2 does.
4. For inhibitor titration, use the formula matching the **inhibition mechanism**, and use the
   initial slope at zero inhibitor.
5. Check for unrecorded compensating changes in other enzymes (the citrate synthase caution).
6. State the conditions - control is condition-dependent (Rubisco).
7. Validate with the summation theorem if a full set was measured.

## Common mistakes
- Assuming a linear flux-vs-activity plot means constant, high control. Walsh & Koshland's
  original paper concluded citrate synthase was "rate-controlling" without computing the
  extent of control; a closer look "suggests the opposite".
- Using large perturbations in double modulation.
- Fitting a polynomial or hyperbola to inhibitor titration data instead of a local straight
  line at low inhibitor.
- Reporting a control coefficient without its physiological condition.
- Treating a computed-from-simulation coefficient as an experimental measurement.

## Related concepts
[[control_coefficients]], [[response_coefficients]], [[elasticities]], [[computational_mca]],
[[common_failure_modes]], [[validation_rules]]

## Source
Chapter: 5 (Experimental Methods)
Section: 5.1 Introduction; 5.2 Using Classical Genetics; 5.3 Genetic Engineering;
5.4 Titration by Inhibitors; 5.5 Double Modulation Technique; 5.6 Reconstituted Systems;
5.7 By Computer Simulation; 5.8 By Calculation - Serine Pathway
Pages: book p75-87 (PDF 83-95)
