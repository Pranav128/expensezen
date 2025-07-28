"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar as CalendarIcon, SlidersHorizontal } from 'lucide-react';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import type { Expense, ExpenseCategory } from '@/types';

interface SearchFilters {
  searchTerm: string;
  category: ExpenseCategory | 'All';
  amountMin: string;
  amountMax: string;
  dateRange: DateRange | undefined;
  sortBy: 'date' | 'amount' | 'description' | 'category';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  expenses: Expense[];
  onFilteredResults: (filteredExpenses: Expense[]) => void;
}

export default function AdvancedSearch({ expenses, onFilteredResults }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: 'All',
    amountMin: '',
    amountMax: '',
    dateRange: undefined,
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const categories: (ExpenseCategory | 'All')[] = [
    'All',
    'Housing',
    'Transportation',
    'Food',
    'Utilities',
    'Insurance',
    'Healthcare',
    'Saving & Investing',
    'Personal Spending'
  ];

  // Apply filters and search
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Text search
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchLower) ||
        expense.category.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }

    // Amount range filter
    if (filters.amountMin) {
      const minAmount = parseFloat(filters.amountMin);
      if (!isNaN(minAmount)) {
        filtered = filtered.filter(expense => expense.amount >= minAmount);
      }
    }

    if (filters.amountMax) {
      const maxAmount = parseFloat(filters.amountMax);
      if (!isNaN(maxAmount)) {
        filtered = filtered.filter(expense => expense.amount <= maxAmount);
      }
    }

    // Date range filter
    if (filters.dateRange?.from) {
      const startDate = startOfDay(filters.dateRange.from);
      const endDate = filters.dateRange.to ? endOfDay(filters.dateRange.to) : endOfDay(filters.dateRange.from);
      
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return isWithinInterval(expenseDate, { start: startDate, end: endDate });
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[filters.sortBy];
      let bValue: any = b[filters.sortBy];

      // Handle date sorting
      if (filters.sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [expenses, filters]);

  // Update parent component with filtered results
  React.useEffect(() => {
    onFilteredResults(filteredExpenses);
  }, [filteredExpenses, onFilteredResults]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'All',
      amountMin: '',
      amountMax: '',
      dateRange: undefined,
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm.trim()) count++;
    if (filters.category !== 'All') count++;
    if (filters.amountMin || filters.amountMax) count++;
    if (filters.dateRange?.from) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search & Filter
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses by description or category..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Category Filter */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
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

              {/* Amount Range */}
              <div>
                <Label>Amount Range (₹)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.amountMin}
                    onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.amountMax}
                    onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                  />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange?.from ? (
                        filters.dateRange.to ? (
                          <>
                            {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                            {format(filters.dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(filters.dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={filters.dateRange?.from}
                      selected={filters.dateRange}
                      onSelect={(range) => handleFilterChange('dateRange', range)}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Sorting Options */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="sortBy">Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="description">Description</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value) => handleFilterChange('sortOrder', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-end">
                <Button variant="outline" onClick={clearAllFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
          <span>
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </span>
          {filteredExpenses.length > 0 && (
            <span>
              Total: ₹{filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}