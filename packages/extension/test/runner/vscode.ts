// eslint-disable-next-line import/no-unresolved -- vscode is an implicit dependency for extensions
import type * as vscodeNamespace from 'vscode';

export type VSCodeGlobal = Global & {
  vscode: typeof vscodeNamespace;
};

export const vscode = (global as unknown as VSCodeGlobal).vscode;
