# How Systems Behave

*Source: `chapter7.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# How Systems Behave <a id="chap-systemstheory"></a>

## System Behavior

How do systems behave and how does that behavior come about? As we proceed through the book we will encounter many different types of system behavior. At this stage however, it is worth describing the states that are fundamental to all systems. These states fall into three groups: **(Thermodynamic) equilibrium**, **steady state**, and **transients**. In the literature the terms equilibrium and steady state are often used interchangeably, but here they will describe two very different states.

The simplest and arguably the least interesting state is equilibrium, or more precisely, thermodynamic equilibrium.

## Equilibrium

Thermodynamic equilibrium, or simply equilibrium, refers to the state of a system when all forces are balanced. In chemistry, thermodynamic equilibrium is when all forward and reverse rates are equal. This also means that the concentration of chemical species are unchanging and all net fluxes are zero. Equilibrium is easily achieved in a closed system. For example, consider the simple chemical isomerization:

$$
\begin{align}
\text{A} \stackrel[k_2]{k_1}{\rightleftharpoons} \text{B}
\label{reaction:simpleEquilibriumSystem}
\end{align}
$$

Let the net forward rate of the reaction, $v$, be equal to $v = k_1 A - k_2 B$. The rates of change of A and B are given by:

$$ \frac{d\!A}{\dt} = -v \qquad \frac{d\!B}{\dt} = v $$

The equilibrium constant for this system is:

$$ K_{eq} = \frac{B_{eq}}{A_{eq}} = \frac{k_1}{k_2} $$

At equilibrium, $d\!A/\dt$ and $d\!B/\dt$ equal zero, that is $A k_1 = B k_2$, or $v = 0$. We can derive the analytical solution for A and B as follows. Given that the system is closed, we know that the total mass in the system, $A + B$, is constant. This constant is given by the sum of the initial concentrations of A and B which we define as $A_o + B_o$. Note that $A_o + B_o = A(t) + B(t)$ is always true. We assume the volume is constant and set to unit volume, allowing us to state that the sum of concentrations is conserved. The differential equation for A is given by:

$$ \frac{d\!A}{\dt} = k_2 B - k_1 A $$

Before solving this equation, let us replace B by the term $A_o + B_o - A$. This yields:

$$  \frac{d\!A}{\dt} = k_2 A_o + k_2 B_o - k_2 A - k_1 A = k_2 (A_o + B_o) - A (k_1 + k_2) $$

The easiest way to solve this equation is to use Mathematica or Maxima. The Mathematica command is {\tt DSolve[{A'[t] == k2 (Ao + Bo) - A[t] (k1 + k2), A[0] == Ao}, A[t], t]}, where `A[0] == Ao` sets the initial condition for the concentration of A to be $A_o$. By implication, the initial condition for $B_o$ is $(A_o + B_o) - A_o = B_o$. The result of applying the Mathematica command yields the following solution:

$$ A(t) = \frac{(A_o + B_o) k_2}{k_1 + k_2} + \frac{e^{-(k_1 + k_2)t} v_{initial}}{k_1 + k_2} $$

The first term on the right-hand side of the equation is independent of time and equals the equilibrium concentration of A. This term is also a function of the total mass in the system ($A_o + B_o$), which means that the equilibrium solution is *independent* of the starting concentrations so long as the total remains the same. Starting conditions such as $A_o = 1; B_o = 9$ or $A_o = 6; B_o = 4$ will lead to the same equilibrium concentrations.

The second term is time dependent and describes the evolution of the system when the initial concentrations of A and B are not set to the equilibrium concentrations. The initial concentrations are set in the term $v_{initial}$ which is the reaction rate, $v$, at $t=0$. The second term also has an exponential component which approaches zero as time goes to infinity. Given this, at infinite time we are left with the first term which equals the concentration of A when $d\!A/dt = d\!B/dt = 0$.

**Figure** <a id="fig-reversibleclosedsystemtransient"></a> `fig:reversibleClosedSystemTransient`

*Caption:* Time course for equilibration of the reversible reaction in model [Equilibrium](#reaction-simpleequilibriumsystem) where $k_1 = 1, k_2 = 0.5, A_o = 10, B_o = 0$. The ratio of the equilibrium concentration is given by $k_1/k_2$. Tellurium Listing: `tellurium:reversibleClosedSystemTransient1`.

```latex
\begin{figure}
\begin{center}
\begin{tikzpicture}
\begin{axis}[
xlabel={Time, $t$},
ylabel={Concentration, A or B},
xmin=0,
xmax=3,
ymin=0,
ymax=10,
width=9cm,
height=6cm,legend style={at={(1.05,0.4)}}]

\draw(90pt,35pt) node[anchor=west] {\large $A$};

\addplot[color=red,line width=1.5pt] coordinates {
(0,	10)
(0.1,	9.07138651)
(0.2,	8.272121471)
(0.3,	7.584187677)
(0.4,	6.992077574)
(0.5,	6.482443685)
(0.6,	6.043797732)
(0.7,	5.666251661)
(0.8,	5.341294746)
(0.9,	5.061601738)
(1,	    4.820867734)
(1.1,	4.613666057)
(1.2,	4.435325921)
(1.3,	4.281827144)
(1.4,	4.149709522)
(1.5,	4.03599483)
(1.6,	3.938119689)
(1.7,	3.853877773)
(1.8,	3.781370085)
(1.9,	3.718962139)
(2,     3.665247122)
(2.1,	3.619014179)
(2.2,	3.579221116)
(2.3,	3.544970909)
(2.4,	3.515491483)
(2.5,	3.490118306)
(2.6,	3.46827941)
(2.7,	3.449482498)
(2.8,	3.433303845)
(2.9,	3.419378751)
(3,	    3.40739331)
};

\draw(90pt,90pt) node[anchor=west] {\large $B$};

\addplot[color=blue,line width=1.5pt] coordinates {
(0,	0)
(0.1,	0.92861349)
(0.2,	1.727878529)
(0.3,	2.415812323)
(0.4,	3.007922426)
(0.5,	3.517556315)
(0.6,	3.956202268)
(0.7,	4.333748339)
(0.8,	4.658705254)
(0.9,	4.938398262)
(1,	    5.179132266)
(1.1,	5.386333943)
(1.2,	5.564674079)
(1.3,	5.718172856)
(1.4,	5.850290478)
(1.5,	5.96400517)
(1.6,	6.061880311)
(1.7,	6.146122227)
(1.8,	6.218629915)
(1.9,	6.281037861)
(2,	    6.334752878)
(2.1,	6.380985821)
(2.2,	6.420778884)
(2.3,	6.455029091)
(2.4,	6.484508517)
(2.5,	6.509881694)
(2.6,	6.53172059)
(2.7,	6.550517502)
(2.8,	6.566696155)
(2.9,	6.580621249)
(3,	    6.59260669)
};

%\fill [red] (axis cs:1.33,0.4) circle (2.5pt);

\end{axis}

\end{tikzpicture}
\end{center}
\caption{Time course for equilibration of the reversible reaction in model~\eqref{reaction:simpleEquilibriumSystem} where $k_1 = 1, k_2 = 0.5, A_o = 10, B_o = 0$. The ratio of the equilibrium concentration is given by $k_1/k_2$. Tellurium Listing:~\ref{tellurium:reversibleClosedSystemTransient1}.}
\label{fig:reversibleClosedSystemTransient}
\end{figure}
```

At equilibrium the reaction rate can be computed by substituting the equilibrium concentration of A and B into the reaction rate, $v = k_2 B - k_1 A$. Note that the equilibrium concentration of A is given by:

$$ A_{eq} = \frac{(A_o + B_o) k_2}{k_1 + k_2} $$

and for B, by subtracting $A_{eq}$ from $A_o + B_o$. When the $A_{eq}$ and $B_{eq}$ relations are substituted into $v$, the result is:

$$ v = 0 $$

From this long-winded analysis, it has been determined for the closed reversible system, at infinite time, the concentrations of A and B reach some constant values and that the net rate, $v$ is zero. Note also that the ratio of the final concentration for A and B equals the equilibrium constant. The system is therefore at thermodynamic equilibrium.

In biochemical models it is often assumed that when the forward and reverse rates for a particular reaction are very fast compared to the surrounding reactions, the reaction is said to be in **quasi-equilibrium**. That is, although the entire system may be out of equilibrium, there may be parts of the system that can be approximated as though they were in equilibrium. This is often done to simplify the modeling process.

Living organisms are not themselves at thermodynamic equilibrium; if they were, they would technically be dead. Living systems are open so that there is a continual flow of mass and energy across the system's boundaries.

## Steady State

The **steady state**, also called the stationary state, is where the rates of change of all species, $d\!S/dt$, are zero while at the same time the net rates are non-zero, that is $v_i \neq 0$. This situation can only occur in an open system, one capable of exchanging matter with the surroundings.

\stateHighlight{
**Thermodynamic Equilibrium versus Steady State**

Thermodynamic equilibrium (or equilibrium for short) and the steady state are distinct states of a chemical system. If we consider a system where every part is in equilibrium, we can be sure of two things: the species concentrations are not changing, and there are no net flows of mass or energy within the system or between the system and the environment. A system in equilibrium must therefore have the following properties:

$$
\begin{align*}
\text{for all $i$:}\ \frac{dS_i}{dt} &= 0 \\[6pt]
v_i &= 0 \\
\end{align*}
$$

where $v_i$ is the net reaction rate for the $i^{th}$ reaction step. When a biological system is at equilibrium, we say it is dead. Thermodynamically we can also say that entropy production is at zero and has reached its *maximum value*.

The steady state has some similarities with the equilibrium state. Species concentrations are still unchanging, however *there are net flows* of energy and mass within the system and with the environment. Systems at steady state must therefore be open and must continuously dissipate any gradients between the system and the external environment. This means that one or more $v_i$'s must be non-zero.

The steady state is defined when all $d\!S_i/dt$ are equal to zero while one or more reaction rates are non-zero:

$$
\begin{align*}
\text{for all $i$:}\ \frac{dS_i}{dt} &= 0 \\[6pt]
v_i &\neq 0 \\
\end{align*}
$$

Thermodynamically, we can also say that entropy production of the system at steady state is lower than the entropy production in the environment. In some of the literature the terms equilibrium and steady state are used interchangeably resulting in possible confusion. In this book, the word equilibrium will be used to refer to a system at thermodynamic equilibrium, not at steady state.
}

To convert the simple reversible model described in the last section into an open system, we only have to add a source and a sink reaction as shown in the following scheme:

$$
\begin{equation}
\text{X}_o \stackrel{v_o}{\rightarrow} \text{A} \stackrel[k_2]{k_1}{\rightleftharpoons} \text{B} \stackrel{k_3}{\rightarrow}
\label{model:systemsBehavior1}
\end{equation}
$$

In this case simple mass-action kinetics is assumed for all reactions. It is also assumed that the source reaction, with rate $v_o$, is irreversible and originates from a boundary species, $X_o$, where $X_o$ is *fixed*. In addition, it is assumed that the sink reaction with rate constant $k_3$, is also irreversible. For the purpose of making it easier to derive the time-course solution, the reverse rate constant, $k_2$ will be assumed to equal zero. We will also set the initial conditions for A and B to both equal zero. The mathematical solution for the system can again be obtained using Mathematica:

$$
\begin{equation}\label{eqn:transientEquations}
\begin{split}
A(t) &= v_o \frac{1 - e^{-k_1 t}}{k_1}  \\[10pt]
%
B(t) &= v_o \frac{k_1 \left(1 - e^{-k_3 t} \right) + k_3 \left(e^{-k_1 t} - 1\right) }{k_3\ (k_1-k_3)}
\end{split}
\end{equation}
$$

As $t$ tends to infinity, $A(t)$ tends to $v_o/k_1$, and $B(t)$ tends to $v_o/k_3$. In addition, the reaction rate through each of the three reaction steps tends to $v_o$. This is confirmed by substituting the solutions for A and B into the reaction rate laws. Given that $v_o$ is greater than zero and that A and B reach constant values within sufficient time, we conclude that this system eventually settles to a steady state rather than thermodynamic equilibrium.

The system displays a continuous flow of mass from the sink to the source. This can only continue undisturbed so long as the source material, $X_o$, never runs out, and that the sink is continuously emptied. Figure [Figure: Time course for an open system reaching steady state in model \ref{mod](#fig-simpleopensystemtransient) shows a simulation of this system.

\stateHighlight{
At steady state, the rate of mass transfer across a reaction is called the flux, or $J$.
}

**Figure** <a id="fig-simpleopensystemtransient"></a> `fig:SimpleOpenSystemTransient`

*Caption:* Time course for an open system reaching steady state in model [Steady State](#model-systemsbehavior1) where $v_o = 1, k_1 = 2, k_2 = 0, k_3 = 3, A_o = 0, B_o = 0$. $X_o$ is assumed to be fixed. The Tellurium model: `jarnac:SimpleOpenSystemTransient1`.

```latex
\begin{figure}
\begin{center}
\begin{tikzpicture}
\begin{axis}[
xlabel={Time, $t$},
ylabel={Concentration, A or B},
xmin=0,
xmax=6,
ymin=0,
ymax=0.5,
width=9cm,
height=6cm,legend style={at={(1.05,0.4)}}]

\draw(90pt,115pt) node[anchor=west] {\large $A$};

\addplot[color=red,line width=1.5pt] coordinates {
(       0,        0)
(  0.1538,   0.1324)
(  0.3077,   0.2298)
(  0.4615,   0.3014)
(  0.6154,    0.354)
(  0.7692,   0.3926)
(  0.9231,   0.4211)
(   1.077,    0.442)
(   1.231,   0.4573)
(   1.385,   0.4686)
(   1.538,    0.477)
(   1.692,   0.4831)
(   1.846,   0.4875)
(       2,   0.4908)
(   2.154,   0.4933)
(   2.308,   0.4951)
(   2.462,   0.4964)
(   2.615,   0.4973)
(   2.769,    0.498)
(   2.923,   0.4986)
(   3.077,   0.4989)
(   3.231,   0.4992)
(   3.385,   0.4994)
(   3.538,   0.4996)
(   3.692,   0.4997)
(   3.846,   0.4998)
(       4,   0.4998)
(   4.154,   0.4999)
(   4.308,   0.4999)
(   4.462,   0.4999)
(   4.615,      0.5)
(   4.769,      0.5)
(   4.923,      0.5)
(   5.077,      0.5)
(   5.231,      0.5)
(   5.385,      0.5)
(   5.538,      0.5)
(   5.692,      0.5)
(   5.846,      0.5)
(       6,      0.5)
};

\draw(90pt,70pt) node[anchor=west] {\large $B$};

\addplot[color=blue,line width=1.5pt] coordinates {
(       0,          0)
(  0.1538,     0.0184)
(  0.3077,    0.05776)
(  0.4615,      0.103)
(  0.6154,     0.1465)
(  0.7692,     0.1849)
(  0.9231,     0.2173)
(   1.077,     0.2436)
(   1.231,     0.2646)
(   1.385,     0.2811)
(   1.538,     0.2938)
(   1.692,     0.3036)
(   1.846,      0.311)
(       2,     0.3167)
(   2.154,     0.3209)
(   2.308,     0.3241)
(   2.462,     0.3265)
(   2.615,     0.3282)
(   2.769,     0.3296)
(   2.923,     0.3305)
(   3.077,     0.3313)
(   3.231,     0.3318)
(   3.385,     0.3322)
(   3.538,     0.3325)
(   3.692,     0.3327)
(   3.846,     0.3329)
(       4,      0.333)
(   4.154,     0.3331)
(   4.308,     0.3332)
(   4.462,     0.3332)
(   4.615,     0.3332)
(   4.769,     0.3333)
(   4.923,     0.3333)
(   5.077,     0.3333)
(   5.231,     0.3333)
(   5.385,     0.3333)
(   5.538,     0.3333)
(   5.692,     0.3333)
(   5.846,     0.3333)
(   6,     0.333)
};

%\fill [red] (axis cs:1.33,0.4) circle (2.5pt);

\end{axis}

\end{tikzpicture}
\end{center}
\caption{Time course for an open system reaching steady state in model~\ref{model:systemsBehavior1} where $v_o = 1, k_1 = 2, k_2 = 0, k_3 = 3, A_o = 0, B_o = 0$. $X_o$ is assumed to be fixed. The Tellurium model:~\ref{jarnac:SimpleOpenSystemTransient1}.}
\label{fig:SimpleOpenSystemTransient}
\end{figure}
```

In some cases we can calculate the steady state in a different way. For example, in Figure [Figure: Time course for an open system reaching steady state in model \ref{mod](#fig-simpleopensystemtransient) we used the simplified model:

$$
\begin{equation}
\text{X}_o \stackrel{v_o}{\rightarrow} \text{A} \stackrel{k_1}{\rightarrow} \text{B} \stackrel{k_3}{\rightarrow} \varnothing
\label{model:systemsBehavior2}
\end{equation}
$$

The differential equations for this system are:

$$
\begin{align*}
\frac{dA}{dt} &= v_o - k_1 A \\[8pt]
\frac{dB}{dt} &= k_1 A - k_3 B
\end{align*}
$$

Now set the rates of change to zero:

$$
\begin{align*}
0 &= v_o - k_1 A \\
0 &= k_1 A - k_3 B
\end{align*}
$$

With two equations and two unknowns, A and B, we can solve for A and B to obtain:

$$
\begin{align*}
A &= v_o/k_1 \\[4pt]
B &= v_o/k_3
\end{align*}
$$

In most cases we cannot solve the equations because they will be nonlinear and so must revert to computer simulation or specialist software (such as Tellurium) to compute the steady state. The script below shows a model in Tellurium where we solve for the steady state using the command `r.steadyState()`.

```python
import tellurium as te

r = te.loada ('''
    $Xo -> A;  vo;
    A -> B;   k1*A;
    B -> $X1; k3*B;

    // Set up the model initial conditions
    Xo = 1; X1 = 0;
    vo = 0.5; k1 = 0.2; k3 = 0.3;
''')

# Evaluate the steady state
# Evaluate returns a number indicating how far we are
# from the steady state solution. A number less that 1E-6
# is a good indicator that it has found the steady state.
r.steadyState()
print (r.A, r.B)

# Output follows:
Steady State values:  2.5  1.66667
```

Another special characteristic of steady states is that they can be classified as either stable or unstable. We will revisit this concept in much more detail in later chapter. Suffice to say that stable steady states are those where transients converge on to the steady state, while an unstable steady state is where transients diverge. We will talk more about the properties of the steady state in Chapter [[12_the_steady_state|The Steady State]].

## Transients

Another simple behavior that a system can show is a transient. A transient is usually the change that occurs in the species concentrations as the system moves from one state, often a steady state, to another. Equation [Steady State](#eqn-transientequations) shows the solution to a simple system that describes the transient behavior of species A and B. Figure [Figure: Time course for an open system reaching steady state in model \ref{mod](#fig-simpleopensystemtransient) illustrates the transient from an initial condition, in this case from a non-steady state condition, to a steady state. A periodic (such as an oscillation) or a chaotic system may be considered a transient, one that is unable to settle to a fixed steady state. In the case of a system showing periodic behavior, the transient repeats itself indefinitely at regular intervals. In a chaotic system, the transient never repeats the exact same trajectory and will continue indefinitely.

## Setting up a Model in Software

There are many software tools both free (including open source) and commercial that one can use to build models of cellular networks. In this book we use Tellurium [medley2018tellurium], a software tool written by the author and collaborators. As we have seen Tellurium is a script-based tool where one enters a model as a text file. The model is then compiled, run, and the results displayed. Because Tellurium is based on Python more advanced users can develop their own sophisticated analysis. A brief introduction on how to use Tellurium is given in Appendix [[appendix_i_modeling_with_python|Modeling with Python]]. For those who wish to use other tools such as COPASI (<http://www.copasi.org>), CellDesigner (<http://celldesigner.org/>), or even Matlab (<http://www.mathworks.com>), it is easy to convert Tellurium files into standard Systems Biology Markup Language (SBML) or Matlab scripts (See Appendix [[appendix_i_modeling_with_python|Modeling with Python]]) so that models can be loaded into the simulation tool of choice.

## Robustness and Homeostasis

Biological organisms are continually subjected to perturbations. These perturbations can originate from external influences such as changes in temperature, light, or the availability of nutrients. Perturbations can also arise internally due to the stochastic nature of molecular events, or by natural genetic variation. One of the most remarkable and characteristic properties of living systems is their ability to resist such perturbations and maintain very steady internal conditions. For example, the human body can maintain a constant core temperature of 36.8$^\circ$C $\pm 0.7$ even though external temperatures may vary widely. The ability of a biological system to maintain a steady internal environment is called **homeostasis**, a phrase introduced by Claude Bernard almost 150 years ago. Modern authors may also refer to this behavior as **robustness**, although this word is used in many other contexts.

There are a number of mechanisms used in biology to maintain homeostasis. Perhaps the most common is negative feedback. This is where the difference between the desired output, and the actual output is used to modulate the process that determines the output. For example, if the output is lower than the desired output then the process will increase the output. Such systems are found at multiple levels in a living organism, including subcellular processes such as metabolism and multicellular processes that control, for example, the level of glucose in the blood stream. The field of control and regulation in biochemical systems is large and growing, and the topic will be reserved for a separate book.

## Further Reading

- Klipp E, Herwig R, Kowald A, Wierling  C and Lehrach H (2005) Systems Biology in Practice, Wiley-VCH Verlag.

- Steuer R, Junker BH (2008) Computational Models of Metabolism: Stability and Regulation in Metabolic Networks, Advances in Chemical Physics, Volume 142, (ed S. A. Rice), John Wiley & Sons, Inc.

- Stucki JW (1978) Stability analysis of biochemical systems--a practical guide. Prog Biophys Mol Biol. 33(2):99-187.

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- \begin{enumerate} -->
<!-- \item Describe the difference between thermodynamic equilibrium and a steady state. -->

<!-- \item Write out the differential equations for the system $A \rightarrow B \rightarrow C$ where the reactions rates are given by: -->

<!-- \begin{align*} -->
<!-- v_1 &= k_1 A - k_2 B \\ -->
<!-- v_2 &= k_3 B - k_4 C -->
<!-- \end{align*} -->

<!-- Find the concentrations of A, B, and C when the rates of change are zero: $dA/dt=0, dB/dt=0, dC/dt=0$. Show that this system is at thermodynamic equilibrium when the rates of change are zero. -->

<!-- \item What do we mean by the phrase quasi-equilibrium? -->

<!-- \item Find the mathematical expression that gives the steady state levels of A and B in the following network: -->

<!-- \begin{equation} -->
<!-- \text{X}_o \stackrel[k_2]{k_1}{\rightleftharpoons} \text{A} \stackrel{k_3}{\rightarrow} \text{B} \stackrel{k_4}{\rightarrow} \varnothing -->
<!-- \label{model:exSS} -->
<!-- \end{equation} -->

<!-- Assume that $X_o$ is fixed, and that all reactions are governed by simple mass-action kinetics. -->

<!-- \item Consider the following model, use a software tool of your choice to visualize the time evolution for the following system, simulate for 5 time units. At time zero, set $x = 1$ and $y = 2$. Simulate for 30 time units. -->

<!-- \begin{align*} -->
<!-- \frac{dx}{dt} &= 0.1 - 0.3 x - 0.4 y \\[5pt] -->
<!-- \frac{dy}{dt} &= 0.5 x + 0.1 y -->
<!-- \end{align*} -->

<!-- Given the model from the previous question, compute the steady state in two ways: 1) Simulating the model for a very long time; 2) Determine algebraically the steady state. Compare the two solutions. -->

<!-- \item Given the model from the previous question, explore how perturbations in $x$ and $y$ at steady state behave. -->

<!-- \item Use a software tool of your choice to visualize the time evolution for the following system, simulate for 5 time units. -->

<!-- \begin{align*} -->
<!-- \frac{dx}{dt} &= 2.55 x - 4.4 y \\[5pt] -->
<!-- \frac{dy}{dt} &= 5 x + 2.15 y -->
<!-- \end{align*} -->
<!-- \end{enumerate} -->

## Appendix

See Appendix [[appendix_i_modeling_with_python|Modeling with Python]] for more details of Tellurium.

```python
# Simulation of a simple closed system
import tellurium as te

# Simulation of a simple closed system
r = te.loada ('''
    A -> B; k1 * A;
    B -> A; k2 * B;

    A = 10; B = 0;
    k1 = 1; k2 = 0.5;
''')

result = r.simulate(0, 6, 100)
r.plot()
```

```python
# Simulation of an open system
import tellurium as te

# Simulation of an open system
rr = te.loada ('''
    $Xo -> S1; vo;
    S1 -> S2; k1*S1 - k2*S2;
    S2 -> $X1; k3*S2;

    vo = 1
    k1 = 2; k2 = 0; k3 = 3;
''')

result = rr.simulate(0, 6, 100)
r.plot()
```

<!-- \section*{Answers} -->

<!-- \begin{enumerate} -->

<!-- \item Thermodynamic equilibrium is when a system no longer dissipates energy. That is all thermodynamic gradients are at zero, all net fluxes are zero. In steady state, the system dissipates energy at a constant rate (assuming the boundaries of the system are constant). -->

<!-- \item -->

<!-- \begin{align*} -->
<!-- \frac{dA}{dt} &= -v_1 \\[5pt] -->
<!-- \frac{dB}{dt} &= v_1 - v_2 \\[5pt] -->
<!-- \frac{dC}{dt} &= v_2 -->
<!-- \end{align*} -->

<!-- The first thing to realize about this systems is that its closed. This means there is an additional constraint on the system which is that the total mass is fixed, we'll call it $T = A + B + C$. Setting the rates of change to zero and solving for $A, B$ and $C$, and noting that $A = T - B - C$, yields: -->

<!-- \begin{align*} -->
<!-- A &= \frac{k_2 k_4 T}{k_1 k_3 + k_1 k_4 + k_2 k_4} \\[5pt] -->
<!-- B &= \frac{k_1 k_4 T}{k_1 k_3 + k_1 k_4 + k_2 k_4} \\[5pt] -->
<!-- C &= \frac{k_1 k_3 T}{k_1 k_3 + k_1 k_4 + k_2 k_4} -->
<!-- \end{align*} -->

<!-- Since the system is closed, the solution to the system, must be at thermodynamic equilibrium. Another way to look at this is to see if the system is dissipating any energy. We can check this by looking at the network fluxes on the first and second steps. For example, substituting the solution for $A$ and $B$ into $v_1$ yields a reaction rate of zero. The same applies to $v_2$. -->

<!-- \item Quasi-equilibrium is a phrase that is used to indicate that a subpart of a reaction network is at steady state. -->

<!-- \item -->

<!-- The differential equations for this system are: -->

<!-- \begin{align*} -->
<!-- \frac{dA}{dt} &= k_1 X_o - k_2 A - k_3 B\\[4pt] -->
<!-- \frac{dB}{dt} &= k_3 A - k_4 B \\ -->
<!-- \end{align*} -->

<!-- $$ A = \frac{k_1 k_4 X_o}{k_2 k_4 + (k^3)^2} $$ -->

<!-- $$ B = \frac{k_1 k_3 X_o}{k_2 k_4 + (k_3)^2} $$ -->

<!-- \item -->
<!-- \begin{verbatim} -->
<!-- import tellurium as te -->
<!-- r = te.loada(''' -->
<!-- x' = 0.1 -0.3*x - 0.4*y -->
<!-- y' = 0.5*x - 0.1*y -->
<!-- x = 1; y = 2 -->
<!-- ''') -->
<!-- m = r.simulate (0, 5, 100) # Then change to 30 -->
<!-- r.plot() -->
<!-- \end{verbatim} -->

<!-- At $t = 5$, $x = 0.433, y = 0.223$, at $t = 30$, $x = 0.0435, y = 0.217$ -->

<!-- Solving the equation algebraically by setting the differential equations to zero yields solutions: $x = 0.0434783$ and $y = 0.217391$. -->
<!-- \end{enumerate} -->

<!-- \item -->
<!-- \begin{verbatim} -->
<!-- import tellurium as te -->
<!-- r = te.loada(''' -->
<!-- x' = 0.1 -0.3*x - 0.4*y -->
<!-- y' = 0.5*x - 0.1*y -->
<!-- x = 0.043478; y = 0.21739 -->

<!-- at time > 10: -->
<!-- x = x + 1 -->

<!-- at time > 60: -->
<!-- y = y + 1 -->
<!-- ''') -->

<!-- m = r.simulate (0, 100, 200) -->
<!-- r.plot() -->
<!-- \end{verbatim} -->

<!-- \item -->
<!-- \begin{verbatim} -->
<!-- import tellurium as te -->
<!-- r = te.loada(''' -->
<!-- x' = 2.55*x - 4.4*y -->
<!-- y'= 5*x + 2.15*y -->
<!-- x = 1; y = 1 -->
<!-- ''') -->

<!-- m = r.simulate (0, 5, 200) -->
<!-- r.plot() -->
<!-- \end{verbatim} -->

<!-- The system starts to oscillate uncontrollably. -->

<!-- \end{enumerate} -->

<!-- \begin{lstlisting}[caption={Script for Figure~\ref{fig:evolveToSS_ModelDynamics}.},label={jarnac:evolveToSS_ModelDynamics}] -->
<!-- p = defn newModel -->
<!-- $Xo -> S1;  k1*Xo; -->
<!-- S1 -> $X1; k2*S1; -->
<!-- end; -->

<!-- p.k1 = 0.2; -->
<!-- p.k2 = 0.4; -->
<!-- p.Xo = 1; -->
<!-- p.S1 = 0.0; -->

<!-- m = p.sim.eval (0, 20, 100, [<p.time>, <p.S1>]); -->
<!-- graph (m); -->
<!-- \end{lstlisting} -->

---

## Index terms recorded in this chapter

- CellDesigner
- Claude Bernard
- COPASI
- equilibrium
- flux
- homeostasis
- Klipp
- Mathematica
- Matlab
- Maxima
- negative feedback
- quasi-equilibrium
- robustness
- steady state
- Steuer
- Stucki
- system behavior
- Tellurium
- thermodynamic equilibrium
- time dependent
- transient

---

← [[06_stochastic_models|Stochastic Models]] · [[index|Wiki index]] · [[08_multicompartmental_systems|Multicompartmental Systems]] →
