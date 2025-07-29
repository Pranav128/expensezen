"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Expense } from '@/types';
import ExpenseDashboard from '@/components/expense-dashboard';
import ExpenseForm from '@/components/expense-form';
import ExpenseList from '@/components/expense-list';
import MonthSelector from '@/components/month-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addExpense, fetchExpenses, updateExpense, deleteExpense } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export default function DashboardView() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const { token, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Initialize selected month from localStorage or default to current month
  useEffect(() => {
    const savedMonth = localStorage.getItem('selectedMonth');
    if (savedMonth) {
      const parsedMonth = new Date(savedMonth);
      // Only use saved month if it's valid and not current month (to always default to current on refresh)
      const currentMonth = new Date();
      if (parsedMonth.getMonth() !== currentMonth.getMonth() ||
          parsedMonth.getFullYear() !== currentMonth.getFullYear()) {
        setSelectedMonth(parsedMonth);
      }
    }
  }, []);

  const getExpenses = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data: Expense[] = await fetchExpenses(token, selectedMonth);
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      toast({ title: "Error", description: "Failed to load expenses.", variant: "destructive" });
      // Optional: a more robust error handling could logout the user on 401
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedMonth, toast]);

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
  
  // Since we're now filtering on the API level, we can use expenses directly
  // But keep the filtering logic as a fallback for any edge cases
  const monthlyExpenses = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });
  }, [expenses, selectedMonth]);

  const allCategories = useMemo(() => {
    return [...new Set(expenses.map(e => e.category))].sort();
  }, [expenses]);

  const handleMonthChange = (month: Date) => {
    setSelectedMonth(month);
    // Save to localStorage for navigation persistence within session
    localStorage.setItem('selectedMonth', month.toISOString());
  };

  const handleCurrentMonth = () => {
    const currentMonth = new Date();
    setSelectedMonth(currentMonth);
    // Remove from localStorage so it defaults to current month on refresh
    localStorage.removeItem('selectedMonth');
  };



  // Refetch expenses when month changes
  useEffect(() => {
    getExpenses();
  }, [selectedMonth, getExpenses]);

  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
      <MonthSelector
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onCurrentMonth={handleCurrentMonth}
      />
      
      <ExpenseDashboard
        expenses={monthlyExpenses}
        isLoading={isLoading}
        selectedMonth={selectedMonth}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="font-headline">Add New Expense</CardTitle>
                </CardHeader>
                <CardContent>
                    <ExpenseForm onSubmit={handleAddExpense} />
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-3 order-1 lg:order-2 mb-6 lg:mb-0">
            <ExpenseList
              expenses={monthlyExpenses}
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
