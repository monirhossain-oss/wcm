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

// ── Allowed tags only (valid <head> children) ──
const ALLOWED_TAGS = ['meta', 'link', 'script', 'title', 'style', 'base'];

// Raw HTML string (DB theke asha) ke <head> er moddhe valid child element e
// convert kora hocche - kono wrapper <div> na, karon <head> er child hisheve
// shudhu <meta>, <script>, <link>, <style>, <title>, <base> allowed.
function parseHeadTags(rawHtml) {
  if (!rawHtml) return [];

  const elements = [];
  let index = 0;

  // Matches: <tag attrs>content</tag>  OR  <tag attrs/>  OR  <tag attrs>
  const tagRegex = /<(meta|link|script|title|style|base)((?:\s+[a-zA-Z-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*(\/?)>(?:([\s\S]*?)<\/\1>)?/gi;

  let match;
  while ((match = tagRegex.exec(rawHtml)) !== null) {
    const tagName = match[1].toLowerCase();
    const attrsString = match[2] || '';
    const innerContent = match[4] || '';

    if (!ALLOWED_TAGS.includes(tagName)) continue;

    const attrs = parseAttributes(attrsString);
    const key = `${tagName}-${index++}`;

    switch (tagName) {
      case 'meta':
        elements.push(<meta key={key} {...attrs} />);
        break;

      case 'link':
        elements.push(<link key={key} {...attrs} />);
        break;

      case 'base':
        elements.push(<base key={key} {...attrs} />);
        break;

      case 'title':
        elements.push(<title key={key}>{innerContent}</title>);
        break;

      case 'style':
        elements.push(
          <style key={key} {...attrs} dangerouslySetInnerHTML={{ __html: innerContent }} />
        );
        break;

      case 'script':
        if (attrs.src) {
          // External script — no inline content needed
          elements.push(<script key={key} {...attrs} />);
        } else if (innerContent.trim()) {
          // Inline script with content
          elements.push(
            <script key={key} {...attrs} dangerouslySetInnerHTML={{ __html: innerContent }} />
          );
        } else {
          elements.push(<script key={key} {...attrs} />);
        }
        break;

      default:
        break;
    }
  }

  return elements;
}

function parseAttributes(attrsString) {
  const attrs = {};
  if (!attrsString) return attrs;

  // Matches: key="value" | key='value' | key (boolean attr)
  const attrRegex = /([a-zA-Z-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
  let attrMatch;

  while ((attrMatch = attrRegex.exec(attrsString)) !== null) {
    const key = attrMatch[1];
    const value = attrMatch[2] !== undefined ? attrMatch[2] : attrMatch[3];
    if (!key) continue;

    // React-style boolean attributes
    if (key === 'async' || key === 'defer' || key === 'nomodule' || key === 'noModule') {
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
      <head suppressHydrationWarning>{headElements}</head>
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