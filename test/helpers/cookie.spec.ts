import cookie from '../../src/helpers/cookie';

describe('helpers: cookie', () => {
  test('should return null when cookie is not exist', () => {
    const randomName = Math.random().toString();
    expect(cookie.read(randomName)).toBeNull();
  });

  test('should return cookie value when exist', () => {
    const cookieName = Math.random().toString();
    const cookieValue = Math.random().toString();
    document.cookie = `${cookieName}=${cookieValue}`;
    expect(cookie.read(cookieName)).toBe(cookieValue);
  });
});