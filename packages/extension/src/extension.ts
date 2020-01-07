import { bettererFile } from '@betterer/betterer';
import { BettererFiles } from '@betterer/betterer/dist/betterer';
import * as path from 'path';
import {
  Diagnostic,
  DiagnosticCollection,
  DiagnosticSeverity,
  ExtensionContext,
  languages,
  Position,
  Range,
  TextDocument,
  window,
  workspace
} from 'vscode';

export function activate(context: ExtensionContext): void {
  const bettererDiagnostics = languages.createDiagnosticCollection('betterer');
  context.subscriptions.push(bettererDiagnostics);

  subscribeToDocumentChanges(context, bettererDiagnostics);
}

function subscribeToDocumentChanges(context: ExtensionContext, bettererDiagnostics: DiagnosticCollection): void {
  if (window.activeTextEditor) {
    refreshDiagnostics(window.activeTextEditor.document, bettererDiagnostics);
  }
  context.subscriptions.push(
    window.onDidChangeActiveTextEditor(editor => {
      if (editor) {
        refreshDiagnostics(editor.document, bettererDiagnostics);
      }
    })
  );

  context.subscriptions.push(
    workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, bettererDiagnostics))
  );

  context.subscriptions.push(workspace.onDidCloseTextDocument(doc => bettererDiagnostics.delete(doc.uri)));
}

export async function refreshDiagnostics(doc: TextDocument, bettererDiagnostics: DiagnosticCollection): Promise<void> {
  const [folder] = workspace.workspaceFolders || [];
  if (folder) {
    const configPaths = [path.join(folder.uri.fsPath, '.betterer')];
    const resultsPath = path.join(folder.uri.fsPath, '.betterer.results');
    const runs = await bettererFile({ configPaths, resultsPath }, doc.fileName);

    const diagnostics: Array<Diagnostic> = [];
    runs.forEach(run => {
      try {
        const { test, result } = run;
        const [file] = (result as BettererFiles).files;
        const { fileMarks } = file;
        fileMarks.forEach(fileMark => {
          const [line, column, length, message] = fileMark;
          const start = new Position(line, column);
          const startOffset = doc.offsetAt(start);
          const end = doc.positionAt(startOffset + length);
          diagnostics.push(createDiagnostic(test.name, start, end, message));
        });
      } catch {
        //
      }
    });

    bettererDiagnostics.set(doc.uri, diagnostics);
  }
}

function createDiagnostic(name: string, start: Position, end: Position, message: string): Diagnostic {
  const range = new Range(start, end);
  const diagnostic = new Diagnostic(range, message, DiagnosticSeverity.Warning);
  diagnostic.code = `☀️ betterer - [${name}]`;
  return diagnostic;
}
