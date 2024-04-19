import type { BettererConfigPaths } from '@betterer/betterer';
import type { BettererLogger } from '@betterer/logger';
import type { FC } from '@betterer/render';
import type { UpgradeConfigFileWorker } from './types.js';

import { React, Box, useCallback } from '@betterer/render';
import { BettererLogo, BettererTaskLogger, BettererTasksLogger } from '@betterer/tasks';
import { exposeToWorker__, importWorker__ } from '@betterer/worker';
import path from 'node:path';

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
              const upgradeConfigFile: UpgradeConfigFileWorker = await importWorker__(
                './upgrade-config-file.worker.js'
              );
              try {
                await upgradeConfigFile.api.run(exposeToWorker__(logger), path.resolve(cwd, configPath), save);
              } finally {
                await upgradeConfigFile.destroy();
              }
            },
            [cwd, configPath]
          );
          return <BettererTaskLogger key={configPath} name={`Upgrading "${configPath}"`} task={runUpgradeConfigFile} />;
        })}
      </BettererTasksLogger>
    </Box>
  );
};
