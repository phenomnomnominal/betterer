import { init } from '@betterer/cli/src';

import { fixture } from './fixture';

describe('betterer init', () => {
  it('should initialise betterer in a repo', async () => {
    const { paths, readFile, reset, resolve } = initFixture();

    const configPath = `${paths.config}.ts`;
    const fixturePath = paths.fixture;
    const packageJSONPath = resolve('./package.json');

    await reset();

    await init(fixturePath, ['node', './bin/betterer']);

    const packageJSON = JSON.parse(await readFile(packageJSONPath));

    expect(packageJSON.scripts.betterer).toEqual('betterer');
    expect(packageJSON.devDependencies['@betterer/cli']).toBeDefined();

    const config = await readFile(configPath);

    expect(config).toEqual('export default {\n  // Add tests here ☀️\n};');

    await reset();
  });

  it('should work multiple times', async () => {
    const { paths, reset } = initFixture();

    const fixturePath = paths.fixture;

    await reset();

    expect(async () => {
      await init(fixturePath, ['node', './bin/betterer']);
      await init(fixturePath, ['node', './bin/betterer']);
      await reset();
    }).not.toThrow();
  });
});

function initFixture(): ReturnType<typeof fixture> {
  const init = fixture('test-betterer-init');
  const { deleteFile, paths, readFile, writeFile, reset, resolve } = init;
  const packageJSONPath = resolve('./package.json');
  async function initReset(): Promise<void> {
    await reset();
    try {
      await deleteFile(`${paths.config}.ts`);
    } catch {
      // Moving on...
    }
    try {
      const packageJSON = JSON.parse(await readFile(packageJSONPath));
      delete packageJSON.scripts;
      delete packageJSON.devDependencies;
      const json = JSON.stringify(packageJSON, null, 2);
      await writeFile(packageJSONPath, json);
    } catch {
      // Moving on...
    }
  }
  return { ...init, reset: initReset };
}
