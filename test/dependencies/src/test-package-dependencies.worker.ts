import type { BettererLogger } from '@betterer/logger';
import type { KnipIssue, KnipIssues, KnipIssuesByType, KnipIssueType, KnipReport } from './types.js';

import { BettererError, invariantΔ } from '@betterer/errors';
import { exposeToMainΔ } from '@betterer/worker';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const asyncExec = promisify(exec);

const EXCLUDED_PACKAGES = ['docgen', 'extension', 'fixture'];

// This is probably a bit fragile 😅
import { ISSUE_TYPE_TITLE } from 'knip/dist/constants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGES_DIR = path.resolve(__dirname, '../../../packages');

export async function getPackages(): Promise<Array<string>> {
  const items = await fs.readdir(PACKAGES_DIR);

  const testDirectory = await Promise.all(
    items.map(async (item) => {
      const stat = await fs.lstat(path.join(PACKAGES_DIR, item));
      return stat.isDirectory();
    })
  );

  const packages = items.filter((_, index) => testDirectory[index]);
  return packages.filter((packageName) => {
    return packageName && !EXCLUDED_PACKAGES.includes(packageName);
  });
}

export async function run(logger: BettererLogger, status: BettererLogger, packageName: string): Promise<string> {
  const packageNameFull = `@betterer/${packageName}`;
  await status.progress(`Validating dependencies for "${packageNameFull}" ...`);

  const { stdout } = await asyncExec(
    `npx knip --config config/knip.json --no-exit-code --production --strict --tags=-knipignore,-internal --reporter=json --workspace=packages/${packageName}`
  );

  const lines = stdout.split('\n').filter(Boolean);
  const lastLine = lines.at(-1);
  invariantΔ(lastLine, `\`lastLine\` should be the JSON output from knip!`);

  let report: KnipReport;
  try {
    report = JSON.parse(lastLine) as KnipReport;
  } catch (error) {
    throw new BettererError(`Couldn't parse JSON output from knip. ❌`, error as Error);
  }

  const issuesByType: KnipIssuesByType = {};
  report.issues.map((filesIssues) => {
    const filePath = filesIssues.file;

    const entries = Object.entries(filesIssues).filter((entry): entry is [KnipIssueType, KnipIssues] => {
      const [key, issues] = entry;
      return isIssueType(key) && Array.isArray(issues) && issues.length !== 0;
    });

    if (!entries.length) {
      return;
    }

    entries.forEach(([issueType, issues]) => {
      issuesByType[issueType] ??= {};
      const issuesForIssueType = issuesByType[issueType];
      issuesForIssueType[filePath] = [...(issuesForIssueType[filePath] ?? []), ...issues];
    });
  });

  // Fight with race condition in Comlink 😡
  await new Promise((resolve) => setTimeout(resolve, 50));

  const errors: Array<string> = [];
  Object.entries(issuesByType).forEach(([issueType, issues]) => {
    const title = ISSUE_TYPE_TITLE[issueType as KnipIssueType];
    errors.push(`\n${title.toUpperCase()}:`);
    Object.entries(issues).forEach(([filePath, issues]) => {
      errors.push(...issues.map((issue) => `${issue.name} - ${getFilePath(filePath, issue)}`));
    });
  });

  if (errors.length) {
    const logResults = errors.map((errorMessage) => logger.error(errorMessage));
    await Promise.all(logResults.filter((result): result is Promise<void> => result instanceof Promise));
    throw new BettererError(`Dependency issues found in "${packageNameFull}"`);
  }

  return `No dependency issues found in "${packageNameFull}".`;
}

function isIssueType(key: unknown): key is KnipIssueType {
  return !!ISSUE_TYPE_TITLE[key as KnipIssueType];
}

function getFilePath(filePath: string, issue: KnipIssue): string {
  if (!(issue.line && issue.col)) {
    return filePath;
  }
  return `${filePath}:${String(issue.line)}:${String(issue.col)}`;
}

exposeToMainΔ({ getPackages, run });
