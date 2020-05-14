import {
  BettererFileTest,
  BettererFiles,
  BettererFileIssuesRaw,
  BettererFileIssuesDeserialised,
  BettererFile
} from '@betterer/betterer';
import { IConnection, TextDocuments, Diagnostic, DiagnosticSeverity, Position } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';

import { EXTENSION_NAME } from '../constants';
import { BettererStatus } from '../status';
import { isString } from '../utils';
import { getLibrary, BettererLibrary } from './betterer';
import { getEnabled } from './config';
import { BettererInvalidConfigRequest, isNoConfigError, BettererNoLibraryRequest } from './requests';
import { BettererStatusNotification } from './status';

export class BettererValidator {
  constructor(private _connection: IConnection, private _documents: TextDocuments<TextDocument>) {}

  public async single(document: TextDocument): Promise<void> {
    if (!this._documents.get(document.uri)) {
      return Promise.resolve();
    }

    const folders = await this._connection.workspace.getWorkspaceFolders();
    folders?.map(async (folder) => {
      const uri = document.uri;

      const enabled = await getEnabled(this._connection.workspace);
      if (!enabled) {
        this._connection.sendDiagnostics({ uri, diagnostics: [] });
        return Promise.resolve();
      }

      const cwd = getFilePath(folder.uri);
      const filePath = getFilePath(document);

      let betterer: BettererLibrary | null = null;
      if (cwd) {
        try {
          betterer = await getLibrary(cwd);
        } catch {
          this._connection.sendRequest(BettererNoLibraryRequest, { source: { uri: document.uri } });
          return;
        }
      }

      if (cwd && filePath && betterer) {
        const diagnostics: Array<Diagnostic> = [];

        try {
          const runs = await betterer.single({ cwd }, filePath);

          runs
            .filter((run) => !run.isFailed)
            .filter((run) => (run.result as BettererFiles).getFile(filePath))
            .map((run) => {
              const test = run.test as BettererFileTest;
              const files = run.result as BettererFiles;
              const file = files.getFile(filePath) as BettererFile;

              const fileDiff = test?.diff?.[file.relativePath];
              let existingIssues: BettererFileIssuesDeserialised = [];
              let newIssues: BettererFileIssuesRaw = [];

              if (fileDiff) {
                existingIssues = fileDiff.existing || [];
                newIssues = fileDiff.neww || [];
              } else if (run.isNew) {
                newIssues = file.issuesRaw;
              } else if (run.isSkipped || run.isSame) {
                existingIssues = file.issuesDeserialised;
              }

              existingIssues.forEach((issue) => {
                const { message } = issue;
                const { line, column, length } = issue;
                const start = { line, character: column };
                const end = document.positionAt(document.offsetAt(start) + length);
                const timestamp = new Date(run.timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                const code = `since ${timestamp}`;
                diagnostics.push(createDiagnostic(test.name, start, end, message, code, DiagnosticSeverity.Warning));
              });
              newIssues.forEach((issue) => {
                const { message } = issue;
                const start = document.positionAt(issue.start);
                const end = document.positionAt(issue.end);
                const code = 'new issue';
                diagnostics.push(createDiagnostic(test.name, start, end, message, code, DiagnosticSeverity.Error));
              });
            });
          this._connection.sendDiagnostics({ uri, diagnostics });
          this._connection.sendNotification(BettererStatusNotification, BettererStatus.ok);
        } catch (e) {
          if (isNoConfigError(e)) {
            this._connection.sendRequest(BettererInvalidConfigRequest, { source: { uri: document.uri } });
            this._connection.sendNotification(BettererStatusNotification, BettererStatus.warn);
          }
        }
      }
    });
  }
}

function createDiagnostic(
  name: string,
  start: Position,
  end: Position,
  message: string,
  code: string,
  severity: DiagnosticSeverity
): Diagnostic {
  const range = { start, end };
  return {
    message,
    severity,
    source: EXTENSION_NAME,
    range,
    code: `[${name}] - ${code}`
  };
}

function getFilePath(documentOrUri: URI | TextDocument | string): string | null {
  if (!documentOrUri) {
    return null;
  }
  let uri = null;
  if (documentOrUri instanceof URI) {
    uri = documentOrUri;
  } else if (isString(documentOrUri)) {
    uri = URI.parse(documentOrUri);
  } else {
    uri = URI.parse(documentOrUri.uri);
  }
  if (uri.scheme !== 'file') {
    return null;
  }
  return uri.fsPath;
}
