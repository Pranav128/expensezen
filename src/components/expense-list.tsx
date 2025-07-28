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
import { ArrowUpDown, Calendar as CalendarIcon, FilterX, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Calendar } from './ui/calendar';
import type { DateRange } from 'react-day-picker';
import { addDays, format, isAfter, isBefore, startOfDay } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ExpenseForm from './expense-form';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  categories: string[];
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
}

type SortKey = keyof Expense | '';

export default function ExpenseList({ expenses, isLoading, categories, onUpdateExpense, onDeleteExpense }: ExpenseListProps) {
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

  // Generate unique keys for each expense
  const getUniqueKey = (expense: Expense, index: number) => {
    return `${expense._id}-${index}`;
  };

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = [...expenses].filter((expense) => {
      const descriptionMatch = expense.description.toLowerCase().includes(filter.toLowerCase());
      const categoryMatch = categoryFilter === 'all' || expense.category === categoryFilter;
      
      // Handle date filtering safely
      try {
        const date = new Date(expense.date);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        const dateMatch = !dateRange?.from || 
          (isAfter(date, startOfDay(dateRange.from)) && 
          (!dateRange.to || isBefore(date, startOfDay(addDays(dateRange.to, 1)))));
        return descriptionMatch && categoryMatch && dateMatch;
      } catch {
        return descriptionMatch && categoryMatch;
      }
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        // @ts-ignore
        const aValue = a[sortConfig.key];
        // @ts-ignore
        const bValue = b[sortConfig.key];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [expenses, filter, categoryFilter, dateRange, sortConfig]);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedExpenses.slice(startIndex, endIndex);
  }, [filteredAndSortedExpenses, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredAndSortedExpenses.length / itemsPerPage));
  }, [filteredAndSortedExpenses, itemsPerPage]);
  
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateSubmit = (data: Omit<Expense, '_id'> | Expense) => {
    onUpdateExpense(data as Expense);
    setIsEditDialogOpen(false);
    setEditingExpense(null);
  };

  const clearFilters = () => {
    setFilter('');
    setCategoryFilter('all');
    setDateRange(undefined);
    setSortConfig({ key: 'date', direction: 'desc' });
    setCurrentPage(1);
  };

  const renderSortArrow = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 inline-block opacity-30" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUpDown className="ml-2 h-4 w-4 inline-block" /> 
      : <ArrowUpDown className="ml-2 h-4 w-4 inline-block transform rotate-180" />;
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Transaction History</CardTitle>
          <CardDescription>View, filter, and manage your expenses.</CardDescription>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <Input
                placeholder="Filter description..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:flex-1"
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button id="date" variant={"outline"} className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <> {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")} </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar 
                    mode="range" 
                    selected={dateRange} 
                    onSelect={setDateRange} 
                    numberOfMonths={1} 
                    className="sm:hidden"
                  />
                  <Calendar 
                    mode="range" 
                    selected={dateRange} 
                    onSelect={setDateRange} 
                    numberOfMonths={2}
                    className="hidden sm:block" 
                  />
                </PopoverContent>
              </Popover>
              <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
                <FilterX className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-secondary whitespace-nowrap" onClick={() => handleSort('description')}>
                    Description{renderSortArrow('description')}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-secondary hidden sm:table-cell" onClick={() => handleSort('category')}>
                    Category{renderSortArrow('category')}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-secondary whitespace-nowrap" onClick={() => handleSort('amount')}>
                    Amount (₹){renderSortArrow('amount')}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-secondary hidden sm:table-cell" onClick={() => handleSort('date')}>
                    Date{renderSortArrow('date')}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-16 float-right" /></TableCell>
                      <TableCell className="text-right hidden sm:table-cell"><Skeleton className="h-5 w-20 float-right" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-20 float-right" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedExpenses.length > 0 ? (
                  paginatedExpenses.map((expense, index) => (
                    <TableRow key={getUniqueKey(expense, index)} className="hover:bg-secondary/50">
                      <TableCell className="font-medium max-w-[150px] truncate">
                        <div>
                          {expense.description}
                          <div className="sm:hidden text-xs text-muted-foreground mt-1">
                            {format(new Date(expense.date), "MMM dd, yyyy")}
                          </div>
                          <div className="sm:hidden mt-1">
                            <span className="px-2 py-0.5 bg-secondary rounded-full text-xs">
                              {expense.category}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                          {expense.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {expense.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground hidden sm:table-cell">
                        {format(new Date(expense.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(expense)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the expense for "{expense.description}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="mt-2 sm:mt-0">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteExpense(expense._id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No expenses found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            onSubmit={handleUpdateSubmit}
            expenseToEdit={editingExpense}
            onFinished={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
