import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { useContext, useState } from 'react';
import { AuthProvider, AuthContext } from './AuthContext';
import * as api from './api';

// Mock the api module
vi.mock('./api', () => ({
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
}));

const mockLoginUserApi = vi.mocked(api.loginUser);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AuthProvider', () => {
    it('provides auth context to children', () => {
      const TestComponent = () => {
        const auth = useContext(AuthContext);
        return <div>{auth.user ? 'Logged in' : 'Not logged in'}</div>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });

    it('initializes with null user', () => {
      const TestComponent = () => {
        const auth = useContext(AuthContext);
        return <div>{JSON.stringify(auth.user)}</div>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByText('null')).toBeInTheDocument();
    });
  });

  describe('loginUser', () => {
    it('sets user when login succeeds', async () => {
      const mockUser = { id: 1, username: 'Test', email: 'test@test.com' };
      mockLoginUserApi.mockReturnValue(mockUser);

      const TestComponent = () => {
        const auth = useContext(AuthContext);
        return (
          <div>
            <button onClick={() => auth.loginUser('test@test.com')}>Login</button>
            <div>{auth.user ? `Logged in as ${auth.user.username}` : 'Not logged in'}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      act(() => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(mockLoginUserApi).toHaveBeenCalledWith('test@test.com');
      });
    });

    it('calls api with correct email', () => {
      mockLoginUserApi.mockReturnValue({ id: 1, username: 'Test', email: 'user@example.com' });

      const TestComponent = () => {
        const auth = useContext(AuthContext);
        return (
          <button onClick={() => auth.loginUser('user@example.com')}>Login</button>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      act(() => {
        loginButton.click();
      });

      expect(mockLoginUserApi).toHaveBeenCalledWith('user@example.com');
      expect(mockLoginUserApi).toHaveBeenCalledTimes(1);
    });

    it('throws error when user not found', () => {
      mockLoginUserApi.mockImplementation(() => {
        throw new Error('User does not exist');
      });

      const TestComponent = () => {
        const auth = useContext(AuthContext);
        const [error, setError] = useState<string | null>(null);

        const handleLogin = () => {
          try {
            auth.loginUser('nonexistent@test.com');
          } catch (err) {
            setError((err as Error).message);
          }
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            <div>{error || 'No error'}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      act(() => {
        loginButton.click();
      });

      expect(mockLoginUserApi).toHaveBeenCalled();
    });

    it('handles multiple login attempts', () => {
      const mockUser1 = { id: 1, username: 'User1', email: 'user1@test.com' };
      const mockUser2 = { id: 2, username: 'User2', email: 'user2@test.com' };

      const TestComponent = () => {
        const auth = useContext(AuthContext);
        const [loginCount, setLoginCount] = useState(0);

        const handleLogin = (email: string) => {
          auth.loginUser(email);
          setLoginCount(count => count + 1);
        };

        return (
          <div>
            <button onClick={() => handleLogin('user1@test.com')}>Login User 1</button>
            <button onClick={() => handleLogin('user2@test.com')}>Login User 2</button>
            <div>Logins: {loginCount}</div>
            <div>{auth.user?.username || 'Not logged in'}</div>
          </div>
        );
      };

      mockLoginUserApi.mockReturnValue(mockUser1);
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      let buttons = screen.getAllByRole('button');
      act(() => {
        buttons[0].click();
      });

      expect(mockLoginUserApi).toHaveBeenCalledWith('user1@test.com');

      mockLoginUserApi.mockReturnValue(mockUser2);
      buttons = screen.getAllByRole('button');
      act(() => {
        buttons[1].click();
      });

      expect(mockLoginUserApi).toHaveBeenCalledWith('user2@test.com');
    });
  });

  describe('logoutUser', () => {
    it('clears user on logout', async () => {
      const mockUser = { id: 1, username: 'Test', email: 'test@test.com' };
      mockLoginUserApi.mockReturnValue(mockUser);

      const TestComponent = () => {
        const auth = useContext(AuthContext);
        return (
          <div>
            <button onClick={() => auth.loginUser('test@test.com')}>Login</button>
            <button onClick={() => auth.logoutUser()}>Logout</button>
            <div>{auth.user ? `Logged in as ${auth.user.username}` : 'Not logged in'}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByRole('button', { name: 'Login' });
      act(() => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(screen.getByText(/Logged in as Test/)).toBeInTheDocument();
      });

      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      act(() => {
        logoutButton.click();
      });

      await waitFor(() => {
        expect(screen.getByText('Not logged in')).toBeInTheDocument();
      });
    });

    it('sets user to null', async () => {
      const mockUser = { id: 1, username: 'Test', email: 'test@test.com' };
      mockLoginUserApi.mockReturnValue(mockUser);

      const TestComponent = () => {
        const auth = useContext(AuthContext);
        return (
          <div>
            <button onClick={() => auth.loginUser('test@test.com')}>Login</button>
            <button onClick={() => auth.logoutUser()}>Logout</button>
            <div>{JSON.stringify(auth.user)}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByRole('button', { name: 'Login' });
      act(() => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(screen.queryByText('null')).not.toBeInTheDocument();
      });

      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      act(() => {
        logoutButton.click();
      });

      await waitFor(() => {
        expect(screen.getByText('null')).toBeInTheDocument();
      });
    });

    it('can logout multiple times', async () => {
      const mockUser = { id: 1, username: 'Test', email: 'test@test.com' };
      mockLoginUserApi.mockReturnValue(mockUser);

      const TestComponent = () => {
        const auth = useContext(AuthContext);
        const [logoutCount, setLogoutCount] = useState(0);

        const handleLogout = () => {
          auth.logoutUser();
          setLogoutCount(count => count + 1);
        };

        return (
          <div>
            <button onClick={() => auth.loginUser('test@test.com')}>Login</button>
            <button onClick={handleLogout}>Logout</button>
            <div>Logouts: {logoutCount}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByRole('button', { name: 'Login' });
      act(() => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(mockLoginUserApi).toHaveBeenCalled();
      });

      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      act(() => {
        logoutButton.click();
      });
      act(() => {
        logoutButton.click();
      });

      await waitFor(() => {
        expect(screen.getByText('Logouts: 2')).toBeInTheDocument();
      });
    });
  });

  describe('Context isolation', () => {
    it('maintains separate state for multiple providers', () => {
      const TestComponent = ({ id }: { id: number }) => {
        const auth = useContext(AuthContext);
        return <div>Provider {id}: {auth.user ? 'logged in' : 'logged out'}</div>;
      };

      render(
        <div>
          <AuthProvider>
            <TestComponent id={1} />
          </AuthProvider>
          <AuthProvider>
            <TestComponent id={2} />
          </AuthProvider>
        </div>
      );

      expect(screen.getByText('Provider 1: logged out')).toBeInTheDocument();
      expect(screen.getByText('Provider 2: logged out')).toBeInTheDocument();
    });
  });

  describe('Context values', () => {
    it('provides loginUser function', () => {
      const TestComponent = () => {
        const auth = useContext(AuthContext);
        const hasLoginUser = typeof auth.loginUser === 'function';
        return <div>{hasLoginUser ? 'Has loginUser' : 'Missing loginUser'}</div>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByText('Has loginUser')).toBeInTheDocument();
    });

    it('provides logoutUser function', () => {
      const TestComponent = () => {
        const auth = useContext(AuthContext);
        const hasLogoutUser = typeof auth.logoutUser === 'function';
        return <div>{hasLogoutUser ? 'Has logoutUser' : 'Missing logoutUser'}</div>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByText('Has logoutUser')).toBeInTheDocument();
    });

    it('provides user property', () => {
      const TestComponent = () => {
        const auth = useContext(AuthContext);
        const hasUser = 'user' in auth;
        return <div>{hasUser ? 'Has user' : 'Missing user'}</div>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByText('Has user')).toBeInTheDocument();
    });
  });
});
