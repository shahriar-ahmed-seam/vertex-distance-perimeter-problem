"""
Visualization helpers for plotting triangles, distance rays, and solution manifolds.
"""

import math
import numpy as np
import matplotlib.pyplot as plt
from typing import Tuple, Optional, Dict, Any

def plot_triangle_with_point(
    A: Tuple[float, float],
    B: Tuple[float, float],
    C: Tuple[float, float],
    P: Tuple[float, float] = (0.0, 0.0),
    title: str = "Triangle Configuration with Interior Point P",
    save_path: Optional[str] = None
):
    """
    Renders 2D triangle ABC with interior point P and distance rays.
    """
    fig, ax = plt.subplots(figsize=(8, 7))
    
    # Triangle boundary
    tri_x = [A[0], B[0], C[0], A[0]]
    tri_y = [A[1], B[1], C[1], A[1]]
    ax.plot(tri_x, tri_y, 'b-', lw=2.5, label='Triangle Edges')
    ax.fill([A[0], B[0], C[0]], [A[1], B[1], C[1]], alpha=0.15, color='#38bdf8')
    
    # Distance rays
    ax.plot([P[0], A[0]], [P[1], A[1]], 'r--', lw=2, label=f'd1 = {math.dist(P, A):.2f}')
    ax.plot([P[0], B[0]], [P[1], B[1]], 'g--', lw=2, label=f'd2 = {math.dist(P, B):.2f}')
    ax.plot([P[0], C[0]], [P[1], C[1]], 'm--', lw=2, label=f'd3 = {math.dist(P, C):.2f}')
    
    # Vertices
    ax.plot(*A, 'o', color='#0284c7', markersize=9)
    ax.annotate('A', A, textcoords="offset points", xytext=(-10, 10), fontsize=12, fontweight='bold')
    
    ax.plot(*B, 'o', color='#0284c7', markersize=9)
    ax.annotate('B', B, textcoords="offset points", xytext=(-15, -15), fontsize=12, fontweight='bold')
    
    ax.plot(*C, 'o', color='#0284c7', markersize=9)
    ax.annotate('C', C, textcoords="offset points", xytext=(10, -10), fontsize=12, fontweight='bold')
    
    # Point P
    ax.plot(*P, 'o', color='#ef4444', markersize=10)
    ax.annotate('P', P, textcoords="offset points", xytext=(8, 8), fontsize=13, fontweight='bold', color='#ef4444')
    
    ax.set_aspect('equal')
    ax.grid(True, linestyle=':', alpha=0.6)
    ax.set_title(title, fontsize=14, fontweight='bold')
    ax.legend(loc='upper right')
    
    if save_path:
        plt.savefig(save_path, dpi=200, bbox_inches='tight')
    plt.close(fig)
