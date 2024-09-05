import type { BettererLogger } from '@betterer/logger';
import type { FC } from '@betterer/render';
import type { CreateTestFileWorker, EnableAutomergeWorker, UpdatePackageJSONWorker } from './types.js';

import { Box, React, useCallback } from '@betterer/render';
import { BettererLogo, BettererTaskLogger, BettererTasksLogger } from '@betterer/tasks';
import { exposeToWorkerΔ, importWorkerΔ } from '@betterer/worker';

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
      const createTestFile: CreateTestFileWorker = await importWorkerΔ('./create-test-file.worker.js');
      try {
        await createTestFile.api.run(exposeToWorkerΔ(logger), cwd, configPath);
      } finally {
        await createTestFile.destroy();
      }
    },
    [cwd, configPath]
  );
  const runUpdatePackageJSON = useCallback(
    async (logger: BettererLogger) => {
      const updatePackageJSON: UpdatePackageJSONWorker = await importWorkerΔ('./update-package-json.worker.js');
      try {
        await updatePackageJSON.api.run(exposeToWorkerΔ(logger), cwd, ts);
      } finally {
        await updatePackageJSON.destroy();
      }
    },
    [cwd, ts]
  );
  const runEnableAutomerge = useCallback(async (logger: BettererLogger) => {
    const enableAutomerge: EnableAutomergeWorker = await importWorkerΔ('./enable-automerge.worker.js');
    try {
      await enableAutomerge.api.run(exposeToWorkerΔ(logger), cwd, resultsPath);
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
