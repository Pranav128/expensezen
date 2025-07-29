"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Calendar, Clock, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { format, getDay, getHours, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';
import type { Expense } from '@/types';

interface ExpenseAnalyticsProps {
  expenses: Expense[];
  selectedMonth: Date;
}

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function ExpenseAnalytics({ expenses, selectedMonth }: ExpenseAnalyticsProps) {
  const analytics = useMemo(() => {
    console.log('Analytics expenses:', expenses.length); // Debug log
    if (!expenses || expenses.length === 0) return null;

    // Day of week analysis
    const dayOfWeekData = expenses.reduce((acc, expense) => {
      try {
        const expenseDate = new Date(expense.date);
        const dayIndex = getDay(expenseDate);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[dayIndex];
        
        if (!acc[dayName]) {
          acc[dayName] = { day: dayName, amount: 0, count: 0 };
        }
        acc[dayName].amount += expense.amount;
        acc[dayName].count += 1;
      } catch (error) {
        console.error('Error processing expense date:', expense.date, error);
      }
      return acc;
    }, {} as Record<string, { day: string; amount: number; count: number }>);

    // Ensure all days are represented
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayNames.forEach(day => {
      if (!dayOfWeekData[day]) {
        dayOfWeekData[day] = { day, amount: 0, count: 0 };
      }
    });

    const weeklyPattern = Object.values(dayOfWeekData).sort((a, b) => {
      const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    });

    // Time of day analysis (if we had time data, we'll simulate based on categories)
    const timePatterns = {
      'Morning (6-12)': { Food: 0.4, Transportation: 0.3, Healthcare: 0.2, 'Personal Spending': 0.1 },
      'Afternoon (12-18)': { Food: 0.3, 'Personal Spending': 0.3, Transportation: 0.2, Utilities: 0.2 },
      'Evening (18-24)': { Food: 0.5, 'Personal Spending': 0.3, Housing: 0.2 },
      'Night (0-6)': { 'Personal Spending': 0.6, Food: 0.4 }
    };

    // Category spending patterns
    const categoryData = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { category: expense.category, amount: 0, count: 0, avgAmount: 0 };
      }
      acc[expense.category].amount += expense.amount;
      acc[expense.category].count += 1;
      return acc;
    }, {} as Record<string, { category: string; amount: number; count: number; avgAmount: number }>);

    // Calculate averages
    Object.values(categoryData).forEach(cat => {
      cat.avgAmount = cat.amount / cat.count;
    });

    const categoryAnalysis = Object.values(categoryData)
      .sort((a, b) => b.amount - a.amount)
      .map((item, index) => ({
        ...item,
        color: chartColors[index % chartColors.length],
        percentage: (item.amount / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100
      }));

    // Spending frequency analysis
    const frequencyAnalysis = {
      daily: expenses.length / 30, // Assuming 30 days in month
      weekly: expenses.length / 4.3, // Assuming 4.3 weeks in month
      avgTransactionSize: expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length,
      largestTransaction: Math.max(...expenses.map(e => e.amount)),
      smallestTransaction: Math.min(...expenses.map(e => e.amount)),
    };

    // Spending habits insights
    const insights = [];
    
    // Most active day
    const mostActiveDay = weeklyPattern.reduce((max, day) => 
      day.count > max.count ? day : max, weeklyPattern[0]);
    insights.push({
      type: 'info',
      title: 'Most Active Day',
      description: `You spend most frequently on ${mostActiveDay.day}s (${mostActiveDay.count} transactions)`
    });

    // Highest spending category
    const topCategory = categoryAnalysis[0];
    if (topCategory.percentage > 40) {
      insights.push({
        type: 'warning',
        title: 'Category Concentration',
        description: `${topCategory.category} accounts for ${topCategory.percentage.toFixed(1)}% of your spending`
      });
    }

    // Transaction size analysis
    if (frequencyAnalysis.avgTransactionSize > 1000) {
      insights.push({
        type: 'info',
        title: 'Large Transactions',
        description: `Your average transaction is ₹${frequencyAnalysis.avgTransactionSize.toFixed(0)}`
      });
    }

    // Spending frequency
    if (frequencyAnalysis.daily > 3) {
      insights.push({
        type: 'warning',
        title: 'High Frequency',
        description: `You make ${frequencyAnalysis.daily.toFixed(1)} transactions per day on average`
      });
    } else if (frequencyAnalysis.daily < 1) {
      insights.push({
        type: 'success',
        title: 'Controlled Spending',
        description: `You maintain good spending discipline with ${frequencyAnalysis.daily.toFixed(1)} transactions per day`
      });
    }

    return {
      weeklyPattern,
      categoryAnalysis,
      frequencyAnalysis,
      insights
    };
  }, [expenses]);

  if (!analytics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No data available for analysis</p>
            <p className="text-sm mt-2">Add some expenses to see analytics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <TrendingUp className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {analytics.frequencyAnalysis.daily.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">transactions per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              ₹{analytics.frequencyAnalysis.avgTransactionSize.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Expense</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              ₹{analytics.frequencyAnalysis.largestTransaction.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">single transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {analytics.categoryAnalysis.length}
            </div>
            <p className="text-xs text-muted-foreground">active categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Weekly Spending Pattern */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Weekly Spending Pattern</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto pb-6">
            <div className="min-w-[500px] md:min-w-0">
              <ChartContainer config={{}} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.weeklyPattern} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="day" 
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
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm text-muted-foreground">
                                Amount: ₹{data.amount.toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Transactions: {data.count}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="amount" 
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

        {/* Category Distribution */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto pb-6">
            <div className="min-w-[300px] md:min-w-0">
              <ChartContainer config={{}} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryAnalysis}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      dataKey="amount"
                      nameKey="category"
                    >
                      {analytics.categoryAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{data.category}</p>
                              <p className="text-sm text-muted-foreground">
                                Amount: ₹{data.amount.toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Percentage: {data.percentage.toFixed(1)}%
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Transactions: {data.count}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.categoryAnalysis.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="font-medium">{category.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.count} transactions • Avg: ₹{category.avgAmount.toFixed(0)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{category.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {getInsightIcon(insight.type)}
                <div>
                  <p className="font-medium">{insight.title}</p>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}