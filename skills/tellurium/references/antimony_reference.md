# Antimony — full language reference

Load this when `antimony_basics.md` does not cover the construct. All content
from `antimony.html` `[T:antimony]` unless tagged otherwise.

## Substance-only species

By default a species symbol means its **concentration**. `substanceOnly` makes it
mean the **amount**:

```
substanceOnly species S1;
S1 = 2.5;        # initial AMOUNT
S1 = 3.1*C;      # concentration 3.1 in compartment C (conc x volume = amount)
```
As of the 3.1 release, `substanceOnly` species are initialised to their SBML
`initialAmount`, so as always to have substance units.

## Named stoichiometries

```
J0: n A -> B; k1*A^n
n = 3
```
The stoichiometry id can be the target of events, rate rules and assignment
rules:

```
J0: n A -> m B; k1*A^n
n := time/3
m = 1
at A < 3: m = 2
```

Reusing one id for several stoichiometries (`n A -> n B`) is legal in Antimony,
but SBML requires unique stoichiometry ids, so an assignment rule is generated:

```
J0: n A -> J0_B_stoich B; k1*A^n
J0_B_stoich := n
```
Some simulators reject assignment rules on stoichiometries — if that happens,
give each stoichiometry its own id and change them together.

## Modular models

```
model side_reaction(S, k1)          # exposed variables in parentheses
  J0: S + E -> ES; k1*k2*S*E - k2*ES;
  E = 3; ES = E+S; k2 = 0.4;
end

model full_pathway
    -> S1; k1
  S1 -> S2; k2*S1
  A: side_reaction(S1, k4)          # instantiate; members are A.E, A.ES
  B: side_reaction(S2, k5)
end
```
Submodel instances are independent: `A.E` and `B.E` are different species.
Submodules may be placed in a compartment: `M0 in comp2: submod();`

Modules are **flattened** when written to SBML, unless the `comp` (Hierarchical
Model Composition) option is used.

## Importing other files

```
import "models1.txt"
import "oscli.xml"        # SBML files may be imported too

model mod2()
  A: mod1();
  B: oscli();
end
```
Imports behave as if pasted in at that point, so bare declarations in imported
files also contribute to the default `__main` module. Relative import paths are
resolved against the working file's directory; a `.antimony` file in the working
directory can redirect import statements (tab-delimited:
`<importing file> <import text> <actual path>`, first field optional for
in-memory models).

## Constant vs variable

```
const species S1, S2, S3;
var   species S4, S5, S6;
const formula k1;
var   formula k2;
species S1, S2, S3, S4;
formula k1, k2, k3, k4;
const   S1, S4, k1, k3;
var     S2, S3, k2, k4;
```
Species are variable by default; formulas are constant by default.

## Compartment resolution order

Which compartment a symbol is in, in priority order:

1. explicit `in` declaration;
2. else the compartment of a DNA strand it is in (last declared wins on conflict);
3. else the compartment of a reaction it is a member of (last declared wins);
4. else the compartment of a submodule it is a member of (last declared wins);
5. else `default_compartment`.

Declaring `c1 in c2` does **not** move c1's contents into c2. Compartment
containment may not be circular.

## Display names, units, annotation

```
A.k1 is "reaction rate k1";              # display name
unit substance = 1e-6 mole;              # unit definition
unit micromole = 10e-6 mole / liter;     # compound units must use SBML base units
x = 40 foo/3 seconds;
z has foo;                               # attach units without a value
```
Units are annotation only — they do not affect the mathematics, and Antimony
does not derive units.

Annotations / CV terms:

```
comp  identity "http://identifiers.org/go/GO:0005737"
MgATP part     "http://identifiers.org/chebi/CHEBI:25107"
model model_entity_is "http://identifiers.org/biomodels.db/BIOMD0000000004"
A.sboTerm = 236        # or SBO:00000236
```
Full keyword set: `identity`/`biological_entity_is`, `hasPart`/`part`,
`isPartOf`/`parthood`, `isVersionOf`/`hypernym`, `hasVersion`/`version`,
`isHomologTo`/`homolog`, `isDescribedBy`/`description`, `isEncodedBy`/`encoder`,
`encodes`/`encodement`, `occursIn`/`container`, `hasProperty`/`property`.
Multi-line notes are wrapped in triple back-ticks after the `notes` keyword.

## Interactions (for visualisation / modifier lists)

```
J0: S1 + E -> ES;
i1: S2 -| J0;      # inhibition
i2: S3 -o J0;      # activation
i3: S4 -( J0;      # unknown / dual
```
If a rate law is given, the interacting species must appear in it — libAntimony
does **not** check that the sign of the effect matches. When there is no kinetic
law to parse, interactions are how species get into the SBML `listOfModifiers`.

## Predefined functions and constants

MathML subset of SBML Level 3: `abs, and, arccos, arccosh, arccot, arccoth,
arccsc, arccsch, arcsec, arcsech, arcsin, arcsinh, arctan, arctanh, ceiling, cos,
cosh, cot, coth, csc, csch, divide, eq, exp, factorial, floor, geq, gt, leq, ln,
log, lt, minus, neq, not, or, piecewise, plus, power, root, sec, sech, sin, sinh,
tan, tanh, times, xor`.

Constants: `true, false, notanumber, pi, avogadro, infinity, exponentiale`.

Distributions (Antimony v2.12+, written out via the SBML `distrib` package):
`normal, uniform, bernoulli, binomial, cauchy, chisquare, exponential, gamma,
laplace, lognormal, poisson, rayleigh` — each also in a "truncated" form taking
`min, max` as trailing arguments.

`rateOf` was added in the 2.13.1 release.

## Uncertainty information (`distrib` package)

`A.mean`, `A.stdev` / `A.standardDeviation`, `A.coefficientOfVariation`,
`A.kurtosis`, `A.median`, `A.mode`, `A.sampleSize`, `A.skewness`,
`A.standardError`, `A.variance`, `A.confidenceInterval = {x, y}`,
`A.credibleInterval`, `A.interquartileRange`, `A.range`, `A.distribution`,
`A.externalParameter`.

## Flux Balance Constraints (`fbc` package)

```
0 <= J0
-10 <= J2 <= 10
maximize J1
obj1: minimize J2
obj3: maximize J1 + 3*J2 + 4*J3^2 + 5*J4*J5
J1.gpa = G_kasB && G_kasA;
geneProduct G_kasA, G_kasB
G_kasA is "Gene-kasA"       # FBC 'label' uses the Antimony display name
G_kasA = S1                 # associated species
S2.chemicalFormula = "C10H12N5O13P3"
S1.charge = 3.2
```
Constraints that do not involve a reaction id alone become core SBML constraints
instead of FBC constraints. From Antimony v3.1 FBC constraints are emitted as
FBC **version 3** (stored as parameters), and all constraints are normalised to
`<=` / `>=`.

**FBC models cannot be simulated by roadrunner** — the Tellurium FAQ recommends
pysces for those `[L:faq]`.

## DNA strands

```
--P1--G1--stop--P2--G2--
```
Downstream elements inherit reaction rates from upstream elements. DNA strands
disappear on conversion to SBML; the effective reaction rates and assignment
rules are preserved (summed over duplicate elements).

## Layout and Render

libAntimony uses the SBMLNetwork library to import/export most constructs of the
SBML `layout` and `render` packages (added in the 3.0 release), filling in the
rest with autolayout/autorender. The FAQ notes layout and render do not affect
simulations and **cannot be manipulated directly with Antimony** `[L:faq]` —
treat the two statements as scoped differently: `antimony.html` describes
file-level import/export support, the FAQ describes direct manipulation.

## SBML ↔ Antimony conversion differences

- SBML local parameters become **global** parameters with the reaction name
  prepended; they do not become local again on the way back.
- An element with both a value and an initial assignment keeps only the initial
  assignment in Antimony.
- SBML `constant=true` **or** `boundary=true` → `const` in Antimony.
  Antimony `const` → `boundary=true, constant=false`; `var` → both false.
- Modules are flattened (unless `comp`); DNA strands disappear.
- MathML csymbol `time` ↔ `time`; csymbol `delay` disappears.
- SBML L2V1 functions using csymbol `time` gain a trailing `time_ref` argument.
- Antimony keywords found as SBML ids get an appended underscore
  (`compartment` → `compartment_`).

## Command-line / GUI translation

`QTAntimony` (GUI editor, with SBML and CellML tabs and a Flatten SBML toggle)
and the `sbtranslate` command-line tool are distributed from
antimony.sourceforge.net `[T:antimony]`, `[L:antimony-sf]`:

```bash
sbtranslate model1.txt model2.txt -o sbml
sbtranslate oscli.xml ffn.xml      -o antimony
sbtranslate model1.txt             -o sbml-comp
```
Legacy `antimony2sbml` / `sbml2antimony` still exist but are superseded.

## Which SBML packages are supported

From the Tellurium FAQ `[L:faq]`:

| Package | Status |
|---|---|
| `comp` (Hierarchical Model Composition) | models can be created and simulated |
| `distrib` (Distributions) | models can be created and simulated |
| `layout`, `render` | do not affect simulations; not directly manipulable with Antimony |
| `fbc` (Flux Balance Constraints) | creatable/manipulable in Antimony, **not simulatable** with roadrunner; pysces recommended |
| all others | not currently supported |

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/antimony.html

### Tellurium-linked external sources
- https://github.com/sys-bio/tellurium/wiki/FAQ
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "FAQ")
- http://antimony.sourceforge.net/
  - Linked from: https://tellurium.readthedocs.io/en/latest/antimony.html ("Importing and Exporting Antimony Models")
