import { format } from '@/lib/i18n/format';

// `t` is optional so every existing caller keeps its behaviour. When a localized surface passes it,
// the two sentences this helper owns are spoken in the reader's language; the backend's own
// `message` is returned as sent, because most endpoints answer with prose rather than a code.
export const getApiErrorMessage = (error, fallback = 'Request failed', t) => {
  if (error?.response?.status === 429) {
    const retryAfter = Number(
      error.response.headers?.['retry-after'] || error.response.data?.retryAfterSeconds
    );
    if (Number.isFinite(retryAfter) && retryAfter > 0) {
      const minutes = Math.ceil(retryAfter / 60);
      return t
        ? format(t('creator.errors.tooManyRequests'), { minutes })
        : `Too many requests. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`;
    }
    return t
      ? t('creator.errors.tooManyRequestsUnknown')
      : 'Too many requests. Try again in up to 5 minutes.';
  }
  return error?.response?.data?.message || fallback;
};
