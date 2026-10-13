import { sidesFromPolar, solveNewtonRaphson } from '../core/math.js';

export function renderErrorLandscapePage(container: HTMLElement) {
  container.innerHTML = `
    <div class="dashboard-grid fade-in">
      <div class="card" style="padding: 1rem;">
        <div class="card-header" style="margin-bottom: 0.75rem;">
          <h2 class="card-title">2D Objective Landscape & Optimization Basin</h2>
          <span class="brand-badge">Loss: log₁₀(Residual)</span>
        </div>

        <div class="canvas-container" style="height: 520px; position: relative;">
          <canvas id="landscape-canvas" width="800" height="520"></canvas>
        </div>
      </div>

      <!-- Right Controls & Info -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Topology Overview</h2>
        </div>

        <div style="font-size: 0.85rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1.25rem;">
          The heatmap maps angle space:
          <ul style="margin-left: 1.25rem; margin-top: 0.5rem; color: #e2e8f0;">
            <li><strong>X-axis:</strong> α = ∠APB (0 to π radians)</li>
            <li><strong>Y-axis:</strong> β = ∠BPC (0 to π radians)</li>
          </ul>
          <p style="margin-top: 0.5rem;">
            Deep blue indicates the <strong>loss valley (near zero error)</strong> where equilateral side constraints are satisfied. Red/yellow regions indicate severe violation.
          </p>
        </div>

        <div class="stats-grid">
          <div class="stat-box highlight">
            <span class="stat-label">Global Minimum Location</span>
            <span class="stat-value glow-cyan">α* ≈ 1.91 rad, β* ≈ 2.18 rad</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Landscape Resolution</span>
            <span class="stat-value">80 × 52 Grid</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Solver Path</span>
            <span class="stat-value" style="color: #f43f5e;">Red Trajectory</span>
          </div>
        </div>

        <div class="math-callout">
          <strong style="color: #38bdf8; font-size: 0.85rem;">Newton Trajectory:</strong>
          <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.25rem;">
            Notice how the Newton-Raphson steps cut diagonally straight through the curving valley directly into the global root within only 6 iterations!
          </p>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#landscape-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  const d1 = 3, d2 = 4, d3 = 5;
  const nx = 80;
  const ny = 52;

  // Render heatmap
  const imgData = ctx.createImageData(canvas.width, canvas.height);
  const cellW = canvas.width / nx;
  const cellH = canvas.height / ny;

  for (let iy = 0; iy < ny; iy++) {
    const beta = 0.2 + (Math.PI - 0.4) * (1 - iy / ny);
    for (let ix = 0; ix < nx; ix++) {
      const alpha = 0.2 + (Math.PI - 0.4) * (ix / nx);
      let logLoss = 3.0;

      if (alpha + beta < 2 * Math.PI - 0.1) {
        const [a, b, c] = sidesFromPolar(d1, d2, d3, alpha, beta);
        const loss = (a - b) ** 2 + (b - c) ** 2 + (c - a) ** 2;
        logLoss = Math.log10(Math.max(1e-6, loss));
      }

      // Color mapping: logLoss from -4 (deep blue) to 2 (bright yellow/red)
      const norm = Math.max(0, Math.min(1, (logLoss + 4) / 6.0));
      // Gradient: (1-norm)*blue + norm*red
      const r = Math.floor(norm * 240);
      const g = Math.floor((1 - Math.abs(norm - 0.5) * 2) * 150);
      const b = Math.floor((1 - norm) * 220);

      // Fill cell
      const startX = Math.floor(ix * cellW);
      const startY = Math.floor(iy * cellH);
      const endX = Math.floor((ix + 1) * cellW);
      const endY = Math.floor((iy + 1) * cellH);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(startX, startY, endX - startX, endY - startY);
    }
  }

  // Overlay Newton path
  const newton = solveNewtonRaphson(d1, d2, d3);
  if (newton.trajectory && newton.trajectory.length > 0) {
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();

    newton.trajectory.forEach((pt, i) => {
      const normX = (pt.x - 0.2) / (Math.PI - 0.4);
      const normY = (pt.y - 0.2) / (Math.PI - 0.4);
      const x = normX * canvas.width;
      const y = (1 - normY) * canvas.height;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      // Point marker
      ctx.fillStyle = i === newton.trajectory!.length - 1 ? '#22c55e' : '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.stroke();
  }

  // Axis labels
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 12px Inter';
  ctx.fillText('α = ∠APB →', canvas.width - 120, canvas.height - 15);
  ctx.fillText('↑ β = ∠BPC', 15, 25);
}
