import { escape } from 'safe-string-literal';

// Characters that we avoid escaping to make snapshots easier to visually diff
const UNESCAPED = '"\n';

export function print(name: string, printedValue: string): string {
  const escaped = escape(printedValue, UNESCAPED);
  return `\nexports[\`${name}\`] = {\n  value: \`${escaped}\`\n};\n`;
}
