"use client";

import Link from "next/link";
import AccountDropdown from "./account-dropdown";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  return (
    <header className="py-3 sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="px-4 flex items-center justify-between w-full">
        {/* Logo - Flush left */}
        <Link 
          href="/" 
          className="text-2xl font-bold hover:text-indigo-600 transition-colors ml-0"
        >
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ExpenseZen
          </span>
        </Link>

        {/* Right side container - Flush right */}
        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 mr-0">
            <Link 
              href="/about-us" 
              className="text-gray-600 hover:text-indigo-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-600 hover:text-indigo-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Contact
            </Link>
            <Link 
              href="/help-support" 
              className="text-gray-600 hover:text-indigo-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Help/Support
            </Link>
          </nav>

          {/* Auth Section */}
          {!isLoading && (
            <div className="hidden md:flex items-center gap-3 mr-0">
              {user ? (
                <AccountDropdown />
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors rounded-lg hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors mr-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X size={24} className="text-current" />
            ) : (
              <Menu size={24} className="text-current" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <nav className="flex flex-col space-y-1 p-4">
              <Link 
                href="/about-us" 
                className="text-gray-600 hover:text-indigo-600 px-4 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-600 hover:text-indigo-600 px-4 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/help-support" 
                className="text-gray-600 hover:text-indigo-600 px-4 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Help/Support
              </Link>
              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <Link 
                        href="/dashboard" 
                        className="text-gray-600 hover:text-indigo-600 px-4 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button 
                        className="mt-2 w-full px-4 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors text-center flex items-center justify-center gap-2"
                        onClick={() => {
                          setIsMenuOpen(false);
                          logout();
                          toast({
                            title: "Logged out successfully",
                            description: "You have been logged out of your account."
                          });
                          router.push('/login');
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login" 
                        className="text-gray-600 hover:text-indigo-600 px-4 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        href="/signup" 
                        className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-center shadow-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;