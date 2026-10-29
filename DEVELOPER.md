# Client Developer Notes

## Purpose

This document is the frontend reference for `wcm-client`, the Next.js App Router application for World Culture Marketplace. It covers the current route structure, layouts, shared components, state providers, API dependencies, and the practical file map you need before changing UI or client-side data flow.

The client is tightly coupled to the Express API in `wcm-server`. Many pages fetch directly with `axios` or `fetch` instead of using centralized services, so frontend work usually requires tracing the matching backend route/controller at the same time.

## Stack

- Next.js `16` App Router
- React `19`
- Tailwind CSS `4`
- Axios for authenticated/client-side API calls
- `react-hook-form` for complex forms
- `react-hot-toast` and `sweetalert2` for feedback/confirmations
- `recharts` for dashboard charts
- `@hello-pangea/dnd` for category ordering
- `react-easy-crop` for creator listing image cropping

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run start
```

## Required Environment

At minimum, the client expects:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Additional behavior depends on these values:

- `NEXT_PUBLIC_API_BASE_URL`: used by most pages/components for API requests and image URL construction.
- `NEXT_PUBLIC_SITE_URL`: used by root metadata and sitemap generation.
- `NEXT_PUBLIC_API_URL`: still referenced in `src/app/(public)/how-it-works/page.jsx`; this is inconsistent with the dominant `NEXT_PUBLIC_API_BASE_URL` pattern.

## Runtime Structure

### Root layout

File: `src/app/layout.jsx`

Responsibilities:

- Loads global fonts.
- Applies `globals.css`.
- Wraps the app with:
  - `ListingsProvider`
  - `AuthProvider`
- Defines site-wide metadata defaults.

### Public layout

File: `src/app/(public)/layout.jsx`

Responsibilities:

- Renders:
  - `Analytics`
  - `VisitorTracker`
  - `PublicNavbar`
  - `CookieConsent`
  - `Footer`
- Wraps all public pages with shared navigation and tracking.

### Admin dashboard layout

File: `src/app/(dashboards)/admin/layout.jsx`

Responsibilities:

- Client-side role guard via `useAuth`.
- Redirects non-admin users to `/`.
- Renders admin sidebar and header.
- Current admin navigation:
  - `/admin`
  - `/admin/users`
  - `/admin/requests`
  - `/admin/listings`
  - `/admin/listings/promoted`
  - `/admin/transactions`
  - `/admin/logs`
  - `/admin/tags`
  - `/admin/region`
  - `/admin/tradition`
  - `/admin/categories`
  - `/admin/manage-slider`
  - `/admin/blogs`
  - `/admin/create-blog`
  - `/admin/faq`
  - `/admin/seo-settings`
  - `/admin/theme/*`

### Creator dashboard layout

File: `src/app/(dashboards)/creator/layout.jsx`

Responsibilities:

- Client-side role guard via `useAuth`.
- Redirects non-creators to `/`.
- Renders creator sidebar and header.
- Current creator navigation:
  - `/creator`
  - `/creator/promotions`
  - `/creator/transactions`
  - `/creator/listings`
  - `/creator/add`

## State, Hooks, Services, Utilities

### Context

- `src/context/AuthContext.jsx`
  - Fetches `/api/users/me` on load.
  - Exposes `user`, `loading`, `registerUser`, `loginUser`, `logoutUser`, `setUser`.
  - Uses cookie-based auth with `withCredentials`.
- `src/context/ListingsContext.jsx`
  - Lightweight in-memory shared listing cache holder.

### Hook

- `src/hooks/useExploreQuery.js`
  - Reads and writes the catch-all `/explore/[[...filters]]` URL format.
  - Encodes category, continent, and search terms into path segments.

### Service

- `src/services/faqService.js`
  - `getAllFaqs`
  - `createFaq`
  - `updateFaq`
  - `deleteFaq`

### Client utilities

- `src/lib/cropImage.js`
  - Crops uploaded listing image blobs before submission.
- `src/lib/imageHelper.js`
  - Normalizes backend-uploaded or absolute image paths.
  - Falls back to `/default-avatar.png` or `/fallback-image.png`.

## Route Inventory

### Root app files

- `src/app/layout.jsx`: root layout and metadata.
- `src/app/globals.css`: global styling.
- `src/app/robots.js`: robots config.
- `src/app/sitemap.js`: sitemap generation using public listing and creator API data.
- `src/app/favicon.ico`: favicon asset.

### Public pages

- `src/app/(public)/page.jsx`
  - Home page.
  - Composes `HeroSection`, `WhyWorldCulture`, `CuratedCollections`, `FeaturesSection`, `TrendingListings`, `PopularCreators`.

- `src/app/(public)/about-us/page.jsx`
  - Static marketing/about page.
  - Composes all `components/about/*` sections.
  - Uses SEO fetch in `generateMetadata()`.

- `src/app/(public)/advertising-policy/page.jsx`
  - Static policy page for ads/promotions.
  - Uses `components/Advertising/*`.

- `src/app/(public)/become-creator/page.jsx`
  - Creator application form for regular users.
  - Uses category fetch from `/api/admin/categories`.
  - Submits to `/api/users/become-creator`.
  - Includes country/city selection and image preview logic.

- `src/app/(public)/blogs/page.jsx`
  - Blog landing page.
  - Renders `BlogCard`.
  - Uses SEO metadata fetch for blog page.

- `src/app/(public)/blogs/[id]/page.jsx`
  - Blog details page.
  - Fetches `/api/blogs/:id` and `/api/blogs/:id/comments`.
  - Supports comment create/reply/delete for authenticated users.

- `src/app/(public)/boost-terms-and-ppc/page.jsx`
  - Static explainer page for boost and PPC products.
  - Composes all `components/boost-terms-and-ppc/*`.

- `src/app/(public)/contact/page.jsx`
  - Contact page.
  - Renders `ContactClient`.
  - Uses SEO metadata fetch.

- `src/app/(public)/cookie-policy/page.jsx`
  - Static cookie policy.

- `src/app/(public)/creator-terms-and-conditions/page.jsx`
  - Static creator terms page.
  - Composes `components/creators-terms/*` plus `AccountStatusSection`.

- `src/app/(public)/creators/page.jsx`
  - Public creator discovery page.
  - Fetches SEO plus creator/category data server-side.
  - Renders `CreatorsClient`.

- `src/app/(public)/creators/CreatorsClient.jsx`
  - Client-side creator filtering and rendering logic.

- `src/app/(public)/creators/CreatorCard.jsx`
  - Creator card UI used by creator discovery.

- `src/app/(public)/creators/CustomDropdown.jsx`
  - Custom dropdown UI used in creator filtering.

- `src/app/(public)/cultures/page.jsx`
  - Currently static placeholder/simple page.

- `src/app/(public)/explore/[[...filters]]/page.jsx`
  - Main server entry for the explore route.
  - Builds metadata from SEO.
  - Parses URL segments and passes normalized state to `ExploreClient`.

- `src/app/(public)/explore/ExploreClient.jsx`
  - Main client-side explore experience.
  - Works with `useExploreQuery`, listing filters, and public listing API fetch.

- `src/app/(public)/faqUs/page.jsx`
  - FAQ page.
  - Uses `FaqSection` and `FaqContact`.
  - Uses SEO metadata fetch.

- `src/app/(public)/favorites/page.jsx`
  - Authenticated favorite listings page.
  - Fetches `/api/listings/favorites`.
  - Uses `FavoriteButton` and `CreatorName`.

- `src/app/(public)/how-it-works/page.jsx`
  - Static informational page.
  - Uses SEO metadata fetch.
  - Note: this file uses `NEXT_PUBLIC_API_URL`, not `NEXT_PUBLIC_API_BASE_URL`.

- `src/app/(public)/listings/[id]/page.jsx`
  - Listing details route entry.
  - Fetches listing and related data, then renders `ListingDetailsClient`.

- `src/app/(public)/listings/ListingDetailsClient.jsx`
  - Main listing detail UI.
  - Handles favorite state, click tracking, related content, and listing presentation.

- `src/app/(public)/privacy-policy/page.jsx`
  - Static privacy policy.

- `src/app/(public)/products/page.jsx`
  - Currently simple/static page.

- `src/app/(public)/profile/page.jsx`
  - Logged-in user profile management page.
  - Fetches own listings.
  - Updates profile via `/api/users/update-profile`.
  - Supports account deletion.

- `src/app/(public)/profile/[id]/page.jsx`
  - Public creator profile page.
  - Fetches `/api/users/profile/:id` and that creator’s public listings.

- `src/app/(public)/reset-password/[token]/page.jsx`
  - Reset password form.
  - Submits to `/api/users/reset-password/:token`.

- `src/app/(public)/terms-and-conditions/page.jsx`
  - Static general terms page.

- `src/app/(public)/terms-and-conditions/AccountStatusSection.jsx`
  - Reused legal section about account statuses.

### Creator dashboard pages

- `src/app/(dashboards)/creator/page.jsx`
  - Creator overview dashboard.
  - Fetches `/api/creator/stats` and `/api/creator/my-transactions`.
  - Shows wallet, activity, spend, and charts.

- `src/app/(dashboards)/creator/add/page.jsx`
  - Creator listing creation page.
  - Fetches admin categories and category assets.
  - Crops uploads before POST to `/api/listings/add`.

- `src/app/(dashboards)/creator/listings/page.jsx`
  - Creator listing management page.
  - Fetches own listings and meta-data.
  - Updates and deletes listings.

- `src/app/(dashboards)/creator/promotions/page.jsx`
  - Creator wallet and promotion launch page.
  - Fetches own listings and profile wallet balance.
  - Opens wallet top-up flow via `CreatorWallet`.
  - Purchases promotions with `/api/payments/purchase-promotion`.

- `src/app/(dashboards)/creator/promotions/[id]/page.jsx`
  - Promotion insights and controls for one listing.
  - Fetches `/api/creator/promotion-insights/:id` and transactions.
  - Can pause/resume, refund, extend, and download invoices.

- `src/app/(dashboards)/creator/transactions/page.jsx`
  - Creator transaction history and invoice download page.
  - Fetches `/api/creator/my-transactions`.

### Admin dashboard pages

- `src/app/(dashboards)/admin/page.jsx`
  - Admin overview dashboard.
  - Fetches `/api/admin/stats`.

- `src/app/(dashboards)/admin/users/page.jsx`
  - User table with search, filters, status toggles, and export.
  - Uses `/api/admin/users`, `/api/admin/toggle-status/:userId`, `/api/admin/export-users`.

- `src/app/(dashboards)/admin/users/[id]/page.jsx`
  - Detailed single-user admin view.
  - Uses `/api/admin/users/:id`.

- `src/app/(dashboards)/admin/requests/page.jsx`
  - Creator approval/rejection queue.
  - Uses moderation reasons plus `/api/admin/creator-requests`.

- `src/app/(dashboards)/admin/listings/page.jsx`
  - Global listing moderation page.
  - Uses `/api/admin/listings` and `/api/admin/update-status/:id`.

- `src/app/(dashboards)/admin/listings/promoted/page.jsx`
  - Promoted listing monitoring/admin control page.
  - Uses `/api/admin/promoted-listings`.

- `src/app/(dashboards)/admin/transactions/page.jsx`
  - Admin transaction reporting page.
  - Uses `/api/admin/transactions` and `/api/admin/export-transactions-range`.

- `src/app/(dashboards)/admin/logs/page.jsx`
  - Admin audit logs page.
  - Uses `/api/audit/admin/logs`.

- `src/app/(dashboards)/admin/categories/page.jsx`
  - Category CRUD and ordering.
  - Drag-and-drop reorder with `@hello-pangea/dnd`.

- `src/app/(dashboards)/admin/tags/page.jsx`
  - Tag CRUD by category.

- `src/app/(dashboards)/admin/region/page.jsx`
  - Region CRUD by category.

- `src/app/(dashboards)/admin/tradition/page.jsx`
  - Tradition CRUD by category.

- `src/app/(dashboards)/admin/manage-slider/page.jsx`
  - Slider CRUD page.
  - Uploads directly to Cloudinary from the client.

- `src/app/(dashboards)/admin/blogs/page.js`
  - Blog list/delete/admin browse page.

- `src/app/(dashboards)/admin/blogs/[id]/page.js`
  - Edit blog page.

- `src/app/(dashboards)/admin/create-blog/page.js`
  - Create blog page.

- `src/app/(dashboards)/admin/faq/page.jsx`
  - FAQ CRUD page using the centralized FAQ service.

- `src/app/(dashboards)/admin/seo-settings/page.jsx`
  - SEO settings CRUD page.

- `src/app/(dashboards)/admin/theme/navbar/page.jsx`
- `src/app/(dashboards)/admin/theme/home/page.jsx`
- `src/app/(dashboards)/admin/theme/footer/page.jsx`
- `src/app/(dashboards)/admin/theme/about/page.jsx`
  - These are currently stub/simple theme-customizer pages, not a full CMS implementation.

## Shared Component Inventory

### Core public shell and cross-cutting components

- `components/PublicNavbar.jsx`: top navigation for public routes.
- `components/Footer.jsx`: footer plus newsletter-like UI.
- `components/CookieConsent.jsx`: cookie consent banner.
- `components/Analytics.jsx`: analytics gate/consent wrapper.
- `components/VisitorTracker.jsx`: visitor tracking trigger.
- `components/LoginModal.jsx`: login modal shell.
- `components/RegistationModal.jsx`: registration modal shell.
- `components/LoginForm.jsx`: login form.
- `components/RegisterForm.jsx`: registration form.

### Home page and discovery components

- `components/HeroSection.jsx`
- `components/HeroActions.jsx`
- `components/HeroSlider.jsx`
- `components/CuratedCollections.jsx`
- `components/FeaturesSection.jsx`
- `components/WhyWorldCulture.jsx`
- `components/TrendingListings.jsx`
- `components/TrendingDataWrapper.jsx`
- `components/PopularCreators.jsx`
- `components/CultureSlider.jsx`
- `components/CultureDataWrapper.jsx`
- `components/CultureSkeleton.jsx`

### Listing and creator display components

- `components/ListingCard.jsx`
- `components/ListingGrid.jsx`
- `components/ListingSkeleton.jsx`
- `components/FavoriteButton.jsx`
- `components/CreatorName.jsx`
- `components/CreatorPopover.jsx`
- `components/ListingsProviderWrapper.jsx`

### Explore-specific components

- `components/explore/FilterBar.jsx`
- `components/explore/RegionDropdown.jsx`
- `components/explore/SkeletonLoader.jsx`

### Creator public/profile/dashboard components

- `components/creator/CreatorActivityLog.jsx`
- `components/creator/CreatorDataWrapper.jsx`
- `components/creator/CreatorSkeleton.jsx`
- `components/creator/CreatorSlider.jsx`
- `components/creator/CreatorWallet.jsx`

### Blog components

- `components/blog/BlogBanner.jsx`
- `components/blog/BlogBannerCard.jsx`
- `components/blog/BlogCard.jsx`
- `components/blog/BlogGude.jsx`
- `components/blog/MasonryImage.jsx`

### FAQ components

- `components/faq/FaqSection.jsx`
- `components/faq/FaqContact.jsx`

### Advertising policy components

- `components/Advertising/Hero.jsx`
- `components/Advertising/TableOfContents.jsx`
- `components/Advertising/ContactSection.jsx`
- `components/Advertising/PolicySection.jsx`
- `components/Advertising/PolicyCard.jsx`
- `components/Advertising/SharedComponents.jsx`

### About page components

- `components/about/AboutContent.jsx`
- `components/about/AboutCulture.jsx`
- `components/about/AboutExplore.jsx`
- `components/about/AboutHeader.jsx`
- `components/about/AboutPresting.jsx`
- `components/about/AboutPrincpals.jsx`
- `components/about/AboutShape.jsx`
- `components/about/AboutVisibility.jsx`

### Boost/PPC legal-explainer components

- `components/boost-terms-and-ppc/BoostListing.jsx`
- `components/boost-terms-and-ppc/BoostMandatory.jsx`
- `components/boost-terms-and-ppc/BoostPpce.jsx`
- `components/boost-terms-and-ppc/BoostPricing.jsx`
- `components/boost-terms-and-ppc/BoostPromotion.jsx`
- `components/boost-terms-and-ppc/CreatorBoost.jsx`
- `components/boost-terms-and-ppc/CreatorsPpc.jsx`
- `components/boost-terms-and-ppc/Hero.jsx`
- `components/boost-terms-and-ppc/ListingPpc.jsx`
- `components/boost-terms-and-ppc/PayPerClick.jsx`
- `components/boost-terms-and-ppc/PpcPromotion.jsx`
- `components/boost-terms-and-ppc/PromotionBudget.jsx`

### Creator terms components

- `components/creators-terms/ContactSection.jsx`
- `components/creators-terms/ContentTypesSection.jsx`
- `components/creators-terms/Eligibility.jsx`
- `components/creators-terms/ForceMajeureSection.jsx`
- `components/creators-terms/GoverningLawSection.jsx`
- `components/creators-terms/GuaranteeSection.jsx`
- `components/creators-terms/Hero.jsx`
- `components/creators-terms/Introduction.jsx`
- `components/creators-terms/LicenseSection.jsx`
- `components/creators-terms/LimitationSection.jsx`
- `components/creators-terms/ModificationSection.jsx`
- `components/creators-terms/OwnershipSection.jsx`
- `components/creators-terms/PlatformRoleSection.jsx`
- `components/creators-terms/ProhibitedSubmissions.jsx`
- `components/creators-terms/Purpose.jsx`
- `components/creators-terms/RemovalSection.jsx`
- `components/creators-terms/ResponsibilitiesSection.jsx`
- `components/creators-terms/SponsoredContent.jsx`

## API Dependency Map

### User/auth APIs used by frontend

- `/api/users/register`
- `/api/users/login`
- `/api/users/logout`
- `/api/users/me`
- `/api/users/update-profile`
- `/api/users/update-creator-profile`
- `/api/users/delete-account`
- `/api/users/become-creator`
- `/api/users/profile/:id`
- `/api/users/famous-creators`
- `/api/users/top-creators-dropdown`
- `/api/users/moderation-reasons`
- `/api/users/forgot-password`
- `/api/users/reset-password/:token`

### Listing APIs used by frontend

- `/api/listings/public`
- `/api/listings/meta-data`
- `/api/listings/my-listings`
- `/api/listings/add`
- `/api/listings/update/:id`
- `/api/listings/delete/:id`
- `/api/listings/favorites`
- `/api/listings/favorite/:id`
- `/api/listings/:id`
- `/api/listings/:id/click`
- `/api/listings/tags/by-category/:categoryId`

### Creator APIs used by frontend

- `/api/creator/stats`
- `/api/creator/my-transactions`
- `/api/creator/promotion-insights/:id`

### Payment APIs used by frontend

- `/api/payments/create-checkout-session`
- `/api/payments/purchase-promotion`
- `/api/payments/cancel-promotion`
- `/api/payments/toggle-pause-promotion`
- `/api/payments/creator/invoice/:id`

### Admin APIs used by frontend

- `/api/admin/stats`
- `/api/admin/users`
- `/api/admin/users/:id`
- `/api/admin/export-users`
- `/api/admin/creator-requests`
- `/api/admin/approve-creator/:userId`
- `/api/admin/reject-creator/:userId`
- `/api/admin/toggle-status/:userId`
- `/api/admin/listings`
- `/api/admin/promoted-listings`
- `/api/admin/update-status/:id`
- `/api/admin/transactions`
- `/api/admin/export-transactions-range`
- `/api/admin/categories`
- `/api/admin/categories/reorder`
- `/api/admin/category-assets/:categoryId`
- `/api/admin/tags/by-category/:categoryId`
- `/api/admin/regions`
- `/api/admin/regions/by-category/:categoryId`
- `/api/admin/traditions`
- `/api/admin/traditions/by-category/:categoryId`

### Other APIs used by frontend

- `/api/blogs`
- `/api/blogs/:id`
- `/api/blogs/:id/comments`
- `/api/blogs/comments`
- `/api/blogs/comments/:id`
- `/api/sliders`
- `/api/faqs`
- `/api/audit/creator/logs`
- `/api/audit/admin/logs`
- `/api/seo/*`
- `/api/views/track`

## SEO and Metadata Notes

- Root metadata lives in `src/app/layout.jsx`.
- Page-specific metadata is fetched at runtime for:
  - about
  - blog
  - contact
  - creators
  - explore
  - faq
  - how-it-works
- `src/app/sitemap.js` tries to fetch creator data from `/api/users/creators`, but the backend currently exposes `/api/users/famous-creators` and `/api/users/top-creators-dropdown` instead. This mismatch should be fixed before relying on creator sitemap entries.
- `src/app/sitemap.js` generates listing URLs with `/listing/...`, while the actual public route is `/listings/[id]`. This is another route mismatch to fix.

## Practical Maintenance Rules

- Preserve the `(public)` and `(dashboards)` route groups.
- Do not add a new API helper layer unless you are ready to refactor duplicated request patterns consistently.
- Before editing dashboard pages, inspect the matching layout because access control is implemented client-side there.
- Before changing listing or creator visuals, inspect `imageHelper`, `ListingCard`, `CreatorWallet`, and the relevant detail page together.
- Promotion UI depends on both `creator` and `payment` backend endpoints. Do not change one side only.
- Public pages mix server components and client components. Be explicit about whether a new fetch must happen server-side or client-side.

## Current Codebase Caveats

- API base URL usage is not fully standardized:
  - most files use `NEXT_PUBLIC_API_BASE_URL`
  - `how-it-works/page.jsx` uses `NEXT_PUBLIC_API_URL`
- Sitemap currently references backend routes and URL shapes that do not match the current server/public route structure.
- Theme customizer pages exist in navigation, but the actual pages are placeholder/simple pages rather than a full persisted customization system.
- Client-side role guards in dashboard layouts are useful UX, but backend authorization still remains the real protection layer.

## Suggested Next Cleanup Tasks

1. Standardize all client environment variable usage to `NEXT_PUBLIC_API_BASE_URL`.
2. Fix sitemap route mismatches for creator endpoints and listing URL paths.
3. Centralize repeated `axios.create()` usage into a shared client API helper.
4. Add consistent loading/error/empty-state patterns across admin and creator dashboards.
