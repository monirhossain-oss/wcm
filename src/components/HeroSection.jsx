import HeroSlider from "./HeroSlider";
import HeroActions from "./HeroActions";

async function getSliders() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${API_BASE}/api/sliders`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Slider fetch failed:", error);
    return [];
  }
}

export default async function HeroSection() {
  const initialSliders = await getSliders();

  return (
    <section className="relative w-full flex flex-col md:flex-row items-center justify-between overflow-hidden px-6 min-h-[80vh] max-w-7xl mx-auto">
      {/* Left Side: Text + CTA */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center text-center md:text-left pt-10 md:pt-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">
          Join a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F57C00] to-[#FFB347]">growing global community</span>
          <br className="hidden lg:block" /> of <span className="text-[#F57C00]">artists & creators</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl mt-2 max-w-lg text-gray-700 dark:text-gray-300 mx-auto md:mx-0">
          WCM helps you gain visibility and connect with a global audience.
        </p>
        <div className="md:mt-8 z-[50] flex flex-wrap gap-4 justify-center md:justify-start">
          <HeroActions />
        </div>
      </div>
      {/* Right Side: Slider */}
      <div className="relative w-full h-[300px] z-0 sm:h-[350px] md:h-[450px] flex md:w-1/2 flex-shrink-0 mt-10 md:mt-0">
        <HeroSlider initialSliders={initialSliders} />
      </div>
    </section>
  );
}