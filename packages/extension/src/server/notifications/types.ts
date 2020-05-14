import { TextDocument } from 'vscode-languageserver-textdocument';

export type BettererValidationNotification = {
  method: string;
  document: TextDocument;
  documentVersion: number | undefined;
};

export type BettererVersionProvider = {
  (params: TextDocument): number | undefined;
};
