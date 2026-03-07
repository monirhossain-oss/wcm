import HeroSlider from "./HeroSlider";
import HeroActions from "./HeroActions";

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] md:h-screen w-full flex items-center justify-center overflow-hidden">
      {/* ব্যাকগ্রাউন্ড স্লাইডার */}
      <HeroSlider />

      {/* কন্টেন্ট লেয়ার */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white">

        {/* Title: ছোট এবং পাওয়ারফুল */}
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter drop-shadow-2xl leading-[1.1]">
          Discover Cultural <br className="hidden sm:block" />  <span className="text-[#F57C00]">Worldwide</span>
        </h1>

        {/* Description: ছোট এবং ক্লিয়ার */}
        <p className="mt-4 md:mt-6 max-w-xl mx-auto text-base sm:text-lg md:text-xl text-gray-200 font-medium drop-shadow-md opacity-90 leading-relaxed">
          Explore authentic products, stories, and experiences from creators around the world.
        </p>

        {/* Responsive CTA Buttons */}
        <div className="mt-8 md:mt-10">
          <HeroActions />
        </div>
      </div>
    </section>
  );
}