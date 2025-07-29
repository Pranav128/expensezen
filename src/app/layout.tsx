import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import Header from '../components/header';

export const metadata: Metadata = {
  title: 'ExpenseZen',
  description: 'Track your expenses with ease and style.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-gray-100 py-4 mt-0.5">
              <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
                <p>&copy; {new Date().getFullYear()} ExpenseZen. All rights reserved.</p>
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mt-2">
                  <a href="/about-us" className="text-blue-600 hover:underline">About Us</a>
                  <span className="hidden sm:inline">|</span>
                  <a href="/contact" className="text-blue-600 hover:underline">Contact</a>
                  <span className="hidden sm:inline">|</span>
                  <a href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</a>
                  <span className="hidden sm:inline">|</span>
                  <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
