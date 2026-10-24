# HeronSignal site-wide browser installation — 24 October 2026

Status: LOCAL_VERIFIED; production verification pending.

## Authorized scope

The owner supplied the exact public client configuration and tracker URL and requested end-to-end installation and browser verification. This later instruction supersedes the previous HeronSignal deferral for this browser snippet only. Public key is intentionally public. No server SDK, instrumentation module, dependency, account operation, token storage, database, Auth, mail, design or content change is included.

The application's only changed source file is `app/layout.tsx`: a static synchronous configuration script in the shared root head, followed by one official Next.js `Script` component with `strategy="afterInteractive"` and explicit `async`. The configuration object, key and tracker URL match the owner snippet. Stable ID/source and the root layout preserve one installation through client navigation.

The market review and historical implementation positioning remain reference material; this bounded monitoring scope does not implement their broader product recommendations or change the current Agent Builder copy. Studio/agent redesign remains deferred. Existing open PR45/46 add SDK dependencies and backend/provider code, so neither was merged or modified for this minimal request.

## Verification

- Optimized Next16.4.1 build and TypeScript passed with declared pnpm12.3.4.
- Actual local browser loaded `https://api.heronsignal.com/tracker.js` with HTTP200; exact public config, one config instance, one tracker instance and async=true were observed.
- Actual link navigation from `/ar` to `/ar/resources` made zero additional tracker requests and raised zero runtime exceptions.
- Localhost is outside the workspace's allowed origins; the tracker reported that recording is disabled there. This is not proof of production collection. No localhost domain was registered.
- The technical source/UTF-8/12,000-byte paragraph rejected by the owner exists in the historical rejected Preview receipt, not active public copy. The local current `/ar/resources` visibly contains neither that limit text nor UTF-8 dump; no historical receipt or private Studio validation was altered.
- [Sanitized local browser evidence](evidence/local-browser.json). It omits visitor/session identifiers and request bodies.
- Fresh independent read-only review passed: configuration ordering, exact values, deduplication and minimal application scope; production allowlisting/collection remains the parent's separate verification.

HeronSignal MCP tools are not available in this session. Saved MCP configuration is not an active authenticated tool connection; no credential was retrieved or copied. Production browser network responses will be recorded separately from dashboard ingestion status.

## Publication and rollback

Use the existing Git integration and one reviewed merge. Verify exact source, READY/production and official aliases, then test the actual official domain for tracker200, config value, errors and collection acceptance. Do not infer dashboard receipt from HTTP200. Reverting the layout-only addition removes the browser integration without rolling back the security patch.

The [security production closeout](../security-closeout-2026-10-24/README.md) is a separate completed release. Its final documentation commit accompanies this branch naturally; no security test was repeated without a new relevant change.
