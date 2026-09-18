# Math Fundamentals

*Source: `appendixF.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Math Fundamentals <a id="app-math"></a>

This Appendix highlights some of the notation used in this book and summarizes the most important mathematical concepts that students should be familiar with.

## Notation

**Sum and Product:**

$$ a_1 + a_2 + a_3 + ... + a_n = \sum_{i=1}^n a_i $$

$$ a_1 \times a_2 \times a_3 \times ... \times a_n = \prod_{i=1}^n a_i $$

**Vectors and Matrices:**

Bold lower case letters indicate vectors, for example: $\bv, \bs$

Bold upper case letters indicate matrices, for example: $\bN, \bX$

**Derivatives:**

On the left is Leibniz's notation and on the right Lagrange's notation:

$$
\begin{align*}
\frac{\df}{\dx} &\equiv f'(x) \\[6pt]
\frac{d^2f}{\dx^2} &\equiv f''(x) \\[6pt]
\frac{d^nf}{\dx^n} &\equiv f^{(n)}(x)
\end{align*}
$$

## Short Table of Derivatives

$$
\begin{align*}
&\frac{d}{dx}[c] = 0 & &\frac{d}{dx}[x] = 1 \\[9pt]
%
&\frac{d}{dx}[c u] = c\ \frac{du}{dx} & &\frac{d}{dx}[u + v] = \frac{du}{dx} + \frac{dv}{dx} \\[9pt]
%
&\frac{d}{dx}[u v] = u\ \frac{dv}{dx} + v\ \frac{du}{dx} & &\frac{d}{dx}[u/v]=  \frac{v\ \frac{du}{dx} - u\ \frac{dv}{dx}}{v^2} \\[9pt]
%
&\frac{d}{dx}[u^n] = n u^{n-1} \frac{du}{dx} & & \frac{d}{dx}[f(u)] = \frac{\df}{\du} f(u)\ \frac{du}{dx} \\[9pt]
%
&\frac{d}{dx}[\ln u] = \frac{1}{u}\ \frac{du}{dx} & &\frac{d e^u}{dx} = e^u \frac{du}{dx} \\[9pt]
%
&\frac{d}{dx}[\sin(u)] = \cos (u)\ \frac{du}{dx} & &\frac{d}{dx}[\cos(u)] = -\sin (u)\ \frac{du}{dx}
\end{align*}
$$

## Logarithms

$$
\begin{align*}
\log (A B) &= \log (A) + \log (B) \\[4pt]
\log (A/B) &= \log (A) - \log (B) \\[4pt]
\log (A^n) &= n\ \log (A) \\[4pt]
x^n \times x^m &= x^{n+m} \\[4pt]
\frac{x^n}{n^m} &= x^{n - m}\\[4pt]
(x^n)^m &= x^{n \times m}
\end{align*}
$$

## Partial Derivatives

If the value of a given function depends on two variables, then we write this function in the form:

$$ u = f(x, y) $$

If it is possible to change $x$ without affecting $y$, then $x$ and $y$ are called independent variables. The rate of change of $u$ with respect to $x$ when $x$ varies, but $y$ remains constant, is called the **partial derivative** of $u$ with respect to $x$. Partial derivatives are denoted using the partial symbol, $\partial$. For example, the partial derivative of $u$ with respect to $x$:

$$ \frac{\partial u}{\partial x} $$

Likewise, the partial derivative of $u$ with respect to $y$ is:

$$ \frac{\partial u}{\partial y} $$

To find a partial derivative we simply differentiate with respect to the variable of interest while treating the remaining variables as constants. For example, if the reaction rate for a given reaction is $v = k_1 S - k_2 P$, where $S$ is the reactant, $P$ the product, and $k_1$ and $k_2$ the rate constants. In a controlled environment we should in principle be able to independently change $S$ and $P$. Therefore, we can write down the partial derivatives of the reaction rate with respect to $S$ and $P$ as follows:

$$
\begin{align*}
\frac{\partial v}{\partial S} &= k_1 \\[5pt]
\frac{\partial v}{\partial P} &= -k_2
\end{align*}
$$

In order to indicate what variables are kept constant in the partial derivative, the following notation is sometimes used, particulary in thermodynamics:

$$
\begin{align*}
\left( \frac{\partial v}{\partial S} \right)_P  &= k_1 \\[5pt]
\left( \frac{\partial v}{\partial P} \right)_S &= -k_2
\end{align*}
$$

For functions with many variables, $x, y, z, ...$, the notation extends to:

$$ \left( \frac{\partial u}{\partial x} \right)_{y,z,...} $$

Like derivatives, partial derivatives are defined in terms of limits. For example, the partial derivatives for the function, $f(x,y)$ are defined as:

$$
\begin{align*}
\frac{\partial f (x,y)}{\partial x} = \lim_{h \to 0} \frac{f(x + h, y) - f(x, y)}{h} \\[5pt]
\frac{\partial f (x,y)}{\partial y} = \lim_{h \to 0} \frac{f(x, y + h) - f(x, y)}{h}
\end{align*}
$$

The graphical interpretation of a partial derivative, $\partial f (x,y)/\partial x$, is that it represents the slope of the function, $f (x,y)$ in the $x$ direction.

## Differential Equations

<a id="sec-ode"></a>

Differential equations are equations that contain derivatives. For example, the following is a differential equation:

$$ \frac{\dy}{\dx} + y^2 = 0 $$

An **ordinary differential equation** is where the derivative is a function of single independent variable. In science and engineering this independent variable is often time.
For example, the following equations are ordinary differential equations:

$$
\begin{align*}
\frac{\dy}{\dx} &= a y \\[6pt]
\frac{\dy}{\dx} &= 2 x + 3 y - 8 \\[6pt]
\frac{d^2y}{\dx^2} &- x \frac{\du}{\dx} = 0
\end{align*}
$$

A differential equation expressed in terms of the first derivative ($\dy/dx$) is called a first-order differential equation. A differential equation that is expressed in terms of second-order derivatives ($d^2y/\dx^2$) is called a second-order differential equation. When solving differential equations the objective is to find the function $y (x)$ such that when differentiated, gives the original differential equation. For example, the solution to:

$$ \frac{\dy}{\dx} = a y $$

is

$$
\begin{equation}
y = y_o e^{a x}
\label{eqn:appb:sol}
\end{equation}
$$

If we differentiate solution ([Differential Equations](#eqn-appb-sol)), we get back the original differential equation.

Differential equations are used frequently to model physical systems, describing the rate of change of some variable with respect to time, $t$. They are useful because we may not explicitly know the solution $y (t)$, but we will often know the rate of change of the variable at any given moment in time, $\dy/\dt$. This means we can at least obtain a numerical solution to $y (t)$ even if the analytical solution is unobtainable.,

Differential equations can be further classified as autonomous or non-autonomous. Autonomous differential equations are the most common in biochemical models. These equations do not depend on time, that is the right-hand side of the differential equation has no terms relating explicitly to time. For example, equation [Differential Equations](#eqn-autonomous) is autonomous, while equation [Differential Equations](#eqn-nonautonomous) is non-autonomous:

$$
\begin{equation}
\frac{dx}{dt} = x^2 + 10
\label{eqn:autonomous}
\end{equation}
$$

$$
\begin{equation}
\frac{dx}{dt} = x^2 + t - 5
\label{eqn:nonautonomous}
\end{equation}
$$

A **partial differential equation** is one where the derivatives are functions of more than one independents variable. Often in science and engineering, partial differential equations are a function of independent variables, time and space. For example, the following equation is a partial differential equation:

$$ \frac{\partial u}{\partial t} + u \frac{\partial u}{\partial x} = \frac{\partial p}{\partial x} $$

Note the use of the partial $d$ ($\partial$) in the partial differential equation to indicate that the function $u$ is differentiated with respect to more than one variable.

## Taylor Series <a id="sec-taylorseries"></a>

Expressions like $1 + 2x + 6x^2$ and $2 + 4x + x^2 - 3 x^3$ that contain the sum of a number of terms raised to a positive power are called polynomials. The only operations allowed in a polynomial are addition, subtraction, multiplication and non-negative integer powers. One of the simplest polynomials is the straight line, $y = a + bx$, termed a polynomial of first degree. The coefficients, $a$ and $b$, can be chosen so that the line will pass through any two points. As such, we can express any straight line using $y = a + bx$. Similarly for a polynomial of second degree, $y = a + bx + cx^2$, a parabola, we can choose the constants, $a, b$, and $c$ so that the curve passes through any three points.

It follows that we can find a polynomial equation of $n^{th}$ degree that will pass through any $n+1$ points. If the polynomial has an infinite number of terms, we imagine it could  be made to follow any function, $f(x)$, by suitable adjustment of the polynomial coefficients. Although this statement may not always be true, in many cases it is, which makes the polynomial series very useful.

A polynomial of infinite degree is called a polynomial series:

$$ f(x) = c_o + c_1 x + c_2 x^2 + c_3 x^3 + ... $$

The question is, how can we find the polynomial series that will represent a given function, for example $\sin (x)$? To answer this we have to determine the constants, $c_o, c_1$, etc. in the polynomial equation. Let us assume that we wish to know the value of $\sin(x)$ at $x=0$ using a polynomial series. At $x=0$, all terms vanish except for $c_o$, therefore at $x=0$:

$$ f(0) = c_o $$

We can therefore interpret the first constant, $c_o$, as the value of the function at $x=0$. What about $c_1$? Let us take the derivative of the series, that is:

$$ f'(x) = c_1 + 2 c_2 x + 3 c_3 x^2 + ... $$

If we set $x = 0$, we find that:

$$ f'(0) = c_1 $$

The second constant, $c_1$, in the polynomial series is the first derivative of the function. If we take the second derivative we can also show at $x = 0, f"(0) = 2 c_2$, that is $c_2 = f"(0)/2$. For the third derivative we can show that $f"'(0) = 3 \times 2 \times c_3$, that is $c_3 = f"'(0)/(3!)$. This pattern continues for the remaining terms in the polynomial so we can write:

$$ f(x) = f(0) + f'(0) x + \frac{f"(0)}{2!} x^2 + \frac{f"'(0)}{3!} x^3 + ... $$

This series is called the **Maclaurin series** for the function, $f(x)$. It approximates the function around the specific value of $x=0$. To illustrate the use of the Maclaurin series, consider expanding $\sin(x)$ around $x=0$. $f(0)$ equals $\sin(0) = 0$. $f'(0) = \cos (0) = 1$, and so on. We can therefore write the series as:

$$ \sin(x) = 0 + 1 x + 0 - \frac{1}{3!}x^3 + 0 + \frac{1}{5!} x^5 - ... $$

$$ \sin(x) = x - \frac{x^3}{3!} + \frac{x^5}{5!} - ... $$

What if we wanted to approximate a function about an arbitrary value $x_o$? To do this we use the Taylor series, which is a generalization of the Maclaurin series. The **Taylor series** is defined by:

$$
\begin{multline}
f(x) = f(x_o) + \frac{\partial f}{\partial x}\biggr\rvert_{x = x_o} (x - x_o) + \frac{1}{2!} \frac{\partial^2 f }{\partial x^2}\biggr\rvert_{x = x_o} (x - x_o)^2 \\[5pt]
+ \ldots + \frac{1}{n!} \frac{\partial^n f }{\partial x^n}\biggr\rvert_{x = x_o} (x - x_o)^n + \ldots
\end{multline}
$$

where the approximation is now centered on $x_o$. If we set $x_o$ equal to zero, we obtain the Maclaurin series.

**Table**

*Caption:* Examples of common approximations.

```latex
\begin{table}
\begin{center}
\begin{tabular}{ll}\toprule
Function & Second-order approximation \\\midrule
$\frac{1}{1+x} $ & $ 1 + x + x^2  $ \\[6pt]
$\sqrt{1 + x}$ & $ 1 + \frac{x}{2} + \frac{x^2}{8}  $ \\[6pt]
$ \sin(x) $ & $ x - \frac{x^3}{3!} $ \\ \bottomrule
\end{tabular}
\end{center}
\caption{Examples of common approximations.}
\end{table}
```

If we keep three terms in the Taylor series, we obtain another very important approximation called the **quadratic approximation**:

$$
\begin{align}
f(x) = f(x_0) + \delta x \frac{df}{dx}\biggr\rvert_{x = x_o} +  \frac{1}{2} (\delta x)^2 \frac{d^2f}{dx^2}\biggr\rvert_{x = x_o}
\label{eqn:QuadraticApproxOneVar}
\end{align}
$$

In optimization strategies, we can often approximate the fitness surface using a quadratic function near the optimum.

### Taylor Series in Two Dimensions <a id="app-taylortwod"></a>

It is possible to derive a Taylor series for equations with multiple variables, for example $f (x, y)$. In this case the expansion is a little bit more complicated. A Taylor series expansion around $x_o$ and $y_o$ for the function $f(x,y)$ is given by:

$$
\begin{align*}
f(x,y) & \approx f(x_o, y_o) + \frac{\partial f}{\partial x}\biggr\rvert_{x = x_o} (x - x_o)\, +\frac{\partial f}{\partial y}\biggr\rvert_{y = y_o} (y - y_o) \ + \\[7pt]
& \frac{1}{2!}\left[ (x-x_o)^2\,\frac{\partial^2 f}{\partial x^2}\biggr\rvert_{x = x_o}
     + 2(x - x_o) (y - y_o)\, \frac{\partial^2 f}{\partial x \partial y}\biggr\rvert_{\substack{x=x_o\\y = y_o}}  +(y-y_o)^2\, \frac{\partial^2 f}{\partial y^2}\biggr\rvert_{y = y_o} \right] \\[7pt]
     & + \ldots
\end{align*}
$$

where all derivatives are evaluated at the operating point, $x_o, y_o$. There is a very nice compact form for this equation, which can be written in terms of vectors and a matrix:

$$
 f (\mathbf{x_o})= f(\mathbf{x_o}) + (\mathbf{x} - \mathbf{x_o})^{T} \nabla f + \frac{1}{2!} (\mathbf{x} - \mathbf{x_o})^T  \mathbf{H} (\mathbf{x} - \mathbf{x_o}) + \cdots $$

where $\nabla\!f$ is called the gradient (or grad f), and $\mathbf{H}$ the Hessian. Note that in vector notation, $\mathbf{v}^{T}$ means that the vector is in row form, because by convention a vector is often depicted as a column. Given a function, $f(x, y, ...)$, $\nabla\!f$ is just the vector of partial derivatives:

$$ \nabla\!f = \left[ \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, ... \right]^{T} $$

The following equivalent notation in terms of the unit vectors is also frequently found in the literature for $\nabla\!f$:

$$ \nabla\!f = \frac{\partial f}{\partial x} \mathbf{i} +  \frac{\partial f}{\partial y} \mathbf{j} + ... $$

where $\mathbf{i}$ and $\mathbf{j}$ are the standard basis vectors, i.e $\mathbf{i} = [1, 0, 0, ...], \mathbf{j} = [0, 1, 0, ...]$, etc. The Hessian matrix, $\mathbf{H}$, for the function $f(x, y)$ is given by:

$$ \mathbf{H} =
\begin{bmatrix}
\dfrac{\partial^2 f}{\partial x  \partial x} & \dfrac{\partial^2 f}{\partial x \partial y} \\[12pt]
\dfrac{\partial^2 f}{\partial y \partial x} & \dfrac{\partial^2 f}{\partial y  \partial y}
\end{bmatrix} = \left[ \frac{\partial^2 f}{\partial x_i  \partial x_j} \right]
$$

which can be naturally extended to functions with any number of variables.

## Total Derivative

Consider the function:

$$ f(t) = f (x(t), y(t), t) $$

The derivative of $f(t)$ with respect to $t$, is given by the chain rule:

$$ \frac{\df}{\dt} = \frac{\partial f}{\partial x} \frac{\dx}{\dt} + \frac{\partial f}{\partial y} \frac{\dy}{\dt} + \frac{\partial f}{\partial t} $$

Note the use of partial derivatives. This equation is often abbreviated to:

$$ \df = \frac{\partial f}{\partial x} \dx + \frac{\partial f}{\partial y} \dy  + \frac{\partial f}{\partial t} dt  $$

where it is called the **total derivative**. Operationally, the total derivative computes the change in $f$, given small changes in $x$ and $y$.

## Eigenvalues and Eigenvectors

A square matrix such as $\bA$ can be used to transform a vector, $\bv$ in specific ways. For example, if the matrix $\bA$ is:

$$
\begin{bmatrix}
2 & 0   
0 & 4
\end{bmatrix}
$$

then the result of multiplying $\bA$ into $\bv$ will yield a vector that is similar to $\bv$ but where the first element is scaled by 2 and the second element by 4.

For an arbitrary square matrix, if it is possible to find a vector $\bv$ such than when we multiply the vector by $\bA$ we get a scaled version of $\bv$, then we call the vector $\bv$ an **eigenvector** of $\bA$ and the scaling value, the **eigenvalue** of $\bA$. For a matrix of dimension $n$, there will be at most $n$ eigenvalues and $n$ eigenvectors. In the case of the simple example above, the eigenvalues are 2 and 4, respectively, while the two eigenvector are:

$$
\begin{bmatrix}
\alpha   
0
\end{bmatrix}
\qquad
\begin{bmatrix}
0   
\alpha
\end{bmatrix}
$$

The definition of an eigenvector and eigenvalue is often given in the form:

$$ \bA \bv = \lambda \bv $$

We can rearrange this equation as follows:

$$
\begin{align*}
\bA \bv &= \lambda \bI \bv \\
\bA \bv - \lambda \bI \bv &= 0 \\
(\bA - \lambda \bI) \bv &= 0
\end{align*}
$$

From linear algebra, we know there will be non-zero solutions to $(\bA - \lambda \bI) \bv = 0$ if $det(\bA - \lambda\bI) = 0$. We can use this observation to compute the eigenvalues and eigenvectors of a matrix. For example, consider the matrix:

$$
\begin{bmatrix}
3 & 6   
1 & 4
\end{bmatrix}
$$

Computing $\bA - \lambda \bI$ yields:

$$
\begin{align*}
\bA - \lambda \bI &=
\begin{bmatrix}
3 - \lambda & 6 \\[4pt]
1 & 4 - \lambda
\end{bmatrix} \\[4pt]
\text{det}(\bA - \lambda \bI) &= (3 - \lambda) (4 - \lambda) - 6 \\[4pt]
&= \lambda^2 - 7 \lambda + 6 \\
&= (\lambda - 6)(\lambda - 1)
\end{align*}
$$

The eigenvalues are therefore 6 and 1. With two distinct eigenvalues there will be two eigenvectors. First we consider $\lambda = 6$.

$$
\begin{align*}
(\bA - \lambda \bI)\bv &=  0 \\
\left( \begin{bmatrix}
3 & 6 \\
1 & 4
\end{bmatrix}
-
\begin{bmatrix}
6 & 0 \\
0 & 6
\end{bmatrix}
\right) \bv &= 0 \\
\begin{bmatrix}
-3 & \phantom{-}6 \\
\phantom{-}1 & -2
\end{bmatrix} \bv &= 0
\end{align*}
$$

By inspection we can see that the eigenvector is:

$$ \begin{bmatrix}
2 \ 1
\end{bmatrix}
$$

Likewise we can do the same for the other eigenvalue, $\lambda = 1$ where the corresponding eigenvector is:

$$ \begin{bmatrix}
-3 \ \phantom{-}1
\end{bmatrix}
$$

## Further Reading

- Smail LL (1953) Analytical Geometry and Calculus. Appleton-Century-Crofts ISBN: 978-0982477311

---

## Index terms recorded in this chapter

- quadratic function
- Taylor Series

---

← [[appendix_e_enzyme_kinetics_in_a_nutshell|Enzyme Kinetics in a Nutshell]] · [[index|Wiki index]] · [[appendix_g_statistics_reminder|Statistics Reminder]] →
