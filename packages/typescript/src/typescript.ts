import { FileBetterer, createFileBetterer, BettererFileInfoMap } from '@betterer/betterer';
import * as stack from 'callsite';
import * as ts from 'typescript';
import * as path from 'path';

import { CONFIG_PATH_REQUIRED, COMPILER_OPTIONS_REQUIRED } from './errors';

const NEW_LINE = '\n';

export function typescriptBetterer(configFilePath: string, extraCompilerOptions: ts.CompilerOptions): FileBetterer {
  if (!configFilePath) {
    throw CONFIG_PATH_REQUIRED();
  }
  if (!extraCompilerOptions) {
    throw COMPILER_OPTIONS_REQUIRED();
  }

  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const absPath = path.resolve(cwd, configFilePath);

  return createFileBetterer((files = []) => {
    const { config } = ts.readConfigFile(absPath, ts.sys.readFile.bind(ts.sys));
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

    if (files.length === 0) {
      files = parsed.fileNames;
    }

    const program = ts.createProgram({
      ...parsed,
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

    return allDiagnostics.reduce((fileInfoMap, diagnostic) => {
      const { file, start, length } = diagnostic as ts.DiagnosticWithLocation;
      const { fileName } = file;
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, NEW_LINE).replace(process.cwd(), '.');
      fileInfoMap[fileName] = fileInfoMap[fileName] || [];
      fileInfoMap[fileName] = [
        ...fileInfoMap[fileName],
        {
          message,
          filePath: fileName,
          fileText: file.getFullText(),
          start,
          end: start + length
        }
      ];
      return fileInfoMap;
    }, {} as BettererFileInfoMap);
  });
}
