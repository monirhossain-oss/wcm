'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheck, FiX, FiEye, FiUser, FiGlobe, FiClock } from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await api.get('/api/admin/listings');
      setListings(res.data);
    } catch (err) {
      console.error('Error fetching admin listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // ✅ URL ফিক্স করা হয়েছে আপনার ব্যাকএন্ড রাউট অনুযায়ী
      const res = await api.put(`/api/admin/update-status/${id}`, { status: newStatus });

      setListings(listings.map((l) => (l._id === id ? { ...l, status: newStatus } : l)));
      alert(res.data.message || `Listing ${newStatus} successfully!`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Action failed: Admin only area');
    }
  };

  const filteredListings =
    filter === 'all' ? listings : listings.filter((l) => l.status === filter);

  if (loading)
    return (
      <div className="p-10 text-[10px] font-black uppercase animate-pulse tracking-widest text-orange-500">
        Scanning Platform Inventory...
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">
            Global <span className="text-orange-500">Listings</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Review and manage all creator submissions
          </p>
        </div>

        <div className="flex bg-ui/50 p-1.5 rounded-2xl border border-ui backdrop-blur-md">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                filter === f
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
                  : 'text-gray-500 hover:text-black dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table Interface */}
      <div className="bg-white dark:bg-[#111] border border-ui rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ui text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-8 py-8 text-center">Visual</th>
                <th className="px-6 py-8">Identity & Origin</th>
                <th className="px-6 py-8">Creator Node</th>
                <th className="px-6 py-8 text-center">Status</th>
                <th className="px-8 py-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui/50">
              {filteredListings.map((item) => (
                <tr key={item._id} className="group hover:bg-ui/20 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-ui mx-auto shadow-inner bg-ui">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.image}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt="Artifact"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <h4 className="text-[11px] font-black uppercase tracking-tight truncate max-w-45">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">
                      <FiGlobe className="text-orange-500" /> {item.country} / {item.region}
                    </div>
                    <p className="text-[8px] font-black text-orange-500/80 mt-1 uppercase italic tracking-widest">
                      {item.tradition}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-ui flex items-center justify-center border border-ui">
                        <FiUser size={16} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tight">
                          {item.creatorId?.firstName} {item.creatorId?.lastName}
                        </p>
                        <p className="text-[9px] font-bold text-gray-500 tracking-tighter lowercase">
                          {item.creatorId?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex justify-center">
                      <span
                        className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border shadow-sm ${
                          item.status === 'approved'
                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                            : item.status === 'rejected'
                              ? 'bg-red-500/10 text-red-500 border-red-500/20'
                              : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2">
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 bg-ui rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm"
                        title="View Source"
                      >
                        <FiEye size={16} />
                      </a>
                      {item.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(item._id, 'approved')}
                          className="p-3.5 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm"
                          title="Approve"
                        >
                          <FiCheck size={16} />
                        </button>
                      )}
                      {item.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusUpdate(item._id, 'rejected')}
                          className="p-3.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Reject"
                        >
                          <FiX size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredListings.length === 0 && (
            <div className="py-24 text-center opacity-40">
              <FiClock size={40} className="mx-auto mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">
                No {filter} protocols found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
