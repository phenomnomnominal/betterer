import type { FC } from '@betterer/render';

import type { BettererReporterState } from '../../state/index.js';

import { React, memo } from '@betterer/render';

import { Suite } from '../suite/index.js';
import { DefaultFiles } from './DefaultFiles.js';

export const DefaultReporter: FC<BettererReporterState> = memo(function DefaultReporter(props: BettererReporterState) {
  const { context, done, suiteSummary } = props;
  const suite = props.suite ?? props.suiteSummary;

  if (!suite) {
    return null;
  }

  return (
    <>
      <DefaultFiles suite={suite} running={!suiteSummary} />
      <Suite context={context} suite={suite} suiteSummary={suiteSummary} done={done} />
    </>
  );
});
