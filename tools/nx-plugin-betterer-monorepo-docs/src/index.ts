import type { CreateNodesV2, CreateNodesContextV2, TargetConfiguration } from '@nx/devkit';

import { createNodesFromFiles } from '@nx/devkit';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';

export interface DocsPluginOptions {
  docsTargetName?: string;
}

const packageJsonGlob = '**/package.json';

export const createNodesV2: CreateNodesV2<DocsPluginOptions> = [
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

async function createNodesInternal(configFilePath: string, options: DocsPluginOptions, context: CreateNodesContextV2) {
  const projectRoot = dirname(configFilePath);

  // Only the root project gets the docs target
  if (projectRoot !== '.') {
    return {};
  }

  const packageJsonPath = join(context.workspaceRoot, configFilePath);
  const packageJsonContents = await readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContents) as { private?: boolean };

  if (!packageJson.private) {
    return {};
  }

  const docsTarget: TargetConfiguration = {
    executor: 'nx:run-commands',
    options: {
      commands: [
        'node --import tsx ./tools/nx-plugin-betterer-monorepo-docs/src/filter.ts',
        'api-documenter generate -i ./goldens/models -o ./website/docs/api/'
      ],
      parallel: false
    },
    dependsOn: ['api:all']
  };

  return {
    projects: {
      [projectRoot]: {
        targets: {
          [options.docsTargetName ?? 'docs']: docsTarget
        }
      }
    }
  };
}
