import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import VisitorTracker from '@/components/VisitorTracker';
import PublicNavbar from '@/components/navbar/PublicNavbar';
import { LocaleProvider } from '@/context/LocaleContext';
import LanguageSuggestion from '@/components/LanguageSuggestion';

export default function PublicLayout({ children }) {
  return (
    <LocaleProvider>
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
      <LanguageSuggestion />
    </LocaleProvider>
  );
}
