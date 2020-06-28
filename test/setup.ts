// eslint-disable-next-line no-console
console['log'] = (): void => {
  //
};

Date['now'] = function (): number {
  return 0;
}.bind(Date);

jest.setTimeout(200000);
