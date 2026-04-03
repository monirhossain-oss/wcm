'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Share2, Loader2, Send, Trash2, CornerDownRight, Reply } from 'lucide-react';
import { FiAlertCircle, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const BlogDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comment & Reply States
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // কোন কমেন্টে রিপ্লাই দিচ্ছে
  const [replyText, setReplyText] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogRes, commentRes] = await Promise.all([
        api.get(`/api/blogs/${id}`),
        api.get(`/api/blogs/${id}/comments`),
      ]);
      setBlog(blogRes.data.blog);
      setComments(commentRes.data.comments);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Story not found or deleted.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // কমেন্ট সাবমিট
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to comment');
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await api.post(`/api/blogs/comments`, {
        blogId: id,
        text: commentText,
      });
      setCommentText('');
      const res = await api.get(`/api/blogs/${id}/comments`);
      setComments(res.data.comments);
      toast.success('Comment added!');
    } catch (err) {
      toast.error('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  // এডমিন রিপ্লাই সাবমিট
  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      await api.post(`/api/blogs/comments`, {
        blogId: id,
        text: replyText,
        parentCommentId: commentId,
      });
      setReplyText('');
      setReplyingTo(null);
      const res = await api.get(`/api/blogs/${id}/comments`);
      setComments(res.data.comments);
      toast.success('Reply sent!');
    } catch (err) {
      toast.error('Failed to send reply');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/api/blogs/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success('Comment removed');
    } catch (err) {
      toast.error('Unauthorized or error occurred');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog?.title, url: window.location.href }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">
          Unfolding the Story...
        </p>
      </div>
    );
  }

  if (!blog)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <FiAlertCircle size={48} className="text-zinc-200 mb-6" />
        <h2 className="text-2xl font-bold italic text-zinc-800">Story has faded into history...</h2>
        <Link
          href="/blogs"
          className="text-orange-500 font-bold uppercase text-[10px] tracking-widest mt-8 border-b-2 border-orange-500 pb-1"
        >
          Return to Archive
        </Link>
      </div>
    );

  return (
    <article className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-20 selection:bg-orange-100">
      <Toaster position="top-center" />

      {/* HEADER */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors mb-8 text-xs font-bold uppercase tracking-widest group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          to Blogs
        </button>
        <div className="mb-4">
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">
            {blog.category}
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-black text-zinc-900 dark:text-white leading-[1.1] mb-8 tracking-tighter italic">
          {blog.title}
        </h1>

        <div className="flex items-center justify-between py-6 border-y border-zinc-100 dark:border-zinc-900 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-100 border-2 border-orange-500/10">
              <Image
                src={
                  blog.author?.image ||
                  `https://ui-avatars.com/api/?name=Admin&background=f27b13&color=fff`
                }
                alt="Author"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-black text-zinc-900 dark:text-zinc-100 text-[13px] uppercase tracking-tight">
                {blog.author?.name || 'Editorial Team'}
              </p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <Share2
            size={18}
            className="text-zinc-400 hover:text-orange-500 cursor-pointer transition-all active:scale-90"
            onClick={handleShare}
          />
        </div>
      </div>

      {/* MAIN IMAGE */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="relative w-full overflow-hidden rounded-4xl shadow-2xl shadow-orange-500/5">
          <div className="relative w-full aspect-16/9 md:aspect-21/9 bg-gray-50 dark:bg-zinc-900">
            <Image src={blog.image} alt={blog.title} fill priority className="object-cover" />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-6 mb-24">
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          {blog.content
            ?.filter((item) => item.type !== 'image_grid')
            .map((item, idx) => (
              <div key={`text-${idx}`} className="mb-8">
                {item.type === 'paragraph' && (
                  <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium opacity-90">
                    {item.text}
                  </p>
                )}
                {item.type === 'quote' && (
                  <div className="pl-8 my-12 border-l-4 border-orange-500 py-2">
                    <p className="text-2xl md:text-3xl font-serif font-black dark:text-zinc-100 leading-snug italic tracking-tight opacity-100">
                      "{item.text}"
                    </p>
                  </div>
                )}
                {item.type === 'heading' && (
                  <h2 className="text-2xl md:text-4xl font-serif font-black text-zinc-900 dark:text-white mt-16 mb-8 tracking-tighter">
                    {item.text}
                  </h2>
                )}
              </div>
            ))}
        </div>

        {blog.content
          ?.filter((item) => item.type === 'image_grid')
          .map((grid, idx) => (
            <div key={`grid-${idx}`} className="mt-20 mb-12">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {grid.images?.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className="relative w-full aspect-4/5 rounded-3xl overflow-hidden shadow-lg group bg-zinc-50 dark:bg-zinc-900"
                  >
                    <Image
                      src={img}
                      alt="Insight"
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

        {/* --- DISCUSSIONS --- */}
        <div className="mt-32 pt-16 border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-3 mb-10">
            <FiMessageSquare className="text-orange-500" size={24} />
            <h3 className="text-2xl font-serif font-black dark:text-white">
              Discussions ({comments.length})
            </h3>
          </div>

          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-16">
              <div className="relative group">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-2xl p-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all min-h-[120px] resize-none"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="absolute bottom-4 right-4 bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submittingComment ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-8 text-center mb-16 border border-dashed dark:border-white/10">
              <Link
                href="/login"
                className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all"
              >
                Sign in to Comment
              </Link>
            </div>
          )}

          <div className="space-y-12">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="group animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="flex gap-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border dark:border-white/10">
                    <Image
                      src={
                        comment.user?.image ||
                        `https://ui-avatars.com/api/?name=${comment.user?.firstName}&background=random`
                      }
                      alt="User"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs uppercase dark:text-white">
                          {comment.user?.firstName} {comment.user?.lastName}
                        </span>
                        {comment.isAdminReply && (
                          <span className="bg-orange-500/10 text-orange-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3 items-center">
                        {isAdmin && (
                          <button
                            onClick={() =>
                              setReplyingTo(replyingTo === comment._id ? null : comment._id)
                            }
                            className="text-zinc-400 hover:text-orange-500 transition-colors"
                          >
                            <Reply size={14} />
                          </button>
                        )}
                        {/* || user?._id === comment.user?._id */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                      {comment.text}
                    </p>
                    <span className="text-[9px] text-zinc-400 font-bold uppercase mt-2 block">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>

                    {/* Admin Reply Input */}
                    {replyingTo === comment._id && (
                      <div className="mt-4 flex gap-2">
                        <input
                          autoFocus
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a staff reply..."
                          className="flex-1 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-orange-500"
                        />
                        <button
                          onClick={() => handleReplySubmit(comment._id)}
                          className="bg-zinc-900 dark:bg-white text-white dark:text-black px-4 rounded-xl text-[10px] font-black uppercase"
                        >
                          Send
                        </button>
                      </div>
                    )}

                    {/* Replies List */}
                    {comment.replies?.map((reply) => (
                      <div
                        key={reply._id}
                        className="mt-6 flex gap-3 pl-6 border-l-2 border-zinc-50 dark:border-white/5"
                      >
                        <CornerDownRight size={14} className="text-zinc-300 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-black text-[10px] uppercase dark:text-zinc-300">
                              {reply.user?.firstName}
                            </span>
                            {reply.isAdminReply && (
                              <span className="bg-orange-500/10 text-orange-500 text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-500 font-medium">
                            {reply.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetails;
