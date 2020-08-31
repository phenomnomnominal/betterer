import { errorΔ } from '@betterer/logger';
import * as path from 'path';
import { runTests } from 'vscode-test';

async function main() {
  try {
    await runTests({
      extensionDevelopmentPath: path.resolve(__dirname, '../'),
      extensionTestsPath: path.resolve(__dirname, './run'),
      launchArgs: [path.resolve(__dirname, '../../../../', 'fixtures'), '--disable-extensions']
    });
  } catch (err) {
    errorΔ('Failed to run tests');
    process.exitCode = 1;
  }
}

main();

export { vscode } from './vscode';
export { createFixture } from './fixture';
