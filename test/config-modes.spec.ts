import type { BettererOptionsStart, BettererOptionsRunner, BettererOptionsWatch } from '@betterer/betterer';

function noop(options: unknown): unknown {
  return options;
}

describe('betterer modes', () => {
  // No need to assert, just testing the types:
  // eslint-disable-next-line jest/expect-expect
  it('handles options for running Betterer', () => {
    const ci: BettererOptionsStart = { ci: true, precommit: false, strict: true, update: false, watch: false };
    noop(ci);

    const precommit: BettererOptionsStart = { ci: false, precommit: true, strict: true, update: false, watch: false };
    noop(precommit);

    const start: BettererOptionsStart = { ci: false, precommit: false, strict: false, update: false, watch: false };
    noop(start);

    const update: BettererOptionsStart = { ci: false, precommit: false, strict: false, update: true, watch: false };
    noop(update);

    const strict: BettererOptionsStart = { ci: false, precommit: false, strict: true, update: false, watch: false };
    noop(strict);

    // @ts-expect-error `update` cannot be `true` is `strict` is `true`:
    const updateStrictStartError: BettererOptionsStart = { ci: false, strict: true, update: true };
    noop(updateStrictStartError);

    // @ts-expect-error `precommit` cannot be `true` is `ci` is `true`:
    const precommitCIStartError: BettererOptionsStart = { ci: true, precommit: true };
    noop(precommitCIStartError);

    // @ts-expect-error `strict` cannot be `false` is `ci` is `true`:
    const strictCIStartError: BettererOptionsStart = { ci: true, strict: false };
    noop(strictCIStartError);

    // @ts-expect-error `update` cannot be `true` is `ci` is `true`:
    const updateCIStartError: BettererOptionsStart = { ci: true, update: true };
    noop(updateCIStartError);

    // @ts-expect-error `ci` cannot be `true` is `precommit` is `true`:
    const ciPrecommitStartError: BettererOptionsStart = { ci: true, precommit: true };
    noop(ciPrecommitStartError);

    // @ts-expect-error `watch` cannot be `true` is `ci` is `true`:
    const watchCIStartError: BettererOptionsStart = { ci: true, watch: true };
    noop(watchCIStartError);

    // @ts-expect-error `update` cannot be `true` is `precommit` is `true`:
    const updatePrecommitStartError: BettererOptionsStart = { precommit: true, update: true };
    noop(updatePrecommitStartError);

    // @ts-expect-error `watch` cannot be `true` is `precommit` is `true`:
    const watchPrecommitStartError: BettererOptionsStart = { precommit: true, watch: true };
    noop(watchPrecommitStartError);

    // @ts-expect-error `watch` cannot be assigned to `BettererOptionsStart`:
    const watchStartError: BettererOptionsStart = { watch: true };
    noop(watchStartError);

    // @ts-expect-error `ignores` cannot be assigned to `BettererOptionsStart`:
    const ignoresStartError: BettererOptionsStart = { ignores: [] };
    noop(ignoresStartError);

    // @ts-expect-error `ignores` cannot be assigned to `BettererOptionsRunner`:
    const runner: BettererOptionsRunner = { ignores: [] };
    noop(runner);

    // @ts-expect-error `ci` cannot be assigned to `BettererOptionsRunner`:
    const ciRunnerError: BettererOptionsRunner = { ci: true };
    noop(ciRunnerError);

    // @ts-expect-error `precommit` cannot be assigned to `BettererOptionsRunner`:
    const precommitRunnerError: BettererOptionsRunner = { precommit: true };
    noop(precommitRunnerError);

    // @ts-expect-error `strict` cannot be assigned to `BettererOptionsRunner`:
    const strictRunnerError: BettererOptionsRunner = { strict: true };
    noop(strictRunnerError);

    // @ts-expect-error `update` cannot be assigned to `BettererOptionsRunner`:
    const updateRunnerError: BettererOptionsRunner = { update: true };
    noop(updateRunnerError);

    // @ts-expect-error `watch` cannot be assigned to `BettererOptionsRunner`:
    const watchRunnerError: BettererOptionsRunner = { watch: true };
    noop(watchRunnerError);

    const watch: BettererOptionsWatch = { ignores: [], watch: true };
    noop(watch);

    // @ts-expect-error `ci` cannot be assigned to `BettererOptionsWatch`:
    const ciWatchError: BettererOptionsWatch = { ci: true };
    noop(ciWatchError);

    // @ts-expect-error `precommit` cannot be assigned to `BettererOptionsWatch`:
    const precommitWatchError: BettererOptionsWatch = { precommit: true };
    noop(precommitWatchError);

    // @ts-expect-error `strict` cannot be assigned to `BettererOptionsWatch`:
    const strictWatchError: BettererOptionsWatch = { strict: true };
    noop(strictWatchError);

    // @ts-expect-error `update` cannot be assigned to `BettererOptionsWatch`:
    const updateWatchError: BettererOptionsWatch = { update: true };
    noop(updateWatchError);

    // @ts-expect-error `watch: false` cannot be assigned to `BettererOptionsWatch`:
    const watchFalseError: BettererOptionsWatch = { watch: false };
    noop(watchFalseError);
  });
});
