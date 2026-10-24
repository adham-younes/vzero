# Security patch and platform closeout plan

**Owner instruction:** Apply needed security updates and tests, document the full result and prepare a clean handoff. Studio/agent redesign and new functionality are deferred to a new conversation.

**Baseline:** Production main dc9ebe0; existing isolated worktree reused. Its local receipt commit 8d745dd documents the already published content release and accompanies this maintenance change.

## Scope and decisions

- Patch Next.js 16.4.0 to the same-line fixed version 16.4.1, as advised by the official October security release.
- Refresh only vulnerable body-parser and fast-uri transitive resolutions within their existing compatible ranges. No general dependency upgrade, React update, framework migration or Studio change.
- Preserve application source, content, Hero/video, Auth/data/mail settings, schema and all stored user data. No live model, email, payment, test-account creation or exploit attempt.
- Use package-manager version declared by the repository where available; record any tooling deviation.
- Preserve the prior market review; its bespoke-project proposals are superseded by the owner's reusable-platform direction. This scope is security maintenance only.

## Steps

- [x] Establish clean Git/production baseline and capture dependency advisory evidence.
- [x] Install the exact patched framework and compatible affected transitive versions; inspect manifest/lockfile diff and repeat advisory scan.
- [x] Run one optimized build/type check, focused existing input/Auth/calculation/review regressions and readonly route/security-header/locale checks.
- [x] Obtain one fresh source/lockfile review; record scope, residual findings and rollback.
- [x] Commit, attach a PR and publish the reviewed maintenance release through the existing Git integration; verify exact source/aliases and bounded live presentation/unauthenticated rejection.
- [ ] Record final security/report/handoff evidence for the next conversation; leave Studio planning deferred.

## Completion criteria

The selected dependency advisory scan is clean, required checks pass, approved public content and application behavior are preserved, the matching production release is verified, and a concise Arabic handoff separates completed work from deferred/unverified areas. A clean package scan is not a security certification.


Production verified at445424f. Final handoff will also record the owner’s later separate snippet-installation request; no Studio redesign is authorized.
