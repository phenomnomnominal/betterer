import { BettererFileResolver, BettererFileTest } from '@betterer/betterer';
import * as path from 'path';
import * as ts from 'typescript';

import { COMPILER_OPTIONS_REQUIRED, CONFIG_PATH_REQUIRED } from './errors';

const NEW_LINE = '\n';

type TypeScriptReadConfigResult = {
  config: {
    compilerOptions: ts.CompilerOptions;
  };
};

export function typescript(configFilePath: string, extraCompilerOptions: ts.CompilerOptions): BettererFileTest {
  if (!configFilePath) {
    throw CONFIG_PATH_REQUIRED();
  }
  if (!extraCompilerOptions) {
    throw COMPILER_OPTIONS_REQUIRED();
  }

  const resolver = new BettererFileResolver();
  const absPath = resolver.resolve(configFilePath);

  return new BettererFileTest(resolver, async (_, fileTestResult) => {
    const { config } = ts.readConfigFile(absPath, ts.sys.readFile.bind(ts.sys)) as TypeScriptReadConfigResult;
    const { compilerOptions } = config;
    const basePath = path.dirname(absPath);

    const fullCompilerOptions = {
      ...compilerOptions,
      ...extraCompilerOptions
    };
    config.compilerOptions = fullCompilerOptions;

    const host = ts.createCompilerHost(fullCompilerOptions);
    const configHost = {
      ...host,
      readDirectory: ts.sys.readDirectory.bind(ts.sys),
      useCaseSensitiveFileNames: host.useCaseSensitiveFileNames()
    };
    const parsed = ts.parseJsonConfigFileContent(config, configHost, basePath);

    const rootNames = await resolver.validate(parsed.fileNames);
    const program = ts.createProgram({
      ...parsed,
      rootNames,
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

    allDiagnostics.forEach((diagnostic) => {
      const { start, length } = diagnostic as ts.DiagnosticWithLocation;
      const source = (diagnostic as ts.DiagnosticWithLocation).file;
      const { fileName } = source;
      const file = fileTestResult.addFile(fileName, source.getFullText());
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, NEW_LINE);
      file.addIssue(start, start + length, message);
    });
  });
}
