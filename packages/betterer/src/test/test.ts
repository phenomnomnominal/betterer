import { createTestConfig } from './config';
import { BettererTestState } from './test-state';
import { BettererTestConfigPartial } from './types';

export class BettererTest<
  DeserialisedType = unknown,
  SerialisedType = DeserialisedType,
  DiffType = unknown
> extends BettererTestState {
  constructor(config: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>) {
    super(createTestConfig(config));
  }
}
