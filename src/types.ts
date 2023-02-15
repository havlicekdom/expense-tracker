export type User = {
  id: number;
  username: string;
  email: string;
};

export type Category = {
  id: number;
  label: string;
  name: string;
};

export type RecordType = 'expense' | 'income';

export type MoneyRecord = {
  id: number;
  type: RecordType;
  date: string;
  info: string;
  value: number;
  category: number;
};
