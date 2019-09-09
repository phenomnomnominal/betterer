import * as commander from 'commander';

const DEFAULT_DEFINITION_PATH = './.better.js';
const DEFAULT_RESULTS_PATH = './.better.results';

export function cli () {
    const { version } = require('../../package.json');

    commander.version(version);

    process.env[`better:tests`] = DEFAULT_DEFINITION_PATH;
    commander
    .option('-t, --tests [value]', 'Path to test definition file relative to CWD', DEFAULT_DEFINITION_PATH)
    .on('option:tests', value => process.env[`better:tests`] = value);

    process.env[`better:results`] = DEFAULT_RESULTS_PATH;
    commander
    .option('-r, --results [value]', 'Path to test results file relative to CWD', DEFAULT_RESULTS_PATH)
    .on('option:results', value => process.env[`better:results`] = value);

    commander
    .command('start', 'run better', { isDefault: true })

    commander.parse(process.argv);
}
