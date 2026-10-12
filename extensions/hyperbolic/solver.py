"""
Hyperbolic Geometry Extension on the Poincaré Disk / Hyperbolic Plane H^2.
"""

import math
from typing import Dict, Any

def poincare_distance(u: complex, v: complex) -> float:
    """Computes hyperbolic distance in the Poincaré unit disk model."""
    diff_norm = abs(u - v)
    denom = (1 - abs(u)**2) * (1 - abs(v)**2)
    if denom <= 0:
        return float('inf')
    delta = 2 * (diff_norm**2) / denom
    return math.acosh(1 + delta)

def hyperbolic_side_from_polar(d1: float, d2: float, alpha: float) -> float:
    """
    Computes hyperbolic side length c using the Hyperbolic Law of Cosines:
    cosh(c) = cosh(d1) cosh(d2) - sinh(d1) sinh(d2) cos(alpha)
    """
    cosh_c = math.cosh(d1) * math.cosh(d2) - math.sinh(d1) * math.sinh(d2) * math.cos(alpha)
    cosh_c = max(1.0, cosh_c)
    return math.acosh(cosh_c)

def solve_hyperbolic_triangle(d1: float, d2: float, d3: float, alpha: float, beta: float) -> Dict[str, Any]:
    gamma = 2.0 * math.pi - (alpha + beta)
    c = hyperbolic_side_from_polar(d1, d2, alpha)
    a = hyperbolic_side_from_polar(d2, d3, beta)
    b = hyperbolic_side_from_polar(d3, d1, gamma)
    return {
        "side_a": a,
        "side_b": b,
        "side_c": c,
        "hyperbolic_perimeter": a + b + c
    }
