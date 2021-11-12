/**
 * @public The return type of a **Betterer** constraint function. Used to indicate whether
 * the new result is `better`, `worse` or the `same` than the expected result.
 */
export enum BettererConstraintResult {
  /**
   * The new test result is better than the expected result.
   */
  better = 'better',
  /**
   * The new test result is the same as the expected result.
   */
  same = 'same',
  /**
   * The new test result is worse than the expected result.
   */
  worse = 'worse'
}
