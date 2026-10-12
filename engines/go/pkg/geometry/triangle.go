package geometry

import "math"

// Triangle represents a triangle with vertices A, B, C.
type Triangle struct {
	A Point `json:"a"`
	B Point `json:"b"`
	C Point `json:"c"`
}

// SideLengths returns lengths of sides (a=BC, b=CA, c=AB).
func (t Triangle) SideLengths() (float64, float64, float64) {
	a := t.B.Distance(t.C)
	b := t.C.Distance(t.A)
	c := t.A.Distance(t.B)
	return a, b, c
}

// Perimeter returns the sum of side lengths a + b + c.
func (t Triangle) Perimeter() float64 {
	a, b, c := t.SideLengths()
	return a + b + c
}

// Area computes area via Heron's formula.
func (t Triangle) Area() float64 {
	a, b, c := t.SideLengths()
	s := (a + b + c) / 2.0
	val := s * (s - a) * (s - b) * (s - c)
	if val <= 0.0 {
		return 0.0
	}
	return math.Sqrt(val)
}

// SidesFromPolar computes sides (a, b, c) from vertex distances and subtended angles at P.
func SidesFromPolar(d1, d2, d3, alpha, beta float64) (float64, float64, float64) {
	gamma := 2.0*math.Pi - (alpha + beta)
	c := math.Sqrt(math.Max(0.0, d1*d1+d2*d2-2*d1*d2*math.Cos(alpha)))
	a := math.Sqrt(math.Max(0.0, d2*d2+d3*d3-2*d2*d3*math.Cos(beta)))
	b := math.Sqrt(math.Max(0.0, d3*d3+d1*d1-2*d3*d1*math.Cos(gamma)))
	return a, b, c
}
