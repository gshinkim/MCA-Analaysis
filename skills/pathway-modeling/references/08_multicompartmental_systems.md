# Multicompartmental Systems

*Source: `chapter8.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Multicompartmental Systems <a id="chap-multicompartment"></a>

<!-- \begin{chapquote}{\textit{Captain Ericson in The Cruel Sea, 1953}} -->
<!-- ``Steady as she goes, Number One. '' -->
<!-- \end{chapquote} -->

## Multicompartment Systems

It is easy to think of a biological cell as a well mixed compartment and base our models around that premise. However, anyone who has looked through a microscope at a drop of pond water and observed swimming protists will quickly realize that many cells are highly structured and compartmentalized. In eukaryotic cells the most obvious compartments are the nucleus, mitochondria, chloroplasts, and a wide variety of enclosed spaces serving different functions. In all these cases, movement of material occurs from one compartment to another, sometimes active (requiring energy) and sometimes passive. Additionally, all the compartments have widely different volumes. This chapter will briefly look at how to build models involving multiple compartments with differing volumes.

## Simple Diffusion

Let us start by considering the simplest possible example, the reversible and passive diffusion of solute from one compartment of volume $V_1$ to another compartment of volume $V_2$ (Figure [Figure: Two compartment model with volumes $V_1$ and $V_2$](#fig-simplecompartmentdiffusion)).

**Figure** <a id="fig-simplecompartmentdiffusion"></a> `fig:SimpleCompartmentDiffusion`

*Caption:* Two compartment model with volumes $V_1$ and $V_2$. $S_1$ and $S_2$ diffusion passively across the membrane with area, $A$.

```latex
\begin{figure}[hbt]
\begin{center}
\begin{tikzpicture}[>=latex', node distance=2cm]

  \node at (1.8,  0) {\Large S$_1$};
  \node at (4.4,0) {\Large S$_2$};

  \draw [<->,ultra thick,blue] (2.3,0) -- (4,0);

  \draw[draw=red,very thick] (0.6,-1.2) rectangle (3,1);
  \draw[draw=red,very thick] (3,-1.2) rectangle (9,1);
  \node at (2.8,0.7) {$A$};
  \node at (1,-0.85) {$V_1$};
  \node at (3.5,-0.85) {$V_2$};
\end{tikzpicture}
\end{center}
\caption{Two compartment model with volumes $V_1$ and $V_2$. $S_1$ and $S_2$ diffusion passively across the membrane with area, $A$.}
\label{fig:SimpleCompartmentDiffusion}
\end{figure}
```

Let us assume that the volume in compartment two is ten times the volume of compartment one. This means that as mass moves from $V_1$ to $V_2$, the mass will be diluted in the large volume of $V_2$. To illustrate this, consider that in compartment $V_1$ and $V_2$ we have 5 mM of solute. We will also assume that the volume of $V_1$ is 1 liter, and the volume of $V_2$ is 10 liters. Let us now move 2 mmoles of solute from compartment $V_1$ to $V_2$. The new concentration of solute in $V_1$ will be 3 mM. In $V_2$ the total number of moles of solute before the transfer was 50 mmoles (5 mM in 10 liters). During the transfer, we added 2 mmoles to $V_2$ resulting in a total amount of solute of 52 mmoles in $V_2$. The concentration of solute in $V_2$ is therefore 52/10 = 5.2 mM. This tells us that while the concentration in $V_1$ changed by 40%, the concentration change in $V_2$ was only 4%.

These calculations show that we must take into account the different compartment volumes when we move mass from one compartment to another. In the following we will use the symbol $l$ to represent length, and $t$ to represent time. One of the basic discoveries in the science of diffusion was Fick's first law. This states that the diffusion rate (or flux) of a compound, $S$, from a region of high concentration to a region of low concentration, is proportional to the concentration gradient:

$$ J_A = - D_A \frac{dS}{dx} $$

This equation describes the rate of movement of compound across an infinitely thin window of a given area at a position $x$ across the diffusion flow. The negative sign ensures that the flux is positive when the concentration gradient is negative, that is declining left to right. $J_A$ is the flux in units of moles $l^{-2}$ $t^{-1}$ (moles per unit area per time), $D_A$ the **diffusion coefficient** has units of $l^{2}$ $t^{-1}$ (area per unit time), $S$ is the concentration and $\dS/d\!x$ the concentration gradient in units of moles $l^{-3}$ $l^{-1}$. That is, moles per volume per length, denoted moles $l^{-4}$.

If the zone or window of diffusion has a finite width $\delta$, we can approximate Fick's law using:

$$ J_A = - D_A \frac{S_{out} - S_{in}}{\delta} $$

or

\stateEquation{

$$
\begin{equation}
J_A = P_A (S_{\text{in}} - S_{\text{out}})
\label{eqn:fluxThroughMembrane}
\end{equation}\vspace{-13pt} }
$$

where $P_A$ equals $D_A/\delta$ and is called the **permeability coefficient** with units of length per unit time (often $cm s^{-1}$ in the literature). We assume here that the permeability is the same on both sides of the membrane. The units of flux at this stage are moles per unit area per unit time ($moles l^{-2} t^{-1}$). $S_{out}$ and $S_{in}$ refer to the concentration of solute outside and inside the compartment.

To obtain the total amount of mass that moves from one compartment to another we must multiply the flux, $J_A$, by the cross-sectional area of
the membrane, thus:

$$ J = A J_A $$

where $J$ is the total amount of substance crossing the membrane and $A$ the area of the membrane. If this substance is moving into a volume, $V$, then the
rate of change of concentration in the compartment is given by:

$$ \frac{\dS}{\dt} = -\frac{J}{V} $$

The negative sign indicates that mass is leaving the compartment. We can now write the differential equations for the two compartment model:

$$ \frac{dS_1}{dt} = -\frac{J}{V_1}; \qquad \frac{dS_2}{dt} = \frac{J}{V_2} $$

where the total flux, $J$, is given by:

$$
\begin{align}
J = A P_A (S_1 - S_2)
\label{eqn:TotalFickFlux}
\end{align}
$$

Let us define the amount of $S_1$ and $S_2$ as follows:

$$ n_1 = S_1 V_1 \qquad n_2 = S_2 V_2 $$

where $n_1$ and $n_2$ are the amounts of $S_1$ and $S_2$, respectively. We can then write the differential equations as:

$$ \frac{dn_1}{dt} = -J; \qquad \frac{dn_2}{dt} = J $$

Recall that $J$ is a function of concentration so we can rewrite $J$ as:

$$ J = A P_A (n_1/V_1 - n_2/V_2) $$

The differential equations are now only in terms of amount. To get the concentration at any time during the simulation, we simply take the current amount of mass in the compartment and divide by the compartment's volume. The key then to dealing with multicompartmental systems is to describe the rates of change in terms of amounts rather than concentration, and to continuously recompute concentrations as needed by dividing the amount by volume.

We can also show that the result is thermodynamically consistent. To test this we set the flux ([Simple Diffusion](#eqn-totalfickflux)) to zero:

$$ A P_A (S_1 - S_2) = 0 $$

That is $S_1 = S_2$. Since we are dealing with simple diffusion, we expect at thermodynamic equilibrium for the two concentrations to be equal, which they are. Note also that the units are consistent, with the units for $A$ being $l^2$, for $V_1$: $l^3$, $P_A$: $l t^{-1}$, and for $S_x:$ $mol l^3$.

**Example**
A thin membrane has a cross-sectional area of 1mm. On one side of the membrane is a solute of concentration 2 mM, and on the other a concentration of 0.2 mM. If the permeability coefficient for the solute is $2 \times 10^{-4}  cm s^{-1}$, compute the amount of mass that is likely to move across the entire surface of the membrane every second.

We will use equation ([Simple Diffusion](#eqn-totalfickflux)) to compute the flux. It is important to ensure that all the units are consistent. Given that the permeability coefficient uses cm for length, we will use cm as the length unit. The area of the membrane is $0.1 \times 0.1 = 0.01  cm^{-2}$. The concentrations are expressed in moles per liter, and one liter is one thousandth of a cubic meter. A cubic meter equals 1,000,000 cm$^{3}$, therefore a liter must be 1000 cm$^{3}$. Our concentrations of 2 mM and 0.2 mM can therefore be expressed as 0.002 mmoles per cm$^3$, and 0.0002 mmoles per cm$^3$, respectively.

The flux of mass across the membrane can therefore be computed as:

$$ J = 0.01 \times 2 \times 10^{-3} (0.002 - 0.0002) = 3.6 \times 10^{-8}  mol s^{-1} $$

Listing `jarnac:chap:MultiCompartmentSimpleTransporter` shows how one can use Tellurium to model a simple diffusion transport across a thin membrane.

```python
import tellurium as te
import pylab

r = te.loada ('''
    compartment V1 = 1, V2 = 10;
    var S1 in V1;
    var S2 in V2;

    S1 -> S2; A*k1*S1;
    S2 -> S1; A*k2*S2;

    S1 = 10; S2 = 0;
    k1 = 0.4; k2 = 0.4; A = 1;
''')

result = r.simulate(1, 40, 100)
r.plot (xlim=(0, 40))
```

Figure [Figure: Simulation of simple diffusion of a solute from one compartment to ano](#fig-simplediffusionsimulation) shows the results of the simple compartment simulation. Note that the concentrations converge to the same level because the equilibrium constant across the membrane is one. However, the total amount of mass in each compartment is different due to the difference in volumes.

In Tellurium the adjustment for compartments of different volumes is automatic. To set up a multicompartment model in Tellurium, two things must be done. One must first declare what compartments are present in the model, in this case $V_1$ and $V_2$, line 2 in Listing `jarnac:chap:MultiCompartmentSimpleTransporter`. Next we specify what compartments the species are located in, line 3. After that we specify the transport rates in units of moles transported per second, which represents the total transport across the membrane. Consequently, the rate law is multiplied by the total membrane area since the base units for the transport process will be in moles per second per unit area. The units of the solute, $S_1$ and $S_2$ must be in concentration.

**Figure** <a id="fig-simplediffusionsimulation"></a> `fig:simpleDiffusionSimulation`

*Caption:* Simulation of simple diffusion of a solute from one compartment to another. Left graph shows changes in concentration, right graph shows changes in amounts. Upper lines on the left of each graph is S$_1$. Tellurium script `jarnac:chap:MultiCompartmentSimpleTransporter`.

```latex
\begin{figure}
\begin{center}
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={$S_1$ (upper) and $S_2$ (lower)},
xmin=0, xmax=30, ymin=0, ymax=10,
width=6.2cm,
height=6cm]
\addplot[color=red,line width=1.5pt] coordinates {
(         0,         10)(0.37974684,  8.6011174)(0.75949367,  7.4174902)( 1.1392405,  6.4159956)( 1.5189873,  5.5686077)( 1.8987342,   4.851613)(  2.278481,  4.2449471)( 2.6582278,  3.7316328)
( 3.0379747,  3.2973056)( 3.4177215,  2.9298111)( 3.7974684,  2.6188654)( 4.1772152,  2.3557669)(  4.556962,   2.133153)( 4.9367089,   1.944794)( 5.3164557,  1.7854189)( 5.6962025,  1.6505678)
( 6.0759494,   1.536467)( 6.4556962,  1.4399235)(  6.835443,  1.3582355)( 7.2151899,  1.2891207)( 7.5949367,  1.2306405)( 7.9746835,  1.1811583)( 8.3544304,  1.1392894)( 8.7341772,   1.103862)
( 9.1139241,  1.0738894)( 9.4936709,  1.0485296)( 9.8734177,  1.0270715)( 10.253165,  1.0089136)( 10.632911, 0.99355068)( 11.012658, 0.98055238)( 11.392405, 0.96955467)( 11.772152, 0.96024964)
( 12.151899,  0.9523768)( 12.531646, 0.94571639)( 12.911392, 0.94008089)( 13.291139, 0.93531264)( 13.670886, 0.93127804)( 14.050633, 0.92786429)(  14.43038, 0.92497585)( 14.810127, 0.92253179)
( 15.189873, 0.92046386)(  15.56962, 0.91871422)( 15.949367, 0.91723356)( 16.329114,  0.9159798)( 16.708861, 0.91492007)( 17.088608, 0.91402348)( 17.468354,  0.9132645)( 17.848101, 0.91262261)
( 18.227848, 0.91207968)( 18.607595, 0.91162041)( 18.987342, 0.91123182)( 19.367089, 0.91090301)( 19.746835,  0.9106248)( 20.126582,  0.9103894)( 20.506329, 0.91019024)( 20.886076, 0.91002173)
( 21.265823,    0.90988)(  21.64557, 0.90975998)( 22.025316, 0.90965833)( 22.405063, 0.90957223)(  22.78481, 0.90949929)( 23.164557, 0.90943749)( 23.544304, 0.90938512)( 23.924051, 0.90934076)
( 24.303797, 0.90930317)( 24.683544, 0.90927131)( 25.063291,  0.9092443)( 25.443038, 0.90922139)( 25.822785, 0.90920195)( 26.202532, 0.90918545)( 26.582278, 0.90917144)( 26.962025, 0.90915954)
( 27.341772, 0.90914943)( 27.721519, 0.90914083)( 28.101266, 0.90913351)( 28.481013, 0.90912729)( 28.860759, 0.90912199)( 29.240506, 0.90911748)( 29.620253, 0.90911363)(        30, 0.90911035)
};
\addplot[color=blue,line width=1.5pt] coordinates {
(         0,          0)(0.37974684, 0.13988826)(0.75949367, 0.25825098)( 1.1392405, 0.35840044)( 1.5189873, 0.44313923)( 1.8987342,  0.5148387)(  2.278481, 0.57550529)( 2.6582278, 0.62683672)
( 3.0379747, 0.67026944)( 3.4177215, 0.70701889)( 3.7974684, 0.73811346)( 4.1772152, 0.76442331)(  4.556962,  0.7866847)( 4.9367089,  0.8055206)( 5.3164557, 0.82145811)( 5.6962025, 0.83494322)
( 6.0759494,  0.8463533)( 6.4556962, 0.85600765)(  6.835443, 0.86417645)( 7.2151899, 0.87108793)( 7.5949367, 0.87693595)( 7.9746835, 0.88188417)( 8.3544304, 0.88607106)( 8.7341772,  0.8896138)
( 9.1139241, 0.89261106)( 9.4936709, 0.89514704)( 9.8734177, 0.89729285)( 10.253165, 0.89910864)( 10.632911, 0.90064493)( 11.012658, 0.90194476)( 11.392405, 0.90304453)( 11.772152, 0.90397504)
( 12.151899, 0.90476232)( 12.531646, 0.90542836)( 12.911392, 0.90599191)( 13.291139, 0.90646874)( 13.670886,  0.9068722)( 14.050633, 0.90721357)(  14.43038, 0.90750242)( 14.810127, 0.90774682)
( 15.189873, 0.90795361)(  15.56962, 0.90812858)( 15.949367, 0.90827664)( 16.329114, 0.90840202)( 16.708861, 0.90850799)( 17.088608, 0.90859765)( 17.468354, 0.90867355)( 17.848101, 0.90873774)
( 18.227848, 0.90879203)( 18.607595, 0.90883796)( 18.987342, 0.90887682)( 19.367089,  0.9089097)( 19.746835, 0.90893752)( 20.126582, 0.90896106)( 20.506329, 0.90898098)( 20.886076, 0.90899783)
( 21.265823,   0.909012)(  21.64557,   0.909024)( 22.025316, 0.90903417)( 22.405063, 0.90904278)(  22.78481, 0.90905007)( 23.164557, 0.90905625)( 23.544304, 0.90906149)( 23.924051, 0.90906592)
( 24.303797, 0.90906968)( 24.683544, 0.90907287)( 25.063291, 0.90907557)( 25.443038, 0.90907786)( 25.822785,  0.9090798)( 26.202532, 0.90908145)( 26.582278, 0.90908286)( 26.962025, 0.90908405)
( 27.341772, 0.90908506)( 27.721519, 0.90908592)( 28.101266, 0.90908665)( 28.481013, 0.90908727)( 28.860759,  0.9090878)( 29.240506, 0.90908825)( 29.620253, 0.90908864)(        30, 0.90908896)
};
\end{axis}
\end{tikzpicture}
\hspace{10pt}
\begin{tikzpicture}
\begin{axis}[
xlabel={time},
xmin=0, xmax=40, ymin=0, ymax=10,
width=6.2cm,
height=6cm]
\addplot[color=red,line width=1.5pt] coordinates {
(0, 10) (0.4040404, 8.519334) (0.8080808, 7.279829) (1.212121, 6.242205) (1.616162, 5.373582) (2.020202, 4.646434) (2.424242, 4.037719) (2.828283, 3.528147)
(3.232323, 3.10157) (3.636364, 2.744471) (4.040404, 2.445533) (4.444444, 2.195284) (4.848485, 1.985794) (5.252525, 1.810424) (5.656566, 1.663617) (6.060606, 1.54072)
(6.464646, 1.437839) (6.868687, 1.351719) (7.272727, 1.279625) (7.676768, 1.219273) (8.080808, 1.168749) (8.484848, 1.126453) (8.888889, 1.091045) (9.292929, 1.061409)
(9.69697, 1.036598) (10.10101, 1.015828) (10.50505, 0.9984397) (10.90909, 0.9838848) (11.31313, 0.9717012) (11.71717, 0.9615023) (12.12121, 0.9529649) (12.52525, 0.9458192)
(12.92929, 0.9398373) (13.33333, 0.9348298) (13.73737, 0.9306378) (14.14141, 0.9271286) (14.54545, 0.924191) (14.94949, 0.9217317) (15.35354, 0.919673) (15.75758, 0.9179497)
(16.16162, 0.9165067) (16.56566, 0.9152992) (16.9697, 0.9142883) (17.37374, 0.9134414) (17.77778, 0.912733) (18.18182, 0.9121401) (18.58586, 0.911644) (18.9899, 0.9112288)
(19.39394, 0.9108812) (19.79798, 0.9105902) (20.20202, 0.9103466) (20.60606, 0.9101427) (21.0101, 0.909972) (21.41414, 0.90983) (21.81818, 0.909711) (22.22222, 0.9096113)
(22.62626, 0.9095277) (23.0303, 0.9094577) (23.43434, 0.9093989) (23.83838, 0.9093497) (24.24242, 0.9093084) (24.64646, 0.9092738) (25.05051, 0.9092448) (25.45455, 0.9092204)
(25.85859, 0.9092) (26.26263, 0.9091828) (26.66667, 0.9091684) (27.07071, 0.9091563) (27.47475, 0.9091461) (27.87879, 0.9091375) (28.28283, 0.9091303) (28.68687, 0.9091242)
(29.09091, 0.9091191) (29.49495, 0.9091148) (29.89899, 0.9091111) (30.30303, 0.909108) (30.70707, 0.9091054) (31.11111, 0.9091032) (31.51515, 0.9091014) (31.91919, 0.9090998)
(32.32323, 0.9090985) (32.72727, 0.9090973) (33.13131, 0.9090964) (33.53535, 0.9090956) (33.93939, 0.9090949) (34.34343, 0.9090943) (34.74747, 0.9090938) (35.15152, 0.9090933)
(35.55556, 0.909093) (35.9596, 0.9090927) (36.36364, 0.9090924) (36.76768, 0.9090922) (37.17172, 0.909092) (37.57576, 0.9090918) (37.9798, 0.9090917) (38.38384, 0.9090916)
(38.78788, 0.9090915) (39.19192, 0.9090914) (39.59596, 0.9090913) (40, 0.9090913) };
\addplot[color=blue,line width=1.5pt] coordinates {
(0, 0) (0.4040404, 1.480666) (0.8080808, 2.720171) (1.212121, 3.757795) (1.616162, 4.626418) (2.020202, 5.353566) (2.424242, 5.962281) (2.828283, 6.471853)
(3.232323, 6.89843) (3.636364, 7.255529) (4.040404, 7.554467) (4.444444, 7.804716) (4.848485, 8.014206) (5.252525, 8.189576) (5.656566, 8.336383) (6.060606, 8.45928)
(6.464646, 8.562161) (6.868687, 8.648281) (7.272727, 8.720375) (7.676768, 8.780727) (8.080808, 8.831251) (8.484848, 8.873547) (8.888889, 8.908955) (9.292929, 8.938591)
(9.69697, 8.963402) (10.10101, 8.984172) (10.50505, 9.00156) (10.90909, 9.016115) (11.31313, 9.028299) (11.71717, 9.038498) (12.12121, 9.047035) (12.52525, 9.054181)
(12.92929, 9.060163) (13.33333, 9.06517) (13.73737, 9.069362) (14.14141, 9.072871) (14.54545, 9.075809) (14.94949, 9.078268) (15.35354, 9.080327) (15.75758, 9.08205)
(16.16162, 9.083493) (16.56566, 9.084701) (16.9697, 9.085712) (17.37374, 9.086559) (17.77778, 9.087267) (18.18182, 9.08786) (18.58586, 9.088356) (18.9899, 9.088771)
(19.39394, 9.089119) (19.79798, 9.08941) (20.20202, 9.089653) (20.60606, 9.089857) (21.0101, 9.090028) (21.41414, 9.09017) (21.81818, 9.090289) (22.22222, 9.090389)
(22.62626, 9.090472) (23.0303, 9.090542) (23.43434, 9.090601) (23.83838, 9.09065) (24.24242, 9.090692) (24.64646, 9.090726) (25.05051, 9.090755) (25.45455, 9.09078)
(25.85859, 9.0908) (26.26263, 9.090817) (26.66667, 9.090832) (27.07071, 9.090844) (27.47475, 9.090854) (27.87879, 9.090862) (28.28283, 9.09087) (28.68687, 9.090876)
(29.09091, 9.090881) (29.49495, 9.090885) (29.89899, 9.090889) (30.30303, 9.090892) (30.70707, 9.090895) (31.11111, 9.090897) (31.51515, 9.090899) (31.91919, 9.0909)
(32.32323, 9.090902) (32.72727, 9.090903) (33.13131, 9.090904) (33.53535, 9.090904) (33.93939, 9.090905) (34.34343, 9.090906) (34.74747, 9.090906) (35.15152, 9.090907)
(35.55556, 9.090907) (35.9596, 9.090907) (36.36364, 9.090908) (36.76768, 9.090908) (37.17172, 9.090908) (37.57576, 9.090908) (37.9798, 9.090908) (38.38384, 9.090908)
(38.78788, 9.090909) (39.19192, 9.090909) (39.59596, 9.090909) (40, 9.090909) };
\end{axis}
\end{tikzpicture}
\end{center}
\caption{Simulation of simple diffusion of a solute from one compartment to another. Left graph shows changes in concentration, right graph shows changes in amounts. Upper lines on the left of each graph is S$_1$. Tellurium script~\ref{jarnac:chap:MultiCompartmentSimpleTransporter}.}
\label{fig:simpleDiffusionSimulation}
\end{figure}
```

## Membrane Transporter Protein

Let us consider a more complex example where a solute, $S_1$, is transported through a protein pore (and hence saturable) and appears on the other side of the membrane as $S_2$. Instead of using Fick's law, we must consider using a saturable Michaelis-Menten like rate law. Let us assume that the concentration of protein pores on the membrane is given by:

$$ e = \frac{n_e}{A} $$

where $n_e$ is the number of protein pores, $A$ the area of the membrane, and $e$ the moles of pores per unit area. The rate of catalysis will be proportional to the concentration of pores on the membrane. Since most pores are saturable, that is at high enough concentration of solute the rate of transport through the pores reaches a maximum, we can write that the rate of transformation in moles (amount) per unit area per unit time (the flux, $J_A$) is given by a generic saturable rate equation such as:

$$ J_A = e \frac{k_f S_1 - k_r S_2}{1 + S_1/K_{m1} + S_2/K_{m2}} $$

where $k_f$ and $k_r$ are the forward and reverse rate constants such that $k_f/k_r = K_{eq}$. As such we can write:

$$ J_A = e k_f \frac{S_1 - S_2/K_{eq}}{1 + S_1/K_{m1} + S_2/K_{m2}} $$

There are many variants on this basic equation depending on the specific mechanism but for many systems it can serve as a first approximation. Given the units for $J_A, e$, and the rate term, the units for $k_f$ are mol $l^3 t^{-1}$. If the transporter is simply allowing passage of solute from one side of the membrane to the other, the $K_{eq}$ is likely to be unity.

**Figure** <a id="fig-simplecompartmentreaction1"></a> `fig:SimpleCompartmentReaction1`

*Caption:* Two compartment model with volumes $V_1$ and $V_2$. $S_1$ and $S_2$ move through saturable protein pores in the membrane.

```latex
\begin{figure}[hbt]
\begin{center}
\begin{tikzpicture}[>=latex', node distance=2cm]

  \node at (1.8,  0) {\Large S$_1$};
  \node at (4.4,0) {\Large S$_2$};

  \draw [<->,ultra thick,blue] (2.3,0) -- (4,0);

  \draw[draw=red,very thick] (0.6,-1.2) rectangle (3,1);
  \draw[draw=red,very thick] (3,-1.2) rectangle (8,1);
  \filldraw[draw=red,fill=orange] (3,0) circle (3pt);
  \filldraw[draw=red,fill=orange] (3,0.6) circle (3pt);
  \filldraw[draw=red,fill=orange] (3,0.3) circle (3pt);
  \filldraw[draw=red,fill=orange] (3,-0.3) circle (3pt);
  \filldraw[draw=red,fill=orange] (3,-0.6) circle (3pt);
  \node at (2.6,0.7) {$A$};
  \node at (1,-0.85) {$V_1$};
  \node at (3.5,-0.85) {$V_2$};
\end{tikzpicture}
\end{center}
\caption{Two compartment model with volumes $V_1$ and $V_2$. $S_1$ and $S_2$ move through saturable protein pores in the membrane.}
\label{fig:SimpleCompartmentReaction1}
\end{figure}
```

The total flux across the membrane, $J_A$, is given as before:

$$ J = A J_A $$

The total flux will equal the following:

$$ \frac{dn_1}{dt} = -J \qquad \frac{dn_2}{dt} = J $$

This means that the rate of change of concentration of $S_1$ and $S_2$ is given by:

$$ \frac{dS_1}{dt} = -\frac{J}{V_1} \qquad \frac{dS_2}{dt} = -\frac{J}{V_2} $$

**Table**

*Caption:* Units for transporter model. $l$ represents length; $S$ reactant; $t$ time.

```latex
\begin{table}
\centering
\begin{tabular}{lll} \toprule
Name & Symbols & Units \\ \midrule
Net Flux & J & mol $t^{-1}$ \\
Flux & $J_A$ & mol $l^{-2}\ t^{-1}$ \\
Area & $A$  & $l^2$ \\
Volume & V & $l^{3}$ \\
Concentration & $S$ & mol $l^{-3}$\\
Transporter & $e$ & mol $l^{-2}$ \\
Rate Constant & $k_f$ & mol $l^{3}\ t^{-1}$ \\ \bottomrule
\end{tabular}
\caption{Units for transporter model. $l$ represents length; $S$ reactant; $t$ time.}
\end{table}
```

Figure `jarnac:chap:MultiCompartmentTransporter` shows a Tellurium script that represents the transporter model. A few things are worth reviewing in greater detail. By default, Tellurium solves all differential equations in terms of amounts per unit time. This means there is no need to explicitly adjust volume sizes in any equations. Instead, we define the compartments we need using the `vol` keyword, and then indicate which species is in which compartment. All volume adjustments are automatic. Tellurium stores levels of species as amounts and converts to concentrations on an as needed basis, e.g. when a concentration is specified in a rate law. This makes it straight forward to build multicompartment models using Tellurium.

Figure [Figure: Simulation results of a membrane transporter](#fig-multicompartmenttransporter) shows the results of the simulation. In this case the volume ratio is 1 to 10. Notice how the concentration of $S_1$ starts at 21 but ends up at 1 in the first compartment, and 2 in the second compartment. We can check mass conservation by summing up the mass in each compartment. The total mass at time zero is $21 \times 1 = 21$. The total mass at the end of the run is: $1 \times 1 + 2 \times 10 = 21$. Therefore the mass has been conserved.

```python
import tellurium as te

r = te.loada ('''
    compartment V1, V2;
    var S1 in V1, S2 in V2;
    S1 -> S2; A*k*(S1-S2/Keq)/(1 + S1/Km1 + S2/Km2);

    V1 = 1;  V2 = 10;
    S1 = 21;
    A = 1; k = 1;
    Km1 = 0.5; Km2 = 0.5; Keq = 2;
''')

result = r.simulate(0, 200, 100)
r.plot()
print ("Total Mass = ", r.S1*r.V1 + r.S2*r.V2)
```

**Figure** <a id="fig-multicompartmenttransporter"></a> `fig:MultiCompartmentTransporter`

*Graphic (not in the LaTeX source, referenced by name): `MultiCompartmentTransporter`*

*Caption:* Simulation results of a membrane transporter. Upper line on left is $S_1$ and lower line on left is $S_2$.

```latex
\begin{figure}[htb]
\centering
    \includegraphics[scale = 0.45]{MultiCompartmentTransporter}
\caption{Simulation results of a membrane transporter. Upper line on left is $S_1$ and lower line on left is $S_2$.} \label{fig:MultiCompartmentTransporter}
\end{figure}
```

## Three Compartment Model

One final example uses three compartments of decreasing volume.  The equilibrium constants for the transport across each membrane equal unity.

**Figure** <a id="fig-simplecompartmentreaction2"></a> `fig:SimpleCompartmentReaction2`

*Caption:* Three compartment model with volumes $V_1$, $V_2$, and $V_3$. $S_1$, $S_2$, and $S_3$ move through saturable protein pores in the membrane.

```latex
\begin{figure}[hbt]
\begin{center}
\begin{tikzpicture}[>=latex', node distance=2cm]

  \node at (4.7,  0) {\Large S$_1$};
  \node at (7.15,0) {\Large S$_2$};
  \node at (8.65,0) {\Large S$_3$};

  \draw [<->,ultra thick,blue] (5,0) -- (6.9,0);
  \draw [<->,ultra thick,blue] (7.5,0) -- (8.45,0);

  \draw[draw=red,very thick] (0.6,-1.2) rectangle (6,1);
  \draw[draw=red,very thick] (6,-1.2) rectangle (8,1);
  \draw[draw=red,very thick] (8,-1.2) rectangle (9,1);
  \filldraw[draw=red,fill=orange] (6,0) circle (3pt);
  \filldraw[draw=red,fill=orange] (6,0.6) circle (3pt);
  \filldraw[draw=red,fill=orange] (6,0.3) circle (3pt);
  \filldraw[draw=red,fill=orange] (6,-0.3) circle (3pt);
  \filldraw[draw=red,fill=orange] (6,-0.6) circle (3pt);

  \filldraw[draw=lightishgreen,fill=verylightgreen] (8,0) circle (3pt);
  \filldraw[draw=lightishgreen,fill=verylightgreen] (8,0.6) circle (3pt);
  \filldraw[draw=lightishgreen,fill=verylightgreen] (8,0.3) circle (3pt);
  \filldraw[draw=lightishgreen,fill=verylightgreen] (8,-0.3) circle (3pt);
  \filldraw[draw=lightishgreen,fill=verylightgreen] (8,-0.6) circle (3pt);

  \node at (5.5,0.7) {$A$};
  \node at (1,-0.85) {$V_1$};
  \node at (6.6,-0.85) {$V_2$};
  \node at (8.45,-0.85) {$V_3$};
\end{tikzpicture}
\end{center}
\caption{Three compartment model with volumes $V_1$, $V_2$, and $V_3$. $S_1$, $S_2$, and $S_3$ move through saturable protein pores in the membrane.}
\label{fig:SimpleCompartmentReaction2}
\end{figure}
```

```python
import tellurium as te
import pylab

r = te.loada ('''
    compartment V1, V2, V3;
    var S1 in V1, S2 in V2, S3 in V3;
    S1 -> S2; A*k1*(S1-S2/Keq)/(1 + S1/Km1 + S2/Km2);
    S2 -> S3; A*k2*(S2-S3/Keq)/(1 + S2/Km1 + S3/Km2);

    V1 = 100; V2 = 10; V3 = 1;
    S1 = 10;
    A = 1; k1 = 100; k2 = 25;
    Km1 = 0.5; Km2 = 0.5;
    Keq = 1;
''')

result = r.simulate(0, 20, 100);
r.plot(xlim=(0,20),ylim=(0,15))
print ("Total Mass = ", r.S1*r.V1 + r.S2*r.V2 + r.S3*r.V3);
```

**Figure** <a id="fig-multicompartmentthree"></a> `fig:MultiCompartmentThree`

*Caption:* Simulation results of a membrane transport involving three compartments. Volumes are 100, 10, and 1, respectively. Notice how the concentration in the first compartment hardly changes. Upper curve is $S_1$, middle curve $S_2$, and lower curve $S_3$.

```latex
\begin{figure}
\begin{center}
\begin{tikzpicture}
\begin{axis}[
xlabel={Time},
ylabel={Variables},
xmin=0, xmax=5, ymin=0, ymax=15,
width=10cm,
height=6cm, legend pos= south east]
\addplot[color=red,line width=1.5pt] coordinates {
(         0,         10)(0.050505051,  9.9798861)( 0.1010101,  9.9647588)(0.15151515,   9.952601)( 0.2020202,   9.942457)(0.25252525,  9.9337774)( 0.3030303,  9.9262133)(0.35353535,  9.9195278)
( 0.4040404,  9.9135513)(0.45454545,  9.9081595)(0.50505051,  9.9032569)(0.55555556,  9.8987702)(0.60606061,  9.8946406)(0.65656566,  9.8908209)(0.70707071,  9.8872724)(0.75757576,  9.8839633)
(0.80808081,  9.8808669)(0.85858586,  9.8779606)(0.90909091,  9.8752254)(0.95959596,  9.8726447)(  1.010101,  9.8702045)( 1.0606061,  9.8678925)( 1.1111111,  9.8656978)( 1.1616162,  9.8636111)
( 1.2121212,  9.8616239)( 1.2626263,  9.8597289)( 1.3131313,  9.8579194)( 1.3636364,  9.8561895)( 1.4141414,   9.854534)( 1.4646465,  9.8529479)( 1.5151515,   9.851427)( 1.5656566,  9.8499674)
( 1.6161616,  9.8485653)( 1.6666667,  9.8472176)( 1.7171717,  9.8459213)( 1.7676768,  9.8446735)( 1.8181818,  9.8434717)( 1.8686869,  9.8423136)( 1.9191919,  9.8411969)(  1.969697,  9.8401196)
(  2.020202,  9.8390799)( 2.0707071,   9.838076)( 2.1212121,  9.8371062)( 2.1717172,   9.836169)( 2.2222222,  9.8352629)( 2.2727273,  9.8343867)( 2.3232323,   9.833539)( 2.3737374,  9.8327187)
( 2.4242424,  9.8319245)( 2.4747475,  9.8311556)( 2.5252525,  9.8304107)( 2.5757576,  9.8296891)( 2.6262626,  9.8289898)( 2.6767677,  9.8283119)( 2.7272727,  9.8276547)( 2.7777778,  9.8270174)
( 2.8282828,  9.8263991)( 2.8787879,  9.8257994)( 2.9292929,  9.8252174)(  2.979798,  9.8246526)(  3.030303,  9.8241043)( 3.0808081,  9.8235719)( 3.1313131,  9.8230551)( 3.1818182,   9.822553)
( 3.2323232,  9.8220654)( 3.2828283,  9.8215917)( 3.3333333,  9.8211315)( 3.3838384,  9.8206842)( 3.4343434,  9.8202496)( 3.4848485,  9.8198271)( 3.5353535,  9.8194164)( 3.5858586,  9.8190171)
( 3.6363636,  9.8186289)( 3.6868687,  9.8182513)( 3.7373737,  9.8178841)( 3.7878788,   9.817527)( 3.8383838,  9.8171796)( 3.8888889,  9.8168417)( 3.9393939,  9.8165129)(  3.989899,   9.816193)
(  4.040404,  9.8158817)( 4.0909091,  9.8155787)( 4.1414141,  9.8152839)( 4.1919192,  9.8149969)( 4.2424242,  9.8147176)( 4.2929293,  9.8144456)( 4.3434343,  9.8141809)( 4.3939394,  9.8139232)
( 4.4444444,  9.8136722)( 4.4949495,  9.8134278)( 4.5454545,  9.8131899)( 4.5959596,  9.8129582)( 4.6464646,  9.8127325)( 4.6969697,  9.8125127)( 4.7474747,  9.8122986)( 4.7979798,    9.81209)
( 4.8484848,  9.8118869)( 4.8989899,   9.811689)( 4.9494949,  9.8114961)(         5,  9.8113083)};
\addlegendentry{$S_1$}
\addplot[color=blue,line width=1.5pt] coordinates {
(         0,          0)(0.050505051,  1.7122989)( 0.1010101,  2.8715224)(0.15151515,  3.7471492)( 0.2020202,  4.4381073)(0.25252525,   4.998976)( 0.3030303,  5.4636881)(0.35353535,  5.8548874)
( 0.4040404,  6.1885198)(0.45454545,  6.4761246)(0.50505051,  6.7263895)(0.55555556,  6.9459066)(0.60606061,  7.1398488)(0.65656566,  7.3123131)(0.70707071,  7.4665849)(0.75757576,  7.6053258)
(0.80808081,  7.7307168)(0.85858586,  7.8445623)(0.90909091,  7.9483622)(0.95959596,  8.0433735)(  1.010101,  8.1306571)( 1.0606061,  8.2111109)( 1.1111111,  8.2855085)( 1.1616162,  8.3545086)
( 1.2121212,  8.4186801)( 1.2626263,   8.478514)( 1.3131313,  8.5344377)( 1.3636364,  8.5868241)( 1.4141414,  8.6360002)( 1.4646465,  8.6822584)( 1.5151515,  8.7258476)( 1.5656566,  8.7669929)
( 1.6161616,  8.8058941)( 1.6666667,  8.8427292)( 1.7171717,  8.8776575)( 1.7676768,  8.9108219)( 1.8181818,  8.9423508)( 1.8686869,  8.9723603)( 1.9191919,  9.0009551)(  1.969697,  9.0282303)
(  2.020202,  9.0542724)( 2.0707071,  9.0791602)( 2.1212121,  9.1029655)( 2.1717172,  9.1257542)( 2.2222222,  9.1475869)( 2.2727273,  9.1685191)( 2.3232323,  9.1886018)( 2.3737374,  9.2078822)
( 2.4242424,  9.2264039)( 2.4747475,  9.2442075)( 2.5252525,  9.2613302)( 2.5757576,  9.2778072)( 2.6262626,  9.2936706)( 2.6767677,  9.3089509)( 2.7272727,  9.3236763)( 2.7777778,  9.3378732)
( 2.8282828,  9.3515662)( 2.8787879,  9.3647787)( 2.9292929,  9.3775324)(  2.979798,  9.3898476)(  3.030303,  9.4017437)( 3.0808081,  9.4132389)( 3.1313131,  9.4243501)( 3.1818182,  9.4350936)
( 3.2323232,  9.4454846)( 3.2828283,  9.4555376)( 3.3333333,  9.4652662)( 3.3838384,  9.4746834)( 3.4343434,  9.4838014)( 3.4848485,  9.4926319)( 3.5353535,  9.5011859)( 3.5858586,  9.5094741)
( 3.6363636,  9.5175064)( 3.6868687,  9.5252923)( 3.7373737,  9.5328409)( 3.7878788,   9.540161)( 3.8383838,  9.5472606)( 3.8888889,  9.5541477)( 3.9393939,  9.5608298)(  3.989899,  9.5673142)
(  4.040404,  9.5736077)( 4.0909091,  9.5797169)( 4.1414141,  9.5856481)( 4.1919192,  9.5914074)( 4.2424242,  9.5970005)( 4.2929293,  9.6024331)( 4.3434343,  9.6077103)( 4.3939394,  9.6128374)
( 4.4444444,  9.6178192)( 4.4949495,  9.6226605)( 4.5454545,  9.6273657)( 4.5959596,  9.6319392)( 4.6464646,  9.6363853)( 4.6969697,  9.6407078)( 4.7474747,  9.6449108)( 4.7979798,  9.6489978)
( 4.8484848,  9.6529726)( 4.8989899,  9.6568385)( 4.9494949,  9.6605989)(         5,   9.664257)};
\addlegendentry{$S_2$}
\addplot[color=green,line width=1.5pt] coordinates {
(         0,          0)(0.050505051, 0.29909414)( 0.1010101, 0.65259637)(0.15151515, 0.99274831)( 0.2020202,  1.3161956)(0.25252525,   1.623285)( 0.3030303,  1.9149837)(0.35353535,  2.1923375)
( 0.4040404,  2.4563465)(0.45454545,  2.7079271)(0.50505051,  2.9479184)(0.55555556,   3.177077)(0.60606061,  3.3960938)(0.65656566,  3.6056001)(0.70707071,   3.806173)(0.75757576,  3.9983416)
(0.80808081,  4.1825921)(0.85858586,  4.3593735)(0.90909091,  4.5290998)(0.95959596,   4.692154)(  1.010101,  4.8488912)( 1.0606061,    4.99964)( 1.1111111,  5.1447088)( 1.1616162,  5.2843834)
( 1.2121212,  5.4189308)( 1.2626263,  5.5486002)( 1.3131313,  5.6736244)( 1.3636364,  5.7942215)( 1.4141414,  5.9105961)( 1.4646465,  6.0229471)( 1.5151515,  6.1314487)( 1.5656566,  6.2362708)
( 1.6161616,  6.3375734)( 1.6666667,  6.4355072)( 1.7171717,  6.5302144)( 1.7676768,  6.6218293)( 1.8181818,  6.7104791)( 1.8686869,  6.7962839)( 1.9191919,  6.8793575)(  1.969697,  6.9598079)
(  2.020202,  7.0377374)( 2.0707071,  7.1132432)( 2.1212121,  7.1864176)( 2.1717172,  7.2573486)( 2.2222222,  7.3261198)( 2.2727273,  7.3928107)( 2.3232323,  7.4574972)( 2.3737374,  7.5202515)
( 2.4242424,  7.5811426)( 2.4747475,  7.6402363)( 2.5252525,  7.6975956)( 2.5757576,  7.7532805)( 2.6262626,  7.8073486)( 2.6767677,  7.8598549)( 2.7272727,  7.9108521)( 2.7777778,  7.9603906)
( 2.8282828,  8.0085189)( 2.8787879,  8.0552834)( 2.9292929,  8.1007285)(  2.979798,   8.144897)(  3.030303,  8.1878298)( 3.0808081,  8.2295664)( 3.1313131,  8.2701448)( 3.1818182,  8.3096014)
( 3.2323232,  8.3479713)( 3.2828283,  8.3852881)( 3.3333333,  8.4215845)( 3.3838384,  8.4568917)( 3.4343434,  8.4912398)( 3.4848485,   8.524658)( 3.5353535,  8.5571741)( 3.5858586,  8.5888153)
( 3.6363636,  8.6196075)( 3.6868687,   8.649576)( 3.7373737,   8.678745)( 3.7878788,  8.7071379)( 3.8383838,  8.7347772)( 3.8888889,  8.7616849)( 3.9393939,   8.787882)(  3.989899,  8.8133891)
(  4.040404,  8.8382258)( 4.0909091,  8.8624115)( 4.1414141,  8.8859644)( 4.1919192,  8.9089026)( 4.2424242,  8.9312434)( 4.2929293,  8.9530035)( 4.3434343,  8.9741992)( 4.3939394,  8.9948462)
( 4.4444444,  9.0149597)( 4.4949495,  9.0345546)( 4.5454545,  9.0536449)( 4.5959596,  9.0722448)( 4.6464646,  9.0903675)( 4.6969697,  9.1080261)( 4.7474747,  9.1252332)( 4.7979798,   9.142001)
( 4.8484848,  9.1583415)( 4.8989899,  9.1742662)( 4.9494949,  9.1897862)(         5,  9.2049124)};
\addlegendentry{$S_3$}
\end{axis}
\end{tikzpicture}
\end{center}
\caption{Simulation results of a membrane transport involving three compartments. Volumes are 100, 10, and 1, respectively. Notice how the concentration in the first compartment hardly changes. Upper curve is $S_1$, middle curve $S_2$, and lower curve $S_3$.}
\label{fig:MultiCompartmentThree}
\end{figure}
```

Figure [Figure: Simulation results of a membrane transport involving three compartment](#fig-multicompartmentthree) shows the time-course behavior for the three compartment model. Note that the concentration of $S_1$ (upper curve) hardly changes and that all three curves converge to the same concentration. This is due the fact that we assumed that both equilibrium constants were equal to 1.0.

## Further Reading

There are surprisingly few books on compartmental analysis in systems biology. Most books focus on pharmokinetic modeling, and it takes a little effort to translate the pharmokinetic formalism into a systems biology one. I list three books here, the most useful being the Neame and Richards book which can be obtained easily on the second-hand market. Atkins is a small book but one I consider a classic. For more advanced students Atkins also offers a painless introduction to the use of Laplace transforms for solving linear differential equations.

- Atkins, GL (1969), Multicompartment models for biological systems, Methuen London, SBN: 416 13820 9 (SBN is not a typo)

- Jacquez, JA (1985). Compartmental analysis in biology and medicine. Ann Arbor: University of Michigan Press. The third edition (1996) is available from <http://www.biomedware.com> or directly from <http://tinyurl.com/msh54u6>.

- Neame, KD and Richards TG (1972). Elementary kinetics of membrane carrier transport. New York: Wiley. ISBN: 0-470-63078-7

## Exercises

All exercises, together with solutions, can now be found at: <https://github.com/hsauro/PathwayModelingBook>

<!-- \begin{enumerate} -->
<!-- \item The figure below shows a system of two compartments with volumes $V_1$ and $V_2$. There are three membrane transporters, $P_1, P_2$, and $P_3$ and three cytosolic reactions, $R_1, R_2$, and $R_3$. Write out the differential equations that describe the changes in amounts of $A, B, C$, and $D$. Assume simple facilitated diffusion for the transporters and irreversible first-order kinetics for the reactions. Build a computer model of the system and investigate how the output fluxes at $R_2$ and $R_3$ are influenced by the difference in volume between $V_1$ and $V_2$. -->

<!-- \begin{center} -->
<!-- \includegraphics[scale = 0.9]{Compartment1} -->
<!-- \end{center} -->

<!-- For example, assign reasonable values to all the rate constants in the model, set the two volumes to unity ($V_1 = V_2 = 1$), and compute the two output fluxes. Now increase $V_2$ ten fold while keeping all other parameters the same. What happens to the $R_2$ and $R_3$? -->

<!-- \end{enumerate} -->

<!-- \section*{Answers} -->

<!-- \begin{enumerate} -->

<!-- \item -->
<!-- \begin{verbatim} -->
<!-- import tellurium as te -->
<!-- r = te.loada(''' -->
<!-- compartment V1, V2 -->
<!-- var A in V1, C in V1, D in V1 -->
<!-- var B in V2 -->
<!-- ext Out -->

<!-- P1: -> A; P1_d*(Out - A); -->
<!-- R1: A -> C; k1*A -->
<!-- R2: C ->; k2*C -->

<!-- P2: A -> B; P2_d*(A - B) -->
<!-- P3: B -> D; P3_d*(B - D) -->

<!-- R3: D ->; k3*D -->

<!-- P1_d = 0.1; P2_d = 0.34; P3_d = 0.26 -->
<!-- Out = 1 -->
<!-- k1 = 0.67; k2 = 0.87; k3 = 0.56 -->
<!-- A = 0; B = 0; C = 0; D = 0; -->

<!-- V2 = 10 -->
<!-- ''') -->

<!-- m = r.simulate (0, 10, 100) -->
<!-- r.plot() -->
<!-- \end{verbatim} -->

<!-- \end{enumerate} -->

---

## Index terms recorded in this chapter

- cross-sectional area
- diffusion
- diffusion coefficient
- Fick's first law
- gradient
- membrane
- multicompartment systems
- permeability coefficient
- protein pore

---

← [[07_how_systems_behave|How Systems Behave]] · [[index|Wiki index]] · [[09_fitting_models|Fitting Models]] →
