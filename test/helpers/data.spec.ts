import {
  transformRequest,
  transformResponse
} from '../../src/helpers/data';

describe('helpers: data', () => {

  describe('should transformRequest return correctly', () => {
    test('should return string when pass a plain object', () => {
      const obj = { a: 1, b: { c: 3 } };
      const objString = JSON.stringify(obj);
      expect(transformRequest(obj)).toBe(objString);
    });
    test('should return original object when pass a complicated object', () => {
      const f1 = new Date();
      const f2 = new FormData();
      const f3 = 'HelloWorld';
      const f4 = null;
      expect(transformRequest(f1)).toBe(f1);
      expect(transformRequest(f2)).toBe(f2);
      expect(transformRequest(f3)).toBe(f3);
      expect(transformRequest(f4)).toBe(f4);
    });
  });

  describe('should transformResponse return correctly', () => {
    test('should return object when pass a valid string', () => {
      const o = {
        a: 1,
        b: 'dasda',
        c: {
          d: [1, 2, 3, 'aa']
        }
      };
      expect(transformResponse(JSON.stringify(o))).toEqual(o);
      expect(transformResponse(null)).toBeNull();
    });
    test('should return original object when pass an invalid string', () => {
      expect(transformResponse('')).toBe('');
      expect(transformResponse(undefined)).toBeUndefined();
    });
  });

})