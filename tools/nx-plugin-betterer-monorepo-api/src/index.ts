import type { CreateNodesV2, CreateNodesContextV2, TargetConfiguration } from '@nx/devkit';

import { createNodesFromFiles } from '@nx/devkit';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';

export interface APIExtractorPluginOptions {
  apiTargetName?: string;
}

const packageJsonGlob = '**/package.json';

export const createNodesV2: CreateNodesV2<APIExtractorPluginOptions> = [
  packageJsonGlob,
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (configFile, options, context) => createNodesInternal(configFile, options ?? {}, context),
      configFiles,
      options,
      context
    );
  }
];

async function createNodesInternal(
  configFilePath: string,
  options: APIExtractorPluginOptions,
  context: CreateNodesContextV2
) {
  const projectRoot = dirname(configFilePath);

  // Only create api target for publishable packages
  const packageJsonPath = join(context.workspaceRoot, configFilePath);
  const packageJsonContents = await readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContents) as { publishConfig?: unknown; private?: boolean };
  if (!packageJson.publishConfig || packageJson.private) {
    return {};
  }

  const apiTarget: TargetConfiguration = {
    executor: 'nx:run-commands',
    options: {
      command: 'node --import tsx ../../tools/nx-plugin-betterer-monorepo-api/src/run.ts',
      cwd: projectRoot
    },
    dependsOn: ['compile'],
    outputs: [`{workspaceRoot}/goldens/api/{projectName}.api.md`],
    cache: true
  };

  return {
    projects: {
      [projectRoot]: {
        targets: {
          [options.apiTargetName ?? 'api']: apiTarget
        }
      }
    }
  };
}
