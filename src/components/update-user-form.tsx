'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const updateUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

interface UpdateUserFormProps {
    onFinished: () => void;
}

export default function UpdateUserForm({ onFinished }: UpdateUserFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });

  const onSubmit = (data: UpdateUserFormValues) => {
    setIsSubmitting(true);
    
    // Mock API call for demo
    setTimeout(() => {
        toast({
            title: 'Profile Updated',
            description: 'Your profile has been updated successfully (in demo mode).',
        });
        setIsSubmitting(false);
        onFinished();
    }, 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
        </Button>
      </form>
    </Form>
  );
}
