import NavbarLogo from './NavbarLogo';
import CategoryDropdown from './CategoryDropdown';
import MobileDrawer from './MobileDrawer';
import ProfileMenu from './ProfileMenu';
import AuthButtons from './AuthButtons';
import WishlistIcon from './WishlistIcon';
import { menuItems } from './utils';
import LanguageSwitcher from '@/components/LanguageSwitcher';

async function getCategories() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        const [res, frenchRes] = await Promise.all([
          fetch(`${baseUrl}/api/admin/categories`, {
            // Cache categories for 1 hour, revalidate in the background after that.
            // Tune this number based on how often categories actually change.
            next: { revalidate: 3600 },
          }),
          fetch(`${baseUrl}/api/admin/categories?language=fr`, { next: { revalidate: 3600 } }),
        ]);

        if (!res.ok) {
            console.error('Failed to fetch categories:', res.status);
            return [];
        }

        const data = await res.json();
        const fetchedData = Array.isArray(data) ? data : data.data;
        const frenchPayload = frenchRes.ok ? await frenchRes.json() : [];
        const frenchData = Array.isArray(frenchPayload) ? frenchPayload : frenchPayload.data || [];
        const frenchById = new Map(frenchData.map((category) => [String(category._id), category.title]));
        return (fetchedData || []).map((category) => ({ ...category, localizedTitle: frenchById.get(String(category._id)) || category.title }));
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
