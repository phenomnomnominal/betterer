import React, { FC, memo } from 'react';

import { BettererContext, BettererSuiteSummary } from '@betterer/betterer';
import { diffΔ } from '@betterer/logger';
import { Box, Text, TextProps } from 'ink';

import {
  testBetter,
  testChecked,
  testComplete,
  testExpired,
  testFailed,
  testNew,
  testSame,
  testSkipped,
  testUpdated,
  testWorse,
  unexpectedDiff,
  updateInstructions
} from '../../messages';
import { quote } from '../../utils';

export type SuiteSummaryProps = {
  context: BettererContext;
  suiteSummary: BettererSuiteSummary;
};

const TEXT_COLOURS: Record<string, TextProps['color']> = {
  better: 'greenBright',
  checked: 'gray',
  completed: 'greenBright',
  diff: 'red',
  expired: 'brightRed',
  failed: 'brightRed',
  new: 'gray',
  obsolete: 'brightRed',
  same: 'brightYellow',
  skipped: 'brightYellow',
  updated: 'gray',
  worse: 'red'
};

export const SuiteSummary: FC<SuiteSummaryProps> = memo(function SuiteSummary({ context, suiteSummary }) {
  const better = suiteSummary.better.length;
  const failed = suiteSummary.failed.length;
  const neww = suiteSummary.new.length;
  const ran = suiteSummary.ran.length;
  const same = suiteSummary.same.length;
  const skipped = suiteSummary.skipped.length;
  const updated = suiteSummary.updated.length;
  const worse = suiteSummary.worse.length;
  const { completed, expired } = suiteSummary;

  return (
    <>
      <Box flexDirection="column" paddingBottom={1}>
        <Text color={TEXT_COLOURS.checked}>{testChecked(tests(ran))}</Text>
        {expired.map((run, index) => (
          <Text key={index} color={TEXT_COLOURS.expired}>
            {testExpired(quote(run.name))})
          </Text>
        ))}
        {failed ? <Text color={TEXT_COLOURS.failed}>{testFailed(tests(failed))}</Text> : null}
        {neww ? <Text color={TEXT_COLOURS.new}>{testNew(tests(neww))}</Text> : null}
        {better ? <Text color={TEXT_COLOURS.better}>{testBetter(tests(better))}</Text> : null}
        {completed.map((run, index) => (
          <Text key={index} color={TEXT_COLOURS.completed}>
            {testComplete(quote(run.name))}
          </Text>
        ))}
        {same ? <Text color={TEXT_COLOURS.same}>{testSame(tests(same))}</Text> : null}
        {skipped ? <Text color={TEXT_COLOURS.skipped}>{testSkipped(tests(skipped))}</Text> : null}
        {updated ? <Text color={TEXT_COLOURS.updated}>{testUpdated(tests(updated))}</Text> : null}
        {worse ? (
          <>
            <Box paddingBottom={1}>
              <Text color={TEXT_COLOURS.worse}>{testWorse(tests(worse))}</Text>
            </Box>
            {!context.config.strict && <Text>{updateInstructions()}</Text>}
          </>
        ) : null}
      </Box>
      {suiteSummary.unexpectedDiff ? (
        <Box flexDirection="column" paddingBottom={1}>
          <Text color={TEXT_COLOURS.diff}>{unexpectedDiff()}</Text>
          <Text>{diffΔ(suiteSummary.expected, suiteSummary.result)}</Text>
        </Box>
      ) : null}
    </>
  );
});

function tests(n: number): string {
  return n === 1 ? `${n} test` : `${n} tests`;
}
