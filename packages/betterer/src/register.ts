import type { RegisterOptions } from 'ts-node';

import { BettererConfig } from './config';

export const JS_EXTENSION = '.js';
export const RESULTS_EXTENTION = '.results';
export const TS_EXTENSION = '.ts';

type Extensions = typeof require.extensions;

let isRegistered = false;
export async function registerExtensions(config: BettererConfig): Promise<void> {
  if (isRegistered) {
    return;
  }
  isRegistered = true;

  // Need to do this so that webpack doesn't remove it
  // during the extension bundle...
  const EXTENSIONS: Extensions = eval(`require.extensions`) as Extensions;

  // Get the original JS module require:
  const JS = EXTENSIONS[JS_EXTENSION];

  if (!EXTENSIONS[TS_EXTENSION]) {
    await registerTypeScript(config);
  }

  // Force `.betterer.results` files to be loaded as JS:
  EXTENSIONS[RESULTS_EXTENTION] = (m: NodeModule, filePath: string): void => {
    JS(m, filePath);
  };
}

async function registerTypeScript(config: BettererConfig): Promise<void> {
  let tsNode: typeof import('ts-node');
  try {
    await import('typescript');
    tsNode = await import('ts-node');
  } catch {
    // Environment doesn't have TypeScript available, move on!
    return;
  }

  // Use TS-Node register to allow `.betterer.ts` config files:
  const tsRegisterOptions: RegisterOptions = {
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs'
    }
  };
  if (config.tsconfigPath) {
    tsRegisterOptions.project = config.tsconfigPath;
  }
  tsNode.register(tsRegisterOptions);
}
