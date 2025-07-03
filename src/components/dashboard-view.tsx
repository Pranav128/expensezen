"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Expense } from '@/types';
import { mockExpenses } from '@/lib/mock-data';
import ExpenseDashboard from '@/components/expense-dashboard';
import ExpenseForm from '@/components/expense-form';
import ExpenseList from '@/components/expense-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardView() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExpenses(mockExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddExpense = (newExpense: Omit<Expense, 'id' | 'date'> & { date: string }) => {
    const expenseWithId: Expense = { ...newExpense, id: Date.now().toString() };
    const updatedExpenses = [expenseWithId, ...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setExpenses(updatedExpenses);
  };
  
  const allCategories = useMemo(() => [...new Set(mockExpenses.map(e => e.category))], []);

  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-4xl font-bold tracking-tight font-headline text-primary">ExpenseZen</h1>
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
