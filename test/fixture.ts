import { ensureFile, remove } from 'fs-extra';
import * as fs from 'graceful-fs';
import * as path from 'path';
import * as ansiRegex from 'ansi-regex';

const DEFAULT_CONFIG_PATH = './.betterer';
const DEFAULT_RESULTS_PATH = `./.betterer.results`;

const deleteFile = fs.promises.unlink;
const readFile = fs.promises.readFile;
const writeFile = fs.promises.writeFile;
const ANSI_REGEX = ansiRegex();

type Paths = {
  config: string;
  fixture: string;
  results: string;
};

type Fixture = {
  deleteFile(filePath: string): Promise<void>;
  logs: ReadonlyArray<string>;
  paths: Paths;
  readFile(filePath: string): Promise<string>;
  resolve(filePath: string): string;
  writeFile(filePath: string, text: string): Promise<void>;
  reset(): Promise<void>;
};

export function fixture(fixtureName: string): Fixture {
  const fixturePath = path.resolve(__dirname, `../fixtures/${fixtureName}`);

  function resolve(itemPath: string): string {
    return path.resolve(fixturePath, itemPath);
  }

  const logs: Array<string> = [];
  const log = (...messages: Array<string>): void => {
    logs.push(...messages.filter((m) => !!m?.replace).map((m) => m.replace(ANSI_REGEX, '')));
  };
  jest.spyOn(console, 'log').mockImplementation(log);
  jest.spyOn(console, 'error').mockImplementation(log);

  const paths = {
    config: resolve(DEFAULT_CONFIG_PATH),
    fixture: fixturePath,
    results: resolve(DEFAULT_RESULTS_PATH)
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
