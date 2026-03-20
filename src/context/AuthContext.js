'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
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

  const logoutUser = async (shouldOpenLogin = true) => {
    try {
      await api.post('/api/users/logout');
      setUser(null);

      // প্রোটেক্টড রুটগুলো চেক করা
      const protectedRoutes = ['/profile', '/admin', '/creator', '/become-creator'];
      const isProtectedRoute = protectedRoutes.some(route => window.location.pathname.startsWith(route));

      if (isProtectedRoute) {
        // যদি প্রোটেক্টড রুটে থাকে, তবে হোম পেজে পাঠিয়ে মোডাল খুলবে
        router.push('/');
        if (shouldOpenLogin) {
          // নেভিবারে থাকা লগইন মোডাল স্টেটকে ট্রিগার করার জন্য 
          // আপনি একটি গ্লোবাল স্টেট বা ইভেন্ট ব্যবহার করতে পারেন
          window.dispatchEvent(new CustomEvent('open-login-modal'));
        }
      } else {
        // যদি নরমাল পেজে থাকে (যেমন: Home, About), তবে সেখানেই থাকবে এবং মোডাল খুলবে
        if (shouldOpenLogin) {
          window.dispatchEvent(new CustomEvent('open-login-modal'));
        }
      }
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
