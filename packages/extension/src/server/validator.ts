import { IConnection, TextDocuments, Diagnostic, DiagnosticSeverity, Position } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';

import { getLibrary } from './betterer';
import { EXTENSION_NAME } from '../constants';
import { getEnabled } from './config';

import { BettererFiles, betterer } from '@betterer/betterer';
import { StatusNotification, Status } from './status';

type Betterer = typeof betterer;

export class Validator {
  private _betterer: Betterer | null = null;

  constructor(private _connection: IConnection, private _documents: TextDocuments<TextDocument>) { }

  public async single(document: TextDocument): Promise<void> {
    // We validate document in a queue but open / close documents directly. So we need to deal with the
    // fact that a document might be gone from the server.
    if (!this._documents.get(document.uri)) {
      return Promise.resolve();
    }

    const enabled = await getEnabled(this._connection.workspace);
    if (!enabled) {
      return Promise.resolve();
    }

    const folders = await this._connection.workspace.getWorkspaceFolders();
    folders?.map(async (folder) => {
      const uri = document.uri;

      const cwd = getFilePath(folder.uri);
      const file = getFilePath(document);

      if (cwd && file) {
        const diagnostics: Array<Diagnostic> = [];
        this._betterer = await getLibrary(cwd);
        const runs = await this._betterer({ cwd }, file);
        runs.forEach((run) => {
          try {
            const { test, result } = run;
            debugger;
            const [file] = (result as BettererFiles).files;
            const { fileIssues } = file;
            fileIssues.forEach((fileIssue) => {
              const [line, column, length, message] = fileIssue;
              const start = { line, character: column };
              const startOffset = document.offsetAt(start);
              const end = document.positionAt(startOffset + length);
              diagnostics.push(createDiagnostic(test.name, start, end, message, DiagnosticSeverity.Warning));
            });
          } catch {
            //
          }
        });
        this._connection.sendDiagnostics({ uri, diagnostics });
        this._connection.sendNotification(StatusNotification, { state: Status.ok });
      }
    });
  }
}

function createDiagnostic(name: string, start: Position, end: Position, message: string, severity: DiagnosticSeverity): Diagnostic {
  return {
    message,
    severity,
    source: EXTENSION_NAME,
    range: {
      start,
      end,
    },
    code: `[${name}]`,
  };
}

function getFilePath(documentOrUri: URI | TextDocument | string): string | null {
  if (!documentOrUri) {
    return null;
  }
  let uri = null;
  if (documentOrUri instanceof URI) {
    uri = documentOrUri;
  } else if (typeof documentOrUri === 'string') {
    uri = URI.parse(documentOrUri);
  } else {
    uri = URI.parse(documentOrUri.uri);
  }
  if (uri.scheme !== 'file') {
    return null;
  }
  return uri.fsPath;
}
