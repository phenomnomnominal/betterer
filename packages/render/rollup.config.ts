import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';

export default {
  input: './src/index.tsx',
  output: {
    sourcemap: true,
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    nodeResolve({
      preferBuiltins: false
    }),
    json(),
    commonjs({
      include: /node_modules/
    }),
    typescript({
      sourceMap: true
    })
  ]
};
