import type { Linter } from 'eslint';

/**
 * @public The {@link @betterer/eslint#eslint | `eslint`} test factory takes a map of rule names
 * and the rule's configuration.
 *
 * The configuration options are defined by each rule, but will be either a {@link https://eslint.org/docs/user-guide/configuring/rules#configuring-rules | `RuleLevel` }
 * or {@link https://eslint.org/docs/user-guide/configuring/rules#configuring-rules | `RuleLevelAndOptions`}.
 */
export type BettererESLintRulesConfig = Record<string, Linter.RuleLevel | Linter.RuleLevelAndOptions>;
