/**
 * Browser-side computational geometry and solvers engine.
 */

export interface Point {
  x: number;
  y: number;
}

export function dist(p1: Point, p2: Point): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function heronArea(a: number, b: number, c: number): number {
  const s = (a + b + c) / 2;
  const val = s * (s - a) * (s - b) * (s - c);
  return val > 0 ? Math.sqrt(val) : 0;
}

export function sidesFromPolar(d1: number, d2: number, d3: number, alpha: number, beta: number): [number, number, number] {
  const gamma = 2 * Math.PI - (alpha + beta);
  const c = Math.sqrt(Math.max(0, d1 * d1 + d2 * d2 - 2 * d1 * d2 * Math.cos(alpha)));
  const a = Math.sqrt(Math.max(0, d2 * d2 + d3 * d3 - 2 * d2 * d3 * Math.cos(beta)));
  const b = Math.sqrt(Math.max(0, d3 * d3 + d1 * d1 - 2 * d3 * d1 * Math.cos(gamma)));
  return [a, b, c];
}

export function isPointInsideTriangle(p: Point, a: Point, b: Point, c: Point): boolean {
  const areaOrig = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y));
  const area1 = Math.abs((a.x - p.x) * (b.y - p.y) - (b.x - p.x) * (a.y - p.y));
  const area2 = Math.abs((b.x - p.x) * (c.y - p.y) - (c.x - p.x) * (b.y - p.y));
  const area3 = Math.abs((c.x - p.x) * (a.y - p.y) - (a.x - p.x) * (c.y - p.y));
  return Math.abs(areaOrig - (area1 + area2 + area3)) < 1.0;
}

export function solveEquilateralExact(d1: number, d2: number, d3: number): {
  side: number;
  perimeter: number;
  valid: boolean;
} {
  const d1Sq = d1 * d1;
  const d2Sq = d2 * d2;
  const d3Sq = d3 * d3;

  const sumSq = d1Sq + d2Sq + d3Sq;
  const quadSq = d1Sq * d1Sq + d2Sq * d2Sq + d3Sq * d3Sq;
  const disc = 12 * sumSq * sumSq - 24 * quadSq;

  if (disc < 0) return { side: 0, perimeter: 0, valid: false };

  const u = (2 * sumSq + Math.sqrt(disc)) / 4;
  if (u <= 0) return { side: 0, perimeter: 0, valid: false };

  const side = Math.sqrt(u);
  return { side, perimeter: 3 * side, valid: true };
}

export interface SolverRunResult {
  name: string;
  converged: boolean;
  iterations: number;
  timeMs: number;
  perimeter: number;
  residual: number;
  trajectory?: Array<{ x: number; y: number; val: number }>;
}

export function solveNewtonRaphson(d1: number, d2: number, d3: number): SolverRunResult {
  const t0 = performance.now();
  let alpha = (2 * Math.PI) / 3;
  let beta = (2 * Math.PI) / 3;
  let resNorm = 1;
  let it = 0;
  const maxIter = 100;
  const tol = 1e-12;
  const trajectory: Array<{ x: number; y: number; val: number }> = [];

  for (; it < maxIter; it++) {
    const cosA = Math.cos(alpha);
    const cosB = Math.cos(beta);
    const cosG = Math.cos(alpha + beta);

    const sinA = Math.sin(alpha);
    const sinB = Math.sin(beta);
    const sinG = Math.sin(alpha + beta);

    const c2 = d1 * d1 + d2 * d2 - 2 * d1 * d2 * cosA;
    const a2 = d2 * d2 + d3 * d3 - 2 * d2 * d3 * cosB;
    const b2 = d3 * d3 + d1 * d1 - 2 * d3 * d1 * cosG;

    const f1 = a2 - b2;
    const f2 = b2 - c2;
    resNorm = Math.hypot(f1, f2);

    trajectory.push({ x: alpha, y: beta, val: resNorm });

    if (resNorm < tol) break;

    const j11 = -2 * d3 * d1 * sinG;
    const j12 = 2 * d2 * d3 * sinB - 2 * d3 * d1 * sinG;
    const j21 = 2 * d3 * d1 * sinG - 2 * d1 * d2 * sinA;
    const j22 = 2 * d3 * d1 * sinG;

    const det = j11 * j22 - j12 * j21;
    if (Math.abs(det) < 1e-14) {
      alpha += 0.01;
      beta += 0.01;
      continue;
    }

    alpha += -(j22 * f1 - j12 * f2) / det;
    beta += -(-j21 * f1 + j11 * f2) / det;

    alpha = Math.max(0.01, Math.min(Math.PI - 0.01, alpha));
    beta = Math.max(0.01, Math.min(Math.PI - 0.01, beta));
  }

  const sides = sidesFromPolar(d1, d2, d3, alpha, beta);
  return {
    name: 'Newton-Raphson',
    converged: resNorm < tol,
    iterations: it,
    timeMs: performance.now() - t0,
    perimeter: sides[0] + sides[1] + sides[2],
    residual: resNorm,
    trajectory
  };
}

export function solveNelderMead(d1: number, d2: number, d3: number): SolverRunResult {
  const t0 = performance.now();
  const loss = (a: number, b: number): number => {
    if (a <= 0 || a >= Math.PI || b <= 0 || b >= Math.PI || a + b >= 2 * Math.PI) return 1e6;
    const [s1, s2, s3] = sidesFromPolar(d1, d2, d3, a, b);
    return (s1 - s2) ** 2 + (s2 - s3) ** 2 + (s3 - s1) ** 2;
  };

  const pts = [
    { x: 2.0, y: 2.0, val: 0 },
    { x: 2.2, y: 2.0, val: 0 },
    { x: 2.0, y: 2.2, val: 0 }
  ];
  for (const p of pts) p.val = loss(p.x, p.y);

  let it = 0;
  const maxIter = 250;
  const tol = 1e-9;
  const trajectory: Array<{ x: number; y: number; val: number }> = [];

  for (; it < maxIter; it++) {
    pts.sort((p1, p2) => p1.val - p2.val);
    trajectory.push({ x: pts[0].x, y: pts[0].y, val: pts[0].val });

    if (pts[0].val < tol) break;

    const cx = (pts[0].x + pts[1].x) / 2;
    const cy = (pts[0].y + pts[1].y) / 2;

    const rx = cx + (cx - pts[2].x);
    const ry = cy + (cy - pts[2].y);
    const rVal = loss(rx, ry);

    if (pts[0].val <= rVal && rVal < pts[1].val) {
      pts[2] = { x: rx, y: ry, val: rVal };
    } else if (rVal < pts[0].val) {
      const ex = cx + 2 * (rx - cx);
      const ey = cy + 2 * (ry - cy);
      const eVal = loss(ex, ey);
      pts[2] = eVal < rVal ? { x: ex, y: ey, val: eVal } : { x: rx, y: ry, val: rVal };
    } else {
      const kx = cx + 0.5 * (pts[2].x - cx);
      const ky = cy + 0.5 * (pts[2].y - cy);
      const kVal = loss(kx, ky);
      if (kVal < pts[2].val) {
        pts[2] = { x: kx, y: ky, val: kVal };
      } else {
        pts[1].x = pts[0].x + 0.5 * (pts[1].x - pts[0].x);
        pts[1].y = pts[0].y + 0.5 * (pts[1].y - pts[0].y);
        pts[1].val = loss(pts[1].x, pts[1].y);
        pts[2].x = pts[0].x + 0.5 * (pts[2].x - pts[0].x);
        pts[2].y = pts[0].y + 0.5 * (pts[2].y - pts[0].y);
        pts[2].val = loss(pts[2].x, pts[2].y);
      }
    }
  }

  const best = pts[0];
  const sides = sidesFromPolar(d1, d2, d3, best.x, best.y);
  return {
    name: 'Nelder-Mead',
    converged: best.val < tol,
    iterations: it,
    timeMs: performance.now() - t0,
    perimeter: sides[0] + sides[1] + sides[2],
    residual: best.val,
    trajectory
  };
}

export function sampleManifold(
  d1: number,
  d2: number,
  d3: number,
  samples = 80
): Array<{ alpha: number; beta: number; sides: [number, number, number]; perimeter: number }> {
  const points = [];
  const minAlpha = 0.3;
  const maxAlpha = Math.PI - 0.3;
  const step = (maxAlpha - minAlpha) / samples;

  for (let a = minAlpha; a <= maxAlpha; a += step) {
    const beta = (2 * Math.PI - a) / 2.0;
    if (beta < Math.PI) {
      const sides = sidesFromPolar(d1, d2, d3, a, beta);
      points.push({
        alpha: a,
        beta,
        sides,
        perimeter: sides[0] + sides[1] + sides[2]
      });
    }
  }
  return points;
}
