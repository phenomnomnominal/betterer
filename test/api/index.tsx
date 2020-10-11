import React, { FC, useEffect, useState } from 'react';
import { Box, render } from 'ink';

import { BettererLoggerTask } from '@betterer/logger';
import { getPackages, testPackageAPI } from './test-package-api';

export const APITest: FC = function APITest() {
  const [packageNames, setPackageNames] = useState<Array<string>>([]);

  useEffect(() => {
    (async () => setPackageNames(await getPackages()))();
  }, []);

  return (
    <Box flexDirection="column">
      {packageNames.map((packageName) => (
        <BettererLoggerTask key={packageName} context={testPackageAPI(packageName)} />
      ))}
    </Box>
  );
};

render(<APITest />);
