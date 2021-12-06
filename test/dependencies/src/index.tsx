import React, { FC, useCallback } from 'react';

import { BettererTaskLogger, BettererTasksLogger, BettererTasksState } from '@betterer/tasks';
import { createWorkerRequire } from '@phenomnomnominal/worker-require';
import { render } from 'ink';

import { TestPackageDependenciesWorker } from './types';

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
          async (logger) => {
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
