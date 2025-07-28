"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PiggyBank, Target, AlertTriangle, CheckCircle, Edit, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import type { Expense, ExpenseCategory } from '@/types';

interface Budget {
  id: string;
  category: ExpenseCategory | 'Total';
  amount: number;
  month: string; // YYYY-MM format
  spent: number;
}

interface BudgetTrackerProps {
  expenses: Expense[];
  selectedMonth: Date;
}

export default function BudgetTracker({ expenses, selectedMonth }: BudgetTrackerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [newBudget, setNewBudget] = useState({
    category: '' as ExpenseCategory | 'Total',
    amount: ''
  });
  const { toast } = useToast();

  const monthKey = format(selectedMonth, 'yyyy-MM');

  // Load budgets from localStorage
  useEffect(() => {
    const savedBudgets = localStorage.getItem('expense-budgets');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, []);

  // Save budgets to localStorage
  const saveBudgets = (newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    localStorage.setItem('expense-budgets', JSON.stringify(newBudgets));
  };

  // Calculate spending by category for current month
  const monthlySpending = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });

    const categorySpending = monthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalSpending = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return { categorySpending, totalSpending };
  }, [expenses, selectedMonth]);

  // Get budgets for current month with calculated spending
  const currentMonthBudgets = useMemo(() => {
    return budgets
      .filter(budget => budget.month === monthKey)
      .map(budget => ({
        ...budget,
        spent: budget.category === 'Total' 
          ? monthlySpending.totalSpending 
          : monthlySpending.categorySpending[budget.category] || 0
      }));
  }, [budgets, monthKey, monthlySpending]);

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(newBudget.amount);
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Budget amount must be positive.",
        variant: "destructive"
      });
      return;
    }

    // Check if budget already exists for this category and month
    const existingBudget = budgets.find(
      b => b.category === newBudget.category && b.month === monthKey
    );

    if (existingBudget) {
      toast({
        title: "Error",
        description: "Budget already exists for this category this month.",
        variant: "destructive"
      });
      return;
    }

    const budget: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      amount,
      month: monthKey,
      spent: newBudget.category === 'Total' 
        ? monthlySpending.totalSpending 
        : monthlySpending.categorySpending[newBudget.category] || 0
    };

    saveBudgets([...budgets, budget]);
    setNewBudget({ category: '' as ExpenseCategory | 'Total', amount: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Budget Added",
      description: `Budget for ${newBudget.category} has been set.`
    });
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setNewBudget({
      category: budget.category,
      amount: budget.amount.toString()
    });
    setIsDialogOpen(true);
  };

  const handleUpdateBudget = () => {
    if (!editingBudget || !newBudget.amount) return;

    const amount = parseFloat(newBudget.amount);
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Budget amount must be positive.",
        variant: "destructive"
      });
      return;
    }

    const updatedBudgets = budgets.map(budget =>
      budget.id === editingBudget.id
        ? { ...budget, amount }
        : budget
    );

    saveBudgets(updatedBudgets);
    setEditingBudget(null);
    setNewBudget({ category: '' as ExpenseCategory | 'Total', amount: '' });
    setIsDialogOpen(false);

    toast({
      title: "Budget Updated",
      description: "Budget has been updated successfully."
    });
  };

  const handleDeleteBudget = (budgetId: string) => {
    const updatedBudgets = budgets.filter(budget => budget.id !== budgetId);
    saveBudgets(updatedBudgets);
    
    toast({
      title: "Budget Deleted",
      description: "Budget has been removed."
    });
  };

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: 'text-red-500', icon: AlertTriangle };
    if (percentage >= 80) return { status: 'warning', color: 'text-yellow-500', icon: AlertTriangle };
    return { status: 'good', color: 'text-green-500', icon: CheckCircle };
  };

  const categories: (ExpenseCategory | 'Total')[] = [
    'Total',
    'Housing',
    'Transportation',
    'Food',
    'Utilities',
    'Insurance',
    'Healthcare',
    'Saving & Investing',
    'Personal Spending'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              Budget Tracker - {format(selectedMonth, 'MMMM yyyy')}
            </CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingBudget(null);
                setNewBudget({ category: '' as ExpenseCategory | 'Total', amount: '' });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBudget ? 'Edit Budget' : 'Add New Budget'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newBudget.category}
                    onValueChange={(value) => setNewBudget({ ...newBudget, category: value as ExpenseCategory | 'Total' })}
                    disabled={!!editingBudget}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Budget Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                  />
                </div>
                <Button 
                  onClick={editingBudget ? handleUpdateBudget : handleAddBudget}
                  className="w-full"
                >
                  {editingBudget ? 'Update Budget' : 'Add Budget'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {currentMonthBudgets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No budgets set for this month.</p>
              <p className="text-sm">Click "Add Budget" to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentMonthBudgets.map(budget => {
                const { status, color, icon: StatusIcon } = getBudgetStatus(budget.spent, budget.amount);
                const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
                const remaining = Math.max(budget.amount - budget.spent, 0);

                return (
                  <div key={budget.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${color}`} />
                        <span className="font-medium">{budget.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditBudget(budget)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteBudget(budget.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent: ₹{budget.spent.toLocaleString()}</span>
                        <span>Budget: ₹{budget.amount.toLocaleString()}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{percentage.toFixed(1)}% used</span>
                        <span className={remaining === 0 ? 'text-red-500' : 'text-green-500'}>
                          {remaining === 0 ? 'Budget exceeded!' : `₹${remaining.toLocaleString()} remaining`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}