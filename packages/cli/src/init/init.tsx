import { BettererTaskLogger, BettererTasksLogger } from '@betterer/tasks';
import { workerRequire, WorkerModule } from '@phenomnomnominal/worker-require';
import * as path from 'path';
import React, { FC, useCallback } from 'react';

const createTestFile = workerRequire<WorkerModule<typeof import('./create-test-file')>>('./create-test-file');
const updatePackageJSON = workerRequire<WorkerModule<typeof import('./update-package-json')>>('./update-package-json');

export type InitProps = {
  config: string;
  cwd: string;
  ts: boolean;
};

export const Init: FC<InitProps> = function Init({ cwd, config, ts }) {
  const runCreateTestFile = useCallback(
    async (logger) => {
      await createTestFile.run(logger, path.resolve(cwd, config), ts);
      createTestFile.destroy();
    },
    [createTestFile, cwd, config, ts]
  );
  const runUpdagePackageJSON = useCallback(
    async (logger) => {
      await updatePackageJSON.run(logger, cwd, ts);
      updatePackageJSON.destroy();
    },
    [updatePackageJSON, cwd, config, ts]
  );

  return (
    <BettererTasksLogger name="Initialising Betterer">
      <BettererTaskLogger name="Create test file" run={runCreateTestFile}></BettererTaskLogger>
      <BettererTaskLogger name="Update package.json" run={runUpdagePackageJSON}></BettererTaskLogger>
    </BettererTasksLogger>
  );
};
