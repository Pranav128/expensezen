"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Calendar, BarChart3 } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import type { Expense } from '@/types';

interface ExpenseTrendsProps {
  allExpenses: Expense[];
  selectedMonth: Date;
}

export default function ExpenseTrends({ allExpenses, selectedMonth }: ExpenseTrendsProps) {
  const trendsData = useMemo(() => {
    // Get last 6 months including current selected month
    const months = [];
    for (let i = 5; i >= 0; i--) {
      months.push(subMonths(selectedMonth, i));
    }

    const monthlyData = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthExpenses = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
      });

      const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const count = monthExpenses.length;
      const average = count > 0 ? total / count : 0;

      // Category breakdown
      const categories = monthExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);

      const topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];

      return {
        month: format(month, 'MMM yyyy'),
        shortMonth: format(month, 'MMM'),
        total,
        count,
        average,
        topCategory: topCategory ? topCategory[0] : 'None',
        topCategoryAmount: topCategory ? topCategory[1] : 0,
        isCurrentMonth: month.getMonth() === selectedMonth.getMonth() && 
                       month.getFullYear() === selectedMonth.getFullYear()
      };
    });

    // Calculate month-over-month changes
    const currentMonthData = monthlyData[monthlyData.length - 1];
    const previousMonthData = monthlyData[monthlyData.length - 2];
    
    const totalChange = previousMonthData ? 
      ((currentMonthData.total - previousMonthData.total) / previousMonthData.total) * 100 : 0;
    
    const countChange = previousMonthData ? 
      ((currentMonthData.count - previousMonthData.count) / previousMonthData.count) * 100 : 0;

    const averageChange = previousMonthData ? 
      ((currentMonthData.average - previousMonthData.average) / previousMonthData.average) * 100 : 0;

    return {
      monthlyData,
      currentMonthData,
      previousMonthData,
      totalChange,
      countChange,
      averageChange
    };
  }, [allExpenses, selectedMonth]);

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-red-500';
    if (change < 0) return 'text-green-500';
    return 'text-gray-500';
  };

  const formatChange = (change: number) => {
    if (isNaN(change) || !isFinite(change)) return '0%';
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Month-over-Month Comparison Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            {getTrendIcon(trendsData.totalChange)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{trendsData.currentMonthData.total.toLocaleString()}
            </div>
            <p className={`text-xs ${getTrendColor(trendsData.totalChange)}`}>
              {formatChange(trendsData.totalChange)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            {getTrendIcon(trendsData.countChange)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trendsData.currentMonthData.count}
            </div>
            <p className={`text-xs ${getTrendColor(trendsData.countChange)}`}>
              {formatChange(trendsData.countChange)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
            {getTrendIcon(trendsData.averageChange)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{trendsData.currentMonthData.average.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className={`text-xs ${getTrendColor(trendsData.averageChange)}`}>
              {formatChange(trendsData.averageChange)} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 6-Month Trend Chart */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            6-Month Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto pb-6">
          <div className="min-w-[500px] md:min-w-0">
            <ChartContainer config={{}} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendsData.monthlyData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="shortMonth" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={false}
                    tickMargin={5}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={false}
                    width={45}
                    dx={5}
                  />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.month}</p>
                            <p className="text-sm text-muted-foreground">
                              Total: ₹{data.total.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Transactions: {data.count}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Top Category: {data.topCategory}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorTotal)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Top Spending Category</span>
              <span className="text-sm font-bold">
                {trendsData.currentMonthData.topCategory} 
                (₹{trendsData.currentMonthData.topCategoryAmount.toLocaleString()})
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Daily Average</span>
              <span className="text-sm font-bold">
                ₹{(trendsData.currentMonthData.total / new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate()).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>

            {trendsData.previousMonthData && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">vs Previous Month</span>
                <span className={`text-sm font-bold ${getTrendColor(trendsData.totalChange)}`}>
                  {trendsData.totalChange > 0 ? 'Spent More' : trendsData.totalChange < 0 ? 'Spent Less' : 'Same'}
                  {trendsData.totalChange !== 0 && ` (₹${Math.abs(trendsData.currentMonthData.total - trendsData.previousMonthData.total).toLocaleString()})`}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}