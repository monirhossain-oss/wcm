'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FiUploadCloud, FiCheck, FiMapPin, FiGlobe, FiType, FiLink } from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function AddListing() {
  const [formData, setFormData] = useState({
    title: '',
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

    const data = new FormData();
    // ফর্ম ডাটা অ্যাপেন্ড করা
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      await api.post('/api/listings/add', data);
      router.push('/creator/listings');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl animate-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h2 className="text-2xl font-black uppercase tracking-tight">Create New Listing</h2>
        <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
          Add your cultural masterpiece to the platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 🖼️ Image Upload Section */}
        <div className="relative h-72 bg-white dark:bg-[#111] border-2 border-dashed border-ui rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden group hover:border-orange-500 transition-all cursor-pointer">
          {image ? (
            <div className="absolute inset-0 w-full h-full">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-40"
              />
            </div>
          ) : (
            <div className="text-center">
              <FiUploadCloud
                size={48}
                className="text-gray-300 mb-4 mx-auto group-hover:text-orange-500 transition-colors"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="absolute inset-0 opacity-0 cursor-pointer z-20"
            required={!image}
          />

          <div className="relative z-10 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
              {image ? 'Replace Selected Image' : 'Click or Drag to Upload Image'}
            </p>
            {image && <p className="text-[9px] font-bold text-orange-500 mt-2">{image.name}</p>}
          </div>
        </div>

        {/* 📝 Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-1">
              <FiType /> Item Title
            </label>
            <input
              type="text"
              placeholder="e.g. Nakshi Kantha Art"
              className="w-full bg-white dark:bg-[#111] border border-ui p-5 rounded-2xl text-[11px] font-bold outline-none focus:border-orange-500 transition-all"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* External URL */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-1">
              <FiLink /> Video / Source URL
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/..."
              className="w-full bg-white dark:bg-[#111] border border-ui p-5 rounded-2xl text-[11px] font-bold outline-none focus:border-orange-500 transition-all"
              onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
              required
            />
          </div>

          {/* Region */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-1">
              <FiMapPin /> Region
            </label>
            <input
              type="text"
              placeholder="e.g. South Asia"
              className="w-full bg-white dark:bg-[#111] border border-ui p-5 rounded-2xl text-[11px] font-bold outline-none focus:border-orange-500 transition-all"
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              required
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-1">
              <FiGlobe /> Country
            </label>
            <input
              type="text"
              placeholder="e.g. Bangladesh"
              className="w-full bg-white dark:bg-[#111] border border-ui p-5 rounded-2xl text-[11px] font-bold outline-none focus:border-orange-500 transition-all"
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
            />
          </div>

          {/* Tradition */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
              Cultural Tradition
            </label>
            <input
              type="text"
              placeholder="e.g. Folk Art & Handicraft"
              className="w-full bg-white dark:bg-[#111] border border-ui p-5 rounded-2xl text-[11px] font-bold outline-none focus:border-orange-500 transition-all"
              onChange={(e) => setFormData({ ...formData, tradition: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Cultural Tags */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
            Cultural Tags (Tags help in search)
          </label>
          <textarea
            placeholder="traditional, handmade, silk, vintage (comma separated)"
            className="w-full bg-white dark:bg-[#111] border border-ui p-5 rounded-2xl text-[11px] font-bold outline-none focus:border-orange-500 h-28 resize-none transition-all"
            onChange={(e) => setFormData({ ...formData, culturalTags: e.target.value })}
          />
        </div>

        {/* 🚀 Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-6 rounded-3xl font-black text-[11px] tracking-[0.3em] uppercase hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-black/5"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            'Confirm & Publish Listing'
          )}
        </button>
      </form>
    </div>
  );
}
