import { sidesFromPolar, heronArea } from '../geometry/triangle.js';

export interface SolverResult {
  converged: boolean;
  iterations: number;
  alpha: number;
  beta: number;
  gamma: number;
  sides: [number, number, number];
  perimeter: number;
  area: number;
  residual: number;
}

export function solveNewtonRaphson(
  d1: number,
  d2: number,
  d3: number,
  maxIter = 100,
  tol = 1e-12
): SolverResult {
  let alpha = (2 * Math.PI) / 3;
  let beta = (2 * Math.PI) / 3;
  let resNorm = 1;
  let it = 0;

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

    if (resNorm < tol) {
      break;
    }

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

    const dAlpha = -(j22 * f1 - j12 * f2) / det;
    const dBeta = -(-j21 * f1 + j11 * f2) / det;

    alpha += dAlpha;
    beta += dBeta;

    alpha = Math.max(0.01, Math.min(Math.PI - 0.01, alpha));
    beta = Math.max(0.01, Math.min(Math.PI - 0.01, beta));
  }

  const sides = sidesFromPolar(d1, d2, d3, alpha, beta);
  const perimeter = sides[0] + sides[1] + sides[2];
  const area = heronArea(sides[0], sides[1], sides[2]);

  return {
    converged: resNorm < tol,
    iterations: it,
    alpha,
    beta,
    gamma: 2 * Math.PI - (alpha + beta),
    sides,
    perimeter,
    area,
    residual: resNorm
  };
}
