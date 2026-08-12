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

export const localizeValue = (value, translations) => {
  if (typeof value === 'string') return translations.get(value) || value;
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
