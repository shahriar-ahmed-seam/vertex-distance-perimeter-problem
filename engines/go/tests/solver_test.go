package solver_test

import (
	"math"
	"testing"

	"github.com/shahriar/triangle-thm/engines/go/pkg/solver"
)

func TestEquilateralExact(t *testing.T) {
	side, perim, err := solver.SolveEquilateralExactClosedForm(3, 4, 5)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expectedSide := math.Sqrt(25.0 + 12.0*math.Sqrt(3.0))
	expectedPerim := 3.0 * expectedSide

	if math.Abs(side-expectedSide) > 1e-9 {
		t.Errorf("expected side %v, got %v", expectedSide, side)
	}
	if math.Abs(perim-expectedPerim) > 1e-9 {
		t.Errorf("expected perimeter %v, got %v", expectedPerim, perim)
	}
}

func TestNewtonEquilateral(t *testing.T) {
	res, err := solver.SolveNewtonEquilateral(3, 4, 5, 50, 1e-10)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !res.Converged {
		t.Errorf("Newton solver failed to converge")
	}

	expectedSide := math.Sqrt(25.0 + 12.0*math.Sqrt(3.0))
	expectedPerim := 3.0 * expectedSide

	if math.Abs(res.Perimeter-expectedPerim) > 1e-4 {
		t.Errorf("expected perimeter %v, got %v", expectedPerim, res.Perimeter)
	}
}

func TestNelderMeadEquilateral(t *testing.T) {
	res, err := solver.SolveNelderMeadEquilateral(3, 4, 5, 200, 1e-6)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expectedSide := math.Sqrt(25.0 + 12.0*math.Sqrt(3.0))
	expectedPerim := 3.0 * expectedSide

	if math.Abs(res.Perimeter-expectedPerim) > 1e-2 {
		t.Errorf("expected perimeter %v, got %v", expectedPerim, res.Perimeter)
	}
}
