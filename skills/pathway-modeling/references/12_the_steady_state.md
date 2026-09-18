# The Steady State

*Source: `chapter12.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# The Steady State <a id="chap-steadystate"></a>

<!-- \begin{chapquote}{\textit{Captain Ericson in The Cruel Sea, 1953}} -->
<!-- ``Steady as she goes, Number One. '' -->
<!-- \end{chapquote} -->

## Steady State

In Chapter [[07_how_systems_behave|How Systems Behave]] we briefly introduced the idea of a steady state. In this chapter we will investigate the steady state in greater detail.

The literature sometimes refers to the steady state as the stationary solution or stationary state, singular point, fixed point, or even equilibrium point. For our purpose we will avoid using the term equilibrium because of possible confusion with thermodynamic equilibrium.

The steady state is one of the most important states to consider in a dynamical model because it is the primary reference point from which to consider a model's behavior. At steady state the concentrations of all molecular species are constant, and there is a net flow of mass through the network. A system at thermodynamic equilibrium where there has no net flow of mass across the system's boundaries.

The steady state is where the rates of change of all species, $d\!S/dt$ are zero, but at the same time the net rates are non-zero, that is $v_i \neq 0$. This situation can only occur in an open system, where matter is exchanged with the surroundings.

Equation [[07_how_systems_behave|Steady State]] from a previous chapter describes the time evolution for the system:

$$ X_o \stackrel{v_1}{\rightarrow} S_1 \stackrel{v_2}{\rightarrow} S_2 \stackrel{v_3}{\rightarrow} X_1 $$

We repeat the equations here for convenience:

$$
\begin{equation}
\begin{split}
S_1(t) &= v_o \frac{1 - e^{-k_1 t}}{k_1}  \\[10pt]
%
S_2(t) &= v_o \frac{k_1 \left(1 - e^{-k_3 t} \right) + k_3 \left(e^{-k_1 t} - 1\right) }{k_3\ (k_1-k_3)}
\end{split}
\end{equation}
$$

As $t$ tends to infinity, $S_1(t)$ and $S_2(t)$ tend to:

$$ S_1(\infty) = \frac{v_o}{k_1} \qquad S_2(\infty) = \frac{v_o}{k_3} $$

The reaction rate through each of the three reaction steps is $v_o$. This can be confirmed by substituting the solutions for S$_1$ and S$_2$ into the reaction rate laws. Given that $v_o$ is greater than zero and S$_1$ and S$_2$ reach constant values given sufficient time, we conclude that this system eventually settles to a steady state rather than thermodynamic equilibrium. The system displays a continuous flow of mass from the source to the sink. This can only continue undisturbed so long as the source material, X$_o$, never runs out. Figure [Figure: Time course for an open system reaching steady state](#fig-simpleopensystemtransientb) shows a simulation of this system.

**Figure** <a id="fig-simpleopensystemtransientb"></a> `fig:SimpleOpenSystemTransientB`

*Caption:* Time course for an open system reaching steady state.  $X_o \stackrel{v_o}{\rightarrow} S_1 \stackrel{k_1}{\rightarrow} S_2 \stackrel{k_3}{\rightarrow} $ where $v_o = 1, k_1 = 2, k_3 = 3, {S_1}_o = 0, {S_2}_o = 0$. $X_o$ is assumed to be fixed. Tellurium Listing: `jarnac:SimpleOpenSystemTransient2`.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Substrate Concentration},
xmin=0, xmax=4, ymin=0, ymax=0.5,
width=8cm,
height=6cm]
\draw(axis cs:2,0.45) node[anchor=west] {\large $S_1$};
\draw(axis cs:2,0.26)  node[anchor=west] {\large $S_2$};

\addplot[color=red,line width=1.5pt] coordinates {
(0, 0)(0.0404040404040404, 0.0388146524809612)(0.0808080808080808, 0.0746161466415603)(0.121212121212121, 0.107638401410424)(0.161616161616162, 0.138097183914753)(0.202020202020202, 0.166191452412901)(0.242424242424242, 0.192104752282554)(0.282828282828283, 0.216006369290086)
(0.323232323232323, 0.23805249475228)(0.363636363636364, 0.258387146519282)(0.404040404040404, 0.277143054650237)(0.444444444444444, 0.294442933892167)(0.484848484848485, 0.31039983239388)(0.525252525252525, 0.325118080388404)(0.565656565656566, 0.338693778684659)(0.606060606060606, 0.35121561903405)
(0.646464646464647, 0.362765407613408)(0.686868686868687, 0.373418547083455)(0.727272727272727, 0.383244711673323)(0.767676767676768, 0.392308104221688)(0.808080808080808, 0.400667933068687)(0.848484848484849, 0.408379097137486)(0.888888888888889, 0.415491661444275)(0.92929292929293, 0.422052100785666)
(0.96969696969697, 0.428103013024985)(1.01010101010101, 0.433684193485093)(1.05050505050505, 0.438832113668279)(1.09090909090909, 0.443580425894426)(1.13131313131313, 0.447960141485812)(1.17171717171717, 0.451999866252112)(1.21212121212121, 0.455725987179287)(1.25252525252525, 0.45916284468426)
(1.29292929292929, 0.462332925864844)(1.33333333333333, 0.465256936330044)(1.37373737373737, 0.467953970377818)(1.41414141414141, 0.470441640842433)(1.45454545454546, 0.472736193931128)(1.4949494949495, 0.474852615096186)(1.53535353535354, 0.476804731292724)(1.57575757575758, 0.478605520162062)
(1.61616161616162, 0.480266448739957)(1.65656565656566, 0.481798369680142)(1.6969696969697, 0.48321131187568)(1.73737373737374, 0.484514525101149)(1.77777777777778, 0.485716537288383)(1.81818181818182, 0.486825211298476)(1.85858585858586, 0.487847797561152)(1.8989898989899, 0.488790982346849)
(1.93939393939394, 0.489660932037181)(1.97979797979798, 0.490463333788777)(2.02020202020202, 0.49120343293335)(2.06060606060606, 0.491886067407283)(2.1010101010101, 0.492515699465936)(2.14141414141414, 0.493096529017664)(2.18181818181818, 0.493632270752725)(2.22222222222222, 0.494126427289246)
(2.26262626262626, 0.494582225787334)(2.3030303030303, 0.495002643016414)(2.34343434343434, 0.495390424777847)(2.38383838383838, 0.495748103820437)(2.42424242424242, 0.496078016365495)(2.46464646464646, 0.496382317349195)(2.5050505050505, 0.496662994481181)(2.54545454545454, 0.496921881210892)
(2.58585858585858, 0.497160668685457)(2.62626262626262, 0.497380916776252)(2.66666666666666, 0.497584064244221)(2.7070707070707, 0.4977714397931)(2.74747474747475, 0.497944271632614)(2.78787878787879, 0.49810368860082)(2.82828282828283, 0.498250731934454)(2.86868686868687, 0.498386362066509)
(2.90909090909091, 0.498511464896306)(2.94949494949495, 0.498626857573135)(2.98989898989899, 0.498733293830992)(3.03030303030303, 0.498831468909502)(3.07070707070707, 0.498922024092863)(3.11111111111111, 0.499005550896719)(3.15151515151515, 0.499082594930068)(3.19191919191919, 0.499153659613446)
(3.23232323232323, 0.499219209239767)(3.27272727272727, 0.499279672025591)(3.31313131313131, 0.499335442936324)(3.35353535353535, 0.499386886268428)(3.39393939393939, 0.499434338031081)(3.43434343434343, 0.499478108142766)(3.47474747474747, 0.499518482457418)(3.51515151515151, 0.499555724633171)
(3.55555555555555, 0.499590077746816)(3.59595959595959, 0.49962176536822)(3.63636363636363, 0.499650994680897)(3.67676767676767, 0.499677956749486)(3.71717171717171, 0.499702827774452)(3.75757575757575, 0.499725770249122)(3.79797979797979, 0.499746934026645)(3.83838383838383, 0.499766457303771)
(3.87878787878787, 0.499784467528221)(3.91919191919191, 0.499801082235216)(3.95959595959595, 0.499816409818995)(3.99999999999999, 0.499830550244212)};
\addplot[color=blue,line width=1.5pt] coordinates {
(0, 0)(0.0404040404040404, 0.00152665993634152)(0.0808080808080808, 0.00571444077482319)(0.121212121212121, 0.0120394144695818)(0.161616161616162, 0.0200545511059375)(0.202020202020202, 0.0293797257174752)(0.242424242424242, 0.039692657030437)(0.282828282828283, 0.050721275114957)
(0.323232323232323, 0.062236867525866)(0.363636363636364, 0.0740483260715895)(0.404040404040404, 0.0859970099108565)(0.444444444444444, 0.097951754082157)(0.484848484848485, 0.109805516471317)(0.525252525252525, 0.121471693567254)(0.565656565656566, 0.132881264479756)(0.606060606060606, 0.143980066600952)
(0.646464646464647, 0.154726596513303)(0.686868686868687, 0.165090076794958)(0.727272727272727, 0.175048715318473)(0.767676767676768, 0.184588324800171)(0.808080808080808, 0.193701023278384)(0.848484848484849, 0.202384164287151)(0.888888888888889, 0.210639409779445)(0.92929292929293, 0.218471880434117)
(0.96969696969697, 0.225889434802003)(1.01010101010101, 0.232902263713276)(1.05050505050505, 0.239522257743397)(1.09090909090909, 0.245762620571547)(1.13131313131313, 0.251637494241226)(1.17171717171717, 0.257161671009683)(1.21212121212121, 0.262350343952444)(1.25252525252525, 0.267218899644533)
(1.29292929292929, 0.271782773038358)(1.33333333333333, 0.276057255886315)(1.37373737373737, 0.280057402769211)(1.41414141414141, 0.283797944067729)(1.45454545454546, 0.287293214826279)(1.4949494949495, 0.290557100017983)(1.53535353535354, 0.293602998420745)(1.57575757575758, 0.296444023721867)
(1.61616161616162, 0.299092220860984)(1.65656565656566, 0.301559374608872)(1.6969696969697, 0.30385673893826)(1.73737373737374, 0.305995016754707)(1.77777777777778, 0.307984361746905)(1.81818181818182, 0.309834388707424)(1.85858585858586, 0.311554187333116)(1.8989898989899, 0.313152338105979)
(1.93939393939394, 0.31463692966979)(1.97979797979798, 0.31601557730225)(2.02020202020202, 0.317295442148059)(2.06060606060606, 0.318483250923614)(2.1010101010101, 0.319585315845382)(2.14141414141414, 0.320607690338205)(2.18181818181818, 0.321555786783285)(2.22222222222222, 0.322434794499418)
(2.26262626262626, 0.323249561058651)(2.3030303030303, 0.324004616530835)(2.34343434343434, 0.324704191429463)(2.38383838383838, 0.325352234025998)(2.42424242424242, 0.325952426994473)(2.46464646464646, 0.326508203361212)(2.5050505050505, 0.327022761744505)(2.54545454545454, 0.327499080878256)
(2.58585858585858, 0.327939933420143)(2.62626262626262, 0.32834789905028)(2.66666666666666, 0.328725376869572)(2.7070707070707, 0.32907459992939)(2.74747474747475, 0.329397647972358)(2.78787878787879, 0.329696446363957)(2.82828282828283, 0.329972783179348)(2.86868686868687, 0.330228318474112)
(2.90909090909091, 0.33046459299314)(2.94949494949495, 0.330683036343589)(2.98989898989899, 0.330884974657166)(3.03030303030303, 0.331071637767711)(3.07070707070707, 0.331244165928725)(3.11111111111111, 0.331403616095932)(3.15151515151515, 0.331550967798451)(3.19191919191919, 0.33168712883917)
(3.23232323232323, 0.331812940152212)(3.27272727272727, 0.331929180542384)(3.31313131313131, 0.332036571172019)(3.35353535353535, 0.332135779714106)(3.39393939393939, 0.332227424219747)(3.43434343434343, 0.33231207671774)(3.47474747474747, 0.332390266563861)(3.51515151515151, 0.332462483555588)
(3.55555555555555, 0.332529180616321)(3.59595959595959, 0.332590775484607)(3.63636363636363, 0.332647656418231)(3.67676767676767, 0.332700182420999)(3.71717171717171, 0.332748685410833)(3.75757575757575, 0.33279347223159)(3.79797979797979, 0.332834826519324)(3.83838383838383, 0.332873010432828)
(3.87878787878787, 0.332908266258485)(3.91919191919191, 0.332940817897445)(3.95959595959595, 0.332970872244067)(3.99999999999999, 0.332998620462935)};
\end{axis}
\end{tikzpicture}
\end{center}
\caption{Time course for an open system reaching steady state.  $\text{X}_o \stackrel{v_o}{\rightarrow} \text{S}_1 \stackrel{k_1}{\rightarrow} \text{S}_2 \stackrel{k_3}{\rightarrow} $ where $v_o = 1, k_1 = 2, k_3 = 3, {S_1}_o = 0, {S_2}_o = 0$. $\text{X}_o$ is assumed to be fixed. Tellurium Listing:~\ref{jarnac:SimpleOpenSystemTransient2}.}
\label{fig:SimpleOpenSystemTransientB}
\end{figure}
```

### Graphical Procedure

We can also illustrate the steady state using a graphical procedure. Consider the simple model below:

```latex
\begin{tikzpicture}[scale=0.8]
  \draw(33pt,65pt) node[anchor=west] {\large X$_o$};

  \draw[color=blue,-latex,line width=1.7pt] (60pt,65pt) -- (95pt,65pt);
  \draw(63pt,78pt) node[anchor=west] {\large $v_1$};
  \draw(94pt,65pt) node[anchor=west] {\large S$_1$};

  \draw[color=blue,-latex,line width=1.7pt] (120pt,65pt) -- (155pt,65pt);
  \draw(124pt,78pt) node[anchor=west] {\large $v_2$};
  \draw(155pt,65pt) node[anchor=west] {\large X$_1$};
\end{tikzpicture}
```

where $X_o$ and $X_1$ are fixed boundary species and $S_1$ is a species that can change (the floating species). Let us assume that each reaction is governed by first-order mass-action kinetics:

$$
\begin{align*}
v_1 = k_1 X_o, \qquad v_2 = k_2 S_1
\end{align*}
$$

where $k_1$ and $k_2$ are both first-order reaction rate constants. In Figure [Figure: Plot of reaction rates versus concentration of $S_1$ and different val](#fig-simplesteadystate) both reaction rates have been plotted as a function of the floating species concentration, $S_1$.

**Figure** <a id="fig-simplesteadystate"></a> `fig:SimpleSteadyState`

*Caption:* Plot of reaction rates versus concentration of $S_1$ and different values for $k_2$ for the system $X_o \rightarrow S_1 \rightarrow X_1$. The darker horizontal line represents $v_1$ and the sloped lines $v_2$ at different values of $k_2$. The intersection of the two lines marks the steady state point where $v_1 = v_2$. $X_o = 1, k_1 = 0.4$. Note that as $k_2$ decreases the steady state level of $S_1$ increases.

```latex
\begin{figure}[htb]
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
\node at (axis cs:4.1,1)  {$k_2=0.2$};

\addplot[color=orange,line width=1.5pt] coordinates {
(0,	0)
(5, 0.5)
};
\fill [red] (axis cs:4,0.4) circle (2.5pt);
\node at (axis cs:4.2,0.56)  {$k_2=0.1$};

\end{axis}
\end{tikzpicture}
\end{center}
\caption{Plot of reaction rates versus concentration of $S_1$ and different values for $k_2$ for the system $\text{X}_o \rightarrow \text{S}_1 \rightarrow \text{X}_1$. The darker horizontal line represents $v_1$ and the sloped lines $v_2$ at different values of $k_2$. The intersection of the two lines marks the steady state point where $v_1 = v_2$. $X_o = 1, k_1 = 0.4$. Note that as $k_2$ decreases the steady state level of $S_1$ increases.} \label{fig:SimpleSteadyState}
\end{figure}
```

Note that the reaction rate for $v_1$ is a horizontal line because it is unaffected by changes in $S_1$ (no product inhibition). The second reaction, $v_2$, is shown as a straight line with slope, $k_2$. Notice that the lines intersect. The intersection marks the point when both rates $v_1$ and $v_2$ are equal, that is when $dS_1/dt=0$ since $v_1 = v_2$.  This point marks the steady state concentration of $S_1$.  By varying the value of $k_2$, we can observe the effect it has on the steady state. For example, Figure [Figure: Plot of reaction rates versus concentration of $S_1$ and different val](#fig-simplesteadystate) shows that as we *decrease* $k_2$, the concentration of $S_1$ *increases*. This should not be difficult to understand; as $k_2$ decreases, the activity of reaction $v_2$ also decreases. This causes $S_1$ to build up in response.

In this simple model it is also straightforward to determine the steady state of $S_1$ mathematically which amounts to finding a mathematical equation to represent the intersection point of the two lines. Recall that the model for this system is a single differential equation:

$$
\begin{eqnarray*}
\frac{dS_1}{dt} &=& k_1 X_o - k_2 S_1
\end{eqnarray*}
$$

At steady state, set $dS_1/dt = 0$, from which we can solve for the steady state concentration
of $S_1$:

$$
\begin{equation}
S_1 = \frac{k_1 X_o}{k_2}
\label{eqn:simpleSSSolution_12}
\end{equation}
$$

This solution tells us that the steady state concentration of $S_1$ is a function of *all* the parameters in the system. We can also determine the steady state rate, usually called the pathway flux denoted by J, by inserting the steady state value of $S_1$ into one of the rate laws, for example into $v_2$:

$$ J = k_2 \frac{k_1 X_o}{k_2} = k_1 X_o $$

This answer is identical to $v_1$ which is not surprising since the pathway flux is completely determined by the first step, and the second step has no influence whatsoever on the steady state flux. This simple example illustrates a classical `rate limiting step' in the pathway; that is one step, and one step only, has complete influence over the pathway flux.

### A More Complex Model

A slightly more realistic model is the following:

```latex
\begin{tikzpicture}[scale=0.8]
  \draw(28pt,65pt) node[anchor=west] {\Large $X_o$};

  \draw[color=blue,latex-latex,line width=1.7pt] (60pt,65pt) -- (95pt,65pt);
  \draw(64pt,78pt) node[anchor=west] {\large $v_1$};
  \draw(93pt,65pt) node[anchor=west] {\Large $S_1$};

  \draw[color=blue,-latex,line width=1.7pt] (120pt,65pt) -- (155pt,65pt);
  \draw(124pt,78pt) node[anchor=west] {\large $v_2$};
  \draw(151pt,65pt) node[anchor=west] {\Large $S_2$};

  \draw[color=blue,-latex,line width=1.7pt] (180pt,65pt) -- (215pt,65pt);
  \draw(183pt,78pt) node[anchor=west] {\large $v_3$};
  \draw(211pt,65pt) node[anchor=west] {\Large $X_1$};
\end{tikzpicture}
```

where the rate law for the first step is now reversible and given by:

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

The steady state flux, $J$, can be determined by inserting one of the solutions into the appropriate rate law. The easiest method is to insert the steady state level of $S_2$ into $v_3$ to yield:

$$ J = \frac{k_3 k_1 X_o}{k_2 + k_3} $$

Once the first step is reversible, we see that the steady state flux is a function of all the parameters except $k_4$, indicating that the first step is no longer the rate limiting step. The equation shows that the ability to influence the flux is shared between the first and second steps. There is no rate limiting step in this pathway. Note that if we set $k_2 = 0$, then the solution reverts to the earlier simpler model, $J = k_1 X_o$.

We can also make all three steps reversible ($k_f S_i - k_r S_{i+1}$), so that the solution is given by:

$$
\begin{eqnarray*}
S_1 &=& \frac{X_o k_1 (k_4 + k_5) + X_1 k_4 k_6}{k_3 k_5 + k_2 (k_4 + k_5)} \\[5pt]
S_2 &=& \frac{X_1 k_6 (k_2 + k_3) + X_o k_1 k_3}{k_3 k_5 + k_2 (k_4 + k_5)} \\
\end{eqnarray*}
$$

The last example illustrates the increase in complexity of deriving a mathematical solution after only a modest increase in model size. In addition, once more complex rate laws are used, such as Hill equations or Michaelis-Menten type rate laws, the solutions become exceedingly difficult to derive. As a result, steady states tend to be computed numerically rather than analytically.

## Effect of Different Kinds of Perturbations

When we refer to model dynamics, we are considering how species levels and reaction rates change over time as the model evolves. There are a number of ways to elicit a dynamic response in a model. The two we will consider here are perturbations to species and to model parameters around the steady state.

### Effect of Perturbing Floating Species

Consider a two step pathway of the following form:

```latex
\begin{tikzpicture}
  \draw(4pt,65pt) node[anchor=west] {\Large $X_o$};

  \draw[color=blue,-latex,line width=1.7pt] (30pt,65pt) -- (80pt,65pt);
  \draw(28pt,80pt) node[anchor=west] {$v_1=k_1 Xo$};
  \draw(81pt,65pt) node[anchor=west] {\Large $S_1$};

  \draw[color=blue,-latex,line width=1.7pt] (103pt,65pt) -- (153pt,65pt);
  \draw(98pt,80pt) node[anchor=west] {$v_2=k_2 S_1$};
  \draw(153pt,65pt) node[anchor=west] {\Large $X_1$};
\end{tikzpicture}
```

Assume that $X_o$ and $X_1$ are fixed. If the initial concentration of $S_1$ is zero, we can run a simulation and allow the system to come to steady state. This is illustrated in Figure [Figure: Species $S_1$ approaching steady state](#fig-evolvetoss-modeldynamics).

**Figure** <a id="fig-evolvetoss-modeldynamics"></a> `fig:evolveToSS_ModelDynamics`

*Caption:* Species $S_1$ approaching steady state. Tellurium Listing: `jarnac:evolveToSS_ModelDynamics`.

```latex
\begin{figure}[htp]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Concentration of $S_1$},
xmin=0,
xmax=20,
ymin=0,
ymax=0.6,
width=9cm,
height=6cm]
\addplot[color=red,line width=1.5pt] plot table[x index=0,y index=1]{evolveToSS_ModelDynamics.dat};

\draw[thick,-latex] (axis cs:10,0.3) -- (axis cs:10,0.45);
\node at (axis cs:10,0.2) {$S_1$ approaching steady state};

\end{axis}
\end{tikzpicture}
\caption{Species $S_1$ approaching steady state. Tellurium Listing:~\ref{jarnac:evolveToSS_ModelDynamics}.}
\label{fig:evolveToSS_ModelDynamics}
\end{figure}
```

Once at steady state, we can consider applying perturbations to see what happens. For example, Figure [Figure: Stability of a simple biochemical pathway at steady state](#fig-speciesperturbationa) illustrates the effect of injecting 0.35 units of $S_1$ at $t=20$ and watching the system respond. What we observe is that the concentration of $S_1$ immediately jumps by the amount 0.35, then relaxes back to the steady state concentration it had before perturbation (Figure [Figure: Stability of a simple biochemical pathway at steady state](#fig-speciesperturbationa)). When we apply perturbations to species concentrations and the change relaxes back to the original state, we call the system **stable**. We will return to this topic in another section.

Figure [Figure: Stability of a simple biochemical pathway at steady state](#fig-speciesperturbationa) illustrates perturbing one of the floating molecular species by physically adding a specific amount of the substance to the pathway. In many cases we will find that the system will fully recover. We are not limited to single perturbations; Figure [Figure: Multiple Perturbations](#fig-multiplespeciesperturbations) shows multiple perturbations, both positive and negative. Not all systems show recovery like this and those that do not are called **unstable**. That is, when we perturb a species concentration, instead of the perturbation relaxing back, it begins to diverge.

**Figure** <a id="fig-speciesperturbationa"></a> `fig:SpeciesPerturbationA`

*Caption:* Stability of a simple biochemical pathway at steady state. The steady state concentration of the species $S_1$ is 0.5. A perturbation is made to $S_1$ by adding an additional 0.35 units of $S_1$ at time $= 20$. The system is considered stable because the perturbation relaxes back to the original steady state. Tellurium model: `jarnac:SpeciesPerturbation`.

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Concentration of $S_1$},
xmin=0, xmax=50,
ymin=0, ymax=1,
width=10cm,
height=6cm]
\addplot[color=red,line width=1.5pt] plot table[x index=0,y index=1]{perturbS1.dat};
%\addplot[color=blue,line width=1.5pt] plot table[x index=0,y index=1]{perturbk1.dat};
\node at (axis cs:40,0.41) {$S_1$ Decays Back};
%\node at (axis cs:40,0.78) {Change in $k_1$};

\draw[thick,-latex] (axis cs:20,0.3) -- (axis cs:20,0.45);
\node at (axis cs:20,0.2) {Perturbation in $S_1$};

\end{axis}
\end{tikzpicture}
\caption{Stability of a simple biochemical pathway at steady state. The steady state concentration of the species $S_1$ is 0.5. A perturbation is made to $S_1$ by adding an additional 0.35 units of $S_1$ at time $= 20$. The system is considered stable because the perturbation relaxes back to the original steady state. Tellurium model:~\ref{jarnac:SpeciesPerturbation}.}
\label{fig:SpeciesPerturbationA}
\end{figure}
```

**Figure** <a id="fig-multiplespeciesperturbations"></a> `fig:MultipleSpeciesPerturbations`

*Caption:* Multiple Perturbations. The steady state concentration of the species $S_1$ is 0.5, and a perturbation is made to $S_1$ by adding an additional 0.35 units of $S_1$ at time $=20$ and removing 0.35 units at time $=40$. In both cases the system relaxes back. Tellurium script: `jarnac:MultipleSpeciesPerturbations`.

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Concentration of $S_1$},
xmin=0, xmax=60,
ymin=0, ymax=1,
width=10cm,
height=6cm]
\addplot[color=red,line width=1.5pt] plot table[x index=0,y index=1]{ModelDynamicsMultiplePerturbationsS1.dat};

\draw[thick,-latex] (axis cs:20,0.3) -- (axis cs:20,0.45);
\node at (axis cs:20,0.2) {Positive Perturbation in $S_1$};

\draw[thick,-latex] (axis cs:40,0.70) -- (axis cs:40,0.55);
\node at (axis cs:40,0.75) {Negative Perturbation in $S_1$};

\end{axis}
\end{tikzpicture}
\caption{Multiple Perturbations. The steady state concentration of the species $S_1$ is 0.5, and a perturbation is made to $S_1$ by adding an additional 0.35 units of $S_1$ at time $=20$ and removing 0.35 units at time $=40$. In both cases the system relaxes back. Tellurium script:~\ref{jarnac:MultipleSpeciesPerturbations}.}
\label{fig:MultipleSpeciesPerturbations}
\end{figure}
```

### Effect of Perturbing Species in a Conserved Cycle

Section [[03_stoichiometric_networks|Moiety Conserved Cycles]] introduced the idea of the conserved cycle, groups of species whose total mass is conserved during the evolution of a network. Figure [Figure: Simple cycle where $S_1 + S_2$ is constant](#fig-simpleconservedcyclec) shows the simplest conserved cycle where the total mass, $S_1 + S_2$, is constant throughout the systems's evolution. Figure [Figure: Perturbation in $S_1$ for cycle network \ref{fig:SimpleConservedCycleC](#fig-perturbconservedcycle) shows a simulation where $S_1$ is perturbed by one unit. This causes the total mass in the cycle to increase and results in a net change to the steady state.

**Figure** <a id="fig-simpleconservedcyclec"></a> `fig:SimpleConservedCycleC`

*Caption:* Simple cycle where $S_1 + S_2$ is constant.

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}[scale=1.5]
\draw(38pt,50pt) node[anchor=west] {\LARGE $S_1$};
\draw(102pt,50pt) node[anchor=west] {\LARGE $S_2$};

\draw[-stealth,color=blue,line width=2.4pt] (50pt,60pt) to [controls=+(50:1) and +(130:1)] (110pt,60pt);
\draw[stealth-,color=blue,line width=2.4pt] (50pt,40pt) to [controls=+(130:-1) and +(50:-1)] (110pt,40pt);

\draw(72pt,15pt) node[anchor=west] {\Large $v_1$};
\draw(72pt,85pt) node[anchor=west] {\Large $v_2$};

\end{tikzpicture}
%
\caption{Simple cycle where $S_1 + S_2$ is constant.}
\label{fig:SimpleConservedCycleC}
\end{figure}
```

**Figure** <a id="fig-perturbconservedcycle"></a> `fig:PerturbConservedCycle`

*Graphic (not in the LaTeX source, referenced by name): `PerturbConservedCycle`*

*Caption:* Perturbation in $S_1$ for cycle network [Figure: Simple cycle where $S_1 + S_2$ is constant](#fig-simpleconservedcyclec). Because the conserved total $S_1 + S_2$ changes, the steady state changes after the perturbation.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale=0.5]{PerturbConservedCycle}
  \caption{Perturbation in $S_1$ for cycle network~\ref{fig:SimpleConservedCycleC}. Because the conserved total $S_1 + S_2$ changes, the steady state changes after the perturbation.} \label{fig:PerturbConservedCycle}
\end{figure}
```

### Effect of Perturbing Model Parameters

In addition to perturbing floating species, we can also perturb model parameters. Such parameters include kinetic constants and inputs such as boundary species or addition of other effectors such as drugs. We can change a parameter in either two ways: make a permanent change, or make a change and at some later point return the parameter to its original value. If we make a permanent change, the steady state will invariably also show a permanent change. A temporary change will result in the steady state changing, and then recovering to the original state once the parameter is changed back. Figure [Figure: Effect of Perturbing Model Parameters](#fig-perturbingparameters) shows the effect of perturbing the rate constant, $k_1$, and then restoring the parameter to its original value at some later time point.

We can also consider other types of perturbations. For example, in studying the infusion of a drug where the drug concentration is a model parameter, one might use a slow linear increase in concentration. Such a perturbation is called a **ramp**. More sophisticated methods might require a sinusoidal change in a parameter, an **impulse**, a **pulse**, or an exponential change. The main point to remember is that parameter changes will usually result in changes to the steady state concentrations and fluxes.

**Figure** <a id="fig-perturbingparameters"></a> `fig:PerturbingParameters`

*Caption:* Effect of Perturbing Model Parameters. Tellurium script: `jarnac:chap:PerturbingParameters`. 

```latex
\begin{figure}[htpb]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Concentration of $S_1$},
xmin=0,
xmax=80,
ymin=0,
ymax=1,
width=10cm,
height=6cm]
\addplot[color=blue,line width=1.5pt] plot table[x index=0,y index=1]{perturbk1UpDown.dat};

\draw[thick,-latex] (axis cs:20,0.3) -- (axis cs:20,0.45);
\node at (axis cs:20,0.2) {Perturbation in $k_1$};

\draw[thick,-latex] (axis cs:50,0.5) -- (axis cs:50,0.65);
\node at (axis cs:52,0.4) {$k_1$ Restored to Original Value};

\end{axis}
\end{tikzpicture}
\caption{Effect of Perturbing Model Parameters. Tellurium script:~\ref{jarnac:chap:PerturbingParameters}. }
\label{fig:PerturbingParameters}
\end{figure}
```

For completeness, Figure [Figure: Effect of Perturbing Model Parameters and Species Concentration](#fig-perturbingparametersandspecies) shows what happens when we perturb both a parameter and a species concentration. As expected, the species concentration does not recover to the original steady state.

**Figure** <a id="fig-perturbingparametersandspecies"></a> `fig:PerturbingParametersAndSpecies`

*Caption:* Effect of Perturbing Model Parameters and Species Concentration.

```latex
\begin{figure}[htpb]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Concentration of $S_1$},
xmin=0,
xmax=40,
ymin=0,
ymax=1,
width=10cm,
height=6cm]
\addplot[color=blue,line width=1.5pt] plot table[x index=0,y index=1]{perturbk1S2.dat};

%\draw[thick,-latex] (axis cs:20,0.3) -- (axis cs:20,0.45);
%\node at (axis cs:20,0.2) {Perturbation in $k_1$};

%\draw[thick,-latex] (axis cs:50,0.5) -- (axis cs:50,0.65);
%\node at (axis cs:52,0.4) {$k_1$ Restored to Original Value};
\end{axis}
\end{tikzpicture}
\caption{Effect of Perturbing Model Parameters and Species Concentration.}
\label{fig:PerturbingParametersAndSpecies}
\end{figure}
```

## Computing the Steady State

In those (many) cases where we cannot derive an analytical solution for the steady state, we must revert to numerical methods. There are at least two available methods. The simplest approach is to run a time-course simulation for a sufficiently long period such that the trajectories eventually reach steady state. This method works so long as the steady state is stable; it cannot be used to locate unstable steady states because such trajectories diverge. In addition, the method can sometimes be very slow to converge depending on the model kinetics. As a result, many simulation packages will provide an alternative method for computing the steady state where the model differential equations are set to zero, and the resulting equations solved for the concentrations. This type of problem is quite common in many fields and is often represented mathematically in the following form:

$$
\begin{equation}
f (x, p) = 0
\label{eqn:algebraicEquation}
\end{equation}
$$

where $x$ is the unknown, and $p$ one or more parameters in the equations. The model differential equations can be turned into this form by setting them to zero.

All numerical methods for computing solutions to equation [Computing the Steady State](#eqn-algebraicequation) start with an initial estimate for the solution, say $x_1$. The method is then applied iteratively until the estimate converges on the solution. One of the most well known methods for solving equation [Computing the Steady State](#eqn-algebraicequation) is called the **Newton-Raphson method**. It can be easily explained using a geometric argument as shown in Figure [Figure: The geometry of Newton-Raphson's method](#fig-newtonrasphon). Suppose $x_1$ is the initial guess for the solution to equation [Computing the Steady State](#eqn-algebraicequation). The method begins by estimating the slope of equation [Computing the Steady State](#eqn-algebraicequation) at the value $x_1$, that is $\df/\dx$. A line is then drawn from the point ($x_1, f(x_1)$), with slope $\df/\dx$, until it intersects the $x$ axis. The intersection, $x_{2}$, becomes the next guess for the method. This procedure is repeated until $x_i$ is sufficiently close to the solution. For brevity, the parameter, $p$, is omitted from the following equations. From the geometry shown in Figure [Figure: The geometry of Newton-Raphson's method](#fig-newtonrasphon) one can express the slope of the line, $\partial f/\partial x_1$ as:

$$ \frac{\partial f}{\partial x_1} = \frac{f (x_1)}{x_1 - x_2} $$

This can be generalized to:

$$ \frac{\partial f}{\partial x_k} = \frac{f (x_k)}{x_k - x_{k+1}} $$

**Figure** <a id="fig-newtonrasphon"></a> `fig:NewtonRasphon`

*Graphic (not in the LaTeX source, referenced by name): `NewtonRaphson`*

*Caption:* The geometry of Newton-Raphson's method.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale=0.5]{NewtonRaphson}
  \caption{The geometry of Newton-Raphson's method.} \label{fig:NewtonRasphon}
\end{center}
\end{figure}
```

or by rearrangement as:

\stateComment{

$$
\begin{equation}
x_{k+1} = x_k - \frac{f(x_k)}{\partial f/\partial x_k}
\label{eqn:SimpleNewRaphson}
\end{equation}
$$

}

In equation [Computing the Steady State](#eqn-simplenewraphson) we see the iterative nature of the algorithm.

Before the advent of electronic calculators with a specific square root button, calculator users would exploit the Newton method to estimate square roots. For example, if the square root of a number, $a$, is equal to $x$, that is $\sqrt{a} = x$, then it is true that:

$$ x^2 - a = 0 $$

This equation looks like an equation of the form [Computing the Steady State](#eqn-algebraicequation). We can therefore apply the Newton formula, equation [Computing the Steady State](#eqn-simplenewraphson), to this equation to obtain:

$$
\begin{align}
 x_{k+1} = \frac{1}{2} \left( x_k + \frac{a}{x_k} \right)
 \label{eqn:NRSquareRoot}
\end{align}
$$

Table [Table: Newton method used to compute the square root of 25, using equation \e](#tble-newtonraphson-25) shows a sample calculation using this equation to compute the
square root of 25. Note that only a few iterations are required to reach convergence.

\setlength{\doublerulesep}{\arrayrulewidth}

**Table** <a id="tble-newtonraphson-25"></a> `tble:NewtonRaphson:25`

*Caption:* Newton method used to compute the square root of 25, using equation [Computing the Steady State](#eqn-nrsquareroot) with a starting value of 15.

```latex
\begin{table}[htb]
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
\caption{Newton method used to compute the square root of 25, using equation~\eqref{eqn:NRSquareRoot} with a starting value of 15.}
\label{tble:NewtonRaphson:25}
\end{table}
```

One important point to bear in mind is that the Newton-Raphson method is not guaranteed to converge to the solution. The solution depends heavily on the starting point and the nature of the system. In order to prevent the method from continuing without end in the case when convergence fails, it is often useful to halt the method after a maximum of iterations (say 100). In a case like this, a new initial start is given and the method is repeated. In biochemical models we can always run a time-course simulation for a short while and use the end point of that as the starting point for the Newton method. This approach is much more reliable because we are staring the Newton-Raphson closer to the solution. If the method does converge to a solution, there are various ways to decide whether convergence has been achieved. Two such tests include:

- Difference between successive solution estimates. We can test for the difference between solution, $x_i$, and the next estimate, $x_{i+1}$, if the absolute difference, $| x_i - x_{i+1}|$, is below some threshold. At this point we assume convergence has been achieved. Alternatively, we can check whether the relative error is less than a certain threshold (say, 1%). The relative error is given by:

$$ \epsilon = \frac{x_{i+1} - x_i}{x_{i+1}} \times 100% $$

The procedure can be made to stop at the $i$-th step if $ \vert f(x_i)\vert< \epsilon_f$ for a given $\epsilon_f$.

- Difference between successive $d\!S_i/dt$ estimates. Here we estimate the rates of change as the iteration proceeds, and assume convergence has been achieved when the difference between two successive rates of change are below some threshold. The threshold will usually be some small number for example $10^{-6}$ or less. If we are dealing with a model that has more than one state variable, we can construct the sums of squares of the rates of change:

    $$ \sum \left( \frac{d\!S_i}{dt} \right)^2 $$

<!-- Successive values of $x_i$ are close to each other (hence, we are -->
<!-- approaching the root probably), i.e., stop the procedure if $ \vert -->
<!-- x_{i+1} - x_i\vert < \epsilon_x$ for given $\epsilon_x$. -->

The Newton method can be easily extended to systems of equations so that we express the Newton method in matrix form:

\stateComment{

$$
\begin{equation}
\bx_{k+1} = \bx_k - \left[ \frac{\partial\!\bff (\bx)}{\partial\bx} \right]^{-1} \bff(\bx_k)
\label{eqn:NewtonRaphsonMatrix}
\end{equation}
$$

}

If $m$ is the number of state variables or floating species in the model, then $\bx_k$ is an $m$ dimensional vector of species concentrations, $\bff(\bx)$ is a vector containing the $m$ rates of change, and $\partial\!\bff(\bx)/\partial \bx$ the $m \times m$ matrix called the Jacobian matrix (See [[13_stability|Stability]]). Note that the Jacobian must be invertible, this is equivalent to the division in the one variable form ([Computing the Steady State](#eqn-nrsquareroot)).

\stateHighlight{
**Jacobian Matrix**

The Jacobian is a common matrix used in many fields especially control theory and dynamical systems theory. We will frequently use it in this book. Given a set of equations:

$$
\begin{align*}
y_1 &= f_1 (x_1, \ldots, x_n) \\
y_2 &= f_2 (x_1, \ldots, x_n) \\
\vdots & \\
y_m &= f_m (x_1, \ldots, x_n) \\
\end{align*}
$$

The Jacobian matrix is defined as the matrix of partial differentials:
$$\bJ =
\begin{bmatrix}
\displaystyle\frac{\partial f_1}{dx_1} & ... & \displaystyle\frac{\partial f_1}{\dx_n}   
\vdots & \ddots & \vdots   
\displaystyle\frac{\partial f_m}{dx_1} & ... & \displaystyle\frac{\partial f_m}{\dx_n}   
\end{bmatrix}
$$
}

**Newton Algorithm**

- 1. Initialize the values of the concentrations, $\bx$, to some initial guess obtained perhaps from a short time-course simulation.
- 2. Compute the values for $\bff (\bx)$, that is the left-hand side of the differential equation ($\bdx/\bdt$).
- 3. Calculate the matrix of derivatives, $\partial\!\bff/\partial \bx$, that is $d(\bdx/\bdt)/\bdx$, at the current estimate for $\bx$.
- 4. Compute the inverse of the matrix, $\partial\!\bff/\partial \bx$.
- 5. Using the information calculated so far, compute the next guess, $\bx_{k+1}$.
- 6. Compute the sums of squares of the new value of $\bff (\bx)$ at $\bx_{k+1}$. If the value is less than some error tolerance, assume the solution has been reached, else return to step 3 using $\bx_{k+1}$ as the new starting point.

Although the Newton method is seductively simple, it requires the initial guess to be sufficiently close to the solution in order for it to converge. In addition, convergence can be slow or not occur at all. A common problem is that the method can overshoot the solution and will then begin to rapidly diverge.

As mentioned previously, another strategy that is frequently used to compute the steady state is to first use a short time-course simulation to bring the
initial estimate closer to the steady state. The assumption here is
that the steady state is stable. The final point computed in the
time-course is used to seed a Newton-like method. If the Newton
method fails to converge, a second time-course simulation is
carried out. This can be repeated as many times as desired. If there
is suspicion that the steady state is unstable, one can also attempt to run a
time-course simulation backwards in time. In general however, there is no
sure way of computing the steady state automatically, and sometimes
human intervention is required to supply good initial estimates.

As a result of these issues, the unmodified Newton method is rarely used in practice for computing the steady state of biochemical models. One common variant, the **Damped Newton method**, is more commonly employed. Both Gepasi and SCAMP use the Damped Newton method for computing the steady state. This method controls the derivative $d\!f/d\!x$, by multiplying it by a factor $\alpha$. To prevent overshoot we can limit the range: $(0 < \alpha < 1$. There are many variants on the basic Newton method and good simulation software will usually apply these for estimating the steady state.

In the last ten years more refined Newton-like methods have been devised, and one that is highly recommended is NLEQ2(footnote: <http://www.zib.de/en/numerik/software/ant/nleq2.html>}. This is used by both Tellurium [sauro:2000], PySCeS [Pysces2005] and roadRunner [bergmann2006computational, sauro2008standards, SaurolibRoadRunner2015] for computing the steady state. The stiff solver suite sundials (footnote: <https://computation.llnl.gov/casc/sundials/main.html>} also incorporates an equation solver, however in the author's own experience it does not appear to be quite as good as NLEQ2. Although the sundials suite continues to be updated and may now be much better.

### Solving the Steady State for a Simple Pathway

Let's illustrate the use of the Newton-Raphson method to solve the steady state for the following simple pathway. Assume that all three reactions are governed by simple mass-action reversible rate laws. Species $X_o$ and $X_1$ are assumed to be fixed, and only $S_1$ and $S_2$ are floating species.

```latex
\begin{tikzpicture}[scale=0.8]
  \draw(29pt,65pt) node[anchor=west] {\Large X$_o$};

  \draw[color=blue,-latex,line width=1.7pt] (60pt,65pt) -- (95pt,65pt);
  \draw(65pt,78pt) node[anchor=west] {\large $v_1$};
  \draw(92pt,65pt) node[anchor=west] {\Large S$_1$};

  \draw[color=blue,-latex,line width=1.7pt] (120pt,65pt) -- (155pt,65pt);
  \draw(124pt,78pt) node[anchor=west] {\large $v_2$};
  \draw(152pt,65pt) node[anchor=west] {\Large S$_2$};

  \draw[color=blue,-latex,line width=1.7pt] (180pt,65pt) -- (215pt,65pt);
  \draw(184pt,78pt) node[anchor=west] {\large $v_3$};
  \draw(213pt,65pt) node[anchor=west] {\Large X$_1$};
\end{tikzpicture}
```

The differential equations for the model are as follows:

$$
\begin{equation}
\label{eqn:SolvingSSExample}
\begin{split}
\frac{dS_1}{dt} = (k_1 X_o - k_2 S_1) - (k_3 S_1 - k_4 S_2) \\[4pt]
\frac{dS_2}{dt} = (k_3 S_1 - k_4 S_2) - (k_5 S_2 - k_6 X_1)
\end{split}
\end{equation}
$$

The values for the rate constants and the boundary conditions are given in Table [Table: Values for example \eqref{eqn:SolvingSSExample}](#tbl-valuesforsolvingss).

**Table** <a id="tbl-valuesforsolvingss"></a> `tbl:ValuesForSolvingSS`

*Caption:* Values for example [Solving the Steady State for a Simple Pathway](#eqn-solvingssexample).

```latex
\begin{table}[htb]
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
\caption{Values for example~\eqref{eqn:SolvingSSExample}.}
\label{tbl:ValuesForSolvingSS}
\end{center}
\end{table}
```

This is a problem with more than one variable ($S_1$ and $S_2$) which means we must use the Newton-Raphson matrix form [Computing the Steady State](#eqn-newtonraphsonmatrix) to estimate the steady state. To use this we require two vectors, $\bx_k$ and $\bff(\bx_k)$ and one matrix, $\partial \bff (\bx)/\partial \bx$. The $\bx_k$ vector is simply:

$$ \bx_k = \begin{bmatrix}
S_1   
S_2   
\end{bmatrix} $$

The $\bff(\bx_k)$ vector is given by the values of the differential equations:

$$ \bff(\bx_k) = \begin{bmatrix}
(k_1 X_o - k_2 S_1) - (k_3 S_1 - k_4 S_2)   
(k_3 S_1 - k_4 S_2) - (k_5 S_2 - k_6 X_1)   
\end{bmatrix} $$

The $\partial \bff (\bx)/\partial \bx$ matrix is the two by two **Jacobian matrix**. The elements of the Jacobian require the derivative to be computed. Software can estimate the derivatives numerically when more complex rate laws are applied. In this case however, it is easy to differentiate the equations to obtain the following Jacobian matrix:

$$
\frac{\partial \bff (\bx)}{\partial \bx} =
\begin{bmatrix}
\displaystyle\frac{d(dS_1/dt)}{dS_1} & \displaystyle\frac{d(dS_1/dt)}{dS_2}\\[14pt]
\displaystyle\frac{d(dS_2/dt)}{\dS_1} & \displaystyle\frac{d(dS_2/dt)}{dS_2}
\end{bmatrix}
=
\begin{bmatrix}
-k_2 - k_3 & k_4 \\[4pt]
k_3 & -k_4 - k_5
\end{bmatrix}
$$

Notice that the elements of the Jacobian contain only rate constants. This is because the model is linear. This also means we need only evaluate the Jacobian and its inverse once, since the entries are constant. If we used nonlinear rate laws such as the Michaelis-Menten rate law, the Jacobian matrix would also contain terms involving species concentrations. In this case the Jacobian would need to be reevaluated at each iteration because the value for the species concentration will change at each iteration. For the current problem the Jacobian and its inverse is given by:

$$Jacobian = \begin{bmatrix}
-2.5 & 0.56   
2.3 & -6.16
\end{bmatrix}
$$

$$
Jacobian^{-1} =
\begin{bmatrix}
-0.436508 &  -0.0396825  
 -0.162982 &  -0.177154
\end{bmatrix}
$$

Table [Table: Newton-Raphson applied to a Three Step Pathway with Linear Kinetics](#tbl-newtonexample) shows the progress of the iteration as we apply equation [Computing the Steady State](#eqn-newtonraphsonmatrix). What is interesting is that convergence only takes one iteration. This is because the model is linear. Nonlinear models may require more iterations. We can also see that after the first iteration, the rates of change have very small values. This is usually due to very small numerical errors in the computer arithmetic, but anything as small as $10^{-14}$ may be considered zero.

14.84126984  5.54138322

**Table** <a id="tbl-newtonexample"></a> `tbl:NewtonExample`

*Caption:* Newton-Raphson applied to a Three Step Pathway with Linear Kinetics. Starting values for $S_1$ and $S_2$ are both set at one. Convergence occurs within one iteration. Note that the values for the rates of change are extremely small at the end of the first iteration, indicating we have converged.

```latex
\begin{table}[htb]
\begin{center}
\begin{tabular}{lllll}\toprule
Iteration & $S_1$ & $S_2$ & $dS_1/dt$ & $dS_2/dt$ \\\midrule
0         & 1 & 1 & 32.06 & -3.86\\
1         & 14.841 & 5.541 & $-3.55.8 \times 10^{-15}$ & $3.55 \times 10^{-15}$ \\\bottomrule
\end{tabular}
\end{center}
\caption{Newton-Raphson applied to a Three Step Pathway with Linear Kinetics. Starting values for $S_1$ and $S_2$ are both set at one. Convergence occurs within one iteration. Note that the values for the rates of change are extremely small at the end of the first iteration, indicating we have converged.}
\label{tbl:NewtonExample}
\end{table}
```

### Computing the Steady State Using Software

The previous section showed how to compute the steady state using the Newton method. In practice we would not write our own solver, but instead use existing software to accomplish the same thing. To illustrate this, the following Tellurium script will define and compute the steady state all at once:

```python
import tellurium as te

r = te.loada ('''
     $Xo -> S1; k1*Xo - k2*S1;
     S1 -> S2;  k3*S1 - k4*S2;
     S2 -> $X1; k5*S2 - k6*X1;

    // Initialize value
    Xo = 10; X1 = 0;
    k1 = 3.4; k2 = 0.2;
    k3 = 2.3; k4 = 0.56;
    k5 = 5.6; k6 = 0.12;

    // Initial starting point
    S1 = 1; S2 = 1;
''')

# Compute steady state
print (r.getSteadyStateValues())

# Newton-Raphson Code
guess = np.array([1.0,1.0])
for i in range (3):
    print ('Current best estimate: ', guess)
    # Assign x to model variables so we get
    # an update to the getRatesOfChange
    # Note in this case the Jacobian is a constant so
    # we don't really have to compute it every time, but
    # in general you would. In this case the mode is linear
    # which is what makes the Jacobian a constant (just ks)
    r.S1 = guess[0]
    r.S2 = guess[1]
    Jac = r.getFullJacobian()
    guess = guess - np.linalg.inv (Jac)@r.getRatesOfChange()
```

Running the above script yields steady state concentrations of 13.1783 and 0.658915 for $S_1$ and $S_2$, respectively. This is the same if we compare these values to those in Table [Table: Newton-Raphson applied to a Three Step Pathway with Linear Kinetics](#tbl-newtonexample). Other tools will have other ways to compute the steady state, for example graphical interfaces will generally have a button marked `steady state' that can be selected.

When using Matlab, the function `fsolve` can be use to solve systems of nonlinear equation. In Mathematica one would use `FindRoot`.

### Effect of Conserved Cycles

Consider the conserved cycle in Figure [Figure: Simple cycle where $S_1 + S_2$ is constant](#fig-simpleconservedcyclec). If we assume simple mass-action kinetics for the two rates, $v_1$ and $v_2$, then we can write the differential equations for the system as:

$$
\begin{align*}
\frac{dS_1}{dt} = k_2 S_2 - k_1 S_1 \\[6pt]
\frac{dS_2}{dt} = k_1 S_1 - k_2 S_2
\end{align*}
$$

From these equations it should be apparent that $dS_1/dt = dS_2/dt$ due to the conservation law, $S_1 + S_2 = T$. To compute the steady state for the system, we must compute the Jacobian:

$$ \bJ =
\begin{bmatrix}
-k_1 & \phantom{-}k_2   
\phantom{-}k_1 & -k_2   
\end{bmatrix}
$$

Computing the steady state requires the inverse of the Jacobian. However, in this case the Jacobian is singular, that is the rows of the matrix are linearly dependent and the determinant is zero. This means the inverse cannot be computed and therefore we cannot compute the steady state.

$$ Det = -k_1 (-k_2) - k_2 (-k_1) = 0 $$

Any analysis that requires the inversion of the Jacobian will fail for this system, including the Newton-Raphson method. This is characteristic of networks that include moiety conserved cycles. Modern simulation software avoids this problem by eliminating the dependent rows from the Jacobian, essentially splitting the species into two groups, a dependent and independent group. In the case of the simple conserved cycle (Figure [Figure: Simple cycle where $S_1 + S_2$ is constant](#fig-simpleconservedcyclec)), one species becomes the independent species, for example $S_1$, and the other the dependent species, $S_2$. In simulation software it means we only have one differential equation instead of two. The dependent species is computed algebraically from the independent species.

$$
\begin{align*}
S_2 &= T - S_1 \\[6pt]
\frac{dS_1}{dt} &= k_2 S_2 - k_1 S_1
\end{align*}
$$

A more comprehensive discussion of conservation laws and their effects will be reserved for a separate book.

## Introduction to Stability

Biological organisms are continually subjected to perturbations. These perturbations can originate from external influences such as changes in temperature, light, or the availability of nutrients. Perturbations can also arise internally due to the stochastic nature of molecular events or by genetic variation. One of the most remarkable and characteristic properties of living systems is their ability to resist such perturbations and maintain very steady internal conditions. For example the human body can maintain a constant core temperature of 36.8$^\circ$C $\pm 0.7$ even though external temperatures may vary widely. The ability of a biological system to maintain a steady internal environment is called **homeostasis**, a phrase introduced by Claude Bernard almost 150 years ago. Modern authors may also refer to this behavior as **robustness**.

The concept of homeostasis is related to the idea of stability in a dynamical system. While homeostasis refers to the degree to which a system can resist change, stability is related to whether a system can resist change or not. Thus an unstable system cannot resist any change. We can therefore informally define the stability of a system as follows:

\stateHighlight{
A biochemical pathway is dynamically stable at steady state if small perturbations in the floating species concentrations relax back to the steady state.
}

We can illustrate a stable system using a simple two step model. Assume that the two step pathway has the following form:

```latex
\begin{tikzpicture}[scale=0.8]
  \draw(-1pt,65pt) node[anchor=west] {\Large X$_o$};

  \draw[color=blue,-latex,line width=1.7pt] (30pt,65pt) -- (80pt,65pt);
  \draw(22pt,87pt) node[anchor=west] {\small $v_1=k_1 Xo$};
  \draw(76pt,65pt) node[anchor=west] {\Large S$_1$};

  \draw[color=blue,-latex,line width=1.7pt] (103pt,65pt) -- (153pt,65pt);
  \draw(96pt,87pt) node[anchor=west] {$v_2=k_2 S_1$};
  \draw(150pt,65pt) node[anchor=west] {\Large X$_1$};
\end{tikzpicture}
```

Figure [Figure: Stability of a simple biochemical pathway at steady state](#fig-speciesperturbation) illustrates the results from a simulation of a simple two step biochemical pathway with one floating species, S$_1$. The initial concentrations of the model are set so that it is at steady state, that is no transients are seen between $t=0$ and $t=20$. At $t=20$, a perturbation is made to the concentration of S$_1$ by injecting 0.25 units of S$_1$ into the system. The system is now allowed to evolve further. If the system is stable, the perturbation will relax back to the original steady state, as it does in the simulation shown in Figure [Figure: Stability of a simple biochemical pathway at steady state](#fig-speciesperturbation). This system is therefore considered stable.

**Figure** <a id="fig-speciesperturbation"></a> `fig:SpeciesPerturbation`

*Caption:* Stability of a simple biochemical pathway at steady state. The steady state concentration of the species S$_1$ is 0.5. A perturbation is made to S$_1$ by adding an additional 0.25 units of S$_1$ at time $= 20$. The system is considered stable because the perturbation relaxes back to the original steady state. See Listing `jarnac:chap:SpeciesPerturbation` for Tellurium script.

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Concentration of $S_1$},
xmin=0,
xmax=50,
ymin=0,
ymax=1,
width=10cm,
height=6cm]
\addplot[color=red,line width=1.5pt] plot table[x index=0,y index=1]{perturbS1.dat};
%\addplot[color=blue,line width=1.5pt] plot table[x index=0,y index=1]{perturbk1.dat};
\node at (axis cs:40,0.41) {$S_1$ Relaxes back};
%\node at (axis cs:40,0.78) {Change in $k_1$};

\draw[thick,-latex] (axis cs:20,0.3) -- (axis cs:20,0.45);
\node at (axis cs:20,0.2) {Perturbation in $S_1$};

\end{axis}
\end{tikzpicture}
\caption{Stability of a simple biochemical pathway at steady state. The steady state concentration of the species S$_1$ is 0.5. A perturbation is made to S$_1$ by adding an additional 0.25 units of S$_1$ at time $= 20$. The system is considered stable because the perturbation relaxes back to the original steady state. See Listing~\ref{jarnac:chap:SpeciesPerturbation} for Tellurium script.}
\label{fig:SpeciesPerturbation}
\end{figure}
```

The differential equation for the single floating species, $S_1$, is given by:

$$
\begin{align}
\frac{dS_1}{dt} = k_1 Xo - k_2 S_1
%\label{eqn:dfdfdf}
\end{align}
$$

with a steady state solution of:

$$
\begin{equation}
S_1 = k_1 Xo / k_2
\label{equ:simpleSS_SolutionA}
\end{equation}
$$

We know from the simulation in Figure [Figure: Stability of a simple biochemical pathway at steady state](#fig-speciesperturbation) that the system appears to be stable, but can we show this algebraically? If the system is at steady state, let us make a small perturbation to the steady state concentration of $S_1$, $\delta S_1$, and ask what is the new rate of change of $S_1 + \delta S_1$ as a result of this perturbation? That is, what is $d(S_1 + \delta S_1)/dt$? The new rate of change equation is rewritten as follows:

$$ \frac{d(S_1 + \delta S_1)}{dt} = k_1 X_o - k_2 (S_1 + \delta S_1) $$

If we insert the solution for $S_1$, equation [Introduction to Stability](#equ-simpless-solutiona) into the above equation we get:

$$
\begin{equation}
\frac{d\delta S_1}{dt} = -k_2 \delta S_1
\label{eqn:stableExamp1}
\end{equation}
$$

This equation shows us that the rate of change of the disturbance, $\delta S_1$ is *negative*. That is, the system reduces the disturbance so that the system returns back to the original steady state. If the rate of change in $S_1$ had been positive instead of negative, the perturbation would have continued to diverge away from the original steady state and the system would then be considered unstable. We will return to the question of stability in greater detail in the next chapter.

<!-- Dividing both sides of equation~\eqref{eqn:stableExamp1} by $\delta S_1$ and taking the limit $\delta S \rightarrow 0$, we find that $\partial (dS_1/dt)/\partial S_1$ is equal to $-k_2$. The stability of this simple system can therefore be determined by inspecting the sign of $\partial (dS_1/dt)/\partial S_1$ which can be easily determined by taking the derivative of the differential equations with respect to the species concentration. For larger systems the stability of a system can be determined by looking at all the terms $\partial (dS_i/dt)/\partial S_i$. -->

## Sensitivity Analysis

Sensitivity analysis at steady state looks at how particular model variables are influenced by model parameters. There are at least two reasons why it is interesting to examine sensitivities. The first is a practical one. Many kinetic parameters used in building biochemical models can have a significant degree of uncertainty about them. By determining how much a parameter has an influence on the model's state, we can decide whether we should try to improve the parameter's accuracy. A parameter that has considerable influence, but at the same time has significant uncertainty, is a parameter that should be determined more carefully by additional experimentation. On the other hand, a parameter that has little influence but has significant uncertainty associated with it, is relatively unimportant.

The second reason for measuring sensitivities is to provide insight. The degree to which a parameter can influence a variable tells us something about how the network responds to perturbations. Such a study can be used to answer questions about robustness and adaptation.

There are two broad approaches to sensitivity analysis, one is termed local and the other global. We will only look at local sensitivity analysis here.

### Local Sensitivity Analysis

Local sensitivities are defined in two ways, absolute and relative. Absolute sensitivities are given by the ratio of the absolute change in the variable to the absolute change in the parameter. That is:

$$ S = \frac{\Delta V}{\Delta p}  $$

where $V$ is the variable, and $p$ the parameter. This equation uses finite changes to the parameter and variable. Unfortunately, because most systems are nonlinear, the value for the sensitivity will be a function of the size of the finite change. To make the sensitivity independent of the size of the change, the sensitivity is usually defined in terms of infinitesimal changes:

$$ S = \frac{d V}{d p}  $$

Given that the sensitivities only measure perturbations in the immediate vicinity of the reference state, these sensitivities are called local. Although absolute sensitivities are simple, they have one significant drawback. The value can be influenced by the units used to measure the variable and parameter. Often in making experimental measurements, we won't be able to measure the quantity using the most natural units. Instead, we may have measurements in terms of fluorescence, colony counts, staining on a gel, and so on. It is most likely that the variable and parameter units will be quite different, and each laboratory may have its own particular way to express the measurement. Absolute sensitivities are therefore quite difficult to compare, and make reproducibility difficult.

To get around the problem of units, many people use relative sensitivities, These are scaled absolute sensitivities:

$$
\begin{align}
S = \frac{dV}{dp} \frac{p}{V}
\label{eqn:scaledSensitivity}
\end{align}
$$

The sensitivity is defined in terms of infinitesimal changes for the same reason cited before. The reader may also recall that elasticities are also measured this way. Relative sensitivities are immune to the units we use, and they correspond more closely to how many measurements are made, often in terms of relative or fold changes. In practice, steady state relative sensitivities should be measured by taking a measurement at the operating steady state, making a perturbation (preferable a small one), waiting for the system to reach a new steady state, and then measuring the system again. It is important to be aware that steady state sensitivities measure how a perturbation in a parameter moves the system from one steady state to another.

Sensitivities also form the basis for metabolic control analysis [KB73, Fell:Book], which is a framework for understanding how perturbations prop\-agate th\-rough networks.

<!-- \subsection*{Global Sensitivity Analysis} -->

<!-- We will very briefly mention global sensitivity analysis. A significant drawback of local sensitivities is that they strictly refer to infinitesimal changes around a reference state. It is difficult to use local sensitivities to extrapolate to large changes. The reason for this is that the actual sensitivity is a function of the size of the perturbation. -->

## Further Reading

- Tellurium web site <http://tellurium.analogmachine.org>

- Kipp E, Herwig R, Kowald A, Wierling  C and Lehrach H (2005) Systems Biology in Practice, Wiley-VCH Verlag.

- Sauro HM (2011) Enzyme Kinetics for Systems Biology. ISBN: 978-0982477311.

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- \begin{enumerate} -->
<!-- \item Consider the following simple branched network: -->

<!-- \begin{center} -->
<!-- \begin{tikzpicture}[>=latex', node distance=2cm] -->

<!-- \node (S0) {}; -->
<!-- \node [right of = S0] (S1) {\Large S$_1$}; -->
<!-- \node [above right of = S1] (S2) {}; -->
<!-- \node [below right of = S1] (S3) {}; -->

<!-- \draw [->,ultra thick,blue] (S0) -- node[above, black] {$v_1$} (S1); -->
<!-- \draw [->,ultra thick,blue] (S1) -- node[above left, black] {$v_2$} (S2); -->
<!-- \draw [->,ultra thick,blue] (S1) -- node[below left, black] {$v_3$} (S3); -->
<!-- \end{tikzpicture} -->
<!-- \end{center} -->

<!-- where $v_1 = v_o, v_2 = k_1 S_1$ and $v_3 = k_2 S_1$. -->
<!-- \begin{enumerate} -->
<!-- \item Write the differential equation for $S_1$. -->
<!-- \item Derive the equation that describes the steady state concentration for $S_1$. -->
<!-- \item Derive the equations for the steady state fluxes through $v_1$ and $v_2$. -->
<!-- \item Determine algebraically the scaled sensitivity (See equation~\ref{eqn:scaledSensitivity}) of the steady state concentration of $S_1$ with respect to $v_o$ and $k_1$. -->
<!-- \item Explain why the signs of the sensitivity with respect to $v_o$ and $k_1$ are positive and negative, respectively? -->
<!-- \item Assuming values for $v_o = 1; k_1 = 0.5$ and $k_2 = 2.5$, compute the values for the sensitivities with respect to $k_1$ and $k_2$. -->
<!-- \item What happens to the sensitivity with respect to $k_1$ as $k_1$ increases? -->
<!-- \end{enumerate} -->

<!-- CS_k1 = -k1/(k1+k2); CS_vo = 1 -->

<!-- \item Derive equation~\eqref{eqn:NRSquareRoot}. -->

<!-- \item Implement the Newton-Raphson algorithm and use it to find one solution to the quadratic equation: $4 x^2 + 6 x - 8 = 0$. -->
<!-- 0.85078, -2.35078 -->

<!-- \item By changing the initial starting point of the Newton-Raphson algorithm, find the second solution to the quadratic equation from the previous question. -->

<!-- \item Using Tellurium, find the steady state for the following model: -->

<!-- {\tt Xo -> S1; k1*Xo; S1 -> X1; k2*S1; S1 -> X2; k3*S1;} -->

<!-- Assume that {\tt Xo, X1} and {\tt X2} have fixed concentrations with values $Xo=1; X_1 = 0; X_2 = 0$ and rate constants $k_1 = 0.1; k_2 = 0.35; k_3 = 0.45$. Compute the steady state concentration of {\tt S1}. -->

<!-- \item Write a Tellurium script to perturb the value of {\tt Xo} in the above model. Apply the perturbation as a square pulse; that is, the concentration of {\tt Xo} rises, stays constant, then falls back to its original value. Make sure the system is at steady state before you apply the perturbation. -->

<!-- \item Explain what is meant by a stable and unstable steady state. -->

<!-- \item The steady state of a given pathway is stable. Explain the effect in general terms on the steady state if: -->

<!-- a) A bolus of floating species is injected into the pathway. -->

<!-- b) A permanent change is applied to a kinetic constant. -->

<!-- \item Why are scaled sensitivities sometimes more advantageous that unscaled sensitivities? -->

<!-- \item Construct a simple linear pathway with four enzymes as shown below: -->

<!-- \begin{center} -->
<!-- \begin{tikzpicture}[>=latex', node distance=2cm] -->

<!-- \node (S1) {\Large X$_o$}; -->
<!-- \node [right of = S1] (S2) {\Large S$_1$}; -->
<!-- \node [right of = S2] (S3) {\Large S$_2$}; -->
<!-- \node [right of = S3] (S4) {\Large S$_3$}; -->
<!-- \node [right of = S4] (S5) {\Large X$_1$}; -->

<!-- \draw [->,ultra thick,blue] (S1) -- node[above, black] {$v_1$} (S2); -->
<!-- \draw [->,ultra thick,blue] (S2) -- node[above, black] {$v_2$} (S3); -->
<!-- \draw [->,ultra thick,blue] (S3) -- node[above, black] {$v_3$} (S4); -->
<!-- \draw [->,ultra thick,blue] (S4) -- node[above, black] {$v_4$} (S5); -->

<!-- \end{tikzpicture} -->
<!-- \end{center} -->

<!-- Assume that the edge metabolites, X$_o$ and X$_1$, are fixed. Assign reversible Michaelis-Menten kinetics to each step and arbitrary values to the kinetics constants.  Assign a modest value to the boundary metabolite, X$_o$, of 10 mM. Compute the steady state for your pathway. If the software fails to find a steady state, adjust the parameters. Once you have the steady state, use the model to compute the sensitivity of the steady state flux with respect to each of the enzyme maximal activities. You can compute each sensitivity by perturbing each maximal activity and observing what this does to the steady state flux. -->

<!-- How might you use the flux sensitivities in a practical application? Compute the sum of the four sensitivities, what value do you get? Can you make a statement about the sum? -->

<!-- \end{enumerate} -->

## Appendix

See <http://tellurium.analogmachine.org> for more details of Tellurium.

```python
import tellurium as te

# Simulation of a simple closed system
r = te.loada ('''
    A -> B; k1 * A;
    B -> A; k2 * B;

    A = 10; B = 0;
    k1 = 1; k2 = 0.5;
''')

result = r.simulate(0, 3, 100)
r.plot()
```

```python
import tellurium as te

# Simulation of an open system
r = te.loada ('''
    $Xo -> S1; vo;
    S1 -> S2; k1*S1 - k2*S2;
    S2 -> $X1; k3*S2;

    vo = 1
    k1 = 2; k2 = 0; k3 = 3;
''')

result = r.simulate(0, 6, 100)
r.plot()
```

```python
import tellurium as te

# Simple steady state system
r = te.loada ('''
   $Xo -> S1;  k1*Xo;
    S1 -> $X1; k2*S1;

   k1 = 0.2; k2 = 0.4;
   Xo = 1;   S1 = 0.0;
''')

result = r.simulate(0, 20, 100, ["time", "S1",])
# Plot the results and set the y axis limits
r.plot(ylim=(0,0.6))
```

```python
import tellurium as te
import numpy

# Perturbing a species concentration
r = te.loada ('''
      $Xo -> S1;  k1*Xo;
      S1 -> $X1; k2*S1;

      Xo = 1;
      S1 = 0.5;
      k1 = 0.2;
      k2 = 0.4;
''')

# Simulate the first part up to 20 time units
m1 = r.simulate(0, 20, 100, ["time", "S1"])

# Perturb the concentration of S1 by 0.35 units
r.S1 = r.S1 + 0.35

# Continue simulating from last end point
m2 = r.simulate(20, 50, 100, ["time", "S1"])

# Merge and plot the two halves of the simulation
result = numpy.vstack((m1, m2))
te.plotWithLegend(r, result)
```

```python
import tellurium as te
import numpy

# Multiple species perturbations
r = te.loada ('''
    $Xo -> S1;  k1*Xo;
    S1 -> $X1; k2*S1;

    Xo = 1;
    S1 = 0.0;
    k1 = 0.2;
    k2 = 0.4;
''')

# Simulate the first part up to 20 time units
m1 = r.simulate(0, 20, 100, ["time", "S1"])

# Perturb the concentration of S1 by 0.35 units
r.S1 = r.S1 + 0.35

# Continue simulating from last end point
m2 = r.simulate(20, 40, 50, ["time", "S1"])

# Merge the data sets
m3 = numpy.vstack((m1, m2))

# Do a negative perturbation in S1
r.S1 = r.S1 - 0.35

# Continue simulating from last end point
m4 = r.simulate(40, 60, 50, ["time", "S1"])

# Merge and plot the final two halves of the simulation
result = numpy.vstack((m3, m4))
te.plotWithLegend(r, result)
```

```python
import tellurium as te
import numpy
import pylab

r = te.loada ('''
    $Xo -> S1;  k1*Xo;
    S1 -> $X1; k2*S1;

    Xo = 1;
    S1 = 0.5;
    k1 = 0.2;
    k2 = 0.4;
''')

# Simulate the first part up to 20 time units
m1 = r.simulate(0, 20, 5, ["time", "S1"]).copy()

# Perturb the parameter k1
r.k1 = r.k1 * 1.7

# Simulate from the last point
m2 = r.simulate(20, 50, 40, ["time", "S1"]).copy()

# Restore the parameter back to ordinal value
r.k1 = 0.2

# Carry out final run of the simulation
m3 = r.simulate(50, 80, 40, ["time", "S1"])

# Merge all data sets and plot
result = numpy.vstack((m1, m2, m3))
pylab.ylim([0,1])
te.plotWithLegend(r, result)
```

```python
import tellurium as te
import numpy

# Stability illustration
r = te.loada ('''
    $Xo -> S1;  k1*Xo;
    S1 -> $X1; k2*S1;

    Xo = 1;
    S1 = 0.5;
    k1 = 0.2;
    k2 = 0.4;
''')

# Simulate the first part up to 20 time units
m1 = r.simulate(0, 20, 100, ["time", "S1"]).copy()

# Perturb the concentration of S1 by 0.35 units
r.S1 = r.S1 + 0.35

# Continue simulating from last end point
m2 = r.simulate(20, 50, 100, ["time", "S1"]);

# Merge and plot the two halves of the simulation
result = numpy.vstack ((m1, m2))
te.plotWithLegend(r, result)
```

<!-- \section*{Answers} -->

<!-- \begin{enumerate} -->

<!-- \item -->
<!-- \begin{enumerate}[label=(\alph*)] -->
<!-- \item $$ \frac{dS_1}{dt} = v_o - k1 S_1 - k_2 S_1 $$ -->
<!-- \item $$ S_1 = \frac{v_o}{k_1 + k_2} $$ -->
<!-- \item $$ v_1 = vo, \ v_2 = \frac{k_1 v_o}{k_1 + k_2} $$ -->
<!-- \end{enumerate} -->

<!-- $$ \frac{dS_1}{dv_o} \frac{v_o}{S_1} = 1 $$ -->

<!-- $$ \frac{dS_1}{dk_1} \frac{k_1}{S_1} = -\frac{k_1}{k_1 + k_2} $$ -->

<!-- \item -->
<!-- In $v_o$ increases then this increases the rate of production of $S_1$, therefore $S_1$ rises, hence the sensitivity is positive. With respect to $k_1$, if we increase $k_1$, that causes the rate of $v_2$ increase, which in turn reduces the concentration of $S_1$. Hence the sensitivity is negative. -->

<!-- \item -->

<!-- $$ \frac{dS_1}{dk_1} \frac{k_1}{S_1} = -\frac{k_1}{k_1 + k_2} = -0.5/3 = -0.1666 $$ -->

<!-- $$ \frac{dS_1}{dk_2} \frac{k_2}{S_1} = -\frac{k_2}{k_1 + k_2} = 2.5/3 = 0.8333 $$ -->

<!-- \item -->
<!-- If $k_1$ is increased then the sensitivity $-\frac{k_1}{k_1 + k_2}$ decreases. -->

<!-- \item -->
<!-- We apply the algorithm in equation~\eqref{eqn:SimpleNewRaphson} to the problem $x^2 - a = 0$. This leads to: -->

<!-- $$ x_{k+1} = x_k - \frac{x^2_k - a}{2 x_k} $$ -->
<!-- Simplified, gives: -->
<!-- $$ x_{k+1} = \frac{1}{2} \left( x_k + \frac{a}{x_k} \right) $$ -->

<!-- \item Software project. The solutions to $4 x^2 + 6 x - 8 = 0$ are $1/4 (-3-sqrt{41})$ and $1/4 (-3+sqrt{41})$ or 0.851 and -2.35 -->

<!-- \item Software project -->

<!-- \item -->
<!-- \begin{verbatim} -->
<!-- r = te.loada (''' -->
<!-- $Xo -> S1; k1*Xo -->
<!-- S1 -> $X1; k2*S1 -->
<!-- S1 -> $X2; k3*S1 -->
<!-- k1 = 0.1; k2 = 0.35; k3 = 0.45 -->
<!-- Xo = 1 -->
<!-- ''') -->

<!-- r.steadyState() -->
<!-- print (r.S1) -->
<!-- \end{verbatim} -->

<!-- \item -->
<!-- \begin{verbatim} -->
<!-- r = te.loada (''' -->
<!-- $Xo -> S1; k1*Xo -->
<!-- S1 -> $X1; k2*S1 -->
<!-- S1 -> $X2; k3*S1 -->
<!-- k1 = 0.1; k2 = 0.35; k3 = 0.45 -->
<!-- Xo = 1 -->

<!-- at time > 30: -->
<!-- Xo = Xo + 1 -->
<!-- at time > 50: -->
<!-- Xo = Xo - 1 -->
<!-- ''') -->

<!-- m = r.simulate (0, 100, 200) -->
<!-- r.plot() -->
<!-- \end{verbatim} -->

<!-- \item A stable steady state is one where a perturbed species relaxes back to the ordinal steady state. If the steady state is unstable, and perturbation will not recover and will evolve to a new value. -->

<!-- \item -->

<!-- \begin{enumerate}[label=(\alph*)] -->
<!-- \item The floating species will initially rise but will in time fall back to it original steady state value. -->
<!-- \item The rate constant is increased, this will result in the steady state change to a new state. -->
<!-- \end{enumerate} -->

<!-- \item Scaled sensitivities are more useful because they are unit less and can be approximated as a ration of percentage changes. Such changes are more easily measured than absolute values. -->

<!-- \item Programming project. -->

<!-- \end{enumerate} -->

---

## Index terms recorded in this chapter

- absolute sensitivities
- Burns
- compute steady state
- damped Newton method
- Fell
- FindRoot
- fixed points
- fsolve
- Gepasi
- homeostasis
- Jacobian matrix
- Jarnac
- Kacser
- metabolic control analysis
- Newton algorithm
- Newton-Raphson method
- NLEQ2
- perturbations
- PySCeS
- relative sensitivities
- roadrunner
- robustness
- SCAMP
- sensitivity measures
- software: steady state
- square root
- stability
- stationary state
- steady state
- steady state: analytical
- steady state: computation
- steady state: graphical
- sundials

---

← [[11_bayesian_inference|Introduction to Bayesian Inference]] · [[index|Wiki index]] · [[13_stability|Stability]] →
