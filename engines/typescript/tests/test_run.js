import { solveEquilateralClosedForm, solveNewtonRaphson, solveNelderMead } from '../dist/index.js';
import assert from 'node:assert';

console.log('Testing TypeScript engine...');

// 1. Closed form
const closed = solveEquilateralClosedForm(3, 4, 5);
assert(closed.isValid, 'Closed form should be valid');
const expectedSide = Math.sqrt(25 + 12 * Math.sqrt(3));
const expectedPerim = 3 * expectedSide;
assert(Math.abs(closed.side - expectedSide) < 1e-9, `Side mismatch: ${closed.side} vs ${expectedSide}`);
assert(Math.abs(closed.perimeter - expectedPerim) < 1e-9, `Perimeter mismatch: ${closed.perimeter} vs ${expectedPerim}`);
console.log('✓ Closed form exact test passed');

// 2. Newton-Raphson
const newton = solveNewtonRaphson(3, 4, 5);
assert(newton.converged, 'Newton should converge');
assert(Math.abs(newton.perimeter - expectedPerim) < 1e-4, `Newton perim mismatch: ${newton.perimeter}`);
console.log('✓ Newton-Raphson test passed');

// 3. Nelder-Mead
const nm = solveNelderMead(3, 4, 5);
assert(Math.abs(nm.perimeter - expectedPerim) < 1e-2, `Nelder-Mead perim mismatch: ${nm.perimeter}`);
console.log('✓ Nelder-Mead test passed');

console.log('ALL TYPESCRIPT ENGINE TESTS PASSED!');
