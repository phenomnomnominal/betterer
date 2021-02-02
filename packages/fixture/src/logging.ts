import ansiRegex from 'ansi-regex';
import * as path from 'path';

import { FixtureLogs } from './types';

const ANSI_REGEX = ansiRegex();
const PROJECT_REGEXP = new RegExp(normalisePaths(process.cwd()), 'g');

export function createFixtureLogs(): FixtureLogs {
  const logs: Array<string> = [];
  const log = (...messages: Array<string>): void => {
    // Do some magic to sort out the logs for snapshots. This mucks up the snapshot of the printed logo,
    // but that hardly matters...
    const filtered = messages.filter((message) => message.trim().length).map((m) => m.replace(/\r/g, ''));
    logs.push(...filtered.map((m) => (!isString(m) ? m : replaceProjectPath(normalisePaths(replaceAnsi(m))))));
  };

  jest.spyOn(console, 'log').mockImplementation(log);
  jest.spyOn(console, 'error').mockImplementation((message: string) => {
    const [firstLine] = message.split('\n');
    log(firstLine);
  });
  jest.spyOn(process.stdout, 'write').mockImplementation((message: string | Uint8Array): boolean => {
    if (message) {
      log(message.toString());
    }
    return true;
  });
  process.stdout.columns = 1000;

  return logs as FixtureLogs;
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
