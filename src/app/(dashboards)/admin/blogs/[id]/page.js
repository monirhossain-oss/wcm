'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import {
  FiUploadCloud,
  FiX,
  FiType,
  FiPlus,
  FiMessageSquare,
  FiTrash2,
  FiLoader,
  FiGrid,
  FiChevronDown,
  FiCheck,
  FiSearch,
  FiEdit3,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

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
    content: [],
  });
  const [gridFiles, setGridFiles] = useState({});

  // ১. আগের ডাটা লোড করা
  useEffect(() => {
    const loadBlogData = async () => {
      try {
        const [catRes, blogRes] = await Promise.all([
          api.get('/api/admin/categories'),
          api.get(`/api/blogs/${id}`),
        ]);

        setCategories(catRes.data);
        const blog = blogRes.data.blog;

        // বর্তমান ক্যাটাগরির আইডি খুঁজে বের করা
        const currentCat = catRes.data.find((c) => c.title === blog.category);

        setFormData({
          title: blog.title,
          description: blog.description,
          category: currentCat?._id || '',
          content: blog.content,
          selectedTags: [], // ট্যাগগুলো পরে সেট হবে
        });
        setPreviewImage(blog.image);

        // যদি ব্লগে আগে থেকে ট্যাগ থাকে, সেগুলো ক্যাটাগরি লোডের পর হ্যান্ডেল হবে
        if (currentCat) {
          const tagsRes = await api.get(`/api/listings/tags/by-category/${currentCat._id}`);
          setCategoryTags(tagsRes.data);
          const matchedTagIds = tagsRes.data
            .filter((t) => blog.tags.includes(t.title))
            .map((t) => t._id);
          setFormData((prev) => ({ ...prev, selectedTags: matchedTagIds }));
        }
      } catch (err) {
        toast.error('Failed to load journal data');
      } finally {
        setFetching(false);
      }
    };
    loadBlogData();
  }, [id]);

  // ক্যাটাগরি ম্যানুয়ালি চেঞ্জ করলে ট্যাগ আপডেট
  useEffect(() => {
    if (!formData.category || fetching) return;
    const fetchTags = async () => {
      try {
        const res = await api.get(`/api/listings/tags/by-category/${formData.category}`);
        setCategoryTags(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTags();
  }, [formData.category]);

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
    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', categories.find((c) => c._id === formData.category)?.title);

      if (mainImage) data.append('image', mainImage);

      const tagTitles = formData.selectedTags.map(
        (tId) => categoryTags.find((t) => t._id === tId)?.title
      );
      data.append('tags', tagTitles.join(','));

      Object.keys(gridFiles).forEach((idx) => {
        gridFiles[idx].forEach((file) => data.append(`gridImages_${idx}`, file));
      });

      data.append('content', JSON.stringify(formData.content));

      await api.put(`/api/blogs/${id}`, data);
      toast.success('Journal Updated Successfully!');
      router.push('/admin/blogs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <FiLoader className="animate-spin text-orange-500" size={32} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b dark:border-white/10">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">
            Update <span className="text-orange-500">Journal</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 text-xs font-bold uppercase border dark:border-white/10 rounded-md hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 bg-orange-600 text-white rounded-md font-bold text-xs uppercase flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            {loading ? (
              <FiLoader className="animate-spin" />
            ) : (
              <>
                <FiEdit3 /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <section className="space-y-3">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
              Main Banner
            </label>
            <div className="relative group aspect-16/10 bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg overflow-hidden hover:border-orange-500 transition-all">
              <img
                src={mainImage ? URL.createObjectURL(mainImage) : previewImage}
                className="w-full h-full object-cover"
                alt="Banner"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center pointer-events-none">
                <FiUploadCloud size={30} className="text-white" />
              </div>
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setMainImage(e.target.files[0])}
              />
            </div>
          </section>

          <section className="bg-gray-50 dark:bg-white/5 p-6 rounded-lg space-y-6 border dark:border-white/5">
            {/* Category */}
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
                  : 'Select One'}
                <FiChevronDown className={showCatDrop ? 'rotate-180' : ''} />
              </div>
              {showCatDrop && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border dark:border-white/10 rounded-lg shadow-2xl">
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      onClick={() => {
                        setFormData({ ...formData, category: cat._id });
                        setShowCatDrop(false);
                      }}
                      className="p-4 text-xs font-bold uppercase hover:bg-orange-500 hover:text-white cursor-pointer transition-colors"
                    >
                      {cat.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags Section */}
            <div className="space-y-2 relative">
              {' '}
              {/* added relative here */}
              <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                Tags (Max 5)
              </label>
              <div
                onClick={() => formData.category && setShowTagDrop(!showTagDrop)}
                className={`flex flex-wrap gap-2 p-4 min-h-[56px] bg-white dark:bg-zinc-900 border dark:border-white/10 rounded-lg text-xs font-bold cursor-pointer transition-all ${!formData.category && 'opacity-50 grayscale cursor-not-allowed'}`}
              >
                {formData.selectedTags.length === 0 && (
                  <span className="text-gray-400">Select tags...</span>
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
                        setFormData((prev) => ({
                          ...prev,
                          selectedTags: prev.selectedTags.filter((id) => id !== tId),
                        }));
                      }}
                    />
                  </span>
                ))}
              </div>
              {/* Dropdown Fix */}
              {showTagDrop && (
                <div className="absolute z-[100] w-full mt-2 bg-white dark:bg-zinc-900 border dark:border-white/10 rounded-lg shadow-2xl overflow-hidden ring-1 ring-black/5">
                  <div className="p-2 border-b dark:border-white/10 flex items-center gap-2 bg-gray-50 dark:bg-white/5">
                    <FiSearch className="text-gray-400" size={14} />
                    <input
                      autoFocus
                      placeholder="Search tags..."
                      className="w-full bg-transparent p-2 text-xs font-bold outline-none"
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                    />
                    <FiX
                      className="cursor-pointer text-gray-400"
                      onClick={() => setShowTagDrop(false)}
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto p-2 grid grid-cols-1 gap-1">
                    {categoryTags
                      .filter((t) => t.title.toLowerCase().includes(tagSearch.toLowerCase()))
                      .map((tag) => (
                        <div
                          key={tag._id}
                          onClick={() => {
                            if (formData.selectedTags.includes(tag._id)) {
                              setFormData((p) => ({
                                ...p,
                                selectedTags: p.selectedTags.filter((id) => id !== tag._id),
                              }));
                            } else if (formData.selectedTags.length < 5) {
                              setFormData((p) => ({
                                ...p,
                                selectedTags: [...p.selectedTags, tag._id],
                              }));
                            }
                          }}
                          className={`p-3 rounded-md text-[11px] font-bold uppercase cursor-pointer flex justify-between items-center transition-all ${formData.selectedTags.includes(tag._id) ? 'bg-orange-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
                        >
                          {tag.title}
                          {formData.selectedTags.includes(tag._id) && <FiCheck />}
                        </div>
                      ))}
                    {categoryTags.length === 0 && (
                      <div className="p-4 text-[10px] text-center text-gray-400 uppercase font-bold">
                        No tags found for this category
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: Content */}
        <div className="lg:col-span-8 space-y-8">
          <section className="space-y-6">
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Headline..."
              className="w-full bg-transparent border-b-2 dark:border-white/10 py-4 text-3xl font-black outline-none focus:border-orange-500"
            />
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short Summary..."
              className="w-full bg-gray-50 dark:bg-white/5 border dark:border-white/10 p-5 rounded-lg text-sm font-medium outline-none focus:border-orange-500"
            />
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase text-orange-500 tracking-widest flex items-center gap-2">
                <span className="w-8 h-[2px] bg-orange-500"></span> Content Builder
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

            <div className="space-y-4">
              {formData.content.map((block, idx) => (
                <div
                  key={idx}
                  className="group relative bg-gray-50 dark:bg-white/5 border dark:border-white/5 p-6 rounded-lg"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-[10px] font-black text-gray-300 mt-1 uppercase">
                      #0{idx + 1}
                    </span>
                    <div className="flex-1">
                      {block.type === 'image_grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {/* Existing Images */}
                          {block.images?.map((img, i) => (
                            <div
                              key={i}
                              className="relative aspect-square rounded-lg overflow-hidden group/img"
                            >
                              <img src={img} className="w-full h-full object-cover" />
                              <button
                                onClick={() => {
                                  const newContent = [...formData.content];
                                  newContent[idx].images = newContent[idx].images.filter(
                                    (_, imgIdx) => imgIdx !== i
                                  );
                                  setFormData({ ...formData, content: newContent });
                                }}
                                className="absolute inset-0 bg-red-500/80 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center text-white"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          ))}
                          {/* New Files to Upload */}
                          {(gridFiles[idx] || []).map((file, fIdx) => (
                            <div
                              key={fIdx}
                              className="aspect-square rounded-lg overflow-hidden border-2 border-orange-500"
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {(block.images?.length || 0) + (gridFiles[idx]?.length || 0) < 4 && (
                            <label className="aspect-square border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-500 text-gray-400">
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
                          value={block.text}
                          onChange={(e) => {
                            const newContent = [...formData.content];
                            newContent[idx].text = e.target.value;
                            setFormData({ ...formData, content: newContent });
                          }}
                          className={`w-full bg-transparent outline-none border-none p-0 resize-none ${
                            block.type === 'heading'
                              ? 'text-xl font-black'
                              : block.type === 'quote'
                                ? 'italic border-l-4 border-orange-500 pl-5 font-bold'
                                : 'text-sm font-medium'
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
      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-wider hover:border-orange-500 transition-all"
    >
      {icon} {label}
    </button>
  );
}
