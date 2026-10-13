export function renderTheoryPage(container: HTMLElement) {
  container.innerHTML = `
    <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;" class="fade-in">
      <!-- Header -->
      <div class="card">
        <h2 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; background: linear-gradient(135deg, #ffffff 30%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Theoretical Foundations & Core Theorems
        </h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
          An exploration of the underlying mathematical theorems, algebraic invariants, and geometric principles governing the Vertex-Distance Perimeter Problem.
        </p>
      </div>

      <!-- Section 1: Degrees of Freedom -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">1. The Underdetermined Manifold and Degree of Freedom Deficit</h3>
        </div>
        <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
          In Euclidean plane ℝ², any triangle has <strong>3 intrinsic degrees of freedom</strong> (its side lengths a, b, c). Specifying an arbitrary interior point P adds its 2 Cartesian coordinates (x, y). Thus, there are <strong>5 geometric unknowns</strong>:
        </p>
        <div class="math-formula">
          Unknowns: { a, b, c, x_P, y_P } ∈ ℝ⁵
        </div>
        <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
          However, measuring distances to the three vertices gives only 3 equations:
        </p>
        <div class="math-formula">
          d₁ = ||A - P||, \quad d₂ = ||B - P||, \quad d₃ = ||C - P||
        </div>
        <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
          This leaves a <strong>defect of 2 degrees of freedom</strong>. Fixing the global rotational angle leaves a <strong>1-dimensional continuous manifold</strong> of triangles that all share the exact same distance triplet. To isolate a single unique perimeter, an auxiliary constraint (e.g. equilateral shape, right angle) must be supplied!
        </p>
      </div>

      <!-- Section 2: Pompeiu's Theorem -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">2. Dimitrie Pompeiu's Theorem (1936)</h3>
        </div>
        <div class="math-callout" style="border-left-color: var(--accent-emerald);">
          <strong style="color: #34d399;">Theorem (Pompeiu, 1936):</strong>
          <p style="color: #e2e8f0; margin-top: 0.35rem; font-size: 0.95rem;">
            For any equilateral triangle △ABC in the plane and any arbitrary point P, the three distances PA, PB, PC can ALWAYS form the sides of a triangle (called <em>Pompeiu's Triangle</em>), unless P lies on the circumcircle of △ABC, in which case the largest distance equals the sum of the other two (Van Schooten's theorem).
          </p>
        </div>
        <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
          <strong>The 60° Rotation Proof:</strong> Rotate △ABP by 60° around vertex A to obtain △ACP'.
          Since ∠PAP' = 60° and AP = AP' = d₁, △APP' is equilateral, hence PP' = d₁.
          Furthermore, CP' = BP = d₂ by congruence. Thus, △PP'C has side lengths exactly:
        </p>
        <div class="math-formula">
          \text{Sides of } \triangle PP'C = \{ d₁, d₂, d₃ \}
        </div>
        <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
          This beautiful insight guarantees that for an equilateral triangle, distances (d₁, d₂, d₃) must strictly obey the triangle inequalities!
        </p>
      </div>

      <!-- Section 3: The Cayley-Menger Determinant -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">3. The 5×5 Cayley-Menger Bordered Determinant</h3>
        </div>
        <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
          In distance geometry (Arthur Cayley, 1841; Karl Menger, 1928), 4 points A, B, C, P are coplanar if and only if their 5×5 bordered distance matrix has determinant zero:
        </p>
        <div class="math-formula" style="font-size: 0.9rem; line-height: 1.8;">
          \det \begin{pmatrix}
          0 & 1 & 1 & 1 & 1 \\
          1 & 0 & c^2 & b^2 & d_1^2 \\
          1 & c^2 & 0 & a^2 & d_2^2 \\
          1 & b^2 & a^2 & 0 & d_3^2 \\
          1 & d_1^2 & d_2^2 & d_3^2 & 0
          \end{pmatrix} = 0
        </div>
        <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
          For an equilateral triangle where a = b = c = s, setting this determinant to zero yields the quartic equation in s²:
        </p>
        <div class="math-formula">
          3(s^4 + d_1^4 + d_2^4 + d_3^4) = (s^2 + d_1^2 + d_2^2 + d_3^2)^2
        </div>
        <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
          Solving this quadratic in s² yields our exact closed-form side length and perimeter!
        </p>
      </div>
    </div>
  `;
}
