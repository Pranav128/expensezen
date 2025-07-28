"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Expense } from '@/types';
import ExpenseDashboard from '@/components/expense-dashboard';
import ExpenseForm from '@/components/expense-form';
import ExpenseList from '@/components/expense-list';
import ExpenseTrends from '@/components/expense-trends';
import BudgetTracker from '@/components/budget-tracker';
import AdvancedSearch from '@/components/advanced-search';
import ExpenseAnalytics from '@/components/expense-analytics';
import MonthSelector from '@/components/month-selector';
import FloatingAddButton from '@/components/floating-add-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { addExpense, fetchExpenses, updateExpense, deleteExpense } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { 
  BarChart3, 
  TrendingUp,
  PiggyBank,
  Search,
  List,
  BarChart2,
  Calendar
} from 'lucide-react';

export default function EnhancedDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]); // For trends analysis
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('overview');

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

  // Fetch all expenses for trends analysis
  const getAllExpenses = useCallback(async () => {
    if (!token) return;
    try {
      const data: Expense[] = await fetchExpenses(token); // Fetch all without month filter
      setAllExpenses(data);
    } catch (error) {
      console.error("Failed to fetch all expenses:", error);
    }
  }, [token]);

  const getExpenses = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data: Expense[] = await fetchExpenses(token, selectedMonth);
      setExpenses(data);
      setFilteredExpenses(data); // Initialize filtered expenses
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      toast({ title: "Error", description: "Failed to load expenses.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedMonth, toast]);

  useEffect(() => {
    getExpenses();
    getAllExpenses();
  }, [getExpenses, getAllExpenses]);

  // Filter expenses for the selected month (fallback filtering)
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

  const handleAddExpense = async (newExpenseData: Omit<Expense, '_id'>) => {
    if (!token) {
      console.error("No auth token found");
      return;
    }
    try {
      const newExpense = await addExpense(newExpenseData, token);
      toast({ title: "Expense Added", description: `"${newExpense.description}" has been added.` });
      await getExpenses();
      await getAllExpenses();
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
        await getExpenses();
        await getAllExpenses();
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
        await getExpenses();
        await getAllExpenses();
    } catch (error) {
        console.error("Failed to delete expense:", error);
        toast({ title: "Error", description: "Failed to delete expense.", variant: "destructive" });
    }
  };

  const handleMonthChange = (month: Date) => {
    setSelectedMonth(month);
    localStorage.setItem('selectedMonth', month.toISOString());
  };

  const handleCurrentMonth = () => {
    const currentMonth = new Date();
    setSelectedMonth(currentMonth);
    localStorage.removeItem('selectedMonth');
  };

  const handleFilteredResults = (filtered: Expense[]) => {
    setFilteredExpenses(filtered);
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4" />
            <span className="hidden sm:inline">Budget</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ExpenseDashboard 
            expenses={monthlyExpenses} 
            isLoading={isLoading} 
            selectedMonth={selectedMonth}
          />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <ExpenseTrends 
            allExpenses={allExpenses}
            selectedMonth={selectedMonth}
          />
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <BudgetTracker 
            expenses={monthlyExpenses}
            selectedMonth={selectedMonth}
          />
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <AdvancedSearch 
            expenses={expenses}
            onFilteredResults={handleFilteredResults}
          />
          <ExpenseList 
            expenses={filteredExpenses} 
            isLoading={isLoading} 
            categories={allCategories}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ExpenseAnalytics
            expenses={monthlyExpenses}
            selectedMonth={selectedMonth}
          />
        </TabsContent>
      </Tabs>
      
      <FloatingAddButton onAddExpense={handleAddExpense} />
    </main>
  );
}