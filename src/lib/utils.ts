import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Expense } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An API error occurred');
  }
  return data;
}

export async function fetchExpenses(token: string): Promise<Expense[]> {
  const response = await fetch('/api/expenses', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

export async function addExpense(expense: Omit<Expense, '_id'>, token: string): Promise<Expense> {
  const response = await fetch('/api/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(expense),
  });
  return handleResponse(response);
}

export async function updateExpense(expense: Expense, token: string): Promise<Expense> {
  const response = await fetch(`/api/expenses/${expense._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(expense),
  });
  return handleResponse(response);
}

export async function deleteExpense(expenseId: string, token: string): Promise<{ id: string }> {
  const response = await fetch(`/api/expenses/${expenseId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}
