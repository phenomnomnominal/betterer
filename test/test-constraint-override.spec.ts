import { describe, expect, it } from 'vitest';

describe('betterer', () => {
  it('should throw if the constraint override is nullish', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { smaller } = await import('@betterer/constraints');

    const test = new BettererTest({ test: () => 1, constraint: smaller, goal: 0 });

    try {
      // @ts-expect-error null is not a valid constraint
      test.constraint(null);
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toBe('for a test to work, it must have a `constraint` function. ❌');
    }
  });

  it('should let you override the constraint with a valid function', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { bigger, smaller } = await import('@betterer/constraints');

    const test = new BettererTest({ test: () => 1, constraint: smaller, goal: 0 });
    test.constraint(bigger);

    expect(test.config.constraint).toBe(bigger);
  });
});
