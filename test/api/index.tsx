import { BettererTasksLogger, BettererTasksState } from '@betterer/tasks';
import { workerRequire, WorkerModule } from '@phenomnomnominal/worker-require';
import { render } from 'ink';
import React, { FC, useEffect, useState } from 'react';

const testPackageApi = workerRequire<WorkerModule<typeof import('./test-package-api')>>('./test-package-api');

export const APITest: FC = function APITest() {
  const [packageNames, setPackageNames] = useState<Array<string>>([]);

  useEffect(() => {
    void (async () => {
      const packageNames = await testPackageApi.getPackages();
      setPackageNames(packageNames);
    })();
  }, []);

  return (
    <BettererTasksLogger
      name="Test Package APIs"
      update={update}
      tasks={packageNames.map((packageName) => ({
        name: packageName,
        run: async (logger) => {
          await testPackageApi.run(logger, packageName);
          testPackageApi.destroy();
        }
      }))}
    />
  );
};

render(<APITest />);

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
