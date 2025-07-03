import type { Expense } from '@/types';
import { format, subDays } from 'date-fns';

export const mockExpenses: Expense[] = [
  { id: '1', description: 'Monthly Netflix Subscription', amount: 15.99, category: 'Entertainment', date: format(subDays(new Date(), 2), 'yyyy-MM-dd') },
  { id: '2', description: 'Groceries from Whole Foods', amount: 124.50, category: 'Food', date: format(subDays(new Date(), 3), 'yyyy-MM-dd') },
  { id: '3', description: 'Gasoline for car', amount: 55.20, category: 'Transport', date: format(subDays(new Date(), 5), 'yyyy-MM-dd') },
  { id: '4', description: 'Dinner with friends', amount: 85.00, category: 'Social', date: format(subDays(new Date(), 7), 'yyyy-MM-dd') },
  { id: '5', description: 'New running shoes', amount: 130.00, category: 'Shopping', date: format(subDays(new Date(), 10), 'yyyy-MM-dd') },
  { id: '6', description: 'Electricity bill', amount: 78.34, category: 'Utilities', date: format(subDays(new Date(), 12), 'yyyy-MM-dd') },
  { id: '7', description: 'Internet bill', amount: 60.00, category: 'Utilities', date: format(subDays(new Date(), 15), 'yyyy-MM-dd') },
  { id: '8', description: 'Concert tickets', amount: 150.00, category: 'Entertainment', date: format(subDays(new Date(), 20), 'yyyy-MM-dd') },
  { id: '9', description: 'Morning coffee', amount: 4.75, category: 'Food', date: format(subDays(new Date(), 22), 'yyyy-MM-dd') },
  { id: '10', description: 'Monthly gym membership', amount: 40.00, category: 'Health', date: format(subDays(new Date(), 25), 'yyyy-MM-dd') },
  { id: '11', description: 'Pharmacy purchase', amount: 25.60, category: 'Health', date: format(subDays(new Date(), 28), 'yyyy-MM-dd') },
  { id: '12', description: 'New book: "The Silent Patient"', amount: 12.99, category: 'Shopping', date: format(subDays(new Date(), 35), 'yyyy-MM-dd') },
];

export const mockCategories = [...new Set(mockExpenses.map(e => e.category))];
