import { BettererPackageJSON } from '@betterer/cli';
import assert from 'assert';

import { vscode, createFixture } from './runner';

describe('Betterer VSCode Extension', () => {
  jest.setTimeout(600000);

  it('should work', async () => {
    {
      const { resolve, readFile, deleteDirectory, deleteFile } = await createFixture('.', {
        'package.json': '{ "name": "test-betterer-e2e-init" }'
      });

      await vscode.commands.executeCommand('betterer.init');

      await waitFor(() => readFile('.betterer.ts'));
      const packageJSON = await waitFor(() => readFile('package.json'));
      const pack = JSON.parse(packageJSON) as BettererPackageJSON;
      expect(pack.devDependencies['@betterer/cli']).toBeDefined();
      expect(pack.scripts['betterer']).toBe('betterer');

      const bettererConfig = await readFile('.betterer.ts');
      expect(bettererConfig).not.toBe(null);

      await deleteDirectory(resolve('./.vscode'));
      await deleteFile(resolve('./package.json'));
      await deleteFile(resolve('./.betterer.ts'));
    }

    {
      const { cleanup, resolve } = await createFixture('test-betterer-file-problems', {
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
          `,
        'src/index.ts': ''
      });

      const indexPath = resolve('./src/index.ts');
      const cachePath = resolve('./.betterer.cache');
      const configPath = resolve('./.betterer.js');
      const resultsPath = resolve('./.betterer.results');
      const tsconfigPath = resolve('./tsconfig.json');

      const indexUri = vscode.Uri.file(indexPath);

      const config = vscode.workspace.getConfiguration('betterer', indexUri);
      await config.update('resultsPath', resultsPath);
      await config.update('cachePath', cachePath);
      await config.update('configPath', configPath);
      await config.update('tsconfigPath', tsconfigPath);

      const document = await vscode.workspace.openTextDocument(indexUri);
      const editor = await vscode.window.showTextDocument(document, 1, false);
      await editor.edit((edit) => {
        edit.insert(new vscode.Position(0, 0), 'debugger;');
      });
      await document.save();

      const diagnostic = await waitFor(() => {
        const found = vscode.languages.getDiagnostics().find((diagnostic) => {
          const [url, diagnostics] = diagnostic;
          return url.path === indexUri.path && diagnostics.length;
        });
        assert.ok(found);
        const [, diagnostics] = found;
        const [diagnostic] = diagnostics;
        return diagnostic;
      });

      expect(diagnostic.code).toEqual('[eslint enable new rule] - new issue');
      expect(diagnostic.message).toEqual(`Unexpected 'debugger' statement.`);

      await cleanup();
    }

    {
      const { cleanup, resolve } = await createFixture('test-betterer-file-only', {
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
          `,
        'src/index.ts': ''
      });

      const indexPath = resolve('./src/index.ts');
      const cachePath = resolve('./.betterer.cache');
      const configPath = resolve('./.betterer.ts');
      const resultsPath = resolve('./.betterer.results');
      const tsconfigPath = resolve('./tsconfig.json');

      const indexUri = vscode.Uri.file(indexPath);

      const config = vscode.workspace.getConfiguration('betterer', indexUri);
      await config.update('resultsPath', resultsPath);
      await config.update('cachePath', cachePath);
      await config.update('configPath', configPath);
      await config.update('tsconfigPath', tsconfigPath);

      const document = await vscode.workspace.openTextDocument(indexUri);
      const editor = await vscode.window.showTextDocument(document, 1, false);
      await editor.edit((edit) => {
        edit.insert(
          new vscode.Position(0, 0),
          `
export function extractIds(list) {
  return list.map((member) => member.id);
}
                  `
        );
      });
      await document.save();

      const diagnostic = await waitFor(() => {
        const found = vscode.languages.getDiagnostics().find((diagnostic) => {
          const [url, diagnostics] = diagnostic;
          return url.path === indexUri.path && diagnostics.length;
        });
        assert.ok(found);
        const [, diagnostics] = found;
        const [diagnostic] = diagnostics;
        assert.ok(diagnostic.code !== 7044);
        return diagnostic;
      });

      expect(diagnostic.code).toEqual('[typescript use strict mode] - new issue');
      expect(diagnostic.message).toEqual(`Parameter 'list' implicitly has an 'any' type.`);

      await cleanup();
    }
  });
});

function waitFor<T>(test: () => T, timeout = 600000): Promise<T> {
  const start = Date.now();

  type PromiseArgs = Parameters<ConstructorParameters<typeof Promise>[0]>;
  type Resolve = PromiseArgs[0];
  type Reject = PromiseArgs[1];

  async function wait(id: NodeJS.Timeout, resolve: Resolve, reject: Reject) {
    try {
      const result = await Promise.resolve(test());
      if (result != null) {
        clearInterval(id);
        resolve(result);
      }
    } catch {
      if (Date.now() - start > timeout) {
        reject();
      }
    }
  }

  return new Promise((resolve, reject) => {
    const id = setInterval(() => {
      void wait(id, resolve as Resolve, reject);
    }, 1000);
  });
}
