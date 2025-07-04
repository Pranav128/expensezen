"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DialogTrigger,
  DialogFooter,
  DialogClose,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import UpdateUserForm from "./update-user-form";
import { LogOut, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AccountDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false);

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
      <Dialog open={isUpdateUserOpen} onOpenChange={setIsUpdateUserOpen}>
        {" "}
        {/* Dialog for Update Profile */}
        {/* <DialogTrigger asChild> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
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
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Export Data</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {/* <AlertDialogTrigger asChild> */}
                <DropdownMenuItem onSelect={() => setIsLogoutConfirmOpen(true)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span> {/* Added missing text */}
                </DropdownMenuItem>
              {/* </AlertDialogTrigger> */}
            </DropdownMenuContent>
          </DropdownMenu>
        {/* </DialogTrigger> */}
        {/* Content for Update Profile Dialog */}
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
            <AlertDialogCancel onClick={() => setIsLogoutConfirmOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
