import { sidesFromPolar, solveEquilateralExact, sampleManifold, heronArea, Point } from '../core/math.js';

export function renderInverseFinderPage(container: HTMLElement) {
  container.innerHTML = `
    <div class="dashboard-grid fade-in">
      <!-- Left: Morphing Triangle Canvas & Manifold Curve -->
      <div class="card" style="padding: 1rem;">
        <div class="card-header" style="margin-bottom: 0.75rem;">
          <h2 class="card-title">
            <span>🔄</span> Continuous Solution Manifold Explorer
          </h2>
          <span class="brand-badge" id="manifold-badge">1D Free Parameter</span>
        </div>

        <div class="canvas-container" style="height: 400px;">
          <canvas id="inverse-canvas" width="900" height="400"></canvas>
        </div>

        <!-- Manifold Parameter Slider -->
        <div class="slider-group" style="margin-top: 1.25rem;">
          <div class="slider-header">
            <span style="font-weight: 600; color: #f8fafc;">Traverse Angle α = ∠APB (Degrees)</span>
            <span style="font-family: var(--font-mono); color: var(--accent-cyan);" id="slider-alpha-val">120.0°</span>
          </div>
          <input type="range" class="range-slider" id="alpha-slider" min="30" max="170" step="0.5" value="120" />
        </div>

        <!-- 2D Perimeter Manifold Chart -->
        <div style="margin-top: 1rem;">
          <h3 style="font-size: 0.85rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.5rem;">Perimeter Trajectory 𝒫(α) along Solution Manifold</h3>
          <canvas id="curve-canvas" width="900" height="130" style="width: 100%; height: 130px; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid var(--border-subtle);"></canvas>
        </div>
      </div>

      <!-- Right: Distance Inputs & Exact Solutions Panel -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">
            <span>🎯</span> Input Distance Triplet
          </h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 1.25rem;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="color: var(--color-d1);">d₁ (PA)</label>
            <input type="number" class="form-input" id="input-d1" value="3" step="0.1" min="0.1" />
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="color: var(--color-d2);">d₂ (PB)</label>
            <input type="number" class="form-input" id="input-d2" value="4" step="0.1" min="0.1" />
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="color: var(--color-d3);">d₃ (PC)</label>
            <input type="number" class="form-input" id="input-d3" value="5" step="0.1" min="0.1" />
          </div>
        </div>

        <div class="preset-buttons">
          <button class="btn btn-sm" id="preset-345">(3, 4, 5) Canonical</button>
          <button class="btn btn-sm" id="preset-555">(5, 5, 5) Symmetric</button>
          <button class="btn btn-sm" id="preset-234">(2, 3, 4) Scalene</button>
        </div>

        <!-- Computed Manifold Results -->
        <div class="stats-grid">
          <div class="stat-box highlight">
            <span class="stat-label">Current Manifold Perimeter</span>
            <span class="stat-value glow-cyan" id="current-perim">20.30</span>
          </div>

          <div class="stat-box">
            <span class="stat-label">Equilateral Closed Form</span>
            <span class="stat-value" style="color: #a855f7;" id="exact-eq-perim">20.30</span>
          </div>

          <div class="stat-box">
            <span class="stat-label">Equilateral Side s</span>
            <span class="stat-value" style="font-size: 1.1rem;" id="exact-eq-side">6.77</span>
          </div>

          <div class="stat-box">
            <span class="stat-label">Min Perimeter (Manifold)</span>
            <span class="stat-value" style="color: var(--accent-emerald);" id="min-perim">18.42</span>
          </div>

          <div class="stat-box">
            <span class="stat-label">Max Perimeter (Manifold)</span>
            <span class="stat-value" style="color: var(--accent-amber);" id="max-perim">23.85</span>
          </div>
        </div>

        <div class="math-callout">
          <strong style="color: #38bdf8; font-size: 0.85rem;">Why is there a manifold?</strong>
          <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.35rem;">
            A triangle in the plane has <strong>3 degrees of freedom</strong> (side lengths a,b,c). Placing an interior point P adds <strong>2 coordinates</strong>. That is 5 geometric parameters constrained by only 3 measurements (d₁, d₂, d₃).
            Fixing rigid rotation leaves a <strong>1-dimensional continuous family of triangles</strong> that all perfectly produce these exact three distances!
          </p>
        </div>
      </div>
    </div>
  `;

  const canvasEl = container.querySelector('#inverse-canvas') as HTMLCanvasElement;
  const ctx = canvasEl.getContext('2d')!;

  const curveEl = container.querySelector('#curve-canvas') as HTMLCanvasElement;
  const curveCtx = curveEl.getContext('2d')!;

  const d1Input = container.querySelector('#input-d1') as HTMLInputElement;
  const d2Input = container.querySelector('#input-d2') as HTMLInputElement;
  const d3Input = container.querySelector('#input-d3') as HTMLInputElement;
  const alphaSlider = container.querySelector('#alpha-slider') as HTMLInputElement;
  const alphaLabel = container.querySelector('#slider-alpha-val') as HTMLElement;

  const currentPerimEl = container.querySelector('#current-perim') as HTMLElement;
  const exactEqPerimEl = container.querySelector('#exact-eq-perim') as HTMLElement;
  const exactEqSideEl = container.querySelector('#exact-eq-side') as HTMLElement;
  const minPerimEl = container.querySelector('#min-perim') as HTMLElement;
  const maxPerimEl = container.querySelector('#max-perim') as HTMLElement;

  const redraw = () => {
    const d1 = parseFloat(d1Input.value) || 3;
    const d2 = parseFloat(d2Input.value) || 4;
    const d3 = parseFloat(d3Input.value) || 5;

    const alphaDeg = parseFloat(alphaSlider.value);
    const alpha = (alphaDeg * Math.PI) / 180;
    alphaLabel.textContent = `${alphaDeg.toFixed(1)}°`;

    // Solve exact equilateral
    const eqResult = solveEquilateralExact(d1, d2, d3);
    if (eqResult.valid) {
      exactEqPerimEl.textContent = eqResult.perimeter.toFixed(2);
      exactEqSideEl.textContent = eqResult.side.toFixed(2);
    } else {
      exactEqPerimEl.textContent = 'N/A';
      exactEqSideEl.textContent = 'Violates Pompeiu';
    }

    // Compute manifold points for curve
    const manifold = sampleManifold(d1, d2, d3, 100);
    let minP = Infinity;
    let maxP = -Infinity;
    manifold.forEach((m) => {
      if (m.perimeter < minP) minP = m.perimeter;
      if (m.perimeter > maxP) maxP = m.perimeter;
    });

    minPerimEl.textContent = minP.toFixed(2);
    maxPerimEl.textContent = maxP.toFixed(2);

    // Current reconstructed triangle at alpha
    const beta = (2 * Math.PI - alpha) / 2.0;
    const [a, b, c] = sidesFromPolar(d1, d2, d3, alpha, beta);
    const currentPerim = a + b + c;
    currentPerimEl.textContent = currentPerim.toFixed(2);

    // Draw reconstructed triangle
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    const cx = canvasEl.width / 2;
    const cy = canvasEl.height / 2;
    const scale = 28; // scale distance units to pixels

    // P at origin (cx, cy)
    // A at (d1, 0)
    // B at (d2*cos(alpha), d2*sin(alpha))
    // C at (d3*cos(alpha+beta), d3*sin(alpha+beta))
    const P = { x: cx, y: cy };
    const A = { x: cx + d1 * scale, y: cy };
    const B = { x: cx + d2 * scale * Math.cos(alpha), y: cy + d2 * scale * Math.sin(alpha) };
    const gamma = 2 * Math.PI - (alpha + beta);
    const C = { x: cx + d3 * scale * Math.cos(alpha + beta), y: cy + d3 * scale * Math.sin(alpha + beta) };

    // Fill & edges
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Distance rays
    const drawRay = (target: Point, color: string, label: string) => {
      ctx.beginPath();
      ctx.moveTo(P.x, P.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = color;
      ctx.font = 'bold 12px JetBrains Mono';
      ctx.fillText(label, (P.x + target.x) / 2 + 6, (P.y + target.y) / 2);
    };

    drawRay(A, '#38bdf8', `d₁=${d1}`);
    drawRay(B, '#10b981', `d₂=${d2}`);
    drawRay(C, '#f59e0b', `d₃=${d3}`);

    // Point P
    ctx.beginPath();
    ctx.arc(P.x, P.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(P.x, P.y, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw Curve Canvas
    curveCtx.clearRect(0, 0, curveEl.width, curveEl.height);
    if (manifold.length > 2 && maxP > minP) {
      curveCtx.strokeStyle = '#38bdf8';
      curveCtx.lineWidth = 2.5;
      curveCtx.beginPath();

      const padX = 40;
      const padY = 20;
      const w = curveEl.width - 2 * padX;
      const h = curveEl.height - 2 * padY;

      manifold.forEach((pt, i) => {
        const x = padX + (i / (manifold.length - 1)) * w;
        const normY = (pt.perimeter - minP) / (maxP - minP);
        const y = curveEl.height - padY - normY * h;
        if (i === 0) curveCtx.moveTo(x, y);
        else curveCtx.lineTo(x, y);
      });
      curveCtx.stroke();

      // Draw current indicator
      const currentNormX = (alpha - 0.3) / (Math.PI - 0.6);
      const indX = padX + Math.max(0, Math.min(1, currentNormX)) * w;
      const currentNormY = (currentPerim - minP) / (maxP - minP);
      const indY = curveEl.height - padY - Math.max(0, Math.min(1, currentNormY)) * h;

      curveCtx.fillStyle = '#f43f5e';
      curveCtx.beginPath();
      curveCtx.arc(indX, indY, 6, 0, Math.PI * 2);
      curveCtx.fill();
    }
  };

  alphaSlider.addEventListener('input', redraw);
  d1Input.addEventListener('input', redraw);
  d2Input.addEventListener('input', redraw);
  d3Input.addEventListener('input', redraw);

  container.querySelector('#preset-345')?.addEventListener('click', () => {
    d1Input.value = '3';
    d2Input.value = '4';
    d3Input.value = '5';
    redraw();
  });

  container.querySelector('#preset-555')?.addEventListener('click', () => {
    d1Input.value = '5';
    d2Input.value = '5';
    d3Input.value = '5';
    redraw();
  });

  container.querySelector('#preset-234')?.addEventListener('click', () => {
    d1Input.value = '2';
    d2Input.value = '3';
    d3Input.value = '4';
    redraw();
  });

  redraw();
}
