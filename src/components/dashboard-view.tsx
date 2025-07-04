"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Expense } from '@/types';
import ExpenseDashboard from '@/components/expense-dashboard';
import ExpenseForm from '@/components/expense-form';
import ExpenseList from '@/components/expense-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addExpense, fetchExpenses } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function DashboardView() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user, logout } = useAuth();
  const router = useRouter();

  const loadExpenses = useCallback(async () => {
    if (token) {
      setIsLoading(true);
      try {
        const data = await fetchExpenses(token);
        setExpenses(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
        logout();
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }
  }, [token, logout, router]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleAddExpense = async (newExpenseData: Omit<Expense, 'id'>) => {
    if (!token) {
      console.error("No auth token found");
      return;
    }
    try {
      const newExpense = await addExpense(newExpenseData, token);
      setExpenses(prev => [newExpense, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };
  
  const allCategories = useMemo(() => {
    return [...new Set(expenses.map(e => e.category))].sort();
  }, [expenses]);

  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-4xl font-bold tracking-tight font-headline text-primary">ExpenseZen</h1>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user.email}</span>
            <Button variant="outline" size="sm" onClick={() => { logout(); router.push('/login'); }}>Logout</Button>
          </div>
        )}
      </div>
      
      <ExpenseDashboard expenses={expenses} isLoading={isLoading} />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="font-headline">Add New Expense</CardTitle>
                </CardHeader>
                <CardContent>
                    <ExpenseForm onSubmit={handleAddExpense} />
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-3">
            <ExpenseList expenses={expenses} isLoading={isLoading} categories={allCategories} />
        </div>
      </div>
    </main>
  );
}
