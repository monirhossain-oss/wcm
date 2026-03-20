import HeroSlider from "./HeroSlider";
import HeroActions from "./HeroActions";

export default function HeroSection() {
  return (
    <section className="relative w-full flex flex-col md:flex-row items-center justify-between overflow-hidden px-6 min-h-[80vh] max-w-7xl mx-auto">

      {/* Left Side: Text + CTA */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center text-center md:text-left pt-10 md:pt-0">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white drop-shadow-sm">
          Join a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F57C00] to-[#FFB347]">
            growing global community{" "}
          </span>
          <br className="hidden lg:block" />
          of <span className="text-[#F57C00]">artists & creators</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl mt-2 max-w-lg leading-relaxed text-gray-700 dark:text-gray-300 mx-auto md:mx-0">
          WCM helps you gain visibility and connect with a global audience.
          You keep full ownership of your work.
        </p>

        {/* CTA Buttons */}
        <div className=" md:mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
          <HeroActions />
        </div>
      </div>

      {/* Right Side: Slider (Client Component) */}
      <div className="relative w-full hidden md:flex md:w-1/2 md:h-[450px] flex-shrink-0 mt-10 md:mt-0">
        <HeroSlider />
      </div>

    </section>
  );
}