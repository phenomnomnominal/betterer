jest.mock('simple-git', () => {
  return {
    default: function () {
      let showCount = 0;
      return {
        log() {
          return {
            all: [
              {
                author_name: 'Buttercup',
                diff: {
                  files: [{ file: '.betterer.results' }]
                }
              },
              {
                author_name: 'Bubbles',
                diff: {
                  files: [{ file: '.betterer.results' }]
                }
              },
              {
                author_name: 'Mojo Jojo',
                diff: {
                  files: [{ file: '.betterer.results' }]
                }
              },
              {
                author_name: 'Blossom',
                diff: {
                  files: [{ file: '.betterer.results' }]
                }
              }
            ]
          };
        },
        show() {
          const SHOW_RESPONSES = [
            `
// BETTERER RESULTS V1.
exports[\`some test\`] = {
  timestamp: 10000000000,
  value: \`{
    "some/file:12345678": [
      [0, 0, 7, "Some error", "12345"],
    ]
  }\`
};
            `,
            `
// BETTERER RESULTS V1.
exports[\`some test\`] = {
  timestamp: 10000000000,
  value: \`{
    "some/file:12345678": [
      [0, 0, 7, "Some error", "12345"],
      [1, 0, 7, "Some error", "12345"],
      [2, 0, 7, "Some error", "12345"],
      [3, 0, 7, "Some error", "12345"]
    ]
  }\`
};
            `,
            `
// BETTERER RESULTS V1.
exports[\`some test\`] = {
  timestamp: 11000000000,
  value: \`{
    "some/file:12345678": [
      [0, 0, 7, "Some error", "12345"]
      [1, 0, 7, "Some error", "12345"],
    ]
  }\`
};
            `,
            `
// BETTERER RESULTS V1.
            `
          ];
          const result = SHOW_RESPONSES[showCount];
          showCount += 1;
          return result;
        }
      };
    }
  };
});

import { betterer } from '@betterer/betterer';
import { createFixture } from '../fixture';

describe('betterer score', () => {
  it('should score authors based on git history', async () => {
    const { logs } = await createFixture('test-betterer-score', {});

    const result = await betterer.score();

    expect(result).toMatchSnapshot();

    expect(logs).toMatchSnapshot();
  });
});
