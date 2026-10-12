"""
Tests for Python solvers (Symbolic, Newton-Raphson, Gradient Descent, Nelder-Mead, Bisection).
"""

import math
import pytest
from engines.python.src.symbolic_solver import solve_equilateral_exact
from engines.python.src.newton_raphson import solve_newton_raphson
from engines.python.src.gradient_descent import solve_gradient_descent
from engines.python.src.nelder_mead import solve_nelder_mead
from engines.python.src.bisection_secant import trace_solution_manifold
from engines.python.src.triangle_classifier import classify_triangle, TriangleType

def test_equilateral_symbolic_3_4_5():
    """Canonical test case: d1=3, d2=4, d3=5 in an equilateral triangle."""
    res = solve_equilateral_exact(3, 4, 5)
    assert res["primary"] is not None
    # True side = sqrt(25 + 12*sqrt(3)) approx 6.766427845768282
    expected_side = math.sqrt(25.0 + 12.0 * math.sqrt(3.0))
    expected_perim = 3.0 * expected_side
    assert pytest.approx(res["primary"]["side_numeric"], rel=1e-6) == expected_side
    assert pytest.approx(res["primary"]["perimeter_numeric"], rel=1e-6) == expected_perim

def test_newton_raphson_equilateral():
    res = solve_newton_raphson(3, 4, 5, target_type="equilateral")
    assert res["converged"] is True
    expected_side = math.sqrt(25.0 + 12.0 * math.sqrt(3.0))
    expected_perim = 3.0 * expected_side
    assert pytest.approx(res["perimeter"], rel=1e-5) == expected_perim
    a, b, c = res["sides"]
    assert pytest.approx(a, rel=1e-5) == expected_side
    assert pytest.approx(b, rel=1e-5) == expected_side
    assert pytest.approx(c, rel=1e-5) == expected_side

def test_gradient_descent_equilateral():
    res = solve_gradient_descent(3, 4, 5, target_type="equilateral", max_iter=300, learning_rate=0.03)
    assert res["converged"] is True
    expected_side = math.sqrt(25.0 + 12.0 * math.sqrt(3.0))
    expected_perim = 3.0 * expected_side
    assert pytest.approx(res["perimeter"], rel=1e-2) == expected_perim

def test_nelder_mead_equilateral():
    res = solve_nelder_mead(3, 4, 5, target_type="equilateral")
    assert res["converged"] is True
    expected_side = math.sqrt(25.0 + 12.0 * math.sqrt(3.0))
    expected_perim = 3.0 * expected_side
    assert pytest.approx(res["perimeter"], rel=1e-3) == expected_perim

def test_trace_solution_manifold():
    res = trace_solution_manifold(3, 4, 5, num_samples=30)
    assert res["num_points"] > 0
    assert res["min_perimeter"] is not None
    assert res["max_perimeter"] is not None
    assert res["min_perimeter"] < res["max_perimeter"]

def test_triangle_classifier():
    res_eq = classify_triangle(5, 5, 5)
    assert res_eq["type"] == TriangleType.EQUILATERAL
    
    res_right = classify_triangle(3, 4, 5)
    assert res_right["type"] == TriangleType.RIGHT
    
    res_iso = classify_triangle(5, 5, 8)
    assert res_iso["type"] == TriangleType.ISOSCELES
