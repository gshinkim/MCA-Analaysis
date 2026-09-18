# Answers to Questions

*Source: `appendixC.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Answers to Questions

**Chapter 12**

1.

$$
\begin{bmatrix}
-(k_1+k_2) & 0   
k_2 & -(k_3 + k_4)
\end{bmatrix}
$$

2a)

$$
\begin{bmatrix}
2 x & -2 y   
1-y & -x
\end{bmatrix}
$$

2b)

$$
\begin{bmatrix}
-y & 1 - x   
y & x
\end{bmatrix}
$$

3a)

$$ \bN =
\begin{bmatrix}
\phantom{-}1 & -1 & \phantom{-}0 & \phantom{-}0   
\phantom{-}0 & \phantom{-}1 & -1 & \phantom{-}1    
\phantom{-}0 & \phantom{-}0 & \phantom{-}1 & -1
\end{bmatrix}
$$

$$ \frac{dv}{ds} =
<!-- v1 v2 v3 v4 -->
\begin{bmatrix}
0 & dv_2/ds_1 & 0 & 0 \\[4pt]
0 & 0 & \dv_3/ds_2 & 0 \\[4pt]
0 & 0 & 0 & dv_4/ds_3
\end{bmatrix}
$$

<!-- --------------------------------x -->

3b)

$$ \bN =
\begin{bmatrix}
\phantom{-}1 & -1 & \phantom{-}1 &\phantom{-} 0   
\phantom{-}0 & \phantom{-}1 & -1 & -1
\end{bmatrix}
$$

$$ \frac{dv}{ds} =
<!-- v1 v2 v3 v4 -->
\begin{bmatrix}
0 & dv_2/ds_1 & 0 & 0 \\[4pt]
0 & 0 & \dv_3/ds_2 & \dv_4/ds_2
\end{bmatrix}
$$

<!-- --------------------------------- -->

3c)

$$ \bN =
\begin{bmatrix}
-1 & \phantom{-}0   
\phantom{-}1 & -1    
\phantom{-}0 & \phantom{-}1
\end{bmatrix}
$$

$$ \frac{dv}{ds} =
<!-- v1 v2 v3 v4 -->
\begin{bmatrix}
dv_1/ds_1 & 0 \\[4pt]
0 & \dv_2/ds_2 \\[4pt]
\dv_1/ds_3 & 0
\end{bmatrix}
$$

4.

The Jacobian matrix from question one is:

$$
\begin{bmatrix}
-(k_1+k_2) & 0   
k_2 & -(k_3 + k_4)
\end{bmatrix}
$$

This is a triangular matrix. The eigenvalues which determine the stability of the system are therefore the main diagonal elements, that is $\lambda_1 = -(k_1+k_2)$ and $\lambda_2 = -(k_3 + k_4)$. Since we can be sure that the rate constants are positive, the diagonal terms must be negative, hence the eigenvalues are negative, hence the system is stable.

5.

```python
import tellurium as te
import roadrunner

r = te.loada ('''
  $Xo -> S1;   Vm1*Xo/(Km1 + Xo + S1/Ki);
   S1 -> S2;  Vm2*S1/(Km2 + S1 + S2/Kj);
   S2 -> $X1; Vm3*S2/(Km3 + S2);

   Xo = 1; X1 = 0;
   Vm1 = 1.5; Vm2 = 2.3; Vm3 = 1.9
   Km1 = 0.5; Km2 = 0.6; Km3 = 0.45
   Ki = 0.1; Kj = 0.2

''')

print (r.getSteadyStateValues())
print (r.getFullEigenValues())
```

Output:

```python
[0.23769588 0.11506555]
[-1.5956469  -4.80299766]
```

Both eigenvalues are negative, hence the system is stable.

6.

```python
[0.54314267 1.45295567 0.66355019 0.91747197]

[ 0.10413548+2.31783485j
  0.10413548-2.31783485j
  -7.11859396+1.90379615j
  -7.11859396-1.90379615j]
```

The eigenvalues include a pair of conjugate eigenvalues. The system will therefore display an unstable spiral. simulation shows that system spirals out from the unstable steady state to form sustained oscillations. See Figure [[13_stability|Figure: Phase portrait for a two species reaction network]].

 7.

 Oscillations

---

← [[appendix_b_useful_numbers|Useful Numbers]] · [[index|Wiki index]] · [[appendix_d_kinetics_in_a_nutshell|Kinetics in a Nutshell]] →
