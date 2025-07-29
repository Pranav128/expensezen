"use client";

import { useMemo, useState } from 'react';
import type { Expense, ExpenseCategory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { BarChart2, PieChart as PieChartIcon, TrendingUp, IndianRupee } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface ExpenseDashboardProps {
  expenses: Expense[];
  isLoading: boolean;
  selectedMonth?: Date;
}

interface FilterOptions {
  startDate: string | null;
  endDate: string | null;
  category: ExpenseCategory | 'All';
}

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function ExpenseDashboard({ expenses, isLoading, selectedMonth }: ExpenseDashboardProps) {
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

    // For monthly view, show daily spending within the month
    const dailyTotals = filteredExpenses.reduce((acc, expense) => {
      const day = new Date(expense.date).getDate().toString();
      acc[day] = (acc[day] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const monthlyData = Object.entries(dailyTotals)
      .map(([name, total]) => ({ name: `Day ${name}`, total }))
      .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
    const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const averageExpense = filteredExpenses.length ? totalExpenses / filteredExpenses.length : 0;
      
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
    <div className="grid gap-4 md:gap-6">
      {/* Summary Cards - 2 columns on mobile, 4 on larger screens */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Monthly Total</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold">
              ₹{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedMonth ? `For ${selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : 'Current month expenses'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Monthly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold">
              ₹{averageExpense.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">Average per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts - 1 column on mobile, 2 on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm font-medium font-headline">By Category</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto pb-6">
            <div className="min-w-[300px] md:min-w-0">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                  <Tooltip 
                    cursor={false} 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Amount: ₹{data.value.toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie 
                    data={categoryData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={50} 
                    outerRadius={100} 
                    strokeWidth={2}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm font-medium font-headline">Daily Spending</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto pb-6">
            <div className="min-w-[500px] md:min-w-0">
              <ChartContainer config={{}} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={false}
                    tickMargin={5}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹${value}`} 
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={false} 
                    width={45}
                    dx={5}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-muted-foreground">
                              Amount: ₹{data.total.toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    barSize={24}
                  />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Data Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium font-headline">Export Data</CardTitle>
          <CardDescription>Export your expense data with optional filters.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="startDate" className="text-sm font-medium">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={filterOptions.startDate || ''}
                onChange={(e) => setFilterOptions({ ...filterOptions, startDate: e.target.value })}
                className="border p-2 rounded-md text-sm w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="endDate" className="text-sm font-medium">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={filterOptions.endDate || ''}
                onChange={(e) => setFilterOptions({ ...filterOptions, endDate: e.target.value })}
                className="border p-2 rounded-md text-sm w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-sm font-medium">Category:</label>
              <select
                id="category"
                value={filterOptions.category}
                onChange={(e) => setFilterOptions({ ...filterOptions, category: e.target.value as ExpenseCategory | 'All' })}
                className="border p-2 rounded-md text-sm w-full"
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
          </div>
          <div className="flex justify-end mt-2">
            <button 
              onClick={handleExport} 
              disabled={isExporting} 
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm disabled:opacity-50 hover:bg-blue-600 transition-colors"
            >
              {isExporting ? 'Exporting...' : 'Export to CSV'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
