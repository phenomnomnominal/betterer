import { BettererTask, BettererTasks, BettererTasksState } from '@betterer/logger';
import { workerRequire, WorkerModule } from '@phenomnomnominal/worker-require';
import * as path from 'path';
import React, { FC } from 'react';

import { BettererCLIInitConfig } from '../types';

const createTestFile = workerRequire<WorkerModule<typeof import('./create-test-file')>>('./create-test-file');
const updatePackageJSON = workerRequire<WorkerModule<typeof import('./update-package-json')>>('./update-package-json');

export type InitProps = BettererCLIInitConfig & {
  cwd: string;
};

export const Init: FC<InitProps> = function Init({ cwd, config }) {
  return (
    <BettererTasks name="Initialising Betterer" statusMessage={statusMessage}>
      <BettererTask
        name="Create test file"
        runner={async (logger) => {
          await createTestFile.run(logger, path.resolve(cwd, config));
          createTestFile.destroy();
        }}
      />
      <BettererTask
        name="Update package.json"
        runner={async (logger) => {
          await updatePackageJSON.run(logger, cwd);
          updatePackageJSON.destroy();
        }}
      />
    </BettererTasks>
  );
};

function statusMessage(state: BettererTasksState): string {
  const { done, errors, running } = state;
  const runningStatus = running ? `${tasks(running)} running... ` : '';
  const doneStatus = done ? `${tasks(done)} done! ` : '';
  const errorStatus = errors ? `${tasks(errors)} errored! ` : '';
  return `${runningStatus}${doneStatus}${errorStatus}`;
}

function tasks(n: number): string {
  return `${n} ${n === 1 ? 'task' : 'tasks'}`;
}
