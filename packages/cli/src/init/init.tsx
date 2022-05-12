import { Box, React, FC, useCallback } from '@betterer/render';
import { BettererLogo, BettererTaskLogger, BettererTasksLogger } from '@betterer/tasks';
import { workerRequire } from '@phenomnomnominal/worker-require';

import { CreateTestFileWorker, EnableAutomergeWorker, UpdatePackageJSONWorker } from './types';

export interface InitProps {
  automerge: boolean;
  configPath: string;
  cwd: string;
  resultsPath: string;
  ts: boolean;
}

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
        <BettererTaskLogger name="Create test file" task={runCreateTestFile} />
        <BettererTaskLogger name="Update package.json" task={runUpdagePackageJSON} />
        {automerge && <BettererTaskLogger name="Enable automerge" task={runEnableAutomerge} />}
      </BettererTasksLogger>
    </Box>
  );
};
