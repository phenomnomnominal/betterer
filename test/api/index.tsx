import React, { FC, useEffect, useState } from 'react';
import { render } from 'ink';

import { BettererTask, BettererTasks } from '@betterer/logger';
import { getPackages, testPackageAPI } from './test-package-api';

export const APITest: FC = function APITest() {
  const [packageNames, setPackageNames] = useState<Array<string>>([]);

  useEffect(() => {
    (async () => setPackageNames(await getPackages()))();
  }, []);

  return (
    <BettererTasks name="Test Package APIs">
      {packageNames.map((packageName) => (
        <BettererTask key={packageName} context={testPackageAPI(packageName)} />
      ))}
    </BettererTasks>
  );
};

render(<APITest />);
