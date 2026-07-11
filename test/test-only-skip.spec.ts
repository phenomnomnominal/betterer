import { describe, expect, it } from 'vitest';

describe('betterer', () => {
  it('should be skipped when skip is called after only', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { smaller } = await import('@betterer/constraints');

    const test = new BettererTest({ test: () => 1, constraint: smaller, goal: 0 }).only().skip();

    expect(test.isOnly).toBe(false);
    expect(test.isSkipped).toBe(true);
  });

  it('should be only when only is called after skip', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { smaller } = await import('@betterer/constraints');

    const test = new BettererTest({ test: () => 1, constraint: smaller, goal: 0 }).skip().only();

    expect(test.isOnly).toBe(true);
    expect(test.isSkipped).toBe(false);
  });
});
