import { BettererFileResolver, BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import * as path from 'path';
import * as ts from 'typescript';

const NEW_LINE = '\n';

type TypeScriptReadConfigResult = {
  config: {
    compilerOptions: ts.CompilerOptions;
  };
};

export function typescript(configFilePath: string, extraCompilerOptions: ts.CompilerOptions): BettererFileTest {
  if (!configFilePath) {
    throw new BettererError(
      "for `@betterer/typescript` to work, you need to provide the path to a tsconfig.json file, e.g. `'./tsconfig.json'`. ❌"
    );
  }
  if (!extraCompilerOptions) {
    throw new BettererError(
      'for `@betterer/typescript` to work, you need to provide compiler options, e.g. `{ strict: true }`. ❌'
    );
  }

  const resolver = new BettererFileResolver();
  const absPath = resolver.resolve(configFilePath);

  return new BettererFileTest(resolver, async (_, fileTestResult) => {
    const { config } = ts.readConfigFile(absPath, ts.sys.readFile.bind(ts.sys)) as TypeScriptReadConfigResult;
    const { compilerOptions } = config;
    const basePath = path.dirname(absPath);

    const fullCompilerOptions: ts.CompilerOptions = {
      ...compilerOptions,
      tsBuildInfoFile: path.join(basePath, '.betterer.tsbuildinfo'),
      ...extraCompilerOptions
    };
    config.compilerOptions = fullCompilerOptions;

    const host = ts.createIncrementalCompilerHost(fullCompilerOptions, ts.sys);
    const configHost: ts.ParseConfigHost = {
      ...host,
      readDirectory: ts.sys.readDirectory.bind(ts.sys),
      useCaseSensitiveFileNames: host.useCaseSensitiveFileNames()
    };
    const parsed = ts.parseJsonConfigFileContent(config, configHost, basePath);

    const rootNames = await resolver.validate(parsed.fileNames);
    const program = ts.createIncrementalProgram({
      ...parsed,
      rootNames,
      host
    });

    const { diagnostics } = program.emit();

    const allDiagnostics = ts.sortAndDeduplicateDiagnostics([
      ...diagnostics,
      ...program.getConfigFileParsingDiagnostics(),
      ...program.getOptionsDiagnostics(),
      ...program.getSyntacticDiagnostics(),
      ...program.getGlobalDiagnostics(),
      ...program.getSemanticDiagnostics()
    ]);

    allDiagnostics
      .filter(({ file, start, length }) => file && start != null && length != null)
      .forEach((diagnostic) => {
        const { start, length } = diagnostic as ts.DiagnosticWithLocation;
        const source = (diagnostic as ts.DiagnosticWithLocation).file;
        const { fileName } = source;
        const file = fileTestResult.addFile(fileName, source.getFullText());
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, NEW_LINE);
        file.addIssue(start, start + length, message);
      });
  });
}
