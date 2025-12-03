import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { useContext } from 'react';
import { MoneyRecordProvider, MoneyRecordContext } from './MoneyRecordContext';
import * as api from './api';
import type { MoneyRecord } from '../types';

// Mock the api module
vi.mock('./api', () => ({
  getMoneyRecords: vi.fn(),
  addMoneyRecord: vi.fn(),
  removeMoneyRecord: vi.fn(),
  updateMoneyRecord: vi.fn(),
}));

const mockGetMoneyRecords = vi.mocked(api.getMoneyRecords);
const mockAddMoneyRecord = vi.mocked(api.addMoneyRecord);
const mockRemoveMoneyRecord = vi.mocked(api.removeMoneyRecord);
const mockUpdateMoneyRecord = vi.mocked(api.updateMoneyRecord);

describe('MoneyRecordContext', () => {
  const mockRecord: MoneyRecord = {
    id: 0,
    type: 'expense',
    date: '2024-01-01',
    info: 'Coffee',
    value: 5,
    category: 0,
  };

  const mockRecord2: MoneyRecord = {
    id: 1,
    type: 'income',
    date: '2024-01-02',
    info: 'Salary',
    value: 1000,
    category: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetMoneyRecords.mockReturnValue([]);
  });

  describe('MoneyRecordProvider', () => {
    it('provides context to children', () => {
      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return <div>{context.moneyRecords.length}</div>;
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('initializes with empty money records', () => {
      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return <div>{JSON.stringify(context.moneyRecords)}</div>;
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      expect(screen.getByText('[]')).toBeInTheDocument();
    });
  });

  describe('getMoneyRecords', () => {
    it('retrieves money records from api', async () => {
      mockGetMoneyRecords.mockReturnValue([mockRecord]);

      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return (
          <div>
            <button onClick={() => context.getMoneyRecords()}>Load</button>
            <div>{context.moneyRecords.length}</div>
          </div>
        );
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      const loadButton = screen.getByText('Load');
      act(() => {
        loadButton.click();
      });

      await waitFor(() => {
        expect(mockGetMoneyRecords).toHaveBeenCalled();
      });
    });

    it('updates state with retrieved records', async () => {
      const records = [mockRecord, mockRecord2];
      mockGetMoneyRecords.mockReturnValue(records);

      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return (
          <div>
            <button onClick={() => context.getMoneyRecords()}>Load</button>
            <div>{context.moneyRecords.length}</div>
          </div>
        );
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      const loadButton = screen.getByText('Load');
      act(() => {
        loadButton.click();
      });

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    it('handles empty records list', () => {
      mockGetMoneyRecords.mockReturnValue([]);

      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return (
          <div>
            <button onClick={() => context.getMoneyRecords()}>Load</button>
            <div>{context.moneyRecords.length === 0 ? 'Empty' : 'Has records'}</div>
          </div>
        );
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      const loadButton = screen.getByText('Load');
      act(() => {
        loadButton.click();
      });

      expect(screen.getByText('Empty')).toBeInTheDocument();
    });
  });

  describe('addMoneyRecord', () => {
    it('calls api.addMoneyRecord', async () => {
      mockGetMoneyRecords.mockReturnValue([mockRecord]);

      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return (
          <button onClick={() => context.addMoneyRecord(mockRecord)}>
            Add
          </button>
        );
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      const addButton = screen.getByText('Add');
      act(() => {
        addButton.click();
      });

      await waitFor(() => {
        expect(mockAddMoneyRecord).toHaveBeenCalledWith(mockRecord);
      });
    });

    it('calls getMoneyRecords after adding', async () => {
      mockGetMoneyRecords.mockReturnValue([mockRecord]);

      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return (
          <button onClick={() => context.addMoneyRecord(mockRecord)}>
            Add
          </button>
        );
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      const addButton = screen.getByText('Add');
      act(() => {
        addButton.click();
      });

      await waitFor(() => {
        expect(mockAddMoneyRecord).toHaveBeenCalled();
        expect(mockGetMoneyRecords).toHaveBeenCalled();
      });
    });

    it('handles adding multiple records', async () => {
      const records = [mockRecord, mockRecord2];
      mockGetMoneyRecords.mockReturnValue(records);

      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return (
          <div>
            <button onClick={() => context.addMoneyRecord(mockRecord)}>
              Add 1
            </button>
            <button onClick={() => context.addMoneyRecord(mockRecord2)}>
              Add 2
            </button>
            <div>{context.moneyRecords.length}</div>
          </div>
        );
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      const addButton1 = screen.getByText('Add 1');
      const addButton2 = screen.getByText('Add 2');

      act(() => {
        addButton1.click();
      });

      await waitFor(() => {
        expect(mockAddMoneyRecord).toHaveBeenCalledWith(mockRecord);
      });

      act(() => {
        addButton2.click();
      });

      await waitFor(() => {
        expect(mockAddMoneyRecord).toHaveBeenCalledWith(mockRecord2);
      });
    });
  });

  describe('removeMoneyRecord', () => {
    it('calls api.removeMoneyRecord', async () => {
      mockGetMoneyRecords.mockReturnValue([]);

      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return (
          <button onClick={() => context.removeMoneyRecord(mockRecord)}>
            Remove
          </button>
        );
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      const removeButton = screen.getByText('Remove');
      act(() => {
        removeButton.click();
      });

      await waitFor(() => {
        expect(mockRemoveMoneyRecord).toHaveBeenCalledWith(mockRecord);
      });
    });

    it('calls getMoneyRecords after removing', async () => {
      mockGetMoneyRecords.mockReturnValue([]);

      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return (
          <button onClick={() => context.removeMoneyRecord(mockRecord)}>
            Remove
          </button>
        );
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      const removeButton = screen.getByText('Remove');
      act(() => {
        removeButton.click();
      });

      await waitFor(() => {
        expect(mockRemoveMoneyRecord).toHaveBeenCalled();
        expect(mockGetMoneyRecords).toHaveBeenCalled();
      });
    });

    it('handles removing from non-empty list', async () => {
      const records = [mockRecord2];
      mockGetMoneyRecords.mockReturnValue(records);

      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return (
          <div>
            <button onClick={() => context.removeMoneyRecord(mockRecord)}>
              Remove
            </button>
            <div>{context.moneyRecords.length}</div>
          </div>
        );
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      const removeButton = screen.getByText('Remove');
      act(() => {
        removeButton.click();
      });

      await waitFor(() => {
        expect(mockRemoveMoneyRecord).toHaveBeenCalledWith(mockRecord);
      });
    });
  });

  describe('editMoneyRecord', () => {
    it('calls api.updateMoneyRecord', async () => {
      const updatedRecord = { ...mockRecord, info: 'Tea' };
      mockGetMoneyRecords.mockReturnValue([updatedRecord]);

      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return (
          <button onClick={() => context.editMoneyRecord(updatedRecord)}>
            Edit
          </button>
        );
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      const editButton = screen.getByText('Edit');
      act(() => {
        editButton.click();
      });

      await waitFor(() => {
        expect(mockUpdateMoneyRecord).toHaveBeenCalledWith(updatedRecord);
      });
    });

    it('calls getMoneyRecords after editing', async () => {
      const updatedRecord = { ...mockRecord, info: 'Tea' };
      mockGetMoneyRecords.mockReturnValue([updatedRecord]);

      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return (
          <button onClick={() => context.editMoneyRecord(updatedRecord)}>
            Edit
          </button>
        );
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      const editButton = screen.getByText('Edit');
      act(() => {
        editButton.click();
      });

      await waitFor(() => {
        expect(mockUpdateMoneyRecord).toHaveBeenCalled();
        expect(mockGetMoneyRecords).toHaveBeenCalled();
      });
    });

    it('updates state with edited record', async () => {
      const updatedRecord = { ...mockRecord, value: 10 };
      mockGetMoneyRecords.mockReturnValue([updatedRecord]);

      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        return (
          <div>
            <button onClick={() => context.editMoneyRecord(updatedRecord)}>
              Edit
            </button>
            <div>{context.moneyRecords.length > 0 ? context.moneyRecords[0].value : 'None'}</div>
          </div>
        );
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      const editButton = screen.getByText('Edit');
      act(() => {
        editButton.click();
      });

      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument();
      });
    });
  });

  describe('Context functions availability', () => {
    it('provides addMoneyRecord function', () => {
      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        const hasAddMoneyRecord = typeof context.addMoneyRecord === 'function';
        return <div>{hasAddMoneyRecord ? 'Has addMoneyRecord' : 'Missing'}</div>;
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      expect(screen.getByText('Has addMoneyRecord')).toBeInTheDocument();
    });

    it('provides removeMoneyRecord function', () => {
      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        const hasRemoveMoneyRecord = typeof context.removeMoneyRecord === 'function';
        return <div>{hasRemoveMoneyRecord ? 'Has removeMoneyRecord' : 'Missing'}</div>;
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      expect(screen.getByText('Has removeMoneyRecord')).toBeInTheDocument();
    });

    it('provides editMoneyRecord function', () => {
      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        const hasEditMoneyRecord = typeof context.editMoneyRecord === 'function';
        return <div>{hasEditMoneyRecord ? 'Has editMoneyRecord' : 'Missing'}</div>;
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      expect(screen.getByText('Has editMoneyRecord')).toBeInTheDocument();
    });

    it('provides getMoneyRecords function', () => {
      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        const hasGetMoneyRecords = typeof context.getMoneyRecords === 'function';
        return <div>{hasGetMoneyRecords ? 'Has getMoneyRecords' : 'Missing'}</div>;
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      expect(screen.getByText('Has getMoneyRecords')).toBeInTheDocument();
    });

    it('provides moneyRecords array', () => {
      const TestComponent = () => {
        const context = useContext(MoneyRecordContext);
        const hasMoneyRecords = Array.isArray(context.moneyRecords);
        return <div>{hasMoneyRecords ? 'Has moneyRecords' : 'Missing'}</div>;
      };

      render(
        <MoneyRecordProvider>
          <TestComponent />
        </MoneyRecordProvider>
      );

      expect(screen.getByText('Has moneyRecords')).toBeInTheDocument();
    });
  });

  describe('State isolation', () => {
    it('maintains separate state for multiple providers', () => {
      const TestComponent = ({ id }: { id: number }) => {
        const context = useContext(MoneyRecordContext);
        return <div>Provider {id}: {context.moneyRecords.length}</div>;
      };

      render(
        <div>
          <MoneyRecordProvider>
            <TestComponent id={1} />
          </MoneyRecordProvider>
          <MoneyRecordProvider>
            <TestComponent id={2} />
          </MoneyRecordProvider>
        </div>
      );

      expect(screen.getByText('Provider 1: 0')).toBeInTheDocument();
      expect(screen.getByText('Provider 2: 0')).toBeInTheDocument();
    });
  });
});
