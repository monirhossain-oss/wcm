
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiSearch,
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiCalendar,
} from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const AdminSubscriptions = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit] = useState(10);

  // ডাটা ফেচ করার মূল ফাংশন
  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/emails', {
        params: {
          page: page,
          limit: limit,
          search: search,
          sort: '-createdAt',
        },
      });

      // আপনার সার্ভার ডাটা পাঠাচ্ছে db.data বা সরাসরি data তে, সেটি চেক করুন
      const result = response.data.data || response.data;
      setEmails(result);
      console.log(result.data)
    } catch (error) {
      console.log('Error status:', error.response?.status);
      if (error.response?.status === 401) {
        alert('Your token is invalid or has expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // পেজ পরিবর্তন হলে অটোমেটিক ফেচ হবে
  useEffect(() => {
    fetchEmails();
  }, [page]);

  // সার্চ বাটনে ক্লিক করলে এই ফাংশন কল হবে
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // সার্চ করলে প্রথম পেজ থেকে শুরু হবে
    fetchEmails();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-black uppercase italic tracking-tighter dark:text-white text-orange-500">
            Newsletter <span className="dark:text-white text-black">Subscriptions</span>
          </h1>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Manage subscriber emails and newsletter data
          </p>
        </div>

        {/* সার্চ ফর্ম */}
        <form onSubmit={handleSearchSubmit} className="flex w-full md:w-auto gap-2">
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-50 dark:bg-white/20 border border-gray-100 dark:border-white/10 rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-orange-500 transition-all dark:text-white w-full md:w-64"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all shadow-md shadow-orange-500/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <FiSearch size={14} /> Search
          </button>
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        {/* Header Row */}
        <div className="grid grid-cols-12 bg-gray-50/50 dark:bg-white/20 px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
          <div className="col-span-8 flex items-center gap-2">
            <FiMail size={12} /> Email Address
          </div>
          <div className="col-span-4 text-right flex items-center justify-end gap-2">
            <FiCalendar size={12} /> Joined Date
          </div>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-white/5">
          {loading ? (
            <div className="p-20 flex justify-center">
              <FiLoader className="animate-spin text-orange-500" size={30} />
            </div>
          ) : emails.length > 0 ? (
            emails.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-white/10 transition-all"
              >
                <div className="col-span-8 flex items-center gap-3">
                  <FiMail className="text-orange-500 opacity-50" size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">
                    {item.email}
                  </span>
                </div>
                <div className="col-span-4 text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] opacity-50">
              No subscribers found
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/20">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            Page <span className="text-orange-500 font-bold">{page}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 bg-gray-100 dark:bg-white/10 rounded-md border dark:border-white/10 disabled:opacity-20 transition-all"
            >
              <FiChevronLeft className="dark:text-white" />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={emails.length < limit}
              className="p-2 bg-gray-100 dark:bg-white/10 rounded-md border dark:border-white/10 disabled:opacity-20 transition-all"
            >
              <FiChevronRight className="dark:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptions;