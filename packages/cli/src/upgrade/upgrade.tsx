import React, { FC, useCallback } from 'react';

import { BettererConfigPaths } from '@betterer/betterer';
import { BettererLogo, BettererTaskLogger, BettererTasksLogger } from '@betterer/tasks';
import { workerRequire } from '@phenomnomnominal/worker-require';
import { Box } from 'ink';
import * as path from 'path';

import { UpgradeConfigFileWorker } from './types';

export type UpgradeProps = {
  configPaths: BettererConfigPaths;
  cwd: string;
  save: boolean;
};

export const Upgrade: FC<UpgradeProps> = function Upgrade({ configPaths, cwd, save }) {
  return (
    <Box flexDirection="column">
      <BettererLogo />
      <BettererTasksLogger name="Upgrading Betterer">
        {configPaths.map((configPath) => {
          const runUpgradeConfigFile = useCallback(
            async (logger) => {
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
