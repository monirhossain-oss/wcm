# Client Developer Notes

## Stack

- Next.js App Router
- React
- Client-side fetches to the Express API in `wcm-server`

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Configure the API base URL used by the client.

3. Start development:

```bash
npm run dev
```

## App Structure

- `src/app/(public)`: public website pages
- `src/app/(dashboards)`: admin and creator dashboard pages
- `src/components`: shared UI components
- `src/context`: auth and listing state
- `src/services`: API-facing helpers where present
- `src/hooks`: client hooks for query and filter behavior

## Important Areas

- Public explore flow:
  - `src/app/(public)/explore/[[...filters]]/page.jsx`
  - `src/app/(public)/explore/ExploreClient.jsx`
- Creator pages:
  - `src/app/(public)/creators/page.jsx`
  - `src/app/(public)/profile/[id]/page.jsx`
- Admin dashboard:
  - `src/app/(dashboards)/admin/...`

## Backend Dependency

- The client depends heavily on the Express API in `wcm-server`.
- If listings, creators, FAQ, blogs, SEO, or dashboard data look broken, verify backend routes first.
- Backend startup currently depends on a valid `MONGO_URI`.

## Maintenance Notes

- Preserve the existing `(public)` and `(dashboards)` route groups.
- Reuse shared components before creating page-local duplicates.
- Many pages fetch dynamic data directly; trace the page and nearby components together before refactoring.

## Suggested Follow-up

1. Centralize API base URL handling if it is still duplicated across pages/components.
2. Standardize repeated fetch logic into shared service helpers.
3. Add stronger loading and error states on dashboard-heavy pages.
