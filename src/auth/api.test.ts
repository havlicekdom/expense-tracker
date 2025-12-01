import { describe, it, expect } from 'vitest';
import { loginUser } from './api';

describe('auth/api - loginUser', () => {
  it('returns a user when email exists', () => {
    const user = loginUser('test@test.com');

    expect(user).toEqual({
      username: 'Test',
      email: 'test@test.com',
      id: 1,
    });
  });

  it('throws when email does not exist', () => {
    expect(() => loginUser('doesnotexist@example.com')).toThrow(
      'User does not exist',
    );
  });

  it('is case sensitive and will throw for different case', () => {
    expect(() => loginUser('Test@TEST.com')).toThrow('User does not exist');
  });
});
