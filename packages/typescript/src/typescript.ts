import * as ts from 'typescript';
import * as stack from 'callsite';
import * as path from 'path';

import { FileBetterer, createFileBetterer } from '@betterer/betterer';
import { error, info } from '@betterer/logger';

const readFile = ts.sys.readFile.bind(ts.sys);
const readDirectory = ts.sys.readDirectory.bind(ts.sys);

export function typescriptBetterer(
  configFilePath: string,
  extraCompilerOptions?: ts.CompilerOptions
): FileBetterer {
  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const absPath = path.resolve(cwd, configFilePath);

  return createFileBetterer((files: Array<string>) => {
    info(`running TypeScript compiler...`);

    if (!configFilePath) {
      error();
      throw new Error();
    }

    const { config } = ts.readConfigFile(absPath, readFile);
    const { compilerOptions } = config;
    const basePath = path.dirname(absPath);

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

    if (files.length === 0) {
      files = parsed.fileNames;
    }

    const program = ts.createProgram({
      ...config,
      rootNames: files,
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

    const issues = allDiagnostics.map((diagnostic: ts.Diagnostic) => {
      const { file, start, length } = diagnostic as ts.DiagnosticWithLocation;
      return {
        message: ts
          .flattenDiagnosticMessageText(diagnostic.messageText, '\n')
          .replace(process.cwd(), '.'),
        filePath: file.fileName,
        fileText: file.getFullText(),
        start,
        end: start + length
      };
    });

    if (issues.length) {
      error('TypeScript compiler found some issues:');
    }
    return issues;
  });
}
