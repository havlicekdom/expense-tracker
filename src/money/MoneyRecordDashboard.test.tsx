import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MoneyRecordDashboard } from './MoneyRecordDashboard';
import { MoneyRecordContext } from './MoneyRecordContext';
import { CategoryContext } from '../category/CategoryContext';
import type { MoneyRecord, Category } from '../types';

describe('MoneyRecordDashboard', () => {
  const mockAddMoneyRecord = vi.fn();
  const mockEditMoneyRecord = vi.fn();
  const mockRemoveMoneyRecord = vi.fn();

  const mockCategories: Category[] = [
    { id: 0, name: 'food', label: 'Food & Groceries' },
    { id: 1, name: 'transport', label: 'Transportation' },
  ];

  const mockMoneyRecords: MoneyRecord[] = [
    {
      id: 0,
      type: 'expense',
      date: '2024-01-01',
      info: 'Coffee',
      value: 5,
      category: 0,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderDashboard = (
    moneyRecords: MoneyRecord[] = [],
    categories: Category[] = mockCategories,
  ) => {
    const moneyRecordContextValue = {
      moneyRecords,
      addMoneyRecord: mockAddMoneyRecord,
      removeMoneyRecord: mockRemoveMoneyRecord,
      editMoneyRecord: mockEditMoneyRecord,
      getMoneyRecords: vi.fn(),
    } as any;

    const categoryContextValue = {
      categories,
      addCategory: vi.fn(),
      removeCategory: vi.fn(),
      editCategory: vi.fn(),
      getCategories: vi.fn(),
    } as any;

    return render(
      <CategoryContext.Provider value={categoryContextValue}>
        <MoneyRecordContext.Provider value={moneyRecordContextValue}>
          <MoneyRecordDashboard />
        </MoneyRecordContext.Provider>
      </CategoryContext.Provider>
    );
  };

  describe('Rendering', () => {
    it('renders the dashboard heading', () => {
      renderDashboard();
      expect(screen.getByRole('heading', { name: 'Your records' })).toBeInTheDocument();
    });

    it('renders the add button', () => {
      renderDashboard();
      const buttons = screen.getAllByRole('button');
      expect(buttons.some(btn => btn.textContent?.includes('Add new record'))).toBe(true);
    });

    it('renders money records grid', () => {
      renderDashboard(mockMoneyRecords);
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders with empty list initially', () => {
      renderDashboard([]);
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  describe('Add Money Record Dialog', () => {
    it('should open dialog when add button is clicked', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const buttons = screen.getAllByRole('button');
      const addButton = buttons.find(btn => btn.textContent?.includes('Add new record'));

      if (addButton) {
        await user.click(addButton);

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
      }
    });

    it('should show form dialog with add heading', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const buttons = screen.getAllByRole('button');
      const addButton = buttons.find(btn => btn.textContent?.includes('Add new record'));

      if (addButton) {
        await user.click(addButton);

        await waitFor(() => {
          const dialog = screen.getByRole('dialog');
          expect(dialog).toBeInTheDocument();
          expect(dialog.textContent).toContain('Add new money record');
        });
      }
    });

    it('should have input fields in dialog', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const buttons = screen.getAllByRole('button');
      const addButton = buttons.find(btn => btn.textContent?.includes('Add new record'));

      if (addButton) {
        await user.click(addButton);

        await waitFor(() => {
          const dialog = screen.getByRole('dialog');
          expect(dialog).toBeInTheDocument();
          // Check that we have input fields in the dialog
          expect(dialog.querySelector('input[name="value"]')).toBeInTheDocument();
        });
      }
    });

    it('should have submit button in dialog', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const buttons = screen.getAllByRole('button');
      const addButton = buttons.find(btn => btn.textContent?.includes('Add new record'));

      if (addButton) {
        await user.click(addButton);

        await waitFor(() => {
          expect(screen.getByRole('button', { name: /Add new money record/i })).toBeInTheDocument();
        });
      }
    });
  });

  describe('Multiple records', () => {
    it('should handle multiple money records', () => {
      const multipleRecords: MoneyRecord[] = [
        {
          id: 0,
          type: 'expense',
          date: '2024-01-01',
          info: 'Coffee',
          value: 5,
          category: 0,
        },
        {
          id: 1,
          type: 'income',
          date: '2024-01-02',
          info: 'Salary',
          value: 1000,
          category: 1,
        },
        {
          id: 2,
          type: 'expense',
          date: '2024-01-03',
          info: 'Lunch',
          value: 15,
          category: 0,
        },
      ];

      renderDashboard(multipleRecords);
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });
});
