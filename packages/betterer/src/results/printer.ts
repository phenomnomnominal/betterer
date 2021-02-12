import { escape } from './escaper';

export function print(name: string, printedValue: string): string {
  const escaped = escape(printedValue);
  return `\nexports[\`${name}\`] = {\n  value: \`${escaped}\`\n};\n`;
}
