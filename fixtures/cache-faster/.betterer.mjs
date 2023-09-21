import { BettererFileTest } from '@betterer/betterer';
import { promises: fs } from 'node:fs';

export default {
  test: () =>
    new BettererFileTest(async (filePaths, fileTestResult) => {
      await Promise.all(
        filePaths.map(async (filePath) => {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          const fileContents = await fs.readFile(filePath, "utf8");
          const file = fileTestResult.addFile(filePath, fileContents);
          file.addIssue(1, 2, "Please use TypeScript!");
        })
      );
    })
    .include("**/*.js")
};