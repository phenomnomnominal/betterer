export function quote(str: string): string {
  if (!str.startsWith('"')) {
    str = `"${str}`;
  }
  if (!str.endsWith('"')) {
    str = `${str}"`;
  }
  return str;
}
