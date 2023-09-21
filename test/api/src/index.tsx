import type { BettererLogger } from '@betterer/logger';
import type { FC } from '@betterer/render';
import type { BettererTasksState } from '@betterer/tasks';

import { React, getRenderOptions, render, useCallback } from '@betterer/render';
import { BettererTaskLogger, BettererTasksLogger } from '@betterer/tasks';
import { exposeToWorker__, importWorker__ } from '@betterer/worker';
import type { TestPackageAPIWorker } from './types.js';

interface APITestProps {
  packageNames: Array<string>;
}

export const APITest: FC<APITestProps> = function APITest({ packageNames }) {
  return (
    <BettererTasksLogger name="Test Package APIs" update={update}>
      {packageNames.map((packageName) => {
        const task = useCallback(
          async (logger: BettererLogger) => {
            const worker: TestPackageAPIWorker = importWorker__('./test-package-api.worker.js');
            try {
              return await worker.api.run(exposeToWorker__(logger), packageName);
            } finally {
              await worker.destroy();
            }
          },
          [packageName, exposeToWorker__]
        );
        return <BettererTaskLogger key={packageName} name={packageName} task={task} />;
      })}
    </BettererTasksLogger>
  );
};

function update(state: BettererTasksState): string {
  const { done, errors, running } = state;
  const runningStatus = running ? `${tests(running)} running... ` : '';
  const doneStatus = done ? `${tests(done)} done! ` : '';
  const errorStatus = errors ? `${tests(errors)} errored! ` : '';
  return `${runningStatus}${doneStatus}${errorStatus}`;
}

function tests(n: number): string {
  return `${n} ${n === 1 ? 'test' : 'tests'}`;
}

void (async () => {
  const worker: TestPackageAPIWorker = importWorker__('./test-package-api.worker.js');
  const packageNames = await worker.api.getPackages();
  const test = render(<APITest packageNames={packageNames} />, getRenderOptions(process.env.NODE_ENV));
  await worker.destroy();
  await test.waitUntilExit();
})();
