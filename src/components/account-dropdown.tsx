'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UpdateUserForm from './update-user-form';
import { LogOut, User, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AccountDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  const handleExport = () => {
    toast({
        title: "Feature not available",
        description: "Exporting data will be available in a future version.",
    });
  }

  const getInitials = (email: string) => {
    if (!email) return 'U';
    const parts = email.split('@');
    return parts[0][0].toUpperCase();
  };
  
  return (
    <Dialog open={isUpdateUserOpen} onOpenChange={setIsUpdateUserOpen}>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {getInitials(user.email)}
                </AvatarFallback>
            </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">My Account</p>
                <p className="text-xs leading-none text-muted-foreground">
                {user.email}
                </p>
            </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Update Profile</span>
                    </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem onClick={handleExport}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Export Data</span>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Update Profile</DialogTitle>
            </DialogHeader>
            <UpdateUserForm onFinished={() => setIsUpdateUserOpen(false)} />
        </DialogContent>
    </Dialog>
  );
}
