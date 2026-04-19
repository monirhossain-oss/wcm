'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropImage';
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
  FiLink,
  FiPlus,
  FiScissors,
} from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function AddListing() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    externalUrls: [''],
    websiteLink: '',
    region: '',
    country: '',
    tradition: '',
    category: '',
    culturalTags: [],
  });

  const [categories, setCategories] = useState([]);
  const [categoryTags, setCategoryTags] = useState([]);
  const [regions, setRegions] = useState([]);
  const [traditions, setTraditions] = useState([]);

  const [metaLoading, setMetaLoading] = useState(true);
  const [assetsLoading, setAssetsLoading] = useState(false);

  // ── Image & Crop ──────────────────────────────────────────────────────────
  const [previewUrl, setPreviewUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [finalCroppedImage, setFinalCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showCatDrop, setShowCatDrop] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [showTagDrop, setShowTagDrop] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  const router = useRouter();

  // ── Image handlers ────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setPreviewUrl(reader.result);
        setShowCropper(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((_, trimmedAreaPixels) => {
    setCroppedAreaPixels(trimmedAreaPixels);
  }, []);

  const handleConfirmCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
      setFinalCroppedImage(croppedBlob);
      setShowCropper(false);
    } catch (e) {
      console.error('Crop error:', e);
    }
  };

  // ── 1. Initial category load ───────────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/admin/categories');
        setCategories(res.data);
      } catch {
        console.error('Categories load failed');
      } finally {
        setMetaLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ── 2. Load assets when category changes ──────────────────────────────────
  useEffect(() => {
    if (!formData.category) {
      setCategoryTags([]);
      setRegions([]);
      setTraditions([]);
      return;
    }

    const fetchCategoryAssets = async () => {
      setAssetsLoading(true);
      try {
        const res = await api.get(`/api/admin/category-assets/${formData.category}`);
        if (res.data.success) {
          setCategoryTags(res.data.tags);
          setRegions(res.data.regions);
          setTraditions(res.data.traditions);
          setFormData((prev) => ({ ...prev, culturalTags: [], region: '', tradition: '' }));
        }
      } catch {
        console.error('Assets load failed');
      } finally {
        setAssetsLoading(false);
      }
    };
    fetchCategoryAssets();
  }, [formData.category]);

  // ── URL field helpers ─────────────────────────────────────────────────────
  const handleUrlChange = (index, value) => {
    const newUrls = [...formData.externalUrls];
    newUrls[index] = value;
    setFormData({ ...formData, externalUrls: newUrls });
  };

  const addUrlField = () =>
    setFormData({ ...formData, externalUrls: [...formData.externalUrls, ''] });

  const removeUrlField = (index) =>
    setFormData({ ...formData, externalUrls: formData.externalUrls.filter((_, i) => i !== index) });

  // ── Filtered lists ────────────────────────────────────────────────────────
  const filteredCats = categories.filter((c) =>
    c.title.toLowerCase().includes(catSearch.toLowerCase())
  );
  const filteredTags = categoryTags.filter((t) =>
    t.title.toLowerCase().includes(tagSearch.toLowerCase())
  );

  // ── Tag toggle ────────────────────────────────────────────────────────────
  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      if (prev.culturalTags.includes(tagId)) {
        return { ...prev, culturalTags: prev.culturalTags.filter((id) => id !== tagId) };
      }
      if (prev.culturalTags.length >= 10) {
        alert('Maximum 10 tags allowed');
        return prev;
      }
      return { ...prev, culturalTags: [...prev.culturalTags, tagId] };
    });
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!finalCroppedImage || !formData.category)
      return alert('Please upload/crop image and select category');

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'culturalTags') {
          formData[key].forEach((tag) => data.append('culturalTags', tag));
        } else if (key === 'externalUrls') {
          formData[key].forEach((url) => { if (url.trim()) data.append('externalUrls', url); });
        } else {
          data.append(key, formData[key]);
        }
      });
      data.append('image', finalCroppedImage, 'listing-image.jpg');

      const response = await api.post('/api/listings/add', data);

      if (response.data.success || response.status === 201 || response.status === 200) {
        setTimeout(() => { router.push('/creator/listings'); router.refresh(); }, 100);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error creating listing');
    } finally {
      setLoading(false);
    }
  };

  // ── Early return: loading ─────────────────────────────────────────────────
  if (metaLoading) {
    return (
      <div className="flex justify-center p-20">
        <FiLoader className="animate-spin text-orange-500" size={30} />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto py-4 pb-20 font-sans px-4 md:px-0">

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

          {/* ── Left: Image Upload & Crop ── */}
          <div className="lg:col-span-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">
              Cover Media (Aspect 4:5 Ratio)
            </label>

            <div className="relative aspect-[4/5] w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-sm group">

              {showCropper ? (
                <div className="absolute inset-0 z-40 bg-black">
                  <Cropper
                    image={previewUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 5}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                  <div className="absolute bottom-6 left-0 w-full flex justify-center gap-3 z-50 px-4">
                    <button
                      type="button"
                      onClick={handleConfirmCrop}
                      className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-2xl active:scale-95 transition-transform"
                    >
                      <FiCheck size={14} /> Set Area
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowCropper(false); setPreviewUrl(null); }}
                      className="bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase active:scale-95 transition-transform"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

              ) : finalCroppedImage ? (
                <div className="relative w-full h-full p-2">
                  <img
                    src={URL.createObjectURL(finalCroppedImage)}
                    className="w-full h-full object-cover rounded-xl"
                    alt="final-crop"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCropper(true)}
                      className="p-2 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 transition-colors"
                    >
                      <FiScissors size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => { setFinalCroppedImage(null); setPreviewUrl(null); }}
                      className="p-2 bg-black/60 text-white rounded-lg hover:bg-red-500 backdrop-blur-md transition-colors"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                </div>

              ) : (
                <div className="text-center p-6 space-y-2 relative w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <FiUploadCloud size={32} className="text-orange-500 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300">Click to Upload</p>
                    <p className="text-[8px] font-medium text-gray-400 uppercase tracking-tighter">Image will be cropped to 4:5 ratio</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                </div>
              )}
            </div>
            <p className="text-[9px] text-gray-400 mt-2 ml-1 italic font-medium">
              * Focus on the most important part of your image.
            </p>
          </div>

          {/* ── Right: Primary Details ── */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Listing Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-lg text-xs font-bold outline-none focus:border-orange-500 dark:text-white"
                placeholder="Descriptive name..."
              />
            </div>

            {/* Website Link */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Website Link</label>
              <input
                type="text"
                required
                value={formData.websiteLink}
                onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-lg text-xs font-bold outline-none focus:border-orange-500 dark:text-white"
                placeholder="https://example.com"
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2 relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1">
                <FiGrid size={10} /> Category
              </label>
              <div
                onClick={() => setShowCatDrop(!showCatDrop)}
                className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-lg text-xs font-bold dark:text-white flex justify-between items-center cursor-pointer hover:border-orange-500/50"
              >
                {formData.category
                  ? categories.find((c) => c._id === formData.category)?.title
                  : 'Select Category'}
                <FiChevronDown className={`${showCatDrop ? 'rotate-180' : ''} transition-transform`} />
              </div>
              {showCatDrop && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg shadow-2xl overflow-hidden">
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
                        onClick={() => { setFormData({ ...formData, category: cat._id }); setShowCatDrop(false); }}
                        className="p-3 text-[10px] font-bold uppercase hover:bg-orange-500 hover:text-white cursor-pointer transition-colors dark:text-gray-300 border-b last:border-0 dark:border-white/5"
                      >
                        {cat.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Region Dropdown */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1">
                <FiMapPin size={10} /> Region
              </label>
              <select
                required
                disabled={!formData.category || assetsLoading}
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value, country: e.target.value })}
                className={`w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-lg text-xs font-bold outline-none focus:border-orange-500 dark:text-white ${!formData.category && 'opacity-50 cursor-not-allowed'}`}
              >
                <option value="">{assetsLoading ? 'Loading...' : 'Select Region'}</option>
                {regions.map((r) => (
                  <option key={r._id} value={r.title} className="bg-white dark:bg-[#1f1f1f]">
                    {r.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Story & Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-lg text-xs font-bold outline-none focus:border-orange-500 h-32 resize-none dark:text-white placeholder:text-gray-400"
                placeholder="Tell the cultural story..."
              />
            </div>
          </div>
        </div>

        {/* ── Tags, Tradition & Sources ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 bg-gray-50/50 dark:bg-white/10 border border-gray-100 dark:border-white/10 rounded-lg">

          {/* Tradition */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tradition</label>
            <select
              required
              disabled={!formData.category || assetsLoading}
              value={formData.tradition}
              onChange={(e) => setFormData({ ...formData, tradition: e.target.value })}
              className={`w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-lg text-xs font-bold dark:text-white outline-none focus:border-orange-500 ${!formData.category && 'opacity-50 cursor-not-allowed'}`}
            >
              <option value="">{assetsLoading ? 'Loading...' : 'Select Tradition'}</option>
              {traditions.map((t) => (
                <option key={t._id} value={t.title} className="bg-white dark:bg-[#1f1f1f]">
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1">
              <FiTag size={10} />
              {formData.category
                ? `Tags for ${categories.find((c) => c._id === formData.category)?.title}`
                : 'Select Category first'}
            </label>
            <div
              onClick={() => formData.category && setShowTagDrop(!showTagDrop)}
              className={`w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-lg text-[10px] font-bold dark:text-white flex flex-wrap gap-1 min-h-[44px] cursor-pointer ${!formData.category && 'opacity-50 cursor-not-allowed'}`}
            >
              {formData.culturalTags.length === 0 && (
                <span className="text-gray-400">Select up to 10 tags...</span>
              )}
              {formData.culturalTags.map((tId) => (
                <span key={tId} className="bg-orange-500 text-white px-2 py-1 h-fit rounded-lg flex items-center gap-1">
                  {categoryTags.find((t) => t._id === tId)?.title}
                  <FiX size={10} onClick={(e) => { e.stopPropagation(); handleTagToggle(tId); }} />
                </span>
              ))}
              {assetsLoading && <FiLoader className="animate-spin ml-auto" />}
            </div>
            {showTagDrop && (
              <div className="absolute bottom-full mb-2 z-50 w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2">
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
                  {filteredTags.length === 0 ? (
                    <div className="p-3 text-[9px] text-center text-gray-500 uppercase">No tags found</div>
                  ) : (
                    filteredTags.map((tag) => (
                      <div
                        key={tag._id}
                        onClick={() => handleTagToggle(tag._id)}
                        className={`p-2 rounded-lg text-[9px] font-black uppercase cursor-pointer flex justify-between items-center ${formData.culturalTags.includes(tag._id)
                            ? 'bg-orange-500 text-white'
                            : 'dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                          }`}
                      >
                        {tag.title}
                        {formData.culturalTags.includes(tag._id) && <FiCheck />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sources */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                <FiLink size={10} /> Sources
              </label>
              <button type="button" onClick={addUrlField} className="text-orange-500 hover:text-orange-600">
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
                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 pr-8 rounded-lg text-[10px] font-bold dark:text-white outline-none focus:border-orange-500"
                    placeholder="https://example.com"
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

        {/* ── Submit ── */}
        <button
          disabled={loading}
          className="w-full h-16 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-black text-[11px] tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
        >
          {loading ? <FiLoader className="animate-spin" /> : <>Confirm Publication <FiArrowRight /></>}
        </button>
      </form>
    </div>
  );
}