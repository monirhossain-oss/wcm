'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiSearch,
  FiUserX,
  FiUserCheck,
  FiCalendar,
  FiShield,
  FiUser,
  FiFileText,
  FiDownload,
} from 'react-icons/fi';
// ✅ ১. getImageUrl ইমপোর্ট করুন
import { getImageUrl } from '@/lib/imageHelper';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get('/api/admin/export-users', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Users_List.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    const confirmAction = confirm("Are you sure you want to change this user's status?");
    if (!confirmAction) return;

    try {
      await api.put(`/api/admin/toggle-status/${userId}`);
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
        )
      );
    } catch (error) {
      console.error('Failed to update status');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      {/* 🔹 Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#1f1f1f] dark:text-white">
            User <span className="text-orange-500">Registry</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">
            Account oversight & access control
          </p>
        </div>

        <div className="relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Search identity..."
            className="pl-11 pr-6 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-orange-500/50 w-full md:w-72 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button onClick={handleDownload} className="group relative flex items-center gap-3 cursor-pointer">
          <div className="p-2 bg-green-500/20 rounded-lg text-green-500 transition-all">
            <FiFileText size={16} className="animate-pulse group-hover:animate-none" />
          </div>

          <div className="text-left">
            <span className="block text-[11px] font-medium uppercase tracking-tighter text-green-500">
              Export Users
            </span>
            <span className="block text-[9px] uppercase text-green-500">
              Excel Format
            </span>
          </div>

          <FiDownload
            size={14}
            className="ml-2 text-green-500 group-hover:text-white p-2 w-9.5 h-9.5 bg-green-600/10 group-hover:bg-green-600 border border-green-500/20 group-hover:border-green-500 rounded-xl transition-all duration-300"
          />
        </button>
      </div>

      {/* 🔹 Users Table Container */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* ✅ ২. আপনার প্রেফারেন্স অনুযায়ী bg-white/20 আপডেট করা হয়েছে */}
              <tr className="bg-gray-50/50 dark:bg-white/20 border-b border-gray-100 dark:border-white/10">
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Identity
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Classification
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Registry Date
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Status
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">
                  Access
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-8 py-8 h-10 bg-gray-50/30 dark:bg-white/10"></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/20 transition-colors group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm flex items-center justify-center">
                          {/* ✅ ৩. ইমেজ লজিক আপডেট: getImageUrl ব্যবহার করা হয়েছে */}
                          <img
                            src={getImageUrl(user.profile?.profileImage, 'avatar')}
                            alt="avatar"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            // যদি ইমেজ লোড হতে ফেইল করে তবে ইউজার লেটার দেখাবে
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden w-full h-full items-center justify-center bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] font-black uppercase">
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-tight text-[#1f1f1f] dark:text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 lowercase">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        {user.role === 'admin' ? (
                          <FiShield className="text-red-500" size={12} />
                        ) : (
                          <FiUser className="text-gray-400" size={12} />
                        )}
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-red-500' : user.role === 'creator' ? 'text-orange-500' : 'text-blue-500'}`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-[10px] font-bold text-gray-500 flex items-center gap-2">
                        <FiCalendar size={12} className="opacity-50" />
                        {new Date(user.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${user.status === 'active' ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${user.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
                        ></span>
                        {user.status}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        className={`p-2 rounded-lg border transition-all ${user.status === 'active' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border-transparent' : 'text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 border-transparent'}`}
                        title={user.status === 'active' ? 'Block Access' : 'Restore Access'}
                      >
                        {user.status === 'active' ? (
                          <FiUserX size={16} />
                        ) : (
                          <FiUserCheck size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-8 py-16 text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]"
                  >
                    End of Records. No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
