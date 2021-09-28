/**
 * {@link https://www.npmjs.com/package/@betterer/constraints | `@betterer/constraints` }
 *
 * Constraint helpers for writing {@link https://github.com/phenomnomnominal/betterer | **Betterer**} tests.
 *
 * A `constraint` function is responsible for comparing two **Betterer** test results and determining if the newer result
 * is `better`, `worse` or the `same`.
 *
 * @packageDocumentation
 */

export { BettererConstraintResult } from './constraint-result';

export { bigger } from './bigger';
export { smaller } from './smaller';
