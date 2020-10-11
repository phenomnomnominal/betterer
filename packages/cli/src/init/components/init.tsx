import { BettererLoggerTask } from '@betterer/logger';
import React, { FC } from 'react';
import { Box } from 'ink';
import * as path from 'path';

import { BettererCLIInitConfig } from '../../types';
import { createTestFile } from '../create-test-file';
import { updatePackageJSON } from '../update-package-json';

export type InitProps = BettererCLIInitConfig & {
  cwd: string;
};

export const Init: FC<InitProps> = function Init({ cwd, config }) {
  // infoΔ('initialising Betterer... ☀️');

  // try {
  // } catch (e) {
  //   logErrorΔ(e);
  //   throw e;
  // }
  // successΔ('initialised Betterer! ☀️');

  return (
    <Box flexDirection="column">
      <BettererLoggerTask context={createTestFile(path.resolve(cwd, config))} />
      <BettererLoggerTask context={updatePackageJSON(cwd)} />
    </Box>
  );
};
