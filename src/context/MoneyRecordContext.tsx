import React, { useMemo, useState } from 'react';
import * as api from '../api/moneyRecords';
import type { MoneyRecord } from '../types';

type AddMoneyRecordFn = (moneyRecord: MoneyRecord) => void;
type RemoveMoneyRecordFn = (moneyRecord: MoneyRecord) => void;
type EditMoneyRecordFn = (moneyRecord: MoneyRecord) => void;
type GetMoneyRecordsFn = () => void;

type InitialState = {
  moneyRecords: MoneyRecord[],
  addMoneyRecord: AddMoneyRecordFn,
  removeMoneyRecord: RemoveMoneyRecordFn,
  editMoneyRecord: EditMoneyRecordFn,
  getMoneyRecords: GetMoneyRecordsFn,
};

const initialState: InitialState = {
  moneyRecords: [],
  addMoneyRecord: () => ({}),
  removeMoneyRecord: () => ({}),
  editMoneyRecord: () => ({}),
  getMoneyRecords: () => ({}),
};

const MoneyRecordContext = React.createContext(initialState);

MoneyRecordContext.displayName = 'MoneyRecordContext';

function MoneyRecordProvider({ children }: { children: React.ReactNode }) {
  const [moneyRecords, setMoneyRecords] = useState<MoneyRecord[]>([]);

  const moneyRecordContextValues = useMemo(() => {
    const getMoneyRecords: GetMoneyRecordsFn = () => {
      setMoneyRecords([...api.getMoneyRecords()]);
    };

    const addMoneyRecord: AddMoneyRecordFn = (moneyRecord) => {
      api.addMoneyRecord(moneyRecord);
      getMoneyRecords();
    };

    const removeMoneyRecord: RemoveMoneyRecordFn = (moneyRecord) => {
      api.removeMoneyRecord(moneyRecord);
      getMoneyRecords();
    };

    const editMoneyRecord: EditMoneyRecordFn = (moneyRecord) => {
      api.updateMoneyRecord(moneyRecord);
      getMoneyRecords();
    };

    return {
      moneyRecords,
      getMoneyRecords,
      addMoneyRecord,
      removeMoneyRecord,
      editMoneyRecord,
    };
  }, [moneyRecords]);

  return (
    <MoneyRecordContext.Provider value={moneyRecordContextValues}>
      { children }
    </MoneyRecordContext.Provider>
  );
}

export { MoneyRecordContext, MoneyRecordProvider };
