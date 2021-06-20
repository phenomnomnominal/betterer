import React, { FC, useCallback } from 'react';
import { BettererTaskLogger, BettererTasksLogger, BettererTasksState } from '@betterer/tasks';
import { workerRequire, WorkerModule } from '@phenomnomnominal/worker-require';
import { render } from 'ink';

const testPackageApi = workerRequire<WorkerModule<typeof import('./test-package-api')>>('./test-package-api');

type APITestProps = {
  packageNames: Array<string>;
};

export const APITest: FC<APITestProps> = function APITest({ packageNames }) {
  return (
    <BettererTasksLogger name="Test Package APIs" update={update}>
      {packageNames.map((packageName) => {
        const task = useCallback(
          async (logger) => {
            await testPackageApi.run(logger, packageName);
            testPackageApi.destroy();
          },
          [testPackageApi, packageName]
        );
        return <BettererTaskLogger key={packageName} name={packageName} run={task} />;
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

void (async () => render(<APITest packageNames={await testPackageApi.getPackages()} />))();
