# Structural / Stoichiometric Analysis

## The setup

"A network of *m* chemical species and *n* reactions can be described by the
*m* × *n* stoichiometry matrix **N**. N_ij is the net number of species *i*
produced or consumed in reaction *j*." The dynamics are `dS/dt = N v(S,p,t)`
`[L:rr/stoichiometric]`.

**Each structural conservation** — equivalently, conserved sum, e.g. a conserved
moiety — **corresponds to a linearly dependent row of N** `[L:rr/stoichiometric]`.

If there are conserved sums, the row rank *r* of N is less than *m*. N is
reordered so the first *r* rows are linearly independent; the reduced
stoichiometry matrix **Nr** is formed from those first *r* rows, and N factorises
as the product of the **link matrix L** and Nr. L has the form `[I; L0]`, with I
the *r* × *r* identity and L0 an (m−r) × r matrix `[L:rr/stoichiometric]`.

## Full vs reduced vs extended

- **Full**: includes conserved quantities `[L:rr/stoichiometric]`.
- **Reduced**: does not — it is the matrix of the independent species
  `[L:rr/stoichiometric]`, `[L:rr/cls_RoadRunner]`.
- **Extended**: the full matrix plus rows for boundary species and
  sources/sinks `[L:rr/stoichiometric]`.

Documented extended-matrix example, showing the generated `_source` / `_sink`
rows `[L:rr/stoichiometric]`:

```
>>> rr.getExtendedStoichiometryMatrix()
                     reaction1, reaction2, reaction3, reaction4, ...
 C                [[         1,        -1,        -1,         0, ...
 ...
 reaction1_source  [        -1,         0,         0,         0, ...
 reaction2_sink    [         0,         1,         0,         0, ...
```

## Calls

| Call | Returns |
|---|---|
| `r.getFullStoichiometryMatrix()` | the full model's stoichiometry matrix, even if the model was converted via conservation conversion `[L:rr/cls_RoadRunner]` |
| `r.getReducedStoichiometryMatrix()` | independent-species matrix when conservation conversion is enabled; **a synonym for `getNrMatrix()`** `[L:rr/cls_RoadRunner]` |
| `r.getNrMatrix()` | reduced stoichiometry matrix Nr, r rows, reordered so its rows are independent `[L:rr/cls_RoadRunner]` |
| `r.getExtendedStoichiometryMatrix()` | full + boundary species + source/sink rows `[L:rr/stoichiometric]` |
| `r.getLinkMatrix()` | full link matrix L, m × r `[L:rr/cls_RoadRunner]` |
| `r.getL0Matrix()` | L0, (m−r) × r, "expresses the dependent reaction rates in terms of the independent rates" `[L:rr/cls_RoadRunner]` |
| `r.getConservationMatrix()` | conservation matrix: (number of conservation laws) × (number of species) `[L:rr/cls_RoadRunner]` |
| `r.getKMatrix()` | K matrix, the right nullspace of Nr `[L:rr/cls_RoadRunner]` |
| `r.sm()` | jarnac shortcut for `getFullStoichiometryMatrix()` `[T:tellurium_methods]` |

Conserved moieties on the model object `[L:rr/stoichiometric]`,
`[T:tellurium_methods]`:

```python
r.getNumConservedMoieties()          # int
r.getConservedMoietyIds()
r.getConservedMoietyValues()
r.setConservedMoietyValues(values)
r.getNumDepFloatingSpecies()         # dependent floating species  [T:tellurium_methods]
r.getNumIndFloatingSpecies()         # independent floating species
```

`r.getConservedMoietyValues()` is documented in Tellurium as returning "a vector
of conserved moiety volumes. The order of values is given by the order of Ids
returned by `getConservedMoietyIds()`" `[T:tellurium_methods]` — note the wording
says *volumes*; the ordering guarantee is the operative part.

## Getting the matrices labelled

The printed output labels rows and columns with species and reaction ids
`[T:notebooks]`:

```python
r = te.loada('''
 J1: -> S1; v1;
 J2: S1 -> S2; v2;
 J3: S2 -> ; v3;
 J4: S3 -> S1; v4;
 J5: S3 -> S2; v5;
 J6: -> S3; v6;
 v1=1; v2=1; v3=1; v4=1; v5=1; v6=1;
''')
print(r.getFullStoichiometryMatrix())
```
```
      J1, J2, J3, J4, J5, J6
S1 [[  1, -1,  0,  1,  0,  0],
S2  [  0,  1, -1,  0,  1,  0],
S3  [  0,  0,  0, -1, -1,  1]]
```

Do not rely on the print formatting when indexing programmatically — pair the
matrix with `r.getFloatingSpeciesIds()` and `r.getReactionIds()`.

## Turning conservation analysis on and off

```python
r.conservedMoietyAnalysis = True            # per-instance   [L:rr/cls_RoadRunner]
```
```python
from roadrunner import Config
Config.setValue(Config.LOADSBMLOPTIONS_CONSERVED_MOIETIES, False)   # load-time  [T:notebooks]
```
Enabling replaces all linearly dependent species with assignment rules and
introduces conserved moiety parameters `[L:rr/cls_RoadRunner]`. Default is False
`[L:rr/cls_Config]`.

Consequences to remember: `getReducedStoichiometryMatrix`,
`getReducedJacobian` and `getReducedEigenValues` are the objects that become
meaningful when it is on `[L:rr/cls_RoadRunner]`, and `steadyState()` on a model
with conserved cycles generally needs it `[L:rr/steady_state]`.

## Matrix helpers Tellurium adds

```python
te.rank(A, atol=1e-13, rtol=0)      # rank via SVD                 [T:tellurium_methods]
te.nullspace(A, atol=1e-13, rtol=0) # approximate nullspace basis via SVD
te.rref(A)                          # (reduced row echelon form, pivot column indices)
te.getEigenvalues(m)                # eigenvalues of a matrix, via numpy eig
```
`te.rank` and `te.nullspace` are documented as based on the singular value
decomposition of A, with A at most 2-D `[T:tellurium_methods]`.

## Rules

1. Say which matrix you used — full, reduced, or extended. They have different
   row counts and different meanings.
2. Never read a matrix element without the id lists.
3. A linearly dependent row of N **is** a conservation law — do not describe them
   as separate discoveries.
4. Do not report a reduced matrix, reduced Jacobian, or reduced eigenvalues
   without saying that conservation analysis was enabled.
5. Rank computed by `te.rank` is a numerical rank with tolerances — report the
   tolerances if the answer is near-degenerate.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/stoichiometric.html
- https://libroadrunner.readthedocs.io/en/latest/steady_state.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_ExecutableModel.html
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_Config.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
