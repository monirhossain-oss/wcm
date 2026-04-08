import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer';
import PublicNavbar from '@/components/PublicNavbar';
import Analytics from '@/components/Analytics';
import VisitorTracker from '@/components/VisitorTracker';

export default function PublicLayout({ children }) {
  return (
    <>
      <Analytics />
      <VisitorTracker />

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
