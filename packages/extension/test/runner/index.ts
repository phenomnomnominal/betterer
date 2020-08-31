import { errorΔ } from '@betterer/logger';
import { createFixtureDirectoryΔ } from '@betterer/fixture';
import * as path from 'path';
import { runTests } from 'vscode-test';

async function main() {
  try {
    const fixturesPath = path.resolve(__dirname, '../../../../../', 'fixtures');
    await createFixtureDirectoryΔ(fixturesPath);

    await runTests({
      extensionDevelopmentPath: path.resolve(__dirname, '../../../'),
      extensionTestsPath: path.resolve(__dirname, './run.js'),
      launchArgs: [fixturesPath, '--disable-extensions']
    });
  } catch (err) {
    errorΔ('Failed to run tests');
    process.exitCode = 1;
  }
}

main();

export { vscode } from './vscode';
export { createFixture } from './fixture';
