import { BettererContext } from '../context';
import { process } from './process';

export function report(context: BettererContext): Promise<BettererContext> {
  return process(context);
}
