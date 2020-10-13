import { BettererTask, BettererTasks } from '@betterer/logger';
import React, { FC } from 'react';
import * as path from 'path';

import { BettererCLIInitConfig } from '../types';
import { createTestFile } from './create-test-file';
import { updatePackageJSON } from './update-package-json';

export type InitProps = BettererCLIInitConfig & {
  cwd: string;
};

export const Init: FC<InitProps> = function Init({ cwd, config }) {
  return (
    <BettererTasks name="Initialising Betterer">
      <BettererTask context={createTestFile(path.resolve(cwd, config))} />
      <BettererTask context={updatePackageJSON(cwd)} />
    </BettererTasks>
  );
};
