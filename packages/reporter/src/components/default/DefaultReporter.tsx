import { React, FC, memo } from '@betterer/render';

import { BettererReporterState } from '../../state';
import { Suite } from '../suite';
import { DefaultFiles } from './DefaultFiles';

export const DefaultReporter: FC<BettererReporterState> = memo(function DefaultReporter(props: BettererReporterState) {
  const { context, done, suiteSummary } = props;
  const suite = props.suite || props.suiteSummary;

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
