export const continentMapping = {
    'asia': 'Asia',
    'africa': 'Africa',
    'europe': 'Europe',
    'north-america': 'North America',
    'south-america': 'South America',
    'latin-america': 'Latin America',
    'oceania': 'Oceania',
    'middle-east': 'Middle East',
    'central-america': 'Central America',
    'southeast-asia': 'Southeast Asia',
    'australia': 'Australia',
    'antarctica': 'Antarctica',
};

// ✅ Regions list for dropdown
export const regions = ["All Regions", ...Object.values(continentMapping)];