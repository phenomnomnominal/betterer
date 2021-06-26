import React, { FC, useCallback } from 'react';

import { BettererConfigPaths } from '@betterer/betterer';
import { BettererTaskLogger, BettererTasksLogger } from '@betterer/tasks';
import { workerRequire, WorkerModule } from '@phenomnomnominal/worker-require';
import path from 'path';

const upgradeConfigFiles = workerRequire<WorkerModule<typeof import('./upgrade-config-files')>>(
  './upgrade-config-files'
);

export type UpgradeProps = {
  configPaths: BettererConfigPaths;
  cwd: string;
};

export const Upgrade: FC<UpgradeProps> = function Upgrade({ configPaths, cwd }) {
  const runUpgradeConfigFiles = useCallback(
    async (logger) => {
      const absoluteConfigPaths = configPaths.map((configPath) => path.resolve(cwd, configPath));
      await upgradeConfigFiles.run(logger, absoluteConfigPaths);
      upgradeConfigFiles.destroy();
    },
    [upgradeConfigFiles, configPaths, cwd]
  );
  return (
    <BettererTasksLogger name="Upgrading Betterer">
      <BettererTaskLogger name="Upgrading config files" run={runUpgradeConfigFiles}></BettererTaskLogger>
    </BettererTasksLogger>
  );
};
