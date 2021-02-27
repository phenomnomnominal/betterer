import { BettererOptionsStart, BettererOptionsRunner, BettererOptionsWatch } from '@betterer/betterer';

function noop(options: unknown): unknown {
  return options;
}

describe('betterer modes', () => {
  // No need to assert, just testing the types:
  // eslint-disable-next-line jest/expect-expect
  it('handles options for running Betterer', () => {
    const start: BettererOptionsStart = { ci: false, strict: false, update: false };
    noop(start);

    const update: BettererOptionsStart = { ci: false, strict: false, update: true };
    noop(update);

    const strict: BettererOptionsStart = { ci: false, strict: true, update: false };
    noop(strict);

    // @ts-expect-error `update` cannot be `false` is `strict` is `true`:
    const updateStrictError: BettererOptionsStart = { ci: false, strict: true, update: true };
    noop(updateStrictError);

    // @ts-expect-error `strict` cannot be `false` is `ci` is `true`:
    const strictCIError: BettererOptionsStart = { ci: true, strict: false };
    noop(strictCIError);

    // @ts-expect-error `update` cannot be `true` is `ci` is `true`:
    const updateCIError: BettererOptionsStart = { ci: true, update: true };
    noop(updateCIError);

    // @ts-expect-error `watch` cannot e assigned to `BettererOptionsStart`:
    const startWatchError: BettererOptionsStart = { watch: true };
    noop(startWatchError);

    // @ts-expect-error `ignores` cannot be assigned to `BettererOptionsStart`:
    const startIgnoresError: BettererOptionsStart = { ignores: [] };
    noop(startIgnoresError);

    const runner: BettererOptionsRunner = { ignores: [] };
    noop(runner);

    // @ts-expect-error `ci` cannot be assigned to `BettererOptionsRunner`:
    const runnerCIError: BettererOptionsRunner = { ci: true };
    noop(runnerCIError);

    // @ts-expect-error `strict` cannot be assigned to `BettererOptionsRunner`:
    const runnerStrictError: BettererOptionsRunner = { strict: true };
    noop(runnerStrictError);

    // @ts-expect-error `update` cannot be assigned to `BettererOptionsRunner`:
    const runnerUpdateError: BettererOptionsRunner = { update: true };
    noop(runnerUpdateError);

    // @ts-expect-error `watch` cannot be assigned to `BettererOptionsRunner`:
    const runnerWatchError: BettererOptionsRunner = { watch: true };
    noop(runnerWatchError);

    const watch: BettererOptionsWatch = { ignores: [], watch: true };
    noop(watch);

    // @ts-expect-error `ci` cannot be assigned to `BettererOptionsWatch`:
    const watchCIError: BettererOptionsWatch = { ci: true };
    noop(watchCIError);

    // @ts-expect-error `strict` cannot be assigned to `BettererOptionsWatch`:
    const watchStrictError: BettererOptionsWatch = { strict: true };
    noop(watchStrictError);

    // @ts-expect-error `update` cannot be assigned to `BettererOptionsWatch`:
    const watchUpdateError: BettererOptionsWatch = { update: true };
    noop(watchUpdateError);

    // @ts-expect-error `watch: false` cannot be assigned to `BettererOptionsWatch`:
    const watchFalseError: BettererOptionsWatch = { watch: false };
    noop(watchFalseError);
  });
});
