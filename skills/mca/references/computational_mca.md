# Computational MCA

## Definition
The procedure for obtaining MCA quantities from a kinetic model by simulation. The point is
the **procedure**, not the code. Every API call listed here is one that actually appears in
the book; nothing else is asserted to exist.

## The pipeline

```
MODEL          define species, boundary species, reactions, rate laws, parameters
   |
LOAD           parse into a simulation runtime
   |
VERIFY MODEL   check topology, boundary species, conservation laws, rate-law forms
   |
STEADY STATE   solve for it; confirm it converged and is the intended one
   |
LOCAL          compute elasticities at that steady state
   |
GLOBAL         compute flux and concentration control coefficients
   |
VALIDATE       summation, connectivity, branch/cycle theorems, signs, magnitudes
   |
INTERPRET      distribution of control, dominant vs weak steps, biology, assumptions
```

## Stage by stage

### MODEL
Antimony strings passed to `te.loada(...)`. Conventions visible throughout the book:
- `$Xo` marks a **boundary (fixed)** species; unprefixed species float.
  Also written declaratively: `var S;` / `ext Xo, w;`
- Reaction syntax: `J1: $Xo -> S1; <rate expression>;` then parameter assignments.
- Enzyme concentrations appear as explicit multiplicative parameters (`E1*(k1*Xo - k2*S1)`,
  `e1/Km1*(Xo-S1/Keq1)/(...)`) precisely so that `ε^v_e = 1` and control coefficients can be
  taken w.r.t. `E1`.
- Rate-law forms used in the book's examples: reversible mass action `k1*S1 - k2*S2`;
  reversible MM `Vm1/Km1*(Xo-S/Keq)/(1+Xo/Km1+S/Km2)`; irreversible MM `Vm*S/(Km+S)`;
  Hill `Vm*S^4/(Km+S^4)`; feedback via a Hill-like denominator `VM1*(X0-S1/Keq1)/(1+X0+S1+pow(S4,h))`.
- Events: `at ((time > 10) && (flag > 1)): Xo = 1.5;`

### LOAD
```python
import tellurium as te
r = te.loada('''  ...antimony...  ''')
```

### VERIFY MODEL
- Enable conservation analysis if there are cycles: `r.conservedMoietyAnalysis = True`
- Inspect the conservation laws: `r.getConservationMatrix()`
- Inspect the link matrix: `r.getLinkMatrix()`
- Conserved totals are exposed as `r._CSUM0`, `r._CSUM1`, ... (Ch 12.A listing 12.1 prints
  them and also **assigns** to `r._CSUM0` to scan the total).
- Confirm which species are boundary and which float; confirm each rate law has the enzyme as
  a linear factor if you intend to take coefficients w.r.t. enzyme concentration.

### ESTABLISH THE STEADY STATE
```python
r.steadyState()                # solve
r.getSteadyStateValues()       # solve and return values
```
Both forms appear in the book. Notes the book makes:
- The solver **can** find unstable steady states "providing the initial starting point is
  close enough" (Ch 9.4: setting `S1 = 0.43` locates the unstable middle state at 0.683).
- A time-course simulation can **never** land on an unstable steady state.
- Reaching steady state before analysis matters: Ch 6 listings run `r.simulate(0, 80, 500)`
  or `r.simulate(0,100,100)` first to settle the system, then re-simulate for the plot.

### LOCAL PROPERTIES - elasticities
```python
r.getEE("J2", "S1")            # elasticity of reaction J2 w.r.t. species S1
r.getEE("J1", "Xo")            # w.r.t. a boundary species
```
First argument: the reaction. Second: the species. Purpose: obtain the local sensitivities
needed for connectivity checks and for the control equations.

### GLOBAL PROPERTIES - control coefficients
```python
r.getCC("J1", "e1")            # flux control coefficient of flux J1 w.r.t. parameter e1
r.getCC("S1", "E2")            # concentration control coefficient of S1 w.r.t. E2
r.getCC("J2", "Vm1")           # w.r.t. a Vmax parameter (Ch 7 appendix)
r.getCC("XI", "Xo")            # w.r.t. a boundary species - i.e. a response coefficient
```
> *"The command getCC() is used to compute the control coefficient. The first argument is the
> variable we wish to observe ... The second argument is the parameter we wish to perturb."*
> (Ch 3.5, book p46.)

**Purpose of each argument matters for interpretation**: if the second argument is not an
enzyme concentration with `ε^v_p = 1`, what you get is `R^J_p = C^J_v ε^v_p`, not `C^J_e`.
Convert before applying the summation theorem.

### Alternative: estimate by perturbation
Ch 4 Exercise 5 instructs exactly this - *"Use perturbations to estimate the flux control
coefficients"* and then *"confirm numerically that the flux summation theorem holds"*. The
manual recipe follows the operational definition: perturb `Ei` by a small amount, re-solve
the steady state, take the ratio of fractional changes, **restore `Ei`**, move on. Prefer a
symmetric (three-point) perturbation for the same reason as for elasticities (Ch 2.2).

### STABILITY / dynamics
```python
r.getEigenvalues()             # eigenvalues of the Jacobian at the current state
r.simulate(t0, t1, npoints, ['time','J0','S1'])   # selections list optional
r.plot();  te.plotArray(m)
r.reset()
```
Book output example: `[[-0.3  0. ]]` for a one-variable model, read as a single negative
eigenvalue -> stable.

### BIFURCATION
Via the `rrplugins` AUTO2000 plugin (Ch 9.4 listing 9.7):
```python
from rrplugins import *
auto = Plugin("tel_auto2000")
auto.setProperty("SBML", r.getSBML())
auto.setProperty("NMX", 5000)
auto.setProperty("ScanDirection", "Negative")
auto.setProperty("PrincipalContinuationParameter", 'k3')
auto.setProperty("PCPLowerBound", 0.34)
auto.setProperty("PCPUpperBound", 1.4)
auto.execute()
pts = auto.BifurcationPoints; lbls = auto.BifurcationLabels
biData = auto.BifurcationData
biData.plotBifurcationDiagram(pts, lbls)
```
The book also names the external tools **SBW Auto C#** and **Oscill8** (both read SBML), and
shows the workflow of exporting SBML with `r.getSBML()` / `te.saveToFile('dual.xml', r.getSBML())`
and passing it to them.

### Scanning a parameter (the standard book idiom)
```python
x = []; y = []
for i in range(200):
    r.steadyState()
    x.append(r.k11); y.append(r.S3)
    r.k11 = r.k11 + 0.04
```
Model quantities are read and written as plain attributes: `r.E2 = r.E2*4`, `r.Xo`, `r.S1`,
`r.J1`, `r._CSUM0`.

## Verified API surface (everything the book actually uses)

| Call | What the book uses it for |
|---|---|
| `te.loada(antimony_string)` | build the model |
| `r.simulate(t0, t1, n[, selections])` | time course |
| `r.reset()` | restore initial conditions |
| `r.steadyState()` | solve for steady state |
| `r.getSteadyStateValues()` | solve and return |
| `r.getCC(variable, parameter)` | control / response coefficients |
| `r.getEE(reaction, species)` | elasticities |
| `r.getEigenvalues()` | stability |
| `r.conservedMoietyAnalysis = True` | enable conservation handling |
| `r.getConservationMatrix()` | the conservation laws |
| `r.getLinkMatrix()` | link matrix `L` |
| `r._CSUM0`, `r._CSUM1` | conserved totals (read and write) |
| `r.getSBML()`, `te.saveToFile(f, sbml)` | export for AUTO/Oscill8 |
| `r.plot()`, `te.plotArray(m)` | plotting |
| attribute access `r.<species/param/flux>` | read/write model quantities |

**Do not invent other calls.** If a required operation is not on this list, say so:
*"the source does not show a call for this; verify against current Tellurium/roadrunner
documentation before using it."* (The book also uses `r.dv()` in two Ch 6 listings without
explaining it; treat its meaning as unverified.)

## Linear-algebra side (conservation analysis)
The book gives explicit, verified recipes in Scilab/Matlab/Python-sympy for computing
conservation laws by row reduction, SVD and QR. Those belong to [[moiety_conservation]];
the Tellurium shortcut is `r.conservedMoietyAnalysis = True` + `r.getConservationMatrix()`.

## VALIDATE (always)
```
Σ_i C^J_ei = 1  per flux
Σ_i C^sj_ei = 0  per species
Σ_i C^J_ei ε^i_sk = 0        per species (interacting reactions only)
Σ_i C^sk_ei ε^i_sk = -1      per species
Σ_i C^sm_ei ε^i_sk = 0       m ≠ k
branch-point theorems for branch points; modified cycle theorems for conserved cycles
```
Full protocol: [[validation_rules]]. **Tolerance is not given by the source** - it depends on
solver convergence, floating-point precision and (for finite-difference estimates) step size.

## Common mistakes
- Calling `getCC`/`getEE` before `steadyState()`, or after a parameter change without
  re-solving.
- Perturbing one parameter and forgetting to restore it before the next.
- Using `getCC` with a non-enzyme parameter and then applying the enzyme summation theorem.
- Not enabling `conservedMoietyAnalysis` on a model with cycles, then hitting a singular
  Jacobian (Ch 11.7 explains exactly why this happens).
- Reading a steady state that the solver reached from a different basin (bistable systems -
  Ch 9.4: the initial condition selects which of the stable states you land on).
- Treating simulated control coefficients as measurements. Ch 5.7: models must be validated;
  globally fitted parameter sets "failed to generalize".

## Related concepts
[[control_coefficients]], [[elasticities]], [[validation_rules]], [[moiety_conservation]],
[[stability]], [[experimental_mca]]

## Source
Chapter: 3.5-3.6, 4.A, 6.7, 7 Appendix, 9, 11.4, 11.7, 12.A
Section: Tellurium listings 3.1-3.3, 4.1, 6.1-6.2, 7.1, 9.1-9.7, Fig 11.12, Fig 11.14, 12.1-12.3
Pages: book p46 & p51-52 (PDF 54, 59-60); p73-74 (PDF 81-82); p110-112 (PDF 118-120);
p123-124 (PDF 131-132); p149-174 (PDF 157-182); p203 & p208 (PDF 211, 216); p250-252 (PDF 258-260)
