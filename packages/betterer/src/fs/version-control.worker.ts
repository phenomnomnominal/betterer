import { exposeWorker } from '@betterer/worker';
import { BettererGitΩ } from './git.js';

export const versionControl = new BettererGitΩ();

exposeWorker(versionControl);
