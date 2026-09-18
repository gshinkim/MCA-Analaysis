# Simulation Software

*Source: `chapterSimulationSoftware.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Simulation Software <a id="chap-systemstheory"></a>

## Introduction

Almost all the systems we will present in this book will be modeled using differential equations. This chapter will give a very brief description of how to use Matlab/Octave/Scilab or Jarnac to carry out many of the simulation described in the remaining chapters. For more details, the reader is referred to the documentation specific for the tool. To give a quick example, consider the production and degradation of some molecular species, $S$:

$$
\begin{equation}
\stackrel{v_o}{\rightarrow} S \stackrel{k}{\rightarrow}
\label{sys:simulateSimpleSystem}
\end{equation}
$$

To makes things simpler let us assume that the rate of production of $S$ is constant at a rate, $v_o$ and that the rate of degradation is a first-order reaction, $k S$. According to the conservation of mass, that rate of change of $S$ must equal the difference between the rate at which mass enters and the rate at which it leaves, that is:

$$
\begin{equation}
\frac{dS}{dt} = v_o - k S
\label{eqn:simulateSimpleSystem}
\end{equation}
$$

This equation represents a single ordinary differential equation. We would like to understand how the concentration of $S$ evolves in time. To answer this question we must solve the differential equation. There are many ways to do this but the simplest is to use a computer to compute the solution for us. We will illustrate this with Matlab/Octave and Jarnac.

## Using Scilab/Matlab/Octave

Matlab is a popular commercial application that can be used to carry out numerical calculations. Scilab and in particular Octave are both open source Matlab compatible versions which can be used instead. We will illustrate the solving of equation [Introduction](#eqn-simulatesimplesystem) using Scilab in this section because the Windows version of Octave is not very stable. The script shown in listing `scilab:simulateSimpleSystem` can be used to solve the differential equation.

```python
function ydot=f(t, y)
  ydot = 5 - 0.25*y
endfunction

y0=0;
t0=0;
t=0:0.1:15;
y=ode(y0,t0,t,f);
plot (t,y)
```

In the script, $v_o$ has been set to 5.0 and the rate constant $k$ to 0.25. When solving a differential equation we must assign our variables with initial conditions. In this case we only have a single variable, $y$ which we set to an initial value of 0. Scilab uses the ode function to solve the differential equation, this function takes four arguments, the initial condition values ($y_0$), the initial time, $t_0$, a vector containing the times at which the solution should be recorded and the function that represents the differential equation. There are additional optional arguments to the ode function but these can be found in the Scilab documentation. The equivalent Matlab script is given in listing `listing:matlab1`. Note there are slight differences particularly in relation to how the solver is called (lsode rather than ode) but these are minor differences.

**Figure** <a id="fig-scilab1"></a> `fig:scilab1`

*Graphic (not in the LaTeX source, referenced by name): `scilab1`*

*Caption:* Screen shot of Scilab in Operation

```latex
\begin{figure}[htb]
\begin{center}
  \includegraphics[scale = 0.35]{scilab1}
  \caption{Screen shot of Scilab in Operation}
  \label{fig:scilab1}
\end{center}
\end{figure}
```

```python
function ydot=f(t, y)
  ydot = 5 - 0.25*y
endfunction

y0=0;
t0=0;
t=0:0.1:15;
y=lsode("f", y0, t);
```

For systems with more than one variable it is straight forward to modify the code `scilab:simulateTwoSystem`. Consider the two species system:

$$
\begin{equation}
\stackrel{v_o}{\rightarrow} S_1 \stackrel{k_1}{\rightarrow} S_2 \stackrel{k_2}{\rightarrow}
\label{sys:simulateTwoSystem}
\end{equation}
$$

By mass conservation we can write two differential equations, one for $S_1$ and one for $S_2$:

$$
\begin{align*}
\frac{dS_1}{dt} &= v_o - k_1 S_1 \\[7pt]
\frac{dS_2}{dt} &= k_1 S_1 - k_2 S_2
\end{align*}
$$

The only changes are to include both differential equations in the function `f` and to initialize the `y0` vector with two values. One thing to note is the the `y0` vector must be a column vector.

```python
function ydot=f(t, y)
  ydot(1) = 5 - 0.25*y(1)
  ydot(2) = 0.25*y(1) - 0.45*y(2)
endfunction

// Note that the y0 vector must be a column vector
y0=[0; 0];
t0=0;
t=0:0.1:15;
y=ode(y0,t0,t,f);
plot (t,y)
```

## Using Jarnac

Jarnac is a script based tool that is designed specifically for simulating biochemical networks. In addition, any model described using Jarnac can be automatically converted to a Matlab script. To illustrate how we might simulate the previous system ([Introduction](#sys-simulatesimplesystem) the script shown in listing `jarnac:simulateSimpleSystem`.

```python
p = defn cell
      $source -> s; vo;
       s -> $waste; k*S;
end;

p.vo = 5; p.k1= 0.25; 
p.S = 0;

m = p.sim.eval (0, 15, 151);
graph (m);
```

Model `scilab:simulateTwoSystem` can also be easily modeled using Jarnac as the Jarnac script `jarnac:simulateTwoSystem` shows.

```python
p = defn cell
      $source -> S1; vo;
       S1 -> S_2; k1*S1;
       S2 -> $waste; k2*S2;
end;

p.vo = 0;
p.k1 = 0.25; p.k2 = 0.45;
p.S1 = 0; p.S2 = 0;

m = p.sim.eval (0, 15, 151);
graph (m);
```

### Converting Jarnac to Scilab/Matlab

It is easy to convert Jarnac models into equivalent Scilab script. Simply add the command `JarnacToScilab` to the model script `jarnac:ConvertToScilab`. Note that in the script, the command is placed before we attempt to run the model, this ensures that the initial conditions are saved to the Scilab file. There is also the equivalent `JarnacToMatlab` command.

```python
p = defn cell
      $source -> S1; vo;
       S1 -> S_2; k1*S1;
       S2 -> $waste; k2*S2;
end;

p.k1 = 0.25; p.k2 = 0.45;
p.S1 = 0; p.S2 = 0;

JarnacToScilab("c:\mymodel.sci");
m = p.sim.eval (0, 15, 151);
graph (m);
```

## Further Reading

- Scilab web site <www.scilab.org>

- Jarnac web site <http://sbw-app.org/jarnac/>

---

← [[supplement_computer_simulation_methods|Computer Simulation Methods]] · [[index|Wiki index]] · [[notes_bursting_model|Bursting Model (standalone notes)]] →
