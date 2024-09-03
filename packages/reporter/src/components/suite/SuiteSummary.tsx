import type { BettererContext, BettererSuiteSummary } from '@betterer/betterer';
import type { FC, TextProps } from '@betterer/render';

import { React, Box, Text, memo } from '@betterer/render';

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
  unexpectedChanges,
  unexpectedChangesInstructions,
  updateInstructions
} from '../../messages.js';

export interface SuiteSummaryProps {
  context: BettererContext;
  suiteSummary: BettererSuiteSummary;
}

type TestCategories = Exclude<keyof BettererSuiteSummary, 'filePaths' | 'runs' | 'runSummaries'>;

const TEXT_COLOURS: Record<TestCategories, TextProps['color']> = {
  better: 'greenBright',
  changed: 'red',
  completed: 'greenBright',
  expired: 'brightRed',
  failed: 'brightRed',
  new: 'gray',
  ran: 'gray',
  same: 'brightYellow',
  skipped: 'brightYellow',
  updated: 'white',
  worse: 'red'
};

export const SuiteSummary: FC<SuiteSummaryProps> = memo(function SuiteSummary({ context, suiteSummary }) {
  function getColor(name: TestCategories): TextProps['color'] {
    return TEXT_COLOURS[name];
  }

  function showIfHasCategory(name: TestCategories, content: (count: string) => string): React.JSX.Element | null {
    const count = suiteSummary[name].length;
    return count ? <Text color={getColor(name)}>{content(tests(count))}</Text> : null;
  }

  return (
    <>
      <Box flexDirection="column" paddingBottom={1}>
        <Text color={getColor('ran')}>{testChecked(tests(suiteSummary.ran.length))}</Text>
        {showIfHasCategory('new', testNew)}
        {showIfHasCategory('better', testBetter)}
        {showIfHasCategory('completed', testComplete)}
        {showIfHasCategory('same', testSame)}
        {showIfHasCategory('failed', testFailed)}
        {showIfHasCategory('skipped', testSkipped)}
        {showIfHasCategory('updated', testUpdated)}
        {suiteSummary.worse.length ? (
          <>
            <Box paddingBottom={1}>
              <Text color={getColor('worse')}>{testWorse(tests(suiteSummary.worse.length))}</Text>
            </Box>
            {!context.config.strict ? <Text>{updateInstructions()}</Text> : null}
          </>
        ) : null}
        {showIfHasCategory('expired', testExpired)}
      </Box>
      {context.config.ci && suiteSummary.changed.length ? (
        <Box flexDirection="column" paddingBottom={1}>
          <Text color={getColor('changed')}>{unexpectedChanges()}</Text>
          <Box flexDirection="column" padding={1}>
            {suiteSummary.changed.map((name) => (
              <Text key={name}>"{name}"</Text>
            ))}
          </Box>
          <Text color={getColor('changed')}>{unexpectedChangesInstructions()}</Text>
        </Box>
      ) : null}
    </>
  );
});

function tests(n: number): string {
  return `${String(n)} ${n === 1 ? 'test' : 'tests'}`;
}
