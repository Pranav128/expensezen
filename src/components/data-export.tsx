"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Download, FileText, FileSpreadsheet, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import type { Expense, ExpenseCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface DataExportProps {
  expenses: Expense[];
}

interface ExportFilters {
  startDate: Date | null;
  endDate: Date | null;
  category: ExpenseCategory | 'All';
  format: 'csv' | 'json' | 'pdf';
  includeCharts: boolean;
}

export default function DataExport({ expenses }: DataExportProps) {
  const [filters, setFilters] = useState<ExportFilters>({
    startDate: null,
    endDate: null,
    category: 'All',
    format: 'csv',
    includeCharts: false
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

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

  // Filter expenses based on criteria
  const getFilteredExpenses = () => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      
      // Date filter
      let dateMatch = true;
      if (filters.startDate && filters.endDate) {
        dateMatch = isWithinInterval(expenseDate, {
          start: filters.startDate,
          end: filters.endDate
        });
      }
      
      // Category filter
      const categoryMatch = filters.category === 'All' || expense.category === filters.category;
      
      return dateMatch && categoryMatch;
    });
  };

  // Generate CSV content
  const generateCSV = (data: Expense[]) => {
    const headers = ['Date', 'Description', 'Amount (₹)', 'Category'];
    const csvContent = [
      headers.join(','),
      ...data.map(expense => [
        expense.date,
        `"${expense.description.replace(/"/g, '""')}"`,
        expense.amount.toString(),
        expense.category
      ].join(','))
    ].join('\n');
    
    return csvContent;
  };

  // Generate JSON content
  const generateJSON = (data: Expense[]) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      filters: {
        dateRange: filters.startDate && filters.endDate ? {
          start: filters.startDate.toISOString(),
          end: filters.endDate.toISOString()
        } : null,
        category: filters.category
      },
      summary: {
        totalExpenses: data.length,
        totalAmount: data.reduce((sum, expense) => sum + expense.amount, 0),
        categories: [...new Set(data.map(e => e.category))],
        dateRange: {
          earliest: data.length > 0 ? Math.min(...data.map(e => new Date(e.date).getTime())) : null,
          latest: data.length > 0 ? Math.max(...data.map(e => new Date(e.date).getTime())) : null
        }
      },
      expenses: data
    };
    
    return JSON.stringify(exportData, null, 2);
  };

  // Generate PDF content (simplified HTML for PDF conversion)
  const generatePDF = (data: Expense[]) => {
    const totalAmount = data.reduce((sum, expense) => sum + expense.amount, 0);
    const categoryTotals = data.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Expense Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .summary-item { text-align: center; }
        .summary-value { font-size: 24px; font-weight: bold; color: #333; }
        .summary-label { font-size: 14px; color: #666; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .amount { text-align: right; }
        .category-summary { margin-top: 30px; }
        .category-item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="header">
        <h1>ExpenseZen - Expense Report</h1>
        <p>Generated on ${format(new Date(), 'PPP')}</p>
        ${filters.startDate && filters.endDate ? 
          `<p>Period: ${format(filters.startDate, 'PPP')} - ${format(filters.endDate, 'PPP')}</p>` : 
          '<p>All Time</p>'
        }
    </div>
    
    <div class="summary">
        <h2>Summary</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-value">${data.length}</div>
                <div class="summary-label">Total Transactions</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">₹${totalAmount.toLocaleString()}</div>
                <div class="summary-label">Total Amount</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">₹${data.length > 0 ? (totalAmount / data.length).toFixed(0) : '0'}</div>
                <div class="summary-label">Average Transaction</div>
            </div>
        </div>
    </div>

    <div class="category-summary">
        <h2>Category Breakdown</h2>
        ${Object.entries(categoryTotals)
          .sort(([,a], [,b]) => b - a)
          .map(([category, amount]) => 
            `<div class="category-item">
                <span>${category}</span>
                <span>₹${amount.toLocaleString()}</span>
            </div>`
          ).join('')
        }
    </div>

    <h2>Transaction Details</h2>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th class="amount">Amount (₹)</th>
            </tr>
        </thead>
        <tbody>
            ${data.map(expense => `
                <tr>
                    <td>${format(new Date(expense.date), 'MMM dd, yyyy')}</td>
                    <td>${expense.description}</td>
                    <td>${expense.category}</td>
                    <td class="amount">${expense.amount.toLocaleString()}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;

    return htmlContent;
  };

  const handleExport = async () => {
    const filteredData = getFilteredExpenses();
    
    if (filteredData.length === 0) {
      toast({
        title: "No Data",
        description: "No expenses match the selected criteria.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      const dateStr = format(new Date(), 'yyyy-MM-dd');
      const categoryStr = filters.category === 'All' ? 'all' : filters.category.toLowerCase().replace(/\s+/g, '-');

      switch (filters.format) {
        case 'csv':
          content = generateCSV(filteredData);
          filename = `expenses-${categoryStr}-${dateStr}.csv`;
          mimeType = 'text/csv';
          break;
        case 'json':
          content = generateJSON(filteredData);
          filename = `expenses-${categoryStr}-${dateStr}.json`;
          mimeType = 'application/json';
          break;
        case 'pdf':
          content = generatePDF(filteredData);
          filename = `expenses-${categoryStr}-${dateStr}.html`;
          mimeType = 'text/html';
          break;
        default:
          throw new Error('Unsupported format');
      }

      // Create and download file
      const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${filteredData.length} expenses exported as ${filters.format.toUpperCase()}.`
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setFilters(prev => ({
      ...prev,
      startDate: range?.from || null,
      endDate: range?.to || null
    }));
  };

  const filteredCount = getFilteredExpenses().length;
  const filteredTotal = getFilteredExpenses().reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Date Range */}
          <div>
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>All time</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Category Filter */}
          <div>
            <Label>Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value as ExpenseCategory | 'All' }))}
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
        </div>

        {/* Export Format */}
        <div>
          <Label>Export Format</Label>
          <Select
            value={filters.format}
            onValueChange={(value) => setFilters(prev => ({ ...prev, format: value as 'csv' | 'json' | 'pdf' }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV (Excel Compatible)
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  JSON (Data Format)
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  HTML Report (Print/PDF)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Preview */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Export Preview</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Transactions: {filteredCount} of {expenses.length}</p>
            <p>Total Amount: ₹{filteredTotal.toLocaleString()}</p>
            <p>Format: {filters.format.toUpperCase()}</p>
            {filters.category !== 'All' && <p>Category: {filters.category}</p>}
            {dateRange?.from && <p>Date Range: {format(dateRange.from, 'PPP')} {dateRange.to && `- ${format(dateRange.to, 'PPP')}`}</p>}
          </div>
        </div>

        {/* Export Button */}
        <Button 
          onClick={handleExport} 
          disabled={isExporting || filteredCount === 0}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : `Export ${filteredCount} Expenses`}
        </Button>
      </CardContent>
    </Card>
  );
}