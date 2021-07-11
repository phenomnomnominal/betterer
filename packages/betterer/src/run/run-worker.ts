import { BettererFilePaths } from '../fs';
import { createGlobals } from '../globals';
import { BettererResultΩ } from '../results';
import { BettererTestBase, BettererTestMeta, isBettererFileTest, loadTestMeta } from '../test';
import { BettererGlobals } from '../types';
import { BettererWorkerRunConfig } from './types';
import { BettererWorkerRunΩ } from './worker-run';
import { BettererWorkerRunSummaryΩ } from './worker-run-summary';

let globals: BettererGlobals;
let test: BettererTestBase;
let testMeta: BettererTestMeta;

export async function init(options: BettererWorkerRunConfig, name: string): Promise<BettererTestMeta> {
  globals = await createGlobals(options);
  const { config, results, versionControl } = globals;

  await results.sync();
  await versionControl.sync();

  const testFactories = loadTestMeta(config);
  const testFactoryMeta = testFactories[name];
  test = testFactoryMeta.factory();
  test.config.configPath = testFactoryMeta.configPath;

  const baseTestMeta = {
    name,
    configPath: testFactoryMeta.configPath,
    isFileTest: isBettererFileTest(test),
    isOnly: test.isOnly,
    isSkipped: test.isSkipped
  };

  const isNew = !results.hasResult(name);
  if (isNew) {
    testMeta = {
      ...baseTestMeta,
      isNew: true,
      baselineJSON: null,
      expectedJSON: null
    };
  } else {
    const [baselineJSON, expectedJSON] = results.getExpected(name);
    testMeta = {
      ...baseTestMeta,
      isNew: false,
      baselineJSON,
      expectedJSON
    };
  }

  return testMeta;
}

export async function run(
  filePaths: BettererFilePaths | null,
  isSkipped: boolean,
  timestamp: number
): Promise<BettererWorkerRunSummaryΩ> {
  const baseline = deserialise(testMeta.baselineJSON);
  const expected = deserialise(testMeta.expectedJSON);

  const runΩ = new BettererWorkerRunΩ(test, testMeta, filePaths, baseline, expected, timestamp);
  const running = runΩ.run(globals.config);

  if (isSkipped) {
    return running.skipped();
  }

  try {
    const result = new BettererResultΩ(await test.config.test(runΩ, globals));
    return running.done(result);
  } catch (error) {
    return running.failed(error);
  }
}

function deserialise(resultJSON: string | null): BettererResultΩ | null {
  if (resultJSON === null) {
    return null;
  }
  const serialised = JSON.parse(resultJSON) as unknown;
  const { resultsPath } = globals.config;
  const { deserialise } = test.config.serialiser;
  return serialised ? new BettererResultΩ(deserialise(serialised, resultsPath)) : null;
}
