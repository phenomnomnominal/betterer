import { promises as fs } from 'node:fs';
import os from 'node:os';
import crypto from 'node:crypto';
import path from 'node:path';

const CREATED_FILES: Record<string, boolean> = {};

const BETTERER_TEMP_DIR = 'betterer';

export function getTmpFileName(name: string, ext: string) {
  const id = crypto.randomBytes(4).toString('hex');
  const tmpFileName = `${name}.${id}${ext}`;
  CREATED_FILES[tmpFileName] = true;
  return tmpFileName;
}

export function isTempFilePath(filePath: string): boolean {
  const { base } = path.parse(filePath);
  return CREATED_FILES[base] === true;
}

export async function getTmpPath(fileName = ''): Promise<string> {
  const bettererTmpDirPath = path.join(os.tmpdir(), BETTERER_TEMP_DIR);
  await fs.mkdir(bettererTmpDirPath, { recursive: true });
  if (!fileName) {
    return bettererTmpDirPath;
  }
  const { name, ext } = path.parse(fileName);
  return path.join(bettererTmpDirPath, getTmpFileName(name, ext));
}
