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

  // পেজ লোড হওয়ার সময় ইউজার ডাটা ফেচ করা
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

  // রেজিস্ট্রেশন ফাংশন
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

  // লগইন ফাংশন
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

  // লগআউট ফাংশন (পুরো সাইট রিফ্রেশ লজিকসহ)
  const logoutUser = async () => {
    try {
      // ব্যাকএন্ডে লগআউট রিকোয়েস্ট
      await api.post('/api/users/logout');

      // স্টেট ক্লিয়ার
      setUser(null);

      // প্রটেক্টেড রাউট চেক করা
      const protectedRoutes = ['/profile', '/admin', '/creator', '/become-creator'];
      const isProtectedRoute = protectedRoutes.some(route =>
        window.location.pathname.startsWith(route)
      );

      if (isProtectedRoute) {
        // যদি প্রটেক্টেড পেজে থাকে, তবে হোমপেজে রিডাইরেক্ট করে রিফ্রেশ করবে
        window.location.href = '/';
      } else {
        // অন্যথায় বর্তমান পেজেই হার্ড রিফ্রেশ দিবে
        window.location.reload();
      }
    } catch (err) {
      console.error('Logout failed:', err);
      // সেফটি হিসেবে এরর খেলেও পেজ রিফ্রেশ করে দেওয়া ভালো
      window.location.reload();
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