# Stability

*Source: `chapter13.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Stability <a id="chap-stability"></a>

## Stability

The previous chapter briefly touched on the concept of stability of a biochemical network. This chapter will delve more deeply into this topic. First let's refresh our memory by reviewing the simple model that was used to introduce stability. Figure [[12_the_steady_state|Figure: Stability of a simple biochemical pathway at steady state]] shows a simulation where a species concentration is disturbed, and over time relaxes back to the original steady state. This is an example of a stable steady state.

The differential equation for the single floating species, $S_1$, was given by:

$$
\begin{align}
\frac{d\!S_1}{dt} = k_1 Xo - k_2 S_1
%\label{eqn:dfdfdf}
\end{align}
$$

and as shown before, it has the steady state solution:

$$
\begin{align}
S_1 = k_1 Xo / k_2
\label{eqn:simpleSSSolution_13}
\end{align}
$$

An important question to ask is whether the steady state is stable or not, that is, whether a perturbation will decay and return to the steady state. The differential equation describing the two step model is given by:

$$ \frac{d\!S_1}{dt} = k_1 X_o - k_2 S_1 $$

When the system is at steady state, let us make a small perturbation to the steady state concentration of $S_1$, $\delta S_1$ and ask how $\delta S_1$ changes as a result of this perturbation. That is, what is $d(\delta S_1)/dt$? The new rate of change equation is rewritten as follows:

$$ \frac{d(S_1 + \delta S_1)}{dt} = k_1 X_o - k_2 (S_1 + \delta S_1) $$

If we insert the steady state solution for $S_1$,  equation [Stability](#eqn-simplesssolution-13), into the above equation we are left with:

$$
\begin{equation}
\frac{d\delta S_1}{dt} = -k_2 \delta S_1
\label{eqn:stableExamp2}
\end{equation}
$$

In other words the rate of change of the *disturbance itself*, $\delta S_1$, is negative. The system attempts to reduce the disturbance so that the system returns back to the original steady state. Systems with this kind of behavior are called **stable**. If the rate of change in $S_1$ had been positive instead of negative, the perturbation would have continued to diverge away from the original steady state and the system would then be considered **unstable**.

Let's look at this is graphically by plotting the rate of change, $d\!S_1/\dt$, as a function of $S_1$, as shown in Figure [Figure: Rate of change as a function of $S_1$](#fig-graphicalstabilitys1). The steady state occurs when the net rate of change is zero, marked by the arrow. If the substrate level falls below this value, the net rate goes positive, thereby increasing the level of $S_1$. If the substrate rises above the steady state level, the graph shows the net rate of change going negative, so that $S_1$ decreases. The system is therefore stable.

**Figure** <a id="fig-graphicalstabilitys1"></a> `fig:graphicalStabilityS1`

*Caption:* Rate of change as a function of $S_1$. The arrow indicates the steady state for $S_1$. When $S_1$ is below the steady state value, the net change is positive meaning that $S_1$ will increase. When $S_1$ is above the steady state value, the net change is negative meaning that $S_1$ will decrease. The system is therefore stable.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}[scale=1.2]
\begin{axis}[
xlabel={\small Concentration of $S_1$},
ylabel={\small $\displaystyle \frac{dS_1}{dt} = v_1 - v_2$},
ylabel style={at={(-0.06,0.5)}},
xmin=0, xmax=1.5,
ymin=-1, ymax=1,
grid=both,
width=8cm,
height=6cm,
area style]
\addplot[color=verylightgreen,fill, line width=1.5pt] expression[domain=0:0.37,samples=60]{1/(\x+2)-\x/(\x+0.5)} \closedcycle;
\addplot[color=verylightblue,fill, line width=1.5pt] expression[domain=0.37:1.5,samples=60]{1/(\x+2)-\x/(\x+0.5)} \closedcycle;
\addplot[line width=0.5pt] expression[domain=0.0:1.5,samples=60]{1/(\x+2)-\x/(\x+0.5)} \closedcycle;

%\node at (axis cs:40,0.41) {\sffamily Change in $S_1$};
%
\draw[thick,red,-latex] (axis cs:0.35,0.42) to[zigzag] (axis cs:0.07,0.22);

\draw[color=black] (axis cs:0,0) -- (axis cs:2,0);
\draw[thick,-latex,red] (axis cs:0.37,-0.8) -- (axis cs:0.37,0);
\node at (axis cs:0.8,-0.8) {\small Steady state level of $S_1$};

\node at (axis cs:0.57,0.42) {\small Net positive};
\node at (axis cs:1.15,-0.18) {\small Net negative};

%\fill [red] (axis cs:2.82,0.42) circle (2.5pt);
%\node at (axis cs:6,0.2) {$v_1$};
%\node at (axis cs:6.0,0.7) {$v_2$};

\end{axis}
\end{tikzpicture}
\end{center}
\caption{Rate of change as a function of $S_1$. The arrow indicates the steady state for $S_1$. When $S_1$ is below the steady state value, the net change is positive meaning that $S_1$ will increase. When $S_1$ is above the steady state value, the net change is negative meaning that $S_1$ will decrease. The system is therefore stable.}
\label{fig:graphicalStabilityS1}
\end{figure}
```

This kind of stability is also called the **internal stability** because it describes the system's stability to perturbations in the internal state. We can informally define a stable system as:

\stateHighlight{
**Internal Stability:** A biochemical pathway is internally stable if at steady state, small perturbations to the floating species relax back to the steady state.  

**Caveat:** If the perturbed species is part of a conserved cycle (See section [[03_stoichiometric_networks|Moiety Conserved Cycles]]), then the total mass in the cycle must remain constant during the perturbation. This may require perturbing one species in a positive direction and another in a negative direction.
}

Let us divide both sides of equation [Stability](#eqn-stableexamp2) by $\delta S_1$ and taking the limit, we find that $\partial (dS_1/dt)/\partial S_1$ is equal to $-k_2$. The stability of this simple system can therefore be determined by inspecting the sign of $\partial (dS_1/dt)/\partial S_1$. In this case $\partial (dS_1/dt)/\partial S_1 = -k_2$ which is negative, meaning the system is *stable*. It is worth noting that the larger the rate constant, $k_2$, the quicker the system relaxes back to steady state.

For systems with more than one species, a system's stability can be determined by looking at all the terms $\partial (dS_i/dt)/\partial S_i$ which are given collectively by the expression:

$$
\begin{equation}
\frac{d(d\bs/dt)}{d\bs} = \bJ
 \label{equ:multipleJacobianTerm}
\end{equation}
$$

where $\bJ$ is called the **Jacobian matrix** containing elements of the form $\partial (dS_i/dt)/\partial S_i$. Using this result we can generalize equation [Stability](#eqn-stableexamp2) to:

$$
\begin{align}
\frac{d(\delta \bs)}{dt} = \bJ \delta \bs
\label{eqn:generalDisturbance}
\end{align}
$$

where $\bJ$ is given by

$$
\begin{bmatrix}\\[-8pt]
\frac{\displaystyle \partial (dS_1/dt)}{\displaystyle \partial S_1} & \cdots & \frac{\displaystyle \partial (dS_1/dt)}{\displaystyle \partial S_m} \\[7pt]
\vdots & \ddots & \vdots \\[7pt]
\frac{\displaystyle \partial (dS_m/dt)}{\displaystyle \partial S_1} & \cdots & \frac{\displaystyle \partial (dS_m/dt)}{\displaystyle \partial S_m} \\[7pt]
\end{bmatrix}
$$

Equation [Stability](#eqn-generaldisturbance) is an example of an *unforced* linear differential equation and has the general from:

$$ \frac{d\!\bx}{\dt} = \bA \bx $$

Solutions to unforced linear differential equations are well known and take the form:

$$
\begin{equation}
x_j (t) = c_1 \bK_1 e^{\lambda_1 t} + c_2 \bK_2 e^{\lambda_2 t} + \cdots c_n \bK_n e^{\lambda_n t}
\label{eqn:linearSolutionODE}
\end{equation}
$$

The solution involves a sum of exponentials, $e^{\lambda_i t}$, constants $c_i$, and vectors, $\bK_i$. The exponents of the exponentials are given by the eigenvalues (See Appendix [[appendix_f_math_fundamentals|Math Fundamentals]]) of the matrix, $\bA$, and $\bK_i$, the corresponding eigenvectors. The $c_i$ terms are related to the initial conditions assigned to the problem. It is possible for the eigenvalues to be complex, but in general if the real parts of the eigenvalues are negative, the exponents will decay. If they are positive, the exponents will grow. We can therefore determine the stability properties of a given model by computing the eigenvalues of the Jacobian matrix and looking for any positive eigenvalues. Note that the elements of the Jacobian matrix will often be a function of the species levels; it is therefore important that the Jacobian be evaluated at the steady state of interest.

<!-- \vspace{4mm} -->
<!-- \begin{exmp} -->

<!-- The following system: -->

<!-- $$ S_1 \rightarrow S_2 \rightarrow $$ -->

<!-- is governed by the following set of differential equations: -->

<!-- \begin{align*} -->
<!-- \frac{dS_1}{dt} &= - 2 S_1\\[6pt] -->
<!-- \frac{dS_2}{dt} &= 2 S_1 - 4 S_2 -->
<!-- \end{align*} -->

<!-- The solution to this system can be derived using Mathematica or by using standard algebraic methods for solving linear homogeneous systems. The solution can be found to be: -->

<!-- $$ -->
<!-- \left( \begin{array}{ll} S_1 \\ S_2 \end{array} \right) = c_1 \left( \begin{array}{ll} 1 \\ 1 \end{array} \right) e^{-2 t} + c_2 \left( \begin{array}{ll} 0 \\ 1 \end{array} \right) e^{-4 t} $$ -->

<!-- \begin{align*} -->
<!-- S_1 &= c_1 e^{-2 t} \\[4pt] -->
<!-- S_2 &= c_1 e^{-2 t} + c_2 e^{-4t} -->
<!-- \end{align*} -->

<!-- Since the exponents are all negative (-2, -2 and -4), the system is stable to perturbations in $S_1$ and $S_2$. -->
<!-- \end{exmp} -->
<!-- \hrule width \textwidth height 0.5pt -->
<!-- \vspace{2mm} -->

We can formally define the internal stability of a biochemical system as follows:

\stateHighlight{
The steady state for the biochemical system:

$$
\begin{equation}
\bdSdt = \bN \ratev
\end{equation}
$$

is stable if all the eigenvalues of the system's Jacobian matrix have negative real parts. The system is unstable if at least one of the eigenvalues has a positive real part.
}

There are many software packages that compute the eigenvalues of a matrix, and there are a small number of packages that can compute the Jacobian directly from a biochemical model. For example, the script below is taken from Tellurium. It defines a simple model, initializes the model values, computes the steady state, and then prints out the eigenvalues of the Jacobian matrix (Listing `jarnac:chap:eigenvaluestability`). For a simple one variable model, the Jacobian matrix only has a single entry and the eigenvalue corresponds to that entry. The output from running the script is given below, showing that the eigenvalue is $-0.3$. Since we have a negative eigenvalue, the pathway must be stable to perturbations in $S_1$.

```python
import tellurium as te

r = te.loada ('''
    $Xo -> S1;  k1*Xo;
    S1 -> $X1; k2*S1;

    // Set up the model initial conditions
    Xo = 1;   X1 = 0;
    k1 = 0.2; k2 = 0.3;
''')

# Evaluation of the steady state
print (r.getSteadyStateValues())

# print the eigenvalues of the full Jacobian matrix
print (r.getFullEigenValues())

# Output follows:
[0.6667]
[-0.3]
```

**Example**

The following system:

$$ \rightarrow S_1 \rightarrow S_2 \rightarrow $$

is governed by the set of differential equations:

$$
\begin{align*}
\frac{dS_1}{dt} &= 3 - 2 S_1\\[6pt]
\frac{dS_2}{dt} &= 2 S_1 - 4 S_2
\end{align*}
$$

The Jacobian matrix is computed by differentiating the equations with respect to $S_1$ and $S_2$:

$$ \bJ =
\begin{bmatrix}
-2 & \phantom{-}0   
\phantom{-}2 & -4
\end{bmatrix}
$$

The eigenvalues for this matrix are: $-2$ and $-4$, respectively. Since both eigenvalues are negative, the system is stable to small perturbations in $S_1$ and $S_2$.

**Example**

Consider the system:

$$
\begin{align*}
 \text{X}_o &\rightarrow \text{S}_1 \quad v_o \\
 \text{S}_1 &\rightarrow \text{X}_1 \quad \text{S}_1 \\
 \text{S}_1 &\rightarrow \text{S}_2 \quad S_1 (1+S_2^3) \\
 \text{S}_2 &\rightarrow \text{X}_2 \quad 5 S_2
\end{align*}
$$

where $X_o, X_1$ and $X_2$ are fixed species. At steady state $S_1 = 2.295$ and $S_2 = 1.14$ with parameter values $v_o = 8$. Determine whether this steady state is stable or not.
The differential equations for the system are given by:

$$
\begin{align*}
\frac{dS_1}{dt} &= v_o - S_1 - S_1 (1 + S_2^3) \\[6pt]
\frac{dS_2}{dt} &= S_1 (1 + S_2^q)  - 5 S_2
\end{align*}
$$

The Jacobian matrix is computed by differentiating the equations with respect to the steady state values of $S_1$ and $S_2$:

$$ \bJ =
\begin{bmatrix}
-2-S_2^3 & -3 S_1 S_2^2 \\[5pt]
\phantom{-}1+S^3 & -5 + 3 S_1 S_2^2
\end{bmatrix} =
\begin{bmatrix}
-3.4815 & -8.948 \\[4pt]
\phantom{-}2.482 & \phantom{-}3.948
\end{bmatrix}
$$

The eigenvalues for this matrix are: $0.2333 + 2.9 i$ and $0.2332 - 2.9 i$, respectively. Since the real parts of the eigenvalues are positive, the system is unstable to small perturbations in $S_1$ and $S_2$.

<!-- \hrule width \textwidth height 0.5pt -->

The pattern of eigenvalues tells us a lot about stability, but also about the kind of the transients that occur after a perturbation. The following sections will
investigate this subject further.

<!-- \subsection*{Input Stability} -->

<!-- Another kind of stability is refereed to as input stability. In the control literature this is called BIBO stability which stands for Bounded-Input Bounded-Output stability. For example, in the following system, where $X_o$ is a boundary species: -->

<!-- $$ X_o \rightarrow S_1 \rightarrow X_1 $$ -->

<!-- we can ask the question, if we make a small change in the input species, $X_o$, what is the effect on $S_1$. Is the change in $S_1$ bounded? If it is then we say the system is BIBO stable. -->

## Jacobian for Biochemical Systems

For a given set of differential equations, we can compute the Jacobian by differentiating the equations with respect to the model variables. However for biochemical networks, the Jacobian can be written in a special way that highlights the importance of the network structure and kinetics of the biochemical reaction steps. To do this, let us first define the unscaled elasticity [[appendix_e_enzyme_kinetics_in_a_nutshell|Unscaled Elasticity]] as:

$$ \mathcal{E}^v_S = \frac{\partial v}{\partial S} $$

where $v$ is a reaction rate and $S$ an effector of the reaction. For example, if $v = k_1 S$, the unscaled elasticity, $\mathcal{E}^v_S = k_1$. The matrix of unscaled elasticities can be defined as:

$$ \frac{\partial \bvv}{\partial \bvs} =
\begin{bmatrix}
   \mathcal{E}^{v_1}_{S_1} & \mathcal{E}^{v_1}_{S_2} & \mathcal{E}^{v_1}_{S_3} \\[12pt]
   \mathcal{E}^{v_2}_{S_1} & \mathcal{E}^{v_2}_{S_2} & \mathcal{E}^{v_2}_{S_3} \\[12pt]
   \mathcal{E}^{v_3}_{S_1} & \mathcal{E}^{v_3}_{S_2} & \mathcal{E}^{v_3}_{S_3} \\[12pt]
\end{bmatrix} $$

The example shows a three by three elasticity matrix. An elasticity matrix has $n$ rows representing $n$ reactions and $m$ columns represent $m$ species. Many entries in the elasticity matrix will often be zero. For example, consider the pathway:

$$ X_o \stackrel{v_1}{\rightarrow} S_1 \stackrel{v_2}{\rightarrow} S_2 \stackrel{v_3}{\rightarrow} X_1 $$

where $X_o$ and $X_1$ are fixed species. The pathway has three reactions, which we will designate $v_1, v_2$, and $v_3$ and two floating species, $S_1$ and $S_2$. The unscaled elasticity matrix will therefore be a three by two matrix. If we assume reversibility or product inhibition in all three reactions, the entries in the matrix will be:

$$ \frac{\partial \bvv}{\partial \bvs} =
\begin{bmatrix}
   \mathcal{E}^{v_1}_{S_1} & \mathcal{E}^{v_1}_{S_2}  \\[12pt]
   \mathcal{E}^{v_2}_{S_1} & \mathcal{E}^{v_2}_{S_2}  \\[12pt]
   \mathcal{E}^{v_3}_{S_1} & \mathcal{E}^{v_3}_{S_2}  \\[12pt]
\end{bmatrix} =
\begin{bmatrix}
   \mathcal{E}^{v_1}_{S_1} & 0  \\[12pt]
   \mathcal{E}^{v_2}_{S_1} & \mathcal{E}^{v_2}_{S_2}  \\[12pt]
   0 & \mathcal{E}^{v_3}_{S_2}  \\[12pt]
\end{bmatrix}$$

Note that the entries $\mathcal{E}^{v_1}_{S_2}$ and $\mathcal{E}^{v_3}_{S_1}$ are zero because $S_2$ has no direct effect on $v_1$, and $S_1$ has no direct effect on $v_3$. Some of the unscaled elasticities will also be negative. For example, $\mathcal{E}^{v_2}_{S_2}$ will be negative because increases in $S_2$ will slow down the $v_2$ reaction rate due to product inhibition.

Recall that an element of the Jacobian is defined as:

\[ \frac{\partial (dS_j/dt)}{\partial S_j} \]

that is the differential equation differentiated with respect to a species. However, we also know that the vector of rates of change is given by the system equation:

\[ \bdSdt = \bN \ratev \]

Differentiating this with respect to $\bs$ yields:

\[  \frac{\partial}{\partial \bs} \left( \bdSdt \right) = \bN \frac{\partial \bvv}{\partial \bvs} \]

Hence, the Jacobian is the product of the stoichiometry and the unscaled elasticity matrix:

\stateEquation{

$$
\begin{equation}
 \bJ  = \bN \frac{\partial \bvv}{\partial \bvs}
\end{equation}
$$

}

Given that stability is determined from the Jacobian, this result indicates that stability is a function of network topology and the kinetics of the individual reactions. The result indicates that it is not always possible to discern the functional dynamics of a motif (Chapter [[03_stoichiometric_networks|Stoichiometric Networks]]) just from the topological pattern. The dynamics also depend on the kinetics of the constituent parts.

\stateHighlight{
The dynamics of a network is a function of the network topology *and* the kinetics of its constituent parts.
}

## External Stability

There is one other type of stability that is useful with respect to biochemical systems, namely **external stability**. This refers to the idea that if a system is externally stable, then a finite change to an input of the system should elicit a finite change to the internal state of the system. In control theory this is called BIBO, or Bounded Input Bounded Output stability. It is very important to bear in mind that the finite change in the internal state refers to a linearized system. When the system is nonlinear, the output may be bounded by physical constraints.

A system that is internally unstable will also be unstable to changes in the systems inputs. In biochemical systems such inputs could be the boundary species that feed a pathway, a drug intervention, or the total mass of a conserved cycle. External stability can be determined using the same criteria used for internal stability, that is the real parts of eigenvalues of the Jacobian matrix should all be negative.

## Phase Portraits

The word **phase space** refers to a space where all possible states are shown. For example, in a biochemical pathway with two species, $S_1$ and $S_2$, the phase space consists of all possible trajectories of $S_1$ and $S_2$ in time. For a two dimensional system with species $S_1$ and $S_2$, the phase space can be conveniently displayed with $S_1$ on one axis and $S_2$ on the other. A line on a two dimensional plane will represent how $S_1$ and $S_2$ move with respect to each other in time. Figure [Figure: Time course simulation plot and corresponding phase plot](#fig-timecoursephaseplot) shows a time-course plot for a simple three step pathway with two species and the corresponding trajectory in the phase plot. In a real phase plot we would have all possible trajectories shown rather than just one. Figure [Figure: Multiple trajectories plotted on the phase plot Tellurium Listing:](#fig-phaseplotsimplesystem) shows the same phase plot but this time with forty-four trajectories that were generated using forty-four different initial conditions. Note they all converge on a single point that represents the system's steady state.

**Figure** <a id="fig-timecoursephaseplot"></a> `fig:TimeCoursePhasePlot`

*Graphic (not in the LaTeX source, referenced by name): `TimeCoursePhasePlot`*

*Caption:* Time course simulation plot and corresponding phase plot.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.75]{TimeCoursePhasePlot}
\caption{Time course simulation plot and corresponding phase plot.} \label{fig:TimeCoursePhasePlot}
\end{figure}
```

**Figure** <a id="fig-phaseplotsimplesystem"></a> `fig:phasePlotSimpleSystem`

*Graphic (not in the LaTeX source, referenced by name): `phasePlotSimpleSystem`*

*Caption:* Multiple trajectories plotted on the phase plot Tellurium Listing: `tellurium:phasePlotSimpleSystem`.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.55]{phasePlotSimpleSystem}
\caption{Multiple trajectories plotted on the phase plot Tellurium Listing:~\ref{tellurium:phasePlotSimpleSystem}.} \label{fig:phasePlotSimpleSystem}
\end{figure}
```

A visual representation of the phase space is often called a **phase portrait** or **phase plane**. To illustrate a phase portrait consider the following simple reaction network:

$$ \xrightarrow{v_o} S_1 \xrightarrow{k_1 S_1} S_2 \xrightarrow{k_2 S_2}  $$

with two linear differential equations:

$$
\begin{align*}
\frac{d\!S_1}{dt} &= v_o - k_1 S_1 \\[8pt]
\frac{d\!S_2}{dt} &= k_1 S_1 - k_2 S_2
\end{align*}
$$

We can assign particular values to the parameters, set up some initial conditions, and plot the evolution of $S_1$ and $S_2$ in phase space. If we replot the solution using many different initial conditions, we get something that looks like the plots shown in Figures [Figure: Multiple trajectories plotted on the phase plot Tellurium Listing:](#fig-phaseplotsimplesystem) to [Figure: Phase portrait for a two species reaction network](#fig-phaseplot-0i-0i).

The plots illustrate a variety of transient behaviors around the steady state. These particular transient behaviors apply specifically to linear differential equations. If we have a nonlinear system and we linearize the system around the steady state, the linearized system will also behave in a way suggested by these plots.

Consider the general two dimensional linear set of differential equations:

$$
\begin{align*}
\frac{dS_1}{dt} &= a_{11} S_1 + a_{12} S_2 \\[6pt]
\frac{dS_2}{dt} &= a_{21} S_1 + a_{22} S_2
\end{align*}
$$

As we've seen already (equation [Stability](#eqn-linearsolutionode)), such a two dimensional linear system of differential equations has solutions of the form:

$$
\begin{align*}
S_1 &= c_1 k_1 e^{\lambda_1 t} + c_2 k_2 e^{\lambda_2 t} \\
S_2 &= c_3 k_3 e^{\lambda_3 t} + c_4 k_4 e^{\lambda_4 t}
\end{align*}
$$

**Figure** <a id="fig-phaseplot-nr-nr"></a> `fig:PhasePlot_NR_NR`

*Graphic (not in the LaTeX source, referenced by name): `PhasePlot_NR_NR`*

*Caption:* Trajectories for a two species reaction network. On the left is the phase plot and on the right, a single transient as a function of time. This system illustrates a stable node corresponding to *Negative Eigenvalues* in the Jacobian. Matrix $\bA$: $a_{11} = -2, a_{12} = 0, a_{21} = -0.15, a_{22} = -2$. Corresponding eigenvalues: $\lambda_1 = -2, \lambda_2 = -2$. The symmetry in the trajectories is due to eigenvalues having the same magnitude.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.6]{PhasePlot_NR_NR}
\caption{Trajectories for a two species reaction network. On the left is the phase plot and on the right, a single transient as a function of time. This system illustrates a stable node corresponding to {\em Negative Eigenvalues} in the Jacobian. Matrix $\bA$: $a_{11} = -2, a_{12} = 0, a_{21} = -0.15, a_{22} = -2$. Corresponding eigenvalues: $\lambda_1 = -2, \lambda_2 = -2$. The symmetry in the trajectories is due to eigenvalues having the same magnitude.} \label{fig:PhasePlot_NR_NR}
\end{figure}
```

That is, a sum of exponential terms. The $c_i$ and $k_i$ terms are constants related to the initial conditions and eigenvectors, respectively, but the $\lambda_i$ terms or eigenvalues determine the qualitative pattern that a given behavior might have. It should be noted that the eigenvalues can be complex or real numbers. In applied mathematics, $e$ raised to a complex number immediately suggests some kind of periodic behavior. Let us consider different possibilities for the various eigenvalues.

**Figure** <a id="fig-phaseplot-pr-pr"></a> `fig:PhasePlot_PR_PR`

*Graphic (not in the LaTeX source, referenced by name): `PhasePlot_PR_PR`*

*Caption:* Trajectories for a two species reaction network. On the left is the phase plot and on the right a single transient as a function of time. This system illustrates a unstable node, also called an improper node corresponding to *Positive Eigenvalues*. Matrix $\bA$: $a_{11} = 1.2, a_{12} = -2, a_{21} = -0.05, a_{22} = 1.35$. Corresponding eigenvalues: $\lambda_1 = 1.6, \lambda_2 = 0.95$.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.6]{PhasePlot_PR_PR}
\caption{Trajectories for a two species reaction network. On the left is the phase plot and on the right a single transient as a function of time. This system illustrates a unstable node, also called an improper node corresponding to {\em Positive Eigenvalues}. Matrix $\bA$: $a_{11} = 1.2, a_{12} = -2, a_{21} = -0.05, a_{22} = 1.35$. Corresponding eigenvalues: $\lambda_1 = 1.6, \lambda_2 = 0.95$.} \label{fig:PhasePlot_PR_PR}
\end{figure}
```

$\bullet$ **Both Eigenvalues have the same sign, different magnitude but are real**. If both eigenvalues are negative, the equations describe a system known as a **stable node**. All trajectories move towards the steady state point. If the eigenvalues have the same magnitude and the $c_i$ terms have the same magnitude, the trajectories move to the steady state in a symmetric manner as shown in Figure [Figure: Trajectories for a two species reaction network](#fig-phaseplot-nr-nr).

**Figure** <a id="fig-phaseplot-nr-pr"></a> `fig:PhasePlot_NR_PR`

*Graphic (not in the LaTeX source, referenced by name): `PhasePlot_NR_PR`*

*Caption:* Trajectories for a two species reaction network. On the left is the phase plot and on the right a single transient as a function of time. This system illustrates a saddle node corresponding to *One Positive and One Negative Eigenvalue*. Matrix $\bA$: $a_{11} = 2, a_{12} = -1, a_{21} = 1, a_{22} = -2$. Corresponding eigenvalues: $\lambda_1 = -1.73, \lambda_2 = 1.73$.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.6]{PhasePlot_NR_PR}
\caption{Trajectories for a two species reaction network. On the left is the phase plot and on the right a single transient as a function of time. This system illustrates a saddle node corresponding to {\em One Positive and One Negative Eigenvalue}. Matrix $\bA$: $a_{11} = 2, a_{12} = -1, a_{21} = 1, a_{22} = -2$. Corresponding eigenvalues: $\lambda_1 = -1.73, \lambda_2 = 1.73$.} \label{fig:PhasePlot_NR_PR}
\end{figure}
```

If the two eigenvalues are both positive, the trajectories move out from the steady state reflecting the fact that the system is unstable. Such a point is called an **unstable node**. If the two eigenvalues have different magnitudes but are still positive, the trajectories twist as shown in Figure [Figure: Trajectories for a two species reaction network](#fig-phaseplot-pr-pr).

$\bullet$ **Real Eigenvalues but of opposite sign**. If the two eigenvalues are real but of opposite sign, we see behavior called a **saddle-node** shown in Figure [Figure: Trajectories for a two species reaction network](#fig-phaseplot-nr-pr). This is where the trajectories move towards the steady state in one direction, called the stable manifold, and form a stable ridge. In all other directions trajectories move away, resulting in an unstable manifold. Since trajectories can only move towards the steady state if they are exactly on the stable ridge, the saddle nodes are generally considered unstable.

**Figure** <a id="fig-phaseplot-ni-ni"></a> `fig:PhasePlot_NI_NI`

*Graphic (not in the LaTeX source, referenced by name): `PhasePlot_NI_NI`*

*Caption:* Trajectories for a two species reaction network. On the left is the phase plot and on the right, a single transient as a function of time. This system illustrates a stable spiral node corresponding to *Negative Complex Eigenvalues*. Matrix $\bA$: $a_{11} = -0.5, a_{12} = -1, a_{21} = 1, a_{22} = -1$. Corresponding eigenvalues: $\lambda_1 = -0.75 + 0.97 i, \lambda_2 = -0.75 - 0.97 i$.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.6]{PhasePlot_NI_NI}
\caption{Trajectories for a two species reaction network. On the left is the phase plot and on the right, a single transient as a function of time. This system illustrates a stable spiral node corresponding to {\em Negative Complex Eigenvalues}. Matrix $\bA$: $a_{11} = -0.5, a_{12} = -1, a_{21} = 1, a_{22} = -1$. Corresponding eigenvalues: $\lambda_1 = -0.75 + 0.97 i, \lambda_2 = -0.75 - 0.97 i$.} \label{fig:PhasePlot_NI_NI}
\end{figure}
```

**Table**

*Caption:* Summary of Node Behaviors. $r_1$ and $r_2$ ar the real parts of the eigenvalues.

```latex
\begin{table}[htb]
\centering
\begin{tabular}{lll}\toprule
Description & Eigenvalues & Behavior \\\midrule
Both Positive & $r_1 > r_2 > 0$ & Unstable \\
Both Negative & $r_1 < r_2 < 0$ & Stable \\
Positive and Negative & $r_1 < 0 < r_1$ & Saddle point \\
Complex Conjugate & $r_1 > r_1 > 0$ & Unstable spiral \\
Complex Conjugate & $r_1 < r_1 < 0$ & Stable spiral \\
Pure Imaginary & $r_1 = r_1 = 0$ & Center \\\bottomrule
\end{tabular}
\caption{Summary of Node Behaviors. $r_1$ and $r_2$ ar the real parts of the eigenvalues.}
\end{table}
```

$\bullet$ **Complex Eigenvalues.** Sometimes the eigenvalues can be complex, that is of the form $a + i b$ where $i$ is the imaginary number. It may seem strange that the solution to a differential equation that describes a physical system can admit complex eigenvalues. To understand what this means we must recall Euler's formula:

$$ e^{i \theta} = \cos (\theta) + i \sin (\theta) $$

Extended to:

$$
\begin{align}
e^{(a + b i)t} = e^{a t}\cos (b t) + i e^{b t} \sin (bt)
\label{eqn:imaginaryPeriodic}
\end{align}
$$

When the solutions are expressed in sums of sine and cosine terms, the imaginary parts cancel out, leaving just trigonometric terms with real parts (The proof is provided at the end of the chapter in an appendix). This means that systems with complex eigenvalues show periodic behavior.

**Figure** <a id="fig-phaseplot-pi-pi"></a> `fig:PhasePlot_PI_PI`

*Graphic (not in the LaTeX source, referenced by name): `PhasePlot_PI_PI`*

*Caption:* Phase portrait for a two species reaction network. Unstable spiral node. **Positive Complex Eigenvalues**. Matrix $\bA$: $a_{11} = 0, a_{12} = 1.0, a_{21} = -1.2, a_{22} = 0.2$. Corresponding eigenvalues: $\lambda_1 = 0.1 + 1.09 i, \lambda_2 = 0.1 - 1.09 i$.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.6]{PhasePlot_PI_PI}
\caption{Phase portrait for a two species reaction network. Unstable spiral node. {\bfseries Positive Complex Eigenvalues}. Matrix $\bA$: $a_{11} = 0, a_{12} = 1.0, a_{21} = -1.2, a_{22} = 0.2$. Corresponding eigenvalues: $\lambda_1 = 0.1 + 1.09 i, \lambda_2 = 0.1 - 1.09 i$.} \label{fig:PhasePlot_PI_PI}
\end{figure}
```

Figures [Figure: Trajectories for a two species reaction network](#fig-phaseplot-ni-ni), [Figure: Phase portrait for a two species reaction network](#fig-phaseplot-pi-pi), and [Figure: Phase portrait for a two species reaction network](#fig-phaseplot-0i-0i) show typical trajectories when the system admits complex eigenvalues. If the real parts are positive, the spiral trajectories move outwards away from the steady state. Such systems are unstable. In a pure linear system, the trajectories will expand out forever. They will only stop and converge to a stable oscillation if the system has nonlinear elements which limits the expansion. In these cases we observe limit cycle behavior.

If the real parts of the eigenvalues are negative, the spiral trajectory moves into the steady state and is therefore considered stable.

**Figure** <a id="fig-phaseplot-0i-0i"></a> `fig:PhasePlot_0I_0I`

*Graphic (not in the LaTeX source, referenced by name): `PhasePlot_0I_0I`*

*Caption:* Phase portrait for a two species reaction network. Center node. **Complex Eigenvalues, Zero Real Part**. Matrix $\bA$: $a_{11} = 1, a_{12} = 2.0, a_{21} = -2, a_{22} = -1$. Corresponding eigenvalues: $\lambda_1 = 0 + 1.76 i, \lambda_2 = 0 - 1.76 i$. The script for generating these phase plots can be found in the chapter appendix: `fig:phaseplot0I0I`

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.6]{PhasePlot_0I_0I}
\caption{Phase portrait for a two species reaction network. Center node. {\bfseries Complex Eigenvalues, Zero Real Part}. Matrix $\bA$: $a_{11} = 1, a_{12} = 2.0, a_{21} = -2, a_{22} = -1$. Corresponding eigenvalues: $\lambda_1 = 0 + 1.76 i, \lambda_2 = 0 - 1.76 i$. The script for generating these phase plots can be found in the chapter appendix:~\ref{fig:phaseplot0I0I}} \label{fig:PhasePlot_0I_0I}
\end{figure}
```

\stateHighlight{
**Conjugate Pair**

A complex conjugate pair is a complex number of the form: $a \pm b i$. The eigenvalues for a two variable linear system with matrix $\bA$ can be computed directly using the relation:

$$ \lambda = \frac{tr (\bA) \pm \sqrt{tr^2(\bA) - 4 det (\bA)} }{2} $$

where $tr (\bA) = a + d$, and $det (\bA) = a d - b c$. If the term in the square root is negative, the eigenvalues will always come out as a conjugate pair owning to the $\pm$ term. If $tr^2(\bA) - 4 det(\bA) < 0$, then the solution will be the conjugate pair:

$$ \lambda = \frac{tr (\bA)}{2} \pm \frac{\sqrt{tr^2(\bA) - 4 det(\bA)}}{2} $$

Therefore a complex eigenvalue will always be accompanied by its conjugate partner.
}

**Figure** <a id="fig-phaseplotssummary"></a> `fig:PhasePlotsSummary`

*Graphic (not in the LaTeX source, referenced by name): `PhasePlotsSummary`*

*Caption:* Summary of behaviors including dynamics and associated eigenvalues for a two dimensional linear system. Adapted from "Computational Models of Metabolism: Stability and Regulation in Metabolic Networks", Adv in Chem Phys, Vol 142, Steuer and Junker.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.75]{PhasePlotsSummary}
\caption{Summary of behaviors including dynamics and associated eigenvalues for a two dimensional linear system. Adapted from ``Computational Models of Metabolism: Stability and Regulation in Metabolic Networks'', Adv in Chem Phys, Vol 142, Steuer and Junker.} \label{fig:PhasePlotsSummary}
\end{figure}
```

$\bullet$ **Imaginary Eigenvalues with Zero Real Parts.** It is possible for the pair of eigenvalues to have no real component but retain an imaginary part. In this situation the behavior is called a center. This is where the trajectory orbits the steady state. The oscillation is an unusual one in the sense that it implies zero dampening in the system, in other words zero energy loss. Such a situation would be very rare in biology and even in non-living systems, such behavior tends to be idealized. For example a pendulum in a vacuum with no friction at the fulcrum. The other unusual aspect of a center is that the oscillation is depending on the starting condition. Again we can relate this to a pendulum where the swing depending on how much force we initially apply to the pendulum bob. Biological oscillators are invariably energy dependent and the frequency is independent of the initial conditions. Biological oscillators therefore tend not to be center type but are the result of nonlinearities in the system.

## Bifurcation Plots

In its simplest form, a bifurcation plot is just a plot of the steady state value of a system variable, such as a concentration or flux versus a parameter of the system. For example, we know that the steady state solution for the simple system:

$$
\begin{align}
\frac{dS_1}{dt} = k_1 Xo - k_2 S_1
\label{eqn:SimpleSsSystem}
\end{align}
$$

was given by:

$$
\begin{align}
S_1 = k_1 Xo / k_2
\label{eqn:SimpleSsSolution_13b}
\end{align}
$$

We can plot the steady state value of $S_1$ as a function of $k_2$ as shown in Figure [Figure: Steady state concentration of $S_1$ as a function of $k_2$ for the sys](#fig-basicbifurcation-plot). This isn't a particularly interesting bifurcation plot however and misses one of the most important characteristics.

**Figure** <a id="fig-basicbifurcation-plot"></a> `fig:BasicBifurcation Plot`

*Caption:* Steady state concentration of $S_1$ as a function of $k_2$ for the system, $dS_1/dt = k_1 X_o - k_2 S_1$. 

```latex
\begin{figure}[htp]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={$k_2$},
ylabel={Concentration of $S_1$},
xmin=0,
xmax=40,
ymin=0,
ymax=1,
width=10cm,
height=6cm]
\addplot[color=blue,line width=1.5pt] expression[domain=0:40,samples=100]{1/x};

\end{axis}
\end{tikzpicture}
\caption{Steady state concentration of $S_1$ as a function of $k_2$ for the system, $dS_1/dt = k_1 X_o - k_2 S_1$. }
\label{fig:BasicBifurcation Plot}
\end{figure}
```

Equation [Bifurcation Plots](#eqn-simplesssolution-13b) shows that the simple system [Bifurcation Plots](#eqn-simplesssystem) only has one steady state for a given set of parameters. That is, if we set values to $X_o, k_1$, and $k_2$, we find there is only *one value* of $S_1$ that satisfies these parameter settings. This is what Figure [Figure: Steady state concentration of $S_1$ as a function of $k_2$ for the sys](#fig-basicbifurcation-plot) also demoonstrates. What is more interesting is when a system admits multiple possible steady state values for a given set of parameter values. To illustrate this behavior, let us look at a common system that can admit three possible steady states. It is in these cases that bifurcation plots become particularly useful and more interesting.

## Bistable Systems

Bifurcation plots can be useful for identifying changes in qualitative behavior, particularly systems that have multiple steady states. Consider the system shown Figure [Figure: System with Positive Feedback](#fig-genepositivefeedbacka). This shows a gene circuit with a positive feedback loop. As the transcription factor $x$ accumulates, it binds to an operator site upstream of the gene which increases its synthesis. The more transcription factor made, the higher the rate of expression.

**Figure** <a id="fig-genepositivefeedbacka"></a> `fig:GenePositiveFeedbackA`

*Graphic (not in the LaTeX source, referenced by name): `GenePositiveFeedback`*

*Caption:* System with Positive Feedback.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale=0.65]{GenePositiveFeedback}
\end{center}
\caption{System with Positive Feedback.} \label{fig:GenePositiveFeedbackA}
\end{figure}
```

At first glance this would seem to be a very unstable situation. One might imagine that the transcription factor concentration would continue to increase without limit. However, the physical limits, in this case the saturation of the translation, transcription, and degradation machinery, ultimately limits the upper value for the concentration of transcription factor. To investigate the properties of this networks we will construct a simple model. This model uses the following kinetic laws for the synthesis and degradation steps:

$$
\begin{align*}
v_1 &= b + k_1 \frac{x^4}{k_2 + x^4} \\
v_2 &= k_3 x
\end{align*}
$$

$v_1$ is a Hill like equation with a Hill coefficient of four and a basal rate of $b$. $v_2$ is a simple irreversible mass-action rate law. The differential equation for the model is:

$$ \frac{dx}{dt} = v_1 - v_2 $$

To find the steady state, set the differential equation to zero and attempt to analytically solve for $x$. If we try this we get a solution that is complex to interpret.

A better way to understand what is going on, is to plot both rate laws as a function of transcription factor, $x$. When we do this we obtain Figure [Figure: Reaction velocities, $v_1$ and $v_2$, as a function of $x$ for the sys](#fig-bistability). The intersection points marked with filled circles indicate the steady state solutions because at these points, $v_1 = v_2$. If we vary the slope of $v_2$ by changing $k_3$, the intersection points will change (Figure [Figure: $v_1$ and $v_2$ plotted against $x$ concentration](#fig-positivefeedbackplotasfuncofk)). At a high $k_3$ value, only one intersection point remains (Panel c), the low intersection point. If the value of $k_3$ is low, only the high intersection point remains (Panel a). However with the right set of parameter values, we can make a system with three steady state values (Panel b).

**Figure** <a id="fig-bistability"></a> `fig:Bistability`

*Caption:* Reaction velocities, $v_1$ and $v_2$, as a function of $x$ for the system in Figure [Figure: Steady state concentration of $S_1$ as a function of $k_2$ for the sys](#fig-basicbifurcation-plot). The intersection points marked by full circles indicate possible steady states. Computed using the SBW rate law plotter. $k_1 = 0.9; k_2 = 0.3; k_3 = 0.7; b = 0.1$.

```latex
\begin{figure}[htp]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={$x$},
ylabel={$v_1$ and $v_2$},
xmin=0,
xmax=1.5,
ymin=0,
ymax=1,
width=10cm,
height=6cm]
\addplot[color=blue,line width=1.5pt] expression[domain=0:2,samples=100]{0.1+0.9*x^4/(0.3+x^4)};
\addplot[color=red,line width=1.5pt] expression[domain=0:2,samples=100]{0.7*x};

\node at (axis cs:0.85,0.8) {$v_1$};
\node at (axis cs:0.85,0.5) {$v_2$};

\fill [red] (axis cs:0.1525,0.098) circle (4pt);
\fill [red] (axis cs:0.682,0.48) circle (4pt);
\fill [red] (axis cs:1.32,0.92) circle (4pt);

\end{axis}
\end{tikzpicture}
\caption{Reaction velocities, $v_1$ and $v_2$, as a function of $x$ for the system in Figure~\ref{fig:BasicBifurcation Plot}. The intersection points marked by full circles indicate possible steady states. Computed using the SBW rate law plotter. $k_1 = 0.9; k_2 = 0.3; k_3 = 0.7; b = 0.1$.}
\label{fig:Bistability}
\end{figure}
```

\pgfplotsset{compat=1.3}

**Figure** <a id="fig-positivefeedbackplotasfuncofk"></a> `fig:PositiveFeedbackPlotAsFuncOfK`

*Caption:* $v_1$ and $v_2$ plotted against $x$ concentration. Intersection points on the curves mark the steady state points. Panel a) One intersection point at a high steady state; b) Three steady states; c) One low steady state.

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}
\begin{axis}[
ytick={0,1},
%xtick={0,50,100},
ylabel shift=-10pt,
xmin=0,
xmax=4,
ymin=0,
ymax=1,
width=4.45cm,
height=4.5cm,
xlabel=$x$,
ylabel=$v$]
  \addplot[color=red,line width=1.5pt] expression[domain=0:4,samples=120]{x*0.26};
  \addplot[color=blue,line width=1.5pt,style=dashed] expression[domain=0:4,samples=100]{0.1+(0.9*x^4)/(0.3+x^4)};

  \fill [red] (axis cs:3.8,1) circle (3pt);
  \node at (axis cs:0.25,0.9) {a};
  \node at (axis cs:2.6,0.3) {\small$k_3 = 0.26$};

\end{axis}
\end{tikzpicture}
%
\begin{tikzpicture}
\begin{axis}[
ytick=\empty,
xmin=0,
xmax=1.5,
ymin=0,
ymax=1,
width=4.45cm,
height=4.5cm,
xlabel=$x$]
  \addplot[color=red,line width=1.5pt] expression[domain=0:1.5,samples=100]{x*0.7};
  \addplot[color=blue,line width=1.5pt,style=dashed] expression[domain=0:1.5,samples=100]{0.1+(0.9*x^4)/(0.3+x^4)};

  \fill [red] (axis cs:0.145,0.1) circle (3pt);
  \fill [red] (axis cs:0.683,0.48) circle (3pt);
  \fill [red] (axis cs:1.31,0.91) circle (3pt);

  \node at (axis cs:0.15,0.9) {b};
  \node at (axis cs:1.1,0.3) {\small $k_3 = 0.7$};

\end{axis}
\end{tikzpicture}
%
\begin{tikzpicture}
\begin{axis}[
ytick=\empty,
xmin=0,
xmax=1.5,
ymin=0,
ymax=1,
width=4.45cm,
height=4.5cm,
xlabel=$x$]
  \addplot[color=red,line width=1.5pt] expression[domain=0:1.5,samples=100]{x*1.2};
  \addplot[color=blue,line width=1.5pt,style=dashed] expression[domain=0:1.5,samples=100]{0.1+(0.9*x^4)/(0.3+x^4)};

  \fill [red] (axis cs:0.09,0.095) circle (3pt);
  \node at (axis cs:0.15,0.9) {c};
  \node at (axis cs:1.1,0.3) {\small$k_3 = 1.2$};

\end{axis}
\end{tikzpicture}
\caption{$v_1$ and $v_2$ plotted against $x$ concentration. Intersection points on the curves mark the steady state points. Panel a) One intersection point at a high steady state; b) Three steady states; c) One low steady state.}
\label{fig:PositiveFeedbackPlotAsFuncOfK}
\end{figure}
```

We can determine the three different steady state stabilities by doing a simple graphical analysis on Figure [Figure: Reaction velocities, $v_1$ and $v_2$, as a function of $x$ for the sys](#fig-bistability). Figure [Figure: A graphical understanding of the stability of the steady states](#fig-bistabilitystabilitygraphical) shows the same plot but with perturbations.

**Figure** <a id="fig-bistabilitystabilitygraphical"></a> `fig:BistabilityStabilityGraphical`

*Caption:* A graphical understanding of the stability of the steady states. See text for details. Computed using the SBW rate law plotter. $k_1 = 0.9; k_2 = 0.3; k_3 = 0.7; b = 0.1$.

```latex
\begin{figure}[htp]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={$x$},
ylabel={$v_1$ and $v_2$},
xmin=0,
xmax=1.5,
ymin=0,
ymax=1,
width=10cm,
height=6cm]
\addplot[color=blue,line width=1.5pt] expression[domain=0:2,samples=100]{0.1+0.9*x^4/(0.3+x^4)};
\addplot[color=red,line width=1.5pt] expression[domain=0:2,samples=100]{0.7*x};

\node at (axis cs:1.05,0.9) {$v_1$};
\node at (axis cs:1.2,0.7) {$v_2$};

\fill [red] (axis cs:0.1525,0.098) circle (4pt);
\fill [red] (axis cs:0.682,0.48) circle (4pt);
\fill [red] (axis cs:1.32,0.92) circle (4pt);

\fill [orange] (axis cs:0.37,0.155) circle (3pt);
\fill [blue] (axis cs:0.37,0.26) circle (3pt);
\draw[line width=2pt,-latex,red] (axis cs:0.1524,0.098) -- (axis cs:0.37,0.098);
\node at (axis cs:0.265,0.04) {$\delta x$};

\node at (axis cs:0.24,0.44) {$v_2 > v_1$};
\node at (axis cs:0.24,0.33) {$dx/dt < 0$};

\draw[line width=2pt,-latex,red] (axis cs:0.682,0.48) -- (axis cs:0.9,0.48);
\node at (axis cs:0.78,0.4) {$\delta x$};

\fill [orange] (axis cs:0.9,0.63) circle (3pt);
\fill [blue] (axis cs:0.9,0.72) circle (3pt);

\node at (axis cs:0.73,0.92) {$v_1 > v_2$};
\node at (axis cs:0.73,0.8) {$dx/dt > 0$};

\end{axis}
\end{tikzpicture}
\caption{A graphical understanding of the stability of the steady states. See text for details. Computed using the SBW rate law plotter. $k_1 = 0.9; k_2 = 0.3; k_3 = 0.7; b = 0.1$.}
\label{fig:BistabilityStabilityGraphical}
\end{figure}
```

Starting with the first steady state in the low left corner of Figure [Figure: A graphical understanding of the stability of the steady states](#fig-bistabilitystabilitygraphical), consider a perturbation made in $x$, $\delta x$. This means that both $v_1$ and $v_2$ increase, however $v_2 > v_1$ meaning that after the perturbation, the rate of change in $x$ is *negative*. Since it is negative, this restores the perturbation back to the steady state. The same logic applies to the upper steady state. This tells us that the lower and upper steady states are both stable.

What about the middle steady state? Consider again a perturbation, $\delta x$. This time $v_1 > v_2$ which means that the rate of change of $x$ is *positive*. Since it is positive, the perturbation, instead of falling back, continues to grow until $x$ reaches the upper steady state. We conclude that the middle steady state is unstable. This system possess three steady states, one unstable and two stable. Such a system is known as a **bistable system** because it can rest in one of two stable states but not the third.

Another way to observe the different steady states is to run a time-course simulation at many different starting points. Figure [Figure: Time course data generated from Tellurium model \ref{tbl:JarnacBistabi](#fig-bistabletraces) shows the plots generated using the script in Listing `tbl:JarnacBistability`. The plots show two steady states, a high state at around 40, and a low state at around 3. Notice that there is no third state observed. As we have already discussed, the middle steady state is unstable, and all trajectories diverge from this point. It is therefore not possible when doing a time-course simulation to observe an unstable steady state since there is no way to reach it.(footnote: The author has been reliably informed that running time backwards in a time-course simulation will cause the simulation to converge on the unstable steady state. The author has not tried this himself, however.}

<!-- Old equations -->
<!-- J1: $X -> x1; 5 + (k1*Xo*(x1+1)^3)/(((x1+1)^3)+10000); -->
<!-- x1 -> $w; k2*x1; -->

```python
import tellurium as te
import numpy

rr = te.loada ('''
    J1: $Xo -> x; 0.1 + k1*x^4/(k2+x^4);
    x -> $w; k3*x;

    k1 = 0.9;
    k2 = 0.3;
    k3 = 0.7;
    x = 0.05;
''')

m = rr.simulate(0, 15, 100)
for i in range(1, 10):
    rr.x = i*0.2
    mm = rr.simulate(0, 15, 100, ["x"])
    m = numpy.hstack((m, mm))
te.plotArray(m)
```

**Figure** <a id="fig-bistabletraces"></a> `fig:BistableTraces`

*Caption:* Time course data generated from Tellurium model `tbl:JarnacBistability`. Each line represents a different initial concentration for $x$. Some trajectories transition to the low state while others to the upper state.

```latex
\begin{figure}
\begin{center}
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Concentration, $x$},
xmin=0, xmax=15, ymin=0, ymax=1.5,
width=10cm,
height=6cm]
\addplot[color=red,line width=1.5pt] coordinates {
(         0,        1.1)(0.15151515,  1.1114443)( 0.3030303,  1.1224546)(0.45454545,  1.1330218)(0.60606061,  1.1431411)(0.75757576,  1.1528114)(0.90909091,  1.1620348)( 1.0606061,  1.1708163)
( 1.2121212,  1.1791634)( 1.3636364,  1.1870857)( 1.5151515,  1.1945941)( 1.6666667,  1.2017012)( 1.8181818,  1.2084203)(  1.969697,  1.2147657)( 2.1212121,   1.220752)( 2.2727273,  1.2263943)
( 2.4242424,  1.2317073)( 2.5757576,  1.2367068)( 2.7272727,  1.2414074)( 2.8787879,   1.245824)(  3.030303,  1.2499711)( 3.1818182,   1.253863)( 3.3333333,  1.2575138)( 3.4848485,  1.2609362)
( 3.6363636,  1.2641432)( 3.7878788,  1.2671469)( 3.9393939,  1.2699592)( 4.0909091,  1.2725913)( 4.2424242,  1.2750539)( 4.3939394,  1.2773571)( 4.5454545,  1.2795106)( 4.6969697,  1.2815237)
( 4.8484848,  1.2834049)(         5,  1.2851625)( 5.1515152,  1.2868043)( 5.3030303,  1.2883376)( 5.4545455,  1.2897693)( 5.6060606,  1.2911059)( 5.7575758,  1.2923534)( 5.9090909,  1.2935178)
( 6.0606061,  1.2946042)( 6.2121212,   1.295618)( 6.3636364,  1.2965637)( 6.5151515,  1.2974459)( 6.6666667,  1.2982687)( 6.8181818,   1.299036)(  6.969697,  1.2997516)( 7.1212121,  1.3004189)
( 7.2727273,  1.3010411)( 7.4242424,  1.3016211)( 7.5757576,  1.3021619)( 7.7272727,   1.302666)( 7.8787879,  1.3031358)(  8.030303,  1.3035738)( 8.1818182,   1.303982)( 8.3333333,  1.3043625)
( 8.4848485,  1.3047171)( 8.6363636,  1.3050475)( 8.7878788,  1.3053555)( 8.9393939,  1.3056424)( 9.0909091,  1.3059098)( 9.2424242,   1.306159)( 9.3939394,  1.3063912)( 9.5454545,  1.3066075)
( 9.6969697,  1.3068091)( 9.8484848,  1.3069969)(        10,  1.3071718)( 10.151515,  1.3073349)(  10.30303,  1.3074868)( 10.454545,  1.3076283)( 10.606061,  1.3077601)( 10.757576,   1.307883)
( 10.909091,  1.3079974)( 11.060606,   1.308104)( 11.212121,  1.3082034)( 11.363636,  1.3082959)( 11.515152,  1.3083821)( 11.666667,  1.3084625)( 11.818182,  1.3085373)( 11.969697,  1.3086065)
( 12.121212,  1.3086709)( 12.272727,   1.308731)( 12.424242,  1.3087869)( 12.575758,  1.3088392)( 12.727273,  1.3088878)( 12.878788,  1.3089332)( 13.030303,  1.3089755)( 13.181818,  1.3090149)
( 13.333333,  1.3090517)( 13.484848,   1.309086)( 13.636364,   1.309118)( 13.787879,  1.3091478)( 13.939394,  1.3091756)( 14.090909,  1.3092016)( 14.242424,  1.3092257)( 14.393939,  1.3092483)
( 14.545455,  1.3092693)(  14.69697,   1.309289)( 14.848485,  1.3093073)(        15,  1.3093243)};
\addplot[color=blue,line width=1.5pt] coordinates {
(         0,        0.1)(0.15151515,    0.10436)( 0.3030303, 0.10828936)(0.45454545, 0.11183146)(0.60606061, 0.11502519)(0.75757576, 0.11790546)(0.90909091, 0.12050362)( 1.0606061, 0.12284776)
( 1.2121212, 0.12496314)( 1.3636364, 0.12687241)( 1.5151515, 0.12859582)( 1.6666667, 0.13015176)( 1.8181818, 0.13155672)(  1.969697,  0.1328256)( 2.1212121, 0.13397168)( 2.2727273,  0.1350069)
( 2.4242424, 0.13594207)( 2.5757576, 0.13678695)( 2.7272727, 0.13755031)( 2.8787879, 0.13824009)(  3.030303, 0.13886343)( 3.1818182, 0.13942676)( 3.3333333,  0.1399359)( 3.4848485, 0.14039605)
( 3.6363636, 0.14081197)( 3.7878788, 0.14118794)( 3.9393939,  0.1415278)( 4.0909091, 0.14183503)( 4.2424242, 0.14211278)( 4.3939394, 0.14236392)( 4.5454545, 0.14259098)( 4.6969697, 0.14279627)
( 4.8484848, 0.14298187)(         5, 0.14314969)( 5.1515152, 0.14330142)( 5.3030303, 0.14343861)( 5.4545455, 0.14356266)( 5.6060606, 0.14367482)( 5.7575758, 0.14377623)( 5.9090909, 0.14386792)
( 6.0606061, 0.14395083)( 6.2121212,  0.1440258)( 6.3636364,  0.1440936)( 6.5151515,  0.1441549)( 6.6666667, 0.14421034)( 6.8181818, 0.14426046)(  6.969697,  0.1443058)( 7.1212121, 0.14434679)
( 7.2727273, 0.14438386)( 7.4242424, 0.14441738)( 7.5757576,  0.1444477)( 7.7272727, 0.14447511)( 7.8787879,  0.1444999)(  8.030303, 0.14452232)( 8.1818182,  0.1445426)( 8.3333333, 0.14456094)
( 8.4848485, 0.14457752)( 8.6363636, 0.14459252)( 8.7878788, 0.14460608)( 8.9393939, 0.14461835)( 9.0909091, 0.14462936)( 9.2424242, 0.14463933)( 9.3939394, 0.14464834)( 9.5454545, 0.14465651)
( 9.6969697, 0.14466389)( 9.8484848, 0.14467058)(        10, 0.14467663)( 10.151515, 0.14468211)(  10.30303, 0.14468707)( 10.454545, 0.14469156)( 10.606061, 0.14469563)( 10.757576, 0.14469931)
( 10.909091, 0.14470265)( 11.060606, 0.14470567)( 11.212121, 0.14470841)( 11.363636, 0.14471089)( 11.515152, 0.14471314)( 11.666667, 0.14471517)( 11.818182, 0.14471702)( 11.969697, 0.14471869)
( 12.121212, 0.14472021)( 12.272727, 0.14472158)( 12.424242, 0.14472283)( 12.575758, 0.14472396)( 12.727273, 0.14472498)( 12.878788, 0.14472591)( 13.030303, 0.14472676)( 13.181818, 0.14472752)
( 13.333333, 0.14472822)( 13.484848, 0.14472885)( 13.636364, 0.14472942)( 13.787879, 0.14472994)( 13.939394, 0.14473041)( 14.090909, 0.14473084)( 14.242424, 0.14473122)( 14.393939, 0.14473158)
( 14.545455, 0.14473189)(  14.69697, 0.14473218)( 14.848485, 0.14473245)(        15, 0.14473269)};
\addplot[color=green,line width=1.5pt] coordinates {
(         0,        0.2)(0.15151515, 0.19490104)( 0.3030303, 0.19025354)(0.45454545, 0.18602142)(0.60606061, 0.18217065)(0.75757576, 0.17866934)(0.90909091, 0.17548773)( 1.0606061, 0.17259814)
( 1.2121212, 0.16997503)( 1.3636364, 0.16759482)( 1.5151515, 0.16543581)( 1.6666667, 0.16347819)( 1.8181818,  0.1617036)(  1.969697, 0.16009534)( 2.1212121,   0.158638)( 2.2727273, 0.15731785)
( 2.4242424, 0.15612213)( 2.5757576, 0.15503934)( 2.7272727, 0.15405893)( 2.8787879, 0.15317135)(  3.030303, 0.15236789)( 3.1818182, 0.15164064)( 3.3333333, 0.15098243)( 3.4848485, 0.15038676)
( 3.6363636, 0.14984773)( 3.7878788, 0.14936001)( 3.9393939, 0.14891871)( 4.0909091, 0.14851944)( 4.2424242,  0.1481582)( 4.3939394, 0.14783141)( 4.5454545, 0.14753577)( 4.6969697, 0.14726829)
( 4.8484848, 0.14702632)(         5, 0.14680744)( 5.1515152, 0.14660946)( 5.3030303, 0.14643037)( 5.4545455, 0.14626839)( 5.6060606, 0.14612189)( 5.7575758, 0.14598938)( 5.9090909, 0.14586953)
( 6.0606061, 0.14576114)( 6.2121212, 0.14566311)( 6.3636364, 0.14557446)( 6.5151515, 0.14549429)( 6.6666667, 0.14542177)( 6.8181818, 0.14535619)(  6.969697, 0.14529688)( 7.1212121, 0.14524324)
( 7.2727273, 0.14519472)( 7.4242424, 0.14515085)( 7.5757576, 0.14511117)( 7.7272727, 0.14507528)( 7.8787879, 0.14504283)(  8.030303, 0.14501348)( 8.1818182, 0.14498693)( 8.3333333, 0.14496293)
( 8.4848485, 0.14494121)( 8.6363636, 0.14492158)( 8.7878788, 0.14490382)( 8.9393939, 0.14488776)( 9.0909091, 0.14487323)( 9.2424242, 0.14486009)( 9.3939394, 0.14484821)( 9.5454545, 0.14483754)
( 9.6969697, 0.14482789)( 9.8484848, 0.14481916)(        10, 0.14481125)( 10.151515,  0.1448041)(  10.30303, 0.14479762)( 10.454545, 0.14479176)( 10.606061, 0.14478645)( 10.757576, 0.14478164)
( 10.909091, 0.14477729)( 11.060606, 0.14477335)( 11.212121, 0.14476978)( 11.363636, 0.14476654)( 11.515152, 0.14476362)( 11.666667, 0.14476096)( 11.818182, 0.14475856)( 11.969697, 0.14475638)
( 12.121212, 0.14475441)( 12.272727, 0.14475262)( 12.424242,   0.144751)( 12.575758, 0.14474953)( 12.727273, 0.14474819)( 12.878788, 0.14474698)( 13.030303, 0.14474589)( 13.181818, 0.14474489)
( 13.333333, 0.14474399)( 13.484848, 0.14474318)( 13.636364, 0.14474243)( 13.787879, 0.14474176)( 13.939394, 0.14474115)( 14.090909, 0.14474059)( 14.242424, 0.14474009)( 14.393939, 0.14473963)
( 14.545455, 0.14473922)(  14.69697, 0.14473884)( 14.848485,  0.1447385)(        15, 0.14473819)};
\addplot[color=purple,line width=1.5pt] coordinates {
(         0,        0.3)(0.15151515, 0.28731195)( 0.3030303, 0.27541934)(0.45454545, 0.26432411)(0.60606061, 0.25401455)(0.75757576, 0.24446931)(0.90909091,  0.2356583)( 1.0606061, 0.22754668)
( 1.2121212, 0.22009591)( 1.3636364,  0.2132657)( 1.5151515, 0.20701482)( 1.6666667,  0.2013025)( 1.8181818, 0.19608897)(  1.969697, 0.19133588)( 2.1212121,  0.1870067)( 2.2727273, 0.18306689)
( 2.4242424, 0.17948405)( 2.5757576, 0.17622788)( 2.7272727, 0.17327023)( 2.8787879, 0.17058504)(  3.030303, 0.16814826)( 3.1818182, 0.16593775)( 3.3333333, 0.16393313)( 3.4848485, 0.16211597)
( 3.6363636, 0.16046902)( 3.7878788, 0.15897654)( 3.9393939,  0.1576245)( 4.0909091, 0.15639985)( 4.2424242, 0.15529081)( 4.3939394, 0.15428662)( 4.5454545, 0.15337747)( 4.6969697, 0.15255446)
( 4.8484848, 0.15180951)(         5, 0.15113527)( 5.1515152, 0.15052507)( 5.3030303, 0.14997288)( 5.4545455, 0.14947322)( 5.6060606, 0.14902115)( 5.7575758, 0.14861212)( 5.9090909, 0.14824205)
( 6.0606061, 0.14790726)( 6.2121212, 0.14760439)( 6.3636364, 0.14733036)( 6.5151515, 0.14708247)( 6.6666667, 0.14685824)( 6.8181818,  0.1466554)(  6.969697, 0.14647193)( 7.1212121, 0.14630598)
( 7.2727273, 0.14615588)( 7.4242424, 0.14602013)( 7.5757576, 0.14589734)( 7.7272727, 0.14578629)( 7.8787879, 0.14568586)(  8.030303, 0.14559503)( 8.1818182, 0.14551289)( 8.3333333,  0.1454386)
( 8.4848485, 0.14537141)( 8.6363636, 0.14531064)( 8.7878788, 0.14525568)( 8.9393939, 0.14520598)( 9.0909091, 0.14516103)( 9.2424242, 0.14512037)( 9.3939394, 0.14508361)( 9.5454545, 0.14505036)
( 9.6969697, 0.14502029)( 9.8484848, 0.14499309)(        10,  0.1449685)( 10.151515, 0.14494625)(  10.30303, 0.14492613)( 10.454545, 0.14490794)( 10.606061, 0.14489148)( 10.757576,  0.1448766)
( 10.909091, 0.14486314)( 11.060606, 0.14485097)( 11.212121, 0.14484004)( 11.363636, 0.14483015)( 11.515152,  0.1448212)( 11.666667,  0.1448131)( 11.818182, 0.14480577)( 11.969697, 0.14479913)
( 12.121212, 0.14479313)( 12.272727, 0.14478769)( 12.424242, 0.14478277)( 12.575758, 0.14477831)( 12.727273, 0.14477427)( 12.878788, 0.14477061)( 13.030303,  0.1447673)( 13.181818,  0.1447643)
( 13.333333, 0.14476158)( 13.484848, 0.14475912)( 13.636364, 0.14475689)( 13.787879, 0.14475487)( 13.939394, 0.14475304)( 14.090909, 0.14475138)( 14.242424, 0.14474987)( 14.393939, 0.14474851)
( 14.545455, 0.14474727)(  14.69697, 0.14474615)( 14.848485, 0.14474513)(        15,  0.1447442)};
\addplot[color=teal,line width=1.5pt] coordinates {
(         0,        0.4)(0.15151515, 0.38353623)( 0.3030303, 0.36734577)(0.45454545, 0.35156957)(0.60606061, 0.33632726)(0.75757576, 0.32171703)(0.90909091,  0.3078126)( 1.0606061, 0.29466506)
( 1.2121212, 0.28230429)( 1.3636364, 0.27074143)( 1.5151515, 0.25997275)( 1.6666667, 0.24998209)( 1.8181818, 0.24074397)(  1.969697, 0.23222624)( 2.1212121,  0.2243923)( 2.2727273, 0.21720267)
( 2.4242424, 0.21061666)( 2.5757576, 0.20459307)( 2.7272727, 0.19909146)( 2.8787879, 0.19407261)(  3.030303, 0.18949888)( 3.1818182, 0.18533455)( 3.3333333, 0.18154595)( 3.4848485, 0.17810154)
( 3.6363636, 0.17497194)( 3.7878788, 0.17212983)( 3.9393939, 0.16955002)( 4.0909091, 0.16720925)( 4.2424242, 0.16508614)( 4.3939394, 0.16316118)( 4.5454545, 0.16141628)( 4.6969697, 0.15983498)
( 4.8484848, 0.15840213)(         5, 0.15710421)( 5.1515152, 0.15592865)( 5.3030303, 0.15486414)( 5.4545455, 0.15390032)( 5.6060606, 0.15302776)( 5.7575758, 0.15223792)( 5.9090909,   0.151523)
( 6.0606061, 0.15087597)( 6.2121212, 0.15029042)( 6.3636364, 0.14976055)( 6.5151515, 0.14928113)( 6.6666667, 0.14884734)( 6.8181818, 0.14845486)(  6.969697, 0.14809979)( 7.1212121, 0.14777856)
( 7.2727273, 0.14748796)( 7.4242424, 0.14722504)( 7.5757576,  0.1469872)( 7.7272727, 0.14677205)( 7.8787879, 0.14657745)(  8.030303, 0.14640142)( 8.1818182, 0.14624221)( 8.3333333,  0.1460982)
( 8.4848485, 0.14596795)( 8.6363636, 0.14585016)( 8.7878788, 0.14574362)( 8.9393939, 0.14564727)( 9.0909091, 0.14556013)( 9.2424242, 0.14548132)( 9.3939394, 0.14541005)( 9.5454545, 0.14534559)
( 9.6969697, 0.14528729)( 9.8484848, 0.14523456)(        10, 0.14518688)( 10.151515, 0.14514375)(  10.30303, 0.14510475)( 10.454545, 0.14506948)( 10.606061, 0.14503758)( 10.757576, 0.14500873)
( 10.909091, 0.14498264)( 11.060606, 0.14495904)( 11.212121,  0.1449377)( 11.363636,  0.1449184)( 11.515152, 0.14490095)( 11.666667, 0.14488516)( 11.818182, 0.14487088)( 11.969697, 0.14485797)
( 12.121212, 0.14484629)( 12.272727,  0.1448358)( 12.424242, 0.14482632)( 12.575758, 0.14481773)( 12.727273, 0.14480996)( 12.878788, 0.14480293)( 13.030303, 0.14479656)( 13.181818,  0.1447908)
( 13.333333, 0.14478558)( 13.484848, 0.14478086)( 13.636364, 0.14477658)( 13.787879,  0.1447727)( 13.939394,  0.1447692)( 14.090909, 0.14476602)( 14.242424, 0.14476314)( 14.393939, 0.14476053)
( 14.545455, 0.14475817)(  14.69697, 0.14475603)( 14.848485, 0.14475408)(        15, 0.14475233)};
\addplot[color=yellow,line width=1.5pt] coordinates {
(         0,        0.5)(0.15151515, 0.48528883)( 0.3030303, 0.46994889)(0.45454545, 0.45408643)(0.60606061, 0.43783107)(0.75757576, 0.42132955)(0.90909091, 0.40474112)( 1.0606061, 0.38822736)
( 1.2121212, 0.37194353)( 1.3636364, 0.35603511)( 1.5151515, 0.34062905)( 1.6666667, 0.32582946)( 1.8181818, 0.31171681)(  1.969697, 0.29834871)( 2.1212121, 0.28576079)( 2.2727273, 0.27396943)
( 2.4242424, 0.26297466)( 2.5757576, 0.25276345)( 2.7272727, 0.24331287)( 2.8787879, 0.23459252)(  3.030303, 0.22656682)( 3.1818182, 0.21919692)( 3.3333333,  0.2124424)( 3.4848485,   0.206262)
( 3.6363636, 0.20061507)( 3.7878788, 0.19546197)( 3.9393939, 0.19076458)( 4.0909091,  0.1864866)( 4.2424242, 0.18259378)( 4.3939394, 0.17905396)( 4.5454545, 0.17583714)( 4.6969697, 0.17291541)
( 4.8484848, 0.17026299)(         5, 0.16785607)( 5.1515152, 0.16567274)( 5.3030303, 0.16369285)( 5.4545455, 0.16189817)( 5.6060606, 0.16027165)( 5.7575758, 0.15879773)( 5.9090909, 0.15746253)
( 6.0606061, 0.15625316)( 6.2121212, 0.15515798)( 6.3636364, 0.15416635)( 6.5151515, 0.15326859)( 6.6666667, 0.15245591)( 6.8181818, 0.15172031)(  6.969697, 0.15105454)( 7.1212121, 0.15045202)
( 7.2727273, 0.14990677)( 7.4242424, 0.14941344)( 7.5757576, 0.14896705)( 7.7272727, 0.14856317)( 7.8787879, 0.14819777)(  8.030303,  0.1478672)( 8.1818182, 0.14756815)( 8.3333333, 0.14729758)
( 8.4848485, 0.14705282)( 8.6363636, 0.14683141)( 8.7878788, 0.14663114)( 8.9393939, 0.14644999)( 9.0909091, 0.14628613)( 9.2424242, 0.14613793)( 9.3939394, 0.14600389)( 9.5454545, 0.14588265)
( 9.6969697, 0.14577301)( 9.8484848, 0.14567385)(        10, 0.14558417)( 10.151515, 0.14550307)(  10.30303, 0.14542971)( 10.454545, 0.14536337)( 10.606061, 0.14530337)( 10.757576, 0.14524911)
( 10.909091, 0.14520003)( 11.060606, 0.14515565)( 11.212121, 0.14511551)( 11.363636, 0.14507921)( 11.515152, 0.14504638)( 11.666667, 0.14501669)( 11.818182, 0.14498984)( 11.969697, 0.14496555)
( 12.121212, 0.14494359)( 12.272727, 0.14492373)( 12.424242, 0.14490576)( 12.575758, 0.14488951)( 12.727273, 0.14487482)( 12.878788, 0.14486153)( 13.030303, 0.14484951)( 13.181818, 0.14483872)
( 13.333333, 0.14482896)( 13.484848, 0.14482012)( 13.636364, 0.14481212)( 13.787879, 0.14480489)( 13.939394, 0.14479833)( 14.090909,  0.1447924)( 14.242424, 0.14478703)( 14.393939, 0.14478217)
( 14.545455, 0.14477777)(  14.69697, 0.14477378)( 14.848485, 0.14477017)(        15,  0.1447669)};
\addplot[color=orange,line width=1.5pt] coordinates {
(         0,        0.6)(0.15151515, 0.59233026)( 0.3030303, 0.58398961)(0.45454545,  0.5749369)(0.60606061, 0.56513475)(0.75757576, 0.55455206)(0.90909091, 0.54316679)( 1.0606061, 0.53096983)
( 1.2121212, 0.51796812)( 1.3636364, 0.50418711)( 1.5151515, 0.48967729)( 1.6666667, 0.47451213)( 1.8181818, 0.45879039)(  1.969697, 0.44263656)( 2.1212121,  0.4261918)( 2.2727273, 0.40961183)
( 2.4242424, 0.39305904)( 2.5757576, 0.37669231)( 2.7272727, 0.36065961)( 2.8787879, 0.34509421)(  3.030303, 0.33010733)( 3.1818182, 0.31578594)( 3.3333333, 0.30219456)( 3.4848485, 0.28937504)
( 3.6363636, 0.27734913)( 3.7878788, 0.26612112)( 3.9393939, 0.25568175)( 4.0909091, 0.24601084)( 4.2424242, 0.23707954)( 4.3939394, 0.22885377)( 4.5454545, 0.22129546)( 4.6969697, 0.21436453)
( 4.8484848, 0.20801979)(         5, 0.20222037)( 5.1515152, 0.19692628)( 5.3030303, 0.19209892)( 5.4545455, 0.18770143)( 5.6060606, 0.18369893)( 5.7575758, 0.18005866)( 5.9090909, 0.17674997)
( 6.0606061, 0.17374436)( 6.2121212,  0.1710154)( 6.3636364, 0.16853874)( 6.5151515, 0.16629192)( 6.6666667, 0.16425428)( 6.8181818, 0.16240707)(  6.969697, 0.16073283)( 7.1212121, 0.15921555)
( 7.2727273, 0.15784101)( 7.4242424, 0.15659593)( 7.5757576, 0.15546837)( 7.7272727, 0.15444738)( 7.8787879, 0.15352301)(  8.030303, 0.15268621)( 8.1818182, 0.15192876)( 8.3333333, 0.15124319)
( 8.4848485, 0.15062274)( 8.6363636, 0.15006127)( 8.7878788,  0.1495532)( 8.9393939, 0.14909351)( 9.0909091, 0.14867758)( 9.2424242, 0.14830128)( 9.3939394, 0.14796084)( 9.5454545, 0.14765286)
( 9.6969697, 0.14737421)( 9.8484848, 0.14712214)(        10, 0.14689412)( 10.151515, 0.14668786)(  10.30303, 0.14650129)( 10.454545, 0.14633254)( 10.606061,  0.1461799)( 10.757576, 0.14604185)
( 10.909091, 0.14591699)( 11.060606, 0.14580406)( 11.212121, 0.14570193)( 11.363636, 0.14560957)( 11.515152, 0.14552603)( 11.666667, 0.14545049)( 11.818182, 0.14538216)( 11.969697, 0.14532036)
( 12.121212, 0.14526448)( 12.272727, 0.14521393)( 12.424242, 0.14516822)( 12.575758, 0.14512688)( 12.727273, 0.14508949)( 12.878788, 0.14505568)( 13.030303,  0.1450251)( 13.181818, 0.14499744)
( 13.333333, 0.14497243)( 13.484848, 0.14494981)( 13.636364, 0.14492935)( 13.787879, 0.14491085)( 13.939394, 0.14489412)( 14.090909, 0.14487898)( 14.242424, 0.14486529)( 14.393939, 0.14485291)
( 14.545455, 0.14484172)(  14.69697, 0.14483167)( 14.848485, 0.14482258)(        15, 0.14481435)};
\addplot[color=lime,line width=1.5pt] coordinates {
(         0,        0.7)(0.15151515, 0.70159785)( 0.3030303, 0.70333964)(0.45454545, 0.70523753)(0.60606061, 0.70730484)(0.75757576,  0.7095559)(0.90909091, 0.71200609)( 1.0606061, 0.71467185)
( 1.2121212, 0.71757069)( 1.3636364, 0.72072119)( 1.5151515, 0.72414299)( 1.6666667, 0.72785679)( 1.8181818, 0.73188421)(  1.969697, 0.73624772)( 2.1212121,  0.7409705)( 2.2727273, 0.74607616)
( 2.4242424, 0.75158854)( 2.5757576, 0.75753132)( 2.7272727, 0.76392756)( 2.8787879, 0.77079926)(  3.030303, 0.77816669)( 3.1818182, 0.78604772)( 3.3333333, 0.79445709)( 3.4848485, 0.80340562)
( 3.6363636, 0.81289923)( 3.7878788, 0.82293816)( 3.9393939, 0.83351665)( 4.0909091,  0.8446219)( 4.2424242, 0.85623318)( 4.3939394, 0.86832208)( 4.5454545, 0.88085388)( 4.6969697, 0.89378517)
( 4.8484848, 0.90706564)(         5, 0.92063911)( 5.1515152, 0.93444631)( 5.3030303, 0.94842344)( 5.4545455, 0.96250399)( 5.6060606, 0.97662315)( 5.7575758, 0.99071425)( 5.9090909,  1.0047168)
( 6.0606061,  1.0185711)( 6.2121212,  1.0322223)( 6.3636364,  1.0456209)( 6.5151515,  1.0587228)( 6.6666667,    1.07149)( 6.8181818,  1.0838904)(  6.969697,  1.0958975)( 7.1212121,  1.1074906)
( 7.2727273,  1.1186539)( 7.4242424,  1.1293769)( 7.5757576,  1.1396532)( 7.7272727,  1.1494804)( 7.8787879,  1.1588596)(  8.030303,  1.1677949)( 8.1818182,   1.176293)( 8.3333333,  1.1843627)
( 8.4848485,  1.1920145)( 8.6363636,  1.1992604)( 8.7878788,  1.2061137)( 8.9393939,  1.2125881)( 9.0909091,  1.2186983)( 9.2424242,  1.2244592)( 9.3939394,  1.2298855)( 9.5454545,  1.2349928)
( 9.6969697,  1.2397962)( 9.8484848,  1.2443105)(        10,  1.2485503)( 10.151515,  1.2525298)(  10.30303,  1.2562636)( 10.454545,  1.2597644)( 10.606061,  1.2630453)( 10.757576,  1.2661188)
( 10.909091,  1.2689967)( 11.060606,  1.2716906)( 11.212121,  1.2742112)( 11.363636,   1.276569)( 11.515152,  1.2787739)( 11.666667,   1.280835)( 11.818182,  1.2827614)( 11.969697,  1.2845614)
( 12.121212,  1.2862428)( 12.272727,  1.2878133)( 12.424242,  1.2892797)( 12.575758,  1.2906489)( 12.727273,  1.2919269)( 12.878788,  1.2931197)( 13.030303,  1.2942328)( 13.181818,  1.2952714)
( 13.333333,  1.2962404)( 13.484848,  1.2971443)( 13.636364,  1.2979874)( 13.787879,  1.2987737)( 13.939394,   1.299507)( 14.090909,  1.3001908)( 14.242424,  1.3008284)( 14.393939,  1.3014229)
( 14.545455,  1.3019771)(  14.69697,  1.3024937)( 14.848485,  1.3029753)(        15,  1.3034241)};
\addplot[color=magenta,line width=1.5pt] coordinates {
(         0,        0.8)(0.15151515, 0.80928968)( 0.3030303, 0.81912534)(0.45454545, 0.82950332)(0.60606061, 0.84041389)(0.75757576, 0.85183906)(0.90909091,  0.8637532)( 1.0606061, 0.87612435)
( 1.2121212, 0.88891204)( 1.3636364,  0.9020684)( 1.5151515, 0.91553934)( 1.6666667, 0.92926617)( 1.8181818, 0.94318758)(  1.969697,  0.9572368)( 2.1212121, 0.97134966)( 2.2727273, 0.98545802)
( 2.4242424, 0.99949965)( 2.5757576,   1.013416)( 2.7272727,  1.0271491)( 2.8787879,  1.0406475)(  3.030303,   1.053865)( 3.1818182,  1.0667613)( 3.3333333,  1.0793022)( 3.4848485,   1.091459)
( 3.6363636,  1.1032088)( 3.7878788,  1.1145342)( 3.9393939,  1.1254226)( 4.0909091,  1.1358663)( 4.2424242,  1.1458613)( 4.3939394,  1.1554076)( 4.5454545,  1.1645081)( 4.6969697,  1.1731686)
( 4.8484848,  1.1813972)(         5,  1.1892038)( 5.1515152,  1.1965999)( 5.3030303,  1.2035983)( 5.4545455,  1.2102126)( 5.6060606,  1.2164571)( 5.7575758,  1.2223468)( 5.9090909,  1.2278965)
( 6.0606061,  1.2331212)( 6.2121212,  1.2380365)( 6.3636364,   1.242657)( 6.5151515,  1.2469977)( 6.6666667,  1.2510728)( 6.8181818,  1.2548965)(  6.969697,  1.2584828)( 7.1212121,  1.2618444)
( 7.2727273,  1.2649939)( 7.4242424,  1.2679435)( 7.5757576,  1.2707049)( 7.7272727,   1.273289)( 7.8787879,  1.2757065)(  8.030303,  1.2779674)( 8.1818182,  1.2800811)( 8.3333333,  1.2820569)
( 8.4848485,  1.2839031)( 8.6363636,   1.285628)( 8.7878788,   1.287239)( 8.9393939,  1.2887436)( 9.0909091,  1.2901483)( 9.2424242,  1.2914596)( 9.3939394,  1.2926836)( 9.5454545,  1.2938259)
( 9.6969697,  1.2948917)( 9.8484848,  1.2958862)(        10,  1.2968139)( 10.151515,  1.2976792)(  10.30303,  1.2984863)( 10.454545,   1.299239)( 10.606061,  1.2999409)( 10.757576,  1.3005954)
( 10.909091,  1.3012056)( 11.060606,  1.3017745)( 11.212121,  1.3023049)( 11.363636,  1.3027993)( 11.515152,  1.3032601)( 11.666667,  1.3036896)( 11.818182,    1.30409)( 11.969697,  1.3044631)
( 12.121212,  1.3048108)( 12.272727,  1.3051349)( 12.424242,  1.3054369)( 12.575758,  1.3057183)( 12.727273,  1.3059805)( 12.878788,  1.3062249)( 13.030303,  1.3064525)( 13.181818,  1.3066647)
( 13.333333,  1.3068623)( 13.484848,  1.3070465)( 13.636364,  1.3072181)( 13.787879,   1.307378)( 13.939394,  1.3075269)( 14.090909,  1.3076657)( 14.242424,   1.307795)( 14.393939,  1.3079154)
( 14.545455,  1.3080277)(  14.69697,  1.3081322)( 14.848485,  1.3082296)(        15,  1.3083204)};
\addplot[color=cyan,line width=1.5pt] coordinates {
(         0,        0.9)(0.15151515, 0.91342578)( 0.3030303, 0.92711767)(0.45454545, 0.94101312)(0.60606061, 0.95504708)(0.75757576, 0.96915403)(0.90909091, 0.98326848)( 1.0606061, 0.99732463)
( 1.2121212,  1.0112645)( 1.3636364,  1.0250296)( 1.5151515,  1.0385676)( 1.6666667,  1.0518315)( 1.8181818,  1.0647801)(  1.969697,  1.0773782)( 2.1212121,  1.0895963)( 2.2727273,  1.1014107)
( 2.4242424,  1.1128029)( 2.5757576,  1.1237599)( 2.7272727,   1.134273)( 2.8787879,  1.1443378)(  3.030303,  1.1539537)( 3.1818182,  1.1631232)( 3.3333333,  1.1718516)( 3.4848485,  1.1801467)
( 3.6363636,  1.1880181)( 3.7878788,  1.1954772)( 3.9393939,  1.2025365)( 4.0909091,  1.2092095)( 4.2424242,  1.2155106)( 4.3939394,  1.2214543)( 4.5454545,  1.2270559)( 4.6969697,  1.2323301)
( 4.8484848,  1.2372925)(         5,  1.2419578)( 5.1515152,   1.246341)( 5.3030303,  1.2504565)( 5.4545455,  1.2543183)( 5.6060606,  1.2579407)( 5.7575758,  1.2613363)( 5.9090909,   1.264518)
( 6.0606061,  1.2674979)( 6.2121212,  1.2702878)( 6.3636364,  1.2728988)( 6.5151515,  1.2753414)( 6.6666667,   1.277626)( 6.8181818,   1.279762)(  6.969697,  1.2817586)( 7.1212121,  1.2836245)
( 7.2727273,  1.2853676)( 7.4242424,  1.2869959)( 7.5757576,  1.2885165)( 7.7272727,  1.2899363)( 7.8787879,  1.2912618)(  8.030303,   1.292499)( 8.1818182,  1.2936536)( 8.3333333,   1.294731)
( 8.4848485,  1.2957362)( 8.6363636,   1.296674)( 8.7878788,  1.2975487)( 8.9393939,  1.2983646)( 9.0909091,  1.2991255)( 9.2424242,  1.2998351)( 9.3939394,  1.3004967)( 9.5454545,  1.3011136)
( 9.6969697,  1.3016887)( 9.8484848,  1.3022249)(        10,  1.3027247)( 10.151515,  1.3031906)(  10.30303,  1.3036249)( 10.454545,  1.3040296)( 10.606061,  1.3044068)( 10.757576,  1.3047584)
( 10.909091,   1.305086)( 11.060606,  1.3053913)( 11.212121,  1.3056759)( 11.363636,   1.305941)( 11.515152,   1.306188)( 11.666667,  1.3064182)( 11.818182,  1.3066327)( 11.969697,  1.3068326)
( 12.121212,  1.3070187)( 12.272727,  1.3071922)( 12.424242,  1.3073539)( 12.575758,  1.3075045)( 12.727273,  1.3076448)( 12.878788,  1.3077755)( 13.030303,  1.3078973)( 13.181818,  1.3080107)
( 13.333333,  1.3081165)( 13.484848,  1.3082149)( 13.636364,  1.3083067)( 13.787879,  1.3083922)( 13.939394,  1.3084718)( 14.090909,  1.3085461)( 14.242424,  1.3086146)( 14.393939,  1.3086785)
( 14.545455,   1.308738)(  14.69697,  1.3087935)( 14.848485,  1.3088453)(        15,  1.3088935)};
\addplot[color=violet,line width=1.5pt] coordinates {
(         0,          1)(0.15151515,  1.0139107)( 0.3030303,  1.0276363)(0.45454545,  1.0411254)(0.60606061,  1.0543321)(0.75757576,  1.0672163)(0.90909091,  1.0797438)( 1.0606061,  1.0918864)
( 1.2121212,  1.1036213)( 1.3636364,  1.1149313)( 1.5151515,  1.1258039)( 1.6666667,  1.1362316)( 1.8181818,  1.1462105)(  1.969697,  1.1557408)( 2.1212121,  1.1648255)( 2.2727273,  1.1734704)
( 2.4242424,  1.1816837)( 2.5757576,  1.1894754)( 2.7272727,   1.196857)( 2.8787879,  1.2038414)(  3.030303,  1.2104423)( 3.1818182,  1.2166739)( 3.3333333,  1.2225511)( 3.4848485,  1.2280887)
( 3.6363636,   1.233302)( 3.7878788,  1.2382065)( 3.9393939,  1.2428168)( 4.0909091,  1.2471477)( 4.2424242,  1.2512136)( 4.3939394,  1.2550286)( 4.5454545,  1.2586066)( 4.6969697,  1.2619604)
( 4.8484848,  1.2651026)(         5,  1.2680453)( 5.1515152,  1.2708002)( 5.3030303,  1.2733782)( 5.4545455,  1.2757899)( 5.6060606,  1.2780453)( 5.7575758,   1.280154)( 5.9090909,   1.282125)
( 6.0606061,  1.2839668)( 6.2121212,  1.2856874)( 6.3636364,  1.2872946)( 6.5151515,  1.2887954)( 6.6666667,  1.2901967)( 6.8181818,  1.2915048)(  6.969697,  1.2927258)( 7.1212121,  1.2938652)
( 7.2727273,  1.2949284)( 7.4242424,  1.2959204)( 7.5757576,  1.2968458)( 7.7272727,   1.297709)( 7.8787879,  1.2985141)(  8.030303,  1.2992649)( 8.1818182,  1.2999651)( 8.3333333,  1.3006179)
( 8.4848485,  1.3012266)( 8.6363636,  1.3017941)( 8.7878788,  1.3023231)( 8.9393939,  1.3028163)( 9.0909091,   1.303276)( 9.2424242,  1.3037044)( 9.3939394,  1.3041038)( 9.5454545,  1.3044759)
( 9.6969697,  1.3048228)( 9.8484848,   1.305146)(        10,  1.3054473)( 10.151515,   1.305728)(  10.30303,  1.3059895)( 10.454545,  1.3062333)( 10.606061,  1.3064604)( 10.757576,   1.306672)
( 10.909091,  1.3068692)( 11.060606,  1.3070529)( 11.212121,   1.307224)( 11.363636,  1.3073835)( 11.515152,   1.307532)( 11.666667,  1.3076705)( 11.818182,  1.3077994)( 11.969697,  1.3079196)
( 12.121212,  1.3080315)( 12.272727,  1.3081358)( 12.424242,   1.308233)( 12.575758,  1.3083235)( 12.727273,  1.3084079)( 12.878788,  1.3084864)( 13.030303,  1.3085596)( 13.181818,  1.3086273)
( 13.333333,  1.3086903)( 13.484848,   1.308749)( 13.636364,  1.3088038)( 13.787879,  1.3088549)( 13.939394,  1.3089025)( 14.090909,  1.3089468)( 14.242424,  1.3089882)( 14.393939,  1.3090268)
( 14.545455,  1.3090628)(  14.69697,  1.3090963)( 14.848485,  1.3091276)(        15,  1.3091568)};
\end{axis}
\end{tikzpicture}
\end{center}
\caption{Time course data generated from Tellurium model~\ref{tbl:JarnacBistability}. Each line represents a different initial concentration for $x$. Some trajectories transition to the low state while others to the upper state.}
\label{fig:BistableTraces}
\end{figure}
```

<!-- \begin{figure} -->
<!-- \begin{center} -->
<!-- \begin{tikzpicture} -->
<!-- \begin{axis}[ -->
<!-- xlabel={Time}, -->
<!-- ylabel={Concentration, $x$}, -->
<!-- xmin=0, xmax=5, ymin=0, ymax=60, -->
<!-- width=10cm, -->
<!-- height=6cm] -->
<!-- \addplot[color=red,line width=1.5pt] coordinates { -->
<!-- (         0,          2)(0.050505051,  2.0597097)( 0.1010101,  2.1143525)(0.15151515,  2.1643806)( 0.2020202,  2.2102024)(0.25252525,  2.2521878)( 0.3030303,  2.2906716)(0.35353535,  2.3259573) -->
<!-- ( 0.4040404,  2.3583204)(0.45454545,   2.388012)(0.50505051,  2.4152569)(0.55555556,  2.4402647)(0.60606061,  2.4632242)(0.65656566,  2.4843093)(0.70707071,  2.5036746)(0.75757576,  2.5214636) -->
<!-- (0.80808081,  2.5378075)(0.85858586,  2.5528258)(0.90909091,   2.566628)(0.95959596,  2.5793143)(  1.010101,  2.5909761)( 1.0606061,  2.6016974)( 1.1111111,   2.611555)( 1.1616162,  2.6206194) -->
<!-- ( 1.2121212,  2.6289549)( 1.2626263,   2.636621)( 1.3131313,  2.6436716)( 1.3636364,  2.6501568)( 1.4141414,  2.6561232)( 1.4646465,  2.6616118)( 1.5151515,  2.6666612)( 1.5656566,  2.6713068) -->
<!-- ( 1.6161616,  2.6755811)( 1.6666667,  2.6795138)( 1.7171717,  2.6831324)( 1.7676768,   2.686462)( 1.8181818,  2.6895259)( 1.8686869,  2.6923454)( 1.9191919,  2.6949399)(  1.969697,  2.6973275) -->
<!-- (  2.020202,  2.6995248)( 2.0707071,  2.7015469)( 2.1212121,  2.7034079)( 2.1717172,  2.7051207)( 2.2222222,   2.706697)( 2.2727273,  2.7081479)( 2.3232323,  2.7094832)( 2.3737374,  2.7107123) -->
<!-- ( 2.4242424,  2.7118436)( 2.4747475,  2.7128848)( 2.5252525,  2.7138432)( 2.5757576,  2.7147253)( 2.6262626,  2.7155373)( 2.6767677,  2.7162847)( 2.7272727,  2.7169726)( 2.7777778,  2.7176059) -->
<!-- ( 2.8282828,  2.7181888)( 2.8787879,  2.7187254)( 2.9292929,  2.7192193)(  2.979798,  2.7196739)(  3.030303,  2.7200925)( 3.0808081,  2.7204778)( 3.1313131,  2.7208324)( 3.1818182,  2.7211589) -->
<!-- ( 3.2323232,  2.7214594)( 3.2828283,  2.7217361)( 3.3333333,  2.7219908)( 3.3838384,  2.7222253)( 3.4343434,  2.7224412)( 3.4848485,  2.7226399)( 3.5353535,  2.7228229)( 3.5858586,  2.7229899) -->
<!-- ( 3.6363636,  2.7231438)( 3.6868687,  2.7232855)( 3.7373737,  2.7234161)( 3.7878788,  2.7235364)( 3.8383838,  2.7236473)( 3.8888889,  2.7237495)( 3.9393939,  2.7238436)(  3.989899,  2.7239303) -->
<!-- (  4.040404,  2.7240103)( 4.0909091,  2.7240839)( 4.1414141,  2.7241518)( 4.1919192,  2.7242144)( 4.2424242,  2.7242721)( 4.2929293,  2.7243253)( 4.3434343,  2.7243744)( 4.3939394,  2.7244196) -->
<!-- ( 4.4444444,  2.7244613)( 4.4949495,  2.7244997)( 4.5454545,  2.7245351)( 4.5959596,  2.7245678)( 4.6464646,   2.724598)( 4.6969697,  2.7246258)( 4.7474747,  2.7246514)( 4.7979798,  2.7246751) -->
<!-- ( 4.8484848,  2.7246969)( 4.8989899,  2.7247171)( 4.9494949,  2.7247356)(         5,  2.7247528)}; -->
<!-- \addplot[color=blue,line width=1.5pt] coordinates { -->
<!-- (         0,          6)(0.050505051,  5.7972471)( 0.1010101,  5.6031053)(0.15151515,  5.4177599)( 0.2020202,  5.2413037)(0.25252525,  5.0737463)( 0.3030303,  4.9150281)(0.35353535,  4.7650207) -->
<!-- ( 0.4040404,  4.6235473)(0.45454545,  4.4903785)(0.50505051,  4.3652549)(0.55555556,  4.2478862)(0.60606061,  4.1379605)(0.65656566,  4.0351509)(0.70707071,  3.9391238)(0.75757576,  3.8495364) -->
<!-- (0.80808081,  3.7660486)(0.85858586,  3.6883234)(0.90909091,  3.6160299)(0.95959596,  3.5488455)(  1.010101,  3.4864578)( 1.0606061,  3.4285657)( 1.1111111,  3.3748805)( 1.1616162,  3.3251266) -->
<!-- ( 1.2121212,  3.2790414)( 1.2626263,  3.2363758)( 1.3131313,  3.1968943)( 1.3636364,  3.1603747)( 1.4141414,  3.1266082)( 1.4646465,  3.0953985)( 1.5151515,  3.0665631)( 1.5656566,  3.0399283) -->
<!-- ( 1.6161616,  3.0153329)( 1.6666667,  2.9926234)( 1.7171717,  2.9716639)( 1.7676768,  2.9523231)( 1.8181818,  2.9344796)( 1.8686869,  2.9180204)( 1.9191919,  2.9028404)(  1.969697,  2.8888425) -->
<!-- (  2.020202,  2.8759364)( 2.0707071,  2.8640385)( 2.1212121,  2.8530712)( 2.1717172,   2.842963)( 2.2222222,  2.8336475)( 2.2727273,  2.8250632)( 2.3232323,  2.8171536)( 2.3737374,  2.8098661) -->
<!-- ( 2.4242424,  2.8031522)( 2.4747475,  2.7969664)( 2.5252525,  2.7912681)( 2.5757576,  2.7860192)( 2.6262626,  2.7811845)( 2.6767677,  2.7767316)( 2.7272727,  2.7726305)( 2.7777778,  2.7688535) -->
<!-- ( 2.8282828,  2.7653753)( 2.8787879,  2.7621722)( 2.9292929,  2.7592226)(  2.979798,  2.7565065)(  3.030303,  2.7540056)( 3.0808081,  2.7517028)( 3.1313131,  2.7495825)( 3.1818182,  2.7476302) -->
<!-- ( 3.2323232,  2.7458327)( 3.2828283,  2.7441776)( 3.3333333,  2.7426538)( 3.3838384,  2.7412508)( 3.4343434,  2.7399591)( 3.4848485,  2.7387698)( 3.5353535,  2.7376749)( 3.5858586,  2.7366669) -->
<!-- ( 3.6363636,  2.7357389)( 3.6868687,  2.7348845)( 3.7373737,  2.7340979)( 3.7878788,  2.7333738)( 3.8383838,  2.7327071)( 3.8888889,  2.7320933)( 3.9393939,  2.7315283)(  3.989899,  2.7310081) -->
<!-- (  4.040404,  2.7305292)( 4.0909091,  2.7300883)( 4.1414141,  2.7296824)( 4.1919192,  2.7293087)( 4.2424242,  2.7289647)( 4.2929293,   2.728648)( 4.3434343,  2.7283564)( 4.3939394,   2.728088) -->
<!-- ( 4.4444444,  2.7278409)( 4.4949495,  2.7276134)( 4.5454545,  2.7274039)( 4.5959596,   2.727211)( 4.6464646,  2.7270334)( 4.6969697,  2.7268713)( 4.7474747,   2.726722)( 4.7979798,  2.7265844) -->
<!-- ( 4.8484848,  2.7264576)( 4.8989899,  2.7263409)( 4.9494949,  2.7262332)(         5,  2.7261341)}; -->
<!-- \addplot[color=green,line width=1.5pt] coordinates { -->
<!-- (         0,         12)(0.050505051,  11.832322)( 0.1010101,  11.656444)(0.15151515,  11.472329)( 0.2020202,   11.28001)(0.25252525,  11.079584)( 0.3030303,   10.87123)(0.35353535,  10.655224) -->
<!-- ( 0.4040404,  10.431934)(0.45454545,  10.201822)(0.50505051,  9.9654449)(0.55555556,  9.7234678)(0.60606061,  9.4766586)(0.65656566,  9.2258709)(0.70707071,  8.9720264)(0.75757576,  8.7161041) -->
<!-- (0.80808081,  8.4591747)(0.85858586,   8.202295)(0.90909091,  7.9465357)(0.95959596,  7.6929683)(  1.010101,  7.4426213)( 1.0606061,    7.19648)( 1.1111111,  6.9554486)( 1.1616162,  6.7203542) -->
<!-- ( 1.2121212,  6.4919272)( 1.2626263,  6.2707934)( 1.3131313,  6.0574758)( 1.3636364,  5.8523904)( 1.4141414,   5.655848)( 1.4646465,  5.4680604)( 1.5151515,   5.289145)( 1.5656566,  5.1191339) -->
<!-- ( 1.6161616,  4.9579851)( 1.6666667,   4.805588)( 1.7171717,  4.6617789)( 1.7676768,  4.5263397)( 1.8181818,  4.3990221)( 1.8686869,  4.2795422)( 1.9191919,  4.1675931)(  1.969697,  4.0628516) -->
<!-- (  2.020202,  3.9649859)( 2.0707071,  3.8736541)( 2.1212121,  3.7885156)( 2.1717172,  3.7092323)( 2.2222222,  3.6354713)( 2.2727273,  3.5669076)( 2.3232323,  3.5032257)( 2.3737374,  3.4441215) -->
<!-- ( 2.4242424,  3.3893026)( 2.4747475,  3.3384897)( 2.5252525,  3.2914168)( 2.5757576,  3.2478309)( 2.6262626,  3.2074928)( 2.6767677,  3.1701767)( 2.7272727,    3.13567)( 2.7777778,  3.1037731) -->
<!-- ( 2.8282828,  3.0742984)( 2.8787879,  3.0470726)( 2.9292929,  3.0219295)(  2.979798,  2.9987158)(  3.030303,  2.9772864)( 3.0808081,   2.957511)( 3.1313131,  2.9392656)( 3.1818182,  2.9224348) -->
<!-- ( 3.2323232,  2.9069115)( 3.2828283,  2.8925964)( 3.3333333,  2.8793973)( 3.3838384,  2.8672289)( 3.4343434,  2.8560119)( 3.4848485,  2.8456733)( 3.5353535,  2.8361451)( 3.5858586,  2.8273647) -->
<!-- ( 3.6363636,  2.8192741)( 3.6868687,  2.8118198)( 3.7373737,  2.8049521)( 3.7878788,  2.7986245)( 3.8383838,  2.7927954)( 3.8888889,   2.787426)( 3.9393939,  2.7824803)(  3.989899,  2.7779251) -->
<!-- (  4.040404,  2.7737297)( 4.0909091,  2.7698658)( 4.1414141,  2.7663075)( 4.1919192,  2.7630306)( 4.2424242,  2.7600131)( 4.2929293,  2.7572344)( 4.3434343,  2.7546758)( 4.3939394,  2.7523199) -->
<!-- ( 4.4444444,  2.7501507)( 4.4949495,  2.7481534)( 4.5454545,  2.7463144)( 4.5959596,  2.7446211)( 4.6464646,  2.7430621)( 4.6969697,  2.7416268)( 4.7474747,  2.7403052)( 4.7979798,  2.7390885) -->
<!-- ( 4.8484848,  2.7379684)( 4.8989899,  2.7369371)( 4.9494949,  2.7359876)(         5,  2.7351135)}; -->
<!-- \addplot[color=purple,line width=1.5pt] coordinates { -->
<!-- (         0,         18)(0.050505051,  18.240271)( 0.1010101,  18.497029)(0.15151515,  18.771087)( 0.2020202,  19.063214)(0.25252525,  19.374116)( 0.3030303,  19.704408)(0.35353535,  20.054587) -->
<!-- ( 0.4040404,  20.425006)(0.45454545,  20.815834)(0.50505051,  21.227032)(0.55555556,  21.658331)(0.60606061,   22.10922)(0.65656566,  22.578878)(0.70707071,  23.066218)(0.75757576,  23.569885) -->
<!-- (0.80808081,  24.088262)(0.85858586,  24.619446)(0.90909091,  25.161334)(0.95959596,  25.711689)(  1.010101,  26.268167)( 1.0606061,   26.82824)( 1.1111111,  27.389536)( 1.1616162,  27.949573) -->
<!-- ( 1.2121212,  28.506094)( 1.2626263,  29.056868)( 1.3131313,  29.599863)( 1.3636364,   30.13322)( 1.4141414,  30.655295)( 1.4646465,  31.164651)( 1.5151515,  31.660062)( 1.5656566,  32.140521) -->
<!-- ( 1.6161616,   32.60522)( 1.6666667,  33.053544)( 1.7171717,  33.485057)( 1.7676768,  33.899485)( 1.8181818,  34.296702)( 1.8686869,  34.676711)( 1.9191919,  35.039623)(  1.969697,  35.385654) -->
<!-- (  2.020202,  35.715096)( 2.0707071,  36.028313)( 2.1212121,  36.325727)( 2.1717172,  36.607805)( 2.2222222,  36.875046)( 2.2727273,  37.127975)( 2.3232323,  37.367137)( 2.3737374,  37.593086) -->
<!-- ( 2.4242424,  37.806382)( 2.4747475,  38.007585)( 2.5252525,  38.197239)( 2.5757576,  38.375901)( 2.6262626,  38.544118)( 2.6767677,  38.702404)( 2.7272727,   38.85127)( 2.7777778,  38.991213) -->
<!-- ( 2.8282828,  39.122709)( 2.8787879,  39.246219)( 2.9292929,  39.362197)(  2.979798,  39.471053)(  3.030303,  39.573192)( 3.0808081,  39.668999)( 3.1313131,  39.758843)( 3.1818182,  39.843071) -->
<!-- ( 3.2323232,  39.922016)( 3.2828283,  39.995993)( 3.3333333,  40.065299)( 3.3838384,  40.130217)( 3.4343434,  40.191013)( 3.4848485,   40.24794)( 3.5353535,  40.301235)( 3.5858586,  40.351122) -->
<!-- ( 3.6363636,  40.397813)( 3.6868687,  40.441508)( 3.7373737,  40.482392)( 3.7878788,  40.520644)( 3.8383838,   40.55643)( 3.8888889,  40.589904)( 3.9393939,  40.621214)(  3.989899,  40.650496) -->
<!-- (  4.040404,  40.677881)( 4.0909091,  40.703489)( 4.1414141,  40.727434)( 4.1919192,  40.749823)( 4.2424242,  40.770755)( 4.2929293,  40.790324)( 4.3434343,  40.808617)( 4.3939394,  40.825719) -->
<!-- ( 4.4444444,  40.841704)( 4.4949495,  40.856646)( 4.5454545,  40.870612)( 4.5959596,  40.883665)( 4.6464646,  40.895865)( 4.6969697,  40.907267)( 4.7474747,  40.917923)( 4.7979798,  40.927881) -->
<!-- ( 4.8484848,  40.937187)( 4.8989899,  40.945884)( 4.9494949,  40.954011)(         5,  40.961606)}; -->
<!-- \addplot[color=teal,line width=1.5pt] coordinates { -->
<!-- (         0,         24)(0.050505051,  24.529168)( 0.1010101,  25.069411)(0.15151515,  25.618522)( 0.2020202,  26.174123)(0.25252525,  26.733783)( 0.3030303,  27.295054)(0.35353535,  27.855467) -->
<!-- ( 0.4040404,  28.412742)(0.45454545,  28.964634)(0.50505051,  29.509074)(0.55555556,   30.04418)(0.60606061,  30.568261)(0.65656566,   31.07985)(0.70707071,  31.577685)(0.75757576,  32.060724) -->
<!-- (0.80808081,  32.528124)(0.85858586,  32.979239)(0.90909091,  33.413605)(0.95959596,  33.830922)(  1.010101,   34.23104)( 1.0606061,   34.61394)( 1.1111111,  34.979718)( 1.1616162,  35.328573) -->
<!-- ( 1.2121212,  35.660783)( 1.2626263,  35.976703)( 1.3131313,  36.276746)( 1.3636364,  36.561372)( 1.4141414,  36.831074)( 1.4646465,  37.086375)( 1.5151515,  37.327817)( 1.5656566,  37.555951) -->
<!-- ( 1.6161616,  37.771337)( 1.6666667,  37.974537)( 1.7171717,  38.166095)( 1.7676768,  38.346569)( 1.8181818,   38.51651)( 1.8686869,  38.676431)( 1.9191919,  38.826848)(  1.969697,  38.968259) -->
<!-- (  2.020202,  39.101144)( 2.0707071,  39.225967)( 2.1212121,  39.343185)( 2.1717172,  39.453211)( 2.2222222,  39.556453)( 2.2727273,    39.6533)( 2.3232323,  39.744123)( 2.3737374,  39.829272) -->
<!-- ( 2.4242424,  39.909084)( 2.4747475,  39.983876)( 2.5252525,  40.053948)( 2.5757576,  40.119585)( 2.6262626,  40.181057)( 2.6767677,  40.238618)( 2.7272727,  40.292508)( 2.7777778,  40.342954) -->
<!-- ( 2.8282828,  40.390169)( 2.8787879,  40.434355)( 2.9292929,    40.4757)(  2.979798,  40.514383)(  3.030303,  40.550572)( 3.0808081,  40.584425)( 3.1313131,  40.616089)( 3.1818182,  40.645704) -->
<!-- ( 3.2323232,  40.673399)( 3.2828283,  40.699298)( 3.3333333,  40.723516)( 3.3838384,  40.746159)( 3.4343434,  40.767329)( 3.4848485,  40.787121)( 3.5353535,  40.805624)( 3.5858586,   40.82292) -->
<!-- ( 3.6363636,  40.839088)( 3.6868687,  40.854201)( 3.7373737,  40.868327)( 3.7878788,  40.881529)( 3.8383838,  40.893869)( 3.8888889,  40.905401)( 3.9393939,  40.916179)(  3.989899,  40.926252) -->
<!-- (  4.040404,  40.935665)( 4.0909091,  40.944461)( 4.1414141,  40.952682)( 4.1919192,  40.960363)( 4.2424242,  40.967541)( 4.2929293,  40.974249)( 4.3434343,  40.980516)( 4.3939394,  40.986373) -->
<!-- ( 4.4444444,  40.991845)( 4.4949495,  40.996958)( 4.5454545,  41.001736)( 4.5959596,    41.0062)( 4.6464646,  41.010372)( 4.6969697,  41.014269)( 4.7474747,  41.017911)( 4.7979798,  41.021315) -->
<!-- ( 4.8484848,  41.024494)( 4.8989899,  41.027465)( 4.9494949,  41.030242)(         5,  41.032836)}; -->
<!-- \addplot[color=yellow,line width=1.5pt] coordinates { -->
<!-- (         0,         30)(0.050505051,  30.525058)( 0.1010101,  31.037739)(0.15151515,  31.536762)( 0.2020202,  32.021068)(0.25252525,  32.489799)( 0.3030303,  32.942291)(0.35353535,  33.378066) -->
<!-- ( 0.4040404,  33.796811)(0.45454545,  34.198364)(0.50505051,  34.582696)(0.55555556,  34.949895)(0.60606061,   35.30015)(0.65656566,  35.633734)(0.70707071,  35.950996)(0.75757576,  36.252345) -->
<!-- (0.80808081,  36.538237)(0.85858586,  36.809163)(0.90909091,  37.065643)(0.95959596,  37.308218)(  1.010101,  37.537439)( 1.0606061,  37.753867)( 1.1111111,   37.95806)( 1.1616162,  38.150566) -->
<!-- ( 1.2121212,  38.331943)( 1.2626263,  38.502742)( 1.3131313,  38.663478)( 1.3636364,  38.814668)( 1.4141414,   38.95681)( 1.4646465,  39.090388)( 1.5151515,  39.215865)( 1.5656566,  39.333702) -->
<!-- ( 1.6161616,  39.444311)( 1.6666667,  39.548103)( 1.7171717,  39.645468)( 1.7676768,  39.736779)( 1.8181818,  39.822388)( 1.8686869,  39.902632)( 1.9191919,   39.97783)(  1.969697,  40.048284) -->
<!-- (  2.020202,  40.114281)( 2.0707071,   40.17609)( 2.1212121,  40.233967)( 2.1717172,  40.288154)( 2.2222222,  40.338878)( 2.2727273,  40.386355)( 2.3232323,  40.430785)( 2.3737374,   40.47236) -->
<!-- ( 2.4242424,  40.511258)( 2.4747475,  40.547649)( 2.5252525,  40.581691)( 2.5757576,  40.613532)( 2.6262626,  40.643312)( 2.6767677,  40.671163)( 2.7272727,  40.697207)( 2.7777778,   40.72156) -->
<!-- ( 2.8282828,   40.74433)( 2.8787879,   40.76562)( 2.9292929,  40.785523)(  2.979798,   40.80413)(  3.030303,  40.821524)( 3.0808081,  40.837783)( 3.1313131,  40.852981)( 3.1818182,  40.867186) -->
<!-- ( 3.2323232,  40.880463)( 3.2828283,  40.892872)( 3.3333333,   40.90447)( 3.3838384,  40.915309)( 3.4343434,  40.925438)( 3.4848485,  40.934905)( 3.5353535,  40.943751)( 3.5858586,  40.952018) -->
<!-- ( 3.6363636,  40.959743)( 3.6868687,  40.966962)( 3.7373737,  40.973707)( 3.7878788,   40.98001)( 3.8383838,    40.9859)( 3.8888889,  40.991403)( 3.9393939,  40.996545)(  3.989899,   41.00135) -->
<!-- (  4.040404,   41.00584)( 4.0909091,  41.010035)( 4.1414141,  41.013955)( 4.1919192,  41.017617)( 4.2424242,   41.02104)( 4.2929293,  41.024238)( 4.3434343,  41.027226)( 4.3939394,  41.030018) -->
<!-- ( 4.4444444,  41.032626)( 4.4949495,  41.035064)( 4.5454545,  41.037342)( 4.5959596,  41.039451)( 4.6464646,  41.041424)( 4.6969697,  41.043268)( 4.7474747,  41.044992)( 4.7979798,  41.046604) -->
<!-- ( 4.8484848,  41.048111)( 4.8989899,   41.04952)( 4.9494949,  41.050838)(         5,   41.05207)}; -->
<!-- \addplot[color=orange,line width=1.5pt] coordinates { -->
<!-- (         0,         36)(0.050505051,  36.298858)( 0.1010101,  36.582334)(0.15151515,  36.850926)( 0.2020202,  37.105158)(0.25252525,   37.34557)( 0.3030303,  37.572719)(0.35353535,  37.787162) -->
<!-- ( 0.4040404,   37.98946)(0.45454545,  38.180158)(0.50505051,  38.359815)(0.55555556,  38.528977)(0.60606061,   38.68816)(0.65656566,  38.837877)(0.70707071,  38.978625)(0.75757576,  39.110883) -->
<!-- (0.80808081,  39.235113)(0.85858586,  39.351772)(0.90909091,   39.46127)(0.95959596,  39.564014)(  1.010101,  39.660391)( 1.0606061,  39.750771)( 1.1111111,  39.835505)( 1.1616162,  39.914925) -->
<!-- ( 1.2121212,  39.989349)( 1.2626263,  40.059075)( 1.3131313,  40.124388)( 1.3636364,  40.185554)( 1.4141414,  40.242829)( 1.4646465,   40.29645)( 1.5151515,  40.346644)( 1.5656566,  40.393622) -->
<!-- ( 1.6161616,  40.437586)( 1.6666667,  40.478723)( 1.7171717,  40.517211)( 1.7676768,  40.553218)( 1.8181818,    40.5869)( 1.8686869,  40.618404)( 1.9191919,  40.647869)(  1.969697,  40.675424) -->
<!-- (  2.020202,  40.701192)( 2.0707071,  40.725286)( 2.1212121,  40.747814)( 2.1717172,  40.768877)( 2.2222222,  40.788568)( 2.2727273,  40.806976)( 2.3232323,  40.824184)( 2.3737374,   40.84027) -->
<!-- ( 2.4242424,  40.855305)( 2.4747475,  40.869359)( 2.5252525,  40.882494)( 2.5757576,   40.89477)( 2.6262626,  40.906244)( 2.6767677,  40.916967)( 2.7272727,  40.926988)( 2.7777778,  40.936353) -->
<!-- ( 2.8282828,  40.945104)( 2.8787879,  40.953282)( 2.9292929,  40.960925)(  2.979798,  40.968066)(  3.030303,  40.974739)( 3.0808081,  40.980974)( 3.1313131,  40.986801)( 3.1818182,  40.992245) -->
<!-- ( 3.2323232,  40.997332)( 3.2828283,  41.002085)( 3.3333333,  41.006527)( 3.3838384,  41.010677)( 3.4343434,  41.014554)( 3.4848485,  41.018178)( 3.5353535,  41.021563)( 3.5858586,  41.024727) -->
<!-- ( 3.6363636,  41.027683)( 3.6868687,  41.030445)( 3.7373737,  41.033025)( 3.7878788,  41.035437)( 3.8383838,   41.03769)( 3.8888889,  41.039777)( 3.9393939,  41.041728)(  3.989899,  41.043552) -->
<!-- (  4.040404,  41.045258)( 4.0909091,  41.046852)( 4.1414141,  41.048344)( 4.1919192,  41.049738)( 4.2424242,  41.051041)( 4.2929293,   41.05226)( 4.3434343,    41.0534)( 4.3939394,  41.054466) -->
<!-- ( 4.4444444,  41.055463)( 4.4949495,  41.056396)( 4.5454545,  41.057268)( 4.5959596,  41.058083)( 4.6464646,  41.058846)( 4.6969697,   41.05956)( 4.7474747,  41.060227)( 4.7979798,  41.060852) -->
<!-- ( 4.8484848,  41.061436)( 4.8989899,  41.061982)( 4.9494949,  41.062493)(         5,  41.062971)}; -->
<!-- \addplot[color=lime,line width=1.5pt] coordinates { -->
<!-- (         0,         42)(0.050505051,   41.93781)( 0.1010101,   41.87984)(0.15151515,  41.825797)( 0.2020202,  41.775407)(0.25252525,  41.728419)( 0.3030303,  41.684597)(0.35353535,  41.643724) -->
<!-- ( 0.4040404,  41.605598)(0.45454545,   41.57003)(0.50505051,  41.536845)(0.55555556,  41.505882)(0.60606061,   41.47699)(0.65656566,  41.450027)(0.70707071,  41.424864)(0.75757576,  41.401379) -->
<!-- (0.80808081,  41.379458)(0.85858586,  41.358997)(0.90909091,  41.339897)(0.95959596,  41.322067)(  1.010101,  41.305421)( 1.0606061,  41.289881)( 1.1111111,  41.275372)( 1.1616162,  41.261825) -->
<!-- ( 1.2121212,  41.249176)( 1.2626263,  41.237365)( 1.3131313,  41.226336)( 1.3636364,  41.216038)( 1.4141414,   41.20642)( 1.4646465,  41.197439)( 1.5151515,  41.189052)( 1.5656566,  41.181219) -->
<!-- ( 1.6161616,  41.173904)( 1.6666667,  41.167072)( 1.7171717,  41.160691)( 1.7676768,  41.154732)( 1.8181818,  41.149166)( 1.8686869,  41.143967)( 1.9191919,  41.139111)(  1.969697,  41.134575) -->
<!-- (  2.020202,  41.130338)( 2.0707071,  41.126381)( 2.1212121,  41.122684)( 2.1717172,  41.119231)( 2.2222222,  41.116005)( 2.2727273,  41.112991)( 2.3232323,  41.110176)( 2.3737374,  41.107546) -->
<!-- ( 2.4242424,  41.105089)( 2.4747475,  41.102793)( 2.5252525,  41.100668)( 2.5757576,  41.098681)( 2.6262626,  41.096823)( 2.6767677,  41.095087)( 2.7272727,  41.093464)( 2.7777778,  41.091946) -->
<!-- ( 2.8282828,  41.090527)( 2.8787879,  41.089201)( 2.9292929,  41.087961)(  2.979798,  41.086801)(  3.030303,  41.085716)( 3.0808081,  41.084702)( 3.1313131,  41.083754)( 3.1818182,  41.082867) -->
<!-- ( 3.2323232,  41.082038)( 3.2828283,  41.081262)( 3.3333333,  41.080536)( 3.3838384,  41.079858)( 3.4343434,  41.079223)( 3.4848485,  41.078629)( 3.5353535,  41.078074)( 3.5858586,  41.077554) -->
<!-- ( 3.6363636,  41.077068)( 3.6868687,  41.076613)( 3.7373737,  41.076188)( 3.7878788,   41.07579)( 3.8383838,  41.075417)( 3.8888889,  41.075069)( 3.9393939,  41.074742)(  3.989899,  41.074437) -->
<!-- (  4.040404,  41.074151)( 4.0909091,  41.073884)( 4.1414141,  41.073634)( 4.1919192,    41.0734)( 4.2424242,   41.07318)( 4.2929293,  41.072975)( 4.3434343,  41.072783)( 4.3939394,  41.072603) -->
<!-- ( 4.4444444,  41.072436)( 4.4949495,  41.072278)( 4.5454545,  41.072131)( 4.5959596,  41.071994)( 4.6464646,  41.071865)( 4.6969697,  41.071744)( 4.7474747,  41.071631)( 4.7979798,  41.071525) -->
<!-- ( 4.8484848,  41.071426)( 4.8989899,  41.071333)( 4.9494949,  41.071246)(         5,  41.071165)}; -->
<!-- \addplot[color=magenta,line width=1.5pt] coordinates { -->
<!-- (         0,         48)(0.050505051,  47.497728)( 0.1010101,  47.034386)(0.15151515,  46.606707)( 0.2020202,   46.21168)(0.25252525,  45.846578)( 0.3030303,  45.508928)(0.35353535,  45.196484) -->
<!-- ( 0.4040404,  44.907204)(0.45454545,  44.639231)(0.50505051,  44.390872)(0.55555556,  44.160582)(0.60606061,  43.946952)(0.65656566,  43.748692)(0.70707071,  43.564623)(0.75757576,  43.393665) -->
<!-- (0.80808081,  43.234827)(0.85858586,  43.087202)(0.90909091,  42.949953)(0.95959596,  42.822314)(  1.010101,  42.703579)( 1.0606061,  42.593084)( 1.1111111,  42.490242)( 1.1616162,  42.394502) -->
<!-- ( 1.2121212,  42.305352)( 1.2626263,  42.222324)( 1.3131313,  42.144981)( 1.3636364,  42.072921)( 1.4141414,  42.005772)( 1.4646465,   41.94319)( 1.5151515,  41.884856)( 1.5656566,  41.830473) -->
<!-- ( 1.6161616,  41.779767)( 1.6666667,  41.732485)( 1.7171717,  41.688389)( 1.7676768,  41.647261)( 1.8181818,  41.608897)( 1.8686869,  41.573108)( 1.9191919,  41.539718)(  1.969697,  41.508562) -->
<!-- (  2.020202,  41.479491)( 2.0707071,  41.452361)( 2.1212121,  41.427042)( 2.1717172,  41.403412)( 2.2222222,  41.381356)( 2.2727273,  41.360769)( 2.3232323,  41.341551)( 2.3737374,  41.323611) -->
<!-- ( 2.4242424,  41.306863)( 2.4747475,  41.291227)( 2.5252525,  41.276628)( 2.5757576,  41.262998)( 2.6262626,  41.250271)( 2.6767677,  41.238388)( 2.7272727,  41.227291)( 2.7777778,  41.216929) -->
<!-- ( 2.8282828,  41.207253)( 2.8787879,  41.198217)( 2.9292929,  41.189778)(  2.979798,  41.181897)(  3.030303,  41.174537)( 3.0808081,  41.167664)( 3.1313131,  41.161244)( 3.1818182,  41.155248) -->
<!-- ( 3.2323232,  41.149648)( 3.2828283,  41.144417)( 3.3333333,  41.139531)( 3.3838384,  41.134968)( 3.4343434,  41.130705)( 3.4848485,  41.126724)( 3.5353535,  41.123004)( 3.5858586,   41.11953) -->
<!-- ( 3.6363636,  41.116284)( 3.6868687,  41.113252)( 3.7373737,   41.11042)( 3.7878788,  41.107774)( 3.8383838,  41.105302)( 3.8888889,  41.102992)( 3.9393939,  41.100854)(  3.989899,  41.098855) -->
<!-- (  4.040404,  41.096986)( 4.0909091,  41.095239)( 4.1414141,  41.093606)( 4.1919192,  41.092079)( 4.2424242,  41.090651)( 4.2929293,  41.089317)( 4.3434343,  41.088069)( 4.3939394,  41.086902) -->
<!-- ( 4.4444444,  41.085811)( 4.4949495,  41.084791)( 4.5454545,  41.083837)( 4.5959596,  41.082945)( 4.6464646,   41.08211)( 4.6969697,   41.08133)( 4.7474747,    41.0806)( 4.7979798,  41.079917) -->
<!-- ( 4.8484848,  41.079278)( 4.8989899,  41.078681)( 4.9494949,  41.078122)(         5,    41.0776)}; -->
<!-- \addplot[color=cyan,line width=1.5pt] coordinates { -->
<!-- (         0,         54)(0.050505051,   53.01065)( 0.1010101,  52.103955)(0.15151515,  51.272286)( 0.2020202,   50.50878)(0.25252525,  49.807248)( 0.3030303,  49.162185)(0.35353535,  48.568529) -->
<!-- ( 0.4040404,   48.02176)(0.45454545,  47.517792)(0.50505051,  47.052899)(0.55555556,  46.623801)(0.60606061,  46.227474)(0.65656566,   45.86118)(0.70707071,  45.522436)(0.75757576,  45.208987) -->
<!-- (0.80808081,  44.918783)(0.85858586,   44.64996)(0.90909091,  44.400818)(0.95959596,  44.169806)(  1.010101,   43.95551)( 1.0606061,  43.756636)( 1.1111111,     43.572)( 1.1616162,  43.400518) -->
<!-- ( 1.2121212,  43.241195)( 1.2626263,  43.093121)( 1.3131313,  42.955457)( 1.3636364,  42.827434)( 1.4141414,  42.708342)( 1.4646465,  42.597516)( 1.5151515,  42.494368)( 1.5656566,  42.398343) -->
<!-- ( 1.6161616,   42.30893)( 1.6666667,  42.225656)( 1.7171717,  42.148085)( 1.7676768,  42.075813)( 1.8181818,  42.008468)( 1.8686869,  41.945703)( 1.9191919,  41.887198)(  1.969697,  41.832656) -->
<!-- (  2.020202,  41.781803)( 2.0707071,  41.734383)( 2.1212121,   41.69016)( 2.1717172,  41.648913)( 2.2222222,  41.610438)( 2.2727273,  41.574546)( 2.3232323,  41.541059)( 2.3737374,  41.509814) -->
<!-- ( 2.4242424,  41.480658)( 2.4747475,  41.453451)( 2.5252525,   41.42806)( 2.5757576,  41.404361)( 2.6262626,  41.382242)( 2.6767677,  41.361596)( 2.7272727,  41.342323)( 2.7777778,  41.324332) -->
<!-- ( 2.8282828,  41.307536)( 2.8787879,  41.291855)( 2.9292929,  41.277215)(  2.979798,  41.263545)(  3.030303,  41.250782)( 3.0808081,  41.238865)( 3.1313131,  41.227737)( 3.1818182,  41.217346) -->
<!-- ( 3.2323232,  41.207642)( 3.2828283,   41.19858)( 3.3333333,  41.190117)( 3.3838384,  41.182214)( 3.4343434,  41.174833)( 3.4848485,   41.16794)( 3.5353535,  41.161502)( 3.5858586,  41.155489) -->
<!-- ( 3.6363636,  41.149873)( 3.6868687,  41.144627)( 3.7373737,  41.139728)( 3.7878788,  41.135151)( 3.8383838,  41.130877)( 3.8888889,  41.126884)( 3.9393939,  41.123154)(  3.989899,  41.119669) -->
<!-- (  4.040404,  41.116415)( 4.0909091,  41.113374)( 4.1414141,  41.110534)( 4.1919192,   41.10788)( 4.2424242,  41.105401)( 4.2929293,  41.103085)( 4.3434343,   41.10094)( 4.3939394,  41.098936) -->
<!-- ( 4.4444444,  41.097062)( 4.4949495,   41.09531)( 4.5454545,  41.093672)( 4.5959596,  41.092141)( 4.6464646,  41.090709)( 4.6969697,  41.089371)( 4.7474747,   41.08812)( 4.7979798,   41.08695) -->
<!-- ( 4.8484848,  41.085855)( 4.8989899,  41.084832)( 4.9494949,  41.083876)(         5,  41.082981)}; -->
<!-- \addplot[color=violet,line width=1.5pt] coordinates { -->
<!-- (         0,         60)(0.050505051,  58.494844)( 0.1010101,   57.12112)(0.15151515,  55.866256)( 0.2020202,  54.718957)(0.25252525,   53.66906)( 0.3030303,  52.707447)(0.35353535,   51.82592) -->
<!-- ( 0.4040404,  51.017111)(0.45454545,  50.274384)(0.50505051,  49.591806)(0.55555556,  48.963964)(0.60606061,   48.38601)(0.65656566,   47.85357)(0.70707071,  47.362643)(0.75757576,  46.909729) -->
<!-- (0.80808081,  46.491593)(0.85858586,  46.105311)(0.90909091,  45.748227)(0.95959596,  45.417937)(  1.010101,  45.112255)( 1.0606061,  44.829194)( 1.1111111,  44.566943)( 1.1616162,  44.323854) -->
<!-- ( 1.2121212,  44.098422)( 1.2626263,  43.889272)( 1.3131313,  43.695148)( 1.3636364,  43.514899)( 1.4141414,  43.347472)( 1.4646465,    43.1919)( 1.5151515,  43.047296)( 1.5656566,  42.912846) -->
<!-- ( 1.6161616,  42.787799)( 1.6666667,  42.671466)( 1.7171717,  42.563197)( 1.7676768,  42.462422)( 1.8181818,  42.368598)( 1.8686869,  42.281229)( 1.9191919,  42.199854)(  1.969697,  42.124047) -->
<!-- (  2.020202,  42.053415)( 2.0707071,  41.987594)( 2.1212121,  41.926247)( 2.1717172,  41.869061)( 2.2222222,  41.815747)( 2.2727273,  41.766036)( 2.3232323,  41.719679)( 2.3737374,  41.676446) -->
<!-- ( 2.4242424,  41.636121)( 2.4747475,  41.598505)( 2.5252525,  41.563413)( 2.5757576,  41.530671)( 2.6262626,  41.500121)( 2.6767677,  41.471614)( 2.7272727,   41.44501)( 2.7777778,  41.420182) -->
<!-- ( 2.8282828,  41.397009)( 2.8787879,  41.375379)( 2.9292929,   41.35519)(  2.979798,  41.336343)(  3.030303,  41.318749)( 3.0808081,  41.302323)( 3.1313131,  41.286989)( 3.1818182,  41.272671) -->
<!-- ( 3.2323232,  41.259303)( 3.2828283,  41.246822)( 3.3333333,  41.235167)( 3.3838384,  41.224283)( 3.4343434,  41.214121)( 3.4848485,   41.20463)( 3.5353535,  41.195768)( 3.5858586,  41.187491) -->
<!-- ( 3.6363636,  41.179761)( 3.6868687,  41.172542)( 3.7373737,    41.1658)( 3.7878788,  41.159503)( 3.8383838,  41.153622)( 3.8888889,  41.148129)( 3.9393939,  41.142999)(  3.989899,  41.138207) -->
<!-- (  4.040404,  41.133731)( 4.0909091,   41.12955)( 4.1414141,  41.125644)( 4.1919192,  41.121996)( 4.2424242,  41.118588)( 4.2929293,  41.115404)( 4.3434343,   41.11243)( 4.3939394,  41.109652) -->
<!-- ( 4.4444444,  41.107056)( 4.4949495,  41.104631)( 4.5454545,  41.102366)( 4.5959596,  41.100268)( 4.6464646,  41.098307)( 4.6969697,  41.096474)( 4.7474747,  41.094761)( 4.7979798,  41.093159) -->
<!-- ( 4.8484848,  41.091661)( 4.8989899,  41.090261)( 4.9494949,  41.088952)(         5,  41.087727)}; -->
<!-- \end{axis} -->
<!-- \end{tikzpicture} -->
<!-- \end{center} -->
<!-- \caption{Time course data generated from Jarnac model~\ref{tbl:JarnacBistability}. Each line represents a different initial concentration for $x$. Some trajectories transition to the low state while others to the upper state.} -->
<!-- \label{fig:BistableTraces} -->
<!-- \end{figure} -->

We can get an estimate for the values of all three steady states from Figure [Figure: Reaction velocities, $v_1$ and $v_2$, as a function of $x$ for the sys](#fig-bistability). Reading from the graph we find $x$ values at $0.145, 0.683$, and $1.309$. It is also possible to use the steady state solver from Tellurium to locate the steady states. Listing `jarnac:BistableSS` shows a simple script to compute them. By setting an appropriate initial condition, we can use Tellurium to pin point all three steady states. For example, if we use an initial value of $x$ at 0.43, the steady state solver will locate the third steady state at 0.683. Steady state solvers such as the one included with Tellurium can be used to find unstable states, providing the initial starting point is close enough.

```python
import tellurium as te

r = te.loada ('''
    $Xo -> x; 0.1 + k1*x^4/(k2+x^4);
    x -> $w; k3*x;

    // Initialization here
    k1 = 0.9; k2 = 0.3;
    k3 = 0.7;
''')

# Compute steady state
print (r.getSteadyStateValues())
```

### Stability of Positive Feedback

What determines the stability of a positive feedback system? Let us consider the same genetic network with positive feedback as before (Figure [Figure: System with Positive Feedback](#fig-genepositivefeedbacka)). The differential equation for this system is:

$$ \frac{dx}{dt} = v_1 (x) - v_2 (x) $$

where we have explicitly shown that each reaction rate is a function of $x$. To determine whether the system is stable to small perturbations we can differentiate the equation with respect to $x$ to form the Jacobian. Notice there is only one element in the Jacobian because we only have one state variable:

$$ \frac{dx/dt}{dx} = \frac{\partial v_1}{\partial x} - \frac{\partial v_2}{\partial x} $$

The terms on the right are unscaled elasticities [[appendix_e_enzyme_kinetics_in_a_nutshell|Unscaled Elasticity]]. If the expression is positive, the system is unstable because it means that $dx/dt$ increase if we increase $x$. We can scale both sides to yield:

$$ J_s = \varepsilon^1_x - \varepsilon^2_x $$

where the right-hand term now includes the scaled elasticities [[appendix_e_enzyme_kinetics_in_a_nutshell|Elasticities]]. The criteria for stability is that $\varepsilon^1_x > \varepsilon^2_x$. Therefore, if the positive feedback is stronger than the effect of $x$ on the degradation step $v_2$, the system will be unstable.

**Table** <a id="tbl-orderelasticity"></a> `tbl:OrderElasticity`

```latex
\begin{table}
\centering
\begin{tabular}{ll}\toprule
Kinetic Order & Elasticity \\ \midrule
First-Order & 1.0 \\
Zero-Order & 0.0 \\
Sigmoidal & $> 1.0$ \\ \bottomrule
\end{tabular}
\caption{} \label{tbl:OrderElasticity}
\end{table}
```

Recall that the elasticities are a measure of the kinetic order of the reaction. Thus an elasticity of one means the reaction is first-order. A saturable irreversible Michaelis-Menten reaction will have a variable kinetic order between one and zero (near saturation). A Hill equation can, depending on the Hill coefficient, have kinetic orders greater than one (Table [Table: tbl:OrderElasticity](#tbl-orderelasticity)). Knowing this information, there are at least two ways to make sure that the elasticity for the feedback elasticity, $v_1$, is greater than the elasticity for the degradation step, $v_2$:

- $v_1$ is modeled using a Hill equation with a Hill coefficient > 1 and $v_2$ is first-order or less.   
- A Hill coefficient = 1 on $v_1$, with Michaelis-Menten saturable kinetics on $v_2$ to ensure less than first-order kinetics on $v_2$.

By substituting the three possible steady state values for $x$ into the equation for $dx/dt$,we can compute the value for the Jacobian element in each case (Table [Table: Table of steady state values of $x$ and corresponding values for the
J](#table-bistable)).

**Table** <a id="table-bistable"></a> `Table:Bistable`

*Caption:* Table of steady state values of $x$ and corresponding values for the
Jacobian element. Negative Jacobian values indicate a stable steady
state, positive elements indicate an unstable steady state. The
table shows one stable and two unstable steady states.

```latex
\begin{table}[htb]
\centering
\begin{tabular}{rrr}
Steady State $x$ & Jacobian: $(d\!x/dt)/d\!x$ & Elasticity, $\varepsilon^{v_1}_x$ \\ \midrule
0.145 & -0.664 & 0.052 \\
0.683 & 0.585 & 1.835 \\
1.309 & -0.47 & 0.33 \\ \bottomrule
\end{tabular}
\caption{Table of steady state values of $x$ and corresponding values for the
Jacobian element. Negative Jacobian values indicate a stable steady
state, positive elements indicate an unstable steady state. The
table shows one stable and two unstable steady states.}
\label{Table:Bistable}
\end{table}
```

The unstable steady state at $x=0.683$ has an elasticity for $v_1$ of 1.835. Note this value is greater than the elasticity of the first-order degradation reaction, $v_2$, which equals one. Therefore this state is unstable.

## Bifurcation Plot

Let's now return to the question of plotting a bifurcation graph for the bistable system in Figure [Figure: System with Positive Feedback](#fig-genepositivefeedbacka). Figure [Figure: $v_1$ and $v_2$ plotted against $x$ concentration](#fig-positivefeedbackplotasfuncofk) shows both reaction rates, $v_1$ and $v_2$ plotted as a function of the intermediate species $x$. In this figure we see three intersection points, marking the three possible steady states. By varying the degradation constant $k_3$, we can change the behavior of the system so that it exhibits a single high steady state, three separate steady states, or a single low steady state (See Figure [Figure: Reaction velocities, $v_1$ and $v_2$, as a function of $x$ for the sys](#fig-bistability)).

<!-- \pgfplotsset{compat=1.3} -->
<!-- \begin{figure}[htb] -->
<!-- \centering -->
<!-- \begin{tikzpicture} -->
<!-- \begin{axis}[ -->
<!-- ytick={0,50,100}, -->
<!-- xtick={0,50,100}, -->
<!-- ylabel shift=-10pt, -->
<!-- xmin=0, -->
<!-- xmax=140, -->
<!-- ymin=0, -->
<!-- ymax=100, -->
<!-- width=4.45cm, -->
<!-- height=4.5cm, -->
<!-- xlabel=$x$, -->
<!-- ylabel=$v$] -->
<!-- \addplot[color=red,line width=1.5pt] expression[domain=0:140,samples=120]{x*0.75}; -->
<!-- \addplot[color=blue,line width=1.5pt,style=dashed] expression[domain=0:140,samples=100]{(5+(87.5*1*(1+x)^3)/(10000+(1+x)^3))}; -->

<!-- \fill [red] (axis cs:123,92) circle (3pt); -->
<!-- \node at (axis cs:10,90) {a}; -->
<!-- \node at (axis cs:100,40) {\small$k_2 = 0.75$}; -->

<!-- \end{axis} -->
<!-- \end{tikzpicture} -->

<!-- \begin{tikzpicture} -->
<!-- \begin{axis}[ -->
<!-- ytick=\empty, -->
<!-- xmin=0, -->
<!-- xmax=60, -->
<!-- ymin=0, -->
<!-- ymax=100, -->
<!-- width=4.45cm, -->
<!-- height=4.5cm, -->
<!-- xlabel=$x$] -->
<!-- \addplot[color=red,line width=1.5pt] expression[domain=0:60,samples=100]{x*2}; -->
<!-- \addplot[color=blue,line width=1.5pt,style=dashed] expression[domain=0:60,samples=100]{(5+(87.5*1*(1+x)^3)/(10000+(1+x)^3))}; -->

<!-- \fill [red] (axis cs:2.72,5.44) circle (3pt); -->
<!-- \fill [red] (axis cs:41.07,82.14) circle (3pt); -->
<!-- \fill [red] (axis cs:14.69,29.38) circle (3pt); -->

<!-- \node at (axis cs:5,90) {b}; -->
<!-- \node at (axis cs:40,40) {\small $k_2 = 2.0$}; -->

<!-- \end{axis} -->
<!-- \end{tikzpicture} -->

<!-- \begin{tikzpicture} -->
<!-- \begin{axis}[ -->
<!-- ytick=\empty, -->
<!-- xmin=0, -->
<!-- xmax=60, -->
<!-- ymin=0, -->
<!-- ymax=100, -->
<!-- width=4.45cm, -->
<!-- height=4.5cm, -->
<!-- xlabel=$x$] -->
<!-- \addplot[color=red,line width=1.5pt] expression[domain=0:60,samples=100]{x*4}; -->
<!-- \addplot[color=blue,line width=1.5pt,style=dashed] expression[domain=0:60,samples=100]{(5+(87.5*1*(1+x)^3)/(10000+(1+x)^3))}; -->

<!-- \fill [red] (axis cs:1.6,5.44) circle (3pt); -->
<!-- \node at (axis cs:5,90) {c}; -->
<!-- \node at (axis cs:40,40) {\small$k_2 = 4.0$}; -->

<!-- \end{axis} -->
<!-- \end{tikzpicture} -->
<!-- \caption{$v_1$ and $v_2$ plotted against $x$ concentration. Intersection points on the curves mark the steady state points. Panel a), One intersection point at a high steady state; b) Three steady states, c) One low steady state.} -->
<!-- \label{fig:PositiveFeedbackPlotAsFuncOfK} -->
<!-- \end{figure} -->

If we track the intersection points as we vary the value of the rate constant $k_3$, we obtain the bifurcation plot shown in Figure [Figure: Plotting intersection points from Figure \ref{fig:Bistability} as a fu](#fig-hysteresisbistable).

<!-- \begin{figure} -->
<!-- \begin{center} -->
<!-- \begin{tikzpicture} -->
<!-- \begin{axis}[ -->
<!-- xlabel={$k_2$}, -->
<!-- ylabel={Concentration, $x$}, -->
<!-- xmin=1, xmax=3, ymin=0, ymax=90, -->
<!-- width=10cm, -->
<!-- height=6cm] -->
<!-- \addplot[color=red,line width=1.5pt] coordinates { -->
<!-- (2.9816	,  1.737  )(2.93258,	1.76813) -->
<!-- (2.88411,	1.8001 )(2.83619,	1.83291)(2.78888,	1.86657)(2.74218,	1.90109) -->
<!-- (2.69614,	1.93647)(2.65078,	1.97273)(2.60613,	2.00985)(2.56222,	2.04785) -->
<!-- (2.51907,	2.08671)(2.47672,	2.12643)(2.43518,	2.16701)(2.39448,	2.20843) -->
<!-- (2.35464,	2.25067)(2.31568,	2.29373)(2.27761,	2.33758)(2.24046,	2.38221) -->
<!-- (2.20422,	2.42758)(2.16892,	2.47369)(2.13455,	2.52049)(2.10113,	2.56798) -->
<!-- (2.06864,	2.61611)(2.0371	,  2.66486)(2.0065	,  2.71421)(1.97682,	2.76413) -->
<!-- (1.94807,	2.81458)(1.92023,	2.86554)(1.8933 , 	2.91698)(1.86725,	2.96888) -->
<!-- (1.84207,	3.0212 )(1.81775,	3.07394)(1.79427,	3.12705)(1.77162,	3.18051) -->
<!-- (1.74976,	3.23431)(1.7287	,  3.28842)(1.70839,	3.34283)(1.68883,	3.3975 ) -->
<!-- (1.67	  ,3.45243  )(1.65188,	3.5076 )(1.63444,	3.56299)(1.61766,	3.61858) -->
<!-- (1.60154,	3.67436)(1.58604,	3.73033)(1.57115,	3.78646)(1.55686,	3.84274) -->
<!-- (1.54314,	3.89916)(1.52997,	3.95572)(1.51735,	4.0124 )(1.50525,	4.06919) -->
<!-- (1.49365,	4.12609)(1.48255,	4.18309)(1.47192,	4.24018)(1.46175,	4.29735) -->
<!-- (1.45204,	4.3546 )(1.44275,	4.41192)(1.43389,	4.46931)(1.42544,	4.52676) -->
<!-- (1.41738,	4.58427)(1.40971,	4.64183)(1.40241,	4.69943)(1.39547,	4.75709) -->
<!-- (1.38888,	4.81478)(1.38263,	4.87251)(1.37672,	4.93028)(1.37112,	4.98808) -->
<!-- (1.36584,	5.04591)(1.36086,	5.10376)(1.35618,	5.16164)(1.35178,	5.21954) -->
<!-- (1.34767,	5.27747)(1.34382,	5.33541)(1.34024,	5.39336)(1.33691,	5.45134) -->
<!-- (1.33384,	5.50933)(1.33018,	5.58525)(1.32621,	5.67912)(1.32283,	5.77302) -->
<!-- (1.32002,	5.86694)(1.31775,	5.96087)(1.31599,	6.05481)(1.31474,	6.14876) -->
<!-- (1.31397,	6.24271)(1.31365,	6.33667)(1.3137	,  6.40267)(1.3146 , 	6.55469) -->
<!-- (1.31656,	6.7067 )(1.31952,	6.8587 )(1.32342,	7.01068)(1.32819,	7.16263)}; -->

<!-- \addplot[color=blue,line width=1.5pt,style=dashed] coordinates { -->
<!-- (1.3338	,  7.31455)(1.34018,	7.46644)(1.3473 , 	7.6183 )(1.35511,	7.77013) -->
<!-- (1.36357,	7.92192)(1.37265,	8.07367)(1.3823	,  8.22539)(1.39249,	8.37708) -->
<!-- (1.4032	,  8.52873)(1.41618,	8.70426)(1.43166,	8.90366)(1.44784,	9.103  ) -->
<!-- (1.46466,	9.3023 )(1.48206,	9.50154)(1.49999,	9.70073)(1.5184	,  9.89988) -->
<!-- (1.53724,	10.099 )(1.55645,	10.2981)(1.57599,	10.4971)(1.59582,	10.6961) -->
<!-- (1.6159	,  10.8951)(1.63618,	11.0941)(1.65663,	11.293 )(1.6772	,  11.492 ) -->
<!-- (1.69787,	11.6909)(1.7186	,  11.8898)(1.73935,	12.0887)(1.76009,	12.2877) -->
<!-- (1.7808	,  12.4866)(1.80144,	12.6855)(1.82199,	12.8845)(1.84241,	13.0834) -->
<!-- (1.86269,	13.2824)(1.8828 , 	13.4814)(1.90272,	13.6804)(1.92242,	13.8794) -->
<!-- (1.94189,	14.0785)(1.9611	,  14.2775)(1.98004,	14.4766)(1.99868,	14.6758) -->
<!-- (2.01702,	14.8749)(2.03504,	15.0741)(2.05272,	15.2733)(2.07005,	15.4726) -->
<!-- (2.08702,	15.6719)(2.10362,	15.8712)(2.11984,	16.0705)(2.13566,	16.2699) -->
<!-- (2.15109,	16.4693)(2.1661	,  16.6687)(2.18071,	16.8682)(2.19489,	17.0677) -->
<!-- (2.20866,	17.2672)(2.22199,	17.4668)(2.23489,	17.6663)(2.24737,	17.866 ) -->
<!-- (2.2594 , 	18.0656)(2.27101,	18.2653)(2.28217,	18.4649)(2.2929	,  18.6647) -->
<!-- (2.3032	,  18.8644)(2.31306,	19.0641)(2.32249,	19.2639)(2.3315	,  19.4637) -->
<!-- (2.34008,	19.6635)(2.34823,	19.8634)(2.35597,	20.0632)(2.3633 , 	20.2631) -->
<!-- (2.37022,	20.463 )(2.37673,	20.6629)(2.38284,	20.8628)(2.38856,	21.0627) -->
<!-- (2.39389,	21.2626)(2.39885,	21.4626)(2.40342,	21.6625)(2.40763,	21.8625) -->
<!-- (2.41148,	22.0624)(2.41497,	22.2624)(2.41811,	22.4624)(2.42091,	22.6623) -->
<!-- (2.42338,	22.8623)(2.42552,	23.0623)(2.42734,	23.2623)(2.42884,	23.4623) -->
<!-- (2.43005,	23.6623)(2.43095,	23.8623)(2.43156,	24.0623)(2.43189,	24.2623) -->
<!-- (2.43196,	24.402 )}; -->

<!-- \addplot[color=red,line width=1.5pt] coordinates { -->
<!-- (2.43183,	24.602 )(2.43143,	24.802 )(2.43077,	25.002 ) -->
<!-- (2.42987,	25.202 )(2.42872,	25.402 )(2.42734,	25.602 )(2.42573,	25.802 ) -->
<!-- (2.4239	,  26.0019)(2.42185,	26.2019)(2.4196 , 	26.4019)(2.41714,	26.6019) -->
<!-- (2.41449,	26.8019)(2.41165,	27.0019)(2.40862,	27.2018)(2.40542,	27.4018) -->
<!-- (2.40205,	27.6018)(2.39851,	27.8018)(2.39482,	28.0017)(2.39097,	28.2017) -->
<!-- (2.38697,	28.4017)(2.38283,	28.6016)(2.37856,	28.8016)(2.37415,	29.0015) -->
<!-- (2.36962,	29.2015)(2.36496,	29.4014)(2.36019,	29.6014)(2.3553	,  29.8013) -->
<!-- (2.35031,	30.0012)(2.34521,	30.2012)(2.34001,	30.4011)(2.33472,	30.601 ) -->
<!-- (2.32934,	30.801 )(2.32387,	31.0009)(2.31832,	31.2008)(2.31269,	31.4007) -->
<!-- (2.30699,	31.6006)(2.30121,	31.8006)(2.29537,	32.0005)(2.28946,	32.2004) -->
<!-- (2.28349,	32.4003)(2.27746,	32.6002)(2.27138,	32.8001)(2.26524,	33     ) -->
<!-- (2.25906,	33.1999)(2.25283,	33.3998)(2.24655,	33.5997)(2.24024,	33.7996) -->
<!-- (2.23388,	33.9995)(2.22749,	34.1994)(2.22107,	34.3993)(2.21462,	34.5992) -->
<!-- (2.20814,	34.7991)(2.20163,	34.999 )(2.1951	,  35.1989)(2.18854,	35.3988) -->
<!-- (2.18197,	35.5987)(2.17537,	35.7986)(2.16876,	35.9985)(2.16214,	36.1984) -->
<!-- (2.1555	,  36.3982)(2.14885,	36.5981)(2.14219,	36.798 )(2.13553,	36.9979) -->
<!-- (2.12885,	37.1978)(2.12217,	37.3977)(2.11549,	37.5976)(2.10881,	37.7975) -->
<!-- (2.10212,	37.9974)(2.09543,	38.1972)(2.08875,	38.3971)(2.08207,	38.597 ) -->
<!-- (2.07539,	38.7969)(2.06871,	38.9968)(2.06205,	39.1967)(2.05538,	39.3966) -->
<!-- (2.04873,	39.5965)(2.04208,	39.7964)(2.03545,	39.9962)(2.02882,	40.1961) -->
<!-- (2.02221,	40.396 )(2.01561,	40.5959)(2.00902,	40.7958)(2.00244,	40.9957) -->
<!-- (1.99588,	41.1956)(1.98933,	41.3955)(1.9828	,  41.5954)(1.97628,	41.7953) -->
<!-- (1.96978,	41.9952)(1.9633	,  42.1951)(1.95683,	42.395 )(1.95039,	42.5949) -->
<!-- (1.94396,	42.7948)(1.93755,	42.9946)(1.93116,	43.1945)(1.92479,	43.3944) -->
<!-- (1.91844,	43.5943)(1.91211,	43.7942)(1.90581,	43.9941)(1.89952,	44.194 ) -->
<!-- (1.89326,	44.3939)(1.88701,	44.5939)(1.88079,	44.7938)(1.8746	,  44.9937) -->
<!-- (1.86842,	45.1936)(1.86227,	45.3935)(1.85614,	45.5934)(1.85004,	45.7933) -->
<!-- (1.84396,	45.9932)(1.8379	,  46.1931)(1.83187,	46.393 )(1.82586,	46.5929) -->
<!-- (1.81988,	46.7928)(1.81392,	46.9927)(1.80799,	47.1926)(1.80208,	47.3926) -->
<!-- (1.79619,	47.5925)(1.79033,	47.7924)(1.7845	,47.9923)(1.77869,	48.1922) -->
<!-- (1.77291,	48.3921)(1.76715,	48.5921)(1.76142,	48.792 )(1.75571,	48.9919) -->
<!-- (1.75003,	49.1918)(1.74437,	49.3917)(1.73874,	49.5917)(1.73314,	49.7916) -->
<!-- (1.72756,	49.9915)(1.72201,	50.1914)(1.71648,	50.3913)(1.71098,	50.5913) -->
<!-- (1.7055	,  50.7912)(1.70005,	50.9911)(1.69462,	51.191 )(1.68923,	51.391 ) -->
<!-- (1.68385,	51.5909)(1.6785	,  51.7908)(1.67318,	51.9908)(1.66788,	52.1907) -->
<!-- (1.66261,	52.3906)(1.65736,	52.5905)(1.65214,	52.7905)(1.64695,	52.9904) -->
<!-- (1.64178,	53.1903)(1.63663,	53.3903)(1.63151,	53.5902)(1.62641,	53.7901) -->
<!-- (1.62134,	53.9901)(1.6163	,  54.19  )(1.61128,	54.39  )(1.60628,	54.5899) -->
<!-- (1.60131,	54.7898)(1.59636,	54.9898)(1.59144,	55.1897)(1.58654,	55.3897) -->
<!-- (1.58167,	55.5896)(1.57682,	55.7895)(1.57199,	55.9895)(1.56719,	56.1894) -->
<!-- (1.56241,	56.3894)(1.55766,	56.5893)(1.55293,	56.7892)(1.54822,	56.9892) -->
<!-- (1.54354,	57.1891)(1.53888,	57.3891)(1.53424,	57.589 )(1.52963,	57.789 ) -->
<!-- (1.52504,	57.9889)(1.52047,	58.1889)(1.51592,	58.3888)(1.5114 , 	58.5888) -->
<!-- (1.5069	,  58.7887)(1.50243,	58.9887)(1.49797,	59.1886)(1.49354,	59.3886) -->
<!-- (1.48913,	59.5885)(1.48475,	59.7885)(1.48038,	59.9884)(1.47604,	60.1884) -->
<!-- (1.47172,	60.3883)(1.46742,	60.5883)(1.46314,	60.7882)(1.45888,	60.9882) -->
<!-- (1.45465,	61.1881)(1.45043,	61.3881)(1.44624,	61.5881)(1.44207,	61.788 ) -->
<!-- (1.43791,	61.988 )(1.43378,	62.1879)(1.42967,	62.3879)(1.42558,	62.5878) -->
<!-- (1.42151,	62.7878)(1.41747,	62.9878)(1.41344,	63.1877)(1.40943,	63.3877) -->
<!-- (1.40544,	63.5876)(1.40147,	63.7876)(1.39752,	63.9876)(1.39359,	64.1875) -->
<!-- (1.38968,	64.3875)(1.38579,	64.5875)(1.38192,	64.7874)(1.37807,	64.9874) -->
<!-- (1.37424,	65.1873)(1.37042,	65.3873)(1.36663,	65.5873)(1.36285,	65.7872) -->
<!-- (1.35909,	65.9872)(1.35535,	66.1872)(1.35163,	66.3871)(1.34793,	66.5871) -->
<!-- (1.34425,	66.7871)(1.34058,	66.987 )(1.33693,	67.187 )(1.3333	,  67.387 ) -->
<!-- (1.32969,	67.5869)(1.32609,	67.7869)(1.32252,	67.9869)(1.31896,	68.1868) -->
<!-- (1.31541,	68.3868)(1.31189,	68.5868)(1.30838,	68.7867)(1.30489,	68.9867) -->
<!-- (1.30141,	69.1867)(1.29795,	69.3866)(1.29451,	69.5866)(1.29109,	69.7866) -->
<!-- (1.28768,	69.9866)(1.28429,	70.1865)(1.28091,	70.3865)(1.27756,	70.5865) -->
<!-- (1.27421,	70.7864)(1.27089,	70.9864)(1.26757,	71.1864)(1.26428,	71.3864) -->
<!-- (1.261	 , 71.5863  )(1.25774,	71.7863)(1.25449,	71.9863)(1.25125,	72.1863) -->
<!-- (1.24804,	72.3862)(1.24483,	72.5862)(1.24165,	72.7862)(1.23848,	72.9862) -->
<!-- (1.23532,	73.1861)(1.23218,	73.3861)(1.22905,	73.5861)(1.22594,	73.7861) -->
<!-- (1.22284,	73.986 )(1.21975,	74.186 )(1.21668,	74.386 )(1.21363,	74.586 ) -->
<!-- (1.21059,	74.7859)(1.20756,	74.9859)(1.20455,	75.1859)(1.20155,	75.3859) -->
<!-- (1.19856,	75.5858)(1.19559,	75.7858)(1.19264,	75.9858)(1.18969,	76.1858) -->
<!-- (1.18676,	76.3858)(1.18385,	76.5857)(1.18094,	76.7857)(1.17805,	76.9857) -->
<!-- (1.17518,	77.1857)(1.17231,	77.3857)(1.16946,	77.5856)(1.16662,	77.7856) -->
<!-- (1.1638	,  77.9856)(1.16099,	78.1856)(1.15819,  	78.3856)(1.1554	,  78.5855) -->
<!-- (1.15263,	78.7855)(1.14987,	78.9855)(1.14712,	79.1855)(1.14438,	79.3855) -->
<!-- (1.14166,	79.5854)(1.13895,	79.7854)(1.13625,	79.9854)(1.13356,	80.1854) -->
<!-- (1.13088,	80.3854)(1.12822,	80.5854)(1.12557,	80.7853)(1.12293,	80.9853) -->
<!-- (1.1203	,  81.1853)(1.11768,	81.3853)(1.11507,	81.5853)(1.11248,	81.7853) -->
<!-- (1.1099	,  81.9852)(1.10733,	82.1852)(1.10477,	82.3852)(1.10222,	82.5852) -->
<!-- (1.09968,	82.7852)(1.09715,	82.9852)(1.09464,	83.1851)(1.09213,	83.3851) -->
<!-- (1.08964,	83.5851)(1.08716,	83.7851)(1.08468,	83.9851)(1.08222,	84.1851)}; -->
<!-- \end{axis} -->
<!-- \end{tikzpicture} -->
<!-- \end{center} -->
<!-- \caption{Bifurcation diagram for species $x$ with respect to parameter $k_2$. The continuous lines represent stable steady state points and the dotted line the unstable steady states. Plotted using Auto C\# SBW~\url{http://jdesigner.sourceforge.net/Site/Auto_C.html}} -->
<!-- \label{fig:BistableHysteresis} -->
<!-- \end{figure} -->

**Figure** <a id="fig-hysteresisbistable"></a> `fig:HysteresisBistable`

*Caption:* Plotting intersection points from Figure [Figure: Reaction velocities, $v_1$ and $v_2$, as a function of $x$ for the sys](#fig-bistability) as a function of $k_3$. Dotted line marks the lower intersection point, dashed line the middle intersection points, and solid line the upper intersection point. Computed using the SBW AUTO C# Tool.

```latex
\begin{figure}
\begin{center}
\begin{tikzpicture}
\begin{axis}[
xlabel={$k_3$},
ylabel={Concentration, $x$},
xmin=0,
xmax=1.5,
ymin=0,
ymax=3,
width=9.5cm,
height=6cm]

\addplot[color=red,line width=1.75pt,dotted] coordinates {
(1.5000,	0.0667) (1.4980,	0.0668) (1.4964,	0.0669)
(1.4938,	0.0670) (1.4895,	0.0672) (1.4827,	0.0675)
(1.4716,	0.0680) (1.4537,	0.0688) (1.4247,	0.0702)
(1.3957,	0.0717) (1.3667,	0.0732) (1.3377,	0.0748)
(1.3087,	0.0765) (1.2797,	0.0782) (1.2508,	0.0800)
(1.2218,	0.0820) (1.1928,	0.0840) (1.1639,	0.0861)
(1.1349,	0.0883) (1.1060,	0.0906) (1.0770,	0.0931)
(1.0481,	0.0956) (1.0192,	0.0984) (0.9903,	0.1013)
(0.9615,	0.1044) (0.9326,	0.1077) (0.9038,	0.1112)
(0.8750,	0.1149) (0.8462,	0.1189) (0.8175,	0.1232)
(0.7889,	0.1278) (0.7603,	0.1328) (0.7317,	0.1382)
(0.7033,	0.1440) (0.6750,	0.1504) (0.6468,	0.1575)
(0.6188,	0.1652) (0.5911,	0.1738) (0.5637,	0.1834)
(0.5367,	0.1942) (0.5104,	0.2065) (0.4851,	0.2207)
(0.4612,	0.2372) (0.4396,	0.2566) (0.4219,	0.2796)
(0.4103,	0.3062) (0.4067,	0.3323)};

\addplot[color=blue,line width=1.75pt,dashed] coordinates {
(0.4106,	0.3611)
(0.4208,	0.3883) (0.4351,	0.4135) (0.4521,	0.4371)
(0.4708,	0.4593) (0.4907,	0.4805) (0.5113,	0.5009)
(0.5324,	0.5209) (0.5538,	0.5405) (0.5753,	0.5600)
(0.5968,	0.5795) (0.6313,	0.6114) (0.6648,	0.6443)
(0.6968,	0.6788) (0.7262,	0.7154) (0.7520,	0.7546)
(0.7730,	0.7967) (0.7879,	0.8412) (0.7962,	0.8874)
(0.7983,	0.9268) (0.7957,	0.9737) };

\addplot[color=orange,line width=1.75pt] coordinates {
(0.7889,	1.0202)
(0.7789,	1.0661) (0.7667,	1.1115) (0.7530,	1.1564)
(0.7382,	1.2010) (0.7228,	1.2454) (0.7071,	1.2897)
(0.6913,	1.3339) (0.6755,	1.3781) (0.6503,	1.4498)
(0.6258,	1.5218) (0.6023,	1.5941) (0.5798,	1.6667)
(0.5584,	1.7396) (0.5382,	1.8129) (0.5191,	1.8865)
(0.5010,	1.9603) (0.4839,	2.0344) (0.4679,	2.1087)
(0.4527,	2.1832) (0.4384,	2.2578) (0.4248,	2.3326)
(0.4121,	2.4075) (0.4000,	2.4826) (0.3885,	2.5577)
(0.3777,	2.6330) (0.3674,	2.7083) (0.3576,	2.7837)
(0.3484,	2.8591) (0.3395,	2.9346) (0.3311,	3.0102)
(0.3231,	3.0858) (0.3155,	3.1614) (0.3082,	3.2370)
(0.3012,	3.3127) (0.2945,	3.3885) (0.2881,	3.4642)
(0.2820,	3.5400) (0.2761,	3.6158) (0.2705,	3.6916)
(0.2651,	3.7674) (0.2599,	3.8432) (0.2549,	3.9191)
(0.2501,	3.9949) (0.2454,	4.0708) (0.2409,	4.1467)
(0.2366,	4.2226) (0.2325,	4.2985) (0.2284,	4.3744)
(0.2246,	4.4503) (0.2208,	4.5262) (0.2172,	4.6021)
(0.2136,	4.6781) (0.2102,	4.7540) (0.2069,	4.8299)
(0.2037,	4.9059) (0.2006,	4.9818) (0.1976,	5.0578)};

%###
\addplot[color=red,only marks,mark=o,mark size=7pt,line width=1.3pt] coordinates {(1.4, 0.4)};
\node at (axis cs:1.4,0.4) {1};

\addplot[color=red,only marks,mark=o,mark size=7pt,line width=1.3pt] coordinates {(0.8, 0.38)};
\node at (axis cs:0.8,0.38) {2};

\addplot[color=red,only marks,mark=o,mark size=7pt,line width=1.3pt] coordinates {(0.35, 0.5)};
\node at (axis cs:0.35,0.5) {3};

\addplot[color=red,only marks,mark=o,mark size=7pt,line width=1.3pt] coordinates {(0.35, 2.1)};
\node at (axis cs:0.35,2.1) {4};

\addplot[color=red,only marks,mark=o,mark size=7pt,line width=1.3pt] coordinates {(0.87, 0.98)};
\node at (axis cs:0.87,0.98) {5};

\end{axis}

\end{tikzpicture}
\end{center}
\caption{Plotting intersection points from Figure~\ref{fig:Bistability} as a function of $k_3$. Dotted line marks the lower intersection point, dashed line the middle intersection points, and solid line the upper intersection point. Computed using the SBW AUTO C\# Tool.}
\label{fig:HysteresisBistable}
\end{figure}
```

Figure [Figure: Plotting intersection points from Figure \ref{fig:Bistability} as a fu](#fig-hysteresisbistable) shows that at some value of the parameter $k_3$, the system has three possible steady states, outside this range only a single steady state persists. Bifurcation diagrams are extremely useful for uncovering and displaying such information. Drawing bifurcation diagrams is not easy, however. and there are some software tools that can help. Figure [Figure: Plotting intersection points from Figure \ref{fig:Bistability} as a fu](#fig-hysteresisbistable) for example was generated using the SBW Auto C# tool(footnote: <http://jdesigner.sourceforge.net/Site/Auto_C.html>}. Another useful tool for drawing bifurcation diagrams is Oscill8(footnote:  <http://oscill8.sourceforge.net/>}. Both tools can read SBML. Figure [Figure: Plotting intersection points from Figure \ref{fig:Bistability} as a fu](#fig-hysteresisbistable) was generated first by entering the model into Tellurium (Shown in Listing `jarnac:BistableSS`) to generate the SBML. The model was then passed to Auto C# to produce the bifurcation diagram.

**Figure** <a id="fig-hysteresispath"></a> `fig:HysteresisPath`

*Caption:* Depending on whether we increase or decrease $k_3$, the steady state  path we traverse will be different. This is a characteristic of hysteresis.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}
\begin{axis}[
xlabel={Parameter, $k_3$},
ylabel={Concentration, $x$},
xmin=0,
xmax=1.5,
ymin=0,
ymax=3,
width=5.7cm,
height=5cm]

\addplot[color=red,line width=1.75pt,dotted] coordinates {
(1.5000,	0.0667) (1.4980,	0.0668) (1.4964,	0.0669)
(1.4938,	0.0670) (1.4895,	0.0672) (1.4827,	0.0675)
(1.4716,	0.0680) (1.4537,	0.0688) (1.4247,	0.0702)
(1.3957,	0.0717) (1.3667,	0.0732) (1.3377,	0.0748)
(1.3087,	0.0765) (1.2797,	0.0782) (1.2508,	0.0800)
(1.2218,	0.0820) (1.1928,	0.0840) (1.1639,	0.0861)
(1.1349,	0.0883) (1.1060,	0.0906) (1.0770,	0.0931)
(1.0481,	0.0956) (1.0192,	0.0984) (0.9903,	0.1013)
(0.9615,	0.1044) (0.9326,	0.1077) (0.9038,	0.1112)
(0.8750,	0.1149) (0.8462,	0.1189) (0.8175,	0.1232)
(0.7889,	0.1278) (0.7603,	0.1328) (0.7317,	0.1382)
(0.7033,	0.1440) (0.6750,	0.1504) (0.6468,	0.1575)
(0.6188,	0.1652) (0.5911,	0.1738) (0.5637,	0.1834)
(0.5367,	0.1942) (0.5104,	0.2065) (0.4851,	0.2207)
(0.4612,	0.2372) (0.4396,	0.2566) (0.4219,	0.2796)
(0.4103,	0.3062) (0.4067,	0.3323)};

\addplot[color=blue,line width=1.75pt,dashed] coordinates {
(0.4106,	0.3611)
(0.4208,	0.3883) (0.4351,	0.4135) (0.4521,	0.4371)
(0.4708,	0.4593) (0.4907,	0.4805) (0.5113,	0.5009)
(0.5324,	0.5209) (0.5538,	0.5405) (0.5753,	0.5600)
(0.5968,	0.5795) (0.6313,	0.6114) (0.6648,	0.6443)
(0.6968,	0.6788) (0.7262,	0.7154) (0.7520,	0.7546)
(0.7730,	0.7967) (0.7879,	0.8412) (0.7962,	0.8874)
(0.7983,	0.9268) (0.7957,	0.9737) };

\addplot[color=orange,line width=1.75pt] coordinates {
(0.7889,	1.0202)
(0.7789,	1.0661) (0.7667,	1.1115) (0.7530,	1.1564)
(0.7382,	1.2010) (0.7228,	1.2454) (0.7071,	1.2897)
(0.6913,	1.3339) (0.6755,	1.3781) (0.6503,	1.4498)
(0.6258,	1.5218) (0.6023,	1.5941) (0.5798,	1.6667)
(0.5584,	1.7396) (0.5382,	1.8129) (0.5191,	1.8865)
(0.5010,	1.9603) (0.4839,	2.0344) (0.4679,	2.1087)
(0.4527,	2.1832) (0.4384,	2.2578) (0.4248,	2.3326)
(0.4121,	2.4075) (0.4000,	2.4826) (0.3885,	2.5577)
(0.3777,	2.6330) (0.3674,	2.7083) (0.3576,	2.7837)
(0.3484,	2.8591) (0.3395,	2.9346) (0.3311,	3.0102)
(0.3231,	3.0858) (0.3155,	3.1614) (0.3082,	3.2370)
(0.3012,	3.3127) (0.2945,	3.3885) (0.2881,	3.4642)
(0.2820,	3.5400) (0.2761,	3.6158) (0.2705,	3.6916)
(0.2651,	3.7674) (0.2599,	3.8432) (0.2549,	3.9191)
(0.2501,	3.9949) (0.2454,	4.0708) (0.2409,	4.1467)
(0.2366,	4.2226) (0.2325,	4.2985) (0.2284,	4.3744)
(0.2246,	4.4503) (0.2208,	4.5262) (0.2172,	4.6021)
(0.2136,	4.6781) (0.2102,	4.7540) (0.2069,	4.8299)
(0.2037,	4.9059) (0.2006,	4.9818) (0.1976,	5.0578)};

\draw[very thick,-latex,color=black] (axis cs:1.45,0.12) -- (axis cs:0.8,0.14);
\draw[very thick,-latex,color=black] (axis cs:0.8,0.12) -- (axis cs:0.38,0.14);
\draw[very thick,-latex,color=black] (axis cs:0.38,0.14) -- (axis cs:0.38,2.2);

\end{axis}

\end{tikzpicture}
%
\begin{tikzpicture}
\begin{axis}[
xlabel={Parameter, $k_3$},
ylabel={},
xmin=0,
xmax=1.5,
ymin=0,
ymax=3,
width=5.7cm,
height=5cm]

\addplot[color=red,line width=1.75pt,dotted] coordinates {
(1.5000,	0.0667) (1.4980,	0.0668) (1.4964,	0.0669)
(1.4938,	0.0670) (1.4895,	0.0672) (1.4827,	0.0675)
(1.4716,	0.0680) (1.4537,	0.0688) (1.4247,	0.0702)
(1.3957,	0.0717) (1.3667,	0.0732) (1.3377,	0.0748)
(1.3087,	0.0765) (1.2797,	0.0782) (1.2508,	0.0800)
(1.2218,	0.0820) (1.1928,	0.0840) (1.1639,	0.0861)
(1.1349,	0.0883) (1.1060,	0.0906) (1.0770,	0.0931)
(1.0481,	0.0956) (1.0192,	0.0984) (0.9903,	0.1013)
(0.9615,	0.1044) (0.9326,	0.1077) (0.9038,	0.1112)
(0.8750,	0.1149) (0.8462,	0.1189) (0.8175,	0.1232)
(0.7889,	0.1278) (0.7603,	0.1328) (0.7317,	0.1382)
(0.7033,	0.1440) (0.6750,	0.1504) (0.6468,	0.1575)
(0.6188,	0.1652) (0.5911,	0.1738) (0.5637,	0.1834)
(0.5367,	0.1942) (0.5104,	0.2065) (0.4851,	0.2207)
(0.4612,	0.2372) (0.4396,	0.2566) (0.4219,	0.2796)
(0.4103,	0.3062) (0.4067,	0.3323)};

\addplot[color=blue,line width=1.75pt,dashed] coordinates {
(0.4106,	0.3611)
(0.4208,	0.3883) (0.4351,	0.4135) (0.4521,	0.4371)
(0.4708,	0.4593) (0.4907,	0.4805) (0.5113,	0.5009)
(0.5324,	0.5209) (0.5538,	0.5405) (0.5753,	0.5600)
(0.5968,	0.5795) (0.6313,	0.6114) (0.6648,	0.6443)
(0.6968,	0.6788) (0.7262,	0.7154) (0.7520,	0.7546)
(0.7730,	0.7967) (0.7879,	0.8412) (0.7962,	0.8874)
(0.7983,	0.9268) (0.7957,	0.9737) };

\addplot[color=orange,line width=1.75pt] coordinates {
(0.7889,	1.0202)
(0.7789,	1.0661) (0.7667,	1.1115) (0.7530,	1.1564)
(0.7382,	1.2010) (0.7228,	1.2454) (0.7071,	1.2897)
(0.6913,	1.3339) (0.6755,	1.3781) (0.6503,	1.4498)
(0.6258,	1.5218) (0.6023,	1.5941) (0.5798,	1.6667)
(0.5584,	1.7396) (0.5382,	1.8129) (0.5191,	1.8865)
(0.5010,	1.9603) (0.4839,	2.0344) (0.4679,	2.1087)
(0.4527,	2.1832) (0.4384,	2.2578) (0.4248,	2.3326)
(0.4121,	2.4075) (0.4000,	2.4826) (0.3885,	2.5577)
(0.3777,	2.6330) (0.3674,	2.7083) (0.3576,	2.7837)
(0.3484,	2.8591) (0.3395,	2.9346) (0.3311,	3.0102)
(0.3231,	3.0858) (0.3155,	3.1614) (0.3082,	3.2370)
(0.3012,	3.3127) (0.2945,	3.3885) (0.2881,	3.4642)
(0.2820,	3.5400) (0.2761,	3.6158) (0.2705,	3.6916)
(0.2651,	3.7674) (0.2599,	3.8432) (0.2549,	3.9191)
(0.2501,	3.9949) (0.2454,	4.0708) (0.2409,	4.1467)
(0.2366,	4.2226) (0.2325,	4.2985) (0.2284,	4.3744)
(0.2246,	4.4503) (0.2208,	4.5262) (0.2172,	4.6021)
(0.2136,	4.6781) (0.2102,	4.7540) (0.2069,	4.8299)
(0.2037,	4.9059) (0.2006,	4.9818) (0.1976,	5.0578)};

\draw[very thick,-latex,color=black] (axis cs:0.38,2.2) -- (axis cs:0.8,2.2);
\draw[very thick,-latex,color=black] (axis cs:0.8,2.2) -- (axis cs:0.8,0.2);
\draw[very thick,-latex,color=black] (axis cs:0.8,0.2) -- (axis cs:1.45,0.2);

\end{axis}

\end{tikzpicture}
\end{center}
\caption{Depending on whether we increase or decrease $k_3$, the steady state  path we traverse will be different. This is a characteristic of hysteresis.}
\label{fig:HysteresisPath}
\end{figure}
```

The bifurcation plot shows how the steady state changes as a function of a parameter, in this case $k_3$. Of interest is the following observation. If we start $k_3$ at a high value of 1.4 (Marker 1), we see that there is only one low steady state. As $k_3$ is lowered, we pass the point at approximately $k_3=0.8$ (Marker 2) where three steady states emerge. We continue lowering $k_3$, and see that the concentration of $x$ rises very slowly until about 0.4 (marker 3). At this point the system jumps to a single steady state, but now at a high level (Marker 4). The interesting observation is that if we now increase the value of $k_3$, we do not traverse the same path. As we increase $k_3$ beyond 0.4, we do not drop back to the low state, but continue along the high state until we reach $k_3=0.8$ (Marker 5), at which point we jump down to the low state (Marker 2). The direction in which we traverse the parameter $k_3$ affects the type of behavior we observe. This special phenomena is called **hysteresis**, Figure [Figure: Depending on whether we increase or decrease $k_3$, the steady state](#fig-hysteresispath).

\stateHighlight{
Hysteresis is where the behavior of a system depends on its past history.
}

### Irreversible Bistability

It is possible to design an irreversible bistable switch where Figure [Figure: Bifurcation diagram for species $R_1$ with respect to the signal](#fig-irreversiblebistable) shows the bifurcation plot for such a system. This is modified from the `Mutual activation' model in the review by Tyson [TysonCell2003], Figure 1e. In this example increasing the signal results in the system switching to the high state at around 2.0. If we reduce the signal from a high level, we traverse the top arc. If we assume the signal can never be negative, we will remain at the high steady state even if the signal is reduced to zero. The bifurcation plot in the negative quadrant of the graph is physically inaccessible. This means it is not possible to transition to the low steady state by decreasing the signal. As a result, the bistable system is **irreversible**, that is, once it is switched on, it will always remain on.

```python
import tellurium as te

r = te.loada ('''
    $X -> R1;  k1*EP + k2*Signal;
    R1 -> $w;  k3*R1;
    EP -> E;   Vm1*EP/(Km + EP);
    E -> EP;   ((Vm2+R1)*E)/(Km + E);

    Vm1 = 12; Vm2 = 6;
    Km = 0.6;
    k1 = 1.6; k2 = 4;
    E = 5; EP = 15;
    k3 = 3; Signal = 0.1;
''')

result = r.simulate(0, 40, 500)
r.plot()
```

**Figure** <a id="fig-bistableirreversible"></a> `fig:BistableIrreversible`

*Graphic (not in the LaTeX source, referenced by name): `BistableIrreversible`*

*Caption:* System with Positive Feedback using a covalent modification cycle, $E,EP$.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale=0.5]{BistableIrreversible}
\end{center}
\caption{System with Positive Feedback using a covalent modification cycle, $E,EP$.} \label{fig:BistableIrreversible}
\end{figure}
```

The Tellurium script for the model is shown in Listing `jarnac:chap:IrreversibleBistable`. To create Figure [Figure: Bifurcation diagram for species $R_1$ with respect to the signal](#fig-irreversiblebistable), first install Oscill8(footnote: <http://oscill8.sourceforge.net/>}, then launch Tellurium. Load the script into Tellurium. Run the script (press green button in toolbar) to put the model into memory. Go to the SBW menu and select Oscill8. Once in Oscill8, select Run; 1 Parameter. In the new dialog box select continuation and the parameter "Signal". Then select run to view the bifurcation plot.

**Figure** <a id="fig-irreversiblebistable"></a> `fig:IrreversibleBistable`

*Caption:* Bifurcation diagram for species $R_1$ with respect to the signal. Signal from the model shown in Tellurium script `jarnac:chap:IrreversibleBistable`. The continuous line represents stable steady state points, the dotted line the unstable steady states. Plotted using Oscil8 <http://oscill8.sourceforge.net/>.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}
\begin{axis}[
xlabel={Signal},
ylabel={Concentration, $R_1$},
xmin=-2, xmax=3, ymin=0, ymax=20,
width=10cm,
height=5.8cm]
\addplot[color=red,line width=1.5pt] coordinates {
(0.0047052579, 0.3429490029)
(0.018742421,  0.3639569878)(0.046783311,  0.4059770107)(0.060786721,  0.4269880056)(0.088758604,  0.4690150022)
(0.10272707,   0.4900299906)(0.13062703,   0.5320640206)(0.14455793,   0.553081989)(0.17238399,   0.595121979)
(0.18627706,   0.6161429882)(0.21402504,   0.6581889986)(0.22787905,   0.6792129874)(0.25554603,   0.7212629914)
(0.26935899,   0.7422900199)(0.29694198,   0.7843449711)(0.3107120,    0.8053730130)(0.33820797,   0.8474320173)
(0.35193304,   0.8684620261)(0.37933702,   0.9105229973)(0.39301602,   0.9315540194)(0.42032597,   0.9736170172)
(0.43395592,   0.9946489930)(0.46116596,   1.036710)(0.47474595,   1.057739973)(0.50185297,   1.099810004)
(0.51537902, 1.120839953)(0.54237801, 1.16289997)(0.55585009, 1.183930039)(0.58273604, 1.225990056)
(0.59614991, 1.247020006)(0.62291907, 1.289070010)(0.63627208, 1.310099959)(0.66291793, 1.352139949)
(0.67620898, 1.373170018)(0.70272492, 1.415199995)(0.71595001, 1.436220049)(0.74233196, 1.478250026)
(0.75548795, 1.499259948)(0.78172809, 1.54127001)(0.79481209, 1.562280058)(0.82090502, 1.604269981)
(0.83391304, 1.625270009)(0.85985106, 1.66725003)(0.87278001, 1.688230037)(0.89855492, 1.730190038)
(0.91140094, 1.751160025)(0.93700592, 1.79309999)(0.94976405, 1.814049959)(0.97518997, 1.855960011)
(0.98363792, 1.869920015)(0.99300894, 1.885429978)(0.99550402, 1.889569997)(0.99827597, 1.894160032)
(0.99901492, 1.895390033)(1.0017199, 1.899880051)(1.0028300, 1.901720046)(1.0069799, 1.908609986)
(1.0107100, 1.914809942)(1.0246900, 1.938060045)(1.0372300, 1.958979964)(1.0622099, 2.000799894)
(1.0746400, 2.021699905)(1.0994100, 2.063469886)(1.1117399, 2.084340095)(1.1362899, 2.126060009)
(1.1485099, 2.14690995)(1.1728199, 2.188570022)(1.1849199, 2.209389925)(1.2089899, 2.250979900)
(1.2209600, 2.271770000)(1.2447799, 2.313290119)(1.2566200, 2.334039926)(1.2801599, 2.375479936)
(1.2918599, 2.396179914)(1.3151199, 2.437540054)(1.3266700, 2.458189964)(1.3496299, 2.499449968)
(1.3610399, 2.520050048)(1.3836799, 2.561189889)(1.3949199, 2.581729888)(1.4172400, 2.622760057)
(1.4283100, 2.643229961)(1.4502700, 2.684119939)(1.4611599, 2.704530000)(1.4827599, 2.74527001)
(1.4934699, 2.765599966)(1.5146800, 2.806169986)(1.5251899, 2.826420068)(1.5460000, 2.866810083)
(1.5563000, 2.886960029)(1.5766799, 2.927160024)(1.5867700, 2.947210073)(1.6067099, 2.987190008)
(1.6165599, 3.007129907)(1.6360399, 3.046880006)(1.6456500, 3.066689968)(1.6646399, 3.106189966)
(1.6740100, 3.125869989)(1.6924899, 3.165090084)(1.7015899, 3.184619903)(1.7195399, 3.223540067)
(1.7283699, 3.242929935)(1.7457699, 3.281529903)(1.7543200, 3.300740003)(1.7711299, 3.338989973)
(1.7793899, 3.358030080)(1.7956099, 3.395910024)(1.8035700, 3.414760112)(1.8191699, 3.452239990)
(1.8268100, 3.470880031)(1.8417700, 3.507940053)(1.8490799, 3.526360034)(1.8633899, 3.562979936)
(1.8703700, 3.581170082)(1.8839900, 3.617310047)(1.8906300, 3.635250091)(1.9035700, 3.670890092)
(1.9098600, 3.688580036)(1.9220800, 3.723700046)(1.9280200, 3.741120100)(1.9395200, 3.775690078)
(1.9450900, 3.792840003)(1.9558700, 3.826839923)(1.9610699, 3.843689918)(1.9710999, 3.877099990)
(1.9759399, 3.893650054)(1.9852299, 3.92646002)(1.9896899, 3.942699909)(1.9982299, 3.974879980)
(2.0023200, 3.990809917)(2.0101099, 4.022349834)(2.0138199, 4.037960052)(2.0208699, 4.068840026)
(2.0242099, 4.084119796)(2.0305099, 4.114349842)(2.0334799, 4.129300117)(2.0390501, 4.1588602)
(2.0416500, 4.173470020)(2.0464999, 4.202360153)(2.0487399, 4.216639995)(2.0528700, 4.244860172)
(2.0547499, 4.258800029)(2.0581800, 4.286349773)(2.0597100, 4.299950122)(2.0624499, 4.326829910)
(2.0636498, 4.340099811)(2.0657100, 4.366310119)(2.0665700, 4.379260063)(2.0679700, 4.404809951)
(2.0685100, 4.417429924)(2.0692799, 4.442339897)(2.0695099, 4.454629898)(2.0696499, 4.47539997)};

\addplot[color=blue,line width=1.5pt,style=dotted] coordinates {
(2.0696001, 4.487400054)(2.0692000, 4.511109828)(2.0688600, 4.52280998)(2.0678699, 4.545899868)
(2.0672399, 4.557290077)(2.0656900, 4.579780101)(2.0647799, 4.590879917)(2.0626900, 4.612780094)
(2.0615100, 4.623589992)(2.0589001, 4.644919872)(2.0574600, 4.655439853)(2.0543398, 4.676219940)
(2.0526599, 4.686470031)(2.0490500, 4.706709861)(2.0471301, 4.716690063)(2.0430600, 4.736400127)
(2.0409100, 4.746129989)(2.0363900, 4.765329837)(2.0340199, 4.774809837)(2.0290699, 4.793529987)
(2.0264899, 4.802760124)(2.0211300, 4.821000099)(2.0183401, 4.829999923)(2.0125899, 4.847780227)
(2.0096099, 4.85655021)(2.0034699, 4.87388992)(2.0003099, 4.882450103)(1.9938100, 4.89935016)
(1.9904700, 4.90770006)(1.9836200, 4.924190044)(1.9801100, 4.932330131)(1.9729199, 4.948420047)
(1.9692499, 4.956369876)(1.9617500, 4.972080230)(1.9579199, 4.979839801)(1.9501099, 4.995170116)
(1.9461300, 5.002749919)(1.9380199, 5.017730236)(1.9338999, 5.025129795)(1.9255100, 5.039770126)
(1.9212499, 5.046999931)(1.9126000, 5.06129980)(1.9082000, 5.068369865)(1.8992899, 5.0823597)
(1.8947700, 5.089270114)(1.8856099, 5.102940082)(1.8809700, 5.109710216)(1.8715699, 5.123089790)
(1.8668099, 5.129700183)(1.8571900, 5.142799854)(1.8523199, 5.149270057)(1.8424799, 5.162089824)
(1.8350000, 5.171589851)(1.8198200, 5.190289974)(1.8121199, 5.199500083)(1.7964999, 5.21763992)
(1.7885799, 5.226580142)(1.7725499, 5.244190216)(1.7644300, 5.252870082)(1.7480100, 5.269979953)
(1.7397099, 5.278409957)(1.7229199, 5.295050144)(1.7144399, 5.303249835)(1.6973099, 5.319439888)
(1.6886600, 5.327429771)(1.6712000, 5.343190193)(1.6624000, 5.350969791)(1.6446299, 5.366340160)
(1.6356799, 5.373929977)(1.6176300, 5.388909816)(1.6085400, 5.396319866)(1.5809999, 5.418169975)
(1.5670900, 5.428909778)(1.5389900, 5.45002985)(1.5247999, 5.460410118)(1.4961899, 5.480850219)
(1.4817700, 5.490900039)(1.4526900, 5.510709762)(1.4380400, 5.52047014)(1.4085400, 5.539700031)
(1.3936799, 5.549180030)(1.3637900, 5.567880153)(1.3487499, 5.577109813)(1.3108999, 5.599840164)
(1.2880300, 5.613249778)(1.2419400, 5.639609813)(1.2187399, 5.652569770)(1.1720299, 5.678090095)
(1.1485400, 5.690659999)(1.1013100, 5.715449810)(1.0775699, 5.727680206)(1.0298800, 5.751840114)
(1.0059399, 5.763790130)(0.95035306, 5.791090011)(0.92245109, 5.804599761)(0.86645794, 5.831339836)
(0.8383790, 5.844600200)(0.78207896, 5.870920181)(0.75387007, 5.883999824)(0.69735599, 5.910019874)
(0.66906109, 5.922979831)(0.61242097, 5.948820114)(0.58408491, 5.961730003)(0.52740596, 5.987520217)
(0.4990719, 6.000420093)(0.44244002, 6.026279926)(0.4141519, 6.039249897)(0.35765408, 6.065289974)
(0.32945496, 6.078380107)(0.2731820, 6.104740142)(0.24511806, 6.118020057)(0.18916206, 6.144820213)
(0.16128103, 6.158349990)(0.10574392, 6.185729980)(0.078097967, 6.199580192)(0.023085115, 6.227680206)};

\addplot[color=purple,line width=1.5pt,style=dotted] coordinates {
(-0.00426975, 6.241940021)(-0.05863993, 6.270929813)(-0.08564193, 6.285669803)(-0.13923877, 6.315720081)
(-0.16581847, 6.33103990)(-0.2184969, 6.362339973)(-0.2445786, 6.378339767)(-0.2961715, 6.411109924)
(-0.3216646, 6.427909851)(-0.3719820, 6.462399959)(-0.3967842, 6.480130195)(-0.4456077, 6.516620159)
(-0.4696018, 6.535419940)(-0.5166722, 6.574240207)(-0.53971617, 6.594299793)(-0.58472979, 6.635829925)
(-0.60665759, 6.657340049)(-0.64925317, 6.702010154)(-0.66987062, 6.725220203)(-0.70961685, 6.773540019)
(-0.72868552, 6.798709869)(-0.76506152, 6.851280212)(-0.78229963, 6.878749847)(-0.81468476, 6.936260223)
(-0.82975011, 6.966390132)(-0.85739745, 7.029630184)(-0.86988377, 7.062849998)(-0.89190629, 7.132730007)
(-0.90133283, 7.169499874)(-0.91670011, 7.247000217)(-0.92251453, 7.287829875)(-0.93006846, 7.373950004)
(-0.93166813, 7.419330120)(-0.93109687, 7.492360115)(-0.92865117, 7.541920185)(-0.9185821, 7.646200180)
(-0.91084863, 7.700950145)(-0.88974836, 7.81570005)(-0.87632096, 7.87567996)(-0.84362284, 8.00067996)
(-0.82435395, 8.06560993)(-0.78006682, 8.200019836)(-0.75511561, 8.26933956)(-0.69985033, 8.411820411)
(-0.66965879, 8.484800338)(-0.60449966, 8.633769989)(-0.56968405, 8.709589958)(-0.49596524, 8.86349010)
(-0.45721543, 8.941419601)(-0.37630212, 9.098899841)(-0.33428025, 9.178330421)(-0.24743458, 9.33831024)
(-0.20272874, 9.418769836)(-0.11102514, 9.580430030)(-0.06412992, 9.661560058) (-0.016596, 9.74287)};

\addplot[color=red,line width=1.5pt] coordinates {
(0.031532613, 9.824319839)
(0.080218044, 9.905890464)(0.17912004, 10.0692996)(0.22927199, 10.15120029)(0.33083599, 10.31499958)
(0.38219808, 10.39700031)(0.48596797, 10.56099987)(0.53833593, 10.64309978)(0.64394499, 10.80720043)
(0.69715396, 10.88930034)(0.80431007, 11.05340003)(0.85823106, 11.13539981)(0.96669798, 11.29950046)
(1.0212199, 11.38150024)(1.1308100, 11.5453996)(1.1858500, 11.6273002)(1.2963999, 11.7910995)
(1.3518899, 11.8730001)(1.4632699, 12.0367002)(1.5191500, 12.1184997)(1.6312600, 12.2819995)
(1.6874799, 12.3636999)(1.8002300, 12.5270996)(1.8567500, 12.6086997)(1.9700499, 12.77200031)
(2.0268299, 12.85350036)(2.1406400, 13.01659965)(2.1976599, 13.09809970)(2.3118999, 13.26109981)
(2.3691298, 13.34249973)(2.4837698, 13.50529956)(2.5411798, 13.58670043)(2.6561799, 13.7494001)
(2.7137699, 13.83069992)(2.8290801, 13.99330043)(2.8868200, 14.07450008)(3.0024299, 14.23700046)
(3.0603001, 14.3182001)(3.1761701, 14.4805002)(3.2341699, 14.5616998)(3.3502900, 14.7238998)
(3.4084000, 14.8050003)(3.5247299, 14.9672002)(3.5829501, 15.0481996)(3.6994800, 15.2103004)
(3.7577900, 15.2912998)(3.8745100, 15.4533004)(3.9329099, 15.5341997)(4.0497999, 15.6961002)
(4.1082801, 15.7770004)(4.2253298, 15.9388999)(4.2838802, 16.0196990)(4.4010701, 16.1814994)
(4.4597001, 16.2623004)(4.5770201, 16.4239997)(4.6357197, 16.5048007)(4.6944298, 16.5855998)
(4.7531599, 16.6664009)(4.8119201, 16.7472000)(4.8706898, 16.8279991)(4.9294800, 16.9088001)
(4.9882898, 16.9895000)(5.0471200, 17.0702991)};

\draw[line width=1pt,gray,-] (axis cs:0.0,0.0) -- (axis cs:0.0,20.0);

\end{axis}
\end{tikzpicture}
\end{center}
\caption{Bifurcation diagram for species $R_1$ with respect to the signal. Signal from the model shown in Tellurium script~\ref{jarnac:chap:IrreversibleBistable}. The continuous line represents stable steady state points, the dotted line the unstable steady states. Plotted using Oscil8~\url{http://oscill8.sourceforge.net/}.}
\label{fig:IrreversibleBistable}
\end{figure}
```

### Toggle Switch

The final example we will consider is the toggle switch. This example illustrates the idea of an attractor basin in a phase plot. The system in question is shown in Figure [Figure: The toggle switch](#fig-toggleswitch) and is comprised of just two nodes, $S_1$ and $S_2$. Each node inhibits the other. This is a high level diagram, but mechanistic realizations can be made using protein or gene regulatory networks. In fact, one of the first synthetic biology constructs was the toggle switch made from an engineered gene regulatory network [GardnerNegFeedbackComment].

**Figure** <a id="fig-toggleswitch"></a> `fig:toggleSwitch`

*Graphic (not in the LaTeX source, referenced by name): `toggleSwitch`*

*Caption:* The toggle switch. Two mutually inhibited nodes, $S_1$ and $S_2$.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.7]{toggleSwitch}
\caption{The toggle switch. Two mutually inhibited nodes, $S_1$ and $S_2$.} \label{fig:toggleSwitch}
\end{figure}
```

Intuitively, one can imagine the type of behavior this system might exhibit. For example, if $S_1$ has a high concentration then this will repress $S_2$. Since $S_2$ is now low, repression of $S_1$ is negligible. This state appears stable. Alternatively we could imagine that $S_2$ is at a high concentration. This will repress $S_1$ and thus we have another state that appears stable.

**Figure** <a id="fig-togglegenenetwork"></a> `fig:ToggleGeneNetwork`

*Graphic (not in the LaTeX source, referenced by name): `ToggleGeneNetwork`*

*Caption:* The toggle switch constructed from a gene regulatory network.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.7]{ToggleGeneNetwork}
\caption{The toggle switch constructed from a gene regulatory network.} \label{fig:ToggleGeneNetwork}
\end{figure}
```

We can better study the behavior of the toggle switch by building a computer simulation. Using the set of differential equations shown in equations [Toggle Switch](#eqn-toggleodes), we describe the model as:

$$
\begin{equation}
\begin{aligned}
\frac{dS_1}{dt} &= \frac{k_1}{1 + S_2^{n_1}} - k_2 S_1\\[6pt]
\frac{dS_2}{dt} &= \frac{k_3}{1 + S_1^{n_2}} - k_4 S_2
\end{aligned}
\label{eqn:toggleODEs}
\end{equation}
$$

A suitable set of parameter values is given by $k_1 = 6; k_3 = 6; k_2 = 2; k_4 = 2$. Figure [Figure: Phase portrait for a toggle switch, equation \eqref{eqn:toggleODEs}](#fig-togglephaseplot) shows the phase plot for this system. The three points marked by round filled circles represent the steady state locations. Note that there is a high $S_1$/low $S_2$ state, and a low $S_1$/high $S_2$ state. These correspond to the states we intuitively described before. There is also a third point which represents a medium level of $S_1$ and $S_2$. The arrows in the diagram represent the direction of change of $S_1$ and $S_2$ in time. The diagram has been subdivided into four **basins of attraction**. For example, the phase plot highlights one of the direction arrows in the basin labelled two. The arrows initially point right to left and down. This tells us that if we started a time-course simulation at point two, the concentration of $S_1$ and $S_2$ would both decline. Initially, the arrow points roughly in the direction of the unstable state but as it moves, its direction changes and eventually moves towards the upper stable state to the left.

The phase plot gives us a condensed view of how any initial condition will evolve. Points that start in basin one will converge to the third state, basin two points converge on the first state, basin three to the third state, and finally basin four to the first state.

**Figure** <a id="fig-togglephaseplot"></a> `fig:TogglePhasePlot`

*Graphic (not in the LaTeX source, referenced by name): `nullClineToggle`*

*Caption:* Phase portrait for a toggle switch, equation [Toggle Switch](#eqn-toggleodes). The four numbered areas mark the four basins of attraction. The two thick lines traversing and crossing over each other near (1.3,1.3) are the two nullclines and their intersection points make the steady state. Note that the center intersection point shows trajectories moving away from the point. Diagram generated using the Python script: `fig:phaseplot0I0I`, $k_1 = 6; k_3 = 6; k_2 = 2; k_4 = 2$.

```latex
\begin{figure}[htb]
\centering
   \includegraphics[scale = 0.6]{nullClineToggle}%TogglePhasePlot}
\caption{Phase portrait for a toggle switch, equation~\eqref{eqn:toggleODEs}. The four numbered areas mark the four basins of attraction. The two thick lines traversing and crossing over each other near (1.3,1.3) are the two nullclines and their intersection points make the steady state. Note that the center intersection point shows trajectories moving away from the point. Diagram generated using the Python script:~\ref{fig:phaseplot0I0I}, $k_1 = 6; k_3 = 6; k_2 = 2; k_4 = 2$.} \label{fig:TogglePhasePlot}
\end{figure}
```

### Nullclines

The toggle switch model from the previous section also allows us to introduce the concept of nullclines. We've seen various mechanisms for visualizing a system, especially related to its steady state stability. For example, in Figure [Figure: Rate of change as a function of $S_1$](#fig-graphicalstabilitys1) we show how the stability of a one dimensional system can be visualized, likewise for Figure [Figure: Reaction velocities, $v_1$ and $v_2$, as a function of $x$ for the sys](#fig-bistability), the bifurcation plot in Figure [Figure: Plotting intersection points from Figure \ref{fig:Bistability} as a fu](#fig-hysteresisbistable), and the phase plot in Figure [Figure: Phase portrait for a toggle switch, equation \eqref{eqn:toggleODEs}](#fig-togglephaseplot). There is yet another plot that can help us understand the instability of a two dimensional system and that has to do with plotting the nullclines. The nullcline is the solution to a differential equation when set to zero as a function of the two system variables. For example, the toggle switch differential equation for $S_1$ is:

\[ \frac{dS_1}{dt} = \frac{k_1}{1 + S_2^{n_1}} - k_2 S_1 \]

We can set this to zero and find all combinations of $S_1$ and $S_2$ that satisfy this equation. These points form a line on a two dimensional plane. Such a line is called the **nullcline**. Figure [Figure: Phase portrait for a toggle switch, equation \eqref{eqn:toggleODEs}](#fig-togglephaseplot) shows two nullclines corresponding to the two differential equations for the toggle model. Note that where the nullclines intersect, we find the steady state because at these points, both equations yield the same values for $S_1$ and $S_2$.

<!-- \begin{figure}[htb] -->
<!-- \centering -->
<!-- \includegraphics[scale = 0.5]{nullclinesToggle} -->
<!-- \caption{Phase portrait for a toggle switch. The two nullclines are superimposed on the phase plot and labelled with arrows. Diagram generated by PPlane~\url{http://math.rice.edu/~dfield/dfpp.html}. See Figure~\ref{fig:TogglePhasePlot} for parameter values.} \label{fig:nullclinesToggle} -->
<!-- \end{figure} -->

Although useful, many of the plots we have reviewed are limited to systems of two or three variables. The nullclines in an $n$-dimensional system cannot easily be visualized. Likewise, a two dimensional phase plot can only take a slice through the dynamics of a system with many variables. Nevertheless, these techniques, in particular bifurcation plots, are extremely useful in delineating the potential behavioral modes of networks. See [ChickarmaneJTB:2007, Chickarmane:2006] for examples of bifurcation plots in studying protein signaling pathways.

There are more elaborate designs for toggle switches, but a discussion of these are beyond the scope of this book.

## Further Reading

- Edelstein-Keshet L (2005) Mathematical Models in Biology. SIAM Classical In Applied Mathematics. ISBN-10: 0-89871-554-7

- Fall CP, Marland ES, Wagner JM, Tyson JJ (2000) Computational Cell Biology. Springer: Interdisciplinary Applied Mathematics. ISBN 0-387-95369-8

- Steuer R and Junker BH (2009). Computational models of metabolism: stability and regulation in metabolic networks. Advances in chemical physics, 142, 105.

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- \begin{enumerate} -->
<!-- \item Determine the Jacobian matrix for the following system that describes a branched pathway: -->

<!-- \begin{align*} -->
<!-- \frac{dS_1}{dt} &= v_o - k_1 S_1 - k_2 S_1 \\[5pt] -->
<!-- \frac{dS_2}{dt} &= k_2 S_1 - k_3 S_2 - k_4 S_2 -->
<!-- \end{align*} -->

<!-- \item Determine the Jacobian matrix for the following two systems: -->

<!-- \begin{align*} -->
<!-- \text{a)}\ \frac{dx}{dt} &= x^2 - y^2 \quad \frac{dy}{dt} = x (1 - y) \\[10pt] -->
<!-- \text{b)}\ \frac{dx}{dt} &= y - x y \quad \frac{dy}{dt} = x y -->
<!-- \end{align*} -->

<!-- \item Determine the Jacobian in terms of the unscaled elasticities and stoichiometry matrix for the following three systems: -->

<!-- \begin{align*} -->
<!-- \text{a)}\ X_o &\rightarrow S_1;\ S_1 \rightarrow S_2;\ S_2 \rightarrow S_3; S_3 \rightarrow X_1\\[5pt] -->
<!-- \text{b)}\ X_o &\rightarrow S_1;\ S_1 \rightarrow S_2;\ S_2 \rightarrow S_1;\ S_2 \rightarrow X_1\\[5pt] -->
<!-- \text{c)}\ S_1 &\rightarrow S_2;\ S_2 \rightarrow S_3 -->
<!-- \end{align*} -->

<!-- Assume all reactions are product insensitive, $X_i$ species are fixed, and in c) $S_3$ regulates the first step, $S_1 \rightarrow S_2$. -->

<!-- \item Show that the following system is stable to perturbations in S$_1$ and S$_2$ by computing the eigenvalues at steady state (See Listing~\ref{jarnac:chap:eigenvaluestability}): -->

<!-- $$ \text{X}_o \stackrel{v_1}{\rightarrow} \text{S}_1 \stackrel{v_2}{\rightarrow} \text{S}_2 \stackrel{v_3}{\rightarrow} \text{X}_1 $$ -->

<!-- The three rate laws are given by: -->

<!-- \begin{align*} -->
<!-- v_1 &= \frac{V_{m_1} X_o}{Km_1 + X_o + S_1/K_1} \\[5pt] -->
<!-- v_2 &= \frac{V_{m_2} S_1}{Km_2 + S_1 + S_2/K_2} \\[5pt] -->
<!-- v_3 &= \frac{V_{m_3} S_2}{Km_3 + S_2} \\[5pt] -->
<!-- \end{align*} -->

<!-- Assign the following values to the parameters: $X_o = 1; X_1 = 0; V_{m_1} = 1.5; V_{m_2} = 2.3; V_{m_3} = 1.9; K_{m_1} = 0.5$; $K_{m_2} = 0.6; K_{m_3} = 0.45; K_1 = 0.1; K_2 = 0.2$. -->

<!-- \item Given the Jacobian matrix you evaluated in question 1, do you think the system will stable or unstable? Hint: The eigenvalues of a triangular matrix are equal to the elements of the main diagonal. -->

<!-- \item Show that the following system is unstable. What kind of unstable dynamics does it have? -->

<!-- \begin{lstlisting} -->
<!-- import tellurium as te -->

<!-- r = te.loada (''' -->
<!-- J0: $X0 -> S1; VM1*(X0-S1/Keq1)/(1+X0+S1+pow(S4,h)); -->
<!-- J1: S1 -> S2; (10*S1-2*S2)/(1+S1+S2); -->
<!-- J2: S2 -> S3; (10*S2-2*S3)/(1+S2+S3); -->
<!-- J3: S3 -> S4; (10*S3-2*S4)/(1+S3+S4); -->
<!-- J4: S4 -> $X1; Vm4*S4/(KS4+S4); -->

<!-- X0 = 10;       X1 = 0; -->
<!-- S1 = 0.973182; S2 = 1.15274; -->
<!-- S3 = 1.22721;  S4 = 1.5635; -->
<!-- VM1 = 10;      Keq1 = 10; -->
<!-- h = 4;        Vm4 = 2.5; -->
<!-- KS4 = 0.5; -->
<!-- ''') -->
<!-- \end{lstlisting} -->

<!-- \item Show that the following system is unstable. What kind of unstable dynamics does it have? -->

<!-- \begin{lstlisting} -->
<!-- import tellurium as te -->

<!-- r = te.loada (''' -->
<!-- J0:  $src -> X;    k1*S; -->
<!-- J1:  X -> R;       (kop + ko*EP)*X; -->
<!-- J2:  R -> $waste;  k2*R; -->
<!-- J3:  E -> EP;      Vmax_1*R*E/(Km_1 + E); -->
<!-- J4:  EP -> E;      Vmax_2*EP/(Km_2 + EP); -->

<!-- src = 0;      kop = 0.01; -->
<!-- ko =  0.4;    k1 = 1; -->
<!-- k2 = 1;       R = 1; -->
<!-- EP = 1;       S = 0.2; -->
<!-- Km_1 = 0.05;  Km_2 = 0.05; -->
<!-- Vmax_2 = 0.3; Vmax_1 = 1; -->
<!-- KS4 = 0.5; -->
<!-- ''') -->

<!-- result = r.simulate(0, 500, 1000) -->
<!-- r.plot() -->
<!-- \end{lstlisting} -->

<!-- \end{enumerate} -->

<!-- \section*{Answers} -->

<!-- \begin{enumerate} -->

<!-- \item $$ -->
<!-- \begin{bmatrix}\\[-8pt] -->
<!-- -k_1 & -k_2 \\[7pt] -->
<!-- k_2 & -(k_3 + k_4) \\[7pt] -->
<!-- \end{bmatrix} -->
<!-- $$ -->
<!-- \begin{enumerate}[label=(\alph*)] -->
<!-- \item -->
<!-- $$ -->
<!-- \begin{bmatrix}\\[-8pt] -->
<!-- 2x & -2y \\[7pt] -->
<!-- 1-y & -x \\[7pt] -->
<!-- \end{bmatrix} -->
<!-- $$ -->
<!-- \item -->
<!-- $$ -->
<!-- \begin{bmatrix}\\[-8pt] -->
<!-- -y & 1-x \\[7pt] -->
<!-- y & x \\[7pt] -->
<!-- \end{bmatrix} -->
<!-- $$ -->
<!-- \end{enumerate} -->
<!-- \item -->
<!-- \begin{enumerate}[label=(\alph*)] -->
<!-- \item $$ -->
<!-- \begin{bmatrix}\\[-8pt] -->
<!-- -\varepsilon^2_1 & 0 & 0 \\[7pt] -->
<!-- \varepsilon^2_1 & -\varepsilon^3_2 & 0 \\[7pt] -->
<!-- 0 & \varepsilon^3_2 & -\varepsilon^4_3  \\ -->
<!-- \end{bmatrix} -->
<!-- $$ -->
<!-- \item -->
<!-- $$ -->
<!-- \begin{bmatrix}\\[-8pt] -->
<!-- -\varepsilon^2_1 & \varepsilon^3_2  \\[7pt] -->
<!-- \varepsilon^2_1 & -\varepsilon^3_2 -\varepsilon^4_2 \\ -->
<!-- \end{bmatrix} -->
<!-- $$ -->
<!-- \item -->
<!-- $$ -->
<!-- \begin{bmatrix}\\[-8pt] -->
<!-- -\varepsilon^1_1 & 0 & -\varepsilon^1_3 \\[7pt] -->
<!-- \varepsilon^1_1 & -\varepsilon^2_2 & 0 \\[7pt] -->
<!-- 0 & \varepsilon^2_2 & 0 \\ -->
<!-- \end{bmatrix} -->
<!-- $$ -->
<!-- \end{enumerate} -->

<!-- \item Stable -->
<!-- \begin{verbatim} -->
<!-- import telluirum as te -->
<!-- r = te.loada (''' -->
<!-- $Xo -> S1;  Vm1*Xo/(Km1 + Xo + S1/K1); -->
<!-- S1 -> S2; Vm2*S1/(Km2 + S1 + S2/K2) -->
<!-- S2 -> $X1; Vm3*S2/(Km3 + S2) -->

<!-- // Set up the model initial conditions -->
<!-- Xo = 1; X1 = 0 -->
<!-- Vm1 = 1.5; Vm2 = 2.3; Vm3 = 1.9 -->
<!-- Km1 = 0.5; Km2 = 0.6; Km3 = 0.45 -->
<!-- K1 = 0.1; K2 = 0.2 -->
<!-- ''') -->

<!-- # Evaluation of the steady state -->
<!-- print (r.getSteadyStateValues()) -->
<!-- # print the eigenvalues of the full Jacobian matrix -->
<!-- print (r.getFullEigenValues()) -->

<!-- [0.23769588 0.11506555] -->
<!-- [-1.5956469 +0.j -4.80299766+0.j] -->
<!-- \end{verbatim} -->

<!-- Both eigenvalues have negative real parts hence the system is stable. -->

<!-- \item The Jacobian has a triangular form, hence the eigenvalues are the values on the main diagonal, which in this case are $-k_1$ and $-(k_3+k_4)$. Since rate constants are positive, the eigenvalues must be negative. Hence the system is stable. -->

<!-- \item Using the commands: -->
<!-- \begin{verbatim} -->
<!-- # Evaluation of the steady state -->
<!-- print (r.getSteadyStateValues()) -->
<!-- # print the eigenvalues of the full Jacobian matrix -->
<!-- print (r.getFullEigenValues()) -->
<!-- \end{verbatim} -->
<!-- to compute the eigenvalues for the system. Running this code yields: -->
<!-- \begin{verbatim} -->
<!-- -0.24875048+1.04230509j, -0.24875048-1.04230509j, -->
<!-- -4.35227266+0.j -,5.35539319+0.j -->
<!-- \end{verbatim} -->

<!-- This includes two eigenvalues with negative real parts and a conjugate pair also with negative real parts. This corresponds to a stable spiral. that is a damped oscillation. -->

<!-- \item The system shows sustained oscillations with an alternation of rapid and slow dynamics. -->

<!-- \end{enumerate} -->

## Appendix

Proof that the presence of imaginary numbers in the solution to a set of differential equations means that the solution is periodic (Equation [Phase Portraits](#eqn-imaginaryperiodic)). Consider the system:

$$ x(t) = c_1 z_1 e^{(\lambda + i \mu) t} + c_2 z_2 e^{(\lambda - i \mu) t} $$

where $z_1$ and $z_2$ are corresponding conjugate eigenvectors. Using Euler's formula, $e^{i \mu} = \cos(\mu) + i \sin (\mu)$ and that $e^{(\lambda + i \mu) t} = e^{\lambda t} e^{i \mu t}$ we obtain:

$$
\begin{equation*}
\begin{split}
x(t) = c_1 z_1 e^{\lambda t} (\cos(\mu t) + i \sin (\mu t)) \\ + c_2 z_2 e^{\lambda t} (\cos(\mu t) - i \sin (\mu t))
\end{split}
\end{equation*}
$$

Writing the conjugate eigenvectors as $z_1 = a + b i$ and $z_2 = a - b i$, we get:

$$
\begin{equation*}
\begin{split}
x(t) = c_1 (a + b i) e^{\lambda t} (\cos(\mu t) + i \sin (\mu t)) \\ + (a - b i) e^{\lambda t} (\cos(\mu t) - i \sin (\mu t))
\end{split}
\end{equation*}
$$

Multiply out and separate the real and imaginary parts:

$$
\begin{equation*}
\begin{split}
 x(t) = e^{\lambda t} \left[c_1 (a \cos (\mu t) - b \sin(\mu t) + i (a \sin(\mu t) + b \cos(\mu t))) \right. \\
   +  \left. c_2 (a \cos(\mu t) - b \sin(\mu t) - i(a \sin(\mu t) + b \cos(\mu t))) \right]
\end{split}
\end{equation*}
$$

The complex terms cancel leaving only the real parts. If we set $c_1 + c_2 = k_1$ and $(c_1 - c_2)i = k_2$ then:

$$
\begin{equation*}
\begin{split}
 x(t) = e^{\lambda t} \left[k_1 (a \cos (\mu t) - b \sin (\mu t)) \right. \\
    \left. k_2 (a \sin (\mu t) + b \cos (\mu t)) \right]
\end{split}
\end{equation*}
$$

The solution is real when the constants $c_1$ and $c_2$ are real. This will only be the case when the eigenvalues are a conjugate pair, ($a \pm i b)$, which is the case we are considering. Therefore, systems that admit a complex pair of conjugate eigenvalues result in periodic real solutions.

```python
# Plot a phase portrait for a simple species species pathway
import tellurium as te
import  matplotlib.pyplot as plt

rr = te.loada ('''
    $Xo -> S1;  k1*Xo;
    S1 -> S2;   k2*S1;
    S2 -> $X1;  k3*S2;
    k1 = 0.6; Xo = 1;
    k2 = 0.4; k3 = 0.8;
''')

plt.figure(figsize=(9,4))
S1Start = 0
S2Start = 0
for i in range(1, 11):
    rr.S1 = S1Start
    rr.S2 = S2Start
    m = rr.simulate(0, 10, 120, ["S1", "S2"])
    p = te.plotArray(m, show=False)
    plt.setp (p, color='r')
    S1Start = S1Start + 0.2
S1Start = 2
S2Start = 0
for i in range(1, 11):
    rr.S1 = S1Start
    rr.S2 = S2Start
    m = rr.simulate(0, 10, 120, ["S1", "S2"])
    p = te.plotArray(m, show=False)
    plt.setp (p, color='r')
    S2Start = S2Start + 0.2
S2Start = 0
S1Start = 0
for i in range(1, 11):
    rr.S1 = S1Start
    rr.S2 = S2Start
    m = rr.simulate(0, 10, 120, ["S1", "S2"])
    p = te.plotArray(m, show=False)
    plt.setp (p, color='r')
    S2Start = S2Start + 0.2
S1Start = 0
S2Start = 2
for i in range(1, 11):
    rr.S1 = S1Start
    rr.S2 = S2Start
    m = rr.simulate(0, 10, 120, ["S1", "S2"])
    p = te.plotArray(m, show=False)
    plt.setp (p, color='r')
    S1Start = S1Start + 0.2
plt.xlim ([0, 2])
plt.ylim ([0, 2])
plt.xlabel ('S1', fontsize=16)
plt.ylabel ('S2', fontsize=16)
plt.savefig ("plot.pdf")
plt.show()
```

```python
# Toggle switch, nullcline and phase portrait
import numpy as np, matplotlib.pyplot as plt
import tellurium as te

Y, X = np.mgrid[0:8:200j, 0:8:200j]
U, V = np.mgrid[0:8:200j, 0:8:200j]

r = te.loada('''
    J1: -> x; k1/(1+y^n1) - k2*x;
    J2: -> y; k3/(1+x^n2) - k4*y;

    x = 4; y = -4;
    k1 = 12; k3 = 12; k2 = 2; k4 = 2
    n1 = 4; n2 = 4
''')

for idx in range (200):
    for idy in range (200):
        r.x = X[idx,idy];  r.y = Y[idx,idy]
        U[idx,idy] = r["x'"]
        V[idx,idy] = r["y'"]

plt.subplots(1,2, figsize=(8,6))
plt.subplot(111)
plt.xlabel('x', fontsize='16')
plt.ylabel('y', fontsize='16')
plt.streamplot(X, Y, U, V, density=[2, 2])

# Plot the nullclines
nullcline_x = np.linspace(0, 8, 200)
nullcline_y = (12 / (1 + nullcline_x**4))/2
plt.plot(nullcline_x, nullcline_y, lw=4, color='red')

nullcline_y = (12 / (1 + nullcline_x**4))/2
plt.plot(nullcline_y, nullcline_x, lw=4, color='red')

plt.plot(0, 6, '.', color='green', markersize=20)
plt.plot(6, 0, '.', color='green', markersize=20)
plt.plot(1.36, 1.36, '.', color='green', markersize=20)

plt.ylim((0,7))
plt.xlim((0,7))

plt.savefig ('c:\\tmp\\phase.pdf')
plt.show()
```

---

## Index terms recorded in this chapter

- bifurcation plot
- bistable
- complex number
- conjugate Pair
- disturbance
- eigenvalues
- elasticity
- elasticity matrix
- irreversible bistability
- Jacobian
- Jacobian matrix
- Jacobian of biochemical system
- multiple steady states
- network topology
- operator site
- Oscill8
- periodic behavior
- periodic solutions
- phase plot
- phase portrait
- positive feedback loop
- positive feedback: stability
- saddle node
- software: bifurcation
- spiral trajectories
- stability
- stable
- stable node
- transcription factor
- Tyson
- unstable node

---

← [[12_the_steady_state|The Steady State]] · [[index|Wiki index]] · [[14_modeling_feedforward_networks|Modeling FeedForward Networks]] →
