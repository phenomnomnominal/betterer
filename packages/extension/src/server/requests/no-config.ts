// import { RequestType, TextDocumentIdentifier } from 'vscode-languageserver';

// type NoConfigParams = {
//   document: TextDocumentIdentifier;
// };
// type NoConfigResult = {};

// export const NoConfigRequest = new RequestType<NoConfigParams, NoConfigResult, void, void>('betterer/noConfig');

// function isNoConfigFoundError(error: any): boolean {
//   const candidate = error as BettererError;
//   return candidate.messageTemplate === 'no-config-found' || candidate.message === 'No Betterer configuration found.';
// }

// function tryHandleNoConfig(error: any, document: TextDocument, library: BettererModule): Status | undefined {
//   connection
//     .sendRequest(NoConfigRequest.type, {
//       message: getMessage(error, document),
//       document: {
//         uri: document.uri
//       }
//     })
//     .then(undefined, () => { });
//   return Status.warn;
// }
