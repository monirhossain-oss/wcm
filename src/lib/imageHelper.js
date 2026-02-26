export const getImageUrl = (path, type = 'post') => {
  if (!path) {
    return type === 'avatar' ? '/default-avatar.png' : '/fallback-image.png';
  }

  if (path.startsWith('http')) {
    return path;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
};
