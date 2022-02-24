import util from 'util';

util.inspect = Object.assign(
  function (): string {
    return '';
  }.bind(util),
  util.inspect
);
