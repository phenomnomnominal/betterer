import { mute } from '@betterer/logger';

mute();

Date['now'] = function(): number {
  return 0;
}.bind(Date);

jest.setTimeout(100000);
