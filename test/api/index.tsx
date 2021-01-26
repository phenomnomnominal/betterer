import { BettererTask, BettererTasks, BettererTasksState } from '@betterer/logger';
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
    <BettererTasks name="Test Package APIs" statusMessage={statusMessage}>
      {packageNames.map((packageName) => (
        <BettererTask
          key={packageName}
          context={{
            name: packageName,
            run: async (logger) => {
              await testPackageApi.run(logger, packageName);
              testPackageApi.destroy();
            }
          }}
        />
      ))}
    </BettererTasks>
  );
};

render(<APITest />);

function statusMessage(state: BettererTasksState): string {
  const { done, errors, running } = state;
  const runningStatus = running ? `${tests(running)} running... ` : '';
  const doneStatus = done ? `${tests(done)} done! ` : '';
  const errorStatus = errors ? `${tests(errors)} errored! ` : '';
  return `${runningStatus}${doneStatus}${errorStatus}`;
}

function tests(n: number): string {
  return `${n} ${n === 1 ? 'test' : 'tests'}`;
}
