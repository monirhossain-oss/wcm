'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  FiUploadCloud,
  FiMapPin,
  FiGlobe,
  FiType,
  FiLink,
  FiFileText,
  FiTag,
  FiX,
  FiImage,
  FiArrowRight,
} from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function AddListing() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    externalUrl: '',
    region: '',
    country: '',
    tradition: '',
    culturalTags: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));

      if (image) {
        data.append('image', image);
      } else {
        alert('Please select an image first');
        setLoading(false);
        return;
      }

      await api.post('/api/listings/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      router.push('/creator/listings');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error creating listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-700">
      {/* 🔹 Header Section */}
      <div className="mb-8 border-b border-gray-100 dark:border-white/5 pb-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#1f1f1f] dark:text-white">
          Deploy <span className="text-orange-500">Artifact</span>
        </h2>
        <p className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">
          Add a new node to the cultural inventory
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 🖼️ Left: Compact Image Upload */}
          <div className="lg:col-span-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block ml-1">
              Visual Asset
            </label>
            <div className="relative h-64 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center overflow-hidden group transition-all shadow-sm">
              {image ? (
                <div className="absolute inset-0 w-full h-full p-2">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setImage(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-md text-white rounded-lg hover:bg-red-500 transition-all z-10"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <FiUploadCloud size={24} className="text-orange-500 mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-tight text-gray-600 dark:text-gray-300">
                    Upload Image
                  </p>
                  <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                    JPG, PNG (MAX 5MB)
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                required={!image}
              />
            </div>
          </div>

          {/* 📝 Right: Form Details */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Artifact Title
              </label>
              <input
                type="text"
                placeholder="Enter a descriptive name for your work"
                className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all text-[#1f1f1f] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Region
              </label>
              <input
                type="text"
                placeholder="e.g. South Asia"
                className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all text-[#1f1f1f] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Country
              </label>
              <input
                type="text"
                placeholder="e.g. Bangladesh"
                className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all text-[#1f1f1f] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Description
              </label>
              <textarea
                placeholder="Tell the story and historical context of this artifact..."
                className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 h-32 resize-none transition-all text-[#1f1f1f] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* 🔹 Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 bg-gray-50/50 dark:bg-white/10 border border-gray-100 dark:border-white/5 rounded-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
              Tradition
            </label>
            <input
              type="text"
              placeholder="e.g. Jamdani Weaving"
              className="w-full bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              onChange={(e) => setFormData({ ...formData, tradition: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
              Tags
            </label>
            <input
              type="text"
              placeholder="heritage, silk, handmade"
              className="w-full bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              onChange={(e) => setFormData({ ...formData, culturalTags: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
              External URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/source"
              className="w-full bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
              required
            />
          </div>
        </div>

        {/* 🚀 Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-[11px] tracking-[0.3em] uppercase transition-all shadow-lg shadow-orange-500/20 active:scale-[0.99] flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Confirm Publication <FiArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
