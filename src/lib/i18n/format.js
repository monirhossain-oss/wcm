// Fills the `{token}` placeholders a catalog entry declares.
//
// The Creator Dashboard counts a lot of things out loud ("Page 2 of 5", "Showing 1 to 12 of 40"),
// and each language puts those numbers in a different place, so the whole sentence has to stay one
// catalog entry rather than being assembled from fragments at runtime.
//
// A token with no matching value is left as written rather than printed as "undefined", so a
// missing variable shows up as an obvious `{token}` instead of quietly reading as real copy.
//
// Deliberately import-free so it can be pulled in from anywhere, catalogs included.
export const format = (template, values = {}) =>
  String(template).replace(/\{(\w+)\}/g, (token, name) =>
    values[name] === undefined || values[name] === null ? token : String(values[name])
  );

export default format;
