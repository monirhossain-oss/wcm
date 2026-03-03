'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiEdit2, FiTrash2, FiMapPin, FiX, FiUploadCloud, FiRefreshCw, 
  FiEye, FiHeart, FiExternalLink, FiChevronDown, FiGrid, FiTag, 
  FiPlus, FiAlertCircle, FiLink, FiGlobe, FiShield, FiActivity
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [metaData, setMetaData] = useState({ categories: [], tags: [] });
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editImage, setEditImage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showCatDrop, setShowCatDrop] = useState(false);

  useEffect(() => {
    fetchListings();
    fetchMeta();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await api.get('/api/listings/my-listings');
      setListings(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const fetchMeta = async () => {
    try {
      const res = await api.get('/api/listings/meta-data');
      setMetaData(res.data);
    } catch (err) { console.error(err); }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditFormData({
      title: item.title,
      description: item.description || '',
      externalUrls: item.externalUrls?.length > 0 ? item.externalUrls : [''],
      websiteLink: item.websiteLink || '',
      region: item.region,
      country: item.country,
      tradition: item.tradition,
      category: item.category?._id || item.category,
      culturalTags: item.culturalTags?.map((t) => t._id || t) || [],
    });
    setEditImage(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const data = new FormData();
      Object.keys(editFormData).forEach((key) => {
        if (key === 'culturalTags') {
          editFormData[key].forEach((t) => data.append('culturalTags', t));
        } else if (key === 'externalUrls') {
          editFormData[key].forEach((url) => { if (url.trim()) data.append('externalUrls', url); });
        } else {
          data.append(key, editFormData[key]);
        }
      });
      if (editImage) data.append('image', editImage);

      const res = await api.put(`/api/listings/update/${editingItem._id}`, data);
      setListings(listings.map((l) => (l._id === editingItem._id ? res.data.updatedListing : l)));
      setEditingItem(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this node? This cannot be undone.')) return;
    try {
      await api.delete(`/api/listings/delete/${id}`);
      setListings(listings.filter((l) => l._id !== id));
    } catch (err) { alert('Delete failed'); }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      {/* 🔹 Header Section */}
      <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/5 pb-8">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3">
            <FiActivity className="text-orange-500" /> Inventory <span className="text-orange-500">Nodes</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">
            Total Active Assets: {listings.length}
          </p>
        </div>
      </div>

      {/* 🔹 Tactical Table */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">Asset</th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">Identity</th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {listings.map((item) => (
                <tr key={item._id} className="group hover:bg-gray-50/50 dark:hover:bg-white/2 transition-all">
                  <td className="px-6 py-4">
                    <div className="w-14 h-14 rounded-md overflow-hidden border border-gray-100 dark:border-white/10">
                      <img src={getImageUrl(item.image)} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" alt={item.title} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-black uppercase text-black dark:text-white">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-black uppercase text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-sm italic">
                            {item.category?.title || 'General'}
                        </span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{item.tradition}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest ${
                        item.status === 'approved' ? 'bg-green-500/10 text-green-500' : 
                        item.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {item.status}
                      </span>
                      {item.status === 'rejected' && (
                        <span className="text-[7px] font-bold text-red-400 uppercase mt-1 italic">Reason Logged</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                   <div className="flex items-center justify-end gap-2">
  <ActionButton icon={FiEye} onClick={() => setViewingItem(item)} color="hover:bg-blue-500" />
  <ActionButton icon={FiEdit2} onClick={() => openEditModal(item)} color="hover:bg-orange-500" />
  <ActionButton 
    icon={FiTrash2} 
    onClick={() => handleDelete(item._id)} 
    color="hover:bg-red-500" 
    isDelete 
  />
</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 View Modal (Dossier Style) */}
      {viewingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/80">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c0c0c] rounded-lg overflow-hidden shadow-2xl border dark:border-white/5 animate-in zoom-in-95">
            <div className="h-64 relative">
                <img src={getImageUrl(viewingItem.image)} className="w-full h-full object-cover grayscale-[0.3]" alt={viewingItem.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent"></div>
                <button onClick={() => setViewingItem(null)} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-md hover:bg-red-500 transition-all"><FiX /></button>
                <div className="absolute bottom-6 left-8">
                    <span className="text-[9px] font-black bg-orange-500 text-white px-3 py-1 rounded-sm uppercase tracking-widest mb-2 inline-block italic">Verified Node</span>
                    <h3 className="text-2xl font-black uppercase text-white tracking-tighter">{viewingItem.title}</h3>
                </div>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                {viewingItem.status === 'rejected' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md">
                        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1 flex items-center gap-2"><FiAlertCircle /> Rejection Log</p>
                        <p className="text-[10px] font-bold text-gray-400 italic">"{viewingItem.rejectionReason}"</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <DataPoint label="Origin" value={viewingItem.country} icon={FiGlobe} />
                    <DataPoint label="Sector" value={viewingItem.region} icon={FiMapPin} />
                    <DataPoint label="Protocol" value={viewingItem.tradition} icon={FiShield} />
                    <DataPoint label="Category" value={viewingItem.category?.title} icon={FiGrid} />
                </div>

                <div className="space-y-2">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Description Narrative</p>
                    <p className="text-[11px] font-bold leading-relaxed dark:text-gray-400 italic">{viewingItem.description}</p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase"><FiHeart /> {viewingItem.favorites?.length || 0}</span>
                    </div>
                    {viewingItem.websiteLink && (
                        <a href={viewingItem.websiteLink} target="_blank" className="text-[10px] font-black text-orange-500 uppercase hover:underline flex items-center gap-2">Access Link <FiExternalLink /></a>
                    )}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Edit Modal (Configuration Mode) */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/90">
          <div className="relative w-full max-w-5xl bg-white dark:bg-[#0c0c0c] rounded-lg border dark:border-white/5 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/2">
                <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">Configure <span className="text-orange-500">Asset Node</span></h3>
                <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-red-500 transition-all"><FiX size={20}/></button>
            </div>

            <form onSubmit={handleUpdate} className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[80vh] overflow-y-auto">
                <div className="lg:col-span-4 space-y-4">
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Asset Visual</p>
                    <div className="relative h-72 bg-gray-50 dark:bg-white/2 border border-dashed border-gray-300 dark:border-white/10 rounded-md overflow-hidden group">
                        <img src={editImage ? URL.createObjectURL(editImage) : getImageUrl(editingItem.image)} className="w-full h-full object-cover" alt="Preview" />
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-sm">
                            <FiUploadCloud size={24} className="mb-2 text-orange-500" />
                            <span className="text-[9px] font-black uppercase">Replace Asset</span>
                            <input type="file" onChange={(e) => setEditImage(e.target.files[0])} className="hidden" />
                        </label>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Asset Title" value={editFormData.title} onChange={(v) => setEditFormData({...editFormData, title: v})} />
                        <InputField label="External Link" value={editFormData.websiteLink} onChange={(v) => setEditFormData({...editFormData, websiteLink: v})} />
                        
                        <div className="space-y-2 relative">
                            <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Category Protocol</label>
                            <div onClick={() => setShowCatDrop(!showCatDrop)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4 rounded-md text-[11px] font-black dark:text-white flex justify-between items-center cursor-pointer">
                                {metaData.categories.find(c => c._id === editFormData.category)?.title || 'Select Category'}
                                <FiChevronDown />
                            </div>
                            {showCatDrop && (
                                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1a1a] border dark:border-white/10 rounded-md shadow-2xl">
                                    {metaData.categories.map(cat => (
                                        <div key={cat._id} onClick={() => { setEditFormData({...editFormData, category: cat._id}); setShowCatDrop(false); }} className="p-3 text-[10px] font-black uppercase hover:bg-orange-500 hover:text-white cursor-pointer transition-colors dark:text-gray-300 border-b last:border-0 dark:border-white/5">
                                            {cat.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <InputField label="Region Sector" value={editFormData.region} onChange={(v) => setEditFormData({...editFormData, region: v})} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Analysis / Narrative</label>
                        <textarea rows={4} value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4 rounded-md text-[11px] font-black dark:text-white outline-none focus:border-orange-500 resize-none transition-all" />
                    </div>

                    <button disabled={updateLoading} className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-black text-[10px] tracking-[0.4em] uppercase transition-all shadow-lg shadow-orange-500/20 rounded-md flex items-center justify-center gap-3">
                        {updateLoading ? <FiRefreshCw className="animate-spin" /> : 'Synchronize Updates'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const ActionButton = ({ icon: Icon, onClick, color, isDelete }) => (
  <button 
    onClick={onClick} 
    className={`p-2.5 bg-gray-100 dark:bg-white/5 rounded-md transition-all flex items-center justify-center group/btn ${color} hover:text-white`}
  >
    <Icon 
      size={14} 
      className={`transition-colors ${
        isDelete 
          ? 'text-red-500 group-hover/btn:text-white'
          : 'text-gray-500 dark:text-gray-400 group-hover/btn:text-white'
      }`} 
    />
  </button>
);
const DataPoint = ({ label, value, icon: Icon }) => (
  <div className="p-4 bg-gray-50 dark:bg-white/2 border border-gray-100 dark:border-white/5 rounded-md">
    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Icon size={10} /> {label}</p>
    <p className="text-[10px] font-black dark:text-white uppercase italic">{value || 'N/A'}</p>
  </div>
);

const InputField = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">{label}</label>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4 rounded-md text-[11px] font-black dark:text-white outline-none focus:border-orange-500 transition-all" />
  </div>
);