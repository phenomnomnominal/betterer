import { MaybeAsync } from '../types';

export type Serialisable<T = unknown> = {
  serialise: () => MaybeAsync<T>;
};

export async function serialise(
  value: unknown | Serialisable
): Promise<unknown> {
  if (value && (value as Serialisable).serialise) {
    return await (value as Serialisable).serialise();
  }
  return value;
}
