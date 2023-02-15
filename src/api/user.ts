import type { User } from '../types';

const users: User[] = [
  {
    username: 'Test',
    email: 'test@test.com',
    id: 1,
  },
];

export const loginUser = (email: string) => {
  const loggedInUser = users.find((user) => user.email === email);

  if (!loggedInUser) throw new Error('User does not exist');

  return loggedInUser;
};
