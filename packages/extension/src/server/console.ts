import { RemoteConsole } from 'vscode-languageserver';

let consoleInstance: RemoteConsole;

export function initConsole(console: RemoteConsole): void {
  consoleInstance = console;
}

export function info(messages: string): void {
  consoleInstance.info(messages);
}
