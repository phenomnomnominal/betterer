export type MaybeAsync<T> = T | Promise<T>;

export type Printable = {
  print: () => MaybeAsync<string>;
};

export type Serialisable<T = unknown> = {
  serialise: () => MaybeAsync<T>;
};
