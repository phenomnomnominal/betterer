import { register } from 'ts-node';

export const JS_EXTENSION = '.js';
export const RESULTS_EXTENTION = '.results';

export function registerExtensions(): void {
  // Get the original JS module require:
  const JS = require.extensions[JS_EXTENSION];

  // Use TS-Node register to allow `.betterer.ts` config files:
  register();

  // Force `.betterer.results` files to be loaded as JS:
  require.extensions[RESULTS_EXTENTION] = (
    m: NodeModule,
    filePath: string
  ): void => {
    JS(m, filePath);
  };
}
