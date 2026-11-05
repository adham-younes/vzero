# Public content, shared design and Studio corrections — 5 November 2026

Status: IMPLEMENTED candidate; release build/TypeScript passed; production deployment and acceptance pending. Capacity migration `20261105124017_studio_document_source_capacity` is applied. Base production: PR67 / `a7b2f0a`. This receipt supersedes the earlier upgrade's rejected homepage illustration and text-only upload limit; historical receipts retain their original verification scope.

## Owner direction

The owner rejected inconsistent colours, generic/literally translated copy, the “clear structure for useful work” illustration, small text-only uploads, unexplained waits and technical cost counters in chat. The correction covers the public platform and Studio together. Preserve the original Hero/video and restored neutral/emerald palette. The earlier full-market review's implications remain applicable: describe a reusable builder, isolate workspaces, show practical tasks and distinguish available tools from unimplemented enterprise connectors. No search-ranking guarantee or unverified integration claims.

## Implemented

- Public content and visual consistency: separate EN/AR prose, concrete service examples, shared colour tokens, and removal of the rejected illustration. The public review note records the affected content and design scope.
- Reviewed knowledge import: PDF with selectable text, DOCX, XLSX, CSV, TXT, Markdown and valid JSON. Up to 4 MiB per file and 1 MiB extracted UTF-8 text. A user edits the extracted preview and explicitly adds it as a source. Extraction itself does not save a source or send the file to OpenAI.
- Bounded parsing: 200 PDF pages, 20 workbook sheets, 10,000 rows per sheet, 256 columns, 50,000 populated cells, 24 MiB expanded Office archive, 8 MiB per archive member and a 25-second cooperative parsing deadline (synchronous parser work is bounded structurally, not hard-preempted by a timer). Encrypted/scanned/oversized/unreadable documents return specific errors. XLSX reads visible-sheet values and does not execute formulas or macros. Layout and formula/hidden-sheet caveats appear beside the preview.
- Run progress: the Studio requests SSE and receives preparing/thinking/searching/coding/checking phases. Search/code phases come from actual provider tool events. Only a completed, validated, saved response reaches the conversation; answer fragments and hidden reasoning are not streamed. JSON clients continue to work. Stop uses the existing cancel endpoint and awaits the authoritative run state.
- Latency: independent permission and evidence reads run together; history evidence is fetched once per read, without cross-request caching. Live-session RLS, ownership and final source/permission checks remain. Provider model and high reasoning are unchanged. No universal latency reduction is claimed before measurement.
- Presentation: no estimated price in chat or activity. Token counts and processing duration appear only under an explicit technical-details disclosure in Activity.

## Database and API

The additive migration widens `knowledge_sources_content_check` from 12,000 to 1,048,576 UTF-8 bytes. No existing content, RLS policy, approval or idempotency record is rewritten. Code rollback can leave this expanded constraint in place; do not shrink it after larger sources exist.

New operation: `POST /api/v1/agents/{agentId}/sources/import`, authenticated owner + same origin + rate limits, exactly one multipart `file`; returns `{title,content,format,notices}`. Existing source POST accepts reviewed text using a dedicated bounded JSON reader. Global request limits remain unchanged.

For test-runs, `Accept: text/event-stream` returns `status {phase}`, terminal `result {run}` or transport/setup `error {error}` events with private/no-store headers. SSE HTTP200 alone is not success: consume the terminal run status.

## Verification boundary

Independent source reviews are recorded in [review evidence](evidence/source-review.json) and the [public-content note](PUBLIC-REVIEW.md). Build/TypeScript passed after correcting library type compatibility (the obsolete PDF.js eval option was removed; SAX strict-entity support was verified in the installed library). Documentation inventory and protected asset integrity checks passed. Required release build and final affected behavior are checked once on the production release. Evidence will identify the exact merge/deployment, representative EN/AR views, document imports and saved grounding, progress/final response and relevant rejection behavior. Historical current-user timing was inspected only as metadata and is not committed here.

Known limits: no OCR, legacy .doc/.xls, image understanding, arbitrary external connector execution, new team roles or payment settlement. ChatGPT client configuration and eligible plan-funded execution remain external prerequisites. One Tripo image prototype was generated (10 Studio credits); its visual quality and Free-plan publication limits exclude it from this production release. See [Tripo record](TRIPO.md). The removed graphic was not Tripo work. SEO changes improve clarity and metadata without promising rank.

Technical reference: [OpenAI response streaming](https://developers.openai.com/api/docs/guides/streaming-responses) and [streaming events](https://developers.openai.com/api/reference/resources/responses/streaming-events).
