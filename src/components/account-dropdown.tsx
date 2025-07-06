"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import UpdateUserForm from "./update-user-form";
import { LogOut, User, FileUp, LockKeyhole, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AccountDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false);

  console.log("Current user profile picture:", user?.profilePicture);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleExport = () => {
    toast({
      title: "Feature is available at dashboard",
      description: "You can export your data from the dashboard.",
    });
  };

  const getInitials = (email: string) => {
    if (!email) return "U";
    const parts = email.split("@");
    return parts[0][0].toUpperCase();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              {user.profilePicture && (
                <AvatarImage asChild>
                  <Image
                    src={user.profilePicture}
                    alt="User profile picture"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </AvatarImage>
              )}
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
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setIsUpdateUserOpen(true);
              }}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Update Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport}>
              <FileUp className="mr-2 h-4 w-4" />
              <span>Export Data</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/help-support")}>
              <Info className="mr-2 h-4 w-4" />
              <span>Help/Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push("/change-password")}>
              <LockKeyhole className="mr-2 h-4 w-4" />
              <span>Change Password</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsLogoutConfirmOpen(true)}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isUpdateUserOpen} onOpenChange={setIsUpdateUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <UpdateUserForm onFinished={() => setIsUpdateUserOpen(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isLogoutConfirmOpen}
        onOpenChange={setIsLogoutConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Logging out will end your current session. You will need to log in
              again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
