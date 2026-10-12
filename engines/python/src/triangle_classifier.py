"""
Triangle classification and solver routing.
"""

import math
from enum import Enum
from typing import Dict, Any, Tuple
from .validators import check_triangle_inequality

class TriangleType(Enum):
    EQUILATERAL = "equilateral"
    ISOSCELES = "isosceles"
    RIGHT = "right"
    RIGHT_ISOSCELES = "right_isosceles"
    ACUTE = "acute"
    OBTUSE = "obtuse"
    DEGENERATE = "degenerate"

def classify_triangle(a: float, b: float, c: float, tol: float = 1e-5) -> Dict[str, Any]:
    """
    Classifies a triangle with sides a, b, c based on side symmetries and largest angle.
    """
    if not check_triangle_inequality(a, b, c):
        return {
            "type": TriangleType.DEGENERATE,
            "type_name": "Degenerate",
            "is_valid": False,
            "angles_deg": (0.0, 0.0, 0.0)
        }
        
    sides = sorted([a, b, c])
    s1, s2, s3 = sides[0], sides[1], sides[2] # s3 is hypotenuse / largest side
    
    # Angles via law of cosines
    cos_A = (b**2 + c**2 - a**2) / (2.0 * b * c)
    cos_B = (c**2 + a**2 - b**2) / (2.0 * c * a)
    cos_C = (a**2 + b**2 - c**2) / (2.0 * a * b)
    
    ang_A = math.degrees(math.acos(max(-1.0, min(1.0, cos_A))))
    ang_B = math.degrees(math.acos(max(-1.0, min(1.0, cos_B))))
    ang_C = math.degrees(math.acos(max(-1.0, min(1.0, cos_C))))
    
    is_equilateral = (abs(a - b) < tol) and (abs(b - c) < tol)
    is_isosceles = (abs(a - b) < tol) or (abs(b - c) < tol) or (abs(c - a) < tol)
    is_right = abs(s1**2 + s2**2 - s3**2) < tol * (s3**2 + 1.0)
    
    if is_equilateral:
        t_type = TriangleType.EQUILATERAL
    elif is_right and is_isosceles:
        t_type = TriangleType.RIGHT_ISOSCELES
    elif is_right:
        t_type = TriangleType.RIGHT
    elif is_isosceles:
        t_type = TriangleType.ISOSCELES
    elif s1**2 + s2**2 > s3**2:
        t_type = TriangleType.ACUTE
    else:
        t_type = TriangleType.OBTUSE
        
    return {
        "type": t_type,
        "type_name": t_type.value.capitalize().replace("_", " "),
        "is_valid": True,
        "is_equilateral": is_equilateral,
        "is_isosceles": is_isosceles,
        "is_right": is_right,
        "angles_deg": (ang_A, ang_B, ang_C),
        "angles_rad": (math.radians(ang_A), math.radians(ang_B), math.radians(ang_C))
    }
