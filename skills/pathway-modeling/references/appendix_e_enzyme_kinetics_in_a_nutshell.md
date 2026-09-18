# Enzyme Kinetics in a Nutshell

*Source: `appendixE.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Enzyme Kinetics in a Nutshell <a id="app-enzymekinetics"></a>

This appendix gives a very brief summary of some of the main points in enzyme kinetics. It is not meant to be a thorough treatment. For a much fuller account, the reader is directed to one of a number of enzyme kinetics textbooks, including the companion textbook by the same author: Enzyme Kinetics for Systems Biology.

### Enzymes

Enzymes are protein molecules that can accelerate a chemical reaction without changing the reaction equilibrium constant.

### Enzyme Kinetics

Enzyme kinetics is a branch of science that deals with the many factors that can affect the rate of an enzyme-catalysed reaction. The most important factors include the concentration of enzyme, reactants, products, and the concentration of any modifiers such as specific activators, inhibitors, pH, ionic strength, and temperature. When the action of these factors is studied, we can deduce the kinetic mechanism of the reaction. That is, the order in which substrates and products bind and unbind, and the mechanism by which modifiers alter the reaction rate.

## Michaelis-Menten Kinetics

The standard model for enzyme action describes the binding of free enzyme to the reactant forming an **enzyme-reactant complex**. This complex undergoes a transformation, releasing product and free enzyme. The free enzyme is then available for another round of binding to new reactant.

$$
\begin{equation}
\text{E} + \text{S} \xrightleftharpoons[k_{-1}]{k_1} \text{ES} \stackrel{k_2}{\longrightarrow} \text{E} + \text{P}
 \label{mechanism:MM}
\end{equation}
$$

where $k_1, k_{-1}$ and $k_2$ are rate constants, $S$ is substrate, $P$ is product, $E$ is the free enzyme, and $\mathit{ES}$ the enzyme-substrate complex.

By assuming a steady state condition on the enzyme substrate complex, we can derive the Briggs-Haldane equation relation (sometimes mistakenly called the Michaelis-Menten equation):

$$
\begin{equation}
v = \frac{Vm\ S}{K_m + S}
\label{eqn:MMRapid}
\end{equation}
$$

where $V_m$ is the maximal velocity, and $K_m$ the substrate concentration that yields half the maximum velocity.

**Figure** <a id="fig-mmgraph"></a> `fig:MMGraph`

*Caption:* Relationship between the initial rate of reaction and substrate concentration for a simple
Michaelis-Menten rate law. The reaction rate reaches a limiting value called the $V_m$. $K_m$ is set to 4.0 and $V_m$ to 1.0. The $K_m$ value is the substrate concentration that gives half the maximal rate.

```latex
\begin{figure}[htb]
\begin{center}
\pgfplotsset{every axis/.append style={
after end axis/.code={
\draw[-stealth,color=black,style=solid] (axis cs:-3.5,1) -- (axis cs:-1.5,1);
\node at (axis cs:-4.8,1) {$V_m$};
\draw[-stealth,color=black,style=solid] (axis cs:4,-0.14) -- (axis cs:4,-0.02);
\node at (axis cs:4.5,-0.2) {$K_m$};
\node at (axis cs:20,-0.2) {Substrate Concentration ($S$)};
}}}
\begin{tikzpicture}
\begin{axis}[
ylabel={Initial Reaction Rate, $v$},
xmin=0,
xmax=30,
ymin=0,
ymax=1,
width=9cm,
height=6cm]
  \ifodd\drawfigs
  \addplot[color=red,line width=1.5pt] expression[domain=0:30,samples=100]{x/(4+x)};
  \else
  \vspace{2in}
  \fi

  \fill [black] (axis cs:4,0.5) circle (2.5pt);
  \node at (axis cs:6.2,0.5) {$\frac{1}{2} v$};
  \draw[-stealth,color=black,style=dashed] (axis cs:4,0.5) -- (axis cs:4,0);
  \draw[-stealth,color=black,style=dashed] (axis cs:4,0.5) -- (axis cs:0,0.5);
\end{axis}
\end{tikzpicture}
\end{center}
\caption{Relationship between the initial rate\index{initial rate} of reaction and substrate concentration for a simple
Michaelis-Menten rate law. The reaction rate reaches a limiting value called the $V_m$. $K_m$ is set to 4.0 and $V_m$ to 1.0. The $K_m$ value is the substrate concentration that gives half the maximal rate.} \label{fig:MMGraph}
\end{figure}
```

## Reversibility and Product Inhibition

*In vivo* it is unlikely that an enzyme reaction is completely irreversible. Even if an enzyme shows no reverse reaction rate from product to substrate, there is still likely to be some degree of product inhibition because the product can bind to the active site and compete with the substrate.

## Reversible Rate laws

An alternative and more realistic model is the reversible form:

$$
\begin{equation}
\text{E} + \text{S} \xrightleftharpoons[k_{-1}]{k_1} \text{ES} \xrightleftharpoons[k_{-2}]{k_2} \text{E} + \text{P}
\label{mech:reversibleMM}
\end{equation}
$$

The aggregate rate law for the reversible form of the mechanism can also be derived and is given by:

$$
\begin{equation}
v = \frac{V_f\ S/K_S - V_r\ P/K_P}{1 + S/K_S + P/K_P}
\label{eqn:revMM}
\end{equation}
$$

## Haldane Relationship

For the reversible enzyme kinetic law there is an important relationship:

$$
\begin{equation}
K_{eq} = \frac{P_{eq}}{S_{eq}} = \frac{V_f\ K_P}{V_r\ K_S}
\label{eqn:Haldane}
\end{equation}
$$

This equation sh\-ows that the four kinetic constants, $V_f, V_r, K_P$ and $K_S$ are not independent. Haldane relationships can be used to eliminate one of the kinetic constants by substituting the equilibrium constant in its place. This is useful because equilibrium constants tend to be known compared to kinetic constants which may be unknown. By incorporating the Haldane relationship, we can eliminate the reverse maximal velocity ($V_r$) from [Reversible Rate laws](#eqn-revmm) to yield the equation:

$$
\begin{equation}
v = \frac{V_f/K_S (S - P/K_{eq})}{1 + S/K_S + P/K_P}
\end{equation}
$$

Separating out the terms makes it easier to see that the above equation can be partitioned into a number of distinct parts:

$$
\begin{equation}
v = V_f\ \cdot\ (1 - \Gamma/K_{eq})\ \cdot\ \frac{S/K_s}{1 + S/K_S + P/K_P}
\label{eqn:modularRateLaw1}
\end{equation}
$$

where $\Gamma = P/S$. The first term, $V_f$, is the maximal velocity; the second term, $(1 - \Gamma/K_{eq})$, indicates the direction of the reaction according to thermodynamic considerations. The last term refers to the fractional saturation with respect to substrate. Thus we have a maximal velocity, a thermodynamic and a saturation term.

## Competitive Inhibition <a id="sec-productinhibition"></a>

There are many molecules capable of slowing down or speeding up the rate of enzyme catalyzed reactions. Such molecules are called enzyme inhibitors and activators. One common type of inhibition, called **competitive inhibition**,  occurs when the inhibitor is structurally similar to the substrate so that it competes for the active site by forming a dead-end complex.

**Figure** <a id="fig-compuncompmechanisms"></a> `fig:CompUnCompMechanisms`

*Graphic (not in the LaTeX source, referenced by name): `InhibitorMechanisms`*

*Caption:* Competitive and Uncompetitive Inhibition. $P$ is the concentration of product, $\mathit{E}$ is the free enzyme, $\mathit{ES}$ the enzyme-substrate complex, and $\mathit{ESI}$ the enzyme-substrate-inhibitor complex. 

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 0.95]{InhibitorMechanisms}
  \caption{Competitive and Uncompetitive Inhibition\index{uncompetitive inhibition}. $P$ is the concentration of product, $\mathit{E}$ is the free enzyme, $\mathit{ES}$ the enzyme-substrate complex, and $\mathit{ESI}$ the enzyme-substrate-inhibitor complex. }
  \label{fig:CompUnCompMechanisms}
\end{figure}
```

The kinetic mechanism for a pure competitive inhibitor is shown in Figure [Figure: Competitive and Uncompetitive Inhibition](#fig-compuncompmechanisms)(a), where $\mathit{I}$ is the inhibitor and $\mathit{EI}$ the enzyme inhibitor complex. If the substrate concentration is increased, it is possible for the substrate to eventually out compete the inhibitor. For this reason the inhibitor alters the enzyme's apparent $K_m$, but not the $V_{m}$.

$$
\begin{equation}
\begin{aligned}
 v &= \frac{V_m\ S}{S + K_m\left(1 + \displaystyle\frac{I}{K_i}\right)} \\[8pt]
   &= \frac{V_m\ S/K_m}{1 + S/K_m + I/K_i}
\label{eqn:compInhibEqn}
\end{aligned}
\end{equation}
$$

At $I=0$, the competitive inhibition equation reduces to the normal irreversible Michaelis-Menten equation. Note that the term $K_m (1 + I/K_i)$ in the first equation more clearly shows the impact of the inhibitor, $I$, on the $K_m$. The inhibitor has no effect on the $V_m$.

A reversible form of the competitive rate law can also be derived:

$$
\begin{equation}
v = \frac{\displaystyle\frac{V_m}{K_{s}} \left( \displaystyle S - \displaystyle\frac{P}{K_{\text{eq}}}\right)}{1 + \displaystyle\frac{S}{K_{s}} + \displaystyle\frac{P}{K_{p}} + \displaystyle\frac{I}{K_i}}
\label{eqn:compInhibRev}
\end{equation}
$$

where $V_m$ is the forward maximal velocity, and $K_{s}$ and $K_{p}$ are the substrate and product half saturation constants.

Sometimes reactions appear irreversible, where no discernable reverse rate is detected, and yet the forward reaction is influenced by the accumulation of product. This effect is caused by the product competing with substrate for binding to the active site and is often called **product inhibition**. Given that product inhibition is a type of competitive inhibition, we will briefly discuss it. An important industrial example of this is the conversion of lactose to galactose by the enzyme $\beta-$galactosidase where galactose competes with lactose, slowing the forward rate [gekas1985].

To describe simple product inhibition with an irreversible reaction, we can set the $P/K_{eq}$ term in the reversible Michaelis-Menten rate law [Reversible Rate laws](#eqn-revmm) to zero. This yields:

$$
\begin{equation}
v = \frac{V_{m} S}{S + K_m \left( 1 + \displaystyle\frac{P}{K_p}\right)}
\label{eqn:productInhib}
\end{equation}
$$

It is not surprising to discover that equation [Competitive Inhibition](#eqn-productinhib) has exactly the same form as the equation for competitive inhibition [Competitive Inhibition](#eqn-compinhibeqn). As the product increases, it out competes the substrate and therefore slows down the reaction rate.

We can also derive the equation by using the following mechanism and the rapid-equilibrium assumption:

$$
\begin{equation}
\text{E} + S \xrightleftharpoons{} \text{ES} \longrightarrow \text{EP} \xrightleftharpoons{}  \text{E} + \text{P}
% \label{fig:ProductInhibition}
\end{equation}
$$

where the reaction rate $v$ is assumed to be proportional to $\mathit{ES}$.

## Cooperativity

Many proteins are known to be oligomeric, meaning they are composed of more than one identical protein subunit where each subunit has one or more binding sites. Often the individual subunits are identical.

If the binding of a ligand (a small molecule that binds to a larger macromolecule) to one site alters the affinity at other sites on the same oligomer, it is called **cooperativity**. If ligand binding increases the affinity of subsequent binding events, it is termed **positive cooperativity** whereas if the affinity decreases, it is termed **negative cooperativity**. One characteristic of positive cooperativity is that it results in a sigmoidal response instead of the usual hyperbolic response.

The simplest equation that displays sigmoid like behavior is the Hill equation:

$$
\begin{equation}
v = \frac{\mathit{Vm}\ S^n}{K_d + S^n}
\label{eqnHillEqnKd}
\end{equation}
$$

One striking feature of many oligomeric proteins is the way individual monomers are physically arranged. Often one will find at least one axis of symmetry. The individual protein monomers are not arranged in a haphazard fashion. This level of symmetry may imply that the gradual change in the binding constants as ligands bind, might be physically implausible. Instead, one might envision transitions to an alternative binding state that occurs within the entire oligomer complex. This model was originally suggested by Monod, Wyman and Changeux [Monod:Wyman:1965], abbreviated as the MWC model. The original authors laid out the following criteria for the MWC model:

- The protein is an oligomer. \\[-17pt]

- Oligomers can exist in two states: R (relaxed) and T (tense). In each state, symmetry is preserved and all subunits must be in the same state for a given R or T state. \\[-17pt]

- The R state has a higher ligand affinity than the T state. \\[-17pt]

- The T state predominates in the absence of ligand $S$. \\[-17pt]

- The ligand binding microscopic association constants are all identical.

Given these criteria, the MWC model assumes that an oligomeric enzyme may exist in two conformations, designated T (tensed, square) and R (relaxed, circle). The equilibrium between the two states has an equilibrium constant $L = T/R$, which is also called the **allosteric constant**. If the binding constants of ligand to the two states are different,  the distribution of the R and T forms can be displaced towards either one form or the other. By this mechanism, the enzyme displays sigmoid behavior. A minimal example of this model is shown in Figure [Figure: A minimal MWC model, also known as the exclusive model, showing altern](#fig-minimalmwcmodel).

**Figure** <a id="fig-minimalmwcmodel"></a> `fig:MinimalMWCModel`

*Graphic (not in the LaTeX source, referenced by name): `MWCModel`*

*Caption:* A minimal MWC model, also known as the exclusive model, showing alternative microscopic states in the circle (relaxed) form. $L$ is called the allosteric constant. The square form is called the tense state.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 0.65]{MWCModel}
  \caption{A minimal MWC model, also known as the exclusive model\index{exclusive model}, showing alternative microscopic states in the circle (relaxed) form. $L$ is called the allosteric constant. The square form is called the tense state.} \label{fig:MinimalMWCModel}
\end{figure}
```

In the **exclusive model** (Figure [Figure: A minimal MWC model, also known as the exclusive model, showing altern](#fig-minimalmwcmodel)) the ligand can only bind to the relaxed form (circle). The mechanism that generates sigmoidicity in this model works as follows. When ligand binds to the relaxed form, it displaces the equilibrium from the tense form to the relaxed form. In doing so, additional ligand binding sites become available. Thus, one ligand binding may generate four or more new binding sites. Eventually there are no more tense states remaining, at which point the system is saturated with ligand. The overall binding curve will therefore be sigmoidal and will show positive cooperativity. Given the nature of this model, it is not possible to generate negative cooperativity. By assuming equilibrium between the various states, it is possible to derive an aggregate equation for the dimer case of the exclusive MWC model:

$$ v = V_m \frac{\displaystyle\frac{S}{k_R} \displaystyle\left(1 + \frac{S}{k_R}\right)}{\left(1 + \displaystyle\frac{S}{k_R}\right)^2 + L} $$

This also generalizes to $n$ subunits as follows:

$$
\begin{equation}
Y = \frac{\displaystyle\frac{S}{k_R} \left(1 + \displaystyle\frac{S}{k_R}\right)^{n-1}}{\displaystyle\left(1 + \frac{S}{k_R}\right)^n + L}
\label{eqn:MWC}
\end{equation}
$$

For more generalized reversible rate laws that exhibit sigmoid behavior, the reversible Hill equation is a good option. Invoking the rapid-equilibrium assumption, we can form a reversible rate law  that shows cooperativity:

$$ v = \frac{V_f \displaystyle\alpha \left( 1 - \rho \right) \left( \displaystyle\alpha + \pi \right) }{1 + \left( \displaystyle\alpha + \displaystyle\pi \right)^2 } $$

where $\rho = \Gamma/K_{eq}$ and $\alpha$ and $\pi$ are the ratio of reactant and product to their respective equilibrium constant, $\alpha/K_S$ and $\pi/K_P$. For an enzyme with $h$ (using the author's original notation) binding sites, the general form of the reversible Hill equation is given by:

$$
\begin{equation}
v = \frac{V_f {\displaystyle\alpha\ %
\left(1 - \rho\right)\ \left(\alpha + \pi\right)^{h-1}}}{\displaystyle 1 + \left(\alpha + \pi\right)^h}
\end{equation}
$$

<a id="eqn-revhill"></a>

## Allostery

An allosteric effect is where the activity of an enzyme or other protein is affected by the binding of an effector molecule at a site on the protein's surface, other than the active site. The MWC model described previously can be easily modified to accommodate allosteric action.

**Figure** <a id="fig-minimalmwcmodel2"></a> `fig:MinimalMWCModel2`

*Graphic (not in the LaTeX source, referenced by name): `MWCModelWithLabelsLigand`*

*Caption:* **Exclusive** MWC model based on a dimer showing alternative microscopic states in the form of $T$ and $R$ states. The model is exclusive because the ligand, $X$, only binds to the $R$ form. 

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 0.65]{MWCModelWithLabelsLigand}
  \caption{{\bfseries Exclusive} MWC model based on a dimer showing alternative microscopic states in the form of $T$ and $R$ states. The model is exclusive because the ligand, $X$, only binds to the $R$ form. } \label{fig:MinimalMWCModel2}
\end{figure}
```

The key to including allosteric effectors is to influence the equilibrium between the tense (T) and relaxed (R) states (See Figure [Figure: **Exclusive** MWC model based on a dimer showing alternative microscop](#fig-minimalmwcmodel2)). To influence the sigmoid curve, an allosteric effector need only displace the equilibrium between the tense and relaxed forms. For example, to behave as an activator, an allosteric effector needs to preferentially bind to the R form and shift the equilibrium away from the less active T form. An allosteric inhibitor would do the opposite, that is bind preferentially to the T form so that the equilibrium shifts towards the less active T form. In both cases the $V_m$ of the enzyme is unaffected.

The net result of this is to modify the normal MWC aggregate rate law to the following if the effector is an inhibitor:

$$
\begin{equation}
  v = V_m \frac{\alpha \left(1 + \alpha\right)^{n-1}}{\left(1 + \alpha\right)^n + L  (1 + \beta)^n }
\label{eqn:GeneralizedMWCInhibitor}
\end{equation}
$$

where $\alpha = S/K_s$, $\beta = I/K_I$, and $K_s$ and $K_I$ are kinetic constants related to each ligand. A MWC model that is regulated by an inhibitor or an activator is described by the equation:

$$ v = V_m \frac{\alpha \left(1 + \alpha\right)^{n-1}}{\left(1 + \alpha\right)^n +  \displaystyle L \frac{(1 + \beta)^n}{(1 + \gamma)^n} } $$

There are also reversible forms of the allosteric MWC model but they are fairly complex. Instead, it is possible to modify the reversible Hill rate law to include allosteric ligands.

$$
\begin{equation}
v = \frac{V_f {\displaystyle\alpha\ %
\left(1 - \frac{\Gamma}{K_{eq}}\right)\ \left(\alpha + \pi\right)^{h-1}}}%
{\displaystyle\frac{1 + \mu^h}{1 + \sigma \mu^h} + \left(\alpha + \pi\right)^h}
\label{eqn:revHillPlusMod}
\end{equation}
$$

where:

$$
\begin{align*}
\sigma < 1 \qquad\mbox{inhibitor} \\
\sigma > 1 \qquad\mbox{activator}
\end{align*}
$$

### Simple Hill Equations

When modeling gene regulatory networks, we often need simple activation and repression rate laws. It is common to use the following Hill like equations to model activation and repression, respectively. The third equation shows one example of how we can model dual repression and activation, where $S_1$ acts as the activator and $S_2$ the inhibitor. $n_1$ and $n_2$ are Hill like coefficients which may be used to alter the responsiveness of each factor.

$$
\begin{align*}
\text{Activation: } v &= \frac{V_m S^n}{K + S^n} \\[6pt]
\text{Repression: } v &= \frac{V_m}{K + S^n} \\[6pt]
\text{Dual: } v &= \frac{V_m S_1^{n_1}}{1 + K_1 S_1^{n_1} + K_2 S_2^{n_2} + K_3 S_1^{n_1} S_2^{n_2}}
\end{align*}
$$

## Elasticities

Elasticities measure the response of a chemical reaction rate to changes in the immediate environment. For example, given a simple reaction such as:

$$ S \rightarrow P $$

we can measure two elasticities, one with respect to $S$ and the other with respect to $P$. Each elasticity gives us the response of the reaction rate when either $S$ or $P$ are changed, respectively. Mathematically, the elasticity is defined in terms of a scaled derivative:

$$
\begin{align}
\varepsilon^v_S = \frac{\partial v}{\partial S} \frac{S}{v} \simeq \frac{v \%}{S \%}
\label{eqn:elasticity}
\end{align}
$$

According to the definition, one can interpret an elasticity as a ratio of relative changes. Even though the elasticity is only defined for infinitesimal changes, we can approximate the elasticity in terms of small finite changes and conveniently interpret it as the ratio of percentage changes. For example, if we were to make a 2% change in $S$, and in turn observed a 0.5% change in the reaction velocity, then the value of the elasticity is given approximately by the ratio $0.5/2 = 0.25$. Full details of the elasticity and its properties can be found in the companion book Enzyme Kinetics for Systems Biology.

### Unscaled Elasticity

We can also define the unscaled elasticity as:

$$
\begin{align}
\mathcal{E}^v_S = \frac{\partial v}{\partial S}
\label{eqn:unscaledElasticity}
\end{align}
$$

## Further Reading

- Sauro HM (2012) Enzyme Kinetics for Systems Biology. 2nd Edition, Ambrosius Publishing ISBN: 978-0982477335

---

## Index terms recorded in this chapter

- $K_m$
- $V_m$
- allosteric constant
- allostery
- Briggs-Haldane
- competitive
- competitive inhibition
- cooperativity
- elasticity
- enzyme action
- enzyme inhibitor complex
- enzyme kinetics
- enzyme-reactant complex
- exclusive model
- Haldane relationship
- Hill equations
- initial rate
- kinetic mechanism
- maximal velocity
- Michaelis-Menten kinetics
- MWC model
- negative cooperativity
- positive cooperativity
- product inhibition
- pure competitive inhibitor
- R state
- relaxed
- reversible rate law
- sigmoid response
- T state
- tense
- uncompetitive inhibition
- unscaled elasticity

---

← [[appendix_d_kinetics_in_a_nutshell|Kinetics in a Nutshell]] · [[index|Wiki index]] · [[appendix_f_math_fundamentals|Math Fundamentals]] →
