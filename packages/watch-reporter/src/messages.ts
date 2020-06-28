export function filesChecking(files: number): string {
  return `checking ${files} files... 🤔`;
}
export function filesChecked(files: number): string {
  return `checked ${files} files`;
}

export function watchStart(): string {
  return 'Running betterer in watch mode 🎉';
}
export function watchEnd(): string {
  return 'Stopping watch mode 👋';
}
