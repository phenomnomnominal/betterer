import { read } from '../src/reader';

it("returns an empty if file doesn't exist", async () => {
  expect(await read('./no-file')).toEqual({});
});

it("errors if the file exists but can't be imported", async () => {
  await expect(
    read(`${__dirname}/fixtures/invalid-js.js`)
  ).rejects.toThrowError();
});

it('returns valid config for a results file', async () => {
  const config = await read(`${__dirname}/fixtures/valid.results`);
  expect(config).toMatchInlineSnapshot(`
    Object {
      "no hack comments": Object {
        "timestamp": 1571095609800,
        "value": "3",
      },
      "no raw console.log": Object {
        "timestamp": 1571095610791,
        "value": "7",
      },
    }
  `);
});
