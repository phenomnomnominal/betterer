import React, { FC, useEffect, useState } from 'react';

import { BettererOptionsResults, BettererResults } from '@betterer/betterer';
import { workerRequire } from '@phenomnomnominal/worker-require';
import { Box, Text, useApp } from 'ink';

import { GetResultsWorker } from './types';
import { BettererLogo } from '@betterer/tasks';

export type ResultsProps = {
  options: BettererOptionsResults;
};

export const Results: FC<ResultsProps> = function Results({ options }) {
  const [results, setResults] = useState<BettererResults | null>(null);
  useEffect(() => {
    void (async () => {
      const getResults = workerRequire<GetResultsWorker>('./get-results');
      try {
        setResults(await getResults.run(options));
      } finally {
        await getResults.destroy();
      }
    })();
  }, [options]);

  const app = useApp();
  useEffect(() => {
    if (results) {
      setImmediate(() => app.exit());
    }
  }, [results]);

  return (
    <Box flexDirection="column">
      <BettererLogo />
      {results && (
        <Box flexDirection="column">
          {results.results.map((result) => {
            if (result.isFileTest) {
              return (
                <Box key={result.name} flexDirection="column">
                  <Text color="yellowBright">{`${result.name}: `}</Text>
                  <Box flexDirection="column" paddingTop={1} paddingLeft={2}>
                    {Object.keys(result.results).map((filePath) => {
                      const issues = result.results[filePath];
                      return issues.map((issue, index) => (
                        <Box key={index}>
                          <Text>{issue.message}</Text>
                          <Text> - </Text>
                          <Text color="cyan">{filePath}</Text>
                          <Text>:</Text>
                          <Text color="yellow">{issue.line + 1}</Text>
                          <Text>:</Text>
                          <Text color="yellow">{issue.column}</Text>
                        </Box>
                      ));
                    })}
                  </Box>
                </Box>
              );
            }
            return (
              <Box key={result.name}>
                <Text color="yellowBright">{`${result.name}: `}</Text>
                <Text>{result.result}</Text>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
