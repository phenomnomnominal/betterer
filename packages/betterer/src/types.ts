/**
 * @public Utility type to allow results that are async or sync.
 */
export type MaybeAsync<T> = T | Promise<T>;
