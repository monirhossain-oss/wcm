'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/users/me');
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const registerUser = async (userData) => {
    try {
      const res = await api.post('/api/users/register', userData);
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed',
      };
    }
  };

  const loginUser = async (credentials) => {
    try {
      const res = await api.post('/api/users/login', credentials);
      setUser(res.data.user);
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid credentials',
      };
    }
  };

  const logoutUser = async () => {
    try {
      await api.post('/api/users/logout');
      setUser(null);
      window.location.href = '/auth/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        registerUser,
        loginUser,
        logoutUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
