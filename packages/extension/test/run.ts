import { errorΔ, infoΔ } from '@betterer/logger';
import { runCLI } from '@jest/core';
import * as path from 'path';

const ARGS = { _: [], $0: '' };

export async function run(
  testRootPath: string,
  reportTestResults: (error: Error | null, failures?: number) => void
): Promise<void> {
  const projectRootPath = path.join(testRootPath, '../../../');
  const config = path.join(projectRootPath, 'jest.config.js');
  const testEnvironment = path.join(__dirname, './environment');

  try {
    const { results } = await runCLI({ ...ARGS, config, testEnvironment }, [projectRootPath]);

    results.testResults.forEach((testResult) => {
      testResult.testResults
        .filter((assertionResult) => assertionResult.status === 'passed')
        .forEach(({ ancestorTitles, title, status }) => {
          infoΔ(`${ancestorTitles} - ${title} (${status})`);
        });
    });

    results.testResults.forEach((testResult) => {
      if (testResult.failureMessage) {
        errorΔ(testResult.failureMessage);
      }
    });

    reportTestResults(null, results.numFailedTests);
  } catch (error) {
    reportTestResults(error);
  }
}
