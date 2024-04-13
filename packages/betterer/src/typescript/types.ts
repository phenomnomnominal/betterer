/**
 * @public **Betterer** options for instantiating a TypeScript handling.
 *
 * @remarks The options object will be validated by **Betterer** and will be available on the
 * {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export interface BettererOptionsTypeScript {
  /**
   * The path to the {@link https://phenomnomnominal.github.io/betterer/docs/betterer-and-typescript | TypeScript configuration}.
   * The `tsconfigPath` should be relative to the `cwd`.
   * @defaultValue `null`
   */
  tsconfigPath?: string;
}

/**
 * @public Full validated config object for a TypeScript handling.
 *
 * @remarks Ths config can be accessed via the {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export interface BettererConfigTypeScript {
  /**
   * The absolute path to the {@link https://phenomnomnominal.github.io/betterer/docs/betterer-and-typescript | TypeScript configuration file}.
   */
  tsconfigPath: string | null;
}
