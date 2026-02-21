'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiUserX,
  FiUserCheck,
  FiMail,
  FiCalendar,
  FiShield,
} from 'react-icons/fi';

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      await api.put(`/api/admin/toggle-status/${userId}`);
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
        )
      );
    } catch (error) {
      alert('Failed to update status');
    }
  };

  // সার্চ ফিল্টারিং
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* 🔹 Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">User Management</h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
            Control & Monitor All Accounts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by username or email..."
              className="pl-12 pr-6 py-3 bg-white dark:bg-[#111] border border-ui rounded-2xl text-xs font-bold outline-none focus:border-orange-500 w-full md:w-80 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white dark:bg-[#111] border border-ui rounded-2xl hover:text-orange-500 transition-colors">
            <FiFilter />
          </button>
        </div>
      </div>

      {/* 🔹 Users Table */}
      <div className="bg-white dark:bg-[#111] rounded-[2.5rem] border border-ui overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fcfcfc] dark:bg-[#151515] border-b border-ui">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  User
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Role
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Joined Date
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Status
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-8 py-6 h-20 bg-ui/20"></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-[#fafafa] dark:hover:bg-[#151515] transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-ui overflow-hidden ring-2 ring-transparent group-hover:ring-orange-500 transition-all">
                          <img
                            src={
                              user.profile?.profileImage
                                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.profile.profileImage}`
                                : '/default-avatar.png'
                            }
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 italic">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          user.role === 'admin'
                            ? 'bg-red-50 text-red-500 border-red-100'
                            : user.role === 'creator'
                              ? 'bg-orange-50 text-orange-500 border-orange-100'
                              : 'bg-blue-50 text-blue-500 border-blue-100'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                        <FiCalendar /> {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div
                        className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter ${user.status === 'active' ? 'text-success' : 'text-red-500'}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}
                        ></div>
                        {user.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(user._id)}
                          className={`p-2.5 rounded-xl border transition-all ${
                            user.status === 'active'
                              ? 'hover:bg-red-50 hover:text-red-500 border-transparent'
                              : 'hover:bg-green-50 hover:text-green-500 border-transparent'
                          }`}
                          title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                        >
                          {user.status === 'active' ? (
                            <FiUserX size={18} />
                          ) : (
                            <FiUserCheck size={18} />
                          )}
                        </button>
                        <button className="p-2.5 rounded-xl hover:bg-ui transition-colors">
                          <FiMoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs"
                  >
                    No users found
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
