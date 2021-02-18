import { RequestType } from 'vscode-languageserver/node';
import { BettererRequestParams } from './types';

export const BettererNoLibraryRequest = new RequestType<BettererRequestParams, void, void>('betterer/noLibrary');
