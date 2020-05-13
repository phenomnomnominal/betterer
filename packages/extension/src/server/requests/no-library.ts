import { RequestType } from 'vscode-languageserver';
import { BettererRequestParams } from './types';

export const BettererNoLibraryRequest = new RequestType<BettererRequestParams, void, void, void>('betterer/noLibrary');
