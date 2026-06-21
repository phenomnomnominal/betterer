import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const COMMON_METADATA = {
  author: 'Craig Spence <craigspence0@gmail.com>',
  license: 'MIT',
  homepage: 'https://phenomnomnominal.github.io/betterer',
  repository: {
    type: 'git',
    url: 'git+https://github.com/phenomnomnominal/betterer.git'
  },
  bugs: {
    url: 'https://github.com/phenomnomnominal/betterer/issues'
  },
  engines: {
    node: '>=18'
  }
};

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const packageJsonContents = readFileSync(packageJsonPath, 'utf-8');
const packageJson = JSON.parse(packageJsonContents) as Record<string, unknown>;

delete packageJson.gitHead;

const updatedPackageJson = {
  ...packageJson,
  ...COMMON_METADATA
};

const updatedContents = JSON.stringify(updatedPackageJson, null, 2) + '\n';

if (updatedContents !== packageJsonContents) {
  writeFileSync(packageJsonPath, updatedContents, 'utf-8');
}
