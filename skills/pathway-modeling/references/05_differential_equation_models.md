# Differential Equation Models

*Source: `chapter5.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Differential Equation Models <a id="chap-numericalmethods"></a>

## Introduction

In this chapter we will discuss how to solve the differential equations generated when we build a biochemical model ([[03_stoichiometric_networks|The System Equation]]). At first this may seem unnecessary given that modern software hides all the details and makes the effort so easy. However, it is still useful to know the basic approach and the limitations of black box solvers so that if problems do arise, one is in a better position to make an informed judgement on how to proceed.

## Differential Equation Models

To begin, consider the simplest possible model, the first-order irreversible degradation of reactant, S into product P:

$$ S \rightarrow P $$

The differential equation for this reaction is given by the familiar form:

$$
\begin{equation}
\frac{d\!S}{d\!t} = -k_1 S
\label{eqn:AnalyticalDecay}
\end{equation}
$$

Our aim is to solve this equation so that we can describe how S changes in time. There are at least two ways to do this: we can either solve the equation using algebraic methods, or we can use a computer to obtain a numerical solution. To solve the equation using algebra we first divide both sides by S:

$$
\begin{equation}
\frac{d\!S}{d\!t} \frac{1}{S} = -k_1
\label{eqn:diffEqn1}
\end{equation}
$$

In differential calculus, the derivative of $\ln y$ with respect to $t$ is:

$$ \frac{d\!\ln y}{d\!t} = \frac{d\!y}{d\!t} \frac{1}{y} $$

This means we can rewrite equation [Differential Equation Models](#eqn-diffeqn1) in the following form:

$$ \frac{d\!\ln S}{d\!t} = -k_1 $$

Now integrate both sides with respect to $d\!t$, that is:

$$
\begin{align*}
\int \frac{d\!\ln S}{\dt} \dt &= - k_1 \int dt \\[6pt]
\ln S &= -k_1 t + C
\end{align*}
$$

where $C$ is the constant of integration. If we assume that at $t=0$, $S = S_o$, then $\ln S_o
 = C$. Substituting this result into the solution yields:

$$ \ln S = -k_1 t + \ln S_o $$

$$\ln \left( \frac{S}{S_o} \right) = -k_1 t $$

Raising both sides to the power of $e$ and multiplying both sides by S$_o$ gives:

$$
\begin{align}
S = S_o e^{-k_1 t}
\label{eqn:expSolution}
\end{align}
$$

Figure [Figure: Exponential decay from the equation:](#fig-expdecay) illustrates one solution given a specific initial condition and value for the rate constant. For simple systems or nonlinear system we linearize, it is possible to obtain analytical solutions. However we are quickly confronted with the fact that for the vast majority of real problems, no analytical solution exists. In such cases we must use computers to obtain numerical solutions.

**Figure** <a id="fig-expdecay"></a> `fig:expDecay`

*Caption:* Exponential decay from the equation: $ S = S_o e^{k_1 t}$ where $S_o = 10, k_1 = 0.2$.

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}[scale=1]
\begin{axis}[
xlabel={Substrate Concentration},
ylabel={$\displaystyle S$},
xlabel={Time, t},
xmin=0,
xmax=20,
ymin=0,
ymax=10,
width=9.5cm,
height=6.5cm]
\addplot[color=blue,line width=1.5pt] expression[domain=0:20,samples=100]{10*exp(-0.2*\x)};
\end{axis}
\end{tikzpicture}
\caption{Exponential decay from the equation: $ S = S_o e^{k_1 t}$ where $S_o = 10, k_1 = 0.2$.}
\label{fig:expDecay}
\end{figure}
```

### Numerical Solutions

In the last section we saw how it was possible to solve a differential equation algebraically. If the system of differential equations is linear, there are systematic methods for deriving a solution. Most of the problems we encounter in biology however are non-linear and for such cases algebraic solutions rarely exist. Because of this, computer simulation is often used instead.  Since the 1960s, almost all simulations have been carried out using digital computers. Before the advent of digital computers, analog computers were frequently used. In these cases an analog of the system was built using either mechanical or more commonly, electrical analogs of concentrations. Here we will focus on methods used for digital computers.

The general approach to obtain a solution by computer:

- Construct the set of ordinary differential equations, with one differential equation for every floating molecular species in the model.
- Assign values to all the various kinetic constants and boundary species.
- Initialize all floating molecular species to their starting concentrations.
- Apply an integration algorithm to the set of differential equations.
- If required, compute the fluxes from the computed species concentrations.
- Plot the results of the simulation.

Step four is the most important and there exists a great variety of integration algorithms that may be used. We will describe three common approaches to give a flavor of how they work. Other than for educational purposes, it is rare for a modeler to write their own integration computer code because many sophisticated libraries and applications already exist.

An integration algorithm approximates the behavior of what is, strictly speaking, a continuous system on a digital computer. Since digital computers can only operate in discrete time, the algorithms convert the continuous system into a discrete time system. This is why digital computers can only generate approximations. In practice a particular discrete time step size, $h$, is chosen, and solution points are generated at intervals of $h$ until an upper time limit is reached. As we will discover, the approximation generated by the simplest method is dependent on the step size and in general, the smaller the step size the more accurate the solution. However, since computers can only represent numbers to a given precision (usually 15 to 16 digits on modern computers), it is not possible to continually reduce the step size in hopes of increasing accuracy. First, the algorithm will soon reach the computer's limits of precision and secondly, the smaller the step size the longer it will take to compute the solution. As a result, we often make a trade-off between accuracy versus computation time.

Let us first consider the simplest method, the Euler method, where the trade-off between accuracy and computer time can be clearly demonstrated.

### Euler Method

The Euler method is the simplest possible way to solve a set of ordinary differential equations (See [[appendix_f_math_fundamentals|Differential Equations]]). Consider the following differential equation that describes the degradation rate of a species, S:

$$ \frac{\dS}{dt} = -k_1 S $$

The Euler method uses the rate of change of S to predict the concentration at some future point in time. Figure [Figure: Euler Method](#fig-eulermethodgraphical) describes the method in detail. At time $t_1$ the rate of change in S is computed from the differential equation using the known concentration of S at $t_1$. The rate of change is used to compute the change in S over a time interval, $h$, using the relation, $h \dS/\dt$. The current time, $t_1$ is incremented by the time step, $h$, and the procedure is repeated again, this time starting at $t_2$. The method can be summarized by the following two equations which represent one step in an iteration that is repeated until the final time point is reached:

\stateComment{

$$
\begin{align}
y(t+h) &= y(t) + h\ \frac{dy(t)}{dt} \notag \\
t_{n+1} &= t_n + h
\label{eqn:EulerEquation}
\end{align}  }
$$

Figure [Figure: Euler Method](#fig-eulermethodgraphical) also highlights a problem with the Euler method. At every iteration there will be an error between the change in S we predict, and what the change in S should have been. This error is called the **truncation error** and will accumulate at each iteration. If the step size is too large, this error can make the method numerically unstable resulting in wild swings in the solution.

Figure [Figure: Euler Method](#fig-eulermethodgraphical) also suggests that the larger the step size, the larger the truncation error. This would imply that the smaller the step size, the more accurate the solution. This is indeed the case, up to a point. If the step size becomes too small, there is the risk that roundoff error will begin to have a significant effect and will propagate at each step. In addition, if the step size is too small, it will require a large number of iterations to simulate even a small time period. The final choice for the step size is therefore a compromise between accuracy and effort. A theoretical analysis of error propagation in the Euler method indicates that the error accumulated over the entire integration period (called the **global error**) is proportional to the step size. Therefore, halving the step size will reduce the global error by half. This means that to achieve even modest accuracy, small step sizes are necessary. As a result, the method is rarely used in practice. The advantage of the Euler method is that it is very easy to implement in computer code or even on a spreadsheet.

**Figure** <a id="fig-eulermethodgraphical"></a> `fig:EulerMethodGraphical`

*Graphic (not in the LaTeX source, referenced by name): `EulerAlg`*

*Caption:* Euler Method. Starting at $t_1$, the slope $d\!S/\dt$ at $T$ is computed (Panel A). The slope is used to project forward to the next solution in time step, $h$, to $t_2$ (Panel B). The new solution at $t_2$ is indicated by P. However the true solution is point R, located on the solution curve at $t_2$. Reducing the step size $h$ will reduce the error between the exact and projected solution, but will simultaneously increase the number of slope projections necessary to compute the solution over a given time period.

```latex
\begin{figure}[htbp]
\centering
    \includegraphics[scale = 0.71]{EulerAlg}
\caption{Euler Method. Starting at $t_1$, the slope $d\!S/\dt$ at $T$ is computed (Panel A). The slope is used to project forward to the next solution in time step, $h$, to $t_2$ (Panel B). The new solution at $t_2$ is indicated by P. However the true solution is point R, located on the solution curve at $t_2$. Reducing the step size $h$ will reduce the error between the exact and projected solution, but will simultaneously increase the number of slope projections necessary to compute the solution over a given time period.} \label{fig:EulerMethodGraphical}
\end{figure}
```

The Euler method can also be used to solve systems of differential equations. In this case all the rates of change are computed first, followed by the application of the Euler equation [Euler Method](#eqn-eulerequation). As in all numerical integration methods, the computation must start with an initial condition for the state variables at time zero. The algorithm is described using pseudo-code in Algorithm [Euler Method](#alg-euleralogrithm).

\renewcommand{\algorithmicendfor}{}

```latex
\begin{algorithm}[htbp]
\caption{Euler Integration Method. $f_i(y)$ represents the $i^{th}$ differential equation from the system of ordinary differential equations.} \label{alg:EulerAlogrithm}
\begin{algorithmic}
  \STATE{$n = \mbox{Number of state variables}$}
  \STATE{$y_i = i^{\text{th}} \mbox{ variable}$}
  \STATE{$f_i (y) = \text{rate of change at } y$}
  \STATE Set timeEnd
  \STATE $\mbox{currentTime} = 0$
  \STATE $h = \mbox{stepSize}$
  \STATE \text{Initialize all $y_i$ at currentTime}
  \linebreak

  \WHILE{$\text{currentTime} < \mbox{timeEnd}$}

    \FOR{$ i = 1 \text{ to } n$}
       \STATE{$dy_i = f_i(y)$}
    \ENDFOR

    \FOR{$ i = 1 \text{ to } n$}
       \STATE{$y_i(t+h) = y_i(t) + h\ dy_i$}
    \ENDFOR
    \STATE{$\mbox{currentTime} = \mbox{currentTime} + h$}
  \ENDWHILE
\end{algorithmic}
\end{algorithm}
```

**Example**
Solve the decay differential equation [Differential Equation Models](#eqn-analyticaldecay) using the Euler method. Assume $k_1 = 0.2$ and the concentration of S$_o$ and P are time $ = 0$ is $10$ and $0$, respectively. Assume a step size $h$, of 0.4. Form a table of four columns, write out the solution to three decimal places. The 4$^{th}$ column should include the exact solution [Differential Equation Models](#eqn-expsolution) for comparison.

**Table**

*Caption:* Solution to equation [Differential Equation Models](#eqn-analyticaldecay) using a step size of $h = 0.4$.

```latex
\begin{table}[H]
\begin{center}
\begin{tabular}{llll}\toprule
Time & Numerical Solution (S) & $\dS/\dt$ & Exact Solution\\ \midrule
0    & 10      & 2     &  10 \\
0.4  & 9.2     & 1.84  & 9.23 \\
0.8  & 8.464   & 1.6928  & 8.52\\
1.2  & 7.787   & 0.01 & 7.87 \\
\ldots & & \\
\bottomrule
\end{tabular}
\caption{Solution to equation~\eqref{eqn:AnalyticalDecay} using a step size of $h = 0.4$.}
\end{center}
\end{table}
```

Figure [Figure: Effect of different step sizes on the Euler method using a simple line](#fig-eulertest) shows the effect of different step sizes on the Euler method. Four cases are shown, in the worse case ($h=0.55$) the solution is unbounded and the computer will eventually crash with an overflow error. The second case ($h=0.5$) is where the result is bounded, but the solution bears no resemblance at all to the actual solution. The third case ($h=0.00625$) shows that the solution is beginning to resemble the actual solution, but irregularities appear near the start of the integration. The final case shows the actual solution generated from a specialized integrator.

**Figure** <a id="fig-eulertest"></a> `fig:eulerTest`

*Caption:* Effect of different step sizes on the Euler method using a simple linear chain of reactions where each reaction follows reversible mass-action kinetics:  \\[8pt]
$ X_o \stackrel[k_2]{k_1}{\rightleftharpoons} S_1,\quad  S_1 \stackrel[k_4]{k_3}{\rightleftharpoons} S_2,\quad S_2 \stackrel[k_6]{k_5}{\rightleftharpoons} S_3,\quad  S_3 \stackrel{k_7}{\rightleftharpoons} X_1 $  \\[8pt]
where $k_1 = 0.45, k_2 = 0.23, k_3 = 0.67, k_4 = 1.2, k_5 = 2.3, k_6 = 0.3, k_7 = 0.73, X_o = 10, X_1 = 0, S_1 = 5, S_2 = 15, S_3 = 20$. See text for details.

```latex
\begin{figure}[htbp]
\centering
\begin{tikzpicture}
\pgfplotsset{title style={at={(0.60,1)}}}
\matrix{
\begin{axis}[
xlabel={$t$},
title={\footnotesize $h=0.55$, unbounded},
xmin=0,
xmax=25,
ymin=-30000,
ymax=30000,
width=6.8cm,
height=5cm]

\addplot[color=red,line width=0.8pt] coordinates {
(0,	5)
(0.55556,	15.0001)
(1.11112,	4.01834)
(1.66668,	16.9612)
(2.22224,	0.261045)
(2.7778,	 19.6342)
(3.33336,	-4.81796)
(3.88892,	24.28)
(4.44448,	-11.71)
(5.00004,	31.7205)
(5.5556,	  -21.5035)
(6.11116,	43.1008)
(6.66672,	-35.7814)
(7.22228,	60.1854)
(7.77784,	-56.8261)
(8.3334,	  85.6509)
(8.88896,	-87.9782)
(9.44452,	123.507)
(10.0001,	-134.168)
(10.5556,	179.725)
(11.1112,	-202.696)
(11.6668,	263.18)
(12.2223,	-304.388)
(12.7779,	387.052)
(13.3334,	-455.308)
(13.889,	  570.903)
(14.4446,	-679.294)
(15.0001,	843.771)
(15.5557,	-1011.72)
(16.1112,	1248.75)
(16.6668,	-1505.1)
(17.2224,	1849.82)
(17.7779,	-2237.35)
(18.3335,	2741.89)
(18.889,	  -3324.13)
(19.4446,	4065.87)
(20.0002,	-4937.09)
(20.5557,	6030.88)
(21.1113,	-7330.98)
(21.6668,	8947.27)
(22.2224,	-10883.9)
(22.778,	13275.7)
(23.3335,	-16157)
(23.8891,	19699.7)
(24.4446,	-23983.2)
(25.0002,	29234)
};

\addplot[color=blue,line width=0.8pt] coordinates {
(0,	15)
(0.55556,	-8.97241)
(1.11112,	18.6779)
(1.66668,	-16.0791)
(2.22224,	25.5054)
(2.7778,	-25.7023)
(3.33336,	36.2832)
(3.88892,	-39.5246)
(4.44448,	52.6127)
(5.00004,	-59.795)
(5.5556,	77.028)
(6.11116,	-89.7467)
(6.66672,	113.363)
(7.22228,	-134.127)
(7.77784,	167.344)
(8.3334,	-199.953)
(8.88896,	247.491)
(9.44452,	-297.629)
(10.0001,	366.459)
(10.5556,	-442.582)
(11.1112,	543.036)
(11.6668,	-657.71)
(12.2223,	805.11)
(12.7779,	-976.991)
(13.3334,	1194.07)
(13.889,	-1450.85)
(14.4446,	1771.36)
(15.0001,	-2154.14)
(15.5557,	2628.15)
(16.1112,	-3197.93)
(16.6668,	3899.76)
(17.2224,	-4747.09)
(17.7779,	5787.04)
(18.3335,	-7046.29)
(18.889,	8588.07)
(19.4446,	-10458.7)
(20.0002,	12745.3)
(20.5557,	-15523.2)
(21.1113,	18915.2)
(21.6668,	-23039.8)
(22.2224,	28072.4)
(22.778,	-34195.7)
(23.3335,	41663.2)
(23.8891,	-50752.8)
(24.4446,	61834.1)
(25.0002,	-75326.3)
};

\addplot[color=green,line width=0.8pt] coordinates {
(0,	20)
(0.55556,	27.7223)
(1.11112,	0.394007)
(1.66668,	24.035)
(2.22224,	-10.2642)
(2.7778,	28.1997)
(3.33336,	-20.7791)
(3.88892,	37.4735)
(4.44448,	-34.4739)
(5.00004,	52.4808)
(5.5556,	-53.9555)
(6.11116,	75.3448)
(6.66672,	-82.4468)
(7.22228,	109.585)
(7.77784,	-124.508)
(8.3334,	160.569)
(8.88896,	-186.811)
(9.44452,	236.329)
(10.0001,	-279.211)
(10.5556,	348.818)
(11.1112,	-416.311)
(11.6668,	515.798)
(12.2223,	-619.769)
(12.7779,	763.639)
(13.3334,	-921.723)
(13.889,	1131.48)
(14.4446,	-1369.86)
(15.0001,	1677.43)
(15.5557,	-2034.98)
(16.1112,	2487.71)
(16.6668,	-3022.11)
(17.2224,	3690.29)
(17.7779,	-4487.17)
(18.3335,	5475.12)
(18.889,	-6661.56)
(19.4446,	8124.1)
(20.0002,	-9888.71)
(20.5557,	12055.6)
(21.1113,	-14678.3)
(21.6668,	17890.6)
(22.2224,	-21786.9)
(22.778,	26550.7)
(23.3335,	-32337.2)
(23.8891,	39403.7)
(24.4446,	-47995.5)
(25.0002,	58479.6)
};
%\draw(90pt,90pt) node[anchor=west] {\large $B$};
%\fill [red] (axis cs:1.33,0.4) circle (2.5pt);

\end{axis}
&
\begin{axis}[
xlabel={$t$},
title={\footnotesize  $h=0.5$, bounded},
xmin=0,
xmax=25,
ymin=-95000,
ymax=95000,
width=6.8cm,
height=5cm]

\addplot[color=blue,line width=0.6pt] coordinates {
(0,	5)
(0.5,	35485.7)
(1,	-35344)
(1.5,	35232.1)
(2,	-35091.4)
(2.5,	34980.3)
(3,	-34840.5)
(3.5,	34730.4)
(4,	-34591.4)
(4.5,	34482.2)
(5,	-34344.1)
(5.5,	34235.8)
(6,	-34098.6)
(6.5,	33991.1)
(7,	-33854.9)
(7.5,	33748.3)
(8,	-33612.8)
(8.5,	33507.1)
(9,	-33372.6)
(9.5,	33267.7)
(10,	-33134)
(10.5,	33029.9)
(11, -32897.1)
(11.5,	32793.9)
(12,	-32661.9)
(12.5,	32559.6)
(13,	-32428.4)
(13.5,	32326.9)
(14,	-32196.6)
(14.5,	32095.9)
(15,	-31966.4)
(15.5,	31866.6)
(16,	-31737.9)
(16.5,	31638.9)
(17,	-31511)
(17.5,	31412.8)
(18,	-31285.8)
(18.5,	31188.3)
(19,	-31062.1)
(19.5,	30965.5)
(20,	-30840)
(20.5,	30744.2)
(21,	-30619.6)
(21.5,	30524.5)
(22,	-30400.7)
(22.5,	30306.4)
(23,	-30183.3)
(23.5,	30089.9)
(24,	-29967.6)
(24.5,	29874.9)
(25,	-29753.3)
};

\addplot[color=red,line width=0.6pt] coordinates {
(0,	15)
(0.5,	-91439)
(1,	91115.1)
(1.5,	-90785.4)
(2,	90463.9)
(2.5,	-90136.5)
(3,	89817.3)
(3.5,	-89492.3)
(4,	89175.4)
(4.5,	-88852.7)
(5,	88538)
(5.5,	-88217.6)
(6,	87905.2)
(6.5,	-87587.1)
(7,	87277)
(7.5,	-86961.1)
(8,	86653.2)
(8.5,	-86339.5)
(9,	86033.9)
(9.5,	-85722.4)
(10,	85419)
(10.5,	-85109.7)
(11,	84808.5)
(11.5,	-84501.4)
(12,	84202.3)
(12.5,	-83897.4)
(13,	83600.5)
(13.5,	-83297.8)
(14,	83003)
(14.5,	-82702.4)
(15,	82409.8)
(15.5,	-82111.3)
(16,	81820.8)
(16.5,	-81524.4)
(17,	81236)
(17.5,	-80941.7)
(18,	80655.4)
(18.5,	-80363.2)
(19,	80079)
(19.5,	-79788.8)
(20,	79506.6)
(20.5,	-79218.5)
(21,	78938.4)
(21.5,	-78652.3)
(22,	78374.2)
(22.5,	-78090.2)
(23,	77814.1)
(23.5,	-77532)
(24,	77257.9)
(24.5,	-76977.9)
(25,	76705.8)
};

\addplot[color=green,line width=0.6pt] coordinates {
(0,	20)
(0.5,	70987.7)
(1,	-70725.8)
(1.5,	70480.3)
(2,	-70220.3)
(2.5,	69976.6)
(3,	-69718.4)
(3.5,	69476.5)
(4,	-69220)
(4.5,	68980)
(5,	-68725.3)
(5.5,	68487)
(6,	-68234.1)
(6.5,	67997.5)
(7,	-67746.4)
(7.5,	67511.5)
(8,	-67262.1)
(8.5,	67029)
(9,	-66781.4)
(9.5,	66550)
(10,	-66304)
(10.5,	66074.4)
(11,	-65830.1)
(11.5,	65602.1)
(12,	-65359.6)
(12.5,	65133.3)
(13,	-64892.4)
(13.5,	64667.8)
(14,	-64428.6)
(14.5,	64205.6)
(15,	-63968.1)
(15.5,	63746.8)
(16,	-63510.8)
(16.5,	63291.2)
(17,	-63056.9)
(17.5,	62838.8)
(18,	-62606.2)
(18.5,	62389.7)
(19,	-62158.7)
(19.5,	61943.9)
(20,	-61714.4)
(20.5,	61501.2)
(21,	-61273.3)
(21.5,	61061.6)
(22,	-60835.3)
(22.5,	60625.2)
(23,	-60400.5)
(23.5,	60191.9)
(24,	-59968.7)
(24.5,	59761.8)
(25,	-59540.1)
};

\end{axis}
\\[14pt]
\begin{axis}[
xlabel={$t$},
title={\footnotesize $h=0.00625$, convergent},
xmin=0,
xmax=25,
ymin=0,
ymax=22,
width=6.8cm,
height=5cm]

\addplot[color=blue,line width=0.6pt] coordinates {
(0,	5)
(0.4545,	13.181)
(0.909,	7.31935)
(1.3635,	12.0027)
(1.818,	7.70913)
(2.2725,	10.6044)
(2.727,	7.64355)
(3.1815,	9.51028)
(3.636,	7.51923)
(4.0905,	8.74813)
(4.545,	7.42391)
(4.9995,	8.24076)
(5.454,	7.36431)
(5.9085,	7.90954)
(6.363,	7.33064)
(6.8175,	7.69516)
(7.272,	7.31309)
(7.7265,	7.5569)
(8.181,	7.30479)
(8.6355,	7.46786)
(9.09,	7.30148)
(9.5445,	7.41051)
(9.999,	7.3007)
(10.4535,	7.37357)
(10.908,	7.30106)
(11.3625,	7.34975)
(11.817,	7.30187)
(12.2715,	7.33438)
(12.726,	7.30275)
(13.1805,	7.32446)
(13.635,	7.30356)
(14.0895,	7.31805)
(14.544,	7.30424)
(14.9985,	7.3139)
(15.453,	7.30477)
(15.9075,	7.31122)
(16.362,	7.30518)
(16.8165,	7.30948)
(17.271,	7.30548)
(17.7255,	7.30835)
(18.18,	7.30571)
(18.6345,	7.30762)
(19.089,	7.30587)
(19.5435,	7.30714)
(19.998,	7.30598)
(20.4525,	7.30683)
(20.907,	7.30607)
(21.3615,	7.30663)
(21.816,	7.30612)
(22.2705,	7.3065)
(22.725,	7.30616)
(23.1795,	7.30641)
(23.634,	7.30619)
(24.0885,	7.30636)
(24.543, 7.30621)
(24.9975,	7.30632)
};

\addplot[color=red,line width=0.6pt] coordinates {
(0,	15)
(0.4545,	-4.61168)
(0.909,	10.3266)
(1.3635,	-2.62034)
(1.818,	7.34034)
(2.2725,	-1.22545)
(2.727,	5.40535)
(3.1815,	-0.26792)
(3.636,	4.14264)
(4.0905,	0.383117)
(4.545,	3.31564)
(4.9995,	0.823578)
(5.454,	2.77292)
(5.9085,	1.12073)
(6.363,	2.41633)
(6.8175,	1.32084)
(7.272,	2.18185)
(7.7265,	1.45543)
(8.181,	2.02758)
(8.6355,	1.54584)
(9.09,	1.92602)
(9.5445,	1.60653)
(9.999,	1.85913)
(10.4535,	1.64724)
(10.908,	1.81506)
(11.3625,	1.67452)
(11.817,	1.78602)
(12.2715,	1.6928)
(12.726,	1.76686)
(13.1805,	1.70503)
(13.635,	1.75423)
(14.0895,	1.71321)
(14.544,	1.7459)
(14.9985,	1.71869)
(15.453,	1.7404)
(15.9075,	1.72234)
(16.362,	1.73676)
(16.8165,	1.72479)
(17.271,	1.73436)
(17.7255,	1.72642)
(18.18,	    1.73278)
(18.6345,	1.72751)
(19.089,	1.73173)
(19.5435,	1.72824)
(19.998,	1.73104)
(20.4525,	1.72872)
(20.907,	1.73058)
(21.3615,	1.72904)
(21.816,	1.73028)
(22.2705,	1.72926)
(22.725,	1.73008)
(23.1795,	1.7294)
(23.634,	1.72995)
(24.0885,	1.7295)
(24.543,	1.72986)
(24.9975,	1.72956)
};

\addplot[color=green,line width=0.6pt] coordinates {
(0,	20)
(0.4545,	26.3176)
(0.909,	9.17657)
(1.3635,	15.6756)
(1.818,	5.59812)
(2.2725,	10.6507)
(2.727,	4.38369)
(3.1815,	7.98201)
(3.636,	3.96528)
(4.0905,	6.43951)
(4.545,	3.82544)
(4.9995,	5.50062)
(5.454,	3.78651)
(5.9085,	4.91258)
(6.363,	3.78439)
(6.8175,	4.53869)
(7.272,	3.79472)
(7.7265,	4.29908)
(8.181,	3.80796)
(8.6355,	4.14485)
(9.09,	3.82045)
(9.5445,	4.04532)
(9.999,	3.83096)
(10.4535,	3.981)
(10.908,	3.83929)
(11.3625,	3.93936)
(11.817,	3.84567)
(12.2715,	3.91239)
(12.726,	3.85043)
(13.1805,	3.8949)
(13.635,	3.85391)
(14.0895,	3.88355)
(14.544,	3.85643)
(14.9985,	3.87617)
(15.453,	3.85823)
(15.9075,	3.87138)
(16.362,	3.8595)
(16.8165,	3.86826)
(17.271,	3.8604)
(17.7255,	3.86623)
(18.18,	    3.86102)
(18.6345,	3.8649)
(19.089,	3.86146)
(19.5435,	3.86404)
(19.998,	3.86176)
(20.4525,	3.86348)
(20.907,	3.86197)
(21.3615,	3.86311)
(21.816,	3.86211)
(22.2705,	3.86287)
(22.725,	3.86221)
(23.1795,	3.86271)
(23.634,	3.86227)
(24.0885,	3.86261)
(24.543,	3.86232)
(24.9975,	3.86254)
};
\end{axis}
&
\begin{axis}[
xlabel={$t$},
title={\footnotesize Best solution},
xmin=0,
xmax=25,
ymin=0,
ymax=22,
width=6.8cm,
height=5cm]

\addplot[color=blue,line width=0.6pt] coordinates {
(0,	5)
(0.13966, 6.95513)
(0.27933, 8.11392)
(0.41899, 8.8016)
(0.55865, 9.20694)
(0.69832, 9.44022)
(0.83798, 9.56646)
(0.97765, 9.62451)
(1.11732,	9.63796)
(1.25698,	9.62151)
(1.39665,	9.58454)
(1.53631,	9.53327)
(1.67598,	9.47197)
(1.81564,	9.40365)
(1.95531,	9.33056)
(2.09497,	9.25436)
(2.23464,	9.17637)
(2.37430,	9.09761)
(2.51397,	9.01889)
(2.65363,	8.94085)
(2.79330,	8.864)
(2.93296,	8.78875)
(3.07263,	8.71541)
(3.21229,	8.64421)
(3.35196,	8.57533)
(3.49162,	8.5089)
(3.63128,	8.44499)
(3.77095,	8.38367)
(3.91061,	8.32494)
(4.05028,	8.26881)
(4.18994,	8.21524)
(4.32961,	8.16419)
(4.46927,	8.11561)
(4.60894,	8.06944)
(4.74860,	8.02561)
(4.88827,	7.98403)
(5.02793,	7.94464)
(5.16760,	7.90734)
(5.30726,	7.87205)
(5.44693,	7.83868)
(5.58659,	7.80716)
(5.72626,	7.77739)
(5.86592,	7.74929)
(6.00559,	7.72279)
(6.14525,	7.69779)
(6.28492,	7.67424)
(6.42458,	7.65204)
(6.56425,	7.63114)
(6.70391,	7.61146)
(6.84358,	7.59293)
(6.98324,	7.5755)
(7.12291,	7.5591)
(7.26257,	7.54368)
(7.40223,	7.52917)
(7.54190,	7.51554)
(7.68156,	7.50272)
(7.82123,	7.49067)
(7.96089,	7.47935)
(8.10056,	7.46872)
(8.24022,	7.45872)
(8.37989,	7.44934)
(8.51955,	7.44053)
(8.65922,	7.43225)
(8.79888,	7.42448)
(8.93855,	7.41718)
(9.07821,	7.41033)
(9.21788,	7.4039)
(9.35754,	7.39786)
(9.49721,	7.3922)
(9.63687,	7.38688)
(9.77654,	7.38189)
(9.91620, 7.36482)
(10.0559,	7.37281)
(10.1955,	7.36869)
(10.3352,	7.36482)
(10.4749,	7.36119)
(10.6145,	7.35778)
(10.7542,	7.35459)
(10.8939,	7.35159)
(11.0335,	7.34878)
(11.1732,	7.34614)
(11.3128,	7.34366)
(11.4525,	7.34134)
(11.5922,	7.33917)
(11.7318,	7.33712)
(11.8715,	7.33521)
(12.0112,	7.33341)
(12.1508,	7.33172)
(12.2905,	7.33014)
(12.4302,	7.32866)
(12.5698,	7.32727)
(12.7095,	7.32596)
(12.8492,	7.32474)
(12.9888,	7.32359)
(13.1285,	7.32252)
(13.2682,	7.32151)
(13.4078,	7.32056)
(13.5475,	7.31967)
(13.6872,	7.31884)
(13.8268,	7.31806)
(13.9665,	7.31733)
(14.1061,	7.31664)
(14.2458,	7.316)
(14.3855,	7.31539)
(14.5251,	7.31483)
(14.6648,	7.31429)
(14.8045,	7.3138)
(14.9441,	7.31333)
(15.0838,	7.31289)
(15.2235,	7.31248)
(15.3631,	7.31209)
(15.5028,	7.31173)
(15.6425,	7.31139)
(15.7821,	7.31108)
(15.9218,	7.31078)
(16.0615,	7.3105)
(16.2011,	7.31023)
(16.3408,	7.30999)
(16.4804,	7.30976)
(16.6201,	7.30954)
(16.7598,	7.30934)
(16.8994,	7.30915)
(17.0391,	7.30897)
(17.1788,	7.3088)
(17.3184,	7.30865)
(17.4581,	7.3085)
(17.5978,	7.30837)
(17.7374,	7.30824)
(17.8771,	7.30812)
(18.0168,	7.308)
(18.1564,	7.3079)
(18.2961,	7.3078)
(18.4358,	7.3077)
(18.5754,	7.30761)
(18.7151,	7.30753)
(18.8547,	7.30745)
(18.9944,	7.30738)
(19.1341,	7.30731)
(19.2737,	7.30725)
(19.4134,	7.30719)
(19.5531,	7.30713)
(19.6927,	7.30708)
(19.8324,	7.30703)
(19.9721,	7.30698)
(20.1117,	7.30694)
(20.2514,	7.30689)
(20.3911,	7.30686)
(20.5307,	7.30682)
(20.6704,	7.30678)
(20.8101,	7.30675)
(20.9497,	7.30672)
(21.0894,	7.30669)
(21.2291,	7.30667)
(21.3687,	7.30664)
(21.5084,	7.30662)
(21.6480,	7.3066)
(21.7877,	7.30658)
(21.9274,	7.30656)
(22.0670,	7.30654)
(22.2067,	7.30652)
(22.3464,	7.3065)
(22.4860,	7.30649)
(22.6257,	7.30648)
(22.7654,	7.30646)
(22.9050,	7.30645)
(23.0447,	7.30644)
(23.1844,	7.30643)
(23.3240,	7.30642)
(23.4637,	7.30641)
(23.6034,	7.3064)
(23.7430,	7.30639)
(23.8827,	7.30638)
(24.0223,	7.30637)
(24.1620,	7.30637)
(24.3017,	7.30636)
(24.4413,	7.30635)
(24.5810,	7.30635)
(24.7207,	7.30634)
(24.8603,	7.30634)
(25, 7.30633)
};

\addplot[color=red,line width=0.6pt] coordinates {
(0,	15)
(0.13966,	10.3406)
(0.27933,	7.60336)
(0.41899,	5.97186)
(0.55865,	4.97812)
(0.69832,	4.35389)
(0.83798,	3.94519)
(0.97765,	3.66356)
(1.11732,	3.45806)
(1.25698,	3.29927)
(1.39665,	3.1701)
(1.53631,	3.06054)
(1.67598,	2.96466)
(1.81564,	2.87889)
(1.95531,	2.80101)
(2.09497,	2.7296)
(2.23464,	2.66371)
(2.37430,	2.60264)
(2.51397,	2.5459)
(2.65363,	2.49309)
(2.7933,	2.44387)
(2.93296,	2.39795)
(3.07263,	2.3551)
(3.21229,	2.31508)
(3.35196,	2.2777)
(3.49162,	2.24276)
(3.63128,	2.21011)
(3.77095,	2.17958)
(3.91061,	2.15103)
(4.05028,	2.12433)
(4.18994,	2.09935)
(4.32961,	2.07598)
(4.46927,	2.05411)
(4.60894,	2.03364)
(4.7486,   2.01447)
(4.88827,	1.99654)
(5.02793,	1.97974)
(5.1676,   1.96401)
(5.30726,	1.94929)
(5.44693,	1.9355)
(5.58659,	1.92258)
(5.72626,	1.91048)
(5.86592,	1.89914)
(6.00559,	1.88852)
(6.14525,	1.87857)
(6.28492,	1.86925)
(6.42458,	1.86052)
(6.56425,	1.85233)
(6.70391,	1.84466)
(6.84358,	1.83747)
(6.98324,	1.83073)
(7.12291,	1.82442)
(7.26257,	1.8185)
(7.40223,	1.81296)
(7.54190,	1.80776)
(7.68156,	1.80289)
(7.82123,	1.79832)
(7.96089,	1.79404)
(8.10056,	1.79002)
(8.24022,	1.78626)
(8.37989,	1.78273)
(8.51955,	1.77942)
(8.65922,	1.77632)
(8.79888,	1.77341)
(8.93855,	1.77069)
(9.07821,	1.76813)
(9.21788,	1.76574)
(9.35754,	1.76349)
(9.49721,	1.76139)
(9.63687,	1.75941)
(9.77654,	1.75756)
(9.9162,    1.75582)
(10.0559,	1.7542)
(10.1955,	1.75267)
(10.3352,	1.75124)
(10.4749,	1.7499)
(10.6145,	1.74864)
(10.7542,	1.74746)
(10.8939,	1.74635)
(11.0335,	1.74532)
(11.1732,	1.74434)
(11.3128,	1.74343)
(11.4525,	1.74258)
(11.5922,	1.74178)
(11.7318,	1.74102)
(11.8715,	1.74032)
(12.0112,	1.73966)
(12.1508,	1.73904)
(12.2905,	1.73846)
(12.4302,	1.73791)
(12.5698,	1.7374)
(12.7095,	1.73692)
(12.8492,	1.73647)
(12.9888,	1.73605)
(13.1285,	1.73566)
(13.2682,	1.73528)
(13.4078,	1.73494)
(13.5475,	1.73461)
(13.6872,	1.73431)
(13.8268,	1.73402)
(13.9665,	1.73375)
(14.1061,	1.7335)
(14.2458,	1.73326)
(14.3855,	1.73304)
(14.5251,	1.73283)
(14.6648,	1.73264)
(14.8045,	1.73245)
(14.9441,	1.73228)
(15.0838,	1.73212)
(15.2235,	1.73197)
(15.3631,	1.73183)
(15.5028,	1.7317)
(15.6425,	1.73157)
(15.7821,	1.73146)
(15.9218,	1.73135)
(16.0615,	1.73125)
(16.2011,	1.73115)
(16.3408,	1.73106)
(16.4804,	1.73097)
(16.6201,	1.73089)
(16.7598,	1.73082)
(16.8994,	1.73075)
(17.0391,	1.73069)
(17.1788,	1.73062)
(17.3184,	1.73057)
(17.4581,	1.73051)
(17.5978,	1.73046)
(17.7374,	1.73042)
(17.8771,	1.73037)
(18.0168,	1.73033)
(18.1564,	1.73029)
(18.2961,	1.73025)
(18.4358,	1.73022)
(18.5754,	1.73019)
(18.7151,	1.73016)
(18.8547,	1.73013)
(18.9944,	1.7301)
(19.1341,	1.73008)
(19.2737,	1.73005)
(19.4134,	1.73003)
(19.5531,	1.73001)
(19.6927,	1.72999)
(19.8324,	1.72997)
(19.9721,	1.72996)
(20.1117,	1.72994)
(20.2514,	1.72992)
(20.3911,	1.72991)
(20.5307,	1.7299)
(20.6704,	1.72988)
(20.8101,	1.72987)
(20.9497,	1.72986)
(21.0894,	1.72985)
(21.2291,	1.72984)
(21.3687,	1.72983)
(21.5084,	1.72982)
(21.6480,	1.72982)
(21.7877,	1.72981)
(21.9274,	1.7298)
(22.0670,	1.72979)
(22.2067,	1.72979)
(22.3464,	1.72978)
(22.4860,	1.72978)
(22.6257,	1.72977)
(22.7654,	1.72977)
(22.9050,	1.72976)
(23.0447,	1.72976)
(23.1844,	1.72975)
(23.3240,	1.72975)
(23.4637,	1.72975)
(23.6034,	1.72974)
(23.7430,	1.72974)
(23.8827,	1.72974)
(24.0223,	1.72973)
(24.1620,	1.72973)
(24.3017,	1.72973)
(24.4413,	1.72973)
(24.5810,	1.72972)
(24.7207,	1.72972)
(24.8603,	1.72972)
(25,	    1.72972)
};

\addplot[color=green,line width=0.6pt] coordinates {
(0,	20)
(0.13966,	21.0324)
(0.27930,	20.8532)
(0.41899,	20.0636)
(0.55865,	18.998)
(0.69832,	17.8394)
(0.83798,	16.6852)
(0.97765,	15.5844)
(1.11732,	14.5595)
(1.25698,	13.6182)
(1.39665,	12.7603)
(1.53631,	11.9819)
(1.67598,	11.2772)
(1.81564,	10.6398)
(1.95531,	10.0634)
(2.09497,	9.542)
(2.23464,	9.06995)
(2.37430,	8.64218)
(2.51397,	8.25414)
(2.65363,	7.90172)
(2.79330,	7.58127)
(2.93296,	7.28955)
(3.07263,	7.02365)
(3.21229,	6.781)
(3.35196,	6.5593)
(3.49162,	6.3565)
(3.63128,	6.17077)
(3.77095,	6.00048)
(3.91061,	5.84419)
(4.05028,	5.70058)
(4.18994,	5.56849)
(4.32961,	5.44688)
(4.46927,	5.3348)
(4.60894,	5.23141)
(4.74860,	5.13595)
(4.88827,	5.04773)
(5.02793,	4.96615)
(5.1676,    4.89064)
(5.30726,	4.8207)
(5.44693,	4.75587)
(5.58659,	4.69573)
(5.72626,	4.63992)
(5.86592,	4.58808)
(6.00559,	4.5399)
(6.14525,	4.49511)
(6.28492,	4.45344)
(6.42458,	4.41466)
(6.56425,	4.37854)
(6.70391,	4.3449)
(6.84358,	4.31354)
(6.98324,	4.28431)
(7.12291,	4.25704)
(7.26257,	4.23159)
(7.40223,	4.20785)
(7.54190,	4.18568)
(7.68156,	4.16497)
(7.82123,	4.14563)
(7.96089,	4.12756)
(8.10056,	4.11067)
(8.24022,	4.09488)
(8.37989,	4.08011)
(8.51955,	4.06631)
(8.65922,	4.05339)
(8.79888,	4.04131)
(8.93855,	4.03)
(9.07821,	4.01942)
(9.21788,	4.00952)
(9.35754,	4.00025)
(9.49721,	3.99158)
(9.63687,	3.98345)
(9.77654,	3.97584)
(9.91620,	3.96872)
(10.0559,	3.96205)
(10.1955,	3.9558)
(10.3352,	3.94994)
(10.4749,	3.94446)
(10.6145,	3.93932)
(10.7542,	3.93451)
(10.8939,	3.93)
(11.0335,	3.92577)
(11.1732,	3.92181)
(11.3128,	3.9181)
(11.4525,	3.91462)
(11.5922,	3.91136)
(11.7318,	3.90831)
(11.8715,	3.90545)
(12.0112,	3.90276)
(12.1508,	3.90025)
(12.2905,	3.89789)
(12.4302,	3.89568)
(12.5698,	3.8936)
(12.7095,	3.89166)
(12.8492,	3.88984)
(12.9888,	3.88813)
(13.1285,	3.88653)
(13.2682,	3.88503)
(13.4078,	3.88363)
(13.5475,	3.88231)
(13.6872,	3.88107)
(13.8268,	3.87991)
(13.9665,	3.87882)
(14.1061,	3.8778)
(14.2458,	3.87685)
(14.3855,	3.87595)
(14.5251,	3.87511)
(14.6648,	3.87432)
(14.8045,	3.87358)
(14.9441,	3.87289)
(15.0838,	3.87224)
(15.2235,	3.87163)
(15.3631,	3.87106)
(15.5028,	3.87053)
(15.6425,	3.87002)
(15.7821,	3.86955)
(15.9218,	3.86911)
(16.0615,	3.8687)
(16.2011,	3.86831)
(16.3408,	3.86794)
(16.4804,	3.8676)
(16.6201,	3.86728)
(16.7598,	3.86698)
(16.8994,	3.8667)
(17.0391,	3.86644)
(17.1788,	3.86619)
(17.3184,	3.86596)
(17.4581,	3.86574)
(17.5978,	3.86554)
(17.7374,	3.86535)
(17.8771,	3.86517)
(18.0168,	3.865)
(18.1564,	3.86484)
(18.2961,	3.8647)
(18.4358,	3.86456)
(18.5754,	3.86443)
(18.7151,	3.8643)
(18.8547,	3.86419)
(18.9944,	3.86408)
(19.1341,	3.86398)
(19.2737,	3.86388)
(19.4134,	3.8638)
(19.5531,	3.86371)
(19.6927,	3.86363)
(19.8324,	3.86356)
(19.9721,	3.86349)
(20.1117,	3.86342)
(20.2514,	3.86336)
(20.3911,	3.86331)
(20.5307,	3.86325)
(20.6704,	3.8632)
(20.8101,	3.86315)
(20.9497,	3.86311)
(21.0894,	3.86307)
(21.2291,	3.86303)
(21.3687,	3.86299)
(21.5084,	3.86295)
(21.6480,	3.86292)
(21.7877,	3.86289)
(21.9274,	3.86286)
(22.0670,	3.86284)
(22.2067,	3.86281)
(22.3464,	3.86279)
(22.4860,	3.86276)
(22.6257,	3.86274)
(22.7654,	3.86272)
(22.9050,	3.8627)
(23.0447,	3.86269)
(23.1844,	3.86267)
(23.3240,	3.86266)
(23.4637,	3.86264)
(23.6034,	3.86263)
(23.7430,	3.86261)
(23.8827,	3.8626)
(24.0223,	3.86259)
(24.1620,	3.86258)
(24.3017,	3.86257)
(24.4413,	3.86256)
(24.5810,	3.86255)
(24.7207,	3.86254)
(24.8603,	3.86254)
(25,    	3.8625)
};

\end{axis}
\\
};
\end{tikzpicture}
\caption{Effect of different step sizes on the Euler method using a simple linear chain of reactions where each reaction follows reversible mass-action kinetics:  \\[8pt]
$ \text{X}_o \stackrel[k_2]{k_1}{\rightleftharpoons} \text{S}_1,\quad  \text{S}_1 \stackrel[k_4]{k_3}{\rightleftharpoons} \text{S}_2,\quad \text{S}_2 \stackrel[k_6]{k_5}{\rightleftharpoons} \text{S}_3,\quad  \text{S}_3 \stackrel{k_7}{\rightleftharpoons} \text{X}_1 $  \\[8pt]
where $k_1 = 0.45, k_2 = 0.23, k_3 = 0.67, k_4 = 1.2, k_5 = 2.3, k_6 = 0.3, k_7 = 0.73, X_o = 10, X_1 = 0, S_1 = 5, S_2 = 15, S_3 = 20$. See text for details.}
\label{fig:eulerTest}
\end{figure}
```

### Modified Euler or Heun Method

As indicated in the last section, the Euler method, though simple to implement, tends not to be used in practice because it requires small step sizes to achieve reasonable accuracy. Furthermore, the small step size makes the Euler method computationally slow. A simple modification however can be made to significantly improve its performance. This approach can be found under a number of headings, including the modified Euler method, the Heun, or the improved Euler method.

The modification involves improving the estimate of the slope by averaging two derivatives, one at the initial point ($dy(t)/dt$) and another at the end point ($dy(t+h)/dt$). In order to calculate the derivative at the end point, the first derivative is be used to predict the end point. The two slopes are then averaged and the average is used to predict the final predicted $y$ value. (Figure [Figure: Heun Method](#fig-heunmethodgraphical)). This method is quite simple to implement in computer software and is summarized by equations [Modified Euler or Heun Method](#eqn-heunequationa).

Figure [Figure: Heun Method](#fig-heunmethodgraphical) describes the Heun method graphically. A theoretical analysis of error propagation in the Heun method shows that it is a second-order method; that is, if the step size is reduced by a factor of 2, the global error is reduced by a factor of 4. However to achieve this improvement, two evaluations of the derivatives is required per iteration compared to only one for the Euler method.

\stateComment{
{\addtolength{\jot}{8pt}

$$
\begin{equation}
\begin{aligned}
y(t+h) &= y(t) + h\ \frac{dy(t)}{dt} \\
y(t+h) &= y(t) + \frac{h}{2} \left( \frac{dy(t)}{dt} + \frac{dy(t+h)}{dt} \right) \\
t_{n+1} &= t_n + h
\end{aligned}
\label{eqn:HeunEquationA}
\end{equation}
$$

} }

### Runge-Kutta

The Heun method described in the previous section is sometimes called the RK2 method where RK2 stands for 2nd order Runge-Kutta method. The Runge-Kutta methods are a family of methods developed around the 1900s by the German mathematicians, Runge and Kutta. In addition to the 2nd order Heun method, there are also 3rd, 4th, and even 5th order Runge-Kutta methods. For hand-coded numerical methods, the 4th order Runge-Kutta algorithm (often called RK4) is probably the most popular among modelers. The algorithm is a little more complicated because it involves the evaluation and weighted averaging of four slopes.

**Figure** <a id="fig-heunmethodgraphical"></a> `fig:HeunMethodGraphical`

*Graphic (not in the LaTeX source, referenced by name): `HeunMethod`*

*Caption:* Heun Method. Starting at $t_1$, the slope A at T is computed. The slope is used to predict the solution at point P using the Euler method. From point P, the new slope, B, is computed (Panel A). Slopes A and B are now averaged to form a new slope, C (Panel B). The averaged slope is used to compute the final prediction.

```latex
\begin{figure}[htbp]
\centering
    \includegraphics[scale = 0.71]{HeunMethod}
\caption{Heun Method. Starting at $t_1$, the slope A at T is computed. The slope is used to predict the solution at point P using the Euler method. From point P, the new slope, B, is computed (Panel A). Slopes A and B are now averaged to form a new slope, C (Panel B). The averaged slope is used to compute the final prediction.} \label{fig:HeunMethodGraphical}
\end{figure}
```

In terms of global error however, RK4 is considerably better than Euler or the Heun method and has a global error on the order of four. This means that halving the step size will reduce the global error by a factor of 16. In other words, the step size can be increased 16 fold over the Euler method and still have the same global error. The method can be summarized by the equations [Runge-Kutta](#eqn-rk4equations) which have been simplified by removing the dependence on time.

\stateComment{
<!-- {\addtolength{\jot}{4pt} -->

$$
\begin{equation}
\begin{aligned}
k_1 &= h \ f \big(y_n\big) \\[4pt]
k_2 &= h \ f \left(\displaystyle y_n + \frac{k_1}{2}\right) \\[4pt]
k_3 &= h \ f \left(y_n + \frac{k_2}{2}\right) \\[4pt]
k_4 &= h \ f \Big(y_n + k_3\Big) \\[4pt]
y(t + h) &= y(t) + {\displaystyle \frac{1}{6}}\ \Big(k_1 + 2\ k_2 + 2\ k_3 + k_4\Big) \\[4pt]
t_{n+1} &= t_n + h
\end{aligned}
\label{eqn:RK4Equations}
\end{equation}
$$

}

Figure [Figure: Comparison of Euler, Heun and RK4 numerical methods at integrating the](#fig-eulerheunrk4) shows a comparison of the three methods, Euler, Heun, and RK4 in solving the Van der Pol equations. The Van der Pol system of equations is a classic problem set often used when comparing numerical methods. The equations model an oscillating system, originally inspired from modeling vacuum tubes. At a later date it also formed the basis for developments in modeling action potentials in neurons. Figure [Figure: Comparison of Euler, Heun and RK4 numerical methods at integrating the](#fig-eulerheunrk4) shows that the Heun and RK4 methods are very similar, at least for the Van der Pol equations, though this will not always be the case. For this particular model the solution generated by the RK4 method is very similar to the best possible solution obtained numerically. Notice how bad the Euler method is in comparison.

\renewcommand{\algorithmicendfor}{}

```latex
\begin{algorithm}[H]
\caption{Heun Integration Method. $f_i(y)$ is the $i^{th}$ ordinary differential equation.} \label{alg:HeunAlogrithm}
\begin{algorithmic}
  \STATE{$n = \mbox{Number of state variables}$}
  \STATE{$y_i = i^{\text{th}} \mbox{ variable}$}
  \STATE Set timeEnd
  \STATE $\mbox{currentTime} = 0$
  \STATE $h = \mbox{stepSize}$
  \STATE \text{Initialize all $y_i$ at currentTime}
  \linebreak

  \WHILE{$\text{currentTime} < \mbox{timeEnd}$}

    \FOR{$i = 1 \text{ to } n$}
        \STATE{$a_{i} = f_i(y)$}
    \ENDFOR
    \FOR{$i = 1 \text{ to } n$}
        \STATE{$b_{i} = f_i(y + h\ a)$}
    \ENDFOR
    \FOR{$i = 1 \text{ to } n$}
       \STATE{$y_i(t+h) = y_i(t) + {\displaystyle \frac{h}{2}}\ (a_{i} + b_{i})$}
    \ENDFOR
    \STATE{$\mbox{currentTime} = \mbox{currentTime} + h$}
  \ENDWHILE
\end{algorithmic}
\end{algorithm}
```

\renewcommand{\algorithmicendfor}{}

```latex
\begin{algorithm}[!htb]
\caption{4th Order Runge-Kutta Integration Method.} \label{alg:RK4Alogrithm}
\begin{algorithmic}
  \STATE{$n = \mbox{Number of state variables}$}
  \STATE{$y_i = i^{\text{th}} \mbox{ variable}$}
  \STATE $\mbox{timeEnd} = 10$
  \STATE $\mbox{currentTime} = 0$
  \STATE $h = \mbox{stepSize}$
  \STATE \text{Initialize all $y_i$ at currentTime}
  \linebreak

  \WHILE{$\text{currentTime} < \mbox{timeEnd}$}
    \FOR{$i = 1 \text{ to } n$}
        \STATE{$k_{1i} = h f(y_i)$}
    \ENDFOR
    \FOR{$i=1 \text{ to } n$}
        \STATE{$k_{2i} = h f(y_i + k_{1i}/2)$}
    \ENDFOR
    \FOR{$i = 1 \text{ to } n$}
        \STATE{$k_{3i} = h f(y_i + k_{2i}/2)$}
    \ENDFOR
    \FOR{$i = 1 \text{ to } n$}
        \STATE{$k_{4i} = h f(y_i + k_{3i})$}
    \ENDFOR
    \FOR{$i = 1 \text{ to } n$}
       \STATE{$y_i(t+h) = y_i(t) + {\displaystyle \frac{h}{6}}\ (k_{1i} + 2\ k_{2i} + 2\ k_{3i} + k_{4i})$}
    \ENDFOR
    \STATE{$\mbox{currentTime} = \mbox{currentTime} + h$}
  \ENDWHILE
\end{algorithmic}
\end{algorithm}
```

**Figure** <a id="fig-eulerheunrk4"></a> `fig:EulerHeunRK4`

*Graphic (not in the LaTeX source, referenced by name): `EulerHeunRK4Sim`*

*Caption:* Comparison of Euler, Heun and RK4 numerical methods at integrating the Van der Pol dynamic system: $ dy_1/dt = y_2$ and
 $dy_2/dt = -y_1+(1-y_1 y_1) y_2$. The plots show the evolution of $y_1$ in time. The RK4 solution is almost indistinguishable from solutions generated by much more sophisticated integrators. Step size was set to 0.35. 

```latex
\begin{figure}[htbp]
\centering
    \includegraphics[scale = 0.5]{EulerHeunRK4Sim}
\caption{Comparison of Euler, Heun and RK4 numerical methods at integrating the Van der Pol dynamic system: $ dy_1/dt = y_2$ and
 $dy_2/dt = -y_1+(1-y_1 y_1) y_2$. The plots show the evolution of $y_1$ in time. The RK4 solution is almost indistinguishable from solutions generated by much more sophisticated integrators. Step size was set to 0.35. } \label{fig:EulerHeunRK4}
\end{figure}
```

<!-- \subsection{Euler Method} -->

<!-- A graph showing examples of the application of Euler's method is given in Figure (\ref{chap6:EulerMethodGraph}). The graph %illustrates what happens when different time step sizes are used. The upper line shows the exact solution computed from the %analytical solution. The lower lines represents numerical solutions generated at step sizes of 2 and 4 respectively. The point is, %the smaller the step size the more accurate the estimated solution will be. However the smaller the step size the longer it will %also take to compute the solution since many more steps have to be taken to reach a given end time. In addition, too large a step %will result in excessive overshoots in the solution, leading eventually to gross numerical instability. In practice the Euler %method is not recommended due to this significant problem, however it is useful as an initial introduction to integration methods. -->

<!-- \begin{figure}[ht] -->
<!-- \begin{center} -->
<!-- \begin{tikzpicture}[scale=1] -->
<!-- \tkzInit[xmax=12,xstep=2,ymax=12,ystep=2]; -->
<!-- \tkzY[label={}] -->
<!-- \tkzX[label={}] -->
<!-- \tkzText(-2,10){\sffamily $A$} -->
<!-- \tkzText(10,-1.8){\sffamily Time} -->
<!-- \tkzVLine{12} -->
<!-- \tkzHLine{12} -->

<!-- \tkzFct[color=black,lw=1.5pt](0..12){10*exp(-0.2*\x)} -->

<!-- \tkzPoint[noname,size=2.5pt](0,10){start} -->
<!-- \tkzPoint[noname,size=2.5pt](2,6){A}       \tkzSegment[lw=1.6pt,color=red](start/A) -->
<!-- \tkzPoint[noname,size=2.5pt](4,3.6){B}     \tkzSegment[lw=1.6pt,color=red](A/B) -->
<!-- \tkzPoint[noname,size=2.5pt](6,2.16){C}    \tkzSegment[lw=1.6pt,color=red](B/C) -->
<!-- \tkzPoint[noname,size=2.5pt](8,1.296){D}   \tkzSegment[lw=1.6pt,color=red](C/D) -->
<!-- \tkzPoint[noname,size=2.5pt](10,0.7776){E} \tkzSegment[lw=1.6pt,color=red](D/E) -->
<!-- \tkzPoint[noname,size=2.5pt](12,0.4665){F} \tkzSegment[lw=1.6pt,color=red](E/F) -->

<!-- \tkzPoint[noname,size=2.5pt](0,10){start} -->
<!-- \tkzPoint[noname,size=2.5pt](4,2){A}       \tkzSegment[lw=1.6pt,color=green](start/A) -->
<!-- \tkzPoint[noname,size=2.5pt](8,0.4){B}     \tkzSegment[lw=1.6pt,color=green](A/B) -->
<!-- \tkzPoint[noname,size=2.5pt](12,0.08){C}   \tkzSegment[lw=1.6pt,color=green](B/C) -->

<!-- \end{tikzpicture} -->
<!-- \end{center} -->
<!-- \caption{Euler method: $y(t+h) = y(t) + h\ dy(t)/dt$. The upper line represents -->
<!-- the exact analytical solution to the problem, $dA/dt = -0.2 A$, subsequent -->
<!-- lower lines represent numerical solutions obtained at time steps $h = 2$ -->
<!-- and $h = 4$ respectively. As the time step increases so does the divergence -->
<!-- from the exact solution. } \label{chap6:EulerMethodGraph} -->
<!-- \end{figure} -->

### Variable Step Size Methods

In the previous discussion of numerical methods for solving differential equations, the step size, $h$, was assumed to be fixed. This makes implementation straight forward but also makes the methods inefficient. For example, if the solution is at a point where it changes very little, then the method could increase the step size without loosing accuracy while at the same time achieve a considerable speedup in processing time. Likewise, if at a certain point in the integration the solution starts to change rapidly, it would be prudent to lower the step size to increase accuracy. Such strategies are implemented in the **variable step size methods**.

The approach used to automatically adjust the steps size may be simple or very sophisticated depending on what level of performance is desired. The simplest approach is to carry out two integration trials, one at a step size of $h$, and another trial using two steps of size $h/2$. The software then compares the solutions generated by the two trials. If the solutions are significantly different, the step size must be reduced. If the solutions are about the same, then it might be possible to increase the step size. These tests are repeatedly carried out, adjusting the step size as necessary as the integration proceeds. This simple variable step size approach can be easily incorporated into some of the more straightforward algorithms, particularly the fourth order Runge-Kutta which is called the variable step-size Runge-Kutta.

Another approach to adjusting the step size is called the **Dormand-Prince method** [dormand1980]. This method carries out two trials based on the fourth and fifth order Runge-Kutta. Any difference between the trials is used to adjust the step size. Matlab's ode45 implements the Dormand-Prince method. Similar methods to Dormand-Prince include the Fehlberg(footnote:  <http://en.wikipedia.org/wiki/Runge-Kutta-Fehlberg_method>} and more recently the Cash-Karp method [CashKarp:1990].

Many of these simple adjustable step size solvers are quite effective although they can be slow especially for the kinds of problem we find in biochemical models. Specifically, there is a class of problem called stiff problems which is common in biochemical modeling. Stiff models require highly specialized solvers developed over the past four decades.

### Stiff Models

Many differential equations encountered in biochemical models are referred to as **stiff** systems. The word stiff comes from earlier studies on spring and mass systems where the springs had large spring constants and were therefore difficult to stretch. A stiff system is often associated with widely different time scales, for example when the rate constants are widely different in a biochemical model. Such systems may have molecular species whose decay rates are very fast compared to other components. This means the step size must be very small to accommodate the fast processes even though the rest of the system could be accurately solved using a much larger step size. The overall result is the need for very small steps sizes at a significant computational cost, in addition to rounding error as a result of the small step sizes. Roundoff errors in turn can be amplified by the large time constants. The net result are solutions which bear no resemblance to the true solution.

Most modern simulators will employ specific stiff algorithms for solving stiff differential equations. Of particular importance is the SUNDIALS suite [CVODE:1996] and ODEPACK [HIND83]. Sundials includes a number of very useful, well written, and documented solvers. In particular, the CVODE solver is very well suited for solving stiff differential equations. Sundials is therefore widely used in the biochemical modeling community (for example by Jarnac and roadRunner). Before the advent of SUNDIALS, the main workhorse for solving stiff systems was the suite of routines in ODEPACK. Of particular note was LSODA which in the 1990s was very popular and is still a valuable set of software (currently used in COPASI).(footnote: In some of our own work, we have noticed that LSODA can be faster than CVODE.} The original stiff differential equation solver was developed by Gear [Gear] in the 1970s and is still used in Matlab in the form of ode15s.

## Matlab Solvers

Although this isn't a book about Matlab, it is worth mentioning how Matlab can be used to solve differential equations. Matlab offers a range of solvers with the two most commonly used being `ode45` and `ode15s`.

The `ode45` solver implements a variable step size Runge-Kutta method by using the Dormand-Prince method. The basic syntax for `ode45` is:

`[t,y] = ode45(@myModel, [t0, tend], yo, [], p);`

where

`myModel` is the function containing the differential equations.

`t0, tend` are the initial and final values for the independent variable, $t$.

`yo` is a vector of initial conditions.

`p` is the set of parameters for the model, and can be any size.

The empty vector in the call is where additional options can be placed.

For example, to solve the set of ODEs:

$$
\begin{align*}
\frac{dy_1}{dt} &= v_o - k_1 y_1 \\[8pt]
\frac{dy_2}{dt} &= k_1 y_1 - k_2 y_2
\end{align*}
$$

We would write the following .m file and load it into Matlab:

```python
function dy = myModel(t, y, p)
dy = zeros (2,1);
vo = p(1);
k1 = p(2);
k2 = p(3);
dy(1) = vo - k1*y(1);
dy(2) = k1*y(1) - k2*y(2);
```

We would then call the solver as follows:

```python
p = [10, 0.5, 0.35]
y0 = [0, 0]
[t, y] = ode45 (@myModel, [0, 20], y0, [], p)
```

Although many problems can be solved using `ode45`, some stiff models will fail to give the correct solution using this method. In these cases `ode15s` is recommended. `ode15s` is a variable order solver and uses the well known Gear method [Gear]. Like `ode45`, `ode15s` is also a variable step size method. `ode45` might be faster than `ode15s` on simple problems, but with today's fast computers the difference is not great. Therefore `ode15s` is recommended for all problems unless computing time is critical.

## Python Solvers

Like Matlab, Python is a general purpose computing language. However, unlike Matlab, Python is open source and freely available for anyone to use. Python offers a variety of ODE solvers via the scipy package(footnote: <http://scipy.org/>}. These include LSODA [HIND83], an implicit Adams method [hairer1991solving] (for non-stiff systems), 4th order adaptive step size Dormand-Prince and an eighth order adaptive step size Dormand-Prince [dormand1980]. The code below shows the Matlab code in the previous section expressed using Python. The example uses the default LSODA integrator.

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import odeint

vo = 10
k1 = 0.5
k2 = 0.35

# Declare the model
def myModel(y, t):

   dy0 = vo - k1*y[0]
   dy1 = k1*y[0] - k2*y[1]
   return [dy0, dy1]

time = np.linspace(0.0, 20.0, 100)
yinit = np.array([0.0, 0.0])
y = odeint (myModel, yinit, time)

plt.plot(time, y[:,0], time, y[:,1]) # y[:,0] is the first column of y
plt.xlabel('t')
plt.ylabel('y')
plt.show()
```

## Other Software

Matlab and Python aren't the only software that can be used to solved differential equations. Mathematica is an example of commercial tool that can be used to solve differential equations.

For those who require more control or who are unable to purchase a commercial tool, there are many free applications and professionally developed open source software libraries that can be used very effectively. Octave (<http://www.gnu.org/software/octave/>) is an open source tool that is very similar to Matlab. SciLab (<http://www.scilab.org/>) is another free Matlab like application. If you like programming in Python then Sage <(http://www.sagemath.org/index.html>) is a good option. There are therefore many alternative and free options to using Matlab.

For those who require much more control and higher performance, it is possible to write your own code around the SUNDIALS C/C++ library which is available under the unrestricted BSD open source licence. Within SUNDIALS is the CVODE library used by many of the commercial tools. CVODE implements an advanced Gear like algorithm using a variable order and variable step size approach. It is well suited for stiff systems and is the preferred method for those who need to write their own code. One final library worth mentioning is the GPL (GNU General Public License) licensed GSL library (<http://www.gnu.org/software/gsl/>. Although very comprehensive, the GPL license unfortunately puts restrictions on how the library can be used. Unless one has a real need to use the GSL library, it is recommend that one employ the unrestricted SUNDIALS suite.

### Specialized Software

Simulating biochemical networks has a long history dating back to the 1940s [chance:1943]. The earliest simulations relied on building either mechanical or electrical analogs of biochemical networks. It was only in the late 1950s, with the advent of digital computers and the development of specialized software tools [Ga68], that the ability to simulate biochemical networks became more widely available. In the intervening years up to 1980, a handful of other software applications were developed [Burns1969, Bu71, PW73] to help the small community of modelers. In more recent years, particularly since the early 1990s, there has been a significant increase in interest in modeling biochemical processes and a wider range of tools is now available to the budding systems biologist. Many open source tools have been developed by practicing scientists and are therefore freely available.

In this book we will be using the author's modeling tool Tellurium [medley2018tellurium, choi2018tellurium]. Tellurium is well suited for our purpose. It's a script based modeling application which makes it easy to illustrate modeling exercises.

Many tools do not offer readable text based renderings of models because they use either a visual approach to modeling, such as PathwayDesigner [bergmann2006computational] or CellDesigner [Kitano:2005:Nat-Biotechnol], or have a graphical user interface such as COPASI [Copasi2006] or iBiosim [myers2009ibiosim]. All these tools export and import the standard modeling language SBML (See section [[appendix_h_modeling_standards_and_databases|SBML]]). However, because SBML is written in XML, it is also difficult to display a model using SBML in a textbook.

### Tellurium

Tellurium [sauro2013libroadrunner] is an integrated Python based environment for modeling in systems biology. The current version (July 2019) integrates a number of libraries including libRoadRunner (Simulator), libSBML (SBML support), libAntimony (Antimony support) and SBML\-2\-Matlab (SBML to Matlab converter). In addition Tellurium distributes a number of standard Python packages such as Matplotlib (plotting) and NumPy (array support). All packages are integrated using spyder2 (<https://code.google.com/p/spyderlib/>) which offers a Matlab like experience for modelers.

Visually, Tellurium has two main windows (Figure [[appendix_i_modeling_with_python|Figure: Screen-shot of Tellurium, showing editor on the left, Python console b]]): a console where commands can be issued and results returned, and an editor where control scripts and models are written. The application can also display plots on the IPython window. The windows distribution also comes with a Jupyter notebook interfaces for those interested in this mode of working.

Tellurium uses Antimony to let users describe biochemical pathways and Python coupled with libRoadRunner (a high performance SBML simulator) to do simulations and other analyses. Models can also be imported or exported as SBML. Many other capabilities are offered through libRoadRunner including support for metabolic control analysis, structural analysis of networks, and stochastic simulation. It has no explicit support for fitting as of yet.  A more detailed description of Tellurium is given in Appendix [[appendix_i_modeling_with_python|Modeling with Python]]. The following code shows the model we used previously expressed using Tellurium:

```python
import tellurium as te

r = te.loada ('''
    $Xo -> y1; vo;
     y1 -> y2; k1*y1;
     y2 ->; k2*y2;

    vo = 10; k1 = 0.5; k2 = 0.35;
    y1 = 0; y2 = 0;
''')

m = r.simulate (0, 20, 100);
r.plot();
```

The first part of the code shows the model expressed using Antimony and loaded into roadrunner while the second part show two commands to simulate and plot the results via libRoadRunner.

**Figure** <a id="fig-jarnacchap"></a> `fig:JarnacChap`

*Graphic (not in the LaTeX source, referenced by name): `Tellurium4`*

*Caption:* Screen shot of Tellurium with simulation results.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale=0.4]{Tellurium4}
  \caption{Screen shot of Tellurium with simulation results.}
  \label{fig:JarnacChap}
\end{figure}
```

## Moiety Conserved Cycles

Any chemical group that is preserved during a cyclic series of interconversions is called a conserved moiety (See section [[03_stoichiometric_networks|Moiety Conserved Cycles]]), Figure [Figure: Conserved Moiety in a Cyclic Network](#fig-cyclicnetwork). Examples of conserved moiety subgroups include species such as phosphate, acyl, nucleoside groups, or covalently modifiable proteins.  As a moiety gets redistributed through a network, the *total amount* of the moiety is constant and does not change during the time evolution of the system. For any particular subgroup, the total amount is determined solely by the initial conditions imposed on the model.

**Figure** <a id="fig-cyclicnetwork"></a> `fig:CyclicNetwork`

*Graphic (not in the LaTeX source, referenced by name): `ConservedCycle`*

*Caption:* Conserved Moiety in a Cyclic Network. The blue species (larger symbols) are modified as they traverse the reaction cycle, but the red subgroup (small circle) remains unchanged. This creates a conserved cycle where the total number of moles of moiety (small circle, red subgroup) stays constant.

```latex
\begin{figure}[tbh]
  \centering
  \includegraphics[scale = 0.5]{ConservedCycle}
  \caption{Conserved Moiety in a Cyclic Network. The blue species (larger symbols) are modified as they traverse the reaction cycle, but the red subgroup (small circle) remains unchanged. This creates a conserved cycle where the total number of moles of moiety (small circle, red subgroup) stays constant.} \label{fig:CyclicNetwork}
\end{figure}
```

There are rare cases when a `conservation' relationship arises out of a non-moiety cycle. This does not affect the mathematical analysis, but only the physical interpretation of the conservation relationship. For example, in Figure [Figure: Conservation due to stoichiometric matching](#fig-oddconservation) the constraint $B - C = T$ applies even though there is no moiety involved.

**Figure** <a id="fig-oddconservation"></a> `fig:OddConservation`

*Graphic (not in the LaTeX source, referenced by name): `OddConservation`*

*Caption:* Conservation due to stoichiometric matching. In this system, $B - C = constant$.

```latex
\begin{figure}[tbh]
  \centering
  \includegraphics[scale = 0.55]{OddConservation}
  \caption{Conservation due to stoichiometric matching. In this system, $B - C = \mbox{constant}$.} \label{fig:OddConservation}
\end{figure}
```

The presence of conserved moieties is an approximation introduced into a model, however, over the time scale in which the conservation may hold, their existence can have a profound effect on the dynamic behavior of the model. For example, the hyperbolic response of a simple enzyme (in the form of enzyme conservation between E and ES) or the sigmoid behavior observed in protein signalling networks is due in significant part to moiety conservation laws [maarleveld2013, IngallsBook2013].

Figure [Figure: Simple Conserved cycle](#fig-simpleconservedcycle) illustrates the simplest possible network which displays a conserved moiety. The total mass, $S_1 + S_2$, is constant during the evolution of the network.

**Figure** <a id="fig-simpleconservedcycle"></a> `fig:SimpleConservedCycle`

*Caption:* Simple Conserved cycle. The dotted lines signify negligible levels of synthesis and degradation. Thus, over short time scales, $S_1 + S_2 = constant$.

```latex
\begin{figure}[h]
\begin{center}
\begin{tikzpicture}
\draw(38pt,50pt) node[anchor=west] {S$_1$};
\draw(102pt,50pt) node[anchor=west] {S$_2$};

\draw[-latex,color=blue,line width=1.375pt] (50pt,60pt) to [controls=+(50:1) and +(130:1)] (110pt,60pt);
\draw[latex-,color=blue,line width=1.375pt] (50pt,40pt) to [controls=+(130:-1) and +(50:-1)] (110pt,40pt);

\draw[-latex,color=blue,line width=1.375pt] (50pt,93.5pt) to [controls=+(130:-1) and +(46:-1)] (110pt,93.5pt);
\draw[latex-,color=blue,line width=1.375pt] (50pt,6.5pt) to [controls=+(46:1) and +(130:1)] (110pt,6.5pt);

\draw(72pt,15pt) node[anchor=west] {$v_1$};
\draw(72pt,85pt) node[anchor=west] {$v_2$};

\draw(36pt,100pt) node[anchor=west] {A};
\draw(105pt,100pt) node[anchor=west] {B};

\draw(36pt,0pt) node[anchor=west] {D};
\draw(105pt,0pt) node[anchor=west] {C};

\draw[-latex,color=blue,very thin,dashed] (10pt,51pt) to (36pt,51pt);
\draw[-latex,color=blue,very thin,dashed] (122pt,51pt) to (148pt,51pt);
\end{tikzpicture}
\end{center}
%
\caption{Simple Conserved cycle. The dotted lines signify negligible levels of synthesis and degradation. Thus, over short time scales, $S_1 + S_2 = \mbox{constant}$.}
\label{fig:SimpleConservedCycle}
\end{figure}
```

The system equations for the simple conserved cycle are easily written as:

$$
\begin{align*}
\frac{dS_1}{dt} = v_1 - v_2 \\[6pt]
\frac{dS_2}{dt} = v_2 - v_1
\end{align*}
$$

From these equations it should be evident that the rate of appearance of S$_1$ must equal the rate of disappearance of S$_2$, that is $dS_1/dt = -dS_2/dt$. This means that whenever S$_1$ changes, S$_2$ must change in the opposite direction by *exactly* the same amount. During a simulation the sum of S$_1$ and S$_2$ will therefore remain unchanged. This is a characteristic of a moiety-conserved cycle.

Computationally, we only need to explicitly evaluate one of the differential equations because the other can be computed from the conservation relation. The system can therefore be reduced to one differential and one linear algebraic equation compared to the two differential equations in the original formulation.

\stateHighlight{

$$
\begin{align*}\\[-30pt]
S_2 &= T - S_1 \\[5pt]
\frac{dS_1}{dt} &= v_1 - v_2
\end{align*}
$$

}

The term $T$ in the algebraic equation shown above refers to the total amount of S$_1$ and S$_2$. This value is computed from the initial amounts of S$_1$ and S$_2$ at the start of a simulation.

**Figure** <a id="fig-sim-moiety"></a> `fig:sim:moiety`

*Caption:* Simulation of the simple cycle shown in Figure [Figure: Simple Conserved cycle](#fig-simpleconservedcycle). The total moiety remains constant at 10 concentration units. Model: {\tt S1 -> S2; k1*S1; S2 -> S1; k2*S2; S1 = 10; k1=0.1; k2=0.2}.

```latex
\begin{figure}[tbh]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel=Time,
ylabel=Concentration,
xmin=0,
xmax=40,
ymin=0,
ymax=10,
width=8cm,
height=6cm,legend style={at={(0.9,0.6)}}]
\addplot[color=pink,line width=2pt] coordinates {
(0,	10)
(1.025641026,	9.11712699)
(2.051282051,	8.46812397)
(3.076923077,	7.99101324)
(4.102564103,	7.64024380)
(5.128205128,	7.38237369)
(6.153846154,	7.19280237)
(7.179487179,	7.05345531)
(8.205128205,	6.95100498)
(9.230769231,	6.87568838)
(10.25641026,	6.82033017)
(11.28205128,	6.77963691)
(12.30769231,	6.74971878)
(13.33333333,	6.72772340)
(14.35897436,	6.71155447)
(15.38461538,	6.69966712)
(16.41025641,	6.69092739)
(17.43589744,	6.68450253)
(18.46153846,	6.67977914)
(19.48717949,	6.67630658)
(20.51282051,	6.67375364)
(21.53846154,	6.67187748)
(22.56410256,	6.67049933)
(23.58974359,	6.66948644)
(24.61538462,	6.66874107)
(25.64102564,	6.66819221)
(26.66666667,	6.66778835)
(27.69230769,	6.66749182)
(28.71794872,   6.66727482)
(29.74358974,	6.66711663)
(30.76923077,	6.66700007)
(31.79487179,	6.66691506)
(32.82051282,	6.66685087)
(33.84615385,	6.66680293)
(34.87179487,	6.66676688)
(35.8974359,	6.66674024)
(36.92307692,	6.66672077)
(37.94871795,	6.66670717)
(38.97435897,	6.66669812)
(40,	6.666691212)
};
\addplot[color=blue,line width=2pt] coordinates {
(0,	            0)
(1.025641026,	0.882873005)
(2.051282051,	1.531876022)
(3.076923077,	2.00898676)
(4.102564103,	2.359756194)
(5.128205128,	2.617626301)
(6.153846154,	2.80719763)
(7.179487179,	2.94654469)
(8.205128205,	3.048995013)
(9.230769231,	3.124311612)
(10.25641026,	3.179669823)
(11.28205128,	3.22036309)
(12.30769231,	3.250281215)
(13.33333333,	3.272276594)
(14.35897436,	3.288445527)
(15.38461538,	3.300332872)
(16.41025641,	3.309072604)
(17.43589744,	3.315497461)
(18.46153846,	3.320220854)
(19.48717949,	3.323693414)
(20.51282051,	3.326246357)
(21.53846154,	3.328122511)
(22.56410256,	3.329500667)
(23.58974359,	3.330513554)
(24.61538462,	3.33125893)
(25.64102564,	3.331807786)
(26.66666667,	3.332211642)
(27.69230769,	3.332508179)
(28.71794872,	3.332725179)
(29.74358974,	3.332883369)
(30.76923077,	3.332999925)
(31.79487179,	3.33308494)
(32.82051282,	3.333149122)
(33.84615385,	3.333197064)
(34.87179487,	3.333233112)
(35.8974359,     3.333259759)
(36.92307692,	3.333279222)
(37.94871795,	3.333292824)
(38.97435897,	3.333301878)
(40,	        3.333308788)
};
\legend{\small $S_1$,\small $S_2$}
\end{axis}
\end{tikzpicture}
  \caption{Simulation of the simple cycle shown in Figure~\ref{fig:SimpleConservedCycle}. The total moiety remains constant at 10 concentration units. Model: {\tt\small S1 -> S2; k1*S1; S2 -> S1; k2*S2; S1 = 10; k1=0.1; k2=0.2}.}
 \label{fig:sim:moiety}
\end{figure}
```

The conservation can be seen in the stoichiometry matrix as linear dependencies among the matrix rows. Let us look at an example where there are dependencies between the rows. Consider the cyclic pathway shown in Figure [Figure: Simple cycle](#fig-simpleconservedcycleb) with the corresponding stoichiometry matrix shown in equation [Moiety Conserved Cycles](#eqn-moietytwospecies).

$$
\begin{align}
\bN =
\begin{bmatrix}
-1 & \phantom{-}1 \\
\phantom{+}1 & -1 \\
\end{bmatrix}
\label{eqn:moietyTwoSpecies}
\end{align}
$$

Note that there is one row dependency in the stoichiometry matrix. Multiplying the second row by -1 gives the first row.

**Figure** <a id="fig-simpleconservedcycleb"></a> `fig:SimpleConservedCycleB`

*Caption:* Simple cycle.

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}[scale=1.2]
\draw(38pt,50pt) node[anchor=west] {\LARGE S$_1$};
\draw(102pt,50pt) node[anchor=west] {\LARGE S$_2$};

\draw[-stealth,color=blue,line width=2.2pt] (50pt,60pt) to [controls=+(50:1) and +(130:1)] (110pt,60pt);
\draw[stealth-,color=blue,line width=2.2pt] (50pt,40pt) to [controls=+(130:-1) and +(50:-1)] (110pt,40pt);

\draw(72pt,15pt) node[anchor=west] {\large $v_1$};
\draw(72pt,85pt) node[anchor=west] {\large $v_2$};
\end{tikzpicture}
%
\caption{Simple cycle.}
\label{fig:SimpleConservedCycleB}
\end{figure}
```

<!-- $$ \bN = \begin{array}{c} -->
<!-- { \!\!\!\!\! v_1 \ \ \ \ v_2} \ \ \ \\ -->
<!-- \left[ \begin{array}{rr} -->
<!-- \phantom{+} 1 & -1\\ -->
<!-- -1 &  \phantom{+}1 \\ -->
<!-- \end{array} \right] -->
<!-- \begin{array}{l} -->
<!-- S_1 \\ -->
<!-- S_2 \\ -->
<!-- \end{array} -->
<!-- \end{array} -->
<!-- $$ -->

What this means is that given the amount for either S$_1$ or S$_2$, it is possible to compute the other. That is, the total mass in the cycle is fixed, $S_1 + S_2 = T$. Conservation constraints such as these can have profound effects on network behavior [KholodenkoMarkevich]. In addition, they affect certain numerical procedures(footnote: In particular, the Jacobian matrix becomes singular thereby preventing the calculation of Bifurcation curves and computing the steady state.} and should be eliminated by computer software whenever possible [SauroIngalls:2004]. Most modern software apply this operation before proceeding to solve model equations. For certain types of analysis, such as computing the steady state, bifurcation analysis, and certain optimization methods, eliminating the redundant species is critical. These topics will be covered in more detail in a separate book.

## Exploiting Fast Processes

Chapter [[04_introduction_to_modeling|Introduction to Modeling]] discussed some of the simplifications that are often made when we construct a computer model. One simplification involves aggregating reaction steps. Typical examples include the use of Michaelis-Menten or Hill rate type kinetics. In the majority of these cases, the implicit assumption is that the processes inside the aggregate are much faster then processes outside. As noted already in this chapter, numerical instabilities can arise when a model has very different times scales, where some parts of the model are much slower or faster than other parts. There are different ways to take advantage of fast processes to simplify models; here we will consider two.

#### Equilibrium Assumption

The first approach assumes that a reaction with fast forward and reverse rates is always very close to equilibrium. We can illustrate this with a simple example. Consider the pathway shown in Figure [Figure: Fast reaction sandwiched between two slower reactions](#fig-fastreaction). The two differential equations for this system are:

$$
\begin{align*}
\frac{d\!A}{\dt} &= v_o - k_1 A \left(1 - \frac{\Gamma}{K_{eq}}\right)\\[5pt]
\frac{d\!B}{\dt} &= k_1 A \left(1 - \frac{\Gamma}{K_{eq}}\right) - k_3 B
\end{align*}
$$

The rate law representing the middle reaction between A and B is a modification of the usual mass-action rate law, $k_1 A - k_2 B$, where $k_2$ has been replaced by the equilibrium constant, $K_{eq}$, and the mass-action ratio, $\Gamma$. See section [[02_kinetics_in_a_nutshell|Modified Mass-Action Rate Laws]] for the derivation.

**Figure** <a id="fig-fastreaction"></a> `fig:FastReaction`

*Graphic (not in the LaTeX source, referenced by name): `FastReaction`*

*Caption:* Fast reaction sandwiched between two slower reactions.

```latex
\begin{figure}[tbh]
  \centering
  \includegraphics[scale = 1]{FastReaction}
  \caption{Fast reaction sandwiched between two slower reactions.} \label{fig:FastReaction}
\end{figure}
```

Let us assume that the middle reaction between A and B is very fast, that is, $k_1$ and $k_2$ are much larger compared to $v_o$ and $k_3$. In this situation the middle reaction can be considered to be very close to equilibrium. In other words, the mass-action ratio $\Gamma$ approaches the equilibrium constant such that the ratio of A and B is largely tied to the equilibrium constant. Rather than integrating A and B individually, we can define the dynamics of the system in terms of a new variable, the total, $T = A + B$, which can change. Part of the justification for this is that any change in T will result in an equal proportional change to A and B (See Exercise).

The differential equation for the total, $T$, can be obtained by summing the two separate differential equations:

$$ \frac{dT}{dt} = \frac{d(A + B)}{dt} = v_o - k_3 B $$

Note that the concentration of B (and A) is no longer a state variable and must be computed separately from the equilibrium ratio and total. Since we are assuming that A and B are in equilibrium, we can compute the equilibrium value for B given the relations:

$$
\begin{align*}
K_{eq} &= \frac{B}{A} \\
A + B &= T
\end{align*}
$$

such that when combined, we get the following:

$$ B = T \frac{K_{eq}}{1 + K_{eq}} $$

Once we have computed B, A can be computed using $T - B$. To implement this numerically, we solve the following set of equations:

$$
\begin{align*}
B &= T \frac{K_{eq}}{1 + K_{eq}} \\[5pt]
A &= T - B \\[5pt]
\frac{d\!T}{\dt} &= v_o - k_3 B \\[5pt]
\end{align*}
$$

The equilibrium models can now be compared with the full model. When $k_2$ and $k_3$ are large, we expect the equilibrium approximation to closely match the full model. The Tellurium script shown in Listing `tellurium:chap:ODEsEquilibrium` implements two models, one using the equilibrium assumption and another which does not. Both models are run at the same time to compare them.

```python
import tellurium as te
import pylab

# Comparing the full model with an approximation
# based on the equilibrium assumption
r = te.loada ('''
    // Model using the equilibrium assumption
    // Note the use of := which represents a simulation rule
    B := T*Keq/(1+Keq);
    A := T - B;
    $s -> T; vo - k3*B;

    // The full model
    $s -> Af; vo;
    Af -> Bf; k1*Af - k2*Bf;
    Bf -> $w; k3*Bf;

    T = 10;

    Af = 3.33333; Bf = 6.66666;
    Keq = 2; vo = 0.5;
    k3 = 0.1; k1 = 1;
    k2 = k1/Keq
''')

result = r.simulate(0, 100, 200, ["time", "Af", "Bf", "A", "B", "T"])
r.plot(ylim=(0,10), xlim=(0,100))
```

Figure [Figure: Simulation for model in Figure \ref{fig:FastReaction} where the rate c](#fig-fastreactionapproxequilfast) shows the results of running the Tellurium script (Listing `tellurium:chap:ODEsEquilibrium`) assuming that the middle reaction is so fast, we can treat it as if it were constantly very close to equilibrium. Notice that the two model simulations are almost indistinguishable. Only three lines are shown, the top curve is the total, $T$. The middle line plots species B and is *in fact two overlapping lines*, one for the approximation *and* another for the full model. The bottom line follows species A and again consists of *two overlapping lines*. In this case the equilibrium assumption can be used without compromising accuracy in the simulation.

**Figure** <a id="fig-fastreactionapproxequilfast"></a> `fig:FastReactionApproxEquilFast`

*Caption:* Simulation for model in Figure [Figure: Fast reaction sandwiched between two slower reactions](#fig-fastreaction) where the rate constants, $k_1$ and $k_2$ are high and equal 1000 and 500, respectively. In this case both models coincide indicating that the approximation is good. Upper curve is T, middle curve B which includes $B$ and $B_f$, and lower curve A which includes $A$ and $A_f$. Tellurium model in Listing `tellurium:chap:ODEsEquilibrium`.

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Variables, $T, A$ and $B$},
xmin=0, xmax=100, ymin=2, ymax=10,
width=10cm,
height=6cm]
\node at (axis cs:80,8.5) {T};
\node at (axis cs:80,6)   {B};
\node at (axis cs:80,3)   {A};
\addplot[color=red,line width=1.5pt] coordinates {
(0, 3.333333) (0.5025126, 3.306253) (1.005025, 3.279711) (1.507538, 3.254043) (2.01005, 3.229221) (2.512563, 3.205217) (3.015075, 3.182004) (3.517588, 3.159555)
(4.020101, 3.137846) (4.522613, 3.116852) (5.025126, 3.09655) (5.527638, 3.076917) (6.030151, 3.05793) (6.532663, 3.039569) (7.035176, 3.021812) (7.537688, 3.004639)
(8.040201, 2.988033) (8.542714, 2.971973) (9.045226, 2.956443) (9.547739, 2.941424) (10.05025, 2.9269) (10.55276, 2.912855) (11.05528, 2.899272) (11.55779, 2.886137)
(12.0603, 2.873435) (12.56281, 2.861151) (13.06533, 2.849272) (13.56784, 2.837784) (14.07035, 2.826675) (14.57286, 2.815932) (15.07538, 2.805542) (15.57789, 2.795495)
(16.0804, 2.785779) (16.58291, 2.776383) (17.08543, 2.767297) (17.58794, 2.75851) (18.09045, 2.750012) (18.59296, 2.741794) (19.09548, 2.733847) (19.59799, 2.726162)
(20.1005, 2.71873) (20.60302, 2.711543) (21.10553, 2.704593) (21.60804, 2.697871) (22.11055, 2.691371) (22.61307, 2.685085) (23.11558, 2.679007) (23.61809, 2.673128)
(24.1206, 2.667443) (24.62312, 2.661946) (25.12563, 2.656629) (25.62814, 2.651488) (26.13065, 2.646516) (26.63317, 2.641708) (27.13568, 2.637058) (27.63819, 2.632561)
(28.1407, 2.628213) (28.64322, 2.624008) (29.14573, 2.619941) (29.64824, 2.616008) (30.15075, 2.612205) (30.65327, 2.608527) (31.15578, 2.60497) (31.65829, 2.601531)
(32.1608, 2.598205) (32.66332, 2.594988) (33.16583, 2.591877) (33.66834, 2.588869) (34.17085, 2.58596) (34.67337, 2.583146) (35.17588, 2.580426) (35.67839, 2.577795)
(36.1809, 2.57525) (36.68342, 2.57279) (37.18593, 2.57041) (37.68844, 2.568109) (38.19095, 2.565884) (38.69347, 2.563732) (39.19598, 2.561651) (39.69849, 2.559638)
(40.20101, 2.557692) (40.70352, 2.55581) (41.20603, 2.553989) (41.70854, 2.552229) (42.21106, 2.550527) (42.71357, 2.548881) (43.21608, 2.547289) (43.71859, 2.545749)
(44.22111, 2.54426) (44.72362, 2.542821) (45.22613, 2.541428) (45.72864, 2.540082) (46.23116, 2.53878) (46.73367, 2.53752) (47.23618, 2.536303) (47.73869, 2.535125)
(48.24121, 2.533986) (48.74372, 2.532885) (49.24623, 2.53182) (49.74874, 2.53079) (50.25126, 2.529794) (50.75377, 2.52883) (51.25628, 2.527899) (51.75879, 2.526998)
(52.26131, 2.526127) (52.76382, 2.525284) (53.26633, 2.524469) (53.76884, 2.523681) (54.27136, 2.522919) (54.77387, 2.522182) (55.27638, 2.52147) (55.77889, 2.520781)
(56.28141, 2.520114) (56.78392, 2.51947) (57.28643, 2.518846) (57.78894, 2.518244) (58.29146, 2.517661) (58.79397, 2.517097) (59.29648, 2.516552) (59.79899, 2.516024)
(60.30151, 2.515514) (60.80402, 2.515021) (61.30653, 2.514544) (61.80905, 2.514083) (62.31156, 2.513637) (62.81407, 2.513206) (63.31658, 2.512789) (63.8191, 2.512385)
(64.32161, 2.511995) (64.82412, 2.511618) (65.32663, 2.511253) (65.82915, 2.5109) (66.33166, 2.510559) (66.83417, 2.510229) (67.33668, 2.50991) (67.8392, 2.509601)
(68.34171, 2.509302) (68.84422, 2.509014) (69.34673, 2.508735) (69.84925, 2.508465) (70.35176, 2.508203) (70.85427, 2.507951) (71.35678, 2.507707) (71.8593, 2.507471)
(72.36181, 2.507242) (72.86432, 2.507021) (73.36683, 2.506808) (73.86935, 2.506601) (74.37186, 2.506401) (74.87437, 2.506208) (75.37688, 2.506021) (75.8794, 2.505841)
(76.38191, 2.505666) (76.88442, 2.505497) (77.38693, 2.505333) (77.88945, 2.505175) (78.39196, 2.505022) (78.89447, 2.504874) (79.39698, 2.504731) (79.8995, 2.504593)
(80.40201, 2.504459) (80.90452, 2.50433) (81.40704, 2.504205) (81.90955, 2.504084) (82.41206, 2.503967) (82.91457, 2.503853) (83.41709, 2.503744) (83.9196, 2.503638)
(84.42211, 2.503536) (84.92462, 2.503437) (85.42714, 2.503341) (85.92965, 2.503248) (86.43216, 2.503158) (86.93467, 2.503072) (87.43719, 2.502988) (87.9397, 2.502907)
(88.44221, 2.502828) (88.94472, 2.502752) (89.44724, 2.502679) (89.94975, 2.502608) (90.45226, 2.502539) (90.95477, 2.502473) (91.45729, 2.502409) (91.9598, 2.502347)
(92.46231, 2.502287) (92.96482, 2.502229) (93.46734, 2.502173) (93.96985, 2.502119) (94.47236, 2.502067) (94.97487, 2.502016) (95.47739, 2.501967) (95.9799, 2.501919)
(96.48241, 2.501873) (96.98492, 2.501829) (97.48744, 2.501786) (97.98995, 2.501744) (98.49246, 2.501704) (98.99497, 2.501665) (99.49749, 2.501627) (100, 2.501591)
};
\addplot[color=blue,line width=1.5pt] coordinates {
(0, 6.66666) (0.5025126, 6.611398) (1.005025, 6.558318) (1.507538, 6.506986) (2.01005, 6.457346) (2.512563, 6.409341) (3.015075, 6.362917) (3.517588, 6.318022)
(4.020101, 6.274607) (4.522613, 6.232622) (5.025126, 6.19202) (5.527638, 6.152756) (6.030151, 6.114786) (6.532663, 6.078066) (7.035176, 6.042554) (7.537688, 6.008211)
(8.040201, 5.975) (8.542714, 5.942884) (9.045226, 5.911825) (9.547739, 5.88179) (10.05025, 5.852744) (10.55276, 5.824655) (11.05528, 5.797492) (11.55779, 5.771223)
(12.0603, 5.74582) (12.56281, 5.721254) (13.06533, 5.697498) (13.56784, 5.674524) (14.07035, 5.652307) (14.57286, 5.630822) (15.07538, 5.610044) (15.57789, 5.589951)
(16.0804, 5.57052) (16.58291, 5.55173) (17.08543, 5.533558) (17.58794, 5.515985) (18.09045, 5.498991) (18.59296, 5.482556) (19.09548, 5.466663) (19.59799, 5.451294)
(20.1005, 5.436431) (20.60302, 5.422058) (21.10553, 5.408158) (21.60804, 5.394716) (22.11055, 5.381717) (22.61307, 5.369146) (23.11558, 5.356989) (23.61809, 5.345233)
(24.1206, 5.333864) (24.62312, 5.32287) (25.12563, 5.312237) (25.62814, 5.301956) (26.13065, 5.292012) (26.63317, 5.282397) (27.13568, 5.273098) (27.63819, 5.264105)
(28.1407, 5.255409) (28.64322, 5.246999) (29.14573, 5.238866) (29.64824, 5.231001) (30.15075, 5.223395) (30.65327, 5.21604) (31.15578, 5.208927) (31.65829, 5.202048)
(32.1608, 5.195396) (32.66332, 5.188963) (33.16583, 5.182742) (33.66834, 5.176726) (34.17085, 5.170908) (34.67337, 5.165282) (35.17588, 5.159841) (35.67839, 5.154579)
(36.1809, 5.149491) (36.68342, 5.14457) (37.18593, 5.139811) (37.68844, 5.135209) (38.19095, 5.130759) (38.69347, 5.126455) (39.19598, 5.122293) (39.69849, 5.118268)
(40.20101, 5.114376) (40.70352, 5.110612) (41.20603, 5.106972) (41.70854, 5.103451) (42.21106, 5.100047) (42.71357, 5.096755) (43.21608, 5.093571) (43.71859, 5.090493)
(44.22111, 5.087515) (44.72362, 5.084636) (45.22613, 5.081851) (45.72864, 5.079159) (46.23116, 5.076554) (46.73367, 5.074036) (47.23618, 5.071601) (47.73869, 5.069245)
(48.24121, 5.066968) (48.74372, 5.064765) (49.24623, 5.062635) (49.74874, 5.060575) (50.25126, 5.058583) (50.75377, 5.056657) (51.25628, 5.054794) (51.75879, 5.052992)
(52.26131, 5.05125) (52.76382, 5.049565) (53.26633, 5.047935) (53.76884, 5.04636) (54.27136, 5.044836) (54.77387, 5.043362) (55.27638, 5.041937) (55.77889, 5.040559)
(56.28141, 5.039226) (56.78392, 5.037937) (57.28643, 5.03669) (57.78894, 5.035485) (58.29146, 5.034319) (58.79397, 5.033191) (59.29648, 5.032101) (59.79899, 5.031047)
(60.30151, 5.030027) (60.80402, 5.029041) (61.30653, 5.028087) (61.80905, 5.027165) (62.31156, 5.026273) (62.81407, 5.02541) (63.31658, 5.024576) (63.8191, 5.023769)
(64.32161, 5.022989) (64.82412, 5.022234) (65.32663, 5.021505) (65.82915, 5.020799) (66.33166, 5.020116) (66.83417, 5.019456) (67.33668, 5.018818) (67.8392, 5.018201)
(68.34171, 5.017604) (68.84422, 5.017026) (69.34673, 5.016468) (69.84925, 5.015928) (70.35176, 5.015406) (70.85427, 5.014901) (71.35678, 5.014413) (71.8593, 5.01394)
(72.36181, 5.013484) (72.86432, 5.013042) (73.36683, 5.012615) (73.86935, 5.012202) (74.37186, 5.011802) (74.87437, 5.011416) (75.37688, 5.011042) (75.8794, 5.01068)
(76.38191, 5.010331) (76.88442, 5.009993) (77.38693, 5.009666) (77.88945, 5.00935) (78.39196, 5.009044) (78.89447, 5.008748) (79.39698, 5.008462) (79.8995, 5.008186)
(80.40201, 5.007918) (80.90452, 5.007659) (81.40704, 5.007409) (81.90955, 5.007167) (82.41206, 5.006933) (82.91457, 5.006706) (83.41709, 5.006487) (83.9196, 5.006276)
(84.42211, 5.006071) (84.92462, 5.005873) (85.42714, 5.005681) (85.92965, 5.005496) (86.43216, 5.005316) (86.93467, 5.005143) (87.43719, 5.004975) (87.9397, 5.004813)
(88.44221, 5.004656) (88.94472, 5.004504) (89.44724, 5.004358) (89.94975, 5.004216) (90.45226, 5.004078) (90.95477, 5.003945) (91.45729, 5.003818) (91.9598, 5.003694)
(92.46231, 5.003574) (92.96482, 5.003458) (93.46734, 5.003346) (93.96985, 5.003238) (94.47236, 5.003133) (94.97487, 5.003032) (95.47739, 5.002933) (95.9799, 5.002838)
(96.48241, 5.002746) (96.98492, 5.002657) (97.48744, 5.002571) (97.98995, 5.002488) (98.49246, 5.002407) (98.99497, 5.002329) (99.49749, 5.002254) (100, 5.002181)
};
\addplot[color=green,line width=1.5pt] coordinates {
(0, 9.99999) (0.5025126, 9.91763) (1.005025, 9.83799) (1.507538, 9.760974) (2.01005, 9.686495) (2.512563, 9.61447) (3.015075, 9.544818) (3.517588, 9.47746)
(4.020101, 9.412322) (4.522613, 9.34933) (5.025126, 9.288413) (5.527638, 9.229502) (6.030151, 9.172533) (6.532663, 9.117441) (7.035176, 9.06416) (7.537688, 9.012634)
(8.040201, 8.962806) (8.542714, 8.91462) (9.045226, 8.868022) (9.547739, 8.822958) (10.05025, 8.77938) (10.55276, 8.737237) (11.05528, 8.696483) (11.55779, 8.657071)
(12.0603, 8.618958) (12.56281, 8.582101) (13.06533, 8.546458) (13.56784, 8.511989) (14.07035, 8.478656) (14.57286, 8.446421) (15.07538, 8.415248) (15.57789, 8.385102)
(16.0804, 8.355949) (16.58291, 8.327757) (17.08543, 8.300493) (17.58794, 8.274128) (18.09045, 8.248631) (18.59296, 8.223974) (19.09548, 8.20013) (19.59799, 8.177071)
(20.1005, 8.154772) (20.60302, 8.133207) (21.10553, 8.112353) (21.60804, 8.092186) (22.11055, 8.072683) (22.61307, 8.053823) (23.11558, 8.035584) (23.61809, 8.017946)
(24.1206, 8.000889) (24.62312, 7.984394) (25.12563, 7.968442) (25.62814, 7.953016) (26.13065, 7.938098) (26.63317, 7.923672) (27.13568, 7.90972) (27.63819, 7.896229)
(28.1407, 7.883182) (28.64322, 7.870564) (29.14573, 7.858363) (29.64824, 7.846563) (30.15075, 7.835152) (30.65327, 7.824117) (31.15578, 7.813445) (31.65829, 7.803125)
(32.1608, 7.793145) (32.66332, 7.783494) (33.16583, 7.77416) (33.66834, 7.765134) (34.17085, 7.756406) (34.67337, 7.747965) (35.17588, 7.739802) (35.67839, 7.731907)
(36.1809, 7.724273) (36.68342, 7.716891) (37.18593, 7.709751) (37.68844, 7.702847) (38.19095, 7.69617) (38.69347, 7.689714) (39.19598, 7.683469) (39.69849, 7.677431)
(40.20101, 7.671591) (40.70352, 7.665944) (41.20603, 7.660483) (41.70854, 7.655202) (42.21106, 7.650095) (42.71357, 7.645156) (43.21608, 7.640379) (43.71859, 7.63576)
(44.22111, 7.631293) (44.72362, 7.626973) (45.22613, 7.622796) (45.72864, 7.618756) (46.23116, 7.614849) (46.73367, 7.611071) (47.23618, 7.607417) (47.73869, 7.603884)
(48.24121, 7.600467) (48.74372, 7.597162) (49.24623, 7.593967) (49.74874, 7.590876) (50.25126, 7.587888) (50.75377, 7.584998) (51.25628, 7.582203) (51.75879, 7.5795)
(52.26131, 7.576886) (52.76382, 7.574358) (53.26633, 7.571913) (53.76884, 7.569549) (54.27136, 7.567263) (54.77387, 7.565052) (55.27638, 7.562914) (55.77889, 7.560846)
(56.28141, 7.558847) (56.78392, 7.556913) (57.28643, 7.555043) (57.78894, 7.553234) (58.29146, 7.551485) (58.79397, 7.549794) (59.29648, 7.548158) (59.79899, 7.546576)
(60.30151, 7.545046) (60.80402, 7.543567) (61.30653, 7.542136) (61.80905, 7.540752) (62.31156, 7.539414) (62.81407, 7.53812) (63.31658, 7.536869) (63.8191, 7.535658)
(64.32161, 7.534488) (64.82412, 7.533356) (65.32663, 7.532261) (65.82915, 7.531202) (66.33166, 7.530178) (66.83417, 7.529188) (67.33668, 7.52823) (67.8392, 7.527304)
(68.34171, 7.526409) (68.84422, 7.525543) (69.34673, 7.524705) (69.84925, 7.523895) (70.35176, 7.523112) (70.85427, 7.522354) (71.35678, 7.521621) (71.8593, 7.520913)
(72.36181, 7.520228) (72.86432, 7.519565) (73.36683, 7.518924) (73.86935, 7.518304) (74.37186, 7.517705) (74.87437, 7.517125) (75.37688, 7.516565) (75.8794, 7.516022)
(76.38191, 7.515498) (76.88442, 7.514991) (77.38693, 7.514501) (77.88945, 7.514026) (78.39196, 7.513567) (78.89447, 7.513124) (79.39698, 7.512695) (79.8995, 7.51228)
(80.40201, 7.511878) (80.90452, 7.51149) (81.40704, 7.511115) (81.90955, 7.510751) (82.41206, 7.5104) (82.91457, 7.510061) (83.41709, 7.509732) (83.9196, 7.509414)
(84.42211, 7.509107) (84.92462, 7.50881) (85.42714, 7.508522) (85.92965, 7.508244) (86.43216, 7.507975) (86.93467, 7.507715) (87.43719, 7.507464) (87.9397, 7.50722)
(88.44221, 7.506985) (88.94472, 7.506757) (89.44724, 7.506537) (89.94975, 7.506324) (90.45226, 7.506118) (90.95477, 7.505919) (91.45729, 7.505727) (91.9598, 7.505541)
(92.46231, 7.505362) (92.96482, 7.505188) (93.46734, 7.50502) (93.96985, 7.504857) (94.47236, 7.5047) (94.97487, 7.504548) (95.47739, 7.5044) (95.9799, 7.504258)
(96.48241, 7.50412) (96.98492, 7.503986) (97.48744, 7.503857) (97.98995, 7.503732) (98.49246, 7.503611) (98.99497, 7.503495) (99.49749, 7.503381) (100, 7.503272)
};
\addplot[color=purple,line width=1.5pt] coordinates {
(0, 3.33333) (0.5025126, 3.305877) (1.005025, 3.27933) (1.507538, 3.253658) (2.01005, 3.228832) (2.512563, 3.204823) (3.015075, 3.181606) (3.517588, 3.159153)
(4.020101, 3.137441) (4.522613, 3.116443) (5.025126, 3.096138) (5.527638, 3.076501) (6.030151, 3.057511) (6.532663, 3.039147) (7.035176, 3.021387) (7.537688, 3.004211)
(8.040201, 2.987602) (8.542714, 2.97154) (9.045226, 2.956007) (9.547739, 2.940986) (10.05025, 2.92646) (10.55276, 2.912412) (11.05528, 2.898828) (11.55779, 2.88569)
(12.0603, 2.872986) (12.56281, 2.8607) (13.06533, 2.848819) (13.56784, 2.83733) (14.07035, 2.826219) (14.57286, 2.815474) (15.07538, 2.805083) (15.57789, 2.795034)
(16.0804, 2.785316) (16.58291, 2.775919) (17.08543, 2.766831) (17.58794, 2.758043) (18.09045, 2.749544) (18.59296, 2.741325) (19.09548, 2.733377) (19.59799, 2.72569)
(20.1005, 2.718257) (20.60302, 2.711069) (21.10553, 2.704118) (21.60804, 2.697395) (22.11055, 2.690894) (22.61307, 2.684608) (23.11558, 2.678528) (23.61809, 2.672649)
(24.1206, 2.666963) (24.62312, 2.661465) (25.12563, 2.656147) (25.62814, 2.651005) (26.13065, 2.646033) (26.63317, 2.641224) (27.13568, 2.636573) (27.63819, 2.632076)
(28.1407, 2.627727) (28.64322, 2.623521) (29.14573, 2.619454) (29.64824, 2.615521) (30.15075, 2.611717) (30.65327, 2.608039) (31.15578, 2.604482) (31.65829, 2.601042)
(32.1608, 2.597715) (32.66332, 2.594498) (33.16583, 2.591387) (33.66834, 2.588378) (34.17085, 2.585469) (34.67337, 2.582655) (35.17588, 2.579934) (35.67839, 2.577302)
(36.1809, 2.574758) (36.68342, 2.572297) (37.18593, 2.569917) (37.68844, 2.567616) (38.19095, 2.56539) (38.69347, 2.563238) (39.19598, 2.561156) (39.69849, 2.559144)
(40.20101, 2.557197) (40.70352, 2.555315) (41.20603, 2.553494) (41.70854, 2.551734) (42.21106, 2.550032) (42.71357, 2.548385) (43.21608, 2.546793) (43.71859, 2.545253)
(44.22111, 2.543764) (44.72362, 2.542324) (45.22613, 2.540932) (45.72864, 2.539585) (46.23116, 2.538283) (46.73367, 2.537024) (47.23618, 2.535806) (47.73869, 2.534628)
(48.24121, 2.533489) (48.74372, 2.532387) (49.24623, 2.531322) (49.74874, 2.530292) (50.25126, 2.529296) (50.75377, 2.528333) (51.25628, 2.527401) (51.75879, 2.5265)
(52.26131, 2.525629) (52.76382, 2.524786) (53.26633, 2.523971) (53.76884, 2.523183) (54.27136, 2.522421) (54.77387, 2.521684) (55.27638, 2.520971) (55.77889, 2.520282)
(56.28141, 2.519616) (56.78392, 2.518971) (57.28643, 2.518348) (57.78894, 2.517745) (58.29146, 2.517162) (58.79397, 2.516598) (59.29648, 2.516053) (59.79899, 2.515525)
(60.30151, 2.515015) (60.80402, 2.514522) (61.30653, 2.514045) (61.80905, 2.513584) (62.31156, 2.513138) (62.81407, 2.512707) (63.31658, 2.51229) (63.8191, 2.511886)
(64.32161, 2.511496) (64.82412, 2.511119) (65.32663, 2.510754) (65.82915, 2.510401) (66.33166, 2.510059) (66.83417, 2.509729) (67.33668, 2.50941) (67.8392, 2.509101)
(68.34171, 2.508803) (68.84422, 2.508514) (69.34673, 2.508235) (69.84925, 2.507965) (70.35176, 2.507704) (70.85427, 2.507451) (71.35678, 2.507207) (71.8593, 2.506971)
(72.36181, 2.506743) (72.86432, 2.506522) (73.36683, 2.506308) (73.86935, 2.506101) (74.37186, 2.505902) (74.87437, 2.505708) (75.37688, 2.505522) (75.8794, 2.505341)
(76.38191, 2.505166) (76.88442, 2.504997) (77.38693, 2.504834) (77.88945, 2.504675) (78.39196, 2.504522) (78.89447, 2.504375) (79.39698, 2.504232) (79.8995, 2.504093)
(80.40201, 2.503959) (80.90452, 2.50383) (81.40704, 2.503705) (81.90955, 2.503584) (82.41206, 2.503467) (82.91457, 2.503354) (83.41709, 2.503244) (83.9196, 2.503138)
(84.42211, 2.503036) (84.92462, 2.502937) (85.42714, 2.502841) (85.92965, 2.502748) (86.43216, 2.502658) (86.93467, 2.502572) (87.43719, 2.502488) (87.9397, 2.502407)
(88.44221, 2.502328) (88.94472, 2.502252) (89.44724, 2.502179) (89.94975, 2.502108) (90.45226, 2.502039) (90.95477, 2.501973) (91.45729, 2.501909) (91.9598, 2.501847)
(92.46231, 2.501787) (92.96482, 2.501729) (93.46734, 2.501673) (93.96985, 2.501619) (94.47236, 2.501567) (94.97487, 2.501516) (95.47739, 2.501467) (95.9799, 2.501419)
(96.48241, 2.501373) (96.98492, 2.501329) (97.48744, 2.501286) (97.98995, 2.501244) (98.49246, 2.501204) (98.99497, 2.501165) (99.49749, 2.501127) (100, 2.501091)
};
\addplot[color=teal,line width=1.5pt] coordinates {
(0, 6.66666) (0.5025126, 6.611754) (1.005025, 6.55866) (1.507538, 6.507316) (2.01005, 6.457664) (2.512563, 6.409647) (3.015075, 6.363212) (3.517588, 6.318307)
(4.020101, 6.274881) (4.522613, 6.232886) (5.025126, 6.192275) (5.527638, 6.153002) (6.030151, 6.115022) (6.532663, 6.078294) (7.035176, 6.042773) (7.537688, 6.008423)
(8.040201, 5.975204) (8.542714, 5.94308) (9.045226, 5.912014) (9.547739, 5.881972) (10.05025, 5.85292) (10.55276, 5.824825) (11.05528, 5.797655) (11.55779, 5.771381)
(12.0603, 5.745972) (12.56281, 5.7214) (13.06533, 5.697639) (13.56784, 5.674659) (14.07035, 5.652437) (14.57286, 5.630947) (15.07538, 5.610165) (15.57789, 5.590068)
(16.0804, 5.570633) (16.58291, 5.551838) (17.08543, 5.533662) (17.58794, 5.516085) (18.09045, 5.499087) (18.59296, 5.48265) (19.09548, 5.466753) (19.59799, 5.451381)
(20.1005, 5.436515) (20.60302, 5.422138) (21.10553, 5.408235) (21.60804, 5.394791) (22.11055, 5.381789) (22.61307, 5.369215) (23.11558, 5.357056) (23.61809, 5.345297)
(24.1206, 5.333926) (24.62312, 5.322929) (25.12563, 5.312295) (25.62814, 5.302011) (26.13065, 5.292066) (26.63317, 5.282448) (27.13568, 5.273147) (27.63819, 5.264153)
(28.1407, 5.255454) (28.64322, 5.247043) (29.14573, 5.238908) (29.64824, 5.231042) (30.15075, 5.223434) (30.65327, 5.216078) (31.15578, 5.208963) (31.65829, 5.202083)
(32.1608, 5.19543) (32.66332, 5.188996) (33.16583, 5.182773) (33.66834, 5.176756) (34.17085, 5.170937) (34.67337, 5.16531) (35.17588, 5.159868) (35.67839, 5.154605)
(36.1809, 5.149516) (36.68342, 5.144594) (37.18593, 5.139834) (37.68844, 5.135231) (38.19095, 5.13078) (38.69347, 5.126476) (39.19598, 5.122313) (39.69849, 5.118287)
(40.20101, 5.114394) (40.70352, 5.11063) (41.20603, 5.106989) (41.70854, 5.103468) (42.21106, 5.100063) (42.71357, 5.09677) (43.21608, 5.093586) (43.71859, 5.090507)
(44.22111, 5.087529) (44.72362, 5.084649) (45.22613, 5.081864) (45.72864, 5.079171) (46.23116, 5.076566) (46.73367, 5.074047) (47.23618, 5.071611) (47.73869, 5.069256)
(48.24121, 5.066978) (48.74372, 5.064775) (49.24623, 5.062644) (49.74874, 5.060584) (50.25126, 5.058592) (50.75377, 5.056665) (51.25628, 5.054802) (51.75879, 5.053)
(52.26131, 5.051257) (52.76382, 5.049572) (53.26633, 5.047942) (53.76884, 5.046366) (54.27136, 5.044842) (54.77387, 5.043368) (55.27638, 5.041943) (55.77889, 5.040564)
(56.28141, 5.039231) (56.78392, 5.037942) (57.28643, 5.036695) (57.78894, 5.03549) (58.29146, 5.034323) (58.79397, 5.033196) (59.29648, 5.032105) (59.79899, 5.031051)
(60.30151, 5.030031) (60.80402, 5.029045) (61.30653, 5.028091) (61.80905, 5.027168) (62.31156, 5.026276) (62.81407, 5.025413) (63.31658, 5.024579) (63.8191, 5.023772)
(64.32161, 5.022992) (64.82412, 5.022237) (65.32663, 5.021507) (65.82915, 5.020801) (66.33166, 5.020119) (66.83417, 5.019459) (67.33668, 5.01882) (67.8392, 5.018203)
(68.34171, 5.017606) (68.84422, 5.017028) (69.34673, 5.01647) (69.84925, 5.01593) (70.35176, 5.015408) (70.85427, 5.014903) (71.35678, 5.014414) (71.8593, 5.013942)
(72.36181, 5.013485) (72.86432, 5.013043) (73.36683, 5.012616) (73.86935, 5.012203) (74.37186, 5.011803) (74.87437, 5.011417) (75.37688, 5.011043) (75.8794, 5.010682)
(76.38191, 5.010332) (76.88442, 5.009994) (77.38693, 5.009667) (77.88945, 5.009351) (78.39196, 5.009045) (78.89447, 5.008749) (79.39698, 5.008463) (79.8995, 5.008186)
(80.40201, 5.007919) (80.90452, 5.00766) (81.40704, 5.00741) (81.90955, 5.007168) (82.41206, 5.006934) (82.91457, 5.006707) (83.41709, 5.006488) (83.9196, 5.006276)
(84.42211, 5.006071) (84.92462, 5.005873) (85.42714, 5.005682) (85.92965, 5.005496) (86.43216, 5.005317) (86.93467, 5.005143) (87.43719, 5.004976) (87.9397, 5.004813)
(88.44221, 5.004657) (88.94472, 5.004505) (89.44724, 5.004358) (89.94975, 5.004216) (90.45226, 5.004079) (90.95477, 5.003946) (91.45729, 5.003818) (91.9598, 5.003694)
(92.46231, 5.003574) (92.96482, 5.003459) (93.46734, 5.003347) (93.96985, 5.003238) (94.47236, 5.003133) (94.97487, 5.003032) (95.47739, 5.002934) (95.9799, 5.002839)
(96.48241, 5.002747) (96.98492, 5.002658) (97.48744, 5.002572) (97.98995, 5.002488) (98.49246, 5.002408) (98.99497, 5.00233) (99.49749, 5.002254) (100, 5.002181)
};
\end{axis}
\end{tikzpicture}
\caption{Simulation for model in Figure~\ref{fig:FastReaction} where the rate constants, $k_1$ and $k_2$ are high and equal 1000 and 500, respectively. In this case both models coincide indicating that the approximation is good. Upper curve is T, middle curve B which includes $B$ and $B_f$, and lower curve A which includes $A$ and $A_f$. Tellurium model in Listing~\ref{tellurium:chap:ODEsEquilibrium}.}
\label{fig:FastReactionApproxEquilFast}
\end{figure}
```

What if the middle reaction is not very fast, but comparable to the other steps in the pathway? In this situation we can no longer assume it is at equilibrium so if we run the simulation, we obtain the graphs shown in Figure [Figure: A rerun of the simulation shown in Figure \ref{fig:FastReactionApproxE](#fig-fastreactionapproxequilslow). Interestingly, the concentration of B is unaffected. This is because B is independent of $k_1$ and $k_2$ since at steady state:

$$
\begin{align*}
\frac{dA}{dt} &= v_0 - A k_1 + B k_2 = 0 \\[8pt]
\frac{dB}{dt} &= A k_1 - B k_2 - B k_3 = 0 \\
\end{align*}
$$

Solving for the steady state solution for A using $dA/dt=0$ and inserting this into the second equation, $dB/dt = 0$, yields:

$$ B_{ss} = \frac{v_o}{k_3} $$

In contrast, A as computed by the approximation, diverges from the expected trajectory. Two important points are worth making. The first is that if we use the equilibrium approximation inappropriately, the time trajectories diverge. More problematic is that the final steady state value for A is also different. The equilibrium approximation should therefore be used carefully.

<!-- $$ A_{ss} = vo \frac{k_2 + k_3}{k_1 k_3} $$ -->

**Figure** <a id="fig-fastreactionapproxequilslow"></a> `fig:FastReactionApproxEquilSlow`

*Caption:* A rerun of the simulation shown in Figure [Figure: Simulation for model in Figure \ref{fig:FastReaction} where the rate c](#fig-fastreactionapproxequilfast) but this time we slowed down the middle reaction so we no longer assume it is in equilibrium. Notice the concentration of A diverges from the expected solution so that the approximation is no longer valid. $k_1 = 1; k_2 = 0.5$. Curves from the top, T, B (equilibrium solution), B (true solution), A (equilibrium solution), B (true solution). Tellurium model in Listing `tellurium:chap:ODEsEquilibrium`.

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Variables, $T, A$ and $B$},
xmin=0, xmax=100, ymin=2, ymax=10,
width=10cm,
height=6cm]
\node at (axis cs:80,8.5) {T};
\node at (axis cs:80,5.5) {B};
\node at (axis cs:80,3.5) {A};

\addplot[color=red,line width=1.5pt] coordinates {
(0, 3.333333) (0.5025126, 3.501994) (1.005025, 3.568771) (1.507538, 3.588827) (2.01005, 3.587603) (2.512563, 3.576887) (3.015075, 3.562098) (3.517588, 3.545743)
(4.020101, 3.528975) (4.522613, 3.512314) (5.025126, 3.495988) (5.527638, 3.480094) (6.030151, 3.464669) (6.532663, 3.449722) (7.035176, 3.435246) (7.537688, 3.421233)
(8.040201, 3.407669) (8.542714, 3.394541) (9.045226, 3.381836) (9.547739, 3.36954) (10.05025, 3.35764) (10.55276, 3.346123) (11.05528, 3.334977) (11.55779, 3.324189)
(12.0603, 3.31375) (12.56281, 3.303647) (13.06533, 3.293869) (13.56784, 3.284406) (14.07035, 3.275247) (14.57286, 3.266384) (15.07538, 3.257806) (15.57789, 3.249505)
(16.0804, 3.241471) (16.58291, 3.233695) (17.08543, 3.226171) (17.58794, 3.218888) (18.09045, 3.21184) (18.59296, 3.205019) (19.09548, 3.198418) (19.59799, 3.192029)
(20.1005, 3.185846) (20.60302, 3.179863) (21.10553, 3.174072) (21.60804, 3.168467) (22.11055, 3.163043) (22.61307, 3.157794) (23.11558, 3.152714) (23.61809, 3.147797)
(24.1206, 3.143039) (24.62312, 3.138434) (25.12563, 3.133977) (25.62814, 3.129664) (26.13065, 3.12549) (26.63317, 3.12145) (27.13568, 3.117541) (27.63819, 3.113757)
(28.1407, 3.110095) (28.64322, 3.106551) (29.14573, 3.103121) (29.64824, 3.099802) (30.15075, 3.096589) (30.65327, 3.09348) (31.15578, 3.090472) (31.65829, 3.08756)
(32.1608, 3.084741) (32.66332, 3.082014) (33.16583, 3.079375) (33.66834, 3.07682) (34.17085, 3.074348) (34.67337, 3.071955) (35.17588, 3.069639) (35.67839, 3.067398)
(36.1809, 3.06523) (36.68342, 3.063131) (37.18593, 3.061099) (37.68844, 3.059133) (38.19095, 3.057231) (38.69347, 3.055389) (39.19598, 3.053607) (39.69849, 3.051882)
(40.20101, 3.050213) (40.70352, 3.048598) (41.20603, 3.047034) (41.70854, 3.045521) (42.21106, 3.044057) (42.71357, 3.04264) (43.21608, 3.041268) (43.71859, 3.039941)
(44.22111, 3.038656) (44.72362, 3.037413) (45.22613, 3.03621) (45.72864, 3.035045) (46.23116, 3.033919) (46.73367, 3.032828) (47.23618, 3.031772) (47.73869, 3.030751)
(48.24121, 3.029762) (48.74372, 3.028805) (49.24623, 3.027879) (49.74874, 3.026983) (50.25126, 3.026116) (50.75377, 3.025276) (51.25628, 3.024464) (51.75879, 3.023678)
(52.26131, 3.022917) (52.76382, 3.02218) (53.26633, 3.021467) (53.76884, 3.020778) (54.27136, 3.02011) (54.77387, 3.019464) (55.27638, 3.018839) (55.77889, 3.018234)
(56.28141, 3.017648) (56.78392, 3.017081) (57.28643, 3.016532) (57.78894, 3.016002) (58.29146, 3.015488) (58.79397, 3.01499) (59.29648, 3.014509) (59.79899, 3.014043)
(60.30151, 3.013592) (60.80402, 3.013156) (61.30653, 3.012734) (61.80905, 3.012325) (62.31156, 3.01193) (62.81407, 3.011547) (63.31658, 3.011176) (63.8191, 3.010818)
(64.32161, 3.010471) (64.82412, 3.010135) (65.32663, 3.00981) (65.82915, 3.009495) (66.33166, 3.00919) (66.83417, 3.008896) (67.33668, 3.008611) (67.8392, 3.008335)
(68.34171, 3.008067) (68.84422, 3.007809) (69.34673, 3.007559) (69.84925, 3.007317) (70.35176, 3.007082) (70.85427, 3.006855) (71.35678, 3.006636) (71.8593, 3.006423)
(72.36181, 3.006218) (72.86432, 3.006019) (73.36683, 3.005826) (73.86935, 3.005639) (74.37186, 3.005459) (74.87437, 3.005284) (75.37688, 3.005115) (75.8794, 3.004952)
(76.38191, 3.004793) (76.88442, 3.00464) (77.38693, 3.004492) (77.88945, 3.004348) (78.39196, 3.004209) (78.89447, 3.004075) (79.39698, 3.003945) (79.8995, 3.003819)
(80.40201, 3.003697) (80.90452, 3.003579) (81.40704, 3.003464) (81.90955, 3.003354) (82.41206, 3.003247) (82.91457, 3.003143) (83.41709, 3.003043) (83.9196, 3.002946)
(84.42211, 3.002852) (84.92462, 3.002761) (85.42714, 3.002673) (85.92965, 3.002587) (86.43216, 3.002505) (86.93467, 3.002425) (87.43719, 3.002348) (87.9397, 3.002273)
(88.44221, 3.002201) (88.94472, 3.002131) (89.44724, 3.002063) (89.94975, 3.001998) (90.45226, 3.001934) (90.95477, 3.001873) (91.45729, 3.001814) (91.9598, 3.001756)
(92.46231, 3.001701) (92.96482, 3.001647) (93.46734, 3.001595) (93.96985, 3.001544) (94.47236, 3.001495) (94.97487, 3.001448) (95.47739, 3.001402) (95.9799, 3.001357)
(96.48241, 3.001314) (96.98492, 3.001273) (97.48744, 3.001233) (97.98995, 3.001193) (98.49246, 3.001156) (98.99497, 3.001119) (99.49749, 3.001084) (100, 3.001049)
};
\addplot[color=blue,line width=1.5pt] coordinates {
(0, 6.66666) (0.5025126, 6.421076) (1.005025, 6.286576) (1.507538, 6.204085) (2.01005, 6.146323) (2.512563, 6.100618) (3.015075, 6.061112) (3.517588, 6.025069)
(4.020101, 5.991197) (4.522613, 5.958872) (5.025126, 5.927806) (5.527638, 5.897841) (6.030151, 5.868887) (6.532663, 5.840886) (7.035176, 5.813798) (7.537688, 5.787586)
(8.040201, 5.762221) (8.542714, 5.737674) (9.045226, 5.713917) (9.547739, 5.690927) (10.05025, 5.668677) (10.55276, 5.647143) (11.05528, 5.626304) (11.55779, 5.606135)
(12.0603, 5.586616) (12.56281, 5.567726) (13.06533, 5.549444) (13.56784, 5.531751) (14.07035, 5.514628) (14.57286, 5.498057) (15.07538, 5.482019) (15.57789, 5.466498)
(16.0804, 5.451476) (16.58291, 5.436939) (17.08543, 5.42287) (17.58794, 5.409254) (18.09045, 5.396076) (18.59296, 5.383323) (19.09548, 5.370981) (19.59799, 5.359036)
(20.1005, 5.347476) (20.60302, 5.336288) (21.10553, 5.325461) (21.60804, 5.314982) (22.11055, 5.304841) (22.61307, 5.295027) (23.11558, 5.285528) (23.61809, 5.276336)
(24.1206, 5.267439) (24.62312, 5.258829) (25.12563, 5.250497) (25.62814, 5.242432) (26.13065, 5.234628) (26.63317, 5.227075) (27.13568, 5.219765) (27.63819, 5.21269)
(28.1407, 5.205844) (28.64322, 5.199218) (29.14573, 5.192805) (29.64824, 5.186599) (30.15075, 5.180593) (30.65327, 5.17478) (31.15578, 5.169154) (31.65829, 5.16371)
(32.1608, 5.158441) (32.66332, 5.153341) (33.16583, 5.148406) (33.66834, 5.14363) (34.17085, 5.139007) (34.67337, 5.134534) (35.17588, 5.130204) (35.67839, 5.126014)
(36.1809, 5.121959) (36.68342, 5.118035) (37.18593, 5.114237) (37.68844, 5.110561) (38.19095, 5.107004) (38.69347, 5.103561) (39.19598, 5.100229) (39.69849, 5.097004)
(40.20101, 5.093883) (40.70352, 5.090863) (41.20603, 5.08794) (41.70854, 5.085111) (42.21106, 5.082373) (42.71357, 5.079724) (43.21608, 5.077159) (43.71859, 5.074678)
(44.22111, 5.072276) (44.72362, 5.069951) (45.22613, 5.067702) (45.72864, 5.065524) (46.23116, 5.063417) (46.73367, 5.061378) (47.23618, 5.059404) (47.73869, 5.057494)
(48.24121, 5.055646) (48.74372, 5.053857) (49.24623, 5.052126) (49.74874, 5.05045) (50.25126, 5.048828) (50.75377, 5.047259) (51.25628, 5.04574) (51.75879, 5.04427)
(52.26131, 5.042847) (52.76382, 5.04147) (53.26633, 5.040138) (53.76884, 5.038848) (54.27136, 5.0376) (54.77387, 5.036392) (55.27638, 5.035223) (55.77889, 5.034091)
(56.28141, 5.032996) (56.78392, 5.031936) (57.28643, 5.030911) (57.78894, 5.029918) (58.29146, 5.028957) (58.79397, 5.028027) (59.29648, 5.027128) (59.79899, 5.026257)
(60.30151, 5.025414) (60.80402, 5.024598) (61.30653, 5.023808) (61.80905, 5.023044) (62.31156, 5.022305) (62.81407, 5.021589) (63.31658, 5.020896) (63.8191, 5.020226)
(64.32161, 5.019577) (64.82412, 5.018949) (65.32663, 5.018341) (65.82915, 5.017753) (66.33166, 5.017183) (66.83417, 5.016632) (67.33668, 5.016099) (67.8392, 5.015583)
(68.34171, 5.015084) (68.84422, 5.0146) (69.34673, 5.014132) (69.84925, 5.01368) (70.35176, 5.013241) (70.85427, 5.012817) (71.35678, 5.012407) (71.8593, 5.01201)
(72.36181, 5.011625) (72.86432, 5.011253) (73.36683, 5.010893) (73.86935, 5.010544) (74.37186, 5.010207) (74.87437, 5.00988) (75.37688, 5.009564) (75.8794, 5.009258)
(76.38191, 5.008962) (76.88442, 5.008676) (77.38693, 5.008398) (77.88945, 5.00813) (78.39196, 5.00787) (78.89447, 5.007618) (79.39698, 5.007375) (79.8995, 5.007139)
(80.40201, 5.006911) (80.90452, 5.006691) (81.40704, 5.006477) (81.90955, 5.00627) (82.41206, 5.00607) (82.91457, 5.005876) (83.41709, 5.005689) (83.9196, 5.005507)
(84.42211, 5.005332) (84.92462, 5.005162) (85.42714, 5.004997) (85.92965, 5.004838) (86.43216, 5.004684) (86.93467, 5.004534) (87.43719, 5.00439) (87.9397, 5.00425)
(88.44221, 5.004115) (88.94472, 5.003983) (89.44724, 5.003857) (89.94975, 5.003735) (90.45226, 5.003617) (90.95477, 5.003502) (91.45729, 5.003391) (91.9598, 5.003284)
(92.46231, 5.00318) (92.96482, 5.003079) (93.46734, 5.002981) (93.96985, 5.002887) (94.47236, 5.002795) (94.97487, 5.002707) (95.47739, 5.002621) (95.9799, 5.002538)
(96.48241, 5.002458) (96.98492, 5.00238) (97.48744, 5.002304) (97.98995, 5.002231) (98.49246, 5.002161) (98.99497, 5.002092) (99.49749, 5.002026) (100, 5.001962)
};
\addplot[color=green,line width=1.5pt] coordinates {
(0, 9.99999) (0.5025126, 9.917626) (1.005025, 9.837975) (1.507538, 9.760949) (2.01005, 9.68646) (2.512563, 9.614427) (3.015075, 9.544768) (3.517588, 9.477411)
(4.020101, 9.412279) (4.522613, 9.349285) (5.025126, 9.288366) (5.527638, 9.229456) (6.030151, 9.172487) (6.532663, 9.117395) (7.035176, 9.064118) (7.537688, 9.012596)
(8.040201, 8.962771) (8.542714, 8.914588) (9.045226, 8.867993) (9.547739, 8.822933) (10.05025, 8.779358) (10.55276, 8.737218) (11.05528, 8.696466) (11.55779, 8.657057)
(12.0603, 8.618946) (12.56281, 8.582091) (13.06533, 8.54645) (13.56784, 8.511983) (14.07035, 8.478652) (14.57286, 8.446419) (15.07538, 8.415247) (15.57789, 8.385103)
(16.0804, 8.355951) (16.58291, 8.32776) (17.08543, 8.300498) (17.58794, 8.274134) (18.09045, 8.248639) (18.59296, 8.223983) (19.09548, 8.20014) (19.59799, 8.177082)
(20.1005, 8.154784) (20.60302, 8.13322) (21.10553, 8.112367) (21.60804, 8.092201) (22.11055, 8.072699) (22.61307, 8.05384) (23.11558, 8.035602) (23.61809, 8.017964)
(24.1206, 8.000908) (24.62312, 7.984414) (25.12563, 7.968463) (25.62814, 7.953037) (26.13065, 7.93812) (26.63317, 7.923694) (27.13568, 7.909743) (27.63819, 7.896252)
(28.1407, 7.883205) (28.64322, 7.870588) (29.14573, 7.858387) (29.64824, 7.846587) (30.15075, 7.835177) (30.65327, 7.824142) (31.15578, 7.813471) (31.65829, 7.803151)
(32.1608, 7.793171) (32.66332, 7.78352) (33.16583, 7.774187) (33.66834, 7.765161) (34.17085, 7.756433) (34.67337, 7.747992) (35.17588, 7.739829) (35.67839, 7.731935)
(36.1809, 7.724301) (36.68342, 7.716919) (37.18593, 7.70978) (37.68844, 7.702875) (38.19095, 7.696199) (38.69347, 7.689742) (39.19598, 7.683498) (39.69849, 7.67746)
(40.20101, 7.67162) (40.70352, 7.665973) (41.20603, 7.660512) (41.70854, 7.655231) (42.21106, 7.650123) (42.71357, 7.645184) (43.21608, 7.640408) (43.71859, 7.635789)
(44.22111, 7.631322) (44.72362, 7.627002) (45.22613, 7.622824) (45.72864, 7.618784) (46.23116, 7.614877) (46.73367, 7.611099) (47.23618, 7.607445) (47.73869, 7.603912)
(48.24121, 7.600495) (48.74372, 7.59719) (49.24623, 7.593995) (49.74874, 7.590904) (50.25126, 7.587916) (50.75377, 7.585025) (51.25628, 7.58223) (51.75879, 7.579527)
(52.26131, 7.576913) (52.76382, 7.574385) (53.26633, 7.571941) (53.76884, 7.569576) (54.27136, 7.56729) (54.77387, 7.565079) (55.27638, 7.562941) (55.77889, 7.560873)
(56.28141, 7.558873) (56.78392, 7.556939) (57.28643, 7.555068) (57.78894, 7.55326) (58.29146, 7.55151) (58.79397, 7.549819) (59.29648, 7.548183) (59.79899, 7.546601)
(60.30151, 7.54507) (60.80402, 7.543591) (61.30653, 7.54216) (61.80905, 7.540776) (62.31156, 7.539437) (62.81407, 7.538143) (63.31658, 7.536891) (63.8191, 7.535681)
(64.32161, 7.53451) (64.82412, 7.533377) (65.32663, 7.532283) (65.82915, 7.531224) (66.33166, 7.5302) (66.83417, 7.529209) (67.33668, 7.528251) (67.8392, 7.527325)
(68.34171, 7.52643) (68.84422, 7.525563) (69.34673, 7.524726) (69.84925, 7.523915) (70.35176, 7.523132) (70.85427, 7.522374) (71.35678, 7.521641) (71.8593, 7.520933)
(72.36181, 7.520247) (72.86432, 7.519584) (73.36683, 7.518943) (73.86935, 7.518323) (74.37186, 7.517724) (74.87437, 7.517144) (75.37688, 7.516583) (75.8794, 7.51604)
(76.38191, 7.515516) (76.88442, 7.515009) (77.38693, 7.514518) (77.88945, 7.514043) (78.39196, 7.513584) (78.89447, 7.51314) (79.39698, 7.512711) (79.8995, 7.512296)
(80.40201, 7.511894) (80.90452, 7.511506) (81.40704, 7.51113) (81.90955, 7.510767) (82.41206, 7.510415) (82.91457, 7.510075) (83.41709, 7.509746) (83.9196, 7.509428)
(84.42211, 7.509121) (84.92462, 7.508823) (85.42714, 7.508536) (85.92965, 7.508257) (86.43216, 7.507988) (86.93467, 7.507728) (87.43719, 7.507476) (87.9397, 7.507232)
(88.44221, 7.506997) (88.94472, 7.506769) (89.44724, 7.50655) (89.94975, 7.506337) (90.45226, 7.506132) (90.95477, 7.505933) (91.45729, 7.505741) (91.9598, 7.505555)
(92.46231, 7.505375) (92.96482, 7.505201) (93.46734, 7.505033) (93.96985, 7.50487) (94.47236, 7.504712) (94.97487, 7.504559) (95.47739, 7.504412) (95.9799, 7.504269)
(96.48241, 7.50413) (96.98492, 7.503997) (97.48744, 7.503867) (97.98995, 7.503742) (98.49246, 7.503621) (98.99497, 7.503503) (99.49749, 7.50339) (100, 7.50328)
};
\addplot[color=purple,line width=1.5pt] coordinates {
(0, 3.33333) (0.5025126, 3.305875) (1.005025, 3.279325) (1.507538, 3.25365) (2.01005, 3.22882) (2.512563, 3.204809) (3.015075, 3.181589) (3.517588, 3.159137)
(4.020101, 3.137426) (4.522613, 3.116428) (5.025126, 3.096122) (5.527638, 3.076485) (6.030151, 3.057496) (6.532663, 3.039132) (7.035176, 3.021373) (7.537688, 3.004199)
(8.040201, 2.98759) (8.542714, 2.971529) (9.045226, 2.955998) (9.547739, 2.940978) (10.05025, 2.926453) (10.55276, 2.912406) (11.05528, 2.898822) (11.55779, 2.885686)
(12.0603, 2.872982) (12.56281, 2.860697) (13.06533, 2.848817) (13.56784, 2.837328) (14.07035, 2.826217) (14.57286, 2.815473) (15.07538, 2.805082) (15.57789, 2.795034)
(16.0804, 2.785317) (16.58291, 2.77592) (17.08543, 2.766833) (17.58794, 2.758045) (18.09045, 2.749546) (18.59296, 2.741328) (19.09548, 2.73338) (19.59799, 2.725694)
(20.1005, 2.718261) (20.60302, 2.711073) (21.10553, 2.704122) (21.60804, 2.6974) (22.11055, 2.6909) (22.61307, 2.684613) (23.11558, 2.678534) (23.61809, 2.672655)
(24.1206, 2.666969) (24.62312, 2.661471) (25.12563, 2.656154) (25.62814, 2.651012) (26.13065, 2.64604) (26.63317, 2.641231) (27.13568, 2.636581) (27.63819, 2.632084)
(28.1407, 2.627735) (28.64322, 2.623529) (29.14573, 2.619462) (29.64824, 2.615529) (30.15075, 2.611726) (30.65327, 2.608047) (31.15578, 2.60449) (31.65829, 2.60105)
(32.1608, 2.597724) (32.66332, 2.594507) (33.16583, 2.591396) (33.66834, 2.588387) (34.17085, 2.585478) (34.67337, 2.582664) (35.17588, 2.579943) (35.67839, 2.577312)
(36.1809, 2.574767) (36.68342, 2.572306) (37.18593, 2.569927) (37.68844, 2.567625) (38.19095, 2.5654) (38.69347, 2.563247) (39.19598, 2.561166) (39.69849, 2.559153)
(40.20101, 2.557207) (40.70352, 2.555324) (41.20603, 2.553504) (41.70854, 2.551744) (42.21106, 2.550041) (42.71357, 2.548395) (43.21608, 2.546803) (43.71859, 2.545263)
(44.22111, 2.543774) (44.72362, 2.542334) (45.22613, 2.540941) (45.72864, 2.539595) (46.23116, 2.538292) (46.73367, 2.537033) (47.23618, 2.535815) (47.73869, 2.534637)
(48.24121, 2.533498) (48.74372, 2.532397) (49.24623, 2.531332) (49.74874, 2.530301) (50.25126, 2.529305) (50.75377, 2.528342) (51.25628, 2.52741) (51.75879, 2.526509)
(52.26131, 2.525638) (52.76382, 2.524795) (53.26633, 2.52398) (53.76884, 2.523192) (54.27136, 2.52243) (54.77387, 2.521693) (55.27638, 2.52098) (55.77889, 2.520291)
(56.28141, 2.519624) (56.78392, 2.51898) (57.28643, 2.518356) (57.78894, 2.517753) (58.29146, 2.51717) (58.79397, 2.516606) (59.29648, 2.516061) (59.79899, 2.515534)
(60.30151, 2.515023) (60.80402, 2.51453) (61.30653, 2.514053) (61.80905, 2.513592) (62.31156, 2.513146) (62.81407, 2.512714) (63.31658, 2.512297) (63.8191, 2.511894)
(64.32161, 2.511503) (64.82412, 2.511126) (65.32663, 2.510761) (65.82915, 2.510408) (66.33166, 2.510067) (66.83417, 2.509736) (67.33668, 2.509417) (67.8392, 2.509108)
(68.34171, 2.50881) (68.84422, 2.508521) (69.34673, 2.508242) (69.84925, 2.507972) (70.35176, 2.507711) (70.85427, 2.507458) (71.35678, 2.507214) (71.8593, 2.506978)
(72.36181, 2.506749) (72.86432, 2.506528) (73.36683, 2.506314) (73.86935, 2.506108) (74.37186, 2.505908) (74.87437, 2.505715) (75.37688, 2.505528) (75.8794, 2.505347)
(76.38191, 2.505172) (76.88442, 2.505003) (77.38693, 2.504839) (77.88945, 2.504681) (78.39196, 2.504528) (78.89447, 2.50438) (79.39698, 2.504237) (79.8995, 2.504099)
(80.40201, 2.503965) (80.90452, 2.503835) (81.40704, 2.50371) (81.90955, 2.503589) (82.41206, 2.503472) (82.91457, 2.503358) (83.41709, 2.503249) (83.9196, 2.503143)
(84.42211, 2.50304) (84.92462, 2.502941) (85.42714, 2.502845) (85.92965, 2.502752) (86.43216, 2.502663) (86.93467, 2.502576) (87.43719, 2.502492) (87.9397, 2.502411)
(88.44221, 2.502332) (88.94472, 2.502256) (89.44724, 2.502183) (89.94975, 2.502112) (90.45226, 2.502044) (90.95477, 2.501978) (91.45729, 2.501914) (91.9598, 2.501852)
(92.46231, 2.501792) (92.96482, 2.501734) (93.46734, 2.501678) (93.96985, 2.501623) (94.47236, 2.501571) (94.97487, 2.50152) (95.47739, 2.501471) (95.9799, 2.501423)
(96.48241, 2.501377) (96.98492, 2.501332) (97.48744, 2.501289) (97.98995, 2.501247) (98.49246, 2.501207) (98.99497, 2.501168) (99.49749, 2.50113) (100, 2.501093)
};
\addplot[color=teal,line width=1.5pt] coordinates {
(0, 6.66666) (0.5025126, 6.61175) (1.005025, 6.55865) (1.507538, 6.507299) (2.01005, 6.45764) (2.512563, 6.409618) (3.015075, 6.363178) (3.517588, 6.318274)
(4.020101, 6.274853) (4.522613, 6.232856) (5.025126, 6.192244) (5.527638, 6.152971) (6.030151, 6.114991) (6.532663, 6.078263) (7.035176, 6.042745) (7.537688, 6.008397)
(8.040201, 5.975181) (8.542714, 5.943059) (9.045226, 5.911995) (9.547739, 5.881955) (10.05025, 5.852905) (10.55276, 5.824812) (11.05528, 5.797644) (11.55779, 5.771371)
(12.0603, 5.745964) (12.56281, 5.721394) (13.06533, 5.697633) (13.56784, 5.674655) (14.07035, 5.652435) (14.57286, 5.630946) (15.07538, 5.610165) (15.57789, 5.590068)
(16.0804, 5.570634) (16.58291, 5.55184) (17.08543, 5.533666) (17.58794, 5.51609) (18.09045, 5.499093) (18.59296, 5.482656) (19.09548, 5.46676) (19.59799, 5.451388)
(20.1005, 5.436523) (20.60302, 5.422147) (21.10553, 5.408245) (21.60804, 5.394801) (22.11055, 5.381799) (22.61307, 5.369227) (23.11558, 5.357068) (23.61809, 5.34531)
(24.1206, 5.333939) (24.62312, 5.322942) (25.12563, 5.312308) (25.62814, 5.302025) (26.13065, 5.29208) (26.63317, 5.282462) (27.13568, 5.273162) (27.63819, 5.264168)
(28.1407, 5.25547) (28.64322, 5.247059) (29.14573, 5.238925) (29.64824, 5.231058) (30.15075, 5.223451) (30.65327, 5.216095) (31.15578, 5.20898) (31.65829, 5.202101)
(32.1608, 5.195447) (32.66332, 5.189013) (33.16583, 5.182791) (33.66834, 5.176774) (34.17085, 5.170955) (34.67337, 5.165328) (35.17588, 5.159886) (35.67839, 5.154623)
(36.1809, 5.149534) (36.68342, 5.144613) (37.18593, 5.139853) (37.68844, 5.13525) (38.19095, 5.130799) (38.69347, 5.126495) (39.19598, 5.122332) (39.69849, 5.118306)
(40.20101, 5.114413) (40.70352, 5.110649) (41.20603, 5.107008) (41.70854, 5.103487) (42.21106, 5.100082) (42.71357, 5.09679) (43.21608, 5.093605) (43.71859, 5.090526)
(44.22111, 5.087548) (44.72362, 5.084668) (45.22613, 5.081883) (45.72864, 5.07919) (46.23116, 5.076585) (46.73367, 5.074066) (47.23618, 5.07163) (47.73869, 5.069275)
(48.24121, 5.066997) (48.74372, 5.064794) (49.24623, 5.062663) (49.74874, 5.060603) (50.25126, 5.05861) (50.75377, 5.056684) (51.25628, 5.05482) (51.75879, 5.053018)
(52.26131, 5.051275) (52.76382, 5.04959) (53.26633, 5.04796) (53.76884, 5.046384) (54.27136, 5.04486) (54.77387, 5.043386) (55.27638, 5.04196) (55.77889, 5.040582)
(56.28141, 5.039248) (56.78392, 5.037959) (57.28643, 5.036712) (57.78894, 5.035506) (58.29146, 5.03434) (58.79397, 5.033212) (59.29648, 5.032122) (59.79899, 5.031067)
(60.30151, 5.030047) (60.80402, 5.02906) (61.30653, 5.028106) (61.80905, 5.027184) (62.31156, 5.026292) (62.81407, 5.025429) (63.31658, 5.024594) (63.8191, 5.023787)
(64.32161, 5.023006) (64.82412, 5.022252) (65.32663, 5.021522) (65.82915, 5.020816) (66.33166, 5.020133) (66.83417, 5.019473) (67.33668, 5.018834) (67.8392, 5.018217)
(68.34171, 5.01762) (68.84422, 5.017042) (69.34673, 5.016484) (69.84925, 5.015944) (70.35176, 5.015421) (70.85427, 5.014916) (71.35678, 5.014428) (71.8593, 5.013955)
(72.36181, 5.013498) (72.86432, 5.013056) (73.36683, 5.012629) (73.86935, 5.012216) (74.37186, 5.011816) (74.87437, 5.011429) (75.37688, 5.011055) (75.8794, 5.010694)
(76.38191, 5.010344) (76.88442, 5.010006) (77.38693, 5.009679) (77.88945, 5.009362) (78.39196, 5.009056) (78.89447, 5.00876) (79.39698, 5.008474) (79.8995, 5.008197)
(80.40201, 5.007929) (80.90452, 5.00767) (81.40704, 5.00742) (81.90955, 5.007178) (82.41206, 5.006943) (82.91457, 5.006717) (83.41709, 5.006498) (83.9196, 5.006286)
(84.42211, 5.006081) (84.92462, 5.005882) (85.42714, 5.00569) (85.92965, 5.005505) (86.43216, 5.005325) (86.93467, 5.005152) (87.43719, 5.004984) (87.9397, 5.004822)
(88.44221, 5.004665) (88.94472, 5.004513) (89.44724, 5.004366) (89.94975, 5.004225) (90.45226, 5.004088) (90.95477, 5.003956) (91.45729, 5.003827) (91.9598, 5.003703)
(92.46231, 5.003583) (92.96482, 5.003467) (93.46734, 5.003355) (93.96985, 5.003246) (94.47236, 5.003141) (94.97487, 5.003039) (95.47739, 5.002941) (95.9799, 5.002846)
(96.48241, 5.002754) (96.98492, 5.002664) (97.48744, 5.002578) (97.98995, 5.002495) (98.49246, 5.002414) (98.99497, 5.002336) (99.49749, 5.00226) (100, 5.002187)
};
\end{axis}
\end{tikzpicture}
\caption{A rerun of the simulation shown in Figure~\ref{fig:FastReactionApproxEquilFast} but this time we slowed down the middle reaction so we no longer assume it is in equilibrium. Notice the concentration of A diverges from the expected solution so that the approximation is no longer valid. $k_1 = 1; k_2 = 0.5$. Curves from the top, T, B (equilibrium solution), B (true solution), A (equilibrium solution), B (true solution). Tellurium model in Listing~\ref{tellurium:chap:ODEsEquilibrium}.}
\label{fig:FastReactionApproxEquilSlow}
\end{figure}
```

#### Quasi-Steady-State Assumption

Another way to model fast reactions is to use the **quasi-steady-state assumption** instead of the equilibrium assumption. In this approximation we assume that the dynamics of A is fast compared to B. For example, the processes that affect A maybe faster than those that affect B. We can express the rate of change of A in Figure [Figure: Fast reaction sandwiched between two slower reactions](#fig-fastreaction)'s model:

$$ \frac{\dA}{\dt} = v_o - A k_1 + B k_2 $$

**Figure** <a id="fig-fastreactionapproxsteadystatefast"></a> `fig:FastReactionApproxSteadyStateFast`

*Caption:* Simulation of the model shown in Figure [Figure: Fast reaction sandwiched between two slower reactions](#fig-fastreaction) assuming the quasi-steady-state assumption for A. Note that the trajectories converge, a characteristic when using the steady state assumption. From the top, curves represent: B (quasi-steady-state solution), B (true solution), A (quasi-steady-state solution), A (true solution). $k_1 = 1000$, Tellurium model in Listing `tellurium:chap:ODEsQuasiSteadyState`.

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Variables},
xmin=0, xmax=100, ymin=0, ymax=20,
width=10cm,
height=6cm]
\addplot[color=red,line width=1.5pt] coordinates {
(0, 3.333333) (0.5025126, 3.471441) (1.005025, 3.604211) (1.507538, 3.732607) (2.01005, 3.856772) (2.512563, 3.976846) (3.015075, 4.092964) (3.517588, 4.205255)
(4.020101, 4.313847) (4.522613, 4.418862) (5.025126, 4.520416) (5.527638, 4.618625) (6.030151, 4.713598) (6.532663, 4.805442) (7.035176, 4.89426) (7.537688, 4.980152)
(8.040201, 5.063214) (8.542714, 5.143539) (9.045226, 5.221218) (9.547739, 5.296338) (10.05025, 5.368983) (10.55276, 5.439234) (11.05528, 5.507171) (11.55779, 5.572869)
(12.0603, 5.636403) (12.56281, 5.697843) (13.06533, 5.75726) (13.56784, 5.814719) (14.07035, 5.870285) (14.57286, 5.92402) (15.07538, 5.975984) (15.57789, 6.026237)
(16.0804, 6.074834) (16.58291, 6.12183) (17.08543, 6.167277) (17.58794, 6.211227) (18.09045, 6.253729) (18.59296, 6.294831) (19.09548, 6.334578) (19.59799, 6.373015)
(20.1005, 6.410185) (20.60302, 6.446134) (21.10553, 6.480898) (21.60804, 6.514517) (22.11055, 6.547028) (22.61307, 6.578467) (23.11558, 6.608871) (23.61809, 6.638273)
(24.1206, 6.666706) (24.62312, 6.694202) (25.12563, 6.720793) (25.62814, 6.746507) (26.13065, 6.771374) (26.63317, 6.795422) (27.13568, 6.818677) (27.63819, 6.841167)
(28.1407, 6.862915) (28.64322, 6.883947) (29.14573, 6.904286) (29.64824, 6.923954) (30.15075, 6.942975) (30.65327, 6.961369) (31.15578, 6.979157) (31.65829, 6.996359)
(32.1608, 7.012995) (32.66332, 7.029082) (33.16583, 7.044639) (33.66834, 7.059684) (34.17085, 7.074232) (34.67337, 7.088302) (35.17588, 7.101908) (35.67839, 7.115066)
(36.1809, 7.12779) (36.68342, 7.140096) (37.18593, 7.151995) (37.68844, 7.163503) (38.19095, 7.174632) (38.69347, 7.185393) (39.19598, 7.195801) (39.69849, 7.205865)
(40.20101, 7.215598) (40.70352, 7.225011) (41.20603, 7.234113) (41.70854, 7.242915) (42.21106, 7.251428) (42.71357, 7.25966) (43.21608, 7.26762) (43.71859, 7.275319)
(44.22111, 7.282764) (44.72362, 7.289963) (45.22613, 7.296926) (45.72864, 7.303659) (46.23116, 7.31017) (46.73367, 7.316467) (47.23618, 7.322556) (47.73869, 7.328445)
(48.24121, 7.33414) (48.74372, 7.339647) (49.24623, 7.344972) (49.74874, 7.350123) (50.25126, 7.355103) (50.75377, 7.35992) (51.25628, 7.364578) (51.75879, 7.369082)
(52.26131, 7.373438) (52.76382, 7.377651) (53.26633, 7.381725) (53.76884, 7.385665) (54.27136, 7.389475) (54.77387, 7.393159) (55.27638, 7.396722) (55.77889, 7.400168)
(56.28141, 7.4035) (56.78392, 7.406722) (57.28643, 7.409839) (57.78894, 7.412852) (58.29146, 7.415767) (58.79397, 7.418585) (59.29648, 7.421311) (59.79899, 7.423947)
(60.30151, 7.426496) (60.80402, 7.428961) (61.30653, 7.431345) (61.80905, 7.43365) (62.31156, 7.43588) (62.81407, 7.438036) (63.31658, 7.440121) (63.8191, 7.442137)
(64.32161, 7.444087) (64.82412, 7.445973) (65.32663, 7.447797) (65.82915, 7.449561) (66.33166, 7.451267) (66.83417, 7.452916) (67.33668, 7.454512) (67.8392, 7.456054)
(68.34171, 7.457546) (68.84422, 7.458989) (69.34673, 7.460385) (69.84925, 7.461734) (70.35176, 7.463039) (70.85427, 7.464301) (71.35678, 7.465522) (71.8593, 7.466703)
(72.36181, 7.467844) (72.86432, 7.468948) (73.36683, 7.470016) (73.86935, 7.471048) (74.37186, 7.472047) (74.87437, 7.473013) (75.37688, 7.473946) (75.8794, 7.474849)
(76.38191, 7.475723) (76.88442, 7.476567) (77.38693, 7.477384) (77.88945, 7.478174) (78.39196, 7.478938) (78.89447, 7.479677) (79.39698, 7.480392) (79.8995, 7.481083)
(80.40201, 7.481751) (80.90452, 7.482397) (81.40704, 7.483023) (81.90955, 7.483627) (82.41206, 7.484212) (82.91457, 7.484777) (83.41709, 7.485324) (83.9196, 7.485853)
(84.42211, 7.486365) (84.92462, 7.486859) (85.42714, 7.487338) (85.92965, 7.487801) (86.43216, 7.488248) (86.93467, 7.488681) (87.43719, 7.4891) (87.9397, 7.489505)
(88.44221, 7.489896) (88.94472, 7.490275) (89.44724, 7.490642) (89.94975, 7.490996) (90.45226, 7.491339) (90.95477, 7.49167) (91.45729, 7.491991) (91.9598, 7.492301)
(92.46231, 7.492601) (92.96482, 7.492891) (93.46734, 7.493172) (93.96985, 7.493443) (94.47236, 7.493706) (94.97487, 7.49396) (95.47739, 7.494205) (95.9799, 7.494442)
(96.48241, 7.49467) (96.98492, 7.494892) (97.48744, 7.495106) (97.98995, 7.495313) (98.49246, 7.495513) (98.99497, 7.495707) (99.49749, 7.495895) (100, 7.496077)
};
\addplot[color=blue,line width=1.5pt] coordinates {
(0, 6.66666) (0.5025126, 6.940419) (1.005025, 7.205942) (1.507538, 7.462716) (2.01005, 7.71103) (2.512563, 7.951162) (3.015075, 8.183381) (3.517588, 8.40795)
(4.020101, 8.62512) (4.522613, 8.835135) (5.025126, 9.03823) (5.527638, 9.234634) (6.030151, 9.424568) (6.532663, 9.608243) (7.035176, 9.785868) (7.537688, 9.95764)
(8.040201, 10.12375) (8.542714, 10.28439) (9.045226, 10.43974) (9.547739, 10.58997) (10.05025, 10.73525) (10.55276, 10.87574) (11.05528, 11.01161) (11.55779, 11.14299)
(12.0603, 11.27005) (12.56281, 11.39293) (13.06533, 11.51175) (13.56784, 11.62666) (14.07035, 11.73779) (14.57286, 11.84525) (15.07538, 11.94917) (15.57789, 12.04967)
(16.0804, 12.14686) (16.58291, 12.24084) (17.08543, 12.33173) (17.58794, 12.41963) (18.09045, 12.50462) (18.59296, 12.58682) (19.09548, 12.66631) (19.59799, 12.74318)
(20.1005, 12.81752) (20.60302, 12.88941) (21.10553, 12.95893) (21.60804, 13.02617) (22.11055, 13.09118) (22.61307, 13.15406) (23.11558, 13.21486) (23.61809, 13.27366)
(24.1206, 13.33052) (24.62312, 13.38551) (25.12563, 13.43869) (25.62814, 13.49011) (26.13065, 13.53985) (26.63317, 13.58794) (27.13568, 13.63445) (27.63819, 13.67942)
(28.1407, 13.72292) (28.64322, 13.76498) (29.14573, 13.80565) (29.64824, 13.84499) (30.15075, 13.88302) (30.65327, 13.91981) (31.15578, 13.95538) (31.65829, 13.98979)
(32.1608, 14.02305) (32.66332, 14.05523) (33.16583, 14.08634) (33.66834, 14.11643) (34.17085, 14.14552) (34.67337, 14.17366) (35.17588, 14.20087) (35.67839, 14.22718)
(36.1809, 14.25263) (36.68342, 14.27724) (37.18593, 14.30104) (37.68844, 14.32405) (38.19095, 14.34631) (38.69347, 14.36783) (39.19598, 14.38864) (39.69849, 14.40877)
(40.20101, 14.42823) (40.70352, 14.44706) (41.20603, 14.46526) (41.70854, 14.48287) (42.21106, 14.49989) (42.71357, 14.51635) (43.21608, 14.53227) (43.71859, 14.54767)
(44.22111, 14.56256) (44.72362, 14.57695) (45.22613, 14.59088) (45.72864, 14.60434) (46.23116, 14.61737) (46.73367, 14.62996) (47.23618, 14.64214) (47.73869, 14.65391)
(48.24121, 14.6653) (48.74372, 14.67631) (49.24623, 14.68697) (49.74874, 14.69727) (50.25126, 14.70723) (50.75377, 14.71686) (51.25628, 14.72617) (51.75879, 14.73518)
(52.26131, 14.74389) (52.76382, 14.75232) (53.26633, 14.76047) (53.76884, 14.76834) (54.27136, 14.77596) (54.77387, 14.78333) (55.27638, 14.79046) (55.77889, 14.79735)
(56.28141, 14.80401) (56.78392, 14.81046) (57.28643, 14.81669) (57.78894, 14.82272) (58.29146, 14.82855) (58.79397, 14.83418) (59.29648, 14.83963) (59.79899, 14.8449)
(60.30151, 14.85) (60.80402, 14.85493) (61.30653, 14.8597) (61.80905, 14.86431) (62.31156, 14.86877) (62.81407, 14.87308) (63.31658, 14.87725) (63.8191, 14.88128)
(64.32161, 14.88518) (64.82412, 14.88895) (65.32663, 14.8926) (65.82915, 14.89613) (66.33166, 14.89954) (66.83417, 14.90284) (67.33668, 14.90603) (67.8392, 14.90911)
(68.34171, 14.9121) (68.84422, 14.91498) (69.34673, 14.91777) (69.84925, 14.92047) (70.35176, 14.92308) (70.85427, 14.92561) (71.35678, 14.92805) (71.8593, 14.93041)
(72.36181, 14.93269) (72.86432, 14.9349) (73.36683, 14.93704) (73.86935, 14.9391) (74.37186, 14.9411) (74.87437, 14.94303) (75.37688, 14.9449) (75.8794, 14.9467)
(76.38191, 14.94845) (76.88442, 14.95014) (77.38693, 14.95177) (77.88945, 14.95335) (78.39196, 14.95488) (78.89447, 14.95636) (79.39698, 14.95779) (79.8995, 14.95917)
(80.40201, 14.9605) (80.90452, 14.9618) (81.40704, 14.96305) (81.90955, 14.96426) (82.41206, 14.96543) (82.91457, 14.96656) (83.41709, 14.96765) (83.9196, 14.96871)
(84.42211, 14.96973) (84.92462, 14.97072) (85.42714, 14.97168) (85.92965, 14.9726) (86.43216, 14.9735) (86.93467, 14.97436) (87.43719, 14.9752) (87.9397, 14.97601)
(88.44221, 14.97679) (88.94472, 14.97755) (89.44724, 14.97828) (89.94975, 14.97899) (90.45226, 14.97968) (90.95477, 14.98034) (91.45729, 14.98098) (91.9598, 14.9816)
(92.46231, 14.9822) (92.96482, 14.98278) (93.46734, 14.98334) (93.96985, 14.98389) (94.47236, 14.98441) (94.97487, 14.98492) (95.47739, 14.98541) (95.9799, 14.98588)
(96.48241, 14.98634) (96.98492, 14.98678) (97.48744, 14.98721) (97.98995, 14.98763) (98.49246, 14.98803) (98.99497, 14.98842) (99.49749, 14.98879) (100, 14.98915)
};
\addplot[color=green,line width=1.5pt] coordinates {
(0, 3.33483) (0.5025126, 3.53904) (1.005025, 3.733239) (1.507538, 3.917919) (2.01005, 4.093548) (2.512563, 4.260569) (3.015075, 4.4194) (3.517588, 4.570448)
(4.020101, 4.714092) (4.522613, 4.850697) (5.025126, 4.980606) (5.527638, 5.104148) (6.030151, 5.221636) (6.532663, 5.333365) (7.035176, 5.439619) (7.537688, 5.540665)
(8.040201, 5.636759) (8.542714, 5.728143) (9.045226, 5.815048) (9.547739, 5.897694) (10.05025, 5.976289) (10.55276, 6.051032) (11.05528, 6.122112) (11.55779, 6.189709)
(12.0603, 6.253992) (12.56281, 6.315125) (13.06533, 6.373263) (13.56784, 6.42855) (14.07035, 6.481129) (14.57286, 6.53113) (15.07538, 6.578681) (15.57789, 6.623901)
(16.0804, 6.666905) (16.58291, 6.707802) (17.08543, 6.746694) (17.58794, 6.78368) (18.09045, 6.818853) (18.59296, 6.852302) (19.09548, 6.884111) (19.59799, 6.914361)
(20.1005, 6.943128) (20.60302, 6.970489) (21.10553, 6.996509) (21.60804, 7.021253) (22.11055, 7.044784) (22.61307, 7.067162) (23.11558, 7.088443) (23.61809, 7.108681)
(24.1206, 7.127927) (24.62312, 7.14623) (25.12563, 7.163636) (25.62814, 7.180189) (26.13065, 7.19593) (26.63317, 7.210901) (27.13568, 7.225137) (27.63819, 7.238676)
(28.1407, 7.251551) (28.64322, 7.263796) (29.14573, 7.27544) (29.64824, 7.286514) (30.15075, 7.297045) (30.65327, 7.30706) (31.15578, 7.316584) (31.65829, 7.325642)
(32.1608, 7.334256) (32.66332, 7.342447) (33.16583, 7.350237) (33.66834, 7.357646) (34.17085, 7.364691) (34.67337, 7.371391) (35.17588, 7.377763) (35.67839, 7.383823)
(36.1809, 7.389586) (36.68342, 7.395066) (37.18593, 7.400278) (37.68844, 7.405235) (38.19095, 7.409948) (38.69347, 7.414431) (39.19598, 7.418694) (39.69849, 7.422749)
(40.20101, 7.426604) (40.70352, 7.430271) (41.20603, 7.433758) (41.70854, 7.437074) (42.21106, 7.440228) (42.71357, 7.443227) (43.21608, 7.44608) (43.71859, 7.448792)
(44.22111, 7.451372) (44.72362, 7.453826) (45.22613, 7.456159) (45.72864, 7.458378) (46.23116, 7.460488) (46.73367, 7.462495) (47.23618, 7.464403) (47.73869, 7.466218)
(48.24121, 7.467945) (48.74372, 7.469586) (49.24623, 7.471147) (49.74874, 7.472632) (50.25126, 7.474044) (50.75377, 7.475387) (51.25628, 7.476664) (51.75879, 7.477879)
(52.26131, 7.479034) (52.76382, 7.480133) (53.26633, 7.481178) (53.76884, 7.482171) (54.27136, 7.483116) (54.77387, 7.484015) (55.27638, 7.48487) (55.77889, 7.485683)
(56.28141, 7.486456) (56.78392, 7.487191) (57.28643, 7.48789) (57.78894, 7.488555) (58.29146, 7.489188) (58.79397, 7.489789) (59.29648, 7.490361) (59.79899, 7.490905)
(60.30151, 7.491423) (60.80402, 7.491915) (61.30653, 7.492383) (61.80905, 7.492828) (62.31156, 7.493251) (62.81407, 7.493654) (63.31658, 7.494037) (63.8191, 7.494401)
(64.32161, 7.494748) (64.82412, 7.495077) (65.32663, 7.495391) (65.82915, 7.495689) (66.33166, 7.495972) (66.83417, 7.496242) (67.33668, 7.496498) (67.8392, 7.496742)
(68.34171, 7.496974) (68.84422, 7.497195) (69.34673, 7.497405) (69.84925, 7.497604) (70.35176, 7.497794) (70.85427, 7.497975) (71.35678, 7.498146) (71.8593, 7.49831)
(72.36181, 7.498465) (72.86432, 7.498613) (73.36683, 7.498754) (73.86935, 7.498887) (74.37186, 7.499014) (74.87437, 7.499135) (75.37688, 7.49925) (75.8794, 7.49936)
(76.38191, 7.499464) (76.88442, 7.499563) (77.38693, 7.499657) (77.88945, 7.499747) (78.39196, 7.499832) (78.89447, 7.499913) (79.39698, 7.49999) (79.8995, 7.500063)
(80.40201, 7.500133) (80.90452, 7.500199) (81.40704, 7.500262) (81.90955, 7.500322) (82.41206, 7.50038) (82.91457, 7.500434) (83.41709, 7.500486) (83.9196, 7.500535)
(84.42211, 7.500582) (84.92462, 7.500626) (85.42714, 7.500668) (85.92965, 7.500709) (86.43216, 7.500747) (86.93467, 7.500783) (87.43719, 7.500818) (87.9397, 7.500851)
(88.44221, 7.500882) (88.94472, 7.500912) (89.44724, 7.500941) (89.94975, 7.500968) (90.45226, 7.500993) (90.95477, 7.501018) (91.45729, 7.501041) (91.9598, 7.501063)
(92.46231, 7.501084) (92.96482, 7.501104) (93.46734, 7.501124) (93.96985, 7.501142) (94.47236, 7.501159) (94.97487, 7.501175) (95.47739, 7.501191) (95.9799, 7.501206)
(96.48241, 7.50122) (96.98492, 7.501233) (97.48744, 7.501246) (97.98995, 7.501258) (98.49246, 7.50127) (98.99497, 7.501281) (99.49749, 7.501291) (100, 7.501301)
};
\addplot[color=purple,line width=1.5pt] coordinates {
(0, 6.66666) (0.5025126, 7.07508) (1.005025, 7.463477) (1.507538, 7.832838) (2.01005, 8.184096) (2.512563, 8.518137) (3.015075, 8.835801) (3.517588, 9.137896)
(4.020101, 9.425185) (4.522613, 9.698394) (5.025126, 9.958212) (5.527638, 10.2053) (6.030151, 10.44027) (6.532663, 10.66373) (7.035176, 10.87624) (7.537688, 11.07833)
(8.040201, 11.27052) (8.542714, 11.45329) (9.045226, 11.6271) (9.547739, 11.79239) (10.05025, 11.94958) (10.55276, 12.09906) (11.05528, 12.24122) (11.55779, 12.37642)
(12.0603, 12.50498) (12.56281, 12.62725) (13.06533, 12.74353) (13.56784, 12.8541) (14.07035, 12.95926) (14.57286, 13.05926) (15.07538, 13.15436) (15.57789, 13.2448)
(16.0804, 13.33081) (16.58291, 13.4126) (17.08543, 13.49039) (17.58794, 13.56436) (18.09045, 13.63471) (18.59296, 13.7016) (19.09548, 13.76522) (19.59799, 13.82572)
(20.1005, 13.88326) (20.60302, 13.93798) (21.10553, 13.99002) (21.60804, 14.03951) (22.11055, 14.08657) (22.61307, 14.13132) (23.11558, 14.17389) (23.61809, 14.21436)
(24.1206, 14.25285) (24.62312, 14.28946) (25.12563, 14.32427) (25.62814, 14.35738) (26.13065, 14.38886) (26.63317, 14.4188) (27.13568, 14.44727) (27.63819, 14.47435)
(28.1407, 14.5001) (28.64322, 14.52459) (29.14573, 14.54788) (29.64824, 14.57003) (30.15075, 14.59109) (30.65327, 14.61112) (31.15578, 14.63017) (31.65829, 14.64828)
(32.1608, 14.66551) (32.66332, 14.68189) (33.16583, 14.69747) (33.66834, 14.71229) (34.17085, 14.72638) (34.67337, 14.73978) (35.17588, 14.75253) (35.67839, 14.76465)
(36.1809, 14.77617) (36.68342, 14.78713) (37.18593, 14.79756) (37.68844, 14.80747) (38.19095, 14.8169) (38.69347, 14.82586) (39.19598, 14.83439) (39.69849, 14.8425)
(40.20101, 14.85021) (40.70352, 14.85754) (41.20603, 14.86452) (41.70854, 14.87115) (42.21106, 14.87746) (42.71357, 14.88345) (43.21608, 14.88916) (43.71859, 14.89458)
(44.22111, 14.89974) (44.72362, 14.90465) (45.22613, 14.90932) (45.72864, 14.91376) (46.23116, 14.91798) (46.73367, 14.92199) (47.23618, 14.92581) (47.73869, 14.92944)
(48.24121, 14.93289) (48.74372, 14.93617) (49.24623, 14.93929) (49.74874, 14.94226) (50.25126, 14.94509) (50.75377, 14.94777) (51.25628, 14.95033) (51.75879, 14.95276)
(52.26131, 14.95507) (52.76382, 14.95727) (53.26633, 14.95936) (53.76884, 14.96134) (54.27136, 14.96323) (54.77387, 14.96503) (55.27638, 14.96674) (55.77889, 14.96837)
(56.28141, 14.96991) (56.78392, 14.97138) (57.28643, 14.97278) (57.78894, 14.97411) (58.29146, 14.97538) (58.79397, 14.97658) (59.29648, 14.97772) (59.79899, 14.97881)
(60.30151, 14.97985) (60.80402, 14.98083) (61.30653, 14.98177) (61.80905, 14.98266) (62.31156, 14.9835) (62.81407, 14.98431) (63.31658, 14.98507) (63.8191, 14.9858)
(64.32161, 14.9865) (64.82412, 14.98715) (65.32663, 14.98778) (65.82915, 14.98838) (66.33166, 14.98894) (66.83417, 14.98948) (67.33668, 14.99) (67.8392, 14.99048)
(68.34171, 14.99095) (68.84422, 14.99139) (69.34673, 14.99181) (69.84925, 14.99221) (70.35176, 14.99259) (70.85427, 14.99295) (71.35678, 14.99329) (71.8593, 14.99362)
(72.36181, 14.99393) (72.86432, 14.99423) (73.36683, 14.99451) (73.86935, 14.99477) (74.37186, 14.99503) (74.87437, 14.99527) (75.37688, 14.9955) (75.8794, 14.99572)
(76.38191, 14.99593) (76.88442, 14.99613) (77.38693, 14.99631) (77.88945, 14.99649) (78.39196, 14.99666) (78.89447, 14.99683) (79.39698, 14.99698) (79.8995, 14.99713)
(80.40201, 14.99727) (80.90452, 14.9974) (81.40704, 14.99752) (81.90955, 14.99764) (82.41206, 14.99776) (82.91457, 14.99787) (83.41709, 14.99797) (83.9196, 14.99807)
(84.42211, 14.99816) (84.92462, 14.99825) (85.42714, 14.99834) (85.92965, 14.99842) (86.43216, 14.99849) (86.93467, 14.99857) (87.43719, 14.99864) (87.9397, 14.9987)
(88.44221, 14.99876) (88.94472, 14.99882) (89.44724, 14.99888) (89.94975, 14.99894) (90.45226, 14.99899) (90.95477, 14.99904) (91.45729, 14.99908) (91.9598, 14.99913)
(92.46231, 14.99917) (92.96482, 14.99921) (93.46734, 14.99925) (93.96985, 14.99928) (94.47236, 14.99932) (94.97487, 14.99935) (95.47739, 14.99938) (95.9799, 14.99941)
(96.48241, 14.99944) (96.98492, 14.99947) (97.48744, 14.99949) (97.98995, 14.99952) (98.49246, 14.99954) (98.99497, 14.99956) (99.49749, 14.99958) (100, 14.9996)
};
\end{axis}
\end{tikzpicture}
\caption{Simulation of the model shown in Figure~\ref{fig:FastReaction} assuming the quasi-steady-state assumption for A. Note that the trajectories converge, a characteristic when using the steady state assumption. From the top, curves represent: B (quasi-steady-state solution), B (true solution), A (quasi-steady-state solution), A (true solution). $k_1 = 1000$, Tellurium model in Listing~\ref{tellurium:chap:ODEsQuasiSteadyState}.}
\label{fig:FastReactionApproxSteadyStateFast}
\end{figure}
```

**Figure** <a id="fig-fastreactionapproxsteadystateslow"></a> `fig:FastReactionApproxSteadyStateSlow`

*Caption:* Same simulation as in Figure [Figure: Simulation of the model shown in Figure \ref{fig:FastReaction} assumin](#fig-fastreactionapproxsteadystatefast) except that the reactions surrounding A are too slow to assume a quasi-steady-state approximation. In this case we see considerable divergence in the transients but still see correct convergence at steady state. From the top, curves represent: A (quasi-steady-state solution), B (quasi-steady-state  solution), B (true solution), A (true solution). $k_1 = 0.1$, note that $k_2 = k_1/K_{eq}$, Tellurium model in Listing `tellurium:chap:ODEsQuasiSteadyState`.

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Variables},
xmin=0, xmax=100, ymin=0, ymax=30,
width=10cm,
height=6cm]
\addplot[color=red,line width=1.5pt] coordinates {
(0, 3.333333) (0.5025126, 4.064604) (1.005025, 4.753278) (1.507538, 5.402752) (2.01005, 6.01611) (2.512563, 6.596165) (3.015075, 7.145471) (3.517588, 7.666357)
(4.020101, 8.160942) (4.522613, 8.631155) (5.025126, 9.07876) (5.527638, 9.505363) (6.030151, 9.912432) (6.532663, 10.30131) (7.035176, 10.67321) (7.537688, 11.02927)
(8.040201, 11.37051) (8.542714, 11.69786) (9.045226, 12.01219) (9.547739, 12.31429) (10.05025, 12.6049) (10.55276, 12.88466) (11.05528, 13.15421) (11.55779, 13.41411)
(12.0603, 13.66488) (12.56281, 13.907) (13.06533, 14.14092) (13.56784, 14.36706) (14.07035, 14.58579) (14.57286, 14.79747) (15.07538, 15.00244) (15.57789, 15.201)
(16.0804, 15.39342) (16.58291, 15.57999) (17.08543, 15.76095) (17.58794, 15.93654) (18.09045, 16.10696) (18.59296, 16.27243) (19.09548, 16.43314) (19.59799, 16.58927)
(20.1005, 16.74098) (20.60302, 16.88845) (21.10553, 17.03182) (21.60804, 17.17123) (22.11055, 17.30683) (22.61307, 17.43874) (23.11558, 17.56708) (23.61809, 17.69197)
(24.1206, 17.81353) (24.62312, 17.93185) (25.12563, 18.04705) (25.62814, 18.1592) (26.13065, 18.26841) (26.63317, 18.37477) (27.13568, 18.47836) (27.63819, 18.57925)
(28.1407, 18.67754) (28.64322, 18.77329) (29.14573, 18.86657) (29.64824, 18.95746) (30.15075, 19.04603) (30.65327, 19.13233) (31.15578, 19.21643) (31.65829, 19.29839)
(32.1608, 19.37827) (32.66332, 19.45612) (33.16583, 19.53201) (33.66834, 19.60597) (34.17085, 19.67807) (34.67337, 19.74834) (35.17588, 19.81685) (35.67839, 19.88364)
(36.1809, 19.94874) (36.68342, 20.01221) (37.18593, 20.07409) (37.68844, 20.13442) (38.19095, 20.19323) (38.69347, 20.25058) (39.19598, 20.30649) (39.69849, 20.361)
(40.20101, 20.41414) (40.70352, 20.46596) (41.20603, 20.51649) (41.70854, 20.56576) (42.21106, 20.61379) (42.71357, 20.66063) (43.21608, 20.70631) (43.71859, 20.75084)
(44.22111, 20.79426) (44.72362, 20.83661) (45.22613, 20.87789) (45.72864, 20.91816) (46.23116, 20.95741) (46.73367, 20.9957) (47.23618, 21.03303) (47.73869, 21.06943)
(48.24121, 21.10493) (48.74372, 21.13954) (49.24623, 21.17329) (49.74874, 21.20621) (50.25126, 21.23831) (50.75377, 21.26961) (51.25628, 21.30013) (51.75879, 21.32989)
(52.26131, 21.35891) (52.76382, 21.38722) (53.26633, 21.41482) (53.76884, 21.44173) (54.27136, 21.46798) (54.77387, 21.49357) (55.27638, 21.51853) (55.77889, 21.54287)
(56.28141, 21.56661) (56.78392, 21.58975) (57.28643, 21.61232) (57.78894, 21.63434) (58.29146, 21.6558) (58.79397, 21.67673) (59.29648, 21.69714) (59.79899, 21.71705)
(60.30151, 21.73646) (60.80402, 21.75539) (61.30653, 21.77385) (61.80905, 21.79185) (62.31156, 21.80941) (62.81407, 21.82653) (63.31658, 21.84322) (63.8191, 21.8595)
(64.32161, 21.87538) (64.82412, 21.89086) (65.32663, 21.90596) (65.82915, 21.92068) (66.33166, 21.93504) (66.83417, 21.94905) (67.33668, 21.9627) (67.8392, 21.97602)
(68.34171, 21.989) (68.84422, 22.00167) (69.34673, 22.01401) (69.84925, 22.02606) (70.35176, 22.0378) (70.85427, 22.04925) (71.35678, 22.06042) (71.8593, 22.07131)
(72.36181, 22.08194) (72.86432, 22.09229) (73.36683, 22.10239) (73.86935, 22.11224) (74.37186, 22.12185) (74.87437, 22.13122) (75.37688, 22.14035) (75.8794, 22.14926)
(76.38191, 22.15795) (76.88442, 22.16642) (77.38693, 22.17468) (77.88945, 22.18274) (78.39196, 22.1906) (78.89447, 22.19826) (79.39698, 22.20573) (79.8995, 22.21302)
(80.40201, 22.22013) (80.90452, 22.22706) (81.40704, 22.23381) (81.90955, 22.2404) (82.41206, 22.24683) (82.91457, 22.2531) (83.41709, 22.25921) (83.9196, 22.26517)
(84.42211, 22.27098) (84.92462, 22.27665) (85.42714, 22.28218) (85.92965, 22.28757) (86.43216, 22.29283) (86.93467, 22.29796) (87.43719, 22.30296) (87.9397, 22.30783)
(88.44221, 22.31259) (88.94472, 22.31723) (89.44724, 22.32175) (89.94975, 22.32616) (90.45226, 22.33046) (90.95477, 22.33465) (91.45729, 22.33875) (91.9598, 22.34273)
(92.46231, 22.34662) (92.96482, 22.35042) (93.46734, 22.35412) (93.96985, 22.35773) (94.47236, 22.36124) (94.97487, 22.36467) (95.47739, 22.36802) (95.9799, 22.37128)
(96.48241, 22.37447) (96.98492, 22.37757) (97.48744, 22.38059) (97.98995, 22.38355) (98.49246, 22.38642) (98.99497, 22.38923) (99.49749, 22.39197) (100, 22.39464)
};
\addplot[color=blue,line width=1.5pt] coordinates {
(0, 6.66666) (0.5025126, 6.36204) (1.005025, 6.11388) (1.507538, 5.916102) (2.01005, 5.763232) (2.512563, 5.650323) (3.015075, 5.572927) (3.517588, 5.527032)
(4.020101, 5.509029) (4.522613, 5.51567) (5.025126, 5.544029) (5.527638, 5.591474) (6.030151, 5.655639) (6.532663, 5.734397) (7.035176, 5.825838) (7.537688, 5.92825)
(8.040201, 6.040096) (8.542714, 6.159997) (9.045226, 6.286716) (9.547739, 6.419148) (10.05025, 6.556303) (10.55276, 6.697298) (11.05528, 6.841345) (11.55779, 6.987742)
(12.0603, 7.135864) (12.56281, 7.285155) (13.06533, 7.435126) (13.56784, 7.585338) (14.07035, 7.735403) (14.57286, 7.884986) (15.07538, 8.033788) (15.57789, 8.181548)
(16.0804, 8.328039) (16.58291, 8.473063) (17.08543, 8.616448) (17.58794, 8.758049) (18.09045, 8.89774) (18.59296, 9.035415) (19.09548, 9.170986) (19.59799, 9.304379)
(20.1005, 9.435534) (20.60302, 9.564406) (21.10553, 9.690957) (21.60804, 9.815161) (22.11055, 9.937001) (22.61307, 10.05647) (23.11558, 10.17356) (23.61809, 10.28827)
(24.1206, 10.40063) (24.62312, 10.51062) (25.12563, 10.61829) (25.62814, 10.72363) (26.13065, 10.82669) (26.63317, 10.92747) (27.13568, 11.02602) (27.63819, 11.12236)
(28.1407, 11.21653) (28.64322, 11.30855) (29.14573, 11.39847) (29.64824, 11.48631) (30.15075, 11.57212) (30.65327, 11.65593) (31.15578, 11.73777) (31.65829, 11.81769)
(32.1608, 11.89573) (32.66332, 11.97191) (33.16583, 12.04629) (33.66834, 12.11889) (34.17085, 12.18975) (34.67337, 12.25891) (35.17588, 12.32641) (35.67839, 12.39228)
(36.1809, 12.45656) (36.68342, 12.51928) (37.18593, 12.58049) (37.68844, 12.6402) (38.19095, 12.69847) (38.69347, 12.75531) (39.19598, 12.81077) (39.69849, 12.86487)
(40.20101, 12.91765) (40.70352, 12.96913) (41.20603, 13.01936) (41.70854, 13.06835) (42.21106, 13.11614) (42.71357, 13.16275) (43.21608, 13.20822) (43.71859, 13.25257)
(44.22111, 13.29583) (44.72362, 13.33802) (45.22613, 13.37918) (45.72864, 13.41932) (46.23116, 13.45847) (46.73367, 13.49665) (47.23618, 13.53389) (47.73869, 13.57021)
(48.24121, 13.60563) (48.74372, 13.64018) (49.24623, 13.67387) (49.74874, 13.70673) (50.25126, 13.73878) (50.75377, 13.77003) (51.25628, 13.80051) (51.75879, 13.83024)
(52.26131, 13.85923) (52.76382, 13.8875) (53.26633, 13.91508) (53.76884, 13.94197) (54.27136, 13.96819) (54.77387, 13.99376) (55.27638, 14.01871) (55.77889, 14.04303)
(56.28141, 14.06675) (56.78392, 14.08988) (57.28643, 14.11244) (57.78894, 14.13444) (58.29146, 14.1559) (58.79397, 14.17682) (59.29648, 14.19722) (59.79899, 14.21712)
(60.30151, 14.23653) (60.80402, 14.25545) (61.30653, 14.2739) (61.80905, 14.2919) (62.31156, 14.30945) (62.81407, 14.32657) (63.31658, 14.34326) (63.8191, 14.35954)
(64.32161, 14.37541) (64.82412, 14.39089) (65.32663, 14.40598) (65.82915, 14.42071) (66.33166, 14.43506) (66.83417, 14.44906) (67.33668, 14.46272) (67.8392, 14.47603)
(68.34171, 14.48901) (68.84422, 14.50168) (69.34673, 14.51403) (69.84925, 14.52607) (70.35176, 14.53781) (70.85427, 14.54926) (71.35678, 14.56043) (71.8593, 14.57132)
(72.36181, 14.58194) (72.86432, 14.5923) (73.36683, 14.6024) (73.86935, 14.61225) (74.37186, 14.62185) (74.87437, 14.63122) (75.37688, 14.64036) (75.8794, 14.64926)
(76.38191, 14.65795) (76.88442, 14.66642) (77.38693, 14.67469) (77.88945, 14.68274) (78.39196, 14.6906) (78.89447, 14.69826) (79.39698, 14.70573) (79.8995, 14.71302)
(80.40201, 14.72013) (80.90452, 14.72706) (81.40704, 14.73381) (81.90955, 14.7404) (82.41206, 14.74683) (82.91457, 14.7531) (83.41709, 14.75921) (83.9196, 14.76517)
(84.42211, 14.77099) (84.92462, 14.77665) (85.42714, 14.78218) (85.92965, 14.78757) (86.43216, 14.79283) (86.93467, 14.79796) (87.43719, 14.80296) (87.9397, 14.80783)
(88.44221, 14.81259) (88.94472, 14.81723) (89.44724, 14.82175) (89.94975, 14.82616) (90.45226, 14.83046) (90.95477, 14.83465) (91.45729, 14.83875) (91.9598, 14.84273)
(92.46231, 14.84662) (92.96482, 14.85042) (93.46734, 14.85412) (93.96985, 14.85773) (94.47236, 14.86124) (94.97487, 14.86467) (95.47739, 14.86802) (95.9799, 14.87128)
(96.48241, 14.87447) (96.98492, 14.87757) (97.48744, 14.88059) (97.98995, 14.88355) (98.49246, 14.88642) (98.99497, 14.88923) (99.49749, 14.89197) (100, 14.89464)
};
\addplot[color=green,line width=1.5pt] coordinates {
(0, 18.33333) (0.5025126, 18.53754) (1.005025, 18.73174) (1.507538, 18.91642) (2.01005, 19.09205) (2.512563, 19.25907) (3.015075, 19.41791) (3.517588, 19.56896)
(4.020101, 19.71261) (4.522613, 19.84921) (5.025126, 19.97913) (5.527638, 20.10267) (6.030151, 20.22016) (6.532663, 20.3319) (7.035176, 20.43815) (7.537688, 20.5392)
(8.040201, 20.6353) (8.542714, 20.72668) (9.045226, 20.81359) (9.547739, 20.89624) (10.05025, 20.97483) (10.55276, 21.04958) (11.05528, 21.12066) (11.55779, 21.18825)
(12.0603, 21.25253) (12.56281, 21.31367) (13.06533, 21.3718) (13.56784, 21.42709) (14.07035, 21.47966) (14.57286, 21.52966) (15.07538, 21.57721) (15.57789, 21.62243)
(16.0804, 21.66543) (16.58291, 21.70633) (17.08543, 21.74522) (17.58794, 21.7822) (18.09045, 21.81737) (18.59296, 21.85082) (19.09548, 21.88263) (19.59799, 21.91288)
(20.1005, 21.94165) (20.60302, 21.96901) (21.10553, 21.99502) (21.60804, 22.01977) (22.11055, 22.0433) (22.61307, 22.06567) (23.11558, 22.08695) (23.61809, 22.10719)
(24.1206, 22.12644) (24.62312, 22.14474) (25.12563, 22.16215) (25.62814, 22.1787) (26.13065, 22.19445) (26.63317, 22.20942) (27.13568, 22.22366) (27.63819, 22.2372)
(28.1407, 22.25007) (28.64322, 22.26232) (29.14573, 22.27396) (29.64824, 22.28504) (30.15075, 22.29557) (30.65327, 22.30558) (31.15578, 22.31511) (31.65829, 22.32417)
(32.1608, 22.33278) (32.66332, 22.34097) (33.16583, 22.34876) (33.66834, 22.35617) (34.17085, 22.36322) (34.67337, 22.36992) (35.17588, 22.37629) (35.67839, 22.38235)
(36.1809, 22.38811) (36.68342, 22.39359) (37.18593, 22.39881) (37.68844, 22.40376) (38.19095, 22.40848) (38.69347, 22.41296) (39.19598, 22.41722) (39.69849, 22.42128)
(40.20101, 22.42513) (40.70352, 22.4288) (41.20603, 22.43229) (41.70854, 22.4356) (42.21106, 22.43876) (42.71357, 22.44176) (43.21608, 22.44461) (43.71859, 22.44732)
(44.22111, 22.4499) (44.72362, 22.45235) (45.22613, 22.45469) (45.72864, 22.45691) (46.23116, 22.45902) (46.73367, 22.46102) (47.23618, 22.46293) (47.73869, 22.46475)
(48.24121, 22.46647) (48.74372, 22.46811) (49.24623, 22.46968) (49.74874, 22.47116) (50.25126, 22.47257) (50.75377, 22.47391) (51.25628, 22.47519) (51.75879, 22.47641)
(52.26131, 22.47756) (52.76382, 22.47866) (53.26633, 22.4797) (53.76884, 22.4807) (54.27136, 22.48164) (54.77387, 22.48254) (55.27638, 22.4834) (55.77889, 22.48421)
(56.28141, 22.48498) (56.78392, 22.48572) (57.28643, 22.48642) (57.78894, 22.48708) (58.29146, 22.48771) (58.79397, 22.48831) (59.29648, 22.48889) (59.79899, 22.48943)
(60.30151, 22.48995) (60.80402, 22.49044) (61.30653, 22.49091) (61.80905, 22.49135) (62.31156, 22.49177) (62.81407, 22.49218) (63.31658, 22.49256) (63.8191, 22.49292)
(64.32161, 22.49327) (64.82412, 22.4936) (65.32663, 22.49391) (65.82915, 22.49421) (66.33166, 22.49449) (66.83417, 22.49476) (67.33668, 22.49502) (67.8392, 22.49526)
(68.34171, 22.49549) (68.84422, 22.49571) (69.34673, 22.49592) (69.84925, 22.49612) (70.35176, 22.49631) (70.85427, 22.49649) (71.35678, 22.49666) (71.8593, 22.49683)
(72.36181, 22.49698) (72.86432, 22.49713) (73.36683, 22.49727) (73.86935, 22.4974) (74.37186, 22.49753) (74.87437, 22.49765) (75.37688, 22.49777) (75.8794, 22.49787)
(76.38191, 22.49798) (76.88442, 22.49808) (77.38693, 22.49817) (77.88945, 22.49826) (78.39196, 22.49835) (78.89447, 22.49843) (79.39698, 22.4985) (79.8995, 22.49858)
(80.40201, 22.49865) (80.90452, 22.49871) (81.40704, 22.49877) (81.90955, 22.49883) (82.41206, 22.49889) (82.91457, 22.49895) (83.41709, 22.499) (83.9196, 22.49905)
(84.42211, 22.49909) (84.92462, 22.49914) (85.42714, 22.49918) (85.92965, 22.49922) (86.43216, 22.49926) (86.93467, 22.49929) (87.43719, 22.49933) (87.9397, 22.49936)
(88.44221, 22.49939) (88.94472, 22.49942) (89.44724, 22.49945) (89.94975, 22.49948) (90.45226, 22.4995) (90.95477, 22.49953) (91.45729, 22.49955) (91.9598, 22.49957)
(92.46231, 22.49959) (92.96482, 22.49961) (93.46734, 22.49963) (93.96985, 22.49965) (94.47236, 22.49967) (94.97487, 22.49968) (95.47739, 22.4997) (95.9799, 22.49971)
(96.48241, 22.49973) (96.98492, 22.49974) (97.48744, 22.49975) (97.98995, 22.49976) (98.49246, 22.49978) (98.99497, 22.49979) (99.49749, 22.4998) (100, 22.49981)
};
\addplot[color=purple,line width=1.5pt] coordinates {
(0, 6.66666) (0.5025126, 7.075076) (1.005025, 7.463474) (1.507538, 7.832837) (2.01005, 8.184095) (2.512563, 8.518139) (3.015075, 8.835812) (3.517588, 9.137915)
(4.020101, 9.425212) (4.522613, 9.698429) (5.025126, 9.958255) (5.527638, 10.20535) (6.030151, 10.44033) (6.532663, 10.66379) (7.035176, 10.87631) (7.537688, 11.0784)
(8.040201, 11.2706) (8.542714, 11.45337) (9.045226, 11.62718) (9.547739, 11.79247) (10.05025, 11.94966) (10.55276, 12.09915) (11.05528, 12.24131) (11.55779, 12.3765)
(12.0603, 12.50507) (12.56281, 12.62733) (13.06533, 12.7436) (13.56784, 12.85417) (14.07035, 12.95932) (14.57286, 13.05932) (15.07538, 13.15442) (15.57789, 13.24486)
(16.0804, 13.33086) (16.58291, 13.41265) (17.08543, 13.49043) (17.58794, 13.5644) (18.09045, 13.63475) (18.59296, 13.70164) (19.09548, 13.76526) (19.59799, 13.82576)
(20.1005, 13.8833) (20.60302, 13.93801) (21.10553, 13.99005) (21.60804, 14.03953) (22.11055, 14.08659) (22.61307, 14.13135) (23.11558, 14.17391) (23.61809, 14.21438)
(24.1206, 14.25288) (24.62312, 14.28949) (25.12563, 14.3243) (25.62814, 14.35741) (26.13065, 14.38889) (26.63317, 14.41884) (27.13568, 14.44731) (27.63819, 14.47439)
(28.1407, 14.50014) (28.64322, 14.52463) (29.14573, 14.54792) (29.64824, 14.57007) (30.15075, 14.59114) (30.65327, 14.61117) (31.15578, 14.63022) (31.65829, 14.64833)
(32.1608, 14.66556) (32.66332, 14.68194) (33.16583, 14.69753) (33.66834, 14.71234) (34.17085, 14.72644) (34.67337, 14.73984) (35.17588, 14.75258) (35.67839, 14.7647)
(36.1809, 14.77623) (36.68342, 14.78719) (37.18593, 14.79761) (37.68844, 14.80753) (38.19095, 14.81695) (38.69347, 14.82592) (39.19598, 14.83445) (39.69849, 14.84256)
(40.20101, 14.85027) (40.70352, 14.8576) (41.20603, 14.86457) (41.70854, 14.87121) (42.21106, 14.87752) (42.71357, 14.88351) (43.21608, 14.88922) (43.71859, 14.89464)
(44.22111, 14.8998) (44.72362, 14.90471) (45.22613, 14.90938) (45.72864, 14.91381) (46.23116, 14.91803) (46.73367, 14.92205) (47.23618, 14.92586) (47.73869, 14.92949)
(48.24121, 14.93295) (48.74372, 14.93623) (49.24623, 14.93935) (49.74874, 14.94232) (50.25126, 14.94514) (50.75377, 14.94783) (51.25628, 14.95038) (51.75879, 14.95281)
(52.26131, 14.95512) (52.76382, 14.95732) (53.26633, 14.95941) (53.76884, 14.9614) (54.27136, 14.96329) (54.77387, 14.96508) (55.27638, 14.96679) (55.77889, 14.96842)
(56.28141, 14.96996) (56.78392, 14.97143) (57.28643, 14.97283) (57.78894, 14.97416) (58.29146, 14.97542) (58.79397, 14.97663) (59.29648, 14.97777) (59.79899, 14.97886)
(60.30151, 14.97989) (60.80402, 14.98088) (61.30653, 14.98181) (61.80905, 14.9827) (62.31156, 14.98355) (62.81407, 14.98435) (63.31658, 14.98512) (63.8191, 14.98585)
(64.32161, 14.98654) (64.82412, 14.9872) (65.32663, 14.98782) (65.82915, 14.98842) (66.33166, 14.98898) (66.83417, 14.98952) (67.33668, 14.99004) (67.8392, 14.99052)
(68.34171, 14.99099) (68.84422, 14.99143) (69.34673, 14.99185) (69.84925, 14.99224) (70.35176, 14.99262) (70.85427, 14.99298) (71.35678, 14.99333) (71.8593, 14.99365)
(72.36181, 14.99396) (72.86432, 14.99426) (73.36683, 14.99454) (73.86935, 14.99481) (74.37186, 14.99506) (74.87437, 14.9953) (75.37688, 14.99553) (75.8794, 14.99575)
(76.38191, 14.99596) (76.88442, 14.99615) (77.38693, 14.99634) (77.88945, 14.99652) (78.39196, 14.99669) (78.89447, 14.99685) (79.39698, 14.99701) (79.8995, 14.99715)
(80.40201, 14.99729) (80.90452, 14.99742) (81.40704, 14.99755) (81.90955, 14.99767) (82.41206, 14.99778) (82.91457, 14.99789) (83.41709, 14.99799) (83.9196, 14.99809)
(84.42211, 14.99818) (84.92462, 14.99827) (85.42714, 14.99836) (85.92965, 14.99844) (86.43216, 14.99851) (86.93467, 14.99859) (87.43719, 14.99865) (87.9397, 14.99872)
(88.44221, 14.99878) (88.94472, 14.99884) (89.44724, 14.9989) (89.94975, 14.99895) (90.45226, 14.999) (90.95477, 14.99905) (91.45729, 14.9991) (91.9598, 14.99914)
(92.46231, 14.99918) (92.96482, 14.99922) (93.46734, 14.99926) (93.96985, 14.9993) (94.47236, 14.99933) (94.97487, 14.99936) (95.47739, 14.9994) (95.9799, 14.99942)
(96.48241, 14.99945) (96.98492, 14.99948) (97.48744, 14.9995) (97.98995, 14.99953) (98.49246, 14.99955) (98.99497, 14.99957) (99.49749, 14.99959) (100, 14.99961)
};
\end{axis}
\end{tikzpicture}
\caption{Same simulation as in Figure~\ref{fig:FastReactionApproxSteadyStateFast} except that the reactions surrounding A are too slow to assume a quasi-steady-state approximation. In this case we see considerable divergence in the transients but still see correct convergence at steady state. From the top, curves represent: A (quasi-steady-state solution), B (quasi-steady-state  solution), B (true solution), A (true solution). $k_1 = 0.1$, note that $k_2 = k_1/K_{eq}$, Tellurium model in Listing~\ref{tellurium:chap:ODEsQuasiSteadyState}.}
\label{fig:FastReactionApproxSteadyStateSlow}
\end{figure}
```

```python
import tellurium as te
import pylab

# Comparing the full model with an approximation
# based on the quasi-steady-state assumption
r = te.loada ('''
    Ass := (vo + k2*B)/k1;
    $s -> B; vo - k3*B
    $s -> Af; vo;

    Af -> Bf; k1*Af - k2*Bf;
    Bf -> $w; k3*Bf;

    B = 6.66666;
    Af = 3.33333; Bf = 6.66666;
    vo = 1.5;
    k3 = 0.1;
    // Use k1 = 1000 to obtain a better approximation
    k1 = 0.1;
    Keq = 2;
    k2 = k1/Keq;
''')

result = r.simulate(0, 100, 200, ["time", "Af", "Bf", "Ass", "B"])
r.plot(ylim=(0,30), xlim=(0,100))
```

Let us assume that A reaches steady state much faster than B such that we can set the equation $\dA/\dt$ to zero and solve for A. We call this assumption the **quasi-steady state assumption**. (footnote: Those familiar with Michaelis-Menten kinetics will have seen this approximation used in deriving the Briggs-Haldane relationship.} The steady state solution to A is:

$$ A_{ss} = \frac{v_o + k_2 B}{k_1} $$

Given that the rate of change of B is:

$$ \frac{\dB}{\dt} = A k_1 - B k_2 - B k_3 $$

we can rewrite this equation by inserting the steady state concentration, $A_{ss}$ to obtain:

$$ \frac{\dB}{\dt} = \frac{v_o + k_2 B}{k_1} k_1  - B k_2 - B k_3 $$

which upon simplification reduces to the remarkably simpler solution:

$$ \frac{\dB}{\dt} = v_o - k_2 B $$

To model this system we need to solve the two equations:

$$
\begin{align*}
A_{ss} = \frac{v_o + k_2 B}{k_1} \\[5pt]
\frac{\dB}{\dt} = v_o - k_2 B
\end{align*}
$$

In Figure [Figure: Simulation of the model shown in Figure \ref{fig:FastReaction} assumin](#fig-fastreactionapproxsteadystatefast) where the reactions are fast enough that the quasi-steady state assumption is reasonable, we see that both simulations follow each other closely. In contrast, Figure [Figure: Same simulation as in Figure \ref{fig:FastReactionApproxSteadyStateFas](#fig-fastreactionapproxsteadystateslow) shows that when the reaction reactions are too slow, the quasi-steady state assumption breaks down and both simulations diverge quite considerably. In both cases however, all trajectories coverage to the *same* steady state. This highlights one of the characteristics of the quasi-steady state assumption; the steady state is faithfully reproduced when assuming quasi-steady-state. This also suggests that using Michaelis-Menten like kinetics when the quasi-steady-state assumption is applied is reasonable, especially if the modeler is only interested in the final steady state.

## Further Reading

The two most popular books on numerical analysis are by Press and Burden and are included here for reference. Both books can be purchased second-hand at reasonable prices. The content in the Press book has not changed significantly between editions so any edition is useful. The main problem with the Press book is that the source code has very strict licensing rules making the code difficult to reuse for projects. However, the book is excellent at explaining how various algorithms work and for this reason alone it is worth purchasing.

- Burden and Faires (2010) Numerical Analysis. Brooks Cole, 9th Edition. ISBN-10: 0538733519

- Ingalls B (2013) Mathematical Modeling in Systems Biology: An Introduction, MIT Press. ISBN: 978-0262018883

- Pahle (2009) J Biochemical simulations: stochastic, approximate stochastic and hybrid approaches. Briefings in Bioinformatics 10(1), 53-64

- Reich, J.G. & Sel'kov, E.E. (1981) Energy metabolism of the cell. A theoretical treatise. Academic Press, London, ISBN-13: 978-0125859202

- Press, Teulolsky, Vetterling and Flannery (2007) Numerical Recipes. Cambridge University Press, 3rd Edition
ISBN-10: 0521880688

- Sauro, HM, and Bergmann FT (2009) Software Tools for Systems Biology in Systems Biomedicine: Concepts and Perspectives, edited by Edison T. Liu, Douglas A. Lauffenburger. ISBN 978-0-12-372550-9

For the budget conscious buyer I highly recommend the Dover edition:

- Dahlquist and Bj\"{o}rck (2003) Numerical Methods. Dover Publications
ISBN-10: 0486428079

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- \begin{enumerate} -->
<!-- \item Implement the Euler method in your favorite computer language and use the code to solve the following two problems. Set initial conditions: $S_1 = 10, S_2 = 0$. Set the rate constants to $k_1 = 0.1; k_2 = 0.25$. Investigate the effect of different steps sizes, $h$, on the simulation results. -->

<!-- a) $\dS_1/\dt = -k_1 S_1 $ \\ -->

<!-- b) $\dS_1/\dt = -k_1 S_1;\ \dS_2/\dt = k_1 S_1 - k_2 S_2$ -->

<!-- \item In section~\ref{subsec:tankModel} a model of two water tanks with water flowing from one tank to another was given. The model included two differential equations that described how the heights of water in each tank changed in time. Given the equations for the model, enter them into a software tool of your choice to answer the following questions: -->

<!-- a) Plot the rate of outflow, $Q_2$, as a function of the height of water, $h_1$ at a given resistance, $K_1$. -->

<!-- b) Assuming that $Q_1$ and $Q_4$ are fixed and we start with both tanks empty, what do you expect to happen over time as water flows in? -->

<!-- c) Write out the differential equations (ODEs) that describe the rate of change in the tank water levels, $h_1$ and $h_2$. -->

<!-- d) Build a computer model of the tank system. Assign suitable values to the parameters in the model and run the simulation to plot the height of water in the tanks over time. Assume both tanks are empty at time zero. -->

<!-- e) Investigate the effect of increasing and decreasing the resistance parameters, $K_1$ and $K_2$ on the model. -->

<!-- \item The following model shows oscillations in S$_1$ and S$_2$ at a step size of $h = 0.044$ when using the Euler method. Note that species names with a dollar in front are fixed species. By using simulation, show that these oscillations are in fact an artifact. -->

<!-- \begin{lstlisting} -->
<!-- $Xo -> S1; k1*Xo; -->
<!-- S1 -> S2; k2*S1; -->
<!-- S2 ->;    k3*S2; -->

<!-- Xo = 10; S1 = 0; S2 = 0; -->
<!-- k1 = 23.4; k2 = 45.6; k3 = 12.3; -->
<!-- \end{lstlisting} -->

<!-- p = defn cell -->
<!-- $Xo -> S1; k1*Xo; -->
<!-- S1 -> S2; k2*S1; -->
<!-- S2 -> $X1; k3*S2; -->
<!-- end; -->

<!-- p.k1 = 23.4; p.k2 = 45.6; p.k3 = 12.3 -->
<!-- p.Xo = 10; p.S1 = 0; p.S2 = 0; -->
<!-- m1 = p.sim.eval (0, 4, 100); -->

<!-- p.Xo = 10; p.S1 = 0; p.S2 = 0; -->
<!-- h = 0.044; t = 0; -->
<!-- m = matrix (60, 3); -->
<!-- m[1] = {t, p.S1, p.S2}; -->
<!-- for i = 2 to 60 do -->
<!-- begin -->
<!-- r = p.dv; -->
<!-- t = t + h; -->
<!-- p.S1 = p.S1 + h*r[1]; -->
<!-- p.S2 = p.S2 + h*r[2]; -->
<!-- m[i] = {t, p.S1, p.S2}; -->
<!-- end; -->
<!-- graph (m); -->

<!-- \item Find out what differential equation solvers the Python SciPy Package supports. -->

<!-- \item Construct a model of the following system using Tellurium. -->

<!-- {\centering -->
<!-- \includegraphics[scale = 0.6]{Heinrich77Model}} -->

<!-- Let the reaction associated with the positive feedback ($k_1$) be governed by the following rate law: -->

<!-- $$ k_1 S_1 (1 + c S^q_2) $$ -->

<!-- All other reactions are governed by first-order kinetics except the first reaction which has a constant rate of $v_o$. Set the constants to the following values: $v_o = 8; c = 1.0; k_1 = 1; k_2 = 1; k_3 = 5$ and $q = 3$. Study the effect of changing $v_o$ on the dynamics of the system. -->

<!-- \item Download the model {\tt BIOMD0000000010} from Biomodels (``Kholodenko2000 - Ultrasensitivity and negative feedback bring oscillations in MAPK cascade'') and load it into Tellurium. Run a simulation of the model. Make sure the model is in your current directory. Use {\tt loads} to load a SBML model. -->

<!-- \item Given a system at equilibrium, $A \rightleftharpoons B$, with equilibrium constant, $K_{eq}$, and total mass in the system to be $T = A + B$, show that a change $\delta T$  in the total results in equal proportional changes to A and B. -->

<!-- \item Using the model in Figure~\ref{fig:FastReaction}, compare the full model with an approximation that assumes the middle reaction has higher rate constants than the rate constants in the surrounding reactions. -->

<!-- \end{enumerate} -->

<!-- \section*{Answers} -->

<!-- \begin{enumerate} -->

<!-- \item -->
<!-- \begin{verbatim} -->
<!-- import matplotlib.pyplot as plt -->

<!-- # Problem a) -->

<!-- h = 0.1 -->
<!-- for k in range (5): -->
<!-- k1 =0.1; s1 = 10; t = 0 -->
<!-- x = []; y = [] -->
<!-- for i in range (15): -->
<!-- x.append (t); y.append (s1) -->
<!-- ds1 = -k1*s1 -->
<!-- s1 = s1 + h*ds1 -->
<!-- t = t + h -->

<!-- plt.plot (x, y) -->
<!-- h = h + 4 -->
<!-- plt.show() -->

<!-- # Problem b) -->

<!-- h = 0.1 -->
<!-- for k in range (5): -->
<!-- k1 =0.1; k2 = 0.25; s1 = 10; s2 = 0; t = 0 -->
<!-- x = []; y1 = []; y2 = [] -->
<!-- for i in range (15): -->
<!-- x.append (t); -->
<!-- y1.append (s1); y2.append (s2) -->
<!-- ds1 = -k1*s1 -->
<!-- ds2 = k1*s1 - k2*s2 -->
<!-- s1 = s1 + h*ds1 -->
<!-- s2 = s2 + h*ds2 -->
<!-- t = t + h -->

<!-- plt.plot (x, y1) -->
<!-- plt.plot (x, y2) -->
<!-- h = h + 2 -->
<!-- \end{verbatim} -->

<!-- \item NA -->

<!-- \item -->
<!-- \begin{verbatim} -->
<!-- h = 0.044 -->
<!-- k1 = 23.4; k2 = 45.6; k3 = 12.3 -->
<!-- Xo = 10; s1 = 0; s2 = 0 -->
<!-- t = 0 -->
<!-- x = []; y1 = []; y2 = [] -->
<!-- for i in range (15): -->
<!-- x.append (t); -->
<!-- y1.append (s1); y2.append (s2) -->
<!-- ds1 = k1*Xo - k2*s1 -->
<!-- ds2 = k1*s1 - k3*s2 -->
<!-- s1 = s1 + h*ds1 -->
<!-- s2 = s2 + h*ds2 -->
<!-- t = t + h -->

<!-- plt.plot (x, y1) -->
<!-- plt.plot (x, y2) -->

<!-- Set h = 0.001 and the oscillations disappear. -->
<!-- \end{verbatim} -->

<!-- \item Python Scipy 1.71 supports the following ODE algorithms: rk23, rk45, rk8, LSODA, Radau, etc. -->

<!-- \item -->
<!-- \begin{verbatim} -->
<!-- import tellurium as te -->
<!-- import matplotlib.pyplot as plt -->

<!-- r = te.loada(""" -->
<!-- J1:     -> S1;   vo; -->
<!-- J2:   S1 -> ;    S1*k2; -->
<!-- J3:   S1 -> S2;  (k1*S1-k_1*S2)*(1+c*S2^q); -->
<!-- J4:   S2 -> ;    S2*k3; -->

<!-- S1 = 0; S2 = 0; -->

<!-- k1 = 1; k2 = 1; k3 = 5; -->
<!-- q = 3; c = 1; k_1 = 0;  vo = 7; -->
<!-- """) -->

<!-- for i in range (10): -->
<!-- r.reset() -->
<!-- m = r.simulate (0, 10, 100) -->
<!-- plt.plot (m['time'], m['[S1]']) -->
<!-- r.vo = r.vo + 0.1 -->
<!-- plt.show() -->
<!-- \end{verbatim} -->

<!-- \item -->
<!-- \begin{verbatim} -->
<!-- r = te.loads ('BIOMD0000000010.xml') -->
<!-- m = r.simulate (0, 5000, 1000) -->
<!-- r.plot() -->
<!-- \end{verbatim} -->

<!-- \item At equilibrium $K_{eq} = B/A$ and $T = A + B$. Therefore $B = T - A$. Solving for B yields: $B = K_{eq} T/(1 + K_{eq})$. If we make a $\delta T$ change in $T$, we can compute $dB/dT$ which equals $dB/dT = K_{eq}/(1 + K_{eq})$. To get the proportional change we multiply by $T$ and divide by $B$ which yields one, i.e a change in T yields a proportional change in $B$ and hence also $A$. -->

<!-- \end{enumerate} -->

---

## Index terms recorded in this chapter

- analytical solutions
- BSD
- CellDesigner
- COPASI
- CVODE
- equilibrium approximation
- Euler method
- fast proceses
- global error
- GPL license
- GSL library
- Heun method
- iBiosim
- LSODA
- Matlab solvers
- modified Euler
- numerical solution
- ode15s
- ode45
- odepack
- open source
- PathwayDesigner
- RK4
- roadRunner
- Runge-Kutta
- SBML
- SciLab
- software
- software:time course
- sundials
- Tellurium
- truncation error
- Van der Pol equations
- XML

---

← [[04_introduction_to_modeling|Introduction to Modeling]] · [[index|Wiki index]] · [[06_stochastic_models|Stochastic Models]] →
