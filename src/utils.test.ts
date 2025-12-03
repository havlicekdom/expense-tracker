import { describe, it, expect } from 'vitest';
import type { Category, MoneyRecord } from './types';
import {
  findHighestId,
  findCategoryById,
  isExpense,
  getCurrentBalance,
  aggregateByCategoryAndType,
  getGraphData,
  getRandomColor,
} from './utils';

describe('Utils', () => {
  describe('findHighestId', () => {
    it('should return the highest id from an array', () => {
      const items = [
        { id: 1, name: 'Item 1' },
        { id: 5, name: 'Item 5' },
        { id: 3, name: 'Item 3' },
      ];
      expect(findHighestId(items)).toBe(5);
    });

    it('should handle single item', () => {
      const items = [{ id: 42, name: 'Item' }];
      expect(findHighestId(items)).toBe(42);
    });

    it('should handle items with id 0', () => {
      const items = [
        { id: 0, name: 'Item 0' },
        { id: 2, name: 'Item 2' },
      ];
      expect(findHighestId(items)).toBe(2);
    });
  });

  describe('findCategoryById', () => {
    it('should find category by id', () => {
      const categories: Category[] = [
        { id: 0, label: 'Food', name: 'food' },
        { id: 1, label: 'Transport', name: 'transport' },
        { id: 2, label: 'Entertainment', name: 'entertainment' },
      ];
      const result = findCategoryById(categories, 1);
      expect(result).toEqual({ id: 1, label: 'Transport', name: 'transport' });
    });

    it('should return undefined if category not found', () => {
      const categories: Category[] = [
        { id: 0, label: 'Food', name: 'food' },
      ];
      const result = findCategoryById(categories, 999);
      expect(result).toBeUndefined();
    });

    it('should find first category with id 0', () => {
      const categories: Category[] = [
        { id: 0, label: 'Food', name: 'food' },
      ];
      const result = findCategoryById(categories, 0);
      expect(result).toEqual({ id: 0, label: 'Food', name: 'food' });
    });
  });

  describe('isExpense', () => {
    it('should return true for expense records', () => {
      const record: MoneyRecord = {
        id: 0,
        type: 'expense',
        date: '2024-01-01',
        info: 'Coffee',
        value: 5,
        category: 0,
      };
      expect(isExpense(record)).toBe(true);
    });

    it('should return false for income records', () => {
      const record: MoneyRecord = {
        id: 0,
        type: 'income',
        date: '2024-01-01',
        info: 'Salary',
        value: 1000,
        category: 0,
      };
      expect(isExpense(record)).toBe(false);
    });
  });

  describe('getCurrentBalance', () => {
    it('should calculate balance correctly with expenses and income', () => {
      const records: MoneyRecord[] = [
        {
          id: 0,
          type: 'income',
          date: '2024-01-01',
          info: 'Salary',
          value: 1000,
          category: 0,
        },
        {
          id: 1,
          type: 'expense',
          date: '2024-01-02',
          info: 'Coffee',
          value: 5,
          category: 1,
        },
        {
          id: 2,
          type: 'expense',
          date: '2024-01-03',
          info: 'Lunch',
          value: 15,
          category: 1,
        },
      ];
      expect(getCurrentBalance(records)).toBe(980);
    });

    it('should return 0 for empty array', () => {
      expect(getCurrentBalance([])).toBe(0);
    });

    it('should handle only income', () => {
      const records: MoneyRecord[] = [
        {
          id: 0,
          type: 'income',
          date: '2024-01-01',
          info: 'Salary',
          value: 1000,
          category: 0,
        },
      ];
      expect(getCurrentBalance(records)).toBe(1000);
    });

    it('should handle only expenses', () => {
      const records: MoneyRecord[] = [
        {
          id: 0,
          type: 'expense',
          date: '2024-01-01',
          info: 'Coffee',
          value: 5,
          category: 0,
        },
      ];
      expect(getCurrentBalance(records)).toBe(-5);
    });
  });

  describe('aggregateByCategoryAndType', () => {
    const records: MoneyRecord[] = [
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
        type: 'expense',
        date: '2024-01-02',
        info: 'Lunch',
        value: 15,
        category: 0,
      },
      {
        id: 2,
        type: 'expense',
        date: '2024-01-03',
        info: 'Ticket',
        value: 10,
        category: 1,
      },
      {
        id: 3,
        type: 'income',
        date: '2024-01-04',
        info: 'Bonus',
        value: 100,
        category: 0,
      },
    ];

    it('should aggregate expenses by category', () => {
      const category: Category = { id: 0, label: 'Food', name: 'food' };
      const result = aggregateByCategoryAndType(records, category, 'expense');
      expect(result).toBe(20);
    });

    it('should aggregate income by category', () => {
      const category: Category = { id: 0, label: 'Food', name: 'food' };
      const result = aggregateByCategoryAndType(records, category, 'income');
      expect(result).toBe(100);
    });

    it('should return 0 for category with no records', () => {
      const category: Category = { id: 2, label: 'Other', name: 'other' };
      const result = aggregateByCategoryAndType(records, category, 'expense');
      expect(result).toBe(0);
    });

    it('should return 0 for different type', () => {
      const category: Category = { id: 1, label: 'Transport', name: 'transport' };
      const result = aggregateByCategoryAndType(records, category, 'income');
      expect(result).toBe(0);
    });
  });

  describe('getGraphData', () => {
    const records: MoneyRecord[] = [
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
        type: 'expense',
        date: '2024-01-02',
        info: 'Lunch',
        value: 15,
        category: 0,
      },
      {
        id: 2,
        type: 'expense',
        date: '2024-01-03',
        info: 'Ticket',
        value: 10,
        category: 1,
      },
    ];

    const categories: Category[] = [
      { id: 0, label: 'Food', name: 'food' },
      { id: 1, label: 'Transport', name: 'transport' },
      { id: 2, label: 'Entertainment', name: 'entertainment' },
    ];

    it('should generate graph data for expenses', () => {
      const result = getGraphData(records, categories, 'expense');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ category: 'Food', value: 20 });
      expect(result[1]).toEqual({ category: 'Transport', value: 10 });
    });

    it('should not include zero values', () => {
      const result = getGraphData(records, categories, 'expense');
      expect(result.some((item: { category: string; value: number }) => item.value === 0)).toBe(false);
    });

    it('should return empty array for type with no records', () => {
      const result = getGraphData(records, categories, 'income');
      expect(result).toHaveLength(0);
    });

    it('should handle empty categories', () => {
      const result = getGraphData(records, [], 'expense');
      expect(result).toHaveLength(0);
    });

    it('should handle empty records', () => {
      const result = getGraphData([], categories, 'expense');
      expect(result).toHaveLength(0);
    });
  });

  describe('getRandomColor', () => {
    it('should return a string', () => {
      const color = getRandomColor();
      expect(typeof color).toBe('string');
    });

    it('should return a color starting with #', () => {
      const color = getRandomColor();
      expect(color.startsWith('#')).toBe(true);
    });

    it('should return a valid hex color', () => {
      const color = getRandomColor();
      expect(/^#[0-9A-F]{6}$/i.test(color)).toBe(true);
    });

    it('should return different colors on multiple calls (usually)', () => {
      const colors = new Set();
      for (let i = 0; i < 20; i++) {
        colors.add(getRandomColor());
      }
      // Should have multiple unique colors in 20 calls
      expect(colors.size).toBeGreaterThan(1);
    });
  });
});
