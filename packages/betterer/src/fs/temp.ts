import crypto from 'node:crypto';
import path from 'node:path';

const BETTERER_TEMP_FILE = '.betterer';
const BETTERER_TEMP_FILE_REGEX = /\.betterer\.[0-9a-f]{8}\.mjs/;

export function getTmpFileName() {
  const id = crypto.randomBytes(4).toString('hex');
  return `${BETTERER_TEMP_FILE}.${id}.mjs`;
}

export function isTempFilePath(filePath: string): boolean {
  const { base } = path.parse(filePath);
  return BETTERER_TEMP_FILE_REGEX.test(base);
}
