"""
Synthetic dataset generator for the Vertex-Distance Perimeter Problem.
Generates randomized valid triangles, samples interior points, computes vertex distances,
and exports structured datasets (CSV and JSON) with ground truth metrics.
"""

import math
import random
import json
import csv
import argparse
from typing import Dict, Any, List

def sample_interior_point(A, B, C):
    """Samples a uniformly random interior point in triangle ABC via barycentric coordinates."""
    r1 = random.random()
    r2 = random.random()
    if r1 + r2 > 1.0:
        r1 = 1.0 - r1
        r2 = 1.0 - r2
    r3 = 1.0 - r1 - r2
    px = r1 * A[0] + r2 * B[0] + r3 * C[0]
    py = r1 * A[1] + r2 * B[1] + r3 * C[1]
    return (px, py), (r1, r2, r3)

def generate_sample(sample_id: int) -> Dict[str, Any]:
    """Generates a single random triangle sample with an interior point."""
    # Place vertices in a bounding box
    A = (random.uniform(-10, 10), random.uniform(-10, 10))
    B = (random.uniform(-10, 10), random.uniform(-10, 10))
    C = (random.uniform(-10, 10), random.uniform(-10, 10))

    # Reject nearly degenerate triangles
    area2 = abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]))
    if area2 < 2.0:
        return generate_sample(sample_id)

    P, (w1, w2, w3) = sample_interior_point(A, B, C)

    c = math.dist(A, B)
    a = math.dist(B, C)
    b = math.dist(C, A)

    d1 = math.dist(P, A)
    d2 = math.dist(P, B)
    d3 = math.dist(P, C)

    perimeter = a + b + c
    s = perimeter / 2.0
    area = math.sqrt(max(0.0, s * (s - a) * (s - b) * (s - c)))

    return {
        "id": sample_id,
        "d1": round(d1, 6),
        "d2": round(d2, 6),
        "d3": round(d3, 6),
        "side_a": round(a, 6),
        "side_b": round(b, 6),
        "side_c": round(c, 6),
        "perimeter": round(perimeter, 6),
        "area": round(area, 6),
        "barycentric_w1": round(w1, 6),
        "barycentric_w2": round(w2, 6),
        "barycentric_w3": round(w3, 6),
    }

def generate_dataset(num_samples: int, output_csv: str, output_json: str):
    samples: List[Dict[str, Any]] = [generate_sample(i) for i in range(1, num_samples + 1)]

    # Export JSON
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(samples, f, indent=2)

    # Export CSV
    if samples:
        keys = list(samples[0].keys())
        with open(output_csv, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(samples)

    print(f"Generated {num_samples} samples -> {output_csv} and {output_json}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--count", type=int, default=1000, help="Number of samples to generate")
    parser.add_argument("--csv", type=str, default="data/datasets/samples/triangles.csv")
    parser.add_argument("--json", type=str, default="data/datasets/samples/triangles.json")
    args = parser.parse_args()
    generate_dataset(args.count, args.csv, args.json)
