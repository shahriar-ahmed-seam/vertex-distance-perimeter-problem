"""
3D Tetrahedron Extension for the Vertex-Distance Problem in R^3.
Computes volume and circumradius using the 5x5 Cayley-Menger determinant.
"""

import math
import numpy as np
from typing import Dict, Any

def tetrahedron_volume_cayley_menger(
    d_AB: float, d_AC: float, d_AD: float,
    d_BC: float, d_BD: float, d_CD: float
) -> float:
    """
    Computes volume of tetrahedron ABCD given its 6 edge lengths using the 5x5 Cayley-Menger determinant:
    288 * V^2 = det(M)
    """
    M = np.array([
        [0,            1,            1,            1,            1          ],
        [1,            0,            d_AB**2,      d_AC**2,      d_AD**2    ],
        [1,            d_AB**2,      0,            d_BC**2,      d_BD**2    ],
        [1,            d_AC**2,      d_BC**2,      0,            d_CD**2    ],
        [1,            d_AD**2,      d_BD**2,      d_CD**2,      0          ]
    ], dtype=float)

    det_val = float(np.linalg.det(M))
    if det_val <= 0:
        return 0.0
    return math.sqrt(det_val / 288.0)

def regular_tetrahedron_volume(s: float) -> float:
    """Volume of regular tetrahedron with edge s: s^3 / (6 * sqrt(2))."""
    return (s**3) / (6.0 * math.sqrt(2.0))
