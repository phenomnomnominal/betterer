import { BettererConfigPaths } from '@betterer/betterer';
import { React, Box, FC, useCallback } from '@betterer/render';
import { BettererLogo, BettererTaskLogger, BettererTasksLogger } from '@betterer/tasks';
import { workerRequire } from '@phenomnomnominal/worker-require';
import path from 'node:path';

import { UpgradeConfigFileWorker } from './types';
import { BettererLogger } from '@betterer/logger';

export interface UpgradeProps {
  configPaths: BettererConfigPaths;
  cwd: string;
  logo: boolean;
  save: boolean;
}

export const Upgrade: FC<UpgradeProps> = function Upgrade({ configPaths, cwd, logo, save }) {
  return (
    <Box flexDirection="column">
      {logo && <BettererLogo />}
      <BettererTasksLogger name="Upgrading Betterer">
        {configPaths.map((configPath) => {
          const runUpgradeConfigFile = useCallback(
            async (logger: BettererLogger) => {
              const upgradeConfigFile = workerRequire<UpgradeConfigFileWorker>('./upgrade-config-file');
              try {
                await upgradeConfigFile.run(logger, path.resolve(cwd, configPath), save);
              } finally {
                await upgradeConfigFile.destroy();
              }
            },
            [cwd, configPath]
          );
          return (
            <BettererTaskLogger
              key={configPath}
              name={`Upgrading "${configPath}"`}
              task={runUpgradeConfigFile}
            ></BettererTaskLogger>
          );
        })}
      </BettererTasksLogger>
    </Box>
  );
};
