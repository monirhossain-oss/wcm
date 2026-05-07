import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#1a1a18] px-6 text-center">
      <h1 className="text-9xl font-black text-orange-500 italic">404</h1>
      <h2 className="text-3xl font-bold mt-4 text-[#0B1B33] dark:text-white uppercase">
        Page Not Found
      </h2>
      <p className="text-zinc-500 dark:text-gray-400 mt-4 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        href="/" 
        className="mt-8 px-8 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20"
      >
        BACK TO HOME
      </Link>
    </div>
  );
}