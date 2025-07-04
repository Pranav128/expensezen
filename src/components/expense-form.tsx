"use client";

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { suggestExpenseCategory } from '@/ai/flows/suggest-expense-category';
import { useToast } from '@/hooks/use-toast';
import type { Expense } from '@/types';

const formSchema = z.object({
  description: z.string().min(3, { message: "Description must be at least 3 characters." }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  category: z.string().min(1, { message: "Category is required." }),
  date: z.date({ required_error: "A date is required." }),
});

type ExpenseFormValues = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  onSubmit: (data: Omit<Expense, 'id'> | Expense) => void;
  expenseToEdit?: Expense | null;
  onFinished?: () => void;
}

export default function ExpenseForm({ onSubmit, expenseToEdit, onFinished }: ExpenseFormProps) {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();
  const isEditing = !!expenseToEdit;

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: undefined,
      category: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    if (isEditing && expenseToEdit) {
      form.reset({
        description: expenseToEdit.description,
        amount: expenseToEdit.amount,
        category: expenseToEdit.category,
        date: new Date(expenseToEdit.date.replace(/-/g, '/')) // Use safer date parsing
      });
    } else {
        form.reset({
            description: "",
            amount: undefined,
            category: "",
            date: new Date(),
        });
    }
  }, [expenseToEdit, form, isEditing]);

  async function handleSuggestCategory() {
    const description = form.getValues("description");
    if (!description) {
      form.setError("description", { type: "manual", message: "Please enter a description to suggest a category." });
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await suggestExpenseCategory({ description });
      if (result.category) {
        form.setValue("category", result.category, { shouldValidate: true });
        toast({
          title: "Category Suggested!",
          description: `We've suggested "${result.category}".`,
        });
      }
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      toast({
        title: "Suggestion Failed",
        description: "Could not get a category suggestion.",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  }

  function onFormSubmit(values: ExpenseFormValues) {
    if (isEditing && expenseToEdit) {
      onSubmit({ ...values, id: expenseToEdit.id, date: format(values.date, 'yyyy-MM-dd') });
    } else {
      onSubmit({ ...values, date: format(values.date, 'yyyy-MM-dd') });
      form.reset();
      form.setValue("date", new Date());
    }
    if (onFinished) {
      onFinished();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Coffee with a friend" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                  <Input type="number" step="0.01" placeholder="0.00" className="pl-7" {...field} value={field.value ?? ''} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="e.g., Food" {...field} />
                </FormControl>
                <Button type="button" variant="outline" size="icon" onClick={handleSuggestCategory} disabled={isSuggesting} aria-label="Suggest Category">
                  {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Expense</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">{isEditing ? 'Save Changes' : 'Add Expense'}</Button>
      </form>
    </Form>
  );
}
