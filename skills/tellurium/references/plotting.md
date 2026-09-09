# Plotting and Diagrams

## Which `plot` am I calling?

Tellurium's docs say this twice, in bold, because it is the standard confusion
`[T:tellurium_methods]`:

> When loading a model with `r = te.loada('antimony_string')` and calling
> `r.plot()`, it is the `tellurium.ExtendedRoadRunner.plot()` method that is
> called, **not** `te.plot()`.

| Call | Signature family |
|---|---|
| `r.plot(...)` | `ExtendedRoadRunner.plot` — takes a *result array* (or nothing, to use the last simulation) |
| `te.plot(x, y, ...)` | free function — takes *x and y arrays* |
| `te.plotArray(result, ...)` | free function — takes a *result array*, column 0 = x axis |

RoadRunner has its own, narrower `plot(result=None, loc='upper left',
show=True)`; its docstring points Tellurium users at
`tellurium.ExtendedRoadRunner.plot`, "which supports extra arguments"
`[L:rr/cls_RoadRunner]`.

## Plotting engine

```python
te.setDefaultPlottingEngine('matplotlib')   # or 'plotly'
te.getDefaultPlottingEngine()
te.setSavePlotsToPDF(value)
```
"Tellurium has a plotting engine which can target either Plotly (when used in a
notebook environment) or Matplotlib." `[T:tellurium_methods]`, `[T:API]`

## `r.plot`

```python
r.plot(result=None, show=True, xlabel=None, ylabel=None, title=None,
       linewidth=2, xlim=None, ylim=None, logx=False, logy=False,
       xscale='linear', yscale='linear', grid=False, ordinates=None, tag=None,
       labels=None, figsize=(6,4), savefig=None, dpi=80, alpha=1.0, **kwargs)
```
`[T:tellurium_methods]`

Behaviour, as documented `[T:tellurium_methods]`:

- with no `result`, the data from the last simulation is used;
- column 0 is the x axis, all remaining columns the y axis;
- if the result array has no names, the current `r.selections` are used for
  naming — and then `len(r.selections)` must equal the number of columns;
- curves are plotted **in order of selection** (i.e. column order);
- all `matplotlib.pyplot.plot` keywords are additionally accepted (`color`,
  `alpha`, `linewidth`, `linestyle`, `marker`, …).

Key arguments: `show=False` to overlay several simulations on one figure;
`ordinates` to restrict which selections are drawn; `tag` so traces sharing a tag
get the same colour/style; `labels='id'` to use species ids; `savefig` to write a
file and `dpi` to set its quality.

Documented example `[T:tellurium_methods]`:

```python
sbml = te.getTestModel('feedback.xml')
r = te.loadSBMLModel(sbml)
s = r.simulate(0, 100, 201)
r.plot(s, loc="upper right", linewidth=2.0, lineStyle='-', marker='o',
       markersize=2.0, alpha=0.8, title="Feedback Oscillation",
       xlabel="time", ylabel="concentration", xlim=[0,100], ylim=[-1, 4])
```

## `te.plotArray`

```python
te.plotArray(result, loc='upper right', legendOutside=False, show=True,
             resetColorCycle=True, xlabel=None, ylabel=None, title=None,
             xlim=None, ylim=None, xscale='linear', yscale='linear',
             grid=False, labels=None, **kwargs)
```
"Assumes that the first column in the array is the x-axis and the second and
subsequent columns represent curves on the y-axis." `[T:tellurium_methods]`

`loc` accepts `'best' | 'upper right' | 'upper left' | 'lower left' |
'lower right' | 'right' | 'center left' | 'center right' | 'lower center' |
'upper center' | 'center'`; `legendOutside` moves the legend out of the axes;
`labels` takes one label per curve; `resetColorCycle=False` combined with
`show=False` is what keeps colours advancing across overlaid simulations
`[T:tellurium_methods]`.

## `te.plot`

```python
te.plot(x, y, show=True, **kwargs)
```
x and y are numpy arrays with the same number of rows. Keywords: `tag`/`tags`
(traces sharing a tag get the same colour/label — useful for multiple stochastic
traces), `name`/`names`/`label`/`labels`, `alpha` (0 transparent … 1 opaque),
`show`, `showlegend`, `mode` (`'markers'` for a scatter plot, `'dash'` for dashed
lines) `[T:tellurium_methods]`.

There is also `te.plotWithLegend(r, result=None, loc='upper right', show=True)`,
whose first argument must be a roadrunner variable `[T:API]`.

## Overlaying, tags, and `te.show`

`show=False` accumulates traces; `te.show()` draws the accumulated figure
`[T:tellurium_methods]`, `[T:notebooks]`.

Tags coordinate colour, opacity and legend name across several datasets. Only one
legend entry appears per tag, and it takes the name and style of the **last**
dataset plotted with that tag `[T:tellurium_methods]`:

```python
te.plot(x, y, show=False, tag=next_tag, name=next_name)
te.show()
```

## Log axes and limits

```python
r.plot(s, logx=True, xlim=[10E-4, 10E2], title="Logarithmic x-Axis with grid",
       ylabel="concentration")
```
"The axis scale can be adapted with the `xscale` and `yscale` settings."
`[T:tellurium_methods]`

## Saving

```python
r.plot(title='My plot', xlabel='Time', ylabel='Concentration', dpi=150,
       savefig=currentDir + '\\test.png')
```
"Use `r.plot` and the `savefig` parameter. Use `dpi` to specify image quality."
The plot can be saved as a pdf instead of png `[T:tellurium_methods]`.

## Subplots

`te.plotArray` combines with matplotlib functions `[T:tellurium_methods]`:

```python
plt.gcf().set_size_inches(10, 10)
plt.subplots_adjust(wspace=0.4, hspace=0.4)
plt.suptitle('Variation in k1 value', fontsize=16)
for i in range(1, len(kValues) + 1):
    r.k1 = kValues[i - 1]
    plt.subplot(3, 3, i)
    for j in range(1, 30):
        r.reset()
        s = r.simulate(0, 10)
        te.plotArray(s, show=False, title=t, xlabel='Time',
                     ylabel='Concentration', alpha=0.7)
```

## Dropping out to matplotlib

"For those more familiar with plotting in Python, other libraries such as
`matplotlib.pylab` offer a wider range of plotting options. To use these external
libraries, extract the simulation timecourse data returned from `r.simulate`.
Data is returned in the form of a dictionary/NamedArray, so specific elements can
easily be extracted using the species name as the key." `[T:tellurium_methods]`

```python
results = r.simulate(0, 0.5, 1000)
plt.plot(results['time'], results['[Nan2]'], 'r',
         results['time'], results['[Nan1MolNan2]'], 'b')
```
"The bracket brackets `[ ]` around `Nan2` may or may not be required depending on
if the units are in terms of concentration or just a count. To check, simply
print out `results` and you can see the names of each species."
`[T:tellurium_methods]`

## Network diagrams

```python
r.draw(width=200)
```
"Draws an SBMLDiagram of the current model. To set the width of the output plot
provide the `width` argument. Species are drawn as white circles (boundary
species shaded in blue), reactions as grey squares. **Currently only the drawing
of medium-size networks is supported.**" `[T:tellurium_methods]`

Requirements `[T:notebooks]`:

- graphviz and pygraphviz must be installed
  (`<your-local-python-executable> -m pip install pygraphviz`, then restart the
  kernel);
- "due to limitations in pygraphviz, these examples can only be run in the
  Jupyter notebook, not the Tellurium notebook app";
- without graphviz the examples still run, only the diagrams are not generated.

Documented Linux install workaround for pygraphviz include/library paths is on
the notebooks page `[T:notebooks]`.

## Rules

1. Say which plotting call produced a figure; `te.plot` and `r.plot` take
   different inputs.
2. When overlaying, `show=False` on every trace and one `te.show()` at the end.
3. When passing a bare array to `r.plot`, make sure `r.selections` has the same
   length as the column count.
4. Never present an unlabelled axis as a result — pass `xlabel`/`ylabel`.
5. `r.draw()` is documented for medium-size networks only; do not promise it for
   a large model.

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/API.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/PythonAPIReference/cls_RoadRunner.html
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents")
