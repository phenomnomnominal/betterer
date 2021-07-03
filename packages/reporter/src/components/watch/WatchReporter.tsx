import React, { FC, memo, useState } from 'react';

import { useApp, useInput, useStdin } from 'ink';

import { BettererReporterApp } from '../../types';
import { ConfigEditField } from '../config';
import { Runs, SuiteSummary } from '../runs';

import { WatchEnding } from './WatchEnding';
import { WatchFiles } from './WatchFiles';
import { WatchInstructions } from './WatchInstructions';
import { WatchStarting } from './WatchStarting';
import { BettererReporterState } from '../../state';

export const WatchReporter: FC<BettererReporterState> = memo(function WatchReporter(props) {
  const app = useApp();

  const { isRawModeSupported } = useStdin();

  const [editField, setEditField] = useState<ConfigEditField>(null);

  const canEdit = isRawModeSupported;
  const useEdit = canEdit ? useInput : () => void 0;

  useEdit((input, key) => {
    if (key.return) {
      setEditField(null);
      return;
    }

    if (key.escape) {
      quit(app);
      return;
    }

    if (editField != null) {
      return;
    }

    // Don't exit on 'q' if the user is editing filters or ignores:
    if (input === 'q') {
      quit(app);
    }

    if (input === 'f') {
      setEditField('filters');
    }
    if (input === 'i') {
      setEditField('ignores');
    }
  });

  const { context, runs, runSummaries, suiteSummaries, suiteSummary } = props;
  const filePaths = props.filePaths || [];

  if (suiteSummaries) {
    return <WatchEnding />;
  }
  if (runs || runSummaries) {
    return (
      <>
        <WatchFiles context={context} editField={editField} filePaths={filePaths} running={!runSummaries} />
        <Runs runs={runs} runSummaries={runSummaries} />
        {suiteSummary && <SuiteSummary context={context} summary={suiteSummary} />}
        <WatchInstructions />
      </>
    );
  }
  return <WatchStarting context={context} editField={editField} />;
});

function quit(app: BettererReporterApp): void {
  app.exit();
  process.exitCode = 0;
  // Send SIGINT so the file watcher terminates:
  process.kill(process.pid, 'SIGINT');
}
