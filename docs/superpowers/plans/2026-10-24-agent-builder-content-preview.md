# Agent Builder content preview implementation plan

**Goal:** Apply the owner's reviewed English and Arabic Agent Builder copy and publish one Vercel Preview for review.
**Architecture:** Preserve current routes, visual system, video, APIs and Studio runtime. Map reviewed content to existing catalogue schemas, page sections, shared labels and metadata. Keep main and production unchanged.
**Tech stack:** Next.js 16.4 / React 19 / existing Tailwind classes; no new dependency.
**Spec:** The owner-reviewed 24 October platform-builder content pack, archived with this delivery.

## Constraints and decisions

- Preview only; no merge to main, production promotion, domain alias, DB/Auth/provider/settings changes or customer records.
- One shared Agent Builder product; ten capability families and nine workflow pages retained. Not a bespoke agency offer or ten installed SaaS products.
- Native EN/AR copy, no development-status banners, unsupported connections or system-generation promises.
- Existing actions keep their real behavior. Brief saving remains private; email remains manual; no new runtime workflow.
- Owner's explicit full-copy replacement authorizes Hero text and link labels only. Preserve its composition, styling and original video. No visual redesign.
- Earlier market review proposed bespoke RFQ delivery. The owner's newer shared-product decision supersedes that commercial recommendation. Retain source/evidence discipline, task-specific outputs, reviewer ownership and truthful connector boundaries. No market/architecture research repeated.

## Tasks

- [x] Verify clean main matches origin; create isolated preview branch.
- [x] Map all approved page copy, shared controls and metadata; independent agent owns service/program JSON.
- [x] Inspect diffs for runtime, unsupported claims and incomplete bilingual mapping.
- [x] Run one delivery build and targeted page/link/RTL checks. Do not create live accounts or invoke models/mail.
- [x] Publish a single preview using the existing Vercel project. Record URL, source, deployment state and limits; verify production identity unchanged.
- [x] Deliver the preview link with scope and review notes.

## Review focus

Check long Arabic headings, correct localized links after language switch, direct navigation/SEO, fictional procurement status labels and private-save/manual-email semantics. Test no-match filters and public navigation without submitting production data.
