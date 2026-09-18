# Fitting Models

*Source: `chapter9.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Fitting Models <a id="chap-fittingmodels"></a>

## Introduction

In constructing computational models (Chapter [[04_introduction_to_modeling|Introduction to Modeling]]) of biochemical systems, we make choices about what reaction steps, regulatory interactions and molecular species to include. Given these choices, how good is the model? Does the model adequately describe existing knowledge about the system? Can the model make useful predictions? Some of the model parameters might be estimated experimentally but many will be unknown. How can we estimate these parameters and how well can they be estimated? Such questions fall under the umbrella of **model fitting**. In this chapter and the next we will consider these questions.

\stateHighlight{
Questions we will consider in this and the next chapter:

- Can we determine the values for the unknown parameters in the proposed model from the experimental data, for example using optimization methods? This is termed **system identification**.
- Does the model reasonably represent the known experimental data, i.e. is the model a *good fit*?
- What confidence do we have in the fitted parameters?
- Can the fitted model make new and useful predictions?

To start, let's briefly state what it means to **fit** a model.

\stateComment{
Fitting a model means adjusting the parameters of the model until the behavior of the model matches some known experimental data.
}

**Figure** <a id="fig-fittingflowchart"></a> `fig:fittingFlowChart`

*Graphic (not in the LaTeX source, referenced by name): `fittingFlowChart`*

*Caption:* Fitting models to data.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.55]{fittingFlowChart}
\caption{Fitting models to data.} \label{fig:fittingFlowChart}
\end{figure}
```

Figure [Figure: Fitting models to data](#fig-fittingflowchart) describes some of the outcomes of fitting a model to data. In particular, we can answer the question how well the model describes experimental data. We can also obtain estimates for the parameters in the model and how much confidence we have in the fitted parameters. Finally we can cross-validate. This is where we hold some data back and ask the fitted model to try to predict this data. In this chapter we will focus on fitting models to experimental data, and the use of different optimization methods. Fitting models is an active area of research and we can only cover a limited area of this important topic.

<!-- --------------------------------------------------------------------- -->
<!-- The following is reserved for the 2nd edition -->
<!-- --------------------------------------------------------------------- -->
<!-- \section{Model Fitting} -->

<!-- The best way to introduce model fitting is to describe an example. Let's consider the following experiment. A compound $S_1$ is known to spontaneously react to form a second compound $S_2$, which in turn is converted into a stable compound, $S_3$. An experiment is carried out by adding an initial amount of $S_1$ to a reaction vessel. A stop clock is started and the reactions are followed by periodically taking a sample and measuring the levels of $S_1, S_2$ and $S_3$. The graph shown in Figure~\ref{fig:fittingThreeStepPathayData} shows a typical time series from such an experiment. Note that the data does not follow a smooth curve due to measurement errors. A proposed model for this system is: -->

<!-- $$ S_1 \stackrel{k_1}{\rightarrow} S_2 \stackrel{k_2}{\rightarrow} S_3 $$ -->

<!-- Let's hypothesize that both reactions follow simple first-order kinetics. This means we can write the model equations as: -->

<!-- \begin{equation} -->
<!-- \begin{aligned} -->
<!-- \frac{dS_1}{dt} &= - k_1 S_1 \\[6pt] -->
<!-- \frac{dS_2}{dt} &=  k_1 S_1 - k_2 S_2 \\[6pt] -->
<!-- \frac{dS_3}{dt} &= k_2 S_2 -->
<!-- \end{aligned} -->
<!-- \label{eqn:ProposedModelToFit} -->
<!-- \end{equation} -->

<!-- \begin{figure}[htb] -->
<!-- \centering -->
<!-- \includegraphics[scale = 0.5,angle=90]{fittingThreeStepPathayData} -->
<!-- \caption{Results from an experiment that measures the concentrations of $S_1, S_2$ and $S_3$ in time.} \label{fig:fittingThreeStepPathayData} -->
<!-- \end{figure} -->

<!-- Given a time series such as the one shown in Figure~\ref{fig:fittingThreeStepPathayData} and a proposed model such as (\ref{eqn:ProposedModelToFit}), let us consider these four questions: -->

### Optimizing Parameter Values

To understand how the fitting process works, consider a simple model:

$$ S_1 \stackrel{k_1}{\rightarrow} S_2 $$

We start an experiment with an initial amount of S$_1$ and observe the change in S$_1$ as it reacts to form S$_2$. Figure [Figure: Model curve and experimental data plotted on the same graph](#fig-fittingsimpleillustation) shows both a solid curve representing a simulation of the model, and four experimental data points for the concentration of S$_1$. The first data point at time zero represents the initial concentration of S$_1$ which we assume is error free. This may not always be the case however. Measurements are collected at time points 0.5, 1, 2, and 3.5. The $e_i$ terms represent the difference between the experimental data point and the simulation curve and are called the residuals.  Fitting is the process where we attempt to adjust the parameters of the model ($k_1$ in this case), such that the differences, $e_i$, between the simulation curve and the data points is **minimized**.

**Figure** <a id="fig-fittingsimpleillustation"></a> `fig:fittingSimpleIllustation`

*Caption:* Model curve and experimental data plotted on the same graph. The solid line is the simulated model, the points represent experimental data. The difference between the experimental data and the simulation curve is indicated by errors, $e_i$, called residuals. Model fitting attempts to minimize the $e_i$ terms by adjusting the model parameter values.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}[scale=1.2]
\begin{axis}[
xlabel={Time},
ylabel={$\displaystyle S_1$, Concentration},
xmin=0, xmax=4,
ymin=0, ymax=10,
width=9cm,
height=6cm,
legend style={draw=none}]

\addplot[only marks,color=red] coordinates {
(0, 10) (0.5, 8.5) (1, 2) (2, 0.5) (3.5, 1.9)};
\addlegendentry{= Experimental Data Point}

\addplot[color=blue, line width=1.5pt] expression[domain=0:4,samples=50]{10*exp(-0.82*\x)};

\node at (axis cs:2.15,4.94) {Fitted Curve};
\draw[line width=1.6pt,-latex,red] (axis cs:1.5,4.9) -- (axis cs:1,4.9);

\draw[line width=0.7pt,latex-latex,darkgreen] (axis cs:0.5,8.2) -- (axis cs:0.5,6.7);
\draw[line width=0.7pt,latex-latex,darkgreen] (axis cs:1,2.25) -- (axis cs:1,4);
\draw[line width=0.7pt,latex-latex,darkgreen] (axis cs:2,1.8) -- (axis cs:2,0.62);
\draw[line width=0.7pt,latex-latex,darkgreen] (axis cs:3.5,1.7) -- (axis cs:3.5,0.6);

\node at (axis cs:0.7,7.4)    {$e_1$};
\node at (axis cs:0.8,3)      {$e_2$};
\node at (axis cs:1.8,1.02)   {$e_3$};
\node at (axis cs:3.3,1.25)   {$e_4$};

\end{axis}
\end{tikzpicture}
\end{center}
\caption{Model curve and experimental data plotted on the same graph. The solid line is the simulated model, the points represent experimental data. The difference between the experimental data and the simulation curve is indicated by errors, $e_i$, called residuals. Model fitting attempts to minimize the $e_i$ terms by adjusting the model parameter values.}
\label{fig:fittingSimpleIllustation}
\end{figure}
```

In more general terms, let us indicate the experimental data points using the symbols, $x_i$ and $y_i$, where $x_i$ is the independent variable time and $y_i$ the dependent variable. Assume there are $N$ data points. We will indicate the model using the expression $f (x_i; p_1... p_m)$, where $p_i$ is the $i$th parameter in the model. That is, for a given set of parameters and time point $x_i$, the function $f$ will return the corresponding model $y_i$ value. If the model is a set of differential equations, we would run a simulation in order to obtain the value of $y_i$ at $x_i$. The fitting procedure will attempt to minimize the difference between the model $f$ and the data points, that is minimize:

$$ y_i - f (x_i; p_1... p_m) $$

Because the difference between a data point and the model may be positive or negative depending on the error in the data point (See $e_2$ for example in Figure [Figure: Model curve and experimental data plotted on the same graph](#fig-fittingsimpleillustation)), we take the square of the difference to make the term positive:

$$ (y_i - f (x_i; p_1... p_m))^2 $$

This difference only corresponds to one data point, and we should be considering all data points when trying to fit the model. Therefore we sum up all the differences and attempt to minimize the total sum, that is:

$$ \sum_{i=1}^N (y_i - f (x_i; p_1... p_m))^2 $$

In statistics this is called the **residual sum of squares**. If the differences, $y_i - f(x_i)$, are independent and normally distributed variables (which we usually assume they are), then it is known that the sum of such squares is distributed according to the chi-square distribution and is often given the symbol $\chi^2$ for this reason(footnote: The notation $\chi^2$ is possibly misleading. The $\chi^2$ is not the square of a quantity $\chi$ and is why the term chi-square is used rather than chi-squared. The $^2$ is simply to remind us of the square on the right-hand side of the expression.}.

We can take this further and reason that the most uncertain data points should contribute less to the sum compared to those which have been measured more precisely. We therefore weight each difference by the standard deviation, $\sigma$, that corresponds to that data point. This assumes that we have some measure of uncertainty, if we don't we set the weight to one:

\stateEquation{

$$
\begin{equation}
\chi^2 \equiv \sum_{i=1}^N \left(\frac{y_i - f (x_i; p_1\ldots p_m}{\sigma_i} \right)^2
\label{eqn:chiSquared}
\end{equation} }
$$

The above equation can also be expressed in the following equivalent form to emphasize the weighing in terms of the variance, $\sigma^2$:

$$ \chi^2 \equiv \sum_{i=1}^N \frac{1}{{\sigma_i^2}} \left(y_i - f (x_i; p_1... p_m )\right)^2 $$

This equation is called the **weighted chi-square sum of squares** and can vary between zero and infinity. If the model is a set of differential equations, the $f$ function is a list of data points from a simulation run. For example, using the previous model let us assume the parameter $k_1$ is set to -0.95. Table [Table: Calculating chi-square](#tbl-chiquare) shows an example of computing the chi-square given some data points and results from a model run.

An important variant of the chi-square is the **reduced chi-square** ([Optimizing Parameter Values](#eqn-reducedchisquare)) which is used when looking at the quality of the fit and estimating the confidence in the fitted parameter.

\stateEquation{

$$
\begin{equation}
\chi^2_{\text{reduced}} \equiv \frac{1}{N- P}\sum_{i=1}^N \frac{1}{{\sigma_i^2}} \left(y_i - f (x_i; p_1\ldots p_m )\right)^2
\label{eqn:reducedChiSquare}
\end{equation} }
$$

In the above equation [Optimizing Parameter Values](#eqn-reducedchisquare), $N$ is the number of data points and $P$ the number of parameters to be fitted in the model. The difference $N-P$ is called the **degrees of freedom**. We will return to the topic of the reduced chi-square later, we simply want to define it here.

**Table** <a id="tbl-chiquare"></a> `tbl:Chiquare`

*Caption:* Calculating chi-square. Assume we have no variances with the data points, therefore the weighting is one. $\chi^2$ is the sum of the right most column and equals 6.92. The reduced chi-square, $\chi^2_{reduced}$, is $6.9/(5-1) = 1.725$.

```latex
\begin{table}
\centering
\begin{tabular}{lllll} \toprule
Time & Data Point & Point from Model & Difference & Difference Squared \\ \midrule
0 & 10    & 10  &  0    & 0 \\
0.5 & 7.9 & 6.2 & -1.68 & 2.8 \\
1  & 2.1  & 3.87 & 1,77 & 3.12 \\
2  & 0.5  & 1.5 & 1 & 1 \\
3  & 0.6  & 0.58 & -0.02 & 0.00046 \\ \midrule
   &      &      & Sum = & 6.92 \\ \bottomrule
\end{tabular}
\caption{Calculating chi-square. Assume we have no variances with the data points, therefore the weighting is one. $\chi^2$ is the sum of the right most column and equals 6.92. The reduced chi-square, $\chi^2_{\text{reduced}}$, is $6.9/(5-1) = 1.725$.}
\label{tbl:Chiquare}
\end{table}
```

### Maximum Likelihood Justification - Optional <a id="subsec-maxlike"></a>

In this section we will justify the use of $\chi^2$ as a means to estimate the unknown parameters. This section may be omitted on first reading. The previous section used the difference between a data point and a simulated point, squared the difference to eliminate negative terms and summed and weighted all data points to estimate the quality of our fit. This sounds quite reasonable, but is there a more theoretical justification for this approach? The question is, how can we be sure this particular definition of the $\chi^2$ leads to the best parameter estimates for the experimental data? Is there another formula we could use that would give us more accurate estimates?

The answer to this question lies in using **maximum likelihood**, an approach developed by Fisher [aldrich1997ra] between 1912 and 1922. Maximum likelihood is a method that asks the question, given a set of data and associated model with unknown parameters, $p_i$, what are the most likely values for the parameters?

\stateHighlight{
The likelihood is a measure of the degree to which a sample of data provides support for a particular set of parameters in a model.
}

Very briefly, the maximum likelihood method works by first computing the likelihood function which describes the likelihood of a set of parameters, $p$, given the data, $x$, often denoted:

$$ L (p|x) $$

If we change the parameters for a given set of data, the likelihood, $L$, will change. What set of parameter values maximizes the likelihood? The way to find a maximum is to find the point where the derivative of the function of interest is zero, and the second derivative is negative. The maximum likelihood can therefore be found by differentiating the likelihood function with respect to the parameter, setting the derivative to zero, and solving for the parameter. To make matters simpler, the log of the likelihood is often differentiated, that is we differentiate:

$$ \ln (L (p|x)) $$

and then determine $p$ from:

$$ \frac{\partial \ln L (p|x)}{\partial p} = 0 $$

A fuller account of maximum likelihood is given in Appendix [[appendix_g_statistics_reminder|Statistics Reminder]], together with a proof that shows that the sum of squares when minimized does indeed yield the most likely estimates for the parameter values. It is therefore true that the original, intuitive reasoning matches the more formal approach. The formal derivation also gives the limits on the use of $\chi^2$. In particular, the maximum likelihood derivation assumes that the errors in the experimental data are *normally distributed* and *independent* (See Appendix for a refresher, [[appendix_g_statistics_reminder|Statistics Reminder]]).

\stateComment{
When using the sums of squares to find the best parameters for a model, it is assumed that the experimental data points are normally distributed and independent.
}

## Optimization Algorithms

A brute force method for fitting a model is to run a simulation of the model many times with random parameter values until we find a set of parameters that gives us simulation data that matches the experimental time series. One problem with this approach is that we're likely to spend a great deal of time coming up with random parameter values in the hopes that at least one set will match the experimental data. This however is unlikely, and the brute force method is rarely used in practice. Instead, special search algorithms have been devised, called **optimization algorithms**, to search for the best set of parameters in a systematic way.

Optimization is an iterative process. It involves making an initial guess for the parameters, $p_i$, computing the $\chi^2$ value, and using a rule that adjusts the parameter values such that the $\chi^2$ is reduced in the next iteration. This procedure is repeated many times until the $\chi^2$ can no longer be reduced, at which point the iteration stops. If the fit was successful, the model should be able to reproduce the experimental data given the final set of parameters.

One way to imagine this process is to consider a two parameter system where the $\chi^2$ describes a surface. Figure [Figure: Example of a fitness landscape showing multiple minima ($M_a$ and $M_b](#fig-fittnesslandcape) shows such a surface, also called a fitness landscape. The $z$-axis is a measure of the $\chi^2$, and the $x$ and $y$ axes are two parameters we wish to estimate. As the two parameters are varied, $\chi^2$ changes, sometimes to high values and sometimes to low values. The low values are the ones of interest, ideally at the lowest possible $\chi^2$ value, called the **global minimum**. We can see that the surface is quite complicated with a number of hills and valleys. This is often the case when fitting a model.

To start the optimization process we select, possibly at random, values for the two parameters. Let us assume we started the optimization at the top of the tallest hill. What we seek is the lowest point on the surface. An obvious strategy is to move down the hill until we reach the lowest point. However if we did this we wouldn't necessarily reach *the* lowest point, but an intermediate low point called a local minimum (most likely point $M_a$ or $M_b$ in the figure). However if we started on the near side of the second peak and moved down the hill, we would reach the deepest point or global minimum at $M_c$. Depending on the surface complexity, it can be difficult to find the global minimum because it is easy to find a local minimum first and claim success. Depending on the landscape, a search method can encounter a range of problems while searching for the global minimum. Figure [Figure: Problems encountered in different fitness landscapes](#fig-differentfitness) illustrates examples of common issues when searching for the global minimum. A great variety of approaches have therefore been devised to solve this problem. The next section will describe five common methods employed to find optima.

**Figure** <a id="fig-fittnesslandcape"></a> `fig:FittnessLandcape`

*Graphic (not in the LaTeX source, referenced by name): `GlobalandLocalMin.pdf`*

*Caption:* Example of a fitness landscape showing multiple minima ($M_a$ and $M_b$) and a global minimum at $M_c$. The vertical axis represents $\chi^2$, and the $x$ and $y$ axes the parameters. The plot shows how $\chi^2$ changes for different parameter values. The function used to plot the surface is: $3 (1 - x)^2 \exp(-x^2 - (y + 1)^2) - 10 (x/5 - x^3 - y^5) \exp(-x^2 - y^2) - 1/3 \exp(-(x + 1)^2 - y^2).$ 

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale=0.3]{GlobalandLocalMin.pdf}
\end{center}
\caption{Example of a fitness landscape showing multiple minima ($M_a$ and $M_b$) and a global minimum at $M_c$. The vertical axis represents $\chi^2$, and the $x$ and $y$ axes the parameters. The plot shows how $\chi^2$ changes for different parameter values. The function used to plot the surface is: $3 (1 - x)^2\ \exp(-x^2 - (y + 1)^2) - 10 (x/5 - x^3 - y^5)\ \exp(-x^2 - y^2) - 1/3\ \exp(-(x + 1)^2 - y^2).$ }
\label{fig:FittnessLandcape}
\end{figure}
```

**Figure** <a id="fig-differentfitness"></a> `fig:DifferentFitness`

*Graphic (not in the LaTeX source, referenced by name): `DifferentFitness.pdf`*

*Caption:* Problems encountered in different fitness landscapes. Vertical axis is the objective or fitness function.

```latex
\begin{figure}[htb]
\centering
\includegraphics[scale=0.75]{DifferentFitness.pdf}
\caption{Problems encountered in different fitness landscapes. Vertical axis is the objective or fitness function.}
\label{fig:DifferentFitness}
\end{figure}
```

### Gradient Descent

Gradient descent is one of the simplest methods for finding a minimum but is not recommended for practical use. The method does serves as a basis for building and understanding more sophisticated gradient descent methods such as the Levenberg-Marquardt method.

The gradient descent method moves in the steepest direction that reduces the sum of squares. A one dimensional problem is the easiest to explain. Consider a function, $f(x)$, such as $2 x^2 + x - 3$ where we wish to find the value for $x$ than minimizes the function(footnote: We're not trying to find solutions to the equation when $f(x)$ is zero, rather the smallest value of $f(x)$.}. A plot of this equation yields the parabola shown in Figure [Figure: Gradient descent in one dimension](#fig-gradientdescent1d-a).

The gradient descent method starts by picking an initial starting point, $x_o$, and uses the slope, $df/dx$, at that point to move to a lower point on the curve, (A). This can be done by computing the distance, $-\alpha \df/dx$, we need to move. Notice that the distance must be negative. This is to ensure that we are moving in the direction that takes us closer to the minimum. We repeat until the slope, $df/dx$, is below some preset threshold. The key to implementing a robust gradient descent is the choice of the step size factor $\alpha$. We will come back to this shortly. The pseudo code for a one dimensional gradient descent using a fixed $\alpha$ is shown in Algorithm [Gradient Descent](#listinggraddes12d). Figure [Figure: Gradient descent in one dimension](#fig-gradientdescent1d-a) already hints at one potential problem, that is overshoot. In the figure we see that point (A) is on the other side of the minimum from the original starting point. There is a potential here to oscillate back and forth across the minimum if the choice of $\alpha$ is not made correctly.

**Figure** <a id="fig-gradientdescent1d-a"></a> `fig:GradientDescent1D_A`

*Graphic (not in the LaTeX source, referenced by name): `GradientDecent1D_A.pdf`*

*Caption:* Gradient descent in one dimension. The method starts with an initial guess at $x_o$ and uses $\alpha \df/\dx$ to compute the new position A where $\alpha$ is the step size factor. Point A forms the starting point for a new iteration.  This is repeated until the slope is less than some small number. If the step size is too big, there is a chance the search will overshoot. The key to implementing a robust gradient descent is the choice of step size factor, $\alpha$ and how it should be varied as the calculation proceeds.

```latex
\begin{figure}[htb]
\centering
\includegraphics[scale=0.85]{GradientDecent1D_A.pdf}
\caption{Gradient descent in one dimension. The method starts with an initial guess at $x_o$ and uses $\alpha \df/\dx$ to compute the new position A where $\alpha$ is the step size factor. Point A forms the starting point for a new iteration.  This is repeated until the slope is less than some small number. If the step size is too big, there is a chance the search will overshoot. The key to implementing a robust gradient descent is the choice of step size factor, $\alpha$ and how it should be varied as the calculation proceeds.}
\label{fig:GradientDescent1D_A}
\end{figure}
```

<!-- \begin{figure}[htb] -->
<!-- \begin{center} -->
<!-- \begin{tikzpicture}[scale=1] -->
<!-- \begin{axis}[ -->
<!-- xlabel={$x$}, -->
<!-- ylabel={$\displaystyle y$}, -->
<!-- xmin=-4, xmax=5, -->
<!-- ymin=-5, ymax=20, -->
<!-- grid=both, -->
<!-- width=9cm, -->
<!-- height=6cm, -->
<!-- area style] -->
<!-- \addplot[color=blue, line width=1.5pt] expression[domain=-4:6,samples=50]{\x^2 + \x - 2}; -->

<!-- \fill [red] (axis cs:4,18) circle (2.6pt); -->
<!-- \draw[line width=2.1pt,-latex,darkgreen] (axis cs:4,18) -- (axis cs:2.65,5.85); -->

<!-- \fill [red] (axis cs:2.65,7.67) circle (2.6pt); -->
<!-- \draw[line width=2.1pt,-latex,darkgreen] (axis cs:2.65,7.67) -- (axis cs:1.705,1.719); -->

<!-- \fill [red] (axis cs:1.705,2.61) circle (2.6pt); -->
<!-- \draw[line width=2.1pt,-latex,darkgreen] (axis cs:1.705,2.612) -- (axis cs:1.0435,-0.30519); -->

<!-- \fill [red] (axis cs:1,0) circle (2.6pt); -->

<!-- \node at (axis cs:4.5,18)    {$\displaystyle x_o$}; -->

<!-- \end{axis} -->
<!-- \end{tikzpicture} -->
<!-- \end{center} -->
<!-- \caption{Gradient descent in one dimension. The method starts with an initial guess at $x_o$ and uses the slope to move down the gradient towards the minimum.} -->
<!-- \label{fig:GradientDescent1D} -->
<!-- \end{figure} -->

<!-- \renewcommand{\algorithmicendfor}{} -->

```latex
\begin{algorithm}[htb]
\caption{One dimensional gradient descent. $x_o$ represents the starting point for the method. This algorithm uses a fixed $\alpha$. This is a naive description because it does't deal with the case where the solution does not converge.} \label{listingGradDes12D}
\begin{algorithmic}
  \STATE{Initialize starting point to $x_o$}
  \STATE{Initialize the step factor $\alpha$}
  \STATE{Initialize slope threshold $\epsilon$}

  \STATE{$f(x) \text{ is the objective function}$}
  \linebreak

  \WHILE{$\displaystyle \alpha\ \text{abs } \left(\frac{df}{dx}\right) > \epsilon$}
  \item[]\vspace{8pt}
    \STATE{$\displaystyle  x_o = x_o - \alpha \frac{df}{dx}$}
  \item[]
  \ENDWHILE
\end{algorithmic}
\end{algorithm}
```

**Figure** <a id="fig-contouropt1"></a> `fig:contourOpt1`

*Graphic (not in the LaTeX source, referenced by name): `contourOpt1`*

*Caption:* Gradient descent in a two dimensional system. Note that the third search vector overshoots.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.8]{contourOpt1}
\caption{Gradient descent in a two dimensional system. Note that the third search vector overshoots.} \label{fig:contourOpt1}
\end{figure}
```

The method can be easily scaled to multidimensional systems where the function, $f$, is now a function of more than one parameter (See Appendix [[appendix_f_math_fundamentals|Taylor Series in Two Dimensions]]), for example, $f(x_1, x_2, ..., x_n)$. We define the gradient vector as:

$$ \nabla f(x_1, x_2, ..., x_n) = \left[ \frac{\partial f(x_1, x_2, ..., x_n)}{\partial x_1}, \frac{\partial f(x_1, x_2, ..., x_n)}{\partial x_2}, ... \right]^T $$

Changing the parameters in a single iteration now becomes:

$$
\begin{align*}
\begin{bmatrix}
x_1 \\ x_2 \\ \vdots \\ x_n
\end{bmatrix}_{n+1} =
\begin{bmatrix}
x_1 \\ x_2 \\ \vdots \\ x_n
\end{bmatrix}_{n} -
\alpha
\begin{bmatrix}
\frac{\displaystyle \partial f(x_1, x_2, \ldots, x_n)}{\displaystyle \partial x_1} \\[8pt] \displaystyle\frac{\partial f(x_1, x_2, \ldots, x_n)}{\partial x_2} \\ \vdots \\ \displaystyle\frac{\partial f(x_1, x_2, \ldots, x_n)}{\partial x_n}
\end{bmatrix}
\end{align*}
$$

In vector format the expression can be succinctly written as:

$$ \bvx_{n+1} = \bvx_{n} - \alpha \nabla f (\bvx_{n}) $$

Figure [Figure: Gradient descent in a two dimensional system](#fig-contouropt1) shows the gradient descent in a two dimensional system. The search vectors are always perpendicular to the contours. When $\alpha$ is too big, the search can overshoot as seen in the third vector.

\renewcommand{\algorithmicendfor}{}

```latex
\begin{algorithm}[htb]
\caption{One dimensional gradient descent with a simple line search. $x_o$ represents the starting point for the method.} \label{listingGradDescentLineSearch}
\begin{algorithmic}
  \STATE{Initialize starting point to $x_o$}
  \STATE{Initialize threshold $\epsilon$}

  \STATE{$f(x) \text{ is the objective function}$}
  \linebreak

  \WHILE{$\displaystyle \text{abs } \left(\frac{df}{dx}\right) > \epsilon$}
  \item[]\vspace{6pt}
  \STATE{$d = \frac{df}{dx}$}
  \STATE{$\alpha=1$}
  \item[]
  \WHILE{$\displaystyle f (x_o - \alpha d) > f (x_o)$}
    \STATE{$\alpha = \alpha / 2$}
  \ENDWHILE
  \item[]
    \STATE{$\displaystyle  x_o = x_o - \alpha d$}
  \ENDWHILE
\end{algorithmic}
\end{algorithm}
```

One advantage of the gradient descent is that it is straight forward to implement. It suffers however from a number of issues. The main problem is what value to set the step factor, $\alpha$? If the factor is too large, the iteration will overshoot the minimum, and in the next iteration it will backtrack, possibly overshooting the minimum again. Reducing the step size can help avoid this effect but if too small, the method can take much too long to reach the minimum. A common modification to accommodate these difficulties is to add a mechanism to adjust $\alpha$ as the search progresses. A crude but effective way to adjust $\alpha$ is to try different values in order to find one that results in a *reduction* in the function, $f$. This helps avoid overshoots and reduces the number of steps required to reach the minimum. This technique and its variants are called **line searching** because the algorithms attempt to search along the gradient descent direction looking for a point that reduces the value of the function, $f$. A modification that includes a simple line search is shown in Algorithm [Gradient Descent](#listinggraddescentlinesearch). However, these modifications are not very helpful near the minimum because the gradient is likely to be shallow resulting in very small steps. This means that although a simple gradient descent will initially converge quite rapidly, as it approaches the minimum the rate of convergence will slow considerably.

All gradient descent methods find the nearest minimum which is quite likely to be a local minimum for a complex model. Gradient descent methods, including more elaborate ones such as the Levenberg-Marquardt, should be used in conjunction with other methods that are better at finding global minima.

### Gauss-Newton Method

The gradient descent method described in the last section is general in the sense that the function can be in any form including a sums of squares. An alternative method for finding minima that is specially designed for systems where the function is a sum of squares, is the Gauss-Newton method. This method relies on the assumption that we can approximate the surface near the minimum using a quadratic function in the parameters. That is, near the minimum we assume that the objective function looks like a parabolic bowl. To obtain this approximation we use the Taylor series to expand the residual function [Optimizing Parameter Values](#eqn-chisquared), $\chi^2$ to second order about $\mathbf p_0$, where $\delta \mathbf p = \mathbf p - \mathbf p_0$ (See Appendix [[appendix_f_math_fundamentals|Taylor Series in Two Dimensions]]):

$$
\begin{equation}
\chi^2 ({\bf p}) = \chi^2_{\bf p_o} +  \delta \mathbf p^T\ {\mathbf d} + \frac{1}{2}\ \delta \mathbf p^T\ {\mathbf H}\ \delta \mathbf p
\label{eqn:quadraticForm}
\end{equation}
$$

where $\mathbf d_i = \partial \chi^2/\partial p_i $ and $\mathbf H$ is called the **Hessian** and has elements defined by:

$$
\begin{equation}
H_{ij}= \frac{{\partial}^2 \chi^2}{\partial p_i p_j}
\label{eqn:Hessian}
\end{equation}
$$

$\bf{H}$ describes the **curvature** of the surface. At the minimum, the derivative of [Gauss-Newton Method](#eqn-quadraticform) will equal zero. The minimum of the surface can therefore be found by differentiating expression [Gauss-Newton Method](#eqn-quadraticform) with respect to ${\delta \mathbf p^T}$, and setting the result to zero:(footnote: Note: $\mathbf d(\delta \mathbf p^T {\mathbf H} \delta \mathbf p)/{\mathbf d\delta\mathbf p^T} = 2 {\mathbf H} \delta \mathbf p$}

$$
\begin{equation}
0 = {\mathbf d} + {\mathbf H}\ \delta \mathbf p
\label{eqn:linearChi}
\end{equation}
$$

This is a linear system of equations which can be solved for $\delta \mathbf p$:

$$ \delta \mathbf p = -{\bf{H}}^{-1} {\mathbf d}$$

From this we obtain an update to the parameter $\mathbf p$ using $\delta \mathbf p$:

\stateEquation{

$$
\begin{equation}
{\mathbf p}_{k+1} = {\mathbf p}_{k} - {\bf{H}}^{-1} {\mathbf d}
\label{eqn:HessianSolution}
\end{equation}
$$

}

As with gradient descent this is an iterative algorithm requiring repeated evaluations of the Hessian. In practice we don't compute the inverse of $\bf{H}$ but determine $\delta \mathbf p$ using a standard linear equation solver algorithm.  One potential inefficiency is computing the Hessian. This is a matrix of second derivatives which in general are expensive in computer time to estimate accurately. To improve the efficiency let's look at this problem from a different point of view. Leaving out the weights, $\sigma$, and without loss of generality, let $\chi^2$ be written as, see [Optimizing Parameter Values](#eqn-chisquared):

$$ \chi^2 (**p**) = \sum_{i=1}^m r^2_i (**p**) $$

where $r_i$ is the residual $y_i - f (x_i; p_1... p_m)$. To simplify the notation let us designate $\chi^2 (**p**)$ using the symbol $f (**p**)$. The derivative of $f (**p**)$ with respect to $p_j$ is given by:

$$ \frac{\partial f (**p**)}{\partial p_j} = 2 \sum_{i=1}^m r_i (**p**) \frac{\partial r_i}{\partial p_j} $$

For all $p_j$ we can write the above in matrix form:

$$
\begin{equation}
\nabla f ({\bf p}) = 2\ {\bf J} ({\bf p})^T\ {\bf r} ({\bf p}) = {\bf d}
\label{eqn:dEquationLB}
\end{equation}
$$

$\nabla f (**p**)$ is a column vector of $\partial \chi^2/\partial p_j$, that is $\bf d$ in equation [Gauss-Newton Method](#eqn-hessiansolution), $**J**  (\bf p)$ is the Jacobian matrix of derivatives $\partial r_i/\partial p_j$ and $**r** (\bf p)$ a column vector of $r_i (**p**)$ terms.

The Hessian, **H**, can be computed by differentiating $\nabla f (**p**)$:

$$ \nabla^2 f (**p**)_{k l} = **H** = \frac{\partial^2 f (**p**)}{\partial p_{k} \partial p_l} =
   2 \sum_{i=1}^m \frac{\partial r_i (**p**)}{\partial p_k} \frac{\partial r_i (**p**) }{\partial p_l}
 + 2 \sum_{i=1}^m r_i (**p**) \frac{\partial^2 r_i (**p**)}{\partial p_k \partial p_l } $$

This expression can be reexpressed in matrix form as:

$$ **H** = 2 **J**(**p**)^T **J**(**p**) + 2 \sum_{i=1}^m r_i (**p**) \nabla^2 r_i (**p**) $$

Near the minimum, the residuals, $r_i$, will be small and therefore the second term can be ignored, resulting in a simplified Hessian:

$$
\begin{equation}
{\bf H} =  2\ {\bf J}({\bf p})^T {\bf J}({\bf p})
\label{eqn:HdEquationLB}
\end{equation}
$$

In this form the Hessian is much easier to compute, no second derivatives are required. Only the first derivatives in the Jacobian need be estimated. We can insert the various terms [Gauss-Newton Method](#eqn-dequationlb) and [Gauss-Newton Method](#eqn-hdequationlb) into equation [Gauss-Newton Method](#eqn-linearchi):

$$
\begin{align*}
0 &= {\mathbf d} + {\mathbf H}\ \delta \mathbf p \\[4pt]
0 &= 2\ {\bf J} ({\bf p})^T\ {\bf r} ({\bf p}) + 2\ {\bf J}({\bf p})^T {\bf J}({\bf p}) \delta\ \mathbf p \\[4pt]
0 &= {\bf J} ({\bf p})^T\ {\bf r} ({\bf p}) + {\bf J}({\bf p})^T {\bf J}({\bf p}) \delta\ \mathbf p
\end{align*}
$$

Rearranged we obtain the version that is often to be seen in the literature (we've dropped the $(**p**)$ for clarity) :

$$
\begin{equation}
{\bf J}^T {\bf J}\ \delta \mathbf p = -{\bf J}^T\ {\bf r}
\label{eqn:FinalGNEqn}
\end{equation}
$$

This is a linear set of equations which can be solved for $\delta \mathbf p$ which in turn can be used to update the parameter values in [Gauss-Newton Method](#eqn-hessiansolution). That is:

$$
\begin{equation}
\delta \mathbf p  = - [{\bf J}^T {\bf J}]^{-1}\ {\bf J}^T\ {\bf r}
\label{eqn:SolutionFinalGNEqn}
\end{equation}
$$

Equation [Gauss-Newton Method](#eqn-solutionfinalgneqn) constitutes the update strategy for the Gauss-Newton method. A number of points are worth mentioning. The method depends on an approximation of the Hessian which is only true near the minimum. Therefore the Gauss-Newton should not be used far from the minimum because it will likely fail to converge to the solution. This is in contrast to a gradient descent method where there is no requirement to be close to the minimum so long as there is a downward slope that can reach the minimum. A further problem with the Gauss-Newton method is the need for $**J**^T **J**$ to have full rank, this is required so that [Gauss-Newton Method](#eqn-finalgneqn) can be solved for $\bf p$. Rank deficiency will occur when there are correlations between parameters due to insufficient data. This is related to the identification problem. However, one of the chief advantages of the Gauss-Newton method is its very rapid convergence properties.

### Levenberg-Marquardt

In the last sections we discussed two approaches to finding the minimum. One approach (gradient descent) involved moving down the fitness landscape until we reached the minimum. One problem with this method is that in steep sections of the landscape the algorithm tends to move quickly while in more gradual inclines, the algorithm tends to move too slowly and convergence can take much longer. In the second approach, the Gauss-Newton method will only converge if the search is already close to the minimum, at which point convergence is very rapid.

These two methods appear complementary where each solves issues the other method has. It therefore seems natural to combine the methods, exploiting rapid descent far from the minimum using gradient descent and moving to the Gauss-Newton method when close to the solution. This is how a method called the **Levenberg-Marquardt method** works. The Levenberg-Marquardt employs a weighted mixture between the two types of searches [marquardt:1963, Pr88]. The first is a gradient search followed by a Gauss-Newton method.

In the first phase the method uses gradient descent so that we descend down the fitness landscape in a direction opposite (a positive gradient would take us uphill) to the local gradient. For the $(k+1)$ iteration, the parameters $p_i$ are changed according to:

\stateEquation{

$$
\begin{equation}
{\mathbf p}_{k+1} = {\mathbf  p}_{k} - \mu {\mathbf d}
\label{eqn:gradientdecent}
\end{equation}
$$

}

where the gradient ${\mathbf d}=\frac{\partial \chi^2}{\partial {\mathbf p}}$, and $\mu$ is the step size.

As we get closer to the minimum, we switch strategies and use the Gauss-Newton method. The combined approach can be described by equation [Levenberg-Marquardt](#eqn-lmequationa) where the value of $\mu$ is used to move from one strategy to the other:

$$
\begin{equation}
{\mathbf p}_{k+1} = {\mathbf p}_{k} - \left({\mathbf H}+ {\mathbf I} \mu\right)^{-1} {\mathbf d}
\label{eqn:LMEquationA}
\end{equation}
$$

If $\mu$ is large, the equation behaves as a gradient descent method [Levenberg-Marquardt](#eqn-gradientdecent):

$$ {\mathbf p}_{k+1} \approx {\mathbf p}_{k} - \frac{1}{\mu} {\mathbf d} $$

As $\mu$ decreases, the method moves to the Gauss-Newton method:

$$ {\mathbf p}_{k+1} \approx {\mathbf p}_{k} -  **H**^{-1} **d** $$

One last modification is necessary before we have the full Levenberg-Marquardt method. When using gradient decent, we are not using the curvature, $\mathbf H$. Marquardt suggested that some benefit could be obtained by incorporating the curvature during gradient decent. This means the step size can vary since the curvature changes and hence the algorithm can take longer steps in regions where the gradient is less, for example in a long shallow valley. In addition, the method is less likely to overshoot the minimum. The final Levenberg-Marquardt equation is given by:

\stateEquation{

$$
\begin{equation}
{\mathbf p}_{k+1} = {\mathbf p}_{k} - \left({\mathbf H}+ \text{diag} ({\mathbf H}) \mu\right)^{-1} {\mathbf d}
\label{eqn:LMEquationB}
\end{equation}
$$

}

Where $diag ({\mathbf H})$ represents a matrix that just contains the main diagonals of the Hessian. The algorithm starts by using gradient descent. If the error can be reduced, meaning it is successful, it decreases $\mu$. This starts to shift the method towards using the Gauss-Newton method. If the error increases then the $\mu$ is increased in value and the method shifts to using the gradient descent method. This process is continued until the change in $\chi^2$ is a very small number. A common strategy for changing $\mu$ is:

- Start $\mu$ with a value of 100 (uses the gradient descent initially)
- If the new chi-square is bigger than the previous chi-square, then $\mu = \mu \times 10$  (that is the method becomes more gradient descent like)
- If the new chi-square is less than or equal to the previous chi-square, then $\mu = \mu / 10$  (that is the method becomes more Gauss-Newton like)
- Goto 2

There are more sophisticated control strategies for changing $\mu$ that can be used if necessary [hansen2012least].

Overall the Levenberg-Marquardt method has proven a very successful approach. Its main drawback is that the method tends to find the nearest minimum which could easily be a local minimum. The method is therefore sensitive to starting conditions. For the surface shown in Figure [Figure: Example of a fitness landscape showing multiple minima ($M_a$ and $M_b](#fig-fittnesslandcape), if we start on the highest hill, the Levenberg-Marquardt will most likely find the nearest minimum, $M_a$, which is a local minimum not the global minimum. The Levenberg-Marquardt is better suited when combined with other methods. If a good starting point can be found, the Levenberg-Marquardt can take over and rapidly find the global minimum.

<!-- The Hessian can be approximated~\cite{stortelder1996} using the sensitivities: -->

<!-- $$\frac{\partial {S_i}^k (\mathbf p)}{\partial \mathbf p} $$ -->

<!-- such that: -->

<!-- \begin{equation} -->
<!-- H = \sum_{k=1}^{M} W_k \frac{\partial {S_i}^k -->
<!-- (\mathbf p)}{\partial \mathbf p} \frac{\partial {S_i}^k -->
<!-- (\mathbf p)}{\partial \mathbf p}, -->
<!-- \end{equation} -->

<!-- where it is assumed that the higher order derivative terms cancel out, because the residuals (difference between the fit and the data points) are assumed to be random. Hence, the computation of -->
<!-- the Hessian does not involve second derivatives and the first derivative terms can be obtained by finite differences. The calculation of the Hessian is often used for computing the confidence intervals (see later section). -->

There are a number of freely available open source implementations of the Levenberg-Marquardt method. There are two GPL licensed solvers, GSL(footnote: <http://www.gnu.org/software/gsl/>} and levmar(footnote: <http://users.ics.forth.gr/ lourakis/levmar/>}. To avoid the distribution restriction of the GPL licence, the lmfit library(footnote: <http://joachimwuttke.de/lmfit/>} is highly recommend (licensed under FreeBSD License). There are also a variety of Java versions available on the Web, a search using Levenberg-Marquardt java will locate many of them as well as implementations in other languages such as C#. Scripting languages such as R, Python (scipy package), and Matlab also support implementations of Levenberg-Marquardt. COPASI implements the Levenberg-Marquardt method as well and Tellurium has access to the algorithm via the scipy Python package.

### Simplex or Nelder and Mead

The Levenberg-Marquardt method requires the calculation of derivatives during each iteration which can be slow and not always easy. The following and remaining methods do not require derivatives which means they can be easier to implement. Moreover they are better at avoiding local minima and are more likely to find the global minimum.

The **simplex method**, as described by Nelder-Mead [nelder:1965], is a robust search method (i.e. it is generally tolerant of noisy data), in which the objective function, in our case $\chi^2$, is computed at several test points. The test point with the highest value for $\chi^2$ is replaced by another
point which has a lower value for $\chi_2$.

In a parameter space of $P$ dimensions, a $P+1$ dimensional geometrical object is created, called a { simplex}, with its vertices initialized to some starting values. In two dimensions a simplex is a triangle, in three dimensions its a tetrahedron, and so on.
 The $P+1$ vertices of the simplex are the points at which the objective function is evaluated. The simplex evolves by first trying to replace the worst point with a new point using either reflection, expansion or contraction. Each of these possibilities lies along a line that passes through the centroid of the simplex (Figure [Figure: Nelder and Mead Algorithm:](#fig-nelderandmeadrec)). Reflection is tried first. If the reflected result is better, then the reflection is expanded. If the reflected point is worse, then instead of a reflection a contraction is employed. If all three operations fail to reduce the objective function, a contraction along all faces towards the best point is carried out (Figure [Figure: Nelder and Mead Algorithm:](#fig-nelderandmeadcontract)). This process is summarized below:

- {The simplex reflects the worst point through the opposite face to a new point.}
- {If the reflection results in a better point, i.e. lower error, it is further stretched in that direction (expansion).}
- {If the reflection results in a worst point, abandon the reflection and contract the worst point towards the opposite face of the simplex.}
- {If all the above fails, contract along all faces towards the best point.}

**Figure** <a id="fig-nelderandmeadrec"></a> `fig:NelderAndMeadREC`

*Graphic (not in the LaTeX source, referenced by name): `NelderAndMeadREC`*

*Caption:* Nelder and Mead Algorithm: The worst point is either reflected (then expanded if the reflection is successful) or contracted along a line that passes through the simplex centroid. Thick lines represent the original simplex.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale=0.49]{NelderAndMeadREC}
\caption{Nelder and Mead Algorithm: The worst point is either reflected (then expanded if the reflection is successful) or contracted along a line that passes through the simplex centroid. Thick lines represent the original simplex.}
\label{fig:NelderAndMeadREC}
\end{figure}
```

**Figure** <a id="fig-nelderandmeadcontract"></a> `fig:NelderAndMeadCONTRACT`

*Graphic (not in the LaTeX source, referenced by name): `NelderAndMeadCONTRACT`*

*Caption:* Nelder and Mead Algorithm: If reflection, expansion and contraction fail to improve the objective function, the entire simplex is contracted towards the best point.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale=0.49]{NelderAndMeadCONTRACT}
\caption{Nelder and Mead Algorithm: If reflection, expansion and contraction fail to improve the objective function, the entire simplex is contracted towards the best point.}
\label{fig:NelderAndMeadCONTRACT}
\end{figure}
```

Figure [Figure: Nelder and Mead Algorithm:](#fig-nelderandmeadsimplexsearch) illustrates a simplex search involving multiple reflections, extensions and contractions(footnote: Modified from <http://mathfaculty.fullerton.edu/mathews/n2003/neldermead/NelderMeadMod/Links/NelderMeadMod_lnk_5.html>}.

**Figure** <a id="fig-nelderandmeadsimplexsearch"></a> `fig:NelderAndMeadSimplexSearch`

*Graphic (not in the LaTeX source, referenced by name): `NelderAndMeadExample`*

*Caption:* Nelder and Mead Algorithm: Example trace of a simplex looking for the minimum. The initial simplex is in bold.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale=0.5]{NelderAndMeadExample}
\caption{Nelder and Mead Algorithm: Example trace of a simplex looking for the minimum. The initial simplex is in bold.}
\label{fig:NelderAndMeadSimplexSearch}
\end{figure}
```

By successively evolving the simplex according to the previous rules, the simplex slowly makes its way along the fitness landscape(footnote: See <https://www.youtube.com/watch?v=HUqLxHfxWqU> for an animated example.}. The shape of the simplex adapts to the landscape, stretching and contracting. The simplex method can be quite successful unless the initial starting point is a very poor guess. The simplex can be assumed to have converged, either when it has converged to a very small region, or when there is no significant improvement in the error from one iteration to the next. The simplex method has the potential to find the global minimum because it can sample multiple points at once on the fitness surface. However, it can *easily* get trapped in a local minimum if the simplex is too small. Simulated annealing which is described in the next section avoids this scenario. In practice the simplex method should be repeated many times with different starting positions. The method is described in pseudocode below.

<!-- \lstset{language=Clean} -->
<!-- \begin{lstlisting}[mathescape=true] -->
<!-- 1. $n$ equals the number of parameters to fit -->
<!-- 2. Initialize parameter values, $\mathbf x$ -->
<!-- 3. Set $n+1$ equal to the number of points in the simplex -->
<!-- 4. Order the objective functions for the simplex points from low to high: -->
<!-- $f(x_1) \leq f (x_2) \leq \ldots f (x_{n+1}) $ -->
<!-- 5. Compute the centroid of the simplex, $\bar{x} = (\sum x_i)/(n+1)$ -->
<!-- 6. Reflect: Compute reflection points, $x_r$ using: -->
<!-- $x_r = \bar{x} + \alpha (\bar{x} - x_{n+1})$ -->
<!-- 7. If $f(x_1) \leq f(x_r) < f (x_n)$ then $x_{n+1} = x_r$. Goto step 12 -->
<!-- 8. Expand: if $f (x_r) < f(x_1)$ then compute expansion: -->
<!-- $x_e = \bar{x} + \gamma (x_r - \bar{x})$ -->
<!-- 9. If $f (x_e) < f(x_r)$ then -->
<!-- replace $x_{n+1}$ with $x_e$. Goto step 12 -->
<!-- else -->
<!-- replace $x_{n+1}$ with $x_r$. Goto step 12 -->
<!-- 10. Contract:  If $f(x_r) \geq f(x_n)$ then carry out a contraction between -->
<!-- $\bar{x}$ and which ever is the better, $x_{n+1}$ or $x_r$. -->
<!-- Outside: If $f(x_n) \leq f(x_r) < f(x_{n+1})$ then -->
<!-- $x_{oc} = \bar{x} + \beta (x_r - \bar{x})$ -->
<!-- If $f(x_{oc}) \leq f(x_r)$ then replace $x_{n+1}$ with $x_{oc}$ and goto 12 otherwise goto 11 -->
<!-- Inside: If $f(x_r) \geq f(x_{n+})$ then -->
<!-- $x_{ic} = \bar{x} + \beta (x_{n+1} - \bar{x})$ -->
<!-- if $(f(x_{ic}) < f(x_n)$, replace $x_n$ with $x_{ic}$ and goto 12 otherwise goto 11 -->
<!-- 11. Shrink entire simplex: $x = x + \frac{1}{2} (x_1 - x)$ -->
<!-- 12. Check termination, order $f(x)$ then if $f(x_{n+1}) - f(x_1) < \epsilon$ then Stop -->
<!-- 13. Goto 4 -->
<!-- \end{lstlisting} -->
<!-- \lstset{language=Jarnac} -->

- Let $n$ equal the number parameters, $x_i$ that we wish to fit
- Set the tolerance $\epsilon$ to decide when to exit the algorithm.
- Initialize the parameters to random values or values that might be considered in the region of the optimum.
- $f(x_i)$ is the value of the objective function at $x_i$.
- **Order:** Order $f(x_i)$ low to high (low being the best):

      $\qquad f(x_1) \leq f (x_2) \leq ... f (x_{n+1}) $ 

- **Centroid:** Compute the centroid of the simplex, $\bar{x} = (\sum x_i)/(n+1)$
- **Reflect:** Reflect the worse vertex over the centroid to give $x_r$ using:

      $\qquad x_r = \bar{x} + \alpha (\bar{x} - x_{n+1})$

    If $f(x_1) \leq f(x_r) < f (x_n)$ then replace the worst: $x_{n+1} = x_r$. Goto step 4

- **Expand:** if $f (x_r) < f(x_1)$ (i.e the reflection improved things) then compute expansion:

      $\qquad x_e = \bar{x} + \gamma (x_r - \bar{x})$

    If $f (x_e) < f(x_r)$ then (If the expansion improved things)

    replace $x_{n+1}$ with $x_e$. Return to step 4

   else (Just keep the reflection)

    replace $x_{n+1}$ with $x_r$. Return to step 4

- **Contract:** If there was no improvement during the reflection, then $f(x_r) \geq f(x_n)$ and there are two possibilities to consider. 

- **Outside:** If $f(x_n) \leq f(x_r) < f(x_{n+1})$ then (i.e. $f(x_r)$ is better than $f(x_{n+1})$)

    $\qquad x_{oc} = \bar{x} + \beta (x_r - \bar{x})$, goto 13

    If $f(x_{oc}) \leq f(x_r)$ then replace $x_{n+1}$ with $x_{oc}$ and return to step 4 otherwise goto **Shrink**

- **Inside:** If $f(x_r) \geq f(x_{n+1})$ then

      $\qquad x_{ic} = \bar{x} + \beta (x_{n+1} - \bar{x})$, goto 13

     if $(f(x_{ic}) < f(x_n)$, replace $x_n$ with $x_{ic}$ and goto 4 otherwise goto **Shrink**

- **Shrink:** Shrink the simplex towards $x_1$: $x_i = x_1 + \frac{1}{2} (x_i - x_1)$ and return to 3 ($i = 2,3,...,n+1$).

- If $f(x_{n+1}) - f(x_1) > \epsilon$ then return to 4, else terminate.

Implementations of the simplex algorithm are available from a number of sources. The GPL GSL library <http://www.gnu.org/software/gsl/> has an implementation. An unrestricted licence version is available from <http://www.mikehutt.com/neldermead.html>. Versions exist for most of the common computer languages.

One advantage of the simplex method is that it is not very difficult to implement (unlike the Levenberg-Marquardt algorithm, based on the author's own experience). Most scripting languages, including Scipy for Python(footnote: <http://docs.scipy.org/doc/scipy/reference/tutorial/optimize.html>} and Java, have implementations available. COPASI also implements the Nelder and Mead method and Tellurium as asses to the method via the Python scipi library. The method has continued to be developed with some of the more recent modifications found in Singer et al. [singer2004].

### Simulated Annealing

The simulated annealing method derives its name from thermal physics where the minimization of $\chi^2$ is equivalent to the way a system, such as a metal, reaches its lowest state as it slowly cools [kirkpatrick1983optimization]. At a given temperature, the atoms of the metal collide with each other so that the energy of the system is continually being redistributed. As the temperature is slowly reduced, the atoms begin to form a crystalline structure and eventually reach the minimum energy state. The metal has to be cooled slowly, or else pockets, where the metal is in a higher energy state than neighboring regions, can form. The idea has been used to implement an optimization algorithm called simulated annealing. For optimization problems the algorithm works in the following way: given an initial state $i$, which in our case would be a set of parameters, the system jumps to another state $i+1$, with the Boltzmann probability:

$$
\begin{equation}
\exp{\frac{(\chi^2_i-\chi^2_{i+1})}{T}}
\label{eqn:Boltzmann}
\end{equation}
$$

where $T $ is the *temperature*. For example, if $\chi^2_{i+1}$ is lower than $\chi^2_{i}$, the expression will always be greater than one, so we will always jump to the new solution. However if $\chi^2_{i+1}$ is bigger then $\chi^2_{i}$, the probability of accepting the new state is less than one and it is possible to actually accept the worse state, effectively going uphill. Going uphill may seem counterproductive, but it allows the algorithm to potentially jump out from local minima and eventually find the global minimum. The higher the temperature the more likely the algorithm will move uphill, therefore the temperature is slowly lowered so that the chance of going uphill reduces.

<!-- \begin{figure}[h] -->
<!-- \begin{center} -->
<!-- \includegraphics[scale=0.5]{Figure3.eps} -->
<!-- \end{center} -->
<!-- \caption{A cartoon showing how the optimization procedure that -->
<!-- uses simulated annealing can jump out of a local minima by -->
<!-- accepting steps of higher energy (higher value of $\epsilon$)} -->
<!-- \end{figure} -->

At a given temperature the system must be given enough time to sample all the configurations which are accessible using equation [Simulated Annealing](#eqn-boltzmann). There is no simple way to design temperature scheduling (i.e. temperature as a function of time/iterations) and several methods exist depending on the problem at hand. One way is to follow the algorithm as described in [marquardt:1963, Pr88], where the authors consider an adaptation of the simplex method. The author's own experience with this approach has been successful. COPASI implements a version of simulated annealing.

**Figure** <a id="fig-nelderandmead"></a> `fig:NelderAndMead`

*Graphic (not in the LaTeX source, referenced by name): `simAnnealing`*

*Caption:* In the simulated annealing algorithm, jumps can be towards or away from a minimum. This allows the algorithm to move away from local minima.

```latex
\begin{figure}[H]
\begin{center}
  \includegraphics[scale=0.7]{simAnnealing}
\end{center}
\caption{In the simulated annealing algorithm, jumps can be towards or away from a minimum. This allows the algorithm to move away from local minima.}
\label{fig:NelderAndMead}
\end{figure}
```

The basic simulated annealing algorithm is described in the code below:

\lstset{language=Clean}

```python
1. Initialize parameter values, $\mathbf p$
2. Initialize the temperature, T
3. Calculate the chi-square, $\chi^2_{i}$, at the
   current parameter values $\mathbf p_i$
4. Make small random changes, $\Delta \mathbf p$ to $\mathbf p_i$
5. Set $\mathbf p_{i+1} = \mathbf p_i + \Delta \mathbf p$
6. Calculate the new chi-square, $\chi^2_{i+1}$
7. Calculate $\Delta \chi^2 = \chi^2_{i+1} - \chi^2_i$
8. If $\Delta \chi^2 \leq 0$ then accept the new state
9. If $\Delta \chi^2 > 0$ then
       Generate uniform random number, $u$
       If $u < e^{-\Delta \chi^2/T}$ then
          Accept state
       else
          Restore previous state, $\mathbf p_i$
20. Reduce the temperature, $T = T - \varepsilon_T$
21. If $T < 0$ or exceeded Max Iterations then
       exit
21. Goto to Step 3.
```

\lstset{language=Jarnac}

The GPL GSL library(footnote: <http://www.gnu.org/software/gsl/>} has an implementation of simulated annealing and has been successfully used by the author. An unrestricted licensed version in C# is available(footnote: <http://www.codeproject.com/Articles/13789/Simulated-Annealing-Example-in-C>} and a C version(footnote:  <http://www.cs.sunysb.edu/ skiena/algorist/book/programs/>}.

### Genetic Algorithm

A genetic algorithm (GA) is an optimization technique that mimics natural evolution. GAs are motivated by natural biological processes such as selection, crossover and mutation. The Schema theorem of Holland [Goldberg1989genetic] addresses these intuitive notions, and demonstrates that these operations serve to increase the fitness of a population. In our case we will consider real value coded GAs, where the `genes' are real with nonnegative kinetic parameters. We start with a random population of individuals where an individual is a model with a given set of parameters, i.e. `genes'. The fitness of each individual in the population is measured by its chi-square value. Various approaches are employed to decide which individuals will be carried over to the next generation. Only a proportion of the population survives this transition so the population needs to be rebuilt back to its original size. It is the process of rebuilding, via replication and mutation of the survivors, that results in new individuals. Such new individuals could, by chance, have improved fitness. This process repeats over a number of generations. COPASI implements a genetic algorithm optimization method. Interestingly there doesn't appear to be genetic algorithm implemented in the Python scipy package. In the authors experience, writing effective genetic algorithm software is not easy and the success is markedly dependant on how the algorithm is implemented as there are many possible variants to the approach.

### Selection

There are various ways in which selection can takes place, these include elitism, tournament selection, or roulette wheel selection. In tournament selection random pairs of individuals are made to play a tournament and the winner is decided based on which is fitter. This ensures that even bad individuals can get selected into the next generation and helps prevent premature convergence. Elitism is where the top 20% or more of the fittest individuals are passed on to the next generation. Roulette selection is where the probability of picking out an individual from the population is based on the fitness of the individual. One or more of these strategies can be used to pick the next generation.

### Crossover

Some GAs use crossover as a means to shuffle variation between individuals in a population. In crossover, two parents exchange genetic material. This mechanism offers the chance to bring two favorable traits together into one individual. Crossover also serves to spread beneficial mutations over a population.

The selected parents can be crossed over [Herrera1998tackling] using an arithmetic mean defined in the following way. Assuming we represent the parents as:

$$ p_1=(p_1^1, p_1^2,  p_1^3,  ...)\quad  and \quad p_2=(p_2^1,  p_2^2,  p_2^3,  ...) $$

where the $p_i^j$ term is related to the $j^{th}$ parameter in the $i^{th}$ parent. The crossover between $p^1$ and $p^2$ will generate two children, $\beta_1$ and $\beta_2$, such that:

$$
\begin{equation}
\begin{aligned}
\beta_1^i &= \lambda_i p_1^i +(1-\lambda_i) p_2^i \\
\beta_2^i &= \lambda_i p_2^i +(1-\lambda_i) p_1^i
\end{aligned}
\end{equation}
$$

where $\lambda$ is a uniform random number between -0.5 and 1.5. The wider range allows a larger region of parameter space to be explored as new points may lie outside the line joining the parents.

### Mutation

Mutation is a vital part of any GA as it is the one technique that allows entirely new traits to enter into the population. For a random number of individuals, one parameter, $p^i$, will be randomly selected and changed according to:

$$
\begin{equation}
{p}^i = z~p_{max}^i
\end{equation}
$$

where $z={ random}  [0,1]$, is uniformly distributed, and
$p^i_{max}$ is the maximum possible value of the $i$
component of the parameter set. We must of course ensure that $p^i_{max}$ is finite.

### General Scheme

**Figure** <a id="fig-geneticalgorithmb"></a> `fig:GeneticAlgorithmB`

*Graphic (not in the LaTeX source, referenced by name): `geneticAlgorithmB.pdf`*

*Caption:* Basic flowchart for a genetic algorithm, though many variants exist. 

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale=0.7]{geneticAlgorithmB.pdf}
\caption{Basic flowchart for a genetic algorithm, though many variants exist. }
\label{fig:GeneticAlgorithmB}
\end{figure}
```

An example scheme is shown in Figure [Figure: Basic flowchart for a genetic algorithm, though many variants exist](#fig-geneticalgorithmb) and a flowchart describing tournament selection is given in Figure [Figure: Tournament selection is one strategy used for selecting individuals fo](#fig-geneticalgorithmc).

**Figure** <a id="fig-geneticalgorithmc"></a> `fig:GeneticAlgorithmC`

*Graphic (not in the LaTeX source, referenced by name): `geneticAlgorithmC.pdf`*

*Caption:* Tournament selection is one strategy used for selecting individuals for the next generation.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale=0.75]{geneticAlgorithmC.pdf}
\caption{Tournament selection is one strategy used for selecting individuals for the next generation.}
\label{fig:GeneticAlgorithmC}
\end{figure}
```

The operations of crossover and mutation occur with certain adjustable probabilities. However the mutation rate is generally a small number, $ < 0.05$. Mutations allow the system to explore new regions, whereas crossovers spread these mutations over the population. If the mutation rate is very high, large regions will be explored. However individuals may not survive into the next generation because the search is much too exploratory and not enough information about the landscape has been exploited by crossovers.

Once there is little improvement in the fitness from one generation to the next, the computation can be stopped. COPASI implements a range of genetic algorithms, including the more effective genetic algorithm with stochastic ranking. COPASI also implements variants such as evolutionary programming and evolutional strategy (SRES) approaches (consult the COPASI documentation for details). The scipy Python package supports one related genetic algorithm like approach called differential evolution which we describe next.

### Differential Evolution

The final optimization method to discuss is the differential evolution (DE) algorithm. Like the genetic algorithm optimization method, DE is an evolutionary type method developed by Storn and Price in 1996 [storn1997differential]. DE has a number of key advantages, it is relatively simple to implement, it is fast, does not use derivatives, and is easily parallelized. DE uses mutation as the search mechanism by linearly combining individuals in a population in an attempt to create fitter offspring. This results in a remarkably effective method.

The basic algorithm is (Also shown in Figure [Figure: Outline of the Differential Evolution Algorithm](#fig-differentialevolutionscheme)):

\lstset{language=Clean}

```python
1. Create space for two populations, one a working population
   and a second temporary store for recording new individuals
   in the population loop.
2. Create a working population where individuals have randomly
   assigned parameter values.
3. Start a generation loop.
4.   Start a loop for all $i$ individuals in the working population
5.     Create an $i^{\text{th}}$ mutant linear combination from three
       randomly selected individuals.
6.     Copy the ith mutant into the temporary population
       store depending on random crossover, else copy over
       the $i^{\text{th}}$ individual from the working population.
7.     Continue to the next individual in the population.
8.   Copy the temporary store to the working population.
9.   Next generation, stop if fittest is better than a threshold value.
```

\lstset{language=Jarnac}

**Figure** <a id="fig-differentialevolutionscheme"></a> `fig:DifferentialEvolutionScheme`

*Graphic (not in the LaTeX source, referenced by name): `DifferentialEvolutionScheme.pdf`*

*Caption:* Outline of the Differential Evolution Algorithm.

```latex
\begin{figure}[htbp]
\centering
    \includegraphics[scale = 0.35]{DifferentialEvolutionScheme.pdf}
    \vspace{-10mm}
\caption{Outline of the Differential Evolution Algorithm.} \label{fig:DifferentialEvolutionScheme}
\end{figure}
```

In this scheme an individual in a population is a vector containing the values for the parameters of the model. If for example a model has twelve parameters to fit, then an individual
is a vector of size twelve. The key to the method is computing a linear combination of individuals to produce a new candidate, or mutant individual. The linear combination is given by:

$$ new candidate = x_1 + F (x_2 - x_3) $$

where $x_1, x_2$ and $x_3$ are individuals randomly drawn from the population and $F$ is called the mixing factor. In practice the $x$ terms are vectors so that the linear combination is a vector calculation. The second part of the algorithm must decide whether the new candidate will be passed to the next generation or not. This is done by combining, via crossover, the mutant with another individual from the population. In practice the algorithm iterates through every individual in the population, for example at the $i^{th}$ individual, create a linear combination to generate a new candidate and combine the mutant via crossover with the $i^{th}$ individual. If there is no crossover the $i^{th}$ individual is kept for the next generation. All candidates that went through crossover are compared to the corresponding $i^{th}$ individual in the original population, if the crossover individual is fitter then it is copied to the next generation, otherwise the original is kept.

There are a number of variations on the basic DE algorithm. One variant is to use islands. This allows multiple populations to evolve independently with a limited degree of migration between islands and allows alternative solutions to be explored while at the same time solutions may be merged leading to further improvements. In the appendix (Listing `python:chap:diffevolution`) a Python implementation of island based differential evolution is given and an example that uses the code to fit an oscillatory model is provided in the example section.

A more detailed description of the algorithm is described in the listing shown below. Rules of thumb have been devised for setting mutation and cross-over probabilities and these are listed below and in the Python code in the appendix (Listing `python:chap:diffevolution`).

<!-- \lstset{language=Clean} -->
<!-- \begin{lstlisting}[mathescape=true] -->
<!-- 1.  Set crossover rate: CR = 0.6 -->
<!-- 2.  Set the mixing factor: F = 0.8 -->
<!-- 3.  Set number of parameters = P -->
<!-- 3.  Create an initial random population of individuals -->
<!-- 4.  Iterate through each individual, $x_i$, in the population -->
<!-- 5.     Pick two other individuals, $a$ and $b$ from the population -->
<!-- 6.     Compute a mutated individual using: $\text{mutant} = x + F (a - b)$ -->
<!-- 7.     Compute a trial individual, $u$, from the mutant by crossover: -->
<!-- Generate a randomIndex between 1 and P -->
<!-- For each parameter, $j$ -->
<!-- Generate a uniform random number, $r_j$ -->
<!-- if $r_j \leq CR$ or (i = randomIndex) -->
<!-- $u_j = \text{mutant}_i$ -->
<!-- else -->
<!-- $u_j = x_i$ -->
<!-- 8.     If the $\text{fitness} (u) > \text{fitness} (x)$ then $x = u$. -->
<!-- 9.  Continue to the next individual $x_{i+1}$, in the population -->
<!-- 10. Increment the generation number -->
<!-- 11. Reached terminating criterion? No, then goto 4 -->
<!-- \end{lstlisting} -->
<!-- \lstset{language=Jarnac} -->

\lstset{language=Clean}

```python
1.  Set crossover rate: CR = 0.6
2.  Set the mixing factor: F = 0.8
3.  Set number of parameters = P
3.  Create an initial random population of individuals
4.  Create space, $u$ to hold the potential new population
4.  Iterate through each individual, $x_i$, in the population
5.     Pick three unique individuals, $a$, $b$ and $c$ from the population
       ($i$ should not be a choice for the random number)
6.     Compute a mutated individual using: $\text{mutant} = c + F (a - b)$
7.     Compute a trial individual, $u$, from the mutant by crossover:
          Generate a randomIndex between 1 and P
          For each parameter, $j$
             Generate a uniform random number, $r_j$
             if $r_j \leq CR$ or (i = randomIndex)
                  $u_{ij} = \text{mutant}_i$
             else
                  $u_{ij} = x_i$
8.  For all $i$, if the $\text{fitness} (u_i) > \text{fitness} (x_i)$ then $x_i = u_i$.
9.  Continue to the next individual $x_{i+1}$, in the population
10. Increment the generation number
11. Sort the population, is the fittest individual less than tolerance?
    No, then goto 4
```

\lstset{language=Jarnac}

Although relatively simple, differential evolution has turned out to be a remarkably effective approach. Of all the methods described, differential evolution and simulated annealing are probably the most effective. As with all optimizer methods, they should be repeated many times in order to be sure that the global minimum has been located.

### Combining Global and Local Search

Some optimization methods are considered local, whereas others are global. The Levenberg-Marquardt is a local method because given a starting point, it can usually only find the nearest minimum. Other methods such as genetic algorithms or simulated annealing are considered global because they tend to search across the entire fitness landscape, sampling many regions.

Combining a local search within a global search algorithm is a very attractive possibility. A global search can be used to provide an initial seed point. The search will converge to a point where a local search can then begin. One strategy is to conduct a global search and take the two best individuals and use them as initial conditions for a local search. The two individuals resulting from the local search are put back into the main population and the entire procedure starts again. This can be repeated until the population has converged.

### Optimization Example

To illustrate the use of optimization, let us consider fitting data to a simple model that displays oscillatory behavior. We will use a simple oscillator model which arises from positive feedback and is based on the Heinrich model [HRR77]. The model was simulated and random noise added to the time series to produce noisy data which we will call the experimental data. This data is shown in Figure [Figure: Simulated experimental data for the Heinrich relaxation oscillator](#fig-noisyheinrich). Noise was drawn from a Gaussian distribution with mean zero and a standard deviation of 10% of the $y$ value.

**Figure** <a id="fig-noisyheinrich"></a> `fig:noisyHeinrich`

*Caption:* Simulated experimental data for the Heinrich relaxation oscillator.

```latex
\begin{figure}
\centering
\begin{tikzpicture}
\begin{axis}[
xmin=0,
xmax=10,
ymin=0,
ymax=4,
width=9.5cm,
height=6cm,
xlabel=Time,
ylabel style={align=center}, ylabel=Concentration]
\addplot[fill=cyan,color=cyan,only marks,mark size=1.2,mark=square*] coordinates {
(0.204081632653061, 1.37948552013361) (0.408163265306122, 2.56501996900708) (0.612244897959184, 2.57199204231195) (0.816326530612245, 2.32036467749753)
(1.02040816326531, 2.69635121677646) (1.22448979591837, 3.11221445715275) (1.42857142857143, 3.47240678967424) (1.63265306122449, 3.35122158184964)
(1.83673469387755, 2.48823439899836) (2.04081632653061, 2.41851003383347) (2.24489795918367, 2.1630640188555) (2.44897959183673, 2.33558504795582)
(2.6530612244898, 2.37423822481623) (2.85714285714286, 2.32123933271246) (3.06122448979592, 2.68540681301972) (3.26530612244898, 2.83603881521584)
(3.46938775510204, 2.8043202586406) (3.6734693877551, 3.13799166199256) (3.87755102040816, 2.87405319801024) (4.08163265306122, 2.90996889007799)
(4.28571428571428, 2.38653625783636) (4.48979591836734, 2.78705529797711) (4.69387755102041, 2.55842116618008) (4.89795918367347, 2.78545440252816)
(5.10204081632653, 2.54853177679625) (5.30612244897959, 2.6142478578951) (5.51020408163265, 2.43529217355015) (5.71428571428571, 2.66556964071414)
(5.91836734693877, 2.52405523494027) (6.12244897959183, 2.87998371338018) (6.32653061224489, 2.82737861056071) (6.53061224489795, 2.63902760340577)
(6.73469387755102, 3.16277983026602) (6.93877551020408, 2.30555480802893) (7.14285714285714, 2.82115920463046) (7.3469387755102, 2.55488821820249)
(7.55102040816326, 2.91785162028938) (7.75510204081632, 2.86203490561785) (7.95918367346938, 2.98037139009764) (8.16326530612244, 2.06653317391209)
(8.3673469387755, 2.63753041262033) (8.57142857142857, 2.46582056768564) (8.77551020408163, 2.90971196851472) (8.97959183673469, 3.00253285906569)
(9.18367346938775, 2.48478885632812) (9.38775510204081, 2.83635667565277) (9.59183673469387, 2.54155272479282) (9.79591836734693, 2.89128949046374)
(9.99999999999999, 3.42546904987005)  };

%
\addplot[fill=orange,color=orange,only marks,mark size=1.6,mark=square*] coordinates {
(0.204081632653061, 0.204878667859313) (0.408163265306122, 0.356813801968841) (0.612244897959184, 0.480149953835653) (0.816326530612245, 0.599705033911425)
(1.02040816326531, 0.637483054466981) (1.22448979591837, 0.603181169513114) (1.42857142857143, 0.843916688341954) (1.63265306122449, 0.797150618533637)
(1.83673469387755, 0.828507087296936) (2.04081632653061, 0.979341538117332) (2.24489795918367, 1.02456965938981) (2.44897959183673, 0.84739061452557)
(2.6530612244898, 1.19788417344321) (2.85714285714286, 1.01748142027802) (3.06122448979592, 1.02410560130149) (3.26530612244898, 0.557713054759436)
(3.46938775510204, 0.748973851862082) (3.6734693877551, 0.735177787136091) (3.87755102040816, 0.809671878470953) (4.08163265306122, 0.890128743688519)
(4.28571428571428, 0.754222698940013) (4.48979591836734, 0.948944959705247) (4.69387755102041, 1.07507382123163) (4.89795918367347, 0.797295237417561)
(5.10204081632653, 0.914314213882636) (5.30612244897959, 0.940683485672211) (5.51020408163265, 0.909454281016711) (5.71428571428571, 0.878296865995703)
(5.91836734693877, 0.593886292782444) (6.12244897959183, 0.708353194995484) (6.32653061224489, 0.612720258828507) (6.53061224489795, 0.896160330480006)
(6.73469387755102, 0.754020206479683) (6.93877551020408, 0.723859457844448) (7.14285714285714, 0.905675405725853) (7.3469387755102, 0.897426099326578)
(7.55102040816326, 0.89922901935907) (7.75510204081632, 0.946223549443832) (7.95918367346938, 0.716927691810826) (8.16326530612244, 0.859338976325967)
(8.3673469387755, 0.918811911814241) (8.57142857142857, 0.947556511397518) (8.77551020408163, 0.715171549670063) (8.97959183673469, 0.813752501483566)
(9.18367346938775, 0.720623835846753) (9.38775510204081, 0.73151566168882) (9.59183673469387, 0.848214775010747) (9.79591836734693, 0.667005482849732)
(9.99999999999999, 0.838270415186178)  };
%
\end{axis}
\end{tikzpicture}
\caption{Simulated experimental data for the Heinrich relaxation oscillator.}
\label{fig:noisyHeinrich}
\end{figure}
```

The following model was fitted to the experimental data:

$$
\begin{align*}
\frac{dy_1}{dt} &=  p_0 - y_1 - (p_1 y_1) (1 + p_4\ (y_2)^{4}) \\[8pt]
\frac{dy_2}{dt} &= (p_1 y_1) (1 + p_4 (y_2)^{4}) - y_2 p_6
\end{align*}
$$

Differential evolution was used to fit the model because it was found to be the most effective method for this problem. It is worth noting that the Levenberg-Marquardt method was unable to fit this model to the data. A genetic algorithm based optimizer could fit the model, but only about 20% of the time.

In the differential evolution method, parameters were randomly assigned between 0 and 10 for each individual in the population. Only thirty individuals for the population were needed to achieve a successful fit. Four parameters were fitted, $p_0, p_1, p_4$ and $p_6$. The Python code for this computation is given in the Appendix at the end of the chapter (Listing `python:chap:diffevolution`).

**Figure** <a id="fig-noisyheinrichfitness"></a> `fig:noisyHeinrichFitness`

*Caption:* Plot showing the progress of the optimization using differential evolution. Smaller numbers indicate a better fit. The fitness was plotted on a log axis to illustrate the very small number of steps that were taken after the initial large drop in fitness.

```latex
\begin{figure}
\centering
\begin{tikzpicture}
\begin{semilogyaxis}[
xmin=0,
xmax=300,
ymin=0,
ymax=80,
width=9cm,
height=6.5cm,
xlabel=Generation,
ylabel style={align=center}, ylabel=Fitness]
\addplot[color=darkgreen,very thick,mark=none] coordinates {
(1,72.838) (2,53.15) (3,53.15) (4,49.913) (5,44.822) (6,44.822) (7,4.536) (8,4.536) (9,4.536) (10,4.536) (11,4.536)
(12,4.536) (13,	4.536) (14,	4.536) (15,	4.536) (16,	4.536) (17,	4.536) (18,	4.536) (19,	4.536) (20,	4.536) (21,	4.536)
(22,4.536) (23,	4.536) (24,	4.536) (25,	3.713) (26,	3.713) (27,	3.713) (28,	3.713) (29,	3.713) (30,	3.713) (31,	3.713)
(32,3.713) (33,	3.713) (34,	3.713) (35,	3.713) (36,	3.713) (37,	3.713) (38,	3.713) (39,	2.556) (40,	2.556) (41,	2.556)
(42,2.556) (43,	2.556) (44,	2.556) (45,	2.556) (46,	2.556) (47,	2.556) (48,	2.556) (49,	2.556) (50,	2.556) (51,	2.556)
(52,2.556) (53,	2.556) (54,	2.465) (55,	2.465) (56,	1.489) (57,	1.489) (58,	1.489) (59,	1.489) (60,	1.489) (61,	1.408)
(62,1.408) (63,	1.408) (64,	1.408) (65,	1.408) (66,	1.408) (67,	1.408) (68,	1.408) (69,	1.408) (70,	1.408) (71,	1.408)
(72,1.408) (73,	1.408) (74,	1.408) (75,	1.408) (76,	1.408) (77,	1.408) (78,	1.408) (79,	1.408) (80,	1.408) (81,	1.252)
(82,1.252) (83,	1.252) (84,	1.252) (85,	1.252) (86,	1.252) (87,	1.252) (88,	1.252) (89,	1.252) (90,	1.252) (91,	1.252)
(92,1.252) (93,	1.252) (94,	1.252) (95,	1.252) (96,	1.252) (97,	1.252) (98,	1.252) (99,	1.168) (100	1.168) (101	1.168)
(102,1.168) (103,0.994) (104,0.994) (105,0.994) (106,	0.994) (107,0.994) (108,0.994) (109,0.994) (110,0.994) (111,0.994)
(112,	0.994) (113,0.994) (114,0.994) (115,0.994) (116,0.994) (117,0.994) (118,0.994) (119,0.994) (120,0.803) (121,0.803)
(122,	0.803) (123,0.803) (124,0.803) (125,0.803) (126,0.803) (127,0.803) (128,0.803) (129,0.803) (130,0.614) (131,0.614)
(132,	0.614) (133,0.614) (134,0.614) (135,0.614) (136,0.614) (137,0.614) (138,0.614) (139,0.614) (140,0.614) (141,0.614)
(142,	0.614) (143,0.614) (144,0.614) (145,0.614) (146,0.614) (147,0.614) (148,0.614) (149,0.614) (150,0.614) (151,0.614)
(152,	0.614) (153,0.614) (154,0.614) (155,0.614) (156,0.581) (157,0.581) (158,0.581) (159,0.516) (160,0.516) (161,0.516)
(162,	0.516) (163,0.516) (164,0.516) (165,0.516) (166,0.516) (167,0.516) (168,0.516) (169,0.516) (170,0.516) (171,0.277)
(172,	0.277) (173,0.277) (174,0.243) (175,0.243) (176,0.243) (177,0.243) (178,0.243) (179,0.243) (180,0.243) (181,0.243)
(182,	0.243) (183,0.243) (184,0.243) (185,0.243) (186,0.243) (187,0.243) (188,0.243) (189,0.243) (190,0.243) (191,0.243)
(192,	0.243) (193,0.243) (194,0.243) (195,0.243) (196,0.243) (197,0.243) (198,0.243) (199,0.243) (200,0.243) (201,0.243)
(202,	0.243) (203,0.243) (204,0.243) (205,0.243) (206,0.243) (207,0.243) (208,0.243) (209,0.243) (210,0.243) (211,0.243)
(212,	0.243) (213,0.243) (214,0.243) (215,0.243) (216,0.243) (217,0.243) (218,0.243) (219,0.243) (220,0.243) (221,0.243)
(222,	0.243) (223,0.243) (224,0.243) (225,0.243) (226,0.243) (227,0.243) (228,0.243) (229,0.243) (230,0.243) (231,0.234)
(232,	0.234) (233,0.234) (234,0.234) (235,0.234) (236,0.234) (237,0.234) (238,0.234) (239,0.234) (240,0.234) (241,0.234)
(242,	0.234) (243,0.234) (244,0.234) (245,0.234) (246,0.234) (247,0.234) (248,0.234) (249,0.234) (250,0.234) (251,0.234)
(252,	0.234) (253,0.234) (254,0.234) (255,0.234) (256,0.234) (257,0.234) (258,0.234) (259,0.234) (260,0.234) (261,0.234)
(262,	0.234) (263,0.234) (264,0.234) (265,0.234) (266,0.139) (267,0.139) (268,0.082) (269,0.082) (270,0.082) (271,0.082)
(272,	0.082) (273,0.082) (274,0.082) (275,0.082) (276,0.082) (277,0.082) (278,0.082) (279,0.082) (280,0.082) (281,0.082)
(282,	0.082) (283,0.082) (284,0.082) (285,0.082) (286,0.082) (287,0.082) (288,0.082) (289,0.082) (290,0.082) (291,0.082)
(292,	0.082) (293,0.082) (294,0.082) (295,0.082) (296,0.082) (297,0.082) (298,0.082) (299,0.082) (300,0.082) (301,0.082)
(302,	0.082) (303,0.082) (304,0.082) (305,0.082) (306,0.082) (307,0.082) (308,0.082) (309,0.082) (310,0.082) (311,0.082)
(312,	0.082) (313,0.082) (314,0.082) (315,0.082) (316,0.08) (317,	0.08) (318,	0.08) (319,	0.08) (320,	0.08) (321,	0.08)
(322,	0.08) (323,0.08) (324,0.08) (325,0.08) (326,0.08) (327,0.08) (328,0.08) (329,0.08) (330,0.08) (331,0.08)
(332,	0.08) (333,0.08) (334,0.08) (335,0.08) (336,0.08) (337,0.08) (338,0.08) (339,0.08) (340,0.08) (341,0.08)
(342,	0.08) (343,0.08) (344,0.08) (345,0.08) (346,0.08) (347,0.08) (348,0.08) (349,0.08) (350,0.08)
};
\end{semilogyaxis}
\end{tikzpicture}
\caption{Plot showing the progress of the optimization using differential evolution. Smaller numbers indicate a better fit. The fitness was plotted on a log axis to illustrate the very small number of steps that were taken after the initial large drop in fitness.}
\label{fig:noisyHeinrichFitness}
\end{figure}
```

Figure [Figure: Plot showing the progress of the optimization using differential evolu](#fig-noisyheinrichfitness) shows the progress of the fitness during the optimization. The smaller the number, the better the fit. At the beginning the fitness dropped rapidly. The fitness data was plotted on a log y-axis to show the number of smaller steps taken near the end of the optimization. The result of the fit, superimposed on the simulated experimental data, is shown in Figure [Figure: Simulated experimental data and fitted curve:](#fig-heinrichfit). The fit has managed to capture the correct dynamics even though the data is very noisy. As mentioned before other optimization algorithms such as Levenberg-Marquardt and even the genetic algorithm found this model difficult to optimize. In practice, a variety of fitting methods should be tried until a satisfactory fit is obtained. Sometimes a method that works well in one data set can fail on data sets for other models.

**Figure** <a id="fig-heinrichfit"></a> `fig:HeinrichFit`

*Caption:* Simulated experimental data and fitted curve: Fitted parameters (actual in brackets): $p_0= 6.77 (7), p_1 = 1.01 (1), p_4=1.26 (1), p_6=5.11 (4.96)$.

```latex
\begin{figure}
\centering
\begin{tikzpicture}
\begin{axis}[
xmin=0,
xmax=10,
ymin=0,
ymax=4,
width=10cm,
height=7.5cm,
xlabel=Time,
ylabel style={align=center}, ylabel=Concentration]
\addplot[fill=cyan,color=cyan,only marks,mark size=1.4,mark=square*] coordinates {
(0.204081632653061, 1.37948552013361) (0.408163265306122, 2.56501996900708) (0.612244897959184, 2.57199204231195) (0.816326530612245, 2.32036467749753)
(1.02040816326531, 2.69635121677646) (1.22448979591837, 3.11221445715275) (1.42857142857143, 3.47240678967424) (1.63265306122449, 3.35122158184964)
(1.83673469387755, 2.48823439899836) (2.04081632653061, 2.41851003383347) (2.24489795918367, 2.1630640188555) (2.44897959183673, 2.33558504795582)
(2.6530612244898, 2.37423822481623) (2.85714285714286, 2.32123933271246) (3.06122448979592, 2.68540681301972) (3.26530612244898, 2.83603881521584)
(3.46938775510204, 2.8043202586406) (3.6734693877551, 3.13799166199256) (3.87755102040816, 2.87405319801024) (4.08163265306122, 2.90996889007799)
(4.28571428571428, 2.38653625783636) (4.48979591836734, 2.78705529797711) (4.69387755102041, 2.55842116618008) (4.89795918367347, 2.78545440252816)
(5.10204081632653, 2.54853177679625) (5.30612244897959, 2.6142478578951) (5.51020408163265, 2.43529217355015) (5.71428571428571, 2.66556964071414)
(5.91836734693877, 2.52405523494027) (6.12244897959183, 2.87998371338018) (6.32653061224489, 2.82737861056071) (6.53061224489795, 2.63902760340577)
(6.73469387755102, 3.16277983026602) (6.93877551020408, 2.30555480802893) (7.14285714285714, 2.82115920463046) (7.3469387755102, 2.55488821820249)
(7.55102040816326, 2.91785162028938) (7.75510204081632, 2.86203490561785) (7.95918367346938, 2.98037139009764) (8.16326530612244, 2.06653317391209)
(8.3673469387755, 2.63753041262033) (8.57142857142857, 2.46582056768564) (8.77551020408163, 2.90971196851472) (8.97959183673469, 3.00253285906569)
(9.18367346938775, 2.48478885632812) (9.38775510204081, 2.83635667565277) (9.59183673469387, 2.54155272479282) (9.79591836734693, 2.89128949046374)
(9.99999999999999, 3.42546904987005)  };
%
\addplot[fill=orange,color=orange,only marks,mark size=1.4,mark=square*] coordinates {
(0.204081632653061, 0.204878667859313) (0.408163265306122, 0.356813801968841) (0.612244897959184, 0.480149953835653) (0.816326530612245, 0.599705033911425)
(1.02040816326531, 0.637483054466981) (1.22448979591837, 0.603181169513114) (1.42857142857143, 0.843916688341954) (1.63265306122449, 0.797150618533637)
(1.83673469387755, 0.828507087296936) (2.04081632653061, 0.979341538117332) (2.24489795918367, 1.02456965938981) (2.44897959183673, 0.84739061452557)
(2.6530612244898, 1.19788417344321) (2.85714285714286, 1.01748142027802) (3.06122448979592, 1.02410560130149) (3.26530612244898, 0.557713054759436)
(3.46938775510204, 0.748973851862082) (3.6734693877551, 0.735177787136091) (3.87755102040816, 0.809671878470953) (4.08163265306122, 0.890128743688519)
(4.28571428571428, 0.754222698940013) (4.48979591836734, 0.948944959705247) (4.69387755102041, 1.07507382123163) (4.89795918367347, 0.797295237417561)
(5.10204081632653, 0.914314213882636) (5.30612244897959, 0.940683485672211) (5.51020408163265, 0.909454281016711) (5.71428571428571, 0.878296865995703)
(5.91836734693877, 0.593886292782444) (6.12244897959183, 0.708353194995484) (6.32653061224489, 0.612720258828507) (6.53061224489795, 0.896160330480006)
(6.73469387755102, 0.754020206479683) (6.93877551020408, 0.723859457844448) (7.14285714285714, 0.905675405725853) (7.3469387755102, 0.897426099326578)
(7.55102040816326, 0.89922901935907) (7.75510204081632, 0.946223549443832) (7.95918367346938, 0.716927691810826) (8.16326530612244, 0.859338976325967)
(8.3673469387755, 0.918811911814241) (8.57142857142857, 0.947556511397518) (8.77551020408163, 0.715171549670063) (8.97959183673469, 0.813752501483566)
(9.18367346938775, 0.720623835846753) (9.38775510204081, 0.73151566168882) (9.59183673469387, 0.848214775010747) (9.79591836734693, 0.667005482849732)
(9.99999999999999, 0.838270415186178)  };

%\addplot[fill=cyan,color=cyan,only marks,mark size=1.2,mark=square*] coordinates {
%(0.4081632653061, 0.356174) (0.61224489795918, 0.497086) (0.81632653061224, 0.576720) (1.02040816326531, 0.634298)
%(1.22448979591837, 0.718221) (1.42857142857143, 0.776690) (1.63265306122449, 0.876723) (1.83673469387755, 0.942639)
%(2.04081632653061, 1.006299) (2.24489795918367, 1.008308) (2.44897959183673, 1.098194) (2.65306122448980, 1.099420)
%(2.85714285714286, 0.965862) (3.06122448979592, 0.859941) (3.26530612244898, 0.753026) (3.46938775510204, 0.763875)
%(3.67346938775510, 0.772968) (3.87755102040816, 0.760392) (4.08163265306122, 0.793914) (4.28571428571428, 0.808649)
%(4.48979591836734, 0.859523) (4.69387755102041, 0.889555) (4.89795918367347, 0.975426) (5.10204081632653, 0.917037)
%(5.30612244897959, 0.973745) (5.51020408163265, 0.923653) (5.71428571428571, 0.891845) (5.91836734693877, 0.814956)
%(6.12244897959183, 0.793507) (6.32653061224489, 0.791760) (6.53061224489795, 0.791394) (6.73469387755102, 0.787654)
%(6.93877551020408, 0.795305) (7.14285714285714, 0.849197) (7.34693877551020, 0.865594) (7.55102040816326, 0.855874)
%(7.75510204081632, 0.910148) (7.95918367346938, 0.876489) (8.16326530612244, 0.861632) (8.36734693877550, 0.902450)
%(8.57142857142857, 0.873597) (8.77551020408163, 0.821965) (8.97959183673469, 0.820693) (9.18367346938775, 0.786672)
%(9.38775510204081, 0.855306) (9.59183673469387, 0.824593) (9.79591836734693, 0.878777) (10.0, 0.852493) };
%\addplot[fill=orange,color=orange,mark size=1.2,only marks,mark=*] coordinates {
%(0.61224489795918,  2.858582) (0.81632653061224,  3.131922) (1.02040816326531,  3.020633) (1.22448979591837,  3.059643)
%(1.42857142857143,  3.082183) (1.63265306122449,  3.012289) (1.83673469387755,  2.675140) (2.04081632653061,  2.657142)
%(2.24489795918367,  2.503823) (2.44897959183673,  2.327922) (2.65306122448980,  2.152014) (2.85714285714286,  2.183269)
%(3.06122448979592,  2.386636) (3.26530612244898,  2.579904) (3.46938775510204,  2.684851) (3.67346938775510,  2.821879)
%(3.87755102040816,  3.096358) (4.08163265306122,  3.036308) (4.28571428571428,  3.085112) (4.48979591836734,  2.863644)
%(4.69387755102041,  2.758504) (4.89795918367347,  2.869887) (5.10204081632653,  2.754224) (5.30612244897959,  2.471920)
%(5.51020408163265,  2.510310) (5.71428571428571,  2.567136) (5.91836734693877,  2.848058) (6.12244897959183,  2.773555)
%(6.32653061224489,  2.835070) (6.53061224489795,  2.868486) (6.73469387755102,  3.027251) (6.93877551020408,  2.785621)
%(7.14285714285714,  2.818090) (7.34693877551020,  2.740688) (7.55102040816326,  2.771575) (7.75510204081632,  2.735949)
%(7.95918367346938,  2.738404) (8.16326530612244,  2.713008) (8.36734693877550,  2.680789) (8.57142857142857,  2.706132)
%(8.77551020408163,  2.800472) (8.97959183673469,  2.677474) (9.18367346938775,  2.882632) (9.38775510204081,  2.872980)
%(9.59183673469387,  2.894018) (9.79591836734693,  2.697335) (10.0,  2.806432)  };
%
\addplot[color=black,very thick,mark=none] coordinates {
(0.0,                1.0) (0.20408163265306,    1.8401187) (0.40816326530612,    2.3966666) (0.61224489795918,    2.7556552)
(0.81632653061224,    2.9707064) (1.02040816326531,    3.0778228) (1.22448979591837,    3.1024982) (1.42857142857143,    3.0631322)
(1.63265306122449,    2.9730602) (1.83673469387755,    2.8421495) (2.04081632653061,    2.6788166) (2.24489795918367,    2.4943256)
(2.44897959183673,    2.3134277) (2.65306122448980,    2.1920388) (2.85714285714286,    2.2063350) (3.06122448979592,    2.3638682)
(3.26530612244898,    2.5749857) (3.46938775510204,    2.7590369) (3.67346938775510,    2.8868511) (3.87755102040816,    2.9566443)
(4.08163265306122,    2.9753744) (4.28571428571428,    2.9520986) (4.48979591836734,    2.8963385) (4.69387755102041,    2.8183616)
(4.89795918367347,    2.7304870) (5.10204081632653,    2.6487412) (5.30612244897959,    2.5927528) (5.51020408163265,    2.5799330)
(5.71428571428571,    2.6141208) (5.91836734693877,    2.6804602) (6.12244897959183,    2.7551436) (6.32653061224489,    2.8186105)
(6.53061224489795,    2.8603815) (6.73469387755102,    2.8774564) (6.93877551020408,    2.8715253) (7.14285714285714,    2.8470759)
(7.34693877551020,    2.8104500) (7.55102040816326,    2.7693856) (7.75510204081632,    2.7324470) (7.95918367346938,    2.7077281)
(8.16326530612244,    2.7006350) (8.36734693877550,    2.7117051) (8.57142857142857,    2.7362455) (8.77551020408163,    2.7664498)
(8.97959183673469,    2.7944981) (9.18367346938775,    2.8147272) (9.38775510204081,    2.8243173) (9.59183673469387,    2.8230257)
(9.79591836734693,    2.8125978) (9.99999999999999,    2.7961637)  };
%
\addplot[color=black,very thick,mark=none] coordinates {
(0.0,                   0)           (0.20408163265306,    0.19405867) (0.40816326530612,      0.35209555)
(0.61224489795918,      0.47460383) (0.81632653061224,      0.57273513) (1.02040816326531,      0.65565463)
(1.22448979591837,      0.72928857) (1.42857142857143,      0.79741565) (1.63265306122449,      0.86254623)
(1.83673469387755,      0.92625763) (2.04081632653061,      0.98876724) (2.24489795918367,      1.04679205)
(2.44897959183673,      1.08754064) (2.65306122448980,      1.08056943) (2.85714285714286,      0.99548723)
(3.06122448979592,      0.86409387) (3.26530612244898,      0.76257039) (3.46938775510204,      0.71965657)
(3.67346938775510,      0.72040979) (3.87755102040816,      0.74493931) (4.08163265306122,      0.78052231)
(4.28571428571428,      0.82028143) (4.48979591836734,      0.86023588) (4.69387755102041,      0.89714941)
(4.89795918367347,      0.9270087) (5.10204081632653,      0.9441007) (5.30612244897959,      0.9418432)
(5.51020408163265,      0.9172836) (5.71428571428571,      0.8771324) (5.91836734693877,      0.8363893)
(6.12244897959183,      0.8081160) (6.32653061224489,      0.7967406) (6.53061224489795,      0.7999774)
(6.73469387755102,      0.8131922) (6.93877551020408,      0.8318788) (7.14285714285714,      0.8522633)
(7.34693877551020,      0.8711125) (7.55102040816326,      0.8854669) (7.75510204081632,      0.8927065)
(7.95918367346938,      0.8911841) (8.16326530612244,      0.8812566) (8.36734693877550,      0.8658539)
(8.57142857142857,      0.8496162) (8.77551020408163,      0.8369043) (8.97959183673469,      0.8302001)
(9.18367346938775,      0.8298365) (9.38775510204081,      0.8346574) (9.59183673469387,      0.8428098)
(9.79591836734693,      0.8522752) (9.99999999999999,      0.8611428) };
\end{axis}
\end{tikzpicture}
\caption{Simulated experimental data and fitted curve: Fitted parameters (actual in brackets): $p_0= 6.77 (7), p_1 = 1.01 (1), p_4=1.26 (1), p_6=5.11 (4.96)$.}
\label{fig:HeinrichFit}
\end{figure}
```

<!-- Fitness: 1.355 Vector: [6.7656034, 1.0071361, 39.2770462, 132.8739764, 1.2635684, 17.8054009, 5.10885 -->
<!-- Fitness: 1.355 Vector: [6.765048, 1.007226, 406.3441713, 1343.6862364, 1.2620094, 41.686623475, 5.107 -->
<!-- Fitness: 1.355 Vector: [6.7689326, 1.00689, 128.9556848, 118.83777, 1.2609861, 98.462305, 5.108255] -->
<!-- Fitness: 1.355 Vector: [6.7643218, 1.007429, 76.1064072, 148.3739211, 1.2657223, 88.2162321, 5.110559 -->
<!-- Fitness: 1.355 Vector: [6.7689626, 1.0070438, 88.9548794, 253.7566346, 1.2648019, 105.3355452, 5.1126 -->

<!-- Figure~\ref{fig:PythonNoisyDEFit} shows a screenshot of the outut -->

<!-- \begin{figure}[htb] -->
<!-- \centering -->
<!-- \includegraphics[scale = 0.8]{PythonNoisyDEFit.png} -->
<!-- \caption{Output from Python script listed in Appendix, showing fit of Heinrich model to experimental data.} \label{fig:PythonNoisyDEFit} -->
<!-- \end{figure} -->

<!-- Let's consider a small test case to compare the different optimizers. Consider a simple oscillator model which arises from positive feedback~\cite{HRR77}. The model was simulated and random noise added to the time series to produce noisy data. Four parameters were fitted to the data using the same initial guesses for the parameters. This was carried out using three different optimizers. The time taken to reach a good fit was compared, including the number of simulations and the final value of $\epsilon$. Levenberg-Marquardt and simplex were unable to fit the model with the same initial conditions. This result is common with the Levenberg-Marquardt method. The simplex method is variable when it comes to locating the global minimum and obviously it failed this time. Using different starting conditions can help. The data and the fitted curve (bold lines) for the best set of fitted parameters were obtained using a hybrid optimizer, as shown in Figure~\ref{fig:oscillatorFit}. This simple study illustrates the advantage of using a hybrid approach. A much more comprehensive study was carried out by Moles et al.~\cite{Moles:2003} where a number of other optimization strategies were tested in much more detail. -->

<!-- \begin{figure}[htb] -->
<!-- \begin{center} -->
<!-- \includegraphics[scale=0.5]{TimeSeriesFit.pdf} -->
<!-- \caption{A plot comparing the simulation (bold lines) with the data (thin lines) for the concentration time series for two -->
<!-- metabolites in the oscillating model~\cite{HRR77}.} -->
<!-- \label{fig:oscillatorFit} -->
<!-- \end{center} -->
<!-- \end{figure} -->

<!-- \begin{table} -->
<!-- \begin{center} -->
<!-- \begin{tabular}{|c|c|c|c|r|} -->
<!-- \hline -->
<!-- Optimizer   & Iterations & Simulation time  & Simulations & $\epsilon$      \\ -->
<!-- \hline -->
<!-- GA &500 & 2 min &4980&3.94  \\ -->
<!-- \hline -->
<!-- SAsimplex &56 & 8 min &24959&0.152  \\ -->
<!-- \hline -->
<!-- GAsimplex &29 & 4 min &11432&0.104  \\ -->
<!-- \hline -->

<!-- \end{tabular} -->
<!-- \caption{Performance comparison for different global optimizers. SAsimplex: Hybrid simulated annealing/simplex; GAsimplex Hybrid genetic algorithm/simplex.}\index{global optimizer} -->
<!-- \end{center} -->
<!-- \end{table} -->

<!-- One can also see that the GA hybrid \index{GA}\index{hybrid search} has the fewest simulations, whereas the simulated annealing takes longer. -->

## Model Fitting Software

There are a number of biochemical modeling applications that support curve fitting of differential equation models. The most popular tools in this category (in alphabetic order) include COPASI(footnote: <http://www.copasi.org/>}, PottersWheel(footnote: <http://www.potterswheel.de/>}, SBSI(footnote: <http://www.sbsi.ed.ac.uk/>},  and VCell(footnote:  <http://www.vcell.org/>}. COPASI in particular has an extensive set of parameter fitting algorithms and a number have been mentioned already. For Matlab users, PottersWheel is probably the best choice. There is also a long standing set of software and parameter optimization code by Peter Kuzmic who can provide expert consultancy on parameter fitting (<http://www.biokin.com/>).

## Using Python to Fit Data

Python has good support for optimization and data fitting via the SciPy(footnote: <www.scipy.org>} extension. SciPy supports the optimize package(footnote: <http://docs.scipy.org/doc/scipy/reference/tutorial/optimize.html>} which in turn implements a number of optimization algorithms including the Nelder and Mead simplex and Levenberg-Marquardt. A script that fits a simple model is shown in Listing `python:chap.fitting` where a Michaelis-Menten equation is fitted to data.

```python
from scipy import *
from scipy import optimize
# Declare the experimental data
x = array([0, 10, 20, 50, 100, 200, 400])
y = array([0, 9, 10, 17, 18, 20, 19])

# Define the objective function
def residuals (p):
    [vmax,Km] = p
    return y - vmax*x/(Km+x)

# Fit the model to the data
output = optimize.leastsq (residuals, [10, 10])
```

When the script is executed, the variable `output` will contain the values for the fitted $V_{max}$ and $K_m$ which in this case is $20.745$ and $15.408$, respectively. The $y$ data was generated using a $V_{max}=20$ and $K_m=15$ with added noise to simulate experimental error.

One important point worth noting is that the leastsq routine expects a routine called residuals to return the differences between the data and the model. In other words, there is no need to square and sum up the residuals to compute the chi-square directly. In general, the residuals routine will compute the following component of the sum of squares:

$$ \frac{y_i - f(x_i, p)}{\sigma} $$

We can plot the results of the fit using the code in Listing `python:chap.plot`:

```python
def peval(x, p):
    return p[0]*x/(p[1]+x)

Vmax,Km = 20,15
yTrue = Vmax*x/(Km+x)

import matplotlib.pyplot as plt
plt.plot(x, peval (x, output[0]), '--', x, y, 'o', x, yTrue,
    'r', x, residuals(output[0]), 'r^', markersize=10)
plt.title('Least-squares fit to noisy data')
# loc=10 means center the legend
plt.legend(['Fitted Curve', 'Noisy Data',
    'Underlying Function', 'Residuals'], loc=10)
plt.show()
```

The Python leastsq uses a modified Levenberg-Marquardt algorithm from the minipack lmdif routine.

<!-- By calling lsq with an addition argument, {\tt output = lsq (residuals, [10, 10], full_output=1)}, it is possible to obtain the covariance matrix. To obtain confidence limits, the main diagonal elements will need to be multiplied by the %reduced chi-square and the 95\% limit, 1.96 (See~\ref{eqn:confidenceCalculation}). However, it may be easier to call curve_fit which will directly return the 68\% confidence limits although there is less control over the data that can be %used in the fit, for example when there are multiple time courses to fit. -->

**Figure** <a id="fig-pythonfit"></a> `fig:PythonFit`

*Graphic (not in the LaTeX source, referenced by name): `PythonFit`*

*Caption:* Results from Python fitting code, comparing the fitted model to the underlying actual model.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.5]{PythonFit}
 \caption{Results from Python fitting code, comparing the fitted model to the underlying actual model.}
\label{fig:PythonFit}
\end{figure}
```

We will at many more examples in the next chapter.

<!-- \subsection*{Additional Examples - Error Estimation} -->

<!-- In the previous example a single equation was fitted to data. The next two examples will illustrate how to fit a dynamical model described using ordinary differential equations. In the examples we'll use differential evolution and Levenberg-Marquardt solvers provided by SciPy/lmfit and use Tellurium to provide the model and simulation capability.\footnote{I wish to acknowledge Veronica Porubsky, a graduate student in my lab at UW, for assisting me with this example.} -->

<!-- We will employ two examples: a simple two step pathway where each reaction follows first-order mass-action kinetics and a second example involving six reactions where two of the reactions follow non-linear kinetics. -->

<!-- \subsubsection*{Simple two-step example} -->

<!-- The two step pathway is shown in Figure~\ref{python:SimplePathwayToFit}. The objective is to estimate the values for the parameters, $k_1$ and $k_2$. The first thing to do is generate synthetic data with added noise. There are three species that can be measured and to make make the code more interesting we can allow a user to select what variables that would like to generate. The choice of variables  will be stored in the variable {\tt SIndexList}. For example is {\tt SIndexList} os set to {\tt [1,2]}, this means we will generate noisy synthetic data for variables $S_1$ and $S_2$. The generated data will be stored in the variable {\tt y\_data}. The number of generated synthetic points generated will be given by{\tt nDataPoints} and we will simulate up to time {\tt timeToSimlate}. The code for generating the synthetic data is shown in Figure~\ref{python:SimplePathwaySyntheticData} -->

<!-- \begin{lstlisting}[caption={Simple two step model.},label={python:SimplePathwayToFit}] -->
<!-- r = te.loada(""" -->
<!-- S1 -> S2; k1*S1; -->
<!-- S2 -> S3; k2*S2; -->

<!-- S1 = 1; S2 = 0; S3 = 0; -->
<!-- k1 = 0.45; k2 = 0.15; -->
<!-- """) -->
<!-- \end{lstlisting} -->

<!-- \begin{lstlisting}[caption={Generating synthetic data for the simple model.},label={python:SimplePathwaySyntheticData}] -->
<!-- nDataPoints = 24 -->
<!-- timeToSimulate = 20 -->
<!-- # Create the experimental data -->
<!-- # First column is time, other columns are species -->
<!-- m = r.simulate (0, timeToSimulate, nDataPoints) -->

<!-- # Change this index to use a different variables -->
<!-- # These are the variables that will be used to fit the model -->
<!-- SIndexList = [3] # 1 = S1, 2 = S2, 3 = S3 -->
<!-- x_data = m[:,0]; # Extract the time column -->

<!-- # Extract the SIndexList columns into y_data -->
<!-- y_data = [] -->
<!-- for i in range (len(SIndexList)): -->
<!-- y_data.append (m[:,SIndexList[i]]) -->

<!-- # Create the 'experimental' data by adding noise -->
<!-- y_noise = np.empty([nDataPoints]) -->
<!-- for k in range (len (SIndexList)): -->
<!-- for i in range (0, len (y_data[k])): -->
<!-- y_noise[i] = 0.05 # standard deviation of noise -->
<!-- # Not elegant but one way to avoid negative measured values -->
<!-- ln = np.random.normal (0, y_noise[i]); -->
<!-- while y_data[k][i] + ln < 0: -->
<!-- ln = np.random.normal (0, y_noise[i]); -->
<!-- y_data[k][i] = y_data[k][i] + ln # Add noise -->
<!-- \end{lstlisting} -->

<!-- One point worth noting is the way noisy measurement data is generated. There doesn't appear to be a general consents on how to generate synthetic data with realistic noise. The classical approach is to add noise drawn from a Gaussian distribution with a mean of zero and given standard deviation. Such noise is added to the synthetic data points to simulate measurement error. A problem arises because the noise values can be negative (since the mean of the noise is assumed to be zero). If a particular value drawn from the Gaussian distribution is too negative there is the risk of generating a negative measurement which for concentrations is impossible. In our case I've added an {\tt if} statement so that if a measurement value does go negative we regenerate the noise term, and continue doing this until we generate a positive measurement. -->

<!-- We are ne ready to fit the model to the synthetic data set. When using lmfit we need to declare the parameters which wish to fit, create the optimizer and call it. All this is shown in the code listing~\ref{python:SimplePathwayFirstFit}. Note that we call the differential evolution and the Levenberg-Marquardt optimizer. The differential evolution optimizer is used find the minimum and the Levenberg-Marquardt is to provide initial estimates for the confidence limits using Fisher Information Matrix. -->

<!-- \begin{lstlisting}[caption={Generating synthetic data for the simple model.},label={python:SimplePathwayFirstFit}] -->
<!-- import lmfit -->

<!-- params = lmfit.Parameters() -->
<!-- params.add('k1', value=1, min=0, max=10) -->
<!-- params.add('k2', value=1, min=0, max=10) -->

<!-- # Compute the fitted parameters -->
<!-- minimizer = lmfit.Minimizer(residuals, params) -->
<!-- result = minimizer.minimize(method='differential_evolution') -->
<!-- result = minimizer.minimize(method='leastsqr') -->
<!-- lmfit.report_fit(result.params, min_correl=0.5) -->
<!-- \end{lstlisting} -->

<!-- Let's begin by assuming we have perfect data, that is no measurement errors and we have data on all three species, $S_1$, $S_2$, and $S_3$. Running the code yields the following results. From the differential optimizer we obtain the following fitted values: -->

<!-- \begin{verbatim} -->
<!-- [[Variables]] -->
<!-- k1:  0.45000000 (init = 1) -->
<!-- k2:  0.15000000 (init = 1) -->
<!-- \end{verbatim} -->

<!-- Unsurprisingly we get perfect results. The estimates for these parameters are exactly at the ground truth values. -->

<!-- Average =  15.6369400988 -->
<!-- Average =  5.42260571926 -->
<!-- Average =  10.0716078035 -->
<!-- Average =  5.03409905233 -->
<!-- Average =  12.6214671201 -->
<!-- Average =  9.93120589225 -->
<!-- Average =  5.0147594914 -->
<!-- Average =  15.1653422057 -->
<!-- Average =  5.38234612932 -->

## Further Reading and Online Resources

- Berendsen HJ. (2011) A Student's Guide to Data and Error Analysis. Cambridge University Press. ISBN: 978-0-521-13492-7

- Draper NR and Smith H (1998) Applied Regression Analysis. 3rd edition. Wiley Series on Probability and Statistics. ISBN-13: 978-047117082

- Johnson ML, Faunt LM (1992) Parameter estimation by least-squares methods. Methods in Enzymology, 210, 1-37.

- Johnson ML (1994) Use of Least-Squares Techniques in Biochemistry. Methods in Enzymology, 240, 1-22.

- Mendes P and Kell DB (1998) Parameter Estimation in Biochemical Pathways: A Comparison of Global Optimization Methods. Bioinformatics, 14(10), 869-883.

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- \begin{enumerate} -->
<!-- \item Create a simple linear chain model of four steps and three species: -->

<!-- $$ X_o \rightarrow S_1 \rightarrow S_2 \rightarrow S_3 \rightarrow X_1 $$ -->

<!-- Assume that $X_o$ and $X_1$ are boundary species. Choose nonlinear reversible rate laws for the reactions, assign suitable values to the parameters, and set the initial conditions for $S_1$, $S_2$, and $S_3$ to zero. Run a simulation to obtain time-course data for the three species. Add noise to the simulated data and treat this data as your `experimental data'. Fit the experimental data to the model and see how well your parameter estimates agree with the original model. Try different fitting methods such as simplex, Levenberg-Marquardt, etc.\ to investigate how well each method performs. In addition, investigate different starting points for the parameter values when using the Levenberg-Marquardt and Nelder and Mead Method. -->
<!-- \end{enumerate} -->

## Appendix

```python
# Go to https://github.com/hsauro/PathwayModelingBook

# Change to directory Chapter9, download the file: diffEvol.py

# Written and supplied by Wilbert Copeland, 2014
# Differential evolution code, used to fit the Henrich model (Figure 8.15)
```

---

## Index terms recorded in this chapter

- $\chi^2$
- Boltzmann probability
- brute force fitting
- chi-square
- COPASI
- crossover
- differential evolution
- elitism
- evolutionary algorithms
- fitness landscape
- GA
- Gauss-Newton method
- genetic algorithm
- global and local searches
- global minimum
- global optimizer
- gradient search
- GSL library
- Hessian
- hybrid search
- Jacobian
- Kuzmic
- leastsq
- Levenberg-Marquardt
- lmdif
- lmfit library
- minipack
- model fitting
- mutations
- Nelder-Mead
- optimization
- PottersWheel
- Python
- reduced chi-square
- roulette wheel selection
- SBSI
- SciPy
- Scipy
- simplex
- simulated annealing
- software: curve fitting
- temperature
- tournament selection
- variance
- VCell
- weighing

---

← [[08_multicompartmental_systems|Multicompartmental Systems]] · [[index|Wiki index]] · [[10_parameter_estimation|Parameter Estimation]] →
