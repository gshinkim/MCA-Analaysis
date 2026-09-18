# Useful Numbers

*Source: `appendixB.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Useful Numbers <a id="app-usefulnumbers"></a>

\definecolor{myBrown}{RGB}{230,223,199}
\definecolor{myGray}{RGB}{239,235,218}
\definecolor{redText}{RGB}{151,62,47}
\definecolor{myWhite}{RGB}{255,254,244}

## Useful Numbers

Numerical data are essential when building models. Sadly such data are scarce, or at least the right kind of data are scarce. In section [[04_introduction_to_modeling|Where to get Data for Building Models]] we briefly reviewed some of the potential sources of data for model building [phillips2009feeling]. Here we list some basic numbers that a modeler might find useful when building a model. There has been a slow realization that reporting quantitative data is important in systems biology (*nil admirari*). It is therefore worth pointing out a number of efforts to collect and categorize potentially useful data. Two efforts stand out, the cybercell effort(footnote: <http://ccdb.wishartlab.com/CCDB/>} started by David Wishart [sundararaj2004cybercell], and the more active and larger effort called bionumbers [milo2010bionumbers] started in 2007 by Ron Milo, Paul Jorgensen and Mike Springer. Other useful sources include the excellent text book `Physical Biology of the Cell' [phillipsBook2010], Bernhard Palsson's book `Systems Biology: Simulation of Dynamic Network States' [palssonBook2011], and of course the book that probably inspired the numbers trend, Uri Alon's `An Introduction to Systems Biology: Design Principles of Biological Circuits' [AlonBook]. The following tables list data gleaned from bionumbers(footnote:  <www.bioNumbers.org>}, cybercell and the Phillips book [phillipsBook2010]. Some of the yeast data came from an interesting review by Warner [warner1999economics]. Any mention of data for modeling would be amiss if we didn't mention Robert Alberty's book `Thermodynamics of Biochemical Reactions' [alberty2005thermodynamics]. This book is a rich source of information on many aspects related to thermodynamics.

<!-- Assumes dimensions are in cm -->
\def \hmsx {8.2}
\def \hmsy {8.2}
\def \hmsgw {0.3}
\def \hmsgh {0.3}
\def \hmsMiniPageH {17.2}

```latex
\begin{tikzpicture}

\draw [myBrown,line width=0.3cm] (0,0) rectangle (\hmsx,\hmsy+10);
\FPeval\hmsInnerw{\hmsgw+(\hmsx-2*\hmsgw)}
\FPeval\hmsInnerh{\hmsgh+(\hmsy-2*\hmsgh)}
\draw [myWhite,line width=0.3cm] (\hmsgw,\hmsgh) rectangle (\hmsInnerw,\hmsInnerh);

% Three half line width2, the coord of a line with with respect to the center.
% for line thickness. Draw a diagram to understand the logic
\FPeval\hmsInnerInnerX{3*(\hmsgw*0.5)}
\FPeval\hmsInnerInnerW{\hmsx-(6*(\hmsgw*0.5))-0.2}
\FPeval\hmsInnerEdge{\hmsInnerInnerW+3*(\hmsgw*0.5)}

\node[fill={myGray},anchor=north west,text width=\hmsInnerInnerW cm,minimum height=\hmsMiniPageH cm,align=left] at (\hmsInnerInnerX,17.8cm){%
    \begin{minipage}[t][\hmsMiniPageH cm]{\textwidth}
   {\small
   {\bfseries Cell Sizes:}\\
   1. Bacteria ({\em E.\ coli}) Diameter: {\color{blue} 0.7-1.4$\mu m$}\\
   \hspace*{0.5cm} Length: {\color{blue} 2-4 $\mu m$}; Volume: {\color{blue} 0.5-5 $\mu m^3$}\\
   2. Yeast ({\em S. cerevisiae}): \\
   \hspace*{0.5cm} Diameter: {\color{blue} 3-6 $\mu m$} \\
   \hspace*{0.5cm} Volume: {\color{blue} 20-160 $\mu m^3$}\\
   3. Mammalian HeLa Cell: \\
   \hspace*{0.5cm} Diameter: {\color{blue} 15-30 $\mu m$}\\
   \hspace*{0.5cm} Volume: {\color{blue} 500-5000 $\mu m^3$}\\

   {\bfseries Length Scales:}\\
   4. Nucleus volume: {\color{blue} 10\%} of cell volume \\
   5. Cell membrane thickness: {\color{blue} 4-10 nm} \\
   6. Average protein diameter: {\color{blue} 3-6 nm} \\
   7. DNA diameter: {\color{blue} 2 nm} \\
   8. Water molecule diameter: {\color{blue} 0.3 nm} \\

   {\bfseries Concentration Equivalents in {\em E.\ coli}:}\\
   9. Concentration of 1 nM in: \\
   \hspace*{0.5cm} {\em E.\ coli}: {\color{blue} 1 molecule/cell} \\
   \hspace*{0.5cm} HeLa: {\color{blue} 1000 moleculs/cell} \\
   10. Concentration in {\em E.\ coli} of\\
   \hspace*{0.5cm} ATP: {\color{blue} 2 mM} \\
   \hspace*{0.5cm} Pyruvate: {\color{blue} 0.37 mM} \\
   \hspace*{0.5cm} LacI: {\color{blue} 1-50 nM}\\
   \hspace*{0.5cm} Pyruvate Kinase: {\color{blue} 11 $\mu$M} \\
   11. Number of receptor proteins: {\color{blue} 1,000,000}\\
   12. Number of soluble proteins: {\color{blue} 2-4 million}\\
   13. Number of ribosomes: {\color{blue} 18,000}\\\

   {\bfseries Diffusion Rates:}\\
   14. Diffusion coefficient for average protein:\\
   \hspace*{0.5cm} D = {\color{blue} 5-15\ $\mu$m$^2$ s$^{-1}$} which equals\\
   \hspace*{0.5cm} {\color{blue} 10  millisec} to traverse {\em E.\ coli}\\
   \hspace*{0.5cm} {\color{blue} 10  secs} to traverse HeLa cell\\
   15. Yeast ({\em S. cerevisiae}): \\
   \hspace*{0.5cm} Diameter: {\color{blue} 3-6 $\mu m$} \\
   \hspace*{0.5cm} Volume: {\color{blue} 20-160 $\mu m^3$}\\
   16. Mammalian HeLa Cell: \\
   \hspace*{0.5cm} Diameter: {\color{blue} 15-30 $\mu m$}\\
   \hspace*{0.5cm} Volume: {\color{blue} 500-5,000 $\mu m^3$}\\

   }
   \end{minipage}%
};
\end{tikzpicture}
```

\def \hmsx {8.8}
\def \hmsy {11.2}
\def \hmsgw {0.3}
\def \hmsgh {0.3}
\def \hmsMiniPageH {13.6}

\phantom{AAA}

```latex
\begin{tikzpicture}

\draw [myBrown,line width=0.3cm] (0,0) rectangle (\hmsx,14.6);
\FPeval\hmsInnerw{\hmsgw+(\hmsx-2*\hmsgw)}
\FPeval\hmsInnerh{\hmsgh+(\hmsy-2*\hmsgh)}
\draw [myWhite,line width=0.3cm] (\hmsgw,\hmsgh) rectangle (\hmsInnerw,\hmsInnerh);

% Three half line width2, the coord of a line with with respect to the center.
% for line thickness. Draw a diagram to understand the logic
\FPeval\hmsInnerInnerX{3*(\hmsgw*0.5)}
\FPeval\hmsInnerInnerW{\hmsx-(6*(\hmsgw*0.5))-0.2}
\FPeval\hmsInnerEdge{\hmsInnerInnerW+3*(\hmsgw*0.5)}

\node[fill={myGray},anchor=north west,text width=\hmsInnerInnerW cm,minimum height=\hmsMiniPageH cm,align=left] at (\hmsInnerInnerX,14.2cm){%
    \begin{minipage}[t][\hmsMiniPageH cm]{\textwidth}
   {\small
   {\bfseries Reaction Rates for {\em E.\ coli}:}\\
   17. Cell Division Time: {\color{blue} 30-60 mins} \\
   18. Rate of replication: {\color{blue} 2,000 bp/s} \\
   19. Protein synthesis: {\color{blue} 1,000 proteins/s} \\
   20. Lipid synthesis: {\color{blue} 20,000 lipids/s}\\
   21. Ribosome rate: {\color{blue} 25 amino acids per sec}\\
   22. Transcription rate: {\color{blue} 45 mins}\\
   23. ATPs to make a cell: {\color{blue} 55 billion} \\
   24. Reaction rate Pyruvate kinase:\\
   \hspace*{14pt} {\color{blue} 500,000 molecules per second}\\

   {\bfseries Reaction Rates for Yeast:}\\
   25. Ribosomes made per second: {\color{blue} 2,000}\\
   26. Ribosomes in Yeast: {\color{blue} 200,000} \\

   {\bfseries Energetics:}\\
   27. $\Delta G$ that represents an order of magnitude \\
   ratio between products and reactants: {\color{blue} 6 kJ/mol} \\
   28. Membrane potential: {\color{blue} 70-200 mV} \\

   {\bfseries Fundamental Constants:}\\
   29. Avogadro's Number: {\color{blue} $6.022 141 29 \times 10^{23}$ mol$^{-1}$} \\
   30. Gas Constant: {\color{blue} $8.314 472$ J mol$^-1$ K$^-1$} \\
   31. Faraday Constant: {\color{blue} $96 485.3383$ C mol$^-1 $}\\
   }
   \end{minipage}%
};
\end{tikzpicture}
```

<!-- \pagebreak -->

<!-- \phantom{AAA} -->

<!-- \begin{center} -->
<!-- \begin{tikzpicture} -->

<!-- \draw [myBrown,line width=3mm] (0,0) rectangle (9.6,7.2); -->
<!-- \draw [myWhite,line width=3mm] (0.3cm,0.3cm) rectangle (9.3,7); -->
<!-- \node[fill={myGray},anchor=north west,text width=8.6cm,minimum height=6cm,align=left] at (0.4cm,6.8cm){% -->
<!-- \begin{minipage}[t][6cm]{1\textwidth} -->
<!-- {\small -->

<!-- } -->
<!-- \end{minipage}% -->
<!-- }; -->
<!-- \end{tikzpicture} -->
<!-- \end{center} -->

---

## Index terms recorded in this chapter

- Alon
- bionumbers
- cybercell
- Milo
- numbers
- Phillips
- Warner

---

← [[appendix_a_list_of_symbols|List of Symbols and Abbreviations]] · [[index|Wiki index]] · [[appendix_c_answers_to_questions|Answers to Questions]] →
