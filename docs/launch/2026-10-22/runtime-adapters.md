# Confirmed runtime adapters for the planner

Source baseline: fresh `work/vzero`, clean `main` at `f4f573a158a66f200e6055cf530afa3faa2eac9f`. Facts below were read from that source; proposed changes must be labeled separately.

## Tables and migrations

- Migration directory `supabase/migrations/`. Current foundation `20261020102401_studio_foundation.sql`; runtime `20261020113246_studio_runtime.sql`; approval follow-up `20261020120653_studio_finalize_approval.sql`; accounts `20261020074037_accounts_and_project_briefs.sql`.
- `public.knowledge_sources`: id, org_id, agent_id, request_key, title 1..160, content 1..12000 UTF-8 bytes, public_approved false by default, status ready/deleted, timestamps. Unique agent_id/request_key. Selected file only fills a textarea until submitted.
- `public.knowledge_chunks`: id, org_id, agent_id, source_id, ordinal, content <=1400 characters, search_terms generated from `to_tsvector('simple',content)`, GIN `knowledge_chunks_terms`. Ingestion windows are 1200 characters, step 1000. Retrieval returns up to six active scoped chunks.
- `public.agents`: id, org_id, created_by, request_key, name<=100, template knowledgegrid/serviceflow, instructions<=6000, language en/ar, model, revision, timestamps. Unique org_id/request_key. Current type/API select does not expose a chat-profile field.
- `public.agent_runs`: id, org_id, agent_id, conversation_id, actor_id, access_kind studio/api/widget, request_key, input_hash, snapshot JSON, model, version_id, status running/succeeded/failed/cancelled, question, answer, citations, usage, error_code, created_at/finished_at/expires_at. Request replay is unique on agent/access_kind/request_key. Database run expiry defaults 55 seconds. No separate conversations table exists.
- `public.support_requests`: id, org_id, agent_id, run_id unique, requested_by, title<=160, details<=3000, status pending/approved/rejected/expired, expires_at default15 minutes, decided_at, created_at. Approval is an internal state, not external delivery.

## HTTP and provider envelopes

- `POST /api/v1/workspace` accepts `{}` through same-origin mutation parsing, calls `initialize_workspace()` and returns `{workspace}`. Bootstrap RPC is atomic/idempotent per authenticated owner.
- `GET /api/v1/agents` returns `{workspace,agents}`; POST creates an agent after workspace exists. Unknown fields rejected. `requestKey` is required on creation. Settings PATCH uses positive revision.
- `POST /api/v1/agents/[agentId]/test-runs` accepts `message`, required `requestKey`, optional `conversationId`, optional private-only `runId` and `model`. Message trimmed 1..3000 characters; IDs are validated UUIDs. Missing conversation defaults to requestKey. `model` is allowlisted. Return `{run}`; handler maxDuration60.
- Published API/widget accept only `message`, `requestKey`, `conversationId`; return the same `{run}` envelope. Widget additionally uses same-origin mutation validation and bearer session scope.
- Visible run fields: id,agent_id,conversation_id,model,status,question,answer,citations,usage,error_code,created_at,finished_at,version_id. A citation has chunkId,sourceId,title,quote.
- Current provider result: `{answerable:boolean, answer:string, citations:[{chunkId}], support:{propose:boolean,title:string,details:string}}`. Answer nonempty <=12000 characters; <=6 citations. Server attaches source quotes. For no allowed citations a new discovery schema must not use an invalid empty enum.
- Provider request is Groq Chat Completions, selected production model, nonstreaming, output4096, overall timeout45 seconds default (configured range5..50seconds). It retries429 at most once with bounded wait<=5seconds. No extra provider/router service is deployed.
- Default concurrency6 (range1..20), global100/min, peridentity60/min capped100. Widget additional30/IP/min and60/agent/min. Existing cancel/idempotency/access-recheck behavior must survive.
- Current history is prior five QUESTIONS loaded after retrieval; this is not complete conversation context. The proposed plan should load relevant complete turns before retrieval and bound them explicitly.
- Failures are `{error:publicCode}` and suitable HTTP status, private/no-store. Unknown exceptions become503 temporarily_unavailable. Do not leak provider errors or credentials.
- Mutation JSON body is bounded to20000 bytes and same Origin as URL. Public API uses bearer and normal JSON parsing rather than cookie-origin mutation parsing.

## Source, history and approval paths

- Source POST body: title,content,publicApproved:boolean,requestKey; encoded content<=12000 bytes, no NUL. Returns `{source}`,201.
- Source deletion cancels active runs; finish RPC rechecks cited source readiness, published generation and API-key validity. Any new history/replay/context path must enforce equivalent visibility checks before showing or reusing old factual answers.
- `GET /agents/[id]/activity` currently returns latest50runs,50approvals,20versions,publication and key metadata. It has no current per-citation revocation redaction. Do not build a new chat-history view by exposing this result wholesale across access kinds.
- Approval POST allows only `{decision:'approved'|'rejected'}`; unknown fields rejected. It locates the request under authenticated RLS and invokes exact proposal decision. No caller-supplied title/details substitution. Returns `{approval}`.
- Private save/review of a project brief is owner storage only. Start inline AuthForm preserves the mounted draft and asks user to Save after sign-in. Standalone AuthForm currently redirects to Account. Preserve explicit Start/Account context while providing a better default Studio entry.
- Local Supabase config is hard-pinned to `http://127.0.0.1:54321` and rejected on Vercel; hosted config is pinned to the established project. Keep this separation.

## File map

UI: `@components/{studio,studio-agent,studio-widget,account-ui,project-brief,program-layouts,service-catalog,service-directory,agent-workspace}.tsx`.

Runtime: `lib/studio/{server,settings,models,provider,conversation,runtime,publishing,validation,presentation}.ts`; shared validation `lib/account-validation.ts`; session/config `lib/supabase/server.ts`.

Content: `lib/program-pages.json`, `lib/service-catalog.json`, `lib/agynexa.ts`, `lib/solution-service-map.json`, `lib/site-routes.ts`.

APIs under `app/api/v1/`: workspace/route.ts; agents/route.ts; agents/[agentId]/route.ts; agents/[agentId]/{test-runs,activity,sources,publish,unpublish,invoke}/route.ts; agents/[agentId]/sources/[sourceId]/route.ts; approvals/[approvalId]/decision/route.ts; project-briefs/route.ts; widget/[publicId]/{session,invoke}/route.ts.

Existing tests: `tests/studio-conversation.cjs`, `studio-release.py`, `studio-http.py`, `studio-browser.py`, `accounts-http.py`, `account-profile-regression.py`, `account-validation.test.mjs`. No ESLint script. pnpm12.3.4, Next16.4.0, React19.2.4. Dependencies are not installed in the fresh clone; read its installed Next docs after dependency installation before coding.

## Local environment and owner authorization

8GiB RAM,8CPU,31GiB disk free when checked. node/pnpm/git and SupabaseCLI2.117.0 exist. Docker is not on PATH and common app/bin/mount/Spotlight locations did not locate it; owner says installed, so global absence is unproven. First locate/reuse the existing engine. Owner allows downloading a Docker-compatible runtime if needed and is concerned about load. No installation or service start has been performed.

Recommended minimum local check stack: Postgres+Auth(gotrue)+PostgREST+gateway(kong), using a free lightweight engine if needed, with a measured resource cap and all services healthy. Installed `supabase start --help` confirms exclusions: realtime,storage-api,imgproxy,mailpit,postgres-meta,studio,edge-runtime,logflare,vector,supavisor can be excluded. Compatibility with the fixture must be tested, not presumed. No ignore-health-check. A proposed2CPU/2GiB start is not proof the stack fits. Do not run dev/build/fullstack simultaneously, do not disrupt other engine contexts, and stop the dedicated stack after checks. If genuine DB/Auth isolation cannot be verified, block that release rather than use a mock and call it equivalent.
