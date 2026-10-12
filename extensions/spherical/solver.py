"""
Spherical Geometry Extension for the Vertex-Distance Problem on a Sphere S^2 of radius R.
"""

import math
from typing import Tuple, Dict, Any

def spherical_distance(lat1: float, lon1: float, lat2: float, lon2: float, R: float = 1.0) -> float:
    """Computes great-circle arc distance via the Haversine formula."""
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(max(0.0, 1.0 - a)))
    return R * c

def spherical_side_from_polar(d1: float, d2: float, alpha: float, R: float = 1.0) -> float:
    """
    Computes spherical side length c between vertices A and B given great-circle distances
    d1 = PA, d2 = PB, and spherical angle alpha = ∠APB using the spherical Law of Cosines:
    cos(c / R) = cos(d1 / R) cos(d2 / R) + sin(d1 / R) sin(d2 / R) cos(alpha)
    """
    cos_c = math.cos(d1 / R) * math.cos(d2 / R) + math.sin(d1 / R) * math.sin(d2 / R) * math.cos(alpha)
    cos_c = max(-1.0, min(1.0, cos_c))
    return R * math.acos(cos_c)

def solve_spherical_triangle(d1: float, d2: float, d3: float, alpha: float, beta: float, R: float = 1.0) -> Dict[str, Any]:
    gamma = 2.0 * math.pi - (alpha + beta)
    c = spherical_side_from_polar(d1, d2, alpha, R)
    a = spherical_side_from_polar(d2, d3, beta, R)
    b = spherical_side_from_polar(d3, d1, gamma, R)
    return {
        "side_a": a,
        "side_b": b,
        "side_c": c,
        "spherical_perimeter": a + b + c,
        "radius": R
    }
