import {
  BettererFileIssue,
  BettererFileIssues,
  BettererFileTestDiff,
  BettererFileTestResult
} from '@betterer/betterer';
import assert from 'assert';
import { Diagnostic, DiagnosticSeverity, IConnection, Position, TextDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';

import { info } from './console';
import { EXTENSION_NAME } from '../constants';
import { BettererStatus } from '../status';
import { isString } from '../utils';
import { BettererLibrary, getLibrary } from './betterer';
import { getBettererConfig, getEnabled } from './config';
import { BettererInvalidConfigRequest, BettererNoLibraryRequest, isNoConfigError } from './requests';
import { BettererStatusNotification } from './status';

export class BettererValidator {
  constructor(private _connection: IConnection, private _documents: TextDocuments<TextDocument>) {}

  public async validate(document: TextDocument): Promise<void> {
    const { workspace } = this._connection;
    if (!this._documents.get(document.uri)) {
      return Promise.resolve();
    }

    const folders = await workspace.getWorkspaceFolders();
    folders?.map(async (folder) => {
      const uri = document.uri;

      const enabled = await getEnabled(workspace);
      if (!enabled) {
        info(`Validator: Betterer disabled, clearing diagnostics for "${uri}".`);
        this._connection.sendDiagnostics({ uri, diagnostics: [] });
        return Promise.resolve();
      }

      const cwd = getFilePath(folder.uri);
      const filePath = getFilePath(document);
      assert(filePath);

      info(`Validator: Getting Betterer for "${filePath}".`);
      let betterer: BettererLibrary | null = null;
      if (cwd) {
        try {
          betterer = await getLibrary(cwd);
        } catch {
          void this._connection.sendRequest(BettererNoLibraryRequest, { source: { uri: document.uri } });
          return;
        }
      }

      if (cwd && filePath && betterer) {
        const diagnostics: Array<Diagnostic> = [];
        info(`Validator: About to run Betterer, clearing diagnostics for "${uri}".`);
        this._connection.sendDiagnostics({ uri, diagnostics });

        const loading = load(this._connection);
        let status = BettererStatus.ok;
        const extensionCwd = process.cwd();
        try {
          info(`Validator: Setting CWD to "${cwd}".`);
          process.chdir(cwd);

          info(`Validator: Getting Betterer config.`);
          const config = await getBettererConfig(workspace);

          info(`Validator: Running Betterer for "${filePath}".`);
          process.env.DEBUG = '1';
          process.env.DEBUG_TIME = '1';
          process.env.DEBUG_VALUES = '1';
          const { runs } = await betterer.file(filePath, { ...config, cwd });

          runs.forEach((run) => {
            if (run.isFailed) {
              return;
            }

            const result = run.result.result as BettererFileTestResult;
            if (!result) {
              return;
            }

            const issues = result.getIssues(filePath);
            if (!issues) {
              return;
            }

            info(`Validator: Got issues from Betterer for "${run.name}"`);

            let existingIssues: BettererFileIssues = [];
            let newIssues: BettererFileIssues = [];

            if (run.isNew) {
              newIssues = issues;
            } else if (run.isSkipped || run.isSame) {
              existingIssues = issues;
            } else {
              const fileDiff = ((run.diff as unknown) as BettererFileTestDiff).diff[filePath];
              info(`Validator: Got diff from Betterer for "${filePath}"`);
              existingIssues = fileDiff.existing || [];
              newIssues = fileDiff.new || [];
            }

            info(`Validator: Got "${existingIssues.length}" existing issues for "${filePath}"`);
            info(`Validator: Got "${newIssues.length}" new issues for "${filePath}"`);

            existingIssues.forEach((issue: BettererFileIssue) => {
              diagnostics.push(createWarning(run.name, 'existing issue', issue, document));
            });
            newIssues.forEach((issue) => {
              diagnostics.push(createError(run.name, 'new issue', issue, document));
            });
          });
          this._connection.sendDiagnostics({ uri, diagnostics });
        } catch (e) {
          if (isNoConfigError(e)) {
            void this._connection.sendRequest(BettererInvalidConfigRequest, { source: { uri: document.uri } });
            status = BettererStatus.warn;
          } else {
            status = BettererStatus.error;
          }
        } finally {
          info(`Validator: Restoring CWD to "${extensionCwd}".`);
          process.chdir(extensionCwd);
        }
        await loading();
        this._connection.sendNotification(BettererStatusNotification, status);
      }
    });
  }
}

function createDiagnostic(
  name: string,
  issue: BettererFileIssue,
  extra: string,
  document: TextDocument,
  severity: DiagnosticSeverity
): Diagnostic {
  const { line, column, length, message } = issue;
  let start: Position | null = null;
  let end: Position | null = null;
  start = { line, character: column };
  end = document.positionAt(document.offsetAt(start) + length);
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

function createError(name: string, extra: string, issue: BettererFileIssue, document: TextDocument): Diagnostic {
  return createDiagnostic(name, issue, extra, document, DiagnosticSeverity.Error);
}

function createWarning(name: string, extra: string, issue: BettererFileIssue, document: TextDocument): Diagnostic {
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
