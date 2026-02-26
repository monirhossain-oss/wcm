import CookieConsent from '@/components/CookieConsent';
import PublicNavbar from '@/components/PublicNavbar';

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen">
        {children}
        <CookieConsent />
      </main>
    </>
  );
}
