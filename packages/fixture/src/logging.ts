import type { FixtureLogs, FixtureLogsMap, FixtureOptions } from './types.js';

import { getStdOut } from '@betterer/render';
import ansiRegex from 'ansi-regex';
import path from 'node:path';

const ANSI_REGEX = ansiRegex();
const PROJECT_REGEXP = new RegExp(normalisePaths(process.cwd()), 'g');
const STACK_TRACK_LINE_REGEXP = /^\s+at\s+/;

const FIXTURE_LOGS_MAP: FixtureLogsMap = {};

export function createFixtureLogs(options: FixtureOptions = {}): FixtureLogs {
  const fixtureLogs: Array<string> = [];
  FIXTURE_LOGS_MAP[expect.getState().currentTestName] = fixtureLogs;

  const log = (...messages: Array<string>): void => {
    const currentFixtureLogs = FIXTURE_LOGS_MAP[expect.getState().currentTestName];
    // Do some magic to sort out the logs for snapshots. This mucks up the snapshot of the printed logo,
    // but that hardly matters...
    messages.forEach((message) => {
      if (!isString(message)) {
        currentFixtureLogs.push(message);
        return;
      }
      message = replaceAnsi(message);
      if (isFiltered(message, options)) {
        return;
      }
      const lines = message.replace(/\r/g, '').split('\n');
      const filteredLines = lines.filter((line) => !isStackTraceLine(line));
      const formattedLines = filteredLines.map((line) => {
        line = replaceProjectPath(normalisePaths(line));
        line = line.trimEnd();
        return line;
      });
      message = formattedLines.join('\n');
      const trimmed = message.trim();
      if (trimmed.length === 0) {
        return;
      }
      const [previous] = currentFixtureLogs.slice(-1);
      if (message !== previous) {
        currentFixtureLogs.push(message);
      }
    });
  };

  const stdout = getStdOut();
  try {
    jest.spyOn(stdout, 'write').mockImplementation((message: string | Uint8Array): boolean => {
      if (message) {
        log(message.toString());
      }
      return true;
    });
  } catch {
    // Cannot wrap stdout.write
  }
  stdout.columns = 1000;
  stdout.rows = 20;

  return fixtureLogs as FixtureLogs;
}

function isString(message: unknown): message is string {
  return typeof message === 'string';
}

function replaceAnsi(str: string): string {
  return str.replace(ANSI_REGEX, '');
}

function isStackTraceLine(str: string): boolean {
  return !!STACK_TRACK_LINE_REGEXP.exec(str);
}

function isFiltered(str: string, options: FixtureOptions): boolean {
  const filters = options.logFilters || [];
  return filters.some((filter) => !!filter.exec(str));
}

function replaceProjectPath(str: string): string {
  return str.replace(PROJECT_REGEXP, '<project>');
}

function normalisePaths(str: string): string {
  return str.split(path.win32.sep).join(path.posix.sep);
}
