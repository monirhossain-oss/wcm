// What each translatable object is called on screen. The keys are the API's `businessObjectType`
// values and never change; the labels follow the names the rest of the admin uses — a `region` is
// managed under "Manage Culture" and offered to creators as "Culture / Origin", so it is a Culture here.
export const OBJECT_TYPES = [
  'listing',
  'creatorProfile',
  'category',
  'tag',
  'tradition',
  'region',
  'blog',
  'faq',
  'cms',
];

export const OBJECT_TYPE_LABELS = {
  listing: 'Listing',
  creatorProfile: 'Creator profile',
  category: 'Category',
  tag: 'Tag',
  tradition: 'Tradition',
  region: 'Culture',
  blog: 'Blog',
  faq: 'FAQ',
  cms: 'CMS page',
};

export const objectTypeLabel = (type) => OBJECT_TYPE_LABELS[type] || type || '';
