import { execSync } from 'child_process';
import { Files } from 'vscode-languageserver';

import { betterer } from '@betterer/betterer';
import { PackageManager } from './config';
import { nodeRequire } from './require';

type Betterer = typeof betterer;

export async function getLibrary(cwd: string, packageManager: PackageManager): Promise<Betterer> {
  const r = nodeRequire();
  const resolvedGlobalPackageManagerPath = globalPathGet(packageManager);
  const libraryPath = await Files.resolve('@betterer/betterer', resolvedGlobalPackageManagerPath, cwd, () => null);
  try {
    return r(libraryPath) as Betterer;
  } catch {
    throw new Error();
  }
}

function globalPathGet(packageManager: PackageManagers): string | undefined {
  const pm = _globalPaths[packageManager];
  pm.cache = pm.cache || pm.get();
  return pm.cache;
}

const _globalPaths: Record<PackageManagers, { cache: string | undefined; get(): string | undefined }> = {
  yarn: {
    cache: undefined,
    get(): string | undefined {
      return Files.resolveGlobalYarnPath();
    }
  },
  npm: {
    cache: undefined,
    get(): string | undefined {
      return Files.resolveGlobalNodePath();
    }
  },
  pnpm: {
    cache: undefined,
    get(): string {
      const pnpmPath = execSync('pnpm root -g')
        .toString()
        .trim();
      return pnpmPath;
    }
  }
};

type PackageManagers = 'npm' | 'yarn' | 'pnpm';
