import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MoneyRecordForm } from './MoneyRecordForm';
import { CategoryContext } from '../category/CategoryContext';
import type { Category, MoneyRecord } from '../types';

describe('MoneyRecordForm', () => {
  const mockSubmitHandler = vi.fn();
  const mockHandleClose = vi.fn();

  const mockCategories: Category[] = [
    { id: 0, name: 'food', label: 'Food & Groceries' },
    { id: 1, name: 'transport', label: 'Transportation' },
    { id: 2, name: 'entertainment', label: 'Entertainment' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = (props: Partial<React.ComponentProps<typeof MoneyRecordForm>> = {}) => {
    const defaultProps: React.ComponentProps<typeof MoneyRecordForm> = {
      open: true,
      handleClose: mockHandleClose,
      submitHandler: mockSubmitHandler,
      actionTitle: 'Add new',
      moneyRecord: null,
      ...props,
    };

    const mockContextValue = {
      categories: mockCategories,
      addMoneyRecord: vi.fn(),
      removeMoneyRecord: vi.fn(),
      editMoneyRecord: vi.fn(),
      getMoneyRecords: vi.fn(),
      moneyRecords: [],
    } as any;

    return render(
      <CategoryContext.Provider value={mockContextValue}>
        <MoneyRecordForm {...defaultProps} />
      </CategoryContext.Provider>
    );
  };

  const getValueInput = () => screen.getByLabelText(/Value/i) as HTMLInputElement;
  const getDateInput = () => screen.getByLabelText(/Date/i) as HTMLInputElement;
  const getInfoInput = () => screen.getByLabelText(/Info/i) as HTMLInputElement;

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
      expect(screen.getByRole('heading', { name: 'Add new money record' })).toBeInTheDocument();
    });

    it('shows edit heading for edit mode', () => {
      renderForm({ actionTitle: 'Edit' });
      expect(screen.getByRole('heading', { name: 'Edit money record' })).toBeInTheDocument();
    });

    it('renders record type radio buttons', () => {
      renderForm();
      expect(screen.getByLabelText('Expense')).toBeInTheDocument();
      expect(screen.getByLabelText('Income')).toBeInTheDocument();
    });

    it('renders all category options in select', async () => {
      const user = userEvent.setup();
      renderForm();
      
      const categorySelect = document.querySelector('input[aria-haspopup="listbox"]') as HTMLElement;
      if (categorySelect) {
        await user.click(categorySelect);
        for (const category of mockCategories) {
          expect(screen.getByText(category.label)).toBeInTheDocument();
        }
      }
    });

    it('renders inputs for value, date, and info', () => {
      renderForm();
      expect(getValueInput()).toBeInTheDocument();
      expect(getDateInput()).toBeInTheDocument();
      expect(getInfoInput()).toBeInTheDocument();
    });

    it('renders submit button', () => {
      renderForm({ actionTitle: 'Add new' });
      expect(screen.getByRole('button', { name: /Add new money record/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows error for zero value', async () => {
      const user = userEvent.setup();
      renderForm();

      const valueInput = getValueInput();
      const dateInput = getDateInput();
      const infoInput = getInfoInput();
      const submitButton = screen.getByRole('button', { name: /Add new money record/i });

      await user.type(valueInput, '0');
      await user.type(dateInput, '2024-01-01');
      await user.type(infoInput, 'Coffee');

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/You must enter positive, non-zero value/i)).toBeInTheDocument();
      });
    });

    it('shows error for negative value', async () => {
      const user = userEvent.setup();
      renderForm();

      const valueInput = getValueInput();
      const submitButton = screen.getByRole('button', { name: /Add new money record/i });

      await user.type(valueInput, '-10');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/You must enter positive, non-zero value/i)).toBeInTheDocument();
      });
    });

    it('shows error when category not selected', async () => {
      const user = userEvent.setup();
      renderForm();

      const valueInput = getValueInput();
      const dateInput = getDateInput();
      const infoInput = getInfoInput();
      const submitButton = screen.getByRole('button', { name: /Add new money record/i });

      await user.type(valueInput, '50');
      await user.type(dateInput, '2024-01-01');
      await user.type(infoInput, 'Coffee');

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please select a category/i)).toBeInTheDocument();
      });
    });

    it('shows error for missing date', async () => {
      const user = userEvent.setup();
      renderForm();

      const valueInput = getValueInput();
      const infoInput = getInfoInput();
      const submitButton = screen.getByRole('button', { name: /Add new money record/i });

      await user.type(valueInput, '50');
      await user.type(infoInput, 'Coffee');

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please enter the date/i)).toBeInTheDocument();
      });
    });

    it('shows error for missing info', async () => {
      const user = userEvent.setup();
      renderForm();

      const valueInput = getValueInput();
      const dateInput = getDateInput();
      const submitButton = screen.getByRole('button', { name: /Add new money record/i });

      await user.type(valueInput, '50');
      await user.type(dateInput, '2024-01-01');

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please enter the info/i)).toBeInTheDocument();
      });
    });
  });

  describe('Edit mode behavior', () => {
    it('populates fields when moneyRecord provided', () => {
      const moneyRecord: MoneyRecord = {
        id: 1,
        type: 'expense',
        date: '2024-01-01',
        info: 'Coffee',
        value: 5,
        category: 0,
      };

      renderForm({ moneyRecord, actionTitle: 'Edit' });

      const valueInput = getValueInput();
      const dateInput = getDateInput();
      const infoInput = getInfoInput();

      expect(valueInput).toHaveValue('5');
      expect(dateInput).toHaveValue('2024-01-01');
      expect(infoInput).toHaveValue('Coffee');
    });

    it('preserves id in hidden input', () => {
      const moneyRecord: MoneyRecord = {
        id: 42,
        type: 'income',
        date: '2024-01-15',
        info: 'Salary',
        value: 1000,
        category: 1,
      };

      renderForm({ moneyRecord, actionTitle: 'Edit' });

      const idInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(idInput.value).toBe('42');
    });

    it('shows edit button text in edit mode', () => {
      const moneyRecord: MoneyRecord = {
        id: 1,
        type: 'expense',
        date: '2024-01-01',
        info: 'Coffee',
        value: 5,
        category: 0,
      };

      renderForm({ moneyRecord, actionTitle: 'Edit' });

      expect(screen.getByRole('button', { name: /Edit money record/i })).toBeInTheDocument();
    });
  });

  describe('Close behavior', () => {
    it('calls handleClose on Escape key', () => {
      renderForm();

      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Escape' });

      expect(mockHandleClose).toHaveBeenCalled();
    });
  });
});
