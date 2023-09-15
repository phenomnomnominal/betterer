import type { FC } from '@betterer/render';

import type { BettererReporterState } from '../../state/index.js';

import { React, memo } from '@betterer/render';

import { Suite } from '../suite/index.js';
import { WatchEnding } from './WatchEnding.js';
import { WatchFiles } from './WatchFiles.js';
import { WatchInstructions } from './WatchInstructions.js';
import { WatchStarting } from './WatchStarting.js';
import { useControls } from './useControls.js';

export const WatchReporter: FC<BettererReporterState> = memo(function WatchReporter(props) {
  const { context, contextSummary, done, suiteSummary } = props;
  const suite = props.suiteSummary || props.suite;

  const editing = useControls(context);

  if (contextSummary) {
    return <WatchEnding />;
  }

  if (suite) {
    return (
      <>
        <WatchFiles context={context} editField={editing} suite={suite} running={!suiteSummary} />
        <Suite context={context} suite={suite} suiteSummary={suiteSummary} done={done} />
        <WatchInstructions />
      </>
    );
  }

  return <WatchStarting context={context} editField={editing} />;
});
