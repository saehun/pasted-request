import { mergeDeepRight } from '../merge';

describe('mergeDeepRight function', () => {
  it('can merge simple two object', () => {
    expect(mergeDeepRight({ foo: 0, bar: 1 }, { foo: 2, bar: 3 })).toEqual({ foo: 2, bar: 3 });
  });

  it('can merge different form of objects', () => {
    expect(mergeDeepRight({ foo: 0 }, { foo: 2, bar: 3 })).toEqual({ foo: 2, bar: 3 });
  });

  it('can merge different form of objects 2', () => {
    expect(mergeDeepRight({ foo: 0, bar: { baz: { corge: true }, qux: 'quux' } }, { bar: 3 })).toEqual({
      foo: 0,
      bar: 3,
    });
  });

  it('can merge different form of objects 3', () => {
    expect(
      mergeDeepRight({ foo: 0, bar: { baz: { corge: true }, qux: 'quux' } }, { bar: { baz: { corge: false } } })
    ).toEqual({ foo: 0, bar: { baz: { corge: false }, qux: 'quux' } });
  });

  it('can merge different form of objects 4', () => {
    expect(
      mergeDeepRight({ foo: 0, bar: { baz: { corge: true }, qux: 'quux' } }, { bar: { baz: undefined, grault: 0 } })
    ).toEqual({ foo: 0, bar: { baz: undefined, qux: 'quux', grault: 0 } });
  });
});
