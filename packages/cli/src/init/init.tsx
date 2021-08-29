import React, { FC, useCallback } from 'react';

import { BettererLogo, BettererTaskLogger, BettererTasksLogger } from '@betterer/tasks';
import { workerRequire } from '@phenomnomnominal/worker-require';
import { Box } from 'ink';

import { CreateTestFileWorker, EnableAutomergeWorker, UpdatePackageJSONWorker } from './types';

export type InitProps = {
  automerge: boolean;
  configPath: string;
  cwd: string;
  resultsPath: string;
  ts: boolean;
};

export const Init: FC<InitProps> = function Init({ automerge, cwd, configPath, resultsPath, ts }) {
  const runCreateTestFile = useCallback(
    async (logger) => {
      const createTestFile = workerRequire<CreateTestFileWorker>('./create-test-file');
      try {
        await createTestFile.run(logger, cwd, configPath, ts);
      } finally {
        await createTestFile.destroy();
      }
    },
    [cwd, configPath, ts]
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
    [cwd, ts]
  );
  const runEnableAutomerge = useCallback(async (logger) => {
    const enableAutomerge = workerRequire<EnableAutomergeWorker>('./enable-automerge');
    try {
      await enableAutomerge.run(logger, cwd, resultsPath);
    } finally {
      await enableAutomerge.destroy();
    }
  }, []);

  return (
    <Box flexDirection="column">
      <BettererLogo />
      <BettererTasksLogger name="Initialising Betterer">
        <BettererTaskLogger name="Create test file" run={runCreateTestFile} />
        <BettererTaskLogger name="Update package.json" run={runUpdagePackageJSON} />
        {automerge && <BettererTaskLogger name="Enable automerge" run={runEnableAutomerge} />}
      </BettererTasksLogger>
    </Box>
  );
};
