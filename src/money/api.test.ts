import { beforeEach, describe, it, expect, vi } from 'vitest';
import type { MoneyRecord } from '../types';

describe('Money Record API', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('getMoneyRecords should return an empty array when localStorage is empty', async () => {
    const { getMoneyRecords } = await import('./api');
    const result = getMoneyRecords();
    expect(result).toEqual([]);
  });

  it('getMoneyRecords should return records from localStorage', async () => {
    const mockRecords: MoneyRecord[] = [
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
    ];
    localStorage.setItem('moneyRecords', JSON.stringify(mockRecords));
    vi.resetModules();

    const { getMoneyRecords } = await import('./api');
    const result = getMoneyRecords();
    expect(result).toEqual(mockRecords);
  });

  it('addMoneyRecord should add a record with id 0 when records array is empty', async () => {
    const { addMoneyRecord, getMoneyRecords } = await import('./api');
    const newRecord: MoneyRecord = {
      id: 0,
      type: 'expense',
      date: '2024-01-01',
      info: 'Coffee',
      value: 5,
      category: 0,
    };
    addMoneyRecord(newRecord);

    const records = getMoneyRecords();
    expect(records).toHaveLength(1);
    expect(records[0]).toEqual({
      id: 0,
      type: 'expense',
      date: '2024-01-01',
      info: 'Coffee',
      value: 5,
      category: 0,
    });
  });

  it('addMoneyRecord should increment id when adding to non-empty records', async () => {
    const { addMoneyRecord, getMoneyRecords } = await import('./api');
    const firstRecord: MoneyRecord = {
      id: 0,
      type: 'expense',
      date: '2024-01-01',
      info: 'Coffee',
      value: 5,
      category: 0,
    };
    const secondRecord: MoneyRecord = {
      id: 0,
      type: 'income',
      date: '2024-01-02',
      info: 'Salary',
      value: 1000,
      category: 1,
    };

    addMoneyRecord(firstRecord);
    addMoneyRecord(secondRecord);

    const records = getMoneyRecords();
    expect(records).toHaveLength(2);
    expect(records[0].id).toBe(0);
    expect(records[1].id).toBe(1);
  });

  it('addMoneyRecord should persist records to localStorage', async () => {
    const { addMoneyRecord } = await import('./api');
    const record: MoneyRecord = {
      id: 0,
      type: 'expense',
      date: '2024-01-01',
      info: 'Coffee',
      value: 5,
      category: 0,
    };
    addMoneyRecord(record);

    const stored = JSON.parse(localStorage.getItem('moneyRecords') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].info).toBe('Coffee');
  });

  it('addMoneyRecord should handle adding multiple records with correct ids', async () => {
    const { addMoneyRecord, getMoneyRecords } = await import('./api');
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
        id: 0,
        type: 'expense',
        date: '2024-01-02',
        info: 'Lunch',
        value: 15,
        category: 0,
      },
      {
        id: 0,
        type: 'income',
        date: '2024-01-03',
        info: 'Salary',
        value: 1000,
        category: 1,
      },
    ];

    records.forEach((rec) => addMoneyRecord(rec));

    const result = getMoneyRecords();
    expect(result).toHaveLength(3);
    expect(result.map((r: MoneyRecord) => r.id)).toEqual([0, 1, 2]);
  });

  it('removeMoneyRecord should remove a record by id', async () => {
    const { addMoneyRecord, removeMoneyRecord, getMoneyRecords } = await import('./api');
    const record1: MoneyRecord = {
      id: 0,
      type: 'expense',
      date: '2024-01-01',
      info: 'Coffee',
      value: 5,
      category: 0,
    };
    const record2: MoneyRecord = {
      id: 1,
      type: 'income',
      date: '2024-01-02',
      info: 'Salary',
      value: 1000,
      category: 1,
    };

    addMoneyRecord(record1);
    addMoneyRecord(record2);

    removeMoneyRecord(record1);

    const records = getMoneyRecords();
    expect(records).toHaveLength(1);
    expect(records[0].id).toBe(1);
  });

  it('removeMoneyRecord should persist removal to localStorage', async () => {
    const { addMoneyRecord, removeMoneyRecord } = await import('./api');
    const record: MoneyRecord = {
      id: 0,
      type: 'expense',
      date: '2024-01-01',
      info: 'Coffee',
      value: 5,
      category: 0,
    };
    addMoneyRecord(record);
    removeMoneyRecord(record);

    const stored = JSON.parse(localStorage.getItem('moneyRecords') || '[]');
    expect(stored).toHaveLength(0);
  });

  it('removeMoneyRecord should handle removing from middle of array', async () => {
    const { addMoneyRecord, removeMoneyRecord, getMoneyRecords } = await import('./api');
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
        type: 'income',
        date: '2024-01-03',
        info: 'Salary',
        value: 1000,
        category: 1,
      },
    ];

    records.forEach((rec) => addMoneyRecord(rec));
    removeMoneyRecord(records[1]);

    const result = getMoneyRecords();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(0);
    expect(result[1].id).toBe(2);
  });

  it('updateMoneyRecord should update a record by id', async () => {
    const { addMoneyRecord, updateMoneyRecord, getMoneyRecords } = await import('./api');
    const original: MoneyRecord = {
      id: 0,
      type: 'expense',
      date: '2024-01-01',
      info: 'Coffee',
      value: 5,
      category: 0,
    };
    addMoneyRecord(original);

    const updated: MoneyRecord = {
      id: 0,
      type: 'expense',
      date: '2024-01-01',
      info: 'Tea',
      value: 3,
      category: 0,
    };
    updateMoneyRecord(updated);

    const records = getMoneyRecords();
    expect(records[0]).toEqual(updated);
  });

  it('updateMoneyRecord should persist update to localStorage', async () => {
    const { addMoneyRecord, updateMoneyRecord } = await import('./api');
    const original: MoneyRecord = {
      id: 0,
      type: 'expense',
      date: '2024-01-01',
      info: 'Coffee',
      value: 5,
      category: 0,
    };
    addMoneyRecord(original);

    const updated: MoneyRecord = {
      id: 0,
      type: 'expense',
      date: '2024-01-01',
      info: 'Tea',
      value: 3,
      category: 0,
    };
    updateMoneyRecord(updated);

    const stored = JSON.parse(localStorage.getItem('moneyRecords') || '[]');
    expect(stored[0].info).toBe('Tea');
    expect(stored[0].value).toBe(3);
  });

  it('updateMoneyRecord should update record in middle of array without affecting others', async () => {
    const { addMoneyRecord, updateMoneyRecord, getMoneyRecords } = await import('./api');
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
        type: 'income',
        date: '2024-01-03',
        info: 'Salary',
        value: 1000,
        category: 1,
      },
    ];

    records.forEach((rec) => addMoneyRecord(rec));

    const updated: MoneyRecord = {
      id: 1,
      type: 'expense',
      date: '2024-01-02',
      info: 'Dinner',
      value: 25,
      category: 0,
    };
    updateMoneyRecord(updated);

    const result = getMoneyRecords();
    expect(result).toHaveLength(3);
    expect(result[1]).toEqual(updated);
    expect(result[0].info).toBe('Coffee');
    expect(result[2].info).toBe('Salary');
  });

  it('updateMoneyRecord should handle updating last record in array', async () => {
    const { addMoneyRecord, updateMoneyRecord, getMoneyRecords } = await import('./api');
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
        type: 'income',
        date: '2024-01-02',
        info: 'Salary',
        value: 1000,
        category: 1,
      },
    ];

    records.forEach((rec) => addMoneyRecord(rec));

    const updated: MoneyRecord = {
      id: 1,
      type: 'income',
      date: '2024-01-02',
      info: 'Bonus',
      value: 500,
      category: 1,
    };
    updateMoneyRecord(updated);

    const result = getMoneyRecords();
    expect(result).toHaveLength(2);
    expect(result[1]).toEqual(updated);
  });
});
