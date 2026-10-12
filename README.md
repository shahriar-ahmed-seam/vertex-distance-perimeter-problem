<div align="center">

# 🔺 The Vertex-Distance Perimeter Theorem

### *"Three distances. Infinite triangles. One deep truth."*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](engines/python/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](engines/typescript/)
[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go&logoColor=white)](engines/go/)
[![Rust](https://img.shields.io/badge/Rust-WASM-DEA584?logo=rust&logoColor=white)](engines/rust-wasm/)
[![Lean 4](https://img.shields.io/badge/Lean_4-Formal_Proofs-purple)](proofs/)

---

**Given a triangle △ABC and an interior point P with known distances PA = d₁, PB = d₂, PC = d₃ — what can we determine about the triangle?**

</div>

---

## 🧮 The Problem

Place any triangle in the plane. Pick any point inside it. Measure the straight-line distances from that point to each vertex. That's all you know.

**Can you reconstruct the triangle? Can you find its perimeter?**

The answer is surprising: **no single triangle satisfies those distances — infinitely many do.** The three distances constrain the triangle to lie on a **one-dimensional solution manifold** — a continuous curve of valid triangles. This project explores that manifold from every conceivable angle.

## 🏗️ What This Project Contains

### 📚 Academic Documentation
An 80+ page LaTeX research paper covering:
- Complete historical timeline (Euclid → Cayley → Menger → Pompeiu)
- Rigorous degrees-of-freedom analysis
- The Cayley-Menger determinant and its expansion
- Pompeiu's theorem and Van Schooten's theorem
- Stewart's theorem and Leibniz formula connections
- Closed-form solutions for equilateral, isosceles, and right triangles
- Existence and uniqueness proofs
- Generalized master formula

### 💻 Computational Engines
Industrial-strength solvers in **4 languages**:

| Engine | Purpose | Solvers |
|--------|---------|---------|
| **Python** (SymPy) | Symbolic ground truth | Exact algebraic, Newton-Raphson, Gradient Descent, Nelder-Mead, Bisection-Secant |
| **TypeScript** | Browser runtime | All numeric solvers optimized for V8 |
| **Go** | High-throughput batch | Concurrent goroutine-based solving |
| **Rust → WASM** | Near-native web speed | Core loops compiled to WebAssembly |

### 🌐 Interactive Web Simulations
A premium web application with **7 interactive pages**:
- 🎮 **Dynamic Sandbox** — Drag vertices and point P in real time
- 🔄 **Inverse Finder** — Type distances, watch triangles morph
- 📊 **Error Landscape** — WebGL heatmap of the optimization surface
- 📈 **Convergence Visualizer** — Watch solvers race to solutions
- 🌐 **3D Geometry Viewer** — Three.js visualization of geometric constraints
- 📖 **Theory Explorer** — Interactive step-by-step proofs
- ℹ️ **About** — References and academic context

### 📈 Data Science & ML
- 1M+ synthetic triangle dataset
- Cross-language performance benchmarks
- Neural network perimeter predictor
- Floating-point precision analysis

### 🌍 Geometry Extensions
- **Spherical geometry** (triangles on a sphere)
- **Hyperbolic geometry** (Poincaré disk model)
- **3D tetrahedron** generalization

### 🔒 Formal Verification
Core theorems machine-checked in **Lean 4**.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/triangle-thm.git
cd triangle-thm

# Run the Python solver
cd engines/python
pip install -e .
python -m triangle_thm --d1 3 --d2 4 --d3 5 --type equilateral

# Launch the web application
cd ../../web
npm install
npm run dev

# Run all tests
./infra/scripts/test-all.sh
```

## 📖 Mathematical Essence

The core relationship is encoded in the **Cayley-Menger determinant**. For four coplanar points (three vertices A, B, C and interior point P), the following 5×5 determinant must vanish:

```
| 0    1     1     1     1   |
| 1    0     c²    b²    d₁² |
| 1    c²    0     a²    d₂² | = 0
| 1    b²    a²    0     d₃² |
| 1    d₁²   d₂²   d₃²   0  |
```

This single equation links the three known distances (d₁, d₂, d₃) to the three unknown side lengths (a, b, c), yielding a rich polynomial constraint that is the foundation of everything in this project.

## 📁 Repository Structure

```
triangle-thm/
├── docs/          📚 LaTeX paper, illustrations, Docusaurus site
├── engines/       💻 Python, TypeScript, Go, Rust solvers
├── web/           🌐 Interactive web application
├── data/          📈 Benchmarks, datasets, ML models
├── proofs/        🔒 Lean 4 formal proofs
├── extensions/    🌍 Spherical, hyperbolic, 3D extensions
└── infra/         🛠️ Docker, CI/CD, scripts
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. We welcome:
- 🧮 Mathematical improvements and new proofs
- 💻 New solver algorithms
- 🎨 UI/UX enhancements
- 📚 Documentation and translations
- 🐛 Bug reports and test cases

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

*Built with mathematical rigor and engineering ambition.*

**⭐ Star this repo if you love geometry!**

</div>
