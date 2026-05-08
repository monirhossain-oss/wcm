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

  useEffect(() => {
    const loadBlogData = async () => {
      try {
        const [catRes, blogRes] = await Promise.all([
          api.get('/api/admin/categories'),
          api.get(`/api/blogs/${id}`),
        ]);

        setCategories(catRes.data);
        const blog = blogRes.data.blog;

        const currentCat = catRes.data.find((c) => c.title === blog.category);

        setFormData({
          title: blog.title,
          description: blog.description,
          category: currentCat?._id || '',
          content: blog.content || [],
          selectedTags: [],
        });
        setPreviewImage(blog.image);

        if (currentCat) {
          const tagsRes = await api.get(`/api/listings/tags/by-category/${currentCat._id}`);
          setCategoryTags(tagsRes.data);
          const matchedTagIds = tagsRes.data
            .filter((t) => blog.tags?.includes(t.title))
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
    const existingImages = formData.content[blockIdx].images || [];
    if (currentFiles.length + existingImages.length >= 4)
      return toast.error('Max 4 images per grid');
    setGridFiles({ ...gridFiles, [blockIdx]: [...currentFiles, file] });
  };

  // ✅ ফিক্সড: আগের আপলোড করা ইমেজ রিমুভ করার ফাংশন
  const handleRemoveExistingImage = (blockIdx, imgIdx) => {
    const newContent = [...formData.content];
    newContent[blockIdx].images = newContent[blockIdx].images.filter((_, i) => i !== imgIdx);
    setFormData({ ...formData, content: newContent });
  };

  // ✅ ফিক্সড: নতুন সিলেক্ট করা ফাইল রিমুভ করার ফাংশন
  const handleRemoveNewFile = (blockIdx, fileIdx) => {
    const updatedFiles = [...(gridFiles[blockIdx] || [])];
    updatedFiles.splice(fileIdx, 1);
    setGridFiles({ ...gridFiles, [blockIdx]: updatedFiles });
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
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">
          Update <span className="text-orange-500">Journal</span>
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 text-xs font-bold uppercase border dark:border-white/10 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 bg-orange-600 text-white rounded-md font-bold text-xs uppercase flex items-center gap-2"
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
        <div className="lg:col-span-4 space-y-8">
          <section className="space-y-3">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
              Main Banner
            </label>
            <div className="relative group aspect-16/10 bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg overflow-hidden">
              <img
                src={mainImage ? URL.createObjectURL(mainImage) : previewImage}
                className="w-full h-full object-cover"
                alt="Banner"
              />
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setMainImage(e.target.files[0])}
              />
            </div>
          </section>

          <section className="bg-gray-50 dark:bg-white/5 p-6 rounded-lg space-y-6 border dark:border-white/5">
            {/* Category Dropdown */}
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
                <FiChevronDown />
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
                      className="p-4 text-xs font-bold uppercase hover:bg-orange-500 hover:text-white cursor-pointer"
                    >
                      {cat.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags Section */}
            <div className="space-y-2 relative">
              <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                Tags (Max 5)
              </label>
              <div
                onClick={() => formData.category && setShowTagDrop(!showTagDrop)}
                className={`flex flex-wrap gap-2 p-4 min-h-[56px] bg-white dark:bg-zinc-900 border dark:border-white/10 rounded-lg text-xs font-bold cursor-pointer`}
              >
                {formData.selectedTags.map((tId) => (
                  <span
                    key={tId}
                    className="bg-orange-500 text-white pl-3 pr-2 py-1.5 rounded-md flex items-center gap-2 text-[10px]"
                  >
                    {categoryTags.find((t) => t._id === tId)?.title}
                    <FiX
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
              {showTagDrop && (
                <div className="absolute z-[100] w-full mt-2 bg-white dark:bg-zinc-900 border dark:border-white/10 rounded-lg shadow-2xl p-2">
                  <input
                    placeholder="Search tags..."
                    className="w-full bg-transparent p-2 text-xs font-bold outline-none border-b dark:border-white/10 mb-2"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                  />
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
                        className={`p-3 rounded-md text-[11px] font-bold uppercase cursor-pointer flex justify-between items-center ${formData.selectedTags.includes(tag._id) ? 'bg-orange-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
                      >
                        {tag.title} {formData.selectedTags.includes(tag._id) && <FiCheck />}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-8 space-y-8">
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
            className="w-full bg-gray-50 dark:bg-white/5 border dark:border-white/10 p-5 rounded-lg text-sm font-medium outline-none"
          />

          <section>
            <div className="flex flex-wrap gap-2 mb-6">
              <ToolBtn icon={<FiPlus />} label="Heading" onClick={() => addBlock('heading')} />
              <ToolBtn icon={<FiType />} label="Text" onClick={() => addBlock('paragraph')} />
              <ToolBtn icon={<FiGrid />} label="Grid" onClick={() => addBlock('image_grid')} />
              <ToolBtn icon={<FiMessageSquare />} label="Quote" onClick={() => addBlock('quote')} />
            </div>

            <div className="space-y-4">
              {formData.content.map((block, idx) => (
                <div
                  key={idx}
                  className="relative bg-gray-50 dark:bg-white/5 p-6 rounded-lg border dark:border-white/5"
                >
                  <div className="flex-1">
                    {block.type === 'image_grid' ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {/* ✅ ফিক্সড: বিদ্যমান ইমেজ রিমুভ (ল্যাপটপ + মোবাইল) */}
                        {block.images?.map((img, i) => (
                          <div
                            key={i}
                            className="relative aspect-square rounded-lg overflow-hidden group"
                          >
                            <img src={img} className="w-full h-full object-cover" />
                            <button
                              onClick={() => handleRemoveExistingImage(idx, i)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full md:opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        ))}
                        {/* ✅ ফিক্সড: নতুন ফাইল রিমুভ (ল্যাপটপ + মোবাইল) */}
                        {(gridFiles[idx] || []).map((file, fIdx) => (
                          <div
                            key={fIdx}
                            className="relative aspect-square rounded-lg overflow-hidden border-2 border-orange-500 group"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => handleRemoveNewFile(idx, fIdx)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full md:opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                        {(block.images?.length || 0) + (gridFiles[idx]?.length || 0) < 4 && (
                          <label className="aspect-square border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-500">
                            <FiPlus size={24} className="text-gray-400" />
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
                        className={`w-full bg-transparent outline-none border-none p-0 resize-none ${block.type === 'heading' ? 'text-xl font-black' : block.type === 'quote' ? 'italic border-l-4 border-orange-500 pl-5 font-bold' : 'text-sm font-medium'}`}
                        rows={block.type === 'paragraph' ? 3 : 1}
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBlock(idx)}
                    className="absolute -top-2 -right-2 bg-zinc-200 dark:bg-zinc-800 p-2 rounded-full text-red-500 hover:scale-110 transition-all shadow-md"
                  >
                    <FiTrash2 size={16} />
                  </button>
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
