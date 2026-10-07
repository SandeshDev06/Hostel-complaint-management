import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, loginWithGoogle } from '../services/api';
import { DEMO_USERS } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null; // must sign in (email/password, demo buttons or Google)
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Login failed. Please check your credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const googleLogin = async (profile) => {
    setLoading(true);
    try {
      const response = await loginWithGoogle(profile);
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message || 'Google sign-in failed.' };
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login for presentations
  const quickLogin = (role = 'student') => {
    const selectedUser = role === 'admin' ? DEMO_USERS.admin : DEMO_USERS.student;
    const demoToken = `mock_${role}_token_${Date.now()}`;
    setUser(selectedUser);
    setToken(demoToken);
    return selectedUser;
  };

  // Registration handler
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await registerUser(userData);
      const { user: newUser, token: newToken } = response.data;
      setUser(newUser);
      setToken(newToken);
      return { success: true, user: newUser };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Registration failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = (updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      return updated;
    });
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!user;
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isStudent,
        isAdmin,
        login,
        googleLogin,
        quickLogin,
        register,
        updateProfile,
        logout
      }}
    >
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
