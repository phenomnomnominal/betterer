export const WATCH_IGNORES = [
  'node_modules',
  '.git',
  '.log',
  '.sql',
  '.sqlite',
  '.DS_Store',
  '.Spotlight-V100',
  '.Trashes',
  'ehthumbs.db',
  'Thumbs.db',
  '.gitignore',
  'package-lock.json',
  'yarn.lock'
].map((i) => new RegExp(`${i}$`, 'i'));
