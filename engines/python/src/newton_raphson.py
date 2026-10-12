"""
Multidimensional Newton-Raphson solver for triangle reconstruction.
"""

import math
import numpy as np
from typing import Dict, Any, List, Optional, Tuple
from .geometry_utils import sides_from_polar_angles, triangle_perimeter, triangle_area, vertices_from_angles
from .validators import check_triangle_inequality

def solve_newton_raphson(
    d1: float,
    d2: float,
    d3: float,
    target_type: str = "equilateral",
    initial_guess: Optional[Tuple[float, float]] = None,
    tol: float = 1e-12,
    max_iter: int = 100,
    damping: float = 1.0
) -> Dict[str, Any]:
    """
    Solves for subtended angles (alpha, beta) using Newton-Raphson.
    
    alpha = ∠APB
    beta = ∠BPC
    gamma = 2pi - (alpha + beta) = ∠CPA
    
    For target_type == 'equilateral':
    F1(alpha, beta) = a^2 - b^2 = 0
    F2(alpha, beta) = b^2 - c^2 = 0
    where:
    c^2 = d1^2 + d2^2 - 2*d1*d2*cos(alpha)
    a^2 = d2^2 + d3^2 - 2*d2*d3*cos(beta)
    b^2 = d3^2 + d1^2 - 2*d3*d1*cos(2pi - alpha - beta)
    """
    if initial_guess is None:
        # Default symmetric guess near 2pi/3 (120 degrees each)
        x = np.array([2.0 * math.pi / 3.0, 2.0 * math.pi / 3.0], dtype=float)
    else:
        x = np.array(list(initial_guess), dtype=float)
    
    trajectory: List[Dict[str, Any]] = []
    converged = False
    
    def eval_system(alpha: float, beta: float) -> Tuple[np.ndarray, np.ndarray]:
        # Residuals
        cos_a = math.cos(alpha)
        cos_b = math.cos(beta)
        cos_g = math.cos(alpha + beta) # cos(2pi - (alpha+beta)) = cos(alpha+beta)
        
        sin_a = math.sin(alpha)
        sin_b = math.sin(beta)
        sin_g = math.sin(alpha + beta)
        
        c2 = d1**2 + d2**2 - 2 * d1 * d2 * cos_a
        a2 = d2**2 + d3**2 - 2 * d2 * d3 * cos_b
        b2 = d3**2 + d1**2 - 2 * d3 * d1 * cos_g
        
        if target_type == "equilateral":
            F = np.array([a2 - b2, b2 - c2], dtype=float)
            
            # Jacobian J = dF/d(alpha, beta)
            # F1 = a2 - b2
            # dF1/dalpha = - d(b2)/dalpha = - (-2*d3*d1*(-sin(alpha+beta))) = - 2*d3*d1*sin(alpha+beta)
            # dF1/dbeta = d(a2)/dbeta - d(b2)/dbeta = 2*d2*d3*sin(beta) - 2*d3*d1*sin(alpha+beta)
            # F2 = b2 - c2
            # dF2/dalpha = d(b2)/dalpha - d(c2)/dalpha = 2*d3*d1*sin(alpha+beta) - (2*d1*d2*sin(alpha))
            # dF2/dbeta = d(b2)/dbeta = 2*d3*d1*sin(alpha+beta)
            
            dF1_dalpha = -2.0 * d3 * d1 * sin_g
            dF1_dbeta  = 2.0 * d2 * d3 * sin_b - 2.0 * d3 * d1 * sin_g
            
            dF2_dalpha = 2.0 * d3 * d1 * sin_g - 2.0 * d1 * d2 * sin_a
            dF2_dbeta  = 2.0 * d3 * d1 * sin_g
            
            J = np.array([
                [dF1_dalpha, dF1_dbeta],
                [dF2_dalpha, dF2_dbeta]
            ], dtype=float)
            return F, J
            
        elif target_type == "right_c":
            # Right triangle with hypotenuse c: a^2 + b^2 - c^2 = 0 and another constraint e.g. a=b (isosceles right)
            F = np.array([a2 + b2 - c2, a2 - b2], dtype=float)
            dF1_dalpha = 2.0 * d3 * d1 * sin_g - 2.0 * d1 * d2 * sin_a
            dF1_dbeta  = 2.0 * d2 * d3 * sin_b + 2.0 * d3 * d1 * sin_g
            dF2_dalpha = -2.0 * d3 * d1 * sin_g
            dF2_dbeta  = 2.0 * d2 * d3 * sin_b - 2.0 * d3 * d1 * sin_g
            J = np.array([[dF1_dalpha, dF1_dbeta], [dF2_dalpha, dF2_dbeta]], dtype=float)
            return F, J
            
        else:
            raise ValueError(f"Unsupported target_type: {target_type}")

    for it in range(max_iter):
        alpha, beta = x[0], x[1]
        F, J = eval_system(alpha, beta)
        res_norm = float(np.linalg.norm(F))
        
        a, b, c = sides_from_polar_angles(d1, d2, d3, alpha, beta)
        trajectory.append({
            "iteration": it,
            "alpha": float(alpha),
            "beta": float(beta),
            "residual_norm": res_norm,
            "sides": (float(a), float(b), float(c)),
            "perimeter": float(a + b + c)
        })
        
        if res_norm < tol:
            converged = True
            break
            
        try:
            delta = np.linalg.solve(J, -F)
        except np.linalg.LinAlgError:
            # Singularity encountered, apply small regularized pseudoinverse
            delta = -np.linalg.pinv(J) @ F
            
        # Update with optional step damping
        x = x + damping * delta
        
        # Keep angles within reasonable bounds
        x[0] = max(0.01, min(math.pi - 0.01, x[0]))
        x[1] = max(0.01, min(math.pi - 0.01, x[1]))

    final_alpha, final_beta = x[0], x[1]
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
        "is_valid_triangle": check_triangle_inequality(final_a, final_b, final_c),
        "vertices": vertices,
        "trajectory": trajectory
    }
