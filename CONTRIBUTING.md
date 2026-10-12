# Contributing to The Vertex-Distance Perimeter Theorem

Thank you for your interest in contributing! This project spans mathematics, computer science, and interactive visualization, so there are many ways to get involved.

## 🧮 Mathematical Contributions

- **New proofs or simplifications** of existing theorems
- **New special cases** (e.g., specific triangle types not yet covered)
- **Corrections** to any mathematical errors
- **New geometric invariants** or relationships

Please write mathematical content in LaTeX, following the notation conventions in `docs/paper/chapters/`.

### Notation Conventions
- Triangle vertices: `A, B, C` (uppercase)
- Interior point: `P`
- Distances from P to vertices: `d_1, d_2, d_3`
- Side lengths: `a` (opposite A), `b` (opposite B), `c` (opposite C)
- Angles at P: `\alpha, \beta, \gamma` (opposite the respective sides)
- Perimeter: `\mathcal{P} = a + b + c`
- Semi-perimeter: `s = \mathcal{P}/2`

## 💻 Code Contributions

### Setting Up Development

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
- **Python**: Follow PEP 8. Use type hints everywhere. Docstrings in NumPy format.
- **TypeScript**: ESLint + Prettier. Strict mode. JSDoc comments.
- **Go**: `gofmt`. Standard Go conventions. Comments on all exported symbols.
- **Rust**: `rustfmt`. Clippy-clean. Doc comments with examples.

### Adding a New Solver
1. Implement the solver in `engines/<language>/src/`
2. Add comprehensive tests in `engines/<language>/tests/`
3. Add the solver to the benchmark suite in `data/benchmarks/`
4. Update the web UI solver dropdown in `web/src/components/panels/SolverPanel.ts`
5. Document the algorithm in `docs/paper/chapters/19-numerical-methods.tex`

### Adding a New Triangle Type
1. Add the classification logic in `triangle_classifier.py` (and equivalents)
2. Derive the specialized formula in a new LaTeX chapter
3. Add test cases with known solutions
4. Update the web UI type selector

## 🎨 UI/UX Contributions
- Follow the design system defined in `web/src/styles/global.css`
- Maintain dark/light mode support
- Ensure responsive design (mobile-first)
- Test with keyboard navigation and screen readers

## 📝 Pull Request Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run all tests: `./infra/scripts/test-all.sh`
5. Submit a PR with a clear description

## 🐛 Bug Reports
Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

## 💡 Feature Requests
Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md).

## 🧮 Mathematical Discussions
Use the [math discussion template](.github/ISSUE_TEMPLATE/math_discussion.md) for proposing new theorems, questioning existing proofs, or suggesting alternative approaches.

## 📜 Code of Conduct
Please read and follow our [Code of Conduct](.github/CODE_OF_CONDUCT.md).
