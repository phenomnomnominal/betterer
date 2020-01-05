import { Serialisable } from '../types';

export async function serialise(value: unknown | Serialisable): Promise<unknown> {
  if (isSerialisable(value)) {
    return await value.serialise();
  }
  return value;
}

function isSerialisable(value: unknown): value is Serialisable {
  return value && typeof (value as Serialisable).serialise === 'function';
}
