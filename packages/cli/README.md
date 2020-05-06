[![betterer](https://github.com/phenomnomnominal/betterer/blob/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/cli`

[![npm version](https://img.shields.io/npm/v/@betterer/cli.svg)](https://www.npmjs.com/package/@betterer/cli)

CLI module for running [**`betterer`**](https://github.com/phenomnomnominal/betterer).

## Usage

```sh
betterer -c ./path/to/config -r ./path/to/results
```

## Options

| Name                      | Description                                  | Default               |
| ------------------------- | -------------------------------------------- | --------------------- |
| `-c`, `--config` [value]  | Path to test definition file relative to CWD | `./.betterer.js`      |
| `-r`, `--results` [value] | Path to test results file relative to CWD    | `./.betterer.results` |
