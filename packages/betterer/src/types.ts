export type MaybeAsync<T> = T | Promise<T>;

export type Printable = {
  print: () => MaybeAsync<string>;
};
