import type { Expense } from '@/types';
import { format, subDays } from 'date-fns';

const baseExpenses: Omit<Expense, 'id' | 'date'>[] = [
  { description: 'Monthly Netflix Subscription', amount: 15.99, category: 'Entertainment' },
  { description: 'Groceries from Whole Foods', amount: 124.50, category: 'Food' },
  { description: 'Gasoline for car', amount: 55.20, category: 'Transport' },
  { description: 'Dinner with friends', amount: 85.00, category: 'Social' },
  { description: 'New running shoes', amount: 130.00, category: 'Shopping' },
  { description: 'Electricity bill', amount: 78.34, category: 'Utilities' },
  { description: 'Internet bill', amount: 60.00, category: 'Utilities' },
  { description: 'Concert tickets', amount: 150.00, category: 'Entertainment' },
  { description: 'Morning coffee', amount: 4.75, category: 'Food' },
  { description: 'Monthly gym membership', amount: 40.00, category: 'Health' },
  { description: 'Pharmacy purchase', amount: 25.60, category: 'Health' },
  { description: 'New book: "The Silent Patient"', amount: 12.99, category: 'Shopping' },
  { description: 'Lunch with colleagues', amount: 22.50, category: 'Food' },
  { description: 'Uber ride to airport', amount: 45.00, category: 'Transport' },
  { description: 'Spotify Premium', amount: 9.99, category: 'Entertainment' },
];

export let mockExpenses: Expense[] = Array.from({ length: 35 }, (_, i) => {
    const base = baseExpenses[i % baseExpenses.length];
    return {
        ...base,
        id: (i + 1).toString(),
        amount: parseFloat((base.amount + (i % 5) * 5).toFixed(2)),
        date: format(subDays(new Date(), i * 2 + 1), 'yyyy-MM-dd'),
    };
});

export const mockCategories = [...new Set(mockExpenses.map(e => e.category))];
