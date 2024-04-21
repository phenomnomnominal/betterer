import { BettererError } from '@betterer/errors';
import { startVitest } from 'vitest/node';
import path from 'node:path';

export async function run(
  testRootPath: string,
  reportTestResults: (error: Error | null, failures?: number) => void
): Promise<void> {
  const projectRootPath = path.join(testRootPath, '../../../../');
  console.log(projectRootPath);

  try {
    const failures = [];

    const vitest = await startVitest('test', [], {
      reporters: [
        {
          onTaskUpdate(packs) {
            packs.forEach(([id, result]) => {
              if (result?.errors) {
                let [error] = result.errors;
                console.log(id);
                throw new BettererError(error.message);
              }
              if (result?.state === 'fail') {
                failures.push('');
              }
            });
          }
        }
      ]
    });

    await vitest?.close();

    reportTestResults(null, failures.length);
  } catch (error) {
    reportTestResults(error as Error);
  }
}
