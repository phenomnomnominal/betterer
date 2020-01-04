import { BettererContext } from './context';
import { Betterer } from '../betterer';

export class BettererTest {
  constructor(
    public readonly name: string,
    public readonly context: BettererContext,
    public readonly betterer: Betterer
  ) {}
}
