#[derive(Debug, Clone, Copy)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

impl Point {
    pub fn distance(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
}

pub fn sides_from_polar(d1: f64, d2: f64, d3: f64, alpha: f64, beta: f64) -> (f64, f64, f64) {
    let gamma = 2.0 * std::f64::consts::PI - (alpha + beta);
    let c = (d1 * d1 + d2 * d2 - 2.0 * d1 * d2 * alpha.cos()).max(0.0).sqrt();
    let a = (d2 * d2 + d3 * d3 - 2.0 * d2 * d3 * beta.cos()).max(0.0).sqrt();
    let b = (d3 * d3 + d1 * d1 - 2.0 * d3 * d1 * gamma.cos()).max(0.0).sqrt();
    (a, b, c)
}

pub fn heron_area(a: f64, b: f64, c: f64) -> f64 {
    let s = (a + b + c) / 2.0;
    let val = s * (s - a) * (s - b) * (s - c);
    if val > 0.0 {
        val.sqrt()
    } else {
        0.0
    }
}
