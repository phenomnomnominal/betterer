import type { TaskResult } from 'vitest';

import { startVitest } from 'vitest/node';

export async function run(
  _: string,
  reportTestResults: (error: Error | null, failures?: number) => void
): Promise<void> {
  try {
    const results: Array<TaskResult> = [];
    const vitest = await startVitest('test', [], {
      reporters: {
        onTaskUpdate(packs) {
          packs.forEach(([, result]) => {
            if (result?.state === 'fail') {
              results.push(result);
            }
          });
        }
      }
    });

    await vitest?.close();

    reportTestResults(null, results.length);
  } catch (error) {
    reportTestResults(error as Error);
  }
}
