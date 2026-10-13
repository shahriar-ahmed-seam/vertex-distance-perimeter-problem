import { solveEquilateralExact, solveNewtonRaphson, solveNelderMead } from '../core/math.js';

export function renderSolverBenchmarkPage(container: HTMLElement) {
  container.innerHTML = `
    <div class="dashboard-grid fade-in">
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <h2 class="card-title">Real-Time Multi-Solver Tournament Benchmark</h2>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary btn-sm" id="btn-run-race">Run Benchmark</button>
          </div>
        </div>

        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.25rem;">
          Executes all mathematical solvers concurrently on distance triplet <strong>(d₁=3, d₂=4, d₃=5)</strong> targeting the equilateral perimeter ground truth (P = 3√(25 + 12√3) ≈ 20.2993).
        </p>

        <!-- Benchmark Results Table -->
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-subtle); color: var(--text-muted);">
                <th style="padding: 0.75rem 1rem;">Algorithm</th>
                <th style="padding: 0.75rem 1rem;">Paradigm</th>
                <th style="padding: 0.75rem 1rem;">Status</th>
                <th style="padding: 0.75rem 1rem;">Iterations</th>
                <th style="padding: 0.75rem 1rem;">Time (ms)</th>
                <th style="padding: 0.75rem 1rem;">Reconstructed P</th>
                <th style="padding: 0.75rem 1rem;">Residual Error</th>
              </tr>
            </thead>
            <tbody id="benchmark-tbody">
              <!-- Dynamically populated rows -->
            </tbody>
          </table>
        </div>

        <!-- Convergence Curves Visualizer -->
        <div>
          <h3 style="font-size: 0.95rem; font-weight: 700; color: #f8fafc; margin-bottom: 0.5rem;">
            Logarithmic Residual Convergence Trajectories log₁₀(|residual|)
          </h3>
          <canvas id="conv-chart" width="1100" height="260" style="width: 100%; height: 260px; background: rgba(0,0,0,0.35); border-radius: 8px; border: 1px solid var(--border-subtle);"></canvas>
        </div>
      </div>
    </div>
  `;

  const tbody = container.querySelector('#benchmark-tbody') as HTMLElement;
  const canvas = container.querySelector('#conv-chart') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  const runBenchmark = () => {
    tbody.innerHTML = '';
    const d1 = 3, d2 = 4, d3 = 5;

    // 1. Exact Closed Form
    const t0 = performance.now();
    const exact = solveEquilateralExact(d1, d2, d3);
    const tExact = performance.now() - t0;

    // 2. Newton-Raphson
    const newton = solveNewtonRaphson(d1, d2, d3);

    // 3. Nelder-Mead
    const nm = solveNelderMead(d1, d2, d3);

    const rows = [
      {
        name: 'Cayley-Menger Closed Form',
        paradigm: 'Algebraic Elimination',
        status: 'Exact Solution',
        iterations: '1 (Analytical)',
        time: tExact.toFixed(3),
        perim: exact.perimeter.toFixed(8),
        residual: '0.00 × 10⁰ (0.0)',
        color: '#a855f7'
      },
      {
        name: 'Multidimensional Newton-Raphson',
        paradigm: 'Second-Order Gradient',
        status: newton.converged ? 'Converged' : 'Failed',
        iterations: newton.iterations.toString(),
        time: newton.timeMs.toFixed(3),
        perim: newton.perimeter.toFixed(8),
        residual: newton.residual.toExponential(3),
        color: '#38bdf8'
      },
      {
        name: 'Nelder-Mead Simplex',
        paradigm: 'Derivative-Free Optimization',
        status: nm.converged ? 'Converged' : 'Terminated',
        iterations: nm.iterations.toString(),
        time: nm.timeMs.toFixed(3),
        perim: nm.perimeter.toFixed(8),
        residual: nm.residual.toExponential(3),
        color: '#10b981'
      }
    ];

    rows.forEach((r) => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-subtle)';
      tr.innerHTML = `
        <td style="padding: 0.75rem 1rem; font-weight: 600; color: ${r.color};">${r.name}</td>
        <td style="padding: 0.75rem 1rem; color: #94a3b8;">${r.paradigm}</td>
        <td style="padding: 0.75rem 1rem;"><span class="badge" style="background: rgba(16,185,129,0.15); color: #34d399; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; font-size: 0.75rem;">${r.status}</span></td>
        <td style="padding: 0.75rem 1rem; font-family: var(--font-mono);">${r.iterations}</td>
        <td style="padding: 0.75rem 1rem; font-family: var(--font-mono);">${r.time}</td>
        <td style="padding: 0.75rem 1rem; font-family: var(--font-mono); font-weight: 700; color: #f8fafc;">${r.perim}</td>
        <td style="padding: 0.75rem 1rem; font-family: var(--font-mono); color: #38bdf8;">${r.residual}</td>
      `;
      tbody.appendChild(tr);
    });

    // Draw Convergence Chart
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let y = 30; y < canvas.height - 30; y += 40) {
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(canvas.width - 20, y);
      ctx.stroke();
    }

    // Newton line
    if (newton.trajectory && newton.trajectory.length > 1) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const padX = 60;
      const padY = 30;
      const w = canvas.width - padX - 40;
      const h = canvas.height - 2 * padY;

      newton.trajectory.forEach((pt, i) => {
        const x = padX + (i / 15) * w;
        const logVal = Math.max(-14, Math.log10(Math.max(1e-15, pt.val)));
        const normY = (-logVal) / 14;
        const y = padY + (1 - normY) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Nelder Mead line
    if (nm.trajectory && nm.trajectory.length > 1) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const padX = 60;
      const padY = 30;
      const w = canvas.width - padX - 40;
      const h = canvas.height - 2 * padY;

      nm.trajectory.slice(0, 80).forEach((pt, i) => {
        const x = padX + (i / 80) * w;
        const logVal = Math.max(-14, Math.log10(Math.max(1e-15, pt.val)));
        const normY = (-logVal) / 14;
        const y = padY + (1 - normY) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Legend
    ctx.font = '12px Inter';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('■ Newton-Raphson (Quadratic)', canvas.width - 240, 45);
    ctx.fillStyle = '#10b981';
    ctx.fillText('■ Nelder-Mead (Linear Simplex)', canvas.width - 240, 65);
  };

  container.querySelector('#btn-run-race')?.addEventListener('click', runBenchmark);
  runBenchmark();
}
