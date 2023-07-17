/* eslint-disable @typescript-eslint/no-unsafe-assignment,  @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires -- this file is a temporary mess*/
export function setupTestdouble() {
  const td = require('testdouble');
  require('testdouble-jest')(td, jest);
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment,  @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires */
