# Global Agent Builder content Preview implementation plan

**Goal:** Replace the rejected bilingual public copy with an original, researched Agent Builder narrative and deliver one new Preview.

**Architecture:** Keep the existing routes, visual identity, Hero video and runtime. Update static page content, catalogue projections and shared public wording together. Existing specialized capability and industry layouts remain; content must agree with metadata, cards and links.

**Spec:** Owner-approved global content plan, held locally in `content-drafts/2026-10-24-global-content-rebuild`. English is primary; Arabic is independently authored. The owner approved full copy plus Preview after plan review. Production is excluded.

## Constraints and rulings

- The existing clean linked worktree is reused on a new Preview branch; main and the rejected branch are preserved.
- No Auth, Studio runtime, database, provider, secret, DNS or account changes.
- Technical detail explains product behavior; no meaningless file-format, encoding, date or infrastructure dumps in marketing copy.
- No claims of unverified system execution, connectors, autonomous company management, certifications, performance or payment functionality.
- The ten capabilities and nine solutions are parts/applications of one platform, not nineteen finished products.
- Ruling: batch validation after copy integration, as the owner's repository instructions require; no implementation-mirroring tests for reversible static copy edits.
- Ruling: the owner already approved the editorial plan and execution method in voice. Continue without another confirmation.

## Tasks

- [x] Author all 34 English/Arabic public page subjects; review native voice, technical cause/effect and factual scope using Humanizer.
- [x] Integrate `lib/public-page-copy.json`, `lib/service-catalog.json`, `lib/agynexa.ts`, `lib/program-pages.json` and `lib/legal-content.ts`; keep all slugs and real action semantics.
- [x] Align shared navigation, Hero copy, closing blocks, industry labels, directory cards, diagrams and public form descriptions without changing runtime behavior.
- [x] Validate page coverage, language parity, real link destinations, metadata/copy consistency and absence of rejected phrases/irrelevant technical dumps.
- [x] Run the required final build and bounded local page/browser checks across English/Arabic and mobile/desktop; record evidence and limits.
- [x] Obtain one fresh whole-change review, correct material findings, and publish ONE Preview with no production promotion or domain alias.
- [x] Deliver the link, copy/research review artifacts and verification receipt; update Preview documentation and current status without presenting Preview as production.

## Review focus

Source/citation language must not replace the product story. Sector examples must name different workflows. Integration examples must not imply installed access. Save, send, approval and completion remain distinct. Arabic must preserve action meaning without copying English sentence structures.

## Completion evidence

Full copy integrated at `a1c4658`; local build/TypeScript and 74 route/locale checks passed. Fresh review found no material blocker; three polish findings were corrected. One Vercel Preview build and published browser checks passed. Production unchanged. See `docs/agynexa-program/releases/global-content-preview-2026-10-24/README.md`.
