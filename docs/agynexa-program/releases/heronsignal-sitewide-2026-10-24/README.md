# HeronSignal site-wide browser installation — 24 October 2026

Status: PRODUCTION_BROWSER_VERIFIED. The exact minimal snippet is installed on the official domain.

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

HeronSignal MCP tools are not available in this session. Saved MCP configuration is not an active authenticated tool connection; no credential was retrieved or copied. Production browser network responses are recorded below separately from dashboard ingestion status.

## Publication and rollback

Use the existing Git integration and one reviewed merge. Verify exact source, READY/production and official aliases, then test the actual official domain for tracker200, config value, errors and collection acceptance. Do not infer dashboard receipt from HTTP200. Reverting the layout-only addition removes the browser integration without rolling back the security patch.

The [security production closeout](../security-closeout-2026-10-24/README.md) is a separate completed release. Its final documentation commit accompanies this branch naturally; no security test was repeated without a new relevant change.


## Final production receipt

[PR50](https://github.com/adham-younes/vzero/pull/50) merged reviewed head `60156f8726a752eb820ec1391507836ba2468bea` as main `80abfdc3e2f3a623e8e2e5ca4117b3c9827f6c16`. [Deployment evidence](evidence/production-deployment.json): `dpl_Ha1b83WfDd7EFmcYT6wkMDYtMrHs`, READY/production/Git, exact source and both official aliases verified. www retains308 to the official apex. No manual duplicate deployment.

[Actual official-browser evidence](evidence/production-browser.json): `/ar` loaded tracker.js200; exact public key, one config, one tracker and async=true. Tracker configuration returned200 with automaticErrorTrackingEnabled=true and replayEnabled=true, with no origin-refusal notice. Natural events requests returned204 and the tracker's replay.js loaded200. These are browser/service-response observations, not an independently queried dashboard record. The service-returned configuration has console/network/log tracking disabled; no claim is made that those optional features were enabled. No configuration was changed beyond the owner's exact snippet.

Actual client navigation to `/ar/resources` retained a single installation and made zero additional tracker.js requests, with zero runtime exceptions and no new console errors/warnings in the sampled interval. The rejected technical paragraph and UTF-8 dump were absent on that actual production page. [Presentation screenshot](evidence/production-ar.png).

HeronSignal MCP is not connected in this session; get_installation_status/add_domain could not be invoked. No add_domain was necessary to resolve a production-origin rejection because none occurred. Dashboard receipt, broader traffic coverage and recording history are NOT ESTABLISHED by this bounded verification.

[Build and source scope](evidence/build-and-scope.json). The only application file changed is `app/layout.tsx`. [Complete file manifest](CHANGED-FILES.md) separates this scope from the preceding security receipt. Final receipt/status/evidence was initially committed locally and summarized in the merged PR. The owner subsequently required a complete matching repository copy dated24October2026; this documentation-only publication includes the full receipt, current status and evidence on main.


## Owner-supplied external scan after installation

Source: scan pasted by the owner, labelled24October18:27; score94/100, response-time estimate363ms,68 sitemapURLs and8 reachable sampled links. This outside-page scan is separate from measured real-user Core Web Vitals, rankings, dashboard ingestion or comprehensive accessibility testing. These scan counts were not independently rerun here.

Three remaining reported observations agree with current source inspection: Open Graph title/description exist but og:image is absent; no CSP header is configured; no general frame-ancestor restriction is configured. The source includes an intentional third-party iframe widget, so a blanket frame-ancestors self policy would interfere with that published embedding feature. Future hardening should assess ordinary pages and widget routes separately, inventory required Next/Heron/Vercel script/connect origins, observe a report-only policy and verify behavior before enforcement. Report-only is observation, not blocking protection. No such header or social-image modification was bundled into the exact snippet installation. llms.txt was not checked by the pasted scan and is not treated as a proven indexing problem.
