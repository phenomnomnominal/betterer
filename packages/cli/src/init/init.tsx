import { BettererTasksLogger, BettererTasksState } from '@betterer/tasks';
import { workerRequire, WorkerModule } from '@phenomnomnominal/worker-require';
import * as path from 'path';
import React, { FC } from 'react';

const createTestFile = workerRequire<WorkerModule<typeof import('./create-test-file')>>('./create-test-file');
const updatePackageJSON = workerRequire<WorkerModule<typeof import('./update-package-json')>>('./update-package-json');

export type InitProps = {
  config: string;
  cwd: string;
  ts: boolean;
};

export const Init: FC<InitProps> = function Init({ cwd, config, ts }) {
  return (
    <BettererTasksLogger
      name="Initialising Betterer"
      update={update}
      tasks={[
        {
          name: 'Create test file',
          run: async (logger) => {
            await createTestFile.run(logger, path.resolve(cwd, config), ts);
            createTestFile.destroy();
          }
        },
        {
          name: 'Update package.json',
          run: async (logger) => {
            await updatePackageJSON.run(logger, cwd, ts);
            updatePackageJSON.destroy();
          }
        }
      ]}
    />
  );
};

function update(state: BettererTasksState): string {
  const { done, errors, running } = state;
  const runningStatus = running ? `${tasks(running)} running... ` : '';
  const doneStatus = done ? `${tasks(done)} done! ` : '';
  const errorStatus = errors ? `${tasks(errors)} errored! ` : '';
  return `${runningStatus}${doneStatus}${errorStatus}`;
}

function tasks(n: number): string {
  return `${n} ${n === 1 ? 'task' : 'tasks'}`;
}
