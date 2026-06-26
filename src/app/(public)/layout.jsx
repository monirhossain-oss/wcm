import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import VisitorTracker from '@/components/VisitorTracker';
import PublicNavbar from '@/components/navbar/PublicNavbar';

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
      <div className="mt-4">
        <Footer />
      </div>
    </>
  );
}
