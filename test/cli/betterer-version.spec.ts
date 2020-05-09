import { execSync } from 'child_process';
import * as path from 'path';

describe('betterer cli', () => {
  it('should print the version', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { version } = require('../../packages/cli/package.json');

    const binPath = path.resolve(__dirname, '../../packages/cli/bin/betterer');
    const result = execSync(`${binPath} -V`);

    expect(result.toString()).toContain(version);
  });
});
