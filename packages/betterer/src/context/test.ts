import { BettererContext } from './context';
import { Betterer, isSerialisableBetterer } from '../betterer';
import { BettererResults } from './results';

export class BettererTest {
  private _expected: unknown;
  private _hasExpected = false;

  constructor(
    public readonly name: string,
    public readonly context: BettererContext,
    public readonly betterer: Betterer,
    expectedRaw: BettererResults
  ) {
    if (Object.hasOwnProperty.call(expectedRaw, name)) {
      let expected = JSON.parse(expectedRaw[name].value as string);
      if (isSerialisableBetterer(betterer)) {
        expected = betterer.deserialise(expected);
      }
      this._expected = expected;
      this._hasExpected = true;
    }
  }

  public get expected(): unknown {
    return this._expected;
  }

  public get hasExpected(): boolean {
    return this._hasExpected;
  }
}
