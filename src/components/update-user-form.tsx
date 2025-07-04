'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';

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
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user?.email || '',
    },
    mode: "onChange" // Enable real-time validation and watching
  });

  const watchedFields = useWatch({ control: form.control });

  const handleSave = async (data: UpdateUserFormValues) => {
    setIsSaving(true);
    try {
      // Replace with your actual API call to update user
      console.log("Saving user data:", data);
      // Example: const response = await fetch('/api/update-user', { method: 'PUT', body: JSON.stringify(data) });
      // Handle response...
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      onFinished();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
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
        {form.formState.isDirty && (
          <Button type="button" onClick={form.handleSubmit(handleSave)} className="w-full" disabled={isSaving || !form.formState.isValid}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        )}
      </form>
    </Form>
  );
}
