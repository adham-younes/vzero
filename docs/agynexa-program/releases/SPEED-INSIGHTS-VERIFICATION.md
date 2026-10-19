# Speed Insights production verification

Verified on 2026-10-19. This is an instrumentation follow-up; stages 1–3 and the frozen Hero remain intact.

## Change and provenance

- Reviewed and integrated [Vercel Agent PR #2](https://github.com/adham-younes/vzero/pull/2): only `app/layout.tsx`, `package.json`, and `pnpm-lock.yaml` changed.
- Added `@vercel/speed-insights@2.0.0` and a single root-layout `SpeedInsights` component.
- Integration branch commit: `44350bd8ac2ec3656d4dfea9a7b9aa93452b1b2e`.
- Independently, PR #3 was merged to main at `2a761aed107d83be5230ca656a89954c63c38302`, automatically producing the release below. Product sources, public assets, package and lockfile match our integration branch. This task did not create a second production deployment.

## Production evidence

- Deployment: `dpl_BmTLpb3Q7V9jH9y83kctz3y6m17T`, **Ready**, target **production**.
- Public domain: https://vzero-nine-beryl.vercel.app
- Deployment: https://vzero-lbud5jgsv-adhamlouxors-projects.vercel.app
- CLI inspection of the public domain resolved to this release; no manual alias change was necessary.
- Browser DOM on the public domain contains one `@vercel/speed-insights/next` script, SDK version `2.0.0`. Its Vercel-assigned path is `/4882fc50ca84c9b8/script.js`; filtering script URLs only by the words `speed-insights` would miss it.
- Production/Desktop dashboard showed **3 events**, homepage route `/`, **Real Experience Score 100**. This tiny initial sample verifies collection, not representative site performance.
- No Plus upgrade or paid settings change was made.
- Screenshot: task output `outputs/speed-insights-production.png`.

## Validation

- Frozen-lockfile dependency installation passed.
- Vercel Agent preview checks and production build passed.
- All three strict Hero/video source hashes matched the baseline after merge.
- Live homepage video was loaded (readyState 4), unpaused, and observed at currentTime 6.742136 seconds on the public domain.
- Navigated homepage → Services, searched `knowledge`, observed the single matching service, and opened Enterprise knowledge & search.
- No console errors were captured in that public-domain browser tab during the smoke test.
- No backend runtime or database claims are implied by these checks.

This receipt is documentation written after deployment, not the deployed product source.
