import { BettererTaskRun } from './types';

const TASKS = new Map<string, BettererTaskRun>();

export function reset(): void {
  TASKS.clear();
}

export function getTask(name: string): BettererTaskRun | null {
  return TASKS.get(name) || null;
}

export function addTask(name: string, run: BettererTaskRun): void {
  TASKS.set(name, run);
}
