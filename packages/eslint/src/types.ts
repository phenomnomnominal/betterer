import { Linter } from 'eslint';

/**
 * @public The {@link eslint | `eslint`} test factory takes a map of rule names and the rule's
 * configuration.
 *
 * The configuration options are defined by each rule, but will be either a {@link eslint#Linter.RuleLevel | `RuleLevel` }
 * or {@link eslint#Linter.RuleLevelAndOptions | `RuleLevelAndOptions`}.
 */
export type BettererESLintRulesConfig = Record<string, Linter.RuleLevel | Linter.RuleLevelAndOptions>;
