import type { FC } from '@betterer/render';

import { React, memo } from '@betterer/render';

import { useReporterState } from '../../state/index.js';
import { Suite } from '../suite/index.js';
import { WatchEnding } from './WatchEnding.js';
import { WatchFiles } from './WatchFiles.js';
import { WatchInstructions } from './WatchInstructions.js';
import { WatchStarting } from './WatchStarting.js';
import { useControls } from './useControls.js';

export const WatchReporter: FC = memo(function WatchReporter() {
  const state = useReporterState();
  const { context, contextSummary, suiteSummary } = state;
  const suite = suiteSummary ?? state.suite;

  const editing = useControls(context);

  if (contextSummary) {
    return <WatchEnding />;
  }

  if (suite) {
    return (
      <>
        <WatchFiles context={context} editField={editing} filePaths={suite.filePaths} running={!suiteSummary} />
        <Suite context={context} suite={suite} suiteSummary={suiteSummary} />
        <WatchInstructions />
      </>
    );
  }

  return <WatchStarting context={context} editField={editing} />;
});
