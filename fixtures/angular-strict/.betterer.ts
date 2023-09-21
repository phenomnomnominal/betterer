import { angular } from '@betterer/angular';

export default {
  angular: () => angular('./tsconfig.json', {
    strictTemplates: true
  }).include('./src/**/*.ts', './src/**/*.html')
};