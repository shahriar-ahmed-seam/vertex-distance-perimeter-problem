"""
Cayley-Menger bordered determinant formulations (both symbolic and numeric).
"""

import numpy as np
import sympy as sp
from typing import Union, Tuple

def cayley_menger_matrix(a2, b2, c2, d1_2, d2_2, d3_2):
    """
    Constructs the 5x5 Cayley-Menger bordered matrix for 4 coplanar points (A, B, C, P):
    Points index: 0=border, 1=A, 2=B, 3=C, 4=P
    Pairwise squared distances:
      AB = c^2, BC = a^2, CA = b^2
      PA = d1^2, PB = d2^2, PC = d3^2
    """
    if isinstance(a2, (sp.Basic, sp.Symbol)) or isinstance(d1_2, (sp.Basic, sp.Symbol)):
        M = sp.Matrix([
            [0,     1,     1,     1,     1],
            [1,     0,    c2,    b2,  d1_2],
            [1,    c2,     0,    a2,  d2_2],
            [1,    b2,    a2,     0,  d3_2],
            [1,  d1_2,  d2_2,  d3_2,     0]
        ])
        return M
    else:
        return np.array([
            [0,     1,     1,     1,     1],
            [1,     0,    c2,    b2,  d1_2],
            [1,    c2,     0,    a2,  d2_2],
            [1,    b2,    a2,     0,  d3_2],
            [1,  d1_2,  d2_2,  d3_2,     0]
        ], dtype=float)

def cayley_menger_det(a2, b2, c2, d1_2, d2_2, d3_2):
    """
    Computes determinant of the 5x5 Cayley-Menger matrix.
    If points A, B, C, P are coplanar, det = 0.
    """
    M = cayley_menger_matrix(a2, b2, c2, d1_2, d2_2, d3_2)
    if isinstance(M, sp.Matrix):
        return M.det()
    return float(np.linalg.det(M))

def cayley_menger_equilateral_poly(d1, d2, d3, s=None):
    """
    For an equilateral triangle with side s, a = b = c = s.
    Substitutes into Cayley-Menger determinant to obtain polynomial in s^2.
    Formula: 3(d1^4 + d2^4 + d3^4 + s^4) - (d1^2 + d2^2 + d3^2 + s^2)^2 = 0
    or 2(s^4 - (d1^2 + d2^2 + d3^2)s^2 + ...)
    """
    if s is None:
        s = sp.Symbol('s', positive=True, real=True)
    
    s2 = s**2
    d1_2 = d1**2
    d2_2 = d2**2
    d3_2 = d3**2
    
    # Direct formula from Pompeiu / Cayley-Menger
    poly = 3 * (d1_2**2 + d2_2**2 + d3_2**2 + s2**2) - (d1_2 + d2_2 + d3_2 + s2)**2
    return sp.expand(poly)
