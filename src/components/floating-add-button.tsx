"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import ExpenseForm from '@/components/expense-form';
import type { Expense } from '@/types';

interface FloatingAddButtonProps {
  onAddExpense: (expense: Omit<Expense, '_id'>) => void;
}

export default function FloatingAddButton({ onAddExpense }: FloatingAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (expense: Omit<Expense, '_id'>) => {
    onAddExpense(expense);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        size="icon"
      >
        <Plus className="h-5 w-5 md:h-6 md:w-6" />
        <span className="sr-only">Add new expense</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md w-[95%] p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5" />
              Add New Expense
            </DialogTitle>
          </DialogHeader>
          <ExpenseForm 
            onSubmit={handleSubmit}
            onFinished={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}