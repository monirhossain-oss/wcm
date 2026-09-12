import { getApiErrorMessage } from '@/lib/apiError';

// The Creator translation endpoints answer with a stable `code`, and each one needs a sentence that
// tells the Creator what to do next rather than repeating the backend's internal wording.
const messagesByCode = {
  TRANSLATION_OWNERSHIP_DENIED: 'You can only work on translations for your own listings and profile.',
  ACCOUNT_RESTRICTED: 'Your account is currently restricted, so translations cannot be changed.',
  TRANSLATION_NOT_FOUND: 'There is no translation for this language yet.',
  TRANSLATION_PROPOSAL_NOT_FOUND: 'This suggestion is no longer available.',
  TRANSLATION_PROPOSAL_EXPIRED: 'This suggestion has expired. Request a new one to try again.',
  TRANSLATION_REGENERATION_LIMIT_REACHED:
    'You have used all regeneration attempts for this language today. Try again tomorrow.',
  TRANSLATION_VERSION_CONFLICT:
    'This translation changed while you were editing. Reload the page and reapply your changes.',
  STALE_TRANSLATION_JOB: 'The English text changed since this suggestion was made. Reload and try again.',
  INVALID_LOCALIZED_SLUG: 'That web address is not valid. Use letters, numbers and hyphens.',
  LOCALIZED_SLUG_CONFLICT: 'That web address is already taken for this language.',
  LOCALIZED_SLUG_PERMANENTLY_RESERVED: 'That web address was used before and cannot be reused.',
  LOCALIZED_SLUG_UNSUPPORTED: 'This content type does not use a translated web address.',
  LOCALIZED_SLUG_MISSING: 'This language does not have its own web address yet.',
  TRANSLATION_NOT_PUBLISHED: 'The web address can only change once the translation is published.',
};

// Validation failures carry the individual rule breaks, which are the only useful part of the reply.
export const getValidationErrors = (error) => {
  const details = error?.response?.data?.validationErrors;
  return Array.isArray(details) ? details : [];
};

export const getTranslationErrorMessage = (error, fallback = 'Request failed') => {
  const code = error?.response?.data?.code;
  if (code === 'TRANSLATION_VALIDATION_FAILED') {
    const details = getValidationErrors(error);
    return details.length
      ? `This text did not pass the translation checks: ${details.join(', ')}`
      : 'This text did not pass the translation checks.';
  }
  return messagesByCode[code] || getApiErrorMessage(error, fallback);
};
