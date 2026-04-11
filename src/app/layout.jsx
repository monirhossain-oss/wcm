import { Inter, Poppins, Roboto, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ListingsProvider } from '@/context/ListingsContext';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-poppins' });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-roboto' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata = {
  title: {
    default: 'World Culture Marketplace',
    template: '%s | World Culture Marketplace',
  },
  description: 'Discover and explore global cultural products, craftsmanship, and heritage rituals.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${roboto.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ListingsProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ListingsProvider>
      </body>
    </html>
  );
}