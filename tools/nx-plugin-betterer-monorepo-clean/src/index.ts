import type { CreateNodesV2, CreateNodesContextV2, TargetConfiguration } from '@nx/devkit';

import { createNodesFromFiles } from '@nx/devkit';
import { dirname } from 'path';

export interface CleanPluginOptions {
  cleanTestsTargetName?: string;
  cleanCompileTargetName?: string;
  cleanModulesTargetName?: string;
}

const packageJsonGlob = '**/package.json';

export const createNodesV2: CreateNodesV2<CleanPluginOptions> = [
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

function createNodesInternal(configFilePath: string, options: CleanPluginOptions, _context: CreateNodesContextV2) {
  const projectRoot = dirname(configFilePath);

  const cleanTestsTarget: TargetConfiguration = {
    executor: 'nx:run-commands',
    options: {
      command: 'rimraf fixtures && rimraf reports',
      cwd: projectRoot
    }
  };

  const isRoot = projectRoot === '.';
  if (isRoot) {
    return {
      projects: {
        [projectRoot]: {
          targets: {
            [options.cleanTestsTargetName ?? 'clean:tests']: cleanTestsTarget
          }
        }
      }
    };
  }

  const cleanCompileTarget: TargetConfiguration = {
    executor: 'nx:run-commands',
    options: {
      command: 'rimraf ./dist && rimraf tsconfig.tsbuildinfo',
      cwd: projectRoot
    }
  };

  const cleanModulesTarget: TargetConfiguration = {
    executor: 'nx:run-commands',
    options: {
      command: 'rimraf ./node_modules',
      cwd: projectRoot
    }
  };

  return {
    projects: {
      [projectRoot]: {
        targets: {
          [options.cleanCompileTargetName ?? 'clean:compile']: cleanCompileTarget,
          [options.cleanModulesTargetName ?? 'clean:modules']: cleanModulesTarget
        }
      }
    }
  };
}
