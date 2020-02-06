import { execSync } from 'child_process';
import { Files } from 'vscode-languageserver';
import { betterer } from '@betterer/betterer';

import { PackageManager } from './config';

type Betterer = typeof betterer;

export async function getLibrary(cwd: string, packageManager: PackageManager): Promise<Betterer> {
  const resolvedGlobalPackageManagerPath = globalPathGet(packageManager);
  const libraryPath = await Files.resolve('betterer', resolvedGlobalPackageManagerPath, cwd, () => null);
  try {
    return loadNodeModule<Betterer>(libraryPath);
  } catch {
    throw new Error();
  }
}

/* eslint-disable @typescript-eslint/camelcase */
declare const __webpack_require__: typeof require;
declare const __non_webpack_require__: typeof require;
function loadNodeModule<T>(moduleName: string): T {
  const r = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
  return r(moduleName);
}
/* eslint-enable @typescript-eslint/camelcase */

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
