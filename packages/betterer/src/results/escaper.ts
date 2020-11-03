import { swapKeyValues } from '../utils';
import { BettererExpectedResults } from './types';

// JS template string interpolation tokens
const JS_INTERP_ESCAPED = '$\\{';
const JS_INTERP_ESCAPED_REGEXP = /\$\\{/g;
const JS_INTERP_UNESCAPED = '${';
const JS_INTERP_UNESCAPED_REGEXP = /\$\{/g;

const ESCAPE_REPLACERS: Record<string, string> = {
  "'": "\\'",
  '`': '\\`',
  '\\': '\\\\',
  '\b': '\\b',
  '\f': '\\f',
  '\r': '\\r',
  '\t': '\\t',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
};
const UNESCAPE_REPLACERS = swapKeyValues(ESCAPE_REPLACERS);

export function escape(printedValue: string): string {
  return printedValue
    .replace(/['`\\\b\f\r\t\u2028\u2029]/g, (char) => ESCAPE_REPLACERS[char])
    .replace(JS_INTERP_UNESCAPED_REGEXP, JS_INTERP_ESCAPED);
}

export function unescape(results: BettererExpectedResults): BettererExpectedResults {
  Object.keys(results).forEach((key) => {
    results[key].value = results[key].value
      .replace(JS_INTERP_ESCAPED_REGEXP, JS_INTERP_UNESCAPED)
      .replace(/\\['`\\bfrt]|\\u2028|\\u2029/g, (char: string) => UNESCAPE_REPLACERS[char]);
  });
  return results;
}
