# Introduction to Modeling

*Source: `chapter4.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Introduction to Modeling <a id="chap-intromodeling"></a>

## Introduction

The universe is a very large place and to study it in its entirety would not be practical. Instead, we always study a small portion of the universe, often under very controlled conditions which we call a **system**. Everything else, other than the system is called the **surroundings**. Between the system and the surroundings we try to enforce strict rules on how the system interacts with the surroundings. These interactions occur at the system **boundary**.

\stateHighlight{
 The **system** is a defined region of the universe that we wish to study.

 The **surroundings** is everything else other than the system.

 The **boundary** is the interface between the system and the surroundings.}

The word system derives from a Greek term that means "place together", suggesting a system is one or more parts working together.

In order to make the study of a particular system possible, we will often impose strict conditions on how the system interacts with the rest of the universe. If the system were allowed to freely interact with its surroundings, then we're effectively back to studying the entire universe again. When we study a system, we make sure that we know exactly how the system interacts with its surroundings and in ways that we can control.

<!-- To make this more concrete, consider an animal cell that consumes glucose, produces waste products and generates a small amount of heat. The animal cell will be our system. In an experiment we may arrange things so that the concentration of glucose and waste products outside the cell are kept relatively constant during the experiment. In addition we keep the animal cell in a thermostatically control temperature bath which means that the cell won't increase the temperature of the surroundings. By keeping the environment constant we are making sure that any changes that occur in the animal cell are due entirely to processes going inside the cell and not as a result of changes in the environment. We therefore have control over the system. If we didn't, we would find it very difficult to study the behavior of the animal cell. -->

The actual boundary of the system is however entirely at the discretion of the experimenter and depends on practical as well and scientific considerations. The important point is that the boundary is under *our strict control*, at least in principle. The nature of this control also determines whether our system is open, closed or isolated.

\stateHighlight{
In general, the experimenter decides the location of the boundary that exists between the system and the surroundings. Once set, the experimentalist will usually impose constraints on how the surroundings and system are allowed to interact with each other.}

## Open, Closed, and Isolated Systems

When considering systems it is helpful to distinguish between three types of boundary conditions that exist between the system and the surroundings. These types are called *isolated, closed and open* systems. Each of these systems represent an idealized state. In practice we try to approximate them as well as possible. An isolated system, as the name suggests, is completely cut off from the rest of the universe, that is neither energy nor matter can be transferred across the isolated system's boundary. A closed system is one that only transfers energy, for example heat, work or light. An open system is one that can exchange both energy and mass with the surroundings.

```latex
\begin{tabular}{ll}\toprule
System & Property \\\midrule
Isolated & No transfer of energy or matter \\
Closed & No transfer of matter \\
Open & Transfer of matter and energy\\\bottomrule
\end{tabular}
```

The distinction between a closed and open system in biology is very important. Open systems are characteristic of biological systems. For example, glycolysis is a pathway for converting an external nutrient source such as glucose, into available energy, such as ATP or heat and waste products lactate or ethanol. That is, it exchanges mass and energy with the surroundings. Without mass and energy exchange, biological systems would eventually run to thermodynamic equilibrium and cease to function. All models of living biological systems are therefore open.

<!-- The previous example of an experiment done on an animal cell illustrates an open system. In this case the cell consumed glucose and produced waste products in addition to generating heat. Even though there was the free exchange of matter and energy we nevertheless made sure that we continually replenished the glucose so that it appeared to the cell that the level of glucose was constant. Likewise we ensured that waste products didn't build up and that the generated heat didn't cause the temperature to rise in the surroundings because we immersed the experiment in a heat bath. From the perspective of the animal cell, the surroundings appeared constant even though there was a continual exchange between the surroundings and the animal cell. -->

**Figure** <a id="fig-openclosedisolated"></a> `fig:OpenClosedIsolated`

*Graphic (not in the LaTeX source, referenced by name): `OpenClosedIsolated`*

*Caption:* Open, Closed, and Isolated Systems. 

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.65]{OpenClosedIsolated}
  \caption{Open, Closed, and Isolated Systems. }
  \label{fig:OpenClosedIsolated}
\end{center}
\end{figure}
```

**Example**
<a id="exmp-stoich"></a>
For each of the following systems, decide whether the system is isolated, closed or open. Comment on the nature of the surroundings.

i) A system represented by a mechanical clock slowly winds down in a room controlled by a thermostat.

The clock starts with an amount of potential energy in the wound spring which slowly dissipates, ultimately as heat which is transferred to the surroundings. No mass is exchanged with the room. The clock is therefore a closed system. Because the clock is in a temperature controlled room, the temperature of the room appears constant to the clock even though the clock dissipates heat.

ii) A car engine running idle in the open air.

The car engine is burning fuel that generates both waste gases and heat. The heat and waste gases are lost to the surroundings. At the same time the car engine takes in oxygen. The car system is therefore open since it exchanges both matter and energy with the surroundings. In addition, given that the exchange takes place in the open, the surrounding temperature, oxygen and carbon dioxide levels appear constant because the large volume of the atmosphere acts as a buffer. We assume that the fuel tank is part of the system.

iii) A bacterial culture is grown in batch and kept in a sealed and insulated chamber.

The batch vessel is isolated and therefore the culture itself is an isolated system. There is no exchange of mass or energy with the surroundings. However, if we focus our attention on a single bacterium, we would have to conclude that a single cell is an open system which consumes nutrients, produces waste, and generates heat. However, the bacterial surroundings are not kept constant and the temperature. as well as waste products. rise with the loss of nutrients. Eventually the nutrients are used up, the culture dies, and the system tends to thermodynamics equilibrium.

## What is a Model?

There are many ways to describe systems, ranging from pictures or cartoons to verbal and mathematical representations. Collectively, these descriptions are called **models**. A model is our way of describing a particular system. The Oxford English Dictionary defines a model in the following way:

> 
"A simplified or idealized description or conception of a particular system, situation, or process, often in mathematical terms, that is put forward as a basis for theoretical or empirical understanding, or for calculations, predictions, etc."

This definition embodies a number of critical features that define a model, the most important being that a model represents an **idealized description**, a simplification, of a real world process. This may at first appear to be a weakness, but simplification is usually done intentionally. Simplification allows us to comprehend the essential features of a complex process without being burdened and overwhelmed by unnecessary detail.

A more interesting way to describe models is to use mathematics, a language created for logical reasoning. Mathematical models are useful in biology for a number of reasons, but the three most important are increased precision, prediction, and the capacity for analysis. Analysis is carried out either by simulation or by mathematical analysis. Although visual models can be used to make predictions, the kinds of predictions that can be made are limited. The use of mathematical models opens up whole new vistas of study which visual models simply can not match.

\stateHighlight{
A **model** is a simplified description of a system. A model can be used to represent known facts about the system and hypotheses concerning the system's operation. Models can be described using pictures, plain text, mathematics or computer software.}

Models come in various forms including verbal, written text, visual, mathematical (equation [Water Tank Model](#eqn-watertankh2)), and others. Molecular biology has a long tradition of using visual models to represent cellular structure and function; one need only look through a modern textbook to see instances of visual models on every page. Visual models have been immensely useful at describing complicated biological processes but are limited in scope.

<!-- \vspace{12pt} -->
<!-- \stateHighlight{ -->
<!-- {\bfseries A Simple Mathematical Model}\index{Simple model}\vspace{12pt} -->

<!-- Let is consider a very simple model of bacterial growth. We will assume that we have $N$ number of bacteria in our culture at time zero. A common assumption in describing growth is to assume that the rate of change in the number of bacteria at any given time is proportional to the number of bacteria. We will assume initially that the nutrient supply does not change. The more bacteria, the faster the growth. We can express this as a simple differential equation: -->

<!-- $$ \frac{d\!N}{\dt} \propto N \qquad\mbox{or}\qquad \frac{d\!N}{\dt} = k_1 N $$ -->

<!-- where $k_1$ is called the growth rate. This equation describes a never ending exponential growth pattern, something that is unrealistic although for small populations it might be adequate. A simple way to adjust the model is to add a competition term. We can, for example, assume that the more bacteria there are the more likely any two bacteria will compete for space and food. We can model this by making the death rate proportional to the square of the population size. That is we can adjust model as shown below: -->

<!-- $$ \frac{d\!N}{\dt} = k_1 N - k_2 N^2 $$ -->

<!-- This model is called the logistic model and has the solution: -->

<!-- $$ N = \frac{k_1/k_2}{1 + \left( \frac{\displaystyle k_1 - k_2 N_o}{\displaystyle k_2 N_o}\right) e^{-k_1 t}} $$ -->

<!-- where $N_o$ is the initial population of bacteria. This equation describes a sigmoid curve, shown in Figure~\ref{fig:logisticCurve}. An alternative is to model the consumption of nutrient, but this would require an additional differential equation. -->
<!-- } -->

<!-- \begin{figure} -->
<!-- \begin{center} -->
<!-- \begin{tikzpicture} -->
<!-- \begin{axis}[ -->
<!-- grid=major, -->
<!-- xmin=0, -->
<!-- xmax=8, -->
<!-- ymin=0, -->
<!-- ymax=60, -->
<!-- width=8cm, -->
<!-- height=6cm] -->
<!-- \addplot[color=blue,line width=1.25pt] expression[domain=0:8,samples=100]{(1/0.02)/(1 + ((1 - 0.02*1)/(0.02*1))*exp(-1*x)}; -->
<!-- \end{axis} -->

<!-- \end{tikzpicture} -->
<!-- \caption{Logistic Equation modeling bacteria growth with resource limitation.} -->
<!-- \label{fig:logisticCurve} -->
<!-- \end{center} -->
<!-- \end{figure} -->

Like visual models, mathematical models can serve at least two important roles in systems biology:

- Heuristic Models

Heuristic models serve as test beds for investigating basic principles, for example the effects of feedback or
sequestration. Heuristic models are employed to aid reasoning about particular aspects of biological networks. Heuristic models are frequently used to illustrate properties of biological networks.

- Particular Models

Particular models are constructed to model a specific real system, such as glycolysis [Teusink:2000], apoptosis [schleich2013mathematical], or the sporulation circuit in { Bacillus
subtilis} [jabbari2011mathematical]. They represent a **working hypothesis** for a particular
biological system, and allow us to generate predictions about the real system and
falsifiable statements about the model.

### Particular Models

What makes a good particular model? There are a range of properties that a good model should exhibit, but
the most important are **accuracy**, **predictability** and **falsifiablity**.

$\rhd$ A model is considered **accurate** if the model is able to
describe current experimental observations by
reproducing the current state of knowledge.

$\rhd$ A **predictive** model should be able to generate insight and/or
predictions beyond current knowledge. Without this ability, a model is considerably less useful, some would even suggest
useless.

$\rhd$ Finally, a model should be **falsifiable**. By this we mean that a model cannot be proven  true, only disproved. The only discipline where statements can  actually be proven true or false is mathematics. Starting with a set of axioms, mathematicians derive theorems that can be shown beyond any doubt to be true or false. In contrast, scientific models based on observations *cannot be proven correct*. This is because it is simply not possible to test every possible circumstance in which the model may apply and be able to make the necessary measurements error free. Instead, we are left with two options: model falsification and model validation.

#### Model Falsification

We can falsify a model by finding observations that the model fails to predict. In this case the model must be changed or abandoned. Although the idea of falsifying a model is appealing, in practice it is not often used since even partially correct models can at times be useful. This leads to the second option, model validation which is the most commonly used approach.

#### Model Validation

Model validation is based on the idea that predictions made by a model are verified by experimentation. The word validate may imply that once a model is `validated', the model can now be considered a true representation of the real system, but this is not accurate. A validated model is simply one where our *confidence* in a model's ability to predict and provide insight has *improved*. As already suggested, no model is correct. The utility of a model is based on how well it can make useful predictions and how well it fits existing knowledge. Models will have a certain scope within which they are useful. For example, Newtonian mechanics is useful for describing objects traveling at speed much slower than the speed of light. Objects traveling close to the speed of light cannot be described by Newtonian mechanics. Michaelis-Menten kinetics is useful for describing steady state systems, but is less useful for describing transient behavior if the enzyme concentration is higher or comparable to substrate concentration. One role of model validation is therefore to delineate its scope.

Thus, validation serves two purposes: to describe the scope of a model and to increase confidence in the ability of the model to make useful predictions. It is important to understand that validation does not `prove' that a model is correct since no such statement can be made.

\stateHighlight{
Models cannot be proved to be true. We can only improve our confidence in a model's usefulness through experiment.
}

#### Other Attributes

There are other desirable model attributes including **parsimonious** and {
selective}. A parsimonious model is a model that is as simple as
possible, but no simpler. Occam's infamous razor
states that "Entities should not be multiplied beyond
necessity" and argues that given competing and equally good models,
the simplest is preferred. Finally, since no model can represent
every single detail of a system, a model must be *selective* and
represent those things most relevant to the task at hand.

## Building a Model

In this section we will introduce modeling by building a simple water tank model. We will wait until Chapter [[05_differential_equation_models|Differential Equation Models]] before discussing how to use software to run a model simulation.

### Water Tank Model

<a id="subsec-tankmodel"></a>

Figure [Figure: Water Tank Model](#fig-dualtank) shows two water tanks. This is a pictorial model of our system. Our aim it to attempt to make quantitative predictions on the height of water in the tanks. We cannot easily do this with just the picture diagram. Instead we must convert the picture into a mathematical model.

Let us first verbally describe the model. The first tank is fed with water at a rate $Q_1$ (m$^{3}$ s$^{-1}$). This tank drains into a second tank at a rate $Q_2$, which in turn drains to waste at a rate $Q_3$. The second tank has an additional feed of water flowing in at a rate $Q_4$. The height of the water level in each tank is given by $h_1$ and $h_2$, respectively and the volumes by $V_1$ and $V_2$. Each tank has a cross sectional area, $A$. In building the mathematical model we will make the following assumptions, most notably:

- Mass is conserved as water moves from one tank to another.
- The external environment is constant, for example the temperature.
- We will assume that the rate of flow out of a tank is proportional to the height of water.(footnote: Strictly speaking the flow follows Torrielli's Law, $Q \propto \sqrt{h}$ but we'll keep things simple as assume direct proportionality. At low flow rates Q is approximately proportional to the height of water. For more details see Torrielli's Law: <http://en.wikipedia.org/wiki/Torricelli's_law>}

With the assumptions in place, we can now start to construct a mathematical model of the tank system.

<!-- \SetupExSheets{headings=centered} -->
<!-- \begin{question}[name=Class Question]\label{ex:one} -->
<!-- A question -->
<!-- \end{question} -->
<!-- \begin{solution} -->
<!-- The solution is 42 \ref{ex:one} -->
<!-- \end{solution} -->

The rate of change in the volume of water in a given tank is the rate at which the water enters, minus the rate at which it leaves. For the first tank that rate of change of volume, $V_1$, is:

\[ \frac{dV_1}{dt} = Q_1 - Q_2 \]

This uses the assumption of conservation of mass. If we want the equation in terms of the rate of change of height, then we need to recall that $V = A h$, that is:

\[ \frac{dV}{dt} = A \frac{dh}{dt} \quador\quad  \frac{dh}{dt} = \frac{1}{A} \frac{dh}{dt} \]

so that:

\[ \frac{dh_1}{dt} = \frac{Q_1 - Q_2}{A} \]

Assuming that flow out of a tank is proportional to the height of water, we assuming in our model that the rate of water flowing out of a given tank, $i$, is equal to:

\[ Q_i = K_i h_i \]

Where $K_i$ is a constant related to the resistance of the output pipe. Therefore, for the first tank we have:

\[ \frac{dh_1}{dt} = \frac{Q_1 - K h_1}{A} \]

**Figure** <a id="fig-dualtank"></a> `fig:DualTank`

*Graphic (not in the LaTeX source, referenced by name): `DualTank`*

*Caption:* Water Tank Model.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale = 0.9]{DualTank}
  \caption{Water Tank Model.}
  \label{fig:DualTank}
\end{figure}
```

Describing the height of the second tank is slightly more complicated because we also have the additional flow $Q_4$. Again we will invoke the law of mass conservation to state that any change in volume must be due to the difference in water flow into the tank and out of the tank. That is, the rate of change of the second tank volume is given by:

$$ \frac{dV_2}{dt} = Q_2 + Q_4 - Q_3 $$

Using the relationship between volume, area and the height $h_2$, we can write:

$$ \frac{dh_2}{dt} = \frac{Q_2 + Q_4 - Q_3}{A} $$

$Q_2$ was given previously as $K_1 h_1$, likewise, $Q_3$ is given by $K_2 h_2$. Therefore the full differential equation is:

$$
\begin{align}
\frac{dh_2}{dt} = \frac{K_1 h_1 + Q_4 - K_2 h_2}{A}
\label{eqn:watertankh2}
\end{align}
$$

With the differential equations in hand, the next stage is to assign values to the various parameters in the model. For example, the cross-sectional areas of the tanks, the flow $Q_4$ into the second tank, the flow $Q_1$ into the first tank, and the two tank constants, $K_1$ and $K_2$. Once the parameters are assigned, we initialize the two heights $h_1$ and $h_2$, then enter the equations into a computer program to solve the differential equations. We will leave the actual simulation task to Chapter [[05_differential_equation_models|Differential Equation Models]]. For now we just show the results from a  simulation of the tank model using Tellurium (Figure [Figure: Simulation of the tank model](#fig-tankmodel)). The plot displays the heights, $h_1$ and $h_2$ as water fills the tanks one at a time.

**Figure** <a id="fig-tankmodel"></a> `fig:tankModel`

*Caption:* Simulation of the tank model.

```latex
\begin{figure}
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Height, $h_1$ and $h_2$},
xmin=0, xmax=25, ymin=0, ymax=12,
width=10cm,
height=6cm]
\addplot[color=red,line width=1.5pt] coordinates {
(0, 0) (0.1256281, 0.5343965) (0.2512563, 0.9977857) (0.3768844, 1.418791) (0.5025126, 1.807555) (0.6281407, 2.169905) (0.7537688, 2.509748) (0.879397, 2.829935)
(1.005025, 3.132661) (1.130653, 3.419678) (1.256281, 3.692431) (1.38191, 3.952126) (1.507538, 4.199797) (1.633166, 4.436333) (1.758794, 4.662514) (1.884422, 4.879032)
(2.01005, 5.086507) (2.135678, 5.28549) (2.261307, 5.476481) (2.386935, 5.659934) (2.512563, 5.836262) (2.638191, 6.005844) (2.763819, 6.169028) (2.889447, 6.326136)
(3.015075, 6.477466) (3.140704, 6.623295) (3.266332, 6.763881) (3.39196, 6.899463) (3.517588, 7.030267) (3.643216, 7.156504) (3.768844, 7.278371) (3.894472, 7.396054)
(4.020101, 7.509729) (4.145729, 7.619561) (4.271357, 7.725707) (4.396985, 7.828315) (4.522613, 7.927524) (4.648241, 8.023468) (4.773869, 8.116272) (4.899497, 8.206057)
(5.025126, 8.292936) (5.150754, 8.377018) (5.276382, 8.458406) (5.40201, 8.537199) (5.527638, 8.613492) (5.653266, 8.687373) (5.778894, 8.758935) (5.904523, 8.828254)
(6.030151, 8.895409) (6.155779, 8.960476) (6.281407, 9.023526) (6.407035, 9.084628) (6.532663, 9.14385) (6.658291, 9.201254) (6.78392, 9.256903) (6.909548, 9.310854)
(7.035176, 9.363165) (7.160804, 9.41389) (7.286432, 9.46308) (7.41206, 9.510787) (7.537688, 9.557058) (7.663317, 9.60194) (7.788945, 9.645478) (7.914573, 9.687714)
(8.040201, 9.728692) (8.165829, 9.768449) (8.291457, 9.807026) (8.417085, 9.84446) (8.542714, 9.880786) (8.668342, 9.916039) (8.79397, 9.950253) (8.919598, 9.98346)
(9.045226, 10.01569) (9.170854, 10.04698) (9.296482, 10.07735) (9.422111, 10.10683) (9.547739, 10.13545) (9.673367, 10.16324) (9.798995, 10.19021) (9.924623, 10.21641)
(10.05025, 10.24184) (10.17588, 10.26653) (10.30151, 10.29051) (10.42714, 10.31379) (10.55276, 10.3364) (10.67839, 10.35836) (10.80402, 10.37969) (10.92965, 10.4004)
(11.05528, 10.42051) (11.1809, 10.44004) (11.30653, 10.45902) (11.43216, 10.47745) (11.55779, 10.49535) (11.68342, 10.51273) (11.80905, 10.52962) (11.93467, 10.54603)
(12.0603, 10.56196) (12.18593, 10.57745) (12.31156, 10.59248) (12.43719, 10.60709) (12.56281, 10.62129) (12.68844, 10.63508) (12.81407, 10.64847) (12.9397, 10.66149)
(13.06533, 10.67413) (13.19095, 10.68642) (13.31658, 10.69836) (13.44221, 10.70995) (13.56784, 10.72122) (13.69347, 10.73217) (13.8191, 10.74281) (13.94472, 10.75315)
(14.07035, 10.76319) (14.19598, 10.77295) (14.32161, 10.78243) (14.44724, 10.79165) (14.57286, 10.80061) (14.69849, 10.80931) (14.82412, 10.81776) (14.94975, 10.82598)
(15.07538, 10.83397) (15.20101, 10.84173) (15.32663, 10.84927) (15.45226, 10.8566) (15.57789, 10.86372) (15.70352, 10.87064) (15.82915, 10.87737) (15.95477, 10.88391)
(16.0804, 10.89026) (16.20603, 10.89643) (16.33166, 10.90243) (16.45729, 10.90827) (16.58291, 10.91393) (16.70854, 10.91944) (16.83417, 10.9248) (16.9598, 10.93)
(17.08543, 10.93506) (17.21106, 10.93997) (17.33668, 10.94475) (17.46231, 10.94939) (17.58794, 10.95391) (17.71357, 10.95829) (17.8392, 10.96256) (17.96482, 10.9667)
(18.09045, 10.97073) (18.21608, 10.97464) (18.34171, 10.97845) (18.46734, 10.98215) (18.59296, 10.98574) (18.71859, 10.98924) (18.84422, 10.99263) (18.96985, 10.99593)
(19.09548, 10.99914) (19.22111, 11.00226) (19.34673, 11.00529) (19.47236, 11.00824) (19.59799, 11.0111) (19.72362, 11.01389) (19.84925, 11.0166) (19.97487, 11.01923)
(20.1005, 11.02178) (20.22613, 11.02427) (20.35176, 11.02669) (20.47739, 11.02904) (20.60302, 11.03132) (20.72864, 11.03354) (20.85427, 11.0357) (20.9799, 11.03779)
(21.10553, 11.03983) (21.23116, 11.04181) (21.35678, 11.04374) (21.48241, 11.04561) (21.60804, 11.04743) (21.73367, 11.0492) (21.8593, 11.05092) (21.98492, 11.05259)
(22.11055, 11.05422) (22.23618, 11.0558) (22.36181, 11.05733) (22.48744, 11.05883) (22.61307, 11.06028) (22.73869, 11.06169) (22.86432, 11.06306) (22.98995, 11.06439)
(23.11558, 11.06569) (23.24121, 11.06695) (23.36683, 11.06817) (23.49246, 11.06936) (23.61809, 11.07052) (23.74372, 11.07165) (23.86935, 11.07274) (23.99497, 11.0738)
(24.1206, 11.07484) (24.24623, 11.07584) (24.37186, 11.07682) (24.49749, 11.07777) (24.62312, 11.07869) (24.74874, 11.07959) (24.87437, 11.08046) (25, 11.08131)
};
\addlegendentry{$h_1$}
\addplot[color=blue,dotted,line width=1.5pt] coordinates {
(0, 0) (0.1256281, 0.4697522) (0.2512563, 1.004325) (0.3768844, 1.567289) (0.5025126, 2.140043) (0.6281407, 2.708491) (0.7537688, 3.261288) (0.879397, 3.789482)
(1.005025, 4.28639) (1.130653, 4.747495) (1.256281, 5.17024) (1.38191, 5.553779) (1.507538, 5.89864) (1.633166, 6.206381) (1.758794, 6.479295) (1.884422, 6.720135)
(2.01005, 6.931896) (2.135678, 7.117612) (2.261307, 7.280243) (2.386935, 7.422583) (2.512563, 7.54721) (2.638191, 7.65645) (2.763819, 7.752389) (2.889447, 7.836863)
(3.015075, 7.911479) (3.140704, 7.977626) (3.266332, 8.036508) (3.39196, 8.089149) (3.517588, 8.136428) (3.643216, 8.179093) (3.768844, 8.217777) (3.894472, 8.253021)
(4.020101, 8.285281) (4.145729, 8.314944) (4.271357, 8.342339) (4.396985, 8.367743) (4.522613, 8.391392) (4.648241, 8.413487) (4.773869, 8.434199) (4.899497, 8.453675)
(5.025126, 8.472039) (5.150754, 8.489399) (5.276382, 8.505848) (5.40201, 8.521467) (5.527638, 8.536324) (5.653266, 8.550481) (5.778894, 8.563994) (5.904523, 8.576906)
(6.030151, 8.58926) (6.155779, 8.601094) (6.281407, 8.612439) (6.407035, 8.623327) (6.532663, 8.633783) (6.658291, 8.643832) (6.78392, 8.653497) (6.909548, 8.662797)
(7.035176, 8.671751) (7.160804, 8.680377) (7.286432, 8.68869) (7.41206, 8.696705) (7.537688, 8.704435) (7.663317, 8.711894) (7.788945, 8.719093) (7.914573, 8.726043)
(8.040201, 8.732755) (8.165829, 8.739239) (8.291457, 8.745504) (8.417085, 8.751559) (8.542714, 8.757413) (8.668342, 8.763072) (8.79397, 8.768546) (8.919598, 8.77384)
(9.045226, 8.778962) (9.170854, 8.783918) (9.296482, 8.788714) (9.422111, 8.793357) (9.547739, 8.797851) (9.673367, 8.802202) (9.798995, 8.806416) (9.924623, 8.810496)
(10.05025, 8.814449) (10.17588, 8.818277) (10.30151, 8.821987) (10.42714, 8.825581) (10.55276, 8.829063) (10.67839, 8.832438) (10.80402, 8.83571) (10.92965, 8.838881)
(11.05528, 8.841954) (11.1809, 8.844934) (11.30653, 8.847824) (11.43216, 8.850625) (11.55779, 8.853342) (11.68342, 8.855977) (11.80905, 8.858532) (11.93467, 8.861011)
(12.0603, 8.863415) (12.18593, 8.865747) (12.31156, 8.86801) (12.43719, 8.870205) (12.56281, 8.872335) (12.68844, 8.874402) (12.81407, 8.876407) (12.9397, 8.878353)
(13.06533, 8.880242) (13.19095, 8.882075) (13.31658, 8.883854) (13.44221, 8.88558) (13.56784, 8.887256) (13.69347, 8.888883) (13.8191, 8.890463) (13.94472, 8.891996)
(14.07035, 8.893485) (14.19598, 8.89493) (14.32161, 8.896333) (14.44724, 8.897695) (14.57286, 8.899018) (14.69849, 8.900302) (14.82412, 8.90155) (14.94975, 8.902761)
(15.07538, 8.903937) (15.20101, 8.905079) (15.32663, 8.906188) (15.45226, 8.907266) (15.57789, 8.908312) (15.70352, 8.909328) (15.82915, 8.910315) (15.95477, 8.911274)
(16.0804, 8.912205) (16.20603, 8.91311) (16.33166, 8.913989) (16.45729, 8.914842) (16.58291, 8.915671) (16.70854, 8.916477) (16.83417, 8.917259) (16.9598, 8.918019)
(17.08543, 8.918758) (17.21106, 8.919475) (17.33668, 8.920172) (17.46231, 8.920849) (17.58794, 8.921507) (17.71357, 8.922146) (17.8392, 8.922767) (17.96482, 8.923371)
(18.09045, 8.923957) (18.21608, 8.924527) (18.34171, 8.92508) (18.46734, 8.925618) (18.59296, 8.926141) (18.71859, 8.926649) (18.84422, 8.927142) (18.96985, 8.927622)
(19.09548, 8.928088) (19.22111, 8.928541) (19.34673, 8.928981) (19.47236, 8.929409) (19.59799, 8.929824) (19.72362, 8.930228) (19.84925, 8.930621) (19.97487, 8.931002)
(20.1005, 8.931373) (20.22613, 8.931733) (20.35176, 8.932083) (20.47739, 8.932423) (20.60302, 8.932754) (20.72864, 8.933075) (20.85427, 8.933388) (20.9799, 8.933691)
(21.10553, 8.933986) (21.23116, 8.934273) (21.35678, 8.934552) (21.48241, 8.934823) (21.60804, 8.935086) (21.73367, 8.935342) (21.8593, 8.935591) (21.98492, 8.935832)
(22.11055, 8.936067) (22.23618, 8.936295) (22.36181, 8.936517) (22.48744, 8.936733) (22.61307, 8.936943) (22.73869, 8.937147) (22.86432, 8.937345) (22.98995, 8.937537)
(23.11558, 8.937724) (23.24121, 8.937906) (23.36683, 8.938083) (23.49246, 8.938255) (23.61809, 8.938422) (23.74372, 8.938585) (23.86935, 8.938743) (23.99497, 8.938896)
(24.1206, 8.939045) (24.24623, 8.93919) (24.37186, 8.939331) (24.49749, 8.939468) (24.62312, 8.939602) (24.74874, 8.939731) (24.87437, 8.939857) (25, 8.939979)
};
\addlegendentry{$h_2$}
\end{axis}
\end{tikzpicture}
\caption{Simulation of the tank model.}
\label{fig:tankModel}
\end{figure}
```

To summarize, we have learned a number of things from this exercise. First, models include assumptions and simplifications, and it is the careful selection of these that marks a good model from a bad one. The assumptions in this model include: 1) We assume low flow rates such that Torrielli's Law is a reasonable approximation; 2) The flows $Q_1$ and $Q_4$ are constant. The other thing we have learned is that there are at least four different types of quantities in the model. We will go into more detail in the next section but for now, we can briefly indicate what these quantities are ([Table: Different quantities for the two talk model](#tbl-twotank)):

- Inputs to the system such as $Q_1$.
- Model variables which include the two heights, $h_1$ and $h_2$, which change in time as the system evolves.
- A number of physical parameters which are fixed during the study of the model but which we could in principle change. In the tank model these include the volume, cross-sectional area of each tank, and the diameter of the outflow pipes.
- Finally, there are parameters which we cannot change such as the force of gravity.

**Table** <a id="tbl-twotank"></a> `tbl:TwoTank`

*Caption:* Different quantities for the two talk model.

```latex
\begin{table}
\centering
\begin{tabular}{ll} \toprule
Quantity & Type \\ \midrule
$h_1$, $h_2$ & Variables \\
$Q_1$, $Q_4$ & Inputs \\
$K_1$, $K_2$ & Parameters \\
$g$  & Absolute Constant \\ \bottomrule
\end{tabular}
\caption{Different quantities for the two talk model.}
\label{tbl:TwoTank}
\end{table}
```

## Variables, Parameters and Absolute Constants

Figure [Figure: Classification of quantitative terms](#fig-classificationofquantities) classifies the different kinds of quantities we find in a model. These include absolute constants, parameters, inputs, dependent variables, independent variables and outputs.

This is a long list so a concrete example will help better explain each quantity. Consider the following simple pathway model:

$$
\begin{equation}
\text{X}_o \stackrel{v_1}{\longrightarrow} \text{S}_1 \stackrel{v_2}{\longrightarrow} \text{S}_2 \stackrel{v_3}{\longrightarrow} \text{X}_1
\label{sys:linear3Steps}
\end{equation}
$$

The rate laws are given by:

$$
\begin{align*}
v_1 &= k_1 X_o \\
v_2 &= k_2 S_1 \left( 1 - \frac{S_2/S_1}{e^{-\Delta G^o/RT}} \right) \\
v_3 &= k_3 S_2
\end{align*}
$$

where $\Delta G^o$ is the standard free energy, $R$ the gas constant, and $T$ the temperature. Note that $e^{-\Delta G^o/RT}$ equals the equilibrium constant, $K_{eq}$, see equation ([[02_kinetics_in_a_nutshell|Chemical Equilibrium]]). We will make a number of assumptions: i) The reactions take place in a constant unit volume at a constant temperature. ii) Species $X_o$ and $X_1$ are fixed by some external and unspecified process. iii) Reactions occur in well-stirred volumes. Let us list each type of quantity in this model:

##### Absolute Constants

The absolute constants in a model include Napier's constant $e$, and the gas constant, $R$. Absolute constants cannot typically be changed by the experimenter.

##### Parameters

The parameters of a model are those quantities which could, in principle, be changed by the experimenter but which *remain constant* when the model is used to make predictions. In the pathway model one can imagine that the $\Delta G^o$ and the reaction rate constants are parameters. However, these particular parameters are not easily changed. It might be possible to change them by altering the ionic composition, the solvent, or temperature. Usually however we treat kinetic and thermodynamic parameters as absolute constants. The exception to this is if the reactions are enzyme catalyzed. In this case one could change the enzyme concentration or through site-direct mutagenesis, change the enzyme kinetic properties.

##### Inputs

The inputs to the system are those quantities which are under direct control of the experimenter and can conceivably be changed by the experimenter during the course of a model simulation. In the pathway model, the inputs include $X_o$ and $X_1$. Other examples of inputs include nutrient sources, temperature, enzyme concentrations, and any kind of external effector such as a drug or inhibitor.

In biology the inputs are often clamped to some fixed values (*cf.* voltage clamp), but can also be varied in some controlled way by the experimenter. The clamping mechanism can simply be a large external reservoir so that any exchange of mass between the system and the external reservoir has a negligible effect on the external concentration. Alternatively, there may be active mechanisms maintaining an external concentration. A classic example of active maintenance of an external variable is the voltage clamp used in electrophysiology.

External concentrations may also change slowly in time compared to the timescale of the model so that over the study period, the external concentrations change very little. A typical example is the study of a metabolic response over a timescale that is shorter than change in gene expression. This permits a modeler to study a metabolic pathway without considering the effect of changes in gene expression.

The external species inputs such as $X_o$ are also called **boundary variables** because they are considered to be at the boundary of the system.

\stateEquation{
Molecular species that are not dependent on the action of the model are sometimes called **boundary species**. Often boundary species are fixed by the modeler but it is possible for the modeler to impose a particular change in a boundary species to simulate, for example the adminstration of a drug as a bolus or as a continuous infusion.
}

##### Dependent Variables

The dependent variables, also called the **state variables**, are the minimum set of variables to describe the state of a system. In biochemical modeling these variables often include the concentrations of molecular species or voltages across membranes. In the pathway model (Figure [Variables, Parameters and Absolute Constants](#sys-linear3steps)), the two dependent variables are $S_1$ and $S_2$. The distinguishing feature that separates the input variables from the dependent variables is that while the inputs can be directly controlled by the model observer, the only way the dependent variables can change is through the operation of the model itself, i.e. they depend on the model. In biochemical modeling the dependent variables are also called **floating species**.

\stateEquation{
Molecular species that change in time as a result of the action of the model are sometimes called **floating species**.
}

The distinction between the inputs and the dependent variables is important. Once the choice is made, the separation is strictly adhered to during the course of a study. This means for example that the environment surrounding the physical system will, *by definition*, be *unaffected* by the behavior of the system. If for some reason parts of the environment do change as a result of the system and can in turn affect the system in some way, then these parts must now be considered part of the system.

\stateComment{
The state of a system at time $t$ is described by a set of **state variables**:

\[ \bvx (t) \]

They are the smallest set of variables that define the state of the system.
}

##### Independent Variables

There are two main independent variables in biochemical modeling: time and space. In this book we will be mainly concerned with time dependent and not space dependent models.

##### Outputs

The outputs are the readouts from the model, and are the quantities that an experimenter can actually measure. The outputs are sometimes no different from the dependent variables, particularly in a computer model. Experimentally however, there are times when it is not possible to measure a particular dependent variable or when a derived measurement is required or measured. For example, we will often report the pH rather than the actual hydrogen ion concentration. In the case when we cannot make a direct measurement, we instead use a proxy, for example a fluorescence measurement or another molecular marker that follows the variable of interest. In the case of derived quantities, a very common one is the pathway flux. We will not cover this in great detail in this book, but separating the outputs from the independent variables is an important part of classical control and metabolic control theory.

**Table**

*Caption:* Synonyms for internal and external variables.

```latex
\begin{table}
\centering
\begin{tabular}{ll}\toprule
Internal Variable & External Variable \\\midrule
State variable & Inputs \\
Dependent variable & Independent variable \\
Floating variable (species) & Boundary variable (species) \\ \bottomrule
\end{tabular}
\caption{Synonyms for internal and external variables.}
\end{table}
```

**Figure** <a id="fig-classificationofquantities"></a> `fig:ClassificationOfQuantities`

*Graphic (not in the LaTeX source, referenced by name): `ClassificationOfQuantities`*

*Caption:* Classification of quantitative terms.

```latex
\begin{figure}[htb]
\centering
  \includegraphics[scale = 0.6]{ClassificationOfQuantities}
  \caption{Classification of quantitative terms.}
  \label{fig:ClassificationOfQuantities}
\end{figure}
```

## Mathematical Descriptions of Models

There are many different ways to represent models using mathematics. We must describe for example how the variables and parameters in the system will be represented. Two common representations include **discrete** or **continuous** variables. The change in the level of water in a tank is reasonably described using a continuous variable such as height. On the other hand, it might be more realistic to describe the dynamics of lion predation on the Serengeti using a discrete model where individual lions are represented. It does not make much sense to refer to 8.67 lions in a model. The choice of whether to use a discrete or continuous  description depends entirely on the system being studied and the questions posed.

Another important categorization is whether the model should be represented in a **deterministic** or **stochastic** form. A deterministic model is one where if we repeated the simulation using the same starting conditions, we would get exactly the same result again. That is, the future state of the model is completely determined by its initial starting point. The model of the water tanks filling up is an example of a deterministic model.

\stateComment{
A **discrete variable** is one that cannot take on all values within a given numeric range. For example, the number of airplanes in the sky at any one time is a discrete number. In statistics this is generalized further to a finite set of states, such as true/false or combinations in a die throw.

**Continuous variables** can assume all values within a given numeric range. For convenience we will often represent a measurement as a continuous variable. For example, we may use a continuous variable such as the mole to represent the concentration of a solute as it is unwieldy to refer to the concentration of a solute as 5,724,871,927,315,193,634,656 molecules per liter.
}

A stochastic model is not deterministic, that is running a simulation of a stochastic model with the same initial conditions will *not* lead to the same outcome. The reason for this is that processes in a stochastic model are probabilistic. For example, whether a chemical reaction will occur or not during a set time period is given by a probability. This is reasonable since at the molecular level, collisions between molecules are unpredictable.

Each step in a stochastic simulation is determined by one or more random processes. To give an example, modeling lion predation on the Serengeti could be modeled as a stochastic process. It is not guaranteed that a lion will catch its prey every time, instead there is a probability it will succeed. To model this process a computer simulation would throw a die to determine whether the lion had succeeded or not. Repeatedly running such a simulation would naturally give a slightly different outcome because the die throws would be different for each run.

A deterministic model based on ordinary differential equations assumes a continuum of values for concentration. This ignores the fact that cellular processes operate at the molecular level and concentrations can be described using discrete values representing the number of molecules. However, because we often deal with systems containing tens of thousands of particles, we assume that we can describe concentration as a continuous variable and therefore differential equations are an appropriate choice. For systems where the particulate number is very low, of the order of tens of particles, the use of a continuum measure might be unreasonable.

\stateComment{
A **deterministic model** is one where a given input will always produce the same output. For example, in the equation $y = x^2$, setting $x$ to 2 will always yield the output $4$.

A **stochastic model** is one where the processes described by the model include a random element. This means that repeated runs of a model will yield slightly different outcomes.
}

However, an additional and more important problem arises when dealing with low particulate numbers. At low concentrations, Brownian motion becomes a significant factor in determining reaction rates. The time when a molecule binds or is transformed becomes a probabilistic property. Models of systems containing low particulate numbers are therefore better modeled using a stochastic, discrete approach [WilkinsonBook2012, SauroBookOne:2012].

We can now classify a model as a combination of attributes. The water tank model uses a deterministic, continuous approach. The model of the lion population on the Serengeti uses a discrete and stochastic approach. Table [Table: Examples of different kinds of  model](#tbl-modeltypes) shows four possible combinations and examples where each combination might be appropriately used.

**Table** <a id="tbl-modeltypes"></a> `tbl:ModelTypes`

*Caption:* Examples of different kinds of  model.

```latex
\begin{table}[htb]
\centering
\begin{tabular}{ll}\toprule
Type & Example \\ \midrule
Continuous/Deterministic & Projectile motion \\
Continuous/Stochastic & Brownian motion \\
Discrete/Deterministic & Large population dynamics \\
Discrete/Stochastic & Small population dynamics \\ \bottomrule
\end{tabular}
\caption{Examples of different kinds of  model.}
\label{tbl:ModelTypes}
\end{table}
```

### Forcing Functions

As described earlier, it is common to ensure that the surroundings do not change during the duration of the study. For example, we might make sure that the pH remains constant by using a buffer solution. The key point is that the experimenter has control over the experiment. In some cases it is useful for an experimenter to change the surrounding conditions in a controlled fashion. For example, he/she might slowly increase the concentration of an administered drug or make a step change in a variable such as enzyme concentration. In systems theory such controlled changes are often called **forcing functions**.

<!-- \subsection*{Intensive and Extensive Properties}\index{intensive property}\index{extensive property} -->

<!-- In science a distinction is made between physical quantities termed intensive and extensive. An intensive property is a physical quantity whose value does not depend on the size of the system. Examples include pressure, density, concentration, and temperature. An extensive property is a physical quantity whose value does depend on the size of the system. Examples include mass, volume, energy, and entropy. -->

**Figure** <a id="chap1-systemfigure"></a> `chap1:SystemFigure`

*Caption:* System and Environment: $S_1, S_2, S_i, ...$ are state variables that may
change during the evolution of the system; $B_1, B_2, B_i, ...$ are boundary
variables that are clamped to certain values by the observer. The exchange arrows represent
the exchange of mass between the environment and system.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}
  \draw[rounded corners=6pt] (0pt,0pt) rectangle (84pt,112pt);
  \draw (16pt,8pt) node[anchor=west] {System};
  \draw (16pt,56pt) node[anchor=west] {$\text{S}_1, \text{S}_2, \text{S}_\text{i}, \ldots$};
  \draw (-72pt,112pt) node[anchor=west] {Environment};
  \draw (-72pt,96pt) node[anchor=west] {$\text{B}_1, \text{B}_2, \text{B}_\text{i}, \ldots$};

  \draw[->,very thick] (-15pt,80pt) -- (18pt,80pt);
  \draw[<-,very thick] (-15pt,74pt) -- (18pt,74pt);
\end{tikzpicture}
\end{center}
\caption{System and Environment: $\text{S}_1, \text{S}_2, \text{S}_\text{i}, \dots$ are state variables that may
change during the evolution of the system; $\text{B}_1, \text{B}_2, \text{B}_\text{i}, \dots$ are boundary
variables that are clamped to certain values by the observer. The exchange arrows represent
the exchange of mass between the environment and system.}
\label{chap1:SystemFigure}
\end{figure}
```

## Example

Figure [Figure: A simplified glycolytic pathway](#fig-glycolysisfigure) illustrates a simplified model of glycolysis. The corresponding Table [Table: Variables and parameters for the simplified glycolytic model \ref{fig:](#tbl-glycolysistable) lists the different variables and parameters identified in the model. The concentration of glucose and ethanol are assumed to be boundary variables, controlled by the observer and classified as inputs. Control can be arranged by supplying glucose from a large volume compartment so that during its consumption there is only a negligible change in concentration. Likewise, we assume that ethanol is discharged into a large volume.

Another set of concentrations assumed to be constant are the NAD and NADH cofactors. This may be an unreasonable assumption to make however, because we know that the redox potential can change. We must assume that the model builder has good reason for making this assumption and will make this explicit when the model is formally published. The model builder must be specific about these decisions and explain why they were made. Such choices are necessary when building models and great care should be made when making them. One simple way to justify this assumption is that if the model adequately predicts experiments of interest to the experimenter, then it seems reasonable that a floating redox potential is not important. However as demands on the model to make further predictions increase, there may come a time when the model fails to make a correct prediction, and assumptions such as the fixed redox potential need to be revisited.

**Figure** <a id="fig-glycolysisfigure"></a> `fig:GlycolysisFigure`

*Caption:* A simplified glycolytic pathway. Many reactions have been condensed and ATP
consumption has been simplified to a single process, $ATP \rightarrow ADP + Pi$.

```latex
\begin{figure}[htbp]
\begin{center}
\begin{tikzpicture}
  \draw (0pt,50pt) node[anchor=west] {\sffamily Glucose};
  \draw (64pt,50pt) node[anchor=west] {\sffamily F-16-BisP};
  \draw (136pt,50pt) node[anchor=west] {\sffamily G3P};
  \draw (186pt,50pt) node[anchor=west] {\sffamily Pyruvate};
  \draw (256pt,50pt) node[anchor=west] {\sffamily Ethanol};

  \draw[-stealth,thick] (42pt,50pt) -- (64pt,50pt);
  \draw[-stealth,thick] (42pt,30pt) .. controls (50pt,56pt) and (50pt,56pt) .. (64pt,30pt);
  \draw (28pt,22pt) node[anchor=west] {\sffamily ATP};
  \draw (58pt,22pt) node[anchor=west] {\sffamily ADP};

  % F16Bis -> G3P
  \draw[-stealth,thick] (116pt,50pt) .. controls (132pt,50pt) and (120pt,50pt) .. (136pt,56pt);
  \draw[-stealth,thick] (116pt,50pt) .. controls (132pt,50pt) and (120pt,50pt) .. (136pt,42pt);

  % G3P to Pyruvate
  \draw[-stealth,thick] (164pt,50pt) -- (184pt,50pt);
  \draw[-stealth,thick] (162pt,66pt) .. controls (172pt,45pt) and (172pt,45pt) .. (188pt,66pt);
  \draw (140pt,72pt) node[anchor=west] {\sffamily NAD};
  \draw (176pt,72pt) node[anchor=west] {\sffamily NADH};

  \draw[-stealth,thick] (162pt,30pt) .. controls (172pt,56pt) and (172pt,56pt) .. (188pt,30pt);
  \draw (178pt,22pt) node[anchor=west] {\sffamily 2ATP};
  \draw (142pt,22pt) node[anchor=west] {\sffamily 2ADP};

  % Pyruvate to Ethanol
  \draw[-stealth,thick] (235pt,50pt) -- (256pt,50pt);
  \draw[-stealth,thick] (235pt,66pt) .. controls (242pt,45pt) and (242pt,45pt) .. (258pt,66pt);
  \draw (216pt,72pt) node[anchor=west] {\sffamily NADH};
  \draw (254pt,72pt) node[anchor=west] {\sffamily NAD};

  // ATP -> ADP hydrolysis
  \draw[-stealth,thick] (120pt,-10pt) -- (150pt,-10pt);
  \draw (90pt,-10pt) node[anchor=west] {\sffamily ATP};
  \draw (150pt,-10pt) node[anchor=west] {\sffamily ADP + Pi};
\end{tikzpicture}
\end{center}
\caption{A simplified glycolytic pathway. Many reactions have been condensed and ATP
consumption has been simplified to a single process, $\text{ATP} \rightarrow \text{ADP} + \text{Pi}$.}
\label{fig:GlycolysisFigure}
\end{figure}
```

The modeler also makes an assumption about ATP. Since glycolysis is an important pathway for generating ATP, some way to simulate ATP consumption is necessary. This is achieved by including a single step that hydrolyzes ATP to ADP, even though we know that ATP consumption is a complex process involving many separate reactions. The response of the pathway to changing ATP demand can be simulated by perturbing the ATP demand step.

We know that the number of molecules involved in glycolysis is huge, of the order of 100,000 to millions. We can therefore safely use a continuous, deterministic model, most likely based on a set of differential equations.

**Table** <a id="tbl-glycolysistable"></a> `tbl:GlycolysisTable`

*Caption:* Variables and parameters for the simplified glycolytic model [Figure: A simplified glycolytic pathway](#fig-glycolysisfigure). We assume that
glucose and ethanol are clamped by the observer using large volume sinks. We assume that
during the period of study, the concentrations of NAD and NADH remain essentially unchanged.
F-16-BisP = Fructose-1,6-bisphosphate; G3P = Glyceraldehyde-3-Phosphate; Pi = Phosphate.

```latex
\begin{table}
\begin{center}
\begin{tabular}{lll} \\\toprule
State Variables & System Parameters & Boundary Variables/Inputs \\ \midrule
F-16-BisP & Kinetic Constants & Glucose \\
G3P & Enzyme Activities  & Ethanol \\
Pyruvate & Volume & NAD \\
ATP & Temperature & NADH \\
ADP & & Pi \\ \bottomrule
\end{tabular}
\caption{Variables and parameters for the simplified glycolytic model~\ref{fig:GlycolysisFigure}. We assume that
glucose and ethanol are clamped by the observer using large volume sinks. We assume that
during the period of study, the concentrations of NAD and NADH remain essentially unchanged.
F-16-BisP = Fructose-1,6-bisphosphate; G3P = Glyceraldehyde-3-Phosphate; Pi = Phosphate.}
\label{tbl:GlycolysisTable}
\end{center}
\end{table}
```

The assumptions made in building this model may appear to be completely unreasonable, but one sure test is to determine how well the model reproduces what is currently know about the system and whether it makes useful predictions that can be further tested. If either of these tests fail, then we know that the assumptions about the model need amendment.

There is one final and important point to make. It is easy to look at a model and suggest that it is unrealistic because it misses out certain features. However a model should only be judged by how useful it is, not by how many details it incorporates. This is a common error made by those who are new to modeling.

\stateComment{
The realism of a model can only be judged with respect to its purpose and utility.
}

### Steps in Building a Model

To summarize, we can break down the approach to building a model into five stages:

- Define the system boundaries.

- Define the simplifying assumptions.

- Invoke physical laws to describe the system processes.

- Test (validate) the model against experimental data.

- Alter model if necessary and repeat.

<!-- \subsection*{Different Ways to Represent Physical Models} -->

<!-- The tank model described in section~\ref{subsec:tankModel} was built using a set of ordinary differential equations (ODEs). Solutions to these equations can be obtained using software running on a digital computer. There are however many other ways to build and find solutions to models. Table~\ref{tbl:ModelRealization} lists some of the more common and interesting approaches that people have used in the past. -->

<!-- \begin{longtable}{ll} -->
<!-- \caption{Different ways to construct and solve physical models.}\label{tbl:ModelRealization} \\ \toprule\\ -->
<!-- Electrical Circuits & General purpose analog computer~\cite{WikiAnalogComputer} \\ -->
<!-- & WWII V2 guidance system~\cite{WikiV2} \\ -->
<!-- & Neuromorhpic electronics~\cite{boahen2005neuromorphic,MITBrainInSilicon} \\ -->
<!-- & \\ -->
<!-- Mechanical and Fluid &  Slide rule~\cite{WikiSlideRule} \\ -->
<!-- &  Curta~\cite{WikiCurta} \\ -->
<!-- &  Tide predicting machine~\cite{WikiTidePredictingMachine} \\ -->
<!-- &  Computing projectile trajectories~\cite{WikiRangeKeeper} \\ -->
<!-- & Differential analyzer (solves ODEs)~\cite{WikiDifferentialAnalyser} \\ -->
<!-- & Antikythera mechanism (planetary motion)~\cite{WikiAntikythera} \\ -->
<!-- & Water tanks - MONIAC economic model~\cite{WikiMoniac} \\ -->
<!-- & \\ -->
<!-- Purely Mathematical & Algebraic equations \\ -->
<!-- & Linear differential equations \\ -->
<!-- & Linear difference equations \\ -->
<!-- & Partial differential equations \\ -->
<!-- & Probabilistic models \\ -->
<!-- & Statistical models \\ -->
<!-- & \\ -->
<!-- Digital Computer & Solving ODEs and PDEs \\ -->
<!-- & Agent based models (multicellular systems~\cite{graner1992simulation}) \\ -->
<!-- & Cellular automata~\cite{WikiCellularAutomata} \\ -->
<!-- & Emergent systems (Ant models)~\cite{WikiEmergentSystems} \\ -->
<!-- & Fractal models~\cite{WikiFactals} \\ -->
<!-- & Neural networks~\cite{WikiNeuralNetworks} \\ \bottomrule -->
<!-- \end{longtable} -->

## Dimensions and Units

The variables and parameters that go into a model are expressed in some standard of measurement. In science the recognized standard for units are the SI units. These include units such as the *meter* for length, *kilogram* for mass, *second* for time, *Joules* for energy, *kelvin* for temperature and the *mole* for amount. The mole is of particular importance because it is a means to measure the number of particles of substance irrespective of substance mass. Thus 1 mole of glucose has the same number of molecules as 1 mole of the enzyme glucose-6-phosphate isomerase even though the mass of each type of molecule is quite different. The actual number of particles in 1 mole is defined as the number of atoms in 12 grams of carbon-12 which has been determined empirically to be $6.0221415 \times 10^{23}$ (Avogadro's constant). This definition means that 1 mole of substance will have a mass equal to the molecular weight of the substance, making it easy to calculate the number of moles using the following relation:

$$ moles = \frac{mass}{molecular weight} $$

The concentration of a substance is expressed in moles per unit
volume and is usually termed molarity. Thus a 1 molar solution
means 1 mole of substance in 1 liter of volume.

### Dimensional Analysis

Dimensional analysis is a simple but effective method for uncovering
mistakes when formulating kinetic models.

Amounts of substance is usually expressed in moles and concentrations
in moles per unit volume ($mol l^{-1}$). Reaction rates can be
expressed either in concentrations or amounts per unit time depending
on the context ($mol t^{-1}$, $mol l^{-1} t^{-1}$).

Rate constants are expressed in differing units depending on the form of the
rate law. The rate constants in simple first-order kinetics are expressed in
per unit time ($t^{-1}$), while in second-order reactions the rate constant
is expressed per concentration per unit time ($mol^{-1} t^{-1}$).

In dimensional analysis, units on the left and right-hand sides of expressions must
be the same units (or dimensions). There are certain rules for combining
units when checking consistency in units. Only like units can be added or
subtracted, thus the expression $S + k_1$ cannot be summed because the units
of $S$ are likely to be $mol l^{-1}$, and the units for $k_1$, $t^{-1}$.
Even something as innocent looking as $1 + S$ can be troublesome because $S$ has
units of concentration but the constant value `1' is unitless. 
<!-- different units can be multiplied or divided where the units for the overall -->
<!-- expression computed are using the laws of exponents and treating the unit symbols as -->
<!-- variables.\index{unit balancing} -->

**Example**

Determine the overall units for the expression $k_1 S/K_m$ where the units for each
variable are $k_1 (t^{-1} l$), $S (mol l^{-1}$), and $K_m (mol l^{-1}$).

We first write out the expression in terms of the individual units:

$$ t^{-1} l mol l^{-1}/ (mol l^{-1}) $$

By treating the symbols as algebraic variables, we see that the symbol mol $l^{-1}$ will cancel leaving just:

$$ t^{-1} l $$

The term in the exponential must be dimensionless. The term $e^{kt}$ is permissible, but $e^{k}$ is not if, for example, $k$ is a first-order rate constant. Trigonometric functions will always resolve to dimensionless quantities because the argument will be an angle. Angles can always be expressed as a ratio of lengths which will, by necessity, have the same dimension.

## Classification of Models

In addition to classifying models as discrete/continuous and deterministic/stochastic, there are additional properties of models that can be used for further categorization (Table [Table: Additional categories for classifying models](#tbl-additionalmodelcategories)).

**Table** <a id="tbl-additionalmodelcategories"></a> `tbl:AdditionalModelCategories`

*Caption:* Additional categories for classifying models.

```latex
\begin{table}[htb]
\centering
\begin{tabular}{l} \\ \toprule
Linear or Nonlinear\\
Dynamic or Static\\
Time invariant or time dependent\\
Lumped or distributed parameter models \\ \bottomrule
\end{tabular}
\caption{Additional categories for classifying models.}
\label{tbl:AdditionalModelCategories}
\end{table}
```

<!-- \begin{figure}[htb] -->
<!-- \centering -->
<!-- \includegraphics[scale = 0.6]{linearNonLinearCurves} -->
<!-- \caption{Linear and Non-Linear Curves} -->
<!-- \label{fig:linearNonLinearCurves} -->
<!-- \end{figure} -->

### Dynamic and Static Models

A static model is one where the variables of the system do not change in time. For example, a circuit made up of only resistors can be modeled as a static system because there are no elements in the circuit that can store or dissipate charge. The currents and voltages are considered instantaneous without any time evolution. Static systems are therefore unaffected by time and as such they are simpler to model. A flux balance or constraint based model [PalssonBook:2007] is an example of a static model in biochemical modeling.

### Time Invariant Systems

All the models we will consider in this book will be dynamic models, that is proteins or metabolite levels change over time. In these cases time is acting as an independent variable and means that running the model at a start time of $t=0$ or $t=10$ makes no difference to the time evolution of the model. All that matters are the initial conditions we set to the state variables and the values we assign to the parameters and inputs. Such models are called **time invariant**.

If a parameter of the system depends on time, then the model is called time dependent. This means that the system will behave differently if the same input is applied at different times. An example of a time dependent model is where we apply a drug in the form of a pulse and the duration of the pulse depends on when the drug was administered. An example of a time dependent non-biological model is a parking lot where the price of a ticket depends on the time of day. Those systems which are linear and time invariant represent a special category of system called linear time invariant systems (LTI). Such systems will be covered in greater detail in a subsequent book.

### Lumped and Distributed Parameter Models

Many complex models can be approximated with a single number. For example, we often describe a resistor using a single value, its resistance. In reality the resistor has a length, a diameter, and a chemical composition. The resistance is a function of all these properties that make up the resistor. We could model the resistor by slicing up the resistor into many small compartments and compute the resistance as a systemic property. In the former case we have what is called a lumped parameter model, in the second case a distributed parameter model.

## Linear and Nonlinear Models

When we use mathematics to describe physical systems, there is a great divide that separates **linear** from **nonlinear models**. This separation is fundamental and places hard limits on what we can and cannot do with mathematical analysis.

Inputs to a linear system result in their weighted sum appearing in the outputs. The output is a superposition of the inputs. The simplest linear system is given by the relation $y = a x$, where $x$ is the input and $y$ the output. We know this is linear for the following reason. Let us apply two separate inputs, $x_1$ and $x_2$ to this system. This gives us outputs $a x_1$ and $a x_2$, respectively. If we now apply the sum of the inputs, $x_1 + x_2$, we get $a (x_1 + x_2)$ as the output, which is simply the sum of the separate inputs.

$$ a x_1 + a x_2 = a (x_1 + x_2) $$

This is called the property of **additivity** and can be generalized as follows. A mathematical model, $f (x)$, shows additivity if the following is true:

$$ f (x_1 + x_2 + ... ) = f (x_1) + f(x_2) + ... $$

This states that the sum of multiple inputs applied simultaneously is equivalent to applying the inputs separately. Nonlinear systems do not follow this rule. Strictly speaking, a linear system also needs to satisfy **homogeneity** (or scaling), that is, $f(a x) = a f (x)$. Combining additivity and homogeneity gives us the general rule of linearity called **superposition**:

\stateEquation{
$$ f (a x_1 + b x_2 + ... ) = f (a x_1) + f(b x_2) + ... $$

}

Any system that satisfies superposition is a linear system. Any system that does not is a nonlinear system. Table [Table: Examples of nonlinear functions](#tbl-nonlinearfunctions) illustrates some functions that are nonlinear.

**Table** <a id="tbl-nonlinearfunctions"></a> `tbl:nonlinearFunctions`

*Caption:* Examples of nonlinear functions.

```latex
\begin{table}[htb]
\begin{center}
\begin{tabular}{ll}\toprule
$x^n$ & \hspace{12pt} $\sqrt[n]{x}$ \\[2pt]
$x y$ & \hspace{12pt} $\sin (x)$    \\[2pt]
$e^x$ & \hspace{12pt} $\log (x)$    \\[2pt]
$(\dy/\dy)^n$ & \hspace{12pt} $V_m S/(S + K_m)$ \\ \bottomrule
\end{tabular}
\caption{Examples of nonlinear functions.}
\label{tbl:nonlinearFunctions}
\end{center}
\end{table}
```

**Example**
Show that the function $e^x$ is nonlinear.

We first apply separate inputs, $x_1$ and $x_2$, to the function and compute the sum of the output, that is:

$$ e^{x_1} + e^{x_2} $$

We next take the sum of the inputs, $x_1 + x_2$, and apply the sum to the function, that is:

$$ e^{x_1 + x_2} $$

To obey additivity the two expressions much be equal. However, $e^{x_1 + x_2} = e^{x_1} e^{x_2}$ which is not the same
as $e^{x_1} + e^{x_2} $. Therefore $e^x$ is a nonlinear function.

Similarly, we can also easily show that homogeneity ($f(a x) = a f (x)$) is not true because it should be evident that:

$$ a e^x \neq e^{a x} $$

To appreciate the difference between linear and nonlinear functions, consider the system $y = x^2$. Let us apply two separate inputs, $x_1$ and $x_2$, to give outputs $x_1^2$ and $x_2^2$. If we now apply the inputs simultaneously, that is $y = (x_1 + x_2)^2$, we obtain $x_1^2 + x_2^2 + 2 x_1 x_2$. We see that the output is not simply $x_1^2 + x_2^2$ but includes an additional term, $2 x_1 x_2$. This term is the nonlinear contribution. Imagine that this difference now enters further nonlinear processes, leading to further changes. Eventually the output looks nothing like the input. This makes most nonlinear systems difficult to understand.

Unless the system has an infinite number of solutions (degenerate) or has the trivial solution (where the solution is zero), linear systems will admit only one solution. In contrast, it is possible for nonlinear systems to admit multiple solutions, that is given a single input, a nonlinear system can admit one of a number of possible distinct outputs. To make matters worse, in the majority of mathematical models found in biochemical networks, it is not even possible to find the solutions analytically. That is, we cannot mathematically describe how an output depends on an input other than by doing a brute-force computer simulation. Understanding nonlinear systems in biology or elsewhere is a huge unresolved problem. While there is a complete theory of linear systems, no such equivalent exists for nonlinear systems. When dealing with nonlinear systems we are often forced to use computer simulations.

There is one useful approach to help address nonlinear models. If we were to draw a nonlinear curve on a graph and zoom in closer to a particular point on the graph, the curve would eventually look like a straight line. We can essentially turn a nonlinear system into a linear one but only in small regions of the system's behavior where linearity dominates. This process is called **linearization** and is a powerful technique for studying nonlinear systems.

## Linearization

When modeling nonlinear systems we have two options, to simulate or to linearize. Simulation will be considered later, here we will look closely at a technique called linearization. To linearize a model means replacing the nonlinear version with a linear approximation which is easier to understand. It should be emphasized that in the process, we loose valuable information, but enough information is preserved to make linearization an extremely useful and popular tool.

One of the most useful results in mathematics is the **Taylor series** (See Appendix [[appendix_f_math_fundamentals|Math Fundamentals]] for a review). This is a way of approximating a mathematical function by using an infinite polynomial series such as the following:

$$
\begin{equation}
f(x) = c_o + c_1 x + c_2 x^2 + c_3 x^3 + \ldots
\label{eqn:infinitePolynomial}
\end{equation}
$$

We can represent any continuous function using such a polynomial. For example, we can represent sin(x) using the formula:

$$
\begin{equation}
\sin (x) = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots
\label{eqn:sinApprox}
\end{equation}
$$

Without going into the details, the Taylor series is a means for defining the $c_i$ terms in the polynomial series [Linearization](#eqn-infinitepolynomial) given any continuous function. The Taylor series is always defined around some operating point, $x_o$, and a point near the operating point, $x$. The Taylor series is given by:

\stateEquation{

$$
\begin{multline}
f(x) = f(x_o) + \frac{df}{dx}\biggr\rvert_{x_o} (x - x_o) + \frac{1}{2!} \frac{d^2 f }{d x^2}\biggr\rvert_{x_o} (x - x_o)^2 \\[9pt]
+ \ldots + \frac{1}{n!} \frac{d^n f }{d x^n}\biggr\rvert_{x_o} (x - x_o)^n + \ldots
\end{multline} }
$$

All derivatives must be evaluated at the operating point $x_o$.

<!-- What the Taylor series does is define what the constants, $c_i$, in equation~\ref{eqn:infinitePolynomial} represent. It is not too difficult to show that the $c_i$ terms other than $c_o$ are the derivatives of the function, $f(x)$, that is $c_1 = \df/dx$,\ $c_2 = (\partial^2\!f / \partial x^2)/2!$ and so on. The term $c_o$ represents the value of $f(x)$ around the point we define the series. If we define the series around $x_o$ then $c_o = f(x_o)$. In addition, the value of $x$ in the series will be the difference between the value we wish to evaluate the function at $x$, and the operating point, $x_o$. With these points in mind we can define the Taylor series of the function $f(x)$ about $x_o$ as the infinite series: -->

The various derivatives in the Taylor series **must** be evaluated at $x_o$. The function $f(x)$ must be continuous so there are no holes or sudden breaks (discontinuities) in the curve described by the function. The number of terms in the Taylor series determines how well the series approximates the function: the fewer terms, the more approximate the series is. For example, the most approximate expression is given by using only the first term, $f(x_o)$. However, $f(x_o)$ is a constant so this represents a very poor approximation. To make the approximation more useful we include the first two terms of the Taylor series:

\stateEquation{

$$
\begin{equation}
f(x) \approx f(x_o) + \frac{df}{dx}\biggr\rvert_{x_o} (x - x_o)
\label{eqn:TaylorTruncated}
\end{equation} }
$$

Provided $x$ is close to $x_o$, the approximation is good. Note that the derivative must be computed at the operating point, $x_o$. For example, let us form the Taylor series for the function $y = \sin (x) $ around $x_o = 0$.  Recall that $\sin (0) = 0$ and $\cos (0) = 1$, then write out the Taylor series:

$$ y \approx \sin (0) + \frac{d\!\sin (x)}{dx}\biggr\rvert_{x_o} (x - 0) + \frac{1}{2!} \frac{d^2 \sin(x)}{dx^2}\biggr\rvert_{x_o} (x - 0) + ... $$

$$ y \approx 0 + 1 x + 0 - \frac{1}{3!}x^3 + 0 + \frac{1}{5!} x^5 + ... $$

That is:

$$ y \approx x - \frac{x^3}{3!} + \frac{x^5}{5!} - ... $$

Note this is the same as equation [Linearization](#eqn-sinapprox). The linear approximation is given by the first two terms:

$$
\begin{equation*}
y \approx \sin (0) + \frac{d\!\sin (x)}{dx}\biggr\rvert_{x_o} (x - 0)
\end{equation*}
$$

Since $\sin (0) = 0$ and $d\!\sin (x)/dx = \cos (0) = 1$, the linear approximation is therefore $y = x$, a straight line running through the origin (Figure [Figure: Linearized $\sin(x)$ function at $x_o = 0$, represented by the straigh](#fig-linearizedsin)). We have linearized the $\sin$ function and Figure [Figure: Linearized $\sin(x)$ function at $x_o = 0$, represented by the straigh](#fig-linearizedsin) shows how good our approximation is.With only two terms the linear approximation only matches a region near $x_o$ and fails to capture the periodic nature of the $\sin$ curve.

**Figure** <a id="fig-linearizedsin"></a> `fig:linearizedSin`

*Caption:* Linearized $\sin(x)$ function at $x_o = 0$, represented by the straight line through zero.

```latex
\begin{figure}
\begin{center}
\begin{tikzpicture}
\begin{axis}[
axis y line=center,
axis x line=middle,
xtick=\empty,
xticklabels={,,},
grid=major,
xmin=-450,
xmax=450,
ymin=-2.5,
ymax=2.5,
width=9cm,
height=7cm]
\addplot[color=blue,line width=1pt] expression[domain=-360:360,samples=100]{sin(x)};
\addplot[color=red,line width=1pt] expression[domain=-130:130,samples=10]{rad(x)};
\end{axis}

\end{tikzpicture}
\caption{Linearized $\sin(x)$ function at $x_o = 0$, represented by the straight line through zero.}
\label{fig:linearizedSin}
\end{center}
\end{figure}
```

To illustrate linearization with another example, consider the simple nonlinear function, $y = x^2$. To linearize we must first choose an operating point around which to linearize, for example, $x_o=2$. According to the second term in the Taylor series we need to find the derivative, $d\!\!f/\dx$ so that the first two terms of the Taylor series (Equation [Linearization](#eqn-taylortruncated)) become:

$$ f(x) = f(2) + 2 x_o (x - 2) $$

To obtain the linear approximation we evaluate the derivative at the operating point ($x_o=2$), that is $d\!\!f/\dx = 2 x_o = 4$ so that the final linear approximation is:

$$ f(x) = 4 - 4 (x - 2) = 4x - 4 $$

Figure [Figure: Taylor series approximation of $y=x^2$ at the operating point, $x_o =](#fig-taylorapprox-x2) shows the original nonlinear function together with the linear approximation.

**Figure** <a id="fig-taylorapprox-x2"></a> `fig:TaylorApprox_x2`

*Caption:* Taylor series approximation of $y=x^2$ at the operating point, $x_o = 2$. The linear approximation is $y = 4 x - 4 $.

```latex
\begin{figure}[h]
\centering
\begin{tikzpicture}
\begin{axis}[
xlabel={$x$},
y label style={yshift=-0.2cm},
ylabel=$y$,
xmin=0,xmax=6,
ymin=-2,ymax=40,
grid=major,
width=8.5cm, height=6cm]

\addplot[color=red,line width=1.5pt] expression[domain=0:6,samples=400]{x^2};
%\addplot[color=blue,line width=1.5pt] expression[domain=0:8,samples=400]{4+2*x*(x-2)};
\addplot[color=blue,line width=1.5pt] expression[domain=0:6,samples=400]{4*x - 4};

\node at (axis cs:5,35) {\sffamily $y=x^2$};
\node at (axis cs:4.5,5) {\sffamily $y=4x - 4$};

\draw[thick] (axis cs:2,4) -- (axis cs:2,0);
\fill [orange] (axis cs:2,4) circle (2.5pt);

\end{axis}
\end{tikzpicture}

\caption{Taylor series approximation of $y=x^2$ at the operating point, $x_o = 2$. The linear approximation is $y = 4 x - 4 $.} \label{fig:TaylorApprox_x2}
\end{figure}
```

Equation [Linearization](#eqn-taylortruncated) is also commonly written in the form:

$$ f(x) \simeq f(x_o) + \frac{\df}{\dx}\biggr\rvert_{x_o} \delta x $$

<!-- $$ \delta f(x) = \frac{\df}{\dx} \delta x $$ -->

where $\delta x = (x - x_o)$. If the equation $f$ is a function of more than one variable, then additional terms appear. For example, the linearization of $f(x, y)$ near $x_o$ and $y_o$ will give:

\stateEquation{

$$
\begin{align}
 f (x, y) \approx f(x_o, y_o) + \frac{\partial f}{\partial x}\biggr\rvert_{x_o,y_o} \delta x + \frac{\partial f}{\partial y}\biggr\rvert_{x_o, y_o} \delta y
 \label{eqn:2DTaylor}
\end{align}
$$

}

As before, the derivatives must be evaluated at the operating point.

**Example**
<a id="exmp-linearize1"></a>
Linearize the following equation at $x_o = 2$:

$$ y = \frac{x^3}{x+1} $$

To linearize we must apply equation [Linearization](#eqn-taylortruncated). We first compute, $f(x_o)$. Since $x_o = 2$, then:

$$ f(x_o) = 8/3 $$

Next we form the derivative $\partial f/\partial x$:

$$ \frac{df}{dx} = \frac{2 x^3 + 3 x^2}{(x+1)^2} $$

At $x_o = 2$ the derivative is given by:

$$ \frac{df (2)}{dx} = \frac{28}{9} $$

Inserting $f(x_o)$ and the derivative into:

$$ f(x) \approx f(x_o) + \frac{df}{dx} (x - x_o) $$

yields:

$$ f(x) \approx \frac{8}{3} + \frac{28}{9} (x - x_o) = \frac{8}{3} + x \frac{28}{9} - \frac{56}{9} = \frac{28 x - 32}{9}  $$

**Example**
<a id="exmp-linearize2"></a>
Linearize the following equation at $x_o = 1$ and $y_o = 0$:

$$ f(x, y) = x^2 - 2 x y - \sin (y) $$

To linearize a two dimensional system we must apply equation [Linearization](#eqn-2dtaylor). We first compute, $f(x_o, y_o)$. Since $x_o = 1$ and $y_o = 0$, then:

$$ f(x_o, y_o) = 1 $$

Next we form the two derivatives $\partial f/\partial x$ and $\partial f/\partial y$:

$$ \frac{\partial f}{\partial x} = 2x - y \qquad \frac{\partial f}{\partial y} = -2x - \cos (y) $$

At $x_o = 1$ and $y_o = 0$ the derivatives are given by:

$$ \frac{\partial f (1,0)}{\partial x} = 2 \qquad \frac{\partial f (1,0)}{\partial y} = -3 $$

Inserting $f(x_o, y_o)$ and the derivatives into:

$$ f (x, y) \approx f(x_o, y_o) + \frac{\partial f}{\partial x} (x - x_o) + \frac{\partial f}{\partial y} (y - y_o) $$

yields:

$$ f(x, y) \approx 2 x - 3 y - 1 $$

## Approximations

By their very nature, models involve making assumptions and
approximations. The best modelers are those who can make
the most shrewd and reasonable approximations without compromising a
model's usefulness. There are however some kinds of approximations
which are useful in most problems, these include:

- Neglecting small effects.
- Assuming that the system environment is unchanged by the system itself.
- Replacing complex subsystems with lumped or aggregate laws.
- Assuming simple linear cause-effect relationships where possible.
- Assuming that the physical characteristics of the system do not change with time.
- Neglecting noise and uncertainty.

Let's review each of these in greater detail.

**Neglecting small effects.** This is the most common approximation to make. In many studies there will always be parts of the system that have a negligible effect on the properties of the system, at least during the period of study. For example, the rotation of the earth, the cycle of the moon, or the rising and setting of the sun will most likely have a negligible influence when studying the action of an enzyme. Assuming of course we are not studying circadian rhythms.

**Assuming that the system environment is unchanged by the system itself.** This is a basic assumption in any study. The minute a system starts to affect the environment in an uncontrolled way, we have effectively extended the system boundaries to include more of the environment. It will often be the case that the interface between the environment and the system will not be perfect so that there will be some effect that the system has on the environment. So long as this effect is small, we can assume that the environment is not affected by the system.

**Replacing complex subsystems with lumped or aggregate laws.** Lu\-m\-p\-ing subsystems is a commonly used technique in simplifying cellular models. The most important is the use of aggregate rate laws, such as Michaelis-Menten or Hill like equations to model cooperativity. Sometimes entire sequences of reactions can be replaced with a single rate law. Certain assumptions are invoked in making the aggregations, in particular it will often be assumed that the processes inside the aggregate are much faster then the processes external to the aggregate. We will return to this topic in Chapter [[05_differential_equation_models|Differential Equation Models]].

**Assuming simple linear cause-effect relationships.** In
some cases it is possible to assume a linear cause-effect between an
enzyme reaction rate and the substrate concentration. This is
especially true when the substrate concentration is below the $K_m$ of
the enzyme. Linear approximations make it much easier to understand a model.

**Physical characteristics do not change with time.**
A modeler will often assume that the physical characteristics of a
system do not change, for example the volume of a cell, the values
of the rate constants or the temperature of the system.

**Neglecting noise and uncertainty.** Most models make two important approximations. The first is that noise in the system is either negligible or unimportant. In many nonbiological systems such an approximation might be quite reasonable. However cellular phenomena operate at the molecular level. Biological systems are susceptible to noise generated from thermal effects as a result of molecular collisions. For many systems the large number of particles ensures that the noise generated in this way is insignificant and in most cases can be safely ignored. For some systems such as prokaryotic organisms, the number of particles can be very small. In such cases the effect of noise can be significant and therefore must be included as part of the model.
<!-- Chapter 3 will -->
<!-- cover in more detail the techniques employed to model systems where noise -->
<!-- is significant. -->

<!-- \section{Model Behavior} -->

<!-- Almost all physical systems exist in one of three dynamic states: -->

<!-- \begin{description} -->
<!-- \item[Thermodynamic Equilibrium] In this state the concentrations of -->
<!-- reactants and products show not net change over time; in addition, -->
<!-- the rates of all forward and reverse reactions are equal. This means -->
<!-- that at thermodynamic equilibrium there is no net movement of mass -->
<!-- from one part of the system to another and not net dissipation of -->
<!-- energy. In thermodynamics, equilibrium is the state that maximizes -->
<!-- the entropy of the system. -->

<!-- \item[Steady State] At steady state, the concentrations of -->
<!-- reactants and products show not net change over time; however, -->
<!-- unlike thermodynamic equilibrium there is a net flow of mass or -->
<!-- energy between the system and the environment. At steady state the system -->
<!-- will continually dissipate entropy to the external environment while the -->
<!-- entropy level of the system itself remains constant. -->

<!-- \item[Transient State] Under a transient state, a system will be moving from either -->
<!-- one steady state to another or from a steady state to thermodynamic -->
<!-- equilibrium. -->
<!-- \end{description} -->

<!-- These system behaviors will be discussed in more detail in the next chapter. -->

## Example Model

Before we leave this chapter, let us look at building a model of a simple chain of four enzyme catalyzed reactions (Figure [Figure: Simple Straight Chain Pathway](#fig-linearfoursteppathwaymodel)). Begin by constructing a mathematical model of this system.

**Figure** <a id="fig-linearfoursteppathwaymodel"></a> `fig:LinearFourStepPathwayModel`

*Caption:* Simple Straight Chain Pathway.

```latex
\begin{figure}[hbt]
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
\caption{Simple Straight Chain Pathway.}
\label{fig:LinearFourStepPathwayModel}
\end{figure}
```

First, we must decide where the boundary of the pathway is, assuming there is one. A convenient place to have a boundary is the start and end metabolites of the pathway, that is S$_1$ and S$_5$. We will assume that these two metabolites are **fixed** and are unaffected by the system (Figure [Figure: Simple Straight Chain Pathway with system shown in a box and S$_1$ and](#fig-linearfoursteppathwaymodelboundarysystem)). In modeling language these are the boundary species or inputs to the model.

**Figure** <a id="fig-linearfoursteppathwaymodelboundarysystem"></a> `fig:LinearFourStepPathwayModelBoundarySystem`

*Caption:* Simple Straight Chain Pathway with system shown in a box and S$_1$ and S$_5$ outside the system. We assume S$_1$ and S$_5$ are fixed.

```latex
\begin{figure}[hbt]
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

  \draw[draw=red] (0.6,-0.5) rectangle (7.4,1.2);
  \node at (4,0.9) {System};
  \node[inner sep=0pt,outer sep=0pt] at (4,-0.9) {Surroundings};
  %\draw [brown] (current bounding box.south west) rectangle (current bounding box.north east);
\end{tikzpicture}
\end{center}
\caption{Simple Straight Chain Pathway with system shown in a box and S$_1$ and S$_5$ outside the system. We assume S$_1$ and S$_5$ are fixed.}
\label{fig:LinearFourStepPathwayModelBoundarySystem}
\end{figure}
```

The metabolites that can change in time include S$_2, S_3$, and S$_4$ and are known as the dependent variables, the state variables, or floating species. We can write the differential equations that represent the rates of change of $S_2, S_3$ and $S_4$. Note that there will be no differential equations assigned to S$_1$ and S$_5$ because these are fixed and unchanging. According to mass-balance, the following differential equations must be true:

$$
\begin{align*}
\frac{d\!S_2}{d\!t} = v_1 - v_2 \\[6pt]
\frac{d\!S_3}{d\!t} = v_2 - v_3 \\[6pt]
\frac{d\!S_4}{d\!t} = v_3 - v_4
\end{align*}
$$

Next we must decide on the rate laws, $v_1, v_2, v_3$, and $v_4$. This is possibly the most difficult part to building a model and a detailed examination of the literature is necessary to decide which rate laws are the most appropriate to use. The companion text book, "Enzyme Kinetics for Systems Biology" [SauroBookOne:2011] gives much more detail on rate laws in general. Here a variety of rate laws will be used to illustrate the kinds of rate laws that one might employ. For example, a simple reversible mass-action rate law may be best for the first reaction $v_1$, that is:

$$ v_1 = k_1 S_1 - k_2 S_2 $$

This rate law introduces two new parameters, the rate constants, $k_1$ and $k_2$. These are fixed and unaffected by the model. For the second reaction, let us use a simple allosteric regulated rate law. Assume that the reaction $v_2$ is allosterically inhibited by $S_4$. For this we can apply the simplest exclusive Monod, Wyman, Changeax model [Monod:Wyman:1965]:
<!-- ~\cite{Monod:Wyman:1965,SauroBookOne:2011}, that is: -->

$$ v_2 = V_m \frac{S_2 \left( 1 + S_2/K_m \right)^4}{(1 + S_2/K_m)^4 + L\left( 1 +  S_4/K_I\right)^4} $$

where the Hill coefficient is equal to four, $L$ is the allosteric constant, $K_I$ is the inhibition constant, $K_m$ is the substrate concentration at half-maximal activity, and $V_m$ the maximal velocity.

The third rate law will be a simple irreversible but product inhibited Michaelis-Menten rate law, that is:

$$ v_2 = V_m\frac{S_3}{S_3 + K_m\left( 1 + S_3/K_p\right)} $$

where $V_m$ is the maximal velocity of the reaction, $K_m$ is the Michaelis constant, and $K_p$ is the product inhibition constant. The last reaction, $v_4$ will be assigned a simple irreversible mass-action rate law:

$$ v_4 = k_3 S_4 $$

where $k_3$ is the rate constant. In total the model has ten parameters, two boundary species and three state (or floating) species. The model can be completed by assigning values to all the parameters, boundary species, and initial conditions to the state variables. Once the model is described, it can be entered into a simulation tool such as Tellurium (See Appendix [[appendix_i_modeling_with_python|Modeling with Python]]) or PathwayDesigner [Sauro:Omics, bergmann2006sbw] and the evolution of the system studied. We will discuss running simulations in Chapter [[05_differential_equation_models|Differential Equation Models]] and [[06_stochastic_models|Stochastic Models]].

## Where to get Data for Building Models <a id="sec-dataformodels"></a>

The perennial problem that confronts the biochemical pathway modeler is where to get the data to build the first version of the model. We should first distinguish two kinds of data, network connectivity and data related to the kinetics of individual reaction steps. The former is well supported in the literature and various databases. An entire field called metabolic network reconstruction has emerged in the last ten years as a result of the availability of genome-scale data sets.

### Metabolic Reconstruction

Metabolic network reconstructions [henry2010, thiele2010protocol] describe an organism's meta\-bolism through the analysis of genomic data. The scale of network reconstruction may range from individual pathways to whole genomes. Analyzing and annotating genomic sequences, storing and retrieving metabolic network information, and representing network data are key tasks associated with metabolic network reconstruction. A common first approach to reconstructing metabolic networks is to compare the unknown network with already well characterized networks. After that, further experimental data is collected to validate or fill in any missing gaps. As a result of these efforts, there are now many hundreds of metabolic reconstructions available. ModelSEED [henry2010high] and BiGG <http://bigg.ucsd.edu/> are resources for genome-scale metabolic models. Of particular interest is that metabolic reconstructions can be downloaded in standard SBML, thus allowing a wide range of tools to import the reconstructions.

Other significant sources of networks are the KEGG(footnote: <http://www.genome.jp/kegg/>} and MetaCyc(footnote: <http://metacyc.org/>} repositories. KEGG in particular has a wide range of networks including both vertebrates and invertebrates. The SuBliMinaL Toolbox(footnote: <http://www.mcisb.org/resources/subliminal/>} provides facilities to download and manage network models from KEGG and MetaCyc in the form of SBML.

The data are less easily obtained for protein signaling and gene regulatory networks. For both of these network types, one has to trawl through the literature. Although there have been many attempted efforts to use high-throughput data to generate networks, these are generally unreliable [stolovitzky2009lessons, baralla2009inferring]. The current most reliable way to generate protein and gene regulatory network is to read the source literature.

### Kinetic Data

The real problem however is collecting kinetic data for the individual reaction steps. BR\-ENDA(footnote: <http://www.brenda-enzymes.org/>} is an enzyme database that contains details on the kinetics of many different enzymes. The main problem is that the data reported in BRENDA was often collected under non-physiological conditions. It has been shown several of times in recent years [van2012testing, leroux2013dissecting] that reliable models require kinetic data to be measured under physiological conditions. If reliable kinetics data is not available, then an alternative is to employ generalized or approximate rate laws. There are a variety of these (covered in more detail in the companion book Enzyme Kinetics for Systems Biology), but one in particular will be mentioned here, the lin-log approximation.

Without going into the derivation, the simplest *linear* approximation for a rate law is given by:

\stateEquation{

$$
\begin{equation}
v = v_o \ \left( 1 + \sum_i \varepsilon^v_{S_i^o} \frac{\delta S_i}{S^o_i} \right)
\label{eqn:linearApproxElast}
\end{equation} }
$$

In the linear approximation [Kinetic Data](#eqn-linearapproxelast) the species term is given by: $\delta S/S_o$, or $(S - S_o)/S_o$. Recall the Taylor expansion ([[appendix_f_math_fundamentals|Taylor Series]]) for the natural logarithmic function ($\ln$) around $y_o$ to the first (linear) approximation is given by:

$$ \ln (y) \simeq \ln (y_o) + \frac{y - y_o}{y_o} $$

Note that $\partial \ln (y_o)/\partial y_o = 1/y_o $. Rearranging the linear approximation yields:

$$ \frac{y - y_o}{y_o} \simeq \ln (y) - \ln (y_o) = \ln \left( \frac{y}{y_o} \right) $$

Now substitute $\delta S_i/S^o_i$ for $\ln ( S_i/S^o_i )$. This simple change leads to a significantly improved approximation over the linear equation and is called the linear-logarithmic approximation or lin-log for short [Westerhoff1987, Hatzimanikatis1997, Visser:2003, Heijnen2005].

One of the chief advantages of this approximation is that at high substrate concentration the response approximates the saturation by substrate (See Figure [Figure: Linear, power law, and lin-log approximations to a Michaelis-Menten cu](#fig-linpowerlinloglaw)). The general form of the lin-log equation is given by:

\stateEquation{

$$
\begin{equation}
v = v_o \left[ \frac{e}{e_o} \right] \left( 1 + \sum_i \varepsilon^v_{S_i} \ln\left( \frac{S_i}{S^o_i} \right) \right)
\label{eqn:linlog}
\end{equation} }
$$

where $S$ is the reactant concentration and $\varepsilon$ the elasticity [[appendix_e_enzyme_kinetics_in_a_nutshell|Elasticities]]. The summation is over all reactants and effectors that might modulate the reaction rate (except the enzyme concentration). The rate law is always defined around some reference state where $v_o$ is the reference reaction rate and $S^o_i$ is the reference reactant concentration.

As with the linear approximation [Kinetic Data](#eqn-linearapproxelast), the utility of this method is that the elasticity values [[appendix_e_enzyme_kinetics_in_a_nutshell|Elasticities]] (kinetic orders) can be estimated from the known thermodynamic properties of the reaction, especially if the reaction is operating below saturation. If no thermodynamic information is available, the elasticities may be set to the stoichiometries of the respective reactants if necessary. In either case it is important to note the lin-log approximation is only valid around the chosen reference state, but is much better (See Figure [Figure: Linear, power law, and lin-log approximations to a Michaelis-Menten cu](#fig-linpowerlinloglaw)) than the linear approximation. One possible drawback to the lin-log approximation is that at zero reaction rate, the reactant levels are not necessarily at equilibrium (Figure [Figure: Linear, power law, and lin-log approximations to a Michaelis-Menten cu](#fig-linpowerlinloglaw)). This can lead to reverse reaction rates when the prevailing metabolite levels suggest otherwise. The lin-log approximation is therefore not suitable when a reaction is close to equilibrium or when metabolites levels are very low.

\ifodd\drawfigs

**Figure** <a id="fig-linpowerlinloglaw"></a> `fig:LinPowerLinLogLaw`

*Caption:* Linear, power law, and lin-log approximations to a Michaelis-Menten curve around the reference point
$S_o = 1$; $V_m = 1; K_m = 1$. Dashed: Linear law. The drawback of the lin-log approximation
is that the curve does not go through zero.

```latex
\begin{figure}[htb]
\begin{center}
\begin{tikzpicture}
\begin{axis}[
ylabel={Reaction Rate, $v$},
xlabel={Substrate Concentration, $S$},
xmin=0,
xmax=5,
ymin=0,
ymax=1.5,
width=9cm,
height=6cm]
  \addplot[color=orange,dashed,line width=1.5pt] expression[domain=0:5,samples=200]{0.5 + 0.25*(x-1)};
  %\addplot[color=red,dotted,line width=1.5pt] expression[domain=0.0001:5,samples=200]{0.5*x^0.5};
  \addplot[color=blue,line width=1.5pt] expression[domain=0:5,samples=80]{x/(1+x)};
  \addplot[color=green,line width=1.5pt] expression[domain=0:5,samples=80]{0.5*(1 + 0.5*ln(x/1))};

  \fill [black] (axis cs:1,0.5) circle (2pt);
  \node at (axis cs:3.8,1.38) {\small Linear};
  %\node at (axis cs:4.5,1.2) {\small Power};
  \node at (axis cs:4.4,0.97) {\small Lin-Log};
  \node at (axis cs:4.4,0.675) {\small Michaelis};

  \draw[color=gray,style=densely dashed] (axis cs:1,0.0) -- (axis cs:1,0.5);
  \draw[color=gray,style=densely dashed] (axis cs:1,0.5) -- (axis cs:0,0.5);
\end{axis}
\end{tikzpicture}
\end{center}
\caption{Linear, power law, and lin-log approximations to a Michaelis-Menten curve around the reference point
$S_o = 1$; $V_\text{m} = 1; K_m = 1$. Dashed: Linear law. The drawback of the lin-log approximation
is that the curve does not go through zero.} \label{fig:LinPowerLinLogLaw}
\end{figure}
```

## Of Exactitude in Science

And finally a lesson to all model builders:

"On Exactitude in Science...In that Empire, the Art of Cartography attained such Perfection that the map of a single Province occupied the entirety of a City, and the map of the Empire, the entirety of a Province. In time, those Unconscionable Maps no longer satisfied, and the Cartographers Guilds struck a Map of the Empire whose size was that of the Empire, and
which coincided point for point with it. The following Generations, who were not so fond of the Study of Cartography as their Forebears had been, saw that that vast Map
was Useless, and not without some Pitilessness was it, that they delivered it up to the Inclemencies of Sun and Winters. In the Deserts of the West, still today, there are
Tattered Ruins of that Map, inhabited by Animals and Beggars; in all the Land there is no other Relic of the Disciplines of Geography.

<!-- ``... In that Empire, the craft of Cartography attained such perfection that the Map of a Single province covered the space of an entire City, and the Map of the Empire itself an entire Province. %In the course of Time, these Extensive maps were found somehow wanting, and so the College of Cartographers evolved a Map of the Empire that was of the same Scale as the Empire and that matched it %point for point. Less attentive to the Study of Cartography, succeeding Generations came to judge a map of such Magnitude cumbersome, and, not without Irreverence, they abandoned it to the Rigours %of sun and Rain. In the western Deserts, tattered Fragments of the Map are still to be found, Sheltering an occasional Beast or beggar; in the whole Nation, no other relic is left of the %Discipline of Geography.'' -->

Suarez Miranda, *Viajes de varones prudentes*, Libro IV,Cap. XLV, Lerida, 1658

From Travels of Praiseworthy Men (1658) by J.A. Su$\acute{a}$rez Miranda, 1946, translated by Andrew Hurley

## Further Reading

- Davis PJ and Hersh R (1981) The Mathematical Experience. Houghton Mifflin Company. ISBN: 0-395-32131-X

- Riggs DS (1979) Control Theory and Physiological Feedback Mechanisms. Waverly Press,  SBN: 683-07244-7

- Sauro HM (2011) Enzyme Kinetics for Systems Biology. ISBN: 978-0982477311

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- \begin{enumerate} -->
<!-- \item Which of the following best describes what a model is: -->
<!-- \begin{enumerate} -->
<!-- \item an attempt to form an exact replica of reality. -->
<!-- \item the truth about the real system. -->
<!-- \item a simplification of the real world. -->
<!-- \end{enumerate} -->

<!-- \item State the difference between a deterministic and stochastic model. -->

<!-- \item State the difference between a discrete and continuous model. -->

<!-- \item Suggest what modeling approach you would use for the following systems, i.e.\ continuous or discrete and determisititic or stochastic: -->
<!-- \begin{enumerate} -->
<!-- \item The spread of a forest fire. -->
<!-- \item Growth and spread of sand dunes. -->
<!-- \item A line of people waiting at cash tills in a store. -->
<!-- \item AM radio electrical circuit. -->
<!-- \item A chess game where both players are computer programs. -->
<!-- \item A tumor where individual cells secrete growth factors. -->
<!-- \end{enumerate} -->

<!-- \item Figure~\ref{fig:ThreeTank} shows a three tank system similar to the two tank system in Figure~\ref{fig:DualTank}. Derive the differential equations that describes the rate of change of the heights, $h_1$, $h_2$, and $h_3$. You can assume that the flow rate out of a tank is proportional to the height of water. -->

<!-- \begin{figure}[htb] -->
<!-- \begin{center} -->
<!-- \includegraphics[scale = 0.8]{ThreeTank} -->
<!-- \caption{Three tank model.} -->
<!-- \label{fig:ThreeTank} -->
<!-- \end{center} -->
<!-- \end{figure} -->

<!-- \item State any assumptions or approximations you made in the previous question relating to the water tank model. -->

<!-- \item List the three most desirable attributes of a model. -->
<!-- \item When we ``validate'' a model, which of the following do we most -->
<!-- likely mean: -->
<!-- \begin{enumerate} -->
<!-- \item We show that the model represents the truth about the real system. -->
<!-- \item We increase our confidence in the model's predictive power. -->
<!-- \item We prove that the model is correct. -->
<!-- \end{enumerate} -->

<!-- \item Two scientists are arguing about a model, one claims that the model is correct but the other suggests that it is the best so far. Who is making the most reasonable claim and why? -->

<!-- \item Explain the difference between accuracy and predictability of a model. -->

<!-- \item The authors of a published biochemical model claim that their model has been validated. What do they mean by this? -->

<!-- \item The author George Box is said to made a statement similar to: ``all models are wrong, but some are useful.''. What does he mean by this? -->

<!-- \item The transport of a solute across a membrane is given by the equation $J = P_A (S_{\text{in}} - S_{\text{out}})$. If $P_A$ is expressed in cm $s^{-1}$ and the transport rate in moles cm$^{-2} s^{-1}$, what should the concentrations, $S_{\text{in}}$ and $S_{\text{out}}$ be expressed in? -->

<!-- \item What is the difference between a state variable and a boundary variable in a biochemical model? -->

<!-- \item Describe the state variables and types of parameter in the following model of a biochemical pathway: -->

<!-- \begin{align*} -->
<!-- \frac{dS_1}{dt} &= k_1 X_o - k_2 S_1 \\[8pt] -->
<!-- \frac{dS_2}{dt} &= k_2 S_1 - (k_3 S_2 - k_4 X_1) -->
<!-- \end{align*} -->

<!-- \item Show that the following functions are nonlinear with respect to $x$: -->
<!-- \begin{enumerate} -->
<!-- \item $\sin (x)$ -->
<!-- \item $e^x$ -->
<!-- \item $V_m x/(x + K_m)$ -->
<!-- \end{enumerate} -->

<!-- \item Linearize the following functions: -->
<!-- \begin{enumerate} -->
<!-- \item $4 x^2 + 6 x - 10$ at $x = 1$ -->
<!-- \item $V_m x/(x + K_m)$ at $x = 0$ and $x = K_m$ -->
<!-- \end{enumerate} -->

<!-- \item In the equation $v = V_m S/(K_m + S)$ where $S$ is expressed in units of mol l$^{-1}$, $V_m$ in mol l$^{-1}$ s$^{-1}$, and the reaction velocity, $v$ in mol l$^{-1}$ s$^{-1}$ what are the units for $K_m$? -->

<!-- \item In the previous question, if only the units for $S$ are known, what can one say about the units of $K_m$? -->

<!-- \item Unequal concentrations of solutes across a selective membrane results in a -->
<!-- net diffusion of solute from the high concentration to low -->
<!-- concentration compartment. Equilibrium is reached when both -->
<!-- compartments reach the same concentration. If however the solute is -->
<!-- charged the diffusion will result in a net transfer of charge from -->
<!-- one compartment to the other. As charge accumulates, an -->
<!-- electrochemical potential is set up which slows the diffusion -->
<!-- process and thereby influences the final distribution of solute. The -->
<!-- equilibrium potential under these circumstances is given by the -->
<!-- Nernst equation: -->

<!-- $$ E = \frac{RT}{z\ F} \ln\left(\frac{\mbox{Ion}_{out}}{\mbox{Ion}_{in}}\right) $$ -->

<!-- where E (expressible as $J\ \text{coul\-ombs}^{-1}$) is the equilibrium voltage potential, R is the gas constant ($J\ K^{-1}\ \mbox{mol}^{-1}$), T the temperature in Kelvins ($K$), z the valence of the ion. and F is the Faraday constant. -->

<!-- Using dimensional analysis determine the units for the Faraday constant, F. -->

<!-- \end{enumerate} -->

<!-- \section*{Answers} -->

<!-- \begin{enumerate} -->

<!-- \item c) -->

<!-- \item A deterministic model is one where a given input will always produce the same output. For example, in the equation $y = x^2$, setting $x$ to 2 will always yield the output $4$. A stochastic model is one where the processes described by the model include a random element. This means that repeated runs of a model will yield slightly different outcomes. -->

<!-- \item A discrete variable is one that cannot take on all values within a given numeric range. A continuous variables can assume all values within a given numeric range -->

<!-- \item -->
<!-- \begin{enumerate}[label=(\alph*)] -->
<!-- \item Discrete, stochastic -->
<!-- \item Although a sand dune is made up of discrete sand particles that appear to move randomly, given the large number of particles and their size, it is more likely one would use a deterministic and continuous model. -->
<!-- \item Discrete, stochastic. -->
<!-- \item Continuous, deterministic. -->
<!-- \item Discrete, deterministic -->
<!-- \item Discrete model for the individual cells but a continuous model for the growth factors. -->
<!-- \end{enumerate} -->

<!-- \item -->
<!-- \begin{align*} -->
<!-- \frac{dh_1}{dt} &= (Q_1 - K_1 h_1)/A \\ -->
<!-- \frac{dh_2}{dt} &= (K_1 h_1 + K_3 h_3)/A \\ -->
<!-- \frac{dh_3}{dt} &= (Q_4 - K_3 h_3)/A -->
<!-- \end{align*} -->

<!-- \item a) Assumed that the rate of flow out of a tank was proportional tot eh height of water instead of using Torricelli's law. A low water heights a direct proportionality law is approximately true. b) Constant temperature; -->

<!-- \item Accuracy, predicability and falsifiability. -->

<!-- \item b) -->

<!-- \item The second scientist is making the more reasonable statement that the model is the best so far. -->

<!-- \item An accurate model is one that can recapitulate the current knowledge about a system.  predictive model is one that can predict new information about a system that is currently not yet known. -->

<!-- \item The authors claiming that their model has been validated means that the model has been shown to correctly predict one or more new experimental data. -->

<!-- \item George Box meant that it is not possible to produce a model that is an exact replica of reality (or even desirable), but that simplified models can still generate useful predictions and hence nevertheless useful. -->

<!-- \item moles cm$^{-3}$ -->

<!-- \item A boundary variable is a quantity of a model that does not change as a result of the action of the model. For a model that uses differential equations, a boundary species does not have a differential equation describing its change. A state variable is a variable that does change as a result of the action of the model. -->

<!-- \item State Variables: $S_1$ and $S_2$. Parameters, $k_1, k_2, k_3$ and $k_4$. Boundary species: $X_o$ and $X_1$. -->

<!-- \item -->

<!-- \begin{enumerate}[label=(\alph*)] -->
<!-- \item $ \sin(x_1)+\sin(x_2) \neq \sin(x_1 + x_2)) $ -->
<!-- \item $ e^{x_1} + e^{x+2} \neq  e^{x_1 + x_2} $ -->
<!-- \item $ V_m x_1/(K_m + x_1) + V_m x_2/(K_m + x_2) \neq V_m (x_1 + x_2)/(K_m + x_1 + x_2)$ -->
<!-- \end{enumerate} -->

<!-- \item -->

<!-- \begin{enumerate}[label=(\alph*)] -->
<!-- \item Let $f(x)$ be the function to linearise. $\frac{df}{dx} = 8 x + 6 $, therefore at x_o = 1, $y = f(x) + (8 x + 6) (x - 1)$, or $y = 14 x - 14 $ -->

<!-- \item Let $f(x)$ be the function to linearise. $\frac{df}{dx} = K_m V_m /(Km + x)^2$. At $x_o = K_m$, $\frac{df}{dx} = V_m/(4 K_m)$, therefore at $x_o = K_m$, $y = f(Km) + V_m/(4 K_m) (x - Km)$. Simplifying this equation yields: -->
<!-- $ y = V_m/4 +  V_m x (4 K_m) = V_m(K_m + x)/(4 K_m)$ -->
<!-- \end{enumerate} -->

<!-- \item mol l$^{-l}$ -->

<!-- \item The units for $K_m$ and $S$ are the same, hence know the units for $S$ automatically gives you the units for $K_m$. -->
<!-- \end{enumerate} -->

---

## Index terms recorded in this chapter

- $\bx (t)$
- $\sin(x)$
- accurate
- additivity
- approximations
- Avogadro's constant
- boundary
- boundary variables
- Brownian motion
- building a model
- clamp
- classification of models
- closed
- constants
- continuous variable
- data for models
- dependent variable
- deterministic
- dimensional analysis
- dimensions
- discrete variable
- distributed models
- dynamic models
- elasticity
- elasticity values
- extensive property
- falsifiablity
- FBA
- first-order
- flux balance analysis
- forcing functions
- heuristic model
- homogeneity
- independent variable
- index
- intensive property
- isolated
- KEGG
- kinetic data
- kinetic order
- lin-log
- lin-log approximation
- linear approximation
- linear model
- linear time invariant systems
- linearization
- LTI
- lumped models
- Mathematical models
- metabolic reconstruction
- MetaCyc
- model variables
- models
- molarity
- molecular weight
- moles
- Monod, Wyman, Changeax
- nonlinear model
- Occam
- open
- operating point
- outputs
- parameter
- particular model
- predictability
- predictive
- proof
- rate constant
- reaction rates
- reference state
- SBML
- second-order
- Simple model
- simulation model
- small effect
- static models
- stochastic
- SuBliMinaL
- superposition
- surroundings
- system
- Taylor series
- thermodynamic properties
- time invariant
- time invariant models
- Torrielli Law
- two dimensional system
- unit balancing
- units
- validation
- water tank model
- working hypothesis

---

← [[03_stoichiometric_networks|Stoichiometric Networks]] · [[index|Wiki index]] · [[05_differential_equation_models|Differential Equation Models]] →
