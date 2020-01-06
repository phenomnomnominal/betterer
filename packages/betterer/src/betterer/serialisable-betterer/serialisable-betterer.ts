import { Serialisable, Deserialiser } from '../types';
import { BettererRun } from '../../context';
import { Betterer } from '../betterer';
import { SerialisableBettererOptions } from './types';

export class SerialisableBetterer<TestType extends Serialisable<SerialisedType>, SerialisedType> extends Betterer<
  TestType
> {
  public deserialise: Deserialiser<TestType, SerialisedType>;

  public readonly isSerialisableBetterer = true;

  constructor(options: SerialisableBettererOptions<TestType, SerialisedType>) {
    super(options);
    const { deserialise } = options;
    this.deserialise = deserialise;
  }

  public getExpected(run: BettererRun): TestType {
    return run.test.expected as TestType;
  }
}

export function isSerialisableBetterer(obj: unknown): obj is SerialisableBetterer<Serialisable<unknown>, unknown> {
  return !!(obj as SerialisableBetterer<Serialisable<unknown>, unknown>).isSerialisableBetterer;
}
