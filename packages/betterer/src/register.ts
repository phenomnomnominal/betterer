import { register } from 'ts-node';

import { RESULTS_EXTENTION, JS_EXTENSION } from './constants';

export function registerExtensions(): void {
  // Get the original JS module require:
  const JS = require.extensions[JS_EXTENSION];

  // Use TS-Node register to allow `.betterer.ts` config files:
  register();

  // Force `.betterer.results` files to be loaded as JS:
  require.extensions[RESULTS_EXTENTION] = (m: NodeModule, filePath: string): void => {
    JS(m, filePath);
  };
}
