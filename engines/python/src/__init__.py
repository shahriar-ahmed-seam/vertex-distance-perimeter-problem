"""
Vertex-Distance Perimeter Problem (VDPP) Python Computational Engine.
"""

from .cayley_menger import cayley_menger_matrix, cayley_menger_det, cayley_menger_equilateral_poly
from .symbolic_solver import solve_equilateral_exact, solve_isosceles_symbolic, solve_right_triangle_symbolic
from .newton_raphson import solve_newton_raphson
from .gradient_descent import solve_gradient_descent
from .nelder_mead import solve_nelder_mead
from .bisection_secant import solve_bisection_secant, trace_solution_manifold
from .triangle_classifier import classify_triangle, TriangleType
from .geometry_utils import triangle_area, triangle_perimeter, is_point_interior, distance_2d
from .validators import validate_distances, check_triangle_inequality

__all__ = [
    "cayley_menger_matrix",
    "cayley_menger_det",
    "cayley_menger_equilateral_poly",
    "solve_equilateral_exact",
    "solve_isosceles_symbolic",
    "solve_right_triangle_symbolic",
    "solve_newton_raphson",
    "solve_gradient_descent",
    "solve_nelder_mead",
    "solve_bisection_secant",
    "trace_solution_manifold",
    "classify_triangle",
    "TriangleType",
    "triangle_area",
    "triangle_perimeter",
    "is_point_interior",
    "distance_2d",
    "validate_distances",
    "check_triangle_inequality",
]
