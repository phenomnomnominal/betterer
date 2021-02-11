import React, { FC } from 'react';

import { BettererContext, BettererFilePaths, BettererRuns } from '@betterer/betterer';
import { Text } from 'ink';

import { filesChecking } from '../../messages';
import { Config, ConfigEditField } from '../config';
import { Runs } from '../runs';

export type WatchRunningProps = {
  context: BettererContext;
  editField: ConfigEditField;
  filePaths: BettererFilePaths;
  runs: BettererRuns;
};

export const WatchRunning: FC<WatchRunningProps> = function WatchRunning(props) {
  const { context, editField, filePaths, runs } = props;

  return (
    <>
      {<Config context={context} editField={editField} />}
      {filePaths.length ? <Text>{filesChecking(filePaths.length)}</Text> : null}
      <Runs runs={runs} />
    </>
  );
};
