"""
Geometric utilities for triangle properties, coordinates, and area/perimeter.
"""

import math
from typing import Tuple, List, Optional

Point = Tuple[float, float]

def distance_2d(p1: Point, p2: Point) -> float:
    """Euclidean distance between two 2D points."""
    return math.hypot(p1[0] - p2[0], p1[1] - p2[1])

def triangle_perimeter(a: float, b: float, c: float) -> float:
    """Computes the perimeter of a triangle with side lengths a, b, c."""
    return a + b + c

def triangle_area(a: float, b: float, c: float) -> float:
    """Computes area via Heron's formula."""
    s = (a + b + c) / 2.0
    val = s * (s - a) * (s - b) * (s - c)
    if val <= 0.0:
        return 0.0
    return math.sqrt(val)

def triangle_area_coords(A: Point, B: Point, C: Point) -> float:
    """Computes signed area of triangle ABC via determinant / shoelace formula."""
    return 0.5 * ((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]))

def is_point_interior(A: Point, B: Point, C: Point, P: Point) -> bool:
    """
    Checks whether point P strictly lies inside triangle ABC using barycentric coordinates.
    """
    area_total = triangle_area_coords(A, B, C)
    if abs(area_total) < 1e-12:
        return False
    
    sign = 1.0 if area_total > 0 else -1.0
    s = (A[1] * C[0] - A[0] * C[1] + (C[1] - A[1]) * P[0] + (A[0] - C[0]) * P[1]) * sign
    t = (A[0] * B[1] - A[1] * B[0] + (A[1] - B[1]) * P[0] + (B[0] - A[0]) * P[1]) * sign
    
    if s > 0 and t > 0 and (s + t) < 2.0 * abs(area_total):
        return True
    return False

def sides_from_polar_angles(d1: float, d2: float, d3: float, alpha: float, beta: float) -> Tuple[float, float, float]:
    """
    Given distances d1, d2, d3 and subtended angles alpha = ∠APB, beta = ∠BPC,
    computes side lengths (a, b, c) where:
    c = AB (subtended by alpha)
    a = BC (subtended by beta)
    b = CA (subtended by gamma = 2pi - alpha - beta)
    """
    gamma = 2.0 * math.pi - (alpha + beta)
    c = math.sqrt(max(0.0, d1**2 + d2**2 - 2 * d1 * d2 * math.cos(alpha)))
    a = math.sqrt(max(0.0, d2**2 + d3**2 - 2 * d2 * d3 * math.cos(beta)))
    b = math.sqrt(max(0.0, d3**2 + d1**2 - 2 * d3 * d1 * math.cos(gamma)))
    return (a, b, c)

def vertices_from_angles(d1: float, d2: float, d3: float, alpha: float, beta: float) -> Tuple[Point, Point, Point]:
    """
    Constructs coordinates of vertices A, B, C placing P at (0,0) with A on positive x-axis.
    """
    A = (d1, 0.0)
    B = (d2 * math.cos(alpha), d2 * math.sin(alpha))
    theta3 = alpha + beta
    C = (d3 * math.cos(theta3), d3 * math.sin(theta3))
    return (A, B, C)
