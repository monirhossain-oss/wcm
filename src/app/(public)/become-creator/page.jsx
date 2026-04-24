'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import {
  FiUpload,
  FiClock,
  FiCamera,
  FiBriefcase,
  FiGrid,
  FiLoader,
  FiGlobe,
  FiCheckCircle,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { Country, City } from 'country-state-city';
import { ChevronDown, Grid, Loader2 } from 'lucide-react';
import Link from 'next/link';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

export default function UserProfileForm() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [previews, setPreviews] = useState({ profile: null, cover: null });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      customerType: 'individual',
    },
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Watch fields for conditional logic
  const selectedCountryCode = watch('countryCode');
  const customerType = watch('customerType');
  const cities = selectedCountryCode ? City.getCitiesOfCountry(selectedCountryCode) : [];

  useEffect(() => {
    setMounted(true);
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/admin/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories');
      } finally {
        setCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user) {
      // যদি অলরেডি ক্রিয়েটর হয় তবে প্রোফাইলে পাঠিয়ে দাও
      if (user.role === 'creator' || user.role === 'admin') {
        router.push('/profile');
      }

      setPreviews({
        profile: getImageUrl(user.profile?.profileImage, 'avatar'),
        cover: getImageUrl(user.profile?.coverImage),
      });

      reset({
        display_name: user.profile?.displayName || `${user?.firstName} ${user?.lastName}`,
        business_name: user.profile?.businessName || '',
        category: user.profile?.category || '',
        bio: user.profile?.bio || '',
        countryCode: user.profile?.countryCode || '',
        city: user.profile?.city || '',
        customerType: user.profile?.customerType || 'individual',
        vatNumber: user.profile?.vatNumber || '',
        language: user.profile?.language || '',
        website_link: user.profile?.websiteLink || '',
        social_link: user.profile?.socialLink || '',
      });
    }
  }, [user, reset, router]);

  const isPending = user?.creatorRequest?.status === 'pending' && user?.creatorRequest?.isApplied;

  const onSubmit = async (data) => {
    if (isPending) return;
    try {
      setServerError('');
      const formData = new FormData();

      const countryObj = Country.getCountryByCode(data.countryCode);

      formData.append('displayName', data.display_name);
      formData.append('businessName', data.business_name);
      formData.append('category', data.category);
      formData.append('bio', data.bio);
      formData.append('country', countryObj?.name || '');
      formData.append('countryCode', data.countryCode);
      formData.append('city', data.city);
      formData.append('customerType', data.customerType);
      formData.append('vatNumber', data.customerType === 'business' ? data.vatNumber : '');
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

  // --- PENDING STATE VIEW ---
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#fafafa] dark:bg-[#050505]">
        <div className="max-w-md w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-10 rounded-lg text-center shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiClock size={40} className="text-orange-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-2">
            Request Under Review
          </h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            Your application is being processed by our admins. <br /> You will be notified once
            approved.
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="mt-8 w-full py-4 bg-orange-500 text-white text-[10px] font-black uppercase rounded-md shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const inputStyle =
    'w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400 rounded-md px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-xs font-bold';
  const labelStyle =
    'text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest ml-1 mb-1 flex items-center gap-1';

  return (
    <div className="min-h-screen mt-10 relative pb-20 bg-[#fafafa] dark:bg-[#050505]">
      <div className="relative max-w-7xl mx-auto pt-16 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-lg border border-gray-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#0a0a0a]">
          {/* Hero Side */}
          <div
            className="lg:col-span-4 hidden lg:flex items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: "url('/register.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div className="relative z-10 text-white px-10 text-center">
              <h2 className="text-4xl font-black mb-3 uppercase tracking-tighter">
                Become a <span className="text-orange-500">Creator</span>
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">
                Unlock your professional node
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 p-8 lg:p-14">
            {serverError && (
              <p className="bg-red-500/10 text-red-500 p-4 rounded-md mb-6 text-center text-[10px] font-black uppercase border border-red-500/20">
                {serverError}
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Account Type Selector */}
              <div className="p-1 bg-gray-100 dark:bg-white/5 rounded-md flex gap-1">
                <button
                  type="button"
                  onClick={() => setValue('customerType', 'individual')}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${customerType === 'individual' ? 'bg-white dark:bg-white/10 shadow-sm text-orange-500' : 'text-gray-400'}`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => setValue('customerType', 'business')}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${customerType === 'business' ? 'bg-white dark:bg-white/10 shadow-sm text-orange-500' : 'text-gray-400'}`}
                >
                  Business / Agency
                </button>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Display Name</label>
                  <input
                    {...register('display_name', { required: true })}
                    className={inputStyle}
                    placeholder="Your public name"
                  />
                </div>
                <div>
                  <label className={labelStyle}>
                    <FiBriefcase size={10} />{' '}
                    {customerType === 'business' ? 'Business Name' : 'Legal Name'}
                  </label>
                  <input
                    {...register('business_name', { required: true })}
                    className={inputStyle}
                    placeholder="Agency or Brand Name"
                  />
                </div>
              </div>

              {/* VAT (Dynamic) */}
              {customerType === 'business' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className={labelStyle}>
                    <FiCheckCircle size={10} />Business Number (Optional)
                  </label>
                  <input
                    {...register('vatNumber')}
                    className={inputStyle}
                    placeholder="e.g. FR123456789"
                  />
                  <p className="text-[9px] text-gray-400 mt-2 ml-1 uppercase font-bold tracking-tight">
                    Needed for EU Reverse Charge (0% Tax)
                  </p>
                </div>
              )}

              {/* Category */}
              <div>
                <label className={labelStyle}>
                  <Grid size={14} className="inline mr-2" /> Expertise Category
                </label>
                <div className="relative">
                  <select
                    {...register('category', { required: true })}
                    className={`${inputStyle} appearance-none bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border-gray-200 dark:border-zinc-700 focus:ring-orange-500 pr-10`}
                    disabled={catLoading}
                  >
                    <option value="" className="bg-white dark:bg-zinc-900 text-gray-500">
                      {catLoading ? 'Loading Categories...' : 'Select your primary field'}
                    </option>

                    {categories.map((cat) => (
                      <option
                        key={cat._id}
                        value={cat._id}
                        className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100"
                      >
                        {cat.title}
                      </option>
                    ))}
                  </select>

                  {/* লোডার অথবা লুসিড অ্যারো আইকন */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                    {catLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className={labelStyle}>Professional Bio</label>
                <textarea
                  {...register('bio')}
                  rows={2}
                  placeholder="Briefly describe your services..."
                  className={`${inputStyle} resize-none`}
                />
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="relative h-32 flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-white/10 rounded-md overflow-hidden bg-gray-50 dark:bg-white/5 cursor-pointer group">
                  <img
                    src={previews.profile}
                    className="absolute inset-0 w-full h-full object-cover group-hover:opacity-20 transition-all"
                    alt="profile"
                  />
                  <div className="relative z-10 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all">
                    <FiCamera size={20} className="text-gray-900 dark:text-white mb-1" />
                    <span className="text-[8px] font-black uppercase text-gray-900 dark:text-white">
                      Change Avatar
                    </span>
                  </div>
                  <input
                    type="file"
                    name="profileImageReq"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setPreviews((p) => ({ ...p, profile: URL.createObjectURL(file) }));
                    }}
                  />
                </label>

                <label className="relative h-32 flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-white/10 rounded-md overflow-hidden bg-gray-50 dark:bg-white/5 cursor-pointer group">
                  <img
                    src={
                      previews.cover ||
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000'
                    }
                    className="absolute inset-0 w-full h-full object-cover group-hover:opacity-20 transition-all"
                    alt="cover"
                  />
                  <div className="relative z-10 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all">
                    <FiUpload size={20} className="text-gray-900 dark:text-white mb-1" />
                    <span className="text-[8px] font-black uppercase text-gray-900 dark:text-white">
                      Update Cover
                    </span>
                  </div>
                  <input
                    type="file"
                    name="coverImageReq"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setPreviews((p) => ({ ...p, cover: URL.createObjectURL(file) }));
                    }}
                  />
                </label>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelStyle}>
                    <FiGlobe size={10} /> Country
                  </label>
                  <select {...register('countryCode', { required: true })} className={inputStyle}>
                    <option value="">Select Country</option>
                    {Country.getAllCountries().map((c) => (
                      <option className="dark:bg-gray-800" key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>City</label>
                  <select
                    {...register('city', { required: true })}
                    className={inputStyle}
                    disabled={!selectedCountryCode}
                  >
                    <option value="">Select City</option>
                    {cities.map((c, index) => (
                      <option
                        className="dark:bg-gray-800"
                        key={`${c.name}-${index}`}
                        value={c.name}
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Language</label>
                  <input
                    {...register('language', { required: true })}
                    placeholder="English, Bangla etc."
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Social URL</label>
                  <input
                    {...register('social_link')}
                    placeholder="Portfolio or Profile link"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Website URL</label>
                  <input
                    {...register('website_link')}
                    placeholder="https://yourbrand.com"
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-center gap-3 py-4 border-t border-gray-100 dark:border-white/5 mt-4">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />

                <label
                  htmlFor="agreeTerms"
                  className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer leading-relaxed flex items-center gap-1"
                >
                  I agree to the{' '}
                  <Link
                    href="/creator-terms-and-conditions"
                    className="text-orange-500 underline hover:text-orange-600"
                  >
                    Creator Terms and Conditions
                  </Link>{' '}
                  and confirm that all provided information is accurate.
                </label>
              </div>

              {/* বাটনটি আপডেট করুন (disabled প্রপার্টি লক্ষ্য করুন) */}
              <button
                type="submit"
                disabled={isSubmitting || !agreeTerms} // এখানে !agreeTerms যোগ হয়েছে
                className="w-full bg-orange-500 text-white py-5 rounded-md font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-orange-600 transition-all disabled:bg-gray-400"
              >
                {isSubmitting ? 'Processing Node...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </div >
    </div >
  );
}
