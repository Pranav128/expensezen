"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Expense } from '@/types';
import ExpenseDashboard from '@/components/expense-dashboard';
import ExpenseForm from '@/components/expense-form';
import ExpenseList from '@/components/expense-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addExpense, fetchExpenses, updateExpense, deleteExpense } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function DashboardView() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { token, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const getExpenses = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data: Expense[] = await fetchExpenses(token);
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      toast({ title: "Error", description: "Failed to load expenses.", variant: "destructive" });
      // Optional: a more robust error handling could logout the user on 401
    } finally {
      setIsLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    getExpenses();
  }, [getExpenses]);

  const handleAddExpense = async (newExpenseData: Omit<Expense, '_id'>) => {
    if (!token) {
      console.error("No auth token found");
      return;
    }
    try {
      const newExpense = await addExpense(newExpenseData, token);
      toast({ title: "Expense Added", description: `"${newExpense.description}" has been added.` });
      await getExpenses(); // Refetch expenses to ensure list is up-to-date
    } catch (error) {
      console.error("Failed to add expense:", error);
      toast({ title: "Error", description: "Failed to add expense.", variant: "destructive" });
    }
  };
  
  const handleUpdateExpense = async (updatedExpenseData: Expense) => {
    if (!token) {
        console.error("No auth token found");
        return;
    }
    try {
        const updatedExpense = await updateExpense(updatedExpenseData, token);
        toast({ title: "Expense Updated", description: `"${updatedExpense.description}" has been updated.` });
        await getExpenses(); // Refetch expenses
    } catch (error) {
        console.error("Failed to update expense:", error);
        toast({ title: "Error", description: "Failed to update expense.", variant: "destructive" });
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!token) {
        console.error("No auth token found");
        return;
    }
    const expenseToDelete = expenses.find(e => e._id === expenseId);
    try {
        await deleteExpense(expenseId, token);
        toast({ title: "Expense Deleted", description: `"${expenseToDelete?.description}" has been deleted.` });
        await getExpenses(); // Refetch expenses
    } catch (error) {
        console.error("Failed to delete expense:", error);
        toast({ title: "Error", description: "Failed to delete expense.", variant: "destructive" });
    }
  };
  
  const allCategories = useMemo(() => {
    return [...new Set(expenses.map(e => e.category))].sort();
  }, [expenses]);

  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
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
            <ExpenseList 
              expenses={expenses} 
              isLoading={isLoading} 
              categories={allCategories}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
            />
        </div>
      </div>
    </main>
  );
}
