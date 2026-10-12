package solver

import (
	"math"
	"sort"

	"github.com/shahriar/triangle-thm/engines/go/pkg/geometry"
)

type nmPoint struct {
	x, y float64
	val  float64
}

// SolveNelderMeadEquilateral solves for an equilateral triangle via Nelder-Mead simplex algorithm.
func SolveNelderMeadEquilateral(d1, d2, d3 float64, maxIter int, tol float64) (SolveResult, error) {
	loss := func(alpha, beta float64) float64 {
		if alpha <= 0 || alpha >= math.Pi || beta <= 0 || beta >= math.Pi || (alpha+beta) >= 2*math.Pi {
			return 1e6
		}
		a, b, c := geometry.SidesFromPolar(d1, d2, d3, alpha, beta)
		return (a-b)*(a-b) + (b-c)*(b-c) + (c-a)*(c-a)
	}

	pts := []nmPoint{
		{x: 2.0, y: 2.0},
		{x: 2.2, y: 2.0},
		{x: 2.0, y: 2.2},
	}
	for i := range pts {
		pts[i].val = loss(pts[i].x, pts[i].y)
	}

	converged := false
	itCount := 0

	for it := 0; it < maxIter; it++ {
		itCount = it + 1
		sort.Slice(pts, func(i, j int) bool {
			return pts[i].val < pts[j].val
		})

		if pts[0].val < tol || math.Abs(pts[2].val-pts[0].val) < tol {
			converged = true
			break
		}

		// Centroid of best 2
		cx := (pts[0].x + pts[1].x) / 2.0
		cy := (pts[0].y + pts[1].y) / 2.0

		// Reflection
		rx := cx + 1.0*(cx-pts[2].x)
		ry := cy + 1.0*(cy-pts[2].y)
		rVal := loss(rx, ry)

		if pts[0].val <= rVal && rVal < pts[1].val {
			pts[2] = nmPoint{rx, ry, rVal}
		} else if rVal < pts[0].val {
			// Expansion
			ex := cx + 2.0*(rx-cx)
			ey := cy + 2.0*(ry-cy)
			eVal := loss(ex, ey)
			if eVal < rVal {
				pts[2] = nmPoint{ex, ey, eVal}
			} else {
				pts[2] = nmPoint{rx, ry, rVal}
			}
		} else {
			// Contraction
			kx := cx + 0.5*(pts[2].x-cx)
			ky := cy + 0.5*(pts[2].y-cy)
			kVal := loss(kx, ky)
			if kVal < pts[2].val {
				pts[2] = nmPoint{kx, ky, kVal}
			} else {
				// Shrink
				pts[1].x = pts[0].x + 0.5*(pts[1].x-pts[0].x)
				pts[1].y = pts[0].y + 0.5*(pts[1].y-pts[0].y)
				pts[1].val = loss(pts[1].x, pts[1].y)

				pts[2].x = pts[0].x + 0.5*(pts[2].x-pts[0].x)
				pts[2].y = pts[0].y + 0.5*(pts[2].y-pts[0].y)
				pts[2].val = loss(pts[2].x, pts[2].y)
			}
		}
	}

	best := pts[0]
	a, b, c := geometry.SidesFromPolar(d1, d2, d3, best.x, best.y)
	s := (a + b + c) / 2.0
	area := math.Sqrt(math.Max(0.0, s*(s-a)*(s-b)*(s-c)))

	return SolveResult{
		Converged:    converged,
		Iterations:   itCount,
		Alpha:        best.x,
		Beta:         best.y,
		Gamma:        2.0*math.Pi - (best.x + best.y),
		SideA:        a,
		SideB:        b,
		SideC:        c,
		Perimeter:    a + b + c,
		Area:         area,
		ResidualNorm: best.val,
	}, nil
}
