import React, { FC, useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { BettererPackageAPITestState } from './state';

export type PackageAPITestProps = {
  name: string;
  running: Promise<BettererPackageAPITestState>;
};

export const PackageAPITest: FC<PackageAPITestProps> = function PackageAPITest({ name, running }) {
  const [[indicator, colour, message], setState] = useState([getIndicator(), getColour(), getMessage(name)]);

  useEffect(() => {
    (async () => {
      const result = await running;
      setState([getIndicator(result), getColour(result), getMessage(name, result)]);
    })();
  }, []);

  return (
    <Box flexDirection="row">
      <Text>{indicator}</Text>
      <Text color={colour}>{name}: </Text>
      <Text>{message}</Text>
    </Box>
  );
};

function getMessage(packageName: string, state?: BettererPackageAPITestState): string {
  if (state?.valid) {
    return `No Breaking API changes found in "@betterer/${packageName}".`;
  }
  if (state?.exposedInternals) {
    return `Found "${state?.exposedInternals}" in the API for "@betterer/${packageName}. This means internal code has been exposed.`;
  }
  if (state?.valid === false) {
    return `API changes found in "@betterer/${packageName}" 🚨`;
  }
  return `Validating API for "@betterer/${packageName}" ...`;
}

function getIndicator(state?: BettererPackageAPITestState): string {
  if (state?.valid) {
    return state.isDefinitelyValid ? '✅' : '🤷‍♂️';
  }
  if (state?.exposedInternals) {
    return '🔥';
  }
  if (state?.valid === false) {
    return '🚨';
  }
  return '🤔';
}

function getColour(state?: BettererPackageAPITestState): string {
  if (state?.valid) {
    return state.isDefinitelyValid ? 'greenBright' : 'green';
  }
  if (state?.exposedInternals) {
    return 'redBright';
  }
  if (state?.valid === false) {
    return 'orangeBright';
  }
  return 'whiteBright';
}
