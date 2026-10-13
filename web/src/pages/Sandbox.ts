import { TriangleCanvas, TriangleState } from '../components/canvas/TriangleCanvas.js';

export function renderSandboxPage(container: HTMLElement) {
  container.innerHTML = `
    <div class="dashboard-grid fade-in">
      <!-- Left: Interactive Canvas -->
      <div class="card" style="padding: 1rem;">
        <div class="card-header" style="margin-bottom: 0.75rem;">
          <h2 class="card-title">Interactive Triangle Canvas</h2>
          <div class="preset-buttons" style="margin-bottom: 0;">
            <button class="btn btn-sm" id="btn-preset-eq">Equilateral</button>
            <button class="btn btn-sm" id="btn-preset-right">Right Angle</button>
            <button class="btn btn-sm" id="btn-preset-iso">Isosceles</button>
            <button class="btn btn-sm" id="btn-preset-obtuse">Obtuse</button>
          </div>
        </div>

        <div class="canvas-container">
          <canvas id="triangle-canvas" width="900" height="580"></canvas>
          <div class="canvas-overlay-hints">
            <span class="hint-badge">Drag A, B, C or P</span>
            <span class="hint-badge" id="interior-badge">Interior: Valid</span>
          </div>
        </div>
      </div>

      <!-- Right: Real-Time Metrics & Properties Panel -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Live Geometric Metrics</h2>
        </div>

        <!-- Primary Highlight: Perimeter -->
        <div class="stats-grid">
          <div class="stat-box highlight">
            <span class="stat-label">Computed Perimeter (P = a + b + c)</span>
            <span class="stat-value glow-cyan" id="metric-perim">0.00</span>
          </div>

          <div class="stat-box">
            <span class="stat-label">Triangle Area</span>
            <span class="stat-value" id="metric-area">0.00</span>
          </div>

          <div class="stat-box">
            <span class="stat-label">Classification</span>
            <span class="stat-value" style="font-size: 1rem; color: #38bdf8;" id="metric-type">Equilateral</span>
          </div>

          <div class="stat-box">
            <span class="stat-label">Distance d₁ (PA)</span>
            <span class="stat-value" style="color: var(--color-d1);" id="metric-d1">0.00</span>
          </div>

          <div class="stat-box">
            <span class="stat-label">Distance d₂ (PB)</span>
            <span class="stat-value" style="color: var(--color-d2);" id="metric-d2">0.00</span>
          </div>

          <div class="stat-box">
            <span class="stat-label">Distance d₃ (PC)</span>
            <span class="stat-value" style="color: var(--color-d3);" id="metric-d3">0.00</span>
          </div>

          <div class="stat-box">
            <span class="stat-label">Subtended ∠APB (α)</span>
            <span class="stat-value" id="metric-alpha">120.0°</span>
          </div>

          <div class="stat-box">
            <span class="stat-label">Subtended ∠BPC (β)</span>
            <span class="stat-value" id="metric-beta">120.0°</span>
          </div>

          <div class="stat-box">
            <span class="stat-label">Subtended ∠CPA (γ)</span>
            <span class="stat-value" id="metric-gamma">120.0°</span>
          </div>
        </div>

        <div class="math-callout">
          <strong style="color: #818cf8; font-size: 0.85rem;">The Inverse Challenge:</strong>
          <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.25rem;">
            If you only knew the three colored distances <span style="color: var(--color-d1);">d₁</span>, <span style="color: var(--color-d2);">d₂</span>, and <span style="color: var(--color-d3);">d₃</span>, could you uniquely deduce this perimeter? 
            Switch to the <strong>Inverse Manifold</strong> tab to see why infinite triangles share this triplet!
          </p>
        </div>
      </div>
    </div>
  `;

  const canvasEl = container.querySelector('#triangle-canvas') as HTMLCanvasElement;
  const perimEl = container.querySelector('#metric-perim') as HTMLElement;
  const areaEl = container.querySelector('#metric-area') as HTMLElement;
  const typeEl = container.querySelector('#metric-type') as HTMLElement;
  const d1El = container.querySelector('#metric-d1') as HTMLElement;
  const d2El = container.querySelector('#metric-d2') as HTMLElement;
  const d3El = container.querySelector('#metric-d3') as HTMLElement;
  const alphaEl = container.querySelector('#metric-alpha') as HTMLElement;
  const betaEl = container.querySelector('#metric-beta') as HTMLElement;
  const gammaEl = container.querySelector('#metric-gamma') as HTMLElement;
  const interiorBadge = container.querySelector('#interior-badge') as HTMLElement;

  const updateUI = (state: TriangleState) => {
    perimEl.textContent = state.perimeter.toFixed(2);
    areaEl.textContent = state.area.toFixed(2);
    d1El.textContent = state.d1.toFixed(2);
    d2El.textContent = state.d2.toFixed(2);
    d3El.textContent = state.d3.toFixed(2);

    const rad2deg = (r: number) => ((r * 180) / Math.PI).toFixed(1) + '°';
    alphaEl.textContent = rad2deg(state.alpha);
    betaEl.textContent = rad2deg(state.beta);
    gammaEl.textContent = rad2deg(state.gamma);

    if (state.isInterior) {
      interiorBadge.textContent = 'Point P: Strictly Interior';
      interiorBadge.style.color = 'var(--accent-emerald)';
      interiorBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    } else {
      interiorBadge.textContent = 'Point P: Outside Triangle!';
      interiorBadge.style.color = 'var(--accent-rose)';
      interiorBadge.style.borderColor = 'rgba(244, 63, 94, 0.4)';
    }

    // Dynamic classification
    const sides = [state.a, state.b, state.c].sort((x, y) => x - y);
    const tol = 5.0;
    if (Math.abs(sides[0] - sides[2]) < tol) {
      typeEl.textContent = 'Equilateral';
    } else if (Math.abs(sides[0] ** 2 + sides[1] ** 2 - sides[2] ** 2) < 2000) {
      typeEl.textContent = 'Right Angled';
    } else if (Math.abs(sides[0] - sides[1]) < tol || Math.abs(sides[1] - sides[2]) < tol) {
      typeEl.textContent = 'Isosceles';
    } else if (sides[0] ** 2 + sides[1] ** 2 > sides[2] ** 2) {
      typeEl.textContent = 'Acute';
    } else {
      typeEl.textContent = 'Obtuse';
    }
  };

  const canvasInstance = new TriangleCanvas(canvasEl, updateUI);
  updateUI(canvasInstance.getState());

  container.querySelector('#btn-preset-eq')?.addEventListener('click', () => canvasInstance.setPreset('equilateral'));
  container.querySelector('#btn-preset-right')?.addEventListener('click', () => canvasInstance.setPreset('right'));
  container.querySelector('#btn-preset-iso')?.addEventListener('click', () => canvasInstance.setPreset('isosceles'));
  container.querySelector('#btn-preset-obtuse')?.addEventListener('click', () => canvasInstance.setPreset('obtuse'));
}
