import { createFixtureDirectoryΔ, FixtureFileSystemFiles, Fixture } from '@betterer/fixture';
import * as assert from 'assert';

import { vscode } from './vscode';

export async function createFixture(fixtureName: string, files: FixtureFileSystemFiles): Promise<Fixture> {
  const { rootPath } = vscode.workspace;
  assert.ok(rootPath);
  const create = createFixtureDirectoryΔ(rootPath);

  const fixture = await create(fixtureName, files);

  return {
    ...fixture,
    async cleanup() {
      const { resolve, cleanup, deleteDirectory } = fixture;
      const vscodeFolder = resolve('../.vscode');
      await cleanup();
      await deleteDirectory(vscodeFolder);
    }
  };
}
