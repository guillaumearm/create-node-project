import { addition } from './addition';

describe('node-skeleton:index', () => {
  test('it should add 2 numbers', () => {
    const result = addition(22, 20);
    const expected = 42;

    expect(result).toBe(expected);
  });
});
