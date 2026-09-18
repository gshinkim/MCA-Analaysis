# Stochastic Models

*Source: `chapter6.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Stochastic Models <a id="chap-stochastic"></a>

## Stochastic Kinetic Models

So far we have learned how to run simulations of continuous models described using ordinary differential equations. However, as mentioned in Chapter [[04_introduction_to_modeling|Introduction to Modeling]], there is a strong case in some situations to model reaction systems using a discrete stochastic approach.

It has been shown [elowitz2002stochastic, ozbudak2002regulation] experimentally that stochasticity is endemic in gene regulatory networks, particularly in prokaryotic organisms where the number of transcription factors can be in the low tens of copies or fewer. The stochasticity in protein expression is a result of the many molecular events that occur between transcription and translation. For example, when the number of transcription factors (or RNA polymerase) is very small, the random binding and unbinding to the operator and promoter sites leads to random transcription events such that transcription acts in an on/off manner with *bursts* of mRNA production followed by periods of silence. This is called the random telegraph model [Larson:2009]. Translation itself contributes to stochasticity given that the number of mRNA transcripts may be small. A single mRNA strand can result in many proteins being produced before it degrades. The kinetics of protein synthesis may therefore be quite different compared to what is described by a simple deterministic model.

Individual reaction events can play a dominant role in determining the evolution of the system. Since the time at which a reaction occurs is a random event, simulating reaction events becomes stochastic. In addition, since we're dealing with individual reaction events, we must keep track of exact molecule numbers rather than a number representing a continuous concentration value. The companion book, `Enzyme Kinetics for Systems Biology' [SauroBookOne:2012], provides a formal and informal description of the theory and algorithms behind stochastic simulations. Here we will only cover the formal description.  The most common approach to stochastic simulation is to use the Gillespie method for simulation which we will describe here.

## Stochastic Kinetics

### Basic Definitions

In stochastic reaction kinetics the symbol $c \delta t$  is often used to describe the probability that a reactant molecule will react in the next time interval, $\delta t$. This means that $c$ (without the $\delta t$) is the average probability that a reactant will react per unit time, and can be considered a probability or stochastic rate constant.

\stateHighlight{
$ c \delta t = $ the average probability that a particular reactant molecule will react in the next time interval, $\delta t$, where $c$ is the average probability that a reactant molecule will react per unit time. If the reaction is second or third-order, then $c \delta t$ refers to the probability of a particular *combination* of reactant molecules reacting in the next time interval, $\delta t$.
}

Note that the $c \delta t$ refers to a particular reactant combination that can react. For a first-order reaction, a single molecule can react, or for a second-order reaction, two molecules must meet to react. When we have a population of molecules, $c \delta t$ must be multiplied by the total number of reactant combinations in order to obtain the probability of a reaction occurring within the entire population in $\delta t$. For a simple first-order reaction, the number of combinations is the number of reactant molecules. Thus, the probability that a reaction will occur in a population in the next time interval, $\delta t$, is:

$$ h c \delta t $$

where $h$  is the number of distinct molecular reactant combinations, or in the case of a first-order reaction, the actual number of reactants (Figure [Figure: Number of combinations for a simple first-order reaction](#fig-firstordercombination)). To illustrate this further, let's say we have four reactant molecules and they react via a second-order reaction. The number of ways (combinations) the four pairs can meet up is $4 \times 4 = 16$. Therefore $h = 16$.

**Figure** <a id="fig-firstordercombination"></a> `fig:FirstOrderCombination`

*Graphic (not in the LaTeX source, referenced by name): `FirstOrderCombination`*

*Caption:* Number of combinations for a simple first-order reaction. Upper row represents individual molecules.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 0.75]{FirstOrderCombination}
  \caption{Number of combinations for a simple first-order reaction. Upper row represents individual molecules.} \label{fig:FirstOrderCombination}
\end{figure}
```

\stateHighlight{
$ h = $ the number of distinct molecular reactant combinations for a given reaction at time t.
}

\stateHighlight{
$ h c \delta t = $ the probability that a reaction will occur in a population of molecules in the next time interval, $\delta t$.
}

For reactions other than first-order, $h$ is more complicated. For a second-order reaction involving two distinct species, say X and Y, the number of combinations is $X Y$. For a second-order reaction that is a dimerization of identical molecules, X, the number of combinations is $X (X - 1)/2$. For a zero-order reaction, the number of combinations is one. Table [Table: Number of combinations ($h$) for different elementary reactions](#tbl-numcombinationsstochastic) gives a list of different reactions and the corresponding number of combinations.

**Table** <a id="tbl-numcombinationsstochastic"></a> `tbl:NumCombinationsStochastic`

*Caption:* Number of combinations ($h$) for different elementary reactions. $x_a$, $y_a$, and $z_a$ represent the number of molecules.

```latex
\begin{table}[htb]
\centering
\begin{tabular}{ll}
Reaction & Number of reactant combinations ($h$) \\\toprule
$ \rightarrow X$ (zero order) & 1 \\
$ X \rightarrow Y$ & $x_a$ \\
$ X + Y \rightarrow$ & $x_a\ y_a$ \\
$ X + X \rightarrow$ & $x_a\ (x_a - 1)/2 $ \\
$ X + Y + Z \rightarrow$ & $x_a\ y_a\ z_a$ \\
$ X + 2 Y \rightarrow$ & $x_a\ y_a\ (y_a - 1)/2$ \\
$ 3 X \rightarrow$ & $x_a (x_a-1)(x_a-2)/6$ \\ \bottomrule
\end{tabular}
\caption{Number of combinations ($h$) for different elementary reactions. $x_a$, $y_a$, and $z_a$ represent the number of molecules.}
\label{tbl:NumCombinationsStochastic}
\end{table}
```

The term $h c$ is analogous to the deterministic reaction rate. In the stochastic literature it is often called the **propensity function** or the average rate. $h c$ itself is not a probability since its value can exceed one, and its units are molecules per unit time. As indicated before, the term $c$ is analogous to the deterministic rate constant and is sometimes called the **stochastic rate constant**.

The average rate for a first-order reaction is therefore given by:

\[ x_a c \]

where $h$ has been substituted with $x_a$ (Table [Table: Number of combinations ($h$) for different elementary reactions](#tbl-numcombinationsstochastic)).

### Relationship of $c$ to Deterministic Rate Constants

Deterministic rate constants are derived with concentrations in mind whereas the rate constants in stochastic systems are related to the number of molecules. As a result, there isn't always a one to one correspondence between a deterministic and stochastic rate constant.  In some cases we must do unit conversions.

For a first-order reaction the deterministic rate, $v$, is given by:

$$ v = k X $$

where $X$ is the concentration of molecule X. In the following calculations we must recall that for a species with a given concentration, $X$, in a given volume, $V$, the number of molecules is represented as:

$$ x_a = X N_A V $$

where $x_a$ is the number of molecules and $N_A$ is Avogadro's number. With this in mind, the rate of reaction in molecules per unit time is given by:

$$ k X N_A V = k x_a $$

Since the stochastic rate is also in units of molecules per unit time, $c x$, this means:

$$ c x_a = k x_a \quad \therefore \quad c = k $$

In other words for a first-order reaction, the deterministic rate constant and the stochastic rate constant are identical.

For a second-order reaction a similar analysis yields a different result. Consider a second-order reaction involving two dissimilar molecules, X and Y. The deterministic rate is given by:

$$ v = k X Y $$

where X and Y are the concentration of species X and Y, respectively. The rate in terms of molecules per unit time is given by:

$$ k N_A X V Y = k x_a Y = k x_a \frac{y_a}{N_A V} $$

where $x_a$ and $y_a$ are the molecule numbers for species X and Y. Note that $y_a = Y N_A V$, that is $Y = y_a/(N_A V)$. From Table [Table: Number of combinations ($h$) for different elementary reactions](#tbl-numcombinationsstochastic) we know that the average rate of a stochastic process in molecules per unit time is $c x_a y_a $, therefore:

$$ c x_a y_a = k x_a \frac{y_a}{N_A V} $$

and thus:

$$ c = \frac{k}{N_A V} $$

We see that the stochastic rate constant is inversely related to the volume. This makes sense because the larger the volume, the less likely the molecules X and Y, will meet and react.

**Example**
<a id="exmp-stochasticrateconstant"></a>
What is the relationship between the deterministic and stochastic rate constant for the irreversible reaction:

$$ 2 X \rightarrow Y $$

The deterministic rate law is given by $v = k X^2$ where $X$ is the concentration of species X. The rate in terms of molecules per unit time is given by (Note that $x_a = X N_A V$, therefore, $X = x_a/(N_a V)$):

$$ k N_A X V X = k x_a X = k x_a^2/(N_A V) $$

From Table [Table: Number of combinations ($h$) for different elementary reactions](#tbl-numcombinationsstochastic) we see the stochastic rate is given by $c x_a (x_a - 1)/2$ so that

$$ k x_a^2/(N_A V) = c x_a (x_a - 1)/2 $$

Therefore:

$$ c = \frac{2 k x_a }{(x_a-1) N_A V} $$

For large $x_a$, the term $(x_a-1$) can be approximated by $x_a$ so that:

$$ c = \frac{2 k}{N_A V} $$

Note the number two in the numerator.

Example: A bimolecular reaction $2X \rightarrow$ has a deterministic rate constant of 0.1 M$^{-1}$ s$^{-1}$. What is the equivalent stochastic rate constant, $c$ if the reaction volume is $10^{-15}$ L (volume of *E. coli*)? Avogadro's number is $6.022 \times 10^{23}$, therefore the stochastic rate constant will be:

$$ c = \frac{2 \times k }{N_A V} = \frac{2 0.1}{6.022 \times 10^{23} \times 10^{-15}} = 3.32 \times 10^{-9}  molecules^{-1} s^{-1},$$

Although the previous definitions give us the probability of a reaction occurring in a $\delta t$ window, they do not tell us when a reaction is likely to occur. That is, if we start a clock at time zero, when is a reaction likely to take place? This question is addressed in the next two sections.

## Time to Reaction

Assume we have ten molecules than can undergo a decomposition reaction. How can we describe this system knowing that individual molecules will react at random times? If we start a clock at time, $t_o$ (Figure [Figure: Stochastic time line](#fig-stochastictimeline)), at what point in the future might one of the molecules react?

Consider a time line starting at time zero that extends into the future (Figure [Figure: Stochastic time line](#fig-stochastictimeline)). With this in mind, what is the chance of a reaction occurring in the interval time $t + \dt$ if we started monitoring the system at time zero?

To answer the question it is easier to first ask the opposite question. What is the probability that a reaction will *not* occur in both intervals, $0 \rightarrow t$ and $t$ to $t + \dt$? To answer, let us split the question into two parts. In order for there to be no reaction in the interval $0 \rightarrow t + \dt$, no reactions should occur in the two subintervals $0 \rightarrow t$ *and* $t \rightarrow t + \dt$.

**Figure** <a id="fig-stochastictimeline"></a> `fig:StochasticTimeLine`

*Graphic (not in the LaTeX source, referenced by name): `StochasticTimeLine`*

*Caption:* Stochastic time line.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 0.95]{StochasticTimeLine}
  \caption{Stochastic time line.} \label{fig:StochasticTimeLine}
\end{figure}
```

Let us designate the probability of no reaction in the first interval by $\overline{p}(0,t)$, and for the second interval, $\overline{p}(t,t+\dt)$. Since we assume independent events, the probability of no reaction in the entire interval, $0 \rightarrow t + \dt$ is the product:

$$ \overline{p} (0, t+\dt) = \overline{p}(0, t) \overline{p} (t, t + \dt) $$

To continue further we can expand the second term $\overline{p} (t, t + \dt)$ and assume that the reaction occurs at a propensity of $a$. Over a time interval $T$, the reaction will occur $a T$ times. If the interval is made shorter by dividing it up into $N$ subintervals, the chance of a reaction occurring in any one of these intervals is $a T/N$. If we make the time interval small enough, say $\dt$, then the probability of a reaction occurring in $\dt$ time will be $a \dt$. The probability of a reaction *not* occurring in this interval is therefore $1 - a \dt$. We can now write the probability equation as:

$$ \overline{p} (0, t+\dt) = \overline{p}(0, t) (1 - a \dt) $$

Rearranging gives:

$$ \overline{p} (0, t+\dt) - \overline{p}(0, t) = -\overline{p}(0, t) a \dt $$

Dividing both sides by $\delta t$, we obtain the differential equation:

$$ \frac{d\overline{p}(0,t)}{dt} = -\overline{p}(0, t) a $$

Now solve for $\overline{p} (0, t)$ by integrating the differential equation and using the observation that at time zero, no reaction has occurred so $\overline{p} (0) = 1$:

$$ \overline{p} (0, t) = e^{-a t} $$

Recall this is the probability of a reaction *not* occurring in the interval 0 to $t$. That is, if we let $t$ increase, $\overline{p} (0, t)$ tends to zero; that it the longer we wait, the more likely the reaction will occur. The probability of a reaction occurring at $t$, $p(t)$, is the probability of it *not* occurring in the interval 0 to $t$, times the probability that the reaction *will* occur in the interval $t$ to $\dt$:

$$ p(t) \dt  = \overline{p} (0, t) p (t, t + \dt) = \overline{p} (0, t) a \dt $$

That is:

$$
\begin{equation}
p(t)  = a e^{-a t}
\label{eqn:pt1}
\end{equation}
$$

This equation describes a **probability distribution function** (pdf) for $t$ (note that $p(t)$ is positive and the area under the curve is one). As with all pdfs, the area under the curve is the probability. For a given probability we could in principle sweep out the corresponding area, left to right, and locate the time on the $x$-axis where the sweep ends. It is simpler however to integrate the equation [Time to Reaction](#eqn-pt1) to generate the cumulative probability function, $P(t)$, which is the probability as a function of time. Integration of [Time to Reaction](#eqn-pt1) yields:

$$
\begin{equation}
P(t) = 1 - e^{-a t}
\label{eqn:pt2}
\end{equation}
$$

Equation [Time to Reaction](#eqn-pt2) can be rearranged so that $t$ is on the left-hand side:

$$
\begin{equation}
t = -\frac{1}{a} \ln (1 - P(t))
\label{eqn:pt3}
\end{equation}
$$

We can now assign a uniform random number to $P(t)$ and compute a possible time when the reaction will occur. If we did this repeatedly, the times would be distributed exponentially. Since the value of $P(t)$ is drawn from a uniform random number distribution, the distribution of numbers in $1-P(t)$ is no different from $P(t)$. Therefore we can simplify equation [Time to Reaction](#eqn-pt3) and rewrite it as:

$$ t = -\frac{1}{a} \ln (P(t)) $$

Using the log addition rule, remove the negative sign and rearrange the equation to:

$$ t = \frac{1}{a} \ln \left(\frac{1}{P(t)}\right) $$

or more simply, there $P(t)$ is replaced with $r$:

$$
\begin{equation}
  t = \frac{1}{a} \ln \left(\frac{1}{r}\right)
\label{eqn:GillespieTimeRigorous}
\end{equation}
$$

This is the equation that is often presented in the literature but for computational purposes, the former is more efficient as it avoids the division operation.

\stateHighlight{

$$
\begin{equation}
  t = -\frac{1}{a} \ln \left(r\right)
\label{eqn:GillespieTimeRigorousNoDivision}
\end{equation}
$$

}

In practice, to simulate a simple decomposition reaction, we would first generate a uniform random number, set it to $P(t)$, and compute the corresponding time, $t$. After this, we reduce the number of reactant molecules by one to signify a decomposition has occurred. We'd also increment our time line by $t$, then continue by computing another $t$ from the equation. The reaction rate (or propensity function), $a$, must be recomputed for each iteration. Note that the smaller the propensity $a$, the larger the $t$ computed from the equation. This makes sense because a lower reaction rate corresponds to fewer reactants and since there are fewer reactants, we will likely have to wait longer before another reaction occurs. Likewise, if there are many reactants, the reaction rate is likely to be higher and correspondingly, the time until the next reaction shorter. If there are large numbers of reactants, say in the thousands, this simulation method is quite slow because the time intervals at each iteration will be very small, requiring many steps for the simulation to evolve over time.

Equations [Time to Reaction](#eqn-gillespietimerigorous) and [Time to Reaction](#eqn-gillespietimerigorousnodivision) describe part of a well known algorithm called the Gillespie Stochastic Simulation Algorithm or the **Gillespie SSA** for short [Gill:1977, Gill:1976]. The method described here is also called the **Direct Method** because it calculates the time to the next simulation directly. Other implementations include the First Reaction Method [Gill:1977] and the more efficient Next Reaction Method [Gibson:2000], however these are beyond the scope of this chapter. An excellent article that describes all three approaches is provided by McCollum *et al.* [McCollum2006].

The full Gillespie SSA can also address systems with multiple reactions. The extension from one to multiple reactions is surprisingly simple and will be described briefly in the following section.

<!-- Raw data from grided simulations, for reference only -->
<!-- \begin{figure} -->
<!-- \begin{center} -->
<!-- \begin{tikzpicture} -->
<!-- \begin{axis}[ -->
<!-- xmin=0, -->
<!-- xmax=11, -->
<!-- ymin=0, -->
<!-- ymax=60, -->
<!-- width=7.5cm, -->
<!-- height=6cm, -->
<!-- xlabel=Time, -->
<!-- ylabel style={align=center}, ylabel={\small Number\\ of Molecules}] -->
<!-- \addplot[color=red,line width=1pt,const plot,mark=none] coordinates { -->
<!-- (0, 60) (1, 31) (2, 14) -->
<!-- (3, 4) (4, 3) (5, 1) -->
<!-- (6, 0) }; -->
<!-- \addplot[color=red,line width=1pt,const plot,mark=none] coordinates { -->
<!-- (0, 60) (1, 25) (2, 12) -->
<!-- (3, 3) (4, 0) }; -->
<!-- \addplot[color=red,line width=1pt,const plot,mark=none] coordinates { -->
<!-- (0, 60) (1, 29) (2, 15) -->
<!-- (3, 6) (4, 1) (5, 0) -->
<!-- (6, 0) (7, 0) }; -->
<!-- \addplot[color=red,line width=1pt,const plot,mark=none] coordinates { -->
<!-- (0, 60) (1, 27) (2, 11) -->
<!-- (3, 6) (4, 1) (5, 0) -->
<!-- (6, 0) }; -->
<!-- \addplot[color=red,line width=1pt,const plot,mark=none] coordinates { -->
<!-- (0, 60) (1, 23) (2, 9) -->
<!-- (3, 4) (4, 2) (5, 0) -->
<!-- }; -->
<!-- \addplot[color=red,line width=1pt,const plot,mark=none] coordinates { -->
<!-- (0, 60) (1, 27) (2, 15) -->
<!-- (3, 6) (4, 2) }; -->
<!-- \addplot[color=red,line width=1pt,const plot,mark=none] coordinates { -->
<!-- (0, 60) (1, 32) (2, 15) -->
<!-- (3, 10) (4, 6) (5, 1) -->
<!-- (6, 0) }; -->
<!-- \addplot[color=red,line width=1pt,const plot,mark=none] coordinates { -->
<!-- (0, 60) (1, 29) (2, 12) -->
<!-- (3, 9) (4, 7) (5, 2) -->
<!-- (6, 1) }; -->
<!-- \addplot[color=red,line width=1pt,const plot,mark=none] coordinates { -->
<!-- (0, 60) (1, 22) (2, 8) -->
<!-- (3, 3) (4, 0) (5, 0) -->
<!-- (6, 0) }; -->
<!-- \addplot[color=red,line width=1pt,const plot,mark=none] coordinates { -->
<!-- (0, 60) (1, 29) (2, 7) -->
<!-- (3, 3) (4, 2) (5, 1) -->
<!-- (6, 1) (7, 0) (8, 0) -->
<!-- (9, 0) }; -->
<!-- \end{axis} -->
<!-- \end{tikzpicture} -->
<!-- \end{center} -->
<!-- \caption{Multiple simulations of the same decomposition reaction, $X \rightarrow$ showing different trajectories. Stochastic rate constant = 0.3. Initial number of molecules = 60.} -->
<!-- \label{fig:StochasticTrajectories} -->
<!-- \end{figure} -->

## Running Stochastic Simulations

There are many variants on the Gillespie method, some are faster and some are approximate. The review by Pahle [pahle2009] covers many of these variants and is well worth consulting. There are a number of software tools that support stochastic simulation, examples include COPASI [Copasi2006], Dizzy [dizzy:2005] and libRoadRunner [SaurolibRoadRunner2015]. For Python users StochPy(footnote: <http://stochpy.sourceforge.net/>} is highly recommended and comprehensive, offering many facilities for stochastic simulation. Manninen et al. [Manninen:2006] reviews some of these software tools. In the deterministic world we have a multitude of easy to use software libraries (such as sundials and odepack), but libraries for stochastic solvers are virtually nonexistent. One possible option is StochKit(footnote: <http://engineering.ucsb.edu/ cse/StochKit/>}. Although quite comprehensive, using the StochKit library is not easy, certainly not as simple as the differential equation solvers. There is an interesting blog(footnote: <http://www.r-bloggers.com/vanilla-c-code-for-the-stochastic-simulation-algorithm/>} by Mario Pineda-Krch that describes his experience with using StochKit. Since this book was first written, the author has published a C based library that supports the Gillespie solver which is described in the bioxriv paper <https://www.biorxiv.org/content/10.1101/181446v1> and at the GitHib site <: https://github.com/sys-bio/libStochastic>.

Given the theory presented in the last section, we summarize the basic Gillespie algorithm as:

1. Initialize $t = t_o, x = x_o$, $c$, and end of simulation time, $t_{*max*}$

2. Compute $h$ depending on the nature of the reaction (Table [Table: Number of combinations ($h$) for different elementary reactions](#tbl-numcombinationsstochastic))

3. Evaluate propensity function, $a = h c$

4. Draw one uniform random number, $r_1$

5. Determine the time, $\tau$ when the next reaction will take place using:

$$ \tau = -\frac{1}{a} \ln \left( r_1 \right) $$

6. Determine the new state: $t = t + \tau$ and $x = x - 1$

7. Reached end of simulation, $t > t_{*max*}$?

8. No, got to step 2

9. Yes, finished

Extending the Gillespie SSA to systems with multiple reactions is straightforward. In addition to computing when a reaction will fire, the full Gillespie SSA also considers *which* reaction will fire. If we have a system of $v$ reactions and wish to determine which reaction will fire, first sum up the propensity functions, $h_{v_i} c_{v_i}$:

$$ R = \sum_{i=1}^v h_{v_i} c_{v_i} $$

Now normalize each propensity function by dividing by $R$:

$$ n_i = h_i c_i /R $$

Intuitively the method arranges the normalized propensities in the form of a pie chart, where the size of an individual pie wedge, $n_i$, is equal to the size of the normalized propensity. Now imagine throwing a dart at the pie chart. Whatever pie wedge the dart lands on is the reaction to be fired in the next iteration. This means larger pie wedges are more likely to be selected than thinner ones, or in other words, reactions with larger propensities are more likely to fire than those with smaller propensities. A possible algorithm for implementing this scheme is shown below (written in a pseudo code). The code works its way through each pie wedge. The function `uniformRandomNumber()` returns a uniform random number between zero and one. In this code the reactions are numbered from one, but it could easily be modified to index reactions from zero if deemed more convenient.

```python
r = uniformRandomNumber()
Reactions index from 1 to numberOfReactions
Propensities index from 1 to numberOfReactions

if r <= n(1) then
   Reaction[1] fires
else
   begin
   for i = 2 to numberOfReactions do
       if (r > n[i-1]) and (r <= n[i]) then
          begin
          Reaction[i] fires
          exit
          end
   end
```

Although the above algorithm is relatively easy to understand, it is not very efficient. A more efficient alternative is given below. This version doesn't normalize the propensities but instead scales the random number to the sum, $R$, of the propensities, then walks through the propensity list until the scaled random number exceeds the accumulating propensity value. This method avoids normalizing every propensity value and instead only involves simple additions. This code could be easily implemented in a language such as Python.

<!-- \begin{figure}[htb] -->

```python
  accumulate = 0
  i = 0
  scaledRandomNumber = uniformRandomNumber()*R
  while accumulate < scaledRandomNumber do
        begin
        i = i + 1
        accumulate = accumulate + n[i]
        end;
  Fire the ith reaction
```

<!-- \end{figure} -->

## Events at Regular Intervals

Equation [Time to Reaction](#eqn-gillespietimerigorousnodivision) describes how time intervals for reaction events are computed. The intervals are irregular due to the selection of a uniform random number each time a time interval is computed. Generating data on an irregular grid can however be inconvenient. It is possible to modify the algorithm so than the time axis increases in a more regular fashion. Figure [Figure: Technique for generating stochastic events on a regular grid](#fig-gridexample) illustrates how stochastic events at irregular intervals can be arranged to lie on a regular time grid. The method works by moving simulated events nearest a vertical grid line to the grid line itself. Other reaction events are ignored. Reaction events nearest a grid line can be moved to the grid line because we know with certainty that there are no events between the nearest event and the grid line, hence at the grid line, the number of molecules will correspond to the nearest event in the past.  This way an irregular set of events can be realigned onto a regular grid.

**Figure** <a id="fig-gridexample"></a> `fig:gridExample`

*Graphic (not in the LaTeX source, referenced by name): `gridExample`*

*Caption:* Technique for generating stochastic events on a regular grid. Simulated points nearest a grid line (light markers) are moved (arrow) to the nearest grid line in the future. Other data points (dark markers) are ignored. Such a technique is useful when averaging a large number of trajectories. The average number of molecules can be calculated at each grid point.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 0.9]{gridExample}
  \caption{Technique for generating stochastic events on a regular grid. Simulated points nearest a grid line (light markers) are moved (arrow) to the nearest grid line in the future. Other data points (dark markers) are ignored. Such a technique is useful when averaging a large number of trajectories. The average number of molecules can be calculated at each grid point.} \label{fig:gridExample}
\end{figure}
```

An example will make this more clear. The rows of data (Table [Table: Data from a Gillespie SSA run](#tbl-rawgillespiedata)) correspond to data generated from the Gillespie SSA Algorithm starting with 20 molecules. Note that the time intervals are irregular as expected from the Gillespie SSA.

**Table** <a id="tbl-rawgillespiedata"></a> `tbl:RawGillespieData`

*Caption:* Data from a Gillespie SSA run.

```latex
\begin{table}[htb]
\begin{center}
\begin{tabular}{llllllll} \toprule\toprule
Time      & 0    & 0.052 & 0.1   & 0.16 & 0.21 & 0.24  & 0.31    \\
Molecules & 20   & 19    & 18    & 17   & 16   & 15    & 14      \\ \midrule
Time      & 0.41 & 0.5   & 0.52  & 0.56 & 0.81 & 1.2   & 1.47    \\
Molecules & 13   & 12    & 11    & 10   & 9    & 8     & 7       \\ \midrule
Time      & 1.58 & 1.59  & 1.71  & 2.22 & 2.75 & 3.42  & 4.84    \\
Molecules & 6    & 5     & 4     & 3    & 2    & 1     & 0 \\ \bottomrule
\end{tabular}
\end{center}
\caption{Data from a Gillespie SSA run.}
\label{tbl:RawGillespieData}
\end{table}
```

A regular grid is set to an interval of 0.5 and the raw data shown in Table [Table: Data from a Gillespie SSA run](#tbl-rawgillespiedata) is grided. For example at grid point 1.0, the event closest to this grid point in the past is the reaction event that occurred at time 0.81, corresponding to 9 molecules. We therefore assert that at time 1.0, there were 9 molecules remaining.  This method is applied to each grid point, with the results summarized in Table [Table: Result of gridding data from Table \ref{tbl:RawGillespieData}](#tbl-grideddata).

**Table** <a id="tbl-grideddata"></a> `tbl:GridedData`

*Caption:* Result of gridding data from Table [Table: Data from a Gillespie SSA run](#tbl-rawgillespiedata).

```latex
\begin{table}[htb]
\begin{center}
\begin{tabular}{llllllllll} \toprule
Time      & 0    &  0.5 &  1.0  & 1.5  & 2.0 & 2.5  & 3.0 & 4.0 & 5.0  \\
Molecules & 20   &  12  &  9    & 7    & 4   & 3    & 2 & 1 & 0  \\ \bottomrule
\end{tabular}
\end{center}
\caption{Result of gridding data from Table~\ref{tbl:RawGillespieData}.}
\label{tbl:GridedData}
\end{table}
```

## Stochastic Trajectories

One crucial point regarding the Gillespie SSA method is that a trajectory produced from one simulation represents only one of many possible trajectories. If we were to run the same simulation a second time, we would observe a slightly different but related trajectory. This is the nature of stochastic processes.  Figure [Figure: Multiple simulations of the same decomposition reaction, $X \rightarro](#fig-stochastictrajectories) shows ten repeated simulations of exactly the same system, with the same initial conditions and stochastic rate constant. As one can see from the graph, each trajectory is slightly different. It is possible to combine these trajectories into a single averaged trajectory. To do this easily we arrange the output from the simulation onto a regular grid.

**Figure** <a id="fig-stochastictrajectories"></a> `fig:StochasticTrajectories`

*Caption:* Multiple simulations of the same irreversible decomposition reaction, $X \rightarrow Y$ showing different trajectories. The stochastic rate constant is 0.3 ms$^{-1}$. The initial number of molecules was set to 60.

```latex
\begin{figure}
\centering
\begin{tikzpicture}
\begin{axis}[
xmin=0,
xmax=11,
ymin=0,
ymax=60,
width=8.6cm,
height=6cm,
xlabel=Time (ms),
ylabel style={align=center}, ylabel={Number\\ of Molecules Remaining}]
\addplot[color=red,line width=1pt,const plot,mark=none] coordinates {
(0, 60) (0.0188117448984858, 59) (0.0245180726055848, 58)
(0.0727386346527186, 57) (0.159777291822808, 56) (0.179847212352843, 55)
(0.216153255163512, 54) (0.231199672003251, 53) (0.25379628371416, 52)
(0.322519566281268, 51) (0.3322085744219, 50) (0.379700615077982, 49)
(0.411035639881091, 48) (0.421960670146594, 47) (0.431038662289339, 46)
(0.45213794886688, 45) (0.462238681125048, 44) (0.471981949417139, 43)
(0.482149393627278, 42) (0.516783174782492, 41) (0.520689444407865, 40)
(0.576898786405207, 39) (0.632716399081602, 38) (0.733987721086146, 37)
(0.808646306747799, 36) (0.809355803391089, 35) (0.81117452246485, 34)
(0.831888878021857, 33) (0.928221209377981, 32) (1.00922092391335, 31)
(1.03839345501611, 30) (1.09740811624316, 29) (1.09993754596791, 28)
(1.32739552777576, 27) (1.34087557672236, 26) (1.38516397628689, 25)
(1.47012557776494, 24) (1.54799074388115, 23) (1.55163131777587, 22)
(1.57742464516691, 21) (1.6848964771444, 20) (1.74236654220275, 19)
(1.81699274961633, 18) (1.83977734919615, 17) (1.85214737138873, 16)
(1.91869518440793, 15) (2.00095841535502, 14) (2.02599217091135, 13)
(2.18081936515048, 12) (2.23626481112692, 11) (2.29009894344532, 10)
(2.39689313065575, 9) (2.57266595394613, 8) (2.62161269337294, 7)
(2.63924015679285, 6) (2.80756224539814, 5) (3.09564940651728, 4)
(4.16075549268774, 3) (4.43560356399604, 2) (5.32581885194198, 1)
(6.80806914266931, 0) };
\addplot[color=red,line width=1pt,const plot,mark=none] coordinates {
(0, 60) (0.0452615280268419, 59) (0.0921023786221629, 58)
(0.104019422015291, 57) (0.166281957029031, 56) (0.199781792037562, 55)
(0.230490011945234, 54) (0.249370624554335, 53) (0.284678780153085, 52)
(0.286630373513388, 51) (0.296809984211385, 50) (0.303980268566421, 49)
(0.306392008085207, 48) (0.345899773600108, 47) (0.366177867424322, 46)
(0.404909634540534, 45) (0.432776752234386, 44) (0.458762935569881, 43)
(0.540486678004776, 42) (0.553251536133185, 41) (0.618984447054253, 40)
(0.62232485029533, 39) (0.738628888425392, 38) (0.78022959612195, 37)
(0.78701651073331, 36) (0.814826673338285, 35) (0.815715360790339, 34)
(0.823123747024407, 33) (0.824755973950817, 32) (0.883938966986158, 31)
(0.912152206967765, 30) (0.9306589905576, 29) (0.971411350949523, 28)
(0.991321326914259, 27) (0.997496000399426, 26) (1.01027751374056, 25)
(1.01216526760616, 24) (1.04088328874233, 23) (1.11067399705753, 22)
(1.17521181230323, 21) (1.26240781111321, 20) (1.27870422921045, 19)
(1.34484076566367, 18) (1.53385326597732, 17) (1.59092690350049, 16)
(1.6815044959743, 15) (1.84307633984255, 14) (1.85979629220262, 13)
(2.08271141250728, 12) (2.14489537954672, 11) (2.24808290257668, 10)
(2.49334410868236, 9) (2.51567043609059, 8) (2.56202847084998, 7)
(2.86484201211922, 6) (2.87961792757355, 5) (2.9089085080165, 4)
(3.02004907809924, 3) (3.12545795631661, 2) (3.7518830896747, 1)
(4.46874380502551, 0) };
\addplot[color=red,line width=1pt,const plot,mark=none] coordinates {
(0, 60) (0.0591284563094192, 59) (0.115335215391051, 58)
(0.1636204620151, 57) (0.17188001667559, 56) (0.175983840235017, 55)
(0.1767590455753, 54) (0.203695619802726, 53) (0.206292185854038, 52)
(0.229447663585284, 51) (0.232965910247219, 50) (0.272034791213675, 49)
(0.277725616759728, 48) (0.35170407670256, 47) (0.392174220283722, 46)
(0.473276364608419, 45) (0.490950120164725, 44) (0.494455652649072, 43)
(0.526135822509522, 42) (0.535116355342501, 41) (0.553452105691345, 40)
(0.649365338382302, 39) (0.65635054999977, 38) (0.680755797432474, 37)
(0.696959860743865, 36) (0.777532403675534, 35) (0.793462654436764, 34)
(0.836080799538591, 33) (0.901470164329345, 32) (0.90229268490342, 31)
(0.919764758740315, 30) (1.05525843765741, 29) (1.17728028754283, 28)
(1.18536041022097, 27) (1.20318965347597, 26) (1.20502693039177, 25)
(1.21627703398117, 24) (1.31384738713649, 23) (1.35159338942808, 22)
(1.36910136794227, 21) (1.52804718568875, 20) (1.61300834461873, 19)
(1.71824396342201, 18) (1.7958979481554, 17) (1.84471140853507, 16)
(2.00977355064618, 15) (2.16119013261239, 14) (2.16348527399652, 13)
(2.16836879616815, 12) (2.252148087293, 11) (2.62258813667744, 10)
(2.68270526310524, 9) (2.69366035438634, 8) (2.93284715637827, 7)
(3.10636323507395, 6) (3.26983079054084, 5) (3.40983513587399, 4)
(3.50166649803474, 3) (3.68460094017117, 2) (4.14837737407753, 1)
(7.80118402190434, 0) };
\addplot[color=red,line width=1pt,const plot,mark=none] coordinates {
(0, 60) (0.0135606790533637, 59) (0.0413672404087755, 58)
(0.046876835848062, 57) (0.0476290084427618, 56) (0.0910958649184078, 55)
(0.112229209843453, 54) (0.17217364789584, 53) (0.239975354407617, 52)
(0.324005322200966, 51) (0.350770826540633, 50) (0.405843133527814, 49)
(0.421159944034635, 48) (0.491437091362783, 47) (0.545855798245052, 46)
(0.564563970646305, 45) (0.569564815789954, 44) (0.624117040322244, 43)
(0.640106956065732, 42) (0.666612659268505, 41) (0.676144523987935, 40)
(0.724012479742419, 39) (0.724486895195143, 38) (0.730920726745135, 37)
(0.741243245665188, 36) (0.772972858004305, 35) (0.779963098409152, 34)
(0.788467135540463, 33) (0.794582578415576, 32) (0.817295890446079, 31)
(0.881500963903689, 30) (0.888650543293703, 29) (0.913058799497101, 28)
(1.04860670350321, 27) (1.09402479074077, 26) (1.15845115016082, 25)
(1.31963372221258, 24) (1.3609464179395, 23) (1.41971230098445, 22)
(1.4583528061205, 21) (1.45975577973676, 20) (1.47378623387726, 19)
(1.53491765110351, 18) (1.54127155522459, 17) (1.56076815069962, 16)
(1.67381750280206, 15) (1.69959902222883, 14) (1.83187675295548, 13)
(1.95571375414149, 12) (2.23058519360736, 11) (2.53928759659952, 10)
(2.5527516138479, 9) (2.7311656977106, 8) (2.8699579480376, 7)
(3.30968751238936, 6) (3.35117372916869, 5) (3.55779312521157, 4)
(3.63416383041682, 3) (3.94095149184036, 2) (4.82809739170212, 1)
(6.28403691804028, 0) };
\addplot[color=red,line width=1pt,const plot,mark=none] coordinates {
(0, 60) (0.0246618488417474, 59) (0.0320165802048381, 58)
(0.0804712330194544, 57) (0.111426230238345, 56) (0.111701407404671, 55)
(0.119751656758049, 54) (0.135361099183711, 53) (0.154160119833291, 52)
(0.179305324750239, 51) (0.186608236584781, 50) (0.212003626027514, 49)
(0.215722155804142, 48) (0.219344695589053, 47) (0.22047813807819, 46)
(0.293987216577883, 45) (0.313897776906291, 44) (0.415018672560798, 43)
(0.466948775203147, 42) (0.496141208598196, 41) (0.515458579352217, 40)
(0.520958631780925, 39) (0.524985504889284, 38) (0.538882184597021, 37)
(0.562012188248127, 36) (0.579766723465931, 35) (0.629854793400144, 34)
(0.643234794797126, 33) (0.685638568627693, 32) (0.687880529829134, 31)
(0.725094418705181, 30) (0.72768854150317, 29) (0.795655546375159, 28)
(0.807356924086601, 27) (0.859810702556863, 26) (0.863435497737137, 25)
(0.873529439078421, 24) (1.00310052245392, 23) (1.1402518385442, 22)
(1.18570439207224, 21) (1.2132307366182, 20) (1.30246479103374, 19)
(1.38291909463304, 18) (1.4645280141457, 17) (1.47203623925727, 16)
(1.48712769317255, 15) (1.65375350113518, 14) (1.72290011845913, 13)
(1.73487827922995, 12) (1.82366545548732, 11) (1.93361733432953, 10)
(2.03727333192674, 9) (2.13974937876418, 8) (2.15200084353638, 7)
(2.89591553084605, 6) (2.94881873272899, 5) (3.10433262587749, 4)
(3.13061895140014, 3) (4.4541784919788, 2) (4.92134309877592, 1)
(5.81236780520251, 0) };
\addplot[color=red,line width=1pt,const plot,mark=none] coordinates {
(0, 60) (0.00131327672042677, 59) (0.00859345653419853, 58)
(0.0170695019880615, 57) (0.0200880396231137, 56) (0.0218313038428538, 55)
(0.111707695069252, 54) (0.120893822438359, 53) (0.136645392868541, 52)
(0.14539788016104, 51) (0.197701860275376, 50) (0.2010556990712, 49)
(0.207014668007689, 48) (0.228327675187641, 47) (0.239053989373001, 46)
(0.293309058305386, 45) (0.312192962352889, 44) (0.370142899556035, 43)
(0.370662320390594, 42) (0.378978038043317, 41) (0.424569937858919, 40)
(0.454319606824023, 39) (0.472682762041494, 38) (0.498629411968746, 37)
(0.528204786772231, 36) (0.655885944772014, 35) (0.662854780833711, 34)
(0.736923309392629, 33) (0.753181230002263, 32) (0.783124198057621, 31)
(0.809819052261161, 30) (0.83946093739078, 29) (0.850093222336793, 28)
(1.01227349106984, 27) (1.04490716261116, 26) (1.1325888644733, 25)
(1.47024817452824, 24) (1.48226442282142, 23) (1.53273627531781, 22)
(1.5356679520712, 21) (1.61473755734582, 20) (1.71680237550422, 19)
(1.86227922950717, 18) (1.88082371119794, 17) (1.90108366420772, 16)
(2.03378234997095, 15) (2.30548426577484, 14) (2.31746991677463, 13)
(2.4123490465111, 12) (2.53990188727707, 11) (2.63298092816622, 10)
(2.72212191973723, 9) (2.86249266343095, 8) (2.94151837311176, 7)
(3.36191032849518, 6) (3.43864779350348, 5) (3.85459075539074, 4)
(3.97896289326842, 3) (4.1610837625584, 2) (4.42738215021176, 1)
(4.84851877884796, 0) };
\addplot[color=red,line width=1pt,const plot,mark=none] coordinates {
(0, 60) (0.0335652092298373, 59) (0.0391832641648069, 58)
(0.0657214612450341, 57) (0.0806281487893197, 56) (0.170334415449671, 55)
(0.171928305713017, 54) (0.180558521951689, 53) (0.197420426391686, 52)
(0.246082414849436, 51) (0.269522550668438, 50) (0.269763439966821, 49)
(0.283804294304354, 48) (0.401040328026134, 47) (0.443809507126596, 46)
(0.479489015283991, 45) (0.548848521659065, 44) (0.584487425723808, 43)
(0.686917021233399, 42) (0.773934117494229, 41) (0.796951162108574, 40)
(0.801971396152559, 39) (0.854105884941829, 38) (0.86671151873624, 37)
(0.869294259901555, 36) (0.914530959154939, 35) (0.94405732569295, 34)
(0.975879504811574, 33) (1.00232086932568, 32) (1.0205703731348, 31)
(1.05725555659946, 30) (1.10865198093272, 29) (1.1326256268703, 28)
(1.26154022888488, 27) (1.27206330692051, 26) (1.31001512589445, 25)
(1.34607586643772, 24) (1.35852472088901, 23) (1.42012637857074, 22)
(1.47331928149581, 21) (1.50773570776108, 20) (1.5395937149414, 19)
(1.55694863540117, 18) (1.6446588783845, 17) (1.6989580255001, 16)
(2.14761357762304, 15) (2.20860783171247, 14) (2.6491456179814, 13)
(2.82107363149855, 12) (2.91953336167927, 11) (3.15196213989746, 10)
(3.36145840328354, 9) (3.70475577996704, 8) (3.83869231385269, 7)
(4.04172931149689, 6) (4.11946772008824, 5) (4.46427753195804, 4)
(4.80674808741634, 3) (4.87262451531, 2) (5.48283489223178, 1)
(6.34569154071677, 0) };
\addplot[color=red,line width=1pt,const plot,mark=none] coordinates {
(0, 60) (0.162838554212882, 59) (0.204292860822519, 58)
(0.207976356119511, 57) (0.251854894347691, 56) (0.297533127799905, 55)
(0.304280413458136, 54) (0.311548803517132, 53) (0.35137708841888, 52)
(0.378971333887762, 51) (0.405449858500345, 50) (0.41255903744667, 49)
(0.467040873132001, 48) (0.476614669592375, 47) (0.476676069909972, 46)
(0.484600066678704, 45) (0.49701521898872, 44) (0.505517239847472, 43)
(0.523242699851724, 42) (0.569786515694755, 41) (0.602996270465872, 40)
(0.615985339332319, 39) (0.621911879914682, 38) (0.670393420676085, 37)
(0.704856693480362, 36) (0.729906028746565, 35) (0.786445806699553, 34)
(0.804919175618344, 33) (0.820687175689794, 32) (0.840965437588007, 31)
(0.928461298352316, 30) (1.00724363000989, 29) (1.05824177089021, 28)
(1.09381869575173, 27) (1.10111763108838, 26) (1.23894214947348, 25)
(1.30734414371685, 24) (1.30742398726235, 23) (1.40672646834002, 22)
(1.44202363226317, 21) (1.48126662535172, 20) (1.51087633655026, 19)
(1.7313445127773, 18) (1.83082993603712, 17) (1.90548137490232, 16)
(1.93439562563897, 15) (1.94660262831478, 14) (1.99480345061851, 13)
(2.0666483829991, 12) (2.21734728350258, 11) (2.29779678737715, 10)
(3.4669187686502, 9) (3.55120183750559, 8) (4.24251511114096, 7)
(4.28831191333294, 6) (4.65675707979093, 5) (4.68460344257054, 4)
(4.84311585445528, 3) (5.75581736175424, 2) (6.73834299864196, 1)
(6.87360749588712, 0) };
\addplot[color=red,line width=1pt,const plot,mark=none] coordinates {
(0, 60) (0.0248539398270875, 59) (0.0295858580858744, 58)
(0.0542033877233677, 57) (0.060933890065164, 56) (0.0620641817160671, 55)
(0.09258186866012, 54) (0.103266618536249, 53) (0.104441506038719, 52)
(0.137652175060984, 51) (0.142305038629244, 50) (0.149934147576117, 49)
(0.150656421197448, 48) (0.172363507956663, 47) (0.183059701962196, 46)
(0.222654752345729, 45) (0.251001371344772, 44) (0.268429813801246, 43)
(0.28384048414512, 42) (0.311500674120377, 41) (0.320101221445879, 40)
(0.360444513376157, 39) (0.369434787955502, 38) (0.382433319146025, 37)
(0.389519208850451, 36) (0.429306740890262, 35) (0.484435358935297, 34)
(0.489917688182151, 33) (0.53795039757439, 32) (0.595326023383667, 31)
(0.607305776119945, 30) (0.659088727296043, 29) (0.66721672146034, 28)
(0.744056815781587, 27) (0.749984736895002, 26) (0.751257913055871, 25)
(0.922624723022939, 24) (0.955015955643902, 23) (1.07016552655952, 22)
(1.11163698054361, 21) (1.11906652301853, 20) (1.12419239774284, 19)
(1.14487608206933, 18) (1.20242309985971, 17) (1.23701662257431, 16)
(1.39211661565866, 15) (1.42080187279481, 14) (1.45973706484858, 13)
(1.52239470970903, 12) (1.72798296638169, 11) (1.73395095936768, 10)
(1.76045992427256, 9) (2.02638095855833, 8) (2.09776401829571, 7)
(2.14699053721352, 6) (2.41014887726905, 5) (2.51448097782465, 4)
(3.04182661330531, 3) (3.1185484172193, 2) (3.72843558746482, 1)
(6.21417297515828, 0) };
\addplot[color=red,line width=1pt,const plot,mark=none] coordinates {
(0, 60) (0.0828577433367521, 59) (0.0924614065420976, 58)
(0.130394221605373, 57) (0.135297164422345, 56) (0.17708449786312, 55)
(0.218153285268845, 54) (0.23342933894393, 53) (0.29633521752011, 52)
(0.319336549100174, 51) (0.326249144374638, 50) (0.330925155795256, 49)
(0.403483654176385, 48) (0.408834124291856, 47) (0.420088260441242, 46)
(0.472406401093291, 45) (0.483914718068969, 44) (0.487074374945158, 43)
(0.510111849288063, 42) (0.531828961387117, 41) (0.540078819411515, 40)
(0.561795538785325, 39) (0.580464613218137, 38) (0.60352868294265, 37)
(0.607070723377613, 36) (0.854829840133412, 35) (0.860824201624182, 34)
(0.880749286013309, 33) (0.942921995535858, 32) (0.970811137187863, 31)
(0.982298869555038, 30) (1.04304601042173, 29) (1.07085809670561, 28)
(1.08135806384777, 27) (1.08983563678508, 26) (1.13974434289619, 25)
(1.15526873912408, 24) (1.22395744646766, 23) (1.26891777013773, 22)
(1.2822486645033, 21) (1.29008061438497, 20) (1.29215964267732, 19)
(1.31432602294751, 18) (1.34395272976656, 17) (1.4030702195955, 16)
(1.44364240422512, 15) (1.46357385502435, 14) (1.65341147419823, 13)
(1.66679911358576, 12) (1.67599577690332, 11) (1.69889343944477, 10)
(1.86825375591183, 9) (1.99646935913345, 8) (2.5557512014161, 7)
(2.66701214853222, 6) (2.6975207360085, 5) (2.81498997264997, 4)
(3.03182008081474, 3) (4.30003939136088, 2) (6.60318807730442, 1)
(9.58086940582592, 0) };
%
\end{axis}
\end{tikzpicture}
\caption{Multiple simulations of the same irreversible decomposition reaction, $X \rightarrow Y$ showing different trajectories. The stochastic rate constant is 0.3 ms$^{-1}$. The initial number of molecules was set to 60.}
\label{fig:StochasticTrajectories}
\end{figure}
```

Once on a grid, it is now easy to compute the average and variance of a series of repeated simulations. As an example, the trajectories shown in Figure [Figure: Multiple simulations of the same decomposition reaction, $X \rightarro](#fig-stochastictrajectories) are redrawn in Figure [Figure: Mean of 10 trajectories together with the standard deviation indicated](#fig-stochastictrajectoriesgridmean) using a grid interval of 1.0.

**Figure**

*Caption:* Griding code: Modified from Wilkinson, Stochastic Modeling for Systems Biology, Figure 6.10, ISBN: 978-1584885405. The code accepts a matrix, $m$ from a Gillespie SSA run, where the first column is time and the second column the number of molecules. Indexing of matrices is from 1.

```latex
\begin{figure}[htbp]
\hrule width \textwidth height 0.5pt
\vspace{8pt}
\begin{Verbatim}[fontsize=\small]
start = 0; dt = 1;
// Retrieve number of rows in input matrix
events = rows (m);
endTime = m[events,1];
// Compute length of the output matrix, out
len = trunc(endTime - start)/dt + 1;
out = matrix (len, 2);
gridTime = 0;
j = 1;

for i = 2 to events do
    begin
    while m[i,1] >= gridTime do
          begin
          out[j,1] = gridTime;
          out[j,2] = m[i-1,2]
          j = j + 1;
          gridTime = gridTime + dt;
          end;
    end;
\end{Verbatim}
\vspace{-8pt}
\hrule width \textwidth height 0.5pt
\vspace{8pt}
\caption{Griding code: Modified from Wilkinson\index{Darren Wilkinson},\index{Wilkinson} Stochastic Modeling for Systems Biology, Figure 6.10, ISBN: 978-1584885405. The code accepts a matrix, $m$ from a Gillespie SSA run, where the first column is time and the second column the number of molecules. Indexing of matrices is from 1.}
\end{figure}
```

**Figure** <a id="fig-stochastictrajectoriesgridmean"></a> `fig:StochasticTrajectoriesGridMean`

*Caption:* Mean of 10 trajectories together with the standard deviation indicated around each time point. Computed using a grid size of 1.0.

```latex
\begin{figure}[htbp]
\centering
\begin{tikzpicture}
\begin{axis}[
xmin=0,
xmax=11,
ymin=0,
ymax=60,
width=9cm,
height=7cm,
xlabel=Time (ms),
label=Time,ylabel style={align=center}, ylabel={Number\\ of Molecules}]
\addplot[mark=*,mark size=0.75pt,color=red,line width=1.5pt] plot[error bars/.cd,y dir=both,y explicit,
          error bar style={line width=1.2pt},
          error mark options={
            rotate=90,
            red,
            mark size=3pt,
            line width=0.8pt}
    ]
coordinates {
(0, 60)   +- (0,0)
(1, 27.4) +- (13, 13.27)
(2, 11.8) +- (0, 3.01)
(3, 5.4)  +- (0, 2.5)
(4, 2.4)  +- (0, 2.37)
(5, 0.4)  +- (0, 0.7)
(6, 0.2)  +- (0, 0.42)
(7, 0) +- (0,0)
(8, 0) +- (0,0)
(9, 0) +- (0,0) };
\end{axis}
\end{tikzpicture}
\caption{Mean of 10 trajectories together with the standard deviation indicated around each time point. Computed using a grid size of 1.0.}
\label{fig:StochasticTrajectoriesGridMean}
\end{figure}
```

<!-- Because each stochastic trajectory is unique, a common approach is to compute the mean and variance of a set of stochastic trajectories, often called an {\bf ensemble}\index{ensemble}. How to compute the mean trajectory and the variance may not be immediately obvious because the distribution of points along the time line vary in each trajectory. The way to solve this is to generate the simulated points on a regular grid and then to compute the mean and variance on the grid points. -->

<!-- \begin{figure} -->
<!-- \begin{center} -->
<!-- \begin{tikzpicture} -->
<!-- \begin{axis}[ -->
<!-- xmin=0, -->
<!-- xmax=11, -->
<!-- ymin=0, -->
<!-- ymax=60, -->
<!-- width=7.5cm, -->
<!-- height=6cm, -->
<!-- xlabel=Time, -->
<!-- ylabel style={align=center}, ylabel={\small Number\\ of Molecules}] -->
<!-- \addplot[color=red,line width=1pt,mark=none] coordinates { -->
<!-- (0,      60) (0.25,     55) (0.5,     49) (1.0,    46) (1.25,     44) (1.5,    41) -->
<!-- (1.75,   39) (2,        34) (2.5,     32) (2.5,    30) (2.75,     28) (3,      27) (3.25, 26) -->
<!-- (3.5,    24) (3.75,     22) (4,       22) (4.25,   19) (4.5,      18) (4.75,   17) (5,    14) -->
<!-- (5.25,   10) (5.5,      10) (5.75,    8)  (6,      8)  (6.25,     7)  (6.5,    6)  (6.75, 6) -->
<!-- (7,      5)  (7.25,     5)  (7.5,     4)  (7.75,   4)  (8,        4)  (8.25,   4)  (8.5,  4) -->
<!-- (8.75,   4)  (9,        4)  (9.25,    4)  (9.5,    3)  (9.75,     2)  (10,     1)}; -->
<!-- \addplot[color=red,line width=1pt,mark=none] coordinates { -->
<!-- (0,        60) (0.25,        56) (0.5,        52)  (0.75,        48)  (1.0,        47) -->
<!-- ((1.25,        43)  (1.5,        37)  (1.75,        35) (2.0,        33)  (2.25,        30) -->
<!-- (2.5,        27)  (2.75,        25) (3.0,        25) (3.25,        24) -->
<!-- (3.5,        21) (3.75,        19)  (4.0,        16) (4.25,        14)  (4.5,        13) -->
<!-- (4.75,        11) (5.0,        10) (6.25,         9)  (6.5,         9) -->
<!-- (6.75,         8)  (7.0,         7)  (7.25,         7)  (7.5,         7)  (7.75,         6) -->
<!-- (8.0, 6) (8.25,         5) (8.5,         5) (8.75,         5) (9.0,         5) -->
<!-- (9.25, 5) (9.5,         4)  (9.75, 4) (10.0, 4)}; -->
<!-- \end{axis} -->
<!-- \end{tikzpicture} -->
<!-- \end{center} -->
<!-- \caption{Multiple simulations of the same decomposition reaction, $X \rightarrow$ showing different trajectories. Stochastic rate constant = 0.3. Initial number of molecules is 60.} -->
<!-- \label{fig:StochasticTrajectoriesPlusMean} -->
<!-- \end{figure} -->

```python
import tellurium as te

r = te.loada ('''
       $Xo -> S1; k1*Xo;
       S1 -> S2; k2*S1;
       S2 -> $X1; k3*S2;

       Xo = 50; S1 = 0; S2 = 0;
       k1 = 0.2; k2 = 0.4; k3 = 2;
''')

result = r.gillespie (0, 30)
r.plot()
```

Listing `tellurium:chap:StochasticJarnacA` shows a Tellurium script that generated the plots shown in Figure [Figure: Stochastic simulation using Tellurium](#fig-stochasticsima). The key line in the script is:

`m = r.gillespie (0, 30)`

This takes two arguments. The first and second arguments set the time start and time end for the simulation. There is an optional third argument which can be used to set a fixed time step (output is then on a grid) and an optional forth argument which sets the columns in the matrix that will be returned. Note that species amounts have been set to integer values because we are now dealing with discrete molecules.

**Figure** <a id="fig-stochasticsima"></a> `fig:stochasticSimA`

*Graphic (not in the LaTeX source, referenced by name): `stochasticSimA`*

*Caption:* Stochastic simulation using Tellurium. Upper curve S$_1$, lower curve S$_2$

```latex
\begin{figure}[htbp]
\centering
    \includegraphics[scale = 0.45]{stochasticSimA}
\caption{Stochastic simulation using Tellurium. Upper curve S$_1$, lower curve S$_2$} \label{fig:stochasticSimA}
\end{figure}
```

As with continuous simulations, it is possible to carry out a number of separate runs where other events are imposed in between the runs. For example, we might want to decrease one of the rate constants by a factor of six at a certain time point in the simulation and then carry the simulation on as before. Listing `tellurium:chap:StochasticJarnacB` shows one simulation being carried out from 0 to time 30. At time 30 one of the rate constants is decreased six fold, then the simulation is started up again, but this time setting the time start to the end time of the previous simulation. Finally, both matrices from the two runs are merged and the entire simulation plotted.

```python
import tellurium as te
import numpy

r = te.loada ('''
    $Xo -> S1; k1 * Xo;
    S1 -> S2; k2*S1;
    S2 -> $X1; k3*S2;

    Xo = 50; S1 = 0; S2 = 0;
    k1 = 0.2; k2 = 0.4; k3 = 2;
''')

m1 = r.gillespie(0, 30)
r.k1 = r.k1/6
m2 = r.gillespie(30, 60)

# Merge the two data sets
result = numpy.vstack((m1, m2))
te.plotWithLegend(r, result)
```

**Figure** <a id="fig-stochasticsimb"></a> `fig:stochasticSimB`

*Graphic (not in the LaTeX source, referenced by name): `stochasticSimB`*

*Caption:* Stochastic simulation using Tellurium (Script `tellurium:chap:StochasticJarnacB`) showing how an event can be superimposed between two consecutive simulations. Upper curve S$_1$, lower curve S$_2$.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.45]{stochasticSimB}
\caption{Stochastic simulation using Tellurium (Script~\ref{tellurium:chap:StochasticJarnacB}) showing how an event can be superimposed between two consecutive simulations. Upper curve S$_1$, lower curve S$_2$.} \label{fig:stochasticSimB}
\end{figure}
```

## Further Reading

In recent years a small number of books have emerged and are geared towards stochastic modeling for the average modeler. Brian Ingall's new book Mathematical Modeling in Systems Biology: An Introduction, is a very good start, followed by the 2nd edition of Wilkinson's book Stochastic Modeling for Systems Biology. The text Stochastic Approaches for Systems Biology by Ullah and Wolkenhauer covers other areas such as experimental aspects in cellular noise. Both the Ingalls and Ullah books are quite reasonably priced. Wilkinson's book is more mathematically orientated, but I recommend all three.

- Ingalls B (2013) Mathematical Modeling in Systems Biology: An Introduction, MIT Press. ISBN: 978-0262018883

- Wilkinson D (2011) Stochastic Modeling for Systems Biology 2nd Edition, Chapman & Hall/CRC Mathematical & Computational Biology (Book 44), ISBN: 978-1439837726

- Ullah M and Wolkenhauer O (2011) Stochastic Approaches for Systems Biology, Springer, ISBN: 978-1461404774

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- \begin{enumerate} -->

<!-- \item Define the following terms: -->

<!-- \begin{enumerate} -->
<!-- \item $c$ -->
<!-- \item $h$ -->
<!-- \item $h c \delta t$ -->
<!-- \end{enumerate} -->

<!-- \item Given a reaction of the form $X + X \rightarrow $, what is value of $h$ -->

<!-- \item The deterministic rate constant for the reaction $2 X \rightarrow $ is equal to 0.5 mM$^{-1}$ s$^{-1}$. If the volume of the compartment in which the reaction takes place is 10 mm$^3$, what is the value for the equivalent stochastic rate constant? -->

<!-- \item Given the system: -->

<!-- \begin{verbatim} -->
<!-- s1 -> s2; k1*s1 -->
<!-- s2 -> s3 + s4; k2*s2 -->
<!-- s4 -> s5; k3*s4 -->

<!-- k1 = 0.1; k2 = 0.34; k3 = 0.02 -->
<!-- s1 = 100 -->
<!-- \end{verbatim} -->

<!-- Write a Tellurium script to run a stochastic simulation from time 0 to time 80. Repeat this 10 times and overlay the results on to one graph. -->

<!-- \end{enumerate} -->

<!-- Programming Exercises: -->

<!-- \begin{enumerate} -->

<!-- \item Write a Python script to implement the Gillespie direct method. -->

<!-- \item Modify the Python script to allow simulations to be generated on a regular grid. Run multiple trajectories and compute the average trajectories using the grid data. -->

<!-- \end{enumerate} -->

<!-- \section*{Answers} -->

<!-- \begin{enumerate} -->

<!-- \item -->
<!-- \begin{enumerate}[label=(\alph*)] -->
<!-- \item $c$ is the average probability that a reactant molecule will react per unit time -->
<!-- \item $h$ is the number of distinct molecular reactant combinations for a given reaction -->
<!-- \item $h c \delta t$ is the probability that a reaction will occur in a population of molecules in the next time interval $\delta t$. -->
<!-- \end{enumerate} -->

<!-- \item $x_a (x_a-1)/2$ where $x_a$ is the number of molecules. -->

<!-- \item We've first convert the units to moles and liters. With that, the value for the deterministic rate constant will be $0.5 \times 10^{-3}$ M s$^{-1}$. The volume, 10 mm$^3$ is converted to $10 \times 10^{-6}$L. To convert we use the expression $2 k/ (N_A V)$ where $N_A$ is Avogadro's number of $6.022 \times 10^{23}$. Hence: $c = 2 \times 0.5 \times 10^{-3} /(6.022 \times 10^{23} \times 10 \times 10^{-6})  = 1.66 \times 10^{-22}$ molecules$^{-1}$ s$^{-1}$. -->

<!-- \item -->
<!-- \begin{verbatim} -->
<!-- import tellurium as te -->

<!-- r = te.loada (''' -->
<!-- s1 -> s2; k1*s1 -->
<!-- s2 -> s3 + s4; k2*s2 -->
<!-- s4 -> s5; k3*s4 -->

<!-- k1 = 0.1; k2 = 0.34; k3 = 0.02 -->
<!-- s1 = 100 -->
<!-- ''') -->

<!-- for i in range(10): -->
<!-- m = r.gillespie (0, 80) -->
<!-- r.plot(m, show=False, alpha=0.8) -->
<!-- r.reset() -->

<!-- te.show() -->
<!-- \end{verbatim} -->
<!-- \end{enumerate} -->

<!-- Consider the following Hepatitis B viral infection model taken from XXXX. Figure~\ref shows a network diagrma of this model. -->

<!-- \begin{figure}[htb] -->
<!-- \centering -->
<!-- \includegraphics[scale = 0.45]{VirusNetwork} -->
<!-- \caption{Hepatitis B viral infection network. rcDNA = relaxed circular DNA; covalently closed circular DNA = cccDNA. Note the positive feedback from cccDNA to rcDNA synthesis. } \label{fig:VirusNetwork} -->
<!-- \end{figure} -->

<!-- \begin{figure}[htb] -->
<!-- \centering -->
<!-- \includegraphics[scale = 0.45]{VirusStochastic} -->
<!-- \caption{The effect of single events on the evolution of a system: Hepatitis B viral infection, modified from XXX. Solid thick line represents the trajectory for the deterministic model. Generated using Jarnac script~\ref{jarnac:chap:VirusStochastic} script.} \label{fig:VirusStochastic} -->
<!-- \end{figure} -->

---

## Index terms recorded in this chapter

- $c$
- $h$
- combination of molecules
- cumulative probability function
- Darren Wilkinson
- direct method
- Dizzy
- ensemble
- first reaction method
- Gillespie
- Gillespie algorithm
- Gillespie on a grid
- Gillespie SSA
- Ingalls
- McCollum
- next reaction method
- Pahle
- probability
- probability distribution function
- propensity function
- regular intervals
- regular time grid
- software:stochastic
- SSA
- SSA: multiple reactions
- stochastic kinetics
- stochastic mean
- stochastic processes
- stochastic rate constant
- stochastic trajectory
- stochastic variance
- stochastic: events
- stochkit
- sum of propensities
- telegraph model
- time to reaction
- trajectory
- Ullah
- uniform random number
- Wilkinson

---

← [[05_differential_equation_models|Differential Equation Models]] · [[index|Wiki index]] · [[07_how_systems_behave|How Systems Behave]] →
