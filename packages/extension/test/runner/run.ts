import { BettererError } from '@betterer/errors';
import { runCLI } from '@jest/core';
import * as path from 'path';

const ARGS = { _: [], $0: '' };

export async function run(
  testRootPath: string,
  reportTestResults: (error: Error | null, failures?: number) => void
): Promise<void> {
  const projectRootPath = path.join(testRootPath, '../../../../');
  const config = path.join(projectRootPath, 'jest.config.js');
  const testEnvironment = path.join(__dirname, './environment');

  try {
    const { results } = await runCLI({ ...ARGS, config, testEnvironment }, [projectRootPath]);

    results.testResults.forEach((testResult) => {
      if (testResult.failureMessage) {
        throw new BettererError(testResult.failureMessage);
      }
    });

    reportTestResults(null, results.numFailedTests);
  } catch (error) {
    reportTestResults(error);
  }
}
