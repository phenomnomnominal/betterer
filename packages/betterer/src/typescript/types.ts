export interface BettererOptionsTypeScript {
  /**
   * The path to the {@link https://phenomnomnominal.github.io/betterer/docs/betterer-and-typescript | TypeScript configuration}.
   * The `tsconfigPath` should be relative to the `cwd`.
   * @defaultValue `null`
   */
  tsconfigPath?: string;
}

export interface BettererConfigTypeScript {
  /**
   * The absolute path to the {@link https://phenomnomnominal.github.io/betterer/docs/betterer-and-typescript | TypeScript configuration file}.
   */
  tsconfigPath: string | null;
}
