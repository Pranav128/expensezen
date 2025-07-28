'use client';
import EnhancedDashboard from "@/components/enhanced-dashboard";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login');
    }
  }, [token, isLoading, router]);

  if (isLoading || !token) {
    return (
      <main className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[128px]" />
          <Skeleton className="h-[128px]" />
          <Skeleton className="h-[280px] md:col-span-1 lg:col-span-1" />
          <Skeleton className="h-[280px] md:col-span-1 lg:col-span-1" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Skeleton className="lg:col-span-2 h-[400px]" />
          <Skeleton className="lg:col-span-3 h-[400px]" />
        </div>
      </main>
    )
  }

  return <EnhancedDashboard />;
}
