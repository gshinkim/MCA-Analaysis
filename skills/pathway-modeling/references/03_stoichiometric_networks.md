# Stoichiometric Networks

*Source: `chapter3.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Stoichiometric Networks <a id="chap-stoichiometricnetworks"></a>

<!-- \footnote{For those unfamiliar with chemical kinetics, Appendix~\ref{app:KineticsNutshell} gives a summary of the most relevant points.} -->

## Stoichiometric Networks

Almost all cellular events involve some kind of chemical process that includes binding, unbinding, or transformation of compounds in specific stoichiometric amounts. The binding of the yeast cell cycle proteins cdc2 and cdc13 to form a cdc2-cdc13 complex, or the isomerization of glucose-6-phosphate to fructose-6-phosphate are two notable examples. When we put a collection of these processes together, we form a **stoichiometric network**.

One of the key characteristics of stoichiometric networks is that mass is conserved at each transformation step. For example, the transformation S$_1 \rightarrow$ S$_2$ means that when one molecule of S$_1$ disappears, one molecule of S$_2$ is formed. An example of a very simple and minimal stoichiometric network is the two step pathway shown below:

```latex
\begin{tikzpicture}[>=latex', node distance=2cm]

  \node (S1) {\Large S$_1$};
  \node [right of = S1] (S2) {\Large S$_2$};
  \node [right of = S2] (S3) {\Large S$_3$};

  \draw [->,ultra thick,blue] (S1) -- node[above, black] {$v_1$} (S2);
  \draw [->,ultra thick,blue] (S2) -- node[above, black] {$v_2$} (S3);

\end{tikzpicture}
```

In this system mass is conserved at every stage. In more sophisticated models where electric charge is also considered, charge will be conserved as well.

### Elementary Reactions

Chemical reactions that involve no reaction intermediates other than a single transition state are called **elementary reactions**.

Elementary reactions have been depicted in a number of ways in the literature. For example, the transformation of one species into another can be represented by a simple line with an arrow at the tip. The direction of the arrow indicates the direction of the *positive* reaction rate (Figure [Figure: Simple Transformations](#fig-simpletransformation)). If a reaction rate is $-0.75$ mol l$^{-1}$, this means the reaction proceeds in the *opposite* direction indicated by the arrow at a rate of $0.75$ mol l$^{-1}$.

**Figure** <a id="fig-simpletransformation"></a> `fig:simpleTransformation`

*Graphic (not in the LaTeX source, referenced by name): `VisualSimpleTransformation`*

*Caption:* Simple Transformations. a) A single arrow, indicates positive rate direction.  b) Two arrows showing explicit reversibility. c) Common barb style used to indicate reversibility. d) Reversibility with dominant arrow indicating positive direction.

```latex
\begin{figure}[!htbp]
\begin{center}
  \includegraphics[scale = 0.55]{VisualSimpleTransformation}
  \caption{Simple Transformations. a) A single arrow, indicates positive rate direction.  b) Two arrows showing explicit reversibility. c) Common barb style used to indicate reversibility. d) Reversibility with dominant arrow indicating positive direction.}
  \label{fig:simpleTransformation}
\end{center}
\end{figure}
```

Most if not all reactions are in principle reversible, that is, the reaction can only go in both directions. Unless otherwise stated by the author, the reversibility is defined by the rate law attached to the reaction. Sometimes reversibility is explicitly indicted by using multiple arrows. These come in various forms.  One approach is to use two lines and add arrowheads to both the reactant and product line as shown in Figure [Figure: Simple Transformations](#fig-simpletransformation)b. Other authors add a smaller reverse arrow as shown in Figure [Figure: Simple Transformations](#fig-simpletransformation)d, or more commonly use a barbed style as shown in Figure [Figure: Simple Transformations](#fig-simpletransformation)c. In example (d) and (c) it is not possible to know which direction represents the positive reaction rate unless it is assumed left to right.

For a bimolecular reaction that depicts dissociation or association, the notation is shown in Figure [Figure: Dissociation and Association Reactions](#fig-visualassocdissoctransformation) (a) and (b).

**Figure** <a id="fig-visualassocdissoctransformation"></a> `fig:VisualAssocDissocTransformation`

*Graphic (not in the LaTeX source, referenced by name): `VisualAssocDissocTransformation`*

*Caption:* Dissociation and Association Reactions. (a) Equal stoichiometric proportions of compounds A and B combine to form a complex, C. (b) Likewise, complex A dissociates into equal proportions of B and C.

```latex
\begin{figure}[!htbp]
\begin{center}
  \includegraphics[scale = 0.6]{VisualAssocDissocTransformation}
  \caption{Dissociation and Association Reactions. (a) Equal stoichiometric proportions of compounds A and B combine to form a complex, C. (b) Likewise, complex A dissociates into equal proportions of B and C.}
  \label{fig:VisualAssocDissocTransformation}
\end{center}
\end{figure}
```

This style makes it clear that there is a stoichiometric constraint between A and B and B and C. One molecule of A reacts with one molecule of B to form one molecule of C. This notation can be misused for example where lines departing from a branch point are joined, thereby implying a stoichiometric constraint when none actually exists.

The simple association and dissociation reactions can be naturally extended to depict situations where both association and dissociation occur in the same reaction as show in Figure [Figure: A bimolecular interaction, coupling one process, A to C, to another, B](#fig-simplebibitransformation).

**Figure** <a id="fig-simplebibitransformation"></a> `fig:simpleBiBiTransformation`

*Graphic (not in the LaTeX source, referenced by name): `VisualBiBiTransformation`*

*Caption:* A bimolecular interaction, coupling one process, A to C, to another, B to D. Equal proportions of A and B combine to form equal proportions of C and D.

```latex
\begin{figure}[!htbp]
\begin{center}
  \includegraphics[scale = 0.6]{VisualBiBiTransformation}
  \caption{A bimolecular interaction, coupling one process, A to C, to another, B to D. Equal proportions of A and B combine to form equal proportions of C and D.}
  \label{fig:simpleBiBiTransformation}
\end{center}
\end{figure}
```

**Example**
<a id="exmp-elementnetwork1"></a>
Write out the individual reactions for the following network, taking care to indicate the correct stoichiometries.

```latex
\begin{tikzpicture}[scale=1, >=latex', node distance=2cm]

  \node (S0) {\Large S$_1$};
  \node [right of = S0] (S1) {\Large S$_2$};
  \node [above right of = S1] (S2) {\Large S$_3$};
  \node [below right of = S1] (S3) {\Large S$_4$};

  \draw [->,ultra thick,blue] (S0) -- node[above, black] {$v_1$} (S1);
  \draw [->,ultra thick,blue] (S1) -- node[above left, black] {$v_2$} (S2);
  \draw [->,ultra thick,blue] (S1) -- node[below left, black] {$v_3$} (S3);
\end{tikzpicture}
```

Answer:

$$
\begin{align*}
\text{S}_1 &\rightarrow \text{S}_2 \\
\text{S}_2 &\rightarrow \text{S}_3 \\
\text{S}_2 &\rightarrow \text{S}_4
\end{align*}
$$

One area that is sometimes problematic is visually depicting reactions with non-unity stoichiometry. The previous examples assumed that each molecular species had a stoichiometry of one. However, what if species A in Figure [Figure: Dissociation and Association Reactions](#fig-visualassocdissoctransformation) has a stoichiometry of 2 and B a stoichiometry of 3. How should these be represented? Figure [Figure: Alternative ways for visually depicting non-unit stoichiometries](#fig-visualstoichassociationtransformation) shows three depictions that have been used by authors in the past. Sometimes simple arc extensions are used to indicate the stoichiometry, as seen in Figure [Figure: Alternative ways for visually depicting non-unit stoichiometries](#fig-visualstoichassociationtransformation)a. A variation of (a) is to use small barbs at the tips of the reaction arcs [Clarke80] where the number of barbs indicate the stoichiometry as seen in Figure [Figure: Alternative ways for visually depicting non-unit stoichiometries](#fig-visualstoichassociationtransformation)b. Finally, stoichiometric numbers may be placed near the tips of the arcs, as shown in Figure [Figure: Alternative ways for visually depicting non-unit stoichiometries](#fig-visualstoichassociationtransformation)c.

**Figure** <a id="fig-visualstoichassociationtransformation"></a> `fig:VisualStoichAssociationTransformation`

*Graphic (not in the LaTeX source, referenced by name): `VisualStoichAssociationTransformation`*

*Caption:* Alternative ways for visually depicting non-unit stoichiometries. The use of numbers in (c) makes it possible to depict fractional stoichiometries.

```latex
\begin{figure}[!htbp]
\begin{center}
  \includegraphics[scale = 0.6]{VisualStoichAssociationTransformation}
  \caption{Alternative ways for visually depicting non-unit stoichiometries. The use of numbers in (c) makes it possible to depict fractional stoichiometries.}
  \label{fig:VisualStoichAssociationTransformation}
\end{center}
\end{figure}
```

**Example**
<a id="exmp-elementnetwork2"></a>
The following network is made from four elementary reactions. Write out the individual reactions, taking care to indicate the correct stoichiometries.

\includegraphics[scale = 0.6]{exampleElementaryNetwork}
  <a id="fig-exampleelementarynetwork"></a>

Answer:

$$
\begin{align*}
2\ \text{A} &\rightarrow \text{B} \\
\text{B} &\rightarrow 3\ \text{C} \\
\text{A} + \text{C} &\rightarrow \text{D}
\end{align*}
$$

## Non-Elementary Reactions

Non-elementary reactions include all reactions that have hidden reaction intermediates. The most familiar is the enzymatic reaction where the enz\-y\-me-substrate complex and free enzyme are rarely shown in network diagrams. The effect of hiding intermediates is that it is possible to include regulatory links. For example, an enzyme may be regulated by an allosteric effector where the underlying mechanism is quite complex. Very often this mechanism will be hidden and instead, the action of the effector will be represented by a simple regulatory line in the diagram. For example, if an enzyme that catalyzes the conversion of species S$_1$ to S$_2$ is inhibited by a repressor molecule $R$, or activator A, then we can depict this situation as shown in Figure [Figure: Depicting regulation:](#fig-modifierregulation).

**Figure** <a id="fig-modifierregulation"></a> `fig:modifierRegulation`

*Graphic (not in the LaTeX source, referenced by name): `modifierRegulation`*

*Caption:* Depicting regulation: a) Repression; b) Activation.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.8]{modifierRegulation}
  \caption{Depicting regulation: a) Repression; b) Activation.}
  \label{fig:modifierRegulation}
\end{center}
\end{figure}
```

The blunt end representing inhibition is fairly well established in the literature, while the activation symbol is more variable. Here we will employ a filled circle at the end point to indicate activation. If a non-elementary reaction is regulated by multiple inputs, we would use a depiction similar to what is shown in Figure [Figure: Multiple regulators on one reaction](#fig-modifierregulationb).

**Figure** <a id="fig-modifierregulationb"></a> `fig:modifierRegulationB`

*Graphic (not in the LaTeX source, referenced by name): `RegulatedReaction`*

*Caption:* Multiple regulators on one reaction.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.7]{RegulatedReaction}
  \caption{Multiple regulators on one reaction.}
  \label{fig:modifierRegulationB}
\end{center}
\end{figure}
```

In hiding detailed mechanisms we also invoke certain assumptions when converting the diagrams to a mathematical model.  In the case of a simple enzyme mechanism, we will often assume the rapid-equilibrium or steady state assumption for the formation of enzyme-substrate complex (See Appendix [[appendix_e_enzyme_kinetics_in_a_nutshell|Enzyme Kinetics in a Nutshell]]). Sometimes these assumptions are reasonable, other times they are not. For a more comprehensive discussion of these issues see the companion book `Enzyme Kinetics for Systems Biology'.

In Chapter [[01_cellular_networks|Cellular Networks]] the diagrammatic notation shown in Figure [Figure: Representing a single gene](#fig-singlegenenotation2) was used for representing gene regulatory networks. This single genetic unit is certainly non-elementary as it hides a considerable amount of detail. We can treat the unit as if it were a reaction step whose rate of reaction is the rate of protein expression.

**Figure** <a id="fig-singlegenenotation2"></a> `fig:singleGeneNotation2`

*Graphic (not in the LaTeX source, referenced by name): `singleGeneNotation`*

*Caption:* Representing a single gene. I represents the inducer and P the expressed protein.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[angle=0, scale = 0.7]{singleGeneNotation}
  \caption{Representing a single gene. I represents the inducer and P the expressed protein.}
  \label{fig:singleGeneNotation2}
\end{center}
\end{figure}
```

It is important to remember that whenever one sees a regulatory link in a reaction step, it always means that the reaction is non-elementary and hides other mechanistic details. The use of non-elementary reactions is a high level representation because unwrapping every non-elementary reaction into its full set of elementary reactions would make the network overly complex to view, understand and parameterize. Figure [Figure: Equivalent networks made from non-elementary and elementary components](#fig-explodednetwork) illustrates an example of a simple pathway drawn using non-elementary reactions together with a feedback inhibition step and the equivalent unwrapped view of the same system. The exploded view is clearly more complex. The mechanism chosen for the inhibition is the simplest possible, and therefore the unwrapped view could potentially be even more complex. There will be many instances where we will not know how an effector acts mechanistically and therefore unwrapping an elementary reaction is not even an option.

**Figure** <a id="fig-explodednetwork"></a> `fig:explodedNetwork`

*Graphic (not in the LaTeX source, referenced by name): `explodedNetwork`*

*Caption:* Equivalent networks made from non-elementary and elementary components.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 1.1]{explodedNetwork}
  \caption{Equivalent networks made from non-elementary and elementary components.}
  \label{fig:explodedNetwork}
\end{center}
\end{figure}
```

### Text Representation

Although representing biochemical networks using pictures is very common, it is also possible to represent networks using a text notation. Text representations are particulary easy for computers to read. For example, a linear chain of four reactions is shown in Figure [Figure: Simple textual representation of a linear chain of three reactions and](#textrepresentation).

If a species is converted to a waste product such as degradation fragments, then the symbol $\emptyset$ is typically used to represent the empty species set. For example:

{\tt
   A + B -> 2 C

   C -> $\emptyset$
}

Three software tools that support text based input are Jarnac [sauro:2000], Antimony [smith2009antimony], and PySCeS [Pysces2005]. The Python based application called Tellurium (<tellurium.analog\-machine.org> integrates Antimony and the simulator libRoadRunner (<libroadrunner.org>) and will be used to illustrate all models in this book. There are also rule-based text notations but these are beyond the scope of this book and are supported by tools such as BioNetGen or PySB. See Maus et al. for a review [maus2011rule].

In this book models will be expressed in the Antinomy syntax which was itself derived and improved from the Jarnac syntax [sauro:2000]. For example, to represent the above model, we would write the script in Antimony as shown in Listing `jarnac:chap:exampleScript`.

{

**Figure** <a id="textrepresentation"></a> `textRepresentation`

*Caption:* Simple textual representation of a linear chain of three reactions and four molecular species.

```latex
\begin{figure}[htb]
\begin{verbatim}
                     S1 -> S2
                     S2 -> S3
                     S3 -> S4
\end{verbatim}\vspace{-3mm}
\setlength{\abovecaptionskip}{-10mm}
\caption{Simple textual representation of a linear chain of three reactions and four molecular species.}
\label{textRepresentation}
\end{figure}}
```

```python
// Example model using Antimony notation
   $A + B -> 2 C; k1*A*B;
   C -> ; k2*C;
```

The $ sign in front of species `A` means that the species concentration is fixed. This means that when compiled by a simulator such as libRoadRunner no differential equation for this specie will be generated(footnote: We will return to the idea of `fixed species' in the next chapter.}.

\stateComment{
The $ sign in front of a species `A` means that the concentration of A is fixed.
}

Also note that Antimony permits empty reactants or products in a reaction. In this case the second reaction that consumes C does not specify what C is converted to, only its rate, `k2*C`. The implication here is that the products of reaction from C emerge into a large volume such that their concentrations remain approximately unchanged during the process. It also implies that the products do not affect the reaction, also evident in the rate law.

We can also use Antimony to initialize concentrations and parameters, Listing `antimony:chap:exampleScript`.

```python
// Example Antimony script with value initialization
   $A + B -> C; k1*A*B;
   C -> ; k2*C;

   // Initialize values
   k1 = 0.34; k2 = 4.5;
   A = 10; B = 0; C = 0;
```

Antimony offers a host of other features including models composed of other models, and the ability to specify discrete events directly in the model.

For example:

```python
// Example Antimony script
   A + B -> C; k1*A*B;
   C -> ; k2*C;

   // When time reaches 5 time units, halve the k2 rate constant
   at (time >= 5) : k2 = k2/2;

k1 = 0.34; k2 = 4.5;
A = 10; B = 0; C = 0;
```

## Standard Visualization Notation

Cellular networks have been depicted on wall charts for many decades using a variety of informal notations which we have briefly reviewed. With the increased interest in protein and gene regulatory networks, the variety of notations has proliferated. As a result, there have been some efforts, must notably the Systems Biology Graphical Notation (SBGN), to define a standard set of node and edge symbols to represent stoichiometric networks. Another visual notation is employed by Biotapestry [longabaugh2005] which provides a concise and easy to read notation for representing gene regulatory networks.

SBGN can represent stoichiometric networks using a notation called SBGN process description. For example, Figure [Figure: SBGN notation for enzyme catalyzed reactions](#fig-sbgnenzymes) illustrates the SBGN approach to representing an enzyme catalyzed reaction. Round shaped nodes or a stadium shape (pill shaped) represent small molecules such as DHAP, ATP and F6P. Rounded rectangles are used to represent macromolecules, in this case enzymes TPase (Triose phosphate Isomerase) and PFK (phosphofructokinase). In the second reaction (Figure [Figure: SBGN notation for enzyme catalyzed reactions](#fig-sbgnenzymes)) ATP negatively regulates the reaction.

**Figure** <a id="fig-sbgnenzymes"></a> `fig:SBGNEnzymes`

*Graphic (not in the LaTeX source, referenced by name): `SBGNEnzymes`*

*Caption:* SBGN notation for enzyme catalyzed reactions. 

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.7]{SBGNEnzymes}
  \caption{SBGN notation for enzyme catalyzed reactions. }
  \label{fig:SBGNEnzymes}
\end{center}
\end{figure}
```

Full details of this visual specification can be found at the SBGN web site <www.sbgn.org>; Figure [Figure: SBGN notation Reference Card, reused but modified with color shading f](#fig-sbgnrefcard) summarizes the main symbols.

<!-- \begin{table} -->
<!-- \centering -->
<!-- \tikzstyle{mycircle}=[circle,thick,minimum size=0.48cm,draw=blue!80,fill=blue!20] -->
<!-- \tikzstyle{process}=[rectangle,thick,minimum size=0.3cm,draw=red!80,fill=red!20] -->

<!-- \begin{tikzpicture}[>=latex,node distance = 1.5cm,scale=0.8] -->

<!-- % Simple process -->
<!-- \node[mycircle,draw] (0,0) (A1) {$A$}; -->
<!-- \node[minimum height=0.3cm,minimum width=0.3cm,process,draw] [right of = A1] (P1) {\phantom{ }}; -->
<!-- \node[mycircle,draw] [right of = P1] (B1) {$B$}; -->

<!-- \draw [-,very thick] (A1) to node {} (P1); -->
<!-- \draw [->,very thick] (P1) to node {} (B1); -->
<!-- \draw (1.6,-1.25) node {a) Simple Process}; -->

<!-- % Process with multiple reactants and products -->
<!-- \node[mycircle,draw] at (5,0) (A2) {$A$}; -->
<!-- \node[minimum height=0.3cm,minimum width=0.3cm,process,draw] [right of = A2] (P2) {\phantom{ }}; -->
<!-- \node[mycircle,draw] [right of = P2] (B2) {$B$}; -->

<!-- \node[minimum height=0.6cm,minimum width=0.6cm,mycircle,above of=A2,draw] (C1) {\scriptsize ATP}; -->
<!-- \node[minimum height=0.6cm,minimum width=0.6cm,mycircle,above of=B2,draw] (C2) {\scriptsize ADP}; -->

<!-- \draw [-,very thick] (C1) to[bend right=40] node {} (P2); -->
<!-- \draw [->,very thick] (P2) to[bend right=40] node {} (C2); -->

<!-- \draw [-,very thick] (A2) to node {} (P2); -->
<!-- \draw [->,very thick] (P2) to node {} (B2); -->
<!-- \draw (6.5,-1.25) node {b) Multiple Reactants}; -->

<!-- % Basic symbols, simple molecule -->
<!-- \draw[thick,minimum size=0.5cm,draw=blue!80,fill=blue!20] (1.9,-3) circle (0.4cm) node {A}; -->
<!-- \draw[anchor=west] (0.0,-3.9) node {c) Simple Chemical}; -->

<!-- % Basic symbols, macromolecule -->
<!-- \node[draw,thick,draw=blue!80,fill=blue!20,rectangle, minimum width=2cm,minimum height=1cm,rounded corners] at (2,-5.2) {M}; -->
<!-- \draw[anchor=west] (0.0,-6.2) node {e) Macromolecule}; -->

<!-- % Catalysis -->
<!-- \coordinate (start) at (5.5, -2.5); -->
<!-- \draw[-|,very thick] (start) -- ++(2,0); -->
<!-- \draw[draw=red!80,fill=red!20,thick] ($(start) + (2.25,0.2)$) rectangle ++(0.4,-0.4); -->
<!-- \draw[anchor=west] ($(start) + (-0.1,-0.5) $) node {Inhibition}; -->

<!-- % Stimulation -->
<!-- \coordinate (start) at (5.5, -3.6); -->
<!-- \draw[-o,very thick] (start) -- ++(2,0); -->
<!-- \draw[draw=red!80,fill=red!20,thick] ($(start) + (2.25,0.2)$) rectangle ++(0.4,-0.4); -->
<!-- \draw[anchor=west] ($(start) + (-0.1,-0.5) $) node {Catalysis}; -->

<!-- % Inhibition -->
<!-- \coordinate (start) at (5.5, -4.7); -->
<!-- \draw[-open triangle 90,very thick] (start) -- ++(2,0); -->
<!-- \draw[draw=red!80,fill=red!20,thick] ($(start) + (2.25,0.2)$) rectangle ++(0.4,-0.4); -->
<!-- \draw[anchor=west] ($(start) + (-0.1,-0.5) $) node {Stimulation}; -->

<!-- \draw ($(start) + (1,-1.5)$) node {d) Connecting Arcs}; -->
<!-- \end{tikzpicture} -->
<!-- \caption{Some basic symbols used in SBGN.} -->
<!-- \end{table} -->

**Figure** <a id="fig-sbgnrefcard"></a> `fig:SBGNRefCard`

*Graphic (not in the LaTeX source, referenced by name): `SBGNRefCard`*

*Caption:* SBGN notation Reference Card, reused but modified with color shading from <www.sbgn.org>. 

```latex
\begin{figure}[p]
\begin{center}
  \includegraphics[scale = 0.55,angle=90]{SBGNRefCard}
  \caption{SBGN notation Reference Card, reused but modified with color shading from~\url{www.sbgn.org}. }
  \label{fig:SBGNRefCard}
\end{center}
\end{figure}
```

## Mass-Balance Equations

<!-- Ultimately there is the desire to convert a visual map of a biochemical network into a mathematical representation. An increasingly common need is to create quantitative models where one can either describe the distribution of flows in a network or investigate how the concentration of different species change in time. A quantitative model can be used to study different perturbations, such as knockouts, on the network's phenotype. In order to create such mathematical models we must consider a fundamental principle in biochemical networks which is {\bfseries mass conservation}. -->

Consider a simple network made up of two reactions, $v_1$ and $v_2$, with a common species, S. $v_1$ and $v_2$ are the rates of reaction such that $v_1$ is the rate at which S is produced and in the second reaction, $v_2$ is the rate at which S is consumed (Figure [Figure: Simple two step pathway](#fig-lineartwosteppathway)).

**Figure** <a id="fig-lineartwosteppathway"></a> `fig:LinearTwoStepPathway`

*Caption:* Simple two step pathway.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}
  \draw[color=blue,-latex,line width=1.9pt] (60pt,65pt) -- (95pt,65pt);
  \draw(65pt,75pt) node[anchor=west] {\large $v_1$};
  \draw(98pt,65pt) node[anchor=west] {\Large S};

  \draw[color=blue,-latex,line width=1.9pt] (120pt,65pt) -- (155pt,65pt);
  \draw(126pt,75pt) node[anchor=west] {\large $v_2$};
\end{tikzpicture}
\end{center}
\caption{Simple two step pathway.}
\label{fig:LinearTwoStepPathway}
\end{figure}
```

According to the law of conservation of mass, any observed change in the amount of species S must be due to the difference between the inward rate, $v_1$, and outward rate, $v_2$. That is, the change in S is the difference in the two rates, leading to the differential equation:

$$
\begin{align}
\frac{\dS}{\dt} = v_1 - v_2
\label{eqn:massconservationA}
\end{align}
$$

This equation is called a **mass-balance equation**. We can reexpress equation [Mass-Balance Equations](#eqn-massconservationa) as:

$$ \frac{dS_a}{dt}\frac{1}{V} = v_1 - v_2 $$

where S$_a$ is the amount in moles and $V$ is the volume. Alternatively, we note that:

$$
\begin{align*}
\frac{dS_a}{dt} &= V (v_1 - v_2)
\end{align*}
$$

This assumes the reaction rates are expressed in mol l$^{-1}$ t$^{-1}$. Biochemical models will sometimes assume a constant unit volume so that numerically:

$$ \frac{dS}{dt} = \frac{dS_a}{dt} $$

Although we will express the rate of change in terms of concentration, it is implied that we are dealing with a constant unit volume so that the change in concentration is the same as the change in amount. It is important to note that it is amounts that are mass conserved, not concentration. For example, if movement is from one compartment to another compartment with a different volume, it is necessary to factor in the volume difference and explicitly express the rate of change in amounts (We will consider this in more detail in  Chapter [[08_multicompartmental_systems|Multicompartmental Systems]]).

Unless otherwise stated, the following assumptions should be made about models in this book:

*1. Well-Stirred Reactor.* Many biochemical models assume that the volume in which reactions take place is well-stirred. This means there are no spatial inhomogeneities. For small cells such as *E. coli*, this is a reasonable assumption. The diffusion rate of molecules in the cytoplasm is so fast that a given small molecule will, on average, sample every location in the *E. coli* cell in one second. In larger eukaryotic cells spatial homogeneity may occur as there are known mechanisms to restrict diffusion of important molecules from a given location. As such, the assumption of a well-stirred reactor may still apply. Ultimately, the validity of the assumption rests with whether the model generates useful and verifiable predictions.

*2. Large number of molecules.* In the last chapter we reviewed the range of molecule and ion numbers found in biological cells. The numbers varied from a few copies for the LacI repressor protein to many millions in the case of ions. When there are large numbers of molecules or ions, concentrations can be approximated using a continuous value. In such cases we can use differential equations to model the rates of change. When dealing with small numbers of molecules however, concentration as a continuous variable may no longer make sense. For example, given that 1 nM roughly equates to one molecule per *E. coli* cell, it doesn't make much sense to quote a figure of 1.5 nM since that implies 1.5 molecules per cell. When dealing with small numbers of molecules, it is not possible to have a continuous range of concentrations. Under these circumstances a discrete probabilistic approach is best. We will come back to this important topic later.

*3. Unit Volume.* Unless otherwise indicated, we will assume *fixed unit volumes*.

### Models of Complex Networks

For more complex systems such as the one shown in Figure [Figure: Mass Balance:](#massbalancefigure) where there are multiple inflows and outflows, the mass-balance equation is given by:

**Figure** <a id="massbalancefigure"></a> `MassBalanceFigure`

*Caption:* Mass Balance: The rate of change in species S$_i$ is equal to the difference between the sum of the inflows and the sum of the outflows.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}
  \draw(50pt,65pt) node[anchor=west] {\Large S$_i$};
  \draw (-10pt,65pt) node[anchor=west] {Inflows};
  \draw (90pt,65pt) node[anchor=west] {Outflows};
  \draw (-10pt,20pt) node[anchor=west] {$d\!S_i/d\!t = \sum \mbox{Inflow} - \sum \mbox{Outflows}$};

  \draw[color=blue,-latex,line width=2pt] (0pt,90pt) -- (50pt,70pt);
  \draw[color=blue,-latex,line width=2pt] (0pt,40pt) -- (50pt,60pt);

  \draw[color=blue,-latex,line width=2pt] (70pt,70pt) -- (110pt,90pt);
  \draw[color=blue,-latex,line width=2pt] (70pt,60pt) -- (110pt,40pt);
\end{tikzpicture}
\end{center}
\caption{Mass Balance: The rate of change in species S$_i$ is equal to the difference between the sum of the inflows and the sum of the outflows.}
\label{MassBalanceFigure}
\end{figure}
```

\stateEquation{

$$
\begin{equation}
\displaystyle \frac{\dS_i}{\dt} = \sum
\mbox{\textit{Inflows}} - \sum \mbox{\textit{Outflows}} \vspace{6pt}
\label{MassBalanceEquation1}
\end{equation} }
$$

For an even more general representation, we can reexpress the mass-balance equations by taking into account the stoichiometric coefficients. The rate at which a given reaction, $v_j$, contributes to change in a species S$_i$, is given by the stoichiometric coefficient of the species, S$_i$ with respect to the reaction, $c_{ij}$ *multiplied* by the reaction rate, $v_j$ (See equation [[02_kinetics_in_a_nutshell|Reaction Rates]]). That is, a reaction $j$ contributes $c_{ij} v_j$ rate of change in species S$_i$. For example, with the reaction $A \rightarrow B$ which has a reaction rate $v$, and $c_A$ is -1, we can say that the reaction contributes $-1 v$ to the rate of change in A. For a species S$_i$ with multiple reactions producing and consuming S$_i$, the mass-balance equation (assuming constant unit volume) is given by:

\stateEquation{

$$
\begin{equation}
\displaystyle \frac{\dS_i}{\dt} = \sum_{j} c_{ij} v_j \vspace{4pt}
\label{MassBalanceEquation2}
\end{equation} }
$$

where $c_{ij}$ is the stoichiometric coefficient for species $i$ with respect to reaction, $j$. For reactions that consume a species, the stoichiometric coefficient is often *negative*; otherwise the stoichiometric coefficient is *positive* (See Chapter [[02_kinetics_in_a_nutshell|Kinetics in a Nutshell]]). In considering the simple example in Figure [Figure: Simple two step pathway](#fig-lineartwosteppathway), the stoichiometric coefficient for S with respect to $v_1$ is $+1$ and for $v_2$ is $-1$. That is:

$$
\begin{align*}
\frac{\dS}{\dt} &= c_{s1} v_1 + c_{s2} v_2 \\[8pt]
\text{or}\\[8pt]
\frac{\dS}{\dt} &= (+1) v_1 + (-1) v_2 = v_1 - v_2
\end{align*}
$$

How we describe the construction of the mass-balance equation may seem overly formal, however the formality allows us to write software that can automatically convert network diagrams into mass-balance differential equations.

**Example**
Consider a linear chain of reactants from S$_1$ to S$_5$ shown in Figure [Figure: Simple straight chain pathway](#fig-linearfoursteppathway). Write out the mass-balance equations for this simple system.

**Figure** <a id="fig-linearfoursteppathway"></a> `fig:LinearFourStepPathway`

*Caption:* Simple straight chain pathway.

```latex
\begin{figure}[hbt]
\begin{center}
\begin{tikzpicture}[>=latex, node distance=2cm]

  \node (S1) {\Large S$_1$};
  \node [right of = S1] (S2) {\Large S$_2$};
  \node [right of = S2] (S3) {\Large S$_3$};
  \node [right of = S3] (S4) {\Large S$_4$};
  \node [right of = S4] (S5) {\Large S$_5$};

  \draw [->,ultra thick,blue] (S1) -- node[above, black] {$v_1$} (S2);
  \draw [->,ultra thick,blue] (S2) -- node[above, black] {$v_2$} (S3);
  \draw [->,ultra thick,blue] (S3) -- node[above, black] {$v_3$} (S4);
  \draw [->,ultra thick,blue] (S4) -- node[above, black] {$v_4$} (S5);

\end{tikzpicture}
\end{center}
\caption{Simple straight chain pathway.}
\label{fig:LinearFourStepPathway}
\end{figure}
```

$$
\begin{align}
  \frac{\dS_1}{\dt} &= -v_1  &&   &\frac{\dS_2}{\dt} = v_1 - v_2 \nonumber \\[5pt]
  \frac{\dS_3}{\dt} &= v_2 - v_3 && &\frac{\dS_4}{\dt} = v_3 - v_4 \nonumber \\[5pt]
  && \frac{dS_5}{dt} = v_4
  \label{equ:StraightChainMassBalance}
\end{align}
$$

Each species in the network is assigned a mass-balance equation which accounts for the flows into and out of the species pool.

<!-- \hrule width \textwidth height 0.5pt -->

**Example**

Write out the mass-balance equation for the branched system shown in Figure [Figure: Multi-branched pathway](#fig-multibranch):

**Figure** <a id="fig-multibranch"></a> `fig:MultiBranch`

*Caption:* Multi-branched pathway.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}[scale=0.9, >=latex', node distance=2cm]

  \node (S0) {};
  \node [right of = S0] (S1) {\Large S$_1$};
  \node [above right of = S1] (S2) {};
  \node [below right of = S1] (S3) {\Large S$_2$};

  \node [above right of = S3] (S4) {};
  \node [below right of = S3] (S5) {};

  \draw [->,ultra thick,blue] (S0) -- node[above, black] {$v_1$} (S1);
  \draw [->,ultra thick,blue] (S1) -- node[above left, black] {$v_2$} (S2);
  \draw [->,ultra thick,blue] (S1) -- node[below left, black] {$v_3$} (S3);

  \draw [->,ultra thick,blue] (S3) -- node[above left, black] {$v_4$} (S4);
  \draw [->,ultra thick,blue] (S3) -- node[below left, black] {$v_5$} (S5);

\end{tikzpicture}
\end{center}
\caption{Multi-branched pathway.}
\label{fig:MultiBranch}
\end{figure}
```

<!-- \begin{figure}[htb] -->
<!-- \begin{center} -->
<!-- \begin{tikzpicture} -->
<!-- \draw(45pt,65pt) node[anchor=west] {\Large $S_1$}; -->

<!-- \draw[color=blue,-latex,line width=2pt] (0pt,65pt) -- (45pt,65pt); -->
<!-- \draw(13pt,75pt) node[anchor=west] {\large $v_1$}; -->

<!-- \draw[color=blue,-latex,line width=2pt] (65pt,70pt) -- (105pt,90pt); -->
<!-- \draw(70pt,89pt) node[anchor=west] {\large $v_2$}; -->

<!-- \draw[color=blue,-latex,line width=2pt] (65pt,60pt) -- (105pt,40pt); -->
<!-- \draw(70pt,43pt) node[anchor=west] {\large $v_3$}; -->

<!-- \draw(105pt,35pt) node[anchor=west] {\Large $S_2$}; -->

<!-- \draw[color=blue,-latex,line width=2pt] (130pt,40pt) -- (170pt,60pt); -->
<!-- \draw(135pt,59pt) node[anchor=west] {\large $v_4$}; -->

<!-- \draw[color=blue,-latex,line width=2pt] (130pt,30pt) -- (170pt,10pt); -->
<!-- \draw(130pt,3pt) node[anchor=west] {\large $v_5$}; -->
<!-- \end{tikzpicture} -->
<!-- \end{center} -->
<!-- \caption{Multi-Branched Pathway.} -->
<!-- \label{fig:Branch} -->
<!-- \end{figure} -->

The mass-balance equations are given by:

$$
\begin{eqnarray*}
\frac{\dS_1}{\dt} = v_1 - v_2 - v_3 \\[6pt]
\frac{\dS_2}{\dt} = v_3 - v_4 - v_5
\end{eqnarray*}
$$

**Example**
<a id="exmp-subtlestoich"></a>
Write out the mass-balance equation for the more complex pathway:

$$
\begin{eqnarray*}
\text{A} + \text{X} &\stackrel{v_1}{\longrightarrow}& 2 \text{X} \\[4pt]
\text{X} + \text{Y} &\stackrel{v_2}{\longrightarrow}& \text{Z} \\[4pt]
\text{Z} &\stackrel{v_3}{\longrightarrow}& \text{Y} + \text{B}
\end{eqnarray*}
$$

This example is more subtle because we need to take into account the stoichiometry change between the reactant and product side in the first reaction ($v_1$). In reaction $v_1$, the stoichiometric coefficient for $X$ is $+1$ because two X molecules are made for every one consumed. Taking this into account, the rate of change of species $X$ can be written as:

$$ \frac{\dX}{\dt} = -v_1 + 2 v_1 - v_2 $$

or more simply as $v_1 - v_2$. The full set of mass-balance equations can therefore be written as:

$$
\begin{align*}
\frac{\dA}{\dt} &= -v_1 && &\frac{\dX}{\dt} = v_1 - v_2 \\[5pt]
\frac{\dY}{\dt} &=  v_3 - v_2 && &\frac{\dZ}{\dt} = v_2 - v_3 \\[5pt]
&& \frac{\dB}{\dt} = v_3 \\
\end{align*}
$$

The last example ([Models of Complex Networks](#exmp-subtlestoich)) illustrates a very important aspect of converting a network diagram into a set of differential equations. The process is potentially **lossy**. That is, it is *not always possible* to fully recover the original network diagram from the set of derived differential equations. This is because in one or more of the reactions, the stoichiometries may cancel. In example ([Models of Complex Networks](#exmp-subtlestoich)) the reaction $A + X \longrightarrow 2 X $ is not recoverable from the final set of differential equations. Instead, if we reverse engineered the differential equations, the first reaction would be:

$$ A \rightarrow X $$

which is not like the original. This is not a common occurrence although in protein signaling pathways it might be more common than other kinds of networks. What it means however is that sharing models by exchanging differential equations is *not* recommended. This is one reason why standard exchange formats such as SBML [hucka:2003d] store models explicitly as a set of reactions, not as a set of differential equations. Many models are exchanged using Matlab which means that much of the biological information, particularly information on the underlining network, is lost. *Exchanging models* via computer languages such as Matlab is therefore not recommended.

**Example**
Write out the mass-balance equation for pathway:

$$
\begin{align*}
\text{S}_1 + \text{S}_3 &\stackrel{v_1}{\longrightarrow} \text{S}_2 \\
2 \text{S}_2 &\stackrel{v_2}{\longrightarrow} \text{S}_3 \\
\text{S}_3 &\stackrel{v_3}{\longrightarrow} 3 \text{S}_4
\end{align*}
$$

In this example we have non-unity stoichiometries in the second and third reaction steps. The mass-balance equations are given by:

$$
\begin{align*}
&\frac{\dS_1}{\dt} = -v_1 & &\frac{\dS_2}{\dt} = v_1 - 2 v_2 \\[5pt]
&\frac{\dS_3}{\dt} = v_2 - v_3 - v_1 & &\frac{\dS_4}{\dt} = 3 v_3
\end{align*}
$$

**Example**
Write out the mass-balance equations for P$_1$ and $P_2$ for the following gene regulatory network:

\includegraphics[scale = 0.75]{GeneRegStoichExample}

The key to this problem is that the network diagram suggests that the regulation from P$_1$ to $v_3$ results in no consumption of P$_1$. P$_1$ acts
only as a regulator. That being the case, the two mass-balance equations are:

$$
\begin{align*}
&\frac{\dP_1}{\dt} = v_1  - v_2 \\[5pt]
&\frac{\dP_2}{\dt} = v_3 - v_4
\end{align*}
$$

From the previous examples we see that it is fairly straightforward to derive the mass-balance equations from a visual inspection of the network. Many software tools exist to assist in this effort by converting network diagrams, either represented visually on a computer screen (for example, PathwayDesigner), or by processing a text file that lists the reactions in the network (for example via {{Tellurium}) into a set of differential equations (See Appendix [[appendix_i_modeling_with_python|Modeling with Python]]).

## Stoichiometry Matrix

When describing multiple reactions in a network, it is convenient to represent the stoichiometries in a compact form called the **stoichiometry matrix**. Traditionally the matrix is denoted by $\bN$, where the symbol $\bN$ refers to `number'(footnote: Some recent flux balance literature uses the symbol $\bS$; the traditional symbol $\bN$ will be used here.}. The stoichiometry matrix is a $m$ row by $n$ column matrix, where $m$ is the number of species and $n$ the number of reactions:

$$ \bN = m \times n \mathrm{matrix} $$

The columns of the stoichiometry matrix correspond to the individual chemical reactions in the network. The rows correspond to the molecular species, with one row per species. Thus, the intersection of a row and column in the matrix indicates whether a certain species takes part in a particular reaction or not. The sign of the element determines whether there is a net loss or gain of substance, and the magnitude describes the relative quantity of substance taking part in the reaction.

The elements of the stoichiometry matrix *do not* concern themselves with the rate of reaction. This latter point is particularly important because various stoichiometric analyses can be carried out purely on the stoichiometry without *any* reference to reaction rate laws.

\stateComment{
The stoichiometric matrix is not concerned with describing reaction rates. Reaction rates are given by rate laws specified in a separate vector (See section [The System Equation](#sec-systemequation)).
}

In general, the stoichiometry matrix has the form:

\begin{picture}(150,55)(-40,-20)\thicklines
  \put(-40,-2){$\bN = $}
<!-- Vertical arrows -->
  \put(-4,-9){\vector(0,-1){14}}
  \put(-9, -2){S$_i$}
  \put(-4,12){\vector(0,1){14}}

<!-- Horizontal arrows -->
  \put(34,39){\vector(-1,0){28}}
  \put(46,36){$v_j$}
  \put(66,39){\vector(1,0){28}}

$\begin{array}{cc}
        \left[

```latex
         \begin{array}{cccc}
           c_{ij} & \ldots & \ldots & \\
           \vdots & & & \\
           \vdots & & &
         \end{array}
```

\right]
   \end{array}$
\end{picture}

where $c_{ij}$ is the stoichiometry coefficient for the $i^{th}$ species and $j^{th}$ reaction. As mentioned before, the stoichiometry matrix is generally a lossy representation. That is, it is not always possible to revert back to the original biochemical network from which the matrix was derived. For example, consider the simple stoichiometry matrix:

$$ \bN =
\begin{bmatrix}
-1 & \phantom{-}0   
\phantom{-}1 & -1   
\phantom{-}0 & \phantom{-}1
\end{bmatrix}
$$

The most obvious network that this matrix could have been derived from is:

$$
\begin{align*}
 \text{A} &\longrightarrow \text{B} \\
 \text{B} &\longrightarrow \text{C}
\end{align*}
$$

But an equally plausible network is:

$$
\begin{align*}
 2 \text{A} &\longrightarrow \text{A} + \text{B} \\
 \text{B} &\longrightarrow \text{C}
\end{align*}
$$

It is not possible from the stoichiometry matrix alone to determine the original network.

**Example**
Write out the stoichiometry matrix for the simple chain of reactions which has five molecular species and four reactions as shown below. The four reactions are labeled, $v_1$ to $v_4$.

**Figure**

```latex
\begin{figure}[H]
\begin{center}
\begin{tikzpicture}[>=latex', node distance=2cm]

  \node (S1) {\Large S$_1$};
  \node [right of = S1] (S2) {\Large S$_2$};
  \node [right of = S2] (S3) {\Large S$_3$};
  \node [right of = S3] (S4) {\Large S$_4$};
  \node [right of = S4] (S5) {\Large S$_5$};

  \draw [->,ultra thick,blue] (S1) -- node[above, black] {$v_1$} (S2);
  \draw [->,ultra thick,blue] (S2) -- node[above, black] {$v_2$} (S3);
  \draw [->,ultra thick,blue] (S3) -- node[above, black] {$v_3$} (S4);
  \draw [->,ultra thick,blue] (S4) -- node[above, black] {$v_4$} (S5);

\end{tikzpicture}
\end{center}
\captionsetup{labelformat=empty}
\end{figure}
```

The stoichiometry matrix for this simple system is given by:

$$ \bN = \begin{array}{c}
         { \!\!\!\!\! v_1     v_2      v_3     v_4}      
         \left[ \begin{array}{rrrr}
           -1 &  0 &  0 & 0   
            1 & -1 &  0 & 0   
            0 &  1 & -1 & 0   
            0 &  0 &  1 & -1   
            0 &  0 &  0 & 1   
         \end{array} \right]

```latex
          \begin{array}{l}
                   \text{S}_1 \\
                   \text{S}_2 \\
                   \text{S}_3 \\
                   \text{S}_4 \\
                   \text{S}_5 \\
                \end{array}
```

\end{array}
$$
The rows and columns of the matrix have been labeled for convenience. Normally labels are absent.

**Example**
Write out the stoichiometry matrix for the multibranched pathway shown in Figure [Figure: Multi-branched pathway](#fig-multibranch).

$$ \bN = \begin{array}{c}
         { \!\!\!\!\!\!\!\!\! v_1    v_2      v_3     v_4}     v_5       
         \left[ \begin{array}{rrrrr}
            1 & -1 & -1 &  0 &  0   
            0 &  0 &  1 & -1 & -1   
         \end{array} \right]

```latex
          \begin{array}{l}
                   \text{S}_1 \\
                   \text{S}_2 \\
                 \end{array}
```

\end{array}
$$

## Reversibility

Up to this point we have not discussed whether a given reaction is reversible or not. When dealing with kinetic models, reversibility often manifests itself as a **negative reaction rate** in the rate law. For example, the rate law for the simple mass-action reversible reaction $A \rightleftharpoons B$ is given by:

$$ v = k_1 A - k_2 B $$

When this reaction goes in the reverse (right to left) direction, the reaction rate, $v$, will be negative. This may not be apparent from the stoichiometry matrix, which in this case is:

$$ \bN =
\begin{bmatrix}
\phantom{ } -1    
\phantom{ +}1 &
\end{bmatrix}
$$

Information on reversibility is most often found in the rate law. In this example the rate law could equally have been $k_1 A$, suggesting an irreversible reaction. Depending on the modeling problem, reversibility can be made more explicit in the stoichiometry matrix by specifying a *separate* reaction path for the reverse reaction. For example, in the previous example we might instead represent the system by two separate rate laws:

$$
\begin{align*}
\text{A} \rightarrow \text{B} \quad v_f = k_1 A  \\[6pt]
\text{B} \rightarrow \text{A} \quad v_r = k_2 B
\end{align*}
$$

The stoichiometry matrix now becomes:

$$ \bN =
\begin{bmatrix}
\phantom{ } -1 & \phantom{ +}1    
\phantom{ +}1 & -1   
\end{bmatrix}
$$

Splitting a reaction into separate forward and reverse steps might not always be possible however. For example, an enzyme catalyzed reversible reaction such as $A \rightleftharpoons B$ *cannot* be represented using:

$$\frac{dB}{dt} = v_f - v_r $$

where $v_f$ is the forward rate and $v_r$ the reverse rate. At first glance we might choose to model the forward and reverse rates using irreversible Michaelis-Menten rate laws [[appendix_e_enzyme_kinetics_in_a_nutshell|Michaelis-Menten Kinetics]]. However, the forward and reverse reactions are not independent. They are connected by the shared free enzyme pool so that when the forward rate rises, the reverse rate falls due to competition for free enzyme. If the modeler insists on separating the forward from the reverse rate, then the full enzyme mechanism in terms of elementary steps must be used (See the companion text book Enzyme Kinetics for Systems Biology for more details). Alternatively, and more commonly, a reversible enzyme catalyzed reaction is expressed using the reversible Michaelis-Menten equation ( [[appendix_e_enzyme_kinetics_in_a_nutshell|Reversible Rate laws]]):

\[  v = \frac{V_f/K_S (S - P/K_{eq})}{1 + S/K_S + P/K_P} \]

where S and P are the substrate and product concentrations respectively. $V_f$ is the maximal forward rate. Some modelers will choose to express all reactions using elementary reactions but this poses its own problems, particularly when trying to set values for the many elementary rate constants that result. Ultimately, the decision has to be made on a case by case basis and will depend on the model's purpose.

Before leaving the topic of reversibility, it is worth mentioning product inhibition. This occurs when the product binds to an enzyme without resulting in any reverse reaction rate. However, binding of product competes with substrate which in turn slows the forward rate. Reactions that are often considered irreversible can still be affected by product. More details are provided in section [[appendix_e_enzyme_kinetics_in_a_nutshell|Competitive Inhibition]].

To illustrate how we apply the stoichiometry matrix to different kinds of networks, let's look at a simple signaling network and two simple gene regulatory networks.

<!-- \section{Network Types} -->

## Signaling Networks

Figure [Figure: Simple signaling network](#fig-simplesignalingnetwork) illustrates a simple protein signaling network made up of two double phosphorylation cycles coupled through activation by protein C on the lower double cycle (D, E and F). In this model all species are proteins and we assume that protein A and D are unphosphorylated, B and E singly phosphorylated, and C and F doubly phosphorylated. C acts as a kinase and phosphorylates D and E. The reverse reactions, $v_2, v_4, v_7$ and $v_8$ are assumed to be catalyzed by phosphatases.

**Figure** <a id="fig-simplesignalingnetwork"></a> `fig:simpleSignalingNetwork`

*Graphic (not in the LaTeX source, referenced by name): `SimpleSignalingNetwork`*

*Caption:* Simple signaling network. Protein C activates the activity of reactions $v_5$ and $v_6$. 

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.6]{SimpleSignalingNetwork}
  \caption{Simple signaling network. Protein C activates the activity of reactions $v_5$ and $v_6$. }
  \label{fig:simpleSignalingNetwork}
\end{center}
\end{figure}
```

There is no specified stoichiometric mechanism for the activation on $v_5$ and $v_6$. Therefore, the stoichiometric matrix will contain no information about this. The stoichiometric matrix for this system is:

$$
\begin{equation}
\renewcommand{\kbrowstyle}{\relax}
\renewcommand{\kbcolstyle}{\relax}
\bN =
\kbordermatrix{ & v_1 & v_2 & v_3 & v_4 & v_5 & v_6 & v_7 & v_8 \\
\text{A} & -1 & \phantom{-}1 & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 \\
\text{B} &  \phantom{-}1 & -1 & -1 & \phantom{-}1 & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 \\
\text{C} & \phantom{-}0 & \phantom{-}0 & \phantom{-}1 & -1 & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 \\
\text{D} & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & -1 & \phantom{-}1 & \phantom{-}0 & \phantom{-}0 \\
\text{E} & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & \phantom{-}1 & -1 & -1 & \phantom{-}1 \\
\text{F} & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & \phantom{-}1 & -1 \\
} \\[6pt]
\label{eqn:DiamondPathwayStoich1}
\end{equation}
$$

The matrix is composed of two separate blocks corresponding to the two cycle layers. It is important to emphasize again that whenever there are *regulatory* interactions in a pathway diagram, these *do not* appear in the stoichiometry matrix. Instead, such information will reside in the rate laws that describe the regulation. If however the mechanism for the regulation is made explicit, then details of the regulation will appear in the stoichiometry matrix. Figure [Figure: Example of implicit and explicit depiction of a regulatory interaction](#fig-explictregulationmechanism) shows a simple example of an inhibitor, I, regulating a reaction, S to P. The left displays an implicit regulatory interaction. All we see is a blunt ended arrow indicating inhibition. In this case details of the regulation will be found in the rate law governing the conversion of S to P. On the right is an explicit mechanism, a simple competitive inhibition. In this case details of the inhibition mechanism will find its way into the stoichiometry matrix, although from an inspection of the matrix, the type of regulation may not be obvious.

Figure [Signaling Networks](#fig-compareimplicitexplicit) shows a comparison of the implicit and explicit models in terms of the stoichiometry matrix. In each case the rate laws also change. In the implicit form, the rate law will be a Michaelis-Menten competitive inhibition model whereas in the explicit model, the rates laws (now multiplied in number) will be simple mass-action rate laws. The choice of what to use, an implicit or explicit model, will depend entirely on the type of question that the model is attempting to answer. *There is no right or wrong way to do this*, the details of a model will depend on the type of question being asked.

**Figure** <a id="fig-explictregulationmechanism"></a> `fig:explictRegulationMechanism`

*Graphic (not in the LaTeX source, referenced by name): `explictRegulationMechanism`*

*Caption:* Example of implicit and explicit depiction of a regulatory interaction. The left-hand mechanism involving inhibitor, I, will not appear in the stoichiometry matrix whereas in the explicit mechanism, it will.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.85]{explictRegulationMechanism}
  \caption{Example of implicit and explicit depiction of a regulatory interaction. The left-hand mechanism involving inhibitor, I, will not appear in the stoichiometry matrix whereas in the explicit mechanism, it will.}
  \label{fig:explictRegulationMechanism}
\end{center}
\end{figure}
```

**Figure** <a id="eqn-diamondpathwaystoich2"></a> `eqn:DiamondPathwayStoich2`

*Caption:* Stoichiometry matrices corresponding to the two models in Figure [Figure: Example of implicit and explicit depiction of a regulatory interaction](#fig-explictregulationmechanism).

```latex
\begin{figure}[htb]
\renewcommand{\kbrowstyle}{\relax}
\renewcommand{\kbcolstyle}{\relax}
\begin{align*}
&\bN =
\kbordermatrix{ & v_1 \\
\text{S} & -1  \\
\text{P} & \phantom{-}1  \\
\text{I} & \phantom{-}0  \\
}%
%
\qquad&\bN =
\kbordermatrix{ & v_1 & v_2 & v_3 & v_4 & v_5  \\
\text{S} & -1 & \phantom{-}1 & \phantom{-}0 & -1 & \phantom{-}1  \\
\text{P} &  \phantom{-}0 & \phantom{-}0 & \phantom{-}1 & \phantom{-}0 & \phantom{-}0  \\
\text{I} &  \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & -1 & \phantom{-}1  \\
\text{E} &  -1           & \phantom{-}1 & \phantom{-}1 & -1 & \phantom{-}1  \\
\text{ES} & \phantom{-}1 & -1 & -1 & \phantom{-}0 & \phantom{-}0  \\
\text{EI} & \phantom{-}0 & \phantom{-}0 & \phantom{-}0 & \phantom{-}1 & -1  \\
} \\[6pt]
&\mbox{Implicit} &\mbox{Explicit}
\label{eqn:DiamondPathwayStoich2}
\end{align*}
\caption{Stoichiometry matrices corresponding to the two models in Figure~\ref{fig:explictRegulationMechanism}.}
\label{fig:compareImplicitExplicit}
\end{figure}
```

## Gene Regulatory Networks

Consider a transcription factor P$_1$ that represses a gene with expression rate $v_3$ shown in Figure [Figure: Two simple gene regulatory networks involving gene repression](#fig-mechanisticgenerepression), left panel. In this model we have production of P$_1$ from reaction $v_1$, and degradation of P$_1$ via $v_2$. The construction of the stoichiometry matrix will depend on how we represent the regulated step, $v_3$. If regulation is implied, meaning there is no explicit kinetic mechanism, then the regulation will not appear in the stoichiometry matrix. For the network on the left in Figure [Figure: Two simple gene regulatory networks involving gene repression](#fig-mechanisticgenerepression), the stoichiometry matrix is:

$$
\begin{equation}
\renewcommand{\kbrowstyle}{\relax}
\renewcommand{\kbcolstyle}{\relax}
\bN =
\kbordermatrix{ & v_1 & v_2 \\
\text{P}_1 & 1 & -1  \\
} \\[6pt]
\label{eqn:DiamondPathwayStoich3}
\end{equation}
$$

The stoichiometry matrix has only one row indicating that there is only one species in the model, P$_1$, and there is no hint in the stoichiometry matrix of any regulation. In this model P$_1$ is not explicitly sequestered by the operator site upstream of the gene. We make the significant assumption that when P$_1$ regulates, its own state is not affected.

Consider now that the interaction between P$_1$ and $v_3$ is made mechanistically explicit. The right-hand network in Figure [Figure: Two simple gene regulatory networks involving gene repression](#fig-mechanisticgenerepression) shows one possible way in which to represent the interaction of the transcription factor, P$_1$ with gene $v_3$. In the explicit model the transcription factor P$_1$ is assumed to bind to a repressor site preventing gene expression.

**Figure** <a id="fig-mechanisticgenerepression"></a> `fig:mechanisticGeneRepression`

*Graphic (not in the LaTeX source, referenced by name): `mechanisticGeneRepression`*

*Caption:* Two simple gene regulatory networks involving gene repression. On the left side is the implicit model where P$_1$ represses $v_3$, on the right side is the explicit model showing a more detailed mechanism for the regulation. 

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.65]{mechanisticGeneRepression}
  \caption{Two simple gene regulatory networks involving gene repression. On the left side is the implicit model where P$_1$ represses $v_3$, on the right side is the explicit model showing a more detailed mechanism for the regulation. }
  \label{fig:mechanisticGeneRepression}
\end{center}
\end{figure}
```

In the explicit model there are two new species, designated active gene and inactive gene. The stoichiometry matrix will therefore include two additional rows corresponding to these two new species. The stoichiometry matrix for the explicit model is shown here:

$$
\begin{align}
\renewcommand{\kbrowstyle}{\relax}
\renewcommand{\kbcolstyle}{\relax}
\bN =
\kbordermatrix{ & v_1 & v_2 & v_{4r} & v_{4f}  \\
\text{P}_1 & \phantom{+}1 & -1 & -1 & \phantom{+}1  \\
\text{P}_1\mbox{(Active)} & \phantom{+}0 & \phantom{+}0 & -1 & \phantom{+}1   \\
\text{P}_1\mbox{(InActive)} & \phantom{+}0 & \phantom{+}0 & \phantom{+}1 & -1   \\
}
\label{eqn:DiamondPathwayStoich4}
\end{align}
$$

In this case P$_1$ is actively sequestered onto the operator site and therefore appears in the stoichiometry matrix. Processes such as consumption, production, or sequestration by some binding mechanism will appear as columns in the stoichiometry matrix.

In conclusion, regulation does not appear explicitly in a stoichiometry matrix unless the regulation is represented as an explicit mechanistic scheme. The choice of implicit or explicit representations depends on the question being asked and the availability of suitable data.

## Moiety Conserved Cycles <a id="sec-conservedcycles"></a>

Many cell processes operate on different time scales. For example, metabolic processes tend to operate on a faster scale than protein synthesis and degradation. Such time scale differences have a number of implications to model builders, software designers, and model behavior. In this chapter we will briefly examine some of these aspects in relation to species conservation laws. We will return again to the topic in Chapter [[05_differential_equation_models|Differential Equation Models]].

To introduce this topic, consider a simple protein phosphorylation cycle such as the one shown in Figure [Figure: Phosphorylation and dephosphorylation cycle forming a moiety conservat](#fig-phosdephos). This shows a protein undergoing phosphorylation (upper limb) and dephosphorylation (lower limb) via a kinase and phosphatase, respectively.

**Figure** <a id="fig-phosdephos"></a> `fig:PhosDephos`

*Graphic (not in the LaTeX source, referenced by name): `CovalentProteinCycle`*

*Caption:* Phosphorylation and dephosphorylation cycle forming a moiety conservation cycle between unphosphorylated (left species, A) and phosphorylated protein (right species, AP).

```latex
\begin{figure}[tbh]
  \centering
  \includegraphics[scale = 0.55]{CovalentProteinCycle}
  \caption{Phosphorylation and dephosphorylation cycle forming a moiety conservation cycle between unphosphorylated (left species, A) and phosphorylated protein (right species, AP).} \label{fig:PhosDephos}
\end{figure}
```

The depiction in Figure [Figure: Phosphorylation and dephosphorylation cycle forming a moiety conservat](#fig-phosdephos) is a simplification. The ATP used during phosphorylation and the release of free phosphate during the dephosphorylation event are not shown. In addition, synthesis and degradation of protein is also absent. In many cases we can leave these aspects out of the picture. ATP for instance is held at a relatively constant level by strong homeostatic forces from metabolism so that within the context of the cycle, changes in ATP isn't something we must worry about. More interesting is that within the time scale of phosphorylation and dephosphorylation, we can assume that the rate of protein synthesis and degradation is negligible (Figure [Figure: Phosphorylation and dephosphorylation cycle that also includes the slo](#fig-covalentproteincycleproteinsynthesis)). This assumption is more significant and leads to the emergence of a new property called **moiety conservation** [Re81].

**Figure** <a id="fig-covalentproteincycleproteinsynthesis"></a> `fig:CovalentProteinCycleProteinSynthesis`

*Graphic (not in the LaTeX source, referenced by name): `CovalentProteinCycleProteinSynthesis`*

*Caption:* Phosphorylation and dephosphorylation cycle that also includes the slower process of protein synthesis and degradation. We assume that the phosphorylated and unphosphorylated protein can be degraded but only the unphosphorylated protein is synthesized.

```latex
\begin{figure}[tbh]
  \centering
  \includegraphics[scale = 0.55]{CovalentProteinCycleProteinSynthesis}
  \caption{Phosphorylation and dephosphorylation cycle that also includes the slower process of protein synthesis and degradation. We assume that the phosphorylated and unphosphorylated protein can be degraded but only the unphosphorylated protein is synthesized.}  \label{fig:CovalentProteinCycleProteinSynthesis}
\end{figure}
```

In chemistry a **moiety** is described as a subgroup of a larger molecule. In this case the moiety is a protein. During the interconversion between the phosphorylated and unphosphorylated states, the amount of moiety (protein) remains constant. More abstractly we can draw a cycle in the following way (Figure [Figure: Simple conserved cycle where S$_1 + S_2 = constant$](#fig-simpleconservedcyclea)), where S$_1$ and S$_2$ are the cycle species:

**Figure** <a id="fig-simpleconservedcyclea"></a> `fig:SimpleConservedCycleA`

*Caption:* Simple conserved cycle where S$_1 + S_2 = constant$.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}
\draw(38pt,50pt) node[anchor=west] {S$_1$};
\draw(102pt,50pt) node[anchor=west] {S$_2$};

\draw[-stealth,color=blue,very thick] (50pt,60pt) to [controls=+(50:1) and +(130:1)] (110pt,60pt);
\draw[stealth-,color=blue,very thick] (50pt,40pt) to [controls=+(130:-1) and +(50:-1)] (110pt,40pt);

\draw[-stealth,color=blue,very thick] (50pt,93.5pt) to [controls=+(130:-1) and +(50:-1)] (110pt,93.5pt);
\draw[stealth-,color=blue,very thick] (50pt,6.5pt) to [controls=+(50:1) and +(130:1)] (110pt,6.5pt);

\draw(72pt,15pt) node[anchor=west] {$v_1$};
\draw(72pt,85pt) node[anchor=west] {$v_2$};

\draw(36pt,100pt) node[anchor=west] {A};
\draw(105pt,100pt) node[anchor=west] {B};

\draw(36pt,0pt) node[anchor=west] {D};
\draw(105pt,0pt) node[anchor=west] {C};
\end{tikzpicture}
\end{center}
%
\caption{Simple conserved cycle where S$_1 + \text{S}_2 = \mbox{constant}$.}
\label{fig:SimpleConservedCycleA}
\end{figure}
```

The two species S$_1$ and S$_2$ are conserved because the total $S_1 + S_2$ remains constant over time (at least over a time scale shorter than other processes that may be involved). Such cycles are collectively called **moiety conserved cycles**.

\stateHighlight{

```latex
\begin{tabular}{lll}
{\bfseries Moiety:}  & A subgroup of a larger molecule. \\[4pt]
{\bfseries Conserved Moiety:} & A subgroup whose interconversion through a \\
& sequence of reactions leaves it unchanged. \\
\end{tabular}
```

}

Protein signalling pathways abound with conserved cycles such as these although many are more complex and may involve multiple phosphorylation reactions. In addition to protein networks, other pathways also possess conservation cycles. One of the earliest conservation cycles to be recognized was the adenosine triphosphate (ATP) cycle. ATP is a chain of three phosphate residues linked to a nucleoside adenosine group as shown in Figure [Figure: Adenosine Triphosphate:](#fig-atp).

**Figure** <a id="fig-atp"></a> `fig:ATP`

*Graphic (not in the LaTeX source, referenced by name): `ATP`*

*Caption:* Adenosine Triphosphate: Three phosphate groups plus an adenosine subgroup.

```latex
\begin{figure}[h]
\centering
\includegraphics[scale = 0.75]{ATP}
\caption{Adenosine Triphosphate: Three phosphate groups plus an adenosine subgroup.}
\label{fig:ATP}
\end{figure}
```

The linkage between the phosphate groups involves an unstable phosphoric acid anhydride bond. These bonds can be cleaved by hydrolysis one at a time leading to the formation of adenosine diphosphate (ADP) and adenosine monophosphate (AMP), respectively. The hydrolysis provides much of the free energy to drive endergonic processes in the cell. Given the insatiable need for energy, there is a continual and rapid interconversion between ATP, ADP and AMP as energy is released or captured. One constant during these interconversions is the amount of adenosine group (Figure [Figure: The adenosine moiety, indicated by the boxed molecular group, is conse](#fig-atp-adp-amp)). Adenosine is a conserved moiety.

Over longer time scales there is also the slower process of AMP degradation and biosynthesis via the purine nucleotide pathway; but for many models, we assume that this process is very slow compared to ATP turnover by energy metabolism.

**Figure**

*Graphic (not in the LaTeX source, referenced by name): `InterConversionATP_B`*

*Caption:* The interconversion of ATP, ADP and AMP is generally considered fast in comparison to the slow process of synthesis and degradation of AMP.

```latex
\begin{figure}[H]
\centering
\includegraphics[scale = 0.5]{InterConversionATP_B}
\caption{The interconversion of ATP, ADP and AMP is generally considered fast in comparison to the slow process of synthesis and degradation of AMP.}
\end{figure}
```

There are many other examples of conserved moieties such enzyme/enzyme-substrate complexes, NAD/NADH, phosphate and coenzyme A.  In all these cases the basic assumption is that the interconversions of the subgroups is rapid compared to their net synthesis and degradation. We should emphasize that in reality, conserved moieties do not exist since all molecular subgroups will at some point be subject to synthesis and degradation. However, over sufficiently short time scales, the sum total of these groups can be considered constant.

**Figure** <a id="fig-atp-adp-amp"></a> `fig:ATP:ADP:AMP`

*Graphic (not in the LaTeX source, referenced by name): `ATP_ADP_AMP`*

*Caption:* The adenosine moiety, indicated by the boxed molecular group, is conserved during the interconversion of ATP, ADP and AMP.

```latex
\begin{figure}[tbh]
  \centering
  \includegraphics[scale = 0.55]{ATP_ADP_AMP}
  \caption{The adenosine moiety, indicated by the boxed molecular group, is conserved during the interconversion of ATP, ADP and AMP.} \label{fig:ATP:ADP:AMP}
\end{figure}
```

## The System Equation <a id="sec-systemequation"></a>

Equation [Models of Complex Networks](#massbalanceequation2), which describes the mass-balance equation, can be reexpressed in terms of the stoichiometry matrix to form the **system equation**:

\stateEquation{

$$
\begin{equation}
\bdSdt = \bN \ratev \label{eqn:SystemEquation}
\end{equation} }
$$

where $\bN$ is the $m \times n$ stoichiometry matrix and $\ratev$ is the $n$ dimensional rate vector, whose $i$th component gives the rate of reaction $i$ as a function of the species concentrations. $\bs$ is the $m$ vector of species. This is a key equation for describing a network of processes inside a cell. Of particular significance is that the equation explicitly separates the network, in the form of $\bN$, from the process rates, $\bv$.

Looking again at the simple chain of reactions in Figure [Figure: Simple straight chain pathway](#fig-linearfoursteppathway), the system equation can be written as:

$$
\begin{equation}
\bdSdt = \bN \ratev = \begin{array}{c}
         \left[ \begin{array}{rrrr}
           -1 &  0 &  0 & 0 \\
            1 & -1 &  0 & 0 \\
            0 &  1 & -1 & 0 \\
            0 &  0 &  1 & -1 \\
            0 &  0 &  0 & 1 \\
         \end{array} \right]
        \end{array}
       \left[ \begin{array}{c}
          v_1 \\
          v_2 \\
          v_3 \\
          v_4 \\
       \end{array} \right]
\label{eqn:StoichMatrixChain}
\end{equation}
$$

If the stoichiometry matrix is multiplied into the rate vector, the mass-balance equations shown earlier [Models of Complex Networks](#equ-straightchainmassbalance) are recovered. To illustrate what the system equation might look like for a simple system, consider the following model expressed in Antimony format:

```python
   A -> B; k1*A - k2*B;
   B -> C; k3*B - k4*C;
```

The system equation for this model is:

$$
\begin{equation}
\bdSdt = \bN \ratev = \begin{array}{c}
         \left[ \begin{array}{rr}
           -1 &  0  \\
            1 & -1 \\
            0 &  1  \\
         \end{array} \right]
        \end{array}
       \left[ \begin{array}{c}
         k_1 A - k_2 B \\
         k_3 B - k_4 C \\
       \end{array} \right]
\label{eqn:StoichMatrixChainJarnac}
\end{equation}
$$

<!-- All stoichiometric interactions are placed in the stoichiometry matrix. -->

<!-- The example shown in Figure~\ref{fig:simpleSignalingNetwork} and Figure~\ref{fig:mechanisticGeneRepression} illustrated non-st\-oich\-iometric interactions, namely two inhibition interactions from C to reactions $v_5$ and $v_6$, and repression on $v_3$ by $P_1$. As noted earlier, these interactions do not occur in the stoichiometry matrix. Instead they will be found in the rate vector, $\bv$ in the form of a rate law. -->

## Tellurium

The modeling platform Tellurium [sauro:2000] provides facilities to extract the stoichiometry matrix from a model. The command for generating the stoichiometry matrix is `getFull\-Stoich\-iometryMatrix()`. The short-hand version for this command is `sm`. The script and results of a run are given below:

```python
import tellurium as te

r = te.loada ('''
   J1: A -> B; k1*A - k2*B;
   J2: B -> C; k3*B - k4*C;

   k1 = 0.1; k2 = 0.02;
   k3 = 0.3; k4 = 0.04;
   A  = 10;  B  = 0; C = 0;
''')

print (r.getFullStoichiometryMatrix())
print (r.getReactionIds())
print (r.getFloatingSpeciesIds())
```

If this script is run, the output is:

```python
     J1, J2
A [[ -1,  0],
B  [  1, -1],
C  [  0,  1]]

['J1', 'J2']
['A', 'B', 'C']
```

The row and column order in the stoichiometry matrix can obtained from calls to

`rr.getReactionIds()`

for the column order and

`rr.getFloatingSpeciesIds()`

for the row order. Using the supported shortcuts (See appendix), the script becomes:

```python
import tellurium as te

r = te.loada ('''
   J1: A -> B; k1*A - k2*B;
   J2: B -> C; k3*B - k4*C;

   k1 = 0.1; k2 = 0.02;
   k3 = 0.3; k4 = 0.04;
   A  = 10;  B  = 0; C = 0;
''')

print (r.sm())
print (r.rs())
print (r.fs())
```

## Further Reading

- Palsson BO (2006) Systems Biology Systems Biology: Properties of Reconstructed Networks. Cambridge University Press, ISBN: 978-0521859035

- Sauro HM (2012) Enzyme Kinetics for Systems Biology. 2nd Edition, Ambrosius Publishing ISBN: 978-0982477335

- Stephanopoulos G, Aristidou A, and Nielsen J (1998) Metabolic engineering: principles and methodologies. Academic Press, ISBN: 978-0126662603

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- \begin{enumerate}[label=\textbf{\arabic*.}] -->

<!-- \item Derive a set of differential equations for the following model in terms of the -->
<!-- rate of reaction, $v_1$, $v_2$, and $v_3$: -->

<!-- \begin{align*} -->
<!-- \text{A} &\stackrel{v_1}{\rightarrow} 2 \text{B} \\ -->
<!-- \text{B} &\stackrel{v_2}{\rightarrow} 2 \text{C} \\ -->
<!-- \text{C} &\stackrel{v_3}{\rightarrow} \emptyset -->
<!-- \end{align*} -->

<!-- \item Derive the set of differential equations for the following model in terms of the -->
<!-- rate of reaction, $v_1$, $v_2$ and $v_3$: -->

<!-- \begin{align*} -->
<!-- \text{A} &\stackrel{v_1}{\rightarrow} \text{B} \\ -->
<!-- 2 \text{B} + \text{C} &\stackrel{v_2}{\rightarrow} \text{B} + \text{D} \\ -->
<!-- \text{D} &\stackrel{v_3}{\rightarrow} \text{C} + \text{A} -->
<!-- \end{align*} -->

<!-- \item Enter the previous models, 3 and 4, into Tellurium and confirm that the stoichiometry matrices are the same as those derived manually in the previous question. -->

<!-- \item Derive the stoichiometry matrix for each of the following networks. In addition, write out the mass-balance equations -->
<!-- in each case. -->

<!-- (a) -->
<!-- \begin{figure}[H] -->
<!-- \centering -->
<!-- \includegraphics[scale = 0.5]{NetStructExercises1} -->
<!-- \end{figure} -->
<!-- \vspace{-20pt} -->
<!-- (b) -->
<!-- \begin{figure}[H] -->
<!-- \centering -->
<!-- \includegraphics[scale = 0.5]{futileCycle} -->
<!-- \end{figure} -->
<!-- \vspace{-20pt} -->
<!-- (c) \begin{figure}[H] -->
<!-- \centering -->
<!-- \includegraphics[scale = 0.5]{NetStructExercises2} -->
<!-- \end{figure} -->
<!-- (d) \begin{align*} -->
<!-- \text{A} + \text{X} &\stackrel{v_1}{\longrightarrow} \text{B} + \text{Y} && \text{B} + \text{X} \stackrel{v_2}{\longrightarrow} \text{Y} \\[5pt] -->
<!-- \text{B} &\stackrel{v_3}{\longrightarrow} \text{C} && \text{C} + \text{X} \stackrel{v_4}{\longrightarrow} \text{D} + \text{Y} \\[5pt] -->
<!-- \text{D} + \text{Y} &\stackrel{v_5}{\longrightarrow} \text{X} && \text{X} \stackrel{v_6}{\longrightarrow} \text{Y} \\[5pt] -->
<!-- \text{X} + \text{W} &\stackrel{v_7}{\longrightarrow} 2 \text{Y} && 2 \text{Y} \stackrel{v_8}{\longrightarrow} \text{X} + \text{W} \\[5pt] -->
<!-- \end{align*} -->

<!-- \item For the irreversible enzyme catalyzed reaction, $\text{A} \rightarrow \text{B}$: -->

<!-- (a) Write out the stoichiometry matrix. -->

<!-- (b) Write out the stoichiometry matrix in terms of the elementary reactions that make up the enzyme mechanism. -->

<!-- \item  A gene $G_1$ expresses a protein p$_1$ at a rate $v_1$. p$_1$ forms a tetramer (4 subunits), called p$_1^4$ at a rate -->
<!-- $v_2$. The tetramer negatively regulates a gene $G_2$. p$_1$ degrades at a rate $v_3$. $G_2$ expresses a protein, p$_2$ at a rate $v_9$. p$_2$ is cleaved by an enzyme at a rate $v_4$ to form two protein domains, p$_2^1$ and p$_2^2$. p$_2^1$ degrades at a rate $v_5$. Gene $G_3$ expresses a protein, p$_3$ at a rate $v_6$. p$_3$ binds to p$_2^2$ forming an active complex, p$_4$ at a rate $v_{10}$, which can bind to gene $G_1$ and activate $G_1$. p$_4$ degrades at a rate $v_7$. Finally, p$_2^1$ can form a dead-end complex, p$_5$, with p$_4$ at a rate $v_8$. -->
<!-- \begin{enumerate} -->
<!-- \item Draw the network represented in the description given above. -->

<!-- \item Write out the differential equation for each protein species in the network in terms of $v_1, v_2, \ldots$ -->

<!-- \item Write out the stoichiometric matrix for the network. -->

<!-- \end{enumerate} -->

<!-- \item Write out the differential equations for the system depicted in equation~\eqref{eqn:StoichMatrixChain}. -->

<!-- \item Given the following stoichiometry matrix, write out the corresponding network diagram. Why might this process not fully recover the original -->
<!-- network from which the stoichiometry matrix was derived? -->

<!-- \phantom{-} -->

<!-- \begin{equation} -->
<!-- \kbordermatrix{ & v_1 & v_2 & v_3 & v_4 & v_5  \\ -->
<!-- \text{A} & -1 &  \phantom{-}0 & -1 &  \phantom{-}0 &  \phantom{-}0  \\ -->
<!-- \text{B} &  \phantom{-}1 & -1 &  \phantom{-}0 &  \phantom{-}0 &  \phantom{-}3  \\ -->
<!-- \text{C} &  \phantom{-}0 &  \phantom{-}2 & -1 &  \phantom{-}0 &  \phantom{-}0  \\ -->
<!-- \text{D} &  \phantom{-}0 &  \phantom{-}0 &  \phantom{-}1 & -1 &  \phantom{-}0  \\ -->
<!-- \text{E} &  \phantom{-}0 &  \phantom{-}0 &  \phantom{-}0 &  \phantom{-}1 & -1  \\ -->
<!-- \text{F} &  \phantom{-}0 &  \phantom{-}0 &  \phantom{-}0 &  \phantom{-}0 &  \phantom{-}1  \\ -->
<!-- \text{G} &  \phantom{-}0 &  \phantom{-}0 &  \phantom{-}0 & -1 &  \phantom{-}0  \\ -->
<!-- } -->
<!-- \end{equation} -->

<!-- \item Derive the mass-balance equations for the following gene regulatory network: -->

<!-- \begin{center} -->
<!-- \includegraphics[scale = 0.65]{GeneRegStoichExercise} -->
<!-- \end{center} -->

<!-- \item Why is it better to store a model as a list of reactions rather than a set of differential equations? -->

<!-- \end{enumerate} -->

<!-- \section*{Answers} -->

<!-- \begin{enumerate} -->
<!-- \item -->
<!-- $$\frac{dA}{dt} =  -v_1;\ \quad \frac{dB}{dt} = 2 v_1 - v_2;\ \quad \frac{dC}{dt} = 2 v_2 - v_3 $$ -->

<!-- \item -->
<!-- $$ \frac{dA}{dt} =  v_3 - v_1;\ \quad \frac{dB}{dt} = v_1 - 2 v_2 + v_2 = v_1 - v_2 $$ -->

<!-- $$ \frac{dC}{dt} = v_3 - v_2;\ \quad \frac{dD}{dt} = v_2 - v_3 $$ -->

<!-- \item -->
<!-- \begin{enumerate}[label=(\alph*)] -->

<!-- \item -->
<!-- \begin{equation*} -->
<!-- \left[ \begin{array}{rrrr} -->
<!-- -1 &  0 &  0 \\ -->
<!-- 2 & -1 &  0 \\ -->
<!-- 0 &  2 & -1 \\ -->
<!-- \end{array} \right] -->
<!-- \end{equation*} -->

<!-- \item -->
<!-- \begin{equation*} -->
<!-- \left[ \begin{array}{rrrr} -->
<!-- -1 &  0 &  1  \\ -->
<!-- 1 & -1 &  0  \\ -->
<!-- 0 & -1 &  1  \\ -->
<!-- 0 &  1 & -1  \\ -->
<!-- \end{array} \right] -->
<!-- \end{equation*} -->

<!-- \end{enumerate} -->

<!-- \item -->
<!-- \begin{enumerate}[label=(\alph*)] -->
<!-- \item -->
<!-- \begin{verbatim} -->
<!-- import tellurium as te -->

<!-- r = te.loada(''' -->
<!-- A -> 2B; v1; -->
<!-- B -> 2C; v2; -->
<!-- C ->; v3 -->
<!-- v1 = 0; v2 = 0; v3 = 0 -->
<!-- ''') -->
<!-- print (r.getFullStoichiometryMatrix()) -->

<!-- _J0, _J1, _J2 -->
<!-- A [[  -1,   0,   0], -->
<!-- B  [   2,  -1,   0], -->
<!-- C  [   0,   2,  -1]] -->
<!-- \end{verbatim} -->

<!-- \item -->
<!-- \begin{verbatim} -->
<!-- import tellurium as te -->

<!-- r = te.loada(''' -->
<!-- A -> B; v1; -->
<!-- 2B + C -> B + D; v2; -->
<!-- D -> C + A; v3 -->
<!-- v1 = 0; v2 = 0; v3 = 0 -->
<!-- ''') -->
<!-- print (r.getFullStoichiometryMatrix()) -->

<!-- _J0, _J1, _J2 -->
<!-- A [[  -1,   0,   1], -->
<!-- B  [   1,  -1,   0], -->
<!-- C  [   0,  -1,   1], -->
<!-- D  [   0,   1,  -1]] -->
<!-- \end{verbatim} -->
<!-- \end{enumerate} -->

<!-- \item -->
<!-- \begin{enumerate}[label=(\alph*)] -->
<!-- \item -->
<!-- \begin{equation*} -->
<!-- \left[ \begin{array}{rrrr} -->
<!-- -1 & -1 &   0 & 0 \\ -->
<!-- 1 & 0  &  -1 & 0 \\ -->
<!-- 0 & 1  &   0 & -1 \\ -->
<!-- 0 & 0  &   1 & 1 \\ -->
<!-- \end{array} \right] -->
<!-- \end{equation*} -->

<!-- $$\frac{dA}{dt} =  -v_1 - v_2;\ \quad \frac{dB}{dt} = v_1 - v_3;\ \quad \frac{dC}{dt} = v_2 - v_4; \quad \frac{}{} = v_3 + v_4 $$ -->

<!-- \item -->
<!-- \begin{equation*} -->
<!-- \left[ \begin{array}{rrrr} -->
<!-- 1 & -1 &  1 & 0 \\ -->
<!-- 0 & 1  &  -1 & -1 \\ -->
<!-- \end{array} \right] -->
<!-- \end{equation*} -->

<!-- $$\frac{dS_1}{dt} = v_1 - v_2 + v_3;\ \quad \frac{dS2}{dt} = v_2 - v_3 - v_4 $$ -->

<!-- \item -->
<!-- \begin{equation*} -->
<!-- \left[ \begin{array}{rrrr} -->
<!-- -1 & 1  &  0 & 0 \\ -->
<!-- 1 & -1 & -1 & 1 \\ -->
<!-- 0 & 0  &  1 & -1 \\ -->
<!-- \end{array} \right] -->
<!-- \end{equation*} -->

<!-- $$\frac{dA}{dt} =  -v_1 + v_2;\ \quad \frac{dB}{dt} = v_1 - v_2 - v_3 + v_4;\ \quad \frac{dC}{dt} = v_3 - v_4 $$ -->

<!-- \item -->
<!-- \begin{verbatim} -->
<!-- vo,   v1,  v2,  v2,  v4,  v5,  v6,  v7 -->
<!-- A [[  -1,   0,   0,   0,   0,   0,   0,   0], -->
<!-- X  [  -1,  -1,   0,  -1,   1,  -1,  -1,   1], -->
<!-- B  [   1,  -1,  -1,   0,   0,   0,   0,   0], -->
<!-- Y  [   1,   1,   0,   1,  -1,   1,   2,  -2], -->
<!-- C  [   0,   0,   1,  -1,   0,   0,   0,   0], -->
<!-- D  [   0,   0,   0,   1,  -1,   0,   0,   0], -->
<!-- W  [   0,   0,   0,   0,   0,   0,  -1,   1]] -->

<!-- dA/dt = -v0 -->
<!-- dX/dt = -v0 - v1 - v3 + v4 - v5 - _6 + v7 -->
<!-- dB/dt = v0 - v1 - v2 -->
<!-- dY/dt = v0 + v1 + v3 - v4 + v5 + 2.0*v6 - 2.0*v7 -->
<!-- dC/dt = v2 - v3 -->
<!-- dD/dt = v3 - v4 -->
<!-- dW/dt = -v6 + v7 -->
<!-- \end{verbatim} -->
<!-- \end{enumerate} -->

<!-- \item -->
<!-- \begin{enumerate}[label=(\alph*)] -->
<!-- \item -->
<!-- \begin{equation*} -->
<!-- \left[ \begin{array}{rrrr} -->
<!-- -1 & 1 \\ -->
<!-- \end{array} \right] -->
<!-- \end{equation*} -->

<!-- \item Species order A, E, ES, P -->
<!-- \begin{equation*} -->
<!-- \left[ \begin{array}{rrrr} -->
<!-- -1 & 1  &   0  \\ -->
<!-- -1 & 1  &  1  \\ -->
<!-- 1 & -1 &   -1  \\ -->
<!-- 0 & 0  &   1  \\ -->
<!-- \end{array} \right] -->
<!-- \end{equation*} -->
<!-- \end{enumerate} -->

<!-- \item % 7 -->

<!-- NA -->

<!-- \item -->
<!-- There may be stoichiometry calculations due to the same reactants and products appearing on both sides of a reaction. -->

<!-- \item -->

<!-- $$\frac{dP_1}{dt} =  v_1 + v_3 - 2 v_4;\ \quad \frac{dP_2}{dt} = v_4 - v_5 $$ -->

<!-- $$\frac{dP_3}{dt} = v_6 - v_7;\ \quad \frac{dP_4}{dt} = v_8 - v_9 $$ -->

<!-- \item %\phantom{x} % 11 -->

<!-- Storing a model as a list of reactions preserves any stoichiometries that might cancel when converting the scheme to a stoichiometry matrix. -->

<!-- \end{enumerate} -->

---

## Index terms recorded in this chapter

- $\bN$
- activator
- AMP
- Antimony
- ATP
- Biotapestry
- coenzyme A
- conserved cycles
- discrete events
- elementary reaction
- elementary reactions
- endergonic
- explicit regulation
- fixed species
- gene networks
- implicit regulation
- inhibitor
- Jarnac
- JDesigner
- large number of molecules
- linear pathway
- mass-balance equation
- Matlab
- mechanistic details
- model composition
- moiety
- moiety conserved cycles
- NAD/NADH
- non-elementary reactions
- non-unity stoichiometry
- Palsson
- phosphate
- PySCeS
- rapid-equilibrium
- reaction rates
- regulatory link
- reversibility
- SBGN
- SBML
- signaling networks
- stoichiometric coefficient
- stoichiometric network
- stoichiometry matrix
- system equation
- Tellurium
- text representation
- time scale
- transcription factor
- well-stirred reactor

---

← [[02_kinetics_in_a_nutshell|Kinetics in a Nutshell]] · [[index|Wiki index]] · [[04_introduction_to_modeling|Introduction to Modeling]] →
