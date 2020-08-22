import { brΔ, errorΔ, infoΔ, successΔ } from '@betterer/logger';
import { promises as fs } from 'fs';
import * as path from 'path';
import { publicApi, verifyAgainstGoldenFile } from 'ts-api-guardian';

const EXCLUDED_PACKAGES = ['extension'];
const DECLARATION_EXTENSION = '.d.ts';
const BUILT_DECLARATION = `dist/index${DECLARATION_EXTENSION}`;
const PACKAGES_DIR = path.resolve(__dirname, '../packages');
const GOLDENS_DIR = path.resolve(__dirname, '../goldens/api/@betterer');

const API_OPTIONS = { allowModuleIdentifiers: ['ts'] };

const CRLF = '\r\n';
const CHUNK_SPLIT = '\n\n';

const INTERNAL_TOKENS = ['Ω'];

void (async function () {
  infoΔ('Validating API for @betterer packages... ☀️');

  const items = await fs.readdir(PACKAGES_DIR);

  const testDirectory = await Promise.all(
    items.map(async (item) => {
      const stats = await fs.lstat(path.join(PACKAGES_DIR, item));
      return stats.isDirectory();
    })
  );

  const packages = items.filter((_, index) => testDirectory[index]);
  const validPackages = packages.filter((packageName) => {
    return packageName && !EXCLUDED_PACKAGES.includes(packageName);
  });

  const results = await Promise.all(
    validPackages.map(
      async (packageName): Promise<boolean> => {
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
          errorΔ(
            `Found "${foundToken}" in the API for "@betterer/${packageName}. This means internal code has been exposed.`
          );
          return false;
        }

        const isDefinitelyValid = packageGolden === packageGenerated;
        const isProbablyValid = isDefinitelyValid || checkForOutOfOrder(packageGenerated, packageGolden);
        if (isProbablyValid) {
          successΔ(`No Breaking API changes found in "@betterer/${packageName}" 👍`);
          if (!isDefinitelyValid) {
            infoΔ(`There's a *slight* chance this could be a false positive, so maybe just double check it! 😬`);
          }
          return true;
        }

        errorΔ(`Breaking API changes found in "@betterer/${packageName}" 👎`);
        const diff = verifyAgainstGoldenFile(packageDeclarationPath, packageGoldenPath, API_OPTIONS);
        brΔ();
        process.stdout.write(diff);
        brΔ();
        return false;
      }
    )
  );

  const failed = results.filter((result) => !result);
  if (failed.length) {
    process.exitCode = 1;
  }
})();

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
