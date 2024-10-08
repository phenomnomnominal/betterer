import type { FC } from '@betterer/render';

import { React, memo } from '@betterer/render';

import { useReporterState } from '../../state/index.js';
import { Suite, SuiteSummary } from '../suite/index.js';
import { WatchEnding } from './WatchEnding.js';
import { WatchFiles } from './WatchFiles.js';
import { WatchInstructions } from './WatchInstructions.js';
import { WatchStarting } from './WatchStarting.js';
import { useControls } from './useControls.js';

export const WatchReporter: FC = memo(function WatchReporter() {
  const [{ context, contextSummary, suite, suiteSummary }] = useReporterState();

  const editing = useControls(context);

  if (contextSummary) {
    return <WatchEnding />;
  }

  if (!suite) {
    return <WatchStarting context={context} editField={editing} />;
  }

  return (
    <>
      <WatchFiles context={context} editField={editing} filePaths={suite.filePaths} running={!suiteSummary} />
      {!suiteSummary && <Suite suite={suite} />}
      {suiteSummary && <SuiteSummary context={context} suiteSummary={suiteSummary} />}
      <WatchInstructions />
    </>
  );
});
