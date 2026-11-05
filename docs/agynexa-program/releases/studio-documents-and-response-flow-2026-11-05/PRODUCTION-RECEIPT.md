# Production receipt — 5 November 2026

The corrected public platform and Studio are deployed on https://agynexa.si and https://www.agynexa.si. Fresh Vercel project/deployment inspection confirmed READY production `dpl_GDYozFzLEuLgBsH9BU9jjPi63Haw`, source `e9a5b0ec170fe57161c17db984caf0a33e6e1467` (PR69), and both official aliases with no alias error. GitHub remote main matches that SHA. PR69 changes only five documentation files; application code is unchanged from PR68, merge `2a90d7a4c47557208cdc4e6e511ba777bb4c38a5`, reviewed implementation `21858bfc224b84b8fe1a3fd0c167f442231e96d6`. No redundant deployment was started during this urgent closeout.

## Verification completed

- Release build and TypeScript passed. Source review, documentation inventory and original Hero/video integrity checks passed.
- Source-capacity migration `20261105124017_studio_document_source_capacity` was applied and its validated constraint checked: 1–1,048,576 UTF-8 bytes. No data deletion or RLS changes.
- On PR68 production: 68/68 public sitemap pages passed HTTP, exact title/description, canonical, hreflang and language checks; health passed; four anonymous/missing-origin access rejections passed. [Machine-readable evidence](evidence/public-http.json) records the exact deployment and 78 requests, including four harness-capture retries.
- Earlier in this same work session, the root agent inspected the actual Arabic homepage in the side browser: original video autoplayed, neutral/emerald tokens were present and desktop content had no horizontal overflow. Authenticated synthetic Studio uploads extracted PDF, DOCX, XLSX and 24,044-byte TXT content for review. PDF was explicitly saved; DOCX/XLSX previews did not auto-save and the hidden workbook sheet was excluded.

## Remaining acceptance

The laptop shutdown warning interrupted the broader browser acceptance. The TXT save result and database byte count, malformed/oversized upload errors, a new grounded SSE run and cancellation, and representative EN/AR mobile views are not marked verified. Existing positive checks must not be represented as proof of those uncompleted cases. No new latency benchmark or search-ranking guarantee is claimed.

Two Tripo raster prototypes cost 20 Studio credits total, leaving 180. The gray first output was rejected; the corrected green/black preview was shown privately. Neither is deployed; no mesh/animation was generated and Free-plan commercial-use limits remain unresolved. [Tripo details](TRIPO.md).

Mail operates separately: [current mailbox migration receipt](../../OWNER-MAIL-2026-11-05.md) records verified DNS/receiving/internal delivery/archive and the remaining external automatic-reply and subscription-renewal checks. This product receipt does not claim those mail checks completed.

## Durable continuation

Preserve this release and the original palette/video. Resume only the listed affected production checks; do not repeat the successful public crawl or migration. The expanded database constraint can remain after a code rollback and must not be narrowed after larger sources exist. This receipt is a documentation-only branch follow-up; its commit is not a new product release.
