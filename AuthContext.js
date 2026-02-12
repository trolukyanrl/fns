// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from './services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      // Check if we have a stored token (in a real app, use SecureStore/AsyncStorage)
      const token = localStorage.getItem('authToken');
      if (token) {
        // Verify token with backend
        const response = await authAPI.verifyToken(token);
        if (response.data.valid) {
          setUser(response.data.user);
        }
      }
    } catch (err) {
      console.log('No existing auth session');
      localStorage.removeItem('authToken');
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login({ username, password });
      
      if (response.data.success) {
        setUser(response.data.user);
        // Store token (in real app, use SecureStore for React Native)
        localStorage.setItem('authToken', response.data.user.token);
        return { success: true, user: response.data.user };
      } else {
        setError(response.data.message || 'Login failed');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
      setError(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    clearError,
    isAuthenticated: !!user,
    userRole: user?.role
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};