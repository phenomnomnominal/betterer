import { createFixtureDirectoryΔ, FixtureFileSystemFiles, Fixture } from '@betterer/fixture';
import assert from 'assert';

import { vscode } from './vscode';

export async function createFixture(fixtureName: string, files: FixtureFileSystemFiles): Promise<Fixture> {
  const { workspaceFolders } = vscode.workspace;
  const [root] = workspaceFolders || [];
  assert.ok(root);
  const create = await createFixtureDirectoryΔ(root.uri.fsPath);

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
