import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer';
import PublicNavbar from '@/components/PublicNavbar';
import Analytics from '@/components/Analytics';

export default function PublicLayout({ children }) {
  return (
    <>
      <Analytics />

      <PublicNavbar />
      <main className="min-h-screen pt-20">
        {children}
        <CookieConsent />
      </main>
      <div className="mt-10">
        <Footer />
      </div>
    </>
  );
}
