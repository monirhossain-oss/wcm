// Reuse the latest request across locale remounts without persisting tokens.
export function createEmailVerifier() {
  let latest;
  return (token, baseUrl) => {
    if (latest?.token === token) return latest.promise;
    const promise = fetch(`${baseUrl}/api/users/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (response) => ({
        ok: response.ok, status: response.status, data: await response.json(),
        retryAfter: response.headers.get('retry-after'),
      }));
    latest = { token, promise };
    return promise;
  };
}

export function recoveryError(response, t, fallback) {
  if (response?.status === 429) {
    const seconds = Number(response.retryAfter || response.data?.retryAfterSeconds);
    const minutes = Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds / 60) : 5;
    return t('accountRecovery.rateLimited').replace('{minutes}', String(minutes));
  }
  const known = {
    'Invalid or expired verification link.': 'invalidVerification',
    'Invalid or expired token': 'invalidReset',
  };
  return t(`accountRecovery.${known[response?.data?.message] || fallback}`);
}
