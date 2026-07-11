import { describe, expect, it } from 'vitest';

describe('betterer', () => {
  it('should default the deadline to Infinity when none is given', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { smaller } = await import('@betterer/constraints');

    const test = new BettererTest({ test: () => 1, constraint: smaller, goal: 0 });

    expect(test.config.deadline).toBe(Infinity);
  });
});
