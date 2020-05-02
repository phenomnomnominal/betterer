import { RequestType, TextDocumentIdentifier } from 'vscode-languageserver';

type NoBettererLibraryParams = {
  source: TextDocumentIdentifier;
};
type NoBettererLibraryResult = {};

export const NoBettererLibraryRequest = new RequestType<NoBettererLibraryParams, NoBettererLibraryResult, void, void>(
  'betterer/noLibrary'
);
