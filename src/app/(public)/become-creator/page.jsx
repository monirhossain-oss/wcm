'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { FiUpload, FiClock, FiCamera } from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { Country, City } from 'country-state-city';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

export default function UserProfileForm() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  // console.log(user)
  const [serverError, setServerError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [previews, setPreviews] = useState({ profile: null, cover: null });

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm();

  const selectedCountry = watch('country');
  const cities = selectedCountry ? City.getCitiesOfCountry(selectedCountry) : [];

  useEffect(() => {
    if (user) {
      if (user.role !== 'user') {
        router.push('/profile');
      }

      setPreviews({
        profile: getImageUrl(user.profile?.profileImage, 'avatar'),
        cover: getImageUrl(user.profile?.coverImage),
      });

      reset({
        display_name: user.profile?.displayName || '',
        bio: user.profile?.bio || '',
        country: user.profile?.country || '',
        city: user.profile?.city || '',
        language: user.profile?.language || '',
        website_link: user.profile?.websiteLink || '',
        social_link: user.profile?.socialLink || '',
      });
    }
  }, [user, reset, router]);

  const handleImagePreview = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const isPending = user?.creatorRequest?.status === 'pending' && user?.creatorRequest?.isApplied;

  const onSubmit = async (data) => {
    if (isPending) return;
    try {
      setServerError('');
      const formData = new FormData();
      formData.append('displayName', data.display_name);
      formData.append('username', user?.username);
      formData.append('bio', data.bio);
      formData.append('country', data.country);
      formData.append('city', data.city);
      formData.append('language', data.language);
      formData.append('websiteLink', data.website_link);
      formData.append('socialLink', data.social_link);

      const profileFile = document.querySelector('input[name="profileImageReq"]')?.files[0];
      const coverFile = document.querySelector('input[name="coverImageReq"]')?.files[0];

      if (profileFile) formData.append('profileImage', profileFile);
      if (coverFile) formData.append('coverImage', coverFile);

      const res = await api.post('/api/users/become-creator', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 200) {
        setUser(res.data.user);
        router.push('/profile');
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Something went wrong');
    }
  };

  if (!mounted || !user) return null;

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#fafafa] dark:bg-[#050505]">
        <div className="max-w-md w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-10 rounded-[2.5rem] text-center shadow-2xl backdrop-blur-xl">
          <FiClock size={40} className="text-orange-500 animate-pulse mx-auto mb-6" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-2">Request Pending</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Wait for admin approval.</p>
          <button onClick={() => router.push('/profile')} className="mt-8 w-full py-4 bg-orange-500 text-white text-[10px] font-black uppercase rounded-2xl transition-all">Back to Profile</button>
        </div>
      </div>
    );
  }

  const inputStyle = 'w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-gray-400 placeholder:text-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-xs font-bold';
  const labelStyle = 'text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 dark:bg-balck tracking-widest ml-1 mb-1 block';
  const fileBoxStyle = 'relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-white/10 rounded-lg p-4 transition-all hover:border-orange-500 bg-gray-50 dark:bg-white/5 cursor-pointer group h-32 overflow-hidden';

  return (
    <div className="min-h-screen mt-10 relative pb-20 bg-[#fafafa] dark:bg-[#050505]">
      <div className="relative max-w-7xl mx-auto pt-16 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[3rem] border border-gray-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#0a0a0a]">
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: "url('/register.jpg')" }}>
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"></div>
            <div className="relative z-10 text-white px-10 text-center">
              <h2 className="text-4xl font-black mb-3 uppercase tracking-tighter">Become a <span className="text-orange-500">Creator</span></h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Unlock your professional node</p>
            </div>
          </div>

          <div className="lg:col-span-7 p-8 lg:p-14">
            {serverError && <p className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-center text-[10px] font-black uppercase border border-red-500/20">{serverError}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Display Name</label>
                  <input value={`${user?.firstName} ${user?.lastName}`} disabled className={inputStyle + ' cursor-not-allowed opacity-50'} />
                </div>
                <div>
                  <label className={labelStyle}>Username</label>
                  <input value={`@${user?.username}`} disabled className={inputStyle + ' cursor-not-allowed opacity-50'} />
                </div>
              </div>

              <div>
                <label className={labelStyle}>Professional Bio</label>
                <textarea {...register('bio')} rows={3} placeholder="Tell people about your expertise..." className={`${inputStyle} resize-none`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Profile Image</label>
                  <label className={fileBoxStyle}>
                    <img src={previews.profile} className="absolute inset-0 w-full h-full object-cover group-hover:opacity-30 transition-opacity" alt="profile" />
                    <div className="relative z-10 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all">
                      <FiCamera className="text-gray-900 dark:text-white mb-1" size={20} />
                      <span className="text-[8px] font-black uppercase text-gray-900 dark:text-white">Upload</span>
                    </div>
                    <input type="file" name="profileImageReq" accept="image/*" className="hidden" onChange={(e) => handleImagePreview(e, 'profile')} />
                  </label>
                </div>
                <div>
                  <label className={labelStyle}>Cover Image</label>
                  <label className={fileBoxStyle}>
                    <img src={previews.cover || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000'} className="absolute inset-0 w-full h-full object-cover group-hover:opacity-30 transition-opacity" alt="cover" />
                    <div className="relative z-10 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all">
                      <FiUpload className="text-gray-900 dark:text-white mb-1" size={20} />
                      <span className="text-[8px] font-black uppercase text-gray-900 dark:text-white">Update Cover</span>
                    </div>
                    <input type="file" name="coverImageReq" accept="image/*" className="hidden" onChange={(e) => handleImagePreview(e, 'cover')} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelStyle}>Country</label>
                  <select {...register('country', { required: true })} className={inputStyle}>
                    <option value="">Select Country</option>
                    {Country.getAllCountries().map(c => (
                      <option className='dark:bg-gray-800' key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>City</label>
                  <select {...register('city', { required: true })} className={inputStyle} disabled={!selectedCountry}>
                    <option value="">Select City</option>
                    {cities.map((c, index) => (
                      <option className='dark:bg-gray-800' key={`${c.name}-${index}`} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Language</label><input {...register('language', { required: true })} placeholder="Language" className={inputStyle} /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Socail Link</label>
                  <input {...register('social_link')} placeholder="Social URL (Instagram/FB)" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Website Link</label>
                  <input {...register('website_link')} placeholder="Website URL (https://)" className={inputStyle} />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-orange-600 active:scale-[0.98] transition-all disabled:bg-gray-400">
                {isSubmitting ? 'Processing Node...' : 'Submit for Admin Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}