import * as ts from 'typescript';
import * as stack from 'callsite';
import * as path from 'path';

import { Betterer } from '@betterer/betterer';
import { smaller } from '@betterer/constraints';
import { error, info } from '@betterer/logger';

const readFile = ts.sys.readFile.bind(ts.sys);
const readDirectory = ts.sys.readDirectory.bind(ts.sys);

export function typescriptBetterer(
  configFilePath: string,
  extraCompilerOptions?: ts.CompilerOptions
): Betterer {
  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const absPath = path.resolve(cwd, configFilePath);
  return {
    test: (): number => createTypescriptTest(absPath, extraCompilerOptions),
    constraint: smaller,
    goal: 0
  };
}

function createTypescriptTest(
  configFilePath: string,
  extraCompilerOptions?: ts.CompilerOptions
): number {
  info(`running TypeScript compiler...`);

  if (!configFilePath) {
    error();
    throw new Error();
  }

  const { config } = ts.readConfigFile(configFilePath, readFile);
  const { compilerOptions } = config;
  const basePath = path.dirname(configFilePath);

  const fullCompilerOptions = {
    ...compilerOptions,
    ...extraCompilerOptions
  };
  config.compilerOptions = fullCompilerOptions;

  const host = ts.createCompilerHost(fullCompilerOptions);
  const parsed = ts.parseJsonConfigFileContent(
    config,
    {
      ...host,
      readDirectory,
      useCaseSensitiveFileNames: host.useCaseSensitiveFileNames()
    },
    basePath
  );

  const program = ts.createProgram({
    ...parsed,
    rootNames: parsed.fileNames,
    host
  });

  const { diagnostics } = program.emit();

  const preEmitDiagnostic = ts.getPreEmitDiagnostics(program);
  const semanticDiagnostics = program.getSemanticDiagnostics();
  const allDiagnostics = ts.sortAndDeduplicateDiagnostics([
    ...diagnostics,
    ...preEmitDiagnostic,
    ...semanticDiagnostics
  ]);

  if (allDiagnostics.length) {
    error('TypeScript compiler found some issues:');
    console.log(ts.formatDiagnosticsWithColorAndContext(allDiagnostics, host));
  }
  return allDiagnostics.length;
}
