import util from 'node:util';

util.inspect = Object.assign(
  function (): string {
    return '';
  }.bind(util),
  util.inspect
);
