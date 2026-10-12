/-
  The Vertex-Distance Perimeter Problem
  Basic Geometric Definitions and Triangle Properties in Lean 4
-/

structure Point2D where
  x : Float
  y : Float

def dist (p1 p2 : Point2D) : Float :=
  Float.sqrt ((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))

structure Triangle where
  a : Point2D
  b : Point2D
  c : Point2D

def perimeter (t : Triangle) : Float :=
  dist t.a t.b + dist t.b t.c + dist t.c t.a

def isEquilateral (t : Triangle) (tol : Float := 1e-6) : Bool :=
  let ab := dist t.a t.b
  let bc := dist t.b t.c
  let ca := dist t.c t.a
  (ab - bc).abs < tol && (bc - ca).abs < tol
