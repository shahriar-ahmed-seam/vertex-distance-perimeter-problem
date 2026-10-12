package geometry

import "math"

// Point represents a 2D Cartesian coordinate.
type Point struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

// Distance computes Euclidean distance to another point.
func (p Point) Distance(other Point) float64 {
	return math.Hypot(p.X-other.X, p.Y-other.Y)
}
