import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Save, Plus, Trash2, Upload, Globe, CheckCircle } from 'lucide-react';
import aboutService from '../_services/aboutService';

const VisionSection = () => {
    const [loading, setLoading] = useState(false);
    const [visionData, setVisionData] = useState({
        header: { badge: '', titlePart1: '', titleColored: '', mainDescription: '' },
        imageCard: { topBadge: '', cardTitle: '', cardQuote: '', footerText: '', imageUrl: '' },
        features: []
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [showNewFeatureForm, setShowNewFeatureForm] = useState(false);
    const [newFeature, setNewFeature] = useState({ title: '', description: '', iconId: 'globe' });

    // ১. ডাটা ফেচ করা
    const fetchVisionData = async () => {
        try {
            const res = await axios.get('/api/about'); // আপনার রুট অনুযায়ী
            if (res.data.success) {
                setVisionData(res.data.data.visionSection);
                setPreviewUrl(res.data.data.visionSection.imageCard.imageUrl);
            }
        } catch (err) {
            toast.error("Failed to load vision data");
        }
    };

    useEffect(() => { fetchVisionData(); }, []);

    // ২. মেইন সেকশন আপডেট (Header + Image Card)
    const handleUpdateMain = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        // Header Data
        formData.append('badge', visionData.header.badge);
        formData.append('titlePart1', visionData.header.titlePart1);
        formData.append('titleColored', visionData.header.titleColored);
        formData.append('mainDescription', visionData.header.mainDescription);

        // Image Card Data
        formData.append('topBadge', visionData.imageCard.topBadge);
        formData.append('cardTitle', visionData.imageCard.cardTitle);
        formData.append('cardQuote', visionData.imageCard.cardQuote);
        formData.append('cardFooterText', visionData.imageCard.footerText);

        if (selectedFile) {
            formData.append('imageCard', selectedFile);
        }

        try {
            // আপনার সার্ভিসের ৯ নম্বর মেথডটি ব্যবহার করছি
            const res = await aboutService.updateVision(formData);

            if (res.data.success) {
                toast.success("Vision main content updated!");
                setSelectedFile(null);
            }
        } catch (err) {
            console.error("Vision update error:", err);
            toast.error(err.response?.data?.message || "Failed to update");
        } finally {
            setLoading(false);
        }
    };

    // ৩. নতুন ফিচার যোগ করা
    const addFeature = async () => {
        try {
            const res = await axios.post('/api/about/vision/feature', {
                title: "New Vision Point",
                description: "Describe the vision here",
                iconId: "globe"
            });
            if (res.data.success) {
                setVisionData({ ...visionData, features: res.data.data });
                toast.success("Feature added!");
            }
        } catch (err) {
            toast.error("Could not add feature");
        }
    };

    // ৪. ফিচার ডিলিট করা
    const deleteFeature = async (index) => {
        if (!window.confirm("Delete this feature?")) return;
        try {
            const res = await axios.delete(`/api/about/vision/feature/${index}`);
            if (res.data.success) {
                const updatedFeatures = [...visionData.features];
                updatedFeatures.splice(index, 1);
                setVisionData({ ...visionData, features: updatedFeatures });
                toast.success("Feature removed");
            }
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    // ৫. নির্দিষ্ট ফিচারের টেক্সট চেঞ্জ হ্যান্ডলার
    const handleFeatureChange = (index, field, value) => {
        const updatedFeatures = [...visionData.features];
        updatedFeatures[index][field] = value;
        setVisionData({ ...visionData, features: updatedFeatures });
    };

    // ৬. ফিচার সেভ করা (ইন্ডিভিজুয়ালি)
    const saveFeature = async (index) => {
        try {
            const feature = visionData.features[index];
            const res = await axios.patch(`/api/about/vision/feature/${index}`, feature);
            if (res.data.success) toast.success(`Feature ${index + 1} saved!`);
        } catch (err) {
            toast.error("Feature save failed");
        }
    };
    const handleAddNewFeature = async () => {
        if (!newFeature.title || !newFeature.description) {
            return toast.error("Please fill all fields");
        }

        try {
            setLoading(true);
            // আপনার aboutService ব্যবহার করে
            const res = await aboutService.addVisionFeature(newFeature);

            if (res.data.success) {
                toast.success("New feature added!");
                // লিস্ট আপডেট করুন (সার্ভার থেকে আসা নতুন ফিচার লিস্ট দিয়ে)
                setVisionData({ ...visionData, features: res.data.data });
                // ফর্ম ক্লিয়ার এবং হাইড করুন
                setNewFeature({ title: '', description: '', iconId: 'globe' });
                setShowNewFeatureForm(false);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to save feature");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="space-y-8">

                {/* --- HEADER & IMAGE CARD SECTION --- */}
                <form onSubmit={handleUpdateMain} className="p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Vision Main Settings</h2>
                        <button disabled={loading} className="btn-primary flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            <Save size={18} /> {loading ? 'Saving...' : 'Save Main Content'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Header Fields */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-blue-600 border-b pb-2">Header Texts</h3>
                            <input type="text" placeholder="Badge (e.g. OUR VISION)" className="w-full border p-2 rounded"
                                value={visionData.header.badge} onChange={(e) => setVisionData({ ...visionData, header: { ...visionData.header, badge: e.target.value } })} />
                            <input type="text" placeholder="Title Part 1" className="w-full border p-2 rounded"
                                value={visionData.header.titlePart1} onChange={(e) => setVisionData({ ...visionData, header: { ...visionData.header, titlePart1: e.target.value } })} />
                            <input type="text" placeholder="Colored Title" className="w-full border p-2 rounded text-blue-600 font-bold"
                                value={visionData.header.titleColored} onChange={(e) => setVisionData({ ...visionData, header: { ...visionData.header, titleColored: e.target.value } })} />
                            <textarea placeholder="Main Description" rows="3" className="w-full border p-2 rounded"
                                value={visionData.header.mainDescription} onChange={(e) => setVisionData({ ...visionData, header: { ...visionData.header, mainDescription: e.target.value } })} />
                        </div>

                        {/* Image Card Fields */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-green-600 border-b pb-2">Image Card & Quote</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 border rounded-lg overflow-hidden bg-gray-100">
                                    {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" /> : <div className="flex items-center justify-center h-full text-gray-400">No Image</div>}
                                </div>
                                <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center gap-2">
                                    <Upload size={16} /> Upload Image
                                    <input type="file" className="hidden" onChange={(e) => {
                                        setSelectedFile(e.target.files[0]);
                                        setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                                    }} />
                                </label>
                            </div>
                            <input type="text" placeholder="Card Top Badge" className="w-full border p-2 rounded"
                                value={visionData.imageCard.topBadge} onChange={(e) => setVisionData({ ...visionData, imageCard: { ...visionData.imageCard, topBadge: e.target.value } })} />
                            <input type="text" placeholder="Card Title" className="w-full border p-2 rounded"
                                value={visionData.imageCard.cardTitle} onChange={(e) => setVisionData({ ...visionData, imageCard: { ...visionData.imageCard, cardTitle: e.target.value } })} />
                            <input type="text" placeholder="Quote Text" className="w-full border p-2 rounded italic"
                                value={visionData.imageCard.cardQuote} onChange={(e) => setVisionData({ ...visionData, imageCard: { ...visionData.imageCard, cardQuote: e.target.value } })} />
                            <input type="text" placeholder="Footer Text" className="w-full border p-2 rounded"
                                value={visionData.imageCard.footerText} onChange={(e) => setVisionData({ ...visionData, imageCard: { ...visionData.imageCard, footerText: e.target.value } })} />
                        </div>
                    </div>
                </form>

                {/* --- FEATURES LIST SECTION --- */}
                <div className=" p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Vision Features</h2>
                            <p className="text-sm text-gray-500">Add points like Innovation, Global Reach, etc.</p>
                        </div>
                        {!showNewFeatureForm && (
                            <button
                                onClick={() => setShowNewFeatureForm(true)}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                                <Plus size={18} /> Add New Point
                            </button>
                        )}
                    </div>

                    {/* --- নতুন পয়েন্ট যোগ করার ইনপুট ফিল্ড (এটা আগে ওপেন হবে) --- */}
                    {showNewFeatureForm && (
                        <div className="mb-6 p-4 border-2 border-dashed border-green-200 rounded-lg  space-y-3">
                            <h3 className="font-bold text-green-700 text-sm uppercase">Create New Point</h3>
                            <input
                                type="text"
                                placeholder="Feature Title"
                                className="w-full border p-2 rounded "
                                value={newFeature.title}
                                onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Feature Description"
                                className="w-full border p-2 rounded "
                                value={newFeature.description}
                                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddNewFeature}
                                    className="bg-green-600 text-white px-4 py-2 rounded shadow-sm hover:bg-green-700 text-sm font-medium"
                                >
                                    Confirm & Save
                                </button>
                                <button
                                    onClick={() => setShowNewFeatureForm(false)}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- বিদ্যমান ফিচারের লিস্ট --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {visionData.features.map((feature, index) => (
                            <div key={index} className="border p-4 rounded-lg space-y-3 relative group transition-all hover:shadow-md">

                                {/* কার্ড হেডার: ইনডেক্স এবং অ্যাকশন বাটন */}
                                <div className="flex justify-between items-center">
                                    <span className=" text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">
                                        Point #{index + 1}
                                    </span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* সেভ বাটন (নির্দিষ্ট ইনডেক্সের জন্য) */}
                                        <button
                                            onClick={() => saveFeature(index)}
                                            title="Save changes for this point"
                                            className="text-blue-600 hover:bg-blue-100 p-1.5 rounded-full transition-colors"
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        {/* ডিলিট বাটন */}
                                        <button
                                            onClick={() => deleteFeature(index)}
                                            title="Delete this point"
                                            className="text-red-600 hover:bg-red-100 p-1.5 rounded-full transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* টাইটেল ইনপুট এবং আইকন */}
                                <div className="flex gap-3 items-start">
                                    <div className="mt-1 p-2  rounded shadow-sm">
                                        <Globe className="text-blue-500" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] uppercase text-gray-400 font-bold">Title</label>
                                        <input
                                            type="text"
                                            value={feature.title}
                                            className="w-full border-b border-transparent focus:border-blue-400 bg-transparent font-semibold text-gray-800 focus:outline-none py-1"
                                            onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* ডেসক্রিপশন টেক্সট এরিয়া */}
                                <div className="pl-11">
                                    <label className="text-[10px] uppercase text-gray-400 font-bold">Description</label>
                                    <textarea
                                        value={feature.description}
                                        className="w-full text-sm bg-transparent border-none focus:ring-0 text-gray-600 resize-none"
                                        rows="3"
                                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                                    />
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VisionSection;