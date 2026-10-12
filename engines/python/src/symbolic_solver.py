"""
Exact symbolic solver using SymPy algebraic elimination and polynomial roots.
"""

import math
import sympy as sp
from typing import Dict, Any, List

def solve_equilateral_exact(d1_val: float, d2_val: float, d3_val: float) -> Dict[str, Any]:
    """
    Computes exact algebraic side length and perimeter for an equilateral triangle
    given distances d1, d2, d3.
    
    Equation: 3*(d1^4 + d2^4 + d3^4 + s^4) - (d1^2 + d2^2 + d3^2 + s^2)^2 = 0
    Letting u = s^2:
    2*u^2 - 2*(d1^2 + d2^2 + d3^2)*u + 3*(d1^4 + d2^4 + d3^4) - (d1^2 + d2^2 + d3^2)^2 = 0
    Discriminant Δ = 48 * A_pompeiu^2 where A_pompeiu is area of triangle with sides d1, d2, d3.
    """
    d1 = sp.Rational(str(d1_val)) if isinstance(d1_val, (int, float)) else d1_val
    d2 = sp.Rational(str(d2_val)) if isinstance(d2_val, (int, float)) else d2_val
    d3 = sp.Rational(str(d3_val)) if isinstance(d3_val, (int, float)) else d3_val
    
    u = sp.Symbol('u', positive=True, real=True)
    d1_2 = d1**2
    d2_2 = d2**2
    d3_2 = d3**2
    
    S = d1_2 + d2_2 + d3_2
    Q = d1_2**2 + d2_2**2 + d3_2**2
    
    # Quadratic in u = s^2:
    # 2*u^2 - 2*S*u + (3*Q - S^2) = 0
    # Roots: u = [2*S ± sqrt(4*S^2 - 8*(3*Q - S^2))] / 4 = [S ± sqrt(3*(4*S^2 - 8*Q + ...))]
    # Note: 2*(d1^2 d2^2 + d2^2 d3^2 + d3^2 d1^2) - (d1^4 + d2^4 + d3^4) = 16 * Area_pompeiu^2
    # Discriminant of 2*u^2 - 2*S*u + (3*Q - S^2):
    # Δ = 4*S^2 - 8*(3*Q - S^2) = 12*S^2 - 24*Q = 12*( (d1^2+d2^2+d3^2)^2 - 2*(d1^4+d2^4+d3^4) )
    #   = 12 * [2*(d1^2 d2^2 + d2^2 d3^2 + d3^2 d1^2) - (d1^4 + d2^4 + d3^4)]
    #   = 12 * (16 * Area_pompeiu^2) = 192 * Area_pompeiu^2 = (8*sqrt(3)*Area_pompeiu)^2
    
    poly = 2 * u**2 - 2 * S * u + (3 * Q - S**2)
    roots = sp.solve(poly, u)
    
    valid_solutions = []
    for r in roots:
        r_eval = float(sp.N(r))
        if r_eval > 0:
            s_sym = sp.sqrt(r)
            s_val = math.sqrt(r_eval)
            perim_val = 3.0 * s_val
            valid_solutions.append({
                "side_exact": s_sym,
                "side_numeric": s_val,
                "perimeter_exact": 3 * s_sym,
                "perimeter_numeric": perim_val,
                "u_val": r_eval
            })
    
    # Sort by side length
    valid_solutions.sort(key=lambda x: x["side_numeric"])
    
    # For interior point, the larger root u = (S + 4*sqrt(3)*Area)/2 corresponds to P interior.
    # The smaller root corresponds to P exterior where P faces an edge.
    primary = valid_solutions[-1] if valid_solutions else None
    
    return {
        "solutions": valid_solutions,
        "primary": primary,
        "sum_sq": float(S),
        "pompeiu_discriminant": float(sp.N(4 * S**2 - 8 * (3 * Q - S**2)))
    }

def solve_isosceles_symbolic(d1: float, d2: float, d3: float, equal_pair: str = "ab") -> Dict[str, Any]:
    """
    Symbolic reduction for isosceles triangle where two sides are equal.
    For example equal_pair == 'ab' implies a = b.
    """
    # Uses Cayley-Menger with a2 = b2
    a2 = sp.Symbol('a2', positive=True, real=True)
    c2 = sp.Symbol('c2', positive=True, real=True)
    from .cayley_menger import cayley_menger_det
    
    det_expr = cayley_menger_det(a2, a2, c2, d1**2, d2**2, d3**2)
    det_simplified = sp.collect(sp.expand(det_expr), [c2, a2])
    
    return {
        "polynomial": det_simplified,
        "variables": [str(a2), str(c2)],
    }

def solve_right_triangle_symbolic(d1: float, d2: float, d3: float, hypotenuse: str = "c") -> Dict[str, Any]:
    """
    Symbolic reduction for right triangle where c^2 = a^2 + b^2.
    """
    a2 = sp.Symbol('a2', positive=True, real=True)
    b2 = sp.Symbol('b2', positive=True, real=True)
    from .cayley_menger import cayley_menger_det
    
    c2 = a2 + b2
    det_expr = cayley_menger_det(a2, b2, c2, d1**2, d2**2, d3**2)
    det_simplified = sp.collect(sp.expand(det_expr), [a2, b2])
    
    return {
        "polynomial": det_simplified,
        "hypotenuse": hypotenuse,
    }
