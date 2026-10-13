# The Vertex-Distance Perimeter Problem

### Analytical Foundations, Numerical Solvers, and Multi-Geometry Extensions

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](engines/python/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](engines/typescript/)
[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go&logoColor=white)](engines/go/)
[![Rust](https://img.shields.io/badge/Rust-WASM-DEA584?logo=rust&logoColor=white)](engines/rust-wasm/)
[![Lean 4](https://img.shields.io/badge/Lean_4-Formal_Proofs-purple)](proofs/)

---

## Abstract

Given a planar triangle ABC and an interior point P with known Euclidean distances $d_1 = PA$, $d_2 = PB$, $d_3 = PC$, determine the perimeter $\mathcal{P} = a + b + c$ of the triangle.

In the unconstrained Euclidean plane, a triangle possesses 3 intrinsic degrees of freedom (its side lengths $a, b, c$), and an interior point introduces 2 coordinate degrees of freedom ($x_P, y_P$). With only three scalar distance measurements $(d_1, d_2, d_3)$, the problem is underdetermined by two degrees of freedom. Fixing rigid rotational gauge leaves a one-dimensional continuous solution manifold of valid triangles. 

This repository provides an exhaustive academic monograph, exact symbolic solutions for constrained symmetries (equilateral, isosceles, right-angled), high-performance numerical engines in four programming languages, an interactive web simulation suite, and formal verifications in Lean 4.

---

## Research Monograph

A complete 74-page LaTeX monograph is compiled and available in the repository:
- **PDF Document:** [`The_Vertex_Distance_Perimeter_Problem.pdf`](The_Vertex_Distance_Perimeter_Problem.pdf)
- **Source Directory:** [`docs/paper/`](docs/paper/)

### Table of Contents
1. **Abstract & Problem Foundations** (`01-abstract.tex`)
2. **Introduction & Motivation** (`02-introduction.tex`)
3. **Historical Timeline: Euclid, Cayley, Menger, Pompeiu** (`03-historical-timeline.tex`)
4. **Problem Formulation & Polar Geometry** (`04-problem-formulation.tex`)
5. **Degrees of Freedom & Gauge Analysis** (`05-degrees-of-freedom.tex`)
6. **The Cayley-Menger Bordered Determinant** (`06-cayley-menger.tex`)
7. **Pompeiu's and Van Schooten's Theorems** (`07-pompeiu-theorem.tex`)
8. **Stewart and Leibniz Relations** (`08-stewart-leibniz.tex`)
9. **Analytical Derivations & Algebraic Geometry** (`09-analytical-derivation.tex`)
10. **Existence and Uniqueness Manifolds** (`10-existence-uniqueness.tex`)
11. **The Equilateral Case (Closed-Form Solution)** (`11-equilateral-case.tex`)
12. **The Isosceles Triangle Case** (`12-isosceles-case.tex`)
13. **The Right Triangle Case** (`13-right-triangle-case.tex`)
14. **Acute and Obtuse Configurations** (`14-acute-obtuse-cases.tex`)
15. **The Master Generalized Formula** (`15-generalized-formula.tex`)
16. **Spherical Geometry Extension** (`16-spherical-extension.tex`)
17. **Hyperbolic Geometry Extension** (`17-hyperbolic-extension.tex`)
18. **3D Tetrahedron Generalization** (`18-3d-tetrahedron.tex`)
19. **Numerical Methods & Optimization** (`19-numerical-methods.tex`)
20. **Computational Benchmarks & Experimental Results** (`20-computational-results.tex`)
21. **Conclusion & Open Questions** (`21-conclusion.tex`)

---

## Mathematical Formulation

The relationship between the vertex distances and triangle edges is governed by the $5 \times 5$ Cayley-Menger bordered determinant. For four coplanar points $\{A, B, C, P\}$, the determinant vanishes:

$$\det \begin{pmatrix} 0 & 1 & 1 & 1 & 1 \\ 1 & 0 & c^2 & b^2 & d_1^2 \\ 1 & c^2 & 0 & a^2 & d_2^2 \\ 1 & b^2 & a^2 & 0 & d_3^2 \\ 1 & d_1^2 & d_2^2 & d_3^2 & 0 \end{pmatrix} = 0$$

For the equilateral configuration where $a = b = c = s$, algebraic reduction yields:

$$3(s^4 + d_1^4 + d_2^4 + d_3^4) = (s^2 + d_1^2 + d_2^2 + d_3^2)^2$$

Letting $u = s^2$, $S = d_1^2 + d_2^2 + d_3^2$, and $Q = d_1^4 + d_2^4 + d_3^4$:

$$2u^2 - 2Su + (3Q - S^2) = 0$$

For an interior point $P$, the unique admissible root is:

$$s = \sqrt{\frac{S + \sqrt{12S^2 - 24Q}}{2}} = \sqrt{\frac{d_1^2 + d_2^2 + d_3^2 + 4\sqrt{3}\,\text{Area}_{\text{Pompeiu}}}{2}}$$

The perimeter is strictly given by $\mathcal{P} = 3s$.

---

## Computational Engines

| Language | Directory | Capabilities |
|---|---|---|
| **Python** | [`engines/python/`](engines/python/) | Symbolic elimination via SymPy, Gröbner bases, 2D Newton-Raphson, Adam optimizer, Nelder-Mead simplex, and Bisection-Secant. |
| **Go** | [`engines/go/`](engines/go/) | Compiled high-throughput solver with concurrent goroutine execution and CLI interface. |
| **TypeScript** | [`engines/typescript/`](engines/typescript/) | Browser/Node.js library with typed geometry utilities and compensated floating-point evaluators. |
| **Rust / WASM** | [`engines/rust-wasm/`](engines/rust-wasm/) | Native routines compiled to WebAssembly via `wasm-bindgen`. |

---

## Interactive Web Laboratory

An interactive web suite is available in [`web/`](web/):
- **Interactive Sandbox:** Dynamic canvas allowing manipulation of vertices $A, B, C$ and point $P$ with real-time distance rays, angle sectors, and metrics.
- **Inverse Manifold Explorer:** Input distance triplets $(d_1, d_2, d_3)$ and traverse the 1D parameter $\alpha = \angle APB$ to inspect the family of valid triangles.
- **Solver Benchmark Tournament:** Real-time multi-algorithm benchmark comparing symbolic and iterative solvers.
- **Objective Landscape:** 2D heatmap over angle space $(\alpha, \beta)$ showing the loss valley and solver paths.
- **Theory & Proofs:** Mathematical expositions including Pompeiu's rotation proof and determinant expansions.

```bash
# Launch web application
cd web
npm install
npm run dev
```

---

## Synthetic Datasets and Benchmarks

The [`data/`](data/) directory provides tools for dataset generation and cross-language validation:
- [`data/datasets/generator.py`](data/datasets/generator.py): Samples valid triangles with interior points and generates CSV/JSON datasets.
- [`data/benchmarks/bench_runner.py`](data/benchmarks/bench_runner.py): Compares execution time and residual accuracy across Go, TypeScript, and Python.

---

## Non-Euclidean Extensions

- **Spherical Geometry ($S^2$):** Great-circle distance transformations via the spherical law of cosines ([`extensions/spherical/`](extensions/spherical/)).
- **Hyperbolic Geometry ($\mathbb{H}^2$):** Poincaré disk metric calculations ([`extensions/hyperbolic/`](extensions/hyperbolic/)).
- **3D Tetrahedron:** Extension to 3D simplices utilizing the $6 \times 6$ Cayley-Menger determinant ([`extensions/tetrahedron/`](extensions/tetrahedron/)).

---

## Formal Verification

Core geometric definitions and algebraic theorems are formalized in Lean 4 under [`proofs/TriangleThm/`](proofs/TriangleThm/).

---

## License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.
