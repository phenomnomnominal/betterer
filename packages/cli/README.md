[![Betterer](https://github.com/phenomnomnominal/betterer/blob/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

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

| Name                      | Description                                          | Default               |
| ------------------------- | ---------------------------------------------------- | --------------------- |
| `-c`, `--config` [value]  | Path to test definition file relative to CWD         | `./.betterer.ts`      |
| `-r`, `--results` [value] | Path to test results file relative to CWD            | `./.betterer.results` |
| `-f`, `--filter` [value]  | Select tests to run by RegExp. Takes multiple values | `[.*]`                |

### Watch

Run [**`Betterer`**](https://github.com/phenomnomnominal/betterer) in watch mode

```sh
betterer watch -c ./path/to/config -r ./path/to/results
```

#### Watch options

| Name                      | Description                                                              | Default               |
| ------------------------- | ------------------------------------------------------------------------ | --------------------- |
| `-c`, `--config` [value]  | Path to test definition file relative to CWD                             | `./.betterer.ts`      |
| `-r`, `--results` [value] | Path to test results file relative to CWD                                | `./.betterer.results` |
| `-f`, `--filter` [value]  | Select tests to run by RegExp. Takes multiple values                     | `[.*]`                |
| `-i`, `--ignore` [value]  | Ignore files by RegExp when running in watch mode. Takes multiple values | `[]`                  |
