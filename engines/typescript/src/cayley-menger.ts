export function solveEquilateralClosedForm(d1: number, d2: number, d3: number): {
  side: number;
  perimeter: number;
  isValid: boolean;
} {
  if (d1 <= 0 || d2 <= 0 || d3 <= 0) {
    return { side: 0, perimeter: 0, isValid: false };
  }

  const d1Sq = d1 * d1;
  const d2Sq = d2 * d2;
  const d3Sq = d3 * d3;

  const sumSq = d1Sq + d2Sq + d3Sq;
  const quadSq = d1Sq * d1Sq + d2Sq * d2Sq + d3Sq * d3Sq;

  const disc = 12 * sumSq * sumSq - 24 * quadSq;
  if (disc < 0) {
    return { side: 0, perimeter: 0, isValid: false };
  }

  const u = (2 * sumSq + Math.sqrt(disc)) / 4;
  if (u <= 0) {
    return { side: 0, perimeter: 0, isValid: false };
  }

  const side = Math.sqrt(u);
  return {
    side,
    perimeter: 3 * side,
    isValid: true
  };
}
