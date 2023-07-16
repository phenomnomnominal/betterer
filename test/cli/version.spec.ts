import type { BettererPackageJSON } from '@betterer/cli';

import { execSync } from 'node:child_process';
import path from 'node:path';

describe('betterer cli', () => {
  it('should print the version', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- migrating away from CJS requires
    const { version } = require('../../packages/cli/package.json') as BettererPackageJSON;

    const binPath = path.resolve(__dirname, '../../packages/cli/bin/betterer');
    const result = execSync(`node "${binPath}" -V`);

    expect(result.toString()).toContain(version);
  });
});
