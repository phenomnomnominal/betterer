import type { BettererLogger } from '@betterer/logger';
import type { FC } from '@betterer/render';
import type { BettererTasksState } from '@betterer/tasks';

import { React, render, useCallback } from '@betterer/render';
import { BettererTaskLogger, BettererTasksLogger } from '@betterer/tasks';
import { createWorkerRequire } from '@phenomnomnominal/worker-require';

import type { TestPackageDependenciesWorker } from './types.js';

const testPackageDependencies = createWorkerRequire<TestPackageDependenciesWorker>('./test-package-dependencies', {
  cache: false
});

interface DependenciesTestProps {
  packageNames: Array<string>;
}

export const DependenciesTest: FC<DependenciesTestProps> = function DependenciesTest({ packageNames }) {
  return (
    <BettererTasksLogger name="Test Package Dependencies" update={update}>
      {packageNames.map((packageName) => {
        const task = useCallback(
          async (logger: BettererLogger) => {
            const worker = testPackageDependencies();
            try {
              await worker.run(logger, packageName);
            } finally {
              await worker.destroy();
            }
          },
          [testPackageDependencies, packageName]
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
  const worker = testPackageDependencies();
  const test = render(<DependenciesTest packageNames={await worker.getPackages()} />);
  await worker.destroy();
  await test.waitUntilExit();
})();
