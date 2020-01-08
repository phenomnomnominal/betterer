const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/extension.ts',
  mode: 'development',
  externals: { ...nodeExternals(), vscode: 'commonjs vscode', fsevents: 'commonjs fsevents' },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'extension.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  }
};
