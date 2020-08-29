import * as assert from 'assert';

import { vscode } from './vscode';

describe('Betterer VSCode Extension', () => {
  vscode.window.showInformationMessage('Start all tests.');

  vscode.commands.executeCommand('betterer.init');

  it('Sample test', () => {
    assert.equal([1, 2, 3].indexOf(5), -1);
    assert.equal([1, 2, 3].indexOf(0), -1);
  });
});
