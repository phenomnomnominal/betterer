// eslint-disable-next-line import/no-unresolved -- vscode is an implicit dependency for extensions
import type { WorkspaceFolder } from 'vscode';

// eslint-disable-next-line import/no-unresolved -- vscode is an implicit dependency for extensions
import { window } from 'vscode';

export async function pickFolder(
  folders: Array<WorkspaceFolder>,
  placeHolder: string
): Promise<WorkspaceFolder | null> {
  const selected = await window.showQuickPick(
    folders.map((folder) => {
      return {
        label: folder.name,
        description: folder.uri.fsPath,
        folder
      };
    }),
    { placeHolder }
  );
  if (!selected) {
    return null;
  }
  return selected.folder;
}
