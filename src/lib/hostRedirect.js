export const buildFrenchHostRedirect = (requestUrl, host, siteUrl = process.env.NEXT_PUBLIC_SITE_URL) => {
  const normalizedHost = String(host || '').split(':')[0].toLowerCase();
  if (!['worldculturemarketplace.fr', 'www.worldculturemarketplace.fr'].includes(normalizedHost)) return null;
  const target = new URL(siteUrl || 'https://worldculturemarketplace.com');
  const source = new URL(requestUrl);
  const path = source.pathname === '/' ? '' : source.pathname.replace(/^\/fr(?=\/|$)/, '');
  target.pathname = `/fr${path}`;
  target.search = source.search;
  return target;
};
