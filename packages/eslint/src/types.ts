import { Linter } from 'eslint';

/**
 * The {@link eslint | `eslint`} test takes a map of rule names and the rule's configuration.
 *
 * The configuration options are defined by each rule, but will be either a {@link Linter.RuleLevel | `RuleLevel` } or {@link Linter.RuleLevelAndOptions | `RuleLevelAndOptions`}.
 *
 * @public
 */
export type BettererESLintRulesConfig = Record<string, Linter.RuleLevel | Linter.RuleLevelAndOptions>;
