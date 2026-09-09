# Antimony — the model-building layer

Antimony is Tellurium's human-readable representation of SBML and "the main
method of building models in Tellurium" `[T:antimony]`. Everything here is
`antimony.html` unless tagged otherwise.

## The minimum viable model

A reaction is: reactant list `->` product list `;` optional rate law `;`

```
S1 -> S2; k1*S1
S1 = 10
S2 = 0
k1 = 0.1
```
That is a complete, simulatable model `[T:antimony]`.

Optional model wrapper (required once you use submodules):

```
model example1
  S1 -> S2; k1*S1
  S1 = 10
  k1 = 0.1
end
```

**Order never matters.** You may use a symbol before defining it. Antimony is a
*pure model definition language*: statements define a static model, they are not
executed sequentially. Re-assigning a symbol does not create a second value — the
last definition wins everywhere, including in formulas written earlier
`[T:antimony]`.

## Reactions

```
    -> S1;                 k0          # production / synthesis
S1 -> S2;                 k1*S1
S1 + S2 -> S3;            k2*S1*S2
2 S1 -> S2;               k3*S1*S1     # stoichiometry as a leading number
S1 + 2 S2 -> 3 S3 + 5 S4; k4*S1*S2*S2
S4 -> ; k5*S4                          # degradation
```
`[T:antimony]`

- Name a reaction with a leading label: `J0: S1 + E -> ES; ...`
- The rate may be set separately: `J0: S1 + E -> ES;` then `J0 = k1*S1*E;`
- `=>` declares the reaction irreversible. The supplied rate law is **not**
  checked for compatibility with irreversibility.
- Everything appearing in the reaction arrow expression is required to be a
  species. Symbols elsewhere that are never used as species are "formulas"
  (constants and packaged equations).

## Species, parameters, compartments

Default typing: any named element is an SBML **parameter**; if it is used in a
reaction it becomes a **species**; if something is `in` it, it becomes a
**compartment** `[T:antimony]`.

Declare explicitly when the default would be wrong:

```
p = 3
species s = 4
compartment c = 5
species S1 = 1.3     # needed when a species only changes via a rate rule
S1' = 0.4
```

Compartments:

```
compartment cytoplasm = 1.5, mitochondria = 2.6
const S1 in mitochondria
var   S2 in cytoplasm
S1 -> S2; k1*S1*mitochondria
```
**Reaction rates must be in units of amount/time.** Species are concentrations
by default, so multiply by the compartment volume to make the units work out
`[T:antimony]`. With no compartment declared, everything is in
`default_compartment` with constant volume 1 `[T:antimony]`.

## Boundary (fixed) species — two equivalent syntaxes

```
$S1 -> S2; k1*S1        # dollar prefix
```
```
const S1, S4            # const keyword
S1 -> S2; k1*S1
```
Both declare boundary species: "species which are unaffected by the model.
Usually this means they are fixed" `[T:antimony]`. `var` is the explicit opposite.
`species S1, $S2, $S3, S4, S5, $S6;` mixes them in one declaration.

Note the round-trip asymmetry: boundary (`const`) species in Antimony become
`boundary=true, constant=false` in SBML; SBML species that are *either*
`constant=true` *or* `boundary=true` come back as `const` in Antimony
`[T:antimony]`.

## Assignments, rules, and time

| Construct | Syntax | Meaning |
|---|---|---|
| Initial value / initial assignment | `k1 = 2.3 + A` | value at simulation start |
| Assignment rule | `Ptot := P1 + P2 + PE` | recomputed continuously |
| Rate rule | `S1' = V1*(1-S1)/(K1+1-S1)` | defines dS1/dt; needs an initial value |
| Algebraic rule | `0 = (25*S1 - 13*S2)/3` | always-true equation |

`[T:antimony]`

- `time` is the keyword for simulation time: `k1 := sin(time)`.
- Each symbol may have **at most one** assignment rule and at most one rate
  rule; if more are written, only the last is saved `[T:antimony]`.
- Rate-rule formulas may be self-referential; initialisations and assignment
  rules may not `[T:antimony]`.
- A species used as the target of an assignment rule is thereby made a boundary
  species (`const`) `[T:antimony]`.
- **Algebraic rules are not supported by roadrunner** — Antimony can still
  translate them to and from SBML `[T:antimony]`. libRoadRunner's own feature
  list likewise excludes algebraic rules and delay differential equations
  `[L:rr/index]`.

### piecewise

```
k1 := piecewise(0.1, time > 50, 20)
k1 := piecewise(5, time > 20, 8, S2 < 100, 15)
```
Reads "value if condition, … , else final value"; extendable to any number of
condition pairs `[T:antimony]`.

## Events

```
at (x>5): y=3, x=r+2
E1: at (S2>9): S2=0, S1=10
```
An event fires at the moment the boolean trigger transitions false → true
`[T:antimony]`.

Modifiers (SBML Level 3 features; they are lost on downgrade to Level 2)
`[T:antimony]`:

| Modifier | Syntax | Default |
|---|---|---|
| delay | `E1: at 2 after (x>5): ...` (delay may be a formula) | none |
| values used | `fromTrigger=false` → use values at execution time | `fromTrigger=true` |
| ordering | `priority=1` (higher executes first) | undefined order |
| trigger true at t=0 | `t0=false` → may fire immediately | `t0=true` (no event at time 0) |
| must stay true | `persistent=false` | `persistent=true` |

## Functions

```
function quadratic(x, a, b, c)
  a*x^2 + b*x + c
end

model quad1
  S3 := quadratic(s1, k1, k2, k3);
  s1 = 5; k1=0.3; k2=42; k3=10
end
```
User functions must be a single equation and behave like macro expansions
`[T:antimony]`.

## Comments

`#` and `//` for single line, `/* ... */` for multi-line. Reaction and model
**names** survive into SBML; comments do not `[T:antimony]`.

## Building signals from rules + events

Documented recipes, all of the shape "an event sets a switch parameter, an
assignment rule uses it" `[T:antimony]`:

```
# step at t=20 of magnitude f
alpha = 0; f = 2
Xo := alpha*f
at time > 20:
    alpha = 1
```
```
# ramp from t=20            |  # ramp then hold from t=40
p1 = 0                      |  p1 = 0; p2 = 0
Xo := p1*(time - 20)        |  Xo := p1*(time - 20) - p2*(time - 40)
at time > 20: p1 = 1        |  at time > 20: p1 = 1
                            |  at time > 40: p2 = 1
```
```
# pulse on at 20, off at 40 |  # sinusoid switched on at t=20
p1 = 0; p2 = 1              |  p1 = 0
Xo := p1*p2                 |  Xo := p1*(sin(time) + 1)
at time > 20: p1 = 1        |  at time > 20: p1 = 1
at time > 40: p2 = 0        |
```

An alternative documented pattern injects the waveform directly and uses events
only to switch it: `Xo := sin(time*0.5)*switch + 2` `[T:notebooks]`.

## Writing ODEs directly (no reactions)

```
x' = sigma*(y - x);
y' = x*(rho - z) - y;
z' = x*y - beta*z;
x = 0.96259;  y = 2.07272;  z = 18.65888;
sigma = 10;  rho = 28; beta = 2.67;
```
`[T:notebooks]` — the documented way to express a pure ODE system (Lorenz).

## Rules

1. Never invent Antimony syntax. If it is not in this file or
   `antimony_reference.md`, say the documentation does not establish it.
2. When a species must not change, make the choice explicit (`$S` or `const S`)
   rather than relying on the rate law.
3. When compartment volume is not 1, check the amount/time units of every rate law.
4. Do not write algebraic rules into a model that is going to be simulated.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/antimony.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/ (feature list: SBML support excludes algebraic rules and delay differential equations)
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html
