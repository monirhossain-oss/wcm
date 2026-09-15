import NavbarLogo from './NavbarLogo';
import CategoryDropdown from './CategoryDropdown';
import MobileDrawer from './MobileDrawer';
import ProfileMenu from './ProfileMenu';
import AuthButtons from './AuthButtons';
import WishlistIcon from './WishlistIcon';
import { menuItems } from './utils';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getPublishedLanguageCodes } from '@/lib/seo/publishedLanguages';

const readCategories = async (response) => {
    if (!response?.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload) ? payload : payload.data || [];
};

async function getCategories() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        // Which languages are live comes from LanguageConfiguration, never from a literal: this
        // used to ask for French by name, so a newly published language would reach every page
        // except the one menu visitors actually navigate by.
        const locales = (await getPublishedLanguageCodes()).filter((code) => code !== 'en');
        const [res, ...localizedResponses] = await Promise.all([
          fetch(`${baseUrl}/api/admin/categories`, {
            // Cache categories for 1 hour, revalidate in the background after that.
            // Tune this number based on how often categories actually change.
            next: { revalidate: 3600 },
          }),
          ...locales.map((code) => fetch(`${baseUrl}/api/admin/categories?language=${encodeURIComponent(code)}`, { next: { revalidate: 3600 } })),
        ]);

        if (!res.ok) {
            console.error('Failed to fetch categories:', res.status);
            return [];
        }

        const fetchedData = await readCategories(res);
        const localizedTitleMaps = await Promise.all(
            localizedResponses.map(async (response) => new Map(
                (await readCategories(response)).map((category) => [String(category._id), category.title])
            ))
        );

        return (fetchedData || []).map((category) => ({
            ...category,
            // A translation that is still unreviewed or unpublished simply leaves the master title.
            localizedTitles: Object.fromEntries(locales.map((code, index) => [
                code,
                localizedTitleMaps[index].get(String(category._id)) || category.title,
            ])),
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

const PublicNavbar = async () => {
    const categories = await getCategories();

    return (
        <nav className="fixed top-0 left-0 w-full bg-white dark:bg-[#0a0a0a] z-50 border-b border-gray-100 dark:border-gray-900">
            <div className="flex items-center justify-between max-w-7xl mx-auto px-4 md:px-6 h-20">

                {/* ── Left side: Hamburger (client, mobile only) + Logo (server, static) ── */}
                <div className="flex items-center gap-3">
                    <MobileDrawer categories={categories} menuItems={menuItems} />
                    <NavbarLogo />
                </div>

                {/* ── Center Menu — Desktop only ── */}
                <div className="flex-1 flex justify-center">
                    <div className="hidden md:flex space-x-6 items-center">
                        <CategoryDropdown categories={categories} menuItems={menuItems} />
                    </div>
                </div>

                {/* ── Right Side ── */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    <WishlistIcon />
                    <LanguageSwitcher />
                    <ProfileMenu />
                    <AuthButtons />
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
