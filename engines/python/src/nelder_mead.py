"""
Nelder-Mead simplex derivative-free optimizer for triangle reconstruction.
"""

import math
import numpy as np
from typing import Dict, Any, List, Optional, Tuple
from .geometry_utils import sides_from_polar_angles, triangle_perimeter, triangle_area, vertices_from_angles
from .validators import check_triangle_inequality

def solve_nelder_mead(
    d1: float,
    d2: float,
    d3: float,
    target_type: str = "equilateral",
    initial_guess: Optional[Tuple[float, float]] = None,
    tol: float = 1e-10,
    max_iter: int = 200
) -> Dict[str, Any]:
    """
    Derivative-free Nelder-Mead simplex solver in 2D angle space (alpha, beta).
    """
    if initial_guess is None:
        p0 = np.array([2.0, 2.0], dtype=float)
    else:
        p0 = np.array(list(initial_guess), dtype=float)
        
    def objective(x: np.ndarray) -> float:
        alpha, beta = x[0], x[1]
        if alpha <= 0 or alpha >= math.pi or beta <= 0 or beta >= math.pi or (alpha + beta) >= 2 * math.pi:
            return 1e6 # Heavy penalty outside domain
        a, b, c = sides_from_polar_angles(d1, d2, d3, alpha, beta)
        if target_type == "equilateral":
            return (a - b)**2 + (b - c)**2 + (c - a)**2
        elif target_type == "right_c":
            return (a**2 + b**2 - c**2)**2 + (a - b)**2
        return 0.0

    # Initialize simplex with 3 vertices
    step = 0.2
    simplex = [
        p0,
        p0 + np.array([step, 0.0]),
        p0 + np.array([0.0, step])
    ]
    
    alpha_reflect = 1.0
    gamma_expand  = 2.0
    rho_contract  = 0.5
    sigma_shrink  = 0.5
    
    trajectory: List[Dict[str, Any]] = []
    converged = False
    
    for it in range(max_iter):
        simplex.sort(key=lambda p: objective(p))
        best_p = simplex[0]
        best_val = objective(best_p)
        worst_p = simplex[2]
        
        a, b, c = sides_from_polar_angles(d1, d2, d3, best_p[0], best_p[1])
        trajectory.append({
            "iteration": it,
            "best_loss": float(best_val),
            "alpha": float(best_p[0]),
            "beta": float(best_p[1]),
            "perimeter": float(a + b + c)
        })
        
        # Convergence test: variance of simplex values
        vals = [objective(p) for p in simplex]
        if max(abs(v - best_val) for v in vals) < tol or best_val < tol:
            converged = True
            break
            
        # Centroid of all except worst
        x_bar = (simplex[0] + simplex[1]) / 2.0
        
        # Reflection
        x_r = x_bar + alpha_reflect * (x_bar - worst_p)
        f_r = objective(x_r)
        
        if vals[0] <= f_r < vals[1]:
            simplex[2] = x_r
        elif f_r < vals[0]:
            # Expansion
            x_e = x_bar + gamma_expand * (x_r - x_bar)
            if objective(x_e) < f_r:
                simplex[2] = x_e
            else:
                simplex[2] = x_r
        else:
            # Contraction
            if f_r < vals[2]:
                # Outside contraction
                x_c = x_bar + rho_contract * (x_r - x_bar)
                if objective(x_c) <= f_r:
                    simplex[2] = x_c
                else:
                    # Shrink
                    simplex[1] = simplex[0] + sigma_shrink * (simplex[1] - simplex[0])
                    simplex[2] = simplex[0] + sigma_shrink * (simplex[2] - simplex[0])
            else:
                # Inside contraction
                x_c = x_bar + rho_contract * (worst_p - x_bar)
                if objective(x_c) < vals[2]:
                    simplex[2] = x_c
                else:
                    # Shrink
                    simplex[1] = simplex[0] + sigma_shrink * (simplex[1] - simplex[0])
                    simplex[2] = simplex[0] + sigma_shrink * (simplex[2] - simplex[0])

    final_p = simplex[0]
    final_alpha, final_beta = final_p[0], final_p[1]
    final_a, final_b, final_c = sides_from_polar_angles(d1, d2, d3, final_alpha, final_beta)
    vertices = vertices_from_angles(d1, d2, d3, final_alpha, final_beta)
    
    return {
        "converged": converged,
        "iterations": len(trajectory),
        "alpha": float(final_alpha),
        "beta": float(final_beta),
        "gamma": float(2.0 * math.pi - (final_alpha + final_beta)),
        "sides": (float(final_a), float(final_b), float(final_c)),
        "perimeter": float(final_a + final_b + final_c),
        "area": float(triangle_area(final_a, final_b, final_c)),
        "best_loss": float(objective(final_p)),
        "vertices": vertices,
        "trajectory": trajectory
    }
