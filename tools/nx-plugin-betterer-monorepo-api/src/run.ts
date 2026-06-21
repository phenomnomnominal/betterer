import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
  types?: string;
};

const workspaceRoot = path.resolve(process.cwd(), '../..');
const configObjectFullPath = path.resolve(workspaceRoot, 'config/api-extractor.json');
const configObject = ExtractorConfig.loadFile(configObjectFullPath);

const mainEntryPointFilePath = packageJson.types
  ? path.resolve(process.cwd(), packageJson.types)
  : path.resolve(process.cwd(), './dist/index.d.ts');

const extractorConfig = ExtractorConfig.prepare({
  configObject: {
    ...configObject,
    mainEntryPointFilePath,
    projectFolder: process.cwd(),
    apiReport: {
      ...configObject.apiReport,
      enabled: true,
      reportFolder: path.resolve(workspaceRoot, 'goldens/api/'),
      reportTempFolder: path.resolve(workspaceRoot, 'goldens/temp/')
    },
    docModel: {
      ...configObject.docModel,
      enabled: true,
      apiJsonFilePath: path.resolve(workspaceRoot, 'goldens/models/<unscopedPackageName>.api.json')
    }
  },
  configObjectFullPath,
  packageJsonFullPath: packageJsonPath
});

const extractorResult = Extractor.invoke(extractorConfig, {
  localBuild: true,
  showVerboseMessages: true
});

if (!extractorResult.succeeded) {
  process.exitCode = 1;
}
