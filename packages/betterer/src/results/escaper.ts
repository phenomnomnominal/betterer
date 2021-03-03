// JS template string interpolation tokens
const JS_INTERP_ESCAPED = '$\\{';
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

export function escape(printedValue: string): string {
  return printedValue
    .replace(/['`\\\b\f\r\t\u2028\u2029]/g, (char) => ESCAPE_REPLACERS[char])
    .replace(JS_INTERP_UNESCAPED_REGEXP, JS_INTERP_ESCAPED);
}
