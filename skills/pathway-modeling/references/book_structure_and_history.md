# Book Structure, Front Matter and Revision History

*Source: `Main.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
\RequirePackage{atbegshi} 
\UseRawInputEncoding
\documentclass[11pt,twosided]{book}

\pdfminorversion=6

\usepackage{etex}
\usepackage[backend=bibtex,giveninits=true,doi=false,isbn=false,url=false]{biblatex}
\DeclareNameAlias{author}{last-first}
\addbibresource{SauroBib.bib}

\usepackage{Ambrosius}
\usepackage[hang,flushmargin]{footmisc}
\usetikzlibrary{calc}
\usepackage{longtable}
\usepackage[nomessages]{fp}

\usepackage{ifsym}
\usepackage{mdframed}
\pgfplotsset{compat=1.18}

<!-- Book size changed to 7 by 10 -->
\geometry{paperwidth=7in,paperheight=10in,textheight=8in,top=1in,left=0.66in,right=0.66in,bindingoffset=5mm}

[options=-s myindex.ist]
\usepackage[pdftex,
            pdfauthor={Herbert M Sauro},
            pdftitle={Systems Biology: An Introduction to Pathway Modeling},
            pdfsubject={Systems and Synthetic Biology},
            pdfkeywords={Systems Synthetic Biology Control Theory},
            pdfproducer={LaTeX with hyperref},
            pdfcreator={pdflatex}]{hyperref}

\pdfinfo{
   /CreationDate (D:20070102000000)
   /ModDate (Dc:\pdfdate)
}

\tikzset{
  zigzag/.style={
    to path={
      coordinate (m) at ($(\tikztostart)!.5!(\tikztotarget)$)
      coordinate (m1) at ($(m)!1mm!110:(\tikztostart)$)
      coordinate (m2) at ($(m)!1mm!110:(\tikztotarget)$)
      plot[rounded corners=1mm] coordinates{ (\tikztostart) (m1) (m2) (\tikztotarget)}
    }
  },
}

<!-- -------------------------------------------- -->
<!-- Comment this out for the print version !!!!! -->
<!-- -------------------------------------------- -->
<!-- \hypersetup{backref, -->
<!-- colorlinks=true, -->
<!-- citecolor=blue, -->
<!-- linkcolor=brickRed, -->
<!-- pdfauthor={Copyright \textcopyright\ Herbert M Sauro}} -->

<!-- Use this for printing -->
\hypersetup{backref,
colorlinks=true,
citecolor=black,
linkcolor=black,
pdfauthor={Copyright \textcopyright Herbert M Sauro}}

<!-- -------------------------------------------- -->

\definecolor{sbmlblue}{rgb}{0.07,0.50,0.78}
\definecolor{sbmlgray}{gray}{0.7}
\definecolor{sbmlrowgray}{gray}{0.96}
\definecolor{extremelylightgray}{gray}{0.97}
\definecolor{veryverylightgray}{gray}{0.95}
\definecolor{verylightgray}{gray}{0.9}
\definecolor{lightgray}{gray}{0.8}
\definecolor{mediumgray}{gray}{0.5}
\definecolor{darkgray}{gray}{0.3}
\definecolor{almostblack}{gray}{0.23}
\definecolor{normaltextcolor}{gray}{0.23} 
\definecolor{lightyellow}{rgb}{0.98,0.94,0.7}
\definecolor{verylightyellow}{rgb}{0.97,0.95,0.85}
\definecolor{darkblue}{rgb}{0.1,0.4,0.55}
\definecolor{mediumgreen}{rgb}{0.1,0.6,0.3}

\newif\ifCompilmentary
\Compilmentaryfalse

\newcommand{\CompilmentaryMessage}{
\ifCompilmentary
  
  { This copy belongs to }
\fi}

\lstnewenvironment{code}[1][]
{
   
   \minipage{\linewidth}
   
   \lstset{basicstyle=,frame=single,#1}}
{\endminipage}

<!-- ----------------------------------------------------------------------------------------------- -->
\begin{document}

<!-- ------------------------------------------------------ -->
\newcommand{\bookVersion}{1.22}
<!-- ------------------------------------------------------ -->

\textbf{ \phantom{Ix}}  
** Systems Biology: Introduction to Pathway Modeling**

{ Herbert M. Sauro}  
{ University of Washington}  
{ Seattle, WA}

\CompilmentaryMessage

{ Ambrosius Publishing}

{ Copyright \copyright{2014-2021} Herbert M. Sauro. All rights reserved.  
First Edition, version \bookVersion   
Published by Ambrosius Publishing and Future Skill Software  
<www.analogmachine.org>

\vskip5pt

Typeset using \LaTeX 2$_\varepsilon$, TikZ, PGFPlots, WinEdt, InkScape, and  
11pt Math Time Professional 2 Fonts

pgf version is: \pgfversion

\vskip10pt

{ Limit of Liability/Disclaimer of Warranty: While the author has used his best efforts in preparing this book, he makes no representations or warranties with respect to the accuracy or completeness of the contents of this book and specifically disclaim any implied warranties of merchantability or fitness for a particular purpose.  The advice and strategies contained herein may not be suitable for your situation. Neither the author nor publisher shall be liable for any loss of profit or any other commercial damages, including but not limited to special, incidental, consequential, or other damages. No part of this book may be reproduced by any means without written permission of the author.} \vskip6pt
<!-- {\bfseries Library of Congress Cataloging-in-Publication Data:} -->

ISBN 13: 978-0-9824773-7-3 (paperback)   
ISBN-10: 0982477376 (paperback)   

Printed in the United States of America.  
}

Mosaic image modified from Daniel Steger's Tikz image (<http://www.texample.net/tikz/examples/mosaic-from-pompeii/>

Front-Cover: Cross-section through a single cell of Mycoplasma mycoides. Illustration by David S. Goodsell, the Scripps Research Institute, with permission. Norway.

{ University Disclaimer: Any views, opinions, data, documentation and other information presented in this book are solely those of the author and do not represent those of the University of Washington.}

<!-- \listoffigures -->

<!-- \pagebreak -->
<!-- {\bfseries Material left to do:} -->

<!-- 1. More exercises for Multicompartment chapter\\ -->
<!-- 2. Use of sensitivity analysis in determining what parameters to measure accurately.\\ -->
<!-- 3. When do we first introduced the Jacobian matrix?\\ -->
<!-- 4. End Chapter 9 with Platt, add exercises to Chap 8 and 9 -->

<!-- \medskip -->
<!-- {\bfseries Check list:} -->

<!-- 1. Check for all spelling errors\\ -->
<!-- 2. Check for doublets such as 'the the'\\ -->
<!-- 3. Justify having to put linearization in book - mentioned in other chapters\\ -->
<!-- 4. Check all model references\\ -->
<!-- 5. Check all further reading lists\\ -->
<!-- 7. Check model captions have Jarnac Script text\\ -->
<!-- 8. Check all figure references\\ -->

<!-- \medskip -->
<!-- {\bfseries Chapter Status:} -->

<!-- \begin{tabular}{ll} -->
<!-- Chapter 1: Final Draft\hspace{12pt} & $\heartsuit$ \\ -->
<!-- Chapter 2: Final Draft\hspace{12pt} & $\heartsuit$\\ -->
<!-- Chapter 3: Final Draft\hspace{12pt} & $\heartsuit$\\ -->
<!-- Chapter 4: Final Draft\hspace{12pt} & $\heartsuit$\\ -->
<!-- Chapter 5: Final Draft\hspace{12pt} & $\heartsuit$\\ -->
<!-- Chapter 6: Final Draft\hspace{12pt} & $\heartsuit$\\ -->
<!-- Chapter 7: Final Draft\hspace{12pt} & $\heartsuit$\\ -->
<!-- Chapter 8: Final Draft\hspace{12pt} & $\heartsuit$\\ -->
<!-- Chapter 9: Final Draft\hspace{12pt} & $\heartsuit$\\ -->
<!-- Chapter 10: Final Draft\hspace{12pt} & $\heartsuit$\\ -->
<!-- Chapter 11: Final Draft\hspace{12pt} & $\heartsuit$\\ -->
<!-- Chapter 12: Final Draft\hspace{12pt} & $\heartsuit$\\ -->
<!-- Chapter 13: Final Draft\hspace{12pt} & $\heartsuit$\\ -->
<!-- Appendices: Final Draft\hspace{12pt} & $\heartsuit$\\ -->
<!-- \end{tabular} -->

\include{preface}
\include{coverInfo}

\include{preChapter}
\include{prologue}

\include{chapter1}
\include{chapter2}
\include{chapter3}
\include{chapter4}
\include{chapter5}
\include{chapter6}
\include{chapter7}
\include{chapter8}
\include{chapter9}
\include{chapter10}
\include{chapter11}
\include{chapter12}
\include{chapter13}
\include{chapter14}
\include{chapter15}

\begin{appendices}
\include{AppendixA}
\include{AppendixB}
\include{AppendixC}
\include{AppendixD}

\include{AppendixE}
\include{AppendixF}
\include{AppendixG}
\include{AppendixH}
\include{AppendixI}
\end{appendices}

\CompilmentaryMessage

<!-- \bibliography{SauroBib} -->
<!-- \bibliographystyle{jbactNew} -->

\CompilmentaryMessage

# History <a id="chap-history"></a>

Note the dates are in American format: Year-Day-Month.

- VERSION: 1.00 (Gildas)

- **Date:** 2014-18-3
- **Author(s):** Herbert M. Sauro
- **Title:** Essentials of Biochemical Modeling
- **Modification(s):** First edition, first printing

- VERSION: 1.01 (Vortiporius)

- **Date:** 2014-1-5
- **Author(s):** Herbert M. Sauro
- **Title:** Essentials of Biochemical Modeling
- **Modification(s):** Minor corrections to most chapters, thanks to Joseph Hellerstein.

- VERSION: 1.02 (Caninus)

- **Date:** 2014-8-6
- **Author(s):** Herbert M. Sauro
- **Title:** Essentials of Biochemical Modeling
- **Modification(s):** Correction to figure in exercise 12 in chapter 3

- VERSION: 1.03 (Malgo)

- **Date:** 2014-20-8
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Republished under a new title and new ISBN number. All modeling scripts converted to Python

- VERSION: 1.04 (Cadfan)

- **Date:** 2014-1-8
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** LaTeX typo on page 75 fixed.

- VERSION: 1.05 (Cunedda)

- **Date:** 2014-23-12
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Minor clarification to linearization on page 90.

- VERSION: 1.06 (Owain)

- **Date:** 2015-24-1
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Fixed typo in Taylor series second order approximation of sine on page 339 and fixed equation typo for normalized propensity function on page 141.

- VERSION: 1.07 (Bede)

- **Date:** 2015-1-8
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Added index entries for fast reactions and fixed typo on page 123. Rewrote the introduction to the chapter on stoichiometry networks. Modified Tellurium scripts to match the latest version where the need to include `model' to reference variables and parameters has been relaxed.

- VERSION: 1.08 (Ceolfrith)

- **Date:** 2015-14-9
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Added more detailed algorithm for the simplex. Correct small error in the Differential evolution algorithm.

- VERSION: 1.09 (Sigfrith)

- **Date:** 2015-14-12
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Fixed code typo in the python script Steady state band detector

- VERSION: 1.1 (Eosterwine)

- **Date:** 2016-4-08
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Fixed typo on page 214, Chap 10: 95.5% should be 97.5%. Page 210, `contingence' should be `confidence'.
   Chap 9: Rewritten section on Levenberg-Marquardt method to fix some errors and added new section on Gauss-Newton.
Minor formatting issues fixed.

- VERSION: 1.11 (Benedict Biscop)

- **Date:** 2016-1-11
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Updated script that generates the phase diagram Figure 12.3

- VERSION: 1.12 (Offa)

- **Date:** 2017-17-8
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** The Tellurium scripts 5.1 and 5.2 were wrongly transcribed. A few remaining references to Jarnac removed and substituted with Tellurium. Bad figure references in Chapter 6 fixed and Gillespie scripts updated.

- VERSION: 1.13 (Egfrid)

- **Date:** 2018-21-7
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Chapter 1 to 9 have been reedited, a few minor typographical corrections and improvements to some explanations.

- VERSION: 1.14 (Eanbert)

- **Date:** 2018-17-8
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Went through every Tellurium example to make sure the code worked. Only a couple of instances where they didn't due to changes in the Tellurium syntax. This version corrects those errors. Refreshed all the phase plots with newly generated simulations and included the Python scripts used to generate these. Edited the Appendices and made some corrections. Added Python example of how to plot Q-Q plots in Chapter 10 on parameter estimation. Reformatted the bibliography.

- VERSION: 1.15 (Eardulf)

- **Date:** 2018-20-9
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Fixed some typos and made some of the notation more consistent throughout the book. Revised chapter 9 on optimization methods: 1) Fixed some minor errors in he Levenberg-Marquardt method; 2) Added a new figure describing differential evolution and 3) include an example of fitting a SBML model to data using scipy. Fixed some minor typos in chapter 2, incorrect minus sign from reaction rates equation and extra plus sign in reaction scheme.

- VERSION: 1.16 (Cutheard)

- **Date:** 2019-20-3
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Rewrote the exercises in Chapter 12 and added answers to the appendix.

- VERSION: 1.2 (Tilred)

- **Date:** 2019-12-11
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Read through the entire book correcting and updating the text. Rewrote the last sections of Chapter 10 on parameter estimation, introduced new methods and better examples for parameter identifiability and confidence estimation. Added a new chapter on Bayesian Inference and clarified some aspects in Chapter 1.

- VERSION: 1.21 (Wilred)

- **Date:** 2021-4-9
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** Minor typographical corrections to chapter 10, 11, 12. Figure 13.19 had the arrows the wrong way round, now fixed. I have removed all the exercises and moved them to my GitHub repository. In the process I added more exercises and now provide solutions to almost every question. Find them at <https://github.com/hsauro/PathwayModelingBook>

- VERSION: 1.22 (Uchtred)

- **Date:** 2023-7-11
- **Author(s):** Herbert M. Sauro
- **Title:** Systems Biology: An Introduction to Pathway Modeling
- **Modification(s):** One of my students, Nicolas Longhi, found a significant mistake in the Newton-Raphson example in section 12.3. The model was incorrect. Now fixed.

\CompilmentaryMessage

<!-- Make pages divisible by 4 -->

\end{document}

---

← [[front_matter_cover_image|Cover Image]] · [[index|Wiki index]]
