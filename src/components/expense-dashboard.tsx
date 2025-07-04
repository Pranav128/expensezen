"use client";

import { useMemo, useState } from 'react';
import type { Expense, ExpenseCategory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart2, PieChart as PieChartIcon, TrendingUp, IndianRupee } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface ExpenseDashboardProps {
  expenses: Expense[];
  isLoading: boolean;
}

interface FilterOptions {
  startDate: string | null;
  expenses: Expense[];
  isLoading: boolean;
}

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function ExpenseDashboard({ expenses, isLoading }: ExpenseDashboardProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    startDate: null,
    endDate: null,
    category: 'All',
  });
  const [isExporting, setIsExporting] = useState(false);

  const { categoryData, monthlyData, totalExpenses, averageExpense } = useMemo(() => {
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const startDate = filterOptions.startDate ? new Date(filterOptions.startDate) : null;
      const endDate = filterOptions.endDate ? new Date(filterOptions.endDate) : null;

      const dateFilter = (!startDate || expenseDate >= startDate) && (!endDate || expenseDate <= endDate);
      const categoryFilter = filterOptions.category === 'All' || expense.category === filterOptions.category;

      return dateFilter && categoryFilter;
    });

    if (!filteredExpenses.length) return { categoryData: [], monthlyData: [], totalExpenses: 0, averageExpense: 0 };

    const categoryTotals = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const monthlyTotals = filteredExpenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyData = Object.entries(monthlyTotals)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const averageExpense = expenses.length ? totalExpenses / expenses.length : 0;
      
    return { categoryData, monthlyData, totalExpenses, averageExpense };
  }, [expenses]);
  
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    categoryData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: chartColors[index % chartColors.length],
      };
    });
    return config;
  }, [categoryData]);

  const handleExport = () => {
    setIsExporting(true);
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const startDate = filterOptions.startDate ? new Date(filterOptions.startDate) : null;
      const endDate = filterOptions.endDate ? new Date(filterOptions.endDate) : null;

      const dateFilter = (!startDate || expenseDate >= startDate) && (!endDate || expenseDate <= endDate);
      const categoryFilter = filterOptions.category === 'All' || expense.category === filterOptions.category;

      return dateFilter && categoryFilter;
    });

    const csvHeader = 'Date,Description,Amount,Category\n';
    const csvBody = filteredExpenses.map(expense =>
      `${expense.date},"${expense.description.replace(/"/g, '""')}",${expense.amount},${expense.category}`
    ).join('\n');
    const csvContent = csvHeader + csvBody;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    window.open(url);
    setIsExporting(false);
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[128px]" />
        <Skeleton className="h-[128px]" />
        <Skeleton className="h-[280px] md:col-span-1 lg:col-span-1" />
        <Skeleton className="h-[280px] md:col-span-1 lg:col-span-1" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-headline">Total Expenses</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ₹{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">Across all recorded transactions</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-headline">Average Transaction</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ₹{averageExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">Average value per expense</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-headline">By Category</CardTitle>
          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[200px]">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
            <PieChart>
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={2}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-headline">Monthly Spending</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-[200px] p-0">
          <ChartContainer config={{}} className="h-full w-full">
            <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(value) => `₹${value}`} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip cursor={{ fill: 'hsl(var(--secondary))' }} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Export Data Section */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium font-headline">Export Data</CardTitle>
          <CardDescription>Export your expense data with optional filters.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="startDate" className="text-sm font-medium">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={filterOptions.startDate || ''}
              onChange={(e) => setFilterOptions({ ...filterOptions, startDate: e.target.value })}
              className="border p-2 rounded-md text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="endDate" className="text-sm font-medium">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={filterOptions.endDate || ''}
              onChange={(e) => setFilterOptions({ ...filterOptions, endDate: e.target.value })}
              className="border p-2 rounded-md text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium">Category:</label>
            <select
              id="category"
              value={filterOptions.category}
              onChange={(e) => setFilterOptions({ ...filterOptions, category: e.target.value as ExpenseCategory | 'All' })}
              className="border p-2 rounded-md text-sm"
            >
              <option value="All">All Categories</option>
              <option value="Housing">Housing</option>
              <option value="Transportation">Transportation</option>
              <option value="Food">Food</option>
              <option value="Utilities">Utilities</option>
              <option value="Insurance">Insurance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Saving & Investing">Saving & Investing</option>
              <option value="Personal Spending">Personal Spending</option>
            </select>
          </div>
          <button onClick={handleExport} disabled={isExporting} className="self-end px-4 py-2 bg-blue-500 text-white rounded-md text-sm disabled:opacity-50">
            {isExporting ? 'Exporting...' : 'Export to CSV'}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
