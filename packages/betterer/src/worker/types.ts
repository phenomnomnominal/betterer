import type { Remote } from 'comlink';

export interface BettererWorkerHandle {
  free: Promise<void>;

  claim(): void;
  destroy(): Promise<void>;
  release(): void;
}

export type BettererWorkerAPI<API> = {
  api: Remote<API>;
  destroy(): Promise<void>;
};
