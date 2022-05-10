import { BettererLogger } from '@betterer/logger';
import { React, FC, render, useCallback } from '@betterer/render';
import { BettererTaskLogger, BettererTasksLogger, BettererTasksState } from '@betterer/tasks';
import { createWorkerRequire } from '@phenomnomnominal/worker-require';

import { TestPackageAPIWorker } from './types';

const testPackageApi = createWorkerRequire<TestPackageAPIWorker>('./test-package-api', { cache: false });

interface APITestProps {
  packageNames: Array<string>;
}

export const APITest: FC<APITestProps> = function APITest({ packageNames }) {
  return (
    <BettererTasksLogger name="Test Package APIs" update={update}>
      {packageNames.map((packageName) => {
        const task = useCallback(
          async (logger: BettererLogger) => {
            const worker = testPackageApi();
            try {
              await worker.run(logger, packageName);
            } finally {
              await worker.destroy();
            }
          },
          [testPackageApi, packageName]
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
  const worker = testPackageApi();
  const test = render(<APITest packageNames={await worker.getPackages()} />);
  await worker.destroy();
  await test.waitUntilExit();
})();
