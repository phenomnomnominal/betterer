import type { BettererLoggerCodeInfo } from './types';

import { codeFrameColumns } from '@babel/code-frame';
import { LinesAndColumns } from 'lines-and-columns';
import * as path from 'path';

const IS_JS_REGEXP = /.t|jsx?$/;

/**
 * @internal Definitely not stable! Please don't use!
 *
 * Logs a code block with syntax highlighting and a message.
 */
export function code__(codeInfo: BettererLoggerCodeInfo): string {
  const { filePath, fileText, message } = codeInfo;
  const isJS = IS_JS_REGEXP.exec(path.extname(filePath));
  const options = {
    highlightCode: !!isJS,
    message
  };
  const lc = new LinesAndColumns(fileText);
  const startLocation = codeInfo;
  const startIndex = lc.indexForLocation(startLocation) || 0;
  const endLocation = lc.locationForIndex(startIndex + codeInfo.length) || startLocation;
  const start = {
    line: startLocation.line + 1,
    column: startLocation.column + 1
  };
  const end = {
    line: endLocation.line + 1,
    column: endLocation.column + 1
  };
  // `codeFrameColumns` doesn't handle empty strings very well!
  return `\n  ${filePath}\n${codeFrameColumns(fileText || ' ', { start, end }, options)}\n`;
}
