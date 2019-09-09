import { error, info, success, warn } from '../logger';
import { print } from './printer';
import { read } from './reader';
import { serialise } from './serialiser';
import { BetterConfig, BetterResults, BetterStats, BetterTests } from './types';
import { write } from './writer';

export async function better (config: BetterConfig) {
    info('running...');

    const { configPath, filters, resultsPath } = config;
    const tests: BetterTests = await import(configPath);
    const testsToRun = Object.keys(tests).filter(testName => {
        if (!filters) {
            return true;
        }
        return filters.some(filter => filter.test(testName));
    });

    let expectedResults: BetterResults;
    try {
        expectedResults = await read(resultsPath);
    } catch {
        error(`could not read results from "${resultsPath}". 😔`);
        return;
    }

    const obsoleteNames = Object.keys(expectedResults).filter(testName => !tests[testName]);
    obsoleteNames.forEach(obsoleteName => {
        delete expectedResults[obsoleteName];
    });

    const stats: BetterStats = {
        obsolete: obsoleteNames.length,
        ran: 0,
        failed: 0,
        new: 0,
        better: 0,
        same: 0,
        worse: 0,
    };

    const results: BetterResults = { ...expectedResults };

    await Promise.all(testsToRun.map(async (testName) => {
        const [test, constraint] = tests[testName];

        let result: any;
        try {
            result = await test();
        } catch {
            stats.failed += 1;
            return;
        }
        stats.ran += 1;

        const current = {
            timestamp: Date.now(),
            value: serialise(result)
        };
        const previous = expectedResults[testName];
        if (!previous) {
            results[testName] = current;
            stats.new += 1;
            return;
        }
        if (current.value === previous.value) {
            results[testName] = current;
            stats.same += 1;
            return;
        }
        const isBetter = await constraint(JSON.parse(current.value), JSON.parse(previous.value));
        stats[isBetter ? 'better': 'worse'] += 1;
        results[testName] = isBetter ? current : previous;
    }));

    const { ran, obsolete, better, worse, same } = stats;
    info(`${ran} ${getThings(ran)} got checked. 🤩`);
    if (stats.new) {
        info(`${stats.new} ${getThings(stats.new)} got checked for the first time. 😎`);
    }
    if (obsolete) {
        info(`${obsolete} ${getThings(obsolete)} are no longer needed! 🤪`);
    }
    if (better) {
        success(`${better} ${getThings(better)} got better! 😍`);
    }
    if (worse) {
        error(`${worse} ${getThings(worse)} got worse. 😔`);
    }
    if (same) {
        warn(`${same} ${getThings(same)} stayed the same. 😐`);
    }

    const printed = print(results);

    try {
        await write(printed, resultsPath);
    } catch {
        error(`could not write results to "${resultsPath}". 😔`);
        error(`printing to stdout instead!`);
        console.log(`\n\n\n${printed}\n\n\n`);
    }

    success('done!');

    process.exit(worse !== 0 ? 1 : 0);
}

function getThings (count: number) {
    return count === 1 ? 'thing' : 'things';
}