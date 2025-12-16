import React, { createContext, useState, useCallback, useEffect } from 'react';
import * as userService from '../services/userService';

/**
 * AuthContext - Quản lý trạng thái authentication toàn cục
 */
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra authentication khi app load
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      const currentUser = userService.getCurrentUser();
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const response = await userService.loginUser(username, password);

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('username', response.username);

      setUser(response);
      setIsAuthenticated(true);

      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      const response = await userService.registerUser(data);

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('username', response.username);

      setUser(response);
      setIsAuthenticated(true);

      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    userService.logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
