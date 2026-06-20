import type { CreateNodesV2, CreateNodesContextV2, TargetConfiguration } from '@nx/devkit';

import { createNodesFromFiles } from '@nx/devkit';
import assert from 'node:assert';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

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
  const packageJson = JSON.parse(packageJsonContents) as { name?: string; publishConfig?: unknown; private?: boolean };
  if (!packageJson.publishConfig || packageJson.private) {
    return {};
  }

  const unscopedPackageName = packageJson.name?.split('/').pop();
  assert(unscopedPackageName, `A publishable package must have a name: "${configFilePath}"`);

  const apiTarget: TargetConfiguration = {
    executor: 'nx:run-commands',
    options: {
      command: 'node --import tsx ../../tools/nx-plugin-betterer-monorepo-api/src/run.ts',
      cwd: projectRoot
    },
    dependsOn: ['typecheck', '^typecheck'],
    outputs: [
      `{workspaceRoot}/goldens/api/${unscopedPackageName}.api.md`,
      `{workspaceRoot}/goldens/models/${unscopedPackageName}.api.json`
    ],
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
