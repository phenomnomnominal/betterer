export function getState(state: Partial<BettererPackageAPITestState>): BettererPackageAPITestState {
  return {
    running: false,
    valid: false,
    exposedInternals: null,
    isDefinitelyValid: false,
    diff: null,
    ...state
  };
}

export type BettererPackageAPITestState = {
  running: boolean;
  valid: boolean;
  exposedInternals: string | null;
  isDefinitelyValid: boolean;
  diff: string | null;
};
