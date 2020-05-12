import {
  isPlainObject,
  isDate,
  extend,
  deepMerge,
  isFormData,
  isURLSearchParams
} from '../../src/helpers/util';

describe('helpers: util', () => {
  describe('util: isXXX', () => {
    test('should validate isPlainObject', () => {
      expect(isPlainObject({})).toBeTruthy();
      expect(isPlainObject(new Date())).toBeFalsy();
    });
    test('should validate isDate', () => {
      expect(isDate(new Date())).toBeTruthy();
      expect(isDate(1234)).toBeFalsy();
    });
    test('should validate isFormData', () => {
      expect(isFormData(new FormData())).toBeTruthy();
      expect(isFormData({})).toBeFalsy();
    });
    test('should validate isURLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy();
      expect(isURLSearchParams('a=1&b=2')).toBeFalsy();
    });
  });

  describe('util: extend', () => {
    test('should props copied from another object', () => {
      const a = {};
      const b = { foo: 1234 };
      const c = extend(a, b);
      expect(c.foo).toBe(b.foo);
      expect(c).toBe(a);
    });
  });

  describe('util: deepMerge', () => {
    test('should sources are immutable', () => {
      const a = { foo: 1234 };
      const b = { bar: 4567 };
      deepMerge(a, b);
      expect(a.foo).toBe(1234);
      expect((a as any).bar).toBe(undefined);
      expect(b.bar).toBe(4567);
      expect((b as any).foo).toBe(undefined);
    });

    test('should cloned object copied all props from sources', () => {
      const a = { foo: 1234 };
      const b = { bar: 4567 };
      const c = deepMerge(a, b);
      expect(c.foo).toBe(a.foo);
      expect(c.bar).toBe(b.bar);
    });

    test('should the prop behind cover the front', () => {
      const a = { foo: 1234 };
      const b = { foo: 4567 };
      const c = deepMerge(a, b);
      expect(c.foo).toBe(b.foo);
    });

    test('should copy prop nestly', () => {
      const a = {
        foo: 1, bar: {
          a: 2,
          b: 3,
          baz: {
            c: 4,
            d: 5
          }
        }
      };
      const b = {
        foo: 10,
        bar: {
          b: 50,
          baz: {
            c: 40
          }
        }
      };
      const c = deepMerge(a, b);
      expect(c).toEqual({
        foo: 10,
        bar: {
          a: 2,
          b: 50,
          baz: {
            c: 40,
            d: 5
          }
        }
      });
    });

    test('should return object when pass null or undefined', () => {
      const a = { foo: 1 };
      expect(deepMerge(a, null)).toEqual(a);
      expect(deepMerge(null, {})).toEqual({});
      expect(deepMerge(null, null)).toEqual({});
      expect(deepMerge(null, undefined)).toEqual({});
      expect(deepMerge(undefined, a)).toEqual(a);
      expect(deepMerge(undefined, undefined)).toEqual({});
    });
  });

});