import type { TextDocumentIdentifier } from 'vscode-languageclient/node';

export interface BettererRequestParams {
  source: TextDocumentIdentifier;
}
