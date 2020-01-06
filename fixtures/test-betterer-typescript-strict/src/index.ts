export function extractIds(list) {
  return list.map(member => member.id);
}

function bar() {
  return this.baz.toUpperCase();
}

const foo = {
  baz: 'baz',
  bar
};

foo.bar();

export function findNumberFixed(numbers: Array<number>, search: number) {
  const number = numbers.find(n => n === search);
  return number.toFixed(2);
}

export class Foo {
  private bar: number;
  constructor() {}
}

export function sum(num1: number, num2: number) {
  return num1 + num2;
}

sum.apply(null, [1, 2, 3]);

const a = 'a';
const one = 1;
console.log(a * one);