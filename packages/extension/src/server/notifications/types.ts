import { TextDocument } from 'vscode-languageserver-textdocument';

export type BettererValidationNotification = {
  document: TextDocument;
  documentVersion: number | undefined;
};
