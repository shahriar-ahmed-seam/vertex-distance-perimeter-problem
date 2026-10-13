# Contributing to The Vertex-Distance Perimeter Problem

Thank you for your interest in contributing to this project. Contributions across mathematics, scientific computing, and interactive visualization are welcomed.

## Mathematical Contributions

- New proofs, generalizations, or simplifications of existing formulations
- Novel constrained cases (e.g., specialized triangle geometries)
- Corrections to mathematical statements or derivations
- Geometric invariants and metric distance identities

Please format mathematical contributions in LaTeX, adhering to the notation in `docs/paper/chapters/`.

### Notation Conventions
- Triangle vertices: `A, B, C` (uppercase)
- Interior point: `P`
- Distances from P to vertices: `d_1, d_2, d_3`
- Side lengths: `a` (opposite A), `b` (opposite B), `c` (opposite C)
- Subtended angles at P: `\alpha, \beta, \gamma` (opposite the respective sides)
- Perimeter: `\mathcal{P} = a + b + c`
- Semi-perimeter: `s = \mathcal{P}/2`

## Code Contributions

### Development Setup

```bash
# Python engine
cd engines/python
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
pytest

# TypeScript engine & web app
cd engines/typescript
npm install
npm test

# Go engine
cd engines/go
go test ./...

# Rust WASM engine
cd engines/rust-wasm
cargo test
wasm-pack build --target web
```

### Code Style
- **Python**: PEP 8 compliance, explicit type annotations, docstrings.
- **TypeScript**: Strict mode, clean ES module syntax, JSDoc comments.
- **Go**: `gofmt`, standard idiomatic conventions, comments on exported symbols.
- **Rust**: `rustfmt`, Clippy-clean, doc comments.

### Adding a New Solver
1. Implement the numerical or symbolic routine in `engines/<language>/src/`
2. Add unit tests in `engines/<language>/tests/`
3. Include the solver in the benchmark runner under `data/benchmarks/`
4. Update the web application solver views
5. Document the algorithm in `docs/paper/chapters/19-numerical-methods.tex`

## Pull Request Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Ensure all tests pass across engines
4. Submit a Pull Request with a clear, descriptive summary of changes

## Bug Reports and Discussion
Submit issues through GitHub Issues for bugs, enhancements, or mathematical discussions.

## License
By contributing, you agree that your contributions will be licensed under the MIT License.
