import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer';
import PublicNavbar from '@/components/PublicNavbar';

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen pt-20">
        {children}
        <CookieConsent />
      </main>
      <div className='mt-10'>
        <Footer/>
      </div>
    </>
  );
}