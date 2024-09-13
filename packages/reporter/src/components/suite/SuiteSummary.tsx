import type { BettererContext, BettererSuiteSummary } from '@betterer/betterer';
import type { FC, TextProps } from '@betterer/render';

import { React, Box, Text, memo } from '@betterer/render';

import {
  testsBetter,
  testsChecked,
  testsComplete,
  testsExpired,
  testsFailed,
  testsNew,
  testsObsolete,
  testsRemoved,
  testsSame,
  testsSkipped,
  testsUpdated,
  testsWorse,
  unexpectedChanges,
  unexpectedChangesInstructions,
  updateInstructionsWorse,
  updateInstructionsObsolete
} from '../../messages.js';

/** @knipignore used by an exported function */
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
  obsolete: 'magentaBright',
  ran: 'gray',
  removed: 'white',
  same: 'brightYellow',
  skipped: 'brightYellow',
  updated: 'white',
  worse: 'red'
};

export const SuiteSummary: FC<SuiteSummaryProps> = memo(function SuiteSummary({ context, suiteSummary }) {
  function getColor(name: TestCategories): TextProps['color'] {
    return TEXT_COLOURS[name];
  }

  function showIfHasCategory(name: TestCategories, getMessage: (count: number) => string): React.JSX.Element | null {
    const count = suiteSummary[name].length;
    return count ? <Text color={getColor(name)}>{getMessage(count)}</Text> : null;
  }

  return (
    <>
      <Box flexDirection="column" paddingBottom={1}>
        <Text color={getColor('ran')}>{testsChecked(suiteSummary.ran.length)}</Text>
        {showIfHasCategory('new', testsNew)}
        {showIfHasCategory('better', testsBetter)}
        {showIfHasCategory('completed', testsComplete)}
        {showIfHasCategory('same', testsSame)}
        {showIfHasCategory('failed', testsFailed)}
        {showIfHasCategory('skipped', testsSkipped)}
        {showIfHasCategory('updated', testsUpdated)}
        {suiteSummary.worse.length ? (
          <>
            <Box paddingBottom={1}>
              <Text color={getColor('worse')}>{testsWorse(suiteSummary.worse.length)}</Text>
            </Box>
            {!context.config.strict ? <Text>{updateInstructionsWorse()}</Text> : null}
          </>
        ) : null}
        {showIfHasCategory('removed', testsRemoved)}
        {suiteSummary.obsolete.length ? (
          <>
            <Box paddingBottom={1}>
              <Text color={getColor('obsolete')}>{testsObsolete(suiteSummary.obsolete.length)}</Text>
            </Box>
            {<Text>{updateInstructionsObsolete()}</Text>}
          </>
        ) : null}
        {showIfHasCategory('expired', testsExpired)}
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
