import { BettererConfig } from './types';

let currentConfig: BettererConfig | null = null;

export function setConfig(config: BettererConfig): void {
  currentConfig = config;
}

export function getConfig(): BettererConfig {
  if (!currentConfig) {
    throw new Error();
  }
  return currentConfig;
}
