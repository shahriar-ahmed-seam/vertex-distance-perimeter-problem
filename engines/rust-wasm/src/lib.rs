pub mod geometry;
pub mod solver;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn solve_equilateral_exact_wasm(d1: f64, d2: f64, d3: f64) -> Result<String, JsValue> {
    match solver::solve_exact_equilateral(d1, d2, d3) {
        Ok((side, perimeter)) => {
            let res = serde_json::json!({
                "valid": true,
                "side": side,
                "perimeter": perimeter
            });
            Ok(res.to_string())
        }
        Err(e) => Err(JsValue::from_str(&e)),
    }
}

#[wasm_bindgen]
pub fn solve_newton_wasm(d1: f64, d2: f64, d3: f64, max_iter: u32, tol: f64) -> Result<String, JsValue> {
    let res = solver::solve_newton(d1, d2, d3, max_iter, tol);
    serde_json::to_string(&res).map_err(|e| JsValue::from_str(&e.to_string()))
}
