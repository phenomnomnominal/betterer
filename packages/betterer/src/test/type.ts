import { BettererFileTest } from './file-test';
import { BettererTestBase } from './types';

export enum BettererTestType {
  File = 'File',
  Unknown = 'Unknown'
}

/** @internal Definitely not stable! Please don't use! */
export function isBettererFileTestΔ(testOrConfig: unknown): testOrConfig is BettererFileTest {
  const config = (testOrConfig as BettererFileTest).config || testOrConfig;
  return config.type === BettererTestType.File;
}

export function isBettererTest(testOrConfig: unknown): testOrConfig is BettererTestBase {
  const config = (testOrConfig as BettererTestBase).config || testOrConfig;
  return BettererTestType[config.type] != null;
}
