"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { Expense } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from './ui/button';
import { ArrowUpDown, Calendar as CalendarIcon, FilterX } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Calendar } from './ui/calendar';
import type { DateRange } from 'react-day-picker';
import { addDays, format, isAfter, isBefore, startOfDay } from 'date-fns';

type SortKey = keyof Expense | '';

export default function ExpenseList({ expenses, isLoading, categories }: { expenses: Expense[]; isLoading: boolean; categories: string[] }) {
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses.filter((expense) => {
      const descriptionMatch = expense.description.toLowerCase().includes(filter.toLowerCase());
      const categoryMatch = categoryFilter === 'all' || expense.category === categoryFilter;
      const date = new Date(expense.date);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      const dateMatch = dateRange?.from && dateRange?.to ? isAfter(date, startOfDay(dateRange.from)) && isBefore(date, startOfDay(addDays(dateRange.to, 1))) : true;
      return descriptionMatch && categoryMatch && dateMatch;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key]! < b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key]! > b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [expenses, filter, categoryFilter, dateRange, sortConfig]);

  const clearFilters = () => {
    setFilter('');
    setCategoryFilter('all');
    setDateRange({ from: addDays(new Date(), -30), to: new Date() });
  };

  const renderSortArrow = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 inline-block opacity-30" />;
    return sortConfig.direction === 'asc' ? <ArrowUpDown className="ml-2 h-4 w-4 inline-block transform" /> : <ArrowUpDown className="ml-2 h-4 w-4 inline-block transform rotate-180" />;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Transaction History</CardTitle>
        <CardDescription>View and filter your expenses.</CardDescription>
        <div className="mt-4 flex flex-col md:flex-row gap-2 items-center flex-wrap">
          <Input
            placeholder="Filter description..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-auto md:flex-1"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => ( <SelectItem key={cat} value={cat}>{cat}</SelectItem> ))}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button id="date" variant={"outline"} className="w-full md:w-auto justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? ( dateRange.to ? (
                    <> {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")} </>
                  ) : ( format(dateRange.from, "LLL dd, y") )
                ) : ( <span>Pick a date range</span> )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon" onClick={clearFilters}><FilterX className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-secondary" onClick={() => handleSort('description')}>Description{renderSortArrow('description')}</TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary" onClick={() => handleSort('category')}>Category{renderSortArrow('category')}</TableHead>
                <TableHead className="text-right cursor-pointer hover:bg-secondary" onClick={() => handleSort('amount')}>Amount{renderSortArrow('amount')}</TableHead>
                <TableHead className="text-right cursor-pointer hover:bg-secondary" onClick={() => handleSort('date')}>Date{renderSortArrow('date')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-16 float-right" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20 float-right" /></TableCell>
                  </TableRow>
                ))
              ) : filteredAndSortedExpenses.length > 0 ? (
                filteredAndSortedExpenses.map((expense) => (
                  <TableRow key={expense.id} className="hover:bg-secondary/50">
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell><span className="px-2 py-1 bg-secondary rounded-full text-xs">{expense.category}</span></TableCell>
                    <TableCell className="text-right font-mono">${expense.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{format(new Date(expense.date), "MMM dd, yyyy")}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">No expenses found for the selected filters.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
