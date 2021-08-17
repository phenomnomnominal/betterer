import {
  BettererFileIssue,
  BettererFileIssues,
  BettererFileTestDiff,
  BettererFileTestResult,
  BettererRunSummary,
  BettererSuiteSummary
} from '@betterer/betterer';

import { Diagnostic, DiagnosticSeverity, Connection, Position, TextDocuments } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';

import { EXTENSION_NAME } from '../constants';
import { BettererStatus } from '../status';
import { isString } from '../utils';
import { getRunner, hasBetterer } from './betterer';
import { getBettererConfig, getDebug, getEnabled } from './config';
import { error, info } from './console';
import { BettererInvalidConfigRequest, BettererNoLibraryRequest, isNoConfigError } from './requests';
import { BettererStatusNotification } from './status';

export class BettererValidator {
  constructor(private _connection: Connection, private _documents: TextDocuments<TextDocument>) {}

  public async validate(documents: Array<TextDocument>): Promise<void> {
    const { workspace } = this._connection;

    await getDebug(workspace);

    const folders = await workspace.getWorkspaceFolders();
    if (!folders) {
      return;
    }
    info(`Validator: Folders: ${folders.length.toString()}, Documents: ${documents.length.toString()}`);

    const enabled = await getEnabled(workspace);

    let resolve: () => void;
    const validating = new Promise<void>((res) => (resolve = res));

    folders.map(async (folder) => {
      const { uri } = folder;
      const cwd = getFilePath(uri);
      if (!cwd) {
        return;
      }

      info(`Validator: About to run Betterer.`);

      const extensionCwd = process.cwd();
      const loading = load(this._connection);
      let status = BettererStatus.ok;

      try {
        if (extensionCwd !== cwd) {
          info(`Validator: Setting CWD to "${cwd}".`);
          process.chdir(cwd);
        }

        info(`Validator: Getting Betterer for "${cwd}".`);
        try {
          await hasBetterer(cwd);
        } catch {
          error(`Validator: Betterer isn't installed`);
          void this._connection.sendRequest(BettererNoLibraryRequest, { source: { uri } });
          return;
        }

        info(`Validator: Getting Betterer config.`);
        const config = await getBettererConfig(cwd, workspace);
        info(JSON.stringify(config));
        const runner = await getRunner(cwd, config);

        const validDocuments = documents
          .map((document) => {
            if (!this._documents.get(document.uri)) {
              return;
            }

            const filePath = getFilePath(document);
            if (!filePath) {
              return;
            }

            const { uri } = document;
            if (!enabled) {
              info(`Validator: Betterer disabled, clearing diagnostics for "${uri}".`);
              this._connection.sendDiagnostics({ uri, diagnostics: [] });
              return;
            }

            return document;
          })
          .filter(Boolean) as Array<TextDocument>;

        const filePaths = validDocuments.map((document) => getFilePath(document)) as Array<string>;
        if (filePaths.length) {
          info(`Validator: Running Betterer in "${cwd}".`);
          info(`Validator: Running Betterer on "${JSON.stringify(filePaths)}."`);

          await runner.queue(filePaths, (suiteSummary) => {
            this.report(validDocuments, suiteSummary);
            resolve();
          });
        } else {
          resolve();
        }
      } catch (e) {
        error(`Validator: ${e as string}`);
        if (isNoConfigError(e)) {
          void this._connection.sendRequest(BettererInvalidConfigRequest, { source: { uri } });
          status = BettererStatus.warn;
        } else {
          status = BettererStatus.error;
        }
      } finally {
        if (cwd !== extensionCwd) {
          info(`Validator: Restoring CWD to "${extensionCwd}".`);
          process.chdir(extensionCwd);
        }
      }

      await loading();
      this._connection.sendNotification(BettererStatusNotification, status);
    });

    return validating;
  }

  public report(documents: Array<TextDocument>, suiteSummary: BettererSuiteSummary): void {
    documents.forEach((document) => {
      const filePath = getFilePath(document);
      if (!filePath) {
        return;
      }

      const { uri } = document;
      const diagnostics: Array<Diagnostic> = [];
      info(`Validator: Clearing diagnostics for "${uri}".`);
      this._connection.sendDiagnostics({ uri, diagnostics });

      suiteSummary.runs.forEach((run: BettererRunSummary) => {
        if (run.isFailed) {
          return;
        }

        const result = run.result.value as BettererFileTestResult;
        if (!result) {
          return;
        }

        let issues: BettererFileIssues;
        try {
          issues = result.getIssues(filePath);
        } catch (e) {
          info(JSON.stringify((e as Error).message));
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
          const fileDiff = (run.diff as unknown as BettererFileTestDiff).diff[filePath];
          info(`Validator: ${run.name} got diff from Betterer for "${filePath}"`);
          existingIssues = fileDiff.existing || [];
          newIssues = fileDiff.new || [];
        }

        info(`Validator: ${run.name} got "${existingIssues.length}" existing issues for "${filePath}"`);
        info(`Validator: ${run.name} got "${newIssues.length}" new issues for "${filePath}"`);

        existingIssues.forEach((issue: BettererFileIssue) => {
          diagnostics.push(createWarning(run.name, 'existing issue', issue, document));
        });
        newIssues.forEach((issue) => {
          diagnostics.push(createError(run.name, 'new issue', issue, document));
        });
      });

      info(`Validator: Sending ${diagnostics.length} diagnostics to "${uri}".`);
      this._connection.sendDiagnostics({ uri, diagnostics });
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
function load(connection: Connection): () => Promise<void> {
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
