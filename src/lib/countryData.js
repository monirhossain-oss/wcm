'use client';

// `country-state-city` carries the whole world city table: 7.7 MB in the production bundle. Imported
// at module scope it lands in the initial chunk of every route that reaches the importing file — and
// because the [locale] catch-all statically imports the become-creator page, that meant every French
// page shipped it, home and contact included. Loading it on demand keeps it off first paint and off
// every page that never opens a country picker.
//
// The module is fetched once per session and reused; the package publishes CJS, so the namespace may
// arrive either flat or under `default`.
let pending;

const load = () => {
  pending ||= import('country-state-city').then((module) => module.default?.Country ? module.default : module);
  return pending;
};

export const loadCountries = async () => (await load()).Country.getAllCountries();

export const loadCountryByCode = async (code) => (await load()).Country.getCountryByCode(code);

export const loadCitiesOfCountry = async (code) => (await load()).City.getCitiesOfCountry(code) || [];
