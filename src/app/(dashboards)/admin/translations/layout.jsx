import TranslationNav from './_components/TranslationNav';

export const metadata = { title: 'Translation Centre' };

export default function TranslationCentreLayout({ children }) {
  return (
    <div className="space-y-6 pb-16">
      <TranslationNav />
      {children}
    </div>
  );
}
