import { Betterer } from '../betterer';
import { BettererConfig } from './config';
import { BettererStats } from './statistics';

export type BettererContext = {
  config: BettererConfig;
  betterers: Array<Betterer>;
  only: Array<Betterer>;
  expected: BettererResults;
  results: BettererResults;
  stats: BettererStats;
};

export type BettererResult = {
  timestamp: number;
  value: unknown;
};

export type BettererResults = Record<string, BettererResult>;
