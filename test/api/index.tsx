import React, { FC, useEffect, useState } from 'react';
import { Box, render } from 'ink';

import { PackageAPITest, PackageAPITestProps } from './package-api-test';
import { getPackages, testPackage } from './test';

export const APITest: FC = function APITest() {
  const [packageTestProps, setPackageTestProps] = useState<Array<PackageAPITestProps>>([]);

  useEffect(() => {
    (async () => {
      const packageNames = await getPackages();
      const packageTests = packageNames.map((packageName) => {
        return {
          name: packageName,
          running: testPackage(packageName)
        };
      });
      setPackageTestProps(packageTests);
    })();
  }, []);

  return (
    <Box flexDirection="column">
      {packageTestProps.map(({ name, running }) => (
        <PackageAPITest key={name} name={name} running={running} />
      ))}
    </Box>
  );
};

render(<APITest />);
