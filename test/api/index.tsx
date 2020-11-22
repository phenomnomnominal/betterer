import { BettererTask, BettererTasks, BettererTasksState } from '@betterer/logger';
import { render } from 'ink';
import React, { FC, useEffect, useState } from 'react';

import { getPackages, testPackageAPI } from './test-package-api';

export const APITest: FC = function APITest() {
  const [packageNames, setPackageNames] = useState<Array<string>>([]);

  useEffect(() => {
    (async () => setPackageNames(await getPackages()))();
  }, []);

  return (
    <BettererTasks name="Test Package APIs" statusMessage={statusMessage}>
      {packageNames.map((packageName) => (
        <BettererTask key={packageName} context={testPackageAPI(packageName)} />
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
