'use client';

import { useEffect, useRef } from 'react';

// The browser writes its own validation text ("Please fill out this field.") in the browser's
// language, not the page's — so a French page shows English hints on hover and on submit. A custom
// validity message replaces that text in both places.
//
// `validity` only reports the built-in checks once no custom error is set, so it is cleared first.
export const applyEmailValidity = (input, { required, invalid }) => {
  input.setCustomValidity('');
  if (input.validity.valueMissing) input.setCustomValidity(required);
  else if (input.validity.typeMismatch) input.setCustomValidity(invalid);
};

// Recomputed on every change, so the field turns valid again as soon as the address is, and on a
// language switch, so the message follows the page.
export default function useLocalizedEmailValidity(value, { required, invalid }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) applyEmailValidity(ref.current, { required, invalid });
  }, [value, required, invalid]);

  return ref;
}
