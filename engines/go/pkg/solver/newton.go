package solver

import (
	"errors"
	"math"

	"github.com/shahriar/triangle-thm/engines/go/pkg/geometry"
)

// SolveResult holds the output of numeric solver iterations.
type SolveResult struct {
	Converged    bool      `json:"converged"`
	Iterations   int       `json:"iterations"`
	Alpha        float64   `json:"alpha"`
	Beta         float64   `json:"beta"`
	Gamma        float64   `json:"gamma"`
	SideA        float64   `json:"side_a"`
	SideB        float64   `json:"side_b"`
	SideC        float64   `json:"side_c"`
	Perimeter    float64   `json:"perimeter"`
	Area         float64   `json:"area"`
	ResidualNorm float64   `json:"residual_norm"`
}

// SolveNewtonEquilateral finds angles (alpha, beta) for an equilateral triangle given (d1, d2, d3).
func SolveNewtonEquilateral(d1, d2, d3 float64, maxIter int, tol float64) (SolveResult, error) {
	if d1 <= 0 || d2 <= 0 || d3 <= 0 {
		return SolveResult{}, errors.New("distances must be positive")
	}

	// Initial guess near 120 degrees (2pi/3)
	alpha := 2.0 * math.Pi / 3.0
	beta := 2.0 * math.Pi / 3.0

	var lastRes float64

	for it := 0; it < maxIter; it++ {
		cosA := math.Cos(alpha)
		cosB := math.Cos(beta)
		cosG := math.Cos(alpha + beta)

		sinA := math.Sin(alpha)
		sinB := math.Sin(beta)
		sinG := math.Sin(alpha + beta)

		c2 := d1*d1 + d2*d2 - 2*d1*d2*cosA
		a2 := d2*d2 + d3*d3 - 2*d2*d3*cosB
		b2 := d3*d3 + d1*d1 - 2*d3*d1*cosG

		// Target: F1 = a2 - b2 = 0, F2 = b2 - c2 = 0
		f1 := a2 - b2
		f2 := b2 - c2

		lastRes = math.Hypot(f1, f2)
		if lastRes < tol {
			a, b, c := geometry.SidesFromPolar(d1, d2, d3, alpha, beta)
			s := (a + b + c) / 2.0
			area := math.Sqrt(math.Max(0.0, s*(s-a)*(s-b)*(s-c)))
			return SolveResult{
				Converged:    true,
				Iterations:   it,
				Alpha:        alpha,
				Beta:         beta,
				Gamma:        2.0*math.Pi - (alpha + beta),
				SideA:        a,
				SideB:        b,
				SideC:        c,
				Perimeter:    a + b + c,
				Area:         area,
				ResidualNorm: lastRes,
			}, nil
		}

		// Jacobian
		j11 := -2.0 * d3 * d1 * sinG
		j12 := 2.0*d2*d3*sinB - 2.0*d3*d1*sinG
		j21 := 2.0*d3*d1*sinG - 2.0*d1*d2*sinA
		j22 := 2.0 * d3 * d1 * sinG

		det := j11*j22 - j12*j21
		if math.Abs(det) < 1e-14 {
			// Perturb to avoid singularity
			alpha += 0.01
			beta += 0.01
			continue
		}

		// Invert 2x2: delta = -J^-1 * F
		dAlpha := -(j22*f1 - j12*f2) / det
		dBeta := -(-j21*f1 + j11*f2) / det

		alpha += dAlpha
		beta += dBeta

		// Bound clamping
		if alpha <= 0.01 {
			alpha = 0.01
		} else if alpha >= math.Pi-0.01 {
			alpha = math.Pi - 0.01
		}
		if beta <= 0.01 {
			beta = 0.01
		} else if beta >= math.Pi-0.01 {
			beta = math.Pi - 0.01
		}
	}

	a, b, c := geometry.SidesFromPolar(d1, d2, d3, alpha, beta)
	s := (a + b + c) / 2.0
	area := math.Sqrt(math.Max(0.0, s*(s-a)*(s-b)*(s-c)))

	return SolveResult{
		Converged:    false,
		Iterations:   maxIter,
		Alpha:        alpha,
		Beta:         beta,
		Gamma:        2.0*math.Pi - (alpha + beta),
		SideA:        a,
		SideB:        b,
		SideC:        c,
		Perimeter:    a + b + c,
		Area:         area,
		ResidualNorm: lastRes,
	}, nil
}
