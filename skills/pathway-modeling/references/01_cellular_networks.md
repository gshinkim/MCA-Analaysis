# Cellular Networks

*Source: `chapter1.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Cellular Networks <a id="chap-cellularnetworks"></a>

The study of cellular networks is one of the defining characteristics of systems and synthetic biology. Such networks involve the coordinated interaction of thousands of molecules that include nucleic acids, proteins, metabolites and other small molecules. Descriptions of these elaborate networks can be found in text books, on wall charts, and more recently in databases such as EcoCyc, RegulonDB, KEGG or STRING (Table [Table: Online *E](#tbl-databases)).

## Overall Organization

Biological networks can be organized into three broad categories (Fig. [Figure: Network Overview](#fig-networksoverview)): gene regulatory, protein and metabolic networks. In the metabolic category, small molecules are chemically transformed by enzymes. These molecules -- or metabolites -- serve either as energy sources or as building blocks for more complex molecules, particularly polymers such as polysaccharides, nucleic acids and proteins.

{\arrayrulecolor{brickRed}
\setlength\heavyrulewidth{0.85pt}
\setlength{\abovetopsep}{4pt}

**Table** <a id="tbl-databases"></a> `tbl:databases`

*Caption:* Online *E. coli* resources

```latex
\begin{table}[htb]
\caption{Online {\em E.\ coli} resources}
\begin{center}
\begin{tabular}{ll} \toprule
Online Resource & URL \\ \midrule
EcoCyc & \url{http://ecocyc.org/} \\
RegulonDB & \url{http://regulondb.ccg.unam.mx/} \\
KEGG &  \url{http://www.genome.jp/kegg/} \\
STRING & \url{http://string.embl.de/} \\ \bottomrule
\end{tabular}
\end{center}
\label{tbl:databases}
\end{table}
```

}

The protein networks constitute a major part of the decision making and nano-machine apparatus of a cell. We can divide the decision making protein networks into two subgroups. One subgroup involves transcription factor proteins that regulate gene expression, forming what are called gene regulatory networks (GRNs).  The second subgroup constitutes the protein signaling pathways that integrate information about the internal and external environments and modulate both the metabolic and gene regulatory networks.

The metabolic, protein, and gene regulatory networks each have a characteristic mode of operation and differ by the molecular mechanisms employed and their respective operating time scale. In general, metabolic networks operate on the smallest time scale, followed by protein signaling networks, and gene regulatory networks.

This picture is of course a simplified view. For example, it omits the extensive RNA network that may be present, particularly in eukaryotic cells. Protein signaling networks are also involved in a variety of other related functions such as cytoskeleton control and cell cycle regulation. In addition, there is considerable overlap between the different systems with gene, metabolic, and protein control networks interlinked [Biondi2006].

## Network Representation

There are different ways (Figure [Figure: Cellular networks are often represented using two common approaches, n](#fig-networkclassification)) to represent cellular networks depending on how the information will be used and what kinds of questions are asked. Traditionally, cellular networks have been described using a **stoichiometric** formalism. Such networks are mechanistic in nature, consistent with the laws of mass conservation and will often include kinetic laws describing transformations of species from one form to another through binding/unbinding or molecular reorganization. In recent years an alternative representation, which might be termed **non-stoichiometric**, has gained significant popularity with the advent of high-throughput data collection. Non-stoichiometric networks, of which there are a great variety, include interaction networks which describe the relationship, usually via some physical interaction but sometimes also functional, between molecular species or functional entities such as genes or proteins. Non-stoichiometric networks tend to be more course grained compared to stoichiometric networks, but their study has proven to be very popular due in large part to the availability of vast new data sources. That, coupled with the unprecedented interest in networks in general, has made the study of non-stoichiometric networks an intellectually interesting area of study [barabasi2003linked].
<!-- \vspace{4mm} -->
<!-- \stateComment{ -->
<!-- In this book we will be primarily concerned with modeling stoichiometric networks. -->
<!-- } -->
<!-- \vspace{0mm} -->

## Metabolic Networks

The first cellular networks to be discovered were the metabolic pathways such as Glycolysis in the 1930s and the Calvin cycle in the 1940s. The first metabolic pathways were elucidated by a combination of enzymatic inhibitors and the use of radioisotopes such as carbon-14. The Calvin cycle for example was discovered by following the fate of carbon when algae was exposed to $^{14}$C-labeled CO$_2$. With the development of microbial genetics, significant progress was made in uncovering other pathways by studying mutants and complementing different mutants of a given pathway to determine the order of steps. The reaction steps in a metabolic pathway are catalysed by enzymes, and we now know there are thousands of enzymes in a given organism catalyzing a great variety of pathways. The collective sum of all reaction pathways in a cell is referred to as metabolism, and the small molecules that are interconverted are called metabolites.

Traditionally, metabolism is classified into two groups, anabolic (synthesis) and catabolic (breakdown) metabolism. Coupling between the two metabolic groups is achieved through cofactors of which a great variety exist. Two widely distributed cofactors include the pyridine nucleotides in the form of NAD$^+$ and NADP$^+$, and the adenine nucleotides in the form of ATP, ADP and AMP. These cofactors couple redox and phosphate, respectively, by forming reactive intermediates that enables catabolism to drive anabolism. Cellular respiration is a catabolic process where molecules such as glucose and fatty acids are oxidized in a stepwise fashion. The energy released is captured in the form of ATP and the oxidized products of water and carbon dioxide are released as waste. ATP can be used in turn to drive anabolic processes such as amino acid or nucleotide biosynthesis. In general, metabolic pathways tend to be regulated via allosteric regulation. This is where a metabolite can regulate the reaction rate of an enzyme by binding to a site on the enzyme other than the catalytic site. Such interactions form a network of feedback and feedforward regulation. Figure [Figure: Metabolic Pathway:](#fig-hoefnagel2modified) shows a metabolic pathway of glycolysis from *Lactococcus lactis*. On the left, glucose enters the cell which is converted in a series of reactions to ethanol and a variety of other small molecules.

**Figure** <a id="fig-networkclassification"></a> `fig:NetworkClassification`

*Graphic (not in the LaTeX source, referenced by name): `NetworkClassification`*

*Caption:* Cellular networks are often represented using two common approaches, non-stoichiometric and stoichiometric. Non-stoichiometric networks are characterized by a lack of stoichiometric information and mass conservation. Stoichiometric networks are classified according whether they are elementary or not. Elementary networks are those where the reactions cannot be broken into simpler forms. Non-elementary networks may have one or more reaction steps which represent an aggregate of two or more elementary reactions, the aggregation being dependent on assumptions such as quasi-steady state or equilibrium. 

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.45]{NetworkClassification}
  \caption{Cellular networks are often represented using two common approaches, non-stoichiometric and stoichiometric. Non-stoichiometric networks are characterized by a lack of stoichiometric information and mass conservation. Stoichiometric networks are classified according whether they are elementary or not. Elementary networks are those where the reactions cannot be broken into simpler forms. Non-elementary networks may have one or more reaction steps which represent an aggregate of two or more elementary reactions, the aggregation being dependent on assumptions such as quasi-steady state or equilibrium. }
  \label{fig:NetworkClassification}
\end{center}
\end{figure}
```

Metabolic networks are the fastest (excluding ion transfer mechanisms) in terms of their response to perturbations and can operate on a time scale from microseconds to seconds. This reflects the need to rapidly adjust the supply of molecular building blocks and energy as supply and demand fluctuate. Physically, the rapid response of metabolic networks is achieved by allosteric control where the fast diffusion of small molecules can bind and rapidly alter the activity of selected enzymes.

**Figure** <a id="fig-hoefnagel2modified"></a> `fig:hoefnagel2Modified`

*Graphic (not in the LaTeX source, referenced by name): `hoefnagel2Modified`*

*Caption:* Metabolic Pathway: Metabolic pathway image from JWS online (Jacky Snoep) with permission. The pathway depicts the glycolytic pathway from *Lactococcus lactis* using the Systems Biology Graphical Notation (SBGN) [SBGN2009, hoefnagel2002time].

```latex
\begin{figure}[!htb]
\begin{center}
  \includegraphics[scale = 0.52,angle=90]{hoefnagel2Modified}
  \caption{Metabolic Pathway: Metabolic pathway image from JWS online (Jacky Snoep) with permission. The pathway depicts the glycolytic pathway from {\em Lactococcus lactis} using the Systems Biology Graphical Notation (SBGN)~\cite{SBGN2009,hoefnagel2002time}.}
  \label{fig:hoefnagel2Modified}
\end{center}
\end{figure}
```

Figure [Figure: A section of glycolysis with negative and positive regulation shown](#fig-glycolysisregulation) shows a section of the glycolytic pathway which converts glucose to pyruvate with the production of ATP and NADH. The diagram also shows the many negative and positive feedback and feedforward regulatory loops in glycolysis. Not all of these are present in all organisms, however many are. Note the six regulatory signals that converge on 6-Phosphofructose-1-kinase (also known as phosphofructokinase) and Fructose Bisphosphatase (Labeled 2 and 3). Figure [Figure: A section of glycolysis with negative and positive regulation shown](#fig-glycolysisregulation) uses a standard notation to indicate inhibition and activation. Inhibition is often represented as a blunt ended arrow and in this book activation by a rounded arrow (Figure [Figure: Summary of regulation and reaction symbols](#fig-regulationsymbols)).

**Figure** <a id="fig-regulationsymbols"></a> `fig:regulationSymbols`

*Graphic (not in the LaTeX source, referenced by name): `regulationSymbols`*

*Caption:* Summary of regulation and reaction symbols.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.8]{regulationSymbols}
  \caption{Summary of regulation and reaction symbols.}
  \label{fig:regulationSymbols}
\end{center}
\end{figure}
```

**Figure** <a id="fig-glycolysisregulation"></a> `fig:GlycolysisRegulation`

*Graphic (not in the LaTeX source, referenced by name): `glycolysisRegulation`*

*Caption:* A section of glycolysis with negative and positive regulation shown. 1. Hexokinase; 2. 6-Phosphofructose-1-kinase; 3. Fructose bisphosphatase; 4. Pyruvate kinase; 5. Entry to Citric acid cycle; 6. To oxidative respiration. 

```latex
\begin{figure}[!htb]
\begin{center}
  \includegraphics[scale = 0.68]{glycolysisRegulation}
  \caption{A section of glycolysis with negative and positive regulation shown. 1. Hexokinase; 2. 6-Phosphofructose-1-kinase; 3. Fructose bisphosphatase; 4. Pyruvate kinase; 5. Entry to Citric acid cycle; 6. To oxidative respiration. }
  \label{fig:GlycolysisRegulation}
\end{center}
\end{figure}
```

**Figure** <a id="fig-networksoverview"></a> `fig:NetworksOverview`

*Graphic (not in the LaTeX source, referenced by name): `NetworksOverview`*

*Caption:* Network Overview. The figure illustrates the three main network layers, metabolic, protein and gene. TF -- Transcription Factors. The arrows here represents interactions between the different processes.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.6]{NetworksOverview}
  \caption{Network Overview. The figure illustrates the three main network layers, metabolic, protein and gene. TF -- Transcription Factors. The arrows here represents interactions between the different processes.}
  \label{fig:NetworksOverview}
\end{center}
\end{figure}
```

## Protein Networks

Protein networks are by far the most varied networks found in biological cells. They range from proteins involved in controlling gene expression, the cell cycle, coordinating and processing signals from the internal and external environments, to highly sophisticated nano-machines such as parts of the ribosome or the bacterial flagella motor.

Protein networks can be studied on different levels, broadly classified as either stoichiometric or non-stoichiometric networks. The non-stoichiometric networks can be as simple as considering the physical associations between different proteins (often through the formation of protein complexes). Such networks, also termed interaction networks, have been elucidated largely with the help of high-throughput methods. An interaction is formed if two proteins, $A$ and $B$, are known to associate.

Another descriptive level involves functional and stoichiometric networks formed from a consideration of specific stoichiometric binding events, covalent modification (most notably phosphorylation), and degradation. Here two proteins, $A$ and $B$ might form a complex with a stoichiometric relationship and given association constant.

### Protein-Protein Networks

Work on uncovering protein networks has be ongoing since the 1950s and considerable detail has accumulated on many different pathways across different organisms. Traditional methods, though laborious [MethodsSignals2004, MethodsPhospho2009], have been used extensively to gain detailed knowledge on phosphorylation sites, protein structure, the nature of membrane receptors, and the constitution and function of protein complexes. More recent high-throughput methods, though more course grained, have uncovered large swaths of protein-protein interaction networks. For example, in yeast, large scale studies have identified approximately 500 different protein complexes [Gavin2006, Krogan2006] and their relationships to each other.

A popular high-throughput technique that has been used to uncover protein-protein interaction networks is the yeast two-hybrid me\-thod [Fields:1989, phizicky2003]. Other methods such as phage display [Smith:1985, Goodyear2008], affinity purification, and mass spectrometry have also been successfully employed [Gavin2006, Krogan2006]. The yeast two-hybrid method (Figure [Figure: Yeast two-hybrid](#yeasttwohybridfig)) is based on the idea that eukaryotic transcriptional activators consist of two domains, a DNA binding domain (DB) and an activation domain (AD). The activation domain is responsible for recruiting the RNA polymerase to begin transcription. What is remarkable is that the two domains do not have to be covalently linked in order to function correctly; they simply need to be in close proximity. The yeast two-hybrid method is based specifically on this property.

Assume we want to know whether protein X and protein Y interact with each other. In the two-hybrid method, protein X is fused with the DB domain (known as the bait protein) and the second protein, Y, is fused with the AD domain (known as the prey protein). These two fused proteins are now expressed in yeast. If the two proteins X and Y interact in some way, they will bring the DB and AD domains close to each other resulting in an active transcriptional activator. If the gene downstream of the DNA binding sequence is a reporter gene, the interaction of X and Y can be detected once the reporter gene is expressed.

A common reporter gene is the lacZ gene which codes for $\beta$-galactosidase and which produces a blue coloring in yeast colonies through the metabolism of exogenously supplied X-gal (5-bromo-4-chl\-oro-3-indo\-lyl-$\beta$-D-galact\-oside).

There are some caveats with the yeast two-hybrid method, however. Although two proteins may be observed to interact, the protein in their natural setting may not be expressed at the same time or may be expressed but in different compartments. In addition, using the method to identify interactions between non-yeast proteins may be invalid because of the alien environment of yeast cells. As with many high-throughput methods, caution is advised when interpreting the data.

**Figure** <a id="yeasttwohybridfig"></a> `YeastTwoHybridFig`

*Graphic (not in the LaTeX source, referenced by name): `YeastTwoHybridFig`*

*Caption:* Yeast two-hybrid. The wild-type transcription factor is composed of two domains, BD and AD. Both are essential for transcription. Two fusion proteins are made, BD-Bait and AD-Prey. Bait and Prey are the two proteins under investigation. If Bait and Prey interact, BD and AD are brought together resulting in a viable transcription factor that can express a reporter gene. 

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.66]{YeastTwoHybridFig}
  \caption{Yeast two-hybrid. The wild-type transcription factor is composed of two domains, BD and AD. Both are essential for transcription. Two fusion proteins are made, BD-Bait and AD-Prey. Bait and Prey are the two proteins under investigation. If Bait and Prey interact, BD and AD are brought together resulting in a viable transcription factor that can express a reporter gene. }
  \label{YeastTwoHybridFig}
\end{center}
\end{figure}
```

The yeast two-hybrid system helped generate one of the first large scale interaction graphs to be published, the protein interaction graph of *Saccharomyces cerevisiae* [Uetz2000, Ito2001]. Subsequent analysis of this map was conducted by Jeong et al. [Jeong2001] and included 1870 proteins nodes and 2240 interaction edges. Such graphs give a birds-eye view of protein interactions in an entire cell (Fig. [Figure: The poster child of interaction networks, one of the earliest yeast pr](#fig-barabassi2004-proteinnetwork)).

**Figure** <a id="fig-barabassi2004-proteinnetwork"></a> `fig:Barabassi2004_ProteinNetwork`

*Graphic (not in the LaTeX source, referenced by name): `Barabassi2004_ProteinNetwork`*

*Caption:* The poster child of interaction networks, one of the earliest yeast protein interaction networks generated from yeast two-hybrid measurements. Each node represents a protein and each edge an interaction. Although difficult to see in the figure, the graph nodes have been annotated such that red (dark) indicate lethal phenotypic effect if removed, green non-lethal, orange slow growth, and yellow unknown.  Adapted from Barab\'{a}si and Oltvai \protect[Barabasi:2004] but originally published in arXiv and Nature [Jeong2001].

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.85]{Barabassi2004_ProteinNetwork}
  \caption{The poster child of interaction networks, one of the earliest yeast protein interaction networks generated from yeast two-hybrid measurements. Each node represents a protein and each edge an interaction. Although difficult to see in the figure, the graph nodes have been annotated such that red (dark) indicate lethal phenotypic effect if removed, green non-lethal, orange slow growth, and yellow unknown.  Adapted from Barab\'{a}si and Oltvai~\protect\cite{Barabasi:2004} but originally published in arXiv and Nature~\cite{Jeong2001}.}
  \label{fig:Barabassi2004_ProteinNetwork}
\end{center}
\end{figure}
```

### Signaling and Control Networks

Many protein-protein networks operate as signal processing networks and are responsible for sensing external signals such as nutritional (for example, changes in glucose levels), or cell to cell signals such as insulin or Epidermal growth factor (EGF). Other signaling networks include control networks that are concerned with monitoring and coordinating internal changes, the most well known of these includes the cell cycle control network. Many external signals act by binding to cell-surface receptor proteins such as the large family of receptor tyrosine kinases and G-protein coupled receptors [kroeze2003g]. Once a signal is internalized through the cell-surface receptors, other proteins including protein kinases and phosphatases continue to process the signal often in coordination with other signaling networks. Eventually the signaling pathway terminates on target proteins that leads to a change in cell behavior. Such targets can include a wide variety of processes such as metabolic pathways, ion channels, cytoskeleton, motor proteins, and gene regulatory proteins.

The molecular mechanisms employed by signaling and control pathways include covalent modification, degradation and complex formation. Covalent modification in particular is a common mechanism used in signaling networks and includes a variety of different modifications such as phosphorylation, acetylation, methylation, ubiquitylation, and possibly others [Bode2004]. As a result, the structure and computational abilities [SauroKholodenko2004] of such networks are likely to be elaborate. It has been estimated from experimental studies that in *E. coli*, 79 proteins can be phosphorylated [macek2008] on serine, threonine, and tyrosine side groups whereas in yeast, 4000 phosphorylation events involving 1,325 different proteins have been recorded [ptacek2005].

The cell cycle control network is an good example of a sophisticated protein control network that coordinates the replication of a biological cell. The cell cycle includes a number of common molecular mechanisms that are found in many other protein networks. These can be grouped into three broad types: phosphorylation, degradation and complex formation. Phosphorylation is a common mechanism for changing the state of a protein and involves phosphorylation on a number of sites on the protein surface including serine/threonine and tyrosine. In prokaryotes, histidine, arginine, or lysine can also be phosphorylated. Phosphorylation is mediated by kinases. The human genome may have over 500 kinase encoding genes [ManningScience2000]. The effect of phosphorylation is varied but most often causes the altered protein to change catalytic activity, to change the protein's `visibility' to other proteins, or to mark the protein for degradation. For example, Src is a tyrosine kinase protein involved in cell growth. It has two states, active and inactive. When active, it has the capacity to phosphorylate other proteins. Deactivation of src is achieved by phosphorylation of a tyrosine group on the C-terminal end of the protein. Dephoshorylation of the tyrosine group by tyrosine phosphatases results in activation of the protein.

Phosphorylation can also be used to inactivate enzymes such as glycogen synthase by the glycogen synthase kinase 3 protein. In the yeast cell cycle, the protein Wee1 is phosphorylated and inactivated by the complex Cdc2-Cdc13. Active Wee1 in turn (i.e. the unphosphorylated form) can inactivate Cdc2-Cdc13 by phosphorylating the Cdc2 subunit.

In addition to changing the activity of proteins, phosphorylation can also be used to mark proteins for degradation. For example, the protein Rum1 that is part of the yeast cell cycle control network can be phosphorylated by Cdc2-Cdc13. Once phosphorylated,Rum1 is degraded. Degradation itself is an important mechanism used in protein signalling networks and allows proteins to be rapidly removed from a network according to the cell state. Degradation is usually mediated by ubiquitylation. For example, Cdc2-Cdc13, via Ste9 and APC is marked for degradation by ubiquitylation (Rum1 is similarly processed once phosphorylated). Once marked this way, such proteins can bind to the proteasome where they are degraded. Finally, binding of one protein to another can change the target protein's activity or visibility. An example of this is the inactivation of Cdc2-Cdc13 by Rum1. When unphosphorylated, Rum1 binds to Cdc2-Cdc13, rendering the resulting complex inactive.

Different combinations of these basic mechanisms are also employed. For example, phosphorylation of complexes can lead to the dissociation of the complex, or the full activity of a protein may require multiple phosphorylation events. Although signaling networks can appear highly complex and varied, most of them can be reduced to the three fundamental mechanisms of covalent modification, selective degradation and complex formation (Fig [Figure: Fundamental Protein Mechanisms](#fig-phosmechanisms)).

These examples highlight the basic mechanisms by which protein signalling control networks can be assembled into sophisticated decision making systems.

**Figure** <a id="fig-phosmechanisms"></a> `fig:PhosMechanisms`

*Graphic (not in the LaTeX source, referenced by name): `PhosMechanisms`*

*Caption:* Fundamental Protein Mechanisms.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.5]{PhosMechanisms}
  \caption{Fundamental Protein Mechanisms.}
  \label{fig:PhosMechanisms}
\end{center}
\end{figure}
```

In higher eukaryotic cells, particulary human, around 2% of the protein-coding part of the genome is devoted to encoding protein kinases, with perhaps 10% of the coding region dedicated to proteins involved in signaling networks. It has also been suggested that as much as 30% of all cellular proteins in yeast and human can be phosphorylated [cohen2000].

The actual size of networks is even larger that these numbers suggest because of the significant number of covalent variants and binding permutations. For example, the tumor suppressor protein, p53, has between 17 and 20 phosphorylation sites alone [Toledo2006]. If every combination were phenotypically significant, as unlikely as that might be, this amounts to at least 131,072 different states. On a side note, there is some discussion [Faeder2005, chylek2014] on how to deal with networks when there is a proliferation in states due to covalent modification and protein complex formation. Two issues present themselves, the first is how do we describe such systems to a computer? This has been solved by using a rule-based approach. BioNetgen is an example of a software tool that allows a modeler to describe such models using rules [harris2015bionetgen]. The second issue is how important is the combinatorial expansion to modeling, are the multiple states actually functional\ cite{faeder2005rule,sekar2017introduction}?

Ptacek and Snyder [ptacek2006] have published a review on elucidating phosphorylation networks where more detailed information is provided.

**Figure** <a id="fig-leu3network"></a> `fig:Leu3Network`

*Graphic (not in the LaTeX source, referenced by name): `Leu3Network`*

*Caption:* A Small Protein-Protein Interaction Map. This image was taken from the STRING web site (Search Tool for the Retrieval of Interacting Genes/Proteins, \protect<http://string.embl.de/>). The image displays a small segment of the protein interaction map centered around LEU3, the transcription factor that regulates genes involved in leucine and other branched chain amino acid biosynthesis. 

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[angle=0, scale = 0.38]{Leu3Network}
  \caption{A Small Protein-Protein Interaction Map. This image was taken from the STRING web site (Search Tool for the Retrieval of Interacting Genes/Proteins, \protect\url{http://string.embl.de/}). The image displays a small segment of the protein interaction map centered around LEU3, the transcription factor that regulates genes involved in leucine and other branched chain amino acid biosynthesis. }
  \label{fig:Leu3Network}
\end{center}
\end{figure}
```

## Gene Regulatory Networks

The control of gene expression in prokaryotes is relatively well understood. Transcription factors control gene expression by binding to special upstream DNA sequences called operator sites. Such binding results in the activation or inhibition of gene transcription. Multiple transcription factors can also interact to control the expression of a single gene. Such interactions can emulate simple logic functions (such as AND, OR, etc.) or more elaborate computations. Gene regulatory networks can range from a single controlled gene to hundreds of genes interlinked with transcription factors forming a complex decision making circuit. There are different classes of transcription factors. For example, the binding of some transcription factors to operator sites is modulated by small molecules, the classic example being the binding of allolactose (a disaccharide very similar to lactose) to the lac repressor, or cAMP to the catabolite activator protein (CAP). Alternatively, a transcription factor may be expressed by one gene and either directly modulate a second gene (which could be itself), or via other transcription factors integrating multiple signals onto another gene. Additionally, some transcription factors only become active when phosphorylated or unphosphorylated by protein kinases and phosphatases. Like protein signaling and metabolic networks, gene regulatory networks can be elaborate.

Significant advances have been made in developing high-throughput methods used to determine protein-gene networks. Of particular interest are ChIP-chip [Ren2000, Aparicio2004] and the more recently developed ChIP-seq [Mardis2007] screening method -- Chromatin imm\-uno\-precip\-itation micro\-arr\-ay/Seq\-uen\-cing. ChIP works by treating cells with formaldehyde which crosslinks DNA to the transcription binding protein if it is bound to the DNA. The cells are then lysed and the DNA fragmented into small 1 kB or less fragments. A specific antibody is then used to bind to the DNA-binding protein of interest and precipitate the protein and associated DNA fragment. The precipitated DNA pieces are released by reversing the crosslinking. In ChIP-chip, the released DNA pieces are hybridized to a microarray that enables the bound protein to be located on the genome. A more recent version is ChIP-seq. In this procedure the microarray stage is abandoned and instead, the released DNA pieces are sequenced. Once sequenced, the location on the genome can be uncovered. These methods have been successfully used to determine the gene-protein network of a number of organisms, with yeast being the first [Lee2002]. Alternatively, other approaches have focused on determining gene-protein networks from literature mining and careful curation or even prediction of putative binding sites.

**Figure** <a id="fig-chipseqchipdiagram"></a> `fig:ChipSeqChipDiagram`

*Graphic (not in the LaTeX source, referenced by name): `ChipSeqChipDiagram`*

*Caption:* ChIP-chip and ChIP-seq methods for identifying transcriptional binding sites. Adapted from [Mardis2007]. 

```latex
\begin{figure}[p]
\begin{center}
  \includegraphics[scale = 0.5]{ChipSeqChipDiagram}
  \caption{ChIP-chip and ChIP-seq methods for identifying transcriptional binding sites. Adapted from~\cite{Mardis2007}. }
  \label{fig:ChipSeqChipDiagram}
\end{center}
\end{figure}
```

In general, gene regulatory networks are the slowest responding networks in a cell and work from minutes to hours depending on the organism. Bacterial gene regulatory networks tend to operate more quickly compared to eukaryotic gen networks. .

The most extensive gene regulatory network database is RegulonDB [Huerta1998, Gama-Castro2008] which represents the gene regulatory network of *E. coli*. In-depth reviews covering the structure of regulatory networks can be found in the works of Alon [AlonLetter2002] and Seshasayee [seshasayee2006].

To visually represent gene regulatory networks we will use a notation very similar to that used by the software package Biotapestry [longabaugh2005, longabaugh2008] because it offers a clear and concise visual representation. To represent the expression of a gene controlled by a transcription factor, $P$, we will use the diagrammatic notation shown in Figure [Figure: Representing a single gene](#fig-singlegenenotation). This omits details such as translation and transcription, providing a concise representation of a gene regulatory network without the mechanistic details that *may* not be important.

**Figure** <a id="fig-singlegenenotation"></a> `fig:singleGeneNotation`

*Graphic (not in the LaTeX source, referenced by name): `singleGeneNotation`*

*Caption:* Representing a single gene. $I$ represents the inducer and $P$ the expressed protein. Increasing $I$ will increase the rate of protein $P$ expression.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[angle=0, scale = 0.7]{singleGeneNotation}
  \caption{Representing a single gene. $I$ represents the inducer and $P$ the expressed protein. Increasing $I$ will increase the rate of protein $P$ expression.}
  \label{fig:singleGeneNotation}
\end{center}
\end{figure}
```

It is however possible to add transcription and translation as shown in Figure [Figure: Representing a single gene with the addition of explicit translation a](#fig-singlegeneplusnotation).

**Figure** <a id="fig-singlegeneplusnotation"></a> `fig:singleGenePlusNotation`

*Graphic (not in the LaTeX source, referenced by name): `singleGenePlusNotation`*

*Caption:* Representing a single gene with the addition of explicit translation and transcription. $I$ represents the inducer and $P$ the expressed protein.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[angle=0, scale = 0.7]{singleGenePlusNotation}
  \caption{Representing a single gene with the addition of explicit translation and transcription. $I$ represents the inducer and $P$ the expressed protein.}
  \label{fig:singleGenePlusNotation}
\end{center}
\end{figure}
```

Figure [Figure: Simple gene regulatory patterns](#fig-genemechanisms) illustrates a range of gene regulatory patterns. We will cover the diagrammatic notation in more detail in Chapter [[03_stoichiometric_networks|Stoichiometric Networks]], but (Figure [Figure: Summary of regulation and reaction symbols](#fig-regulationsymbols)) blunt ends are used to indicate inhibition while round circle ends represent activation. We can now construct gene regulatory networks by connecting single gene units together. Figure [Figure: Two examples of gene regulatory networks](#fig-genenetworks) illustrates two typical gene regulatory networks. The first (a) shows a relatively simple sequence of gene regulatory steps where on the left of the figure, an inducer, $I$, activates the expression of protein $p_1$. The gene is represented as a horizontal line with an emerging arrow on the right indicating the expression of either mRNA or in this case protein. $p_1$ in turn inhibits a second gene that reduces the expression of protein, $p_2$.

**Figure** <a id="fig-genemechanisms"></a> `fig:GeneMechanisms`

*Graphic (not in the LaTeX source, referenced by name): `GeneMechanisms`*

*Caption:* Simple gene regulatory patterns.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[angle=0, scale = 0.55]{GeneMechanisms}
  \caption{Simple gene regulatory patterns.}
  \label{fig:GeneMechanisms}
\end{center}
\end{figure}
```

It should be evident that these diagrams hide an enormous amount of detail. In these examples even the mRNA intermediates are absent. These diagrams are therefore at a very high level and may be sufficient to answer particular questions when the detail is unnecessary.

The network in Figure [Figure: Two examples of gene regulatory networks](#fig-genenetworks)(b), shows additional features including negative feedback and a transcription factor dimerizing ($v_4$) to form the active regulatory protein, $p_2$. The mechanistic nature of the repression and activation is not specified in these diagrams.

Although the description of the three main network types may give the impression that they act independently of each other, this is definitely not the case. For example, Figure [Figure: Example of a mixed network involving gene regulatory and protein phosp](#fig-mixedgeneproteinnetwork) is an example taken from *Caulobacter* [Brilli:2010] showing a mixed gene regulatory and protein network.

**Figure** <a id="fig-genenetworks"></a> `fig:geneNetworks`

*Graphic (not in the LaTeX source, referenced by name): `geneNetworks`*

*Caption:* Two examples of gene regulatory networks. $v_1$ to $v_9$ represent either gene expression or protein degradation
  rates (for example $v_2$). $I$ represents the concentration of some inducer, assumed to be a constant value. Figure b) illustrates dimerization of $p_1$ and negative feedback from $p_3$.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.66]{geneNetworks}
  \caption{Two examples of gene regulatory networks. $v_1$ to $v_9$ represent either gene expression or protein degradation
  rates (for example $v_2$). $I$ represents the concentration of some inducer, assumed to be a constant value. Figure b) illustrates dimerization of $p_1$ and negative feedback from $p_3$.}
  \label{fig:geneNetworks}
\end{center}
\end{figure}
```

<!-- \begin{figure}[htb] -->
<!-- \begin{center} -->
<!-- \includegraphics[scale = 0.15,angle=90]{BiotabGeneNetwork} -->
<!-- \caption{A view of the extensive gene regulatory network from the endomesoderm of the sea urchin {\em S. purpuratus}. The image was generated using the BioTaperstry software~\cite{longabaugh2005} from the model provided at \protect\url{http://sugp.caltech.edu/endomes/webStart/bioTapestry.jnlp}. For a description of the notation see the paper by Longabaugh et al.~\cite{longabaugh2008} } -->
<!-- \label{fig:BiotabGeneNetwork} -->
<!-- \end{center} -->
<!-- \end{figure} -->

**Figure** <a id="fig-mixedgeneproteinnetwork"></a> `fig:mixedGeneProteinNetwork`

*Graphic (not in the LaTeX source, referenced by name): `mixedGeneProteinNetwork`*

*Caption:* Example of a mixed network involving gene regulatory and protein phosphorylation networks in *Caulobacter*. Blunt ends to regulatory arcs indicate inhibition while arrow ends indicate activation. Image from BioMed Central [Brilli:2010]. 

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.4,angle=0]{mixedGeneProteinNetwork}
  \caption{Example of a mixed network involving gene regulatory and protein phosphorylation networks in {\em Caulobacter}. Blunt ends to regulatory arcs indicate inhibition while arrow ends indicate activation. Image from BioMed Central~\cite{Brilli:2010}. }
  \label{fig:mixedGeneProteinNetwork}
\end{center}
\end{figure}
```

<!-- In the diagrams shown so far one may have noticed a common visual que that seems to been universally used. These ques represent activation and repression (inhibition). It is generally common practice to use blunt ended arrow to indicate repression and either an arrow or round ended arrow to represent activation (Figure~\ref) -->

<!-- \begin{figure}[htb] -->
<!-- \begin{center} -->
<!-- \includegraphics[scale = 0.75,angle=0]{InbibitionRepressionSymbols} -->
<!-- \caption{Common symbols use to indicate activation and inhibition.} -->
<!-- \label{fig:InbibitionRepressionSymbols} -->
<!-- \end{center} -->
<!-- \end{figure} -->

## Genome Sizes

How big are cellular networks? We can try to answer this question by looking at whole genomes. The sizes of genomes vary considerably from the minuscule 159,662 bases of the symbiotic bacterium called *Carsonella ruddii*, which lives off sap-feeding insects, to the Whisk fern comprised of $2.5 \times 10^{11}$ bases. Some of this size difference is related to the complexity of the organism, simpler organisms requiring fewer genes. However the correlation, although on the whole positive, is not entirely linear. For example, *E. coli* has roughly 4,300 genes on a genome of size 4.6 Mb, while humans have roughly 25,000 genes on a genome of about 3000 Mb. The *E. coli* genome is quite dense with roughly 88% of the genome coding for proteins [taft2004] with the remainder being made up of RNA coding, promoter sequences and other common segments. The human genome on the other hand is very sparse with only about 2% of the genome actually coding for protein. There is ongoing speculation as to why the human genome is so sparse and what role the other 98% might play. Some evidence suggests an RNA based regulatory network [mattick2004] that is coded in at least some of the non-coding sequences (the so-called junk DNA).

Figure [Figure: Small genome with 523 genes (484 are protein coding genes) from *Mycop](#fig-smallgenome) shows an example of a small genome from *Mycoplasma genitalium M6282*. This organism is a small parasitic bacteria that lives in primate genital and respiratory tracts and is the smallest known free-living bacteria. The genome of this organism has 523 genes in total, 484 of these code for protein while the remaining reading frames code for tRNA and rRNA.

**Figure** <a id="fig-smallgenome"></a> `fig:smallGenome`

*Graphic (not in the LaTeX source, referenced by name): `Biocyc_genome_M6282.pdf`*

*Caption:* Small genome with 523 genes (484 are protein coding genes) from *Mycoplasma genitalium M6282*. Image taken from BioCyc.

```latex
\begin{figure}[htbp]
\centering
  \includegraphics[scale = 0.26,angle=0]{Biocyc_genome_M6282.pdf}
  \caption{Small genome with 523 genes (484 are protein coding genes) from {\em Mycoplasma genitalium M6282}. Image taken from BioCyc.}
  \label{fig:smallGenome}
\end{figure}
```

The 484 genes that encode proteins in *Mycoplasma genitalium  M6282* include a wide variety of functions (Figure [Figure: 1:](#fig-mycogengenes)) covering areas such as energy metabolism, replication and the cell envelope. Even for such a small organism, there are still seven genes of unknown function according to the JGI database for the M6282 strain (retrieved November, 2019).

**Figure** <a id="fig-mycogengenes"></a> `fig:MycogenGenes`

*Caption:* 1: Cell Envelope; 2: Regulatory; 3: Unknown; 4: Central Metabolism; 5: Cofactor Biosynthesis; 6: Purine/Pyrumdine metabolism; 7: Transcription; 8: Transport; 9: Replication/Repair; 10: Lipid Metabolism; 11: Translation; 12: Cellular Processes; 13: Energy Production.

```latex
\begin{figure}[htb]
\centering
\begin{tikzpicture}
\begin{axis}[every node near coord/.style={color=black,opacity=1.0},
width=10cm,
%x tick label style={ /pgf/number format/1000 sep=},
ylabel=Number of genes,
xlabel=Function,
enlargelimits=0.15,
ybar=5pt,% configures `bar shift'
extra x ticks={1,3,5,7,9,11,13},
bar width=9pt
]

\addplot[blue!80!black,fill=blue,fill opacity=0.45,nodes near coords, point meta=y] coordinates {(1,28) (2,6) (3,170) (4,8) (5,3) (6,20) (7,17) (8,32) (9,29) (10,8) (11,96) (12,14) (13,32) };

\end{axis}
\end{tikzpicture}
\caption{1: Cell Envelope; 2: Regulatory; 3: Unknown; 4: Central Metabolism; 5: Cofactor Biosynthesis; 6: Purine/Pyrumdine metabolism; 7: Transcription; 8: Transport; 9: Replication/Repair; 10: Lipid Metabolism; 11: Translation; 12: Cellular Processes; 13: Energy Production.}
\label{fig:MycogenGenes}
\end{figure}
```

Eukaryotic genes, especially human, are also fragmented into segments called exons (coding) and introns (non-coding). This segmentation allows different forms of protein to be derived from the same gene by splicing together different exons. Although the number of genes is roughly 25,000,  alternative splicing likely increases this number [brett2002, wang2008]. Finally, many proteins, particularly those involved in signaling pathways, also have alternative forms due to covalent modification such as phosphorylation or methylation. This again increases the actual number of states. In other words, the number of genes in a genome gives a lower limit to the size of a cellular network, particularly in eukaryotic organisms. The size of a given genome is therefore a poor indicator of organism complexity. To give a better idea of the size and complexity of a small genome, let's look more closely at a specific one, *E. coli*.

{\arrayrulecolor{brickRed}
\setlength\heavyrulewidth{0.85pt}
\setlength{\abovetopsep}{4pt}

**Table**

*Caption:* A comparison of genome sizes (base pairs) and estimated number of genes. Data from Taft and Mattick [taft2004].

```latex
\begin{table}[htb]
\centering
\caption{A comparison of genome sizes (base pairs) and estimated number of genes. Data from Taft and Mattick~\cite{taft2004}.}
\begin{tabular}{lrr} \toprule
Organism & Genome Size & Est.\ Number of Genes\\\midrule
{\em E.\ coli} & 4,639,221 & 4,316 \\
{\em Bacillus subtilis} & 4,214,810 & 4,100 \\
{\em Saccharomyces cerevisiae} & 12,100,000 & 6,000 \\
{\em Caenorhabditis elegans} & 97,000,000 & 19,049 \\
{\em Arabidopsis thaliana } & 115,409,949 & 25,000  \\
{\em Drosophila melanogaster} & 120,000,000 & 13,600 \\
{\em Mus musculus} & 2,500,000,000 & 37,000 \\
{\em Homo sapiens} & 3,000,000,000 & 30,000 \\ \bottomrule
\end{tabular}
\end{table} }
```

## E. coli

The bacterium *E. coli* is probably one the best understood organisms so is worth considering some of its features. Much of the information provided here comes from the EcoCyc and RegulonDB online databases and their respective publications [Karp:2007, Gama-Castro2008].

*E. coli* is a cylindrical body, with a length of about $2 \mu m$ and diameter of about $0.8 \mu m$. These dimensions offer a convenient translation between concentration
and number of molecules in *E. coli*. Thus 1 nM concentration roughly translates to one molecule per *E. coli* cell (See exercises at end of chapter). For example, ATP is present at a concentration of approximately 2 mM, meaning there are roughly 2,000,000 molecules of ATP in a single *E. coli* cell.

The *E. coli* circular genome is composed of 4,639,221 base pairs ($490 \mu m$ in diameter) encoding at least 4,472 genes.  4,316 code for proteins with the remainder coding for various RNA products such as tRNAs and rRNAs. The genes in *E. coli*, like other prokaryotes, are not segmented (genes made of introns and exons); that is, a gene in *E. coli* is a contiguous sequence of DNA translated into the final protein without editing. In addition, there is very little non-coding DNA in *E. coli* with almost 88% of the genome coding for proteins.

Almost one quarter of all proteins produced by gene expression in *E. coli* form multimers, proteins composed of multiple subunits. Many of these multimers are homomultimers, meaning they are made up of the same subunits. Some of these proteins can also be covalently modified by phosphorylation, methylation or other means. There are estimated to be at least 171 transcription factors that directly control gene expression. This number provides insight into the size of the *E. coli* gene regulatory network. The EcoCyc database reports at least 48 small molecules and ions that regulate these transcription factors.

**Figure** <a id="fig-goodsellecoli"></a> `fig:GoodSellEcoli`

*Graphic (not in the LaTeX source, referenced by name): `ecoliGoodsell`*

*Caption:* Artists impression (With permission, Goodsell) of a cross-section through *E. coli* illustrating the high density of proteins and other molecules in the cytoplasm, drawn roughly to scale <http://mgl.scripps.edu/people/goodsell/illustration/public>.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.2,angle=0]{ecoliGoodsell}
  \caption{Artists impression (With permission, Goodsell) of a cross-section through {\em E.\ coli} illustrating the high density of proteins and other molecules in the cytoplasm, drawn roughly to scale~\url{http://mgl.scripps.edu/people/goodsell/illustration/public}.}
  \label{fig:GoodSellEcoli}
\end{center}
\end{figure}
```

Of the 4,316 genes in *E. coli*, 3,384 (76%) have been assigned a biochemical function. There are at least 991 genes involved directly in metabolism with a further 355 genes involved in transport. Other gene functions include DNA replication, recombination and repair, protein folding, transcription, translation and regulatory proteins. An inventory of small molecules has not been thoroughly made, but EcoCyc records at least 1,352 unique small organic molecules, but there are likely many more.

These statistics suggest large numbers of interactions among many thousands of cellular components forming extensive networks.

Given the size of a single *E. coli* cell, the concentration of protein in the cytoplasm, and the average diameter of a protein (5 nm), it is estimated that the average spacing (center to center) between proteins is about 7 nm. This suggests that the cytoplasm is quite dense. David Goodsell (<http://mgl.scripps.edu/people/goodsell>) is well known for his evocative illustrations of subcellular spaces. Figure [Figure: Artists impression (With permission, Goodsell) of a cross-section thro](#fig-goodsellecoli) illustrates his rendition of a cross-section through *E. coli* and gives a vivid impression of how packed the cytoplasm is.

**Table** <a id="tbl-basicinformation"></a> `tbl:basicInformation`

*Caption:* Basic Information on *E. coli*.

```latex
\begin{table}[htb]
\begin{center}
\begin{tabular}{ll} \toprule
Property & Dimensions \\ \midrule
Length & 2 to 3 $\mu$m \\
Diameter & $\simeq 1 \mu$m \\
Volume & $1 \times 10^{-15} $ L \\
Optimal generation time & 20 to 30 mins \\
Translation rate & 40 amino acids per sec \\
Transcription rate & 70 nucleotides per sec \\
Number of ribosomes per cell & 18,000 \\
Average protein diameter & 5 nm \\
Average concentration of protein & 5-8 mM \\
Average number of proteins & 3,600,000 \\  \bottomrule
\end{tabular}
\caption{Basic Information on {\em E.\ coli}.}
\label{tbl:basicInformation}
\end{center}
\end{table}
```

There are two useful websites for obtaining basic operating information on *E. coli*. The first is the *E. coli*. statistics site at Alberta (<http://gchelpdesk.ualberta.ca/CCDB/cgi-bin/STAT_NEW.cgi>). The oth\-er is a more generic and community based website called BIONUMBRS (The Database of Useful Biological Numbers). Publications from the  project also supply many useful statistics on *E. coli* [Karp:2007, Keseler2011].

**Table** <a id="tbl-generalmolnumber"></a> `tbl:GeneralMolNumber`

*Caption:* Orders of magnitude for various *E. coli* molecule types.

```latex
\begin{table}[htb]
\begin{center}
\begin{tabular}{ll} \toprule
Molecule & Estimated Number \\ \midrule
Ions & Millions \\
Small Molecules & 10,000 - 100,000 \\
Metabolic Enzymes & 1000 - 10,000s \\
Signaling Molecules & 100 - 1,000s \\
Transcription factors & 10s to 100s \\
DNA & 1 - 10s \\ \bottomrule
\end{tabular}
\caption{Orders of magnitude for various {\em E.\ coli} molecule types.}
\label{tbl:GeneralMolNumber}
\end{center}
\end{table}
```

The number of molecules in a typical *E. coli* varies with the molecule type. For example, there are approximately 2,000,000 Na$^+$ ions while only 300,000 tryptophan molecules. The larger the molecule, the fewer their number (Table [Table: Orders of magnitude for various *E](#tbl-generalmolnumber)). For example, transcription factors are only present in numbers ranging from 10s to 100s, whereas ions are present in the millions.

**Table** <a id="tbl-ecolinumberssmall"></a> `tbl:EcoliNumbersSmall`

*Caption:* Small molecule estimates in *E. coli*.

```latex
\begin{table}[htb]
\begin{center}
\begin{tabular}{ll} \toprule
Ions & Estimated Numbers \\ \midrule
Na & 3,000,000 \\
Ca & 2,300,000 \\
Fe & 7,000,000 \\ \toprule
Small Molecules & Estimated Numbers \\ \midrule
Alanine & 350,000 \\
Pyruvate & 370,000 \\
ATP & 2,000,000 \\
ADP & 70,000 \\
NADP & 240,000 \\ \bottomrule
\end{tabular}
\caption{Small molecule estimates in {\em E.\ coli}.}
\label{tbl:EcoliNumbersSmall}
\end{center}
\end{table}
```

**Table** <a id="tbl-ecolinumberslarge"></a> `tbl:EcoliNumbersLarge`

*Caption:* Estimated numbers for larger molecules in *E. coli*.

```latex
\begin{table}[htb]
\begin{center}
\begin{tabular}{ll} \toprule
Signaling Proteins & Estimated Numbers \\ \midrule
LacI & 10 to 50 \\
CheA kinase & 4,500 \\
CheB & 240 \\
CheY & 8,200 \\
Chemoreceptors & 15,000 \\ \toprule
Metabolic Enzymes & Estimated Numbers \\ \midrule
Phosphofructokinase & 1,550 \\
Pyruvate Kinase & 11,000 \\
Enolase & 55,800 \\
Phosphoglycerate kinase & 124,000 \\
Malate Dehydrogenase & 3,390 \\
Citrate Synthase & 1,360 \\
Aconitase & 1,630 \\ \bottomrule
\end{tabular}
\caption{Estimated numbers for larger molecules in {\em E.\ coli}.}
\label{tbl:EcoliNumbersLarge}
\end{center}
\end{table}
```

A significant study by Bennett et al. [Bennett2009] measured over 100 metabolite levels in the main metabolic pathways of glucose-fed, exponentially growing *E. coli.* The average concentration was found to be 0.22 mM. We can compare this with the average $K_m$ (concentration of substrate that gives half maximal activity) of approximately 0.1 mM as reported by the  database. This suggests that on average enzymes operate above their half maximal activity. However, a more detailed analysis revealed considerable variability among different metabolite types. For example, cofactors such as ATP and NAD$^+$ were at concentrations significantly above their $K_{ms}$. In contrast, substrate-enzyme pairs where the concentration was below the $K_m$ were dominated by enzymes catalyzing nucleotide, nucleoside, nucleobase and amino acid degradation reactions. On the other hand, the glycolytic pathway, tricarboxylic acid cycle, and the pentose-phosphate pathways all showed substrate concentration that were similar to their $K_m$ values.

We can also consider how fast processes occur in *E. coli*. As suggested earlier in the chapter, metabolic responses are the fastest followed by protein signaling networks and gene regulatory networks. Table [Table: *E](#tbl-generalresponsetimes) lists some estimated response times for various biological processes.

The number of molecules and the rate of various processes gives some idea of the magnitude of systems we are dealing with. However, the economy of a typical cell, how ATP is distributed to different processes and how supply and demand are maintained, is largely not understood since many of these processes are difficult to measure. Moreover, there is no economic theory that describes the life of a cell. This is a significant omission in our understand of organisms, particularly when we attempt to engineer them.

**Table** <a id="tbl-generalresponsetimes"></a> `tbl:GeneralResponseTimes`

*Caption:* *E. coli* grown on minimal media plus glucose. Data from Phillips et al. (2010) and *E. coli* stats reference: http://ccdb.wishartlab.com.

```latex
\begin{table}[htb]
\begin{center}
\begin{tabular}{ll} \toprule
Process & Rate\\ \midrule
Cell Division Time & 50 minutes \\
Rate of Replication & 2,000 bp/s \\
Protein Synthesis & 1,000 proteins/s \\
Lipid Synthesis & 20,000 lipids/s \\
Ribosome Rates & 25 amino acids per sec per ribosome \\
Number of ATP to make one cell & 55 billion ATPs \\ \bottomrule
\end{tabular}
\caption{{\em E.\ coli} grown on minimal media plus glucose. Data from Phillips et al. (2010) and {\em E.\ coli} stats reference: http://ccdb.wishartlab.com.}
\label{tbl:GeneralResponseTimes}
\end{center}
\end{table}
```

## Network Motifs

At first glance the complex biochemical maps we see on lab walls and in text books appear to have little order. However on closer examination, patterns emerge. One way to discern these patterns is to compare real biochemical networks with random networks and to look for a given pattern in each. For example, let's say we identify a pattern of regulation which we label $p_1$. We look for the occurrence of $p_1$ in both the real biochemical network and the randomly generated network. If we find that the pattern is statistically enriched in the real biochemical network compared to the randomly generated one, we say we have found a network **motif**.

A motif is a subgraph within a network that occurs more often than one would expect by random chance alone. Such subgraphs can be simple triangles, squares etc. It is assumed that such motifs occur more frequently because they confer some functional advantage; their identification is therefore considered important. Locating motifs in a large network entails a three step process:

- Estimate the frequency of each isomorphic subgraph in the target network.
- Generate a suitable random graph to test the significance of the frequency data.
- Compare the target network with the random graph.

The critical stage is generating a suitable random model for comparison. The approach is to generate a random network which has a degree distribution(footnote: The degree of a node is the number of edges incident on the node.} that is the same as the degree distribution of the real target network [Milo2002, milo2003, milo2004]. One way to accomplished this is by starting with the target network itself and randomizing edges in such a way that the original degree distribution is preserved. This is carried out multiple times in order to generate a population of random networks. Once the random and target networks are ready, additional algorithms are invoked to count the number of given motifs. The frequency distribution of the motif in the random networks is then compared to the frequency distribution of the target network. A simple significance test can be carried out using the z-score [Network Motifs](#eqn-zscore). The z-score is computed by subtracting the number of a given motif in the target network from the mean number of the same motif in the randomized networks. This difference is then normalized by dividing by the standard deviation of the motif count in the random population. If the z-score is greater than zero, then the observed number of motifs is greater than the mean, while a negative z-score indicates that the observed number of motifs is below the mean. A z-score of two indicates that the observed value is two standard deviations above the mean which can also be roughly interpreted as the 95% confidence level. That is, if a z-score is two or above, the number of motifs is significantly different from a random network suggesting that the motif has some functional significance.

$$
\begin{equation}
z = \frac{n - n_r}{\sigma_r}
\label{eqn:zscore}
\end{equation}
$$

The definition of a motif, while useful, has important restrictions. For example, consider a large electronic circuit containing transistors, resistors and capacitors. A motif search in such a circuit may find an overabundance of amplifier like motifs compared to a completely random circuit. However, such an analysis will not find specialist circuits such as a resonance filter, which may only occur once in the circuit. The motifs located using this approach therefore need to be fairly common in the network. The operational definition of motifs excludes motifs which may only appear once in a network but whose role is critical to the network's function [Siegal2007].

One motif that has been both theoretically and experimentally studied is the feedforward loop (FFL). We will discuss this motif in more detail in Chapter [[14_modeling_feedforward_networks|Modeling FeedForward Networks]]. Here we will briefly mention its relative abundance in real networks. Figure [Figure: Occurrences of feedforward loop motifs as generated by the software MA](#fig-fflmavisto) illustrates motif findings in part of yeast data using the MAVisto software [schreiber2005]. The software has picked up a number of feedforward loop motifs.

**Figure** <a id="fig-fflmavisto"></a> `fig:FFLMaVisto`

*Graphic (not in the LaTeX source, referenced by name): `FFLMAVisto`*

*Caption:* Occurrences of feedforward loop motifs as generated by the software MAVisto [schreiber2005]. The displayed network is part of yeast data supplied with the MAVisto software. The software is very straightforward to use and will identify a wide variety of motifs. Other similar tools include FANMOD [wernicke2006] and the original motif tool mFinder [kashtan2002].

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.5]{FFLMAVisto}
  \caption{Occurrences of feedforward loop motifs as generated by the software MAVisto~\cite{schreiber2005}. The displayed network is part of yeast data supplied with the MAVisto software. The software is very straightforward to use and will identify a wide variety of motifs. Other similar tools include FANMOD~\cite{wernicke2006} and the original motif tool mFinder~\cite{kashtan2002}.}
  \label{fig:FFLMaVisto}
\end{center}
\end{figure}
```

The FFL has a simple structure; there is a single input, $P_1$, and a single output, $P_3$. There are two routes from the input to the output nodes, one is direct and the other goes via an intermediate node, $P_2$. Figure [Figure: Feedforward Network Motifs](#fig-listofmotifsc)b shows a generic FFL. Given this basic structure we can imagine various combinations of activation and repression on the edges for a total of eight combinations. These are shown in Figure [Figure: Full complement of feedforward motifs, classified into coherent and in](#fig-feedforwardcombinations). We can further categorize the eight FFLs into two groups of four, coherent and incoherent. Incoherent FFLs are those where the two routes have opposite effects on the output. Coherent FFLs are where the routes have the same effect on the output. A motif search for all eight types in *E. coli* and yeast reveals an asymmetry in the relative abundance in the different types. Most noticeably from Figure [Figure: Relative abundance of different FFL types in yeast and *E](#fig-fflabundancegraph) we see that two types predominate in both organisms, Coherent Type 1 (C1) and Incoherent Type 1 (I1).

**Figure** <a id="fig-feedforwardcombinations"></a> `fig:FeedForwardCombinations`

*Graphic (not in the LaTeX source, referenced by name): `FeedForwardCombinations`*

*Caption:* Full complement of feedforward motifs, classified into coherent and incoherent types.

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.65]{FeedForwardCombinations}
  \caption{Full complement of feedforward motifs, classified into coherent and incoherent types.}
  \label{fig:FeedForwardCombinations}
\end{center}
\end{figure}
```

More interesting is that these two types have distinct behavioral properties. We will return to the question of what dynamics these networks can display in Chapter [[14_modeling_feedforward_networks|Modeling FeedForward Networks]] where we will use simulation as a guide.

**Figure** <a id="fig-fflabundancegraph"></a> `fig:FFLAbundanceGraph`

*Graphic (not in the LaTeX source, referenced by name): `FFLAbundanceGraph`*

*Caption:* Relative abundance of different FFL types in yeast and *E. coli*. Labels on the x-axis refer to the particular FFL motifs seen in Figure \protect[Figure: Full complement of feedforward motifs, classified into coherent and in](#fig-feedforwardcombinations). Data taken from \protect[Mangan:2006].

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.4]{FFLAbundanceGraph}
  \caption{Relative abundance of different FFL types in yeast and {\em E. coli}. Labels on the x-axis refer to the particular FFL motifs seen in Figure \protect\ref{fig:FeedForwardCombinations}. Data taken from \protect\cite{Mangan:2006}.}
  \label{fig:FFLAbundanceGraph}
\end{center}
\end{figure}
```

### Menagerie of Motifs

The feedforward network described in the previous section is one of many different kinds of identified motifs. It would take an entire book to describe them all. Instead we will summarize them here, together with their basic dynamic properties. Figures [Figure: Motifs](#fig-listofmotifsa), [Figure: Motifs](#fig-listofmotifsb) and [Figure: Feedforward Network Motifs](#fig-listofmotifsc) show a variety of motifs. No doubt many more natural patterns remain to be discovered, in addition to new motifs that have and will be designed by the synthetic biology community [Friedland2009].

**Figure** <a id="fig-listofmotifsa"></a> `fig:ListOfMotifsA`

*Graphic (not in the LaTeX source, referenced by name): `ListOfMotifsA`*

*Caption:* Motifs.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale = 0.65]{ListOfMotifsA}
\caption{Motifs.}
\label{fig:ListOfMotifsA}
\end{figure}
```

**Figure** <a id="fig-listofmotifsb"></a> `fig:ListOfMotifsB`

*Graphic (not in the LaTeX source, referenced by name): `ListOfMotifsB`*

*Caption:* Motifs.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale = 0.7]{ListOfMotifsB}
\caption{Motifs.}
\label{fig:ListOfMotifsB}
\end{figure}
```

**Figure** <a id="fig-listofmotifsc"></a> `fig:ListOfMotifsC`

*Graphic (not in the LaTeX source, referenced by name): `ListOfMotifsC`*

*Caption:* Feedforward Network Motifs.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale = 0.7]{ListOfMotifsC}
\caption{Feedforward Network Motifs.}
\label{fig:ListOfMotifsC}
\end{figure}
```

## Further Reading

### General

- Bray D (2011) Wetware: A Computer in Every Living Cell. Yale University Press. ISBN: 978-0300167849

- Goodsell D S (2009) The Machinery of Life. Springer, 2nd edition. ISBN 978-0387849249

- Phillips R, Kondev J and Theriot J  (2010) Physical Biology of the Cell. Garland Science. ISBN 978-0-8153-4163-5

### Specific

- Alberts et al., (2002) General Principles of Cell Communication <http://www.ncbi.nlm.nih.gov/books/NBK26813/>

- Brown TA (2006) Genomes 3, Garland Science, 3rd edition. ISBN: 978-0815341383

- Gerhard M and Schomburg D (2012) Biochemical Pathways: An Atlas of Biochemistry and Molecular Biology, Wiley, 2nd edition. ISBN: 978-0470146842

- Hancock J (2010) Cell Signalling, Oxford University Press, 3rd edition. ISBN: 978-0199232109

- Hartl DL (2008) Genetics: Analysis Of Genes And Genomes. Jones & Bartlett Learning, 7th edition. ISBN: 978-0763772154

- Nelson DL and Cox MM (2008) Wetware: Lehninger Principles of Biochemistry. W. H. Freeman, 5th edition. ISBN: 978-0716771081

- Salway JG (2004) Metabolism at a Glance, Wiley-Blackwell, 3rd edition. ISBN:  978-1405107167

### Motifs

- Alon U, (2006) An Introduction to Systems Biology: Design Principles of Biological Circuits, Chapman & Hall/Crc Mathematical and Computational Biology Series.

- Sauro, HM and Kholodenko, BN, (2004), Quantitative analysis of signaling networks, Progress in Biophysics and Moleclular Biology, 86, 5--43.

- Tyson JJ, Chen, KC and Novak, B, Sniffers, buzzers, toggles and blinkers: dynamics of regulatory
	and signaling pathways in the cell, Current Opinion in Cell Biology, 2003, 15, 221--231.

- Yosef N and Regev A (2011), Impulse Control: Temporal Dynamics in Gene Expression. Cell 144, 886--896.

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- {\bf In the following exercises use the data given in the main text along with Tables~\ref{tbl:basicInformation},~\ref{tbl:GeneralMolNumber}, ~\ref{tbl:EcoliNumbersSmall}, and~\ref{tbl:EcoliNumbersLarge}.} -->

<!-- \begin{enumerate} -->

<!-- \item How many {\em E.\ coli} cells laid end to end would fit across the full stop at the end of this sentence? Assume the diameter of the full stop is 0.5 mm. -->

<!-- \item Estimate the volume of an {\em E.\ coli} cell. -->

<!-- \item Calculate the surface area of an {\em E.\ coli} cell. If a typical membrane protein is 5 nm in diameter, estimate the number of membrane proteins that can be laid out on the membrane if the center-center distance between each protein is 6 nm. -->

<!-- \item Show that a 1 nM concentration is roughly equivalent to 1 molecule in a volume of 1 {\em E.\ coli} cell. -->

<!-- \item Estimate the number of protein molecules a typical {\em E.\ coli} cell can make per second assuming the average protein is 360 amino acids long. Assume that the number of proteins in a cell is 3,000,000. How long would it take to make 3,000,000 proteins? % 2000 proteins per second, assume, 18000 ribosomes and 40 aa/sec -->

<!-- \item If it takes 1,500 ATP molecules to make an average protein, how long would it take before all the ATP is used up? Assume the ATP is not being replaced. % 2000 proteins per sec, 3000000 ATP per sec, Ans 1: -->

<!-- \item {\em E.\ coli} can be considered a cylindrical volume with length $2\ \mu m$ and diameter $1\ \mu m$. A reaction is known to occur in {\em E.\ coli} with an intensive rate of $0.5\ \mbox{mmol } s^{-1}\ l^{-1}$. -->

<!-- a) What is the rate of reaction per volume of {\em E.\ coli}? -->

<!-- b) If Avogadro's number is $6.022 \times 10^{23}$, express the rate in terms of molecules converted per second per {\em E.\ coli}. -->

<!-- \item What are the visual symbols often used to represent activation and repression in biochemical networks? -->

<!-- \item Draw a similar diagram to the glycolysis regulatory diagram (Figure~\ref{fig:GlycolysisRegulation}) but for the lysine, threonine and methionine biosynthesis pathway from {\em E.\ coli}. -->

<!-- \item Why is the size of an organism's genome a poor indicator of the organism's complexity? -->

<!-- \item Describe the basic approach used to find network motifs. -->

<!-- \item Looking at motif b) in Figure~\ref{fig:ListOfMotifsB}, try to explain how it might operate as a memory unit. -->

<!-- \item Study the network shown below and try to figure out its function. Use Figures~\ref{fig:ListOfMotifsA},~\ref{fig:ListOfMotifsB}, and~\ref{fig:ListOfMotifsC} as guides. -->

<!-- \begin{center} -->
<!-- \includegraphics[scale = 0.8]{ComplicatedMotif} -->
<!-- \end{center} -->

<!-- The AND block on the left of the network represents an AND gate, that is the output of the block is only active if {\em both} inputs are also active. -->
<!-- \end{enumerate} -->

<!-- \section*{Appendix} -->
<!-- \addcontentsline{toc}{section}{Jarnac Scripts} -->

<!-- See Appendix~\ref{app:Jarnac} and the web site at~\url{http://sbw-app.org/jarnac/} for more details of Jarnac. -->

<!-- \section*{Answers} -->

<!-- 1. Assume length of cell is 2$\mu m$: 250 -->

<!-- 2. Assume {\em E.\ coli} is a cylinder: volume = $1.57 \mu m^3$ or $1.57 \times 10^{-15}$ L -->

<!-- 3a. Assume {\em E.\ coli} is a cylinder: Area = 7.85 $\mu m^2$ -->

<!-- 3b. Approximately 218,000 proteins -->

<!-- 4. The volume of an {\em E.\ coli} cell is approximately $1.5 \times 10^{-15}$ L. 1 nM represents approximately $10^{-9} \times 1.5 \times 10^{-15}$ moles in a cell. Multiply by avogadro's number to get the number of molecules: $6 \times 10^{23} = 0.9$. This is roughly one molecule per {\em E.\ coli} cell. -->

<!-- 5. 25 minutes (1500 seconds) -->

<!-- 6. 0.67 seconds -->

<!-- 7a. $5 \times 10^{-16}$ mmoles per second per volume of {\em E.\ coli} -->

<!-- 7b. $3 \times 10^{5}$ per second per {\em E.\ coli} -->

<!-- 10. Many expressed proteins are covalently modified or form complexes. This is particularly the case for mammalian systems where covalent modifications is endemic amount proteins. This means that the number of states far exceeds the number of gene encoded on a genome. -->

---

## Index terms recorded in this chapter

- allosteric control
- alternative splicing
- anabolic
- ATP
- bait protein
- BIONUMBRS
- BRENDA
- Calvin cycle
- cAMP
- Carsonella ruddii
- catabolic
- Cdc2-Cdc13
- ChIP-chip
- ChIP-seq
- cofactors
- CyberCell
- EcoCyc
- Glycolysis
- Goodsell
- human
- KEGG
- lac repressor
- metabolism
- Mycoplasma genitalium
- NAD
- phosphofructokinase
- phosphorylation
- prey protein
- proteasome
- protein kinase
- radioisotopes
- RegulonDB
- response times
- Rum1
- STRING
- Whisk fern
- X-gal
- yeast
- Yeast two-hybrid

---

[[index|Wiki index]] · [[02_kinetics_in_a_nutshell|Kinetics in a Nutshell]] →
