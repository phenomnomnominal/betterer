import React, { FC, memo } from 'react';

import { BettererSummary } from '@betterer/betterer';
import { diffΔ } from '@betterer/logger';
import { Box, Text, TextProps } from 'ink';

import {
  testBetterΔ,
  testCheckedΔ,
  testCompleteΔ,
  testExpiredΔ,
  testFailedΔ,
  testNewΔ,
  testObsoleteΔ,
  testSameΔ,
  testSkippedΔ,
  testUpdatedΔ,
  testWorseΔ,
  unexpectedDiffΔ,
  updateInstructionsΔ
} from '../../messages';
import { quoteΔ } from '../../utils';

export type RunSummaryProps = {
  summary: BettererSummary;
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

export const RunSummary: FC<RunSummaryProps> = memo(function RunSummary({ summary }) {
  const better = summary.better.length;
  const failed = summary.failed.length;
  const neww = summary.new.length;
  const ran = summary.ran.length;
  const same = summary.same.length;
  const skipped = summary.skipped.length;
  const updated = summary.updated.length;
  const worse = summary.worse.length;
  const { completed, expired, obsolete } = summary;

  return (
    <>
      <Box flexDirection="column" paddingBottom={1}>
        <Text color={TEXT_COLOURS.checked}>{testCheckedΔ(tests(ran))}</Text>
        {expired.map((run, index) => (
          <Text key={index} color={TEXT_COLOURS.expired}>
            {testExpiredΔ(quoteΔ(run.name))})
          </Text>
        ))}
        {failed ? <Text color={TEXT_COLOURS.failed}>{testFailedΔ(tests(failed))}</Text> : null}
        {neww ? <Text color={TEXT_COLOURS.new}>{testNewΔ(tests(neww))}</Text> : null}
        {obsolete.map((run, index) => (
          <Text key={index} color={TEXT_COLOURS.obsolete}>
            {testObsoleteΔ(quoteΔ(run.name))})
          </Text>
        ))}
        {better ? <Text color={TEXT_COLOURS.better}>{testBetterΔ(tests(better))}</Text> : null}
        {completed.map((run, index) => (
          <Text key={index} color={TEXT_COLOURS.completed}>
            {testCompleteΔ(quoteΔ(run.name))})
          </Text>
        ))}
        {same ? <Text color={TEXT_COLOURS.same}>{testSameΔ(tests(same))}</Text> : null}
        {skipped ? <Text color={TEXT_COLOURS.skipped}>{testSkippedΔ(tests(skipped))}</Text> : null}
        {updated ? <Text color={TEXT_COLOURS.updated}>{testUpdatedΔ(tests(updated))}</Text> : null}
        {worse ? (
          <>
            <Box paddingBottom={1}>
              <Text color={TEXT_COLOURS.worse}>{testWorseΔ(tests(worse))}</Text>
            </Box>
            <Text>{updateInstructionsΔ()}</Text>
          </>
        ) : null}
      </Box>
      {summary.hasDiff ? (
        <Box flexDirection="column" paddingBottom={1}>
          <Text color={TEXT_COLOURS.diff}>{unexpectedDiffΔ()}</Text>
          <Text>{diffΔ(summary.expected, summary.result)}</Text>
        </Box>
      ) : null}
    </>
  );
});

function tests(n: number): string {
  return n === 1 ? `${n} test` : `${n} tests`;
}