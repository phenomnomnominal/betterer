type ESModule<T> = {
  default: T;
};

export function requireUncached<T>(requirePath: string): T {
  delete require.cache[require.resolve(requirePath)];
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const m = require(requirePath) as unknown;
  return getDefaultExport<T>(m);
}

function getDefaultExport<T>(module: unknown): T {
  return (module as ESModule<T>).default || (module as T);
}
