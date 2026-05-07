import Link from 'next/link';
import Image from 'next/image';


export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#1a1a18] px-6 text-center">
      
      {/* ২. ইমেজ সেকশন */}
      <div className="relative w-full max-w-md h-64 md:h-80 mb-6">
        <Image
          src="/not-found.png" // 
          alt="404 Error Illustration"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* <h1 className="text-7xl md:text-9xl font-black text-orange-500 italic opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
        404
      </h1> */}
{/* 
      <h2 className="text-3xl font-bold mt-4 text-[#0B1B33] dark:text-white uppercase tracking-tighter">
        Page Not Found
      </h2> */}
      
      <p className="text-zinc-500 dark:text-gray-400 mt-4 max-w-md leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Link 
        href="/" 
        className="mt-8 px-10 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95"
      >
        BACK TO HOME
      </Link>
    </div>
  );
}