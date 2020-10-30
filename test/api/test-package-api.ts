import { BettererError } from '@betterer/errors';
import { BettererTaskContext, BettererTaskStatusMessage, BettererTaskLogger } from '@betterer/logger';
import { promises as fs } from 'fs';
import * as path from 'path';
import { publicApi, verifyAgainstGoldenFile } from 'ts-api-guardian';

const EXCLUDED_PACKAGES = ['extension'];
const DECLARATION_EXTENSION = '.d.ts';
const BUILT_DECLARATION = `dist/index${DECLARATION_EXTENSION}`;
const PACKAGES_DIR = path.resolve(__dirname, '../../packages');
const GOLDENS_DIR = path.resolve(__dirname, '../../goldens/api/@betterer');

const API_OPTIONS = { allowModuleIdentifiers: ['ts', 'react'] };

const CRLF = '\r\n';
const CHUNK_SPLIT = '\n\n';

const INTERNAL_TOKENS = ['Ω'];

export async function getPackages(): Promise<Array<string>> {
  const items = await fs.readdir(PACKAGES_DIR);

  const testDirectory = await Promise.all(
    items.map(async (item) => {
      const stat = await fs.lstat(path.join(PACKAGES_DIR, item));
      return stat.isDirectory();
    })
  );

  const packages = items.filter((_, index) => testDirectory[index]);
  return packages.filter((packageName) => {
    return packageName && !EXCLUDED_PACKAGES.includes(packageName);
  });
}

export function testPackageAPI(packageName: string): BettererTaskContext {
  return {
    name: packageName,
    run: (logger) => runTestPackageAPI(logger, packageName)
  };
}

export async function runTestPackageAPI(
  logger: BettererTaskLogger,
  packageName: string
): Promise<string | BettererTaskStatusMessage> {
  logger.status(`Validating API for "@betterer/${packageName}" ...`);

  const packageDeclarationPath = path.join(PACKAGES_DIR, packageName, BUILT_DECLARATION);
  const packageGoldenPath = path.join(GOLDENS_DIR, `${packageName}${DECLARATION_EXTENSION}`);

  const packageGoldenRaw = await fs.readFile(packageGoldenPath, 'utf-8');
  const packageGeneratedRaw = publicApi(packageDeclarationPath, API_OPTIONS);
  const packageGolden = normaliseFile(packageGoldenRaw);
  const packageGenerated = normaliseFile(packageGeneratedRaw);

  const foundToken = INTERNAL_TOKENS.find((token) => {
    return checkForBannedTokens(packageGolden, token) || checkForBannedTokens(packageGenerated, token);
  });

  if (foundToken) {
    return `Found "${foundToken}" in the API for "@betterer/${packageName}. This means internal code has been exposed.`;
  }

  const isDefinitelyValid = packageGolden === packageGenerated;
  const isProbablyValid = isDefinitelyValid || checkForOutOfOrder(packageGenerated, packageGolden);
  if (isProbablyValid) {
    if (isDefinitelyValid) {
      return `No Breaking API changes found in "@betterer/${packageName}".`;
    }
    return [
      '🤷‍♂️',
      'green',
      `No Breaking API changes found in "@betterer/${packageName}". There's a *slight* chance this could be a false positive, so maybe just double check it! 😬`
    ];
  }

  const diff = verifyAgainstGoldenFile(packageDeclarationPath, packageGoldenPath, API_OPTIONS);
  throw new BettererError(`API changes found in "@betterer/${packageName.toString()}"`, diff);
}

function checkForBannedTokens(types: string, token: string): boolean {
  return types.includes(token);
}

function checkForOutOfOrder(generated: string, golden: string): boolean {
  const generatedChunks = generated.split(CHUNK_SPLIT);
  const goldenChunks = golden.split(CHUNK_SPLIT);
  const newChunks = generatedChunks.filter((chunk) => !golden.includes(chunk));
  const missingChunks = goldenChunks.filter((chunk) => !generated.includes(chunk));
  return newChunks.length === 0 && missingChunks.length === 0;
}

function normaliseFile(str: string): string {
  return str.replace(new RegExp(CRLF, 'g'), '\n').trim();
}
