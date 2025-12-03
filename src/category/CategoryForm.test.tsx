import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryForm } from './CategoryForm';
import type { Category } from '../types';

describe('CategoryForm', () => {
  const mockSubmitHandler = vi.fn();
  const mockHandleClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = (props: Partial<React.ComponentProps<typeof CategoryForm>> = {}) => {
    const defaultProps: React.ComponentProps<typeof CategoryForm> = {
      open: true,
      handleClose: mockHandleClose,
      submitHandler: mockSubmitHandler,
      actionTitle: 'Add new',
      category: null,
      ...props,
    };
    return render(<CategoryForm {...defaultProps} />);
  };

  const getNameInput = () => document.querySelector('input[name="name"]') as HTMLInputElement;
  const getLabelInput = () => document.querySelector('input[name="label"]') as HTMLInputElement;

  describe('Rendering', () => {
    it('renders dialog when open is true', () => {
      renderForm({ open: true });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not render dialog when open is false', () => {
      renderForm({ open: false });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows add heading for add mode', () => {
      renderForm({ actionTitle: 'Add new' });
      expect(screen.getByRole('heading', { name: 'Add new category' })).toBeInTheDocument();
    });

    it('shows edit heading for edit mode', () => {
      renderForm({ actionTitle: 'Edit' });
      expect(screen.getByRole('heading', { name: 'Edit category' })).toBeInTheDocument();
    });

    it('renders inputs and submit button', () => {
      renderForm();
      expect(getNameInput()).toBeInTheDocument();
      expect(getLabelInput()).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /category$/i })).toBeInTheDocument();
    });
  });

  describe('Submission', () => {
    it('submits valid form', async () => {
      const user = userEvent.setup();
      renderForm();

      const nameInput = getNameInput();
      const labelInput = getLabelInput();
      const submitButton = screen.getByRole('button', { name: /Add new category/i });

      await user.type(nameInput, 'food');
      await user.type(labelInput, 'Food & Groceries');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSubmitHandler).toHaveBeenCalledWith(expect.objectContaining({ name: 'food', label: 'Food & Groceries' }));
      });
    });

    it('does not submit with invalid inputs', async () => {
      const user = userEvent.setup();
      renderForm();

      const nameInput = getNameInput();
      const submitButton = screen.getByRole('button', { name: /Add new category/i });

      await user.type(nameInput, 'Food');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSubmitHandler).not.toHaveBeenCalled();
      });
    });
  });

  describe('Validation messages', () => {
    it('shows error for empty name', async () => {
      const user = userEvent.setup();
      renderForm();
      const labelInput = getLabelInput();
      const submitButton = screen.getByRole('button', { name: /Add new category/i });

      await user.type(labelInput, 'Food');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please enter the category name|Name must be one lowercase word/i)).toBeInTheDocument();
      });
    });

    it('shows error for invalid name pattern', async () => {
      const user = userEvent.setup();
      renderForm();
      const nameInput = getNameInput();
      const labelInput = getLabelInput();
      const submitButton = screen.getByRole('button', { name: /Add new category/i });

      await user.type(nameInput, 'Food123');
      await user.type(labelInput, 'Food');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Name must be one lowercase word/i)).toBeInTheDocument();
      });
    });
  });

  describe('Edit mode behavior', () => {
    it('populates fields when category provided', () => {
      const category: Category = { id: 1, name: 'food', label: 'Food & Groceries' };
      renderForm({ category, actionTitle: 'Edit' });

      const nameInput = getNameInput();
      const labelInput = getLabelInput();

      expect(nameInput.value).toBe('food');
      expect(labelInput.value).toBe('Food & Groceries');
    });

    it('preserves id in hidden input', () => {
      const category: Category = { id: 42, name: 'transport', label: 'Transportation' };
      renderForm({ category, actionTitle: 'Edit' });
      const idInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(idInput.value).toBe('42');
    });
  });
});
