// Public-site strings only. The Creator Dashboard's own catalog lives in ./creator/en.js and is
// merged in by lib/i18n/index.js under the `creator` key — this file stays free of imports because
// the test suite loads it as a standalone module.
const en = {
  accountRecovery: {
    loading: 'Loading...', verifying: 'Verifying your email...', wait: 'Please wait a moment.',
    verified: 'Email Verified!', verificationSuccess: 'Email verified successfully! You can now log in.',
    verificationFailed: 'Verification Failed', missingToken: 'No verification token found.',
    invalidVerification: 'Invalid or expired verification link.', verificationError: 'Verification failed. Please try again.',
    login: 'Login Now', home: 'Go to Homepage', back: 'Back to Home',
    title: 'Set New Password', subtitle: 'Secure your account with a new strong password',
    password: 'New Password', confirm: 'Confirm Password', required: 'Password is required',
    confirmRequired: 'Please confirm your password', mismatch: 'Passwords do not match',
    requirements: 'Password Requirements:', minLength: 'At least 8 characters',
    uppercase: 'One uppercase letter (A-Z)', lowercase: 'One lowercase letter (a-z)',
    number: 'One number (0-9)', symbol: 'One special symbol (!@#$%^&*)',
    passwordInvalid: 'Please meet all password requirements.', update: 'Update Password',
    secure: 'Safe & Secure Environment', resetSuccess: 'Your password has been reset successfully!',
    invalidReset: 'Invalid or expired token', resetError: 'Something went wrong. Link might be expired.',
    networkError: 'Something went wrong. Please try again.', showPassword: 'Show password', hidePassword: 'Hide password', close: 'Close',
    rateLimited: 'Too many requests. Try again in {minutes} minute(s).',
  },
  account: {
    profileTitle: 'My Profile', profileDescription: 'Manage your World Culture Marketplace account details.',
    verifyEmailTitle: 'Verify Your Email', verifyEmailDescription: 'Confirm your email address to activate your World Culture Marketplace account.',
  },
  common: { home: 'Home', explore: 'Explore', creators: 'Creators', blog: 'Blog', about: 'About us', faq: 'FAQ', language: 'Language' },
  actions: { viewMore: 'View more', search: 'Search', loadMore: 'Load more' },
  seo: {
    defaultImageAlt: 'World Culture Marketplace',
    home: { title: 'World Culture Marketplace', description: 'Discover and explore global cultural products, craftsmanship, and heritage rituals.', keywords: ['World Culture Marketplace', 'cultural marketplace', 'artisans', 'heritage'] },
    about: { title: 'About Us', description: 'Discover global cultural heritage and master artisans.', keywords: ['WCM', 'Culture', 'Artisans', 'Global Heritage'] },
    contact: { title: 'Contact Us', description: 'Get in touch with us.', keywords: ['WCM', 'Contact', 'Support'] },
    'how-it-works': { title: 'How It Works', description: 'Learn how World Culture Marketplace connects creators and customers around the world.', keywords: ['How It Works', 'WCM', 'Guide', 'Process'] },
    blogs: { title: 'Blog Stories', description: 'Explore traditions, craftsmanship, and cultural creativity from around the world.', keywords: ['Culture', 'Blog', 'Stories'] },
    creators: { title: 'Discover Global Creators', description: 'Explore talented creators from around the world showcased on World Culture Marketplace.', keywords: ['creators', 'culture', 'global artists', 'WCM'] },
    explore: { title: 'Explore World Culture', description: 'Discover unique global heritage.', keywords: ['Culture', 'WCM'] },
    faq: { title: 'Frequently Asked Questions', description: 'Find answers to common questions about World Culture Marketplace.', keywords: ['FAQ', 'WCM Help', 'Cultural Marketplace Questions'] },
    'become-creator': { title: 'Become a Creator', description: 'Apply to join World Culture Marketplace and showcase your craft, culture and story to a global audience.', keywords: ['Become a Creator', 'WCM', 'Artisans', 'Creators'] },
    'advertising-policy': { title: 'Advertising Policy', description: 'Read the advertising and sponsored content rules for World Culture Marketplace.', keywords: ['Advertising', 'Policy', 'WCM'] },
    'boost-terms-and-ppc': { title: 'Boost Terms and PPC', description: 'Read the Boost and pay-per-click promotion terms for World Culture Marketplace listings and creators.', keywords: ['Boost', 'PPC', 'Promotion', 'WCM'] },
    'creator-terms-and-conditions': { title: 'Creator Terms and Conditions', description: 'Read the terms and conditions for creators on World Culture Marketplace.', keywords: ['Creator Terms', 'WCM', 'Legal'] },
    'privacy-policy': { title: 'Privacy Policy', description: 'Learn how World Culture Marketplace collects, uses, and protects your data.', keywords: ['Privacy', 'Policy', 'WCM', 'Data Protection'] },
    'terms-and-conditions': { title: 'Terms & Conditions', description: 'Read the terms and conditions for using World Culture Marketplace.', keywords: ['Terms', 'Conditions', 'WCM', 'Legal'] },
    'cookie-policy': { title: 'Cookie Policy', description: 'Learn how World Culture Marketplace uses cookies.', keywords: ['Cookies', 'Policy', 'WCM'] },
  },
  cookieConsent: {
    heading: 'Privacy Protocol', text: 'We use analytics cookies for a superior asset discovery experience. Review our',
    policy: 'Privacy Policy', reject: 'Reject', accept: 'Accept All',
  },
  notFound: {
    title: 'Page Not Found',
    description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
    back: 'Back to Home', imageAlt: '404 Error Illustration',
  },
  staticPage: {
    // Rendered before the stored content is available, so it can never come from the page record.
    unavailable: {
      'advertising-policy': 'Advertising Policy is temporarily unavailable.',
      'boost-terms-and-ppc': 'Boost & PPC Terms are temporarily unavailable.',
      'creator-terms-and-conditions': 'Creator Terms & Conditions are temporarily unavailable.',
      'privacy-policy': 'Privacy Policy is temporarily unavailable.',
      'terms-and-conditions': 'Terms & Conditions are temporarily unavailable.',
      'cookie-policy': 'Cookie Policy is temporarily unavailable.',
    },
    // Cookie Policy card notes: present in the page markup but not in the stored English record,
    // so the record-based localization cannot reach them.
    cookieNotes: {
      essential: 'You cannot disable these cookies because the Platform cannot function without them. Examples include: authentication cookies, security and anti-bot cookies, and cookie consent preferences.',
      analytics: 'We use tools such as Google Analytics, Meta Pixel, and server log analysis. Data is aggregated and anonymized wherever possible.',
      preference: 'Disabling them may reduce usability but will not block site access.',
      advertising: 'Third-party advertising cookies may include: Google Ads, Meta Ads, TikTok Pixel, and other ad networks. These cookies operate only if WCM activates advertising tools.',
    },
  },
  blog: {
    heading: 'Cultural Stories', intro: 'Explore traditions, craftsmanship, and cultural creativity from around the world through an editorial lens.', empty: 'No stories found.',
    loading: 'Loading blogs...', loadFailure: 'Failed to load stories.', readMore: 'Read More', archiveEmpty: 'No stories found in the archives.', loadMore: 'Load More Insights',
    newsletterTitle: 'Stay Informed', newsletterEmailRequired: 'Please enter your email!', newsletterSuccess: 'Thank you for subscribing!', newsletterError: 'Something went wrong.', subscribe: 'Subscribe',
    details: {
      notFoundTitle: 'Story Not Found | World Culture Marketplace', metaDescription: 'Read this cultural story on World Culture Marketplace.', back: 'Back to Blogs', editorialTeam: 'Editorial Team', insightAlt: 'Cultural insight', share: 'Share this story', linkCopied: 'Link copied!',
      discussions: 'Discussions', commentPlaceholder: 'Share your thoughts...', signInToComment: 'Sign in to Comment', loginRequired: 'Please login to comment', commentAdded: 'Comment added!', commentFailure: 'Failed to post comment',
      replySent: 'Reply sent!', replyFailure: 'Failed to send reply', deleteConfirm: 'Delete this comment?', commentRemoved: 'Comment removed', deleteFailure: 'Unauthorized or error occurred', staffReplyPlaceholder: 'Write a staff reply...', send: 'Send', submitComment: 'Submit comment', reply: 'Reply', delete: 'Delete comment', admin: 'Admin',
    },
  },
  creators: {
    badge: 'Global Creator Network', headingLead: 'Discover', headingAccent: 'Creators', headingTail: 'Around the World',
    intro: 'Explore creators inspired by cultures and traditions worldwide',
    stats: { creators: 'Creators', cultures: 'Cultures', categories: 'Categories' },
    searchPlaceholder: 'Search by name, country or bio...', allCountries: 'All Countries', allCategories: 'All Categories', clear: 'Clear',
    resultSingular: 'creator found', resultPlural: 'creators found', emptyTitle: 'No creators found',
    emptyDescription: 'Try adjusting your search or filters', clearAll: 'Clear all filters', featured: 'Featured', world: 'World',
    fallbackBio: 'Crafting stories through traditional artistry and heritage techniques.', handcrafted: 'Handcrafted',
    viewCreator: 'View Creator', website: 'Website',
  },
  publicProfile: {
    metaNotFound: 'Profile Not Found | WCM', metaTitleSuffix: 'WCM Creator Profile', metaDescriptionSuffix: 'Cultural Creator on WCM', metaFallback: 'Creator Profile | WCM', metaKeywords: ['WCM', 'creator', 'marketplace'],
    back: 'Back', creator: 'Creator', unknown: 'Unknown', earth: 'Earth', global: 'Global', creatorLinks: 'Creator Links', officialWebsite: 'Official Website', portfolioSocial: 'Portfolio/Social', noLinks: 'No links shared by creator',
    biography: 'Creator Biography', biographyFallback: "This creator's biography is currently unavailable.", showcase: 'Work Showcase', units: 'Units', activeListings: 'Active Listings', noListings: 'No active listings found',
    coverAlt: 'cover image', profileAlt: 'profile picture', screenReaderSuffix: 'Cultural Creator Profile on World Culture Marketplace', jobTitle: 'Cultural Creator',
  },
  contact: {
    back: 'Back', heading: 'Get in touch', intro: 'Our support team will get in touch with you shortly.', fullName: 'Full Name', namePlaceholder: 'Your Name', email: 'Email Address', emailPlaceholder: 'example@mail.com', subject: 'Subject', subjectPlaceholder: 'What is this regarding?', message: 'Message Details', messagePlaceholder: 'How can we help you?', attachments: 'Attachments (Optional)', addFiles: 'Add screenshot or files', previewAlt: 'Attachment preview', removeAttachment: 'Remove attachment', sending: 'Sending...', send: 'Send Message', success: 'Message Sent Successfully!', error: 'Something went wrong. Please try again.',
  },
  // Server-rendered intro for /become-creator. The application form itself is auth-gated and
  // client-only, so this block is the whole page for a signed-out visitor and for a crawler.
  becomeCreator: {
    badge: 'Creator Applications',
    heading: 'Become a Creator on World Culture Marketplace',
    lead: 'Share your craft with the people looking for it. A creator profile gives your work, your technique and the culture behind it a lasting place in a catalogue that visitors browse by region and by tradition.',
    requirementsHeading: 'What your application needs',
    requirements: [
      'A display name and a short biography describing your practice.',
      'The country and city you work from, so your work appears in the right regional collections.',
      'A category that matches your craft, such as textiles, ceramics or jewellery.',
      'A profile photograph and a cover image that show your work.',
    ],
    reviewHeading: 'What happens next',
    review: 'Our moderation team reviews every application for authenticity and cultural relevance. You keep full ownership of everything you upload and can withdraw a listing at any time. Approved creators can start publishing straight away.',
    signInNote: 'You need an account before you can apply. Sign in or register to open the application form.',
  },
  // /about-us takes its text from the About CMS record, one record per language. These two strings
  // sit outside that record, so they are localized here instead.
  about: {
    trustBadge: 'Supporting a more inclusive and respectful global cultural economy.',
  },
  howItWorks: {
    process: 'Our Process',
    fallback: { title: 'Empowering Global Craftsmanship', description: "World Cultural Marketplace (WCM) brings the world's finest artisans under one roof. Follow these simple steps to start your journey with us.", steps: [
      { id: 1, title: 'Create Your Profile', description: 'Sign up as a creator and tell the world about your craft, culture, and story.' },
      { id: 2, title: 'Upload Listings', description: 'Add your creations with photos, descriptions, and cultural tags that connect visitors to your traditions.' },
      { id: 3, title: 'Review & Approval', description: 'Our team reviews listings for authenticity and cultural relevance before publishing.' },
      { id: 4, title: 'Get Discovered', description: 'Your listings appear in our discovery feed. Boost visibility with optional featured placements.' },
    ] },
  },
  homeHero: {
    headingLead: 'Join a', headingAccent: 'growing global community', headingJoin: 'of ', headingAudience: 'artists & creators',
    description: 'WCM helps you gain visibility and connect with a global audience.',
    discover: 'Discover Creations', becomeCreator: 'Become a Creator', adminActive: 'Admin Access Active', creatorActive: 'Creator Mode Active',
    fallbackImageAlt: 'World Culture Marketplace', slideAlt: 'Hero Slide', slideLabel: 'Slide',
  },
  homeDiscovery: {
    viewAll: 'View all', listings: 'Listings', unknown: 'Unknown', world: 'World', viewProfile: 'View Profile', allRegions: 'All Regions', allCategories: 'All',
    cultures: { heading: 'Explore Cultures', description: 'Craftsmanship & heritage rituals.' },
    popularCreators: { heading: 'Featured Creators', description: 'Verified artists & craftsmen.', failure: 'Failed to load creators.' },
    regions: { asia: 'Asia', africa: 'Africa', europe: 'Europe', 'north-america': 'North America', 'latin-america': 'Latin America', 'middle-east': 'Middle East', oceania: 'Oceania' },
    // Region name carrying its own preposition: French elides and contracts it ("d'Asie", "du
    // Moyen-Orient"), so the phrase cannot be assembled from a separate word at runtime.
    regionsOf: { asia: 'from Asia', africa: 'from Africa', europe: 'from Europe', 'north-america': 'from North America', 'latin-america': 'from Latin America', 'middle-east': 'from the Middle East', oceania: 'from Oceania' },
    regionsHeritage: { asia: 'of Asia', africa: 'of Africa', europe: 'of Europe', 'north-america': 'of North America', 'latin-america': 'of Latin America', 'middle-east': 'of the Middle East', oceania: 'of Oceania' },
  },
  homeCurated: {
    heading: 'Curated Collections', description: 'Handpicked treasures from top-ranked global creators', viewAll: 'View All',
  },
  homeTrending: {
    heading: 'Trending Listings', description: 'Handpicked traditions for you.', exploreAll: 'Explore All Listings',
    empty: 'No trending listings found.', failure: 'Failed to load trending listings.', retry: 'Retry',
  },
  homeWhy: {
    heading: 'Why World Culture Marketplace?',
    benefits: ['Discover authentic cultural creations', 'Support global creators', 'Explore traditions from around the world'],
    imageAlt: 'Cultural representation',
  },
  explore: {
    descriptionCategoryRegion: 'on World Culture Marketplace — handmade pieces from independent cultural creators.',
    descriptionCategory: 'on World Culture Marketplace — browse the full collection of handmade pieces from independent creators.',
    descriptionRegion: 'on World Culture Marketplace — crafts, textiles and traditions from independent creators.',
    heading: 'Explore World Culture', categoryCollections: 'Collections', culturalHeritage: 'Cultural Heritage', from: 'from',
    searchPlaceholder: 'Search culture, art, traditions...', endResults: 'End of results.', noListings: 'No listings found',
    noListingsDescription: "We couldn't find anything matching your current filters or search.", scrollLeft: 'Scroll categories left', scrollRight: 'Scroll categories right',
    promoted: 'Promoted', listingAlt: 'Listing', heritage: 'Heritage', global: 'Global',
  },
  faq: { badge: 'Support Center', heading: 'Frequently Asked Questions' },
  navigation: {
    explore: 'Explore', categories: 'Categories', creators: 'Creators', about: 'About', blogs: 'Blogs',
    browseAll: 'Browse all categories', wishlist: 'Wishlist', wishlistTitle: 'My Wishlist', signIn: 'Sign In', signUp: 'Sign Up',
    becomeCreator: 'Become a Creator', profile: 'Profile', dashboard: 'Dashboard', adminDashboard: 'Admin Dashboard',
    creatorDashboard: 'Creator Dashboard', logout: 'Logout',
  },
  // /listings/[id] — the listing's own text arrives translated from the API; this is the page around it.
  listingDetail: {
    back: 'Back', explore: 'Explore', save: 'Save', saved: 'Saved',
    saveToFavorites: 'Save to Favorites', savedToFavorites: 'Saved to Favorites',
    promoted: 'Promoted', views: '{count} views', tradition: 'Tradition', country: 'Country',
    byCreator: 'by @{username}', about: 'About', keyFeatures: 'Key Features', followOnSocial: 'Follow on Social',
    visitWebsite: 'Visit Creator Website', youMightAlsoLike: 'You might also like', moreFrom: 'More from', viewAll: 'View all',
    loginRequired: 'Please log in to save listings.', notFound: 'Listing not found.', metaFallbackTitle: 'Listing Details',
    metaFrom: 'from {country}', metaExploreTags: 'Explore {tags} on World Culture Marketplace.',
    metaDiscover: 'Discover authentic cultural craftsmanship on World Culture Marketplace.',
    seoHeading: '{title} — {tradition} from {country} | World Culture Marketplace',
    seoHeadingShort: '{title} | World Culture Marketplace',
  },
  favorites: {
    metaTitle: 'Favorite Listings | WCM', metaDescription: 'View the cultural listings you saved on World Culture Marketplace.',
    heading: 'Favorite Listings ❤️', savedSingular: 'item saved', savedPlural: 'items saved', loading: 'Loading favorites',
    emptyTitle: 'No favorites yet', emptyDescription: 'Start exploring and save the items that inspire you.', explore: 'Explore Marketplace',
    promoted: 'PROMOTED', heritage: 'Heritage', global: 'Global', unknown: 'Unknown', anonymous: 'Anonymous',
    noImage: 'No image available', coverAlt: 'Creator cover', toggle: 'Toggle favorite', login: 'Please login',
    restricted: 'Your account can browse, but business actions are currently restricted.', restrictedTitle: 'Business actions are restricted for this account',
    listings: 'Listings', profile: 'Profile', website: 'Website',
  },
  footer: {
    about: 'Connecting the world through authentic culture, one story at a time.', platform: 'Platform', resources: 'Resources', rights: 'All rights reserved.',
    platformLinks: { about: 'About Us', howItWorks: 'How It Works', faq: 'FAQ' }, resourceLinks: { blogs: 'Blogs', contact: 'Contact', creators: 'Creators' },
    legalLinks: { boost: 'Boost & PPC terms & condition', creator: 'Creator Terms & Condition', advertising: 'Advertising Policy', privacy: 'Privacy Policy', terms: 'Terms & Conditions', cookie: 'Cookie Policy' },
    newsletterTitle: 'Stay Connected', newsletterDescription: 'Stay informed about cultural stories and discoveries. More to come.',
    email: 'Email address', subscribe: 'Subscribe', subscribing: 'Subscribing…', notConfigured: 'Not configured',
    subscriptionSuccess: 'Subscription Successful! Thank you for staying connected.', alreadySubscribed: 'This email is already subscribed!', subscriptionError: 'Something went wrong. Please try again later.',
  },
  auth: {
    close: 'Close modal', loginTitle: 'Connecting Cultures', loginIntro: 'Enter your credentials to access your account', resetTitle: 'Reset Password', resetIntro: 'Enter your email to receive a password reset link', email: 'Email address', emailPlaceholder: 'Enter your email...', emailRequired: 'Email is required', emailInvalid: 'Invalid email format', password: 'Password', passwordPlaceholder: 'Enter your password...', passwordRequired: 'Password is required', forgot: 'Forgot?', signIn: 'Sign In', signingIn: 'Signing In...', resetSend: 'Send Reset Link', resetSending: 'Sending...', backLogin: 'Back to Login', or: 'OR', newHere: 'New here?', createAccount: 'Create an account', loginSuccess: 'Login Successful! Welcome back to World Culture Marketplace', loginFailed: 'Login failed. Please try again.', unexpected: 'An unexpected error occurred.', validEmailFirst: 'Please enter a valid email first.', resetSent: 'A reset link has been sent to your inbox. Please check your email!', resetFailed: 'Failed to send reset link.', passwordMust: 'Password must contain', requirements: 'Password Requirements:', minLength: 'At least 8 characters', uppercase: 'One uppercase letter (A-Z)', lowercase: 'One lowercase letter (a-z)', number: 'One number (0-9)', symbol: 'One special symbol (!@#$%^&*)', agreementLead: 'By clicking Sign In, you agree to World Culture Marketplace', terms: 'Terms and Conditions', privacy: 'Privacy Policy', and: 'and', registerTitle: 'Create Account', registerIntro: 'Join the global culture marketplace', firstName: 'First Name', lastName: 'Last Name', required: 'Required', username: 'Username', usernamePlaceholder: 'Choose a username...', usernameRequired: 'Username required', registerEmailPlaceholder: 'Enter email address...', registerEmailRequired: 'Email required', confirm: 'Confirm', creating: 'Creating Account...', register: 'Register', already: 'Already have an account?', logIn: 'Log In', mismatch: 'Passwords do not match', registrationFailed: 'Registration failed.', registrationSuccess: 'Registration successful! Please check your email to verify your account.', joiningLead: 'By joining, you agree to World Culture Marketplace', cookieText: 'We use cookies to improve your experience.', cookie: 'Cookie Policy',
  },
};
export default en;
