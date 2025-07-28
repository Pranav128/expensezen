"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Edit, Trash2, TrendingUp, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, addMonths, differenceInDays, isAfter, isBefore } from 'date-fns';
import type { Expense } from '@/types';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'savings' | 'expense-reduction' | 'investment' | 'debt-payoff';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

interface GoalsTrackerProps {
  expenses: Expense[];
  selectedMonth: Date;
}

export default function GoalsTracker({ expenses, selectedMonth }: GoalsTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    category: 'savings' as Goal['category']
  });
  const { toast } = useToast();

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('expense-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save goals to localStorage
  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem('expense-goals', JSON.stringify(newGoals));
  };

  // Calculate savings based on expense reduction goals
  const calculateSavings = useMemo(() => {
    const currentMonthExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Get previous month expenses for comparison (simplified)
    const previousMonthTarget = currentMonthExpenses * 1.1; // Assume 10% higher as baseline
    const savings = Math.max(0, previousMonthTarget - currentMonthExpenses);
    
    return {
      currentMonthExpenses,
      estimatedSavings: savings,
      savingsRate: previousMonthTarget > 0 ? (savings / previousMonthTarget) * 100 : 0
    };
  }, [expenses]);

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.targetDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const targetAmount = parseFloat(newGoal.targetAmount);
    if (targetAmount <= 0) {
      toast({
        title: "Error",
        description: "Target amount must be positive.",
        variant: "destructive"
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetAmount,
      currentAmount: 0,
      targetDate: newGoal.targetDate,
      category: newGoal.category,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    saveGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      targetAmount: '',
      targetDate: '',
      category: 'savings'
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Goal Added",
      description: `"${newGoal.title}" goal has been created.`
    });
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description,
      targetAmount: goal.targetAmount.toString(),
      targetDate: goal.targetDate,
      category: goal.category
    });
    setIsDialogOpen(true);
  };

  const handleUpdateGoal = () => {
    if (!editingGoal || !newGoal.title || !newGoal.targetAmount || !newGoal.targetDate) return;

    const targetAmount = parseFloat(newGoal.targetAmount);
    if (targetAmount <= 0) {
      toast({
        title: "Error",
        description: "Target amount must be positive.",
        variant: "destructive"
      });
      return;
    }

    const updatedGoals = goals.map(goal =>
      goal.id === editingGoal.id
        ? {
            ...goal,
            title: newGoal.title,
            description: newGoal.description,
            targetAmount,
            targetDate: newGoal.targetDate,
            category: newGoal.category
          }
        : goal
    );

    saveGoals(updatedGoals);
    setEditingGoal(null);
    setNewGoal({
      title: '',
      description: '',
      targetAmount: '',
      targetDate: '',
      category: 'savings'
    });
    setIsDialogOpen(false);

    toast({
      title: "Goal Updated",
      description: "Goal has been updated successfully."
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
    
    toast({
      title: "Goal Deleted",
      description: "Goal has been removed."
    });
  };

  const handleUpdateProgress = (goalId: string, amount: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newAmount = Math.max(0, Math.min(goal.targetAmount, amount));
        const status: Goal['status'] = newAmount >= goal.targetAmount ? 'completed' : 'active';
        return { ...goal, currentAmount: newAmount, status };
      }
      return goal;
    });

    saveGoals(updatedGoals);
    
    toast({
      title: "Progress Updated",
      description: "Goal progress has been updated."
    });
  };

  const getGoalStatus = (goal: Goal) => {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const daysRemaining = differenceInDays(targetDate, today);
    const progress = (goal.currentAmount / goal.targetAmount) * 100;

    if (goal.status === 'completed') {
      return { status: 'completed', color: 'text-green-500', icon: CheckCircle, message: 'Completed!' };
    }

    if (daysRemaining < 0) {
      return { status: 'overdue', color: 'text-red-500', icon: AlertCircle, message: 'Overdue' };
    }

    if (daysRemaining <= 7 && progress < 80) {
      return { status: 'urgent', color: 'text-orange-500', icon: AlertCircle, message: `${daysRemaining} days left` };
    }

    return { status: 'active', color: 'text-blue-500', icon: Target, message: `${daysRemaining} days left` };
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'savings': return 'bg-green-100 text-green-800';
      case 'expense-reduction': return 'bg-blue-100 text-blue-800';
      case 'investment': return 'bg-purple-100 text-purple-800';
      case 'debt-payoff': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: Goal['category']) => {
    switch (category) {
      case 'savings': return 'Savings';
      case 'expense-reduction': return 'Expense Reduction';
      case 'investment': return 'Investment';
      case 'debt-payoff': return 'Debt Payoff';
      default: return category;
    }
  };

  const activeGoals = goals.filter(goal => goal.status !== 'completed');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedGoals.length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{calculateSavings.estimatedSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {calculateSavings.savingsRate.toFixed(1)}% savings rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Target</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              across all active goals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Financial Goals
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingGoal(null);
                setNewGoal({
                  title: '',
                  description: '',
                  targetAmount: '',
                  targetDate: '',
                  category: 'savings'
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingGoal ? 'Edit Goal' : 'Add New Goal'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Goal Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Emergency Fund"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your goal..."
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(value) => setNewGoal({ ...newGoal, category: value as Goal['category'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="expense-reduction">Expense Reduction</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="debt-payoff">Debt Payoff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="targetAmount">Target Amount (₹) *</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="targetDate">Target Date *</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  />
                </div>
                <Button 
                  onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
                  className="w-full"
                >
                  {editingGoal ? 'Update Goal' : 'Add Goal'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No goals set yet.</p>
              <p className="text-sm">Create your first financial goal to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map(goal => {
                const { status, color, icon: StatusIcon, message } = getGoalStatus(goal);
                const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

                return (
                  <div key={goal.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{goal.title}</h3>
                          <Badge className={getCategoryColor(goal.category)}>
                            {getCategoryLabel(goal.category)}
                          </Badge>
                        </div>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <StatusIcon className={`h-4 w-4 ${color}`} />
                          <span className={color}>{message}</span>
                          <span className="text-muted-foreground">
                            • Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditGoal(goal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress: ₹{goal.currentAmount.toLocaleString()}</span>
                        <span>Target: ₹{goal.targetAmount.toLocaleString()}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {progress.toFixed(1)}% complete
                        </span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Update amount"
                            className="w-32 h-8 text-xs"
                            onBlur={(e) => {
                              const amount = parseFloat(e.target.value);
                              if (!isNaN(amount)) {
                                handleUpdateProgress(goal.id, amount);
                                e.target.value = '';
                              }
                            }}
                          />
                        </div>
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