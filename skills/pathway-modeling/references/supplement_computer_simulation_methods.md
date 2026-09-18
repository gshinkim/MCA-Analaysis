# Computer Simulation Methods

*Source: `chapterNumericalMethods.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Computer Simulation Methods <a id="chap-systemstheory"></a>

## Solving Differential Equations

In this chapter we will look at how models based on differential equations can be solved by computer to produce a simulation. We will start by looking at a very simple example.

## Mathematical Solutions

We will often write models of biochemical reactions in the form of ordinary differential equations. These equations describe the instantaneous rate of change of each species in the model. For example, consider the simples possible model, the first-order irreversible degradation of a molecular species, $S$ into product $P$:

$$ S \rightarrow P $$

The differential equation for this simple reaction is given by the familiar form:

$$
\begin{equation}
\frac{d\!S}{d\!t} = -k_1 S
\label{eqn:AnalyticalDecay}
\end{equation}
$$

Our aim is to solve this equation so that we can describe how $S$ changes in time. There are at least two ways to do this, we can either solve the equation mathematically or use a computer to obtain a numerical solution. Let us first consider a mathematical solution.

In order too find the solution to this equation we first move the dependent variables onto one side and the independent variables onto the other, this is called the separation of variables. In the above equation one can easily do this by dividing both sides by $S$ to give:

$$
\begin{equation}
\frac{d\!S}{d\!t} \frac{1}{S} = -k_1
\label{eqn:diffEqn1}
\end{equation}
$$

In differential calculus, the derivative of $\ln y$ with respect to $t$ is

$$ \frac{d\!\ln y}{d\!t} = \frac{d\!y}{d\!t} \frac{1}{y} $$

This means we can rewrite equation [[05_differential_equation_models|Differential Equation Models]] in the following form:

$$ \frac{d\!\ln S}{d\!t} = -k_1 $$

We now integrate both sides with respect to $d\!t$, that is:

$$
\begin{align*}
\int \ln S d\!t &= - k_1 \int dt \\[6pt]
\ln S &= -k_1 t + C
\end{align*}
$$

where $C$ is the constant of integration. If we assume that at $t=0$, $S = S_o$, then $\ln S_o
 = C$. Substituting this result into the solution gives:

$$ \ln S = -k_1 t + \ln S_o $$

$$\ln \left( \frac{S}{S_o} \right) = -k_1 t $$

Taking anti-natural logarithms on both sides and multiply both sides by $S_o$ gives:

$$ S = S_o e^{-k_1 t} $$

For simple systems such as this, it is possible to obtain analytical solutions but very rapidly one is confronted with the fact that for most problems of interest, no mathematical solution exists. In such cases, we must carry out numerical simulations.

**Figure**

*Caption:* Exponential decay from the equation: $ S = S_o e^{k_1 t}$ where $S_o = 10, k_1 = 0.2$.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}[scale=1]
\begin{axis}[
xlabel={Substrate Concentration},
ylabel={$S$},
xlabel={Time, t},
xmin=0,
xmax=20,
ymin=0,
ymax=10,
width=8cm,
height=6cm]
\addplot[color=blue,line width=1.5pt] expression[domain=0:20,samples=100]{10*exp(-0.2*\x)};

%\node at (axis cs:40,0.41) {\sffamily Change in $S_1$};
%
%\draw[thick,dashed,-latex] (axis cs:2.81,0.42) -- (axis cs:2.81,0.0);
%\draw[thick,dashed,-latex] (axis cs:2.81,0.42) -- (axis cs:0,0.42);
%
%\fill [red] (axis cs:2.82,0.42) circle (2.5pt);
%
%\node at (axis cs:6,0.2) {$v_1$};
%\node at (axis cs:6.0,0.7) {$v_2$};

\end{axis}
\end{tikzpicture}
\end{center}
\caption{Exponential decay from the equation: $ S = S_o e^{k_1 t}$ where $S_o = 10, k_1 = 0.2$.}
\end{figure}
```

## Numerical Solutions

In the last section we saw how it was possible to solve a differential equation mathematically. If the system of differential equation is linear there are systematic methods for deriving a solution. Most of the problems we encounter in biology however are non-linear and for such cases mathematical solutions rarely exist. Because of this, computer simulation is often used instead.  Since the 1960s, almost all simulations have been carried out using digital computers. Before the advent of digital computers, analog computer were frequently used where an analog of the system was built using either mechanical or more commonly, electrical analogs of concentrations. Here we will focus on methods used on digital computers.

The general approach to obtaining a solution by computer is as follows:

- Construct the set of ordinary differential equations, with one differential equation for every molecular species in the model.
- Assign values to all the various kinetic constants and boundary species.
- Initialize all floating molecular species to their starting concentrations.
- Apply an integration algorithm to the set of differential equations.
- If required, compute the fluxes from the computed species concentrations
- Plot the results of the simulation.

Step four is obviously the key to the procedure and there exist a great variety of integration algorithms. We will describe three common approaches to give a flavor of how they work. Other than for educational purposes, it is rare now for a modeler to write their own integration computer code because many libraries and applications now exist that incorporate excellent integration methods. An  `app:Jarnac` will discuss more fully the available options for software. Here we will focus on some of the the approaches themselves.

An integration algorithm approximates the behavior of a continuous system on a digital computer. Since digital computers can only operate in discrete time, the algorithms convert the continuous system into a discrete time system. This is the reason why digital computers can only generate approximations. In practice a particular discrete step size, $h$, is chosen, and solution points are generated at the discrete points up to some upper lime limit. As we will discover, the approximation generated by the simplest methods is dependent on the size of the step size and in general the smaller the step size the more accurate the solution. However since computers can only represent numbers to a given precision (usually 15 digits on modern computers), it is not possible to continually reduce the step step in the hope of increasing the accuracy of the solution. For one thing, the algorithm will soon reach the limits of the precision of the computer and secondly, the smaller the step size the longer it will take to compute the solution. There is therefore often a tradeoff made between accuracy and computation time.

Let us first consider the simplest method, the Euler method, where the tradeoff between accuracy and computer time can be clearly seen.

### Euler Method

The Euler method is the simplest possible way to solve a set of ordinary differential equations. The idea is very simple. Consider the following differential equation that describes the degradation rate of a species, $S$:

$$ \frac{\dS}{dt} = -k_1 S $$

The Euler method uses the rate of change of $S$ to predict the concentration at some future point in time. Figure [[05_differential_equation_models|Figure: Euler Method]] describes the method in detail. At time $t_1$, the rate of change in $S$ is computed from the differential equation using the known concentration of $S$ at $t_1$. The rate of change is used to compute the change in $S$ over a time interval $h$, using the relation, $h \dS/\dt$. The current time, $t_1$ is incremented by the time step, $h$ and the procedure repeated again, this time starting at $t_2$. The method can be summarized by the following two equations which represent one step in an iteration that repeats until the final time point is reached:

\stateComment{

$$
\begin{align}
y(t+h) &= y(t) + h\ \frac{dy(t)}{dt} \notag \\
t_{n+1} &= t_n + h
\label{eqn:EulerEquation}
\end{align} }
$$

Figure [[05_differential_equation_models|Figure: Euler Method]] also highlights a problem with the Euler method. At every iteration, there will be an error between the change in $S$ we predict and what the change in $S$ should have been. This error is called the **truncation error** and will accumulate at each iteration. If the step size is too large, this error can make the method numerically unstable resulting in wild swings in the solution.

Figure [[05_differential_equation_models|Figure: Euler Method]] also suggests that the larger the step size the larger the truncation error. This would seem to suggest that the smaller the step size the more accurate the solution will be. This is indeed the case, up to a point. If the step size becomes too small there is the risk that roundoff error will propagate at each step into the solution. In addition, if the step size is too small it will require a large number of iterations to simulate even a small time period. The final choice for the step size is therefore a compromise between accuracy and effort. A theoretical analysis of error propagation in the Euler method indicates that the error accumulated over the entire integration period (called the **global error**) is proportional to the step size. Therefore halving the step size will reduce the global error by half. This means that to achieve even modest accuracy, small step sizes are necessary. As a result, the method is rarely used in practice. The advantage of the Euler method is that it is very easy to implement in computer code or even on a spreadsheet.

**Figure** <a id="fig-eulermethodgraphical"></a> `fig:EulerMethodGraphical`

*Graphic (not in the LaTeX source, referenced by name): `EulerAlg`*

*Caption:* Euler Method. Starting at $t_1$, the slope $dS/dt$ at $t_1$ is computed (Panel A). The slope is used to project forward to the next solution in time step, $h$, to $t_2$ (Panel B). The new solution at $t_2$ is indicated by $P$. However the true solution is given by point R, located on the solution curve at $t_2$. Reducing the step size $h$ will reduce the error between the exact and the projected solution, but will simultaneously increase the number of slope projections necessary to compute the solution over a given time period.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.6]{EulerAlg}
\caption{Euler Method. Starting at $t_1$, the slope $dS/dt$ at $t_1$ is computed (Panel A). The slope is used to project forward to the next solution in time step, $h$, to $t_2$ (Panel B). The new solution at $t_2$ is indicated by $P$. However the true solution is given by point R, located on the solution curve at $t_2$. Reducing the step size $h$ will reduce the error between the exact and the projected solution, but will simultaneously increase the number of slope projections necessary to compute the solution over a given time period.} \label{fig:EulerMethodGraphical}
\end{figure}
```

The Euler method can also be used to solve systems of differential equations. In this case all the rates of change are computed first followed by the application of the Euler equation [[05_differential_equation_models|Euler Method]]. As in all numerical integration methods, the computation must start with an initial condition for the state variables at time zero. The algorithm is described using pseudo-code in Algorithm [[05_differential_equation_models|Euler Method]].

\renewcommand{\algorithmicendfor}{}

```latex
\begin{algorithm}[htb]
\caption{Euler Integration Method, $f,(y)$ represents the $i^{th}$ differential equation from the system of ordinary differential equations.} \label{alg:EulerAlogrithm}
\begin{algorithmic}
  \STATE{$n = \mbox{Number of state variables}$}
  \STATE{$y_i = i^{\text{th}} \mbox{ variable}$}
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
Solve the decay differential equation [[05_differential_equation_models|Differential Equation Models]] using the Euler method. Assume $k_1 = 0.2$ and the concentration of $S_o$ and $P$ are time $ = 0$ is $10$ and $0$ respectively. Assume a step size, $h$, of 0.4. Form a table of four columns, write out the solution to three decimal places. The 4$^{th}$ column should include the exact solution for comparison.

**Table**

*Caption:* Solution Table

```latex
\begin{table}[H]
\begin{center}
\begin{tabular}{llll}\toprule
Time & Solution ($S$) & $\dS/\dt$ & Exact Solution\\ \midrule
0    & 10      & 2     &  10 \\
0.4  & 9.2     & 1.84  & 9.23 \\
0.8  & 8.464   & 1.6928  & 8.52\\
1.2  & 7.787   & 0.01 & 7.87 \\
\ldots & & \\
\bottomrule
\end{tabular}
\caption{Solution Table}
\end{center}
\end{table}
```

Figure [[05_differential_equation_models|Figure: Effect of different step sizes on the Euler method using a simple line]] shows the effect of different steps sizes on the Euler method. Four cases are shown, in the worse case the solution is unbounded and the computer will eventually crash with an overflow error. The second case is where the result is bounded but the solution bears no resemblance at all to the actual solution. The third case shows the numerical solution is beginning to resemble the actual solution but with significant irregularities near the beginning of the integration. The final case shows the actual solution generated from a specialized integrator (CVODE from the sundials suite, <https://computation.llnl.gov/casc/sundials/main.html>).

**Figure** <a id="fig-eulertest"></a> `fig:eulerTest`

*Caption:* Effect of different step sizes on the Euler method using a simple linear chain of reactions where each reaction follows reversible mass-action kinetics:  $ X_o \stackrel[k_2]{k_1}{\rightleftharpoons} S_1 $, $ S_1 \stackrel[k_4]{k_3}{\rightleftharpoons} S_2 $, $ S_2 \stackrel[k_6]{k_5}{\rightleftharpoons} S_3 $, $ S_3 \stackrel{k_7}{\rightleftharpoons} X_1 $  where $k_1 = 0.45, k_2 = 0.23, k_3 = 0.67, k_4 = 1.2, k_5 = 2.3, k_6 = 0.3, k_7 = 0.73, X_o = 10, X_1 = 0, S_1 = 5, S_2 = 15, S_3 = 20$. $X_o$ and $X_1$ are fixed. 

```latex
\begin{figure}
\begin{center}
\begin{tikzpicture}
\pgfplotsset{title style={at={(0.60,1)}}}
\matrix{
\begin{axis}[
xlabel={$t$},
title={\scriptsize $h=0.55$, unbounded},
xmin=0,
xmax=25,
ymin=-30000,
ymax=30000,
width=5.5cm,
height=4cm]

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
title={\scriptsize  $h=0.5$, bounded},
xmin=0,
xmax=25,
ymin=-95000,
ymax=95000,
width=5.5cm,
height=4cm]

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
\\
\begin{axis}[
xlabel={$t$},
title={\scriptsize $h=0.00625$, convergent},
xmin=0,
xmax=25,
ymin=0,
ymax=22,
width=5.5cm,
height=4cm]

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
title={\scriptsize best solution},
xmin=0,
xmax=25,
ymin=0,
ymax=22,
width=5.5cm,
height=4cm]

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
\end{center}
\caption{Effect of different step sizes on the Euler method using a simple linear chain of reactions where each reaction follows reversible mass-action kinetics:  $ X_o \stackrel[k_2]{k_1}{\rightleftharpoons} S_1 $, $ S_1 \stackrel[k_4]{k_3}{\rightleftharpoons} S_2 $, $ S_2 \stackrel[k_6]{k_5}{\rightleftharpoons} S_3 $, $ S_3 \stackrel{k_7}{\rightleftharpoons} X_1 $  where $k_1 = 0.45, k_2 = 0.23, k_3 = 0.67, k_4 = 1.2, k_5 = 2.3, k_6 = 0.3, k_7 = 0.73, X_o = 10, X_1 = 0, S_1 = 5, S_2 = 15, S_3 = 20$. $X_o$ and $X_1$ are fixed. }
\label{fig:eulerTest}
\end{figure}
```

### Modified Euler or Heun Method

As indicated in the last section, the Euler method, though simple to implement, tends not to be used in practice because it requires small step sizes to achieve reasonable accuracy. In addition the small step size makes the Euler method computationally slow. A simple modification however can be made to the Euler method to significantly improve its performance. This approach can be found under a number of headings, including the modified Euler method, the Heun or the improved Euler method.

The modification involves improving the estimate of the slope by averaging two derivatives, one at the initial point and another at the end point. In order to calculate the derivative at the end point, the first derivative must be used to predict the end point which is then corrected by using the averaged slope (Figure [[05_differential_equation_models|Figure: Heun Method]]). This method is a very simple example of a predictor-corrector method. The method can be summarized by the following equations:

\stateComment{
{\addtolength{\jot}{6pt}

$$
\begin{align}
\mbox{Predictor: } y(t+h) &= y(t) + h\ \frac{dy(t)}{dt} \\
\mbox{Corrector: } y(t+h) &= y(t) + \frac{h}{2} \left( \frac{dy(t)}{dt} + \frac{dy(t+h)}{dt} \right) \\
t_{n+1} &= t_n + h
\label{eqn:HeunEquationA}
\end{align} } }
$$

Figure [[05_differential_equation_models|Figure: Heun Method]] describes the Heun method graphically.

**Figure** <a id="fig-heunmethodgraphical"></a> `fig:HeunMethodGraphical`

*Graphic (not in the LaTeX source, referenced by name): `HeunMethod`*

*Caption:* Heun Method. Starting at $t_1$, the slope $A$ at $T$ is computed. The slope is used to predict the solution at point $P$ using the Euler method. From point $P$ the new slope, $B$ is computed (Panel A). Slopes $A$ and $B$ are now averaged to form a new slope C (Panel B). The averaged slope is used to compute the final prediction.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.6]{HeunMethod}
\caption{Heun Method. Starting at $t_1$, the slope $A$ at $T$ is computed. The slope is used to predict the solution at point $P$ using the Euler method. From point $P$ the new slope, $B$ is computed (Panel A). Slopes $A$ and $B$ are now averaged to form a new slope C (Panel B). The averaged slope is used to compute the final prediction.} \label{fig:HeunMethodGraphical}
\end{figure}
```

A theoretical analysis of error propagation in the Heun method shows that it is a second order method, that is if the step size is reduced by a factor of 2, the global error reduced by a factor of 4. However, to achieve this improvement, two evaluations of the derivatives is required per iteration, compared to only one for the Euler method. Like the Euler method the Heun method is also quite easy to implement.

\renewcommand{\algorithmicendfor}{}

```latex
\begin{algorithm}[H]
\caption{Heun Integration Method. $f_i(y)$ is the $i^{th}$ ordinary differential equation} \label{alg:HeunAlogrithm}
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

### Runge-Kutta

The Heun method described in the previous section is sometimes called the RK2 method where RK2 stands for 2nd order Runge-Kutta method. The Runge-Kutta methods are a family of methods developed around the 1900s by the German mathematicians, Runge and Kutta. In addition to the 2nd order Heun method there are also 3rd, 4th and even 5th order Runge-Kutta methods. For hand coded numerical methods, the 4th order Runge-Kutta algorithm (often called RK4) is probably the most popular among modelers. The algorithm is a little more complicated in that it involves the evaluation and weighted averaging of four slopes. In terms of global error, however, RK4 is considerably better than Euler or the Heun method and has a global error of the order of four. This means that halving the step size will reduce the global error by a factor or 1/16. Another way of looking at this is that the step size can be increased 16 fold over the Euler method and still have the same global error. The method can be summarized by the following equations which have been simplified by removing the dependence on time:

\stateComment{
{\addtolength{\jot}{4pt}

$$
\begin{align*}
k_1 &= h \ f \big(y_n\big) \\
k_2 &= h \ f \left(\displaystyle y_n + \frac{k_1}{2}\right) \\
k_3 &= h \ f \left(y_n + \frac{k_2}{2}\right) \\
k_4 &= h \ f \Big(y_n + k_3\Big) \\
y(t + h) &= y(t) + {\displaystyle \frac{1}{6}}\ \Big(k_1 + 2\ k_2 + 2\ k_3 + k_4\Big) \\
t_{n+1} &= t_n + h \\
\end{align*}} }
$$

\renewcommand{\algorithmicendfor}{}

```latex
\begin{algorithm}[htb]
\caption{4th Order Runge-Kutta Integration Method} \label{alg:RK4Alogrithm}
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

Figure [[05_differential_equation_models|Figure: Comparison of Euler, Heun and RK4 numerical methods at integrating the]] shows a comparison of the three methods, Euler, Heun and RK4 in solving the Van der Pol equations. The Van der Pol equations are a classic problem set that is often used when comparing numerical methods. The equations model an oscillating system, inspired originally from modeling vacuum tubes but also later formed the basis for developments in modeling action potentials in neurons. The Figure shows that the Heun and RK4 methods are very similar, at least for the Van der Pol equations, though this is not always be the case. For this particular model the solution generated by the RK4 method is very similar to the best possible solution that can be obtained by numerical solution.

<!-- \begin{figure}[htb] -->
<!-- \centering -->
<!-- \includegraphics[scale = 0.5]{EulerHeunRK4Sim} -->
<!-- \caption{Comparison of Euler, Heun and RK4 numerical methods at integrating the Van der Pol dynamic system: $ dy_1/dt = y_2$ and -->
<!-- $dy_2/dt = -y_1+(1-y_1 y_1) y_2$. The plots show the evolution of $y_1$ in time. The RK4 solution is almost indistinguishable from solutions generated by much more sophisticated integrators. Step size was set to 0.35. } -->
<!-- \end{figure} -->

<!-- Generated from Jarnac model: HeunEulerRK4Test.jan -->

**Figure** <a id="fig-eulerheunrk4"></a> `fig:EulerHeunRK4`

*Caption:* Comparison of Euler, Heun and RK4 numerical methods at integrating the Van der Pol dynamic system: $ dy_1/dt = y_2$ and $dy_2/dt = -y_1+(1-y_1 y_1) y_2$. The plots show the evolution of $y_1$ in time. The RK4 solution is almost indistinguishable from solutions generated by much more sophisticated integrators. Step size was set to 0.35, initial $y_1 = 0.0121$ and $y_2 = 0$.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}[scale=1]
\begin{axis}[
ylabel={Solution},
xlabel={Time, t},
title={Comparison of Euler, Heun and RK4},
xmin=0,
xmax=21,
ymin=-5,
ymax=10,
width=9cm,
height=6cm]

\draw[line width=0.5pt,color=gray,style=solid] (axis cs:0,0) -- (axis cs:21,0);

\addplot[color=red,line width=1.6pt] coordinates {
(        0,    0.0121)
(     0.35,  0.0113589)
(      0.7,  0.0086168)
(     1.05,  0.00340549)
(      1.4,  -0.00458313)
(     1.75,  -0.0153814)
(      2.1,  -0.0286197)
(     2.45,  -0.0434046)
(      2.8,  -0.0582206)
(     3.15,  -0.0708847)
(      3.5,  -0.0785838)
(     3.85,  -0.0780241)
(      4.2,  -0.0657093)
(     4.55,  -0.0383511)
(      4.9,  0.00658336)
(     5.25,  0.070154)
(      5.6,   0.15099)
(     5.95,   0.24407)
(      6.3,  0.339503)
(     6.65,  0.422137)
(        7,  0.473104)
(     7.35,  0.473231)
(      7.7,  0.405907)
(     8.05,    0.2567)
(      8.4,  0.010934)
(     8.75,  -0.342953)
(      9.1,  -0.785351)
(     9.45,  -1.20091)
(      9.8,  -1.41057)
(    10.15,  -1.40045)
(     10.5,   -1.2503)
(    10.85,  -0.991715)
(     11.2,  -0.612721)
(    11.55,  -0.0623146)
(     11.9,  0.726914)
(    12.25,   1.60547)
(     12.6,   1.90179)
(    12.95,    1.8582)
(     13.3,   1.71798)
(    13.65,   1.50895)
(       14,   1.23076)
(    14.35,  0.862407)
(     14.7,  0.353348)
(    15.05,  -0.381459)
(     15.4,  -1.34331)
(    15.75,  -1.93666)
(     16.1,  -1.92965)
(    16.45,  -1.81503)
(     16.8,  -1.63227)
(    17.15,  -1.38632)
(     17.5,  -1.06529)
(    17.85,  -0.634097)
(     18.2,  -0.0229113)
(    18.55,  0.847774)
(     18.9,   1.75268)
(    19.25,   1.94344)
(     19.6,   1.88302)
(    19.95,   1.73799)
(     20.3,   1.52815)
(    20.65,   1.25158)
(       21,  0.887462)
};

\addplot[color=DodgerBlue3,line width=1.6pt] coordinates {
(        0,    0.0121)
(     0.35,    0.0121)
(      0.7,  0.0106178)
(     1.05,  0.00713454)
(      1.4,  0.00113167)
(     1.75,  -0.00784609)
(      2.1,  -0.0201047)
(     2.45,  -0.0356924)
(      2.8,  -0.0542707)
(     3.15,  -0.0749709)
(      3.5,  -0.0962466)
(     3.85,  -0.115743)
(      4.2,  -0.13021)
(     4.55,  -0.135494)
(      4.9,  -0.126645)
(     5.25,  -0.0981576)
(      5.6,  -0.0443458)
(     5.95,  0.0401428)
(      6.3,  0.159577)
(     6.65,  0.315828)
(        7,  0.505826)
(     7.35,  0.717001)
(      7.7,  0.921213)
(     8.05,   1.07232)
(      8.4,   1.11859)
(     8.75,   1.03107)
(      9.1,  0.814218)
(     9.45,   0.47585)
(      9.8,  -0.00217601)
(    10.15,  -0.667918)
(     10.5,   -1.5664)
(    10.85,  -2.55725)
(     11.2,   -2.8521)
(    11.55,  -2.26202)
(     11.9,  -2.79602)
(    12.25,  -2.28351)
(     12.6,  -2.65145)
(    12.95,  -2.19693)
(     13.3,   -2.3769)
(    13.65,  -2.04672)
(       14,   -1.9627)
(    14.35,  -1.72174)
(     14.7,  -1.48089)
(    15.05,  -1.19472)
(     15.4,  -0.846635)
(    15.75,  -0.404262)
(     16.1,  0.185674)
(    16.45,  0.997866)
(     16.8,   2.06178)
(    17.15,   3.00504)
(     17.5,   2.62247)
(    17.85,   2.94704)
(     18.2,   2.28269)
(    18.55,   3.04426)
(     18.9,   2.40385)
(    19.25,   3.24363)
(     19.6,   2.38443)
(    19.95,   3.99109)
(     20.3,   2.67084)
(    20.65,   7.76009)
(       21,   1.59712)
};

\addplot[color=Gold1,line width=1.6pt] coordinates {
(        0,    0.0121)
(     0.35,  0.0112431)
(      0.7,  0.00832806)
(     1.05,  0.00291401)
(      1.4,  -0.00525219)
(     1.75,  -0.0161175)
(      2.1,  -0.0291988)
(     2.45,  -0.0434707)
(      2.8,  -0.0572878)
(     3.15,  -0.0683706)
(      3.5,  -0.0738831)
(     3.85,  -0.0706284)
(      4.2,  -0.0553701)
(     4.55,  -0.0252844)
(      4.9,  0.0214517)
(     5.25,  0.0849062)
(      5.6,  0.162451)
(     5.95,  0.247735)
(      6.3,  0.329986)
(     6.65,  0.394365)
(        7,   0.42381)
(     7.35,  0.401596)
(      7.7,   0.31277)
(     8.05,  0.143718)
(      8.4,  -0.117088)
(     8.75,  -0.467478)
(      9.1,  -0.858413)
(     9.45,  -1.17654)
(      9.8,  -1.32327)
(    10.15,  -1.29198)
(     10.5,  -1.12021)
(    10.85,  -0.824264)
(     11.2,  -0.378865)
(    11.55,  0.276033)
(     11.9,   1.10827)
(    12.25,    1.7398)
(     12.6,    1.9215)
(    12.95,   1.83656)
(     13.3,   1.64153)
(    13.65,   1.37545)
(       14,   1.02848)
(    14.35,  0.555819)
(     14.7,  -0.12521)
(    15.05,  -1.03245)
(     15.4,  -1.77104)
(    15.75,  -2.00116)
(     16.1,  -1.92696)
(    16.45,  -1.74175)
(     16.8,  -1.49207)
(    17.15,  -1.17379)
(     17.5,  -0.752352)
(    17.85,  -0.156294)
(     18.2,  0.688463)
(    18.55,   1.55928)
(     18.9,   1.97468)
(    19.25,   1.97555)
(     19.6,   1.82072)
(    19.95,   1.59344)
(     20.3,   1.30313)
(    20.65,  0.926474)
(       21,  0.406782)
};

\node at (axis cs:16.2,5.1) {\small Euler};
\draw[thick,solid,-latex] (axis cs:17.5,5) -- (axis cs:20,5.0);

\node at (axis cs:18,-3.8) {\small Heun};
\draw[thick,solid,-latex] (axis cs:18,-3) -- (axis cs:18,-1);

\node at (axis cs:11,5) {\small RK4};
\draw[thick,solid,-latex] (axis cs:11,4) -- (axis cs:11,1);


\end{axis}
\end{tikzpicture}
\end{center}
\caption{Comparison of Euler, Heun and RK4 numerical methods at integrating the Van der Pol dynamic system: $ dy_1/dt = y_2$ and $dy_2/dt = -y_1+(1-y_1 y_1) y_2$. The plots show the evolution of $y_1$ in time. The RK4 solution is almost indistinguishable from solutions generated by much more sophisticated integrators. Step size was set to 0.35, initial $y_1 = 0.0121$ and $y_2 = 0$.}
\label{fig:EulerHeunRK4}
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

In the previous discussion of numerical methods for solving differential equations, the step size, $h$, was assumed to be fixed. This makes implementation quite straight forward but also make the methods inefficient. For example, if the solution is at a point where it changes very little then the method could probably increase the step size without loosing accuracy while at the same time achieve a considerable speedup in the time it takes to generate the solution. Likewise if at a certain point in the integration the solution starts to change rapidly, it would be prudent to lower the step size to increase accuracy. Such strategies are implemented in the **variable step size methods**.

The approach used to automatically adjust the steps size can vary from quite simple approaches to very sophisticated methods. The simplest approach is to carry out two integration trials, one at a step size of $h$ and another trial using two steps size but at $h/2$. The software now compares the solution generated by the two trials. If the solutions are significantly different then the step size must be reduced. If the solutions are about the same then it might be possible to increase the step size. These tests are repeatedly carried out, adjusting the step size as necessary as the integration proceeds. This simple variable step size approach can be easily incorporated into some of the simpler algorithms particularly the fourth order Runge-Kutta where it is called the variable step-size Runge-Kutta.

Another approach to adjusting the step size is called the Dormand-Prince method [RK4Family]. This method carries out two trials based on the fourth and fifth order Runge-Kutta. Any difference between the two trials is used to adjust the step size. Matlab's ode45 implements the Dormand-Prince method. Similar methods to Dormand-Prince include the Fehlberg (Search Wikipedia Fehlberg method) and more recently the Cash-Karp method [CashKarp:1990].

Many of these simple adjustable step size solvers are quite effective. Sometimes they can be slow however especially for the kinds of problem we find in biochemical models. In particular there is a class of problem called stiff problems which generally plagues the biochemical modeling community. Stiff models require highly specialized solvers which have been developed in the last four decades.

### Stiff Models

Many differential equations we encounter in biochemical models are so-called  **stiff** systems. The word stiff apparently comes from earlier studies on spring and mass systems where the springs had large spring constants and therefore difficult to stretch. A stiff system is often associated with widely different time scales in a system, for example when the rate constants are widely different in a biochemical model. Such systems may have molecular species whose decay rates are very fast compared to other components. This means that the step size has to be very small to accommodate the fast processes even though the rest of the system could be accurately solved using a much larger step size. The overall result is the need for very small steps sizes and therefore significant computational cost and the possibility of roundoff error which will tend to be amplified by the large time constants in the fast system. The net result are solutions which bear no resemblance to the true solution.

Most modern simulators will employ specific stiff algorithms for solving stiff differential equations. Of particular importance is the sundials suite and odepack. Sundials <https://computation.llnl.gov/casc/sundials/main.html> includes a number of very useful, well written and documented solvers. In particular the CVODE solver is very well suited to finding solutions to stiff differential equations. As a result sundials is widely used in the biochemical modeling community (for example by Jarnac and roadRunner, Appendix `app:Jarnac`). Before the advent of sundials, the main workhorse for solving stiff systems was the suite of routines in odepack <http://www.netlib.org/odepack/>. Of particular importance was LSODA which in the 1990s was very popular and is still a valuable set of software (currently used in COPASI <http://www.copasi.org>). The original stiff differential equation solver was developed by Gear in the 1970s and is still used in Matlab in the form of ode15s. We will return to a fuller discussion of software tools in Appendix `app:jarnac`.

## Using Software to Solve ODEs

There are many software tools that can be used to solve systems of differential equations. A popular tool amongst engineers is Matlab. This is a commercial product that implements a simple but powerful language for numerical analysis. The example below illustrates Matlab being used to solve the equations related to the Lorenz attractor, a well known chaotic model. The differential equations are shown below:

$$
\begin{align*}
\frac{dx}{dt} &= -\sigma x + \sigma y \\[6pt]
\frac{dy}{dt} &= \rho x - y - y z\\[6pt]
\frac{dz}{dt} &= -\beta z + x y\\
\end{align*}
$$

To solve differential equations a function must first be defined that computes the right-hand sides of the differential equations and returns the derivatives to the caller. This is shown below.

```python
function xprime = lorenz(t,x);
%Computes the derivatives of the differential equations
sig=10;
beta=8/3;
rho=28;
xprime=[-sig*x(1) + sig*x(2);
         rho*x(1) - x(2) - x(1)*x(3);
        -beta*x(3) + x(1)*x(2)];
```

To solve the Lorenz system, we must use one of the Matlab provided ODE solver routines. In the script below we use ode45 which implements an adaptive step-size Runge-Kutta method.

```python
>>x0 = [-8 8 27];
>>tspan = [0, 20];
>>[t,x] = ode45 (@lorenz, tspan, x0)
>>plot (t, x)
```

The first line sets up the initial conditions for the three variables, the second line sets up the duration of the simulation, and the third line carries out the actual simulation. The last line plots the curves.

Matlab is an example of a general purpose tool. Other examples include Mathematica, Octave (a free Matlab clone) and Scilab (another free clone of Matlab). There are however many specialist tools that can accept as input the reaction scheme itself from which the application derives the differential equations and solves them. In addition, many of these specialists tools can load and save files in the Systems Biology Markup Language (SBML) which means such programs can access the large number of models available in model repositories such as Biomodels. Many of the example models in this book will be described using Jarnac scripts which can also be easily converted to SBML or in fact Matlab. Jarnac is a windows application that offer a wide range of analysis methods for modeling biochemical networks. A more detailed description of Jarnac will be founding in Appendix `app:Jarnac`. A simple example is given here:

```python
// Define a simple linear chain of reactions
p = defn cell
     $Xo -> S1; k1*Xo - k2*S1;
     S1 -> S2; k3*S1/(k4 + S1);
     S2 -> $X1; k5*S2^2;
end;

// Initialize parameters
p.Xo = 10;
p.k1 = 0.6;  p.k2 = 0.4;
p.k3 = 3.4;  p.k4 = 0.1;
p.k4 = 1.2;

// Carry out simulation and plot results
// Three arguments = timeStart, timeEnd, numberOfPoints
m = p.sim.eval (0, 10, 100);
graph (m);
```

## Solving NonLinear Equations

The steady state is one of the most important states to consider in a dynamical model. In the literature it is also sometimes referred to as the stationary solution or state, singular points, fixed points, or even equilibrium. We will avoid the use of the term equilibrium because of possible confusion with thermodynamic equilibrium.

The steady state is the primary reference point from which to consider a model's behavior. At steady state, the concentrations
of all molecular species are constant and there is a net flow of mass through the
network. We can conveniently illustrate the steady state using a graphical procedure.
Consider the simple model below:

```latex
\begin{tikzpicture}
  \draw(35pt,65pt) node[anchor=west] {\Large $X_o$};

  \draw[color=blue,-latex,line width=1.8pt] (60pt,65pt) -- (95pt,65pt);
  \draw(65pt,75pt) node[anchor=west] {\large $v_1$};
  \draw(95pt,65pt) node[anchor=west] {\Large $S_1$};

  \draw[color=blue,-latex,line width=1.8pt] (120pt,65pt) -- (155pt,65pt);
  \draw(126pt,75pt) node[anchor=west] {\large $v_2$};
  \draw(155pt,65pt) node[anchor=west] {\Large $X_1$};
\end{tikzpicture}
```

where $X_o$ and $X_1$ are constant boundary species and $S_1$ is a floating
species. For illustration purposes we will assume some very
simple kinetics for each reaction, $v_1$ and $v_2$. Let us assume that each reaction is
governed by simple first order mass-action kinetics,

$$
\begin{align*}
v_1 &= k_1 X_o \\
v_2 &= k_2 S_1
\end{align*}
$$

where $k_1$ and $k_2$ are both first-order reaction rate constants. In Figure [[12_the_steady_state|Figure: Plot of reaction rates versus concentration of $S_1$ and different val]] both reaction rates have been plotted as a function of the floating species concentration, $S_1$.

**Figure** <a id="fig-simplesteadystate"></a> `fig:SimpleSteadyState`

*Caption:* Plot of reaction rates versus concentration of $S_1$ and different values for $k_2$ for the system $X_o \rightarrow S_1 \rightarrow X_1$. The intersection
of the two lines marks the steady state point where $v_1 = v_2$. $X_o = 1, k_1 = 0.4$. Note that as $k_2$ is decreased the steady state level of $S_1$ increases.

```latex
\begin{figure}[h]
\begin{center}
\begin{tikzpicture}
\begin{axis}[
xlabel={Substrate Concentration, $S_1$},
ylabel={Reaction Rate, $v_1$ and $v_2$},
xmin=0,
xmax=5,
ymin=0,
ymax=1.5,
width=8cm,
height=6cm,legend style={at={(1.05,0.4)}}]
\addplot[color=blue,line width=1.5pt] coordinates {
(0,	0.4)
(5,0.4)
};

\addplot[color=red,line width=1.5pt] coordinates {
(0,	0)
(5, 1.5)
};
\fill [red] (axis cs:1.33,0.4) circle (2.5pt);
\node at (axis cs:3.2,1.2)  {$k_2=0.3$};
\draw[stealth-,line width=1.5pt,color=black,style=solid] (axis cs:1.33,0.44) -- (axis cs:1.33,0.8);
\node at (axis cs:1.3,0.86) {$v_1=v_2$};

\addplot[color=green,line width=1.5pt] coordinates {
(0,	0)
(5, 1)
};
\fill [red] (axis cs:2,0.4) circle (2.5pt);
\node at (axis cs:3.9,0.9)  {$k_2=0.2$};

\addplot[color=orange,line width=1.5pt] coordinates {
(0,	0)
(5, 0.5)
};
\fill [red] (axis cs:4,0.4) circle (2.5pt);
\node at (axis cs:4.2,0.56)  {$k_2=0.1$};

\end{axis}
\end{tikzpicture}
\end{center}
\caption{Plot of reaction rates versus concentration of $S_1$ and different values for $k_2$ for the system $X_o \rightarrow S_1 \rightarrow X_1$. The intersection
of the two lines marks the steady state point where $v_1 = v_2$. $X_o = 1, k_1 = 0.4$. Note that as $k_2$ is decreased the steady state level of $S_1$ increases.} \label{fig:SimpleSteadyState}
\end{figure}
```

Note that the reaction rate for $v_1$ is a horizontal line because it is unaffected by changes in $S_1$ (no product inhibition). The second reaction, $v_2$ is shown as a straight line with slope, $k_2$. Notice that the lines intersect. The intersection
marks the point when both rates, $v_1$ and $v_2$ are equal. This point marks the steady state
concentration of $S_1$.  By varying the value of $k_2$ we can observe the effect it has on
the steady state. For example, Figure [[12_the_steady_state|Figure: Plot of reaction rates versus concentration of $S_1$ and different val]] shows that as we **decrease** $k_2$ the concentration of $S_1$ increases. This should not be difficult to understand, as $k_2$ decreases, the activity of reaction $v_2$ also decreases. This causes $S_1$ to build up in response.

In this simple model it is also straight forward to determine the steady state of $S_1$ mathematically which amounts to finding a mathematical
equation that represents the intersection point of the two lines. We recall that the model for this system comprises a single differential equation:

$$
\begin{eqnarray*}
\frac{dS_1}{dt} &=& k_1 X_o - k_2 S_1
\end{eqnarray*}
$$

At steady state, we set $dS_1/dt = 0$, from which we can solve for the steady state concentration
of $S_1$ as:

$$
\begin{equation}
S_1 = \frac{k_1 X_o}{k_2}
\label{eqn:simpleSSSolution}
\end{equation}
$$

This solution tells us that the steady state concentration of $S_1$ is a function of **all** the parameters in the system. We can also determine the steady state rate, usually called the pathway flux and denoted by J, by inserting the steady state value of $S_1$ into one of the rate laws, for example into $v_2$:

$$ J = k_2 \frac{k_1 X_o}{k_2} = k_1 X_o $$

This answer is identical to $v_1$ which is not surprising since in this model the pathway flux is completely determined by the first step and the second step has no influence whatsoever on the flux. This simple example illustrates a rate limiting step in the pathway, that is one step, and one step only, that has complete control over the pathway flux.

A slightly more realistic model is the following:

```latex
\begin{tikzpicture}
  \draw(35pt,65pt) node[anchor=west] {\Large $X_o$};

  \draw[color=blue,-latex,line width=1.7pt] (60pt,65pt) -- (95pt,65pt);
  \draw(65pt,75pt) node[anchor=west] {\large $v_1$};
  \draw(95pt,65pt) node[anchor=west] {\Large $S_1$};

  \draw[color=blue,-latex,line width=1.7pt] (120pt,65pt) -- (155pt,65pt);
  \draw(126pt,75pt) node[anchor=west] {\large $v_2$};
  \draw(155pt,65pt) node[anchor=west] {\Large $S_2$};

  \draw[color=blue,-latex,line width=1.7pt] (180pt,65pt) -- (215pt,65pt);
  \draw(187pt,75pt) node[anchor=west] {\large $v_3$};
  \draw(215pt,65pt) node[anchor=west] {\Large $X_1$};
\end{tikzpicture}
```

where the rate law for the first step is now reversible and is given by:

$$ v_1 = k_1 X_o - k_2 S_1 $$

The remaining steps are governed by simple irreversible mass-action rate laws, $v_2 = k_3 S_1$ and $v_3 = k_4 S_2$. The differential equations for this system are:

$$
\begin{eqnarray*}
\frac{dS_1}{dt} &=& (k_1 X_o - k_2 S_1) - k_3 S_1 \\[4pt]
\frac{dS_2}{dt} &=& k_3 S_1 - k_4 S_2 \\
\end{eqnarray*}
$$

The steady state solution for $S_1$ and $S_2$ can be obtained by setting both differential equations to zero and solving for $S_1$ and $S_2$ to yield:

$$
\begin{eqnarray*}
S_1 &=& \frac{k_1 X_o}{k_2 + k_3} \\[4pt]
S_2 &=& \frac{k_3 k_1 X_o}{(k_2 + k_3) k_4}
\end{eqnarray*}
$$

The steady state flux, $J$, can be determined by inserting one of the solutions into the appropriate rate law, the easiest is to insert the steady state level of $S_2$ into $v_3$ to yield:

$$ J = \frac{k_3 k_1 X_o}{k_2 + k_3} $$

Once the first step is reversible we see that the steady state flux is a function of all the parameters except $k_4$ indicating that the first step is no longer the rate limiting step. The equation shows us that the ability to control the flux is shared between the first and second steps. There is no rate limiting step in this pathway. Note that if we set $k_2 = 0$ then the solution reverts to the earlier simpler model.

We can also make all three steps reversible ($k_f S_i - k_r S_{i+1}$), so that the solution is given by:

$$
\begin{eqnarray*}
S_1 &=& \frac{X_o k_1 (k_4 + k_5) + X_1 k_4 k_6}{k_3 k_5 + k_2 (k_4 + k_5)} \\[5pt]
S_2 &=& \frac{X_1 k_6 (k_2 + k_3) + X_o k_1 k_3}{k_3 k_5 + k_2 (k_4 + k_5)} \\
\end{eqnarray*}
$$

The last example illustrates the increase in complexity of deriving a mathematical solution after only a modest increase in model size. In addition, once more complex rate laws as used, such as Hill equations or Michaelis-Menten type rate laws, the solutions become exceedingly difficult to derive. In most cases, steady states are therefore computed numerically rather than analytically.

## Computing the Steady State

In those (many) cases were we cannot derive an analytical solution for the steady state we must revert to numerical methods. There are at least two methods that can be used here. The simplest approach is to run a time course simulation for a sufficiently long time so that the time course trajectories eventually reach the steady state. This method works so long as the steady state is
stable, it cannot be used to locate unstable steady states because such trajectories diverge. In addition, the method can sometimes be very slow to converge depending on the kinetics of the model. As a result, many simulation packages provide an alternative method for computing the steady state where the model differential equations are set to zero and the resulting equations solved for the concentrations. This type of problem is quite common in many fields and is often represented mathematically as the quest to find solutions to equations of the following form:

$$
\begin{equation}
f (x, p) = 0
\label{eqn:algebraicEquation}
\end{equation}
$$

where $x$ is the unknown and $p$ one or more parameters in the equations. All numerical methods for computing solutions to
equation [[12_the_steady_state|Computing the Steady State]] start with an initial estimate
for the solution, say $x_o$. The methods are then applied iteratively until the
estimate converges to the solution. One of the most well known
methods for solving equation [[12_the_steady_state|Computing the Steady State]] is called the
Newton-Raphson method. It can be easily explained using a geometric
argument, Figure [[12_the_steady_state|Figure: The geometry of Newton-Raphson's method]]. Suppose $x_1$ is the initial guess for the solution
to equation [[12_the_steady_state|Computing the Steady State]]. The method begins by estimating the
slope of equation [[12_the_steady_state|Computing the Steady State]] at the value $x_1$,
that is $\df/\dx$. A line is then drawn from the point ($x_1, f
(x_1)$), with slope $\df/\dx$ until it intersects the $x$ axis. The
intersection, $x_{2}$, becomes the next guess for the method. This
procedure is repeated until $x_i$ is sufficiently close to the
solution. For brevity the parameter is omitted form the following equations. From the geometry shown in Figure [[12_the_steady_state|Figure: The geometry of Newton-Raphson's method]]
one can write down the mathematical equivalent of this procedure as:

$$ \frac{\partial f}{\partial x_k} = \frac{f (x_k)}{x_k - x_{x+1}} $$

**Figure** <a id="fig-newtonrasphon"></a> `fig:NewtonRasphon`

*Graphic (not in the LaTeX source, referenced by name): `NewtonRaphson`*

*Caption:* The geometry of Newton-Raphson's method

```latex
\begin{figure}[h]
\begin{center}
  \includegraphics[scale=0.5]{NewtonRaphson}
  \caption{The geometry of Newton-Raphson's method} \label{fig:NewtonRasphon}
\end{center}
\end{figure}
```

or by rearrangement:

\stateComment{

$$
\begin{equation}
x_{k+1} = x_k - \frac{f(x_k)}{\partial f/\partial x_k}
\label{eqn:SimpleNewRaphson}
\end{equation}
$$

}

In this form we see the iterative nature of the algorithm.

Before the advent of electronic calculators that had a specific square root button,
calculator users would exploit the Newton method to estimate square roots. For example, if the square root
of a number, $a$ is equal to $x$, that is $\sqrt{a} = x$, then it is true that:

$$ x^2 - a = 0 $$

This equation looks like an equation of the form [[12_the_steady_state|Computing the Steady State]]. We can therefore apply the Newton formula (equation [[12_the_steady_state|Computing the Steady State]]) to this equation to obtain

$$ x_{k+1} = \frac{1}{2} \left( x_k + \frac{a}{x_k} \right) $$

Table [[12_the_steady_state|Table: Newton method used to compute the square root of 25, using equation \e]] shows a sample calculation using this equation to compute the
square root of 25. Note that only a few iterations are required for convergence.

\setlength{\doublerulesep}{\arrayrulewidth}

**Table** <a id="tble-newtonraphson-25"></a> `tble:NewtonRaphson:25`

*Caption:* Newton method used to compute the square root of 25

```latex
\begin{table}
\begin{center}
\begin{tabular}{ll}\toprule
Iteration & Estimate \\ \midrule
0         & 15 \\
1         & 8.33333 \\
2         & 5.666 \\
3         & 5.0392 \\
4         & 5.0001525 \\
5         & 5.0 \\ \bottomrule
\end{tabular}
\end{center}
\caption{Newton method used to compute the square root of 25}
\label{tble:NewtonRaphson:25}
\end{table}
```

One importance point to bear in mind, the Newton-Raphson method is not guaranteed to converge to the solution, this depends heavily on the start point and the nature of the system being solved. In order to prevent the method from continuing without end in the case when convergence fails if is often useful to halt the method after a maximum of iterations, say one hundred iterations. In a case like this, a new initial start is given and the method tried again. In biochemical models we an always run a time course simulation for a short while and use the end point of that as the starting point for the Newton method. This approach is much more reliable. If the method does converge to a solution there are various ways to decide whether convergence has been achieved. Two such tests include:

- Difference between Successive Solutions Estimates. We can test for the difference between solution $x_i$ and the next estimate, $x_{i+1}$, if the absolute difference, $| x_i - x_{i+1}|$ is below some threshold then we assume convergence has been achieved. Alternatively we can measure the relative error is less than a certain threshold (say, 1%). The relative error is given by

$$ \epsilon = \frac{x_{i+1} - x_i}{x_{i+1}} \times 100% $$

The procedure can be made to stop at the $i$-th step if $ \vert f(x_i)\vert< \epsilon_f$ for a given $\epsilon_f$.

- Difference between Successive $dS_i/dt$ Estimates. Here we estimate the rates of change as the iteration proceeds and assume convergence has been archived when the different between two successive rates of change are below some threshold.

<!-- Successive values of $x_i$ are close to each other (hence, we are -->
<!-- approaching the root probably), i.e., stop the procedure if $ \vert -->
<!-- x_{i+1} - x_i\vert < \epsilon_x$ for given $\epsilon_x$. -->

The Newton method can be easily extended to systems of equations so
that we can write the Newton method in matrix form:

\stateComment{

$$
\begin{equation}
\bx_{k+1} = \bx_k - \left[ \frac{\partial \bff (\bx)}{\partial \bx} \right]^{-1} \bff(\bx_k)
\label{eqn:NewtonRaphsonMatrix}
\end{equation}
$$

}

If $m$ is the number of floating species in the model, then $\bx_k$ is an $m$ dimensional vector of species concentrations, $\bff (\bx)$ is a vector containing the $m$ rate of change and $\partial \bff\!(\bx)\!/\partial \bx$ the $m \times m$ Jacobian matrix.

**Newton Algorithm**

- 1. Initialize the values of the concentrations, $\bx$, of the molecular species to some initial guess, obtained perhaps from a short time course simulation.
- 2. Compute the values for $\bff\!(\bx)$, that is the left-hand side of the differential equations ($d\!\bx\!/dt$).
- 3. Calculate the matrix of derivatives, $\partial\!\bff\!/\partial \bx$ that is $d(d\!\bx/dt)/d\!\bx$, at the current estimate for $\bx$.
- 4. Compute the inverse of the matrix $\partial\!\bff\!/\partial \bx$
- 5. Using the information calculated so far, compute the next guess $\bx_{k+1}$
- 6. Compute the new value of $\bff\!(\bx)$ at $\bx_{k+1}$. If the value is less than some error tolerance
then assume the solution has been reached, else return to step 3, using $\bx_{k+1}$ as the new starting point.

Although the Newton method is seductively simple, it requires the
initial guess to be sufficiently close to the solution in order for
it to converge. In addition convergence can be slow or not occur at all. A common problem is that the
method can overshoot the solution and and will then being to rapidly diverge.

A further strategy that is frequently used to compute the steady
state is to first use a short time course simulation to bring the
initial estimate closer to the steady state. The assumption here is
that the steady state is stable. The final point computed in the
time course is used to seed a Newton like method, if the Newton
method fails to converge then a second time course simulation is
carried out. This can be repeated as many times as desired. If there
is a suspicion that the steady state is unstable, one can also run a
time course simulation backwards in time. In general there is no
sure way of computing the steady state automatically and sometimes
human intervention is required to supply good initial estimates.

As a result of these issues the unmodified Newton method is rarely
used in practice for computing the steady state of biochemical
models. One common variant, called the Damped Newton method is
sometimes used. Both Gepasi and SCAMP use the Damped Newton method for
computing the steady state. This method controls the derivative, $\df/dx$ by multiplying the
derivative by a factor $\alpha$, $0 < \alpha < 1$ and can be used to prevent overshoot. There are many variants on the
basic Newton method and good simulation software will usually have reasonable methods
for estimating the steady state.

In the last ten years more refined Newton like methods have been
devised and one that is highly recommended is NLEQ2. This is used by
both Jarnac and PySCeS for computing the steady state. The stiff
solver suite sundials also incorporates an equation solver, however
experience has shown that is it not as good as NLEQ2.

### Solving the Steady State for a Simple Pathway

We are going to use the Newton-Raphson method to solve the steady state for the following simple pathway. We will assume that all three reactions are governed by simple mass-action reversible rate laws. Species $X_o$ and $X_1$ are assumed to be fixed and only $S_1$ and $S_2$ and floating species.

```latex
\begin{tikzpicture}
  \draw(35pt,65pt) node[anchor=west] {\Large $X_o$};

  \draw[color=blue,-latex,line width=1.7pt] (60pt,65pt) -- (95pt,65pt);
  \draw(65pt,75pt) node[anchor=west] {\large $v_1$};
  \draw(95pt,65pt) node[anchor=west] {\Large $S_1$};

  \draw[color=blue,-latex,line width=1.7pt] (120pt,65pt) -- (155pt,65pt);
  \draw(126pt,75pt) node[anchor=west] {\large $v_2$};
  \draw(155pt,65pt) node[anchor=west] {\Large $S_2$};

  \draw[color=blue,-latex,line width=1.7pt] (180pt,65pt) -- (215pt,65pt);
  \draw(187pt,75pt) node[anchor=west] {\large $v_3$};
  \draw(215pt,65pt) node[anchor=west] {\Large $X_1$};
\end{tikzpicture}
```

The differential equations for the model are as follows:

$$
\begin{align}
\begin{aligned}
\frac{dS_1}{dt} = (k_1 X_o - k_2 S_1) - (k_3 S_1 - k_4 S_2) \\[4pt]
\frac{dS_2}{dt} = (k_3 S_1 - k_4 S_2) - (k_5 S_2 - k_6 X_1)
\end{aligned}
\label{eqn:SolvingSSExample}
\end{align}
$$

The values for the rate constants and the boundary conditions are given in Table [[12_the_steady_state|Table: Values for example \eqref{eqn:SolvingSSExample}]].

**Table** <a id="tbl-valuesforsolvingss"></a> `tbl:ValuesForSolvingSS`

*Caption:* Values for example ([[12_the_steady_state|Solving the Steady State for a Simple Pathway]]).

```latex
\begin{table}
\begin{center}
\begin{tabular}{ll}\toprule
Parameter & Value \\\midrule
$k_1$ & 3.4 \\
$k_2$ & 0.2 \\
$k_3$ & 2.3 \\
$k_4$ & 0.56 \\
$k_5$ & 5.6 \\
$k_6$ & 0.12 \\
$X_o$ & 10 \\
$X_1$ & 0 \\ \bottomrule
\end{tabular}
\caption{Values for example (\ref{eqn:SolvingSSExample}).}
\end{center}
\label{tbl:ValuesForSolvingSS}
\end{table}
```

This is a problem with more than one variable ($S_1$ and $S_2$) which means we must use the Newton-Raphson matrix form ([[12_the_steady_state|Computing the Steady State]]) to estimate the steady state. To use this we require two vectors, $\bx_k$ and $\bff(\bx_k)$ and one matrix, $\partial \bff (\bx)/\partial \bx$. The $\bx_k$ vector is simply:

$$ \bx_k = \begin{bmatrix}
S_1   
S_2   
\end{bmatrix} $$

The $\bff(\bx_k)$ vector is given by the values of the differential equations:

$$ \bff(\bx_k) = \begin{bmatrix}
(k_1 X_o - k_2 S_1) - (k_3 S_1 - k_4 S_2)   
(k_3 S_1 - k_4 S_2) - (k_5 S_2 - k_6 X_1)   
\end{bmatrix} $$

The $\partial \bff (\bx)/\partial \bx$ matrix is the 2 by 2 Jacobian matrix. To compute this we need to form the derivatives which in this case is straight forward given that the differential equations are simple. In cases involving more complex rates laws, software will usually estimate the derivatives by numerical means. In this case however it is easy to differentiate algebraically to obtain:

$$
\frac{\partial \bff (\bx)}{\partial \bx} =
\begin{bmatrix}
\displaystyle\frac{d(dS_1/dt)}{dS_1} & \displaystyle\frac{d(dS_1/dt)}{dS_2}\\[14pt]
\displaystyle\frac{d(dS_2/dt)}{\dS_1} & \displaystyle\frac{d(dS_2/dt)}{dS_2}
\end{bmatrix}
=
\begin{bmatrix}
-k_2 - k_3 & -k_4 \\[4pt]
k_3 & -k_4 - k_5
\end{bmatrix}
$$

Notice that the elements of the Jacobian contain only rate constants. This is because the model we are using is linear. This also means we need only evaluate the Jacobian and its inverse once. If we used nonlinear rate laws such as the Michaelis-Menten rate law, the Jacobian matrix would also contain terms involving the species concentrations and in this case the Jacobian would need to be reevaluated at each iteration because the value for the species concentration will change at each iteration. For the current problem the Jacobian and its inverse is given by:

$$Jacobian = \begin{bmatrix}
-2.86 & 5.6   
-0.56 & -11.2
\end{bmatrix}
\quad
Jacobian^{-1} =
\begin{bmatrix}
-0.3876  & -0.1938  
-0.01938 & -0.09898
\end{bmatrix}
$$

Table [[12_the_steady_state|Table: Newton-Raphson applied to a Three Step Pathway with Linear Kinetics]] shows the progress of the iteration as we apply equation [[12_the_steady_state|Computing the Steady State]]. What is interesting is that convergence only takes one iteration. This is because the model is linear. Nonlinear models may require more iterations. We can also see that after the first iteration the rates of change have very small values, this is usually due to very small numerical errors in the computer arithmetic but anything as small as $10^{-14}$ can be considered zero.

**Table** <a id="tbl-newtonexample"></a> `tbl:NewtonExample`

*Caption:* Newton-Raphson applied to a Three Step Pathway with Linear Kinetics. Starting values for $S_1$ and $S_2$ are both set at one. Convergence occurs within one iteration. Note that the values for the rates of change are extremely small at the end of the first iteration, indicating we have converged.

```latex
\begin{table}
\begin{center}
\begin{tabular}{lllll}\toprule
Iteration & $S_1$ & $S_1$ & $dS_1/dt$ & $dS_2/dt$ \\\midrule
0         & 1 & 1 & 36.74 & -10.64\\
1         & 13.18 & 0.6589 & $2.8 \times 10^{-14}$ & $-1.16 \times 10^{-13}$ \\\bottomrule
\end{tabular}
\end{center}
\caption{Newton-Raphson applied to a Three Step Pathway with Linear Kinetics. Starting values for $S_1$ and $S_2$ are both set at one. Convergence occurs within one iteration. Note that the values for the rates of change are extremely small at the end of the first iteration, indicating we have converged.}
\label{tbl:NewtonExample}
\end{table}
```

### Computing the Steady State Using Simulation Software

The previous section showed how to compute the steady state using the Newton method. In practice we would not write our own solver but use existing software to accomplish the same thing. To illustrate this, the following Jarnac script will define and compute the steady state all at once:

```python
// Define model
p = defn cell
    $Xo -> S1;  k1*Xo - k2*S1;
     S1 -> S2;  k3*S1 - k4*S2;
     S2 -> $X1; k4*S2 - k6*X1;
end;

// Initialize value
p.Xo = 10;  p.X1 = 0;
p.k1 = 3.4; p.k2 = 0.2;
p.k2 = 2.3; p.k3 = 0.56;
p.k4 = 5.6; p.k6 = 0.12;

// Initial starting point
p.S1 = 1; p.S2 = 1;

// Compute steady state
p.ss.eval;
println p.S1, p.S2;
```

Running the above script yields steady state concentrations of 13.1783 and 0.658915 for $S_1$ and $S_2$ respectively, which is the same if we compare these values to those in Table [[12_the_steady_state|Table: Newton-Raphson applied to a Three Step Pathway with Linear Kinetics]]. Other tools will have other ways to compute the steady state, for example graphical interfaces will generally have a button marked steady state then when selected will compute the steady state for currently loaded model.

When using Matlab the function `fsolve` can be use to solve systems of nonlinear equation and in Mathematica one would use `FindRoot`.

## Further Reading

Unfortunately there are very few reasonably priced books on numerical analysis. The two most popular and expensive books are by Press and Burden and are included here for reference. Both books can be bought second-hand at reasonable prices and the content has not changed significantly between editions. One could even argue that the code examples in the latest edition of Press are actually worse than in previous editions.

- Press, Teulolsky, Vetterling and Flannery (2007) Numerical Recipes. Cambridge University Press, 3rd Edition
ISBN-10: 0521880688

- Burden and Faires (2010) Numerical Analysis. Brooks Cole, 9th Edition. ISBN-10: 0538733519

For the budget conscious buyer I can highly recommend the Dover edition:

- Dahlquist and Bj\"{o}rck (2003) Numerical Methods. Dover Publications
ISBN-10: 0486428079

<!-- \section*{Glossary} -->

<!-- \begin{description} -->

<!-- \item[Euler method] -->

<!-- \end{description} -->

## Exercises

- Implement the Euler method in your favorite computer language and use the code to solve models a) and b). Set initial conditions, $S_1 = 10, S_2 = 0$. Set the rate constants to $k_1 = 0.1; k_2 = 0.25$. Investigate the effect of different steps sizes, $h$, on the simulation results.

a) $\dS_1/\dt = -k_1 S_1 $   

b) $\dS_1/\dt = -k_1 S_1; \dS_2/\dt = k_1 S_1 - k_2 S_2$

- The following model shows oscillations at a step size of $h = 0.5$ when using the Euler method to solve the differential equations. Show that these oscillations are in fact an artifact of the simulation.

$$
\begin{align*}
\frac{dS_1}{dt} &= -\frac{k_1 S_1}{k_3 + S_2} \\[6pt]
\frac{dS_2}{dt} &= \frac{k_1 S_1}{k_3 + S_2} - k_2 S_2
\end{align*}
$$

Use the following values: $k_1 = 1.1; k_2 = 4.2; k_3 = 10$, initial condition, $S_1 = 10; S_2 = 0$ and simulating for 20 time units.

- Implement the Newton-Raphson method using your favorite computer language to find the two real roots for the following quadratic equation.

<!-- 1.79129 and -2.79129 -->
<!-- p = defn cell -->
<!-- J1: $s -> x; x^2 + x - 5; -->
<!-- end; -->

<!-- p.x = -0.5; -->
<!-- p.ss.eval; -->
<!-- println p.x; -->
$$ x^2 + x - 5 = 0 $$

---

## Index terms recorded in this chapter

- global error
- truncation error

---

← [[draft_kinetics_in_a_nutshell_old|Kinetics in a Nutshell (earlier draft)]] · [[index|Wiki index]] · [[supplement_simulation_software|Simulation Software]] →
