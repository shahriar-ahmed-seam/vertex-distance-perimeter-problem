export interface Point2D {
  x: number;
  y: number;
}

export function distance2D(p1: Point2D, p2: Point2D): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function checkTriangleInequality(a: number, b: number, c: number, tol = 1e-9): boolean {
  if (a <= 0 || b <= 0 || c <= 0) return false;
  return a + b > c + tol && b + c > a + tol && c + a > b + tol;
}

export function validateDistances(d1: number, d2: number, d3: number): { valid: boolean; message: string } {
  if (d1 <= 0 || d2 <= 0 || d3 <= 0) {
    return { valid: false, message: 'All distances d1, d2, d3 must be strictly positive.' };
  }
  return { valid: true, message: 'Distances are valid.' };
}

export function sidesFromPolar(d1: number, d2: number, d3: number, alpha: number, beta: number): [number, number, number] {
  const gamma = 2 * Math.PI - (alpha + beta);
  const c = Math.sqrt(Math.max(0, d1 * d1 + d2 * d2 - 2 * d1 * d2 * Math.cos(alpha)));
  const a = Math.sqrt(Math.max(0, d2 * d2 + d3 * d3 - 2 * d2 * d3 * Math.cos(beta)));
  const b = Math.sqrt(Math.max(0, d3 * d3 + d1 * d1 - 2 * d3 * d1 * Math.cos(gamma)));
  return [a, b, c];
}

export function heronArea(a: number, b: number, c: number): number {
  const s = (a + b + c) / 2;
  const val = s * (s - a) * (s - b) * (s - c);
  return val > 0 ? Math.sqrt(val) : 0;
}
