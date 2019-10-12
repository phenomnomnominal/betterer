type Serialisable = {
  serialise: () => unknown;
};

export function serialise(value: unknown | Serialisable): unknown {
  if (value && (value as Serialisable).serialise) {
    return (value as Serialisable).serialise();
  }
  return value;
}
