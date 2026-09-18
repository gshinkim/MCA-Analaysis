# Introduction to Bayesian Inference

*Source: `chapter11.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Introduction to Bayesian Inference <a id="chap-bayesian"></a>

## Bayesian Inference

<!-- Up to now we've focused on using Monte Carlo bootstrapping as a way to estimate confidence in our parameter estimates. There are other ways that one can assess the reliability of parameter estimates when using {\tt lmfit}. Of particular interest are {\tt lmfit.conf_interval} and invoking a Markov Chain sampler. Here we will focus on the Markov chain sampler algorithm but both {\tt lmfit.conf_interval} and the Monte chain sampler give roughly similar results to the bootstrapping method. -->

The use of Bayesian inference has grown considerably in the last 15 years as an alternative to classical parameter estimation, which was discussed in the previous chapters. With respect to terminology, the classical fitting approach is referred to as the frequentist approach in contrast to the Bayesian approach. Intellectually, Bayesian inference is a more challenging topic to grasp, and the literature tends to be difficult to read unless one has a fairly sophisticated background in probability and statistics. Unfortunately, most of the books that describe Bayesian inference are highly theoretical and offer little intuitive insight into the approach and often leave out key points. The closest I've found to a book that gives a more readable account of Bayesian inference is `A Student's Guide to Bayesian Statistics' by Ben Lambert, Sage, 2018.

<!-- `Bayesian Logical Data Analysis for the Physical Science' by Gregory~\cite{gregory2005bayesian}. -->

My objective here is to only give a brief introduction to the topic so that the reader has a general idea of what Bayesian inference is.

In the last chapter we briefly mentioned the idea of a likelihood (covered in more detail in Appendix [[appendix_g_statistics_reminder|Statistics Reminder]]), and often denoted:

$$ L (x | \theta, M) $$

This reads: what is the likelihood of the data, $x$, given the parameters, $\theta$, and model $M$? On the face of it, a rather odd statement to make. What it's asking is, given a model and data, what is the likelihood that if we used the model to generate predictions, would the predictions be similar to the data? The higher the likelihood, the more likely we'll predict the data correctly. In the Appendix, the likelihood for a continuous distribution was given by:

$$
\begin{equation}
L(\theta|x) = \prod_{i=1}^n f(x_i | \theta)
\label{eqn:contLikelihood}
\end{equation}
$$

where $f(x_i|\theta)$ is the value of the probability density function (not the probability) at $x_i$ given parameters $\theta$. The product is over all the data points in our data set. If we only have a single data point and our model is a normal curve with mean and standard deviation, *the likelihood is simply the height of the normal curve at the position of the data point*, Figure [Figure: Likelihood of a single data point, $x_i$, given a gaussian model with](#fig-normallikelihood). A key idea of the likelihood is that it is a function of the parameter, $\theta$ and *not* the data. Thus we would vary $\theta$ and see the effect on the likelihood.

One could imagine changing the mean that describes the normal distribution by moving the curve left and right until the highest point of the normal curve is above the data point, this is the **maximum likelihood**. In other words, this is the normal curve that would most likely yield the data point.

**Figure** <a id="fig-normallikelihood"></a> `fig:normallikelihood`

*Caption:* Likelihood of a single data point, $x_i$, given a gaussian model with mean $\mu$ and standard deviation $\sigma$.

```latex
\begin{figure}[htpb]
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
  height=4cm,
  width=11cm,
  xtick=\empty,
  ytick=\empty,
  enlargelimits=false,
  clip=false,
  axis on top,
  grid = major,
  hide y axis
  ]

 \addplot [line width=0.5mm,red!50!black] {gauss(x, 3, 1)};

 \pgfmathsetmacro\valueA{gauss(2.5,3,1)}
 \pgfmathsetmacro\valueB{gauss(2,3,1)}
 \draw [line width=0.45mm] (axis cs:2.5,0) -- (axis cs:2.5,\valueA);
 \node[] at (axis cs: 0.65, 0.36) {Likelihood at $x$};
 \draw [line width=0.4mm,-latex]  (axis cs:1.4,\valueA) -- (axis cs:2.45,\valueA);
 \fill [red] (axis cs:2.5,\valueA) circle (3pt);

 \node[below] at (axis cs:2.5, 0)  {$x_i$};
 \node[below] at (axis cs:3, 0)  {$\mu$};
 \node at (axis cs:3.55, 0.18)  {$\sigma$};
\end{axis}
\end{tikzpicture}
\caption{Likelihood of a single data point, $x_i$, given a gaussian model with mean $\mu$ and standard deviation $\sigma$.}
\label{fig:normallikelihood}
\end{figure}
```

If we have two independent data points, the likelihood is the product of the two heights corresponding to each data point at a given $\theta$. It is quite possible for a likelihood to exceed one and therefore it shouldn't be treated as *a probability*. The difference is that the probability density function is a function of the data, $x$, whereas the likelihood is a function of parameters $\theta$. Another way to think of it is that probability is about possible results, whereas a likelihood is about a possible hypothesis.

In Bayesian Inference, the calculation of the likelihood is a key component.

The objective of Bayesian inference is to compute something called the **posterior** based on **prior** information and the **likelihood** of the data, given the model (Figure [Figure: The posterior is derived from the prior and likelihood](#fig-bayespicture)). In our case, the posterior represents the uncertainty in the estimated parameters of the model, and the prior, any information we might already have about the parameters (e.g. their lower and upper limits).  Given this, there is a subtle difference between Bayesian inference and least square fitting we saw in the last chapter, where we try to find the `best fit' and `best parameter'. In Bayesian inference, the objective is not to find the best values of the model parameters, but to determine the posterior distribution of the model parameters. The posterior distribution gives us an idea of where the parameter is *most likely located* and *how uncertain we are in knowing the parameter value*. This difference is one of the appealing features of Bayesian inference.

**Figure** <a id="fig-bayespicture"></a> `fig:BayesPicture`

*Graphic (not in the LaTeX source, referenced by name): `BayesPicture`*

*Caption:* The posterior is derived from the prior and likelihood.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.7]{BayesPicture}
 \caption{The posterior is derived from the prior and likelihood.}
\label{fig:BayesPicture}
\end{figure}
```

The Bayesian community is fond of discussing the philosophical differences between the Bayesian and the frequentist approach. In statistics classes, we are often taught the frequentist approach with a sprinkling of Bayes' theorem (which we will come to shortly). This isn't surprising since the vast majority of textbooks on statistics describe the frequentist approach. At the heart of the frequentist approach is the idea that probabilities are calculated by looking at the frequency of an event or events. With that information, a statistician can propose a null hypothesis (the claim that there is nothing odd going on), take a new measurement or sample, and see if the new measurement conforms to the expected probability of that event. If it doesn't, the null hypothesis is rejected.

In the Bayesian approach, the viability of a hypothesis is assessed by calculating the probability of the hypothesis given the observed data and any prior information. This is fundamentally different from the frequentist approach. Whereas the frequentist, will rely on long-run relative frequency data, in Bayesian analysis, a probability is computed that is regarded as a measure of the **degree of belief about a given hypothesis**.

The key to using Bayesian inference is Bayes' theorem, which is:

$$
\begin{equation}
\text{posterior} = \frac{\text{likelihood}\ \times\ \text{prior}}{\text{evidence}}
\label{eqn:BayesSimple}
\end{equation}
$$

In more formal mathematical notation, Bayes' theorem is more commonly written as:

$$
\begin{equation}
p(\theta|x) = \frac{p(x|\theta) p(\theta) }{p(x)}
\label{eqn:BayesFormal}
\end{equation}
$$

The prior distribution, $p(\theta)$,  represents the state of knowledge before seeing new data. The normalization constant in the denominator, $p(x)$, is the marginal likelihood or evidence and need not concern us too much but is related to the sum of all the likelihoods with respect to the data and model. $p(x|\theta)$ is the likelihood of the model given data, $x$.  The posterior probability distribution, $p(\theta|x)$, provides a full description of the state of knowledge about our hypothesis.

The Bayesian analog of a frequentist confidence interval is usually referred to as a credible region or also simply a (Bayesian) confidence interval. The credible region corresponds to some interval in the posterior, typically at the 68% or 95% percentile.

Except for very simple problems, there are no analytical solutions for computing the posterior [Bayesian Inference](#eqn-bayessimple). Instead, the posterior is almost always computed numerically. This is going to be the focus of the rest of this chapter.

## Computing the Posterior

We are going to be looking at computing the posterior from the point of view of systems biology mechanistic models. The field, however, is much broader and covers a huge range of other applications.

If we make the reasonable assumption that our data is normally distributed, the likelihood can be modeled using a normal curve. Recall that the equation for a normal curve is:

$$ f(x) = \frac{1}{{\sigma \sqrt {2\pi } }} e^{-\dfrac{(x - \mu)^2}{2 \sigma^2}} $$

$\mu$ and $\sigma$ are the mean and standard deviation respectively. If we had a single data point, $x$, the likelihood is equal to this expression at a given $\mu$ and $\sigma$. Notice how the exponent term looks very similar to the $\chi$-square expression, in equation [[09_fitting_models|Optimizing Parameter Values]]. In fact we can use the $\chi$-square to help use compute the likelihood. Let's consider the case where we have $n$ data points. The likelihood is given by the product, see [Bayesian Inference](#eqn-contlikelihood):

$$ L(x|\mu) = \prod_{i=1}^n \frac{1}{{\sigma \sqrt {2\pi } }} e^{-\dfrac{(x_i - \mu)^2}{2 \sigma^2}} $$

where we assume the uncertainties, $\sigma$, are equal. The equation can be rearranged to:

$$ L(x|\mu) = \left( \frac{1}{2\pi \sigma^2}\right)^{n/2} e^{-\dfrac{1}{2\sigma^2} \displaystyle \sum_{i=1}^n (x_i - \mu)^2} $$

The reader might notice that the term in the exponent looks very much like the $\chi$-square we used before:

$$
\begin{equation}
\chi^2 \equiv \sum_{i=1}^N \left(\frac{y_i - f (x_i; p_1\ldots p_m}{\sigma_i} \right)^2
\label{eqn:chiSquaredBayesian1}
\end{equation}
$$

If we remove the various constants, which are just scaling factors and substitute in $\chi^2$, we obtain:

$$
\begin{equation}
\mathcal{L}(D|\theta) = \exp (-\chi^2)
\label{eqn:chiSquaredBayesian2}
\end{equation}
$$

This is the likelihood for the data set with the constants removed. The intuition behind this is that the likelihood is maximal when the $\chi^2$ is minimal and removing the constants doesn't change the location of the maximum which is where the posterior will be distributed. The Bayes' formula also requires a denominator referred to as the evidence. However this is also a constant for a given data set and instead we see the equation sometimes written:

$$
\begin{equation}
  \text{posterior} \propto \text{likelihood}\ \times\ \text{prior}
  \label{eqn:BayesAprox}
\end{equation}
$$

This is usually all we need to compute the posterior because the evidence term only scales the posterior (just as the other constants did), and in practice (as we will see) we are usually only interested in the ratio of the left-hand terms which means the constant evidence term cancels. What this means in practice is that we don't need to compute the denominator term in the Bayes theorem, at least for the applications we will describe here.

## Priors

A prior is a distribution of a parameter that represents our current uncertainty about the parameter. In practice, this means when computing the posterior, we draw a number from the prior distribution and multiply by the likelihood term. It can be surprisingly difficult to decide on a suitable prior, especially for complex models where information might be scarce. One possibility is to use what's called an improper prior where we state that the value for a given parameter can take on any value between $-\infty$ and $+\infty$. In other words, we're indicating total ignorance in the value for a given parameter. However, such approaches tend to be ill-advised on both statistical and practical grounds.  More realistically, many parameters, such as rate constants, are positive and will have an upper diffusion limit. Such a prior might range from some small value to an upper limit. Given our ignorance in the true value of the rate constant, we assume that any value between the limits is equally likely. Such priors are called flat priors. Sometimes one might have a rough idea for the value of a parameter, in which case we could model it with a normal or log-normal distribution. Defining good priors is not always easy, and Bayesian inference software packages will often offer specific assistance for defining priors. It is recommended that users refer to the package documentation before setting up priors.

If one only has a limited amount of experimental data, it is important to get the prior right, otherwise the posterior won't be well approximated. The less experimental data you have, the more dominant the priors will be in influencing the posterior. If the priors are wrong, you're essentially giving false information, and there might not be enough experimental data to overcome the error in the prior.

If a lot of experimental data is available, then the prior is not that important because the posterior will be dominated by the likelihood term.

With the prior and likelihood in place, we can describe the basic algorithm for computing the posterior. There are four steps to follow to compute the posterior:

- Assume a prior, i.e. a distribution, for each parameter $\theta$
- Generate a random $\theta$ by drawing from the prior distribution
- Compute the likelihood $p (x|\theta)$
- Compute the posterior for $\theta$ by multiplying the prior and likelihood.

The biggest problem in these steps is computing the likelihood for each parameter. This involves the use of Markov Chain Monte Carlo methods or MCMC. In many ways, it's the development of MCMC and the availability of more computing power that has made Bayesian inference more popular.

## MCMC

MCMC is short for Markov Chain Monte Carlo, and before proceeding, we could recap what a Markov Chain is. A simple Markov chain is shown in Figure [Figure: fig:Markov](#fig-markov). A Markov chain has states (also called nodes) and probabilistic transitions, which are movements between nodes. In our example, there are two states representing a sunny day and a rainy day. Transitions between states can represent anything, but in our simple example, we assume that the transition represents moving from one day to the next. We can ask questions such as, if it's sunny today, what is the chance it will be rainy tomorrow? The transition from one node to another is determined by a probability.  For example, the probability of moving from Sunny to Rainy is 0.8.  A key property of a Markov chain is that a transition from one state to another is only dependent on the state we transition from. In other words, the probability of the next day being rainy if today is sunny only depends on the fact that it's sunny today, not for example, on what the weather was like the day before or the day before that.

As an illustration, assume we start on a sunny day, that is we are in state `sunny'. What is the probability that it will be a rainy day in three days time? Using Figure [Figure: fig:Markov](#fig-markov) we can figure our that there are four different ways to get to a rainy day in three days' time, they include:

```latex
\begin{tabular}{lllllllll} \toprule
Days: &  0  &              &   1   &               &  2    &               &  3    & Probability \\ \midrule
1:   & Sunny & $\rightarrow$ & Sunny & $\rightarrow$ & Sunny & $\rightarrow$ & Rainy & 0.032 \\
2:   & Sunny & $\rightarrow$ & Sunny & $\rightarrow$ & Rainy & $\rightarrow$ & Rainy & 0.064 \\
3:   & Sunny & $\rightarrow$ & Rainy & $\rightarrow$ & Rainy & $\rightarrow$ & Rainy & 0.128 \\
4:   & Sunny & $\rightarrow$ & Rainy & $\rightarrow$ & Sunny & $\rightarrow$ & Rainy & 0.384 \\ \bottomrule
\end{tabular}
```

For each pathway from sunny to rainy, we compute the probability of raining as a product of the individual probabilities. We then sum up each pathway's probability to get the probability it will rain in three days times. In this case, the sum of probabilities = 0.608. Given this result, I would recommend taking an umbrella with you in three days time.

**Figure** <a id="fig-markov"></a> `fig:Markov`

```latex
\begin{figure}
\begin{minipage}{\textwidth}
\centering
\begin{tikzpicture}[scale=0.18]
\tikzstyle{every node}+=[inner sep=0pt]
\draw [black,fill=blue!20] (15.7,-26.5) circle (3);
\draw (15.7,-26.5) node {Sunny};
\draw [black,fill=red!20] (47.4,-26.5) circle (3);
\draw (47.4,-26.5) node {Rainy};
\draw [black,line width = 0.6mm,-latex] (14.377,-23.82) arc (234:-54:2.25);
\draw (15.7,-19.25) node [above] {$0.2$};
\draw [black,line width = 0.6mm,-latex] (46.077,-23.82) arc (234:-54:2.25);
\draw (47.4,-19.25) node [above] {$0.4$};
\draw [black,line width = 0.6mm,-latex] (45.015,-28.317) arc (-56.2495:-123.7505:24.236);
\draw (31.55,-32.9) node [below] {$0.6$};
\draw [black,line width = 0.6mm,-latex] (18.047,-24.635) arc (124.84285:55.15715:23.635);
\draw (31.55,-19.9) node [above] {$0.8$};
\end{tikzpicture}
\caption[A Simple Markov Chain. The numbers on the arcs represent the probability of moving from one state to another.]{Simple Markov Chain. The numbers on the arcs represent probabilities for moving from one state to another.\footnotemark}
\label{fig:Markov}
\end{minipage}
\end{figure}
```

\footnotetext{At the time of writing, I found a convenient web app that could draw Markov chain diagrams and export Tikz code: <http://madebyevan.com/fsm/>}

In MCMC, the Markov chain nodes represent parameter states, and transitions represent movement from one parameter state to another. Movement from one state to another is determined by the posterior we compute using the Bayes' relationship [Bayesian Inference](#eqn-bayesformal).

The MCMC method works in three steps:

- A new state (i.e set of parameters) for the Markov chain is proposed. This is achieved by drawing a random number from a **proposal distribution**. The proposal distribution is often a simple normal distribution centered on the current value for the parameter, but it could be a uniform distribution, etc. We add the value we generated from the proposal distribution to the current value of the parameter. In this way, we obtain a new value for the parameter. We do this for all parameters.
- The probability of the new state is calculated using equation [Computing the Posterior](#eqn-bayesaprox).
- A uniformly distributed random number is generated to determine whether to accept or reject the new state. A common approach is to take the ratio of the probability of the new state to the previous state. If the ratio is greater than one, we accept, otherwise, based on the uniform random number, we accept or reject.
- When we accept, we obtain a new sample to add to the posterior distribution.

This sequence is *run many thousands of times.*

The algorithm is searching for regions in the parameter space that has the highest probability, and it does this via a biased random walk. Those who are accustomed to more sophisticated search algorithms, such as the ones we described in earlier chapters, might find this simple approach surprising. The MCMC sampling technique is reminiscent of simulated annealing but without the temperature component. One has to remember of course, that the purpose of the MCMC algorithm in our context is to gauge the shape of the surface that surrounds the minimum rather than the minimum itself. The surface around the minimum could be complex, and repeated calculation of the Markov states will uncover this. This, together with the ability to incorporate priors, is the real advantage of Bayesian inference.

In terms of a more familiar analogy, let's say we wanted to find the source of a gold vein that is at the top of a mountain. Let's assume that it's quite misty so that we can't see very far in front of us, let alone the top of the mountain. We do know that gold is often found in quartz, so this can be our prior. We proceed as follows:

- Prior: a rock that has quartz in it

- Find a nearby rock (this rock could be up the hill or down the hill), taking into account the prior. This means we're likely to pick a rock with some quartz in it.

- Accept or reject the move to the nearest rock on the mountain based on whether the rock resembles the prior and whether we've moved up the hill. If we've moved up the hill and the rock is quartz, we accept, otherwise we reject.

- Accept: Move to the position where you found the rock.

- Reject: Throw a die, depending on the die, stay where you are, or move to the position of the rock. The die is also biased so that if the suggested move is to go a long way downhill, we are more likely to reject. Remember that the rock we picked could be up or down the hill.

- Go to 2.

This process may take a long time, but eventually, we'll reach the gold vein at the top of the mountain. In the second step, the rock we picked could be up the hill or down the hill from where we're standing. This gives us a chance to get out of local depressions in the topography. For example, let's say there is a depression, and we've followed a trail of quartz into the depression. This is a bad idea because if we can't get out of the depression, we won't find the gold vein. Step two is crucial because it gives us a chance to get out of the local depression and continue climbing to the top of the hill (*cf.* simulated annealing).

Given this description, we can now provide the pseudo code for this algorithm shown in algorithm [MCMC](#lst-metropolis). We're assuming that the proposal distribution is a simple normal curve, $\mathcal{N}(0, \sigma)$, where $\sigma$ is set according to how far we want the parameters to change between states. This algorithm is technically called the Metropolis algorithm and is one of the simplest ways to estimate the posterior.

```latex
\begin{algorithm}[htb]
\caption{Metropolis Algorithm to Compute the Posterior} \label{lst:Metropolis}
\begin{algorithmic}[1]
  \STATE{$\displaystyle N = 10,000$ \hspace{71pt} $\rhd$ Number of Markov iterations}
  \STATE{initialize parameters, $\theta_0$}%
  \STATE{compute $p(\theta_{0})$}

  \FOR{$\displaystyle i\ = 1\ \text{to}\ N$}
    \STATE $\displaystyle u = U (0, 1)$ \hspace{65pt} $\rhd$ Draw a uniform random number
    \STATE{$\displaystyle  \theta_i = \theta_{i-1} + \mathcal{N}(0, \sigma)$} \hspace{24pt} $\rhd$ Compute a trial parameter value
    \STATE{ compute $p(\theta_{i})$ and $p(\theta_{i-1})$}  \hspace{38pt} $\rhd$ Compute left-hand side of Bayes~\eqref{eqn:BayesAprox}
    \IF{$\displaystyle u < \text{min} \left(1, \frac{p(\theta_i)}{p (\theta^{i-1})}\right)$}
      \STATE {$\displaystyle \theta_{i+1} = \theta_i$}  \hspace{64pt} $\rhd$ Accept, update to the new $\theta$
    \ELSE
      \STATE {$\displaystyle \theta_{i+1} = \theta_{i-1}$}  \hspace{53pt} $\rhd$ Reject, go back to the original $\theta$
    \ENDIF
  \ENDFOR
\end{algorithmic}
\end{algorithm}
```

**Figure** <a id="fig-mcmcexample"></a> `fig:MCMCExample`

*Graphic (not in the LaTeX source, referenced by name): `MCMCExample.pdf`*

*Caption:* Illustration showing a Monte Carlo Markov Chain search on a 2-D surface. The sampling starts at the bottom-left corner. Modified from Bayesian inference in physics, von Toussaint, Reviews of Modern Physics, 83, 2011. Dotted lines indicated rejected moves.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=1]{MCMCExample.pdf}
 \caption{Illustration showing a Monte Carlo Markov Chain search on a 2-D surface. The sampling starts at the bottom-left corner. Modified from Bayesian inference in physics, von Toussaint, Reviews of Modern Physics, 83, 2011. Dotted lines indicated rejected moves.}
\label{fig:MCMCExample}
\end{figure}
```

**Figure** <a id="fig-mcmchill"></a> `fig:MCMCHill`

*Graphic (not in the LaTeX source, referenced by name): `MCMCHill_3.png`*

*Caption:* A three-dimensional view of a Markov chain sample showing the distribution of points. The higher the surface the higher the likelihoods so that the points tend to congregate around the high areas of the surface. Modified from <http://carrot.mcb.uconn.edu/ olgazh/bioinf2010/class31.html>

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.7]{MCMCHill_3.png}
 \caption{A three-dimensional view of a Markov chain sample showing the distribution of points. The higher the surface the higher the likelihoods so that the points tend to congregate around the high areas of the surface. Modified from \url{http://carrot.mcb.uconn.edu/~olgazh/bioinf2010/class31.html}}
 \label{fig:MCMCHill}
\end{figure}
```

The acceptance ratio in the Metropolis algorithm is given by the ratio of the new Bayes' value to the previously computed value: $p(\theta_i)/p (\theta^{i-1})$. If the new value is higher, the ratio is greater than one, otherwise if the new value is less, the ratio is less than one. If the ratio is greater than one, the new point is always accepted since the uniform random number we draw, $u$, will always be less than one.

Figure [Figure: Illustration showing a Monte Carlo Markov Chain search on a 2-D surfac](#fig-mcmcexample) shows an example of a Markov Chain for two parameters, $x_1$ and $x_2$, and illustrates the rejected and accepted trials.  A more dynamic illustration can be found in the YouTube video by Ban Lambert, where he shows a search conducted on a much more complex surface <https://www.youtube.com/watch?v=U561HGMWjcw>.

Figure [Figure: Illustration showing a Monte Carlo Markov Chain search on a 2-D surfac](#fig-mcmcexample) also illustrates an important aspect of any Metropolis algorithm, and that is the time it takes to first locate the area where the probability is high. This is called `burn-in', where, as a user, we discard the first set of iterations at the beginning of the run. You can see that in the lower-left corner of Figure [Figure: Illustration showing a Monte Carlo Markov Chain search on a 2-D surfac](#fig-mcmcexample) where the search is initially outside the main area of the high probability but eventually finds the area where the probability is highest and stays near that location. It is this region that describes the posterior we are looking for.

An important aspect is how to select a new parameter value for the next iteration. Assuming we determine the change to a parameter by sampling from a normal distribution centered on the current value of the parameter with standard deviation, $\sigma$, if we set $\sigma$ too high, we will find the search making large jumps which allows the algorithm to locate the area of high likelihood quickly but is unable to make a detailed survey once it has found the space. On the other hand, if $\sigma$ is too small, the algorithm will take a long time to find the area of high likelihood because it only moves in small steps. A compromise has to be made when setting the $\sigma$ value.

A more generalized version of Metropolis is the Metropolis-Hastings algorithm and was developed to cater to the situation where the proposal distribution wasn't symmetrical. Uniform and normal distributions are symmetrical but there are others that are not. The difference with the straight Metropolis is the addition of a correction factor to take into account any asymmetries in the proposal function.

### Summary

For practical use, I don't recommend writing your own code to implement Bayesian inference, but to use one of a number of well-regarded packages that are available on all the major scientific platforms for data analysis. In these packages, you'll find more samplers such as the Gibbs or Metropolis-Hamiltonian in addition to more sophisticated samplers. Some packages are written to exploit computer clusters or even GPU cards (Graphics Processing Unit) since sampling tends to be computer intensive. Scale is an issue with MCMC, and for very large models, the approach might have difficulty in locating the region of high probability. That is, the burn-in may take a very long time. Moreover, it might be very difficult to determine when sufficient burn-in has been achieved. In these cases, I would recommend using one of the optimizers discussed in the previous chapter to help the MCMC avoid a long burn-in phase. Of course, one should be fairly certain that the optimizer has found the global minimum, otherwise you're back to square one.

As an example of using MCMC on a biochemical problem, I used emcee, which is a Python package, to investigate the simple model, subsection [[10_parameter_estimation|Two-step Example]] from the last Chapter. If this case only $S_3$ was measured. The results of the MCMC analysis is given in Figure [Figure: Markov chain sampling of the simple model ( \ref{subsec:simpleModel}),](#fig-emcee-5000-simplemodel). The number of samples was 15,000.

<!-- If we ignore for the moment any prior information to influence parameter estimation and uncertainty, then a Markov chain sampler will attempt to gauge the shape of underlying curve that surrounds the minimum. It does this by randomly selecting points in the vicinity of the minimum. The sampling algorithm ensures that most of the sampling occurs close to the minimum with much less likelihood of sampling points far away from the minimum. Figure~\ref{fig:emcee_5000_simpleModel} shows the result of samples 5000 points given measured data just $S_3$. -->

<!-- In summary, all three methods, bootstrapping, tracing the contour lines on the chi-square surface and using Monte Carlo sampling produced very similar results. Of the three, bootstrapping was the fastest. -->

**Figure** <a id="fig-emcee-5000-simplemodel"></a> `fig:emcee_5000_simpleModel`

*Graphic (not in the LaTeX source, referenced by name): `emcee_5000_simpleModel.pdf`*

*Caption:* Markov chain sampling of the simple model ( [[10_parameter_estimation|Two-step Example]]), using 5000 samples for burn-in out of 15,000 samples in total. The model was fitted using only the measured $S_3$. Compare with Figure [[10_parameter_estimation|Figure: Bootstrap results from 6000 samples with an error of 0.1 standard devi]] which was computed using the bootstrap method. The number of simulations required to compute Figure [[10_parameter_estimation|Figure: Bootstrap results from 6000 samples with an error of 0.1 standard devi]] was 1,071,197. The analysis took just under 4 minutes to compute. The bootstrap used 445,026 simulations and took just under 2 minutes to complete. Both approaches give very similar results. This illustrates how slow MCMC can be. For large models significant computer resources will be required.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.7]{emcee_5000_simpleModel.pdf}
 \caption{Markov chain sampling of the simple model (~\ref{subsec:simpleModel}), using 5000 samples for burn-in out of 15,000 samples in total. The model was fitted using only the measured $S_3$. Compare with Figure~\ref{fig:ScatterK1K2_B} which was computed using the bootstrap method. The number of simulations required to compute Figure~\ref{fig:ScatterK1K2_B} was 1,071,197. The analysis took just under 4 minutes to compute. The bootstrap used 445,026 simulations and took just under 2 minutes to complete. Both approaches give very similar results. This illustrates how slow MCMC can be. For large models significant computer resources will be required.}
\label{fig:emcee_5000_simpleModel}
\end{figure}
```

## A Simple Example

To illustrate Bayesian inference, let's look at a example  where we use MCMC to find the posterior for a simple  model(footnote: This was inspired by an example provided by Hanno Rein at the University of Toronto}. In the example we'll `fit'(footnote: I hesitate to use the word `fit' because Bayesian inference is not fitting in the classical sense.} a function to a set of data that mimics a circadian rhythm. The data is shown in Figure [Figure: Sample data for Bayesian inference example](#fig-bayesiandataexample). We will attempt to infer the parameters, $\theta_1, \theta_2$ and $\theta_3$ based on the following model:

$$
\begin{equation}
y = \theta_1 + \theta_2 \sin \left( \frac{2 \pi}{24} + \theta_3  \right)
\label{eqn:Circadian}
\end{equation}
$$

We need to define a number of elements to implement the Bayesian inference, the most important being the prior, $p(\theta)$ and the likelihood, $p(\theta|x)$. The will assume the prior, $p(\theta)$ is equal to one. That's not exactly uninformative because we are explicitly saying we think the parameters have values of 1.0, but it's benign in the sense it has no influence on the likelihood. A better prior might include a uniform distribution between some set limits, known as a flat prior. The choice of prior and the detailed arguments on that choice is beyond the scope of this textbook. My recommendation is to consult the documentation for whatever software you use. `pyMC`(footnote: <http://pymc-devs.github.io/pymc/>}, which is a popular MCMC tool for Python, has specific support for including priors in either an automated or semi-automated way. A common prior in modeling would be a constrained prior that ranges between a lower and upper limit.

**Figure** <a id="fig-bayesiandataexample"></a> `fig:BayesianDataExample`

*Caption:* Sample data for Bayesian inference example.

```latex
\begin{figure}[htpb]
\centering
\begin{tikzpicture}
\begin{axis}[
  xlabel= Time
]
\addplot[only marks, color=red, mark=*, fill=red] coordinates {
( 0.0, 23.27938038131689) ( 0.5,  20.6559050031244) ( 1.0,  26.552638102945) ( 1.5,  23.64819871969294)
( 2.0,  23.3454825781121) ( 2.5,  26.9922423779432) ( 3.0,  27.279069779299) ( 3.5,  24.53369108766635)
( 4.0,  25.9856210866034) ( 4.5,  21.5144701821153) ( 5.0,  28.242864360619) ( 5.5,  27.7679549421946)
( 6.0,  27.4330142202421) ( 6.5,  21.1316017362929) ( 7.0,  24.065171577542) ( 7.5,  24.21578944552598)
( 8.0,  24.4286251116631) ( 8.5,  23.5401675799088) ( 9.0,  24.897885129344) ( 9.5,  18.41674927917439)
( 10.0, 20.3344132699168) ( 10.5, 18.6442561910772) ( 11.0, 19.560276110235) ( 11.5, 19.51169244157144)
( 12.0, 20.2997930545083) ( 12.5, 16.0235330380508) ( 13.0, 17.663884004151) ( 13.5, 12.09244303494323)
( 14.0, 14.8471228747998) ( 14.5, 16.9000218778145) ( 15.0, 13.644426591735) ( 15.5, 14.86813721072689)
( 16.0, 16.1409288034108) ( 16.5, 16.0920364207691) ( 17.0, 15.784641672190) ( 17.5, 13.97175395279540)
( 18.0, 14.7230599435191) ( 18.5, 14.1802990121004) ( 19.0, 16.950023116833) ( 19.5, 20.57036831476705)
( 20.0, 16.5346808871517) ( 20.5, 15.9051244411212) ( 21.0, 17.816715128282) ( 21.5, 14.33948441298706)
( 22.0, 19.7558784803219) ( 22.5, 18.2494915517654) ( 23.0, 20.552976976182) ( 23.5, 21.63176376304047)
( 24.0, 23.8473380186481) ( 24.5, 23.4683935544762) ( 25.0, 25.369241755956) ( 25.5, 21.38188235778775)
( 26.0, 21.9827134818404) ( 26.5, 25.0160800974299) ( 27.0, 24.463408053490) ( 27.5, 25.51749907976228)
( 28.0, 26.6622690067730) ( 28.5, 25.9288140399299) ( 29.0, 27.074269523304) ( 29.5, 28.87538050676035)
( 30.0, 23.5778939648268) ( 30.5, 25.0334216224747) ( 31.0, 25.349264019590) ( 31.5, 23.79455518994726)
( 32.0, 25.6853197536337) ( 32.5, 18.1610764303242) ( 33.0, 26.316775986763) ( 33.5, 19.22529780758735)
( 34.0, 21.1634726927305) ( 34.5, 21.3656361279893) ( 35.0, 17.602562933768) ( 35.5, 19.32893409398206)
( 36.0, 19.0719463970724) ( 36.5, 18.0091595432502) ( 37.0, 14.460267206845) ( 37.5, 19.74218338967964)
( 38.0, 15.6672650388996) ( 38.5, 12.4767652841703) ( 39.0, 15.704065939753) ( 39.5, 14.27228727688568)
};
\end{axis}
\end{tikzpicture}
\caption{Sample data for Bayesian inference example.}
\label{fig:BayesianDataExample}
\end{figure}
```

To compute the likelihood we compute the $\chi^2$ between the data and the model and use this to compute $p(\theta|x)$ from $\exp (-\chi^2)$, For example, a Python function to compute the likelihood is shown in Listing `python:setUpBaysExample` alongside the $\chi^2$ function and the model. $\theta$ is the array of parameters:

```python
# Infer the parameter values for this model
def model (x,theta):
   return theta[0] + theta[1]*math.sin((2.0*math.pi/24.0)*x + theta[2])

# Compute the Chi Square between model and data
def chi2(dx, dy, theta):
   s = 0.0
   for i in range(len(dx)):
      s += (model(dx[i], theta) - dy[i])**2
   t = s/len (dx)
   return t

# Likelihood function
def P(dx, dy, theta):
   return math.exp (-chi2(dx, dy, theta))
```

Note how simple the likelihood function is. The next thing to write is the Monte Carlo chain generator, this is shown in Listing `python:ChainGeneration`.

```python
# Set a 'random seed' to the random number generator
import time
numpy.random.seed(int (time.time()))

# Use these to collect the samples generated by the MCMC
theta1 = []; theta2 = []; theta3 = []
# Initial guess for model parameters
theta_current = [0.,0.,0.]
P_current = P(dx, dy, theta_current)
chain = []
for i in range(40000):
   theta_proposed = [theta_current[0]+0.1*numpy.random.randn(),
                     theta_current[1]+0.1*numpy.random.randn(),
                     theta_current[2]+0.1*numpy.random.randn()]

   P_proposed = P (dx, dy, theta_proposed)
   ratio = min (1, P_proposed/P_current)

   r = numpy.random.rand()
   if ratio > r:
      theta_current = theta_proposed
      P_current = P_proposed
   if i >= 10000: # save chain only after burn-in
      chain.append(theta_current)

      theta1.append (theta_current[0])
      theta2.append (theta_current[1])
      theta3.append (theta_current[2])
```

The code defines two sets of parameter vectors, one for the current set and another for the proposed set.  Before entering the main loop, the current set is populated. We record the values of the current parameter values at each iteration as we will use them to plot the posterior distribution. There is also a check for burn-in, where we only start collecting data after we pass 5000 iterations. The results of running the code are given in Figure [Figure: Plot showing the raw data and the inferred model in darker symbols](#fig-chainendresult). This shows the raw data as well as the computed values using the inferred parameter values. The inferred model shows excellent agreement with the data.

**Figure** <a id="fig-chainendresult"></a> `fig:chainEndResult`

*Graphic (not in the LaTeX source, referenced by name): `chain.pdf`*

*Caption:* Plot showing the raw data and the inferred model in darker symbols.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.7]{chain.pdf}
 \caption{Plot showing the raw data and the inferred model in darker symbols.}
\label{fig:chainEndResult}
\end{figure}
```

Figure [Figure: This figure illustrates the movement of the Markov chain as it samples](#fig-chain) shows the first 400 segments in the MCMC chain. Note that the chain starts at the left-hand corner and eventually reaches the top-right-hand corner what appears to be an area of highest probability. The segments from 0 to 5 represents the burn-in phase. Often the burn-in can be quite long, and even when an area of high probability has been located, it may not be the highest, and it might take further iterations to actually find the high area of probability. This is why I recommend first using a good global optimizer to help the MCMC algorithm get started.

**Figure** <a id="fig-chain"></a> `fig:chain`

*Graphic (not in the LaTeX source, referenced by name): `walkOfChain.pdf`*

*Caption:* This figure illustrates the movement of the Markov chain as it samples parameter space. Only 400 samples are shown but a burn-in can be seen that starts on the left side. The area of highest probability can be found in the concentration of steps on the right of the figure. Only $\theta_2$ versus $\theta_3$ are plotted to make it easier to visualize.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.7]{walkOfChain.pdf}
 \caption{This figure illustrates the movement of the Markov chain as it samples parameter space. Only 400 samples are shown but a burn-in can be seen that starts on the left side. The area of highest probability can be found in the concentration of steps on the right of the figure. Only $\theta_2$ versus $\theta_3$ are plotted to make it easier to visualize.}
\label{fig:chain}
\end{figure}
```

We can look at the posterior distributions for the three parameters and compute 95% percentiles for each parameter. These can be computed with the python call `numpy.perce\-ntile (theta1,2.5)` and `numpy.percentile (theta1,97.5)`. This will give us the interval in which 95% of the parameters lie. Table [Table: Table showing 95% percentiles for the posteriors alongside the true va](#tbl-bayfitconfidence) shows the percentiles for each parameter. Figure [Figure: Distribution for the three parameters after MCMC, left to right:](#fig-bayfitdistritution) shows the distributions for each parameter.

**Table** <a id="tbl-bayfitconfidence"></a> `tbl:BayFitConfidence`

*Caption:* Table showing 95% percentiles for the posteriors alongside the true value. Data presented to one decimal place. 

```latex
\begin{table}
\centering
\begin{tabular}{lllll} \toprule
Parameter & Lower & Upper & True Value & Averaged Value \\ \midrule
$\theta_1$ & 19.8 & 20.2 & 20 & 19.987\\
$\theta_2$ & 5.8 & 6.2 & 6 & 6.04 \\
$\theta_3$ & 0.2 & 0.6 & 0.4 & 0.402 \\ \bottomrule
\end{tabular}
\caption{Table showing 95\% percentiles for the posteriors alongside the true value. Data presented to one decimal place. }
\label{tbl:BayFitConfidence}
\end{table}
```

**Figure** <a id="fig-bayfitdistritution"></a> `fig:BayFitDistritution`

*Graphic (not in the LaTeX source, referenced by name): `chainDistrib.pdf`*

*Caption:* Distribution for the three parameters after MCMC, left to right: $\theta_1, \theta_2$, and $\theta_3$. All three parameters look well behaved with a symmetric normal-like distribution.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.4]{chainDistrib.pdf}
 \caption{Distribution for the three parameters after MCMC, left to right: $\theta_1, \theta_2$, and $\theta_3$. All three parameters look well behaved with a symmetric normal-like distribution.}
\label{fig:BayFitDistritution}
\end{figure}
```

For completion, the plotting code is shown in Listing `python:BayFitPlotting`, and the code for generating the noisy data is shown in listing `python:mcmcsyntheticdata`

```python
# Plot model and fitted data
inferredModel = []
for x in dx:
    inferredModel.append(model(x, theta_current))
# Raw data
pylab.plot (dx, dy, "o", markerfacecolor='red',
          markeredgewidth=0.5, markeredgecolor='black')
# Inferred model
pylab.plot(dx, inferredModel, ".",
          markerfacecolor='blue', markeredgecolor='blue')
pylab.xlabel ('Time')
pylab.savefig('chain.pdf')
pylab.show()
print (theta_current)

fig, (ax1, ax2, ax3) = pylab.subplots(1, 3, figsize=(15,5))
ax1.hist(theta1, 30, color = 'lightblue', edgecolor = 'black',)
ax2.hist(theta2, 30, color = 'lightblue', edgecolor = 'black',)
ax3.hist(theta3, 30, color = 'lightblue', edgecolor = 'black',)
pylab.savefig ('chainDistrib.pdf')
```

```python
import math, numpy, pylab

# Ensure that each time we run the program we
# generate the same synthetic data
numpy.random.seed (1232)

# Generate some synthetic data
dx=[]; dy=[]

theta = [20, 6, 0.4]
for x in numpy.arange (0, 40, 0.5):
    dx.append (x)
    dy.append (numpy.random.normal(theta[0] +
          theta[1]*math.sin(2.*math.pi/24.*x+theta[2]), 2))

# Plot is to see what it looks like
pylab.plot (dx, dy)
pylab.show()
```

The 95% percentiles for the distribution of parameters is given in table [Table: Results from the MCMC Bayesian inference](#tlb-mcmcresults) along with the average $\theta$ values after burn-in.

**Table** <a id="tlb-mcmcresults"></a> `tlb:MCMCResults`

*Caption:* Results from the MCMC Bayesian inference. Values rounded to two decimal places. Lower and upper bounds are computed from 95% percentiles.

```latex
\begin{table}
\centering
\begin{tabular}{lllll} \toprule
Parameter   & Ground Truth & Estimated Value & Lower bound & Upper bound \\ \midrule
$\theta_1$  & 20 & 20.21 & 18.81 & 21.67 \\
$\theta_2$  & 6  & 5.92  & 3.64  & 7.99 \\
$\theta_3$  & 0.4& 0.44  & 0.1 & 0.82 \\ \bottomrule
\end{tabular}
\caption{Results from the MCMC Bayesian inference. Values rounded to two decimal places. Lower and upper bounds are computed from 95\% percentiles.}
\label{tlb:MCMCResults}
\end{table}
```

## Uncertainty Quantification

Uncertainty quantification is used to determine how the outputs vary, given uncertainty in the inputs. For example, consider a linear model, such as $y = mx + b$. There are three possible inputs to this model, the two parameters, $m$ and $b$, and the input variable, $x$. Variation in these values will result in variation in the output $y$. Uncertainty quantification in engineering is particularly important where it helps determine whether the outputs meet requirements given the variation in inputs. This makes it possible to predict failures before they happen. For example, the weight of cars that cross a bridge or wind-induced structural vibrations will vary day to day, and it is important to know how well the bridge behaves. A common theme is whether the stochastic variation in the inputs such as cars and wind result in structural thresholds being breached, thus making the bridge unsafe.

In building pathway models, we are also interested in how well the model predicts outcomes in the face of known uncertainties in the inputs. In addition, it can also be used to assess the quality of the model because if the level of output uncertainly increases during a simulation of a model, it is likely that we have the incorrect model for the process under study. We will look at this later.

### Computing the effect of uncertainty

Uncertainty in the inputs is sometimes grouped into two types:

- **Aleatory:** naturally occurring randomness that we cannot (or do not know how to) reduce.
- **Epistemic:** uncertainty due to lack of knowledge that we can reduce by improving our experimental technique.

In biology, an example of an aleatory uncertainty is the natural stochastic variation we find in the number of molecules taking part in reactions at low concentration. Epistemic uncertainties include the usual sources of error we make during measurement, for example, due to noise in the measuring instrument, sample variation, or simply poor experimental technique. These errors emerge as noise in our data, which in turn propagates into the inferred parameter values. Something we've not yet considered is that uncertainty in the parameters can propagate into the outputs of the models, which is what we'll consider here.

There are different ways to determine how inputs affect outputs. One way is to make small perturbations in the input and see how it affects the output. Such calculations can even be done analytically at steady state or during transients using metabolic control analysis. More often, however, it is more desirable to propagate the known distribution of the input uncertainties into the outputs. That way, we can also see how the output values are distributed. This is particularly important if the inputs have skewed distributions or the model is nonlinear, and we need to know whether this results in skewed outputs.

Bayesian inference and the bootstrapping that was discussed in the last chapter, provide uncertainties in the estimated parameters of the model. For example, in the previous model, we generated the distributions for the estimated parameter values shown in Figure [Figure: Distribution for the three parameters after MCMC, left to right:](#fig-bayfitdistritution). These distributions can be used to estimate the corresponding uncertainties in the model output. In the last example, the output was the circadian rhythm. Both Bayesian and bootstrapping techniques are ideal starting points to conduct an uncertainty quantification.

There exist specific software packages that can help with computing the uncertainty quantification, however, we will compute the values using our own code to show how it might be done in practice.

The first thing we need to do is turn the distributions that were created in Figure [Figure: Distribution for the three parameters after MCMC, left to right:](#fig-bayfitdistritution) into something we can sample from. The `scipy` package in Python has a very convenient function that can do this. The function is called `scipy.stats.rv_histogram (hist1)`, where the argument to the function is the histogram data. In the example, we collected the posterior as a list of 30,000 values for each parameter. The code in Listing `python:UC_sampling` shows how a histogram is be generated and then converted into a probability density function for each parameter. We can use the function `rvs` to draw samples from the probability density functions.

```python
# Assuming the individual data points for the
# posterior are stored in theta1, theta2, and theta3

theta1_dist = scipy.stats.rv_histogram (hist1)
theta2_dist = scipy.stats.rv_histogram (hist2)
theta3_dist = scipy.stats.rv_histogram (hist3)

# We can sample each of these distributions using:
sample = theta1_dist.rvs()
sample = theta2_dist.rvs()
sample = theta3_dist.rvs()
```

As we sample parameter values from the posterior, we can use them to compute a plot of the circadian rhythm, which represents the output. If we do this many times, we will get a distribution of circadian rhythms. Figure [Figure: Range of outputs for the circadian rhythm model based on the posterior](#fig-uc-plots) shows three ways that the outputs can be presented. Panel a) shows 200 circadian rhythms plotted on top of each other. This gives an impression of the spread of outputs. Panel b) shows the scatter of 200 points at each time point on the circadian rhythm. Lastly, panel c) shows a shaded 95% percentile envelope on either side of the mean. This was computed by estimating at each time point the 95% percentile and using the matplotlib function `fill_between` to merge the points into a continuous area. There are other ways to plot such outputs, for example, using density plots. These plots give an indication of how uncertainty in the parameter values is reflected in uncertainty in the output.

Listing `python:UC_sampling_scatter` shows the code used to compute the scatter envelope in Figure [Figure: Range of outputs for the circadian rhythm model based on the posterior](#fig-uc-plots).

```python
ydata = []
for x in np.arange (0, 40, 1):
    ydata = []
    for i in range (100):
        # Sample the parameter values
        t1 = theta1_dist.rvs()
        t2 = theta2_dist.rvs()
        t3 = theta3_dist.rvs()
        pylab.plot (x, model (x,[t1,t2,t3]), 'r.', alpha=0.2)
pylab.xlabel ('Time')
pylab.show()
```

Figure `python:UC_sampling_shaded` shows the code that was used to produce the shaded envelope in Figure [Figure: Range of outputs for the circadian rhythm model based on the posterior](#fig-uc-plots). It's a little bit more complicated, but not much more.

```python
xd = [] # x data points
# Collect the data in these arrays
ydmean = []; ydpercentile_plus = []; ydpercentile_minus = []
# Work through the x variable
for x in np.arange (0, 40, 1):
    yd = []
    xd.append (x);
    # At each x variable compute 200 points
    # 200 parameter sets were precomputed and stored in thetaList
    for i in range (200):
        yd.append (model (x, thetaList[i]))
    ydmean.append (np.mean (yd))
    ydpercentile_plus.append (np.percentile (yd, 97.5))
    ydpercentile_minus.append (np.percentile (yd, 2.5))
pylab.plot (xd, ydmean, 'k-')
pylab.fill_between(xd, ydpercentile_minus, ydpercentile_plus,
             color='orange', alpha=0.2)
pylab.show()
```

In these examples, the uncertainty in the outputs was computed in a brute-force manner where parameter values were drawn from their respective distribution and assigned to the model and the circadian rhythm function [A Simple Example](#eqn-circadian) computed. For computing the shaded envelope in Figure [Figure: Range of outputs for the circadian rhythm model based on the posterior](#fig-uc-plots) 80,000 evaluations of the function were made. This highlights the computational requirements for doing uncertainty quantification. This example only took 300 ms to compute, but we were only evaluating a simple function. For a  differential equation model, the calculations would be much more intense for which the compute time could increase dramatically.

**Figure** <a id="fig-uc-plots"></a> `fig:UC_Plots`

*Graphic (not in the LaTeX source, referenced by name): `UQ_MCMC_Model.png`*

*Caption:* Range of outputs for the circadian rhythm model based on the posterior distribution of parameter values. Three styles are shown, line, scatter, and shaded. The envelope in c) represents the 95% percentile limits based on 200 samples at each $x$ data point. The central line in the shaded plot represents the mean. See listing `listing:mcmcExample1`.

```latex
\begin{figure}[htb]
\centering
 \includegraphics[scale=0.35]{UQ_MCMC_Model.png}
 \caption{Range of outputs for the circadian rhythm model based on the posterior distribution of parameter values. Three styles are shown, line, scatter, and shaded. The envelope in c) represents the 95\% percentile limits based on 200 samples at each $x$ data point. The central line in the shaded plot represents the mean. See listing~\ref{listing:mcmcExample1}.}
\label{fig:UC_Plots}
\end{figure}
```

<!-- \subsection*{Computing Uncertainties for the Heinrich model from Figure~\ref{fig:HeinrichFit}} -->

<!-- Stuff here -->

<!-- {\tt lmfit.conf_interval} will -->

## Final Comments

Experimental data has been collected, a model has been proposed, data fitting has confirmed that the model is able to reproduce the experimental data, and all the statistical tests pass. One might imagine we are now ready to write the paper and publish. However, a critical last step is to ask whether the model can make new, non-trivial predictions. At minimum, we should propose experiments to test the proposed model, at best, attempt the tests ourselves. It is worth emphasizing again the section where cross-validation was briefly discussed. This is where a model is tested for its ability to predict data it has never seen before and is a key test for demonstrating reliability and utility of a model. In biomedical research, a chief aim should be the development of trustworthy models, models that could, if necessary, be used in clinical situations.

One of the chief dangers in building models is inadvertently creating a model that is over-fitted, which can give us a false sense of security that we have a good model. It is true that some of the statistical tests we have discussed in these chapters can help spot an over-fitted model, but the best test is cross-validation and ultimately testing new hypotheses generated from the model. I am reminded here of the oft-quoted comment made by John von Neumann who is said to have remarked: "With four parameters I can fit an elephant, and with five I can make him wiggle his trunk". This quote has worked its way through the biomedical simulation literature mostly as a means to discredit modeling and fails to point out that models must be stress-tested to ensure they can be trusted. As with software, confidence in whether a piece of software will operate as expected all depends on the level of testing and the stresses that the software is put through.

When data is fitted to a model, we need to know the range of predictions the model can make beyond the fitted data. Out of range predictions should be tested to delineate the scope of the model. As discussed in Chapter [[04_introduction_to_modeling|Introduction to Modeling]], what modelers really seek is a degree of confidence in their model. A model is never truly validated as one can only take measurements to increase confidence in the model. That confidence may increase as the model is subjected to more and more testing.

John Tyson, who is well known for his pioneering work on cell cycle models, uses an interesting approach to model building. Whenever the core model is adjusted, the model is subjected to over 120 phenotype tests, which are predictions that the model is expected to make [chen2004integrative]. This ensures that the authors have a high confidence in their model.

Whether the fit of a model to data is good or not is immaterial unless the model provides new, testable predictions that can eventually be experimentally tested.

<!-- \subsection*{Strong Inference} -->

<!-- {\bfseries\Large Platt} -->

## Further Reading and Online Resources

- Berendsen HJ. (2011) A Student's Guide to Data and Error Analysis. Cambridge University Press. ISBN: 978-0-521-13492-7

- Draper NR and Smith H (1998) Applied Regression Analysis. 3rd edition. Wiley Series on Probability and Statistics. ISBN-13: 978-047117082

<!-- \item Johnson ML, Faunt LM (1992) Parameter estimation by least-squares methods. Methods in Enzymology, 210, 1-37. -->

5\item Johnson ML (1994) Use of Least-Squares Techniques in Biochemistry. Methods in Enzymology, 240, 1-22.

- David Liao (2012) Uncertainty propagation d: Sample variance curve fitting. <https://vimeo.com/40379524>.

- Straume M, Johnson ML (1992) Monte Carlo Method for determining complete confidence probability distributions of estimated model parameters. Methods in Enzymology, 210, 117-129.

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- \begin{enumerate} -->
<!-- \item Using one or more of the example models in the last chapter, use a package that implements MCMC (such as pyMC) to reestimate the parameters and their uncertainly. Compare these estimates with the those given in the last chapter. -->
<!-- \end{enumerate} -->

## Appendix

```python
# Go to https://github.com/hsauro/PathwayModelingBook

# Change to directory Chapter11, file is mcmc_simple1.py
```

---

## Index terms recorded in this chapter

- Bayesian inference
- credible region
- Gibbs
- likelihood
- MCMC
- Metropolis algorithm
- Metropolis-Hamiltonian
- Metropolis-Hastings
- posterior
- prior distribution

---

← [[10_parameter_estimation|Parameter Estimation]] · [[index|Wiki index]] · [[12_the_steady_state|The Steady State]] →
