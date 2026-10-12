"""
Bisection and Secant hybrid solver, plus continuous solution manifold tracing.
"""

import math
from typing import Dict, Any, List, Callable, Optional, Tuple
from .geometry_utils import sides_from_polar_angles, triangle_perimeter, triangle_area, vertices_from_angles
from .validators import check_triangle_inequality

def solve_bisection_secant(
    func: Callable[[float], float],
    a: float,
    b: float,
    tol: float = 1e-12,
    max_iter: int = 100
) -> Dict[str, Any]:
    """
    Robust hybrid root finder: uses secant steps when safe, falls back to bisection.
    Requires func(a) * func(b) <= 0.
    """
    fa = func(a)
    fb = func(b)
    
    if abs(fa) < tol:
        return {"root": a, "iterations": 0, "converged": True}
    if abs(fb) < tol:
        return {"root": b, "iterations": 0, "converged": True}
        
    if fa * fb > 0:
        raise ValueError(f"Root is not bracketed: f({a})={fa}, f({b})={fb}")
        
    c = a
    for it in range(1, max_iter + 1):
        # Secant candidate
        if abs(fb - fa) > 1e-15:
            s = b - fb * (b - a) / (fb - fa)
        else:
            s = (a + b) / 2.0
            
        # If secant lands outside interval, fallback to bisection
        if not (min(a, b) < s < max(a, b)):
            s = (a + b) / 2.0
            
        fs = func(s)
        if abs(fs) < tol or abs(b - a) < tol:
            return {"root": s, "iterations": it, "converged": True, "residual": fs}
            
        if fa * fs < 0:
            b = s
            fb = fs
        else:
            a = s
            fa = fs
            
    return {"root": (a + b) / 2.0, "iterations": max_iter, "converged": False, "residual": func((a + b) / 2.0)}

def trace_solution_manifold(
    d1: float,
    d2: float,
    d3: float,
    num_samples: int = 100
) -> Dict[str, Any]:
    """
    Sweeps alpha = ∠APB and beta = ∠BPC across valid ranges to map out
    the continuous 1D/2D solution manifold and bounds of the perimeter P.
    
    Returns sampled points, perimeters, min perimeter, max perimeter.
    """
    manifold_points = []
    min_perim = float('inf')
    max_perim = float('-inf')
    best_min_triangle = None
    best_max_triangle = None
    
    # Grid search across interior angle domain:
    # alpha in (0.1, pi - 0.1), beta in (0.1, pi - 0.1), alpha + beta < 2*pi - 0.1
    alphas = [0.2 + (math.pi - 0.4) * i / num_samples for i in range(num_samples)]
    
    for alpha in alphas:
        # Choose beta symmetrically or sweep
        # For a 1D slice, set beta = (2*pi - alpha) / 2 or sample
        beta = (2.0 * math.pi - alpha) / 2.0
        if beta >= math.pi:
            beta = math.pi - 0.1
        gamma = 2.0 * math.pi - (alpha + beta)
        
        if 0 < alpha < math.pi and 0 < beta < math.pi and 0 < gamma < math.pi:
            a, b, c = sides_from_polar_angles(d1, d2, d3, alpha, beta)
            if check_triangle_inequality(a, b, c):
                p = a + b + c
                area = triangle_area(a, b, c)
                point_data = {
                    "alpha": alpha,
                    "beta": beta,
                    "gamma": gamma,
                    "sides": (a, b, c),
                    "perimeter": p,
                    "area": area
                }
                manifold_points.append(point_data)
                if p < min_perim:
                    min_perim = p
                    best_min_triangle = point_data
                if p > max_perim:
                    max_perim = p
                    best_max_triangle = point_data
                    
    return {
        "num_points": len(manifold_points),
        "min_perimeter": min_perim if min_perim != float('inf') else None,
        "max_perimeter": max_perim if max_perim != float('-inf') else None,
        "min_triangle": best_min_triangle,
        "max_triangle": best_max_triangle,
        "samples": manifold_points
    }
