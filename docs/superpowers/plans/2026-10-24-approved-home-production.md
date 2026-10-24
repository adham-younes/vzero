# Approved homepage and Studio alignment implementation plan

> For agentic workers: execute this approved scope inline using executing-plans; obtain one fresh final review before merge.

**Goal:** Publish the reviewed bilingual Agent Builder content, replace the homepage with the owner-approved Arabic draft and an independently authored English equivalent, and align Studio entry wording with the already approved dedicated-chat design.

**Architecture:** Keep the existing public layouts and Studio composition. Store homepage content in public-page-copy.json, group its second-level sections and render the six third-level journey steps with the existing timeline styles. Change Studio display strings only.

**Tech Stack:** Existing Next.js 16.4 / React / TypeScript / static bilingual JSON.

**Spec:** Owner's approved homepage draft in this conversation; docs/launch/2026-10-22/STUDIO-CHAT-UI-RELEASE.md; DESIGN.md. Existing global-content-preview release remains the reference for all other pages.

## Global constraints

- Production publication explicitly authorized by the owner on 24 October 2026.
- Preserve original video, approved black/emerald composition, dedicated Studio layout, APIs, Auth, saved data, model policy and mail behavior.
- No new orchestration, enterprise connector, provisioning, billing or autonomous execution claims.
- English and Arabic independently authored; preserve all ten capabilities and nine solutions.
- Reuse accepted verification; one final build, affected browser checks and production source/alias verification. No live fixture accounts or model calls.

## Review focus

- Homepage remains clear about actual Studio setup versus conceptual multi-agent coordination and external integrations.
- Six journey steps remain subordinate to one section, with one final Studio call to action.
- Arabic mobile text/table/diagram do not overflow.
- Studio welcome/suggestions/forms retain exact event handlers, payloads and review gates.
- Production release uses the reviewed commit, existing project and domains; no unrelated pending mail work.

## Tasks

- [x] Update approved homepage AR and equivalent EN copy, metadata, Hero strings and footer wording.
- [x] Render the journey/diagram/sector table in the existing design; align Studio welcome and generated labels without changing behavior or CSS.
- [x] Review diff and protected paths; run build/TypeScript, docs validation and affected real-browser samples. Obtain fresh source review.
- [ ] Commit, push and create/attach PR; merge authorized reviewed head after checks and monitor the one Git production deployment.
- [ ] Verify production alias/source and public/Studio entry UI, save sanitized evidence and update current documentation with final receipt.

## Decisions

- Reuse the existing isolated worktree at vzero-content-preview; main still matches 857356a on the remote.
- Yesterday's requested design is the owner-approved dedicated-chat composition already present in current production; preserve it and align only entry/welcome/form wording.
- The historical market review's bespoke RFQ direction is superseded by the owner's explicit reusable global Agent Builder positioning. Its evidence/permission and measurable-outcome principles remain useful.
- No new design asset or remote generation is needed; existing approved components/styles meet this scope.
