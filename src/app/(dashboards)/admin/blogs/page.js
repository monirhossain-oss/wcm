'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiPlus, FiLoader, FiExternalLink } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/api/blogs');
      setBlogs(res.data.blogs);
    } catch (err) {
      toast.error('Failed to load journals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Blog?')) return;
    try {
      await api.delete(`/api/blogs/${id}`);
      toast.success('Blog deleted');
      setBlogs(blogs.filter((b) => b._id !== id));
    } catch (err) {
      toast.error('Blog delete failed');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <FiLoader className="animate-spin text-orange-500" size={32} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto">
      <Toaster />
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          Manage <span className="text-orange-500">Blogs</span>
        </h1>
        <Link
          href="/admin/create-blog"
          className="bg-orange-600 text-white px-6 py-2.5 rounded-md font-bold text-xs uppercase flex items-center gap-2 hover:bg-orange-500 transition-all"
        >
          <FiPlus /> New Entry
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white dark:bg-white/5 border dark:border-white/10 p-4 rounded-lg flex items-center justify-between group hover:border-orange-500/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <img src={blog.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
              <div>
                <h3 className="font-bold text-sm line-clamp-1">{blog.title}</h3>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                  {blog.category} • {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/blogs/${blog._id}`}
                target="_blank"
                className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-md transition-all"
              >
                <FiExternalLink size={18} />
              </Link>
              <Link
                href={`/admin/blogs/${blog._id}`}
                className="p-2 hover:bg-orange-500/10 text-orange-500 rounded-md transition-all"
              >
                <FiEdit2 size={18} />
              </Link>
              <button
                onClick={() => handleDelete(blog._id)}
                className="p-2 hover:bg-red-500/10 text-red-500 rounded-md transition-all"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
