import { BettererPackageJSON } from '@betterer/cli';
import * as assert from 'assert';

import { vscode, createFixture } from './runner';

describe('Betterer VSCode Extension', () => {
  jest.setTimeout(600000);

  it('should initialise betterer uisng `betterer.init`', async () => {
    const { resolve, readFile, sleep, deleteDirectory, deleteFile } = await createFixture('.', {
      'package.json': '{ "name": "test-betterer-e2e-init" }'
    });

    await vscode.commands.executeCommand('betterer.init');

    // Wait for init to run:
    await sleep(20000);

    const packageJSON = await readFile('package.json');
    const pack = JSON.parse(packageJSON) as BettererPackageJSON;
    expect(pack.devDependencies['@betterer/cli']).toBeDefined();
    expect(pack.scripts['betterer']).toBe('betterer');

    const bettererConfig = await readFile('.betterer.ts');
    expect(bettererConfig).not.toBe(null);

    await deleteFile(resolve('./package.json'));
    await deleteFile(resolve('./.betterer.ts'));
    await deleteDirectory(resolve('./.vscode'));
  });

  it('should report problems in a file', async () => {
    const { cleanup, writeFile, resolve, sleep } = await createFixture('test-betterer-file-problems', {
      '.betterer.js': `
const { eslint } = require('../../node_modules/@betterer/eslint');

module.exports = {
  'eslint enable new rule': eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts')
};
      `,
      '.eslintrc.js': `
const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    project: path.resolve(__dirname, './tsconfig.json'),
    sourceType: 'module'
  },
  root: true,
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    'no-debugger': 0
  }
};
      `,
      'tsconfig.json': `
{
  "extends": "../../tsconfig.json",
  "include": ["./src/**/*", "./.betterer.js", "./.eslintrc.js"]
}
      `,
      'package.json': `
{
  "name": "betterer-test-betterer-problems",
  "version": "0.0.1"
}
      `
    });

    const indexPath = resolve('./src/index.ts');
    const configPath = resolve('./.betterer.js');
    const resultsPath = resolve('./.betterer.results');
    const tsconfigPath = resolve('./tsconfig.json');

    await writeFile(indexPath, '');

    const indexUri = vscode.Uri.file(indexPath);

    await vscode.workspace.openTextDocument(indexUri);

    const config = vscode.workspace.getConfiguration('betterer', indexUri);
    await config.update('configPath', configPath);
    await config.update('resultsPath', resultsPath);
    await config.update('tsconfigPath', tsconfigPath);

    await writeFile(indexPath, `debugger;`);

    await vscode.workspace.openTextDocument(indexUri);

    await sleep(5000);

    const indexDiagnosticTuple = vscode.languages.getDiagnostics().find((diagnostic) => {
      const [url] = diagnostic;
      return url.path === indexUri.path;
    });
    assert.ok(indexDiagnosticTuple);
    const [, indexDiagnostics] = indexDiagnosticTuple;
    const [diagnostic] = indexDiagnostics;

    expect(diagnostic.code).toEqual('[eslint enable new rule] - new issue');
    expect(diagnostic.message).toEqual(`Unexpected 'debugger' statement.`);

    await cleanup();
  });

  it('should only run tests that apply to files', async () => {
    const { cleanup, writeFile, resolve, sleep } = await createFixture('test-betterer-file-only', {
      '.betterer.ts': `
import { typescript } from '@betterer/typescript';
import { smaller } from '@betterer/constraints';

let shrinks = 2;

export default {
  'typescript use strict mode': typescript('./tsconfig.json', {
    strict: true
  }),
  'should shrink': {
    test: () => shrinks--,
    constraint: smaller
  }
};
      `,
      'tsconfig.json': `
{
  "compilerOptions": {
    "noEmit": true,
    "lib": ["esnext"],
    "moduleResolution": "node",
    "target": "ES5",
    "typeRoots": ["../../node_modules/@types/"],
    "resolveJsonModule": true
  },
  "include": ["./src/**/*", ".betterer.ts"]
}
      `
    });

    const indexPath = resolve('./src/index.ts');
    const configPath = resolve('./.betterer.ts');
    const resultsPath = resolve('./.betterer.results');
    const tsconfigPath = resolve('./tsconfig.json');

    await writeFile(indexPath, '');

    const indexUri = vscode.Uri.file(indexPath);

    await vscode.workspace.openTextDocument(indexUri);

    const config = vscode.workspace.getConfiguration('betterer', indexUri);
    await config.update('configPath', configPath);
    await config.update('resultsPath', resultsPath);
    await config.update('tsconfigPath', tsconfigPath);

    await writeFile(
      indexPath,
      `
export function extractIds(list) {
  return list.map((member) => member.id);
}
      `
    );

    await vscode.workspace.openTextDocument(indexUri);

    await sleep(20000);

    const indexDiagnosticTuple = vscode.languages.getDiagnostics().find((diagnostic) => {
      const [url] = diagnostic;
      return url.path === indexUri.path;
    });
    assert.ok(indexDiagnosticTuple);
    const [, indexDiagnostics] = indexDiagnosticTuple;
    const [diagnostic] = indexDiagnostics;

    expect(diagnostic.code).toEqual('[typescript use strict mode] - new issue');
    expect(diagnostic.message).toEqual(`Parameter 'list' implicitly has an 'any' type.`);

    await cleanup();
  });
});
