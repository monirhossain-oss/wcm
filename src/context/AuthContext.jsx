'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getApiErrorMessage } from '@/lib/apiError';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

// Session-er sompurno user document — _id, firstName/lastName, profile, creatorRequest shoho.
// Puro app ei shape-tai pore, tai session hydrate korar ekmatro utso eta.
const fetchCurrentUser = async () => {
  try {
    return (await api.get('/api/users/me')).data;
  } catch (err) {
    return null;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isBusinessRestricted = ['suspended', 'pending_review'].includes(user?.status);

  // পেজ লোড হওয়ার সময় ইউজার ডাটা ফেচ করা
  useEffect(() => {
    const fetchUser = async () => {
      setUser(await fetchCurrentUser());
      setLoading(false);
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
        message: getApiErrorMessage(err, 'Registration failed'),
      };
    }
  };

  // লগইন ফাংশন
  const loginUser = async (credentials) => {
    try {
      const res = await api.post('/api/users/login', credentials);
      // Login response ekta 4-field summary ({ id, username, role, status }) — ete _id, profile
      // ba naam nei. Je flow gulo login-er por hard reload kore tader kachhe eta dhora pore na,
      // kintu onLoginSuccess-wala soft navigation-e provider abar mount hoy na, tai oi page
      // gulo undefined data dekhto. Tai caller navigate korar age /me theke puro document nei.
      setUser((await fetchCurrentUser()) || res.data.user);
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: getApiErrorMessage(err, 'Invalid credentials'),
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
        isBusinessRestricted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
