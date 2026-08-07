export const getApiErrorMessage = (error, fallback = 'Request failed') => {
  if (error?.response?.status === 429) {
    const retryAfter = Number(
      error.response.headers?.['retry-after'] || error.response.data?.retryAfterSeconds
    );
    if (Number.isFinite(retryAfter) && retryAfter > 0) {
      const minutes = Math.ceil(retryAfter / 60);
      return `Too many requests. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`;
    }
    return 'Too many requests. Try again in up to 5 minutes.';
  }
  return error?.response?.data?.message || fallback;
};
