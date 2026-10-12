use serde::{Deserialize, Serialize};
use crate::geometry::{sides_from_polar, heron_area};

#[derive(Debug, Serialize, Deserialize)]
pub struct WasmSolveResult {
    pub converged: bool,
    pub iterations: u32,
    pub alpha: f64,
    pub beta: f64,
    pub gamma: f64,
    pub side_a: f64,
    pub side_b: f64,
    pub side_c: f64,
    pub perimeter: f64,
    pub area: f64,
}

pub fn solve_exact_equilateral(d1: f64, d2: f64, d3: f64) -> Result<(f64, f64), String> {
    if d1 <= 0.0 || d2 <= 0.0 || d3 <= 0.0 {
        return Err("Distances must be positive".to_string());
    }

    let d1_sq = d1 * d1;
    let d2_sq = d2 * d2;
    let d3_sq = d3 * d3;

    let sum_sq = d1_sq + d2_sq + d3_sq;
    let quad_sq = d1_sq * d1_sq + d2_sq * d2_sq + d3_sq * d3_sq;

    let disc = 12.0 * sum_sq * sum_sq - 24.0 * quad_sq;
    if disc < 0.0 {
        return Err("Negative discriminant".to_string());
    }

    let u = (2.0 * sum_sq + disc.sqrt()) / 4.0;
    if u <= 0.0 {
        return Err("Negative side squared".to_string());
    }

    let side = u.sqrt();
    let perimeter = 3.0 * side;
    Ok((side, perimeter))
}

pub fn solve_newton(d1: f64, d2: f64, d3: f64, max_iter: u32, tol: f64) -> WasmSolveResult {
    let mut alpha = 2.0 * std::f64::consts::PI / 3.0;
    let mut beta = 2.0 * std::f64::consts::PI / 3.0;
    let mut it = 0;
    let mut converged = false;

    while it < max_iter {
        it += 1;
        let cos_a = alpha.cos();
        let cos_b = beta.cos();
        let cos_g = (alpha + beta).cos();

        let sin_a = alpha.sin();
        let sin_b = beta.sin();
        let sin_g = (alpha + beta).sin();

        let c2 = d1 * d1 + d2 * d2 - 2.0 * d1 * d2 * cos_a;
        let a2 = d2 * d2 + d3 * d3 - 2.0 * d2 * d3 * cos_b;
        let b2 = d3 * d3 + d1 * d1 - 2.0 * d3 * d1 * cos_g;

        let f1 = a2 - b2;
        let f2 = b2 - c2;
        let res_norm = (f1 * f1 + f2 * f2).sqrt();

        if res_norm < tol {
            converged = true;
            break;
        }

        let j11 = -2.0 * d3 * d1 * sin_g;
        let j12 = 2.0 * d2 * d3 * sin_b - 2.0 * d3 * d1 * sin_g;
        let j21 = 2.0 * d3 * d1 * sin_g - 2.0 * d1 * d2 * sin_a;
        let j22 = 2.0 * d3 * d1 * sin_g;

        let det = j11 * j22 - j12 * j21;
        if det.abs() < 1e-14 {
            alpha += 0.01;
            beta += 0.01;
            continue;
        }

        let d_alpha = -(j22 * f1 - j12 * f2) / det;
        let d_beta = -(-j21 * f1 + j11 * f2) / det;

        alpha += d_alpha;
        beta += d_beta;

        alpha = alpha.clamp(0.01, std::f64::consts::PI - 0.01);
        beta = beta.clamp(0.01, std::f64::consts::PI - 0.01);
    }

    let (a, b, c) = sides_from_polar(d1, d2, d3, alpha, beta);
    let perimeter = a + b + c;
    let area = heron_area(a, b, c);

    WasmSolveResult {
        converged,
        iterations: it,
        alpha,
        beta,
        gamma: 2.0 * std::f64::consts::PI - (alpha + beta),
        side_a: a,
        side_b: b,
        side_c: c,
        perimeter,
        area,
    }
}
