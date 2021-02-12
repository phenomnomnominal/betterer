import React, { FC, memo, useState } from 'react';

import {
  BettererContext,
  BettererFilePaths,
  BettererRuns,
  BettererSummaries,
  BettererSummary
} from '@betterer/betterer';
import { useApp, useInput, useStdin } from 'ink';

import { BettererReporterApp } from '../../types';
import { ConfigEditField } from '../config';

import { WatchEnding } from './WatchEnding';
import { WatchRunning } from './WatchRunning';
import { WatchStarting } from './WatchStarting';
import { WatchWatching } from './WatchWatching';

export type WatchReporterProps = {
  context: BettererContext;
  filePaths?: BettererFilePaths;
  runs?: BettererRuns;
  summary?: BettererSummary;
  summaries?: BettererSummaries;
};

export const WatchReporter: FC<WatchReporterProps> = memo(function WatchReporter(props) {
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

  const { context, runs, summaries, summary } = props;
  const filePaths = props.filePaths || [];

  if (summaries) {
    return <WatchEnding />;
  } else if (runs && summary) {
    return (
      <WatchWatching context={context} editField={editField} filePaths={filePaths} runs={runs} summary={summary} />
    );
  } else if (runs) {
    return <WatchRunning context={context} editField={editField} filePaths={filePaths} runs={runs} />;
  } else {
    return <WatchStarting context={context} editField={editField} />;
  }
});

function quit(app: BettererReporterApp): void {
  app.exit();
  process.exitCode = 0;
  // Send SIGINT so the file watcher terminates:
  process.kill(process.pid, 'SIGINT');
}
