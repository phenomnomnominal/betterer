import { betterer, BettererFiles } from '@betterer/betterer';
import {
  Diagnostic,
  DiagnosticCollection,
  DiagnosticSeverity,
  ExtensionContext,
  languages,
  OutputChannel,
  Position,
  Range,
  TextDocument,
  window,
  workspace
} from 'vscode';

const EXTENSION_NAME = '☀️ betterer';

export function activate(context: ExtensionContext): void {
  const bettererDiagnostics = languages.createDiagnosticCollection(EXTENSION_NAME);
  context.subscriptions.push(bettererDiagnostics);

  const output = window.createOutputChannel(EXTENSION_NAME);
  output.append(`${EXTENSION_NAME} ready!`);

  subscribeToDocumentChanges(context, bettererDiagnostics, output);
}

function subscribeToDocumentChanges(
  context: ExtensionContext,
  bettererDiagnostics: DiagnosticCollection,
  output: OutputChannel
): void {
  if (window.activeTextEditor) {
    refreshDiagnostics(window.activeTextEditor.document, bettererDiagnostics, output);
  }
  context.subscriptions.push(
    window.onDidChangeActiveTextEditor(editor => {
      if (editor) {
        refreshDiagnostics(editor.document, bettererDiagnostics, output);
      }
    })
  );

  context.subscriptions.push(
    workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, bettererDiagnostics, output))
  );

  context.subscriptions.push(workspace.onDidCloseTextDocument(doc => bettererDiagnostics.delete(doc.uri)));
}

export async function refreshDiagnostics(
  doc: TextDocument,
  bettererDiagnostics: DiagnosticCollection,
  output: OutputChannel
): Promise<void> {
  const [folder] = workspace.workspaceFolders || [];
  if (folder) {
    output.append(`Running betterer on "${doc.fileName}"`);
    const runs = await betterer({ cwd: folder.uri.fsPath }, doc.fileName);
    output.append('Finished');

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
  diagnostic.code = `${EXTENSION_NAME} - [${name}]`;
  return diagnostic;
}
