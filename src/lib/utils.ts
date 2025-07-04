import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from 'zod';
import type { Expense } from '@/types';
import { mockExpenses } from "./mock-data";

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
  // Mock API call for demo
  console.log("Fetching mock expenses with token:", token ? "present" : "absent");
  return Promise.resolve(JSON.parse(JSON.stringify(mockExpenses)));
}

export async function addExpense(expense: Omit<Expense, 'id'>, token: string): Promise<Expense> {
  // Mock API call for demo
  console.log("Adding mock expense with token:", token ? "present" : "absent");
  const newExpense = {
    ...expense,
    id: new Date().getTime().toString(), // simple unique id
  };
  const parsedExpense = ExpenseSchema.parse(newExpense);
  mockExpenses.unshift(parsedExpense);
  return Promise.resolve(parsedExpense);
}

export async function updateExpense(expense: Expense, token: string): Promise<Expense> {
  // Mock API call for demo
  console.log("Updating mock expense with token:", token ? "present" : "absent");
  const index = mockExpenses.findIndex(e => e.id === expense.id);
  if (index !== -1) {
    const parsedExpense = ExpenseSchema.parse(expense);
    mockExpenses[index] = parsedExpense;
    return Promise.resolve(parsedExpense);
  }
  throw new Error("Expense not found");
}

export async function deleteExpense(expenseId: string, token: string): Promise<{ id: string }> {
    // Mock API call for demo
    console.log("Deleting mock expense with token:", token ? "present" : "absent");
    const index = mockExpenses.findIndex(e => e.id === expenseId);
    if (index !== -1) {
        mockExpenses.splice(index, 1);
        return Promise.resolve({ id: expenseId });
    }
    throw new Error("Expense not found");
}
