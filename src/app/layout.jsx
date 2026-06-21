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

// Raw HTML string (DB theke asha) ke <head> er moddhe valid child element e
// convert kora hocche - kono wrapper <div> na, karon <head> er child hisheve
// shudhu <meta>, <script>, <link>, <style>, <title>, <base> allowed.
function parseHeadTags(rawHtml) {
  if (!rawHtml) return [];

  const elements = [];
  const tagRegex = /<script([^>]*)>([\s\S]*?)<\/script>|<(meta|link)([^>]*)\/?>/gi;

  let match;
  let index = 0;

  while ((match = tagRegex.exec(rawHtml)) !== null) {
    if (match[1] !== undefined) {
      const attrsString = match[1] || '';
      const scriptContent = match[2] || '';
      const attrs = parseAttributes(attrsString);

      if (attrs.src) {
        elements.push(
          <script key={`script-${index++}`} {...attrs} />
        );
      } else {
        elements.push(
          <script
            key={`script-${index++}`}
            {...attrs}
            dangerouslySetInnerHTML={{ __html: scriptContent }}
          />
        );
      }
    } else if (match[3]) {
      const tagName = match[3].toLowerCase();
      const attrsString = match[4] || '';
      const attrs = parseAttributes(attrsString);

      if (tagName === 'meta') {
        elements.push(<meta key={`meta-${index++}`} {...attrs} />);
      } else if (tagName === 'link') {
        elements.push(<link key={`link-${index++}`} {...attrs} />);
      }
    }
  }

  return elements;
}

function parseAttributes(attrsString) {
  const attrs = {};
  const attrRegex = /([a-zA-Z-]+)(?:\s*=\s*["']([^"']*)["'])?/g;
  let attrMatch;

  while ((attrMatch = attrRegex.exec(attrsString)) !== null) {
    const key = attrMatch[1];
    const value = attrMatch[2];
    if (!key) continue;

    if (key === 'async' || key === 'defer') {
      attrs[key] = true;
    } else {
      attrs[key] = value !== undefined ? value : true;
    }
  }

  return attrs;
}

export async function generateMetadata() {
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

export default async function RootLayout({ children }) {
  let verifications = [];
  try {
    verifications = await getVerifications();
  } catch (error) {
    console.error('Verification fetch error:', error);
    verifications = [];
  }

  const verificationHtml = verifications
    .map((v) => v.rawHtml)
    .filter(Boolean)
    .join('\n');

  const headElements = parseHeadTags(verificationHtml);

  return (
    <html lang="en">
      <head>{headElements}</head>
      <body
        className={`${inter.variable} ${poppins.variable} ${roboto.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ListingsProvider>
          <AuthProvider>{children}</AuthProvider>
        </ListingsProvider>
      </body>
    </html>
  );
}