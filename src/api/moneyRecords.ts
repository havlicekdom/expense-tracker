import type { MoneyRecord } from '../types';
import { findHighestId } from '../utils';

const moneyRecords: MoneyRecord[] = JSON.parse(localStorage.getItem('moneyRecords') ?? '[]');

const saveMoneyRecords = (updatedMoneyRecords: MoneyRecord[]) => {
  localStorage.setItem('moneyRecords', JSON.stringify(updatedMoneyRecords));
};

export const getMoneyRecords = () => moneyRecords;

export const addMoneyRecord = (moneyRecord: MoneyRecord) => {
  moneyRecord.id = moneyRecords.length > 0 ? findHighestId(moneyRecords) + 1 : 0;
  moneyRecords.push(moneyRecord);
  saveMoneyRecords(moneyRecords);
};

export const removeMoneyRecord = (moneyRecord: MoneyRecord) => {
  const indexOfMoneyRecord = moneyRecords.findIndex((item) => item.id === moneyRecord.id);
  moneyRecords.splice(indexOfMoneyRecord, 1);
  saveMoneyRecords(moneyRecords);
};

export const updateMoneyRecord = (moneyRecord: MoneyRecord) => {
  const indexOfMoneyRecord = moneyRecords.findIndex((item) => item.id === moneyRecord.id);
  moneyRecords.splice(indexOfMoneyRecord, 1, moneyRecord);
  saveMoneyRecords(moneyRecords);
};
