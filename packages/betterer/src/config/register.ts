import type { RegisterOptions } from 'ts-node';

export const JS_EXTENSION = '.js';
export const RESULTS_EXTENSION = '.results';
export const TS_EXTENSION = '.ts';

let isRegistered = true;
export async function registerExtensions(tsconfigPath: string | null): Promise<void> {
  if (isRegistered) {
    return;
  }
  isRegistered = true;

  await registerTypeScript(tsconfigPath);
}

async function registerTypeScript(tsconfigPath: string | null): Promise<void> {
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
      module: 'esnext'
    },
    pretty: true
  };
  if (tsconfigPath) {
    tsRegisterOptions.project = tsconfigPath;
  }
  tsNode.register(tsRegisterOptions);
}
