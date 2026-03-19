import HeroSlider from "./HeroSlider";
import HeroActions from "./HeroActions";
export default function HeroSection() {
  return (
    <section className="relative w-full flex flex-col md:flex-row items-center justify-center overflow-hidden px-6">

      {/* Left Side: Slider (Client Component) */}
      <div className="relative hidden md:flex w-full md:w-1/2 h-64 md:h-[80vh] flex-shrink-0">
        <HeroSlider />
      </div>

      {/* Right Side: Text + CTA */}
      <div className="relative z-10 w-full md:w-1/2 mt-6 md:mt-0 md:pl-12 flex flex-col justify-center text-left">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold leading-snug md:leading-tight 
text-center md:text-left
text-gray-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg">

          Join a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F57C00] to-[#FFB347]">
            growing global community{" "}
          </span>
          <br className="hidden sm:block" />
          of <span className="text-[#F57C00]">artists & creators</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl mt-2 max-w-lg leading-relaxed
      text-gray-800 dark:text-gray-300">
          WCM helps you gain visibility and connect with a global audience.
          You keep full ownership of your work.
        </p>

        {/* CTA Buttons */}
        <div className="mt-2 flex flex-wrap gap-4">
          <HeroActions />
        </div>

      </div>
    </section>
  );
}