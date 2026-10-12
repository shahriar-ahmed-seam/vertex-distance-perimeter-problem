package solver

import (
	"errors"
	"math"
)

// SolveEquilateralExactClosedForm computes the exact side length and perimeter
// using the Cayley-Menger / Pompeiu closed form formula for an equilateral triangle.
func SolveEquilateralExactClosedForm(d1, d2, d3 float64) (side float64, perimeter float64, err error) {
	if d1 <= 0 || d2 <= 0 || d3 <= 0 {
		return 0, 0, errors.New("distances must be positive")
	}

	d1Sq := d1 * d1
	d2Sq := d2 * d2
	d3Sq := d3 * d3

	sumSq := d1Sq + d2Sq + d3Sq
	quadSq := d1Sq*d1Sq + d2Sq*d2Sq + d3Sq*d3Sq

	// Discriminant: 12 * sumSq^2 - 24 * quadSq
	disc := 12.0*sumSq*sumSq - 24.0*quadSq
	if disc < 0 {
		return 0, 0, errors.New("degenerate or invalid distances: negative Pompeiu discriminant")
	}

	// u = s^2 = (2*sumSq + sqrt(disc)) / 4 for interior point
	u := (2.0*sumSq + math.Sqrt(disc)) / 4.0
	if u <= 0 {
		return 0, 0, errors.New("non-positive side length squared")
	}

	side = math.Sqrt(u)
	perimeter = 3.0 * side
	return side, perimeter, nil
}
