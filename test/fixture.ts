import { ensureFile, remove } from 'fs-extra';
import * as fs from 'graceful-fs';
import * as path from 'path';
import * as ansiRegex from 'ansi-regex';
import { BettererRuns, BettererWatcher } from '@betterer/betterer';

const DEFAULT_CONFIG_PATH = './.betterer';
const DEFAULT_RESULTS_PATH = `./.betterer.results`;

const ANSI_REGEX = ansiRegex();
const PROJECT_REGEXP = new RegExp(normalisePaths(process.cwd()), 'g');

const deleteFile = fs.promises.unlink;
const readFile = fs.promises.readFile;
const writeFile = fs.promises.writeFile;

type Paths = {
  config: string;
  fixture: string;
  results: string;
  cwd: string;
};

type Fixture = {
  logs: ReadonlyArray<string>;
  paths: Paths;
  deleteFile(filePath: string): Promise<void>;
  readFile(filePath: string): Promise<string>;
  resolve(filePath: string): string;
  writeFile(filePath: string, text: string): Promise<void>;
  waitForRun(watcher: BettererWatcher): Promise<BettererRuns>;
  reset(): Promise<void>;
};

export function fixture(fixtureName: string): Fixture {
  const fixturePath = path.resolve(__dirname, `../fixtures/${fixtureName}`);

  function resolve(itemPath: string): string {
    return path.resolve(fixturePath, itemPath);
  }

  const logs: Array<string> = [];
  const log = (...messages: Array<string>): void => {
    // Do some magic to sort out the logs for snapshots. This muchs up the snapshot of the printed logo,
    // but that hardly matters...
    logs.push(...messages.map((m) => (!isString(m) ? m : replaceProjectPath(normalisePaths(replaceAnsi(m))))));
  };

  jest.spyOn(console, 'log').mockImplementation(log);
  jest.spyOn(console, 'error').mockImplementation(log);
  jest.spyOn(process.stdout, 'write').mockImplementation((message: string | Uint8Array): boolean => {
    if (message) {
      log(message.toString());
    }
    return true;
  });
  process.stdout.columns = 1000;

  const paths = {
    config: resolve(DEFAULT_CONFIG_PATH),
    fixture: fixturePath,
    results: resolve(DEFAULT_RESULTS_PATH),
    cwd: resolve('.')
  };

  return {
    paths,
    resolve,
    logs,
    deleteFile(filePath: string): Promise<void> {
      return deleteFile(resolve(filePath));
    },
    readFile(filePath: string): Promise<string> {
      return readFile(resolve(filePath), 'utf8');
    },
    async writeFile(filePath: string, text: string): Promise<void> {
      await ensureFile(filePath);
      return writeFile(resolve(filePath), text, 'utf8');
    },
    waitForRun(watcher): Promise<BettererRuns> {
      return new Promise((resolve) => {
        watcher.onRun((run) => {
          resolve(run);
        });
      });
    },
    async reset(): Promise<void> {
      try {
        await remove(resolve('./src'));
      } catch {
        // Moving on...
      }
      try {
        await deleteFile(paths.results);
      } catch {
        // Moving on...
      }
    }
  };
}

function isString(message: unknown): message is string {
  return typeof message === 'string';
}

function replaceAnsi(str: string): string {
  return str.replace(ANSI_REGEX, '');
}

function replaceProjectPath(str: string): string {
  return str.replace(PROJECT_REGEXP, '<project>');
}

function normalisePaths(str: string): string {
  return str.split(path.win32.sep).join(path.posix.sep);
}
