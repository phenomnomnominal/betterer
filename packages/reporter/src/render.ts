import { RenderOptions } from 'ink';

const DEFAULT_RENDER_OPTIONS = {
  debug: process.env.NODE_ENV === 'test'
};

export function getRenderOptions(options: RenderOptions = {}): RenderOptions {
  return {
    ...DEFAULT_RENDER_OPTIONS,
    ...options
  };
}
