import NodeEnvironment from 'jest-environment-node';

import type { VSCodeJestGlobal } from './vscode';

// eslint-disable-next-line import/no-unresolved -- vscode is an implicit dependency for extensions
import vscode from 'vscode';

export default class VsCodeEnvironment extends NodeEnvironment {
  constructor(...args: ConstructorParameters<typeof NodeEnvironment>) {
    super(...args);
    (this.global as Partial<VSCodeJestGlobal>).vscode = vscode;
  }
}
