/* eslint-disable */
export function setupTestdouble() {
  const td = require('testdouble');
  require('testdouble-jest')(td, jest);
}
