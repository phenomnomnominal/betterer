import { BettererReporter, BettererRunSummary, BettererSuite } from '@betterer/betterer';

import { Connection, TextDocuments } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { BettererStatus } from '../status';
import { getRunner, hasBetterer } from './betterer';
import { getBettererConfig, getDebug, getEnabled } from './config';
import { error, info } from './console';
import { BettererInvalidConfigRequest, BettererNoLibraryRequest, isNoConfigError } from './requests';
import { BettererStatusNotification } from './status';
import { BettererDiagnostics } from './diagnostics';
import { getFilePath } from './path';

export class BettererValidator {
  private _diagnostics = new BettererDiagnostics();

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

    await Promise.all(
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

          const finalDocuments = validDocuments.filter((document) => {
            const filePath = getFilePath(document) as string;
            const isCachePath = filePath === config.cachePath;
            const isResultPath = filePath === config.resultsPath;
            const isConfigPath = !!config.configPaths?.includes(filePath);
            const isTSConfigPath = filePath === config.tsconfigPath;
            return !(isCachePath || isResultPath || isConfigPath || isTSConfigPath);
          });

          const filePaths = finalDocuments.map((document) => getFilePath(document)) as Array<string>;

          if (finalDocuments.length) {
            info(`Validator: Running Betterer in "${cwd}".`);
            info(`Validator: Running Betterer on "${JSON.stringify(filePaths)}."`);

            const runner = await getRunner(config);
            runner.options({
              reporters: [
                {
                  suiteStart: (suite: BettererSuite): void => {
                    this._diagnostics.prepare(suite);
                  },
                  runEnd: (runSummary: BettererRunSummary): void => {
                    this.report(finalDocuments, runSummary);
                  }
                }
              ]
            });

            try {
              await runner.queue(filePaths);
            } catch (e) {
              error(`Validator: Error running Betterer on "${JSON.stringify(filePaths)}." - ${e as string}`);
            }
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
      })
    );
  }

  public report(documents: Array<TextDocument>, runSummary: BettererRunSummary): void {
    documents.forEach((document) => {
      const diagnostics = this._diagnostics.getDiagnostics(document, runSummary);
      info(`Validator: Sending ${diagnostics.length.toString()} diagnostics to "${document.uri}".`);
      this._connection.sendDiagnostics({ uri: document.uri, diagnostics });
    });
  }
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
