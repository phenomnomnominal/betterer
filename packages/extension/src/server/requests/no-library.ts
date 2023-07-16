import type { BettererRequestParams } from './types.js';

import { RequestType } from 'vscode-languageserver/node';

export const BettererNoLibraryRequest = new RequestType<BettererRequestParams, void, void>('betterer/noLibrary');
