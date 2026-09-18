# Kinetics in a Nutshell

*Source: `chapter2.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Kinetics in a Nutshell <a id="chap-kineticsnutshell"></a>

## Introduction

Understanding chemical kinetics is at the heart of building biochemical models. This chapter gives a minimal introduction to some of the essential concepts of elementary chemical kinetics. A fuller account is given in the companion book, `Enzyme Kinetics for Systems Biology'. This chapter may be omitted by those already familiar with this topic.

## Definitions

Reaction kinetics is the study of how fast chemical reactions take place, what factors influence the rate of reaction, and what mechanisms are responsible.

### Stoichiometric Amount

The **stoichiometric amount** is the number of molecules a particular reactant or product takes part in a given reaction. For example:

$$ 2 A + 3 B \rightarrow A + 3 C $$

The stoichiometric amount for reactant A is 2 and for B is 3. The stoichiometric amount for product A is 1 and for C is 3.

### Depicting Reactions

A generalized reaction is shown below:

$$ a A + b B + ... \rightarrow + p P + q Q + ... $$

where $a, b, ..., p, q, ...$ are stoichiometric amounts.

### Rates of Change

The rate of change is defined as the rate of change in concentration or amount of a designated molecular species.

$$ Rate of Change = \frac{dA}{dt} $$

### Stoichiometric coefficients

The **stoichiometric coefficient**, $c_i$, for a molecular species A$_j$, is the difference between the molar amount of species, $i$ (or **stoichiometric amount**) on the product side and the molar amount of the same species on the reactant side.

$$ c_i = Molar Amount of Product - Molar Amount of Reactant $$

In the reaction, 2 A $\longrightarrow$ B, the molar amount of A on the product side is zero while on the reactant size it is two. Therefore the stoichiometric coefficient of A is given by $0-2 = -2$. In many cases a particular species will only occur on the reactant or product side. As a result, reactant stoichiometric coefficients tend to be *negative* while product stoichiometric coefficients tend to be *positive*.

### Reaction Rates

The **reaction rate**, often denoted by the symbol $v$, is measured with respect to a given molecular species normalized by the species stoichiometric coefficient. This definition ensures that no matter which molecular species in a reaction is measured, the reaction rate is uniquely defined for that reaction. More formally, the reaction rate for the reaction:

$$ a A + b B + ... \rightarrow p P + q Q + ... $$

is:

$$ v  = \frac{1}{c_a} \frac{d\!A}{\dt} = \frac{1}{c_b}
\frac{d\!B}{\dt} ...= \frac{1}{c_p} \frac{d\!P}{\dt} =
\frac{1}{c_q} \frac{d\!Q}{\dt} ... $$

where $c_x$ are the stoichiometric coefficients. Alternatively, we can express the rate of change in terms of the reaction rate as:

\stateEquation{

$$
\begin{align}
\frac{d\!A}{\dt} = c_a v
\label{eqn:StoichReactionRate}
\end{align}
$$

}

## Elementary Mass-Action Kinetics

An elementary reaction is one that cannot be broken down into simpler reactions. Such reactions will often display simple kinetics called mass-action kinetics. For a reaction of the form:

\[ a A + b B + ... \rightleftharpoons p P + q Q + ... \]

the mass-action kinetic rate law is given by:

\stateEquation{

$$
\begin{equation}
v = k_1 A^a B^b \ldots - k_2 P^p Q^q \ldots
\end{equation}
$$

}

$k_1$ and $k_2$ are the forward and reverse rate constants, respectively.

## Chemical Equilibrium

In principle, all reactions are reversible, meaning transformations can occur from reactant to product or product to reactant.
The net rate of a reversible reaction is the difference between the forward and reverse rates. Given a reversible reaction such as:

$$ A \rightleftharpoons B $$

we can observe the concentrations of A and B approach equilibrium (Figure [Chemical Equilibrium](#eqn-rateconstantratio)).

**Figure** <a id="fig-approachtoequil"></a> `fig:ApproachToEquil`

*Caption:* Approach to equilibrium for the reaction A $\rightleftharpoons$ B, $k_1 = 0.6,  k_2 = 0.4,  A(0) = 1,  B(0) = 0$. Progress curves calculated from the solution to the differential equation $d\!A/dt = k_2 B - k_1 A$.  

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}
\begin{axis}[
ylabel={\small Concentration of A and B},
xlabel={\small Time},
xmin=0,
xmax=10,
ymin=0,
ymax=1,
width=9cm,
height=6cm]
  \addplot[color=red,line width=1.5pt] expression[domain=0:10,samples=100]{(exp(-x)*0.6 + 0.4)};
  \addplot[color=orange,line width=1.5pt] expression[domain=0:10,samples=100]{1 - (exp(-x)*0.6 + 0.4)};

  \node at (axis cs:6,0.7) {$B$};
  \node at (axis cs:6,0.3) {$A$};

\end{axis}
\end{tikzpicture}
\end{center}
\caption{Approach to equilibrium for the reaction A $\rightleftharpoons$ B, $k_1 = 0.6,\ \ k_2 = 0.4,\ \ A(0) = 1,\ \ B(0) = 0$. Progress curves calculated from the solution to the differential equation $d\!A/dt = k_2 B - k_1 A$.  } \label{fig:ApproachToEquil}
\end{figure}
```

At chemical equilibrium the forward and reverse rates are equal and is described by the relation:

\stateEquation{

$$
\begin{equation}
\frac{k_1}{k_2} = \frac{B}{A} = K_{eq}
\label{eqn:rateConstantRatio}
\end{equation} }
$$

This ratio has special significance and is called the **equilibrium constant**,
denoted by $K_{eq}$. The equilibrium constant is also related to the ratio of the rate constants, $k_1/k_2$. For a general reversible reaction such as:

$$ a A + b B + ... \rightleftharpoons p P + q Q + ... $$

and using arguments similar to those described above, the ratio of the rate constants can be easily shown to be:

$$
\begin{equation}
K_{eq} = \frac{P^{p} Q^{q} \ldots}{A^{a} B^{b} \ldots} = \frac{k_1}{k_2}
\label{eqn:GeneralKeq}
\end{equation}
$$

where the exponents are the stoichiometric *amounts* for each species.

For a bimolecular reaction such as:

$$
\mathrm{HA} \rightleftharpoons \mathrm{H} + \mathrm{A}
$$

chemists and biochemists will often distinguish between two kinds of equilibrium constants called association and
dissociation constants. Thus the equilibrium constant for the above bimolecular reaction is often called the
**dissociation constant**, $K_d$:

$$
\begin{equation}
K_d = \frac{H \cdot A}{HA}
\end{equation}
$$

to indicate the degree that the complex is dissociated into its component molecules at equilibrium. As a reminder, italicized symbols such as $H$, $HA$, etc, represent the concentration of the particular species. The
**association constant**, $K_a$, though less commonly used, describes the equilibrium constant for the reverse process $ \mathrm{H} + \mathrm{A} \rightleftharpoons \mathrm{HA}$,
that is the formation of a complex from component molecules:

$$
\begin{equation}
K_a = \frac{HA}{H \cdot A}
\end{equation}
$$

It should be evident that:

\stateEquation{

$$
\begin{equation}
K_d = \frac{1}{K_a}
\end{equation}
$$

}

The equilibrium constant is also related to the standard free energy change, $\Delta G^o$, such that:

$$ \Delta G^o =  - R T \ln K_{eq} $$

where $R$ is the gas constant, and $T$ the temperature.  Rearranged we can also see that:

$$
\begin{equation}
K_{eq} = e^{-\Delta G^o/RT}
\label{eqn:KeqDeltaG}
\end{equation}
$$

We can use the above results to derive the equilibrium concentrations for a simple equilibration system:

$$ A \xrightleftharpoons[k_2]{k_1} B $$

We first note that the rate of change of $A$ is given by the rate at which $A$ is made minus the rate at which it is consumed, that is:

$$ \frac{dA}{dt} = k_2 B - k_1 A $$

At equilibrium the rate of change will be zero:

$$ 0 = k_2 B - k_1 A $$

Since the system is closed, the concentration of all molecular species in the system will be constant such that for all time:

$$ A + B = T $$

where $T$ is the concentration of A and B in the system. We assume that the volume is constant and the same for both A and B. Substituting $B = T - A $ in to the equation above, and solving for A, we obtain:

$$ A = \frac{k_2 T}{k_1 + k_2} $$

Once we have A, we can obtain $B$, from $B = T - A$, that is:

$$ B = \frac{k_1 T}{k_1 + k_2} $$

## Mass-action and Disequilibrium Ratio

Although in closed systems reactions tend to equilibrium, reactions occurring in living cells are generally out of equilibrium and the ratio of the products to the reactants *in vivo* is called the **mass-action ratio**, $\Gamma$. The ratio of the mass-action ratio to the equilibrium constant is called the **disequilibrium ratio**:

\stateEquation{

$$
\begin{equation} \rho = \frac{\Gamma}{K_{eq}} \label{eqn:disequilbrium} \end{equation}
$$

}

At equilibrium the mass-action ratio will be equal to the equilibrium constant, that is $\rho = 1$. If the reaction is away from equilibrium then $\rho \neq 1$.

For a simple unimolecular reaction it was previously shown that the equilibrium ratio of product to reactant, $B/A$, is equal to the ratio of the forward and reverse rate constants. Substituting this into the disequilibrium ratio gives:

$$ \rho = \Gamma \frac{k_2}{k_1} = \frac{B}{A} \frac{k_2}{k_1} $$

Therefore:

$$
\begin{equation} \rho = \frac{v_r}{v_f} \label{eqn:disequilbrium2} \end{equation}
$$

That is, the disequilibrium ratio is the ratio of the reverse and forward rates. If $\rho < 1$, the net reaction must be in the direction of product formation. If $\rho$ is zero, the reaction is as out of equilibrium as possible with no product present.

If we take equation [Mass-action and Disequilibrium Ratio](#eqn-disequilbrium) and take logs on both sides, multiply both sides by $RT$ we get the free energy equation:

$$ \Delta G = \Delta G^o + RT \ln \Gamma $$

If $\Delta G$ is less than zero then the reaction will be going in the forward direction, while if the $\Delta G$ is positive, the reaction will be going in the reverse direction.

## Modified Mass-Action Rate Laws <a id="chap-modifiedmassactionratelaw"></a>

A typical reversible mass-action rate law will require both the forward and the reverse rate constants to be fully defined. Often however, only one rate constant may be known. In these circumstances it is possible to express the reverse rate constant in terms of the equilibrium constant.

For example, given the simple unimolecular reaction, A $\rightleftharpoons$ B, it is possible to derive the following:

$$
\begin{align}
v &= k_1 A - k_2 B \nonumber \\
v &= k_1 A \left(1 - \frac{k_2 B}{k_1 A}\right) \nonumber \\
\mbox{Since } K_{eq} &= \frac{k_1}{k_2} \nonumber \\
v &= k_1 A \left(1 - \frac{\Gamma}{K_{eq}}\right)
\label{eqn:modMassAction}
\end{align}
$$

where $\Gamma$ is the mass-action ratio. This can be generalized to an arbitrary mass-action reaction to give:

$$
\begin{equation}
 v = k_1 A^{a} B^{b} \ldots \left( 1 - \frac{\Gamma}{K_{eq}}\right) = k_1 A^{a} B^{b} \ldots (1 - \rho)
\end{equation}
$$

where $A^{a} B^{b} ...$ represents the product of all reactant species, $a$ and $b$ are the **corresponding** stoichiometric amounts, and $\rho$ is the disequilibrium ratio. The advantage of this expression is that equilibrium constants are more experimentally assessable that rate constants. For the reaction:

$$ 2 A + B \longrightarrow C + 2 D $$

where $k_1$ is the forward rate constant, the modified reversible rate law is:

$$
\begin{equation}
v = k_1 A^2 B \left(1 - \rho \right)
\end{equation}
$$

The modified formulation demonstrates how a rate expression can be divided up into functional parts to include both kinetic and thermodynamic components [Hofmeyr1995]. The kinetic component is represented by the term $k_1 A^{a} B^{b} ..., $ while the thermodynamic component is represented by the expression $1 - \rho$.

We can also derive the modified rate law in the following way. Given the net rate of reaction $v = v_f - v_r$, we can write this expression as:

$$ v = v_f \left( 1 - \frac{v_r}{v_f} \right) $$

That is:

$$
\begin{equation}
v = v_f (1 - \rho)
\end{equation}
$$

## Further Reading

- Sauro HM (2012) Enzyme Kinetics for Systems Biology. 2nd Edition, Ambrosius Publishing ISBN: 978-0982477335

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- \begin{enumerate}[label=\textbf{\arabic*.}] -->

<!-- \item Define the following terms: -->

<!-- \begin{enumerate} -->
<!-- \item Stoichiometric amount -->
<!-- \item Stoichiometric coefficient -->
<!-- \item Rate of change -->
<!-- \item Rate of reaction -->
<!-- \end{enumerate} -->

<!-- \item What are the stoichiometric amount and stoichiometric coefficient for each species in the following reactions: -->

<!-- \begin{align*} -->
<!-- \text{A} &\longrightarrow \text{B} \\ -->
<!-- \text{A} + \text{B} &\longrightarrow \text{C} \\ -->
<!-- \text{A} &\longrightarrow \text{B} + \text{C} \\ -->
<!-- 2 \text{A} &\longrightarrow \text{B} \\ -->
<!-- 3 \text{A} + 4 \text{B} &\longrightarrow 2 \text{C} + \text{D} \\ -->
<!-- \text{A} + \text{B} &\longrightarrow \text{A} + \text{C} \\ -->
<!-- \text{A} + 2 \text{B} &\longrightarrow 3 \text{B} + \text{C} \\ -->
<!-- \end{align*} -->
<!-- 5 -->
<!-- \item Write out the mass-action rate laws for the following elementary reactions: -->

<!-- \begin{enumerate} -->
<!-- \item $ A \rightarrow $ -->
<!-- \item $ A + B \rightarrow $ -->
<!-- \item $A + 2 B \rightarrow $ -->
<!-- \item $2 A \rightarrow $ -->
<!-- \end{enumerate} -->

<!-- \item Write out the reversible mass-action rate laws for the following reactions: -->

<!-- \begin{enumerate} -->
<!-- \item $ A \rightarrow B $ -->
<!-- \item $ A + B \rightarrow C + D $ -->
<!-- \item $2 A + B \rightarrow 2 C $ -->
<!-- \item $A \rightarrow 2 B $ -->
<!-- \end{enumerate} -->

<!-- \item A reversible reaction $A \rightleftharpoons B$ has an equilibrium constant of 5.0. If at equilibrium the concentration of $A$ is 2 mM, what is the equilibrium concentration of $B$? -->

<!-- \item Define the following terms: -->

<!-- \begin{enumerate} -->
<!-- \item Mass-action ratio -->
<!-- \item Disequilibrium ratio -->
<!-- \end{enumerate} -->

<!-- \end{enumerate} -->

<!-- \section*{Answers} -->

<!-- \begin{enumerate} -->

<!-- \item -->
<!-- \begin{enumerate}[label=(\alph*)] -->

<!-- \item The stoichiometric amount is the number of molecules a particular reactant or product -->
<!-- takes part in a given reaction -->

<!-- \item $c_i = $ molar amount of product - molar amount of reactant. In reactions where the species only appears on the reactant side, the stoichiometric coefficient is the negative of the stoichiometric amount of the reactant. In reactions where the species only appears on the product side, the stoichiometric coefficient is the stoichiometric amount of the product. -->

<!-- \item The rate of change is defined as the rate of change in concentration or amount of a designated molecular species. -->

<!-- \item The rate of reaction is the rate of change of a given species normalized by its stoichiometric coefficient. -->

<!-- \end{enumerate} -->

<!-- \item -->
<!-- \begin{enumerate}[label=(\alph*)] -->
<!-- \item 1, 1; -1, 1 -->
<!-- \item 1, 1, 1; -1, -1, 1 -->
<!-- \item 1, 1, 1; -1, 1, 1 -->
<!-- \item 2, 1; -2, 1 -->
<!-- \item 3, 4, 2, 1; -3, -3, 2, 1 -->
<!-- \item 1, 1, 1, 1; 0, -1, 1 -->
<!-- \item 1, 2, 3, 1; -1, 1, 1 -->
<!-- \end{enumerate} -->

<!-- \item -->
<!-- a) $k A$; \ b) $k A B$; \ c) $k A B^2$; \ d) $k A^2$ -->

<!-- \item -->

<!-- a) $k_1 A - k_2 B$; \ b) $k_1 A B$ - k_2 C D; \ c) $k_1 A^2 B - k_2 C^2$; \ d) $k_1 A^2 - k_2 B^2$ -->

<!-- \item -->
<!-- Since $K_{eq} = B/A = 5$, and $A = 2$, therefore $B = A \times K_{eq} = 10$ mM -->

<!-- \item -->
<!-- \begin{enumerate}[label=(\alph*)] -->
<!-- \item The mass-action ratio, $\Gamma$, is the ratio of products to the reactants {\em in vivo}. At equilibrium $\Gamma = K_{eq}$. -->
<!-- \item The disequilibrium ratio, $\rho$, is the ratio of the mass-action ratio and equilibrium constant. -->
<!-- \end{enumerate} -->

<!-- \end{enumerate} -->

---

## Index terms recorded in this chapter

- $K_a$
- $K_d$
- $v_i$
- association constant
- chemical equilibrium
- disequilibrium ratio
- dissociation constant
- equilibrium constant
- functional parts
- mass-action kinetics
- mass-action ratio
- rate constant
- rate of change
- reaction kinetics
- reaction rate
- reversible
- stoichiometric amount
- stoichiometric coefficient

---

← [[01_cellular_networks|Cellular Networks]] · [[index|Wiki index]] · [[03_stoichiometric_networks|Stoichiometric Networks]] →
