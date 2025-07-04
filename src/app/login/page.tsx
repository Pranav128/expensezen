'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  
  useEffect(() => {
    if (!isAuthLoading && token) {
      router.replace('/');
    }
  }, [token, isAuthLoading, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    // try {
    //   const response = await fetch('http://localhost:8080/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data),
    //   });

    //   const responseData = await response.json();

    //   if (!response.ok) {
    //     throw new Error(responseData.message || 'Login failed');
    //   }

    //   login(responseData.token);
    //   router.push('/');
    // } catch (error: any) {
    //   toast({
    //     title: 'Login Failed',
    //     description: error.message,
    //     variant: 'destructive',
    //   });
    // } finally {
    //   setIsSubmitting(false);
    // }

    // Mock API call for demo
    setTimeout(() => {
      if (data.email === 'demo@example.com' && data.password === 'password') {
        // Create a mock JWT token
        const header = { alg: 'HS256', typ: 'JWT' };
        const payload = { 
          id: 'clxzk15q9000078mna86hf9s4', 
          email: 'demo@example.com', 
          // Expires in 1 hour
          exp: Math.floor(Date.now() / 1000) + (60 * 60) 
        };
        // Use window.btoa for client-side base64 encoding
        const encodedHeader = window.btoa(JSON.stringify(header));
        const encodedPayload = window.btoa(JSON.stringify(payload));
        const mockToken = `${encodedHeader}.${encodedPayload}.fakesignature`;

        login(mockToken);
        router.push('/');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid credentials. Use demo@example.com and password.',
          variant: 'destructive',
        });
      }
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
          <CardTitle className="text-2xl font-headline">Login</CardTitle>
          <CardDescription>Use <code className="font-mono p-1 bg-muted rounded">demo@example.com</code> and <code className="font-mono p-1 bg-muted rounded">password</code> to login.</CardDescription>
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="underline hover:text-primary">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
