/**
 * @public The return type of a **Betterer** constraint function. Used to indicate whether
 * the new result is `better`, `worse` or the `same` than the expected result.
 */
export enum BettererConstraintResult {
  better = 'better',
  same = 'same',
  worse = 'worse'
}
