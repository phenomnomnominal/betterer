import type {
  BettererCoverageDiff,
  BettererCoverageIssues,
  BettererCoverageTest,
  BettererCoverageTestFunction
} from './types.js';

import { BettererResolverTest } from '@betterer/betterer';

import { constraint } from './constraint.js';
import { differ } from './differ.js';
import { goal } from './goal.js';
import { deserialise, serialise } from './serialiser.js';

export class BettererCoverageTestΩ
  extends BettererResolverTest<BettererCoverageIssues, BettererCoverageIssues, BettererCoverageDiff>
  implements BettererCoverageTest
{
  constructor(test: BettererCoverageTestFunction, coverageSummaryPath = './coverage/coverage-summary.json') {
    super({
      test: async () => {
        return await test(coverageSummaryPath, this.resolver);
      },
      constraint,
      differ,
      goal,
      serialiser: {
        serialise,
        deserialise
      }
    });
  }
}
