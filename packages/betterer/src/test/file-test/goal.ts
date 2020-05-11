import { BettererFiles } from './files';

export function goal(value: BettererFiles): boolean {
  return value.files.length === 0;
}
