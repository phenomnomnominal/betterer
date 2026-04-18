export default {
  '*.{ts,tsx}': () => 'npm run compile:all && npm run api:all',
  '*.{ts,tsx,js,mjs}': 'eslint --fix',
  '*': 'prettier --write'
};
