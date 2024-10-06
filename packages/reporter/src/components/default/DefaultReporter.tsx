import type { FC } from '@betterer/render';

import { React, memo } from '@betterer/render';

import { useReporterState } from '../../state/index.js';
import { Suite } from '../suite/index.js';
import { DefaultFiles } from './DefaultFiles.js';

export const DefaultReporter: FC = memo(function DefaultReporter() {
  const state = useReporterState();
  const { context, suiteSummary } = state;

  const suite = state.suite ?? suiteSummary;

  if (!suite) {
    return null;
  }

  return (
    <>
      <DefaultFiles filePaths={suite.filePaths} running={!suiteSummary} />
      <Suite context={context} suite={suite} suiteSummary={suiteSummary} />
    </>
  );
});
