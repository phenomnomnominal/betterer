import { register } from 'ts-node';

export const JS_EXTENSION = '.js';
export const RESULTS_EXTENTION = '.results';

export function registerExtensions(): void {
  // Need to do this so that webpack doesn't remove it
  // during the extension bundle...
  const EXTENSIONS = eval(`require.extensions`);

  // Get the original JS module require:
  const JS = EXTENSIONS[JS_EXTENSION];

  // Use TS-Node register to allow `.betterer.ts` config files:
  register();

  // Force `.betterer.results` files to be loaded as JS:
  EXTENSIONS[RESULTS_EXTENTION] = (m: NodeModule, filePath: string): void => {
    JS(m, filePath);
  };
}
