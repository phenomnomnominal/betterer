import { BettererFileTest } from './file-test';
import { BettererTestBase, BettererTestConfig, BettererTestConfigPartial } from './types';

export enum BettererTestType {
  File = 'File',
  Number = 'Number',
  Unknown = 'Unknown'
}

/** @internal Definitely not stable! Please don't use! */
export function isBettererFileTestΔ(
  testOrConfig: BettererFileTest | BettererTestBase | BettererTestConfig
): testOrConfig is BettererFileTest {
  const config = (testOrConfig as BettererFileTest).config || testOrConfig;
  return config.type === BettererTestType.File;
}

/** @internal Definitely not stable! Please don't use! */
export function isBettererNumberTestΔ(
  testOrConfig: BettererTestBase | BettererTestConfig
): testOrConfig is BettererTestBase {
  const config = (testOrConfig as BettererTestBase).config || testOrConfig;
  return config.type === BettererTestType.Number;
}

/** @internal Definitely not stable! Please don't use! */
export function isBettererTestΔ(
  testOrConfig: BettererTestBase | BettererTestConfigPartial
): testOrConfig is BettererTestBase {
  const config = (testOrConfig as BettererTestBase).config || testOrConfig;
  return BettererTestType[config.type] != null;
}
