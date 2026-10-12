import { sidesFromPolar, heronArea } from '../geometry/triangle.js';
import type { SolverResult } from './newton-raphson.js';

export function solveNelderMead(
  d1: number,
  d2: number,
  d3: number,
  maxIter = 200,
  tol = 1e-8
): SolverResult {
  const loss = (alpha: number, beta: number): number => {
    if (alpha <= 0 || alpha >= Math.PI || beta <= 0 || beta >= Math.PI || alpha + beta >= 2 * Math.PI) {
      return 1e6;
    }
    const [a, b, c] = sidesFromPolar(d1, d2, d3, alpha, beta);
    return (a - b) ** 2 + (b - c) ** 2 + (c - a) ** 2;
  };

  const pts = [
    { x: 2.0, y: 2.0, val: 0 },
    { x: 2.2, y: 2.0, val: 0 },
    { x: 2.0, y: 2.2, val: 0 }
  ];
  for (const p of pts) p.val = loss(p.x, p.y);

  let converged = false;
  let it = 0;

  for (; it < maxIter; it++) {
    pts.sort((p1, p2) => p1.val - p2.val);

    if (pts[0].val < tol || Math.abs(pts[2].val - pts[0].val) < tol) {
      converged = true;
      break;
    }

    const cx = (pts[0].x + pts[1].x) / 2;
    const cy = (pts[0].y + pts[1].y) / 2;

    const rx = cx + 1.0 * (cx - pts[2].x);
    const ry = cy + 1.0 * (cy - pts[2].y);
    const rVal = loss(rx, ry);

    if (pts[0].val <= rVal && rVal < pts[1].val) {
      pts[2] = { x: rx, y: ry, val: rVal };
    } else if (rVal < pts[0].val) {
      const ex = cx + 2.0 * (rx - cx);
      const ey = cy + 2.0 * (ry - cy);
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
  const perimeter = sides[0] + sides[1] + sides[2];
  const area = heronArea(sides[0], sides[1], sides[2]);

  return {
    converged,
    iterations: it,
    alpha: best.x,
    beta: best.y,
    gamma: 2 * Math.PI - (best.x + best.y),
    sides,
    perimeter,
    area,
    residual: best.val
  };
}
