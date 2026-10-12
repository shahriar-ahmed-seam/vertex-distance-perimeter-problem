package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"

	"github.com/shahriar/triangle-thm/engines/go/pkg/solver"
)

func main() {
	d1 := flag.Float64("d1", 3.0, "Distance PA")
	d2 := flag.Float64("d2", 4.0, "Distance PB")
	d3 := flag.Float64("d3", 5.0, "Distance PC")
	method := flag.String("method", "exact", "Solver method: exact, newton, neldermead")
	flag.Parse()

	switch *method {
	case "exact":
		side, perim, err := solver.SolveEquilateralExactClosedForm(*d1, *d2, *d3)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}
		out := map[string]interface{}{
			"method":    "exact_equilateral",
			"d1":        *d1,
			"d2":        *d2,
			"d3":        *d3,
			"side":      side,
			"perimeter": perim,
		}
		data, _ := json.MarshalIndent(out, "", "  ")
		fmt.Println(string(data))

	case "newton":
		res, err := solver.SolveNewtonEquilateral(*d1, *d2, *d3, 100, 1e-12)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}
		data, _ := json.MarshalIndent(res, "", "  ")
		fmt.Println(string(data))

	case "neldermead":
		res, err := solver.SolveNelderMeadEquilateral(*d1, *d2, *d3, 300, 1e-8)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}
		data, _ := json.MarshalIndent(res, "", "  ")
		fmt.Println(string(data))

	default:
		fmt.Fprintf(os.Stderr, "Unknown method: %s\n", *method)
		os.Exit(1)
	}
}
