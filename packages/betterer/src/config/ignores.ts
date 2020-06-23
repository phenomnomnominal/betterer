import * as findUp from 'find-up';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parse = require('gitignore-globs') as (gitignore: string) => Array<string>;

const BETTERERIGNORE = '.bettererignore';
const GITIGNORE = '.gitignore';

export async function getIgnores(): Promise<Array<string>> {
  const bettererignorePath = await findUp(BETTERERIGNORE);
  if (bettererignorePath) {
    return parse(bettererignorePath);
  }
  const gitignorePath = await findUp(GITIGNORE);
  if (gitignorePath) {
    return parse(gitignorePath);
  }
  return [];
}
