'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  FiUploadCloud,
  FiX,
  FiArrowRight,
  FiTag,
  FiGrid,
  FiLoader,
  FiSearch,
  FiChevronDown,
  FiCheck,
  FiMapPin,
  FiGlobe,
  FiLink,
  FiPlus,
} from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function AddListing() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    externalUrls: [''], // 🔹 Changed to array for multiple links
    region: '',
    country: '',
    tradition: '',
    category: '',
    culturalTags: [],
  });

  const [metaData, setMetaData] = useState({ categories: [], tags: [] });
  const [metaLoading, setMetaLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dropdown States
  const [showCatDrop, setShowCatDrop] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [showTagDrop, setShowTagDrop] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await api.get('/api/listings/meta-data');
        setMetaData(res.data);
      } catch (err) {
        console.error('Meta-data load failed');
      } finally {
        setMetaLoading(false);
      }
    };
    fetchMeta();
  }, []);

  // 🔹 Dynamic URL Handlers
  const handleUrlChange = (index, value) => {
    const newUrls = [...formData.externalUrls];
    newUrls[index] = value;
    setFormData({ ...formData, externalUrls: newUrls });
  };

  const addUrlField = () => {
    setFormData({ ...formData, externalUrls: [...formData.externalUrls, ''] });
  };

  const removeUrlField = (index) => {
    const newUrls = formData.externalUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, externalUrls: newUrls });
  };

  const filteredCats = metaData.categories.filter((c) =>
    c.title.toLowerCase().includes(catSearch.toLowerCase())
  );
  const filteredTags = metaData.tags.filter((t) =>
    t.title.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const isSelected = prev.culturalTags.includes(tagId);
      if (isSelected)
        return { ...prev, culturalTags: prev.culturalTags.filter((id) => id !== tagId) };
      if (prev.culturalTags.length >= 5) {
        alert('Maximum 5 tags allowed');
        return prev;
      }
      return { ...prev, culturalTags: [...prev.culturalTags, tagId] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !formData.category) return alert('Image and Category are required');
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'culturalTags') {
          formData[key].forEach((tag) => data.append('culturalTags', tag));
        } else if (key === 'externalUrls') {
          // 🔹 Sending multiple URLs
          formData[key].forEach((url) => {
            if (url.trim()) data.append('externalUrls', url);
          });
        } else {
          data.append(key, formData[key]);
        }
      });
      data.append('image', image);
      await api.post('/api/listings/add', data);
      router.push('/creator/listings');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating listing');
    } finally {
      setLoading(false);
    }
  };

  if (metaLoading)
    return (
      <div className="flex justify-center p-20">
        <FiLoader className="animate-spin text-orange-500" size={30} />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="mb-8 border-b border-gray-100 dark:border-white/10 pb-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#1f1f1f] dark:text-white">
          Add <span className="text-orange-500">Listing</span>
        </h2>
        <p className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">
          Submit to the cultural archive
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Image Upload */}
          <div className="lg:col-span-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">
              Media
            </label>
            <div className="relative md:h-86 w-full max-md:aspect-video bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-sm group">
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
                      className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-lg hover:bg-red-500 z-20"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <FiUploadCloud size={24} className="text-orange-500 mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300">
                    Upload Image
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

          {/* Right: Primary Details */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Listing Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 dark:text-white"
                placeholder="Descriptive name..."
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1">
                <FiGrid size={10} /> Category
              </label>
              <div
                onClick={() => setShowCatDrop(!showCatDrop)}
                className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold dark:text-white flex justify-between items-center cursor-pointer hover:border-orange-500/50"
              >
                {formData.category
                  ? metaData.categories.find((c) => c._id === formData.category)?.title
                  : 'Select Category'}
                <FiChevronDown
                  className={`${showCatDrop ? 'rotate-180' : ''} transition-transform`}
                />
              </div>
              {showCatDrop && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-2 border-b dark:border-white/10 flex items-center gap-2 bg-gray-50 dark:bg-white/5">
                    <FiSearch className="text-gray-400" size={12} />
                    <input
                      autoFocus
                      placeholder="Search..."
                      className="w-full bg-transparent text-[10px] font-bold outline-none dark:text-white"
                      onChange={(e) => setCatSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {filteredCats.map((cat) => (
                      <div
                        key={cat._id}
                        onClick={() => {
                          setFormData({ ...formData, category: cat._id });
                          setShowCatDrop(false);
                        }}
                        className="p-3 text-[10px] font-bold uppercase hover:bg-orange-500 hover:text-white cursor-pointer transition-colors dark:text-gray-300 border-b last:border-0 dark:border-white/5"
                      >
                        {cat.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1">
                <FiGlobe size={10} /> Region
              </label>
              <input
                type="text"
                required
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 dark:text-white"
                placeholder="e.g. South Asia"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Story & Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 h-39 resize-none dark:text-white placeholder:text-gray-400"
                placeholder="Tell the cultural story..."
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: Tradition, Tags, and URL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 bg-gray-50/50 dark:bg-white/10 border border-gray-100 dark:border-white/10 rounded-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Tradition & Country
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                required
                value={formData.tradition}
                onChange={(e) => setFormData({ ...formData, tradition: e.target.value })}
                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-xl text-xs font-bold dark:text-white outline-none focus:border-orange-500"
                placeholder="Tradition (e.g. Jamdani)"
              />
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-xl text-xs font-bold dark:text-white outline-none focus:border-orange-500"
                placeholder="Country (e.g. Bangladesh)"
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1">
              <FiTag size={10} /> Select Tags
            </label>
            <div
              onClick={() => setShowTagDrop(!showTagDrop)}
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-xl text-[10px] font-bold dark:text-white flex flex-wrap gap-1 min-h-23 cursor-pointer align-top"
            >
              {formData.culturalTags.length === 0 && (
                <span className="text-gray-400">Add up to 5 tags...</span>
              )}
              {formData.culturalTags.map((tId) => (
                <span
                  key={tId}
                  className="bg-orange-500 text-white px-2 py-1 h-fit rounded-md flex items-center gap-1 animate-in zoom-in-95"
                >
                  {metaData.tags.find((t) => t._id === tId)?.title}
                  <FiX
                    size={10}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTagToggle(tId);
                    }}
                  />
                </span>
              ))}
            </div>
            {showTagDrop && (
              <div className="absolute bottom-full mb-2 z-50 w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2">
                <div className="p-2 border-b dark:border-white/10 flex items-center gap-2 bg-gray-50 dark:bg-white/5">
                  <FiSearch className="text-gray-400" size={12} />
                  <input
                    autoFocus
                    placeholder="Search tags..."
                    className="w-full bg-transparent text-[10px] font-bold outline-none dark:text-white"
                    onChange={(e) => setTagSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-40 overflow-y-auto grid grid-cols-1 p-1 gap-1">
                  {filteredTags.map((tag) => (
                    <div
                      key={tag._id}
                      onClick={() => handleTagToggle(tag._id)}
                      className={`p-2 rounded-lg text-[9px] font-black uppercase cursor-pointer flex justify-between items-center ${formData.culturalTags.includes(tag._id) ? 'bg-orange-500 text-white' : 'dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                    >
                      {tag.title} {formData.culturalTags.includes(tag._id) && <FiCheck />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                <FiLink size={10} /> Sources
              </label>
              <button
                type="button"
                onClick={addUrlField}
                className="text-orange-500 hover:text-orange-600 transition-colors"
              >
                <FiPlus size={14} />
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {formData.externalUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 pr-8 rounded-xl text-[10px] font-bold dark:text-white outline-none focus:border-orange-500"
                    placeholder="https://..."
                  />
                  {formData.externalUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrlField(index)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <FiX size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full h-16 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-[11px] tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
        >
          {loading ? (
            <FiLoader className="animate-spin" />
          ) : (
            <>
              Confirm Publication <FiArrowRight />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
