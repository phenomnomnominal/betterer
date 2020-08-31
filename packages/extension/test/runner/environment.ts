import NodeEnvironment from 'jest-environment-node';

import { VSCodeJestGlobal } from './vscode';

import * as vscode from 'vscode';

export default class VsCodeEnvironment extends NodeEnvironment {
  constructor(...args: ConstructorParameters<typeof NodeEnvironment>) {
    super(...args);
    (this.global as Partial<VSCodeJestGlobal>).vscode = vscode;
  }
}
