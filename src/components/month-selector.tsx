"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
  onCurrentMonth: () => void;
}

export default function MonthSelector({ selectedMonth, onMonthChange, onCurrentMonth }: MonthSelectorProps) {
  const currentMonth = new Date();
  const isCurrentMonth = selectedMonth.getMonth() === currentMonth.getMonth() && 
                        selectedMonth.getFullYear() === currentMonth.getFullYear();

  const handlePreviousMonth = () => {
    onMonthChange(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(selectedMonth, 1));
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(selectedMonth);
    newDate.setFullYear(parseInt(year));
    onMonthChange(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(parseInt(month));
    onMonthChange(newDate);
  };

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Month options
  const monthOptions = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ];

  return (
    <div className="flex items-center gap-2 p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2 min-w-[200px]">
          <Select value={selectedMonth.getMonth().toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedMonth.getFullYear().toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-sm font-medium">
          {format(selectedMonth, 'MMMM yyyy')}
        </span>
        {!isCurrentMonth && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCurrentMonth}
            className="h-8 text-xs"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Current Month
          </Button>
        )}
      </div>
    </div>
  );
}