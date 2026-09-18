# Behavior of Stochastic Models

*Source: `chapter15.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Behavior of Stochastic Models <a id="chap-behaviorstochastic"></a>

## Introduction

Chapter [[06_stochastic_models|Stochastic Models]] described some basic concepts in stochastic kinetics, in particular how to simulate stochastic models. What was not discussed is the kind of behavior that can emerge from a stochastic system. At first glance it may seem that a stochastic model would just be a noisy version of the equivalent deterministic model. In some cases this is true. Take for example a simple equilibration model such as:

$$ A \rightleftharpoons B $$

where the forward rate is given by $k_1 A$, and the reverse rate by $k_2 $B. Given starting concentrations for $A$ and $B$, we can easily determine by simulation the time trajectories for $A$ and $B$. We can compute the trajectories for both the stochastic and equivalent deterministic model. The two stochastic rate constants $k_1$ and $k_2$ are numerically equal to the deterministic equivalents because both reactions are first-order. Figure [Figure: Comparison of deterministic and stochastic simulation for an isomeriza](#fig-stochasticmultiplestarts) shows plots generated from the model (Listing `jarnac:chap:Equilibration`) and compares four simulations that were carried out using different initial conditions. The first plot at the top left corner starts with 6000 molecules. Under these conditions, the stochastic and deterministic simulations seem almost indistinguishable. At 600 molecules we begin to see a difference, and by 20 molecules, the stochastic trajectories are very noisy. However even at 20 molecules the stochastic data still appears to roughly follow the deterministic trajectories. In fact the mean stochastic levels at equilibrium are identical to the deterministic concentrations. In this case the stochastic simulation is the same as the deterministic model except noisy.

**Figure** <a id="fig-stochasticmultiplestarts"></a> `fig:StochasticMultipleStarts`

*Graphic (not in the LaTeX source, referenced by name): `StochasticMultipleStarts.pdf`*

*Caption:* Comparison of deterministic and stochastic simulation for an isomerization reaction using different initial conditions. Generated using Tellurium script `jarnac:chap:Equilibration`.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 0.28]{StochasticMultipleStarts.pdf}
  \caption{Comparison of deterministic and stochastic simulation for an isomerization reaction using different initial conditions. Generated using Tellurium script~\ref{jarnac:chap:Equilibration}.} \label{fig:StochasticMultipleStarts}
\end{figure}
```

In general this will not always be the case. If stochastic simulations simply represented noisy versions of the equivalent deterministic simulations, then stochastic models would probably be of little interest. However it turns out there are a number of common situations where a stochastic model can yield very different behavior compared to the equivalent deterministic model. In this book we will look at three interesting situations where stochasticity makes a significant difference:

- Bursting and extinction events
- Stochastic focusing
- Chatter

## Stochastic Bursting

It is hard to imagine that a single reaction event could make any real difference to the future evolution of a larger system, but in some special cases this holds true. Bursting is where a system at one point is relatively quiescent, then suddenly shows marked activity until it returns to the quiescent state again. The time interval between quiescent and active states is generally irregular. A clear example of bursting occurs during transcription [golding2005, cai2006].

### Transcriptional Bursting

When the number of transcription factors (or RNA polymerase) is very small, the binding and unbinding to the operator and promoter sites leads to random transcription events such that transcription acts in an on/off manner with **bursts** of mRNA production followed by periods of silence. This is called the random telegraph model [Larson:2009]. We can construct a bursting model as follows.

The model has three parts, the first is the binding of unbound transcription factor to an operator site, the second computes the level of gene expression as a function of bound transcription factor. Finally, the third part involves the degradation of the expressed protein. A schematic of the network is shown in Figure [Figure: Simple bursting model](#fig-burstingmodel). Listing `jarnac:burstingmodel` in the Appendix is the Tellurium script that generated the data in Figure [Figure: Bursting from a simple gene expression model](#fig-burstingmodelsimulation). The simulation uses the Gillespie method to generate the results. The lower curve shows the on/off behavior of the transcription factor. Given that there is only one expression cassette, there is only one bound complex at any one time, hence the bound state varies between zero and one. When the transcription factor is bound, there is a burst of protein synthesis. When the bound transcription factor is released, the protein level decays as a result of  protein degradation. We see therefore, a rapid rise in protein followed by a slow decay. For comparison, the same model is also simulated using a deterministic simulation as shown in Figure [Figure: Simple gene expression model based on a deterministic description](#fig-burstingmodeldeterministic). The deterministic and stochastic simulations are obviously very different.

**Figure** <a id="fig-burstingmodel"></a> `fig:BurstingModel`

*Graphic (not in the LaTeX source, referenced by name): `BurstingModel.pdf`*

*Caption:* Simple bursting model.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 0.7]{BurstingModel.pdf}
  \caption{Simple bursting model.} \label{fig:BurstingModel}
\end{figure}
```

**Figure** <a id="fig-burstingmodelsimulation"></a> `fig:BurstingModelSimulation`

*Graphic (not in the LaTeX source, referenced by name): `tikz/BurstingModel`*

*Caption:* Bursting from a simple gene expression model. Note that the level of protein has been reduced ten fold in order to make a clearer comparison. Upper curve represents protein. Generated from Listing `jarnac:burstingmodel`.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 1]{tikz/BurstingModel}
  \caption{Bursting from a simple gene expression model. Note that the level of protein has been reduced ten fold in order to make a clearer comparison. Upper curve represents protein. Generated from Listing~\ref{jarnac:burstingmodel}.} \label{fig:BurstingModelSimulation}
\end{figure}
```

**Figure** <a id="fig-burstingmodeldeterministic"></a> `fig:BurstingModelDeterministic`

*Caption:* Simple gene expression model based on a deterministic description. Note that the deterministic behavior is completely different from the stochastic bursting seen in Figure [Figure: Bursting from a simple gene expression model](#fig-burstingmodelsimulation). Upper curve represents protein.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}
\begin{axis}[
legend pos=north west,
xmin=0,
xmax=2000,
xtick={0,500,1000,1500,2000},
ymin=0,
ymax=2,
width=10cm,
height=6cm,
xlabel=Time,
ylabel near ticks]
\addplot[color=blue,style=dashed,line width=1.5pt,mark=none] coordinates {
(0.00, 0.00) (20.20, 0.02) (40.40, 0.02) (60.61, 0.03) (80.81, 0.03) (101.01, 0.03) (121.21, 0.04) (141.41, 0.04)
(161.62, 0.04) (181.82, 0.04) (202.02, 0.04) (222.22, 0.04) (242.42, 0.04) (262.63, 0.04) (282.83, 0.04) (303.03, 0.04)
(323.23, 0.04) (343.43, 0.04) (363.64, 0.04) (383.84, 0.04) (404.04, 0.04) (424.24, 0.04) (444.44, 0.04) (464.65, 0.04)
(484.85, 0.04) (505.05, 0.04) (525.25, 0.04) (545.45, 0.04) (565.66, 0.04) (585.86, 0.04) (606.06, 0.04) (626.26, 0.04)
(646.46, 0.04) (666.67, 0.04) (686.87, 0.04) (707.07, 0.04) (727.27, 0.04) (747.47, 0.04) (767.68, 0.04) (787.88, 0.04)
(808.08, 0.04) (828.28, 0.04) (848.48, 0.04) (868.69, 0.04) (888.89, 0.04) (909.09, 0.04) (929.29, 0.04) (949.49, 0.04)
(969.70, 0.04) (989.90, 0.04) (1010.10, 0.04) (1030.30, 0.04) (1050.51, 0.04) (1070.71, 0.04) (1090.91, 0.04) (1111.11, 0.04)
(1131.31, 0.04) (1151.52, 0.04) (1171.72, 0.04) (1191.92, 0.04) (1212.12, 0.04) (1232.32, 0.04) (1252.53, 0.04) (1272.73, 0.04)
(1292.93, 0.04) (1313.13, 0.04) (1333.33, 0.04) (1353.54, 0.04) (1373.74, 0.04) (1393.94, 0.04) (1414.14, 0.04) (1434.34, 0.04)
(1454.55, 0.04) (1474.75, 0.04) (1494.95, 0.04) (1515.15, 0.04) (1535.35, 0.04) (1555.56, 0.04) (1575.76, 0.04) (1595.96, 0.04)
(1616.16, 0.04) (1636.36, 0.04) (1656.57, 0.04) (1676.77, 0.04) (1696.97, 0.04) (1717.17, 0.04) (1737.37, 0.04) (1757.58, 0.04)
(1777.78, 0.04) (1797.98, 0.04) (1818.18, 0.04) (1838.38, 0.04) (1858.59, 0.04) (1878.79, 0.04) (1898.99, 0.04) (1919.19, 0.04)
(1939.39, 0.04) (1959.60, 0.04) (1979.80, 0.04) (2000.00, 0.04)};
\addlegendentry{\hspace{10pt}Bound Transcription Factor}

\addplot[color=red,line width=1.5pt,mark=none] coordinates {
(0.00, 0.00) (20.20, 0.13) (40.40, 0.34) (60.61, 0.53) (80.81, 0.67) (101.01, 0.77) (121.21, 0.84) (141.41, 0.88)
(161.62, 0.91) (181.82, 0.92) (202.02, 0.93) (222.22, 0.94) (242.42, 0.95) (262.63, 0.95) (282.83, 0.95) (303.03, 0.95)
(323.23, 0.95) (343.43, 0.95) (363.64, 0.95) (383.84, 0.95) (404.04, 0.95) (424.24, 0.95) (444.44, 0.95) (464.65, 0.95)
(484.85, 0.95) (505.05, 0.95) (525.25, 0.95) (545.45, 0.95) (565.66, 0.95) (585.86, 0.95) (606.06, 0.95) (626.26, 0.95)
(646.46, 0.95) (666.67, 0.95) (686.87, 0.95) (707.07, 0.95) (727.27, 0.95) (747.47, 0.95) (767.68, 0.95) (787.88, 0.95)
(808.08, 0.95) (828.28, 0.95) (848.48, 0.95) (868.69, 0.95) (888.89, 0.95) (909.09, 0.95) (929.29, 0.95) (949.49, 0.95)
(969.70, 0.95) (989.90, 0.95) (1010.10, 0.95) (1030.30, 0.95) (1050.51, 0.95) (1070.71, 0.95) (1090.91, 0.95) (1111.11, 0.95)
(1131.31, 0.95) (1151.52, 0.95) (1171.72, 0.95) (1191.92, 0.95) (1212.12, 0.95) (1232.32, 0.95) (1252.53, 0.95) (1272.73, 0.95)
(1292.93, 0.95) (1313.13, 0.95) (1333.33, 0.95) (1353.54, 0.95) (1373.74, 0.95) (1393.94, 0.95) (1414.14, 0.95) (1434.34, 0.95)
(1454.55, 0.95) (1474.75, 0.95) (1494.95, 0.95) (1515.15, 0.95) (1535.35, 0.95) (1555.56, 0.95) (1575.76, 0.95) (1595.96, 0.95)
(1616.16, 0.95) (1636.36, 0.95) (1656.57, 0.95) (1676.77, 0.95) (1696.97, 0.95) (1717.17, 0.95) (1737.37, 0.95) (1757.58, 0.95)
(1777.78, 0.95) (1797.98, 0.95) (1818.18, 0.95) (1838.38, 0.95) (1858.59, 0.95) (1878.79, 0.95) (1898.99, 0.95) (1919.19, 0.95)
(1939.39, 0.95) (1959.60, 0.95) (1979.80, 0.95) (2000.00, 0.95)};
\addlegendentry{Protein Concentration/10}
\end{axis}
\end{tikzpicture}
\end{center}
\caption{Simple gene expression model based on a deterministic description. Note that the deterministic behavior is completely different from the stochastic bursting seen in Figure~\ref{fig:BurstingModelSimulation}. Upper curve represents protein.} \label{fig:BurstingModelDeterministic}
\end{figure}
```

### Ion Channel Bursting

Ion channels are common membrane bound proteins found in many cells, particularly nerve tissue. There are a great variety of ion channels, but what they have in common is the ability to transport ions across membranes. Many channels act as gates, opening and closing in response to specific stimuli. Some channels open or close depending on the local potential difference across the membrane, while others open and close depending on whether a specific ligand is bound or not. Examples of ligands that can bind to ion channels include acetylcholine, glutamate, or ATP.

Ion channels tend to be specific about what ions they transport, for example there are sodium, potassium, calcium, and proton channels to name a few. Many of the voltage control ion channels are involved in nerve conduction and have been studied for many years. In the following section we will look at a very simple model of a ligand gated channel.

Consider a channel, $C$, that exists in two states, closed and open with an equilibrium distribution between the two. Furthermore, consider a ligand, $L$, that can bind to the open channel forming a blocked channel (Figure [Figure: Simple model of a ligand gated channel](#fig-ionchannelmodel)). We can represent the model using the following reactions:

$$
\begin{align*}
C_{\text{open}} &\rightleftharpoons C_{\text{closed}} \\[6pt]
L + C_{\text{open}} &\rightleftharpoons C_{\text{Ligand Blocked}}
\end{align*}
$$

Listing `jarnac:chap:IonChannel` in the Appendix shows the Tellurium code to run the model. We assume that the ligand concentration is much higher than the concentration of ion channels such that when ligand binds, the concentration of ligand hardly changes. As a result, we can fix the level of ligand. Each time an ion channel opens, a flood of ions move across the membrane resulting in a burst of electrical activity. The ligand concentration controls the duration between openings. The kinetics in the model has been arranged so that the transition between closed and open is slow compared to the transition between open and blocked (bound to ligand). At low ligand concentration the behavior of the system is dominated by the slow transitions between the open and closed states leading to fewer bursts but longer lasting ones. As the ligand concentration is increased, the equilibrium shifts away from the slow open/closed transitions to the much faster open/blocked states. This means the bursts become much shorter and more frequent in duration. This in turns means that the bursts in ion current tend to average out more so the bursting is less noticeable.

**Figure** <a id="fig-ionchannelmodel"></a> `fig:IonChannelModel`

*Graphic (not in the LaTeX source, referenced by name): `IonChannelModel`*

*Caption:* Simple model of a ligand gated channel.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 0.6]{IonChannelModel}
  \caption{Simple model of a ligand gated channel.} \label{fig:IonChannelModel}
\end{figure}
```

**Figure** <a id="fig-ionchannelbursts"></a> `fig:IonChannelBursts`

*Caption:* Bursting in an ion channel model. Each signal represents an open channel and the width of the signal indicates how long the channel remains open. Once a channel is open, ions pour across the membrane resulting in a burst of current. Tellurium script: `jarnac:chap:IonChannel`.

```latex
\begin{figure}
\begin{center}
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Open Gate},
xmin=0, xmax=0.1, ymin=0, ymax=2,
width=10cm,
height=6cm]
\addplot[const plot,color=red,line width=1.25pt] coordinates {
(0, 1) (0.003510642, 0) (0.01842591, 1) (0.02202, 0) (0.028517, 1) (0.030485, 0) (0.033216, 1) (0.03708669, 0)
(0.05002603, 1) (0.05713032, 0) (0.069, 1) (0.070, 0) (0.071457, 1) (0.074658, 0) (0.0766402, 1) (0.081, 0)
(0.09116821, 1) (0.0915039, 0) (0.09241892, 1) (0.09458652, 0) (0.095376, 1) (0.098084, 0) };
\end{axis}
\end{tikzpicture}
\end{center}
\caption{Bursting in an ion channel model. Each signal represents an open channel and the width of the signal indicates how long the channel remains open. Once a channel is open, ions pour across the membrane resulting in a burst of current. Tellurium script:~\ref{jarnac:chap:IonChannel}.}
\label{fig:IonChannelBursts}
\end{figure}
```

## Stochastic Focusing

There are important and common situations where a stochastic model can yield completely different results from the equivalent deterministic model. Consider the enzymatic model shown in Figure [Figure: Two step model where the first step is inhibited by a signal $S_0$](#fig-stochasticfocusingpathway).

**Figure** <a id="fig-stochasticfocusingpathway"></a> `fig:StochasticFocusingPathway`

*Graphic (not in the LaTeX source, referenced by name): `StochasticFocusingPathway`*

*Caption:* Two step model where the first step is inhibited by a signal $S_0$.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 0.55]{StochasticFocusingPathway}
  \caption{Two step model where the first step is inhibited by a signal $S_0$.} \label{fig:StochasticFocusingPathway}
\end{figure}
```

In this model the first step is competitively inhibited by a signal molecule called $S_0$. The rate law for the first step is therefore given by:

$$ v_1 = \frac{V_m}{K_m + S_o} $$

Assume the substrate for the first reaction is fixed and the second step governed by a simple first-order reaction. We can run a simulation of this model either as a deterministic or as a stochastic model. If we assign values shown in the Tellurium Listing `jarnac:chap:StochasticFocusing` in the Appendix, we can compute the deterministic steady state for the intermediate, $S_1$, to be 141.5 concentration units. In order to simulate the same model stochastically, we need to consider possible adjustments to the values for the constants. For example, the first-order constant $k_3$ remains unchanged. What about the competitive inhibition rate law, in particular the $K_m$ and $V_m$ parameters? Since we know the model is a competitive one, we can unwrap the rate law into individual elementary steps, however this may obscure the origins of the unusual behavior we observe in the stochastic model. In addition, although research is still ongoing in this important area, recent evidence suggests that the classic methods, such as Gillespie SSA can be applied to non-elementary systems without significant loss of accuracy [RaoArkin2003, Cao2005, MacNamara2008, sanft2011legitimacy]. We therefore assume that the competitive rate law can be legitimately used in the stochastic models and that the $K_m$ and $V_m$ constants will have the same values compared to the deterministic model.

With the model in place, we must now consider the level of signal, $S_o$. Specifically, we will assume the signal has a stochastic profile with a mean and variance in concentration. We can generate such a profile for $S_o$ by adding two new reactions, one that makes $S_o$, and another that degrades it. A simple equilibration model will do, that is:

$$ X_o \rightleftharpoons S_o $$

By adding these two steps to the model, we ensure $S_o$ is noisy. Because the noise enters the system externally, it is called **extrinsic noise**. We now wish to compute the steady state concentration of $S_1$. We know that $S_1$ will show a noisy profile due to contributions from the extrinsic noise, $S_o$, and noise generated by the model itself, called **intrinsic noise**. To compute the steady state level we must run the simulation for a long time (ignoring any initial transient) and compute the mean concentration by averaging over the $S_1$ trajectory. It is important that we use as much data as possible for this to obtain a reasonable estimate. From the simulation we estimate the mean concentration of $S_1$ in the stochastic model to be approximately 245.0 concentration units (Figure [Figure: Stochastic Focusing](#fig-stochasticfocusing)). This is significantly larger than the deterministic steady state value of 141.5 concentration units. This demonstrates that the deterministic and stochastic models are not identical. The stochastic model predicts a different mean steady state concentration. The question is, why?

**Figure** <a id="fig-stochasticfocusing"></a> `fig:StochasticFocusing`

*Graphic (not in the LaTeX source, referenced by name): `tikz/StochasticFocusing`*

*Caption:* Stochastic Focusing. Lower line represents the deterministic simulation and the upper line the equivalent stochastic model. In this case the stochastic solution does not follow the deterministic model. Generated from Tellurium script: `jarnac:chap:StochasticFocusing`.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 1]{tikz/StochasticFocusing}
  \caption{Stochastic Focusing. Lower line represents the deterministic simulation and the upper line the equivalent stochastic model. In this case the stochastic solution does not follow the deterministic model. Generated from Tellurium script:~\ref{jarnac:chap:StochasticFocusing}.}
  \label{fig:StochasticFocusing}
\end{figure}
```

To explain why the concentration levels are different, we must understand what happens to noise as it propagates through a network. Imagine a simple first-order step, shown in Figure [Figure: Propagation of stochastic noise through a first-order reaction](#fig-explainstochasticfocusinglinear). Also imagine that the concentration of substrate, $S$, has a mean and distribution of values as indicated by a bell shaped curve. This distribution is an input to the reaction and we can imagine that a distribution of reaction rates will inevitably occur. Because the rate law is linear however, the shape of the distribution of reaction rates will actually remain unchanged. If we measure the mean reaction rate, we find that it corresponds to the expected reaction rate for a deterministic model system. Noise is unaffected by the first-order reaction.

**Figure** <a id="fig-explainstochasticfocusinglinear"></a> `fig:explainStochasticFocusingLinear`

*Graphic (not in the LaTeX source, referenced by name): `explainStochasticFocusingLinear`*

*Caption:* Propagation of stochastic noise through a first-order reaction.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 1]{explainStochasticFocusingLinear}
  \caption{Propagation of stochastic noise through a first-order reaction.} \label{fig:explainStochasticFocusingLinear}
\end{figure}
```

Now consider a different case where the reaction rate is modeled by a competitive inhibitor. In this case the response is no longer linear and the rate curve has significant curvature. Let us again apply an input concentration with a given mean and distribution of values (See Figure [Figure: Stochastic focusing due to a non-linear rate law](#fig-explainstochasticfocusing)) to observe what happens. Because the curvature is negative, values above the mean concentration of $S$ will get compressed, while values below the mean concentration will get stretched. This results in a distortion to the input bell shape curve as it emerges as a reaction rate. The distortion means that the mean reaction rate is shifted higher compared to the expected deterministic reaction rate because the output distribution is stretched upwards. The change in mean rate leads to changes in the steady state levels as compared to the deterministic case. This effect is called **stochastic focusing** [Paulsson:2000, kim2008sensitivity] and can be negative (stochastic defocusing) as demonstrated in this example, or positive depending on the sign of the curvature. If severe enough, stochastic focusing can result in major changes to the qualitative behavior of the network such that the stochastic simulation bears no resemblance to the deterministic one.

**Figure** <a id="fig-explainstochasticfocusing"></a> `fig:explainStochasticFocusing`

*Graphic (not in the LaTeX source, referenced by name): `explainStochasticFocusing`*

*Caption:* Stochastic focusing due to a non-linear rate law. Note that the curvature of the rate function causes the mean reaction velocity to increase. 

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 0.85]{explainStochasticFocusing}
  \caption{Stochastic focusing due to a non-linear rate law. Note that the curvature of the rate function causes the mean reaction velocity to increase. } \label{fig:explainStochasticFocusing}
\end{figure}
```

## Chatter

In Chapter [[13_stability|Stability]] we briefly talked about bistable systems, systems that can exist in one of two stable steady states for a given set of parameters. If we model bistable systems using a stochastic based model, it is possible to generate behavior where the system jumps periodically from one steady state to the other. The reason for this is that if stochastic fluctuations are large enough compared to the gap between the two steady states, it is possible for the system to jump from one basin of attraction to the other. Figures [Figure: Example of chatter in a bistable system that is stochastically modeled](#fig-stochastichattera) and [Figure: Example where there is a single transition to the low state at about $](#fig-stochastichatterb) are two runs from the same model illustrating random jumps between the high and low states of a bistable system. In Figure [Figure: Example of chatter in a bistable system that is stochastically modeled](#fig-stochastichattera) we see the system starting at the high state of around 20 molecules. This state lasts until $t=20$ when the system jumps to its low state. At $t=50$ the system jumps back to the high state. The frequency of jumps between the two states is a function of the systems's parameters. The jumps are not regular and Figure [Figure: Example of chatter in a bistable system that is stochastically modeled](#fig-stochastichattera) shows an example where there is one jump to the low state at $t=60$, and some short lived jumps to the low state at $t=135$ and 140. The effect where a system spontaneously switches between two states as a result of noise is called **chatter** [thron1996model, ferrell2001bistability] or chattering.

Chattering in bistable systems has been observed in both natural and synthetic systems. Work by Ozbudak et. al [Ozbudak:2004] shows that a population of *E. coli* cells are distributed bimodally between the on (lactose utilization) and off state. A more detailed analysis by Egbert and Klavins [egbert2012] using a synthetic circuit shows very clearly that a population of cells can be distributed between the two bistable states. The degree of distribution can be controlled by changing the system's parameters. Many examples now exist in the literature including work in the field of neuroscience.

**Figure** <a id="fig-stochastichattera"></a> `fig:StochastiChatterA`

*Graphic (not in the LaTeX source, referenced by name): `tikz/StochasticChatterA`*

*Caption:* Example of chatter in a bistable system that is stochastically modeled. The system has two steady states at roughly 5 and 22. Noise randomly flips the system from one state to the other. 

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 1]{tikz/StochasticChatterA}
\caption{Example of chatter in a bistable system that is stochastically modeled. The system has two steady states at roughly 5 and 22. Noise randomly flips the system from one state to the other. }
\label{fig:StochastiChatterA}
\end{figure}
```

**Figure** <a id="fig-stochastichatterb"></a> `fig:StochastiChatterB`

*Graphic (not in the LaTeX source, referenced by name): `tikz/StochasticChatterB`*

*Caption:* Example where there is a single transition to the low state at about $t=60$.

```latex
\begin{figure}[htb]
  \centering
  \includegraphics[scale = 1]{tikz/StochasticChatterB}
\caption{Example where there is a single transition to the low state at about $t=60$.}
\label{fig:StochastiChatterB}
\end{figure}
```

```python
import tellurium as te

# Chattering in a bistable system
r = te.loada ('''
    $Xo -> x; b1 + Vm*(x/Km)*(1+(x/Km))^(n-1)/((1+(x/Km))^n+k2);
    x -> $w; k3*x;

    k2 = 200; k3 = 4.2;
    Vm = 110; Km = 3.6;
    n = 3.7;  b1 = 10;

    x = 15; # Initialize number of molecules
''')

m = r.gillespie(0, 140, ["Time", "x"])
# Plot and set the x axis limits
r.plot (xlim=(0,140))
```

<!-- \subsection*{Modeling Gene Regulatory Networks} -->

<!-- It is possible however to propose simplified models of gene expression in cases where bursting is considered insignificant. Some evidence~\cite{raj2006Plos} suggests we can ignore translation as a source of stochasticity. However, one problem still presents itself. We often assume that the binding and unbinding of transcription factors is faster than transcription or that the ratio of the bound state to the unbound state is in favor of the bound state so that the off state is rare. These assumptions mean that the degree of bursting is reduced. One approach is to dispense with the assumptions and instead consider each individual elementary reaction explicitly. However this poses its own problems because of increased complexity and the lack of information on individual binding constants. Although research is still ongoing in this important area, recent evidence suggests that the classic methods such as Gillespie SSA can be applied to non-elementary systems such as gene regulation without significant loss of accuracy~\cite{RaoArkin2003,Cao2005,MacNamara2008,sanft2011legitimacy}. Therefore we can model gene expression, at least to the first approximation, using Hill equations to evaluate the propensities values required by the Gillespie SSA method. -->

<!-- All these approaches carry with them specific assumptions, in each case the modeler must consider the reasonableness of the assumptions in relation to the specific question being asked. For example, a single cell study may require the use of a stochastic formalism whereas a population study might find the deterministic approach sufficient. -->

## Further Reading

- Rao, CV, Wolf, DM and Arkin, AP (2002), Control, exploitation and tolerance of intracellular noise, 420:6912, 231-237.

- Kaern M, Elston TC, Blake WJ and Collins JJ (2005) Stochasticity in gene expression: from theories to phenotypes, Nature Reviews Genetics, 6, 451-464.

- Raj1 A, van Oudenaarden A (2008) Nature, Nurture, or Chance: Stochastic Gene Expression and Its Consequences. Cell, 135:2, 216-226.

- Eldar, A and Elowitz, MB (2010) Functional roles for noise in genetic circuits, Nature, 467:7312, 167--173.

- Ingalls B (2013) Mathematical Modeling in Systems Biology: An Introduction, MIT Press. ISBN: 978-0262018883

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- \begin{enumerate} -->

<!-- \item The following modified model is taken from the work of Ribeiro and Lloyd-Price~\cite{ribeiro2007}. Run a simulation of the model using the given parameters. Explain why this model shows bimodal behavior. -->

<!-- \begin{lstlisting}[caption={},label={jarnac:chap:Equilibration}] -->
<!-- import tellurium as te -->

<!-- r = te.loada (''' -->
<!-- ProA -> A + ProA; g*ProA; -->
<!-- ProB -> B + ProB; g*ProB; -->
<!-- A + ProB -> ProBA; a0*A*ProB; -->
<!-- B + ProA -> ProAB; a0*B*ProA; -->
<!-- ProBA -> ProB + A; a1*ProBA; -->
<!-- ProAB -> ProA + B; a1*ProAB; -->
<!-- A -> $w; d*A; -->
<!-- B -> $w; d*B; -->

<!-- g = 0.2;   d = 0.01; -->
<!-- a0= 0.3;   a1 = 0.05; -->
<!-- A = 0;     B = 0; -->
<!-- ProA = 1;  ProB = 1; -->
<!-- ''') -->

<!-- r.setSeed(random.randint (1, 1000000)) -->
<!-- result = r.gillespie(0, 2000000, ["Time", "A"]); -->
<!-- r.plot() -->
<!-- \end{lstlisting} -->

<!-- \item The following model should be simulated as a deterministic model (i.e.\ using ODEs) and -->
<!-- as a stochastic model. -->

<!-- \begin{figure}[htb] -->
<!-- \begin{center} -->
<!-- \includegraphics[scale=0.2]{Howard.pdf} -->
<!-- \end{center} -->
<!-- \caption{Reaction Scheme: Xo, X1, and X2 are boundary species. Be very careful that you replicate this model exactly as given. -->
<!-- Assume all reactions are simple irreversible mass-action. Parameter values are -->
<!-- as follows: $k_1 = 0.1; k_2 = 0.1; k_3 = 0.01; k_4 = 0.05; k_5 = 10.1; Xo = 10; X_1 = 0; X_2 = 1$.} -->
<!-- \end{figure} -->

<!-- a) Enter the model into Tellurium and run a deterministic simulation. -->
<!-- Show the graphs for $S_1$, $S_2$, and $S_3$ over a time period of 800 -->
<!-- time units. -->

<!-- b) Next run the same model as a stochastic model (use gillespie() instead of simulate()) -->
<!-- Use the same values for the rate constants and initial conditions. -->
<!-- Plot $S_1$ and $S_3$ on one graph and $S_2$ on another graph. As with the deterministic model, simulate for 800 time units. -->

<!-- c) Observe the significant difference between the deterministic and -->
<!-- stochastic simulations. Why is this the case? Explain why the dynamics of the stochastic -->
<!-- simulation are so different considering the number of -->
<!-- molecules involved and the kind of reactions in the models. -->

<!-- d) Given your answer in (c), provide one situation where you think it is important to use a -->
<!-- stochastic model rather than a deterministic one. -->

<!-- \item Expand the simple gene expression model in Figure~\ref{fig:BurstingModel} to include transcription and translation. Develop a stochastic model of the expanded system. Investigate whether the translation machinery, which is present in higher concentration, can act as a buffer to the mRNA bursting. -->

<!-- \end{enumerate} -->

<!-- \Section*{Answers} -->

<!-- \Begin{Enumerate} -->

<!-- \Item The Model Has Two Steady States, High A, Low B And Low A, High B. This Is Caused By Competition Of A And B For Prob And Proa. Proa And Prob Are Present In Only Single Copies. For Example, Once A Bind With Prob To Form The Complex Proba, The Production Of B Stops. This Prevents B From Sequestering Proa So That A Starts To Increase, Reaching A High State For A (The Level Is Governed By The Decay Rate Of A) With A Very Low Or Zero Level For B. By Chance, The Complex Proba Can Decay In A And Prob. This Gives Prob The Chance To Start Making B. With B Rising It Is Possible For B To Sequester Proa, Shutting Down Production Of A. If This Lasts Long Enough A Will Decay And B Will Rise Switching The System To The Other State With A Low A And High B. The System Can Therefore Switch Back And Forth. Switching From One State To Another Is Random And Depends On The Decay Of The Complex Proa Or Prob. If The Levels Of Proa And Prob Are Increased, There Is Less Chance Of Removing All Copies Of Each In Order To Switch The System. At Molecule Numbers Of 100 For Proa And Prob, The System Is Quite Stable. -->

<!-- \Item -->
<!-- The Script To Run The Deterministic And Stochastic Model Are Given Below. -->
<!-- \Begin{Verbatim} -->
<!-- Import Tellurium As Te -->
<!-- Import Matplotlib.Pyplot As Plt -->

<!-- R = Te.Loada (''' -->
<!-- $Xo -> S1; K1*Xo -->
<!-- S1 + S2 -> 2 S2 + S3; K2*S1*S2 -->
<!-- S3 -> $X1; K3*S3; -->
<!-- $X2 -> S2; K4*X2; -->
<!-- S2 -> $X1; K5*S2 -->

<!-- K1 = 0.1; K2 = 0.1; K3 = 0.01; K4 = 0.05; K5 = 10.1; -->
<!-- Xo = 10; X2 = 1 -->

<!-- ''') -->

<!-- M = R.Simulate (0, 800, 100) -->
<!-- Plt.Figure(Figsize=(10,3)) -->
<!-- Plt.Subplot(1, 2, 1) -->
<!-- Plt.Plot (M['Time'], M['[S1]']) -->
<!-- Plt.Plot (M['Time'], M['[S3]']) -->
<!-- Plt.Subplot(1, 2, 2) -->
<!-- Plt.Plot (M['Time'], M['[S2]']) -->
<!-- Plt.Show() -->

<!-- R.Reset() -->
<!-- M = R.Gillespie (0, 800) -->
<!-- Plt.Figure(Figsize=(10,3)) -->
<!-- Plt.Subplot(1, 2, 1) -->
<!-- Plt.Plot (M['Time'], M['[S1]']) -->
<!-- Plt.Plot (M['Time'], M['[S3]']) -->
<!-- Plt.Subplot(1, 2, 2) -->
<!-- Plt.Plot (M['Time'], M['[S2]']) -->
<!-- Plt.Show() -->
<!-- \End{Verbatim} -->
<!-- Clearly The Two Cases Are Quite Different. The Main Difference Is How $X_2$ Enters The Model. In The Deterministic Case A Value Of $X_2 = 1$, Generates A Fixed Rate Of 0.05. This Causes $S_2$ To Slowly Increase. The Reaction $K_2$ Is Autocatalytic And Once Some $S_2$ Is Made The Positive Feedback Of The Autocatalytic Reaction Results In A Significant And Rapid Rise In $S_2$. Eventually The System Reaches A Steady State As A Result Of $K_5$. -->

<!-- In The Stochastic Case A Value Of One For $X_2$ Represents A Single Molecule. The Rate Of Production Of $S_2$ Is Therefore Highly Stochastic. If An Event At $K_4$ Cases The Production Of One Molecule Of $S_2$, Two Things Can Happen, $S_2$ Can Decay Via $K_5$ And Nothing More Happens Until $K_4$ Fires Again. However If Reaction $K_2$ Fires Before $K_5$, Then It Is Possible For The Autocatalytic Cycle To Start Up Resulting In More $S_2$. This Can Cause $S_2$ To Rise Rapidly. However, The Autocatalytic Cycle Is Depending On $S_1$ And $S_1$ Is Produced Via $X_O$, Another Reaction That Will Only Generate A Single Molecule Of $S_1$ Per Firing (But With A Higher Frequency Since $X_O = 10$). It Is Possible Therefore That If $K_1$ Doesn'T Fire For Some Time, $S_1$ Could Decay To Zero, Resulting In The Autocatalytic Cycle Shutting Off. This Might Give Sufficient Time For $K_5$ To Eliminate $S_2$ And The Cycle Can Begin Again. This Results Is A Cycle Of Boom And Busts In $S_1$ And $S_3$. Instead Of Reaching A Steady-State, The System Appears To Oscillate. -->

<!-- In Conclusion, It Is Important To Use A Stochastic Model When Ever There Are Single Events (Like $K_4$) That Can Have A Huge Influence On The Future State Of The System Particularly If A Single Event Can Be Amplified. -->
<!-- \End{Enumerate} -->

## Appendix

See Appendix [[appendix_i_modeling_with_python|Modeling with Python]] for more details of Tellurium.

```python
import tellurium as te
import matplotlib.pyplot as plt
import roadrunner

rr = te.loada ('''
   A -> B; k1*A;
   B -> A; k2*B;
   k1 = 0.2; k2 = 0.4;
''')

starting = 6000 # 10 zepto molar 10^(-21) = 6000 molecules

rr.model["init(A)"] = starting
rr.model["init(B)"] = 0

plt.subplot(221)
plt.title("A = 6000")
m1 = rr.gillespie(0, 12, ["time", "A", "B"])
te.plotArray(m1)
rr.model["init(A)"] = starting
rr.model["init(B)"] = 0

m2 = rr.simulate(0, 12, 100)
te.plotArray(m2)

starting = 600
rr.model["init(A)"] = starting
rr.model["init(B)"] = 0

plt.subplot(222)
plt.title("A = 600")
m1 = rr.gillespie(0, 12, ["time", "A", "B"])
te.plotArray(m1)
rr.model["init(A)"] = starting


rr.model["init(B)"] = 0
m2 = rr.simulate(0, 12, 100)
te.plotArray(m2)

starting = 60
rr.model["init(A)"] = starting
rr.model["init(B)"] = 0

plt.subplot(223)
plt.title("A = 60")
m1 = rr.gillespie(0, 12, ["time", "A", "B"])
te.plotArray(m1)
rr.model["init(A)"] = starting
rr.model["init(B)"] = 0

m2 = rr.simulate(0, 12, 100)
te.plotArray(m2)
plt.xlabel("Time")
starting = 20
rr.model["init(A)"] = starting
rr.model["init(B)"] = 0

plt.subplot (224)
plt.title("A = 20")
m1 = rr.gillespie(0, 12, ["time", "A", "B"])
te.plotArray(m1)
rr.model["init(A)"] = starting
rr.model["init(B)"] = 0

m2 = rr.simulate(0, 12, 100)
plt.xlabel("Time")
te.plotArray(m2)
```

```python
import tellurium as te

r = te.loada ('''
    // Transcription binding/unbinding step
    TR + Gene1 -> TR_B; k1*TR*Gene1;
    TR_B -> TR + Gene1; k2*TR_B;
    // Protein synthesis
    $g -> product; Vm*TR_B;
    // Protein degradation
    product -> $w; k3*product;

    // TR = free transcription factor;
    // TR_B = bound transcription factor
    Gene1 = 1;  TR = 1;     Vm = 1;
    k1 = 0.01; k2 = 0.01;  k3 = 0.04;
    TR_B = 0;  product = 0;
''')

seed = 1.22012
m = r.gillespie(0, 2000, ["time", "TR_B", "product"], seed)
r.plot()
```

<!-- \begin{lstlisting}[caption={Script for Figure~\ref{fig:VirusStochastic}},label={jarnac:chap:VirusStochastic}] -->
<!-- // Hepatitis B viral infection model -->
<!-- p = defn cell -->
<!-- $s -> rcDNA; k1 * cccDNA; -->
<!-- rcDNA -> cccDNA; k2 *  rcDNA; -->
<!-- $s -> envelope; k3 * cccDNA; -->
<!-- cccDNA -> $degradation; k4 *  cccDNA; -->
<!-- envelope -> $degradation;  k5 *  envelope; -->
<!-- rcDNA + envelope -> virus;  k6 * rcDNA * envelope; -->
<!-- end; -->

<!-- p.k1 = 1;       p.k2 = 0.025; -->
<!-- p.k3 = 1000;    p.k4 = 0.45; -->
<!-- p.k5 = 2;       p.k6 = 7.5E-6; -->

<!-- p.cccDNA = 2;     p.rcDNA = 0; -->
<!-- p.envelope = 0;   p.virus = 10; -->

<!-- m = p.sim.eval (0, 180 , 100, [<p.time>, <p.virus>]); -->
<!-- ghold(); -->
<!-- graph (m); -->

<!-- for i = 1 to 20 do -->
<!-- begin -->
<!-- p.cccDNA = 2;    p.rcDNA = 0; -->
<!-- p.envelope = 0;  p.virus = 10; -->

<!-- m = gillespie (p, 0, 180, [<p.time>, <p.virus>]); -->
<!-- graph (m); -->
<!-- println i; -->
<!-- end; -->
<!-- ghold(); -->
<!-- \end{lstlisting} -->

```python
import tellurium as te
import matplotlib.pyplot as plt

# Stochastic Focusing Model
# Modified from: Paulsson J, Berg OG, Ehrenberg M.
# Proc. Natl. Acad. Sci. USA 97(13), 7148-53 (2000)
# Stochastic focusing: fluctuation-enhanced sensitivity
# of intracellular regulation.
r = te.loada ('''
    $src -> So;    k1*src;
    So -> $srr;    k2*So;
    J1: $Xo -> S1; Vm/(Km + So);
    J2: S1 -> $w;  S1*k3;
    k1 = 20;   k2 = 6;
    Vm = 20;   Km = 0.2;
    k3 = 0.04; src = 1;
    S1 = 0;    So = 0;
''')

m1 = r.simulate(0, 600, 100, ["Time", "S1"])
r.plot()
r.S1 = 0
r.So = 0
m2 = r.gillespie(0, 600, ["Time", "S1"])
r.plot(xtitle="Time", ytitle="Variable")
```

```python
import tellurium as te
import pylab

# Bursting in a simple ion channel model
r = te.loada ('''
    open -> closed; k1*open;
    closed -> open; k2*closed;

    $ligand + open -> closedLigand; k3*ligand*open;
    LigandBlocked -> $ligand + open; k4*LigandBlocked;

    open = 1;
    closed = 0;
    LigandBlocked = 0;
    ligand = 1E-7;
    k1 = 400; k2 = 75;
    k3 = 8E8;
    k4 = 3000;
''')

result = r.gillespie(0, .2, ["time", "open"])
# Plot and set the x and y axes limits
r.plot (xlim=(0,0.1),ylim=(0,2))
```

<!-- ----------------------------------------------------------------- -->

---

## Index terms recorded in this chapter

- bimodal
- bistable system
- bursting
- chatter
- curvature
- equilibration model
- gate
- ion channel
- noise propagation
- random telegraph model
- stochastic bursting
- stochastic chatter
- stochastic defocusing
- stochastic focusing

---

← [[14_modeling_feedforward_networks|Modeling FeedForward Networks]] · [[index|Wiki index]] · [[16_understanding_metabolism|Understanding Metabolism]] →
