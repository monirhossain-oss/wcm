'use client';

import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  FiUser,
  FiEdit3,
  FiX,
  FiCheck,
  FiCamera,
  FiGlobe,
  FiMapPin,
  FiType,
  FiLink,
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiExternalLink,
} from 'react-icons/fi';
import { Globe, Languages, Box, Info } from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';
import ListingCard from '@/components/ListingCard';
import { useLocale } from '@/context/LocaleContext';
import { localizeCountry, localizeLanguageName } from '@/lib/i18n/displayNames';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

// Mirrors PROFILE_BIO_MAX_LENGTH in wcm-server/src/controllers/userController.js
const PROFILE_BIO_MAX_LENGTH = 2000;

// ─────────────────────────────────────────────
// SIMPLE USER PROFILE (role === 'user')
// ─────────────────────────────────────────────
function UserProfileView({
  user,
  displayUser,
  router,
  onDelete,
  fr,
  locale,
  isEditing,
  setIsEditing,
  register,
  handleSubmit,
  onSubmit,
  isSubmitting,
  reset,
  message,
  translationNotice,
}) {
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();
  const displayName = displayUser?.profile?.displayName;
  const bio = displayUser?.profile?.bio;

  return (
    <div className="min-h-screen bg-[#f7f6f3] dark:bg-[#111] flex flex-col items-center justify-center px-4 py-6">

      {/* Back */}
      <div className="w-full mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <FiArrowLeft size={13} /> {fr ? 'Retour' : 'Back'}
        </button>
      </div>

      {/* Status message */}
      {message?.text && (
        <div
          className={`w-full max-w-sm mb-4 p-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
        >
          <FiCheck /> {message.text}
        </div>
      )}
      {translationNotice && (
        <p className="w-full max-w-sm mb-4 text-[10px] font-bold text-gray-400 italic">
          Traduction française en cours de mise à jour.
        </p>
      )}

      {/* Card */}
      <div className="w-full max-w-sm bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-xl shadow-black/5 dark:shadow-black/40 overflow-hidden">

        {/* Top accent bar */}
        <div className="h-2 w-full bg-gradient-to-r from-orange-400 to-orange-600" />

        <div className="px-10 py-12 flex flex-col items-center gap-6 text-center">

          {/* Avatar — always shows initials, no image */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-orange-100 dark:bg-orange-900/20 border-4 border-white dark:border-[#1a1a1a] shadow-lg shadow-orange-200 dark:shadow-orange-900/30 flex items-center justify-center">
              {initials ? (
                <span className="text-3xl font-black text-orange-500 select-none">
                  {initials}
                </span>
              ) : (
                <FiUser size={36} className="text-orange-400" />
              )}
            </div>

            {/* Role badge */}
            <div className="absolute -bottom-1 -right-1 bg-gray-800 dark:bg-white text-white dark:text-black px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow">
              {fr ? 'Utilisateur' : 'User'}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              {fullName || (fr ? 'Anonyme' : 'Anonymous')}
            </h1>
            {displayName && !isEditing && (
              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400">{displayName}</p>
            )}
            <p className="text-[10px] font-bold text-orange-500 lowercase tracking-widest">
              @{user?.username}
            </p>
          </div>

          {/* Divider */}
          <div className="w-12 h-px bg-gray-200 dark:bg-white/10" />

          {!isEditing ? (
            <>
              {/* Biography */}
              <div className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  {fr ? 'Biographie' : 'Biography'}
                </p>
                <p className="text-[11px] font-medium text-gray-700 dark:text-gray-300 italic whitespace-pre-wrap">
                  {bio || (fr ? 'Aucune biographie pour le moment.' : 'No biography yet.')}
                </p>
              </div>

              {/* Meta info */}
              <div className="w-full space-y-3">
                <MetaRow icon={FiUser} label={fr ? 'Nom complet' : 'Full Name'} value={fullName} />
                {(user?.profile?.city || user?.profile?.country) && (
                  <MetaRow
                    icon={FiMapPin}
                    label={fr ? 'Localisation' : 'Location'}
                    value={[
                      user?.profile?.city,
                      localizeCountry(user?.profile?.country, user?.profile?.countryCode, locale),
                    ].filter(Boolean).join(', ')}
                  />
                )}
                {user?.profile?.language && (
                  <MetaRow
                    icon={FiGlobe}
                    label={fr ? 'Langue' : 'Language'}
                    value={localizeLanguageName(user.profile.language, locale)}
                  />
                )}
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-all"
              >
                <FiEdit3 /> {fr ? 'Modifier le profil' : 'Edit Profile'}
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="w-full text-left space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InputField label={fr ? 'Prénom' : 'First Name'} name="firstName" register={register} placeholder={fr ? 'Requis' : 'Required'} />
                <InputField label={fr ? 'Nom' : 'Last Name'} name="lastName" register={register} placeholder={fr ? 'Requis' : 'Required'} />
              </div>

              <InputField
                label={fr ? 'Nom public affiché' : 'Public Display Name'}
                name="displayName"
                register={register}
                placeholder={fr ? 'Visible publiquement' : 'Visible to public'}
              />

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">
                  {fr ? 'Biographie (anglais uniquement)' : 'Biography (English only)'}
                </label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  maxLength={PROFILE_BIO_MAX_LENGTH}
                  className="w-full rounded-xl px-4 py-3 border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-[11px] font-bold focus:border-orange-500 outline-none resize-none transition-all focus:ring-1 focus:ring-orange-500"
                />
                <p className="text-[9px] text-gray-400 italic ml-1">
                  {fr
                    ? 'Rédigez en anglais. La version française est générée automatiquement.'
                    : 'Write in English. The French version is generated automatically.'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { reset(); setIsEditing(false); }}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-black text-[10px] uppercase tracking-widest text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  {fr ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 disabled:bg-gray-400 transition-all"
                >
                  {isSubmitting
                    ? (fr ? 'Mise à jour...' : 'Updating...')
                    : (fr ? 'Enregistrer' : 'Save')}
                </button>
              </div>
            </form>
          )}

          {/* Bottom note */}
          <p className="text-[9px] text-gray-300 dark:text-white/20 uppercase tracking-widest font-bold mt-2">
            {fr ? 'Compte membre' : 'Member Account'}
          </p>

          {/* Critical Actions */}
          {!isEditing && (
            <div className="w-full pt-6 border-t border-gray-100 dark:border-white/10">
              <p className="text-[8px] font-black text-red-400/60 uppercase tracking-[0.3em] mb-3 text-left">
                {fr ? 'Actions critiques' : 'Critical Actions'}
              </p>
              <div className="flex items-center justify-between px-4 py-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                <p className="text-[9px] font-bold text-gray-500 uppercase">{fr ? 'Suppression du compte' : 'Account Termination'}</p>
                <button
                  onClick={onDelete}
                  className="text-[9px] font-black text-red-500 uppercase hover:underline"
                >
                  {fr ? 'Supprimer le compte' : 'Delete Account'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// small helper row for UserProfileView
const MetaRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl">
    <Icon size={13} className="text-orange-500 shrink-0" />
    <div className="text-left overflow-hidden">
      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 truncate">{value || '—'}</p>
    </div>
  </div>
);


// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, loading } = useAuth();
  const { locale, localize } = useLocale();
  const fr = locale === 'fr';
  const L = (english, french) => fr ? french : english;
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [previews, setPreviews] = useState({ profile: null, cover: null });
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [translationNotice, setTranslationNotice] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(localize('/'));
    }
  }, [user, loading, router, localize]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user?._id || user?.role !== 'creator') return;
      try {
        setListingsLoading(true);
        const res = await api.get('/api/listings/public', { params: { creatorId: user._id, language: locale } });
        setListings(res.data.listings || res.data || []);
      } catch (err) {
        console.error('Listings fetch error:', err);
      } finally {
        setListingsLoading(false);
      }
    };
    fetchListings();
  }, [user, locale]);

  const [localizedProfile, setLocalizedProfile] = useState(null);

  useEffect(() => {
    if (!user?._id || locale === 'en') {
      setLocalizedProfile(null);
      return;
    }
    let cancelled = false;
    api.get('/api/users/me', { params: { language: locale } })
      .then((res) => { if (!cancelled) setLocalizedProfile(res.data); })
      .catch(() => { if (!cancelled) setLocalizedProfile(null); });
    return () => { cancelled = true; };
  }, [user?._id, user?.role, locale]);

  const displayUser = localizedProfile ?? user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        displayName: user?.profile?.displayName || '',
        bio: user?.profile?.bio || '',
        country: user?.profile?.country || '',
        city: user?.profile?.city || '',
        language: user?.profile?.language || '',
        websiteLink: user?.profile?.websiteLink || '',
        socialLink: user?.profile?.socialLink || '',
      });
    }
  }, [user, reset, isEditing]);

  const handlePreview = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleDelete = async () => {
    if (confirm(fr ? 'Voulez-vous vraiment supprimer ce compte ? Cette action est irréversible.' : 'Are you sure you want to terminate this account? This action is irreversible.')) {
      try {
        await api.delete('/api/users/delete-account');
        setUser(null);
        router.push(localize('/'));
      } catch (error) {
        setMessage({ type: 'error', text: fr ? 'La suppression a échoué.' : (error.response?.data?.message || 'Delete failed') });
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setMessage({ type: '', text: '' });
      const formData = new FormData();
      // Plain users only expose these four inputs; omitting the rest keeps their stored
      // values untouched (mongoose strips undefined from $set) instead of blanking them.
      const fields = user?.role === 'user'
        ? ['firstName', 'lastName', 'displayName', 'bio']
        : [
          'firstName', 'lastName', 'displayName', 'bio',
          'country', 'city', 'language', 'websiteLink', 'socialLink',
        ];
      fields.forEach((field) => formData.append(field, data[field] || ''));

      const profileFile = document.querySelector('input[name="profileImageCustom"]')?.files[0];
      const coverFile = document.querySelector('input[name="coverImageCustom"]')?.files[0];
      if (profileFile) formData.append('profileImage', profileFile);
      if (coverFile) formData.append('coverImage', coverFile);

      const res = await api.put('/api/users/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser(res.data.user);
      setMessage({ type: 'success', text: fr ? 'PROFIL MIS À JOUR' : 'SYSTEM IDENTITY UPDATED' });
      // The French version is regenerated in the background, so it lags this save.
      setTranslationNotice(fr);
      setIsEditing(false);
      setPreviews({ profile: null, cover: null });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        setTranslationNotice(false);
      }, 5000);
    } catch (error) {
      setMessage({ type: 'error', text: fr ? 'La mise à jour a échoué.' : (error.response?.data?.message || 'Update failed') });
    }
  };

  // ── Loading ──
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f0f]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  // ── ROLE: user → simple design ──
  if (user?.role === 'user') {
    return (
      <UserProfileView
        user={user}
        displayUser={displayUser}
        router={router}
        onDelete={handleDelete}
        fr={fr}
        locale={locale}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        reset={reset}
        message={message}
        translationNotice={translationNotice}
      />
    );
  }

  // ── ROLE: creator / admin → original full design ──
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-[#222] dark:text-gray-200 font-sans selection:bg-orange-100 pb-20">

      {/* ── Cover Image ── */}
      <div className="relative h-[250px] md:h-[300px] w-full overflow-hidden">
        <Image
          src={
            previews.cover ||
            getImageUrl(user?.profile?.coverImage) ||
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000'
          }
          alt="cover"
          fill
          priority
          className="object-cover grayscale-[20%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute top-8 left-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2.5 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
          >
            <FiArrowLeft size={14} /> {L('Return', 'Retour')}
          </button>
        </div>

        {isEditing && (
          <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 backdrop-blur-sm transition-all hover:bg-black/50">
            <div className="flex flex-col items-center gap-2 text-white">
              <FiCamera size={28} />
              <span className="text-[10px] font-black uppercase tracking-widest">{L('Change Cover', 'Modifier la couverture')}</span>
            </div>
            <input
              type="file"
              name="coverImageCustom"
              className="hidden"
              onChange={(e) => handlePreview(e, 'cover')}
              accept="image/*"
            />
          </label>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ── Identity Header ── */}
        <div className="relative -mt-24 flex flex-col md:flex-row items-start md:items-end gap-8 pb-12 border-b border-gray-100 dark:border-white/5">

          {/* Avatar */}
          <div className="relative group">
            <div className="h-44 w-44 relative rounded-[2.5rem] border-[8px] border-white dark:border-[#0f0f0f] bg-gray-100 overflow-hidden shadow-2xl transition-all duration-500 group-hover:rounded-3xl">
              <Image
                src={previews.profile || getImageUrl(user?.profile?.profileImage, 'avatar')}
                alt="avatar"
                fill
                sizes="176px"
                className="object-cover"
                priority
              />
            </div>
            {user?.role === 'creator' && (
              <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white dark:border-[#0f0f0f]">
                <FiCheckCircle size={18} />
              </div>
            )}
            {isEditing && (
              <label className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all rounded-[2.5rem]">
                <FiCamera className="text-white" size={22} />
                <span className="text-white text-[9px] font-black uppercase tracking-widest mt-1">{L('Change', 'Modifier')}</span>
                <input
                  type="file"
                  name="profileImageCustom"
                  className="hidden"
                  onChange={(e) => handlePreview(e, 'profile')}
                  accept="image/*"
                />
              </label>
            )}
          </div>

          {/* Name & Meta */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase dark:text-white leading-none">
                {displayUser?.profile?.displayName || `${user?.firstName} ${user?.lastName}`}
              </h2>
              <div className="px-3 py-1 bg-orange-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                {user?.role}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              <span className="flex items-center gap-2">
                <FiMapPin className="text-orange-500" />
                {user?.profile?.city || L('Unknown', 'Inconnu')}, {localizeCountry(user?.profile?.country, user?.profile?.countryCode, locale) || L('Earth', 'Terre')}
              </span>
              <span className="flex items-center gap-2">
                <Languages className="text-orange-500" size={14} />
                {localizeLanguageName(user?.profile?.language, locale) || L('Global', 'Mondial')}
              </span>
              <span className="text-orange-500 italic lowercase">@{user?.username}</span>
            </div>
          </div>

          {/* Edit / Cancel button */}
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) reset();
              setPreviews({ profile: null, cover: null });
            }}
            className={`px-6 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all flex items-center gap-2 ${isEditing
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-black text-white dark:bg-white dark:text-black hover:bg-orange-500 dark:hover:bg-orange-500 shadow-lg shadow-black/5'
              }`}
          >
            {isEditing ? <><FiX /> {L('CANCEL', 'ANNULER')}</> : <><FiEdit3 /> {L('Edit Profile', 'Modifier le profil')}</>}
          </button>
        </div>

        {/* ── Success / Error Message ── */}
        {message.text && (
          <div
            className={`mt-8 p-4 rounded-xl text-[10px] font-black uppercase flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
          >
            <FiCheck /> {message.text}
          </div>
        )}
        {translationNotice && (
          <p className="mt-3 text-[10px] font-bold text-gray-400 italic">
            Traduction française en cours de mise à jour.
          </p>
        )}

        {/* ── Rejection Notice ── */}
        {user?.creatorRequest?.status === 'rejected' && (
          <div className="mt-8 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl">
            <p className="text-[9px] font-black text-red-500 uppercase flex items-center gap-2 tracking-widest mb-3">
              <FiAlertCircle /> {L('REJECTION NOTICE', 'AVIS DE REFUS')}
            </p>
            <p className="text-[10px] text-gray-400 italic font-medium leading-relaxed">
              &ldquo;{user.creatorRequest.rejectionReason}&rdquo;
            </p>
            <p className="text-[10px] mt-2 text-gray-400 italic font-medium leading-relaxed">
              <span className="font-bold">{L('Additional Details:', 'Détails supplémentaires :')}</span> &ldquo;{user.creatorRequest.additionalReason}&rdquo;
            </p>
          </div>
        )}

        {/* ── About & Links ── */}
        <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-gray-100 dark:border-white/5">

          {/* Links */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                <FiLink className="text-orange-500" /> {L('Links', 'Liens')}
              </h3>
              <div className="grid gap-3">
                {user?.profile?.websiteLink && (
                  <SocialLink icon={Globe} label={L('Official Website', 'Site officiel')} url={user.profile.websiteLink} />
                )}
                {user?.profile?.socialLink && (
                  <SocialLink icon={FiExternalLink} label={L('Portfolio / Social', 'Portfolio / Réseaux sociaux')} url={user.profile.socialLink} />
                )}
                {!user?.profile?.websiteLink && !user?.profile?.socialLink && (
                  <p className="text-[10px] text-gray-400 italic font-bold">{L('No links added yet.', 'Aucun lien ajouté.')}</p>
                )}
              </div>
            </div>

            {/* Role & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4 rounded-2xl">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">{L('Auth Role', 'Rôle')}</p>
                <p className="text-[10px] font-black text-black dark:text-white uppercase">{user?.role}</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4 rounded-2xl">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">{L('Network', 'Réseau')}</p>
                <p className="text-[10px] font-black text-green-500 uppercase">{L('Verified', 'Vérifié')}</p>
              </div>
            </div>
          </div>

          {/* Bio / Edit Form */}
          <div className="lg:col-span-8">
            {!isEditing ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                  <Info className="text-orange-500" size={14} /> {L('Biography', 'Biographie')}
                </h3>
                <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5">
                  <p className="text-sm md:text-base leading-relaxed font-medium text-gray-600 dark:text-gray-400 italic whitespace-pre-wrap">
                    {displayUser?.profile?.bio || L("This profile's biography has not been initialized.", "La biographie de ce profil n'a pas encore été renseignée.")}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-6">
                  <InfoRow label={L('Full Name', 'Nom complet')} value={`${user?.firstName} ${user?.lastName}`} icon={FiUser} fallback={L('UNSET', 'NON DÉFINI')} />
                  <InfoRow label={L('Display Name', 'Nom affiché')} value={displayUser?.profile?.displayName} icon={FiType} fallback={L('UNSET', 'NON DÉFINI')} />
                  <InfoRow label={L('Country', 'Pays')} value={localizeCountry(user?.profile?.country, user?.profile?.countryCode, locale)} icon={FiMapPin} fallback={L('UNSET', 'NON DÉFINI')} />
                  <InfoRow label={L('City', 'Ville')} value={user?.profile?.city} icon={FiMapPin} fallback={L('UNSET', 'NON DÉFINI')} />
                  <InfoRow label={L('Language', 'Langue')} value={localizeLanguageName(user?.profile?.language, locale)} icon={FiGlobe} fallback={L('UNSET', 'NON DÉFINI')} />
                  <InfoRow label={L('Social Link', 'Lien social')} value={user?.profile?.socialLink} icon={FiLink} fallback={L('UNSET', 'NON DÉFINI')} />
                </div>

                {/* Danger Zone */}
                <div className="pt-8 border-t border-gray-100 dark:border-white/5 mt-8">
                  <h3 className="text-[9px] font-black text-red-500/50 uppercase tracking-[0.3em] mb-4">
                    {L('Critical Actions', 'Actions critiques')}
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">{L('Account Termination Protocol', 'Protocole de suppression du compte')}</p>
                    <button
                      onClick={handleDelete}
                      className="text-[9px] font-black text-red-500 uppercase hover:underline"
                    >
                      {L('Delete Account', 'Supprimer le compte')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 animate-in fade-in duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label={L('First Name', 'Prénom')} name="firstName" register={register} placeholder={L('Required', 'Requis')} />
                  <InputField label={L('Last Name', 'Nom')} name="lastName" register={register} placeholder={L('Required', 'Requis')} />
                </div>

                <InputField label={L('Public Display Name', 'Nom public affiché')} name="displayName" register={register} placeholder={L('Visible to public', 'Visible publiquement')} />

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    {L('Biography (English only)', 'Biographie (anglais uniquement)')}
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    maxLength={PROFILE_BIO_MAX_LENGTH}
                    className="w-full rounded-xl px-4 py-3 border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-[11px] font-bold focus:border-orange-500 outline-none resize-none transition-all focus:ring-1 focus:ring-orange-500"
                  />
                  <p className="text-[9px] text-gray-400 italic ml-1">
                    {L(
                      'Write in English. The French version is generated automatically.',
                      'Rédigez en anglais. La version française est générée automatiquement.'
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label={L('Language', 'Langue')} name="language" register={register} placeholder={L('Primary Language', 'Langue principale')} />
                  <InputField label={L('Social Link', 'Lien social')} name="socialLink" register={register} placeholder="https://..." />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cursor-pointer px-12 py-4 bg-orange-500 text-white font-black text-[10px] tracking-[0.3em] hover:bg-orange-600 transition-all disabled:bg-gray-700 uppercase shadow-lg shadow-orange-500/20 rounded-xl"
                  >
                    {isSubmitting ? L('Updating...', 'Mise à jour...') : L('Update Profile', 'Mettre à jour le profil')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ── Creator Listings ── */}
        {user?.role === 'creator' && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100 dark:border-white/5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
                {L('My Listings', 'Mes annonces')} / {listings.length} {L('Units', 'éléments')}
              </h3>
              <span className="px-4 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">
                {L('Active Listings', 'Annonces actives')}
              </span>
            </div>

            {listingsLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {listings.length > 0 ? (
                  listings.map((item) => (
                    <ListingCard key={item._id} item={item} />
                  ))
                ) : (
                  <div className="col-span-full py-24 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-gray-400">
                    <Box size={48} strokeWidth={1} className="opacity-20 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">{L('No active listings found', 'Aucune annonce active')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

const InfoRow = ({ label, value, icon: Icon, fallback = 'UNSET' }) => (
  <div className="group border-b border-gray-100 dark:border-white/5 pb-4 last:border-0">
    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-center gap-3">
      <Icon size={12} className="text-orange-500" />
      <p className="text-[11px] font-black text-black dark:text-gray-200 uppercase truncate">
        {value || fallback}
      </p>
    </div>
  </div>
);

const InputField = ({ label, name, register, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">
      {label}
    </label>
    <input
      {...register(name)}
      placeholder={placeholder}
      className="w-full rounded-xl px-4 py-3 border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-[11px] font-bold focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
    />
  </div>
);

const SocialLink = ({ icon: Icon, label, url }) => (
  <a
    href={url.startsWith('http') ? url : `https://${url}`}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl hover:border-orange-500 transition-all group"
  >
    <div className="p-2.5 bg-gray-50 dark:bg-black/20 rounded-xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
      <Icon size={16} />
    </div>
    <div className="overflow-hidden">
      <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-0.5">{label}</p>
      <p className="text-[11px] font-bold truncate dark:text-gray-200 group-hover:text-orange-500 transition-colors italic">{url}</p>
    </div>
  </a>
);
