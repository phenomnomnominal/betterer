import { print } from '../src/printer';

it('prints numbers correctly in the snapshot', () => {
  expect(
    print({
      'with number': {
        timestamp: 0,
        value: '12'
      }
    })
  ).toMatchInlineSnapshot(`
    "// BETTERER RESULTS V1.
    exports[\`with number\`] = { timestamp: 0, value: \`12\` };"
  `);
});

it('prints arrays correctly in the snapshot', () => {
  expect(
    print({
      'with array': {
        timestamp: 0,
        value: '[1, 2, 3]'
      }
    })
  ).toMatchInlineSnapshot(`
    "// BETTERER RESULTS V1.
    exports[\`with array\`] = { timestamp: 0, value: \`[
    1,
    2,
    3
    ]\` };"
  `);
});

it('prints objects correctly in the snapshot', () => {
  expect(
    print({
      'with object': {
        timestamp: 0,
        value: '{ "file/a": [[1,1],[2,2]], "file/b": [[3,3],[4,4]] }'
      }
    })
  ).toMatchInlineSnapshot(`
    "// BETTERER RESULTS V1.
    exports[\`with object\`] = { timestamp: 0, value: \`{
    \\"file/a\\":[[1,1],[2,2]],
    \\"file/b\\":[[3,3],[4,4]]
    }\` };"
  `);
});
