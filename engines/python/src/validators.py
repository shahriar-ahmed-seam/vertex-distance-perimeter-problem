"""
Validation routines for geometric feasibility and triangle inequalities.
"""

from typing import Tuple

def check_triangle_inequality(a: float, b: float, c: float, tol: float = 1e-9) -> bool:
    """
    Validates whether sides a, b, c form a non-degenerate triangle satisfying strict triangle inequalities.
    """
    if a <= 0 or b <= 0 or c <= 0:
        return False
    return (a + b > c + tol) and (b + c > a + tol) and (c + a > b + tol)

def validate_distances(d1: float, d2: float, d3: float) -> Tuple[bool, str]:
    """
    Validates whether distance measurements d1, d2, d3 are positive and geometrically viable.
    Returns (is_valid, reason).
    """
    if d1 <= 0 or d2 <= 0 or d3 <= 0:
        return False, "Distances d1, d2, d3 must be strictly positive."
    
    # Pompeiu's triangle condition for equilateral case:
    # d1 + d2 >= d3, d2 + d3 >= d1, d3 + d1 >= d2
    # For a general triangle, d1, d2, d3 don't strictly have to form a triangle if the triangle is obtuse/elongated,
    # but they must be finite real numbers.
    return True, "Valid distance triplet."

def check_interior_angle_bounds(alpha: float, beta: float) -> bool:
    """
    Checks if angles alpha, beta, and gamma = 2pi - (alpha+beta) all lie strictly in (0, pi).
    This is the necessary and sufficient condition for P to be strictly in the interior of triangle ABC.
    """
    gamma = 2.0 * 3.141592653589793 - (alpha + beta)
    pi = 3.141592653589793
    return (0.0 < alpha < pi) and (0.0 < beta < pi) and (0.0 < gamma < pi)
