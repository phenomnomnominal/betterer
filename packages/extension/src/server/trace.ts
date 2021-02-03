import { Tracer } from 'vscode-languageserver/node';

let tracerInstance: Tracer;

export function initTrace(tracer: Tracer): void {
  tracerInstance = tracer;
}

export function trace(message: string, verbose?: string): void {
  tracerInstance.log(message, verbose);
}
