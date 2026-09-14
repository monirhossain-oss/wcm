import { getApiErrorMessage } from '@/lib/apiError';
import { format } from '@/lib/i18n/format';

// The Creator translation endpoints answer with a stable `code`, and each one needs a sentence that
// tells the Creator what to do next rather than repeating the backend's internal wording. The
// sentences themselves live in the UI catalog under `creator.errors.<CODE>`; this list is what
// decides whether a code is one we have wording for, since a catalog miss would otherwise render
// the key itself.
const KNOWN_CODES = new Set([
  'TRANSLATION_OWNERSHIP_DENIED',
  'ACCOUNT_RESTRICTED',
  'TRANSLATION_NOT_FOUND',
  'TRANSLATION_PROPOSAL_NOT_FOUND',
  'TRANSLATION_PROPOSAL_EXPIRED',
  'TRANSLATION_REGENERATION_LIMIT_REACHED',
  'TRANSLATION_VERSION_CONFLICT',
  'STALE_TRANSLATION_JOB',
  'INVALID_LOCALIZED_SLUG',
  'LOCALIZED_SLUG_CONFLICT',
  'LOCALIZED_SLUG_PERMANENTLY_RESERVED',
  'LOCALIZED_SLUG_UNSUPPORTED',
  'LOCALIZED_SLUG_MISSING',
  'TRANSLATION_NOT_PUBLISHED',
]);

// Validation failures carry the individual rule breaks, which are the only useful part of the reply.
export const getValidationErrors = (error) => {
  const details = error?.response?.data?.validationErrors;
  return Array.isArray(details) ? details : [];
};

// `t` comes from `useLocale()`. Endpoints that answer with only a `message` — most of the listing,
// payment and creator routes — still surface the backend's English sentence; only the ones that
// carry a `code` can be spoken in the reader's language.
export const getTranslationErrorMessage = (error, t, fallbackKey = 'creator.workspace.actionFailed') => {
  const code = error?.response?.data?.code;

  if (code === 'TRANSLATION_VALIDATION_FAILED') {
    const details = getValidationErrors(error);
    return details.length
      ? format(t('creator.errors.validationFailedDetails'), { details: details.join(', ') })
      : t('creator.errors.validationFailed');
  }

  if (KNOWN_CODES.has(code)) return t(`creator.errors.${code}`);

  return getApiErrorMessage(error, t(fallbackKey), t);
};
