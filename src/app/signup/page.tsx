'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '' },
  });
  
  useEffect(() => {
    if (!isAuthLoading && token) {
      router.replace('/');
    }
  }, [token, isAuthLoading, router]);

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    // try {
    //   const response = await fetch('http://localhost:8080/api/auth/signup', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data),
    //   });
      
    //   const responseData = await response.json();

    //   if (!response.ok) {
    //     throw new Error(responseData.message || 'Signup failed');
    //   }

    //   login(responseData.token);
    //   router.push('/');
    // } catch (error: any) {
    //   toast({
    //     title: 'Signup Failed',
    //     description: error.message,
    //     variant: 'destructive',
    //   });
    // } finally {
    //   setIsSubmitting(false);
    // }

    // Mock API call for demo
    setTimeout(() => {
      toast({
        title: 'Demo Mode',
        description: "Signing you in with a demo account.",
      });
      // Create a mock JWT token
      const header = { alg: 'HS256', typ: 'JWT' };
      const payload = { 
        id: 'clxzk15q9000078mna86hf9s4', 
        email: 'demo@example.com', 
        // Expires in 1 hour
        exp: Math.floor(Date.now() / 1000) + (60 * 60) 
      };
      const encodedHeader = window.btoa(JSON.stringify(header));
      const encodedPayload = window.btoa(JSON.stringify(payload));
      const mockToken = `${encodedHeader}.${encodedPayload}.fakesignature`;

      login(mockToken);
      router.push('/');
      setIsSubmitting(false);
    }, 1000);
  };
  
  if (isAuthLoading || token) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
          <CardDescription>For this demo, any signup will log you in with a sample account.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
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
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline hover:text-primary">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
