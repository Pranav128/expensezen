"use client";

import Link from "next/link";
import AccountDropdown from "./account-dropdown";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            ExpenseZen
          </Link>
        </div>
        <nav className="hidden md:flex space-x-4">
          <Link href="/about-us" className="text-gray-600 hover:text-gray-900">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">
            Contact
          </Link>
          <Link href="/help-support" className="text-gray-600 hover:text-gray-900">
            Help/Support
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <AccountDropdown />
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col space-y-2 p-4">
            <Link href="/about-us" className="text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
              About Us
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <Link href="/help-support" className="text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
              Help/Support
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;