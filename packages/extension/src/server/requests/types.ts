import { TextDocumentIdentifier } from 'vscode-languageclient/node';

export type BettererRequestParams = {
  source: TextDocumentIdentifier;
};
