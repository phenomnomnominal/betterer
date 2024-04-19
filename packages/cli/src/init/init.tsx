import type { BettererLogger } from '@betterer/logger';
import type { FC } from '@betterer/render';
import type { CreateTestFileWorker, EnableAutomergeWorker, UpdatePackageJSONWorker } from './types.js';

import { Box, React, useCallback } from '@betterer/render';
import { BettererLogo, BettererTaskLogger, BettererTasksLogger } from '@betterer/tasks';
import { exposeToWorker__, importWorker__ } from '@betterer/worker';

export interface InitProps {
  automerge: boolean;
  configPath: string;
  cwd: string;
  logo: boolean;
  resultsPath: string;
}

export const Init: FC<InitProps> = function Init({ automerge, cwd, configPath, logo, resultsPath }) {
  const runCreateTestFile = useCallback(
    async (logger: BettererLogger) => {
      const createTestFile: CreateTestFileWorker = await importWorker__('./create-test-file.worker.js');
      try {
        await createTestFile.api.run(exposeToWorker__(logger), cwd, configPath);
      } finally {
        await createTestFile.destroy();
      }
    },
    [cwd, configPath]
  );
  const runUpdatePackageJSON = useCallback(
    async (logger: BettererLogger) => {
      const updatePackageJSON: UpdatePackageJSONWorker = await importWorker__('./update-package-json.worker.js');
      try {
        await updatePackageJSON.api.run(exposeToWorker__(logger), cwd);
      } finally {
        await updatePackageJSON.destroy();
      }
    },
    [cwd]
  );
  const runEnableAutomerge = useCallback(async (logger: BettererLogger) => {
    const enableAutomerge: EnableAutomergeWorker = await importWorker__('./enable-automerge.worker.js');
    try {
      await enableAutomerge.api.run(exposeToWorker__(logger), cwd, resultsPath);
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
