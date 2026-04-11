'use client';
import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useListings } from '@/context/ListingsContext';
import ListingCard from '@/components/ListingCard';
import { Search, ChevronLeft, ChevronRight, Loader2, MapPin, Zap } from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});


const continentMapping = {
  "Asia": [
    "Afghanistan", "Armenia", "Azerbaijan", "Bangladesh", "Bhutan", "Brunei", "Cambodia", "China",
    "Georgia", "India", "Indonesia", "Japan", "Kazakhstan", "Kyrgyzstan", "Laos", "Malaysia",
    "Maldives", "Mongolia", "Myanmar", "Nepal", "North Korea", "Pakistan", "Philippines",
    "Singapore", "South Korea", "Sri Lanka", "Taiwan", "Tajikistan", "Thailand", "Timor-Leste",
    "Turkmenistan", "Uzbekistan", "Vietnam"
  ],
  "Middle East": [
    "Bahrain", "Cyprus", "Iran", "Iraq", "Israel", "Jordan", "Kuwait", "Lebanon", "Oman",
    "Palestine", "Qatar", "Saudi Arabia", "Syria", "Turkey", "United Arab Emirates", "Yemen"
  ],
  "Europe": [
    "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria",
    "Croatia", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
    "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia", "Liechtenstein", "Lithuania",
    "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia",
    "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia",
    "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Vatican City"
  ],
  "Africa": [
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Cape Verde",
    "Central African Republic", "Chad", "Comoros", "Congo", "DR Congo", "Djibouti", "Egypt",
    "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea",
    "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi",
    "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria",
    "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia",
    "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
  ],
  "North America": [
    "Canada", "United States", "Greenland", "Bermuda"
  ],
  "Latin America": [
    "Antigua and Barbuda", "Argentina", "Bahamas", "Barbados", "Belize", "Bolivia", "Brazil",
    "Chile", "Colombia", "Costa Rica", "Cuba", "Dominica", "Dominican Republic", "Ecuador",
    "El Salvador", "Grenada", "Guatemala", "Guyana", "Haiti", "Honduras", "Jamaica", "Mexico",
    "Nicaragua", "Panama", "Paraguay", "Peru", "Puerto Rico", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Suriname", "Trinidad and Tobago",
    "Uruguay", "Venezuela"
  ],
  "Oceania": [
    "Australia", "Fiji", "Kiribati", "Marshall Islands", "Micronesia", "Nauru", "New Zealand",
    "Palau", "Papua New Guinea", "Samoa", "Solomon Islands", "Tonga", "Tuvalu", "Vanuatu"
  ]
};

const DiscoverContent = () => {
  const { cachedListings } = useListings();
  const searchParams = useSearchParams();
  const urlContinent = searchParams.get('continent');
  const urlCategory = searchParams.get('category');
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [regions, setRegions] = useState(['All Regions']);
  const [activeCategory, setActiveCategory] = useState(urlCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('Popularity');
  const [selectedRegion, setSelectedRegion] = useState(urlContinent || 'All Regions');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const limit = 12;
  const observer = useRef();
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchMeta = async () => {
      const CACHE_KEY = 'meta_data_cache';
      const CACHE_DURATION = 30;

      try {
        const cachedMeta = sessionStorage.getItem(CACHE_KEY);
        if (cachedMeta) {
          const { data, timestamp } = JSON.parse(cachedMeta);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setCategories(['All', ...data.categories.map((c) => c.title)]);
            // এখানে পরিবর্তন: মহাদেশের নামগুলো ড্রপডাউনে যুক্ত করা হয়েছে
            setRegions(['All Regions', ...Object.keys(continentMapping)]);
            return;
          }
        }

        const res = await api.get('/api/listings/meta-data');
        const catTitles = res.data.categories.map((c) => c.title);

        setCategories(['All', ...catTitles]);
        // ড্রপডাউনে মহাদেশের নাম দেখা যাবে
        setRegions(['All Regions', ...Object.keys(continentMapping)]);

        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
          data: res.data,
          timestamp: Date.now()
        }));
      } catch (err) { console.error('Meta fetch error:', err); }
    };
    fetchMeta();
  }, []);
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    // যদি ক্যাশ থাকে এবং ইউআরএল-এ মহাদেশ বা ক্যাটাগরি না থাকে, তবেই ক্যাশ দেখাবে
    if (cachedListings && cachedListings.length > 0 && !urlContinent && !urlCategory) {
      setListings(cachedListings);
      setLoading(false);
    } else {
      fetchListings(true);
    }
  }, [urlContinent, urlCategory]); // এখানে urlCategory যোগ করে দিন

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchListings = useCallback(
    async (isInitial = false) => {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      try {
        // ১. যদি কোনো মহাদেশ সিলেক্ট থাকে, তবে বড় লিমিট (২৫০) ব্যবহার করব সব ডাটা পাওয়ার জন্য
        const fetchLimit = selectedRegion !== 'All Regions' ? 250 : limit;

        let url = `/api/listings/public?limit=${fetchLimit}&offset=${isInitial ? 0 : offset}`;
        if (activeCategory !== 'All') url += `&category=${encodeURIComponent(activeCategory)}`;
        if (debouncedSearch) url += `&search=${debouncedSearch}`;

        // নোট: এখানে আমরা &region= যোগ করছি না যাতে ইউআরএল আপনার সফল ইউআরএলটির মতো থাকে

        const res = await api.get(url);
        let fetchedListings = res.data.listings || [];

        // ২. ফ্রন্টএন্ড ফিল্টারিং: যদি মহাদেশ সিলেক্ট করা থাকে, তবে জাভাস্ক্রিপ্ট দিয়ে ফিল্টার করব
        if (selectedRegion !== 'All Regions') {
          const targetCountries = continentMapping[selectedRegion] || [];

          fetchedListings = fetchedListings.filter(item => {
            const itemRegion = (item.country || item.region || "").toLowerCase();
            return targetCountries.some(c => c.toLowerCase() === itemRegion);
          });
        }

        const { hasMore: more } = res.data;
        setListings((prev) => (isInitial ? fetchedListings : [...prev, ...fetchedListings]));
        setHasMore(more);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeCategory, debouncedSearch, sortBy, selectedRegion, offset]
  );

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchListings(true);
  }, [activeCategory, debouncedSearch, sortBy, selectedRegion]);

  useEffect(() => {
    if (offset > 0) fetchListings(false);
  }, [offset]);

  const lastElementRef = useCallback((node) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) setOffset((prev) => prev + limit);
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  const slide = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      scrollRef.current.scrollTo({ left: direction === 'left' ? scrollLeft - 200 : scrollLeft + 200, behavior: 'smooth' });
    }
  };

  const SkeletonCard = () => (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-5/4 bg-zinc-100 dark:bg-white/5" />
      <div className="h-4 bg-zinc-100 dark:bg-white/5 w-3/4" />
      <div className="h-3 bg-zinc-100 dark:bg-white/5 w-1/2" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors pb-20">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="sticky top-20 z-40 bg-white/95 dark:bg-[#0a0a0a] border-b border-zinc-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
          {/* Search Container Wrapper */}
          <div className="relative flex items-center w-full bg-zinc-100 dark:bg-white/5 rounded-full p-1.5 transition-all focus-within:ring-2 focus-within:ring-blue-500/50">

            {/* Left Side: Search Icon + Input */}
            <div className="flex items-center flex-1 pl-3">
              <Search className="text-zinc-400 shrink-0" size={18} />
              <input
                type="text"
                placeholder="Search culture, art, traditions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none px-3 py-2 text-sm outline-none dark:text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Vertical Separator (Behance Style) */}
            <div className="w-[1px] h-6 bg-zinc-300 dark:bg-zinc-700 mx-2" />

            {/* Right Side: Region Dropdown Container */}
            <div className="relative" >
              <div
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-white/10 rounded-full transition-all min-w-[120px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-blue-500" />
                  <span className="text-[11px] font-bold uppercase tracking-tight text-zinc-700 dark:text-zinc-200 truncate max-w-[80px]">
                    {selectedRegion}
                  </span>
                </div>
                <svg
                  className={`w-3 h-3 text-zinc-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#121212] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    Filter by Region
                  </div>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {regions.map((r) => (
                      <div
                        key={r}
                        onClick={() => {
                          setSelectedRegion(r);
                          setOpen(false);
                        }}
                        className={`px-4 py-2.5 text-xs font-bold uppercase cursor-pointer transition-all flex items-center justify-between
                ${selectedRegion === r
                            ? "bg-blue-500 text-white"
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5"
                          }`}
                      >
                        {r}
                        {selectedRegion === r && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Categories */}
            <div className="relative w-full flex items-center overflow-hidden md:flex-1 md:order-2">
              <button onClick={() => slide('left')} className="p-1 hover:text-orange-500 shrink-0">
                <ChevronLeft size={18} />
              </button>
              <div
                ref={scrollRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar px-2 scroll-smooth"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap ${activeCategory === cat
                      ? 'bg-orange-500 text-white'
                      : 'text-zinc-500 bg-zinc-50 dark:bg-white/5'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button onClick={() => slide('right')} className="p-1 hover:text-orange-500 shrink-0">
                <ChevronRight size={18} />
              </button>
            </div>


          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-6 py-2">
        {/* যদি লোডিং না হয় এবং লিস্টিং খালি থাকে */}
        {!loading && listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-zinc-100 dark:bg-white/5 p-6 rounded-full mb-4">
              <Search size={40} className="text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
              No listings found
            </h3>
            <p className="text-zinc-500 max-w-xs mt-2">
              Try changing your filters or search query.
            </p>

            {/* একটি রিসেট বাটন যোগ করতে পারেন (অপশনাল) */}
            <button
              onClick={() => {
                setActiveCategory('All');
                setSelectedRegion('All Regions');
                setSearchQuery('');
              }}
              className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-bold uppercase hover:bg-orange-600 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* যদি লিস্টিং থাকে তবে ম্যাপ হবে */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {listings.map((item, index) => (
              <div key={item._id} ref={index === listings.length - 1 ? lastElementRef : null}>
                <ListingCard item={item} />
              </div>
            ))}
            {(loading || loadingMore) && [...Array(4)].map((_, i) => <SkeletonCard key={`more-${i}`} />)}
          </div>
        )}
      </div>
    </div>
  );
};
export default function DiscoverPage() {
  return (
    // এখানে Suspense ব্যবহার করা হয়েছে যাতে build error না আসে
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-orange-500" size={40} />
          <p className="text-sm text-zinc-500 font-medium">Loading Discover...</p>
        </div>
      </div>
    }>
      <DiscoverContent />
    </Suspense>
  );
}