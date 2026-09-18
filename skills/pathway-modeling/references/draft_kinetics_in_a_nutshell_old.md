# Kinetics in a Nutshell (earlier draft)

*Source: `chapter2_Old.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Kinetics in a Nutshell <a id="chap-kineticsnutshell"></a>

## Introduction

Understanding chemical kinetics is at the heart of building biochemical models. This chapter gives a minimal introduction to some of the essential concepts of elementary chemical kinetics. A fuller account is given in the companion book, `Enzyme Kinetics for Systems Biology'. This chapter may be omitted by those already familiar with this topic.

## Definitions

Reaction kinetics is the study of how fast chemical reactions take place, what factors influence the rate of reaction, and what mechanisms are responsible.

### Stoichiometric Amount

The **stoichiometric amount** is the number of molecules for a particular reactant or products takes part in a given reaction reaction. For example:

$$ 2 A + 3 B \rightarrow A + 3 C $$

In the above example the stoichiometric amount for reactant $A$ is 2 and for $B$ is 3. The stoichiometric amount for product $A$ is 1 and for $C$ is 3.

### Depicting Reactions

$$ a A + b B + ... \rightarrow + p P + q Q + ... $$

where $a, b, ..., p, q, ...$ are stoichiometric amounts.

### Rates of Change

The rate of change is defined as the rate of change in concentration or amount of a designated molecular species.

$$ Rate of Change = \frac{dS}{dt} $$

### Stoichiometric coefficients

The **stoichiometric coefficient**, $c_i$, for a molecular species $A_j$, is the difference between the molar amount of species, $i$ -- also called the **stoichiometric amount** -- on the product side and the molar amount of the same species on the reactant side.

$$ c_i = Molar Amount of Product - Molar Amount of Reactant $$

In the reaction, $2 A \longrightarrow B$, the molar amount of $A$ on the product side is zero while on the reactant size it is two. Therefore the stoichiometric coefficient of $A$ is given by $0-2 = -2$. In many cases a particular species will only occur on the reactant or product side but it is not uncommon to find situations where a species occurs simultaneously as a product and a reactant. As a result, reactant stoichiometric coefficients tend to be *negative* while product stoichiometric coefficients tend to be *positive*.

### Reaction Rates

The **reaction rate**, often denoted by the symbol $v$, is measured with respect to a given molecular species normalized by the species stoichiometric coefficient. This definition ensures that no matter which molecular species in a reaction is measured, the reaction rate is uniquely defined for that reaction. More formally, the reaction rate for the given reaction is:

$$ a A + b B + ... \rightarrow p P + q Q + ... $$

$$ v  = \frac{1}{c_a} \frac{d\!A}{\dt} = -\frac{1}{c_b}
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

\[ a A + b B + ... \rightarrow + p P + q Q + ... \]

the mass-action kinetic rate law is given by:

\stateEquation{
\[ v = k_1 A^a B^b ... - k_2 P^p Q^q ... \]
}

where $k_1$ and $k_2$ are the forward and reverse rate constants, respectively.

## Chemical Equilibrium

In principle, all reactions are reversible, meaning transformations can occur from reactant to product or product to reactant.
The net rate of a reversible reaction is the difference between the forward and reverse rates. Given a reversible reaction such as:

$$ A \rightleftharpoons B $$

we can observe the concentrations of $A$ and $B$ approach equilibrium (Figure [[02_kinetics_in_a_nutshell|Chemical Equilibrium]]).

**Figure** <a id="fig-approachtoequil"></a> `fig:ApproachToEquil`

*Caption:* Approach to equilibrium for the reaction $ A \rightleftharpoons B $, $k_1 = 0.6,  k_2 = 0.4,  A(0) = 1,  B(0) = 0$. Progress curves calculated from the solution to the differential equation $d\!A/dt = k_2 B - k_1 A$.  

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}
\begin{axis}[
ylabel={\small Concentration of $A$ and $B$},
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
\caption{Approach to equilibrium for the reaction $ A \rightleftharpoons B $, $k_1 = 0.6,\ \ k_2 = 0.4,\ \ A(0) = 1,\ \ B(0) = 0$. Progress curves calculated from the solution to the differential equation $d\!A/dt = k_2 B - k_1 A$.  } \label{fig:ApproachToEquil}
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

$$  \mathrm{HA} \rightleftharpoons \mathrm{H} + \mathrm{A} $$

chemists and biochemists will often distinguish between two kinds of equilibrium constants called association and
dissociation constants. Thus the equilibrium constant for the above bimolecular reaction is often called the
**dissociation constant**, $K_d$:

$$K_d = \frac{\mathrm{H} \cdot \mathrm{A}}{\mathrm{HA}}$$

to indicate the degree that the complex is dissociated into its component molecules at equilibrium. The
**association constant**, $K_a$, though less commonly used, describes
the equilibrium constant for the reverse process $ \mathrm{H} + \mathrm{A} \rightleftharpoons \mathrm{HA}$,
that is the formation of a complex from component molecules:

$$K_a = \frac{\mathrm{HA}}{\mathrm{H} \cdot \mathrm{A}} $$

It should be evident that:

\stateEquation{

$$
\begin{equation}
K_d = \frac{1}{K_a}
\end{equation}
$$

}

The equilibrium constant is also related to the standard free energy change, $Delta G^o$, such that:

$$ \Delta G^o =  - R T \ln K_{eq} $$

where $R$ is the gas constant, and $T$ the temperature.  Rearranged we can also see that:

$$
\begin{equation}
K_{eq} = e^{-\Delta G^o/RT}
\label{eqn:KeqDeltaG}
\end{equation}
$$

## Mass-action and Disequilibrium Ratio

Although in closed systems reactions tend to equilibrium, reactions occurring in living cells are generally out of equilibrium and the ratio of the products to the reactants *in vivo* is called the **mass-action ratio**, $\Gamma$. The ratio of the mass-action ratio to the equilibrium constant is called the **disequilibrium ratio**:

\stateEquation{

$$
\begin{equation} \rho = \frac{\Gamma}{K_{eq}} \label{eqn:disequilbrium} \end{equation}
$$

}
At equilibrium the mass-action ratio will be equal to the equilibrium constant, that is $\rho = 1$. If the reaction is away from equilibrium ($B/A < K_{eq}$), then $\rho < 1$.

For a simple unimolecular reaction it was previously shown that the equilibrium ratio of product to reactant, $B/A$, is equal to the ratio of the forward and reverse rate constants. Substituting this into the disequilibrium ratio gives:

$$ \rho = \Gamma \frac{k_2}{k_1} = \frac{B}{A} \frac{k_2}{k_1} $$

Therefore:

$$
\begin{equation} \rho = \frac{v_r}{v_f} \label{eqn:disequilbrium2} \end{equation}
$$

That is, the disequilibrium ratio is the ratio of the reverse and forward rates. If $\rho < 1$, the net reaction must be in the direction of product formation. If $\rho$ is zero, the reaction is as out of equilibrium as possible with no product present.

## Modified Mass-Action Rate Laws <a id="chap-modifiedmassactionratelaw"></a>

A typical reversible mass-action rate law will require both the forward and the reverse rate constants to be fully defined. Often however, only one rate constant may be known. In these circumstances it is possible to express the reverse rate constant in terms of the equilibrium constant.

For example, given the simple unimolecular reaction, $ A \rightleftharpoons B $, it is possible to derive the following:

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

$$ v = k_1 A^{a} B^{b} ... \left( 1 - \frac{\Gamma}{K_{eq}}\right) = k_1 A^{a} B^{b} ... (1 - \rho) $$

where $A^{a} B^{b} ...$ represents the product of all reactant species, $a$ and $b$ are the **corresponding** stoichiometric amounts, and $\rho$ is the disequilibrium ratio. For example, for the reaction:

$$ 2 A + B \longrightarrow C + 2 D $$

where $k_1$ is the forward rate constant, the modified reversible rate law is:

$$ v = k_1 A^2 B \left(1 - \rho \right) $$

The modified formulation demonstrates how a rate expression can be divided up into functional parts to include both kinetic and thermodynamic components [Hofmeyr1995]. The kinetic component is represented by the term $k_1 A^{a} B^{b} ..., $ while the thermodynamic component is represented by the expression $1 - \rho$.

We can also derive the modified rate law in the following way. Given the net rate of reaction $v = v_f - v_r$, we can write this expression as:

$$ v = v_f \left( 1 - \frac{v_r}{v_f} \right) $$

That is:

$$ v = v_f (1 - \rho) $$

## Further Reading

- Sauro HM (2012) Enzyme Kinetics for Systems Biology. 2nd Edition, Ambrosius Publishing ISBN: 978-0982477335

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

← [[draft_branched_and_cyclic_systems|Branched and Cyclic Systems (unpublished draft)]] · [[index|Wiki index]] · [[supplement_computer_simulation_methods|Computer Simulation Methods]] →
