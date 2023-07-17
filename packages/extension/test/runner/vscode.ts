import type { Global } from '@jest/types';

// eslint-disable-next-line import/no-unresolved -- vscode is an implicit dependency for extensions
import type * as vscodeNamespace from 'vscode';

export type VSCodeJestGlobal = typeof Global & {
  vscode: typeof vscodeNamespace;
};

export const vscode = (global as unknown as VSCodeJestGlobal).vscode;
