import React from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';
const ImagePreview = ({
    label,
    selectedImage,
    existingImage,
    onRemove,
    onChange,
    id
}) => {
    return (
        <div className="flex flex-col space-y-2">
            {label && (
                <label className="text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}

            <div className="relative group">
                <div className="w-full h-48 rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/50 hover:bg-gray-800/80 transition-all flex items-center justify-center overflow-hidden">

                    {/* যদি নতুন ইমেজ সিলেক্ট করা হয় বা আগের ইমেজ থাকে */}
                    {selectedImage || existingImage ? (
                        <div className="relative w-full h-full">
                            <img
                                src={selectedImage ? URL.createObjectURL(selectedImage) : existingImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            {/* রিমুভ বাটন */}
                            <button
                                type="button"
                                onClick={onRemove}
                                className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                            >
                                <FiX size={16} />
                            </button>
                        </div>
                    ) : (
                        /* ইমেজ না থাকলে আপলোড আইকন দেখাবে */
                        <label
                            htmlFor={id}
                            className="flex flex-col items-center cursor-pointer space-y-2"
                        >
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-full">
                                <FiUploadCloud size={24} />
                            </div>
                            <span className="text-xs text-gray-400">Click to upload image</span>
                        </label>
                    )}
                </div>

                {/* ইনপুট ফিল্ড (হিডেন) */}
                <input
                    type="file"
                    id={id}
                    accept="image/*"
                    onChange={onChange}
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default ImagePreview;