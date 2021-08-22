import React, { FC, useCallback } from 'react';

import { BettererLogo, BettererTaskLogger, BettererTasksLogger, BettererTasksState } from '@betterer/tasks';
import { workerRequire } from '@phenomnomnominal/worker-require';
import { Box } from 'ink';
import * as path from 'path';

import { CreateTestFileWorker, UpdatePackageJSONWorker } from './types';

export type InitProps = {
  config: string;
  cwd: string;
  ts: boolean;
};

export const Init: FC<InitProps> = function Init({ cwd, config, ts }) {
  const runCreateTestFile = useCallback(
    async (logger) => {
      const createTestFile = workerRequire<CreateTestFileWorker>('./create-test-file');
      try {
        await createTestFile.run(logger, path.resolve(cwd, config), ts);
      } finally {
        await createTestFile.destroy();
      }
    },
    [cwd, config, ts]
  );
  const runUpdagePackageJSON = useCallback(
    async (logger) => {
      const updatePackageJSON = workerRequire<UpdatePackageJSONWorker>('./update-package-json');
      try {
        await updatePackageJSON.run(logger, cwd, ts);
      } finally {
        await updatePackageJSON.destroy();
      }
    },
    [cwd, config, ts]
  );

  return (
    <Box flexDirection="column">
      <BettererLogo />
      <BettererTasksLogger name="Initialising Betterer" update={update}>
        <BettererTaskLogger name="Create test file" run={runCreateTestFile} />
        <BettererTaskLogger name="Update package.json" run={runUpdagePackageJSON} />
      </BettererTasksLogger>
    </Box>
  );
};

function update(state: BettererTasksState): string {
  const { done, errors, running } = state;
  const runningStatus = running ? `${tasks(running)} running... ` : '';
  const doneStatus = done ? `${tasks(done)} done! ` : '';
  const errorStatus = errors ? `${tasks(errors)} errored! ` : '';
  return `${runningStatus}${doneStatus}${errorStatus}`;
}

function tasks(n: number): string {
  return `${n} ${n === 1 ? 'task' : 'tasks'}`;
}
