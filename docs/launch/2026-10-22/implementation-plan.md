# AGYNEXA Chat-First Customer Release Implementation Plan

> **For agentic workers:** Use `superpowers:executing-plans` for the approved project execution. Do not spawn additional agents solely because this plan exists. Steps use checkboxes. The owner's explicit policy overrides per-edit test runs: author the relevant checks with their tasks and run the necessary application/database/browser checks as a coordinated delivery batch.

**Status:** complete proposed plan for coordinator/owner review, 22 October 2026. Planning only. Implementation, installation, database/configuration changes, publication, production promotion and domain work have not begun. Owner review and explicit “نفّذ” are required before product execution. “Complete plan” does not mean a ready product or an approved launch.

**Later scope checkpoint:** the owner is now exploring a customer Agent Builder/Studio. This document remains the preserved two-template baseline, not the final owner-selected scope. Read [agent-builder-options.md](agent-builder-options.md); parent consolidation and the owner's scope decision must precede any execution. Do not treat an earlier task checkbox as approval to build a separate autonomous-agent platform.

**Goal:** Deliver two bounded customer offerings—KnowledgeGrid and ServiceFlow—through a useful chat-first private workspace and clear bilingual marketing, while preserving the entire approved homepage/Hero/video and existing private/public boundaries.

**Architecture:** Reuse Next.js, Supabase workspace initialization, the existing agent templates and run records. Add a customer discovery profile, bounded complete-turn context, lexical retrieval normalization and typed response parts, using one selected existing production model call. Keep sourced company answers and public widgets strict; internal approval and private brief storage never imply external delivery.

**Tech Stack:** Existing Next.js 16.4, React 19.2, TypeScript, Supabase Auth/Postgres 17/RLS and Groq. No new model provider, orchestration framework, paid research connector or operational-system integration.

**Spec:** [Product specification](product-spec.md), [planning brief](planning-brief.md), [runtime adapters](runtime-adapters.md), [research decisions](research-decisions.md), [content strategy](content-strategy-review.md), [competitor alternatives](competitive-alternatives.md).

## Global constraints

- Preserve entire homepage/opening screen, both Hero files, original video, approved colors/fonts/identity and behavior; guard indirect shared-style/content changes.
- Preserve ten-service/nine-solution taxonomy, existing routes, Arabic/English parity and existing customer data, private agent settings and immutable publication snapshots.
- Default customer journey works before any upload. Supported knowledge remains pasted text/TXT/MD at most 12,000 UTF-8 bytes; no PDF/OCR/vector search claims.
- No external sending, campaigns, purchases, billing, CRM/ERP/helpdesk/EHR integrations, regulated autonomous decisions, production fixture accounts or paid cloud fallback.
- Tests are batched at delivery. Database/auth isolation must use a real isolated compatible database, not an unvalidated mock.
- Product execution starts only after owner approval; production promotion/domain connection remain separately gated launch actions.

## Review focus

1. A discovery response must not become an unsupported company-policy answer merely because a model labels it a draft.
2. Revoked source facts must not return through persisted answers, generated briefs, replayed requests or activity rendering.
3. Concurrent bootstrap, model timeout/cancellation and replay must preserve actor isolation and create at most one intended assistant/proposal.
4. Shared metadata, navigation, layouts and styles must not alter any protected homepage behavior.
5. A private save or internally approved request must never appear to have reached AGYNEXA or another organization.

## 1. Architecture and scope decisions

The two saleable offers and full customer journeys are in [product-spec.md](product-spec.md). The recommended commercial model is a scoped pilot/implementation engagement, not an invented subscription or ten finished applications. KnowledgeGrid supplies answers/summaries from short approved company text. ServiceFlow turns an issue into a reviewable brief and exact internal request. Both share the chat infrastructure; their template/purpose differs. No vertical-specific backend is added.

The default customer assistant is a **new, separate ServiceFlow assistant with `customer_v1` chat profile**. Existing agents become `grounded_v1` through an additive default and retain name, template, instructions, language, selected model, sources, publications and history. Do not auto-select the owner's personal collaboration agent as a customer demonstration. New ordinary customer turns default to the existing Fast model `openai/gpt-oss-20b`; existing agents retain their model. Existing Advanced `openai/gpt-oss-120b` and deliberate Compare remain available through existing controls. Third-model internal evaluation is outside this release gate.

The server authorizes first, loads complete scoped turns, retrieves bounded evidence, then makes **one selected production-model call per ordinary turn**. Retrieval is an input to answering, not a prerequisite to business discovery. There is no separate model router, autonomous product multi-agent system, new model provider or paid connector. The server, not a model-generated intent label, controls access, allowable response kinds and actions.

Private `customer_v1` may introduce itself, clarify a task and prepare drafts without sources. All company-policy/price/status/eligibility claims still require current permitted evidence. Private `grounded_v1` and all API/widget calls retain source-backed factual behavior. Public/API callers cannot turn on discovery by passing a profile, mode or model. Public prompts continue to omit private instructions, private history and unpublished knowledge.

Replace exact-regex private greeting/identity responses with the same capability-aware conversation path. Render a truthful initial welcome locally from real capability metadata before the first message. Static welcome copy is not a substitute for model conversation. No-source company questions get a specific missing-evidence response and useful next step, rather than an unrelated generic answer.

No external inbox, notification, campaign, live lookup, purchase, refund or account update is created. An existing support request's approved state means internal approval only. Project briefs remain private owner storage, with download and explicit manual sending. A staff receiving queue is a separately approved product expansion.

## 2. File responsibilities

Paths below are repository-relative planned execution targets, not files edited during planning. Verify their current definitions at execution against the supplied baseline before applying changes. Follow established code organization; do not split unrelated modules or alter protected shared layout behavior.

| File | Planned responsibility |
|---|---|
| `lib/studio/chat-contract.ts` **new** | Versioned response/context types, supported capability registry and finite constants; no database/provider access |
| `lib/studio/customer-entry.ts` **new** | Idempotent separate customer-assistant provisioning using existing workspace/agent helpers; no personal-agent reuse |
| `lib/studio/conversation.ts` | Full-turn scope, context budget, conversation list/read/delete, and reference-aware query construction |
| `lib/studio/history-visibility.ts` **new** | One visibility/provenance decision reused by context, activity, history and replay; raw snapshots never returned |
| `lib/studio/runtime.ts` | Policy selection, context-before-retrieval orchestration, validated finalization, expiry/cancellation/idempotency |
| `lib/studio/provider.ts` | Existing Groq one-call adapter; strict legacy output and customer-v2 structured output; no provider change |
| `lib/studio/server.ts` | Authorized reads/mutations/RPC adapters, profile selects and transaction boundaries |
| `lib/studio/settings.ts`, `validation.ts`, `presentation.ts` | Profile/capability validation, response validation and safe visible-run adapter; preserve existing settings limits |
| `lib/studio/models.ts` | Preserve allowlist/current Fast/Advanced behavior; no third model exposed |
| `lib/studio/publishing.ts` | Preserve public configuration sanitization and publication behavior; only adapt shared visibility helpers where necessary |
| `app/api/v1/workspace/chat/route.ts` **new** | First-party authenticated chat bootstrap, same-origin mutation validation |
| `app/api/v1/agents/[agentId]/conversations/route.ts` **new** | Private actor-scoped paginated conversation list |
| `app/api/v1/agents/[agentId]/conversations/[conversationId]/route.ts` **new** | Private actor-scoped read/delete; no public conversation endpoint |
| Existing `test-runs`, `activity`, source-delete and approval routes | Use compatible runtime/visibility behavior; preserve exact approval body and source deletion cancellation |
| Existing published `invoke` and widget routes | Preserve request allowlist, `{run}` envelope, strict grounding and access-kind identity |
| `@components/studio.tsx`, `studio-agent.tsx`, `agent-workspace.tsx` | Obvious default conversation, capability identity, optional sources, resumed history and safe action/draft states |
| `@components/studio-widget.tsx` | Only shared error/citation compatibility if needed; no customer discovery/private data |
| `@components/account-ui.tsx` | Correct private-save/review wording; safe default login destination while preserving explicit return intent |
| `@components/project-brief.tsx` | Accept reviewed chat draft as initial form values, preserve explicit save/consent, accurate save/download/manual-send states |
| `app/studio/page.tsx`, `app/account/page.tsx` and existing Arabic equivalents | Entry destination and locale integration; never write data on a server GET/render |
| `@components/program-layouts.tsx`, `service-catalog.tsx`, `service-directory.tsx` | Reorder editable page sections within template; problem/input/output/limit/CTA presentation |
| `lib/program-pages.json`, `service-catalog.json`, `agynexa.ts`, `solution-service-map.json` | Bilingual factual copy and existing service/solution mapping; no new taxonomy |
| `lib/site-routes.ts` | Route-scoped metadata, locale/canonical/link correctness; do not change global site URL or home metadata by implication |
| `lib/legal-content.ts` **new**; `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/ar/privacy/page.tsx`, `app/ar/terms/page.tsx` **new** | Owner-approved legal facts/content and four real legal routes following existing locale/page conventions |
| `lib/studio/demo-examples.ts` **new** | Two synthetic text packs/expected outputs; explicit loading only, never owner data |
| `supabase/migrations/20261022150000_customer_chat_profile.sql` **new; check timestamp collision before creation** | Agent profile, run-content retention marker, safe search-normalization function/index, required private RPCs and grants |
| `tests/studio-conversation.cjs`, `studio-http.py`, `studio-release.py`, `studio-browser.py` | Contract/context, real DB isolation, HTTP and isolated browser acceptance coverage |
| `tests/accounts-http.py`, `account-profile-regression.py`, `account-validation.test.mjs` | Preserve auth/profile/brief behavior and explicit save validation |
| `tests/launch-copy-check.mjs` **new** | Route/copy capability ledger, locale coverage, home-protection assertions and metadata checks; not a substitute for reader review |

Protected paths include `@components/landing-5-hero-video.tsx`, `@components/landing-5-hero-section.tsx`, `public/videos/background.mp4` **and every other dependency affecting the entire homepage**. Freeze shared homepage navigation/footer copy and global theme tokens; a shared file not appearing in this list is not permission to change home behavior.

## 3. Exact contracts and bounds

Proposed exported contracts live in `lib/studio/chat-contract.ts`; reuse existing `Agent`, `Workspace`, `Citation`, `VisibleRun`, `ServiceCatalogId` and session/scope types rather than duplicating them. Where the current code uses another export name, keep that existing name behind the indicated adapter and document it in the implementation evidence.

```ts
type ChatProfile = 'grounded_v1' | 'customer_v1';
type ChatScope = Readonly<{
  orgId: string; agentId: string; actorId: string;
  accessKind: 'studio' | 'api' | 'widget'; conversationId: string;
}>;
type ChatPartKind = 'capability' | 'discovery' | 'draft' |
  'grounded' | 'missing_evidence' | 'unavailable_action';
type ChatPart = {
  kind: ChatPartKind; text: string;
  basis: 'product_capabilities' | 'user_supplied' | 'suggestion' | 'approved_sources';
  citations: Citation[]; // attached by server, never trusted provider quotes
};
type BriefDraft = {
  serviceId: ServiceCatalogId | null;
  problem: string; sources: string; acceptance: string;
  assumptions: string[]; missingInputs: string[];
};
type ChatResponseV2 = {
  schemaVersion: 2; parts: ChatPart[]; nextQuestion: string | null;
  briefDraft: BriefDraft | null;
};
type TurnContext = {
  runId: string; userText: string; assistantParts: ChatPart[];
  sourceDependencies: { sourceId: string; chunkId: string; contentHash: string }[];
};
type RunChatSnapshotV2 = {
  schemaVersion: 2; profile: ChatProfile; policyVersion: '2026-10-v1';
  response: ChatResponseV2;
  sourceDependencies: { sourceId: string; chunkId: string; contentHash: string }[];
};
```

`RawProviderChatV2` is a simple fixed object with `parts`, `nextQuestion`, `briefDraft` and the **existing** `support:{propose,title,details}` fields. Each raw part has `kind`, `text`, `basis`, `citationChunkIds:string[]`; it does not contain source IDs, titles, quotes or a tool/action name. Use a fixed string-array schema with server allowlist validation rather than constructing an invalid empty citation enum. Enforce kind/basis/citation combinations in TypeScript even if the provider accepts a looser JSON schema. Do not rely on a provider supporting a new JSON-schema keyword without compatibility verification.

The server finalizer attaches citations from the authorized chunk map; model-supplied IDs outside it fail validation. Grounded parts require at least one citation. `approved_sources` is only valid on grounded parts. Capability parts may assert only the registry's supported functions; drafts/discovery cannot turn unsupported policy/status/price/eligibility into facts. Mixed responses use separate parts. Absence of citations alone cannot prove factual safety: prompts, adversarial acceptance samples and review must check drafts as well. Citation membership also does not prove semantic entailment; source-answer agreement is an explicit evaluation case.

| Value | Proposed/default behavior |
|---|---|
| Message/input limits | Preserve message 1–3,000 characters, JSON mutation body 20,000 bytes, existing UUID validation/unknown-key rejection |
| Knowledge limits | Preserve title 1–160, text character check and 12,000 UTF-8-byte check, no NUL; original chunk window 1,200/step 1,000/content max 1,400 |
| Agent limits | Preserve name 100, instructions 6,000, language en/ar, positive revision; profile is server-owned during bootstrap |
| Context | Latest **6 complete successful turns**, max **18,000 characters** total user+assistant text; drop oldest whole turns until under budget; no automatic model summaries |
| Source context | Max **6 chunks**; preserve original content/citations. Up to 4 current weighted lexical matches plus up to 2 currently authorized prior-cited chunks for a contextual continuation; deduplicate and fill unused slots from current ranking |
| Query expansion | Current message max 16 normalized tokens plus max 8 tokens from each of latest 2 prior user turns; current match weight 1, history 0.25; no raw SQL interpolation |
| Continuation eligibility | Current normalized input at most 12 tokens, or explicit supported EN/AR referential phrases; affects retrieval expansion only, never canned answers/permission |
| Response | Existing total answer max 12,000 characters and max 6 unique citations; 1–6 parts; nextQuestion max 500 characters; max 5 assumptions and 5 missing-input items, each max 300 characters |
| Brief draft | problem/sources/acceptance each max 1,500; serviceId existing allowlist or null. Missing organization/email/service/consent must be completed/reviewed by user before save |
| Model/call | One selected allowlisted model; retain nonstreaming 4,096 output tokens, existing 45-second total provider deadline and bounded 429 retry, route 60-second/run 55-second envelope. Retry wait consumes the deadline |
| Rates/concurrency | Preserve concurrency 6, global 100/min, per identity 60/min and widget 30/IP/min + 60/agent/min; do not raise limits for chat-first entry |
| History list/read | Latest 50 conversation summaries/page; max 30 visible runs/page, keyset cursor with created_at+ID; no unbounded history payload |
| Support proposal | Preserve title 160/details 3,000; exact stored payload; pending expiry 15 minutes; no new completion/delivery state |
| New customer history retention | Recommended maximum **90 days in active product data**, implemented only after owner approves this retention choice; legacy records remain outside automatic purge until separately reviewed |

Source-free greetings/discovery use the provider schema with empty citation arrays legally allowed. A no-source company question returns `missing_evidence`; it may still help frame what information is needed. If schema validation fails, return a safe bounded failure rather than downgrade silently to unrestricted text. Keep existing timeout/cancel/retry UX and user draft text.

### New/compatible endpoints and function signatures

`POST /api/v1/workspace/chat` accepts **only** `{locale:'en'|'ar'}` through the existing same-origin authenticated mutation parser. It calls `ensureCustomerAssistant(session, locale): Promise<{workspace:Workspace, agent:Agent}>`. Use the existing atomic `initialize_workspace()` followed by the existing authorized agent-create path with reserved UUID request key `a6f00344-6e01-4e5f-9e25-cc5e431e0021`, template `serviceflow`, profile `customer_v1`, locale-specific neutral business-assistant name and Fast model. Existing unique `(org_id,request_key)` resolves retries/races; re-read under the same authenticated organization after conflict. Never update an existing row's instructions/settings to satisfy bootstrap. An unexpected reserved-key/profile conflict returns a safe `409 default_assistant_conflict`; do not overwrite an existing agent. This request does not create a source, publication, brief or support request.

Do not change the existing `{}` workspace bootstrap contract or add hidden side effects to its old callers. Do not provision on server GET/render. The mounted authenticated Studio uses the new explicit POST and handles retry; successful provisioning returns the same intended assistant on repeated/concurrent calls.

`GET /api/v1/agents/[agentId]/conversations?cursor=...` returns `{conversations:[{id,title,updatedAt}],nextCursor:string|null}`. Title is a plain-text truncated first user question, max 80 characters; never a private prompt/source excerpt or model call. Scope is authenticated actor+organization+agent+`studio` only.

`GET /api/v1/agents/[agentId]/conversations/[conversationId]?before=...` returns `{runs:VisibleRunV2[],nextCursor:string|null}` after visibility filtering. `DELETE` accepts `{}` using the same-origin mutation parser and atomically deletes only that actor's Studio conversation and its dependent internal proposals. It requires explicit UI confirmation. A nonowned conversation returns the same safe missing/denied behavior as other protected resources, not metadata about another actor.

`VisibleRunV2 = VisibleRun & {chat?:ChatResponseV2; historyState?:'available'|'knowledge_changed'|'expired'}`. Existing `answer` is a safe plain-text rendering of validated parts; existing `citations` are the unique attached source citations. The optional `chat` field is returned **only** in authenticated private Studio presentation. Public/API visible runs keep their existing fields and `{run}` wrapper. Never return raw `snapshot`, private instructions or provider payloads. Keep existing public/API allowed request fields unchanged; do not accept a caller-supplied `chatProfile`, tool, action or runtime mode.

`loadConversationContext(scope:ChatScope): Promise<TurnContext[]>`, `readVisibleConversation(scope,cursor): Promise<...>`, `isRunContentVisible(scope,run): Promise<{visible:boolean,reason?:'knowledge_changed'|'expired'}>`, `buildRetrievalQuery(message,turns): RetrievalQuery`, and `validateChatResponse(raw,policy,authorizedChunks): ChatResponseV2` are the named shared interfaces. Effective profile is computed server-side from authenticated access kind, stored agent profile and feature flag. A model intent classifier is never an authorization input.

Keep existing test-run input fields exactly as supplied (`message,requestKey,conversationId,runId,model`) and published/widget fields (`message,requestKey,conversationId`). Run replay uniqueness remains agent/access-kind/request-key. **On every replay**, compare actor, conversation and input hash before returning data; another actor using the same key gets a generic conflict, not the original run. Reapply current visibility before returning a matching cached response. No new endpoint accepts actor/org IDs from the client as authority.

## 4. Context, grounding and revocation algorithm

1. Authenticate/resolve access scope using existing Studio/API/widget adapters. Capture org, agent, actor, access kind, conversation and current authorized source/publication scope; never infer authority from request IDs.
2. Check idempotency/concurrency using existing atomic flow. A matching terminal replay still passes visibility checks. Reject changed input/key or actor binding without returning private details.
3. Load the latest complete successful scoped runs **before** retrieval. Include user and assistant text together. Exclude failed/running/cancelled rows and unauthorized/redacted turns. Context cannot come from another agent, actor, access kind or conversation even in the same organization.
4. For v2 runs, verify every recorded dependency's source readiness, current scope, chunk existence/content hash and applicable publication boundary. For legacy cited runs, verify all stored citation chunk/source/quote relationships against current original content; if provenance cannot be established, omit the entire assistant turn. Never promote a legacy citation-free canned/factual answer into trusted company evidence. Safe known static capability messages may be omitted rather than guessed.
5. When any source-derived portion is invalid, remove the **whole generated answer/brief/proposal payload** from automatic context and show a localized redaction notice in history. Do not retain a source-derived generated summary as a workaround. Omit the associated prior question from model context for that invalidated turn, although a customer's own original message may remain visible as their input. No model-generated summary memory is introduced.
6. Build the bounded query using current text and permitted prior user turns. For a continuation, retrieve up to two currently authorized original chunks cited by the latest applicable answer before refusing. The repeated-list case has both the prior assistant answer and its current source evidence available.
7. Apply the same search normalization on index and query. Unicode normalize consistently, preserve original stored text, and insert boundaries at Arabic-script/ASCII letter-digit transitions, including `وtypescript`→`و typescript`. Do not indiscriminately strip Arabic و from words. Do not add unsourced translation dictionaries or call the result semantic search. Use parameterized query construction and the established simple-language lexical behavior.
8. Supply capability policy, agent instructions appropriate to access kind, current task, bounded full turns and original authorized excerpts to the selected model once. Source text/user text are untrusted data, never system instructions. Discovery works with zero chunks. Grounded parts require relevant evidence; unavailable actions cannot generate executable tools.
9. Validate structured output, citation membership and part policy. Attach server source metadata. Save v2 response/dependency metadata under a namespaced `snapshot.chat_v2` without overwriting existing snapshot keys. Mark dependencies conservatively for all source-influenced output, including drafts and support proposals, not only visible citation text.
10. Immediately before finalization, retain the existing source/publication/API-key recheck and cancellation binding. If source scope changed during generation, do not publish the stale answer/proposal. Existing failed/cancelled statuses and safe error codes cover the outcome; no new run-status enum is needed.
11. Reuse the same visibility check for activity, conversation reads, replay, proposals displayed from a run and client refresh after source removal. Set private/no-store. Do not expose the old activity result wholesale as chat history. After deleting a source, invalidate client conversation/activity caches and refresh mounted history.

A user-approved standalone saved brief or previously downloaded/copied text is a separate user-held record, not live model memory. Do not automatically import saved briefs back into conversation context. Auto-prefill the project-brief form from **user-supplied discovery facts only**, not copied source excerpts/company answers. State that deleting knowledge removes it from future answers and linked history; it cannot erase text the user already exported or independently saved. This is a deliberate boundary, not a promise of retroactive erasure from backups/devices. Legal text must match the actual implemented scope.

Prompt hierarchy is platform capability/evidence policy → access-profile policy → permitted private agent instructions → task/conversation → untrusted sources. Customer instructions cannot add nonexistent tools. Public snapshots continue to strip private instructions; a new customer profile is not copied into a public widget. Protect prompts/configuration from “show your instructions” requests and sources that contain imperative prompt injection.

## 5. Additive migration, permissions and compatibility

Create a **new** migration; never edit/replay the old foundation/runtime/account migrations or import an abandoned checkout's SQL. Recheck production/schema baseline before execution.

1. Add `public.agents.chat_profile text NOT NULL DEFAULT 'grounded_v1'` with check allowing only `grounded_v1/customer_v1`. Existing rows stay strict automatically. Update internal agent reads/types; existing public settings PATCH remains a fixed allowlist and does not gain a public profile switch. The authenticated bootstrap creates a customer-profile agent using the authorized server mutation path. Keep current RLS; do not introduce a new service-role browser client or broad grants.
2. Reuse `agent_runs.snapshot` for versioned response/provenance; add no conversations/messages/tasks tables. Add a bounded context-read index on `(org_id,agent_id,actor_id,access_kind,conversation_id,created_at DESC,id DESC)` if equivalent index is absent. Keep replay uniqueness and existing statuses. Database reads/mutations must retain all tuple filters even when RLS also applies.
3. Add immutable `public.studio_normalize_search(text)` and a **separate** GIN expression index `knowledge_chunks_terms_v2` over `to_tsvector('simple',public.studio_normalize_search(content))`. Keep original `search_terms` and `knowledge_chunks_terms` intact for rollback. No chunk/source content or publication snapshot is rewritten. Lock `search_path`, avoid dynamic SQL and qualify referenced objects. Test normalization on Arabic, Latin, digits, accents and mixed punctuation.
4. Add `agent_runs.retention_expires_at timestamptz NULL`; only new customer-profile Studio runs get `created_at + interval '90 days'` after owner approves the policy. Existing rows remain NULL and are not bulk-expired. Context/history treat expiry as unavailable immediately. A private purge function removes expired customer run content and dependent internal requests atomically; it must not delete source knowledge, existing publications or unrelated briefs.
5. Recommended scheduler is the existing database's supported `pg_cron` daily job at 03:00 UTC, installed/scheduled only after extension permissions and real local/hosted compatibility are verified. Purge function is not executable by anon/authenticated; keep owner/admin-only execution, fixed search path and narrowly scoped predicates. No HTTP secret endpoint, new queue service or paid project is added. If the scheduler is unavailable, **do not promise automatic 90-day deletion**: block that public retention claim/launch until the owner approves a truthful verified alternative. Do not silently apply a retention purge to legacy personal data.
6. Conversation delete uses an authenticated atomic database mutation/RPC `studio_delete_conversation(p_agent_id uuid,p_conversation_id uuid)` that derives `auth.uid()`/org/access-kind itself and deletes only Studio runs and their dependent proposals. No arbitrary owner/access-kind parameters or SECURITY DEFINER escape. If existing RLS-compatible helper patterns require SECURITY DEFINER, match the audited fixed-search-path/explicit-auth pattern, revoke public execution and grant only authenticated. A supplied other-agent/conversation pair must affect zero unauthorized rows.
7. Extend the existing atomic approval-decision branch in `studio_mutate` to recheck the owning run's current source dependencies/access at the decision point. A TypeScript/UI precheck alone is insufficient. If required evidence has been revoked, fail safely and expire the pending proposal using the existing status set; do not approve it after a source-delete race. Keep the HTTP decision-only body unchanged and do not edit the old migration in place.

Migration execution uses a short lock timeout (3 seconds) and bounded statement timeout (30 seconds); inspect table/index size and the migration plan first. If it cannot complete safely, stop and prepare a reviewed maintenance/concurrent-index approach instead of increasing locks blindly. Record applied migration version, schema diff and rollback instructions. Database-backed tests must cover grants/RLS, not only HTTP handlers using a privileged key.

Use two server switches: `STUDIO_CUSTOMER_CHAT_V2_ENABLED` and `STUDIO_SEARCH_NORMALIZATION_V2_ENABLED`, initially false until migration/schema presence is verified in that environment. Do not use a browser flag as security. Old code can run over added columns/indexes; default values and optional snapshot namespace are backward compatible. New code with flags off preserves old mode and old index. Avoid a migration backfill of agent instructions, model choices or publications.

## 6. Ordered implementation tasks

Checkboxes are execution tracking, not work already performed. Implement on the correct project thread/isolated managed worktree after approval; routine code choices follow this specification. Read required repository instructions/current status and installed framework docs at execution. Batch product checks in Task 9; do not run broad suites after each checkbox. A failed delivery check is fixed and rerun only for its affected scope before returning to the release gate.

### Task 0 — Confirm baseline, preserve the plan and prepare an isolated test path

**Depends on:** approved scope. **Produces:** trustworthy working baseline, protected-home evidence and a verified path to real DB/Auth tests.

- [ ] Recheck Git root/HEAD/status against `f4f573a158a66f200e6055cf530afa3faa2eac9f` and current production; retain unrelated changes. Use the current verified project, not the older abandoned checkout.
- [ ] Copy approved product spec, implementation plan, research decisions, selected source evidence and content ledger into `docs/launch/2026-10-22/`; link them from repository status/backlog/API/resume records following existing conventions. Keep secrets/private collaboration content out.
- [ ] Record protected file hashes and home desktop/mobile baseline in an isolated browser surface. Identify shared style/content/layout dependencies before editing them; add an allowlist of intentional nonhome changes.
- [ ] Install locked project dependencies with existing pnpm after checking package instructions; read bundled Next documentation before implementation. No dependency/provider/framework upgrade is part of this work.
- [ ] Locate/use the owner's existing Docker-compatible engine first; verify its context/engine and avoid modifying another workload. If genuinely unavailable, use the authorized free lightweight Colima+Docker CLI path. An editor extension alone is not an engine. Do not blindly install Docker Desktop or a second engine.
- [ ] Reserve a dedicated test context/project/ports. Start with a measured 2-CPU/2-GiB proposed VM cap only if supported; verify actual engine memory/OOM/health. Device is 8-GiB RAM/8 CPU/~31-GiB free at the prior snapshot; remeasure current free resources. No full-stack 7-GiB assumption and no simultaneous dev/build/DB workload.
- [ ] Validate minimal Supabase DB+gotrue+PostgREST+kong using installed CLI 2.117.0. Proposed exclusions: `realtime,storage-api,imgproxy,mailpit,postgres-meta,studio,edge-runtime,logflare,vector,supavisor`. Confirm fixture/bootstrap does not require an excluded service. Never use `--ignore-health-check`; add only a demonstrated required service within the measured budget.
- [ ] Keep local configuration pinned to `http://127.0.0.1:54321`, rejected on Vercel, and hosted configuration pinned to the established project. Set synthetic credentials locally without printing them. If a healthy real DB/Auth stack cannot fit, record the blocker and do not release schema changes; no unvalidated PGlite/mock, paid project or silent move to cloud.

**Acceptance owned by Task 9:** local engine/stack health and two synthetic users pass real RLS/auth checks; home baseline is available; no production fixtures or settings changed by tests. Preparing the runtime does not itself count as a database test pass.

### Task 1 — Add contracts and compatible database support

**Files:** new `chat-contract.ts`, migration; modify `settings.ts`, `server.ts`, `validation.ts`, `presentation.ts`; extend relevant database tests.

**Consumes:** Section 3 types/bounds and current schema. **Produces:** profile-aware `Agent`, snapshot adapter, normalization/index and private retention/delete behavior with existing grants preserved.

- [ ] Add exact v2/raw-provider types, constants and capability registry; keep all unsupported connectors/actions absent.
- [ ] Author migration from Section 5, including profile checks, scoped index, independent normalization index, retention marker/function and private delete mutation. Write grants and ownership predicates explicitly.
- [ ] Update authorized selects/inserts without expanding public PATCH/request allowlists. Make legacy snapshots render safely when v2 metadata is absent.
- [ ] Author real DB cases: all existing agents default strict; no data/instructions/publications changed; second user cannot select/mutate another org; normalize mixed script; private deletion affects only matching actor/agent/access kind; legacy rows are not retained/purged under a new policy accidentally.
- [ ] Record migration forward/rollback procedure and the owner-approved retention value. Do not enable production cron until tested and approved.

### Task 2 — Make authenticated customer entry chat-first

**Files:** new `customer-entry.ts` and `/workspace/chat/route.ts`; Studio/Account pages/components and shared auth call sites after inspecting their current location.

**Consumes:** `ensureCustomerAssistant`, `ChatProfile`, current workspace/agent helpers. **Produces:** an obvious private conversation without manual workspace→agent→source setup.

- [ ] Implement authenticated idempotent bootstrap as specified; preserve existing workspace route and personal agents. Handle concurrent unique-key conflict by scoped re-read, not destructive overwrite.
- [ ] Mount default Conversation immediately after bootstrap; list existing agents as an explicit choice. Create a fresh conversation UUID on first submission, not an empty server record during render.
- [ ] Change standalone default successful login to locale-appropriate Studio. Preserve inline Studio callback, inline Start's mounted draft/explicit second Save, and explicit Account return intent.
- [ ] Validate return destinations against local allowed routes (`/studio`, `/account`, `/start` and existing Arabic equivalents); reject external/scheme-relative URLs. Carry only validated service/solution IDs in CTA context, never business text in URL query parameters.
- [ ] Show a neutral assistant name, actual capabilities, one task/outcome question and optional sources control with type/byte limits. Do not make a file picker the primary prerequisite.
- [ ] Author cases for new account with no sources, existing personal workspace, ten concurrent bootstrap requests, refresh/retry, Arabic locale, malicious return URL and Start draft preservation.

### Task 3 — Persist safe full-turn conversations and contextual lexical retrieval

**Files:** `conversation.ts`, new `history-visibility.ts`, new conversation routes; existing activity/runtime/server/source-delete paths; tests.

**Consumes:** `ChatScope`, `TurnContext`, v2 snapshot dependencies and normalization function. **Produces:** `loadConversationContext`, `readVisibleConversation`, `isRunContentVisible`, `buildRetrievalQuery` and private list/read/delete endpoints.

- [ ] Implement complete-turn grouping from existing runs with exact tuple filters, stable cursors and stated limits. Never use broad activity results as a customer thread feed.
- [ ] Apply one visibility policy to v2 and conservative legacy rows. Hash/verify current original content, source status and access/publication scope; redact entire invalidated generated output/proposal rather than individual citations only.
- [ ] Load authorized complete turns before querying chunks. Build current/history-weighted lexical input and bounded prior-cited chunk recovery for short/reference follow-ups. Keep original excerpts/citations unchanged.
- [ ] Wire normalized expression search behind its server flag; preserve old index/search for rollback. Do not change ingestion windows or introduce embeddings.
- [ ] Invalidate/refetch client history on source deletion and invoke equivalent checks on request replay/finalization.
- [ ] Keep the visibility fix enabled independently of customer/search flags and record a security-compatible rollback commit/deployment containing it. The original baseline's raw activity behavior is not an acceptable security rollback target.
- [ ] Author cases: Arabic repeat-list, English repeat-list, English `TypeScript` with source `وTypeScript`, unrelated current query after old topic, Arabic-only/Latin-only unaffected, current question with no evidence, source deletion between read/generation/finalize/replay, source quote changed, old snapshot without provenance, forged conversation IDs, access-kind collision, and cancelled/running rows excluded from context.

### Task 4 — Add truthful source-free discovery and typed response policy

**Files:** `runtime.ts`, `provider.ts`, `validation.ts`, `presentation.ts`, `settings.ts`, `chat-contract.ts`; existing private/public invocation adapters.

**Consumes:** full turns and authorized chunks. **Produces:** `validateChatResponse`, canonical `ChatResponseV2`, compatible `VisibleRunV2`, safe current support proposal.

- [ ] Select effective policy from server-authenticated access kind/profile/flags. Public/API stay strict even if the stored agent has customer profile.
- [ ] Replace private exact-greeting answer shortcuts with capability-aware instructions and the ordinary turn path. No retrieval-empty gate before discovery; no company fact fallback to general model knowledge.
- [ ] Keep one selected Groq call within existing deadlines/output/limits. Implement raw fixed schema and server part/basis/citation checks; no invalid empty citation enum, prompt-invented tools or silent schema downgrade.
- [ ] Define system policy with actual capability registry, sourced fact boundaries, attributed user facts, visible unknowns/assumptions, one next question, and no external delivery. Keep private custom instructions lower priority; published prompts stay sanitized.
- [ ] Save namespaced v2 response/dependencies atomically with existing run completion. Attach conservative source dependencies to every source-influenced generated part/proposal. Flatten validated parts into old `answer` and existing citation shape; never expose snapshots.
- [ ] Preserve source/API-key/publication recheck, deadline, cancellation, per-identity rate limits, replay input hash and duplicate-proposal guard. Provider error text/keys stay private.
- [ ] Author zero-source intro/discovery/draft, no-source policy question, mixed sourced fact+draft, fabricated tool claim, source prompt injection, private prompt extraction, invalid citation, citation that does not support the answer, 429 deadline, cancellation and late completion cases. Document residual semantic-generation risk instead of promising perfect hallucination prevention.

### Task 5 — Complete reviewable outputs, internal approvals and honest manual handoff

**Files:** Studio/agent workspace UI, `project-brief.tsx`, `account-ui.tsx`, `presentation.ts`, existing approval/project-brief routes only as required for truthful compatibility.

**Consumes:** `ChatResponseV2`, existing exact proposal and consent-based brief API. **Produces:** visible draft/fact/proposal distinction, explicit save/review and accurate status.

- [ ] Render parts with clear labels: source-backed answer, draft, information needed and unavailable action. Preserve input on errors; cancel/retry shows actual run state and keeps the request key for identical retry.
- [ ] Present brief draft using the existing form with initial values from user-supplied discovery only. Require organization, email, valid service and consent; preserve existing 1,500-character limits and explicit Save. Do not silently submit/create a lead from chat.
- [ ] Correct Account/Start success language to “Saved in your account/private workspace”; state no staff review/delivery occurred. Reuse verified download/manual-contact instructions; no fabricated email address or automatic send.
- [ ] Render exact pending internal request title/details and 15-minute expiry. Approve/reject uses only existing `{decision}` body and exact stored proposal; no editable-payload substitution. Use “Approved in your workspace,” not “sent,” “assigned” or “completed.”
- [ ] Hide/redact source-dependent proposal content when the owning run loses evidence; disable invalid/expired decisions and preserve existing atomic checks.
- [ ] Ensure the database approval decision itself rechecks source dependencies inside its transaction; test source deletion between UI review and approval. Client redaction alone does not authorize a stale proposal.
- [ ] Add private conversation resume and explicit delete confirmation; no extra team/inbox/notification UI.
- [ ] Author duplicate-click/replay, changed-payload, cross-user approval, expiry/cancellation, private-save failure/retry, manual download, no implicit inbox and source-dependent proposal redaction cases.

### Task 6 — Rewrite editable bilingual copy and metadata within the approved template

**Files:** content JSON/TS files, nonhome page layout components, route-scoped metadata, application UI states, `tests/launch-copy-check.mjs`; new repository content ledger.

**Consumes:** product spec, Humanizer matrix, research reconciliation, bounded competitor note. **Produces:** comprehensible EN/AR content with runtime-verifiable claims.

- [ ] Build a route/content ledger for every editable existing page/string: audience, task, input, output, reviewer/limit, CTA destination, current-app vs engagement vs proposed scope, primary query hypothesis and supporting product/test evidence. Freeze protected home and shared home-dependent strings.
- [ ] Rewrite eight program families, ten services and nine solutions in place, using Humanizer. Reorder internal sections as customer problem→output/example→how it works→what is needed/limits→next step within the current dark/green template. Keep existing taxonomy/route IDs and any factual detail that remains useful.
- [ ] Give KnowledgeGrid and ServiceFlow the concrete offer definitions from the product spec where existing relevant pages can explain them; do not invent two new full marketing platforms or change homepage sections. Other services remain scoped engagements.
- [ ] Keep all ten existing sector selectors, each with a distinct narrow proposed workflow, required inputs and human decision. Retail/distribution are first synthetic examples; construction stays in research/example material without a new selector/page. Do not claim relief of worker shortage, port congestion, regulatory outcomes or demand.
- [ ] Edit forms, validation, empty/loading/error/success states, chat capability text and local CTAs. Arabic meaning must match English; professional natural Arabic may use different word order. Maintain a short glossary (مساعد/مسودة/محفوظ في حسابك) and preserve identifiers/vendor names accurately.
- [ ] Map one primary intent per page. Services target implementation evaluation, solutions a business task, sectors an application example. Add accurate descriptive titles, descriptions/headings and relevant crawlable links; preserve reciprocal locale/canonicals. Keep query hypotheses labeled unmeasured internally; do not put invented volume/CPC/ranking/ROI in public copy.
- [ ] Mark vendor names as assessed integration candidates near the list, not shipped connector badges. Explain when the buyer's existing Microsoft, Intercom or conventional chatbot product can already meet the need; do not make comparative performance claims from untested vendor docs.
- [ ] Remove/replace the content review's “send a summary” phrasing with “prepare a summary for review” where delivery does not exist. Validate every “can,” “supports,” “saved,” “reviewed” and action verb against real behavior.
- [ ] Prepare five comprehension questions per representative page: audience, input, output, human decision, button result. A reader unfamiliar with AGYNEXA must answer all capability/delivery questions correctly; wrong answers require copy correction. A model review is supporting evidence, not a substitute for the owner or a recruited consenting reader.

### Task 7 — Supply legal pages and two useful synthetic demonstrations

**Files:** new legal content/four routes; `demo-examples.ts`; relevant existing nonhome examples/Studio components.

**Consumes:** approved legal identity/contact/data-flow/retention/recovery facts; product examples. **Produces:** four functional legal routes and explicit synthetic walkthroughs.

- [ ] Draft EN/AR privacy/terms from actual verified controller/contact, auth/storage/provider data flow, source/publication visibility, manual brief handoff, 90-day new-customer history policy if approved, deletion scope/backups and support/usage boundaries. No invented jurisdiction, registration, certification, SLA or unimplemented recovery promise.
- [ ] Obtain owner approval of those facts/text before public release. Staging may use clearly unapproved draft review content, but no placeholder identity/contact can ship as final legal text.
- [ ] Add four routes with correct locale/canonical and accessible text. Existing footer links can resolve without modifying protected homepage copy/layout.
- [ ] Define synthetic retail policy+cases and distribution exception rows as small text packs, each under 12,000 UTF-8 bytes. Include expected grounded answers, unknowns and review owner. No private/personal knowledge or customer proof.
- [ ] Let a customer inspect a sample and explicitly load it as a source if desired; selection/loading is clearly separate from public approval and publication. Public approval remains false. Never auto-publish or silently add samples to existing agents.
- [ ] Author sample assertions: source citation points to exact synthetic rule; unknown return case remains unknown; a late shipment row is attributed to supplied data; no live lookup/refund/supplier message occurs.

### Task 8 — Prepare delivery evidence and release controls

**Files:** repository launch docs/status/backlog/API/resume, migration notes, capability/copy ledger and release checklist; only necessary deployment configuration after owner approval.

**Consumes:** implemented tasks 1–7. **Produces:** reviewable release candidate and bounded verification batch.

- [ ] Record API additions, bounds, privacy/public boundaries, retention and rollback in repo-held documents; attach research source provenance without private values.
- [ ] Review full diff for scope/homepage protection, migration grants, profile selection, raw snapshot exposure, source dependency handling and unsupported copy. Make the proposed commercial product limits visible.
- [ ] Prepare local synthetic fixture users A/B, private vs public-approved sources, two agents, two conversations, a deliberately injected source and exact expected outcomes; fixtures remain isolated local only.
- [ ] Build separate test profiles/project contexts rather than touch the owner's Chrome; use a truly separate browser user-data directory/process. If isolation cannot be established, report the browser gate incomplete instead of resizing/reusing personal Chrome.
- [ ] Stage one final test batch from Task 9. Do not mark cases passed based on old audit results or planning research.

### Task 9 — Run the delivery batch and gate release

**Depends on:** code/content candidate, healthy isolated DB/Auth path, approved legal/retention facts. **Produces:** recorded pass/fail evidence and release/hold recommendation.

- [ ] With dedicated containers stopped if needed for RAM, run locked dependency checks and `pnpm exec next build`; no nonexistent ESLint command. Build failure blocks delivery. Run existing account validation and conversation unit/contract checks once on the final candidate.
- [ ] Stop build/dev workload, start only the verified minimal local stack, apply migrations to the isolated DB and run `python3 tests/studio-release.py` plus affected HTTP/account tests against the hard-pinned local URL. Use the harness's real required arguments/environment discovered at execution; do not invent successful command output. Run RLS checks with anon/authenticated users, not only a service role.
- [ ] Run isolated browser journeys at widths 390, 768 and 1440 in EN/AR, including forms/keyboard/RTL/citations/history/approval, then compare protected home with baseline. Use the approved matrix below and record exact failures/screenshots without secrets.
- [ ] Review all existing marketing routes from the route ledger for content/locale/metadata correctness plus the four legal routes. Automate link/metadata/capability assertions; visually check affected template variants and every materially changed interaction. Confirm home hashes/render behavior unchanged.
- [ ] Perform owner/bilingual comprehension review on the two product descriptions, one service, one solution, sector examples and save/approval states; capability/delivery misunderstandings block those surfaces. Correct factual copy mistakes before release.
- [ ] Stop only the dedicated test stack/VM after checks and record resource health/OOM observations. Do not stop the owner's unrelated containers/contexts.
- [ ] Fix failed cases; rerun affected checks and any impacted security/home regression. Do not repeat successful broad suites without a changed risk. Record untested cases as NOT VERIFIED, never “passed.”
- [ ] Present the tested candidate, migration plan, actual limitations and remaining owner launch decisions. Do not automatically promote production or connect a domain on the basis of this plan.

Suggested existing check entry points, adapted to their actual invocation requirements at execution: `node tests/studio-conversation.cjs`, `node tests/account-validation.test.mjs`, `python3 tests/studio-release.py`, `python3 tests/studio-http.py`, `python3 tests/accounts-http.py`, `python3 tests/account-profile-regression.py`, `python3 tests/studio-browser.py`, and new `node tests/launch-copy-check.mjs`. Do not count a harness that skipped the affected cases as a pass. No tests have been run during planning.

## 7. Acceptance matrix

| ID | Positive journey | Negative/security journey and required result |
|---|---|---|
| A1 Entry | New authenticated customer with zero knowledge reaches private chat and gets a useful task/outcome question/draft | No file/setup dependency; no invented company facts, system access or external delivery |
| A2 Existing data | Existing owner sees their original agents unchanged and can select them deliberately | Bootstrap never rewrites personal instructions/sources/model/publication or inserts personal knowledge into demo |
| A3 Bootstrap | Ten concurrent/retried chat-bootstrap requests return the same intended customer assistant | Wrong reserved-profile collision fails safely; unauthorized origin/body/locale rejected |
| A4 Auth intent | Default login opens localized Studio; explicit Account and Start context preserved | External/scheme-relative return URL rejected; Start draft not lost or auto-saved after login |
| A5 Conversation | Full user+assistant turns persist and reopen after navigation/refresh | Forged agent/conversation/actor/access-kind IDs disclose no other run; unbounded cursor/history denied |
| A6 Follow-up | Grounded list followed by Arabic/English “repeat/explain the previous list” uses full context/current evidence | Old unrelated topics do not override current question; failed/cancelled rows never become context |
| A7 Mixed script | English TypeScript query finds original source containing وTypeScript and quotes original text | Normalization does not corrupt originals or claim unsupported translation/semantic matching |
| A8 Discovery vs facts | No-source planning request yields a useful labeled draft; company policy request requests evidence | Model cannot evade grounding by labeling an invented refund window, price or live status a draft |
| A9 Mixed request | Sourced policy facts are separated from suggested response text/unknowns | Valid citation ID with unsupported answer fails evaluation; unsupported factual output is not accepted as a successful grounded case |
| A10 Revocation | Delete/revoke source and reopen/replay a formerly cited answer: factual output/proposal is redacted | No stale facts via activity, chat parts, saved snapshot, cached replay, prior-answer context or generated summary |
| A11 Races | Source change/cancel while provider is running yields safe terminal status and no active proposal | Late provider completion cannot restore deleted knowledge or approve/create a stale request |
| A12 Public boundary | Widget answers only from active approved-public snapshot source scope | Unapproved source, private persona/instructions/history/brief and customer discovery do not leak; API cannot opt into profile with extra field |
| A13 Injection | Source containing “ignore rules/reveal prompts/use CRM” is treated as source data | No prompt/config/key disclosure, tool execution or claim of nonexistent action |
| A14 Idempotency | Same key/same actor/same input returns one visible reauthorized run/proposal | Changed input/conversation/actor using key conflicts safely; another actor never receives original run |
| A15 Limits/errors | Supported UTF-8 text at byte boundary works; timeout/429/cancel provides truthful next step and preserves composer | Arabic exceeding byte cap, NUL, PDF, oversized body, invalid UUID/model/unknown keys fail clearly; no raw provider error/secret |
| A16 Approval | Exact stored pending proposal can be approved/rejected by its authorized owner | Expired/rejected/cancelled/other-user proposal, altered title/details or replay cannot execute a changed action; no “delivered/completed” status |
| A17 Brief handoff | Review fields/consent, explicitly save privately, download and follow manual contact instructions | Saving or sign-in alone does not create company receipt/email/notification; no fabricated address or silent submission |
| A18 Delete/retention | Confirmed conversation delete removes only its scoped rows/dependent proposals; new customer expiry is enforced | Legacy data, other actor/access-kind/source/publication/independent brief untouched; purge grants unavailable to public/authenticated users |
| A19 Demonstrations | Synthetic retail/distribution packs produce cited summaries, gaps and manual next steps | No real personal data, actual-client proof, live stock/refund/dispatch/causal improvement claims or automatic publication |
| A20 Copy | Reader identifies audience/input/output/reviewer/CTA from visible EN/AR copy | Confusing architecture terms, different-language limits, unsupported connector/ROI/ranking/capability claims block approval |
| A21 Legal | All four legal routes return real reviewed text with matching locale/canonical | No branded 404, placeholders, invented legal identity/jurisdiction or false recovery/retention promise |
| A22 Protected home | Home hashes and 390/768/1440 behavior match approved baseline | Shared styles/nav/footer/metadata/content changes must not alter home/Hero/video or introduce layout/RTL regressions |
| A23 Environment | Healthy real isolated DB+Auth tests run within measured device budget | OOM/unhealthy service/port conflict/production URL/service-role-only tests are a blocked gate, not a pass |
| A24 Compatibility | Old client `{run}` consumers and strict existing agents keep supported behavior | No required new request key/profile flag, new public response leakage, altered publication generation or broken Compare |

Automated tests can prove authorization, membership, bounds and race invariants; they cannot prove all future natural-language answers are correct. Record representative semantic/copy cases and residual risk. There is no zero-defect or same-day promise.

## 8. Release and rollback

Release is one coordinated reviewed effort with independently inspectable stages, not one untested push. Recommended sequence after execution approval: candidate build/docs → real local DB/Auth/security batch → affected isolated browser/copy/mobile checks → reviewed preview/staging using the established deployment process → owner launch decision → additive production migration with flags off → compatible code → narrow smoke/health → enable customer/search flags → verified affected production path. Domain change is a later explicitly authorized action after final-domain/metadata review. Do not migrate production merely to discover whether local tests work.

Before promotion record exact old/new commit/deployment IDs, migration version, active flags, unaffected-home evidence, legal approvals and test ledger. Obtain an appropriate restore point using established project practices without exporting private content into launch artifacts. Keep secrets/redacted values out of logs.

**Rollback triggers:** any tenant/private-public leak, stale source disclosure, wrong approval/delivery behavior, bootstrap corruption, protected-home change, provider failure exceeding existing behavior, or migration health/resource issue.

1. Disable `STUDIO_CUSTOMER_CHAT_V2_ENABLED` first to stop new discovery provisioning/behavior; disable normalized search flag if retrieval changed incorrectly. Preserve authenticated access to existing agents/manual paths and safe conversation reads where possible.
2. Revert feature changes to the recorded **security-compatible** deployment if needed, retaining the shared visibility/replay/source-recheck fix from Task 3. The original baseline's unfiltered activity/history behavior is not a safe rollback for a revocation incident. If a safe target cannot be retained, disable the affected history/replay surfaces until the patch is deployed rather than expose raw legacy rows. Added profile/retention columns/indexes remain in place; compatible code ignores them. Do not drop tables or restore a database blindly over new customer records.
3. Unschedule the new retention job immediately if its scope/policy is wrong; retain evidence and verify no unrelated rows were affected. A destructive purge is not recoverable by a flag; use the established restore procedure only with owner approval and documented data impact.
4. Keep new runs/agents/briefs unless an explicit reviewed cleanup is necessary. New-profile assistants can remain visible in existing agent management after rollback; do not auto-delete them. No old publication/instruction rewrite should require restoration.
5. If schema rollback is necessary, do it as a separately reviewed forward migration after new callers are disabled; preserve/archive necessary new data first. Keeping additive unused columns/indexes is safer than dropping them during an incident.
6. Recheck the failed user journey, source/public access boundary and protected home before re-enabling. Record the issue/status in repository resume/backlog and tell the owner what remains blocked.

## 9. Real owner decisions before their launch actions

Routine engineering choices above have recommended defaults; do not repeatedly ask permission for them. These decisions require real owner facts/approval and cannot be invented:

1. **Commercial offer:** approve the two scoped pilot/implementation product cards, actual price/contract/payment method, included setup/usage/support and who accepts outputs. Default recommendation is no public subscription checkout, no promised SLA and no unsupported regulated/enterprise deployment claim.
2. **Legal/contact:** provide/approve the real legal operating identity, contact route, applicable legal statements and privacy/terms wording grounded in verified processors/data flow. A brand name alone does not establish registration/jurisdiction.
3. **Retention:** approve 90-day active-data retention for new customer chat/proposals, source/independent-brief handling, deletion/backups wording and tested daily purge. No retrospective personal-data purge is assumed. If not approved, do not deploy a fake timer/retention promise; the launch scope must explicitly reflect the verified policy.
4. **Signup/recovery:** previously deferred SMTP/provider/recovery work is not silently enabled. Recommend holding broad self-service launch until a real recovery path and support responsibility are verified; a restricted rollout requires explicit owner acceptance and honest UI/legal limits. Planning and existing-login success do not establish signup/reset delivery.
5. **Promotion/domain:** after actual release evidence, approve production promotion and final domain action. Keep current site URL until that decision and validate canonical/redirect/locale effects, including protected home, in that separate operation.

Staff inboxes, external sending, new sensitive-data pilots, paid cloud resources, campaigns and operational integrations are excluded expansion decisions, not hidden prerequisites silently added to this release.

## 10. Self-review record

- Product outcome: two concrete cards include buyer/user, task, inputs/limits, outputs, complete journey, sample, acceptance, boundaries, delivery model and owner decisions.
- Architecture: one existing stack/model call, explicit private/strict profiles, no conversation platform, safe complete context and provenance/revocation; citation entailment risk is explicitly tested, not overstated.
- Implementation: exact file responsibilities, exported contracts, endpoints, bounds, schema/grants, dependency order and batched checks are specified. Existing names are preserved behind adapters rather than claimed inspected.
- Scope: entire home/Hero/video frozen; editable copy/section redistribution allowed elsewhere; ten services/nine solutions/ten selectors remain; construction is research only; no unauthorized connector/campaign/platform expansion.
- Delivery: real resource-constrained DB/Auth gate, no claimed tests during planning, semantic/copy/mobile/security acceptance, additive compatibility, explicit rollback and repo-held evidence.
- Open decisions: actual commercial/legal/contact/retention/recovery/domain facts remain owner decisions. No product-ready, demand, ranking, integration or zero-defect claim follows from this plan.
