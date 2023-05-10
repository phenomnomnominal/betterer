import { Box, React, FC, useCallback } from '@betterer/render';
import { BettererLogo, BettererTaskLogger, BettererTasksLogger } from '@betterer/tasks';
import { workerRequire } from '@phenomnomnominal/worker-require';

import { CreateTestFileWorker, EnableAutomergeWorker, UpdatePackageJSONWorker } from './types';
import { BettererLogger } from '@betterer/logger';

export interface InitProps {
  automerge: boolean;
  configPath: string;
  cwd: string;
  logo: boolean;
  resultsPath: string;
  ts: boolean;
}

export const Init: FC<InitProps> = function Init({ automerge, cwd, configPath, logo, resultsPath, ts }) {
  const runCreateTestFile = useCallback(
    async (logger: BettererLogger) => {
      const createTestFile = workerRequire<CreateTestFileWorker>('./create-test-file');
      try {
        await createTestFile.run(logger, cwd, configPath, ts);
      } finally {
        await createTestFile.destroy();
      }
    },
    [cwd, configPath, ts]
  );
  const runUpdatePackageJSON = useCallback(
    async (logger: BettererLogger) => {
      const updatePackageJSON = workerRequire<UpdatePackageJSONWorker>('./update-package-json');
      try {
        await updatePackageJSON.run(logger, cwd, ts);
      } finally {
        await updatePackageJSON.destroy();
      }
    },
    [cwd, ts]
  );
  const runEnableAutomerge = useCallback(async (logger: BettererLogger) => {
    const enableAutomerge = workerRequire<EnableAutomergeWorker>('./enable-automerge');
    try {
      await enableAutomerge.run(logger, cwd, resultsPath);
    } finally {
      await enableAutomerge.destroy();
    }
  }, []);

  return (
    <Box flexDirection="column">
      {logo && <BettererLogo />}
      <BettererTasksLogger name="Initialising Betterer">
        <BettererTaskLogger name="Create test file" task={runCreateTestFile} />
        <BettererTaskLogger name="Update package.json" task={runUpdatePackageJSON} />
        {automerge && <BettererTaskLogger name="Enable automerge" task={runEnableAutomerge} />}
      </BettererTasksLogger>
    </Box>
  );
};
