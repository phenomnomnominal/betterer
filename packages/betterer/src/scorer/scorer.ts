import simpleGit, { SimpleGit } from 'simple-git';

import { BettererConfig } from '../config';
import { debug, scorer } from '../debug';
import { requireText } from '../require';
import { BettererExpectedResults } from '../results';
import { BettererScores } from './types';

const ADDED_BETTERER = 500;
const RETRIES = 5;
const SCORE_LOG_ARGS = ['--stat', '--decorate', '--follow', '-p', '--'];

export async function score(config: BettererConfig): Promise<BettererScores> {
  const { cwd, resultsPath } = config;
  const git = simpleGit({ baseDir: cwd });
  const log = await git.log([...SCORE_LOG_ARGS, resultsPath]);

  const scores: BettererScores = {};

  let previousResults: BettererExpectedResults = {};

  await Promise.all(
    [...log.all].reverse().map(async (item, index) => {
      const { diff, author_name, hash } = item;
      scores[author_name] = scores[author_name] || 0;
      if (index === 0) {
        debug(scorer.addBetterer(author_name, ADDED_BETTERER));
        scores[author_name] += ADDED_BETTERER;
        return;
      }
      if (diff) {
        const [file] = diff.files;
        const results = await retryGetFile(git, hash, file.file);

        Object.keys(previousResults).forEach((testName) => {
          const previousResult = previousResults[testName];
          const result = results[testName];
          const isRemoved = !result;
          if (isRemoved) {
            const removeScore = scoreValue(previousResult.value);
            debug(scorer.removeTest(author_name, testName, removeScore));
            scores[author_name] -= removeScore;
            return;
          }
        });

        Object.keys(results).forEach((testName) => {
          const result = results[testName];
          const previousResult = previousResults[testName];
          const isAdded = !previousResult;
          if (isAdded) {
            const addScore = scoreValue(result.value);
            debug(scorer.addTest(author_name, testName, addScore));

            scores[author_name] += addScore;
            return;
          }
          const changeScore = scoreValue(previousResult.value) - scoreValue(result.value);
          debug(scorer.changeIssues(author_name, testName, changeScore));
          scores[author_name] += changeScore;
        });

        previousResults = results;
      }
    })
  );
  return scores;
}

function scoreValue(value: string): number {
  return value.split(/\n/).length;
}

async function retryGetFile(git: SimpleGit, hash: string, filePath: string): Promise<BettererExpectedResults> {
  const tries = 0;
  let results: BettererExpectedResults | null = null;
  while (!results && tries < RETRIES) {
    try {
      const resultsText = await git.show([`${hash}:${filePath}`]);
      results = requireText(resultsText);
    } catch {
      // Sometimes `git show` doesn't return the full file text,
      // which makes the `require` fail. So we retry a few times
    }
  }
  if (!results) {
    throw new Error();
  }
  return results;
}
