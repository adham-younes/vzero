# Customer release execution ledger — 22 October 2026

Baseline: clean fresh clone and fetched origin/main f4f573a158a66f200e6055cf530afa3faa2eac9f. Branch codex/agynexa-customer-release-20261022, isolated worktree. All launch-plan artifacts preserved byte-identical with SHA256 manifest.

## Authorization and rulings

- Owner explicitly authorizes implementation, environment preparation, commits/push and one production release after gates. No DNS/domain, paid upgrades, outreach/email or destructive production cleanup.
- Ruling: latest coordinator addendum and direct owner instructions supersede plan approval waits, two exposed models, 4096-token/45-second defaults. Verify actual Groq capabilities and access before enabling third model; one selected model per ordinary turn.
- Ruling: use a normal isolated Git worktree: desktop managed-worktree API returned Not a git repository for this intentionally projectless executor. Fresh application repository remains untouched.
- Ruling: no unapproved 90-day purge or legal/commercial fact. Implement deletion/expiry support without activating cron or inventing policy; complete independent work and record real launch limitations.
- Ruling: owner batched-check policy supersedes per-edit Superpowers test cadence. Author tests alongside changes and run final integrated batch; fix/rerun affected failures.

## Exact ownership (shared worktree, no overlapping edits)

| Worker | Owned files |
|---|---|
| Lead backend/data/integration | lib/studio/* except demo-examples.ts; app/api/**; supabase/**; tests backend/database; package/env/test preparation; docs/agynexa-program status/API/resume/decisions; EXECUTION.md and release controls |
| UI/customer journey Sol High | @components/studio.tsx, studio-agent.tsx, agent-workspace.tsx, studio-widget.tsx, account-ui.tsx, project-brief.tsx; app/studio/page.tsx, app/ar/studio/page.tsx, app/account/page.tsx, app/ar/account/page.tsx; lib/studio/demo-examples.ts; tests/launch-browser*; own UI-RECORD.md |
| Bilingual content Sol High | lib/program-pages.json, service-catalog.json, agynexa.ts, solution-service-map.json, site-routes.ts; @components/program-layouts.tsx, service-catalog.tsx, service-directory.tsx (nonhome changes only); legal routes/content; tests/launch-copy-check.mjs; own CONTENT-LEDGER.md |

Protected: entire homepage dependency graph, shared home copy/nav/footer/global CSS/layout/Hero/video. Shared file edits require inspection and isolation of nonhome effects. No new design system.

## Integration contracts

- POST /api/v1/workspace/chat {locale} -> {workspace,agent}; neutral distinct customer_v1 ServiceFlow, reserved requestKey a6f00344-6e01-4e5f-9e25-cc5e431e0021, no source/publication side effects.
- Conversations GET agents/:id/conversations -> {conversations:[{id,title,updatedAt}],nextCursor}; GET/DELETE agents/:id/conversations/:conversationId -> {runs,nextCursor}/success; only authenticated actor/org/agent/studio scope.
- Existing agents POST provisions distinct assistant explicitly, idempotent requestKey, fixed template/model/name/instructions/language allowlist. Builder review draft is client-side until explicit create; actual saved ID/URL required. Lead supplies optional customer profile through controlled builder contract if needed.
- VisibleRun adds optional private-only chat:{schemaVersion:2,parts:[{kind,text,basis,citations}],nextQuestion,briefDraft}; historyState available/knowledge_changed/expired. Existing answer/citations/{run} retained. Full sources and snapshots never exposed.
- Approval remains exact stored title/details, decision-only HTTP body, internal status; lead adds DB transaction source recheck.
- Model registry returned by GET studio/models; UI uses production=true models; lead verifies all three mappings/output limits.

## Tasks / remaining work

0 baseline/context: IN PROGRESS; complete full market/artifact reading, dependency/home/resource baseline, real isolated engine.
1 contracts/migration: PENDING
2 chat-first entry and builder: PENDING
3 history/context/search/revocation: PENDING
4 provider/discovery/models: PENDING
5 outputs/approval/manual handoff: PENDING
6 bilingual copy/metadata: PENDING
7 legal truthful routes/synthetic demos: PENDING
8 documentation/release controls: PENDING
9 coordinated build/realDB/auth/security/browser/copy/home batch: PENDING
10 production migration/code/flags/promotion/live verification: PENDING

Resource snapshot: 8GiB RAM, 8CPU, 28GiB available disk. No Docker/Colima on PATH; locate engine before install. No product checks yet.

## Phase log — baseline and backend contracts

- Full spec/plan/builder/architecture/addendum read; complete artifacts copied without compression, SHA manifest retained. Latest owner release strategy now permits **each coherent completed product increment to production**, replacing single-release policy. Runtime+schema+UI remain coupled; no unfinished flow ships.
- Fresh production Vercel project verified READY dpl_6G3gMAQbEmqqCEUQMdojkz1v4HnV. Supabase ACTIVE_HEALTHY PostgreSQL17.11; hosted migration names match local definitions with historical timestamp differences. Table sizes: agents81920, chunks196608, runs204800 bytes. No production mutation performed.
- Locked pnpm installation completed; Next route-handler docs read. No dependency or lockfile change intended. Installed pnpm12.4.2 vs packageManager12.3.4; frozen lock succeeded.
- Docker search found stale Homebrew/Desktop symlinks to missing /Applications/Docker.app, no engine. Authorized Colima/docker/compose installation completed; dedicated agynexa-release VM starting 2CPU/2GiB, activate=false. Existing user contexts/workloads not touched.
- Added exact chat contracts, scoped conversation reads/list/delete APIs, separate customer bootstrap, normalized-query helper and backend test authoring. NOT VERIFIED until integrated batch.
- Migration generated by Supabase CLI as 20261021221316_customer_chat_profile.sql (host UTC date differs from client Cairo22Oct). Additive profile/index/nullable retention, exact source provenance and DB approval recheck. No timer/purge or legacy rewrite.
- Security ruling: revoke direct authenticated raw run/proposal SELECT; first-party routes use server-only reads after exact actor/org/agent scope and source visibility. This closes stale content via raw Data API as well as UI. Cost: clients using undocumented raw table reads must use supported first-party endpoints.
- Content worker granted narrow solution branch ownership in @components/agynexa-pages.tsx; home dependency graph frozen. UI worker contract builder:true maps server-side customer profile on authenticated create.
- Groq official docs checked: strict structured output currently excludes streaming/tool-use; output maxima 65536/65536/16384. Account access/inference still NOT VERIFIED for new candidate. No provider calls yet. See https://console.groq.com/docs/models and https://console.groq.com/docs/structured-outputs .
- Next: finish runtime/finalization/history integration, verified provider mapping, local DB health, then coordinated affected acceptance.

## Phase log — runtime/history and test environment authored

- Backend files changed: chat-contract.ts, customer-entry.ts, conversation-store.ts, history-visibility.ts, conversation.ts, runtime/provider/models/settings/server/validation/presentation/publishing; workspace/chat and conversation routes; activity/run/cancel/usage/approval/create routes. Purpose: useful separate default+configured assistant, full scoped turns before lexical retrieval, conservative provenance and exact human approval.
- Draft schema uses parts with kind/basis/citations and one next question; briefDraft is deliberately null server-side. UI derives reviewed brief only from user-entered task facts. Ruling: prevents model/source text from being silently copied into an independent private brief. Cost: users complete form review rather than receiving automatic generated form fields.
- Model allowance now65536/65536/16384 by intended server key slot; low reasoning for ordinary GPT-OSS chat, Qwen none; strict schema retained without streaming/tool calls because current Groq docs say incompatible. Provider access and actual timings remain NOT VERIFIED. No arbitrary message-count limit added. Existing abuse/concurrency protection retained.
- Removed artificial45-second app deadline; route maxDuration300 and database lease295 seconds track Vercel hosting lifecycle, not a response-time guarantee. Required cancellation and late-finalization guards remain. No synthetic typing delay; 429 waits only provider retry-after.
- Dedicated Colima VM healthy2CPU/2GiB. Initial stack failure traced to /tmp not being a default Colima mount: bootstrap SQL appeared as a directory in VM. Corrected configurable test-stack directory to workspace work/local-stack; removed ONLY failed dedicated synthetic volume and started again. PostgreSQL17.11 and Kong healthy; Auth/PostgREST running, endpoint/migration acceptance pending. No OOM observed.
- Release compatibility ruling: split raw history SELECT revocation into 20261021222156_protected_history_reads, applied AFTER compatible app is serving; first additive migration can coexist with baseline callers. Both must pass isolated tests. Cost: old raw-read boundary persists briefly until coordinated final security migration; release receipt must mark closure.
- Authored focused tests/launch-contract.cjs and launch-security.py, one real isolated two-user/runtime+RLS/revocation/approval/public-boundary gate. No application/build/DB acceptance tests run yet. Browser worker authors one integrated flow harness; no broad per-edit suites.
- Source deletion locks same agent as finalization/approval. DB decision rechecks all source dependencies inside transaction. No unapproved retention purge/cron; nullable expiry support only.
- Reconciliation of complete market review: adopt concrete task/input/output/reviewer, current-system alternatives and truthful manual handoff. Reject historic RFQ pivot/home modifications/campaign targets as superseded by owner scope. Existing ten services/nine solutions and ten selectors remain.
- Coherent product phase: customer chat+builder+safe history+matching bilingual explanation are coupled; no transient marketing promise ahead of runtime. Completed product phase ends production deployment+receipt. Internal prep steps have no useful independent production behavior.
- Remaining: independent cross-worker review, minimal final candidate build/contract/realDB/Auth/browser/home gate, forward migrations and existing-project production deployment, live affected checks, durable evidence/status.

## Coordinated verification phase — initial results

- Necessary production build: PASS (`pnpm exec next build`), no TypeScript/build failures. No broad build repetition; later source fixes require affected build only if needed.
- Focused pure contracts:11 PASS. Existing account validation:4 PASS. Copy/home source protection:8 groups PASS after correcting test JSON-import loader (esModuleInterop matched tsconfig). Actual six EN/AR home renders at390/768/1440 compared with current production: text/lang/dir/overflow/video properties/body-heading-header-footer colors/fonts all equal. Screenshots and `evidence/home-comparison.json` retained.
- Real isolated migrations: all six applicable migrations PASS on PostgreSQL17.11/Auth/PostgREST/Kong. Hosted-only event-trigger restriction migration not applicable to plain local PG (platform event trigger absent); original account and Studio schema plus both new migrations applied. No production mutation yet.
- Real isolated Auth/RLS/security/runtime gate:38 PASS (`evidence/security.json`). Provider is a deterministic model boundary fixture injected outside production code; DB/Auth/RLS/transactions and HTTP routes are real. **This does not establish live model semantics or end-to-end live inference.** Includes ten-way bootstrap, personal agent unchanged, two authenticated users, mixed-script search, source revocation/replay/activity/proposals, exact approval transaction, late hash-change/cancelled output, raw Data API denial, public/private boundary and scoped deletion. Initial harness incorrectly expected anon table read `[]` instead of allowed permission-denied; corrected to use second authenticated user's real JWT and reran affected security harness.
- Browser gate is running in the existing requested worker slot, dedicated headless process. Python driver expected missing browser1200; reused existing cached Chromium1243 with explicit executable instead of installing another browser. Production home baseline captured after this dependency correction. No personal Chrome tabs touched.
- Sensitive Groq key export is unavailable by Vercel design. An initial probe accidentally used exported redaction markers (and a parser excluded numbered names); recorded INVALID/NOT_A_VALID_PROVIDER_TEST, not real-key failure. Markers never become credentials. No further export attempts. Owner reminded Vercel connector works; project/server access verified.
- Provider verification solution: documented `vercel deploy --prod --skip-domain` staging on existing project, production env server-held keys, no alias move. `tests/provider-release-smoke.mjs` exercises actual provider adapter and chat schema on tiny synthetic discovery/missing-policy/grounded-policy cases for all3 models during requested remote build. No diagnostic HTTP endpoint or secret output. Build gate fails on invalid access/schema/semantic-kind checks. Current production alias must be inspected before/after staging.
- Current route inventory updated to68 public localized URLs and38 HTTP operations/29 route files; source extractor updated for formatted solution slugs. Legal pages are operational notices with explicit missing contractual facts, not invented approved legal identity/retention terms.

- Public HTTP/locale/canonical smoke:68/68 PASS. Initial test mistook Next serialized fallback text for rendered404; replaced with actual404 heading check while retaining200/title/lang/dir/canonical assertions. Home source values unchanged.
- Maintained documentation validator:PASS,1115 markdown/373 file links/80 JSON/68 canonical URLs/38 operations; original master plan/evidence hashes preserved. Extractor corrected for formatted quoted solution slug fields and explicit legal routes. No runtime source change needed.
- Isolated browser first source-free check reused a source-populated fixture account; worker moved to untouched second synthetic account. Subsequent form success assertion/label matching were harness assumptions; worker resumes affected portions. Actual new-customer chat and explicit brief review/consent/private save passed so far, no page errors. Final browser gate pending.
- Historical authorized Chrome audit-tab ID no longer exists in current Chrome inventory. No other personal tab was claimed, navigated or resized. Authenticated live production browser check remains NOT VERIFIED unless a usable authorized session becomes available. No production fixture accounts will be created.

- Browser gate PASS:8 cumulative journey groups, zero page errors, explicit390/768/1440 EN/AR coverage (actual small width390). Evidence `evidence/browser/browser.json` and screenshots. New distinct saved agent/test, optional private synthetic source/citations, refresh/follow-up, exact internal approval, source-delete redaction, private brief review/consent, explicit Arabic conversation deletion. Provider fixture limitation remains explicit. Harness-only failed assumptions preserved; affected continuation resumed without repeating successful chat/brief writes. No app source fix/build rerun required.
- Candidate implementation commit cbdc133a00a4b3afaf38b75963e40f16dcad8839. Protected artifact archive SHA256 remains fully byte-identical. Full diff whitespace check reports only preserved trailing blank lines in2 original research documents; intentionally retained to honor byte-identical full-plan preservation. Code/edited files checked separately.
- Staged Vercel production-target deployment uploading/building with --skip-domain, release commit metadata and server flags. Current public alias still resolves old dpl_6G3gMAQbEmqqCEUQMdojkz1v4HnV before release. No domain/DNS operation.
- Hosted schema-only restore record saved privately under work/hosted-schema-before.json (function definitions only, no customer records/secrets); current source migration definitions also retained. Forward migration and security-compatible rollback are documented.

## Affected staged-provider failure and correction

- Staged deployment dpl_JC3Nr7YQnBXgmyFLqV7heTXQEfgb ERROR; public aliases were not promoted. Next build passed. Actual GPT-OSS120B calls passed discovery(561ms) and unsupported-policy(508ms), max allowance65536 accepted. Third grounded case failed server kind/basis/citation validation: non-grounded part carried source basis/citations. No unsafe output accepted.
- Root: provider schema had independent kind/basis enums, allowing combinations forbidden by server. Fixed provider schema with documented anyOf composition and kind-specific basis/citation constraints; non-grounded maxItems0, grounded minItems1/maxItems6. Server validator stays strict; no silent unrestricted downgrade. Actual provider compatibility of array cardinality constraints is checked by the affected remote gate, not assumed.
- Add failure diagnostics limited to model/sample/kind/basis/citation count, never secrets or private content. Required next: affected contract check and staged remote build/actual model gate; no broad local DB/browser rerun for schema-only provider correction unless new evidence requires it.

- Second staged gate dpl_BsBzifa4XGwmJMDaE5CLa5bENFSB ERROR before inference: Groq400 surfaced safely as provider_model_unsupported. Cardinality keywords were not documented in provider subset; removed minItems/maxItems rather than assume support. New documented anyOf variants omit citationChunkIds entirely from non-grounded provider objects; adapter deterministically attaches canonical[] (no raw-text/schema downgrade). Grounded variant alone can contain IDs; server still validates membership/count/required citations. Affected remote gate will establish compatibility. Added bounded build-only provider error diagnostics, no credentials/private data.
- Affected transitive revocation regression PASS: model context includes prior sourceA while current lexical retrieval matches onlyB; persisted dependencies include both; deletingA redacts derivedB replay with no chat/citations. Evidence `evidence/transitive.json`. Real DB/Auth/runtime, deterministic provider boundary.

- Third staged gate dpl_3kHoVc9DLzq185kroNbkeSxnNbjt ERROR diagnostic established exact provider constraint: anyOf disambiguation rejected multiple enum discriminator candidates (`basis`, `kind`). This supersedes the provisional cardinality diagnosis. Corrected to one `kind` discriminator; server derives basis and canonical empty citation arrays. No additional provider formatting authority; strict server validator remains. Affected provider gate/build required after this concrete correction.
- Compatibility review found baseline replay hashes include source/revision fields while new hashes intentionally do not (so revocation can return redaction). Without legacy adaptation, old identical retries409. Added fallback ONLY on a genuine request_conflict: exact actor/org/agent/access/conversation/question/model/version/identity and recomputed old snapshot hash must match; then same atomic start RPC and current visibility apply. Normal requests add no query. Targeted real regression reproduced old409 (legacy-replay-red.log); affected rebuilt runtime will verify pass. No cross-scope fallback.
- PR created as draft and attached: https://github.com/adham-younes/vzero/pull/33 . Do not merge until actual provider gate passes. Feature branch pushed; platform preview build is distinct from production promotion.

- Fourth staged gate dpl_EAcaJFXkrQhvQDa59ExNuiYPgQgy: actual adapter/schema cases for GPT-OSS120B and20B ALL PASS (6 samples); Qwen access/inference succeeded but source-free output selected grounded parts with empty citations, correctly rejected. Latencies120B418–614ms,20B186–297ms for these small synthetic cases; not full-request latency or an SLA. Allowances65536 accepted. No production aliases moved.
- Source-free policy correction: provider schema now omits grounded variant entirely when no authorized chunks exist; no empty enum is constructed. With chunks, grounded IDs use the nonempty authorized allowlist and minItems1. This makes evidence availability a server constraint, not a model choice. Canonical server validation retained. Affected staged gate must verify actual compatibility/Qwen behavior before promotion.
- Scoped legacy replay/transitive regression now PASS after affected build, including old409 reproduction and current safe replay after source revocation. Previous real data/security/browser checks remain valid; no source/auth/UI change from provider-schema-only correction.

- Remote build command reordered: requested tiny provider gate runs before Next compilation, so a rejected provider candidate fails fast without another unnecessary application build. Standard builds without explicit verification flag perform normal build only.

- Fifth gate dpl_3vbPm1buvKzzQfPxxYiejwBgdsnN: full120B samples passed;20B source-free sample did not satisfy the smoke's narrow kind check. This did not establish a schema/access failure. Review found smoke used an abbreviated prompt rather than the exact runtime policy, which explicitly permits user-fact drafting. Extracted the unchanged runtime instruction hierarchy into pure chat-policy.ts and made smoke consume it. Clarified actual source-free policy: supplied-fact outline/checklist uses discovery/draft, never requires a file solely because sources absent. Smoke accepts a truthful capability introduction with a concrete next question as a useful first response, instead of grading a label alone; company-fact missing-evidence and cited-policy gates remain. Bounded synthetic semantic rejection content will distinguish actual refusal from harmless kind choice.

- Sixth remote gate dpl_FcrHqdbogoV9WPvaCS7U1ijHs75H: full log inspection established provider400 `json_validate_failed`, missing required briefDraft/support on20B unsupported-policy case, after120B all3 and20B discovery passed. This is actual provider schema-generation failure, not model availability. Added one immediate retry of the SAME strict schema only for that explicit error code; repeated invalid generation remains invalid_model_output, auth/model/schema errors never silently downgrade. Clarified required top-level refusal/proposal fields in actual policy. Targeted provider fault test reproduced original failure (RED), then verifies bounded retry, unchanged schema/max allowance, canonical fields, and no auth retry (GREEN). No synthetic delay or all-model fan-out added to normal chat.
