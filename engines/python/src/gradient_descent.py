"""
Gradient Descent and Adam Optimizer for triangle perimeter and shape reconstruction.
"""

import math
import numpy as np
from typing import Dict, Any, List, Optional, Tuple
from .geometry_utils import sides_from_polar_angles, triangle_perimeter, triangle_area, vertices_from_angles
from .validators import check_triangle_inequality

def solve_gradient_descent(
    d1: float,
    d2: float,
    d3: float,
    target_type: str = "equilateral",
    initial_guess: Optional[Tuple[float, float]] = None,
    learning_rate: float = 0.05,
    max_iter: int = 500,
    tol: float = 1e-8,
    optimizer: str = "adam"
) -> Dict[str, Any]:
    """
    Minimizes loss function over angles (alpha, beta) using Gradient Descent or Adam.
    
    For 'equilateral':
    Loss = (a - b)^2 + (b - c)^2 + (c - a)^2
    """
    if initial_guess is None:
        x = np.array([2.0, 2.0], dtype=float)
    else:
        x = np.array(list(initial_guess), dtype=float)
        
    m = np.zeros(2, dtype=float)
    v = np.zeros(2, dtype=float)
    beta1 = 0.9
    beta2 = 0.999
    eps = 1e-8
    
    trajectory: List[Dict[str, Any]] = []
    converged = False
    
    def loss_and_grad(alpha: float, beta: float) -> Tuple[float, np.ndarray]:
        gamma = 2.0 * math.pi - (alpha + beta)
        cos_a = math.cos(alpha)
        cos_b = math.cos(beta)
        cos_g = math.cos(gamma)
        
        c = math.sqrt(max(1e-12, d1**2 + d2**2 - 2 * d1 * d2 * cos_a))
        a = math.sqrt(max(1e-12, d2**2 + d3**2 - 2 * d2 * d3 * cos_b))
        b = math.sqrt(max(1e-12, d3**2 + d1**2 - 2 * d3 * d1 * cos_g))
        
        if target_type == "equilateral":
            L = (a - b)**2 + (b - c)**2 + (c - a)**2
            
            # Derivatives of sides
            dc_da = (d1 * d2 * math.sin(alpha)) / c
            dc_db = 0.0
            
            da_da = 0.0
            da_db = (d2 * d3 * math.sin(beta)) / a
            
            # d(cos(gamma))/dalpha = d(cos(2pi - (alpha+beta)))/dalpha = -sin(alpha+beta)
            db_da = (d3 * d1 * math.sin(alpha + beta)) / b
            db_db = (d3 * d1 * math.sin(alpha + beta)) / b
            
            # dL/da_side = 2(a-b) - 2(c-a) = 4a - 2b - 2c
            # dL/db_side = -2(a-b) + 2(b-c) = 4b - 2a - 2c
            # dL/dc_side = -2(b-c) + 2(c-a) = 4c - 2a - 2b
            dLa = 4*a - 2*b - 2*c
            dLb = 4*b - 2*a - 2*c
            dLc = 4*c - 2*a - 2*b
            
            grad_alpha = dLa * da_da + dLb * db_da + dLc * dc_da
            grad_beta  = dLa * da_db + dLb * db_db + dLc * dc_db
            
            return L, np.array([grad_alpha, grad_beta], dtype=float)
        else:
            raise ValueError(f"Unknown target_type: {target_type}")

    for it in range(1, max_iter + 1):
        loss, grad = loss_and_grad(x[0], x[1])
        
        a, b, c = sides_from_polar_angles(d1, d2, d3, x[0], x[1])
        trajectory.append({
            "iteration": it,
            "loss": float(loss),
            "alpha": float(x[0]),
            "beta": float(x[1]),
            "sides": (float(a), float(b), float(c)),
            "perimeter": float(a + b + c)
        })
        
        if loss < tol or np.linalg.norm(grad) < tol:
            converged = True
            break
            
        if optimizer == "adam":
            m = beta1 * m + (1.0 - beta1) * grad
            v = beta2 * v + (1.0 - beta2) * (grad ** 2)
            m_hat = m / (1.0 - beta1 ** it)
            v_hat = v / (1.0 - beta2 ** it)
            step = learning_rate * m_hat / (np.sqrt(v_hat) + eps)
            x = x - step
        else:
            # Standard SGD
            x = x - learning_rate * grad
            
        # Bounds projection
        x[0] = max(0.05, min(math.pi - 0.05, x[0]))
        x[1] = max(0.05, min(math.pi - 0.05, x[1]))

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
        "loss": float(loss),
        "vertices": vertices,
        "trajectory": trajectory
    }
