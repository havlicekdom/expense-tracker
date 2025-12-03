import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import { AuthContext } from './AuthContext';

describe('LoginForm', () => {
  const mockLoginUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = () => {
    const mockContextValue = {
      loginUser: mockLoginUser,
      logoutUser: vi.fn(),
      user: null,
    } as any;

    return render(
      <AuthContext.Provider value={mockContextValue}>
        <LoginForm />
      </AuthContext.Provider>
    );
  };

  const getEmailInput = () => screen.getByLabelText(/Email/i) as HTMLInputElement;
  const getPasswordInput = () => screen.getByLabelText(/Password/i) as HTMLInputElement;

  describe('Rendering', () => {
    it('renders login form', () => {
      renderForm();
      expect(screen.getByRole('heading', { name: /Log in/i })).toBeInTheDocument();
    });

    it('renders email input', () => {
      renderForm();
      expect(getEmailInput()).toBeInTheDocument();
    });

    it('renders password input', () => {
      renderForm();
      const passwordInput = getPasswordInput();
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('renders submit button', () => {
      renderForm();
      expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
    });

    it('has required attribute on inputs', () => {
      renderForm();
      expect(getEmailInput()).toHaveAttribute('required');
      expect(getPasswordInput()).toHaveAttribute('required');
    });
  });
  describe('Form Submission', () => {
    it('submits valid credentials', async () => {
      const user = userEvent.setup();
      renderForm();

      const emailInput = getEmailInput();
      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', { name: /Log in/i });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith('test@test.com');
      });
    });

    it('calls loginUser with correct email', async () => {
      const user = userEvent.setup();
      renderForm();

      const emailInput = getEmailInput();
      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', { name: /Log in/i });

      await user.type(emailInput, 'user@example.com');
      await user.type(passwordInput, 'pass');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith('user@example.com');
      });
    });

    it('does not submit with empty email', async () => {
      const user = userEvent.setup();
      renderForm();

      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', { name: /Log in/i });

      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLoginUser).not.toHaveBeenCalled();
      });
    });

    it('does not submit with empty password', async () => {
      const user = userEvent.setup();
      renderForm();

      const emailInput = getEmailInput();
      const submitButton = screen.getByRole('button', { name: /Log in/i });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLoginUser).not.toHaveBeenCalled();
      });
    });

    it('does not submit when both fields empty', async () => {
      const user = userEvent.setup();
      renderForm();

      const submitButton = screen.getByRole('button', { name: /Log in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLoginUser).not.toHaveBeenCalled();
      });
    });
  })

  describe('Form Validation', () => {
    it('shows error for invalid email format', async () => {
      const user = userEvent.setup();
      renderForm();

      const emailInput = getEmailInput();
      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', { name: /Log in/i });

      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/This is not a valid email/i)).toBeInTheDocument();
      });
    });

    it('does not call loginUser on email validation error', async () => {
      const user = userEvent.setup();
      renderForm();

      const emailInput = getEmailInput();
      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', { name: /Log in/i });

      await user.type(emailInput, 'not-an-email');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLoginUser).not.toHaveBeenCalled();
      });
    });

    it('accepts valid email formats', async () => {
      const user = userEvent.setup();
      renderForm();

      const emailInput = getEmailInput();
      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', { name: /Log in/i });

      await user.type(emailInput, 'user.name+tag@example.co.uk');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith('user.name+tag@example.co.uk');
      });
    });
  })

  describe('Field Input', () => {
    it('accepts email input', async () => {
      const user = userEvent.setup();
      renderForm();

      const emailInput = getEmailInput();
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('accepts password input', async () => {
      const user = userEvent.setup();
      renderForm();

      const passwordInput = getPasswordInput();
      await user.type(passwordInput, 'mypassword');

      expect(passwordInput).toHaveValue('mypassword');
    });

    it('masks password input', () => {
      renderForm();
      const passwordInput = getPasswordInput();
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('allows clearing inputs', async () => {
      const user = userEvent.setup();
      renderForm();

      const emailInput = getEmailInput();
      const passwordInput = getPasswordInput();

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');

      await user.clear(emailInput);
      await user.clear(passwordInput);

      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });

    it('allows editing after initial input', async () => {
      const user = userEvent.setup();
      renderForm();

      const emailInput = getEmailInput();
      await user.type(emailInput, 'test@example.com');
      await user.clear(emailInput);
      await user.type(emailInput, 'other@example.com');

      expect(emailInput).toHaveValue('other@example.com');
    });
  })

  describe('Button behavior', () => {
    it('button is enabled by default', () => {
      renderForm();
      const submitButton = screen.getByRole('button', { name: /Log in/i });
      expect(submitButton).not.toBeDisabled();
    });

    it('button submits on Enter key press', async () => {
      const user = userEvent.setup();
      renderForm();

      const emailInput = getEmailInput();
      const passwordInput = getPasswordInput();

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith('test@test.com');
      });
    });

    it('contains login text', () => {
      renderForm();
      const button = screen.getByRole('button', { name: /Log in/i });
      expect(button.textContent).toContain('Log in');
    });
  })

  describe('Accessibility', () => {
    it('has proper labels for inputs', () => {
      renderForm();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    it('form is accessible with keyboard navigation', async () => {
      const user = userEvent.setup();
      renderForm();

      const emailInput = getEmailInput();
      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', { name: /Log in/i });

      act(() => {
        emailInput.focus();
      });
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  })

  describe('Multiple submissions', () => {
    it('allows multiple login attempts', async () => {
      const user = userEvent.setup();
      renderForm();

      const emailInput = getEmailInput();
      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', { name: /Log in/i });

      // First attempt
      await user.type(emailInput, 'first@test.com');
      await user.type(passwordInput, 'password1');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith('first@test.com');
      });

      // Clear for second attempt
      await user.clear(emailInput);
      await user.clear(passwordInput);

      // Second attempt
      await user.type(emailInput, 'second@test.com');
      await user.type(passwordInput, 'password2');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith('second@test.com');
      });

      expect(mockLoginUser).toHaveBeenCalledTimes(2);
    });
  })
});
