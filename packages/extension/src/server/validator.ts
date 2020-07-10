import {
  BettererFileTest,
  BettererFiles,
  BettererFileIssuesRaw,
  BettererFileIssueRaw,
  BettererFileIssueDeserialised,
  BettererFileIssues
} from '@betterer/betterer';
import * as assert from 'assert';
import { IConnection, TextDocuments, Diagnostic, DiagnosticSeverity, Position } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';

import { EXTENSION_NAME } from '../constants';
import { BettererStatus } from '../status';
import { isString } from '../utils';
import { getLibrary, BettererLibrary } from './betterer';
import { getEnabled, getBettererConfig } from './config';
import { BettererInvalidConfigRequest, isNoConfigError, BettererNoLibraryRequest } from './requests';
import { BettererStatusNotification } from './status';

export class BettererValidator {
  constructor(private _connection: IConnection, private _documents: TextDocuments<TextDocument>) {}

  public async single(document: TextDocument): Promise<void> {
    const { workspace } = this._connection;
    if (!this._documents.get(document.uri)) {
      return Promise.resolve();
    }

    const folders = await workspace.getWorkspaceFolders();
    folders?.map(async (folder) => {
      const uri = document.uri;

      const enabled = await getEnabled(workspace);
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
        this._connection.sendDiagnostics({ uri, diagnostics });

        const loading = load(this._connection);
        let status = BettererStatus.ok;
        const extensionCwd = process.cwd();
        try {
          process.chdir(cwd);
          const config = await getBettererConfig(workspace);
          const runs = await betterer.single({ ...config, cwd }, filePath);

          runs
            .filter((run) => !run.isFailed)
            .filter((run) => (run.result as BettererFiles).getFile(filePath))
            .map((run) => {
              const test = run.test as BettererFileTest;
              const files = run.result as BettererFiles;
              const file = files.getFile(filePath);
              assert(file);

              const fileDiff = test?.diff?.[file.relativePath];
              let existingIssues: BettererFileIssues = [];
              let newIssues: BettererFileIssuesRaw = [];

              if (fileDiff) {
                existingIssues = fileDiff.existing || [];
                newIssues = fileDiff.neww || [];
              } else if (run.isNew) {
                newIssues = file.issuesRaw;
              } else if (run.isSkipped || run.isSame) {
                existingIssues = file.issuesRaw;
              }
              existingIssues.forEach((issue: BettererFileIssueRaw | BettererFileIssueDeserialised) => {
                diagnostics.push(createWarning(test.name, 'existing issue', issue, document));
              });
              newIssues.forEach((issue) => {
                diagnostics.push(createError(test.name, 'new issue', issue, document));
              });
            });
          this._connection.sendDiagnostics({ uri, diagnostics });
        } catch (e) {
          if (isNoConfigError(e)) {
            this._connection.sendRequest(BettererInvalidConfigRequest, { source: { uri: document.uri } });
            status = BettererStatus.warn;
          } else {
            status = BettererStatus.error;
          }
        } finally {
          process.chdir(extensionCwd);
        }
        await loading();
        this._connection.sendNotification(BettererStatusNotification, status);
      }
    });
  }
}

function isRaw(issue: BettererFileIssueRaw | BettererFileIssueDeserialised): issue is BettererFileIssueRaw {
  return (issue as BettererFileIssueRaw).fileText != null;
}

function createDiagnostic(
  name: string,
  issue: BettererFileIssueRaw | BettererFileIssueDeserialised,
  extra: string,
  document: TextDocument,
  severity: DiagnosticSeverity
): Diagnostic {
  const { message } = issue;
  let start: Position | null = null;
  let end: Position | null = null;
  if (isRaw(issue)) {
    start = document.positionAt(issue.start);
    end = document.positionAt(issue.end);
  } else {
    const { line, column, length } = issue;
    start = { line, character: column };
    end = document.positionAt(document.offsetAt(start) + length);
  }
  const range = { start, end };
  const code = `[${name}]${extra ? ` - ${extra}` : ''}`;
  return {
    message,
    severity,
    source: EXTENSION_NAME,
    range,
    code
  };
}

function createError(
  name: string,
  extra: string,
  issue: BettererFileIssueRaw | BettererFileIssueDeserialised,
  document: TextDocument
): Diagnostic {
  return createDiagnostic(name, issue, extra, document, DiagnosticSeverity.Error);
}

function createWarning(
  name: string,
  extra: string,
  issue: BettererFileIssueRaw | BettererFileIssueDeserialised,
  document: TextDocument
): Diagnostic {
  return createDiagnostic(name, issue, extra, document, DiagnosticSeverity.Warning);
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

const LOADING_DELAY_TIME = 200;
const MINIMUM_LOADING_TIME = 1000;
function load(connection: IConnection): () => Promise<void> {
  let isLoading = false;
  const loading = setTimeout(() => {
    isLoading = true;
    connection.sendNotification(BettererStatusNotification, BettererStatus.running);
  }, LOADING_DELAY_TIME);
  return async (): Promise<void> => {
    if (isLoading) {
      return new Promise((resolve) => {
        setTimeout(resolve, MINIMUM_LOADING_TIME);
      });
    }
    clearTimeout(loading);
  };
}
