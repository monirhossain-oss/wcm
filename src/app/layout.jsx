import Script from 'next/script';
import { Inter, Poppins, Roboto, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ListingsProvider } from '@/context/ListingsContext';
import { getVerifications } from '@/lib/api';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-roboto',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export async function generateMetadata() {
  try {
    const verifications = await getVerifications();

    const other = {};
    verifications.forEach((v) => {
      other[v.metaName] = v.content;
    });

    return {
      title: {
        default: 'World Culture Marketplace',
        template: '%s | World Culture Marketplace',
      },
      description:
        'Discover and explore global cultural products, craftsmanship, and heritage rituals.',
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: '/',
      },
      robots: {
        index: true,
        follow: true,
      },
      other,
    };
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return {
      title: {
        default: 'World Culture Marketplace',
        template: '%s | World Culture Marketplace',
      },
      description:
        'Discover and explore global cultural products, craftsmanship, and heritage rituals.',
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: '/',
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${roboto.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W5EKQBJNVB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W5EKQBJNVB');
          `}
        </Script>

        <ListingsProvider>
          <AuthProvider>{children}</AuthProvider>
        </ListingsProvider>
      </body>
    </html>
  );
}