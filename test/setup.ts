console['log'] = (): void => {
  //
};

Date['now'] = function (): number {
  return 0;
}.bind(Date);

jest.setTimeout(1000000);
