# Parameter Scans and Sensitivity

Three documented routes, in increasing packaging: a plain Python loop, the
`ParameterScan` class, and a SED-ML repeated task.

## 1. Plain loop (the general answer)

"To study the consequences of varying a specific parameter value or initial
concentration on a simulation, iteratively adjust the given parameter over a
range of values of interest and re-run the simulation." `[T:tellurium_methods]`

```python
for Xo in np.arange(1.0, 10, 1):
    r.reset()
    r.Xo = Xo
    m = r.simulate(0, 50, 100, ['time', 'A'])
    te.plotArray(m, show=False, labels=['Xo='+str(Xo)], resetColorCycle=False)
te.show()
```
`[T:tellurium_methods]`

Merging the traces into one array instead of overlaying plots
`[T:notebooks]`:

```python
m = r.simulate(0, 4, 100, ["Time", "S1"])
for i in range(0, 4):
    r.k1 = r.k1 + 0.1
    r.reset()
    m = np.hstack([m, r.simulate(0, 4, 100, ['S1'])])
te.plotArray(m)
```

Scanning a Hill coefficient with labelled curves `[T:notebooks]`:

```python
result = r.simulate(0, 20, 201, ['time'])
h_values = [r.J0_h + k for k in range(0, 8)]
for h in h_values:
    r.reset()
    r.J0_h = h
    result = np.hstack([result, r.simulate(0, 20, 201, ['S1'])])
te.plotArray(result, labels=['h={}'.format(int(h)) for h in h_values])
```

**`r.reset()` inside the loop, parameter set outside the reset.** `reset()` does
not restore parameters, which is exactly what a scan needs
(`reset_and_state.md`).

## 2. Steady-state scan

```python
r.conservedMoietyAnalysis = True
for value in numbers:
    r.k1 = value
    r.steadyState()
    row = np.array([value, r.S2])
    result = np.vstack((result, row))
```
`[T:notebooks]` — check `steadyState()`'s residual inside the loop, not just at
the end. A scan that crosses a bifurcation will silently stop converging.

## 3. Parameter uncertainty / sensitivity sweep

The documented framing `[T:tellurium_methods]`:

> In most systems, some parameters are more sensitive to perturbations than
> others. […] To study the sensitivity of these parameters, we can sweep over a
> range of values […]. These ranges represent our uncertainty in the value of the
> parameter, and those parameters that create highly variable results in some
> measure of an output variable are deemed to be sensitive.

```python
def plot_param_uncertainty(model, startVal, name, num_sims):
    stdDev = 0.6
    vals = np.linspace((1-stdDev)*startVal, (1+stdDev)*startVal, 100)
    for val in vals:
        r.resetToOrigin()
        exec("r.%s = %f" % (name, val))
        result = r.simulate(0, 0.5, 1000, selections=['time', 'GeneOn'])
        plt.plot(result[:,0], result[:,1])

startVals = r.getGlobalParameterValues()
names = list(enumerate([x for x in r.getGlobalParameterIds() if ("K" in x or "k" in x)]))
```
`[T:tellurium_methods]`

This is a **one-at-a-time** sweep: it says nothing about interactions between
parameters. Report it as such. Note also that "sensitivity" here means spread of
an output under a ±60 % sweep, which is a different quantity from a control
coefficient (`metabolic_control_analysis.md`).

## 4. The `ParameterScan` class

"ParameterScan allows you to set these values before calling the function"
rather than passing them as simulation arguments — "especially useful for more
complicated 3D plots that often take many arguments to customize"
`[T:paramscan]`.

```python
import tellurium as te
from tellurium import ParameterScan

r = te.loada('''
    $Xo -> S1; vo;
    S1 -> S2; k1*S1 - k2*S2;
    S2 -> $X1; k3*S2;
    vo = 1; k1 = 2; k2 = 0; k3 = 3;
''')
p = ParameterScan(r)
p.startTime = 0; p.endTime = 20; p.numberOfPoints = 50
p.width = 2; p.xlabel = 'Time'; p.ylabel = 'Concentration'; p.title = 'Cell'
p.plotArray()
```
`[T:paramscan]`. Settings may also be passed to the constructor as keyword
arguments (`te.ParameterScan(r, startTime=0, endTime=15, ...)`) `[T:paramscan]`.

### Methods `[T:paramscan]`

| Method | What it does | Accepted parameters |
|---|---|---|
| `plotArray()` | runs one simulation from the stored settings and plots it | `startTime, endTime, numberOfPoints, width, color, xlabel, ylabel, title, integrator, selection` |
| `plotGraduatedArray()` | several simulations, each with a slightly higher starting value of a chosen species/parameter | `startTime, endTime, value, startValue, endValue, numberOfPoints, width, color, xlabel, ylabel, title, integrator, polyNumber` |
| `plotPolyArray()` | same runs as `plotGraduatedArray`, each drawn as a polygon in 3D | `startTime, endTime, value, startValue, endValue, numberOfPoints, color, alpha, xlabel, ylabel, title, integrator, polyNumber` |
| `plotMultiArray(param1, param1Range, param2, param2Range)` | grid of arrays, one per combination of the two ranges; the only method taking call arguments | `startTime, endTime, numberOfPoints, width, title, integrator` |
| `plotSurface()` | colour-coded 3D surface of one species against two varying factors | `startTime, endTime, numberOfPoints, startValue, endValue, independent, dependent, color, xlabel, ylabel, title, integrator, colormap, colorbar, antialias` |
| `plot2DParameterScan(p1, p1Range, p2, p2Range)` | 2D scan with multiple graphs across both ranges; also takes `start`, `end`, `points` | |
| `createColormap(color1, color2)` | colormap stretching between two colours (RGB triplet lists, colour names, or hex) | |
| `createColorPoints()` | colour list spanning a colormap; takes its count from `polyNumber` | |

### Properties `[T:paramscan]`

`alpha` (0.7), `color`, `colorbar` (True), `colormap`, `dependent`, `endTime`
(20), `endValue`, `independent` (list of two strings: time and a parameter),
`integrator` ('cvode'; 'gillespie' also available), `legend` (True),
`numberOfPoints` (50), `polyNumber` (10), `rr` (the loaded RoadRunner model —
`ParameterScan`'s only positional argument), `selection`, `sameColor` (False),
`startTime` (0), `startValue` (the model's value, else 0), `title`, `value` (the
species or parameter varied between graphs), `width` (2.5), `xlabel`, `ylabel`,
`zlabel`.

`value`, `startValue`, `endValue` and `polyNumber` together define the sweep for
`plotGraduatedArray` and `plotPolyArray`; `independent`/`dependent` define
`plotSurface` `[T:paramscan]`.

Worked example `[T:paramscan]`:

```python
p = ParameterScan(r)
p.endTime = 6; p.numberOfPoints = 100; p.polyNumber = 5
p.startValue = 1; p.endValue = 5
p.value = 'k1'; p.selection = ['S1']
p.plotGraduatedArray()

p.colormap = p.createColormap([.12,.56,1], [.86,.08,.23])
p.dependent = 'S1'; p.independent = ['time', 'k1']
p.plotSurface()
```

`plot2DParameterScan` is also importable directly `[T:paramscan]`:

```python
from tellurium.analysis.parameterscan import plot2DParameterScan
plot2DParameterScan(r, p1='Vmax', p1Range=np.linspace(1, 10, num=5),
                       p2='Km',   p2Range=np.linspace(0.1, 1.0, num=5),
                       start=0, end=50, points=101)
```

## 5. `SteadyStateScan`

"Part of ParameterScan but provides some added functionality. It allows the user
to plot graphs of the steady state values of one or more species as dependent on
the changing value of an equilibrium constant on the x-axis." Documented
limitation: "Right now, the only working method is `plotArray()`", which needs
`value`, `startValue`, `endValue`, `numberOfPoints` and `selection`
`[T:paramscan]`.

```python
p = te.SteadyStateScan(r,
    value = 'k3', startValue = 2, endValue = 3,
    numberOfPoints = 20, selection = ['S1', 'S2'])
p.plotArray()
```
`[T:paramscan]` — returns an array whose first column is the scanned value and
whose remaining columns are the selected steady-state species.

## 6. SED-ML repeated tasks

For scans that must be portable/reproducible outside Python, use a phraSED-ML
repeated task — 1D, 2D, nested, with or without reset. See
`sedml_and_omex.md`.

## Rules

1. Say which reset the loop used. A scan without a reset is a sequential
   protocol, not a scan.
2. Scans over a steady state must check the `steadyState()` residual at **every**
   point.
3. A one-at-a-time sweep does not establish parameter interactions.
4. Do not call the spread of an output under a sweep a "control coefficient".
5. Report the range and the number of points; a 5-point scan and a 200-point scan
   support different claims.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/paramscan.html
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html
