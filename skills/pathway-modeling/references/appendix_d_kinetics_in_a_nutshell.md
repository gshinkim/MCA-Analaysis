# Kinetics in a Nutshell

*Source: `appendixD.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Kinetics in a Nutshell <a id="app-kineticsnutshell"></a>

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

$$
\begin{align}
\frac{d\!A}{\dt} = c_a v
\label{eqn:StoichReactionRate2}
\end{align}
$$

## Elementary Mass-Action Kinetics

An elementary reaction is one that cannot be broken down into simpler reactions. Such reactions will often display simple kinetics called mass-action kinetics. For a reaction of the form:

\[ a A + b B + ... \rightarrow + p P + q Q + ... \]

the mass-action kinetic rate law is given by:

\[ v = k_1 A^a B^b ... - k_2 P^p Q^q ... \]

where $k_1$ and $k_2$ are the forward and reverse rate constants, respectively.

## Chemical Equilibrium

In principle, all reactions are reversible, meaning transformations can occur from reactant to product or product to reactant.
The net rate of a reversible reaction is the difference between the forward and reverse rates. At chemical equilibrium the forward and reverse rates are equal. Chemical equilibrium is described  by the relation:

$$
\begin{equation}
\frac{B}{A} = K_{eq}
\label{eqn:rateConstantRatio2}
\end{equation}
$$

This ratio has special significance and is called the **equilibrium constant**,
denoted by $K_{eq}$. The equilibrium constant is also related to the ratio of the rate constants, $k_1/k_2$. For a general reversible reaction such as:

$$ a A + b B + ... \rightleftharpoons p P + q Q + ... $$

and using arguments similar to those described above, the ratio of the rate constants can be easily shown to be:

$$
\begin{equation}
K_{eq} = \frac{P^{p} Q^{q} \ldots}{A^{a} B^{b} \ldots} = \frac{k_1}{k_2}
\label{eqn:GeneralKeq2}
\end{equation}
$$

where the exponents are the stoichiometric *amounts* for each species.

## Mass-action and Disequilibrium Ratio

Although in closed systems reactions tend to equilibrium, reactions occurring in living cells are generally out of equilibrium and the ratio of the products to the reactants *in vivo* is called the **mass-action ratio**, $\Gamma$. The ratio of the mass-action ratio to the equilibrium constant is called the **disequilibrium ratio**:

$$
\begin{equation} \rho = \frac{\Gamma}{K_{eq}} \label{eqn:disequilbrium3} \end{equation}
$$

At equilibrium the mass-action ratio will be equal to the equilibrium constant, that is $\rho = 1$. If the reaction is away from equilibrium ($B/A < K_{eq}$), then $\rho < 1$.

For a simple unimolecular reaction it was previously shown that the equilibrium ratio of product to reactant, $B/A$, is equal to the ratio of the forward and reverse rate constants. Substituting this into the disequilibrium ratio gives:

$$ \rho = \Gamma \frac{k_2}{k_1} = \frac{B}{A} \frac{k_2}{k_1} $$

Therefore:

$$
\begin{equation} \rho = \frac{v_r}{v_f} \label{eqn:disequilbrium4} \end{equation}
$$

That is, the disequilibrium ratio is the ratio of the reverse and forward rates. If $\rho < 1$, the net reaction must be in the direction of product formation. If $\rho$ is zero, the reaction is as out of equilibrium as possible with no product present.

## Modified Mass-Action Rate Laws <a id="app-modifiedmassactionratelaw"></a>

A typical reversible mass-action rate law will require both the forward and the reverse rate constants to be fully defined. Often however, only one rate constant may be known. In these circumstances it is possible to express the reverse rate constant in terms of the equilibrium constant.

For example, given the simple unimolecular reaction, $ A \rightleftharpoons B $, it is possible to derive the following:

$$
\begin{align}
v &= k_1 A - k_2 B \nonumber \\
v &= k_1 A \left(1 - \frac{k_2 B}{k_1 A}\right) \nonumber \\
\mbox{Since } K_{eq} &= \frac{k_1}{k_2} \nonumber \\
v &= k_1 A \left(1 - \frac{\Gamma}{K_{eq}}\right)
\label{eqn:modMassAction2}
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

- $v_i$
- chemical equilibrium
- disequilibrium ratio
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

← [[appendix_c_answers_to_questions|Answers to Questions]] · [[index|Wiki index]] · [[appendix_e_enzyme_kinetics_in_a_nutshell|Enzyme Kinetics in a Nutshell]] →
