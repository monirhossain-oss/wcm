'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  FiUploadCloud,
  FiX,
  FiType,
  FiPlus,
  FiMessageSquare,
  FiTrash2,
  FiLoader,
  FiGrid,
  FiChevronRight,
  FiSearch,
  FiChevronDown,
  FiCheck,
  FiTag,
  FiEdit3,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function CreateBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoryTags, setCategoryTags] = useState([]);
  const [showCatDrop, setShowCatDrop] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [showTagDrop, setShowTagDrop] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    selectedTags: [],
    content: [{ type: 'paragraph', text: '' }],
  });

  const [gridFiles, setGridFiles] = useState({});

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/admin/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Categories load failed');
      } finally {
        setMetaLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Tags when Category changes
  useEffect(() => {
    if (!formData.category) {
      setCategoryTags([]);
      return;
    }
    const fetchTagsByCategory = async () => {
      try {
        const res = await api.get(`/api/listings/tags/by-category/${formData.category}`);
        setCategoryTags(res.data);
        setFormData((prev) => ({ ...prev, selectedTags: [] }));
      } catch (err) {
        console.error('Tags load failed');
      }
    };
    fetchTagsByCategory();
  }, [formData.category]);

  const filteredCats = categories.filter((c) =>
    c.title.toLowerCase().includes(catSearch.toLowerCase())
  );
  const filteredTags = categoryTags.filter((t) =>
    t.title.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const isSelected = prev.selectedTags.includes(tagId);
      if (isSelected) {
        return { ...prev, selectedTags: prev.selectedTags.filter((id) => id !== tagId) };
      }
      if (prev.selectedTags.length >= 5) {
        toast.error('Maximum 5 tags allowed');
        return prev;
      }
      return { ...prev, selectedTags: [...prev.selectedTags, tagId] };
    });
  };

  const addBlock = (type) => {
    const newBlock = type === 'image_grid' ? { type, images: [] } : { type, text: '' };
    setFormData({ ...formData, content: [...formData.content, newBlock] });
  };

  const removeBlock = (index) => {
    const newContent = formData.content.filter((_, i) => i !== index);
    setFormData({ ...formData, content: newContent });
    const newGridFiles = { ...gridFiles };
    delete newGridFiles[index];
    setGridFiles(newGridFiles);
  };

  const handleGridImageChange = (blockIdx, file) => {
    if (!file) return;
    const currentFiles = gridFiles[blockIdx] || [];
    if (currentFiles.length >= 4) return toast.error('Max 4 images per grid');
    setGridFiles({ ...gridFiles, [blockIdx]: [...currentFiles, file] });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!mainImage) return toast.error('Main Banner is required');
    if (!formData.category) return toast.error('Category is required');
    if (!formData.title) return toast.error('Title is required');

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      const catTitle = categories.find((c) => c._id === formData.category)?.title || '';
      data.append('category', catTitle);
      data.append('description', formData.description);
      data.append('image', mainImage);

      const tagTitles = formData.selectedTags.map(
        (tId) => categoryTags.find((t) => t._id === tId)?.title
      );
      data.append('tags', tagTitles.join(','));

      // Append grid images with proper indexing
      Object.keys(gridFiles).forEach((blockIdx) => {
        gridFiles[blockIdx].forEach((file) => {
          data.append(`gridImages_${blockIdx}`, file);
        });
      });

      data.append('content', JSON.stringify(formData.content));

      const res = await api.post('/api/blogs', data);

      if (res.data.success) {
        toast.success('Journal Published Successfully!');
        router.push('/admin/blogs');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error publishing journal');
    } finally {
      setLoading(false);
    }
  };

  if (metaLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <FiLoader className="animate-spin text-orange-500" size={32} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto bg-white dark:bg-transparent min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b dark:border-white/10">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">
            Create <span className="text-orange-500">Journal</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Editorial Dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 text-xs font-bold uppercase border dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-md font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-500/20"
          >
            {loading ? (
              <FiLoader className="animate-spin" />
            ) : (
              <>
                <FiEdit3 /> Publish Now
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Sidebar Meta */}
        <div className="lg:col-span-4 space-y-8">
          <section className="space-y-3">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
              Main Banner
            </label>
            <div className="relative group aspect-16/10 bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg overflow-hidden hover:border-orange-500/50 transition-all">
              {mainImage ? (
                <>
                  <img
                    src={URL.createObjectURL(mainImage)}
                    className="w-full h-full object-cover"
                    alt="Banner"
                  />
                  <button
                    type="button"
                    onClick={() => setMainImage(null)}
                    className="absolute top-4 right-4 p-2 bg-black/70 text-white rounded-full hover:bg-red-500 transition-all"
                  >
                    <FiX size={16} />
                  </button>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 cursor-pointer">
                  <FiUploadCloud size={40} className="text-orange-500 mb-3 opacity-40" />
                  <p className="text-[10px] font-bold uppercase text-gray-400 text-center">
                    Upload High-Res Banner
                  </p>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setMainImage(e.target.files[0])}
                  />
                </div>
              )}
            </div>
          </section>

          <section className="bg-gray-50 dark:bg-white/5 p-6 rounded-lg space-y-6 border border-gray-100 dark:border-white/5">
            {/* Category Select */}
            <div className="space-y-2 relative">
              <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                Category
              </label>
              <div
                onClick={() => setShowCatDrop(!showCatDrop)}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border dark:border-white/10 rounded-lg text-xs font-bold cursor-pointer"
              >
                {formData.category
                  ? categories.find((c) => c._id === formData.category)?.title
                  : 'Select Category'}
                <FiChevronDown
                  className={`transition-transform ${showCatDrop ? 'rotate-180' : ''}`}
                />
              </div>
              {showCatDrop && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border dark:border-white/10 rounded-lg shadow-2xl overflow-hidden">
                  <div className="p-2 border-b dark:border-white/10 flex items-center gap-2 bg-gray-50 dark:bg-white/5">
                    <FiSearch className="text-gray-400" size={14} />
                    <input
                      placeholder="Search..."
                      className="w-full bg-transparent p-2 text-xs font-bold outline-none"
                      onChange={(e) => setCatSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {filteredCats.map((cat) => (
                      <div
                        key={cat._id}
                        onClick={() => {
                          setFormData({ ...formData, category: cat._id });
                          setShowCatDrop(false);
                        }}
                        className="p-4 text-xs font-bold uppercase hover:bg-orange-500 hover:text-white cursor-pointer border-b last:border-0 dark:border-white/5"
                      >
                        {cat.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tags Select */}
            <div className="space-y-2 relative">
              <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                Tags (Max 5)
              </label>
              <div
                onClick={() => formData.category && setShowTagDrop(!showTagDrop)}
                className={`flex flex-wrap gap-2 p-4 min-h-[56px] bg-white dark:bg-zinc-900 border dark:border-white/10 rounded-lg text-xs font-bold cursor-pointer ${!formData.category && 'opacity-50 grayscale cursor-not-allowed'}`}
              >
                {formData.selectedTags.length === 0 && (
                  <span className="text-gray-400 italic">Select category first...</span>
                )}
                {formData.selectedTags.map((tId) => (
                  <span
                    key={tId}
                    className="bg-orange-500 text-white pl-3 pr-2 py-1.5 rounded-md flex items-center gap-2 text-[10px]"
                  >
                    {categoryTags.find((t) => t._id === tId)?.title}
                    <FiX
                      className="hover:scale-125 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTagToggle(tId);
                      }}
                    />
                  </span>
                ))}
              </div>
              {showTagDrop && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border dark:border-white/10 rounded-lg shadow-2xl overflow-hidden">
                  <div className="p-2 border-b dark:border-white/10 flex items-center gap-2 bg-gray-50 dark:bg-white/5">
                    <FiSearch className="text-gray-400" size={14} />
                    <input
                      autoFocus
                      placeholder="Search tags..."
                      className="w-full bg-transparent p-2 text-xs font-bold outline-none"
                      onChange={(e) => setTagSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto p-2">
                    {filteredTags.map((tag) => (
                      <div
                        key={tag._id}
                        onClick={() => handleTagToggle(tag._id)}
                        className={`p-3 rounded-md text-[11px] font-bold uppercase cursor-pointer flex justify-between items-center mb-1 ${formData.selectedTags.includes(tag._id) ? 'bg-orange-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
                      >
                        {tag.title} {formData.selectedTags.includes(tag._id) && <FiCheck />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: Content Builder */}
        <div className="lg:col-span-8 space-y-8">
          <section className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                Journal Title
              </label>
              <input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Write a compelling headline..."
                className="w-full bg-transparent border-b-2 dark:border-white/10 py-4 text-3xl font-black outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                Summary
              </label>
              <textarea
                required
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A short intro for the preview card..."
                className="w-full bg-gray-50 dark:bg-white/5 border dark:border-white/10 p-5 rounded-lg text-sm font-medium outline-none focus:border-orange-500 resize-none"
              />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase text-orange-500 tracking-widest flex items-center gap-2">
                <span className="w-8 h-[2px] bg-orange-500"></span> Body Builder
              </h3>
              <div className="flex flex-wrap gap-2">
                <ToolBtn icon={<FiPlus />} label="Heading" onClick={() => addBlock('heading')} />
                <ToolBtn icon={<FiType />} label="Text" onClick={() => addBlock('paragraph')} />
                <ToolBtn icon={<FiGrid />} label="Grid" onClick={() => addBlock('image_grid')} />
                <ToolBtn
                  icon={<FiMessageSquare />}
                  label="Quote"
                  onClick={() => addBlock('quote')}
                />
              </div>
            </div>

            <div className="space-y-5">
              {formData.content.map((block, idx) => (
                <div
                  key={idx}
                  className="group relative bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-lg"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-[10px] font-black text-gray-300 mt-1 uppercase tracking-tighter">
                      #0{idx + 1}
                    </span>
                    <div className="flex-1">
                      {block.type === 'image_grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {(gridFiles[idx] || []).map((file, fIdx) => (
                            <div
                              key={fIdx}
                              className="aspect-square rounded-lg overflow-hidden border dark:border-white/10"
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {(gridFiles[idx] || []).length < 4 && (
                            <label className="aspect-square border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-500 text-gray-400 hover:text-orange-500 transition-all">
                              <FiPlus size={24} />
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleGridImageChange(idx, e.target.files[0])}
                              />
                            </label>
                          )}
                        </div>
                      ) : (
                        <textarea
                          autoFocus
                          value={block.text}
                          onChange={(e) => {
                            const newContent = [...formData.content];
                            newContent[idx].text = e.target.value;
                            setFormData({ ...formData, content: newContent });
                          }}
                          placeholder={
                            block.type === 'heading'
                              ? 'Section Heading...'
                              : `Enter ${block.type} content...`
                          }
                          className={`w-full bg-transparent outline-none border-none p-0 resize-none ${
                            block.type === 'heading'
                              ? 'text-xl font-black'
                              : block.type === 'quote'
                                ? 'italic border-l-4 border-orange-500 pl-5 text-lg font-bold'
                                : 'text-sm font-medium leading-relaxed'
                          }`}
                          rows={block.type === 'paragraph' ? 3 : 1}
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBlock(idx)}
                      className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ToolBtn({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm hover:border-orange-500 hover:text-orange-500 transition-all active:scale-95"
    >
      {icon} {label}
    </button>
  );
}
