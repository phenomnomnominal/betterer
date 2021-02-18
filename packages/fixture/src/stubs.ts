import { performance } from 'perf_hooks';
import util from 'util';

Date['now'] = function (): number {
  return 0;
}.bind(Date);

performance['now'] = function (): number {
  return 0;
}.bind(performance);

util.inspect = Object.assign(
  function (): string {
    return '';
  }.bind(util),
  util.inspect
);
