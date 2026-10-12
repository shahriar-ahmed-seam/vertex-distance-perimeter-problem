/-
  The Vertex-Distance Perimeter Problem
  Equilateral Closed Form Formulation in Lean 4
-/

import TriangleThm.Basic

/--
  Cayley-Menger polynomial for equilateral triangle of side s
  given interior point distances d1, d2, d3:
  3(s^4 + d1^4 + d2^4 + d3^4) - (s^2 + d1^2 + d2^2 + d3^2)^2 = 0
-/
def cayleyMengerEquilateralRes (s d1 d2 d3 : Float) : Float :=
  let s2 := s * s
  let d1Sq := d1 * d1
  let d2Sq := d2 * d2
  let d3Sq := d3 * d3
  let sumSq := s2 + d1Sq + d2Sq + d3Sq
  let quadSq := s2 * s2 + d1Sq * d1Sq + d2Sq * d2Sq + d3Sq * d3Sq
  3.0 * quadSq - sumSq * sumSq
