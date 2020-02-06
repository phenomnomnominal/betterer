import {
  IConnection,
  TextDocument,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  Position
} from 'vscode-languageserver';
import { URI } from 'vscode-uri';

import { getLibrary } from './betterer';
import { EXTENSION_NAME } from '../constants';
import { getEnabled, getPackageManager } from './config';

import { BettererFiles, betterer } from '@betterer/betterer';

type Betterer = typeof betterer;

export class Validator {
  private _betterer: Betterer | null = null;
  constructor(private _connection: IConnection, private _documents: TextDocuments) {
    //
  }

  public async single(document: TextDocument): Promise<void> {
    // We validate document in a queue but open / close documents directly. So we need to deal with the
    // fact that a document might be gone from the server.
    if (!this._documents.get(document.uri)) {
      return Promise.resolve();
    }

    const enabled = await getEnabled(this._connection.workspace, document.uri);
    if (!enabled) {
      return Promise.resolve();
    }

    const packageManager = await getPackageManager(this._connection.workspace, document.uri);

    const folders = await this._connection.workspace.getWorkspaceFolders();
    folders?.map(async folder => {
      this._betterer = await getLibrary(folder.uri, packageManager);

      const uri = document.uri;
      const file = getFilePath(document);
      if (file) {
        const runs = await this._betterer({ cwd: '' }, file);
        const diagnostics: Array<Diagnostic> = [];
        runs.forEach(run => {
          try {
            const { test, result } = run;
            const [file] = (result as BettererFiles).files;
            const { fileMarks } = file;
            fileMarks.forEach(fileMark => {
              const [line, column, length, message] = fileMark;
              const start = { line, character: column };
              const startOffset = document.offsetAt(start);
              const end = document.positionAt(startOffset + length);
              diagnostics.push(createDiagnostic(test.name, start, end, message));
            });
          } catch {
            //
          }
        });
        this._connection.sendDiagnostics({ uri, diagnostics });
      }
    });
  }
}

function createDiagnostic(name: string, start: Position, end: Position, message: string): Diagnostic {
  return {
    message,
    severity: DiagnosticSeverity.Warning,
    source: 'betterer',
    range: {
      start,
      end
    },
    code: `${EXTENSION_NAME} - [${name}]`
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
