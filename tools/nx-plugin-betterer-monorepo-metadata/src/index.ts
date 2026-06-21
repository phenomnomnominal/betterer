import type { CreateNodesV2, CreateNodesContextV2, TargetConfiguration } from '@nx/devkit';

import { createNodesFromFiles } from '@nx/devkit';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export interface MetadataPluginOptions {
  syncMetadataTargetName?: string;
}

const packageJsonGlob = '**/package.json';

export const createNodesV2: CreateNodesV2<MetadataPluginOptions> = [
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
  options: MetadataPluginOptions,
  context: CreateNodesContextV2
) {
  const projectRoot = dirname(configFilePath);
  const packageJsonPath = join(context.workspaceRoot, configFilePath);
  const packageJsonContents = await readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContents) as { private?: boolean; publishConfig?: unknown };

  if (packageJson.private || !packageJson.publishConfig) {
    return {};
  }

  const syncMetadataTarget: TargetConfiguration = {
    executor: 'nx:run-commands',
    options: {
      command: `node --import tsx ../../tools/nx-plugin-betterer-monorepo-metadata/src/sync.ts`,
      cwd: projectRoot
    }
  };

  return {
    projects: {
      [projectRoot]: {
        targets: {
          [options.syncMetadataTargetName ?? 'sync:metadata']: syncMetadataTarget
        }
      }
    }
  };
}
