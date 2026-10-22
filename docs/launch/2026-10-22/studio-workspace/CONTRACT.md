# Studio saved work and customer response contract

2026-10-22. IMPLEMENTED; isolated integration verified, production status is in the essential release receipt. Owner explicitly requested Studio behavior/UI and actual saved projects alongside NEXA mail. Preserve strict/published API behavior and protected homepage. No autonomous arbitrary tools, external email action or mailbox/ChatGPT delegation.

## API/DTO contract (frozen for interface)

Types: `lib/studio/project-contract.ts`. Existing cookie Auth + live-session check; derive owner org and actor on server. Every browser mutation uses same-Origin bounded JSON. No client org/actor grants. All reads private/no-store.

- GET `/api/v1/projects?offset=0`: `{projects,hasMore}`; page50, offset integer0..10000.
- GET `/api/v1/projects/:projectId?taskOffset=0&activityOffset=0`: `{project,tasks,activity,hasMore}`; each collection page50; hasMore true if either collection has more. Distinct offsets permit paging each collection.
- POST `/api/v1/studio/actions`: `{requestKey:UUID,kind,payload}` → `{action}` (201 first/replay may200). Persists a proposal only. Five kinds below. Unknown fields/kinds denied.
- GET `/api/v1/studio/actions?offset=0`: `{actions,hasMore}`; private page50 for resumable saved review.
- POST `/api/v1/studio/actions/:actionId/apply`: `{version:1,snapshotHash:64lowerhex}` → `{action,result}`. This button is the explicit human approval+apply event for the exact stored version/hash. Never apply from model output or automatically after proposing. UI renders complete stored payload before enabling this action. Edits require a new proposal/request key; no mutable approved payload.

| Kind | Exact payload |
| --- | --- |
| agent.create | `{name,instructions,language:'en'|'ar',template:'knowledgegrid'|'serviceflow',model:existing allowed model,builder:true}`. Outer requestKey is the existing-agent creation idempotency key. Always creates a distinct customer_v1 agent; does not alter the current assistant. |
| project.create | `{name,description}` |
| project.set_status | `{projectId,status:'active'|'paused'|'completed',expectedRevision:positiveInteger}` |
| task.create | `{projectId,title,description}` |
| task.set_status | `{projectId,taskId,status:'todo'|'in_progress'|'blocked'|'done',expectedRevision:positiveInteger}` |

Name/title100characters, descriptions3000 (empty permitted), agent instructions6000. Apply checks workspace/actor/live session again, locks proposal, checks exact immutable hash/version and expected entity revision, then atomically applies entity+activity+audit/proposal result. Same request key+same payload returns same proposal; different payload conflicts. Reapplying same action returns same result. No duplicate agent/project/task on retry. Model permissions match existing agent settings policy; creating from chat still requires explicit reviewed settings.

Project `{id,name,description,status,revision,created_at,updated_at}`. Task `{id,project_id,title,description,status,revision,created_at,updated_at}`. Activity `{id,project_id,task_id:null|string,kind,summary,created_at}`. Action `{id,kind,payload,version:1,snapshot_hash,status:'proposed'|'applied',result:null|{kind,id,projectId?},created_at,applied_at}`. Sensitive actor/org fields are omitted from these UI DTOs. Status changes optimistic-lock revision; conflicts require a fresh reviewed proposal. Projects/tasks are actual new persisted tables, not project briefs.

## Customer language/identity boundary

Direct whole identity/capability questions receive product-authored localized actual identity/capabilities without provider invention. Mixed business questions remain on evidence-restricted generation. Explicit Arabic/English language commands preserve the current user's selected task/context; do not introduce a sector or reuse assistant-invented facts as user facts. Customer-only wrong-language output gets one restricted repair attempt and then an honest error; strict/API/widget unchanged. Context remains exact org/agent/actor/access/conversation bound. Historical model evidence remains PARTIAL; synthetic/local tests do not prove universal model comprehension.

## Worker phase ledger

- Design/incident phase: exact authorized conversation read privately; no unrelated history or hosted writes. Sanitized evidence: three owner-scoped studio turns, no sources, no retail user context; provider returned English to Arabic questions and introduced retail context in language-follow-up output. This is an output failure, not evidence of a tenant leak. Raw incident IDs/body/instructions remain private, omitted here. Lead confirmed actual deployed incident-era source3cc7f8e1754946233c3d5bae63298ec3c0d32e3a (PR40); local20e0c83 adds documentation only. No private IDs or message bodies are published.
- Contract phase: this file and shared DTO module created for UI/backend alignment. Lead approved five registered reviewed actions and real owner-scoped saved entities.
- Implementation/testing: focused behavior/runtime/action/UI checks, actual local Auth/HTTP/Postgres RLS/concurrency and browser saved-agent flow PASS. Planned meaningful scoped RED/GREEN, local existing DB/Auth/RLS fixtures, no broad model suite or provider activation. Additive migration created by CLI; no historical mail migration edits. Rollback removes UI/API exposure and leaves additive data/audit intact; no destructive down migration.
