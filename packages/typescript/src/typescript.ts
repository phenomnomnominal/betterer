import { BettererFileGlobs, BettererFilePaths, BettererFileResolver, BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import * as path from 'path';
import * as ts from 'typescript';

const NEW_LINE = '\n';

// When making a project with only a subset of the files in the original tsconfig,
// 6307 errors will appear when importing other files, but they're only a problem because the tsconfig has been edited
const CODE_FILE_NOT_INCLUDED = 6307;

type TypeScriptReadConfigResult = {
  config: {
    compilerOptions: ts.CompilerOptions;
    files: BettererFilePaths;
    include?: BettererFileGlobs;
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

/** @internal Definitely not stable! Please don't use! */
export function typescriptΔ(configFilePath: string, extraCompilerOptions: ts.CompilerOptions = {}): BettererFileTest {
  if (!configFilePath) {
    throw new BettererError(
      "for `@betterer/typescript` to work, you need to provide the path to a tsconfig.json file, e.g. `'./tsconfig.json'`. ❌"
    );
  }

  const resolver = new BettererFileResolver();
  const absPath = resolver.resolve(configFilePath);

  return new BettererFileTest(resolver, (filePaths, fileTestResult) => {
    if (filePaths.length === 0) {
      return;
    }

    const { config } = ts.readConfigFile(absPath, ts.sys.readFile.bind(ts.sys)) as TypeScriptReadConfigResult;
    const { compilerOptions } = config;
    const basePath = path.dirname(absPath);

    const fullCompilerOptions = {
      ...compilerOptions,
      ...extraCompilerOptions
    };
    config.compilerOptions = fullCompilerOptions;
    config.files = filePaths;
    delete config.include;

    const compilerHost = ts.createCompilerHost(fullCompilerOptions);
    const configHost: ts.ParseConfigHost = {
      ...compilerHost,
      readDirectory: ts.sys.readDirectory.bind(ts.sys),
      useCaseSensitiveFileNames: compilerHost.useCaseSensitiveFileNames()
    };
    const { options, fileNames } = ts.parseJsonConfigFileContent(config, configHost, basePath);
    const incrementalHost = ts.createIncrementalCompilerHost(options);

    const oldProgram = ts.readBuilderProgram(options, incrementalHost);
    const program = oldProgram
      ? ts.createEmitAndSemanticDiagnosticsBuilderProgram(fileNames, options, incrementalHost, oldProgram)
      : ts.createIncrementalProgram({
          options,
          rootNames: fileNames,
          host: incrementalHost
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
      .filter((d): d is ts.DiagnosticWithLocation => d.file !== undefined && d.start != null && d.length != null)
      .filter(({ file, code }) => filePaths.includes(file.fileName) && code !== CODE_FILE_NOT_INCLUDED)
      .forEach(({ start, length, file: source, messageText }) => {
        const file = fileTestResult.addFile(source.fileName, source.getFullText());
        const message = ts.flattenDiagnosticMessageText(messageText, NEW_LINE);
        file.addIssue(start, start + length, message);
      });
  });
}
