# Statistics Reminder

*Source: `appendixG.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Statistics Reminder <a id="app-statistics"></a>

## Mean

The **mean** is the sum of values divided by the number of values:

\[ \bar{x} = \frac{1}{N} \sum_{i=1}^N x_i \]

The mean  is not necessarily the middle value but depends on the skewness of the values. The central value is called the **median**.

## Deviation

A measure of deviation of a variable $y$ from its mean is called the **standard deviation**, denoted by $\sigma$. A related measure, $\sigma^2$, is called the **variance**. Consider the mean of a set of numbers, $x_i$, denoted by $\bar{x}$. We can compute the deviation of each $x_i$ from the mean by:

$$ d_i = x_i - \bar{x} $$

If we take the square of the deviations and compute the average deviation we obtain the variance:

\[\sigma^2 = \frac{1}{N} \sum (x_i - \bar{x})^2 \]

Given a sample from a population, the best estimate for the population variance must be correct if we attempt to compute the population variance from the sample:

$$ \sigma^2 = \frac{1}{N-1} \sum (x_i - \bar{x})^2 $$

## Standard Error

If we were to sample a population multiple times, we could calculate a mean for each sample. The standard deviation for the set of means is called the standard error. The value of the standard error can be calculated using a remarkably simple formula:

\[ SE_{\bar{x}} = \frac{\sigma}{\sqrt{N}} \]

Strictly speaking, $\sigma$ should be the standard deviation of the population but often this is not available and instead, the sample standard deviation is used. The standard error is also a convenient measure of how precise our measurements are, that is how close a set of measurements are to each other.

## Covariance <a id="sec-covariance"></a>

If the variability of one variable, $x$, is influenced by another, $y$, then this dependence is measured using the covariance, $Cov(x, y)$. The covariance between two variables is defined by:

\[ Cov(x, y) = \frac{1}{N} \sum \left[ (x_i - \bar{x}) (y_i - \bar{y}) \right] \]

A positive covariance means that two variables as positively correlated. A covariance of zero means that two variables are statistically independent.

## Normal Distribution

The normal or Gaussian distribution is a continuous probability distribution that describes the probability of obtaining a given value, $x$, when the distribution has mean $\mu$, and standard deviation, $\sigma$. The probability in a normal distribution is described by the area under the curve such that the total area equals one. The mean corresponds to the peak of the curve (since it is symmetric) and the standard deviation to the width. If a random variable is known to be normally distributed, then the Gaussian curve tells us that there is a 68.3% chance that the value will lie within one standard deviation from the mean (Figure [Figure: Normal Distribution:](#fig-normaldistrib)).

The equation that defines the Gaussian distribution is given by:

\[ f(x) = \frac{1}{\sigma \sqrt{2 \pi}} e^{\displaystyle -\frac{(x - \mu)^2}{2 \sigma^2}} \]

<!-- \pgfmathdeclarefunction{gauss}{3}{% -->
<!-- \pgfmathparse{1/(#3*sqrt(2*pi))*exp(-((#1-#2)^2)/(2*#3^2))}% -->
<!-- } -->

**Figure** <a id="fig-normaldistrib"></a> `fig:NormalDistrib`

*Caption:* Normal Distribution: The 68.3% and 95.4% intervals represent one and two standard deviations away from the mean, $\bar{x}$. 

```latex
\begin{figure}
\centering
\begin{tikzpicture}
\begin{axis}[
  no markers,
  domain=0:6,
  samples=100,
  ymin=0,
  axis lines*=left,
  xlabel=$x$,
  every axis y label/.style={at=(current axis.above origin),anchor=south},
  every axis x label/.style={at=(current axis.right of origin),anchor=west},
  height=5cm,
  width=12cm,
  xtick=\empty,
  ytick=\empty,
  enlargelimits=false,
  clip=false,
  axis on top,
  grid = major,
  hide y axis
  ]

 \addplot [very thick,cyan!50!black] {gauss(x, 3, 1)};

\pgfmathsetmacro\valueA{gauss(1,3,1)}
\pgfmathsetmacro\valueB{gauss(2,3,1)}
\draw [gray] (axis cs:1,0) -- (axis cs:1,\valueA)
    (axis cs:5,0) -- (axis cs:5,\valueA);
\draw [gray] (axis cs:2,0) -- (axis cs:2,\valueB)
    (axis cs:4,0) -- (axis cs:4,\valueB);
\draw [yshift=1.4cm, latex-latex](axis cs:2, 0) -- node [fill=white] {$68.3\%$} (axis cs:4, 0);
\draw [yshift=0.3cm, latex-latex](axis cs:1, 0) -- node [fill=white] {$95.4\%$} (axis cs:5, 0);

\node[below] at (axis cs:1, 0)  {$\bar{x} - 2\sigma$};
\node[below] at (axis cs:2, 0)  {$\bar{x} - \sigma$};
\node[below] at (axis cs:3, 0)  {$\bar{x}$};
\end{axis}
\end{tikzpicture}
\caption{Normal Distribution: The 68.3\% and 95.4\% intervals represent one and two standard deviations away from the mean, $\bar{x}$. }
\label{fig:NormalDistrib}
\end{figure}
```

## *z*-Scores or Standard Scores <a id="sec-zscore"></a>

Any normal distribution can be standardized so that it has a mean of zero and a standard deviation of one, often denoted $N(0,1)$. For example consider a random variable, $X$, with a value 5, that was drawn from a normal distribution with mean ($\bar{x}$) equal to 10, and standard deviation equal to 2 ($\sigma$), denoted $N(10, 2)$. We can shift the mean to zero by subtracting 10 and normalize the standard deviation by dividing by 2. The value just computed is called the z-score or standard score.

$$ z = \frac{X - \bar{x}}{\sigma} = \frac{5 - 10}{2} = -2.5 $$

The z-score tells use that the variate $X$ is located 2.5 standard deviations to the *left* of the mean. We can therefore describe the z-score as a measure of the divergence of a random variable, $X$, from the mean, expressed in terms of the number of standard deviations.

## Null Hypothesis

The null hypothesis refers to the statement that is to be tested. In the literature the null hypothesis is often referred to by the symbol $H_o$. The null hypothesis is assumed to be the true hypothesis and statistical tests will often attempt to determine the probability that the null hypothesis is unlikely. If determined so, then the alternative hypothesis, $H_1$ is accepted instead.

## $\chi^2$ Distribution

The chi-square distribution describes the distribution of variances drawn independently from a population of normally distributed variates. To be more precise, suppose there is a population that has a normally distributed random variable, $X$. The mean of this distribution will be $\mu$ and the variance:

$$ \sigma^2 = \frac{1}{N} \sum_{i=1}^N (X_i - \mu)^2 $$

where $N$ is the size of the population. Let us take a series of independent samples from the population and in each case form the squared standardized score:

$$ z^2 = \frac{(X_i - \mu)^2}{\sigma^2} $$

We will call square of the score the standardized $\chi^2_(1)$, that is:

$$ \chi^2_(1) = z^2 $$

Values for $\chi^2_(1)$ are positive due to the squaring. Since 68% of variances from a normal population will lie between standardized scores of -1 and 1, the bulk of sampled $\chi^2_(1)$ values will also be between 0 and 1 (note the squaring eliminates the negative sign). The distribution of $\chi^2_(1)$ is thus skewed. The distribution of $\chi^2_(1)$ follows the $\chi^2$ distribution with one degree of freedom.

Let's now consider the distribution of a sum of two independently sampled $\chi^2_(1)$:

$$ \chi^2_(2) = \frac{(X_1 - \mu)^2}{\sigma^2} + \frac{(X_2 - \mu)^2}{\sigma^2} = z^2_1 + z^2_2 $$

$\chi^2_(2)$ also follows a chi-square distribution but this time with two degrees of freedom. Because we are summing two standardized variances, the distribution is less skewed. We can continue this process and define $\chi^2$ for any number of degrees of freedom. The function that relates the probability density to each value of $\chi^2$ is given by:

$$ f_{\chi^2}(x) = c e^{-x/2} x^{\nu/2 - 1} $$

where $\nu$ is the degrees of freedom, and $c$ is a constant given by the following expression:

$$ c = \frac{1}{2^{\nu/2} \Gamma (\nu/2)} $$

where $\Gamma(n)$ is the Gamma function:

$$ \Gamma (n) = (n - 1)!$$

Of particular importance is that the mean of the chi-square distribution is $\nu$ and the variance $2 \nu$.

$$
\begin{align*}
E (\chi^2_{\nu}) &= \nu \\[3pt]
%
\text{Var} (\chi^2_{\nu}) &= 2 \nu
\end{align*}
$$

In other words the $\chi^2$ distribution is fully described by specifying the degrees of freedom.

## F-test <a id="sec-ftest"></a>

If two random variables, $X$ and $Y$, have $\chi^2$ distributions with $\nu_1$ and $\nu_2$ degrees of freedom, respectively, then the ratio:

$$ F = \frac{X/\nu_1}{Y/\nu_2} $$

will be distributed according to the $F$ distribution. The $F$ distribution forms the basis of the $F$-test, which allows variances to be compared to determine whether they are significantly different or not. For example, fitting two different models will generate two different $\chi^2$ values. We can propose the null hypotheses, $H_o$, that both $\chi^2$ are identical.

The test involves computing the $F$ ratio and looking up the value in an $F$-table. If the value falls below the 0.05 critical value, then we accept the null hypothesis. Any differences we see in the two $\chi^2$ values could easily have come about by chance alone. If, however, the $F$ value lies above the 0.05 critical value, we would propose that the observed difference in the $\chi^2$ could not have come about by chance alone and likely represents a real difference.

## Confidence Intervals

Oftentimes we would like to know the likelihood that a given variable will fall within a specified range. That is, we would like some measure of confidence in an estimated value. If someone quoted the statistic that a variable, $x$, has a 95% confidence interval of $x \pm \Delta x$, that would mean that if we repeatedly measured this variable, 95% of the time the measured value would lie between $x + \Delta x$ and $x - \Delta x$. If the distribution of $x$ is normal, then the 95% interval is at $1.96 \sigma$. For example, if we know that a variable has a mean value of 2.5 and a standard deviation of 0.6, then the 95% confidence interval is given by:

$$ \bar{x} \pm 1.96 \sigma = 2.5 \pm 1.96 \times 0.6 = 2.5 \pm 0.3 $$

Therefore, if we were to take one more measurement, we could state that the value of the measurement will lie between 2.2 and 2.8, 95% of the time. We can also say that 1 in 20 (5%) of the time, the variable will lie outside this range by chance.

Alternatively, we could obtain an entire sample of measurements and compute the mean of the sample. With a new sample, what can we say about the likely value for the mean of that sample? Given the original standard deviation, the mean of a new sample will have a confidence limit of:

$$ \bar{x}_{95%} \pm 1.96 SE_{\bar{x}} $$

where $SE_{\bar{x}}$ is the standard error. That is, the mean of the new sample will have a mean $\pm$ the standard error. For example, imagine that the mean for a sample of nine data points is 4.0 with a standard deviation of 2.0. Given this information, the standard error can be computed to be: SE$_{\bar{x}} = \sigma/\sqrt{n} = 2/3 = 0.66667$. Therefore the 95% confidence internal on the mean is:

$$ \bar{x}_{95%} \pm 1.96 \times 0.66667 = 4.0 \pm 1.31 $$

That is, if we draw a new sample, 95% of the time the mean will lie within the above range.

## Bootstrapping

Assume we wish to estimate the 95% confidence interval for the mean of a population. The problem is we don't have the population, only a sample from the population. We can use bootstrapping to get an estimate for the confidence interval, or more precisely we can use bootstrapping to generate a distribution that resembles the population from which we can estimate a confidence interval. **Bootstrapping** is the act of generating a distribution by sampling. For illustration assume that our sample from the population is:

$$ 4, 5 ,7, 3, 7, 1 $$

We will now resample with replacement from the original sample. Replacement means not removing the sampled value from the sample set, so it is possible to sample the same value again. An example of a bootstrap sample is:

$$ 7, 3, 1, 4, 1, 7$$

The new sample should have the same number of elements as the original sample. Let's say we create 200 samples in this way. For each sample we compute the mean so we have 200 means. This is our bootstrap sample of means.

At this point we can compute some interesting statistics from our 200 means. For example, what is the 95% confidence interval for the mean of the original population? If we assume our sample of means has the same statistical structure as the population, we can use the 200 means to compute the 95% confidence interval. To do this we must first rank the means in ascending order and then use the 97.5% and 2.5% percentiles as the interval, the middle 95% of all bootstrap sample means.

Listing `python:app.bootstrap` shows Python code to bootstrap a sample of 30 values drawn from a normal distribution.

```python
import numpy as np
import random, pylab

sampleSize = 30
s = np.random.normal(0.2, 1, sampleSize)

p = []; n = 10000
means = np.zeros (shape=n)
for k in range (n):
    l = np.zeros(shape=sampleSize)
    for i in range (sampleSize):
        r = random.randint (0, sampleSize-1)
        l[i] = s[r]
    p.append (l)
    means[k] = np.mean (l)
pylab.hist (means, 50)
```

## Maximum Likelihood

To introduce maximum likelihood, consider the problem of estimating the probability, $p$, of getting a heads when flipping a coin. Let's say we flip a coin ten times and obtain the following result: `HTHHTTHHHH` where `H` represents heads and `T` tails. The probability of obtaining this sequence is related to $p$, the probability of flipping a heads, which we can state as:

$$ P(\tt HTHHTTHHHH|p) $$

This reads: $P$ is the probability of seeing the sequence `HTHHTTHHHH` given $p$, the probability of flipping a heads. The probability, $P$, can be computed using the AND rule since we assume independent coin flips, meaning what is the probability of obtaining a `H` and a `T` and a `H`, etc.? Given that the probability of throwing tails is $(1-p$), we obtain:

$$
\begin{align*}
 \text{P}(\text{\tt HTHHTTHHHH}|p) &= p (1 - p) p p (1-p)(1-p) p p p p \\
 &= p^7 (1 - p)^3
\end{align*}
$$

Recall the expression $P(\tt HTHHTTHHHH|p)$ reads: what is the probability of seeing this particular sequence of heads and tails given $p$? However in the original question, we wanted to know what $p$ was, *given* a sequence of coin throws. We should therefore ask what is the *likelihood* of a particular value of $p$ given the collected data. We should look at the equation as a function of $p$ instead of what coin throw we see, that is:

$$ L(p|x) = L (p|\tt HTHHTTHHHH) = p^7 (1 - p)^3 $$

The expression $L(p|x)$ reads: what is the likelihood of $p$ given a set of heads and tails? If we vary $p$, we'll get different likelihoods, this is shown in Table [Table: Likelihood calculation](#tbl-likelihood).

**Table** <a id="tbl-likelihood"></a> `tbl:likelihood`

*Caption:* Likelihood calculation.

```latex
\begin{table}
\centering
\begin{tabular}{ll}\toprule
$p$ & $L(p, x) = p^7(1-p)^3$ \\\midrule
0.1 & $7.29 \times 10^{-8}$ \\
0.2 & $6.55 \times 10^{-6}  $ \\
0.3 & $7.5 \times 10^{-5} $ \\
0.4 & $0.000354 $ \\
0.5 & $0.000977 $ \\
0.6 & $ 0.00179 $ \\
0.7 & $ 0.00222 $ \\
0.8 & $ 0.00168 $ \\
0.9 & $ 0.000478$ \\
1.0 & 0 \\ \bottomrule
\end{tabular}
\caption{Likelihood calculation.}
\label{tbl:likelihood}
\end{table}
```

**Figure**

*Caption:* Maximum Likelihood plot, see Table [Table: Likelihood calculation](#tbl-likelihood).

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}[scale=1]
\begin{axis}[
ylabel={$L(p|x)$},
xlabel={$p$},
xmin=0, xmax=1,
ymin=0, ymax=0.0025,
width=8cm, height=6cm]
\addplot[color=blue,line width=1.5pt] expression[domain=0:1,samples=100]{\x^7*(1-\x)^3};
\end{axis}
\end{tikzpicture}
\caption{Maximum Likelihood plot, see Table~\ref{tbl:likelihood}.}
\end{figure}
```

We see from Table ([Table: Likelihood calculation](#tbl-likelihood)) that the likelihood reaches a maximum at around 0.7. We therefore conclude that given the data `HTHHTTHHHH`, the most likely value for $p$ is 0.7.

It becomes more interesting if we generalize the previous analysis by assuming we make $n$ flips of the coin, and we obtain $x$ heads and therefore $n-x$ tails. In this case the likelihood is:

$$ L(p|x) = p^x (1 - p)^{n-x} $$

To maximize the likelihood, let us first take the log to make it easier to differentiate:

$$ \ln (L(p)) = x \ln p + (n - x) \ln (1 - p) $$

Differentiating the log expression yields:

$$ \frac{d\ln L(p)}{dp} = \frac{x}{p} - \frac{n - x}{1 - p} $$

The maximum is when the derivative is zero. Setting this to zero, and solving for $p$ gives the final result:

$$ p = \frac{x}{n} $$

\stateHighlight{
This tells us that the most likely value for $p$ is simply equal to the fraction of heads we see in the sequence.
}

This example only considers a sequence of coins with a specific number of heads and tails. If we wanted to consider all possible combinations we need to form the product taking into account every variant in number of heads and tails:

$$ L(p|x) = p^{x_1} (1- p)^{1-x_1} p^{x_2} (1- p)^{1-x_2} p^{x_3} (1- p)^{1-x_3} \hdots = \prod_{i=1}^n p^{x_i} (1-p)^{1-x_i} $$

For a continuous probability density function such as a normal distribution, $f(x|\mu,\theta)$, the argument is similar but much less intuitively clear and requires some advanced mathematics to justify:

$$ L(p|x) = \prod_{i=1}^n f(x_i | p) $$

### Maximum Likelihood and Least Squares <a id="mle-ls"></a>

Assume $X$ is a continuous random variable whose probability density function is given by $f(x)$ and depends on a parameter, $p$. If we carry out an experiment $n$ times, we will obtain a sample of $n$ numbers:

$$ x_1, x_2, ..., x_n $$

Assuming that the $n$ random variables are independent, the probability the $n$ data points will arise is given by the product of the individual probabilities:

$$ f (x_1, ..., x_n|p) = f(x_1) f(x_2) ... f(x_n) $$

Or in terms of likelihood:

$$ L(p|x_1,...,x_n) = f (x_1, ..., x_n|p) = \prod^{n}_{i=1} f(x_i|p) $$

We now maximize the likelihood by differentiating with respect to $p$, set the derivative to zero, and solve for $p$:

$$ \frac{\partial L}{\partial p} = 0 $$

We can use this generalization to show that the sum of squares yields the maximum likelihood for the unknown parameters in the model. Assume that the experimental data is normally distributed with standard deviation, $\sigma_i$. Let there be $n$ data points, $(x_i, y_i)$. The probability of making the observed measurement, $y_i$, given that $y(x_i)$ is the model estimate, is given by the normal distribution:

$$ P_i = \frac{1}{\sigma_i \sqrt{2 \pi}} \exp\left(\left[ -\frac{1}{2} \frac{y_i - y(x_i)}{\sigma_i}\right]^2 \right) $$

The likelihood function is given by the product: $\prod P_i$, so that:

$$ L(p) = \prod_{i=1}^n \left( \frac{1}{\sigma_i \sqrt{2 \pi}}\right) \exp\left( -\frac{1}{2} \sum_{i=1}^n \left[ \frac{y_i - y(x_i)}{\sigma_i}\right]^2 \right) $$

We now seek the maximum value for $L(p)$. We note that the first term is a constant while the exponential term is maximized when the sum in the exponential is minimized. The term in the exponential we wish to minimize is:

$$ \sum_{i=1}^n \left[ \frac{y_i - y(x_i)}{\sigma_i}\right]^2 $$

which is of course the $\chi^2$ sums of squares. Therefore, the maximum likelihood is equivalent to minimizing the sum of squares. Equation [[09_fitting_models|Optimizing Parameter Values]] is therefore justified on more formal grounds.

<!-- Table generated by Excel2LaTeX from sheet 'Sheet3' -->

**Table** <a id="tab-addlabel1"></a> `tab:addlabel1`

*Caption:* Standard Normal Probabilities, Negative:\\[4pt] { Example: The area swept out from $-\infty$ to -1 standard deviations in a standard normal curve ($\mu = 0; \sigma = 1$) is 0.159 units. The area swept out to -0.55 is 0.291 units. Note that the area swept out from $-\infty$ to 0 is 0.5 units, representing half the area of the normal curve. Data from <http://www.stat.tamu.edu/stat30x/zttables.php> \\[4pt]}


```latex
\begin{table}[htbp]
  \centering
  \caption{Standard Normal Probabilities, Negative:\\[4pt] {\small Example: The area swept out from $-\infty$ to -1 standard deviations in a standard normal curve ($\mu = 0; \sigma = 1$) is 0.159 units. The area swept out to -0.55 is 0.291 units. Note that the area swept out from $-\infty$ to 0 is 0.5 units, representing half the area of the normal curve. Data from~\url{http://www.stat.tamu.edu/stat30x/zttables.php} \\[4pt]}
}
      {\scriptsize
    \begin{tabular}{rrrrrrrrrrr}
    \toprule
    \textbf{z} & \textbf{0} & \textbf{0.01} & \textbf{0.02} & \textbf{0.03} & \textbf{0.04} & \textbf{0.05} & \textbf{0.06} & \textbf{0.07} & \textbf{0.08} & \textbf{0.09} \\
    \midrule
    \textbf{-3.8} & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 \\
    \textbf{-3.7} & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 \\
    \textbf{-3.6} & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 \\
    \textbf{-3.5} & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 \\
    \textbf{-3.4} & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 \\
    \textbf{-3.3} & 0.001 & 0.001 & 0.001 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 & 0.000 \\
    \textbf{-3.2} & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 \\
    \textbf{-3.1} & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 \\
    \textbf{-3} & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 & 0.001 \\
    \textbf{-2.9} & 0.002 & 0.002 & 0.002 & 0.002 & 0.002 & 0.002 & 0.002 & 0.002 & 0.001 & 0.001 \\
    \textbf{-2.8} & 0.003 & 0.003 & 0.002 & 0.002 & 0.002 & 0.002 & 0.002 & 0.002 & 0.002 & 0.002 \\
    \textbf{-2.7} & 0.004 & 0.003 & 0.003 & 0.003 & 0.003 & 0.003 & 0.003 & 0.003 & 0.003 & 0.003 \\
    \textbf{-2.6} & 0.005 & 0.005 & 0.004 & 0.004 & 0.004 & 0.004 & 0.004 & 0.004 & 0.004 & 0.004 \\
    \textbf{-2.5} & 0.006 & 0.006 & 0.006 & 0.006 & 0.006 & 0.005 & 0.005 & 0.005 & 0.005 & 0.005 \\
    \textbf{-2.4} & 0.008 & 0.008 & 0.008 & 0.008 & 0.007 & 0.007 & 0.007 & 0.007 & 0.007 & 0.006 \\
    \textbf{-2.3} & 0.011 & 0.010 & 0.010 & 0.010 & 0.010 & 0.009 & 0.009 & 0.009 & 0.009 & 0.008 \\
    \textbf{-2.2} & 0.014 & 0.014 & 0.013 & 0.013 & 0.013 & 0.012 & 0.012 & 0.012 & 0.011 & 0.011 \\
    \textbf{-2.1} & 0.018 & 0.017 & 0.017 & 0.017 & 0.016 & 0.016 & 0.015 & 0.015 & 0.015 & 0.014 \\
    \textbf{-2} & 0.023 & 0.022 & 0.022 & 0.021 & 0.021 & 0.020 & 0.020 & 0.019 & 0.019 & 0.018 \\
    \textbf{-1.9} & 0.029 & 0.028 & 0.027 & 0.027 & 0.026 & 0.026 & 0.025 & 0.024 & 0.024 & 0.023 \\
    \textbf{-1.8} & 0.036 & 0.035 & 0.034 & 0.034 & 0.033 & 0.032 & 0.031 & 0.031 & 0.030 & 0.029 \\
    \textbf{-1.7} & 0.045 & 0.044 & 0.043 & 0.042 & 0.041 & 0.040 & 0.039 & 0.038 & 0.038 & 0.037 \\
    \textbf{-1.6} & 0.055 & 0.054 & 0.053 & 0.052 & 0.051 & 0.050 & 0.049 & 0.048 & 0.047 & 0.046 \\
    \textbf{-1.5} & 0.067 & 0.066 & 0.064 & 0.063 & 0.062 & 0.061 & 0.059 & 0.058 & 0.057 & 0.056 \\
    \textbf{-1.4} & 0.081 & 0.079 & 0.078 & 0.076 & 0.075 & 0.074 & 0.072 & 0.071 & 0.069 & 0.068 \\
    \textbf{-1.3} & 0.097 & 0.095 & 0.093 & 0.092 & 0.090 & 0.089 & 0.087 & 0.085 & 0.084 & 0.082 \\
    \textbf{-1.2} & 0.115 & 0.113 & 0.111 & 0.109 & 0.108 & 0.106 & 0.104 & 0.102 & 0.100 & 0.099 \\
    \textbf{-1.1} & 0.136 & 0.134 & 0.131 & 0.129 & 0.127 & 0.125 & 0.123 & 0.121 & 0.119 & 0.117 \\
    \textbf{-1} & 0.159 & 0.156 & 0.154 & 0.152 & 0.149 & 0.147 & 0.145 & 0.142 & 0.140 & 0.138 \\
    \textbf{-0.9} & 0.184 & 0.181 & 0.179 & 0.176 & 0.174 & 0.171 & 0.169 & 0.166 & 0.164 & 0.161 \\
    \textbf{-0.8} & 0.212 & 0.209 & 0.206 & 0.203 & 0.201 & 0.198 & 0.195 & 0.192 & 0.189 & 0.187 \\
    \textbf{-0.7} & 0.242 & 0.239 & 0.236 & 0.233 & 0.230 & 0.227 & 0.224 & 0.221 & 0.218 & 0.215 \\
    \textbf{-0.6} & 0.274 & 0.271 & 0.268 & 0.264 & 0.261 & 0.258 & 0.255 & 0.251 & 0.248 & 0.245 \\
    \textbf{-0.5} & 0.309 & 0.305 & 0.302 & 0.298 & 0.295 & 0.291 & 0.288 & 0.284 & 0.281 & 0.278 \\
    \textbf{-0.4} & 0.345 & 0.341 & 0.337 & 0.334 & 0.330 & 0.326 & 0.323 & 0.319 & 0.316 & 0.312 \\
    \textbf{-0.3} & 0.382 & 0.378 & 0.375 & 0.371 & 0.367 & 0.363 & 0.359 & 0.356 & 0.352 & 0.348 \\
    \textbf{-0.2} & 0.421 & 0.417 & 0.413 & 0.409 & 0.405 & 0.401 & 0.397 & 0.394 & 0.390 & 0.386 \\
    \textbf{-0.1} & 0.460 & 0.456 & 0.452 & 0.448 & 0.444 & 0.440 & 0.436 & 0.433 & 0.429 & 0.425 \\
    \textbf{0} & 0.500 & 0.496 & 0.492 & 0.488 & 0.484 & 0.480 & 0.476 & 0.472 & 0.468 & 0.464 \\
    \bottomrule
    \end{tabular}}%
  \label{tab:addlabel1}%
\end{table}%
```

<!-- Table generated by Excel2LaTeX from sheet 'Sheet4' -->

**Table** <a id="tbl-zscores"></a> `tbl:zscores`

*Caption:* Standard Normal Probabilities, Positive: \\[0pt] {\phantom{Lorem ipsum dolor sit amet, consectetur adipiscing elit. Benunal, ceh viroem dacequoemol tetelaci sa}\\[-3pt]}

```latex
\begin{table}[htbp]
  \centering
  \caption{Standard Normal Probabilities, Positive: \\[0pt] {\small\phantom{Lorem ipsum dolor sit amet, consectetur adipiscing elit. Benunal, ceh viroem dacequoemol tetelaci sa}\\[-3pt]}}
  \label{tbl:zscores}
    {\scriptsize
    \begin{tabular}{rrrrrrrrrrr}
    \toprule
    \textbf{z}     & \textbf{0}     & \textbf{0.01}  & \textbf{0.02}  & \textbf{0.03}  & \textbf{0.04}  & \textbf{0.05}  & \textbf{0.06}  & \textbf{0.07}  & \textbf{0.08}  & \textbf{0.09} \\
    \midrule
    \textbf{0}     & 0.5   & 0.504 & 0.508 & 0.512 & 0.516 & 0.520 & 0.524 & 0.528 & 0.532 & 0.536 \\
    \textbf{0.1}   & 0.540 & 0.544 & 0.548 & 0.552 & 0.556 & 0.560 & 0.564 & 0.568 & 0.571 & 0.575 \\
    \textbf{0.2}   & 0.579 & 0.583 & 0.587 & 0.591 & 0.595 & 0.599 & 0.603 & 0.606 & 0.610 & 0.614 \\
    \textbf{0.3}   & 0.618 & 0.622 & 0.626 & 0.629 & 0.633 & 0.637 & 0.641 & 0.644 & 0.648 & 0.652 \\
    \textbf{0.4}   & 0.655 & 0.659 & 0.663 & 0.666 & 0.670 & 0.674 & 0.677 & 0.681 & 0.684 & 0.688 \\
    \textbf{0.5}   & 0.692 & 0.695 & 0.699 & 0.702 & 0.705 & 0.709 & 0.712 & 0.716 & 0.719 & 0.722 \\
    \textbf{0.6}   & 0.726 & 0.729 & 0.732 & 0.736 & 0.739 & 0.742 & 0.745 & 0.749 & 0.752 & 0.755 \\
    \textbf{0.7}   & 0.758 & 0.761 & 0.764 & 0.767 & 0.770 & 0.773 & 0.776 & 0.779 & 0.782 & 0.785 \\
    \textbf{0.8}   & 0.788 & 0.791 & 0.794 & 0.797 & 0.800 & 0.802 & 0.805 & 0.808 & 0.811 & 0.813 \\
    \textbf{0.9}   & 0.816 & 0.819 & 0.821 & 0.824 & 0.826 & 0.829 & 0.832 & 0.834 & 0.837 & 0.839 \\
    \textbf{1}     & 0.841 & 0.844 & 0.846 & 0.849 & 0.851 & 0.853 & 0.855 & 0.858 & 0.860 & 0.862 \\
    \textbf{1.1}   & 0.864 & 0.867 & 0.869 & 0.871 & 0.873 & 0.875 & 0.877 & 0.879 & 0.881 & 0.883 \\
    \textbf{1.2}   & 0.885 & 0.887 & 0.889 & 0.891 & 0.893 & 0.894 & 0.896 & 0.898 & 0.900 & 0.902 \\
    \textbf{1.3}   & 0.903 & 0.905 & 0.907 & 0.908 & 0.910 & 0.912 & 0.913 & 0.915 & 0.916 & 0.918 \\
    \textbf{1.4}   & 0.919 & 0.921 & 0.922 & 0.924 & 0.925 & 0.927 & 0.928 & 0.929 & 0.931 & 0.932 \\
    \textbf{1.5}   & 0.933 & 0.935 & 0.936 & 0.937 & 0.938 & 0.939 & 0.941 & 0.942 & 0.943 & 0.944 \\
    \textbf{1.6}   & 0.945 & 0.946 & 0.947 & 0.948 & 0.950 & 0.951 & 0.952 & 0.953 & 0.954 & 0.955 \\
    \textbf{1.7}   & 0.955 & 0.956 & 0.957 & 0.958 & 0.959 & 0.960 & 0.961 & 0.962 & 0.963 & 0.963 \\
    \textbf{1.8}   & 0.964 & 0.965 & 0.966 & 0.966 & 0.967 & 0.968 & 0.969 & 0.969 & 0.970 & 0.971 \\
    \textbf{1.9}   & 0.971 & 0.972 & 0.973 & 0.973 & 0.974 & 0.974 & 0.975 & 0.976 & 0.976 & 0.977 \\
    \textbf{2}     & 0.977 & 0.978 & 0.978 & 0.979 & 0.979 & 0.980 & 0.980 & 0.981 & 0.981 & 0.982 \\
    \textbf{2.1}   & 0.982 & 0.983 & 0.983 & 0.983 & 0.984 & 0.984 & 0.985 & 0.985 & 0.985 & 0.986 \\
    \textbf{2.2}   & 0.986 & 0.986 & 0.987 & 0.987 & 0.988 & 0.988 & 0.988 & 0.988 & 0.989 & 0.989 \\
    \textbf{2.3}   & 0.989 & 0.990 & 0.990 & 0.990 & 0.990 & 0.991 & 0.991 & 0.991 & 0.991 & 0.992 \\
    \textbf{2.4}   & 0.992 & 0.992 & 0.992 & 0.993 & 0.993 & 0.993 & 0.993 & 0.993 & 0.993 & 0.994 \\
    \textbf{2.5}   & 0.994 & 0.994 & 0.994 & 0.994 & 0.995 & 0.995 & 0.995 & 0.995 & 0.995 & 0.995 \\
    \textbf{2.6}   & 0.995 & 0.996 & 0.996 & 0.996 & 0.996 & 0.996 & 0.996 & 0.996 & 0.996 & 0.996 \\
    \textbf{2.7}   & 0.997 & 0.997 & 0.997 & 0.997 & 0.997 & 0.997 & 0.997 & 0.997 & 0.997 & 0.997 \\
    \textbf{2.8}   & 0.997 & 0.998 & 0.998 & 0.998 & 0.998 & 0.998 & 0.998 & 0.998 & 0.998 & 0.998 \\
    \textbf{2.9}   & 0.998 & 0.998 & 0.998 & 0.998 & 0.998 & 0.998 & 0.999 & 0.999 & 0.999 & 0.999 \\
    \textbf{3}     & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 \\
    \textbf{3.1}   & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 \\
    \textbf{3.2}   & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 & 0.999 & 1.000 & 1.000 & 1.000 \\
    \textbf{3.3}   & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 \\
    \textbf{3.4}   & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 \\
    \textbf{3.5}   & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 \\
    \textbf{3.6}   & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 \\
    \textbf{3.7}   & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 \\
    \textbf{3.8}   & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 & 1.000 \\
    \bottomrule
    \end{tabular}}%
  \label{tab:addlabel2}%
\end{table}%
```

## Further Reading

- Bevington, PR (1969), Data reduction and error analysis for the physical sciences. McGraw-Hill.

- Berendsen, HJC. (2011) A student's guide to data and error analysis. Cambridge: Cambridge University Press.

- For something different: Freedman D, Pisani R,  Purves R. Statistics (1998) Norton & Company; 3rd edition.

- Mandel J. (1984) The statistical analysis of experimental data. Dover Publications.

- Manly, BFJ. (1997) Randomization, Bootstrap and Monte Carlo Methods in Biology. Chapman & Hall.

---

## Index terms recorded in this chapter

- $\bar{x}$
- $\chi^2$
- $\sigma$
- bell curve
- Bevington
- bootstrapping
- chi-square
- confidence interval
- covariance
- F-test
- Gaussian distribution
- mean
- median
- normal distribution
- replacement
- standard deviation
- standard error
- standard scores
- variance
- z-score

---

← [[appendix_f_math_fundamentals|Math Fundamentals]] · [[index|Wiki index]] · [[appendix_h_modeling_standards_and_databases|Modeling Standards and Databases]] →
