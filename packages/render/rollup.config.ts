import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';

export default {
  input: './src/index.tsx',
  output: {
    dir: 'dist',
    format: 'cjs',
    sourcemap: true,
    strict: false
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
      "'use strict'": ''
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
