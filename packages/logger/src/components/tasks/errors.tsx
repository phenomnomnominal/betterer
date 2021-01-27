import { BettererError } from '@betterer/errors';
import React, { FC } from 'react';

import { BettererTaskError } from './error';

export type BettererTaskErrorsProps = {
  errors: Array<Error | BettererError>;
};

let errorCount = 0;

export const BettererTaskErrors: FC<BettererTaskErrorsProps> = function BettererErrors({ errors }) {
  return (
    <>
      {errors.map((error) => (
        <BettererTaskError key={errorCount++} error={error} />
      ))}
    </>
  );
};
