import { MaybeAsync } from '../types';

export type Serialisable<SerialisedType = unknown> = {
  serialise: () => MaybeAsync<SerialisedType>;
};

export type Deserialiser<Deserialised extends Serialisable<Serialised>, Serialised> = (
  serialised: Serialised
) => MaybeAsync<Deserialised>;
