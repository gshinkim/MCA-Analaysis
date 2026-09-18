# Branched and Cyclic Systems (unpublished draft)

*Source: `chapter14a.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Branched and Cyclic Systems <a id="chap-branchedandcyclicsystems"></a>

## Branched Pathways

Branching structures are probably one of the most
common patterns in biochemical networks. Even a pathway such as glycolysis, often depicted
as a straight chain in textbooks is in fact a highly branched
pathway.

At any given branch node, where a node is a molecular species, there will be conservation of mass. Given a node species, $x_i$, with $b$ branches entering the node and $d$ branches leaving, the net rate of change in concentration of $x_i$ is:

$$ \sum_{i=1}^b v_i - \sum_{j=1}^d v_j = \frac{dx_i}{dt} $$

At steady state when $dx_i/dt = 0$, it must also be true that:

$$ \sum_{i=1}^b v_i = \sum_{j=1}^d v_j $$

In this section we will investigate the control of flux through a branched system in response to changes in enzyme activity. Let us consider the simple branched pathway depicted in Figure [Figure: Simple branched pathway](#fig-simplebranch).

**Figure** <a id="fig-simplebranch"></a> `fig:simpleBranch`

*Graphic (not in the LaTeX source, referenced by name): `simpleBranch.pdf`*

*Caption:* Simple branched pathway. This pathway has three different
fluxes, $J_1, J_2$, and $J_3$ which at steady state are constrained by $J_1 = J_2 + J_3$.

```latex
\begin{figure}[h]
\begin{center}
  \includegraphics[scale=0.5]{simpleBranch.pdf}
  \caption{Simple branched pathway. This pathway has three different
fluxes, $J_1, J_2$, and $J_3$ which at steady state are constrained by $J_1 = J_2 + J_3$.} \label{fig:simpleBranch}
\end{center}
\end{figure}
```

In the figure, $J_1, J_2$ and $J_3$ are the steady state fluxes. By the law of
conservation of mass, at steady state, the fluxes in each limb will be
governed by the relationship:

$$ J_1 = J_2 + J_3 $$

Given three different fluxes and one intermediate, there will be four sets of control
coefficients, one set concerned with changes in the intermediate,
$S$, and three sets corresponding to each of the three fluxes (Table [Table: Set of control coefficients for a simple branch](#tbl-ccbranchedsystem)).

**Table** <a id="tbl-ccbranchedsystem"></a> `tbl:CCBranchedSystem`

*Caption:* Set of control coefficients for a simple branch

```latex
\begin{table}
\centering
\begin{tabular}{llll}\toprule
$ C^{J_1}_{E_1}\quad$ & $C^{J_2}_{E_1}\quad$ & $C^{J_3}_{E_1}$ & $C^{S}_{E_1}$ \\[8pt]
$ C^{J_1}_{E_2}$ & $C^{J_2}_{E_2}$ & $C^{J_3}_{E_2}$ & $C^{S}_{E_2}$ \\[8pt]
$ C^{J_1}_{E_3}$ & $C^{J_2}_{E_3}$ & $C^{J_3}_{E_3}$ & $C^{S}_{E_3}$ \\\bottomrule
\end{tabular}
\caption{Set of control coefficients for a simple branch}
\label{tbl:CCBranchedSystem}
\end{table}
```

For the branched system we can write a summation and a connectivity theorem with respect to each flux. For example, with respect to $J_1$ we can write:

$$ C^{J_1}_{E_1} + C^{J_1}_{E_2} + C^{J_1}_{E_3} = 1 $$

and

$$ C^{J_1}_{E_1} \varepsilon^{v_1}_S + C^{J_1}_{E_2} \varepsilon^{v_2}_S + C^{J_1}_{E_3} \varepsilon^{v_3}_S  = 0 $$

This gives us two equations but three unknown flux control coefficients. To solve for the $C^{J_1}_{E_i}$ we need another equation.

Let the fraction of flux through $J_2$ be given by $\alpha = J_2/J_1$ and the fraction of flux through $J_3$ be $1 - \alpha = J_3/J_1$. Let us carry out the following thought experiment.

- Increase the concentration of $E_2$ by $\delta E_2$, this will cause a decrease in $S$, an increase in $J_1$ (relief of product inhibition) and a decrease in $J_3$.
- Restore the change in $J_1$ by decreasing $E_3$ such that $S$ is restored to its pre-perturbation state. That at the end the thought experiment $\delta S = 0$.
- Since we have not changed $E_1$, it must be the case that $\delta J_1 = 0$.

From this experiment we can write down the system and local equations. The system equation is given by:

$$ C^{J_1}_{E_2} \frac{\delta E_2}{E_2} + C^{J_1}_{E_3} \frac{\delta E_3}{E_3} = \frac{\delta J_1}{J_1}  = 0$$

Note that the system equation only has two terms because we did not change $E_1$. The local equations are quite simple because $\delta S = 0$ and as before we assume that $\varepsilon^v_{E_i} = 1$.

$$ \frac{\delta v_2}{v_2} = \frac{\delta E_2}{E_2} \quadand\quad \frac{\delta v_3}{v_3} = \frac{\delta E_3}{E_3} $$

By substitution, the system equation can be written as:

$$ C^{J_1}_{E_2} \frac{\delta v_2}{v_2} + C^{J_1}_{E_3} \frac{\delta v_3}{v_3} = 0 $$

Since $\delta J_1 = 0 $, it must be the case the net change in flux downstream of $S$ must also be zero, that is $\delta v_2 + \delta v_3 = 0$, or $\delta v_2 = -\delta v_3$. We can therefore eliminate the $\delta v_3$ term:

$$ C^{J_1}_{E_2} \frac{\delta v_2}{v_2} - C^{J_1}_{E_3} \frac{\delta v_2}{v_2} \frac{v_2}{v_3} = 0 $$

Canceling terms we obtain:

$$ C^{J_1}_{E_2}  - C^{J_1}_{E_3}  \frac{v_2}{v_3} = 1 $$

We can substitute the absolute rates, $v_2$ and $v_3$ with the fractional fluxes, $\alpha $ and $1-\alpha$ to give:

$$ C^{J_1}_{E_2}  - C^{J_1}_{E_3}  \frac{\alpha}{1-\alpha} = 0 $$

and finally:

\stateEquation{
$$ C^{J_1}_{E_2} (1-\alpha)  - C^{J_1}_{E_3}  \alpha = 0 $$
}

This result is called the **flux branch point theorem**. We can derive similar theorems with respect to $J_2$ and $J_3$. In each case we carry out the same thought experiment such that the reference flux, $J_2$ or $J_3$ is unchanged. The two additional theorems are given below with respect to $J_2$ and $J_3$.

$$ C^{J_2}_{E_1} (1 - \alpha) + C^{J_2}_{E_3} = 0 $$

$$ C^{J_3}_{E_1} \alpha + C^{J_3}_{E_2} = 0 $$

We can also derive using the same thought experiment branch point theorems with respect to the species concentration, $S$. This time the systems equation is:

$$ C^{S}_{E_2} \frac{\delta E_2}{E_2} + C^{S}_{E_3} \frac{\delta E_3}{E_3} = \frac{\delta S}{S}  = 0$$

Substituting in the same local equations as before and noting that $\delta v_2 = -\delta v_3$ we obtain after some rearrangement:

\stateEquation{
$$ C^S_{E_2} (1 - \alpha) + C^S_{E_3} \alpha = 0 $$
}

This result is known as the **concentration branch point theorem** and as can be seen it is very similar to the flux branch point theorem. There are also a set of variants that correspond to the flux branch theorems for $J_2$ and $J_3$:

$$ C^S_{E_1} (1 - \alpha) + C^{S}_{E_3} = 0 $$

$$ C^S_{E_1} \alpha + C^S_{E_2} = 0 $$

We can write out the theorems in matrix form (See equation `eqn:MatrixFormMCA`) using the theorems expressed in terms of $J_2$, this includes one summation, one connectivity and one branch theorem:

$$
\begin{bmatrix}
C^{J_2}_1 & C^{J_2}_2 & C^{J_2}_3 \\[5pt]
C^{S}_1 & C^{S}_2 & C^{S}_3 
\end{bmatrix}
\begin{bmatrix}
1 & -\varepsilon^1_1 & 0 \\[5pt]
1 & -\varepsilon^2_1 & 1-\alpha \\[5pt]
1 & -\varepsilon^3_1 & 1 \\[5pt]
\end{bmatrix} =
\begin{bmatrix}
1 & 0 & 0   
0 & 1 & 0
\end{bmatrix}
$$

We can solve for the control coefficient matrix by rearranging:

$$
\begin{bmatrix}
C^{J_2}_1 & C^{J_2}_2 & C^{J_2}_3 \\[5pt]
C^{S}_1 & C^{S}_2 & C^{S}_3
\end{bmatrix} =
\begin{bmatrix}
1 & 0 & 0   
0 & 1 & 0
\end{bmatrix}
\begin{bmatrix}
1 & -\varepsilon^1_1 & 0 \\[5pt]
1 & -\varepsilon^2_1 & 1-\alpha \\[5pt]
1 & -\varepsilon^3_1 & 1 \\[5pt]
\end{bmatrix}^{-1}
$$

Inverting the second matrix we can derive $C^{J_2}_{E_2}$ and $C^{J_2}_{E_3}$ [FS85]. In the following we have simplified the notation by setting $\varepsilon_1 = \varepsilon^{1}_S, \varepsilon_2 = \varepsilon^{2}_S,$ and $\varepsilon_3 = \varepsilon^{3}_S$. The denominator, $\varepsilon_2 \alpha + \varepsilon_3 (1-\alpha) - \varepsilon_1 $ is **positive**, therefore the following equalities hold given that $\varepsilon_1 < 0$, $\varepsilon_2 > 0$ and $\varepsilon_3 > 0$:

$$
\begin{align*}
C^{J_2}_{E_1} &= \frac{\varepsilon_2}{\varepsilon_2 \alpha + \varepsilon_3 (1-\alpha) -\varepsilon_1 } > 0 \\[7pt]
C^{J_2}_{E_2} &= \frac{\varepsilon_3 (1-\alpha) - \varepsilon_1}{\varepsilon_2 \alpha + \varepsilon_3 (1-\alpha) -\varepsilon_1 } > 0 \\[7pt]
C^{J_2}_{E_3} &= \frac{-\varepsilon_2 (1-\alpha)}{\varepsilon_2 \alpha + \varepsilon_3 (1-\alpha) -\varepsilon_1 } < 0
\end{align*}
$$

And for the concentration control coefficients:

$$
\begin{align*}
C^{S}_{E_1} &= \frac{1}{\varepsilon_2 \alpha + \varepsilon_3 (1-\alpha) - \varepsilon_1}  > 0 \\[6pt]
C^{S}_{E_2} &= \frac{-\alpha}{\varepsilon_2 \alpha + \varepsilon_3 (1-\alpha) - \varepsilon_1 } < 0 \\[6pt]
C^{S}_{E_3} &= \frac{-(1-\alpha)}{\varepsilon_2 \alpha + \varepsilon_3 (1-\alpha) - \varepsilon_1 } < 0  
\end{align*}
$$

Referring to the concentration control coefficient first we note that $C^S_{1}$ is positive while the two branch coefficients, $C^S_{2}$ and $C^S_{3}$ are negative. This is as expected. The degree to which each of the output branches affects the concentration is in proportion to the amount of flux carried by the branch. This means that a branch that only carries a small amount of flux will have little effect on the branch species concentration.

Both flux control coefficients, $C^{J_2}_{1}$ and $C^{J_2}_{2}$ are positive which we would expect. The flux control coefficient, $C^{J_2}_{3}$ however is negative, indicating that changes in the activity of $E_3$ decreases the flux in the other limb, $J_2$. This means there is **competition** in each output branch for flux. If one branch becomes more active then it can "steal" flux from the other branch. The amount stolen will depend on the various kinetic properties of the branch enzymes. To answer what determines the competition between the output branches we must look at the control equations in more detail, in particular we must look at how the distribution of control is affected by different flux distributions and the kinetics of the branch enzymes. In the following analysis $J_2$ will be the flux we observe as a result of perturbations to the enzymes in the branched pathway.

### Most Flux Through $J_3$

The first situation to consider is the case when the bulk of flux moves along $J_3$ and only a small amount goes through the upper limb $J_2$, that is $ \alpha \rightarrow 0$ and $ 1-\alpha \rightarrow 1$ (See Figure [Figure: The figure shows two flux extremes relative to the flux through
branch](#fig-branchpointeffect)(b)). Let us examine how the small amount of flux through $J_2$ is influenced by the two branch limbs, $E_2$ and $E_3$.

As $ \alpha \rightarrow 0$ and  $1-\alpha \rightarrow 1$, then:

$$
\begin{eqnarray*}
C^{J_2}_{E_2} &\rightarrow& \frac{\varepsilon_1 - \varepsilon_3}{\varepsilon_1 - \varepsilon_3} = 1 \\[6pt]
C^{J_2}_{E_3} &\rightarrow& \frac{\varepsilon_2}{\varepsilon_1 -
\varepsilon_3}
\end{eqnarray*}
$$

The first thing to note is that $E_2$ tends to acquire proportional
influence over its own flux, $J_2$. Since $J_2$ only carries a very small
amount of flux, any changes in $E_2$ will have little effect on $S$,
hence the flux through $E_2$ is almost entirely governed by the
activity of $E_2$. Because of the flux summation theorem and the
fact that $C^{J_2}_{E_2} = 1$ it means that the remaining two coefficients must be
equal and opposite in value. Since $C^{J_2}_{E_3}$ is negative,
$C^{J_2}_{E_1}$ must be positive.

Unlike a linear pathway, the values for $C^{J_2}_{E_2}$ and $C^{J_2}_{E_1}$ are not bounded between zero
and one and depending on the values of the elasticities it is
possible for the control coefficients in a branched system to greatly exceed
one [Ka83, LaPorte:1984].

It is also possible to arrange the
kinetic constants so that every step in the branch with respect to $J_2$ has a control coefficient of unity (one of which must be -1 in order to satisfy the summation theorem). We could therefore claim that **every step** in the pathway is a rate limiting step with respect to $J_2$. This clearly shows us again that rate limitation is not a simple concept as is traditionally supposed.

\stateHighlight{
In a branched pathway it is possible to arrange the kinetic constants of the enzymes such that the feed branch has a flux control coefficient of +1, one of the output branch a coefficient of -1 and the other output branch a coefficient of +1. That is, **every step** in the pathway is equally rate limiting.
}

It is also possible to arrange the kinetic constants in the pathway such that the flux coefficients for $E_1$ and $E_3$ are much greater than one. This effect has been termed ultrasensitivity [LaPorte:1984]. The Jarnac script `jarnac:simpleBranchAmplification` in the chapter Appendix illustrates a branched pathway with control coefficients over 8.0. Table [Table: Results showing high flux control coefficients in a simple branch mode](#tbl-branchamplification) shows the results from the Jarnac script simulation.

**Table** <a id="tbl-branchamplification"></a> `tbl:BranchAmplification`

*Caption:* Results showing high flux control coefficients in a simple branch model, see script `jarnac:simpleBranchAmplification`

```latex
\begin{table}
\centering
\begin{tabular}{lp{2cm}r} \toprule
$C^{J_2}_{E_1} $ & \hspace{8pt}8.34  \\[6pt]
$C^{J_2}_{E_2} $ & \hspace{8pt}0.99 \\[6pt]
$C^{J_2}_{E_3} $ & \hspace{8pt}-8.51 \\\bottomrule
\end{tabular}
\caption{Results showing high flux control coefficients in a simple branch model, see script~\ref{jarnac:simpleBranchAmplification}}
\label{tbl:BranchAmplification}
\end{table}
```

The explanation for these high control coefficients is straight forward. Any changes in the two limbs that carry the high flux will have an adverse effect on the very small flux that is carried by $J_2$. Imagine a small stream coming off a large river. Any flooding in the large river is likely to have a huge impact on the small stream.

\stateHighlight{
In a branched pathway it is possible to arrange the kinetic constants of the enzymes such the flux control coefficients in the feed and output branch can greatly **exceed one**.
}

Other than an asymmetric distribution of flux the ability to achieve high flux sensitivity at a branch point also depends on the relative values of the elasticities. For example increasing the value $\varepsilon_2$ relative to $\varepsilon_3$ increases the sensitivity of the branch point. This could be achieved in a number of ways:

- $E_2$ can show positive cooperativity with respect to the branch species. That is any changes in $E_3$ become amplified through $E_2$.
- $v_3$ is operating in a more saturated regime compared to $v_2$. This will make $\varepsilon_3$ smaller than $\varepsilon_2$ and amounts to ensuring that the $K_m$ for $v_2$ is higher than the $K_m$ of $v_3$.
- Product inhibition on $v_1$ is very small.

### Most Flux Through $J_2$

Let us now consider the other extreme, that is when most of the flux is
through $J_2$, in other words $ \alpha \rightarrow 1$ and $ 1-\alpha
\rightarrow 0$ (See Figure [Figure: The figure shows two flux extremes relative to the flux through
branch](#fig-branchpointeffect)(a)). Under
these conditions the control coefficients yield:

$$
\begin{eqnarray*}
C^{J_2}_{E_2} &\rightarrow& \frac{\varepsilon_1}{\varepsilon_1 - \varepsilon_2} \\
C^{J_2}_{E_3} &\rightarrow& 0
\end{eqnarray*}
$$

In this situation the pathway has effectively become a simple linear
chain. The influence of $E_3$ on $J_2$ is negligible. By analogy, changing the flow of water in a small stream that comes off a large river will have a negligible effect on the rate of flow in the large river.

Figure [Figure: The figure shows two flux extremes relative to the flux through
branch](#fig-branchpointeffect) summarizes the changes in sensitivities at a branch point.

**Figure** <a id="fig-branchpointeffect"></a> `fig:BranchPointEffect`

*Graphic (not in the LaTeX source, referenced by name): `branchPointEffect.pdf`*

*Caption:* The figure shows two flux extremes relative to the flux through
branch $J_2$. In case (a) where most of the flux goes through $J_2$, the branch
reverts functionally to a simple linear sequence of reactions comprised of J1
and $J_2$. In case (b), where most of the flux goes through $J_3$, the flux through
$J_2$ now becomes very sensitive to changes in activity at $J_1$ and $J_3$. Given the
right kinetic settings, the flux control coefficients can become �ultrasensitive�
with values greater than one (less than minus one for activity changes at $J_3$).
The values next to each reaction indicates the flux control coefficient for the
flux through $J_2$ with respect to activity at the reaction.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale=0.6]{branchPointEffect.pdf}
  \caption{The figure shows two flux extremes relative to the flux through
branch $J_2$. In case (a) where most of the flux goes through $J_2$, the branch
reverts functionally to a simple linear sequence of reactions comprised of J1
and $J_2$. In case (b), where most of the flux goes through $J_3$, the flux through
$J_2$ now becomes very sensitive to changes in activity at $J_1$ and $J_3$. Given the
right kinetic settings, the flux control coefficients can become �ultrasensitive�
with values greater than one (less than minus one for activity changes at $J_3$).
The values next to each reaction indicates the flux control coefficient for the
flux through $J_2$ with respect to activity at the reaction.} \label{fig:BranchPointEffect}
\end{center}
\end{figure}
```

## Futile or Substrate Cycles

Closely related to branched systems are cyclic pathways. A typical cyclic pathway in shown in Figure [Figure: Cyclic Pathway](#fig-futilecycle-1). For cycling to occur both forward and back reactions must operate. It is typical to find that the forward and reverse reactions are chemically distinct. Often one reaction will be driven by ATP while the other by the hydrolysis of phosphate groups. Typical examples in metabolism include the cycle between glucose and gluc\-ose-6-ph\-osphate and the cycling between fruc\-tose-6-phos\-phate and fructose 1.6-bis\-phos\-phate. Such cycles have often been called futile cycles (or better substrate cycles) because of the expenditure of free energy (as ATP) without any apparent benefit. A number of suggestions have been put forward to rationalize this apparent waste of energy. These include heat production, control of flux direction, metabolite buffering and more sensitive control of the net flux through the pathway. We will only consider the later here.

### Sensitivity Control

Figure [Figure: Cyclic Pathway](#fig-futilecycle-1) shows a typical cyclic pathway embedded in a linear chain.

**Figure** <a id="fig-futilecycle-1"></a> `fig:FutileCycle_1`

*Graphic (not in the LaTeX source, referenced by name): `futileCycle.pdf`*

*Caption:* Cyclic Pathway.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale=0.6]{futileCycle.pdf}
  \caption{Cyclic Pathway.} \label{fig:FutileCycle_1}
\end{center}
\end{figure}
```

Of interest is the sensitivity of the pathway flux, $v_1$ or $v_4$ to changes in $v_2$. The simplest assumption to make is that when we change $v_2$ there is no change in back flux, $v_3$. This could be for a number of reasons, for example $v_3$ is saturated by its substrate $S_2$.

Figure [Figure: Amplification in a substrate cycle](#fig-futilecycle-2) illustrate two situations, a references state in panel a) and a perturbation of 5% to $v_2$ shown in panel b). Assuming that the entire flux changes appear in output flux $v_4$ and that $v_3$ is not changed, then the percentage change in $v_4$ (or $v_1$) is 100%, a twenty fold amplification.

**Figure** <a id="fig-futilecycle-2"></a> `fig:FutileCycle_2`

*Graphic (not in the LaTeX source, referenced by name): `futileCycleAmp.pdf`*

*Caption:* Amplification in a substrate cycle. Panel a) Reference state, values refer to fluxes at various points, note that $v_1 = v_2 - v_3$. Panel b) Activation of $v_2$ by 5% leads to a 100% change in $v_1$ and $v_4$. It assumes that $v_3$ is not activated by any changes in $S_2$. 

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale=0.6]{futileCycleAmp.pdf}
  \caption{Amplification in a substrate cycle. Panel a) Reference state, values refer to fluxes at various points, note that $v_1 = v_2 - v_3$. Panel b) Activation of $v_2$ by 5\% leads to a 100\% change in $v_1$ and $v_4$. It assumes that $v_3$ is not activated by any changes in $S_2$. } \label{fig:FutileCycle_2}
\end{center}
\end{figure}
```

This effect can be easily quantified as follows. First we note the flux constraint due to the cycle is:

$$
v_1 = v_2 - v_3
$$

We then assume that a perturbation in $v_2$ leads to the same change in $v_1$, that is:

$$ \delta v_2 = \delta v_1 $$

We can now compute the fractional changes in $v_1$ and $v_2$ as:

$$ \frac{\delta v_1}{v_1} = \frac{\delta v_2}{v_2} \frac{v_2}{v_1} $$

The degree of amplification is then given by

$$ \frac{\delta v_1/v_1}{\delta v_2/v_2} = \frac{v_2}{v_1} $$

Since $v_2 = v_1 + v_3$ then

$$
\begin{align}
\frac{\delta v_1/v_1}{\delta v_2/v_2} = \frac{v_1 + v_3}{v_1}  = 1 + \frac{v_3}{v_1}
\label{eqn:futilAmp}
\end{align}
$$

This result shows that the higher the cycling rate ($v_3$) compared to the through flux, the greater the amplification. This equation gives us the maximum degree of amplification possible. In practice, $v_3$ will not remain unchanged because $S_2$ rises. In addition $S_1$ will fall due to high consumption which will reduce $v_2$ but increase $v_1$ due to lower product inhibition. The resulting amplification is therefore a more complicated function than the one suggested by equation [Sensitivity Control](#eqn-futilamp). However equation [Sensitivity Control](#eqn-futilamp) gives the maximum possible ampilfication.

To carry out a more detailed analysis we must turn to metabolic control analysis. We can examine the flux control coefficient for $C^{J_1}_2$:

$$
\begin{align*}
C^{J_1}_2 &= \frac{\el{1}{1} \el{4}{2} \left(1 + v_3/v_1\right)}{D}\\[6pt]
D &= \el{1}{1} \el{4}{2} - \left(1 + \frac{v_3}{v_1}\right)\left(\el{1}{1} \el{2}{2} + \el{4}{2}\el{2}{1}\right) + \frac{v_3}{v_1}\left(\el{1}{1} \el{3}{2} +
\el{4}{2} \el{3}{1}\right)
\end{align*}
$$

Let us simplify this equation by assuming that there is little or no product inhibition from $S_2$ on to $v_2$ and $S_1$ on to $v_3$. This means that $\el{3}{1} = 0$ and $\el{2}{2} = 0$. If we also multiply top and bottom by $v_1$ and using the relation $v_1 + v_3 = v_2$, then we can simplify the control equation to:

$$
\begin{align*}
C^{J_1}_2 &= \frac{\el{1}{1} \el{4}{2} v_2}{D}\\[6pt]
D &= \el{1}{1} \el{4}{2} v_1 - \el{4}{2}\el{2}{1} v_2 + \el{1}{1} \el{3}{2} v_3
\end{align*}
$$

Two things to note immediately from this equation. There must be product inhibition on the first step, $\el{1}{1}$, in order to get any sensitivity. If $\el{1}{1}$ is zero then so is $C^{J_1}_2$. This is because all control is now on the first step. This highlights again the danger of using rate laws in models that are product insensitive because the use of such rate laws often give misleading or trivial results of no real interest. The second relatively simple statement to make from the above equation is the importance of $\el{3}{2}$. This elasticity is the activation of the reverse arm with respect to $S_2$. The larger this elasticity the smaller the degree of amplification. This is expected because any flux that flows back along the reverse cycle instead of into $v_4$ reduces the potential amplification factor. To analyze the equation further we can make additional simplifications.

We know that sensitivity increases when the cycling rate increases relative to the main flux, $v_1$ and $v_4$. If $v_2$ and $v_3$ are much greater than $v_1$ then we can simplify the equation further to:

$$ C^{J_1}_2 = \frac{v_2}{v_3 \el{3}{2}/\el{4}{2} - v_2 \el{2}{1}/\el{1}{1} } $$

If the cycling rate is so high that $v_2$ and $v_3$ are almost indistinguishable then we can see that maximal sensitivity is achieved when:

$$ \frac{\el{3}{2}}{\el{4}{2}} + \frac{\el{2}{1}}{\el{1}{1}} \ll 1 $$

This tells us that substrate activation of $v_4$ by $S_2$ should be stronger than substrate activation of $S_2$ on $v_3$ and secondly that product inhibition of $S_1$ on $v_1$ must be stronger than substrate activation of $S_1$ on $v_2$. If we think about this in a thought experiment, these results are expected.

The requirements for amplification in substrate cycles is fairly complicated and questions remain whether real pathways use this mechanism in vivo.

At this point we leave the topic of branches and cycles. In a subsequent chapter we will consider the dynamic properties of conserved cycles.

## Exercises

- Given the simple branch in Figure [Figure: Simple branched pathway](#fig-simplebranch) prove the following theorems:

$$ C^{J_2}_{E_1} (1 - \alpha) + C^{J_2}_{E_3} = 0 $$

$$ C^{J_3}_{E_1} \alpha + C^{J_3}_{E_2} = 0 $$

- Prove that the following two theorems are true for the branch point in Figure [Figure: Simple branched pathway](#fig-simplebranch):

$$ C^S_{E_1} (1 - \alpha) + C^{S}_{E_3} = 0 $$

$$ C^S_{E_1} \alpha + C^S_{E_2} = 0 $$

- Derive the flux branch points for the following multibranched system:

**Figure** <a id="fig-multibranch"></a> `fig:MultiBranch`

*Caption:* Multi-Branched Pathway.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}[>=latex', node distance=2cm]

  \node (S0) {};
  \node [right of = S0] (S1) {\Large $S_1$};
  \node [above right of = S1] (S2) {};
  \node [below right of = S1] (S3) {\Large $S_2$};

  \node [above right of = S3] (S4) {};
  \node [below right of = S3] (S5) {};

  \draw [->,ultra thick,blue] (S0) -- node[above, black] {$v_1$} (S1);
  \draw [->,ultra thick,blue] (S1) -- node[above left, black] {$v_2$} (S2);
  \draw [->,ultra thick,blue] (S1) -- node[below left, black] {$v_3$} (S3);

  \draw [->,ultra thick,blue] (S3) -- node[above left, black] {$v_4$} (S4);
  \draw [->,ultra thick,blue] (S3) -- node[below left, black] {$v_5$} (S5);

\end{tikzpicture}
\end{center}
\caption{Multi-Branched Pathway.}
\label{fig:MultiBranch}
\end{figure}
```

## Appendix

See Appendix `app:Jarnac` for more details of Jarnac.

```python
p = defn cell
  var S;
  ext Xo, w;
  J1: $Xo -> S; Vm1/Km1*(Xo-S/Keq)/(1+Xo/Km1+S/Km2);
  J2: S -> $w; Vm2*S^4/(Km3+S^4);
  J3: S -> $w; Vm3*S/(Km4+S);
end;
p.Xo = 9;
p.S = 0.2;
p.Vm1 = 1.4;
p.Km1 = 0.4;
p.Keq = 4.5;

p.Km2 = 0.6;
p.Vm2 = 0.05;
p.Km3 = 0.8;
p.Vm3 = 2.3;
p.Km4 = 0.3;

// Due to the high sensitivity, change the evaluation
// method to a five-point difference method (default is three).
// Also decrease the step size to improve accuracy.
p.diffstepsize = 0.01; p.diffmethod = 1; p.ss.tol = 1E-9;
p.ss.eval;
println "Flux Control Coefficients:";
println p.cc (<p.J2>, p.Vm1);
println p.cc (<p.J2>, p.Vm2);
println p.cc (<p.J2>, p.Vm3);
println "Elasticities:";
e1 = p.ee (<p.J1>, p.S);
e2 = p.ee (<p.J2>, p.S);
e3 = p.ee (<p.J3>, p.S);
println e1, e2, e3;
println "Fluxes: ", p.J1, p.J2, p.J3;
```

<!-- \begin{lstlisting}[caption={Simple Branched Pathway showing Flux Amplification},label={jarnac:simpleBranchAmplification}] -->
<!-- p = defn cell -->

<!-- var S; -->
<!-- ext Xo, w; -->

<!-- J1: $Xo -> S; Vm1/Km1*(Xo-S/Keq)/(1+Xo/Km1+S/Km2); -->
<!-- J2: S -> $w; Vm2*S/(Km3+S); -->
<!-- J3: S -> $w; Vm3*S/(Km4+S); -->
<!-- end; -->

<!-- p.Xo = 2; -->
<!-- p.S = 0.2; -->
<!-- p.Vm1 = 1.4; -->
<!-- p.Km1 = 0.4; -->
<!-- p.Keq = 4.5; -->
<!-- p.Km2 = 0.6; -->

<!-- p.Vm2 = 0.05; -->
<!-- p.Km3 = 0.8; -->

<!-- p.Vm3 = 2.3; -->
<!-- p.Km4 = 0.23; -->
<!-- \end{lstlisting} -->

---

← [[appendix_i_modeling_with_python|Modeling with Python]] · [[index|Wiki index]] · [[draft_kinetics_in_a_nutshell_old|Kinetics in a Nutshell (earlier draft)]] →
