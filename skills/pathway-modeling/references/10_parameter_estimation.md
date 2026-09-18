# Parameter Estimation

*Source: `chapter10.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Parameter Estimation <a id="chap-analysefits"></a>

## Introduction

The last chapter discussed the use of various optGimization techniques to fit a model to a set of data. In this chapter, we will go one step further and investigate ways to assess the quality of the fit and confidence in the parameters.

## Analysis of Residuals

<a id="sec-residuals"></a>

When a model has been fitted to a set of data, the difference between a model prediction and the corresponding experimental data point is called the **residual**. Figure [[09_fitting_models|Figure: Model curve and experimental data plotted on the same graph]] in the previous chapter shows a plot of a fitted curve and the corresponding experimental data. The $e_i$ terms are the residuals. One of the easiest ways to assess the quality of a fit is to examine the residuals. In fitting data to a model we make a number of assumptions (as required by maximum likelihood, see section [[09_fitting_models|Maximum Likelihood Justification - Optional]]) about the experimental data. The first is that the experimental uncertainties in the data are normally distributed, and the second that the errors are uncorrelated (i.e. independent). Any departure from these assumptions means the residuals will show a pattern that is not accounted for by the model. Even assuming that the experimental data is well behaved, an incorrect model can also result in systematic trends in the residuals. Examination of the residuals is therefore an easy and informative way to assess the fit.

Figure [Figure: Residual plot data fitted to a simple irreversible decay model of $S_1](#fig-residualssimple) shows a typical residual plot. This was obtained by fitting the model $S_1 \rightarrow S_2$, assuming an irreversible first-order reaction kinetic law with a single unknown kinetic constant, $k_1$. For the purposes of the demonstration, the model was fitted to a set of synthetic noisy data generated from a simulation using a known value of $k_1$. The synthetic data was then used to recover the value of $k_1$ by using the Levenberg-Marquardt fitting method. If the model is a good fit to the data, we expect the residuals to be normally distributed about a mean of zero.

\stateComment{
If the model is a good fit to the data, we expect the residuals to be normally distributed about a mean of zero.
}

If a pattern is observed in the residual plot, it can mean a number of things: 1) the model is incorrect; 2) one or more assumptions about the distribution of errors in the experimental data is violated; 3) there may be one or more very unusual outliers in the experimental data set. The plot in Figure [Figure: Residual plot data fitted to a simple irreversible decay model of $S_1](#fig-residualssimple) hints at a possible pattern with the residuals increasing, suggesting the variance in the experimental data is increasing. The most damning patterns are where the residuals follow a linear or nonlinear relationship and are not randomly distributed. This will usually imply an incorrect model.

**Figure** <a id="fig-residualssimple"></a> `fig:ResidualsSimple`

*Caption:* Residual plot data fitted to a simple irreversible decay model of $S_1$ into $S_2$.

```latex
\begin{figure}
\centering
\pgfplotsset{every axis legend/.append style={
		at={(1.03,1.01)},
		anchor=north west}}
\begin{tikzpicture}
\begin{axis}[
xlabel={Data Point},
ylabel={Residual},
xmin=0, xmax=10, ymin=-2, ymax=2,
width=10cm,
height=6cm]
%\addplot[color=red,line width=1.5pt,mark=o] coordinates {
\addplot[color=red,line width=1.5pt,mark=*, only marks] coordinates {
(0,	 -0.648710057) (1, 1.01931184) (2, -0.521154398) (3, -0.159291555) (4,  0.641344813) (5, -0.067860512)	
(6,	 -0.663673399) (7,	  1.10483282) (8,0.796177025) (9, -1.78660179) (10,	1.36881988)	};
\addlegendentry{$S_1$}
%\addplot[color=blue,line width=1.5pt, mark=square*] coordinates {
\addplot[color=blue,mark=square*,only marks] coordinates {
(0,	 0.155918422) (1, 0.245941357) (2,  0.947882566) (3,  -0.591033227) (4, 0.397358056)
(5,	 -0.556750428) (6,	0.335372002) (7, -0.659627676) (8,	-1.41856797)
(9,	  1.25646491) (10, -1.97506809)};
\addlegendentry{$S_2$}
\end{axis}
\end{tikzpicture}
\caption{Residual plot data fitted to a simple irreversible decay model of $S_1$ into $S_2$.}
\label{fig:ResidualsSimple}
\end{figure}
```

Plotting residuals is therefore an effective way to investigate how well the model fits the data. Sometimes it can be difficult to spot trends in a residual plot and one very practical way to test whether the residuals are normally distributed (implying no systematic pattern) is to construct a **normal probability plot** [Montgomery2001, Straume1992]. We can construct a probability plot by first ranking the residuals in increasing order such that:

$$
\begin{align*}
e_1 < e_2 < e_3 < ... < e_i < ... < e_n
\end{align*}
$$

where $e_i$ is the $i^{th}$ residual value. We next compute the percentile value for the $i^{th}$ residual using:

$$
\begin{align}
 P_i = \frac{i-0.5}{n}
 \label{eqn:probabilityPlotPercentile}
\end{align}
$$

For example, if we have 20 ranked residuals, then the percentile for the 10th residual is 0.475. That is, 47.5% of the residuals fall below the 10th residual. We can think of the percentiles as representing the cumulative area (or probability) under a normal curve (or any other distribution we wish to test) from which we can compute the corresponding z-values. That is, for a given area under a normal curve with mean zero, what is the value on the $x$ axis?

For example, an area of 0.5 will yield a z-score of zero because we are at the center of the normal curve, while an area of 0.25 will give a z-score of -0.68 (See Table [[appendix_g_statistics_reminder|Table: Standard Normal Probabilities, Positive:]]). If the residuals are sampled from a normal distribution, we would expect the trend in the ranked residuals to follow the same trend as the z-scores. The plot should be a straight line. The easiest way to test this is to plot the ranked residuals against the z-scores. The probability plot shown in Figure [Figure: Q-Q probability plots generated using Python script \ref{listing:proab](#fig-pythonprobabilityplot) was computed from the residual seen in Figure [Figure: Residual plot data fitted to a simple irreversible decay model of $S_1](#fig-residualssimple). Note that the points lie reasonably on a straight line with perhaps the last two points showing some deviation. Overall there doesn't appear to be any major problem.

\pgfmathdeclarefunction{gauss}{3}{
  \pgfmathparse{1/(#3*sqrt(2*pi))*exp(-((#1-#2)^2)/(2*#3^2))}
}

<!-- \pgfmathdeclarefunction{gauss}{2}{% -->
<!-- \pgfmathparse{1/(#2*sqrt(2*pi))*exp(-((x-#1)^2)/(2*#2^2))}% -->
<!-- } -->
<!-- \pgfplotsset{compat=1.7} -->

**Figure**

*Caption:* The normal distribution showing percentiles, z-scores and areas. Modified from <http://johncanning.net/wp/?p=1202>.

```latex
\begin{figure}
\centering
\begin{tikzpicture}
\begin{axis}[
no markers, domain=0:10, samples=100,
axis lines*=left, xlabel=Standard deviations, ylabel=Frequency,
height=6cm, width=10cm,
xtick={-3, -2, -1, 0, 1, 2, 3},ytick=\empty,
enlargelimits=false, clip=false, axis on top,
grid = major
]
\addplot [fill=cyan!30, draw=none, domain=-3:3] {gauss(x,0,1)} \closedcycle;
\addplot [fill=orange!30, draw=none, domain=-3:-2] {gauss(x,0,1)} \closedcycle;
\addplot [fill=orange!30, draw=none, domain=2:3] {gauss(x,0,1)} \closedcycle;
\addplot [fill=blue!30, draw=none, domain=-2:-1] {gauss(x,0,1)} \closedcycle;
\addplot [fill=blue!30, draw=none, domain=1:2] {gauss(x,0,1)} \closedcycle;
\addplot[<->] coordinates {(-1,0.4) (1,0.4)};
\addplot[<->] coordinates {(-2,0.3) (2,0.3)};
\addplot[<->] coordinates {(-3,0.2) (3,0.2)};
\node[coordinate, pin={68.2\%}] at (axis cs: 0, 0.35){};
\node[coordinate, pin={95\%}] at (axis cs: 0, 0.25){};
\node[coordinate, pin={99.7\%}] at (axis cs: 0, 0.15){};
\node[coordinate, pin={34.1\%}] at (axis cs: -0.5, 0){};
\node[coordinate, pin={34.1\%}] at (axis cs: 0.5, 0){};
\node[coordinate, pin={13.6\%}] at (axis cs: 1.5, 0){};
\node[coordinate, pin={13.6\%}] at (axis cs: -1.5, 0){};
\node[coordinate, pin={2.1\%}] at (axis cs: 2.5, 0){};
\node[coordinate, pin={2.1\%}] at (axis cs: -2.5, 0){};

\node[coordinate, pin={2.3}] at (axis cs: -2, 0.08){};
\node[coordinate, pin={15.9}] at (axis cs: -1, 0.08){};
\node[coordinate, pin={50}] at (axis cs: 0, 0.08){};
\node[coordinate, pin={84}] at (axis cs: 1, 0.08){};
\node[coordinate, pin={97.7}] at (axis cs: 2, 0.08){};

\node at (axis cs:3.1,0.15) {Percentiles};

\end{axis}
\end{tikzpicture}
\caption{The normal distribution showing percentiles, z-scores and areas. Modified from~\url{http://johncanning.net/wp/?p=1202}.}
\end{figure}
```

<!-- \begin{figure} -->
<!-- \begin{center} -->
<!-- \pgfplotsset{every axis legend/.append style={ -->
<!-- at={(1.01,1.01)}, -->
<!-- anchor=north west}} -->
<!-- \begin{tikzpicture} -->
<!-- \begin{axis}[ -->
<!-- xlabel={z-score}, -->
<!-- ylabel={Ranked Residual},grid=major, -->
<!-- xmin=-2, xmax=2, ymin=-2, ymax=3, -->
<!-- width=10cm, -->
<!-- height=6cm] -->
<!-- \addplot[color=red,mark=*,only marks] coordinates { -->
<!-- (-1.7866,	  -1.570585029) (-6.63673E-01,	-1.031459094) (-6.4871E-01,	  -0.692900345) (-5.21154E-01,	-0.42009151) -->
<!-- (-1.59292E-01,	-0.175782121) (-6.78605E-02,	0.058326735)	 (6.41345E-01,	  0.295722699)	(7.96177E-01,	  0.551347695) -->
<!-- (1.01931,	  0.849957281)	(1.10483,  	1.25548617)	(1.36882,	  2.269205796)}; -->
<!-- \addlegendentry{$S_1$} -->
<!-- \addplot[color=blue, mark=square*,only marks] coordinates { -->
<!-- (-1.97507,	-1.570585029) (-1.41857,	-1.031459094) (-6.59628E-01,	-0.692900345) (-5.91033E-01,	-0.42009151) -->
<!-- (-5.5675E-01,	  -0.175782121) (-3.35372E-1,	0.058326735) (1.55918E-01,  	0.295722699) (2.45941E-01,  	 0.551347695) -->
<!-- (3.97358E-01,  	0.849957281) (9.47883E-1,	  1.25548617) (1.25646,	  2.269205796)}; -->
<!-- \addlegendentry{$S_2$} -->
<!-- \end{axis} -->
<!-- \end{tikzpicture} -->
<!-- \end{center} -->
<!-- \caption{Residual data from Figure~\ref{fig:ResidualsSimple} repotted as a probability plot. A linear relationship indicates that the residuals are most likely sampled from a normal distribution.} -->
<!-- \label{fig:ResidualsProbabilityPlot} -->
<!-- \end{figure} -->

<!-- If we plot the cumulative probability $P_i$ = $\frac{i-0.5}{n}$, against the residual values, then in the case of normally distributed residuals, the resulting points should approximate a straight line. -->

<!-- \begin{figure}[htb] -->
<!-- \begin{center} -->
<!-- \%\includegraphicsraphics[scale=0.7]{ResidualsPlot} \caption{Normal probability plots for two sets of residuals.} -->
<!-- \label{fig:ResidualsPlot}\end{center} -->
<!-- \end{figure} -->

We can generate probability plots using Excel or Python. If you're using Excel, enter in the first column the ranked residual data. In a third column, enter the numbers 1 to $n$ where $n$ is the number of residuals. In the fourth column compute the percentiles using equation [Analysis of Residuals](#eqn-probabilityplotpercentile). In the *second column* use the built-in Excel function `NORM.S.INV` to convert the percentile values in the fourth column to z-scores. Finally, plot the first and second column as a scatter plot to yield the probability plot, see Figure [Figure: Using Excel to compute probability plots for $S_1$](#fig-excelprobabilityplot).

**Figure** <a id="fig-excelprobabilityplot"></a> `fig:ExcelProbabilityPlot`

*Graphic (not in the LaTeX source, referenced by name): `excelProbPlot`*

*Caption:* Using Excel to compute probability plots for $S_1$. See main text for details.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.5]{excelProbPlot} \caption{Using Excel to compute probability plots for $S_1$. See main text for details.}
\label{fig:ExcelProbabilityPlot}
\end{figure}
```

When using Python, use the `statsmodels.api` module. The script shown in listing `listing:proabilityPlot` shows how to generate probability plots for the residual data shown in Figure [Figure: Residual plot data fitted to a simple irreversible decay model of $S_1](#fig-residualssimple). The resulting plots are shown in Figure [Figure: Q-Q probability plots generated using Python script \ref{listing:proab](#fig-pythonprobabilityplot).

**Figure** <a id="fig-pythonprobabilityplot"></a> `fig:PythonProbabilityPlot`

*Graphic (not in the LaTeX source, referenced by name): `probplot`*

*Caption:* Q-Q probability plots generated using Python script `listing:proabilityPlot`. See main text for details.

```latex
\begin{figure}
\centering
 \includegraphics[scale=0.6]{probplot}
 \caption{Q-Q probability plots generated using Python script~\ref{listing:proabilityPlot}. See main text for details.}
\label{fig:PythonProbabilityPlot}
\end{figure}
```

Since the residuals are the deviations of the observations away from fitted values, in an ideal case we would expect the residuals
to vary randomly about zero, and their spread to be almost the same across the plot. If the points in the plot lie on a curve rather
than fluctuating randomly, it is an indication that the zero mean assumption is invalid. If the residuals exhibit a pattern, i.e. increase or decrease in magnitude with the fitted values, this can suggest either systematic changes to the data variances or trends generated by a bad model. A plot of residuals against
fitted values may sometimes also reveal points with unusually large residuals. These points are potential outliers, that is, data points for which the model is not appropriate. The presence of outliers in the data sets may significantly influence the estimation of model parameter values. It is therefore important to identify those points and correct them whenever possible, or delete them from the raw data sets. However, in some cases outliers may actually aid in improving our knowledge about the system under consideration. One should do a
detailed investigation before rejecting outliers, see [Barnett1994outliers].

### Standardized Residuals

Given that residuals can potentially vary over a wide range of values, it is sometimes convenient to normalize the residuals before plotting. If the residuals are well behaved we expect them to be distributed with a mean of zero and standard deviation, $\sigma$, often depicted as $e_i \sim N(0, \sigma_i)$. One possibility is to scale each residual by its standard deviation. This is akin to calculating the z-score for a normally distributed variate (See section [[appendix_g_statistics_reminder|*z*-Scores or Standard Scores]]) where in this case we assume the mean is zero. However, we don't have access to these standard deviations, so instead we normalize each residual with respect to the standard deviation of all the residuals. We therefore define the standardized residual as:

$$ s_i = \frac{e_i}{\sigma} $$

where:
$$ \sigma = \sqrt{\frac{1}{N-1} \sum^{N}_{i=1} e_i^2} $$

Standardized residuals are expressed in units of standard deviations. Thus a standardized residual of one indicates that the residual is one standard deviation away from the mean (zero in this case). For a well behaved set of residuals, we expect that 95% of the time, the residuals will lie roughly between the limits 2 and -2. If more than 5% of standardized residuals are greater than 2, then this should raise some concern. If only one observation is found beyond the 95% range, this could also suggest that the data point is an outlier.

## $\chi^2$-Goodness of Fit Test

If the residuals show no unusual trends, the next step is to carry out a goodness of fit test. Recall that the reduced $\chi^2$ is given by:

$$
\begin{equation}
\chi^2_{\text{r}} \equiv \frac{1}{N- P}\sum_{i=1}^N \frac{\left(y_i - f (x_i; p_1\ldots p_m )\right)^2}{\sigma_i^2}
\end{equation}
$$

where $N-P$ is the degrees of freedom. The value of $\chi^2$ is determined by a number of factors. The two most interesting to us are:

- The normally distributed errors in the experimental data.
- The choice of model used in the fitting.

The purpose of a goodness of fit test is to distinguish between these two contributions. If the $\chi^2$ is significantly influenced by the model, then the model must be suspect. If the model is a very good fit, we expect the model will contribute little to $\chi^2$. With a good fit we expect that $\chi^2$ will *only* be influenced by errors in the experimental data. Given this, it should be clear that a goodness of fit test will *only* work if uncertainty in the experimental data is known.

$\chi^2$ is the ratio of the squared deviations from the expected values divided by the variance of the experimental data. The numerator is therefore a measure of the spread of the observations around the fitted value(footnote: Recall: $\sigma = 1/N \sum (x_i - \mu)^2$} and the denominator the expected spread. If the model makes little or no contribution to the numerator, that is the model is a good fit, then the two measures of spread should be roughly equal. That is:

$$ \frac{\left(y_i - f (x_i; p_1... p_m )\right)^2}{\sigma_i^2} \simeq 1 $$

Summing over all $i$ terms we expect $\chi^2$ to be approximately $N$:

$$
\begin{equation}
\chi^2 = \sum_{i=1}^N \frac{\left(y_i - f (x_i; p_1\ldots p_m )\right)^2}{\sigma_i^2} \simeq N
\end{equation}
$$

However, this ignores the degrees of freedom and more precisely we expect the reduced chi-square to be equal to:

$$ \chi^2_{r} = \chi_2 / \nu \simeq 1 $$

where $\nu$ degrees of freedom is: $\nu = N-P$.

\stateHighlight{
In summary, the closer $\chi^2_{r}$ is to one, the more likely the model fits the data. In this situation most of the variation we see in $\chi^2_{r}$ must originate from errors in the experimental data.}

Two questions remain: what if $\chi^2_{r} < 1$, and how can we decide whether a given value for $\chi^2_{r}$ represents a good fit or not? To address the first question; if $\chi^2_{r}$ is less than one, then it suggests either the errors in the experimental data are overestimated or more worrying, the data is possibly fraudulent, in a sense, too good to be true. A $\chi^2_{r} < 1$ therefore suggests a problem with the data rather than the model.

The second question is, how do we decide whether a given value of $\chi^2_{r}$ means we have a good fit or not? Consider the thought experiment where we repeat the fitting process multiples times using new experimental data for each fit. In the process we will obtain multiple $\chi^2_{r}$ values. Assuming that the experimental data is sampled from a normal distribution (which we have assumed so far), the $\chi^2_{r}$ values will by definition be distributed according to a chi-square distribution.

\definecolor{blues1}{RGB}{198, 219, 239}
\definecolor{blues2}{RGB}{158, 202, 225}
\definecolor{blues3}{RGB}{107, 174, 214}
\definecolor{blues4}{RGB}{49, 130, 189}
\definecolor{blues5}{RGB}{8, 81, 156}

\pgfplotscreateplotcyclelist{statGraphColors}{
{blues1},
{blues2},
{blues3},
{blues4},
{blues5},
}

<!-- \begin{tikzpicture}[ -->
<!-- declare function={gamma(\z)= -->
<!-- (2.506628274631*sqrt(1/\z) + 0.20888568*(1/\z)^(1.5) + 0.00870357*(1/\z)^(2.5) - (174.2106599*(1/\z)^(3.5))/25920 - (715.6423511*(1/\z)^(4.5))/1244160)*exp((-ln(1/\z)-1)*\z);}, -->
<!-- declare function={gammapdf(\x,\k,\theta) = \x^(\k-1)*exp(-\x/\theta) / (\theta^\k*gamma(\k));} -->
<!-- ] -->

<!-- \begin{axis}[ -->
<!-- axis lines=left, -->
<!-- enlargelimits=upper, -->
<!-- samples=50, -->
<!-- legend entries={$k=1\quad \theta=2$,$k=2\quad \theta=2$, $k=9\quad \theta=0.5$} -->
<!-- ] -->
<!-- \addplot [smooth, domain=0:20] {gammapdf(x,1,2)}; -->
<!-- \addplot [smooth, domain=0:20, red] {gammapdf(x,2,2)}; -->
<!-- \addplot [smooth, domain=0:20, blue] {gammapdf(x,9,0.5)}; -->
<!-- \end{axis} -->
<!-- \end{tikzpicture} -->

**Figure** <a id="fig-chisquare"></a> `fig:chisquare`

*Caption:* Chi-Square distribution for different degrees of freedom.

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}
  \begin{axis}[%
    cycle list name=statGraphColors,
    xlabel = $\chi^2$,
    ylabel = {Probability density},
    axis x line=bottom, axis y line=left,
    samples = 200,
    ymin=0.01,
    ymax=0.5,
    %restrict y to domain = 0.01:0.5,
    domain = 0.01:15]
    \foreach \k in {1,2,4,8,12} {%
      \addplot+[mark={},line width=1.8pt] gnuplot[raw gnuplot] {%
        isint(x) = (int(x)==x);
        log2 = 0.693147180559945;
        chisq(x,k)=k<=0||!isint(k)?1/0:x<=0?0.0:exp((0.5*k-1.0)*log(x)-0.5*x-lgamma(0.5*k)-k*0.5*log2);
        set xrange [1.00000e-10:15.0000];
        set yrange [0.00000:0.500000];
        samples=200;
        plot chisq(x,\k)};
    \addlegendentryexpanded{$\nu$ = \k}}
  \end{axis}
\end{tikzpicture}
\caption{Chi-Square distribution for different degrees of freedom.}
\label{fig:chisquare}
\end{figure}
```

Some $\chi^2$ values will be smaller and others larger but according to the $\chi_2$ distribution with $\nu$ degrees of freedom, the sample of $\chi^2_{r}$ values will have a mean of $\nu$ and variance of $2 \nu$. By chance it is possible that a given experimental data set will result in a larger $\chi^2_{r}$. Using $\chi^2$ tables we can estimate this likelihood. If the likelihood is small, it means that the $\chi^2_{r}$ value is unlikely to have come only from variation in the experimental data. Instead it is more likely that the $\chi^2$ value is *not* due to variation in the experimental data, but instead due to our application of a *bad model*. This is a subtle argument and will be illustrated further with an example.

Assume that with 10 points and two parameters ($\nu = 10 - 2 = 8$), we obtain a reduced chi-square of 20. This is a high value and is the result of variation in the data and/or a potentially poor model. The question is which? Using a table of chi-square values, we find that the likelihood of obtaining this value or greater is 0.01. This means that the $\chi^2$ value could only occur through random fluctuations in the experimental data 1% of the time. This is rare, therefore the major contribution to the $\chi^2$ is likely to be a poor fit to the model. Given this we conclude that the model must be rejected.

As with all statistical tests, the fact that a goodness of fit test rejects a model does not mean we have shown the model to be incorrect. There is still a chance, albeit small, that we have made an error and rejected a model that is more than adequate at explaining the data. We will return to this issue in a later section.

### Comparison of Models

It is possible, and quite likely, that two candidate models fit the same set of experimental data. Is there anyway to decide which is the most plausible? If the two models have the same number of parameters, then a simple comparison of the two $\chi^2_{r}$ values is probably sufficient. In general, the model with the smallest chi-square is the better model. What if the number of parameters are different? In this case a statistical test can be carried out to determine which model to select.

#### Overfitting

One could reason that of the two models, the model that results in the lowest $\chi^2$ is the better fit. However, this is not necessarily the case. Imagine a model, $M_1$, that has ten parameters to fit and another model, $M_2$, that has only two parameters to fit. Let us assume that the $\chi^2$ for $M_1$ was 1.5 and the $\chi^2$ for $M_2$ was 1.8. At first glance it would seem that $M_1$ is the better fit because it has a lower $\chi_2$. The danger here is that because $M_1$ has ten parameters to adjust, it might be possible to adjust the parameters such that the model solution will go through every experimental data point resulting in a lower $\chi^2$. This effect is termed **overfitting**.

It is much better to compare the reduced $\chi^2$ (equation [[09_fitting_models|Optimizing Parameter Values]]) value because this takes into account the number of parameters we fit. Let us assume that we had ten points to fit to the model. The reduced $\chi^2$ for $M_1$ will be 1.5/(10 - 9) = 1.5, while the reduced $\chi^2$ for $M_2$ will be $1.8/(10-2) = 0.225$. After taking into account the number of parameters in each fit, $M_2$ has the lower $\chi^2$ and therefore we conclude that $M_2$ is the better fit to the experimental data. To check on the plausibility of a given model, we can therefore compare the reduced chi-square.

Consider two models, $M_1$ and $M_2$, where $M_1$ has $p_1$ parameters and $M_2$, $p_2$ parameters such that $M_1$ has fewer parameter than $M_2$ ($p_1 < p_2$). In both cases we fit the model to the *same set of data* and obtain the $\chi^2_{r}$ values which we will call $\chi^2_1$ and $\chi^2_2$. A model with more parameters is likely to fit the data better than a model with fewer parameters simply because more parameters gives us more flexibility. The question to consider is whether the additional parameters lead to a significantly better fit. That is, is the possibility of obtaining $\chi^2_1$ the same as obtaining $\chi^2_2$ given the known errors in the experimental data? If it is unlikely then we pick the simpler model since there is no reason to select the more complicated model. We can answer this question by comparing the difference in the variance with the variance of the more complicated model.

The usual test for comparing variances (and therefore $\chi^2$ values) is the F-test (see section [[appendix_g_statistics_reminder|F-test]]).(footnote: The difference $\chi^2_2 - \chi^2_1$ is also distributed as a $\chi^2$ distribution with $p_2 - p_1$ degrees of freedom.} In this case we will be comparing the difference in variance in the simple model to the variance of the model with the additional parameters, that is [DraperSmith1998]:

$$ f = \frac{(\chi^2_1 - \chi^2_2)/(p_2-p_1)}{\chi^2_2/(n-p_1)} $$

The null hypothesis, $H_o$, is that the more complicated model $M_2$ does not provide a significantly better fit that the simpler model, $M_1$, i.e. the simpler model is adequate. We will reject the hypothesis if the F statistic is greater than a critical value such as 0.05, and consider the more complicated model a better fit.(footnote: Models that are subsets of other models are sometimes called nested models.} For example, assume the following data for two models where the number of data points is 20 ($n = 20$). The first model, $M_1$, has 5 parameters and the second model, $M_2$, 8 parameters. The test for rejecting the null hypothesis is:

$$ Reject  H_o  if  f > F(0.95, \nu_1, \nu_2) $$

**Table** <a id="tlb-ftest"></a> `tlb:ftest`

*Caption:* Data for F test illustration, see main text for details.

```latex
\begin{table}
\centering
\begin{tabular}{lll} \toprule
         & $M_1$ & $M_2$ \\ \midrule
$\chi^2$ & 10.5  & 6.7 \\
$p$      & 5     & 8 \\ \bottomrule
\end{tabular}
\caption{Data for F test illustration, see main text for details.}
\label{tlb:ftest}
\end{table}
```

The degrees of freedom for the numerator term, $\nu_1$ is $8 - 5 = 3$ and for the denominator term, $\nu_2 = 20 - 8 = 12$. Given $\nu_1$ and $\nu_2$, the critical value from a F-test table at 5% is 3.49. In order to reject the null hypothesis, the F value must be greater than 3.49. Given the data in the table (Table [Table: Data for F test illustration, see main text for details](#tlb-ftest)), the $f$ value can be computed as:

$$ f = \frac{(10.5 - 6.7)/3}{6.7/12} = \frac{1.267}{0.446} = 2.84 $$

Since $f < 3.49$ we *accept* the null hypothesis which means that the simpler model is an adequate model to describe the data. Out of interest, what if the fit to the more complicated model was a little better with a $\chi^2_2 = 4.5$. In this case, $f$ is now computed to be:

$$ f = \frac{(10.5 - 4.5)/2}{4.5/13} = \frac{2}{0.3} = 6.667 $$

Since $f$ is now greater than the critical value of 3.49, we reject the hypothesis and propose that the more complicated model is a better fit to the data. What happens if we increase the complexity of the model even more, for example the new model has 12 parameters instead of 8? If we assume that the $\chi^2_2$ is unchanged, the new $f$ value is computed to be:

$$ f = 1.22 $$

We accept the null hypothesis. This shows that simply increasing the number of parameters will not necessarily increase the significance of the fit.

Once again, it should be emphasized that these tests do not indicate that one model is more correct than another, simply that one of the models is a less likely description of the data than the other.

### AIC Model Selection

Akaike's Information Criterion (AIC) is another way to compare models and has gained popularity in recent years. In practice, the AIC value for two models is computed and the model with the lowest AIC value is selected as the better model. Any number of models can be compared this way. Note that each AIC value *must* be computed using the same data set.

The formula for computing the AIC value is remarkably simple and is given by:

$$
\begin{equation}
\text{AIC} = 2 k - 2 \ln (L)
\label{eqn:aic}
\end{equation}
$$

where $k$ is the number of *estimable parameters* in the model. This means that non-identifiable parameters, which are not estimable, shouldn't be counted in the value of $k$. $L$ is the maximum likelihood computed at the least-squares minimum found after the model is fitted (using the techniques described in the last chapter) to the data.

One may recall from the previous chapter that when fitting a model using least-squares, that the minimum of the $\chi$-square corresponds to the maximum likelihood. Because we assume normally distributed and independent $n$ data points, the likelihood in this case can be computed from the product of the Gaussian function at each data point, see [[11_bayesian_inference|Bayesian Inference]]:

$$ L(\theta|x) = \prod_{i=1}^n \frac{1}{{\sigma \sqrt {2\pi } }} \exp \left({-\dfrac{(x_i - f (x_i, \theta))^2}{2 \sigma^2}}\right) $$

Which when rearranged yields:

$$ L(\theta|x) = \left(\frac{1}{\sigma \sqrt {2\pi } }\right)^n \exp\left({ \frac{-\sum_{i=1}^n (x_i - f (x_i, \theta))^2}{2 \sigma^2}}\right) $$

To compute the maximum likelihood we need to find the point where $dL/d\theta$ is zero. This is a standard derivation found in many texts but to make life easier the derivative is generally carried out in log space (technically the log-likelihood). Even more conveniently, it's the log likelihood we need to compute the AIC value [AIC Model Selection](#eqn-aic). Taking the log we obtain:

$$ \ln (L(\theta|x)) = -\frac{n}{2} \ln (2 \pi) - n \ln (\sigma) - \frac{1}{2 \sigma^2} \sum_{i=1}^{n} (x_i - f(x_i, \theta)^2) $$

This equation is maximized when $dL/d\theta = 0$ from which we can compute the maximum log-likelihood:

$$ \ln (L (\theta|x)) = -\frac{n}{2} (\ln (2\pi) + 1) - \frac{n}{2} \ln \left( \frac{\sum_{i=1}^{n} (x_i - f(x_i, \theta)^2)}{n} \right) $$

The term on the right-hand side at the maximum (or minimum least squares) is the residual sum of squares:

$$ RSS = \sum_{i=1}^{n} (x_i - f(x_i, \theta)^2) = \sum_{i=1}^n e_i^2 $$

This means the log likelihood can be easily computed using:

$$ \ln (L (\theta|x)) = -\frac{n}{2} (\ln (2\pi) + 1) - \frac{n}{2} \ln \left( \frac{\sum_{i=1}^n e_i^2}{n} \right) $$

This is a very simple expression to evaluate once we have fitted a model. The term on the left of the right-hand side, $(n/2)(\ln (2\pi) + 1)$, is independent of the *model* and is therefore a constant. As a result this term is sometimes left out of the expression when computing the AIC since we only compare the relative magnitudes of AIC values and the constant term will make no difference. Many software tools specify whether they leave the constant term out or not, this is important if you need the actual true value of the AIC.

Inserting the log maximum likelihood into the AIC formula [AIC Model Selection](#eqn-aic) we obtain(footnote: Note that the 2 cancels and the two negative signs multiply to become a positive.}:

$$ AIC = 2 k - 2 \ln (L) = 2 k + n \ln \left( \frac{\sum_{i=1}^n e_i^2}{n} \right) $$

There are some modifications to this, for example for small data sets (less than 40), there is a correction [hurvich1989regression]:

$$ AIC_c = AIC + \frac{2k (k+1)}{n - k - 1} $$

A detailed derivation of all these results can be found in [banks2017aic]. In addition there is also sometimes a correction made to the number of parameters to include the error so that $k_c = k + 1$ but for comparing across different AICs computed on the same data, this correction is not important. Shimizu et al. [shimizu2002application] also suggest that the number of estimable parameters be less that $2 \sqrt{n}$. For example, if we have 25 data points, we should try to avoid models with more that 10 parameters.

Like many measures that help us compare models, the AIC, tries to balance the quality of the fit and the number of parameters. If the model fits very well, then the log term will be small, reducing the size of the AIC. However, for a model with many parameters, the $2 k$ will adjust the AIC value upwards to make the model less favorable. Over-fitting is therefore penalized, resulting in a higher AIC value. It is possible for the AIC value to be negative, however, the relative range of the AIC values can still be used. For example, if we have three models with AIC values, 0.6, -2.3, and 10.7, the second model should be selected.

In principle, the entire process could be automated, where models are generated automatically, fitted to data, and AIC values computed. The model with the lowest AIC value is selected for further validation.

An excellent discussion of the use and theory behind AIC can be found in the book by Buhrnham and Anderson [buhrnham2002model].

For python users, the `lmfit` package, which we used briefly in the last chapter but which we'll use much more in this chapter, will return a value for the AIC. This makes it extremely accessible to modelers.

For model selection, the AIC measure is by far the easiest to use.

## Estimating Confidence Intervals

If the residuals show no unusual trend, and the model is a good fit, we can now consider how confident we are in the fitted parameters. This confidence will depend on how the errors in the experimental data propagate into the parameter estimates. There will, therefore, be some uncertainty in the values for the parameters and in turn, the model predictions. For example, it is important to know whether a fitted $K_m$ with a value of 5.0 has an uncertainty of $\pm 0.2$ or $\pm 4.8$.

We can describe the uncertainty using confidence limits, that is, the possibility for a parameter value to be found within a given confidence limit such as $95 %$ of the time. Intuitively this means if one were to repeat the same experiment many times and each time fitted the experimental data to the model, we would find that 95% of the time, the fitted parameters would lie within the indicated range.

The uncertainty in a parameter $p$, that is the variance $\sigma^2_p$, can be estimated by calculating how each individual data point, $x_i$, influences the parameter through the data point's variance, $\sigma^2_{i}$. The following expression, derived in Bevington [Bevington1969], is an approximation but can be used to compute the parameter variances:

$$
\begin{equation}
\sigma^2_p \backsimeq \sum \left[ \sigma^2_{i}{\left(\frac{\partial p}{\partial x_i}\right)}^2 \right]
\label{eqn:LinearApproxConfLimits}
\end{equation}
$$

<!-- If we assume that the errors in the measurement are statistically independent and Gaussian distributed, and equal variance (after scaling by the weights), then the least square is identical to maximum likelihood estimation. -->
By evaluating the derivative, $\partial p/\partial x_i$, we find that (Details in [Bevington1969], page 154) the covariance matrix (See [[appendix_g_statistics_reminder|Covariance]]) can be obtained from the inverse of the Hessian ([[09_fitting_models|Gauss-Newton Method]]), ${\mathbf H}$:

$$
\begin{align*}
\text{Cov} = {\mathbf H}^{-1}
\end{align*}
$$

From this, an estimate for the standard deviation in the parameters can be found on the main diagonal of the covariance matrix:

$$
\begin{align}
\sigma_{p_i} \approx  {\sqrt{(\mathbf H)^{-1}_{ii}}}
\label{eqn:ConfLimitHessian}
\end{align}
$$

Assuming a large sample size and with a confidence level of $95 %$, it can be shown that the quoted limits $p_0 \pm \delta p$, are given by:

$$
\begin{equation}
\delta p_i = \pm 1.96 \sqrt{(\mathbf H)^{-1}_{ii} \frac{\epsilon}{N - P}}
\label{eqn:confidenceCalculation}
\end{equation}
$$

Recall that $\epsilon/(N - P)$ is the reduced chi-square term [[09_fitting_models|Optimizing Parameter Values]]. For small sample sizes (<30), the value 1.96 can be replaced by a value obtained from the Student's t distribution at 95%. It is important to note that the estimates given by equation [Estimating Confidence Intervals](#eqn-confidencecalculation) are an approximation. These estimates generally underestimate the actual confidence limits. This is due to a number of assumptions, in particular, we assume that the experimental noise is normally distributed and that the experimentally measured data points are independent observations. In addition, we assume that the number of data points collected is sufficient to give a good random sampling of the uncertainties in the data, and that the linear approximation [Estimating Confidence Intervals](#eqn-linearapproxconflimits) when deriving [Estimating Confidence Intervals](#eqn-conflimithessian) holds true. For very nonlinear models this is unlikely to be the case. The chance of inaccuracies in the uncertainty estimates is therefore quite likely.

 The confidence limits are derived from the main diagonal elements of ${\mathbf H} $. The off-diagonal contains information on the covariances, that is how a change in one parameter can influence the change in another parameter. This indicates whether the parameter estimates are  independent of each other. If parameters are correlated, it can mean there is insufficient experimental data (or variety of measurements) to separate the two parameters and identify them individually. We will return to this important topic in another section, where we'll look at examples of parameter correlation.

An alternative and possibly more trustworthy way to generate confidence limits and one that avoids many of the problems highlighted above, is the use of Monte Carlo simulations [SauroBarrett, Pr88, rawlings2002chemical, SauroBarrett], which we will address in the following section.

#### Determining Confidence Intervals from Monte Carlo Simulations

In the last section, a description was given on how to estimate 95% confidence limits on a set of fitted parameters. Intuitively, if we were to repeat the same experiment many times and each time fitted the experimental data to the model, we would find that 95% of the time, the fitted parameters would lie within the indicated range.

Unfortunately, the approach used to estimate these confidence limits includes many assumptions that may or may not be defensible. Going back to the intuitive explanation, if we *could* repeat the experiment many times and fit the data many times, we could get many estimates for the parameters, each estimate slightly different due to errors in the experimental data. From the samples of fitted parameters, we could then compute a standard deviation and thus obtain a confidence limit (Figure [Figure: a) In the real world we assume our system has a set of `true' paramete](#fig-montecarloa)). Obviously repeating the experiment many times is impractical, but by making two reasonable assumptions, we could do the same thing while only conducting *one real experiment*.

The two assumptions are:

- When we repeat an experiment, the underlying  biology remains the same, that is we are measuring the same thing again.
- Whatever errors are present in the measurements, the same kind of error manifests itself each time we repeat the experiment. What this means is that the probability distribution for the errors remains the same.

If these two assumptions hold, then we can consider creating *synthetic experimental data* sets if we know the probability distribution for the errors in our real measurements.

**Figure** <a id="fig-montecarloa"></a> `fig:MonteCarloA`

*Graphic (not in the LaTeX source, referenced by name): `MonteCarloA.pdf`*

*Caption:* a) In the real world we assume our system has a set of `true' parameter values, $p_{True}$. b) We do experiments which give us experimental data, $D_i$. c) Using b) we fit our model to obtain estimates for the parameters, $p_i$. Because each experiment is slightly different due to measurement uncertainty, we will generate slightly different sets of fitted parameters. 

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale=0.7]{MonteCarloA.pdf}
\caption{a) In the real world we assume our system has a set of `true' parameter values, $p_{\text{True}}$. b) We do experiments which give us experimental data, $D_i$. c) Using b) we fit our model to obtain estimates for the parameters, $p_i$. Because each experiment is slightly different due to measurement uncertainty, we will generate slightly different sets of fitted parameters. }
\label{fig:MonteCarloA}
\end{figure}
```

We need to make one further assertion before we can continue. Let us assume that the parameter estimates we obtain from fitting the real experimental data to the model are close to the true parameter values. That is, $p_{True}$ is not far from the fitted parameter, $p_0$. The core concept is to generate, via a bootstrap (see next section) new synthetic data sets. The bootstrap ensures that the new data sets have the same error distribution as the data collected from the real and only experiment performed. Each synthetic data set will be fitted to the model, from which we obtain multiple estimates for the parameters. Once we have a large sample of estimated parameters, we can make statements about the uncertainty of our parameter estimates (Figure [Figure: a) The actual system with true values for the parameters, $p_{True}$;](#fig-montecarlob)). In particular, approximate confidence intervals for the parameters can be obtained by using the $\frac{\alpha}{2}$ and 1-$\frac{\alpha}{2}$ sample quantiles (where $\alpha$ is the threshold, for example, 0.05 for 95% confidence) from the Monte Carlo estimators of the parameters.

If the experimental uncertainties surrounding measured data are not known, then a proxy can be obtained by relying on the residuals that were produced as a result of the parameter estimation procedure.

**Figure** <a id="fig-montecarlob"></a> `fig:MonteCarloB`

*Graphic (not in the LaTeX source, referenced by name): `MonteCarloB.pdf`*

*Caption:* a) The actual system with true values for the parameters, $p_{True}$; b) Generate a set of measurements, $D_o$, from one experiment a); c) Fit the data to the model to generate parameter estimates, $p_0$; d) Use a bootstrap to generate synthetic data sets, $D_i$; e) Fit the synthetic data sets to the model and produce a sample of parameter estimates, $p_i$. Use the sample of parameter estimates to gauge parameter uncertainty. 

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale=0.61]{MonteCarloB.pdf}
\caption{a) The actual system with true values for the parameters, $p_{True}$; b) Generate a set of measurements, $D_o$, from one experiment a); c) Fit the data to the model to generate parameter estimates, $p_0$; d) Use a bootstrap to generate synthetic data sets, $D_i$; e) Fit the synthetic data sets to the model and produce a sample of parameter estimates, $p_i$. Use the sample of parameter estimates to gauge parameter uncertainty. }
\label{fig:MonteCarloB}
\end{figure}
```

#### Bootstrap <a id="sec-bootstrap"></a>

**Bootstrapping** is a method to infer the statistics of a population by sampling from a sample of the population [Efron1986bootstrap, Pr88]. It is a means of gaining information about a population when the population itself is not available. The key assumption in a bootstrap is that the sample contains enough information to reconstruct details about the population. An example of a simple bootstrap is given in Appendix [[appendix_g_statistics_reminder|Statistics Reminder]].

The bootstrap method works as follows. Assume we have a sample of observations of size $N$ from our population. Generate new samples by selecting $N$ random values with replacement, that is, returning the value back to the pool before selecting another. Since we are sampling with replacement, some of the original observations may appear more than once in the new sample sets. Repeat the sampling process until the desired number of simulated data sets are generated.

In the case of fitting a model, what do we sample? One possibility are the residuals generated from the initial fit. The residuals are the difference between the fitted data value and the corresponding experimental value, that is:

$$ r_i = (y_i) observed - (y_i) predicted $$

To generate a synthetic data set, sample the residuals and add them to the predicted $y_i$ values:

$$
\begin{align}
(y_i)\ \text{synthetic} = (y_i)\ \text{predicted} + r_{\text{sample}}
\label{eqn:syntheticData}
\end{align}
$$

For example, assume that we fit a model to three data points. From the fit we obtain the three residuals: $(0.1, -0.5, 0.2)$.  Assume also that the fitted model has the following three fitted values $(10, 6, 3)$.  To sample residuals we randomly pick three values from the set of three residuals. Each time we pick a value, we also return the value back to the set (replacement). For example, the following sets are possible samples of residuals:

$$(-0.5, 0.2, 0.2), (-0.5, 0.1, 0.2), (0.2, 0.1, 0.1), (-0.5, 0.1, -0.5)$$

Using the residual samples, we generate the synthetic experimental data by adding each set to the predicted data ([Bootstrap](#eqn-syntheticdata)). For example $(10-0.5, 6+0.2, 3+0.2)$. With the four sampled residual sets, we can generate four new data sets:

$$ (9.5, 6.2, 3.2), (9.5, 6.1, 3.2), (10.2, 6.1, 3.1), (9.5, 6.1, 2.5)$$

We fit the model to each of these new data sets. It is prudent to generate at least 500 to 1,000 new synthetic data sets in this way.

Taking each synthetic data set in turn, fit the data to the model to generate a `synthetic' estimate for the parameters. We will thus generate 500 to 1,000 estimates for the model parameters. Using these parameters, we can calculate statistics such as the standard deviation for each parameter. However, unlike the estimated statistics from the Hessian, which will be symmetric, the confidence limits from the Monte Carlo method are not guaranteed to be symmetric. As a result, it is best to compute confidence limits using percentile values, although other approaches are possible [straume2010monte]. For example, we could generate 97.5$^{th}$ and 2.5$^{th}$ percentile values.

## Cross-validation

There are probably many models that one could propose to fit the data adequately, some complex, some simple. Just because data fits a model is no guarantee that the model will be useful. Here is a trivial example to illustrate this important point. The data in Table [Table: Example to illustrate model generalization](#tbl-trivialfit) fits a straight line, $y=1.9 x - 1.2$ with $R^2$ value of 0.9826 which suggests a very good fit. We make a prediction that at a value $x=30$, the predicted response is 55.8. However, when we attempt to confirm the prediction experimentally, we find that our prediction is off by a wide margin. Instead, we attempt a different fit, this time a second-order polynomial. The new fit yields a $R^2 = 1$ and a fitted equation of $y=0.1 x^2 + x$. The prediction at $x=30$ is now 120, which is exactly the expected value. The example is trivial, but it highlights a number of important points.

**Table** <a id="tbl-trivialfit"></a> `tbl:TrivialFit`

*Caption:* Example to illustrate model generalization.

```latex
\begin{table}
\centering
\begin{tabular}{l|llllllllll}\toprule
$x$ & 0 & 1   & 2   & 3   & 4   & 5   & 6   & 7    & 8    & 9 \\
$y$ & 0 & 1.1 & 2.4 & 3.9 & 5.6 & 7.5 & 9.6 & 11.9 & 14.4 & 17.1 \\ \bottomrule
\end{tabular}
\caption{Example to illustrate model generalization.}
\label{tbl:TrivialFit}
\end{table}
```

The original linear fit managed to reproduce the existing data very well, in fact there was no reason from the $R^2$ value to think otherwise. However, when tested, the model was found to be inadequate. The linear fit was only capable of making good predictions within the range of the data itself and perhaps a little beyond. The linear fit actually failed to capture the real essence of the data, that is it failed to **generalize** and recognize that the data followed a 2nd-order polynomial.

The ultimate purpose of a model is to organize our knowledge and make new and useful predictions. Even if the final model has passed all the statistical tests that we previously discussed, we cannot be sure that the model will make useful predictions beyond the data it was fitted to. The key question is, has the model generalized? The only way to determine this is to put the model to an actual test. The best way to do this would be to ask the model to make new predictions, preferably outside the range over which it was fitted. The only issue is that it might not be possible, or is too difficult to collect new data points. Instead, we can hold back some of the data we already have and use that to test new predictions. In the literature this is often called **cross-validation** [mclachlan2005analyzing].

The key idea behind cross-validation is simple. Rather than fit the model using *all* available data, we choose to hold back some data. We fit the model with the reduced data set and then using the fitted model, we determine how well the model predicts the data we held back. Since it has never seen the test data, this can be a test to see whether the model has sufficiently generalized or not. The technique is, however, not perfect because we're restricted to testing within the existing data set (but see later on with respect to time series data), and like all techniques in model development, one should be wary.

The data we use to fit the model is often called the **training set**, and the data we hold back the **test data**. If the fitted model fails to predict the test set, it means that the model has failed to generalize and has probably over-fitted the training set in order to appear to be a good fit.

Sometimes we only have limited data, and it becomes difficult to do separate out a training and test set. Instead, there are various ways to split the data to make the most out of the data we have.
The simplest is called `Leave-one-out cross-validation', or LOOCV. This is where we remove one data point from the available data set. The test data then constitutes one data point, and we must attempt to predict the value of that data point. This can be repeated for every data point. For example, if the entire data set includes twenty data points, then twenty different training sets can be created. A common way to measure how well the cross-validation has performed is to compute the root mean squared error (RMSE) over all the trials. Again, if we had twenty data points, we'd compute the RMSE for all 20 trials:

$$ RMSE = \sqrt{\frac{\sum_{i=1}^{N} \left(y_{i(predict)} - y_{i(test)}\right) }{N}} $$

This is can be computationally expensive. A generalization of LOOCV is called k-fold cross-validation [mclachlan2005analyzing]. This is where the data is partitioned into $k$ equal size subsamples (Figure [Figure: k-fold cross-validation is a generalization of LOOCV, where instead of](#fig-kfoldcrossvalidation)).  One subsample is designated the training set, and the remainder are used for fitting the model. This can be repeated for each $k$ subsample and even for different sized $k$. Alternatively, training sets can be generated by randomly selecting data points to be put into a training set. For large data sets, this is more practical. For each k-fold trial, the RMSE is computed. Once all k-fold combinations have been used, the RMSE are averaged:

$$ Performance = \frac{\sum_{i=1}^k RMSE_i}{k} $$

**Figure** <a id="fig-kfoldcrossvalidation"></a> `fig:kfoldcrossvalidation`

*Graphic (not in the LaTeX source, referenced by name): `kfoldcrossvalidation.pdf`*

*Caption:* k-fold cross-validation is a generalization of LOOCV, where instead of removing a single point, $k$ points are removed to a test set at a time.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale=0.8]{kfoldcrossvalidation.pdf}
\caption{k-fold cross-validation is a generalization of LOOCV, where instead of removing a single point, $k$ points are removed to a test set at a time.}
\label{fig:kfoldcrossvalidation}
\end{figure}
```

Another approach is to examine the predictions made during cross-validation for any patterns. For example, if all the tests yield equally good predictions, then this is a good indicator that the model has generalized and can be trusted to make further reliable predictions. If, however, the tests yield markedly different predictions, then it is a clear warning sign that the model is untrustworthy and should be carefully reexamined.

#### Cross-validation with Time Series Data

For time-series data, there is a better way to do cross-validation, sometimes called rolling forecasts. In this situation, the training set only consists of data that occurs prior to the observation that forms the test set. This means we pick a point in time, $m$, where everything after $m$ represents the test set, and everything, including $m$ before that, is the training set. For example, if we have a time series of $n$ points, a training set would include data from 0 to $n-m$ and the test set, $m+1$ to one or more data points. There are different variations on this pattern. We can take $m$ data points in the time series, and make $m+1$ data point the test set, a one-step forecast. We try all $m$ data points up to $n-1$. Figure [Figure: k-fold cross-validation using a time series data set](#fig-kfoldcrossvalidationtimeseries) illustrate a one-step forecast cross-validation. It is also possible to increase the number of data points in the test set, which yields k-fold time-series cross-validation. Another variant is to move the test set further ahead in time. The accuracy is computed by averaging over the test sets. This can be repeated for different models and the accuracy of each mode ranked.

**Figure** <a id="fig-kfoldcrossvalidationtimeseries"></a> `fig:kfoldcrossvalidationTimeSeries`

*Graphic (not in the LaTeX source, referenced by name): `CrossVal_TimeSeries.pdf`*

*Caption:* k-fold cross-validation using a time series data set. In this case $k=1$

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale=1.0]{CrossVal_TimeSeries.pdf}
\caption{k-fold cross-validation using a time series data set. In this case $k=1$}
\label{fig:kfoldcrossvalidationTimeSeries}
\end{figure}
```

### Example

Let's consider a simple example that illustrates cross-validation. We'll generate synthetic data that was computed from a 3rd-order polynomial with about 30% noise. We will use a LOOCV cross-validation on 16 models ranging from a polynomial of degree one (linear) to a 16th order polynomial. In each case, we'll conduct 16 trials by removing one data point in each trial and average the error we find. We will, therefore, do 256 fits in all. The panel on the right of Figure [Figure: Cross-validation example](#fig-crossvalidate) shows the average error as a function of the order of the polynomial. The arrow indicates the lowest error positioned over the third-order polynomial. In this particular case, the cross-validation predicted the correct model, but this is highly dependent on the amount of noise in the data. If there is more noise, the cross-validation will more likely show a low average error over a number of models.

**Figure** <a id="fig-crossvalidate"></a> `fig:crossvalidate`

*Graphic (not in the LaTeX source, referenced by name): `crossValidate.pdf`*

*Caption:* Cross-validation example. Sixteen different polynomials were fitted to synthetic data (with 30% error added) derived from a 3rd order polynomial. a) Plots for every LOOCV. Each plot contains 16 plots superimposed on each other. The top-left panel is from a first-order polynomial and proceeds row by row until the bottom right-hand corner represents results from the 16th order polynomial. Panel b) shows the average error as a function of polynomial order. The arrow indicates the minimum error. Generated using the listing `listing:crossValidationExample`.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale=0.35]{crossValidate.pdf}
\caption{Cross-validation example. Sixteen different polynomials were fitted to synthetic data (with 30\% error added) derived from a 3rd order polynomial. a) Plots for every LOOCV. Each plot contains 16 plots superimposed on each other. The top-left panel is from a first-order polynomial and proceeds row by row until the bottom right-hand corner represents results from the 16th order polynomial. Panel b) shows the average error as a function of polynomial order. The arrow indicates the minimum error. Generated using the listing~\ref{listing:crossValidationExample}.}
\label{fig:crossvalidate}
\end{figure}
```

## Case studies

In this section, we will consider some case studies. In each example, we will rely on the `lmfit` python package. This is a non-linear least-squares minimization and curve-fitting package for Python. It builds on the `scipy` package and adds additional functionality, which will be useful. `lmfit` offers a variety of optimizers including, Levenberg-Marquardt, differential evolution, and Nelder and Mead. These are sufficient for most purposes. The library can also supply parameter confidence estimates using different approaches as well as a wide variety of goodness-of-fit statistics. `lmfit` is distributed with Tellurium.

If you want to use a different Python distribution, you'll need to install `lmfit` using the command `pip install lmfit`. The package relies on a number of dependencies that include: `six, numpy, scipy, asteval`, and `uncertainties`. Again, is you're using Tellurium, you won't have to worry about these, but if you don't, you need to make sure they are also installed.

### Two-step Example <a id="subsec-simplemodel"></a>

In the first example, we'll consider a simple model that has only two steps and three variables, as shown in listing `python:SimplePathwayToFit2`. The python code for all the plots shown in the first example can found in listing `listing:SimplePathwayToFitListing`.

The objective is to estimate the values for the parameters, $k_1$ and $k_2$, based on synthetic data we will generate from the ground truth. We will investigate the case where we can only measure two of the three variables.

The code that was used to generate all the results in this section can be found in listing `listing:SimplePathwayToFitListing`. Figure [Figure: Ground truth for the simple two step model](#fig-groundtruth-simplemodel) shows the ground truth we will try to recover.

**Figure** <a id="fig-groundtruth-simplemodel"></a> `fig:groundtruth_simpleModel`

*Graphic (not in the LaTeX source, referenced by name): `groundtruth_simpleModel.pdf`*

*Caption:* Ground truth for the simple two step model.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale=0.5]{groundtruth_simpleModel.pdf}
\caption{Ground truth for the simple two step model.}
\label{fig:groundtruth_simpleModel}
\end{figure}
```

The first thing to do is to generate synthetic data with added noise. There are three species that can be measured, and to make the code more interesting, we will allow a user to select what variables they would like to record for the subsequent fitting. The choice of variables  will be stored in the variable `SIndexList`. For example if `SIndexList` is set to `[1,2]`, we will generate noisy synthetic data for variables $S_1$ and $S_2$. The generated data will be stored in the variable `y_data`. The number of generated synthetic points will be given by `nDataPoints` and we will simulate up to time `timeToSimulate`. The code for generating the synthetic data is shown in Figure `python:SimplePathwaySyntheticData`

```python
r = te.loada("""
   S1 -> S2; k1*S1;
   S2 -> S3; k2*S2;

   S1 = 1; S2 = 0; S3 = 0;
   k1 = 0.45; k2 = 0.15;
""")
```

```python
nDataPoints = 24
timeToSimulate = 20
# Create the experimental data
# First column is time, other columns are species
m = r.simulate (0, timeToSimulate, nDataPoints)

# Change this index to use different variables
# These are the variables that will be used to fit the model
SIndexList = [3] # 1 = S1, 2 = S2, 3 = S3
x_data = m['time']; # Extract the time column

# Extract the SIndexList columns into y_data
y_data = []
for i in range (len(SIndexList)):
    y_data.append (m[:,SIndexList[i]])

# Create the 'experimental' data by adding noise
y_noise = np.empty([nDataPoints])
for k in range (len (SIndexList)):
   for i in range (0, len (y_data[k])):
       y_noise[i] = 0.05 # standard deviation of noise
       # Not elegant but one way to avoid negative measured values
       ln = np.random.normal (0, y_noise[i]);
       while y_data[k][i] + ln < 0:
             ln = np.random.normal (0, y_noise[i]);
       y_data[k][i] = y_data[k][i] + ln # Add noise
```

There doesn't appear to be a general consensus in the literature on how to generate synthetic data with realistic noise. The classical approach is to add noise drawn from a Gaussian distribution with a mean of zero and given standard deviation. Such noise is added to the synthetic data points to simulate measurement error. A problem can arise because the noise values can be negative (since the mean of the noise is assumed to be zero). If a particular value drawn from the Gaussian distribution is too negative, there is the risk of generating a negative measurement, which for concentrations is impossible. I, therefore, added an `if` statement so that if a measurement value does go negative, the noise term is regenerated, and continue doing this until a positive measurement is generated. This is probably not the best way to go about this, and a better approach might be to draw from a log-normal distinction because samples drawn from this distribution can't fall below zero. Figure [Figure: Ground truth plus added `measurement' noise for the simple two step mo](#fig-simplemodel-groundtruth-plus-noise) shows the type of noisy data that can be generated this way; compare with Figure [Figure: Ground truth for the simple two step model](#fig-groundtruth-simplemodel).

**Figure** <a id="fig-simplemodel-groundtruth-plus-noise"></a> `fig:simpleModel_Groundtruth_plus_noise`

*Graphic (not in the LaTeX source, referenced by name): `simpleModel_Groundtruth_plus_noise.pdf`*

*Caption:* Ground truth plus added `measurement' noise for the simple two step model.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale=0.32]{simpleModel_Groundtruth_plus_noise.pdf}
\caption{Ground truth plus added `measurement' noise for the simple two step model.}
\label{fig:simpleModel_Groundtruth_plus_noise}
\end{figure}
```

We are now ready to fit the model to the synthetic data set. When using `lmfit`, we need to declare the parameters we wish to fit, create the optimizer, and call it. All this is shown in code listing `python:SimplePathwayFirstFit2`. Note that we call the differential evolution and the Levenberg-Marquardt optimizers. The differential evolution optimizer is used to find the global minimum and the Levenberg-Marquardt to provide initial estimates for the confidence limits using the Hessian matrix [[09_fitting_models|Gauss-Newton Method]]. `report_fit` prints out a summary of the fit.

The `result` variable returned from the optimizer also indicates success or failure. For this simple model, I happen to know it doesn't fail, and I won't bother to check. For more complex models, a check should be made first to see if the optimizer has succeeded or not by checking the Boolean value of `result.success`.

```python
import lmfit

params = lmfit.Parameters()
params.add('k1', value=1, min=0, max=10)
params.add('k2', value=1, min=0, max=10)

# Compute the fitted parameters
minimizer = lmfit.Minimizer(residuals, params)
result = minimizer.minimize(method='differential_evolution')
result = minimizer.minimize(method='leastsqr') # Use Levenberg-Marquardt
lmfit.report_fit(result.params, min_correl=0.5)
```

If the attempted fit fails, restart the program with a different starting point for the parameter values.

#### Fitting using $S_1, S_2$, and $S_3$ with zero error in the measurements

Let's begin by assuming we have perfect data, that is no measurement error, and we have data on all three species, $S_1$, $S_2$, and $S_3$. We can't do better than this. Recall that the ground truth values are 0.45 for $k_1$ and 0.15 for $k_2$. From the differential evolution optimizer, we obtain the following fitted values:

```python
    k1:  0.45
    k2:  0.15
```

The differential evolution method has no way to estimate the errors in the fitted values (because it doesn't compute the Hessian) so a Levenberg-Marquardt optimizer was subsequently run to obtain the following results:

```python
    k1:  0.45 +/- 1.3831e-14
    k2:  0.15 +/- 2.8697e-15
```

Unsurprisingly we get perfect results, although this won't necessarily happen when we work with more complex models. The estimates for these parameters are exactly at the ground truth values, and the error estimates from the Hessian Matrix are effectively zero.  We can now do experiments to investigate what happens if we are only able to measure one or two of the variables, again with no noise. We can do this by changing the `SIndexList` and rerunning the code.

If we only measure $S_1$ and $S_2$, we also get perfect results. Similarly, measuring $S_1$ and $S_3$ yields perfect results. This might be expected since only two of the variables are independent due to the conservation of mass in the system: $S_1 + S_2 + S_3 = constant$. Problems arise, however, when we start adding noise to our data.

#### Fitting using $S_1, S_2$, and $S_3$ with 30% error

What happens if we have noise in the measurements? Let's add plus or minus 0.1 of a standard deviation (about 30% error) to each measurement and record $S_1$, $S_2$, and $S_3$. The results from calling the optimizer is shown below.

```python
   Error estimates based on Hessian:
   k1:  0.391599 +/- 0.02920
   k2:  0.159375 +/- 0.00827
```

Immediately we see there are changes. The best fitted values for $k_1$ and $k_2$ are off by 9% and 6% respectively, and the errors estimated from the Hessian are non-zero. We can also get a better estimate for the uncertainty in the parameters by using a bootstrap [Bootstrap](#sec-bootstrap). This is shown in Figure [Figure: Bootstrap results from 6000 samples with an error of 0.1 standard devi](#fig-scatterk1k2-s1s2s3) where we ran the bootstrap for 6000 samples.

```python
   95% percentiles estimates based on the bootstrap:
   k1:  0.39277 +/- (0.05325, 0.04835)
   k2:  0.15962 +/- (0.01383, 0.01290)
```

The bootstrap gives roughly similar mean values compared to the fitted values, but the error estimates are twice the size. Figure [Figure: Bootstrap results from 6000 samples with an error of 0.1 standard devi](#fig-scatterk1k2-s1s2s3) shows how bad the uncertainty is in $k_1$, where we've plotted each estimate from the 6000 samples. Note that the uncertainty estimates for the bootstrap are not necessarily symmetric.

**Figure** <a id="fig-scatterk1k2-s1s2s3"></a> `fig:ScatterK1K2_S1S2S3`

*Graphic (not in the LaTeX source, referenced by name): `ScatterK1K2_S1S2S3.png`*

*Caption:* Bootstrap results from 6000 samples with an error of 0.1 standard deviation added to the data, measuring only $S_1$, $S_2$, and $S_3$ for model `python:SimplePathwayToFit2`. $k_1$ has a higher degree of uncertainty compared to $k_2$

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.24]{ScatterK1K2_S1S2S3.png}
 \caption{Bootstrap results from 6000 samples with an error of 0.1 standard deviation added to the data, measuring only $S_1$, $S_2$, and $S_3$ for model~\ref{python:SimplePathwayToFit2}. $k_1$ has a higher degree of uncertainty compared to $k_2$}
\label{fig:ScatterK1K2_S1S2S3}
\end{figure}
```

#### Fitting using $S_1$ and $S_2$ with 30% error

In the next study, let's remove one of the variables and only fit the model using $S_1$ and $S_2$. Unsurprisingly this results in more uncertainty in $k_1$ and $k_2$.

**Figure** <a id="fig-scatterk1k2-s1s2-error-a"></a> `fig:ScatterK1K2_S1S2_error_A`

*Graphic (not in the LaTeX source, referenced by name): `ScatterK1K2_S1S2_error.png`*

*Caption:* Bootstrap results from 6000 samples with an error of 0.1 standard deviation added to the data, measuring only $S_1$ and $S_2$ for model `python:SimplePathwayToFit2`.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.24]{ScatterK1K2_S1S2_error.png}
 \caption{Bootstrap results from 6000 samples with an error of 0.1 standard deviation added to the data, measuring only $S_1$ and $S_2$ for model~\ref{python:SimplePathwayToFit2}.}
\label{fig:ScatterK1K2_S1S2_error_A}
\end{figure}
```

The Hessian and bootstrap estimates are given below:

```python
   Error estimates based on Hessian:
   k1:  0.37466 +/- 0.03015 (8.05%)
   k2:  0.15926 +/- 0.01120 (7.03%)

   95% percentiles estimates based on the bootstrap:
   k1:  0.33135 +/-  (0.06141, 0.052344)
   k2:  0.13514 +/-  (0.01503, 0.014104)
```

The uncertainty has increased, and the fitted values have deteriorated significantly. Figure [Figure: Bootstrap results from 6000 samples with an error of 0.1 standard devi](#fig-scatterk1k2-s1s2-error-a) show the distribution of the parameter values based on the bootstrap.

#### Measuring $S_1$ and $S_3$ with 30% errors

Significant problems arise when we only measure $S_1$ and $S_3$. The bootstrap analysis is shown in Figure [Figure: Bootstrap results from 6000 samples with an error of 0.1 standard devi](#fig-scatterk1k2-s1s3-error).

```python
   Error estimates based on Hessian:
   k1:  0.359644 +/- 0.03486 (9.69%) (init = 1)
   k2:  0.158906 +/- 0.01390 (8.75%) (init = 1)

   95% percentiles estimates based on the bootstrap:
   k1:  0.29187 +/- 0.06665 0.05239
   k2:  0.21589 +/- 0.05209 0.0389
```

The values for $k_1$ and $k_2$ are now very poorly estimated. The 95% percentiles are almost as wide as the mean values. Figure [Figure: Bootstrap results from 6000 samples with an error of 0.1 standard devi](#fig-scatterk1k2-s1s3-error) shows the uncertainty in the values. The correlation is no longer linear but is non-linear. The lack of $S_2$ has caused a marked deterioration in the estimated values and an increase in their uncertainty.

**Figure** <a id="fig-scatterk1k2-s1s3-error"></a> `fig:ScatterK1K2__S1S3_error`

*Graphic (not in the LaTeX source, referenced by name): `ScatterK1K2_S1S3_error.png`*

*Caption:* Bootstrap results from 6000 samples with an error of 0.1 standard deviation added to the data, measuring only $S_1$ and $S_3$. The correlation is not linear but curved so that the limits on the 95% percentiles will not be symmetric.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.24]{ScatterK1K2_S1S3_error.png}
 \caption{Bootstrap results from 6000 samples with an error of 0.1 standard deviation added to the data, measuring only $S_1$ and $S_3$. The correlation is not linear but curved so that the limits on the 95\% percentiles will not be symmetric.}
\label{fig:ScatterK1K2__S1S3_error}
\end{figure}
```

#### Measuring $S_2$ and $S_3$ with 30% errors

If we measure $S_2$ and $S_3$, the estimates return again to reasonable values. Figure [Figure: Bootstrap results from 6000 samples with an error of 0.1 standard devi](#fig-scatterk1k2-s2s3-error) shows the distribution of points from the bootstrap. Both this and the previous experiment highlights the importance of $S_2$.

```python
   Error estimates based on Hessian:
   k1:  0.41104 +/- 0.05513 (13.41%)
   k2:  0.14487 +/- 0.00892 (6.16%)

   95% percentiles estimates based on the bootstrap:
   k1:  0.42147 +/-  0.10690 0.09308
   k2:  0.14473 +/-  0.01858 0.01514
```

**Figure** <a id="fig-scatterk1k2-s2s3-error"></a> `fig:scatterK1K2_S2S3_error`

*Graphic (not in the LaTeX source, referenced by name): `scatterK1K2_S2S3_error.png`*

*Caption:* Bootstrap results from 6000 samples with an error of 0.1 standard deviation added to the data, measuring only $S_2$ and $S_3$.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.24]{scatterK1K2_S2S3_error.png}
 \caption{Bootstrap results from 6000 samples with an error of 0.1 standard deviation added to the data, measuring only $S_2$ and $S_3$.}
\label{fig:scatterK1K2_S2S3_error}
\end{figure}
```

#### Measuring $S_2$ with 30% errors

For the final experiment, let's just supply a single measurement, $S_2$. It is worth noting first that if we only measure $S_1$ or $S_3$ we get extremely poor estimates for $k_1$ and $k_2$. For example, is we only measure $S_3$, we obtain the plot shown in Figure [Figure: Bootstrap results from 6000 samples with an error of 0.1 standard devi](#fig-scatterk1k2-b) where one can observe that the uncertainly in $k_1$ and $k_2$ is very high.

**Figure** <a id="fig-scatterk1k2-s2-scatter"></a> `fig:ScatterK1K2_S2_scatter`

*Graphic (not in the LaTeX source, referenced by name): `ScatterK1K2_S2_scatter.png`*

*Caption:* Bootstrap results from 6000 samples with an error of 0.1 standard deviation added to the data, measuring only $S_2$ from the two-step model ( [Two-step Example](#subsec-simplemodel)). This experiment illustrates the importance of using $S_2$ in the parameter fitting.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.24]{ScatterK1K2_S2_scatter.png}
 \caption{Bootstrap results from 6000 samples with an error of 0.1 standard deviation added to the data, measuring only $S_2$ from the two-step model (~\ref{subsec:simpleModel}). This experiment illustrates the importance of using $S_2$ in the parameter fitting.}
\label{fig:ScatterK1K2_S2_scatter}
\end{figure}
```

**Figure** <a id="fig-scatterk1k2-b"></a> `fig:ScatterK1K2_B`

*Graphic (not in the LaTeX source, referenced by name): `ScatterK1K2_C.png`*

*Caption:* Bootstrap results from 6000 samples with an error of 0.1 standard deviation added to the data, measuring only $S_3$ from the two-step model. $k_2$ has a very high degree of uncertainty. Number of simulations, 445,026; time takes to compute: 103 seconds.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.24]{ScatterK1K2_C.png}
 \caption{Bootstrap results from 6000 samples with an error of 0.1 standard deviation added to the data, measuring only $S_3$ from the two-step model. $k_2$ has a very high degree of uncertainty. Number of simulations, 445,026; time takes to compute: 103 seconds.}
\label{fig:ScatterK1K2_B}
\end{figure}
```

Using just $S_2$ improves matters significantly. If we look at the dynamics shown in the ground truth plot in Figure [Figure: Ground truth for the simple two step model](#fig-groundtruth-simplemodel), we see that most of the interesting dynamics is in $S_2$ where $S_2$ rises rapidly then decays at a slower rate.. This suggests why $S_2$ is the most informative measurement we can take. However, it is also important that we have enough points to capture the rise and fall of $S_2$ at the turning point and have enough points to provide the maximal value that $S_2$ reaches. We can afford to have fewer points where the level of $S_2$ decays more slowly.  If we increase the number of measured values and only measure $S_2$, we can significantly improve the estimates for $k_1$ and $k_2$. For example, if we increase the number of measurements to 64 data points, we obtain the following estimates from the bootstrap:

```python
   95% percentiles estimates based on the bootstrap:
   k1:  0.4419 +/-  0.0471, 0.0392
   k2:  0.1520 +/-  0.0065, 0.0070
```

These fitted values are very good. This illustrates the point that its not so much the quantity of data but the type of data we are using in the fitting process that is important.

### Summary

We can summarize the previous experiments as follows (See Table [Table: Summary of results from the two step pathway](#tbl-summarytwosteperrors)). Noise in the measurements results in uncertainty in both the fitted values and their distribution. $S_2$ is a key measurement. In all cases where $S_2$ is available, the fitted estimates are much better. The reason for this is that the time course for $S_2$ is rich in dynamic information because it rises then falls whereas the other two variables, $S_1$ and $S_3$ are monotonic. Note also that it is only $S_2$ that involves both $k_1$ and $k_2$ in its differential equation. Focusing our data collection at points where there are rapid changes in behavior improves the fit.

**Table** <a id="tbl-summarytwosteperrors"></a> `tbl:summaryTwoStepErrors`

*Caption:* Summary of results from the two step pathway. Noise in the data was 30%, uncertainty estimates are 95% percentiles. Note that including $S_2$ in the fit significantly improved the mean values and degree of uncertainty. 

```latex
\begin{table}
\centering
\begin{tabular}{llll} \toprule
Measured Variables &  $k_1 (+,-)$ & $k_2 (+,-)$ \\ \midrule
$S_1, S_2, S_3$ & 0.39 (0.053, 0.048) & 0.16 (0.014, 0.013) \\
$S_1, S_2$      & 0.33 (0.061, 0.052) & 0.13 (0.015, 0.014) \\
$S_1, S_3$      & 0.29 (0.066, 0.052) & 0.22 (0.052, 0.039) \\
$S_2, S_3$      & 0.42 (0.11, 0.09)   & 0.15 (0.018, 0.015) \\
$S_2$           & 0.44 (0.047, 0.039) & 0.15 (0.0062, 0.007) \\ \bottomrule
\end{tabular}
\caption{Summary of results from the two step pathway. Noise in the data was 30\%, uncertainty estimates are 95\% percentiles. Note that including $S_2$ in the fit significantly improved the mean values and degree of uncertainty. }
\label{tbl:summaryTwoStepErrors}
\end{table}
```

<!-- ---------------------------------------------------------------- -->

### A Larger Example

Let's now consider a larger example of a chain of five irreversible uni-molecular reactions that follow mass-action kinetics:

$$
\begin{equation}
\text{S}_1 \rightarrow \text{S}_2 \rightarrow \text{S}_3 \rightarrow \text{S}_4 \rightarrow \text{S}_5\rightarrow  \text{S}_6
\label{eqn:testExampleFitting}
\end{equation}
$$

The model we'll enter into Tellurium is shown below:

```python
r = te.loada("""
# Reactions
    J1: S1 -> S2; k1*S1
    J2: S2 -> S3; k2*S2
    J3: S3 -> S4; k3*S3
    J4: S4 -> S5; k4*S4
    J5: S5 -> S6; k5*S5;

# Species initializations
    S1 = 10;
# Parameters:
   k1 = 1; k2 = 2; k3 = 3; k4 = 4; k5 = 5
""")
```

The noisy concentration data for the six species displayed in Figure [Figure: a) Plot of the simulated noisy time series from the five-step model \e](#fig-fivestepsdataplusfitted)(a). The pathway was simulated with kinetic rate coefficients set to
$1, 2, 3, 4$, and $5$, respectively. The initial concentration of the first substrate, $S_1$, set to $10$, and all others to zero.

Figure [Figure: a) Plot of the simulated noisy time series from the five-step model \e](#fig-fivestepsdataplusfitted)(b) has $100$ points together with the fitted curves. The noise was assumed to be normally distributed and was added to the simulated ground truth, and then used to fit the model. Differential evolution and the Levenberg-Marquardt were used, and both gave similar results. The five parameters were initialized to $1$. The fit is shown in Figure [Figure: a) Plot of the simulated noisy time series from the five-step model \e](#fig-fivestepsdataplusfitted)(b) as solid lines.

\renewcommand{\topfraction}{0.85}
\renewcommand{\bottomfraction}{0.85}
\renewcommand{\textfraction}{0.15}
\renewcommand{\floatpagefraction}{0.8}
\renewcommand{\textfraction}{0.1}

**Figure** <a id="fig-fivestepsdataplusfitted"></a> `fig:fiveStepsDataPlusFitted`

*Graphic (not in the LaTeX source, referenced by name): `fiveStepsDataPlusFitted.pdf`*

*Caption:* a) Plot of the simulated noisy time series from the five-step model [A Larger Example](#eqn-testexamplefitting) and b) the fitted
curves for the model.

```latex
\begin{figure}[tbp]
\centering
 \includegraphics[scale=0.42]{fiveStepsDataPlusFitted.pdf}
 \caption{a) Plot of the simulated noisy time series from the five-step model~\eqref{eqn:testExampleFitting} and b) the fitted
curves for the model.}
\label{fig:fiveStepsDataPlusFitted}
\end{figure}
```

A Monte Carlo bootstrap was run, and for each generated synthetic dataset, the optimized parameters were recorded. Figure [Figure: Cluster plots for the distribution of fitted parameters using a Monte](#fig-fivereactionsparameterclusterplots) shows the distribution of parameter estimates from the Monte Carlo bootstrap. We will use these kinds of plots in later examples. They are a useful way to get a quick visual impression of how well the fitted parameters behave. Each graph plots estimates for one of the parameters against another. Along the main diagonal, we have the distribution plot for an individual parameter. In the ideal situation, the main diagonal plots should show a symmetric, normal-like distribution. The off-diagonal plots should show a spherical distribution of points indicating zero correlation between the two parameters, although one should take care in comparing the axes scales before jumping to conclusions.  The plots shown in Figure [Figure: Cluster plots for the distribution of fitted parameters using a Monte](#fig-fivereactionsparameterclusterplots) show some large uncertainties in $k_3$, $k_4$, and $k_5$. We will see this reflected in the Hessian and bootstrap estimates.

Confidence limits were obtained using the Hessian equation [Estimating Confidence Intervals](#eqn-confidencecalculation) and are shown in Table [Table: The table shows $95%$ confidence limits for the model \eqref{eqn:testE](#tbl-fivereactionsconfidencetable). Table [Table: Table of correlation coefficients from the Hessian matrix using model](#tbl-fivereactionscorrelations) shows the correlations computed by `lmfit`. All the values are quite small indicating little or no correlations between the parameters.

**Table** <a id="tbl-fivereactionsconfidencetable"></a> `tbl:fiveReactionsConfidenceTable`

*Caption:* The table shows $95%$ confidence limits for the model [A Larger Example](#eqn-testexamplefitting) for the estimated parameters based on the Hessian, equation [Estimating Confidence Intervals](#eqn-confidencecalculation).

```latex
\begin{table}[tbp]
\centering
\begin{tabular}{cl}\toprule
Parameter & Value \\ \midrule
$k_1$ & $1.02 \pm 0.024$ \\
$k_2$ & $1.88 \pm 0.082$ \\
$k_3$ & $3.14 \pm 0.23$ \\
$k_4$ & $3.69 \pm 0.33$ \\
$k_5$ & $4.99 \pm 0.59  $ \\ \bottomrule
\end{tabular}
\caption{The table shows $95\%$ confidence limits for the model~\eqref{eqn:testExampleFitting} for the estimated parameters based on the Hessian, equation~\eqref{eqn:confidenceCalculation}.}
\label{tbl:fiveReactionsConfidenceTable}
\end{table}
```

**Table** <a id="tbl-fivereactionscorrelations"></a> `tbl:fiveReactionsCorrelations`

*Caption:* Table of correlation coefficients from the Hessian matrix using model [A Larger Example](#eqn-testexamplefitting). Only correlations larger than 0.1 are shown.

```latex
\begin{table}[tbp]
\centering
\begin{tabular}{ll} \\ \toprule
    $C(k_4, k_5) = -0.251$ & $C(k_3, k_4) = -0.231$ \\
    $C(k_3, k_5) = -0.219$ & $C(k_2, k_3) = -0.207$ \\
    $C(k_1, k_2) = -0.190$ & $C(k_2, k_4) = -0.184$ \\
    $C(k_2, k_5) = -0.179$ & $C(k_1, k_3) = -0.144$ \\
    $C(k_1, k_5) = -0.140$ & $C(k_1, k_4) = -0.137$ \\ \bottomrule
\end{tabular}
\caption{Table of correlation coefficients from the Hessian matrix using model~\eqref{eqn:testExampleFitting}. Only correlations larger than 0.1 are shown.}
\label{tbl:fiveReactionsCorrelations}
\end{table}
```

**Figure** <a id="fig-fivereactionsparameterclusterplots"></a> `fig:fiveReactionsparameterClusterPlots`

*Graphic (not in the LaTeX source, referenced by name): `fiveReactionGrid.png`*

*Caption:* Cluster plots for the distribution of fitted parameters using a Monte Carlo bootstrap of the five-step model [Figure: a) Plot of the simulated noisy time series from the five-step model \e](#fig-fivestepsdataplusfitted). We can see that a number of the parameters show significant uncertainty in their estimation. For example, $k_5$ is particularly bad.  However, the individual distributions on the main diagonal appear fairly symmetrical. See listing `listing:fiveReactionModel`

```latex
\begin{figure}[tbp]
\centering
 \includegraphics[scale=0.45]{fiveReactionGrid.png}
 \caption{Cluster plots for the distribution of fitted parameters using a Monte Carlo bootstrap of the five-step model~\eqref{fig:fiveStepsDataPlusFitted}. We can see that a number of the parameters show significant uncertainty in their estimation. For example, $k_5$ is particularly bad.  However, the individual distributions on the main diagonal appear fairly symmetrical. See listing~\ref{listing:fiveReactionModel}}.
\label{fig:fiveReactionsparameterClusterPlots}
\end{figure}
```

<!-- UP AS FAR AS HERE ---------------------------------------------------------------------------------------------- -->

The confidence limits were also evaluated using the bootstrap method (Figure [Figure: Cluster plots for the distribution of fitted parameters using a Monte](#fig-fivereactionsparameterclusterplots)). If we compare the confidence limits generated by the Hessian and the bootstrap, we see there are differences. In fact, the Hessian matrix gives an erroneous view of how precise the parameters were estimated. For example, the ground truth value for $k_4$ is 4.0 but the fit gives a value of $3.69 \pm 0.33$ (0.33 is at the 95% confidence limit). The bootstrap gives a much wider set of limits reflecting the truer estimate of the uncertainly as a result of noise in the data.  In this case, $k_4$ ranges from 3.31 to 4.43, which seems more reasonable. Confidence limits from the Hessian can give unrealistic estimates for the uncertainty in the fitted parameters.

Even though we had data on all six species, we see that the parameters $k_3, k_4$ and $k_5$ have a high degree of uncertainty (Table [Table: Distribution of parameter values generated using the bootstrap method](#tbl-fivereactions)). In this experiment and subsequent ones, the computer time spent to compute the estimates will also be given. For larger models, the computational cost increases rapidly.

**Table** <a id="tbl-fivereactions"></a> `tbl.fiveReactions`

*Caption:* Distribution of parameter values generated using the bootstrap method for model [A Larger Example](#eqn-testexamplefitting). Note that the upper and lower limits are not quite symmetrical. Time to compute the Monte Carlo bootstrap 214 seconds. Number of simulations carried out =  951,408.

```latex
\begin{table}
\centering
\begin{tabular}{llll} \\ \toprule
Parameter & Value & Upper Limit & Lower Limit \\ \midrule
k1 & 1.019 &  0.0458 & 0.045 \\
k2 & 1.878 & 0.1763 & 0.1617 \\
k3 & 3.167 &  0.5295 & 0.4368 \\
k4 & 3.710 &  0.7203 & 0.5817 \\
k5 & 5.064 &  1.3718 & 1.0203 \\ \bottomrule
\end{tabular}
\caption{Distribution of parameter values generated using the bootstrap method for model~\eqref{eqn:testExampleFitting}. Note that the upper and lower limits are not quite symmetrical. Time to compute the Monte Carlo bootstrap 214 seconds. Number of simulations carried out =  951,408.}
\label{tbl.fiveReactions}
\end{table}
```

The same model was also fitted, assuming no noise in the data. Under these conditions, the fitted parameters were found to be exactly at the ground truth, and the uncertainty was effectively zero.  What this means is that there were no intrinsically unidentifiable parameters in the model. Such models are referred to as **structurally identifiable**. However, the noise in the data renders some of the parameters unidentifiable. In the next section, we'll see an example where there are non-identifiable parameters in the model, a situation called **practical identifiable**.

\stateComment{

- **Structural Unidentifiability:** The structure of the model is such that there are some parameters whose values cannot be determined no matter what kind or how much experiential data is at hand.
- **Practical Unidentifiability:** Noise or the type of data collected, means that one or more parameters in a model cannot be determined with any certainty.

}

### Five-step Pathway with Non-linear Kinetics

The next problem we'll consider is the more complex model shown in Figure [Figure: Six-step model used to illustrate fitting using Python and Tellurium](#fig-complexfittingpathway). X$_o$ and X$_1$ are boundary species and are therefore fixed. The model has six reactions, with two feedback regulation loops. Two of the reactions follow non-linear kinetics. We'll set up the model with specific values for the parameters, this will represent the ground truth. A set of `experimental' data was generated by adding about 30% Gaussian noise to simulation results. A plot of the `experimental data' can be found in Figure [Figure: Raw data for fitting the six-step nonlinear model](#fig-complexfittingpathway-rawdata).

**Figure** <a id="fig-complexfittingpathway"></a> `fig:ComplexFittingPathway`

*Graphic (not in the LaTeX source, referenced by name): `FittingPathway`*

*Caption:* Six-step model used to illustrate fitting using Python and Tellurium. X$_o$ and X$_1$ are boundary species.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.4]{FittingPathway}
 \caption{Six-step model used to illustrate fitting using Python and Tellurium. X$_o$ and X$_1$ are boundary species.}
\label{fig:ComplexFittingPathway}
\end{figure}
```

```python
r = te.loada("""
# Reactions
    J1: $X0 -> S1; (Vm*X0)/((Km + X0) + (S1/KI));
    J2: S1 -> S2; k2*S1/(1 + S3/KI2);
    J3: S2 -> S3; k3*S2;
    J4: S2 -> S4; k4*S2;
    J5: S4 -> $X1; k5*S4;
    J6: S3 -> $X1; k6*S3;
# Species initializations
    $X0 = 10; S1 = 0; S2 = 0;  S3 = 0;  S4 = 0
    $X1 = 10
# Parameters:
    Vm = 15; Km = 5;  KI = 10; k2 = 5; k3 = 10
    k4 = 5;  k5 = 15; k6 = 5;  KI2 = 10.1
""")
```

**Figure** <a id="fig-complexfittingpathway-rawdata"></a> `fig:ComplexFittingPathway_rawdata`

*Graphic (not in the LaTeX source, referenced by name): `FittingPathway_rawdata`*

*Caption:* Raw data for fitting the six-step nonlinear model. Generated from the ground truth model (Listing `python:FittingPathway`) with about 30% added Gaussian noise.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.6]{FittingPathway_rawdata}
 \caption{Raw data for fitting the six-step nonlinear model. Generated from the ground truth model (Listing~\ref{python:FittingPathway}) with about 30\% added Gaussian noise.}
\label{fig:ComplexFittingPathway_rawdata}
\end{figure}
```

A minimum was found using differential evolution algorithm provided by lmfit. During the procedure, the best fitness value at each generation was recorded.  Figure [Figure: Fitness as a function of generation time for the scipy Differential Ev](#fig-fittingpathway-fitness-vs-generation) shows the fitness measure as a function of generation number. It shows a typical pattern where improvements to the fit occur in jumps followed by pauses. Even within fifty generations, a reasonable fit was achieved. Figure [Figure: Result of using differential evolution to fit the nine parameters foun](#fig-fittingpathway-model-prediction) plots both the ground truth as solid lines, the `experimental data' in the form of individual points, the fit itself as dotted lines. The residuals are also shown at the $y=0$ axis.

To investigate this further, we need to look at the uncertainly in the fitted values. With 200 bootstraps, the entire analysis took 30 minutes to carry out and involved over 6 million individual simulations. This is a bigger model than the previous ones and shows that for even larger models that may contain up to 30 or 40 species, the time requires to fit a model might take weeks or months to compute. In these cases, access to a supercomputer is essential.

Table [Table: Computed 95 percent percentiles from the bootstrap run, see Figure \re](#tbl-fittedvaluesbootstrap) shows estimates for the parameters and their uncertainties computed using a bootstrap alongside the values for the ground truth. Some of the fitted values are clearly not well estimated. In particular, $V_m$, $K_m$, and $KI$ have large uncertainly bounds, and their mean values are very poor compared to the ground truth.

<!-- In the simpler model we used a variety of methods to obtain such estimates and each method gave similar results. In this case the computational burden is too much to trace the chi square contours and is certainly too much to do a Monte Carlo Markov Chain sampling. This highlights one of the difficulties with even moderately complex models. For models that are much bigger it is not practical to do such analyses on desktop computers. -->

**Figure** <a id="fig-fittingpathway-fitness-vs-generation"></a> `fig:FittingPathway_Fitness_vs_Generation`

*Graphic (not in the LaTeX source, referenced by name): `FittingPathway_Fitness_vs_Generation`*

*Caption:* Fitness as a function of generation time for the scipy Differential Evolution optimizer using the six-step nonlinear model shown in listing `python:FittingPathway`. Listing `listing:complexModelFitting`

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.6]{FittingPathway_Fitness_vs_Generation}
 \caption{Fitness as a function of generation time for the scipy Differential Evolution optimizer using the six-step nonlinear model shown in listing~\ref{python:FittingPathway}. Listing~\ref{listing:complexModelFitting}}
\label{fig:FittingPathway_Fitness_vs_Generation}
\end{figure}
```

Figure [Figure: Data generated using 600 samples generated using the bootstrap techniq](#fig-boostrapgrid-complexmodel) shows the distribution pattern found in every combination of parameter. A couple of things stand out. The first is the pronounced diagonal line between Km and Vm, this is a clear sign of non-identifiability. This accounts for a large amount of uncertainty on these parameters. The second point to note is the bimodal nature of the plots with respect to $KI$. This accounts for the poor estimate for $KI$. There are also non-identifiability issues between $k_3$ and $k_6$ and $k_4$ and $k_5$. These issues have arisen even though we have data on all four species.

**Figure** <a id="fig-fittingpathway-model-prediction"></a> `fig:FittingPathway_Model_Prediction`

*Graphic (not in the LaTeX source, referenced by name): `FittingPathway_Model_Prediction`*

*Caption:* Result of using differential evolution to fit the nine parameters found in the six-step nonlinear model shown in listing `python:FittingPathway`. Generated using listing `listing:complexModelFitting`

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.55]{FittingPathway_Model_Prediction}
 \caption{Result of using differential evolution to fit the nine parameters found in the six-step nonlinear model shown in listing~\ref{python:FittingPathway}. Generated using listing~\ref{listing:complexModelFitting}}
\label{fig:FittingPathway_Model_Prediction}
\end{figure}
```

**Figure** <a id="fig-boostrapgrid-complexmodel"></a> `fig:boostrapGrid_complexmodel`

*Graphic (not in the LaTeX source, referenced by name): `boostrapGrid_complexmodel.png`*

*Caption:* Data generated using 600 samples generated using the bootstrap technique on six-step nonlinear model [Figure: Six-step model used to illustrate fitting using Python and Tellurium](#fig-complexfittingpathway). The grid shows interesting behaviors among a number of e parameters. In particular, there are very strong correlations between $K_m$ and $V_m$ and clear but less pounced correlation amount a number of other parameters. Also quite noticeable are the bimodal distributions within the $K_I$ column. Most of the parameters appear to show some kind of correlation. Listing `listing:complexModelFitting`

```latex
\begin{figure}[tbp]
\centering
 \includegraphics[scale=0.5]{boostrapGrid_complexmodel.png}
 \caption{Data generated using 600 samples generated using the bootstrap technique on six-step nonlinear model~\ref{fig:ComplexFittingPathway}. The grid shows interesting behaviors among a number of e parameters. In particular, there are very strong correlations between $K_m$ and $V_m$ and clear but less pounced correlation amount a number of other parameters. Also quite noticeable are the bimodal distributions within the $K_I$ column. Most of the parameters appear to show some kind of correlation. Listing~\ref{listing:complexModelFitting}}.
\label{fig:boostrapGrid_complexmodel}
\end{figure}
```

**Table** <a id="tbl-fittedvaluesbootstrap"></a> `tbl:FittedValuesBootstrap`

*Caption:* Computed 95 percent percentiles from the bootstrap run, see Figure [Figure: Data generated using 600 samples generated using the bootstrap techniq](#fig-boostrapgrid-complexmodel), for the six-step nonlinear model. Time to compute fit = 1729 seconds; Number of simulations = 6,616,529

```latex
\begin{table}
\centering
\begin{tabular}{lllll} \toprule
Parameter & Fitted value & Plus & Minus & True Value \\ \midrule
Vm & 23.449 &  6.548 & 12.177 & 15 \\
Km & 13.337 &  6.814 & 12.161 & 5 \\
KI & 17.015 &  12.99 & 16.580 & 10 \\
KI2 & 8.391 &  3.141 & 2.582 & 5 \\
k2 & 5.0135 &  0.402 & 0.488 & 10.1 \\
k3 & 9.6971 &  0.696 & 0.686 & 10 \\
k4 & 4.5992 &  1.46  & 1.813 & 5\\
k5 & 13.554 &  4.481 & 5.591 & 15\\
k6 & 4.9546 &  0.392 & 0.371 & 5 \\ \bottomrule
\end{tabular}
\caption{Computed 95 percent percentiles from the bootstrap run, see Figure~\ref{fig:boostrapGrid_complexmodel}, for the six-step nonlinear model. Time to compute fit = 1729 seconds; Number of simulations = 6,616,529}
\label{tbl:FittedValuesBootstrap}
\end{table}
```

We now wish to ask if the non-identifiability we observed in Figure [Figure: Data generated using 600 samples generated using the bootstrap techniq](#fig-boostrapgrid-complexmodel) is structural or simply due to noise in our data (practical identifiability). We can test this by using data without any noise in the four species to estimate the parameters. The plots in Figure [Figure: Result of using differential evolution to fit the nine parameters foun](#fig-complexmodelperfectdata) show the results of the fit. What is remarkable is the significant amount of correlation between the variables. This shows that a number of the variables are structurally unidentifiable.  In the case of $K_m$ and $V_m$, this is not hard to understand. Let's say we increased $V_m$, which gives us an increase in the rate, $v$. We can now also increase $K_m$ until the original rate is restored. In other words, there is an infinite number of combinations of $V_m$ and $K_m$ that can produce the same reaction rate with the same substrate and product concentrations. The same applies to a number of the other correlations we see. This leads to structural non-identifiability in the model. No matter what or how much experimental data we have, we can not uniquely identify such parameters. The way to eliminate this problem is to reconsider the rate laws used in the model in order to eliminate relationships among the parameters.

**Figure** <a id="fig-complexmodelperfectdata"></a> `fig:complexModelPerfectData`

*Graphic (not in the LaTeX source, referenced by name): `complexModelPerfectData.png`*

*Caption:* Result of using differential evolution to fit the nine parameters found in the six-step nonlinear model shown in listing `python:FittingPathway`. The model was fitted with perfect data using all four variables. Note the correlations between the fitted parameter values $V_m$, $K_m$, and $KI$. Generated using listing `listing:complexModelFitting`

```latex
\begin{figure}[htbp]
\centering
 \includegraphics[scale=0.5]{complexModelPerfectData.png}
 \caption{Result of using differential evolution to fit the nine parameters found in the six-step nonlinear model shown in listing~\ref{python:FittingPathway}. The model was fitted with perfect data using all four variables. Note the correlations between the fitted parameter values $V_m$, $K_m$, and $KI$. Generated using listing~\ref{listing:complexModelFitting}}
\label{fig:complexModelPerfectData}
\end{figure}
```

The 95% percentiles from the bootstrap are given in Table [Table: 95% percentiles generated using perfect data on the six-step nonlinear](#tbl-bootstrapperfectdatacomplexmodel) and highlights the huge uncertainty in $V_m$, $K_m$ and $KI$.

**Table** <a id="tbl-bootstrapperfectdatacomplexmodel"></a> `tbl:BootstrapPerfectDataComplexModel`

*Caption:* 95% percentiles generated using perfect data on the six-step nonlinear model [Figure: Six-step model used to illustrate fitting using Python and Tellurium](#fig-complexfittingpathway). Time to compute fit =  432 seconds; Number of simulations =  2,015,709

```latex
\begin{table}
\centering
\begin{tabular}{llll} \\ \toprule
Parameter & Mean & Lower Limit & Upper Limit \\ \midrule
Vm &  23.788 &  5.8395 & 7.5444 \\
Km & 13.788 &  5.8395 & 7.5444 \\
KI & 6.431 &  2.8031 & 1.3666 \\
KI2 & 10.1 &  4.2406e-05 & 6.0398e-06 \\
k2 & 5 & 8.8270e-06 & 9.9950e-07 \\
k3 & 10 &  6.6378e-07 & 1.780e-06 \\
k4 & 5 &  3.5310e-05 & 3.827e-06 \\
k5 & 15 &  0.00012 & 1.17018e-05 \\
k6 & 5 &  3.51325e-07 & 9.8972e-07 \\ \bottomrule
\end{tabular}
\caption{95\% percentiles generated using perfect data on the six-step nonlinear model~\ref{fig:ComplexFittingPathway}. Time to compute fit =  432 seconds; Number of simulations =  2,015,709}
\label{tbl:BootstrapPerfectDataComplexModel}
\end{table}
```

### Summary

We can summarize these experiments with the following very important points:

\stateHighlight{

- What we measure matters. The quality of the data and what variables are measured is more important than quantity.
- Having sufficient data points to capture the detailed dynamics is critical.
- The level of noise will have significant effects on the estimates.

These case studies suggest a strategy. Carry out an experiment first to obtain an initial set of experiment data. Use this data to run simulations and mock parameter fitting to determine how well the data can be used to generate a fit. This will allow a researcher to decide what, if any, new data should be collected, what level of noise is tolerable, and what data is unnecessary. At that point, a more thorough data collecting exercise can be carried out.

<!-- {\tt lmfit.conf_interval} will -->

<!-- \subsection*{Strong Inference} -->

<!-- {\bfseries\Large Platt} -->

## Further Reading and Online Resources

- Berendsen HJ. (2011) A Student's Guide to Data and Error Analysis. Cambridge University Press. ISBN: 978-0-521-13492-7

- Draper NR and Smith H (1998) Applied Regression Analysis. 3rd edition. Wiley Series on Probability and Statistics. ISBN-13: 978-047117082

- Johnson ML, Faunt LM (1992) Parameter estimation by least-squares methods. Methods in Enzymology, 210, 1-37.

- Johnson ML (1994) Use of Least-Squares Techniques in Biochemistry. Methods in Enzymology, 240, 1-22.

- David Liao (2012) Uncertainty propagation d: Sample variance curve fitting. <https://vimeo.com/40379524>.

- Straume M, Johnson ML (1992) Monte Carlo Method for determining complete confidence probability distributions of estimated model parameters. Methods in Enzymology, 210, 117-129.

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- \begin{enumerate} -->
<!-- \item Create a simple linear chain model of four steps and three species. Choose nonlinear reversible rate laws for the reactions, assign suitable values to the parameters, and run a simulation to obtain time-course data for the three species. Add noise to the simulated data and treat this data as your `experimental data'. Fit the experimental data to the model and see how well your parameter estimates agree with the original model. Try different fitting methods such as the Simplex and Levenberg-Marquardt methods to investigate how well each one performs. -->

<!-- \item Implement a Monte-Carlo method to obtain estimates for the parameter confidence limits. -->

<!-- \item Investigate how the degree of noise in your experimental data affects the fitted parameter values. -->

<!-- \item Investigate how omitting one or more of the time-series data affects the fitting process. For example, omit data for the first and last species in the pathway. Recompute the parameter confidence limits, what do you observe? Use a Monte Carlo simulation to compute scatter plots for the different parameters. -->
<!-- \end{enumerate} -->

## Appendix

```python
# Go to https://github.com/hsauro/PathwayModelingBook

# Change to directory Chapter10, download the file: testForNormality.py
```

```python
# Go to https://github.com/hsauro/PathwayModelingBook

# Change to directory Chapter10, download the file: crossValidation.py
```

```python
# Go to https://github.com/hsauro/PathwayModelingBook

# Change to directory Chapter10, download the file: simpleTwoStepPathway.py
```

```python
# Go to https://github.com/hsauro/PathwayModelingBook

# Change to directory Chapter10, download the file: fiveSpeciesModel.py
```

```python
# This code requires two inputs files ground_truth.txt and experimental_data.txt

# These can be generated using the file:
# compleModel_experimental_data_generator.py (see GitHub site)

# Go to https://github.com/hsauro/PathwayModelingBook

# Change to directory Chapter10, download the file: complexModel.py
```

---

## Index terms recorded in this chapter

- bootstrap
- confidence intervals
- covariance matrix
- goodness of fit
- Hessian
- lmfit
- Monte Carlo simulations
- overfitting
- percentile values
- quality of fit
- residuals
- standard deviation
- synthetic data set

---

← [[09_fitting_models|Fitting Models]] · [[index|Wiki index]] · [[11_bayesian_inference|Introduction to Bayesian Inference]] →
