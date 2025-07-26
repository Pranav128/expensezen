export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface User {
  id: string;
  email: string;
  profilePicture?: string;
}

export type ExpenseCategory =
  | 'Housing'
  | 'Transportation'
  | 'Food'
  | 'Utilities'
  | 'Insurance'
  | 'Healthcare'
  | 'Saving & Investing'
  | 'Personal Spending';
