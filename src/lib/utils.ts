import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from 'zod';
import type { Expense } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ExpenseSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  category: z.string(),
  date: z.string(),
});

export async function fetchExpenses(token: string): Promise<Expense[]> {
  const response = await fetch('http://localhost:8080/api/expenses', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const data = await response.json();
    try {
      const parsedExpenses = z.array(ExpenseSchema).parse(data);
      return parsedExpenses;
    } catch (error) {
       console.error("Zod validation error:", error);
       return [];
    }
  }
  if (response.status === 401 || response.status === 403) {
    console.error('Unauthorized: Invalid or expired token');
    throw new Error('Unauthorized');
  }
  return [];
}

export async function addExpense(expense: Omit<Expense, 'id'>, token: string): Promise<Expense> {
  const response = await fetch('http://localhost:8080/api/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to add expense' }));
    throw new Error(errorData.message || 'Failed to add expense');
  }
  const newExpense = await response.json();
  return ExpenseSchema.parse(newExpense);
}
