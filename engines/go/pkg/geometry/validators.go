package geometry

// CheckTriangleInequality verifies whether a, b, c can form a non-degenerate triangle.
func CheckTriangleInequality(a, b, c, tol float64) bool {
	if a <= 0 || b <= 0 || c <= 0 {
		return false
	}
	return (a+b > c+tol) && (b+c > a+tol) && (c+a > b+tol)
}
