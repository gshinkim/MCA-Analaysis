# Modeling with Python

*Source: `appendixI.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Modeling with Python <a id="app-tellurium"></a>

This appendix provides a brief description of the Python programming language, the Antimony reaction network format, and libRoadRunner.

- **Python** Python is an easy to learn general, purpose interactive programming language. It has similar usability characteristics to Matlab or Basic. As such it is a good language to use for doing pathway simulations and is easily learned by new users. In recent years Python has also become widely used as a general purpose scientific programming language and now supports many useful libraries and tools for modelers. All the scripts we provide in this book are written in Python.

- **Antimony** SBML has become a de facto standard for exchanging models of biological pathways. Any tool we use should support SBML. However SBML is a computer readable language and is not easy for humans to read or write. Instead more human readable formats have been developed. This text book uses the Antimony pathway description language [smith2009antimony]. Models can be described in Antimony then converted to SBML and vice versa.

- **libRoadRunner** To support SBML from within Python, we developed a C/C++ simulation library called libRoadRunner [SaurolibRoadRunner2015] that can read and run models based on SBML. In order to use libRoadRunner within Python, we also provide a Python interface that makes it easy to carry out simulations with Python.

- **Spyder** Integration of the various tools including Python is achieved using spyder2 (<https://code.google.com/p/spyderlib/>). Spyder2 offers a Matlab like experience in a friendly, cross-platform environment.

## Introduction to Python

One great advantage of the Python language is that it runs on many computer platforms including Windows Mac and Linux. Python can be freely downloadable from the Python web site (<python.org>. To execute Python code we will need use a Python IDE (Integrated Development Environment). In the Python world there are many IDEs to choose from, ranging from very simple consoles to sophisticated development systems that include documentation, debuggers and other visual aids. In this book we use the spyder2 cross-platform IDE. (<https://code.google.com/p/spyderlib/>).

To make things even easier we have packaged up everything you need into a distribution we call Tellurium. The version does not interfere with any existing Python you might have installed.

The best way to learn Python is to download a copy and start using it. We have prepared installers that install all the components you need. These can be found at <tellurium.analogmachine.org>. The Tellurium distribution includes some additional helper routines which can make life easier for new users. To get your copy of Tellurium go to the web site <tellurium.analogmachine.org>, and click on the link called *Downloads*. For windows, download and run the Windows installer. For the Mac and Linux versions there are additional instructions that include downloading Anaconda and installing Tellurium via `pip install tellurium`. Refer to the web site <tellurium.analogmachine.org> for detailed instructions.

One Windows, once Tellurium is installed, go to the start menu, find Tellurium and select the application call Tellurium spyder. If successful you should see something like the screen shot in Figure [Figure: Screen-shot of Tellurium, showing editor on the left, Python console b](#fig-tellurium1), but without the plotting window. The screen-shot shows three important elements, on the left we see an editor: where models can be edited. On the lower right is the Python console, where Python commands can be entered. At the top right we show plotting window that illustrates some output from a simulation. For those familiar with IPython, the latest version of spyder2 supports the IPython console directly.

**Figure** <a id="fig-tellurium1"></a> `fig:Tellurium1`

*Graphic (not in the LaTeX source, referenced by name): `Tellurium1`*

*Caption:* Screen-shot of Tellurium, showing editor on the left, Python console bottom right and plotting window top-right.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale=0.4]{Tellurium1}
  \caption{Screen-shot of Tellurium, showing editor on the left, Python console bottom right and plotting window top-right.}
  \label{fig:Tellurium1}
\end{figure}
```

Start the Tellurium IDE, and focus on the Python console at the bottom right of the application. A screen-shot of the console is shown in Figure [Figure: Screen-shot of Tellurium, focusing on the Python console](#fig-tellurium2).

**Figure** <a id="fig-tellurium2"></a> `fig:Tellurium2`

*Graphic (not in the LaTeX source, referenced by name): `Tellurium2`*

*Caption:* Screen-shot of Tellurium, focusing on the Python console.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale=0.5]{Tellurium2}
  \caption{Screen-shot of Tellurium, focusing on the Python console.}
  \label{fig:Tellurium2}
\end{figure}
```

The \verb|>>>| symbol marks the place where you can type commands. The following examples are based on Python 2.7. To add two numbers, say 2 + 5, we would type the following:

```python
>>> print 2 + 5
7
>>>
```

Just like Matlab or Basic we can assign values to variables and use those variables in other calculations:

```python
>>> a = 2
>>> b = 5
>>> c = a + b
>>> print c
7
>>>
```

The types of values we can assign to variables include integers, floating point numbers, Booleans (True or False), strings and complex numbers.

```python
>>> a = 2
>>> b = 3.1415
>>> c = False
>>> d = "Hello Python"
>>> e = 3 + 6j
>>>
```

Many functions in Python are accessible via modules. For example to compute the sine of a number we can't simply type `sin (30)`. Instead we must first load the math module. We can then call the sin function:

```python
>>> import math
>>> print sin (3.1415)
9.265358966049026e-05
>>>
```

In Tellurium, we preload some libraries including the math library.

### Repeating Calculations

One of the commonest operations in computer programming is iteration. We can illustrate this with a simple example that loops ten times, each time printing out the loop index. This example will allow us to introduce the IDE editor. The editor is the panel on the left side of the IDE. In the editor we can type Python code, for example we could type:

```python
a = 4.0
b = 8.0
c = a/b
print "The answer is:", c
```

When we've finished typing this in the editor window, we can save our little program to a file (Select Menu: File/Save As...) and run the program by clicking on the green arrow in the tool bar of the IDE (Figure [Figure: Screen-shot of Tellurium, focusing on the Toolbar with the run button](#fig-tellurium5)). If we run this program we will see:

```python
The answer is: 0.5
>>>
```

**Figure** <a id="fig-tellurium5"></a> `fig:Tellurium5`

*Graphic (not in the LaTeX source, referenced by name): `Tellurium5`*

*Caption:* Screen-shot of Tellurium, focusing on the Toolbar with the run button circled.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale=0.6]{Tellurium5}
  \caption{Screen-shot of Tellurium, focusing on the Toolbar with the run button circled.}
  \label{fig:Tellurium5}
\end{figure}
```

The IDE allows a user to have many program files open at once, each program file is given its own tab so that it is easy to move from one to another. This is useful if one is working on multiple models at the same time.

We will now use the editor to write the simple program that loops ten times, shown in Figure `lang:forLoop`:

```python
for i in range (10):
    print i,
```

This will generate the sequence:

```python
0 1 2 3 4 5 6 7 8 9
```

There are a number of new concepts introduced in this small looping program. The first line contains the `for` keyword, can be translated into literal English as "for all elements in a list, do this". The list is generated from the `range()` function and in this case generates a list of 10 numbers starting at 0. `i` is the loop index and within the loop, `i` can be used in other calculations. In this case, we will just print the value of `i` to the console. Each time the program loops it extracts the next value from the list and assigns it to `i`.

Two things are important to note in the print line. The first and most important is that the line has been indented four spaces. This isn't just for aesthetic reasons but is functional. It tells Python what code should be executed *within* the loop. To elaborate we could add more lines to the loop, such as:

```python
for i in range (10):
    a = i
    b = a*2
    print b,
print "Finished Loop"
```

In the example shown in Figure `lang:Indents` has three indented lines. The indents means that these three lines will be executed within the loop. The last line which prints a message, is not indented and therefore will not be executed within the loop. This means we only see the message appear once, right at the end. The output for this little program is shown below.

```python
0 2 4 6 8 10 12 14 16 18 Finished Loop
```

Another important point worth noting is the use of the `,` after the loop print statement. The comma is used to suppress a newline. This is why the output appears on one line only. If we had left out the comma, each print statement would be on its own line.

A final word about `range()`. Range takes up to three arguments. In the example we only gave one argument, 10. A single argument means: create a list starting at zero, incrementing one for each item until the incremented value reaches 10. A second argument such as `range (5, 10)` means start the list at 5 rather than zero. Finally, a third argument can be used to specify the increment size. For example the command `range (1, 10, 2)` yields the list:

```python
[1, 3, 5, 7, 9]
```

The easiest way to try out the various options in range is to type them at the console to get immediate feedback.

The use of variables, printing results, importing libraries and looping are probably the minimum concepts one needs to start using Python. However there are a huge range of resources online to help learn Python. Of particular interest is the codecademy web site (<http://www.codecademy.com/>). This site offers an interactive means to learn Python and other programming languages.

## Describing Reaction Networks using Antimony

The code shown in the panel below illustrates the description of a very simple model using the Antimony syntax [smith2009antimony] followed by two lines of Python that uses libRoadRunner to run a simulation of the model. This section briefly describes Antimony syntax. A more detailed description of Antimony can be found at  <http://antimony.sourceforge.net/index.html>.

```python
import tellurium as te

r = te.loada ('''
  S1 -> S2; k1*S1;
  S1 = 10; k1 = 0.1
''')

r.simulate (0, 50, 100)
r.plot()
```

The main purpose of Antimony is to make it simple to specify complex reaction networks using a
familiar chemical-reaction notation.

A chemical reaction can be an enzyme catalyzed reaction, a binding reaction, a phosphorylation, a gene expressing a protein or any
chemical process that results in the conversion of one of more species (reactants) to a set of one or more
other species (products). In Antimony, reactions are described using the notation:

`A + ... -> P + ...`

where the reactants are on the left side and products on the right side. The left and right
are separated by the \verb|->| symbol. For example:

`A -> B`

describes the conversion of reactant `A` into product `B`. In this case one molecule of `A` is converted to one
molecule of `B`. The following example shows non-unity stoichiometry:

`2 A -> 3 B`

which means that two molecules of `A` react to form three molecules of `B`. Bimolecular and other combinations
can be specified using the `+` symbol, that is:

`2 A + B -> C + 3 D`

tells us that two molecules of `A` combine with one molecule of `B` to form one molecule of `C`
and three molecules of `D`.

To specify species that do not change in time (boundary species), add a dollar character in front
of the name, for example:

`$A + B -> C`

means that during a simulation, the concentration of `A` is fixed.

Reactions can be named using the syntax `J1:`. For example:

`J1: A + B -> C`

means the reaction has a name, `J1`. Named reaction are useful if you want to refer to the flux of the reaction;
kinetic rate laws come immediately after the reaction specification. If only the stoichiometry matrix is required,
it is not necessary to enter a full kinetic law, a simple {\tt ... \verb|->|
S1; v;} is sufficient. Here is an example of a reaction that is governed by a Michaelis-Menten rate law:

`A -> B; Vm*A/(Km + A); `

Note the semicolons. Here is a more complex example involving multiple reactions:

```python
    MainFeed:    $X0 -> S1;  Vm*X0/(Km + X0);
    TopBranch:    S1 -> $X1; Vm1*S1/(Km1 + S1);
    BottomBranch: S1 -> $X2; Vm2*S1/(Km2 + S1);
```

There is no need to pre-declare the species names shown in the
reactions or the parameters in the kinetic rate laws. Strictly speaking,
declaring the names of the floating species is optional. However, this
feature is for more advanced users who wish to define the order of rows
that will appear in the stoichiometry matrix. Normal use need not pre-declare the species names. To pre-declare parameters and variables see the
example below:

```python
    const Xo, X1, X2; // Boundary species
    var S1;         // Floating species

    MainFeed:    $X0 -> S1;  Vm*X0/(Km + X0);
    TopBranch:    S1 -> $X1; Vm1*S1/(Km1 + S1);
    BottomBranch: S1 -> $X2; Vm2*S1/(Km2 + S1);
```

We can load an Antimony model into libRoadRunner using the short-cut command `loada`. For example:

```python
r = te.loada ('''
    const Xo, X1, X2; // Boundary species
    var S1;         // Floating species

    MainFeed:    $X0 -> S1;  Vm*X0/(Km + X0);
    TopBranch:    S1 -> $X1; Vm1*S1/(Km1 + S1);
    BottomBranch: S1 -> $X2; Vm2*S1/(Km2 + S1);
''')
```

To reference model properties and methods, the property or method must be preceded with the roadrunner variable. e.g. `r.S1 = 2.3;`

When loaded into libRoadRunner the model will be converted into a set of differential equations. For example, the model:

```python
    $Xo -> S1;  v1;
     S1 -> S2;  v2;
     S2 -> $X1; v3;
```

will be converted into:

$$
\begin{align*}
\frac{dS_1}{dt} &= v_1 - v_2 \\[6pt]
\frac{dS_2}{dt} &= v_2 - v_1 \\
\end{align*}
$$

Note that there are no differential equations for $X_o$ and $X_1$, because they are fixed and do not change in time. If the reactions have non-unity stoichiometry, this is taken into account when the differential equations are derived.

### Initialization of Model Values

To initialize the concentrations and parameters in a model, we can add assignments after the network is declared, for example:

```python
    MainFeed:    $X0 -> S1;  Vm*X0/(Km + X0);
    TopBranch:    S1 -> $X1; Vm1*S1/(Km1 + S1);
    BottomBranch: S1 -> $X2; Vm2*S1/(Km2 + S1);

    X0 = 3.4;  X1 = 0.0;
    S1 = 0.1;
    Vm = 12; p.Km = 0.1;
    Vm1 = 14; p.Km1 = 0.4;
    Vm2 = 16; p.Km2 = 3.4;
```

## Using libRoadRunner in Python

libRoadRunner is a high-performance simulator [SaurolibRoadRunner2015] that can simulate models described using SBML. In order to use Antimony with libRoadRunner it is necessary to first convert an Antimony description into SBML and then load the SBML into libRoadRunner. Telluirum provides a handy routine called `loadAntimonyModel` to help with this task (The short-cut name is loada). To load an Antimony model we first assign an Antimony description to a string variable, for example:

```python
 model = '''
    S1 -> S2; k1*S1;

    S1 = 10; k1 = 0.1;
 '''
```

We now use the `loadAntimonyModel (model)` or `loada` to load the model into libRoadRunner.

```python
>>> r = te.loadAntimonyModel (model)
```

In this book we generally use the short-cut command as follows:

```python
r = te.loada ('''
    S1 -> S2; k1*S1;

    S1 = 10; k1 = 0.1;
 ''')
>>>
```

Note that `loadAntimonyModel` and `loada` are part of the Tellurium Python package supplied with the Tellurium installer. If the Tellurium packages hasn't been loaded, use the following command to load the Tellurium package:

```python
>>> import tellurium as te
```

### Time Course Simulation

Once a model has been loaded into libRoadRunner, performing a simulation is straight forward. To simulate a model, we use the libRoadRunner simulate method. This method has many options but for everyday use, four options will suffice. The following panel illustrates a number examples of how to use simulate.

```python
>>> result = r.simulate ()
>>> result = r.simulate (0, 10)
>>> result = r.simulate (0, 10, 100)
>>> result = r.simulate (0, 10, 100, ['time', 'S1'])
```

```latex
\begin{tabular}{ll} \toprule
Argument & Description \\ \midrule
1st & Start Time \\
2nd & End Time \\
3rd & Number of Points \\
4th & Selection List \\ \bottomrule
\end{tabular}
```

Let us focus on the forth version of the simulate method that takes four arguments. This call will run a time-course simulation starting at time zero, ending at time 10 units, and
generating 100 points. The results of the run are deposited in the matrix variable, `result`. At the end of the run, the `result` matrix will contain columns corresponding to the time column and all the species concentrations as specified by the forth argument. The forth argument can be used to change the columns that are returned from the simulate method. For example:

```python
>>> result = r.simulate (0, 10, 1000, ['S1'])}
```

will return a matrix 1,000 rows deep and one column wide that corresponds to the level of species `S1`.

Note that the special variable `Time` is available and represents the independent variable `time' in the model.

Finally we plot the results.

{

```python
   result = r.simulate (0, 10, 1000, ['Time', 'S1', 'J1', 'J2', 'J3']);
   r.plot()
```

or if we are not interested in the result data itself we can use the libRoadRunner plot:

It is possible to set the output column selections separately using the command:

```python
r.selections = ['time', 'S1']
```

This can save some typing each time a simulation needs to be carried out. By default the selection is set to time as the first column followed by all molecular species concentrations. As such it is more common to simply enter the command:

```python
>>> result = r.simulate (0, 10, 50)
```

In fact, even the start time and end time and number of points are optional and if missing, simulate will revert to its defaults.

```python
>>> result = r.simulate()
```

### Plotting Simulation Results

Tellurium comes with Matplotlib, which is a common plotting package used by many Python users. To simplify its use we provide two simple plotting calls:

```python
te.plot (array)
te.plotWithLegend (rr, array)
```

The first takes the array generated by a call to `simulate` and uses the first column as the $x$ axis and all subsequent columns as $y$ axis data. The second call takes the roadrunner variable as well as the array and does the same kind of plot but this time adds a legend to the plot. We will use the first plotting command in the next section where we merge multiple simulations together.

### Applying Perturbations to a Simulation

Often in a simulation, we may wish to perturb a species or parameter at some point during the simulation and observe what happens. One way to do this in Tellurium is to carry out two separate simulations where a perturbation is made in between the two simulations. For example, let's say we wish to perturb the species concentration for a simple two step pathway and watch the perturbation decay. First, we simulate the model for 10 time units; this gives us a transient and then a steady state.

```python
import numpy # Required for vstack
import tellurium as te

r = te.loada ('''
     $Xo -> S1;  k1*Xo;
      S1 -> $X1; k2*S1;

     Xo = 10; k1 = 0.3; k2 = 0.15;
''')

m1 = r.simulate (0, 40, 50)
```

We then make a perturbation in `S1` as follows:

```python
r.S1 = r.S1 * 1.6
```

which increases `S1` by 60%. We next carry out a second simulation:

```python
m2 = r.simulate (40, 80, 50)
```

Note that we set the time start of the second simulation to the end time of the first simulation. Once we have the two simulations we can combine the matrices from both simulations using the Python command `vstack`

```python
% Merge the two result array together
m = numpy.vstack ((m1, m2))
```

Finally, we plot the results, screen-shot shown in Figure [Figure: Screen-shot from Matplotlib showing effect of perturbation in S1](#fig-tellurium3).

```python
te.plotArray (m)
```

**Figure** <a id="fig-tellurium3"></a> `fig:Tellurium3`

*Graphic (not in the LaTeX source, referenced by name): `Tellurium3`*

*Caption:* Screen-shot from Matplotlib showing effect of perturbation in S1.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale=0.4]{Tellurium3}
  \caption{Screen-shot from Matplotlib showing effect of perturbation in S1.}
  \label{fig:Tellurium3}
\end{figure}
```

### Steady State and Metabolic Control

To evaluate the steady-state first make sure the model values have been
previously initialized, then enter the following statement at the console.

```python
>>> r.getSteadyState()
```

This statement will attempt to compute the steady state and return a value indicating how effective the
computation was. It returns the norm of the rate of change vector (i.e. $\sqrt{\sum (dydt^2)}$). The closer this is to zero, the
better the approximation to the steady state. Anything less that $10^{-4}$ usually indicates that a steady state has been found.

Once a steady state has been evaluated, the values of the
metabolites will be at their steady state values, thus `S1`
will equal the steady state concentration of `S1`.

The fluxes through the individual reactions can be obtained by
either referencing the name of the reaction (e.g. `J1`), or via
the short-cut command `rv`. The advantage to looking at the reaction rate vector is that the
individual reaction fluxes can be accessed by indexing the vector
(see example below). **Note that indexing is from zero.**

```python
>>> print r.J1, r.J2, r.J3
3.4, ...
>>> for i in range (0, 2):
...    print r.rv()[i]
3.4
etc
->
```

The following commands are used to compute the various coefficients defined in metabolic control analysis [kacser1995control, IngallsBook2013]. To compute control coefficients use the statement:

`getCC (Dependent Measure, Independent parameter)`

The dependent measure is an expression usually containing flux and
metabolite references, for example, `S1, J1`. The
independent parameter must be a simple parameter such as a Vmax,
Km, ki, boundary metabolite (X0), or a conservation total such as
`cm_xxxx`. Examples include:

{

```python
  r.getCC ('J1', 'Vmax1')
  r.getCC ('J1', 'Vm1') + rr.getCC ('J1', 'Vm2')
  r.getCC ('J1', 'X0')
  r.getCC ('J1', 'cm_xxxx')
```

To compute elasticity coefficients use the statement:

`getEE (Reaction Name, Parameter Name)`

For example:

```python
  r.getEE ('J1', 'X0')
  r.getEE ('J1', 'S1')
```

Since `getCC` and `getEE` are built-in functions, they can be used alone or as part of
larger expressions. Thus, it is easy to show that the response coefficient is
the product of a control coefficient and the adjacent elasticity by using:

{

```python
  R = r.getCC ('J1', 'X0')
  print R - r.getCC ('J1', 'Vm') * r.getEE ('J1', 'X0')
```

To obtain the conservation matrix for a model use the model method, `getConservation\-Matrix`. Note that in the Antimony text we use the `var` word to predeclare the species so that we can set up the rows of the stoichiometry matrix in a certain order if we wish.  This allows us to obtain conservation matrices with only positive terms.

{

```python
import tellurium as te

r = te.loada ('''
   var ES, S1, S2, E;

  J1: E + S1 -> ES; v;
  J2: ES -> E + S2; v;
  J3: S2 -> S1; v;
''')

print r.getConservationMatrix()
print r.fs()

# Output
[[ 1.  1.  1.  0.]
 [ 1.  0.  0.  1.]]
['ES', 'S1', 'S2', 'E']
```

The result given above indicates that the conservation relations, `ES + S1 + E` and `E + ES` exist in the model. As a
result, Tellurium would generate two internal parameters of the form `cm` corresponding to the two relations.

### Other Model Properties of Interest

There are a number of predefined objects associated with a reaction network model which might also be of interest. For example, the stoichiometry matrix, `sm`, the rate vector `rv`, the species levels vector and `dv` which returns the rates of change.

```python
   print r.sm()
   print r.rv()
   print r.sv()
   print r.dv()
```

The names for the parameters and variables in a model can be obtained using the short-cuts:

```python
   print r.fs()  # List of floating species names
   print r.bv()  # List of boundary species names
   print r.ps()  # List of parameter names
   print r.rs()  # List of reaction names
   print r.vs()  $ List of compartment names
```

The Jacobian matrix can be returned using the command: `r.getFullJacobian()`).

## Generating SBML and Matlab Files <a id="tellurium-matlab-sbml"></a>

Tellurium can import and export standard SBML [hucka:2003d] as well as export Matlab scripts for the current model. To load a model in SBML, load it directly into libRoadRunner. For example:

```python
>>> r = roadrunner.RoadRunner ('mymodel.xml')
>>> result = r.simulate (0, 10, 100)
```

There are two ways to retrieve the SBML, one can either retrieve the original SBML loaded using `r.getSBML()` or retrieve the *current* SBML using `r.getCurrentSBML()`. Retrieving the current SBML can be useful if the model has been changed. To save the SBML to a file we can use the Tellurium helper function  `saveToFile ()`, for example:

```python
>>> te.saveToFile ('mySBMLModel.xml', r.getCurrentSBML())
```

To convert an SBML file into Matlab, use the `getMatlab` method:

```python
import tellurium as te

r = te.loada ('''
    S1 -> S2; k1*S1;
    S2 -> S3; k2*S2;
    S1 = 10; k1 = 0.1; k2 = 0.2;
''')

# Save the SBML
te.saveToFile ('model.xml', r.getSBML())

# Save the Matlab
te.saveToFile ('model.mat', r.getMatlab())
```

## Exercise

Figure [Figure: Two-gene circuit with feedfoward loop](#fig-perfectadaptation) shows a two-gene circuit with a feedforward loop. Assume the following rate laws for the four reactions:

$$
\begin{align*}
v_1 &= k_1 X_o \\[4pt]
v_2 &= k_2 x_1 \\[4pt]
v_3 &= k_3 X_o \\[4pt]
v_4 &= k_4 x_1 x_2
\end{align*}
$$

Assume that all rate constants are equal to one and that $X_o = 1$. Assume $X_o$ is a fixed species.

**Figure** <a id="fig-perfectadaptation"></a> `fig:PerfectAdaptation`

*Graphic (not in the LaTeX source, referenced by name): `PerfectAdaptation`*

*Caption:* Two-gene circuit with feedfoward loop.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale=0.6]{PerfectAdaptation}
  \caption{Two-gene circuit with feedfoward loop.}
  \label{fig:PerfectAdaptation}
\end{figure}
```

1. Use Tellurium to model this system.

2. Run a simulation of the system from 0 to 10 time units.

3. Next, change the value of $X_o$ to 2 (double it) and rerun the simulation for another 10 time units from where you left off in the last simulation. Combine both simulations and plot the result, that is time on the x-axis, and $X_o$ and $x_2$ on the y-axis.

4. What do you see?

5. Write out the differential equations for $x_1$ and $x_2$.

6. Show algebraically that the steady state level of $x_2$ is independent of $X_o$.

---

← [[appendix_h_modeling_standards_and_databases|Modeling Standards and Databases]] · [[index|Wiki index]] · [[draft_branched_and_cyclic_systems|Branched and Cyclic Systems (unpublished draft)]] →
