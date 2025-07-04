'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User } from '@/types';

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (newToken: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSetToken = useCallback((newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('authToken', newToken);
      try {
        const decodedToken: { id: string; email: string; iat: number; exp: number } = jwtDecode(newToken);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({ id: decodedToken.id, email: decodedToken.email });
        } else {
          // Token is expired
          localStorage.removeItem('authToken');
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('authToken');
        setUser(null);
        setToken(null);
      }
    } else {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        handleSetToken(storedToken);
      }
    } catch (e) {
      console.error("Could not access local storage", e);
    } finally {
        setIsLoading(false);
    }
  }, [handleSetToken]);

  const login = (newToken: string) => {
    handleSetToken(newToken);
  };

  const logout = () => {
    handleSetToken(null);
  };

  const value = { token, user, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
