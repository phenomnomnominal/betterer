[![Betterer](https://raw.githubusercontent.com/phenomnomnominal/betterer/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/cli`

[![npm version](https://img.shields.io/npm/v/@betterer/cli.svg)](https://www.npmjs.com/package/@betterer/cli)

CLI module for [**`Betterer`**](https://github.com/phenomnomnominal/betterer).

## Usage

### Init

Initialise [**`Betterer`**](https://github.com/phenomnomnominal/betterer) in a project

```sh
betterer init -c ./path/to/config
```

#### Init options

| Name                     | Description                                  | Default          |
| ------------------------ | -------------------------------------------- | ---------------- |
| `-c`, `--config` [value] | Path to test definition file relative to CWD | `./.betterer.ts` |

### Start

Run [**`Betterer`**](https://github.com/phenomnomnominal/betterer)

```sh
betterer -c ./path/to/config -r ./path/to/results -w
```

#### Start options

| Name                       | Description                                                                                        | Default               |
| -------------------------- | -------------------------------------------------------------------------------------------------- | --------------------- |
| `-c`, `--config` [value]   | Path to test definition file relative to CWD. Takes multiple values                                | `./.betterer.ts`      |
| `-r`, `--results` [value]  | Path to test results file relative to CWD                                                          | `./.betterer.results` |
| `-t`, `--tsconfig` [value] | Path to TypeScript config file relative to CWD                                                     | `null`                |
| `-f`, `--filter` [value]   | Select tests to run by RegExp. Takes multiple values                                               | `[]`                  |
| `-s`, `--silent`           | When present, all default reporters will be disabled. Custom reporters will still work normally.   | `false`               |
| `-u`, `--update`           | When present, the results file will be updated, even if things get worse                           | `false`               |
| `--allow-update [false]`   | When set to false, the update message will not be shown and the `--update` option will be ignored. | `true`                |
| `-R`, `--reporter` [value] | npm package name or file path to a Betterer reporter. Takes multiple values                        | Default reporter      |

### CI

Run **`Betterer`** in CI mode. Exactly the same as above, but will throw an error if any results change. You probably want to use this if you run **`Betterer`** in your CI build!

```sh
betterer ci -c ./path/to/config -r ./path/to/results
```

### Watch

Run **`Betterer`** in watch mode

```sh
betterer watch -c ./path/to/config -r ./path/to/results
```

#### Watch options

| Name                           | Description                                                                 | Default               |
| ------------------------------ | --------------------------------------------------------------------------- | --------------------- |
| `-c`, `--config` [value]       | Path to test definition file relative to CWD. Takes multiple values         | `./.betterer.ts`      |
| `-r`, `--results` [value]      | Path to test results file relative to CWD                                   | `./.betterer.results` |
| `-t`, `--tsconfig` [value]     | Path to TypeScript config file relative to CWD                              | `null`                |
| `-f`, `--filter` [value]       | Select tests to run by RegExp. Takes multiple values                        | `[]`                  |
| `-s`, `--silent [true\|false]` | Disable all default reporters. Custom reporters still work normally.        | `false`               |
| `-i`, `--ignore` [value]       | Ignore files by Glob when running in watch mode. Takes multiple values      | `[]`                  |
| `-R`, `--reporter` [value]     | npm package name or file path to a Betterer reporter. Takes multiple values | Default reporter      |
