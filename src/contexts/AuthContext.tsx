"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginService } from '../services/login.service';

interface User {
  id: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  user_id?: number;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch current user from /user/:id
  const fetchCurrentUser = async () => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      try {
        const userInfo = await loginService.getCurrentUser(storedToken);
        
        // Create display name from last_name + first_name or email (Họ + Tên)
        const displayName = (userInfo.first_name && userInfo.last_name) 
          ? `${userInfo.last_name} ${userInfo.first_name}`.trim()
          : userInfo.email.split('@')[0];
        
        setUser({
          id: userInfo.user_id.toString(),
          email: userInfo.email,
          name: displayName,
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          user_id: userInfo.user_id,
          role: userInfo.role?.toUpperCase() || userInfo.role,
        });
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching current user:', error);
        // Token might be invalid, clear everything
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // Initial check on mount
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          await fetchCurrentUser();
        } catch (error) {
          console.error('Error checking auth status:', error);
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isLoading, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}; 