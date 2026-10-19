# Proposed workflow and integration contracts
Status: SPECIFIED. No API handler, queue, database or provider account is connected by this release. Proposed limits are policy choices, not measured capacity. The current brief download does not call POST /project-briefs.

## Request and execution boundaries
Public catalog reads contain published metadata only. All writes use a verified session and live organization membership; connector setup requires admin, observability operator/admin, approval assigned reviewer. Never accept an organization header as authority. Bound body sizes: 32 KiB interactive JSON, 256 KiB raw webhook; reject before parsing. Apply per-IP and per-organization budgets and return 429 + Retry-After. Logs redact tokens, authorization codes, contact data and unapproved document text.

A run persists queued → running → waiting_approval → running → succeeded, or failed/cancelled/expired. Each transition uses a version check; terminal states cannot silently reopen. A transaction records the run and outbox job before 202 is returned. Reads disclose only the actor's permitted run. Background workers recheck tenant/role/source authorization. Worker lease expiration recovers a task without blindly repeating an external write.

Idempotency is scoped to organization, actor, method and route plus canonical request hash. Same key/same payload returns the prior receipt; different payload returns 409. Keep request keys at least 24h and external business-action deduplication through its full lifecycle. On a timeout after sending a provider mutation, mark outcome unknown and reconcile by provider receipt before retry. No generic retry on non-idempotent actions.

## Approval contract
Store immutable proposed action, provider, recipient, affected object IDs, amount/terms where relevant, canonical SHA-256, requester, authorized approver, expiry and version. Reject self-approval, expired decisions, revoked membership and hash/version mismatch. Approval and execution claiming use atomic state transitions; a second worker cannot consume the approval again. Payload changes require a fresh approval. Provider receipts, not model assertions, establish completion.

## OAuth and webhooks
Connect POST authenticates admin, checks Origin/CSRF for cookie sessions, allowlists provider and exact redirect URI. Create random single-use state bound to session/user/org/provider, TTL ten minutes, PKCE S256; store verifier only encrypted. Callback requires the same Secure HttpOnly browser session plus state, checks provider error before token exchange, validates issuer/audience where applicable, and forbids arbitrary return URLs. Store encrypted credential references in server vault; never URL/log/browser storage tokens. Refresh tokens rotate atomically; revocation disables jobs.

Webhook adapter verifies the provider's exact documented scheme over raw bytes before parsing. Provider signatures are not interchangeable. Resolve tenant from a verified installed connection, enforce timestamp/replay controls where available, then persist a unique provider event and outbox job before 202. Duplicate delivery returns the original acceptance receipt. Unknown event types quarantine. Unsupported/unconfigured adapters return 503. Provider setup challenges need their own verified adapter; none is implemented here.

## Knowledge and tools
Ingestion records document/source version, ACL and retention. Search filters tenant and allowed sources before retrieval and rechecks at citation delivery; caches include principal/ACL version and invalidate on revocation. User-controlled source IDs can only narrow permission, never grant it. Tool inputs validate against strict schemas and permitted destinations. Block internal-network/metadata SSRF, arbitrary redirects and credential forwarding. Treat retrieved instructions as data, never permission. HTTP/SOAP/MCP each has bounded time, response bytes, auth audience and a narrow tool allowlist.

## Provider readiness
integration-matrix.csv records 20 candidates. Nineteen documentation fetches succeeded; Salesforce documentation retrieval was unavailable. This proves documentation access only. Scopes, account plan, region, costs, rate limits, webhook configuration and object permissions need selected-account verification. A TO_VERIFY endpoint is not ready to invoke. There is no live API, connector certification or benchmark claim in this release.
