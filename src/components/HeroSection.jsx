// HeroSection.jsx
import dynamic from 'next/dynamic';

// Client-only components
const HeroSlider = dynamic(() => import('./HeroSlider'), { ssr: false });
const HeroActions = dynamic(() => import('./HeroActions'), { ssr: false });
const HeroFilters = dynamic(() => import('./HeroFilters'), { ssr: false });

export default function HeroSection({ filters = {} }) {
  // Server component থেকে শুধুমাত্র initial filters পাঠানো যাবে
  const handleFilterChange = (id, value) => {
    console.log('Filter changed:', id, value);
    // চাইলে এখানে API call করে filtered products fetch করতে পারেন
  };

  return (
    <section className="relative overflow-hidden flex items-center transition-all duration-500">

      {/* Client Slider */}
      <HeroSlider />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex flex-col items-center text-center w-full">

        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl leading-tight">
          Discover <br /> culture <span className="text-[#F57C00]">worldwide</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-100 font-medium drop-shadow-md">
          Explore authentic products, stories, and experiences from creators around the world —
          crafted with culture, passion, and purpose.
        </p>

        {/* Client Auth Buttons */}
        <HeroActions />
      </div>
    </section>
  );
}