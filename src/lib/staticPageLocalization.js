import React from 'react';

export const buildTranslationMap = (source, translated, result = new Map()) => {
  if (typeof source === 'string' && typeof translated === 'string') result.set(source, translated);
  else if (Array.isArray(source) && Array.isArray(translated)) {
    source.forEach((value, index) => buildTranslationMap(value, translated[index], result));
  } else if (source && translated && typeof source === 'object' && typeof translated === 'object') {
    Object.keys(source).forEach((key) => buildTranslationMap(source[key], translated[key], result));
  }
  return result;
};

// A JSX text node that sits next to an inline element keeps the space that separates them, so
// "These Advertising Rules " never equals the stored "These Advertising Rules". Falling back to the
// trimmed lookup and putting the original spacing back around the translation keeps those sentences
// localized without changing the legal markup or the stored content structure.
const localizeString = (value, translations) => {
  const direct = translations.get(value);
  if (direct) return direct;
  const trimmed = value.trim();
  if (!trimmed || trimmed === value) return value;
  const translated = translations.get(trimmed);
  if (!translated) return value;
  return `${value.slice(0, value.length - value.trimStart().length)}${translated}${value.slice(value.trimEnd().length)}`;
};

export const localizeValue = (value, translations) => {
  if (typeof value === 'string') return localizeString(value, translations);
  if (Array.isArray(value)) return value.map((item) => localizeValue(item, translations));
  if (React.isValidElement(value)) {
    const props = Object.fromEntries(Object.entries(value.props).map(([key, prop]) => [
      key,
      key === 'children'
        ? React.Children.map(prop, (child) => localizeValue(child, translations))
        : localizeValue(prop, translations),
    ]));
    return React.cloneElement(value, props);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeValue(item, translations)]));
  }
  return value;
};
