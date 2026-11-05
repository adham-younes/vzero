# OpenAI runtime and activation contract

Implementation date: 5 November 2026. Baseline: `45a37cd`, the current `main` when this work began. This record describes implemented source. Production application, migration and inference results belong in the release receipt after deployment.

## Product and review reconciliation

The 19 October market review correctly requires identifiable task outputs, trusted sources, failure handling, exact approvals, customer isolation and claims supported by evidence. Its suggested agency/procurement-only positioning is superseded by the owner's current request for a reusable Agent Builder Studio across sectors. This release retains existing workspace isolation and audited actions, adds concrete research and Python analysis tools, and separates private trials from production activation. It does not claim a ready-made ERP/CRM connector, browser automation, voice runtime or autonomous multi-agent orchestration.

## Model execution

Active Studio and owner-mail inference uses OpenAI Responses with `gpt-6.1-terra`, `reasoning.effort: high`, strict structured output and `store: false`. No active runtime path calls Groq. Existing saved legacy model IDs and historical rows remain readable for rollback; application agent reads and published run scopes normalize execution to Terra. Model selection exposes only Terra.

The official [Terra model contract](https://developers.openai.com/api/docs/models/gpt-6.1-terra) lists high reasoning, structured output, web search and Code Interpreter support. [Responses web search](https://developers.openai.com/api/docs/guides/tools-web-search) and [Code Interpreter](https://developers.openai.com/api/docs/guides/tools-code-interpreter) provide the actual tools. This is an implementation contract, not evidence that this deployment's key has completed a request.

The runtime retains existing idempotent run requests, live-session checks, organization ownership, source-bound history, cancellation, guarded publication and approved internal work actions. Public widgets remain strictly grounded in approved public text. Private trials and activated API agents with `customer_v1` can use enabled research/analysis tools. A customer API invocation still requires a valid agent key, active publication, matching publication generation, commercial activation and a configured customer provider key.

Default resource limits are 20 global runs/minute, 6 runs/identity/minute, 40 runs/workspace/hour, 4 tool calls/request, 8,192 output tokens and a 240-second provider deadline. Environment settings permit bounded changes. Output-token accounting includes reasoning tokens. Estimated costs explicitly cover model tokens only; search and container charges are separate. These controls are not a billing system or a guarantee against every abusive registration pattern.

`usage` preserves only allowlisted metadata: provider, reasoning effort, model tokens, timing, request reference, estimated model cost, billing mode, actual tool calls, public source URLs and provider-annotated artifacts. Hidden reasoning and provider error bodies are not returned. A tool is recorded only when it appears in the provider response.

Web search is opt-in, uses public-source links and does not imply access to customer systems. The policy prohibits private document passages and credentials in search queries, but this is a model instruction, not a deterministic information-flow guarantee. Python executes in an OpenAI-hosted sandbox; it does not run on Vercel or a customer's machine. The current input path supports text and the existing text/Markdown knowledge uploader. PDF/Excel/image ingestion and custom remote connectors are not implemented by this change.

Generated files have authenticated downloads at `/api/v1/runs/{runId}/artifacts/{artifactId}`. The server verifies the owning user or exact authorized API bearer and persisted run identity/version before looking up the provider container. It rechecks access and source visibility before returning the file. Downloads are attachments, bounded to 4 MiB. Provider containers are temporary; an expired file returns `artifact_expired`, rather than a fabricated link. Files created with a replaced customer key may no longer be retrievable.

## Editable agent contract

The existing create, review, save and patch flows accept:

- `model: "gpt-6.1-terra"`.
- `sector`: `general`, `customer-service`, `sales`, `operations`, `finance`, `hr`, `procurement`, `healthcare`, `education`, `real-estate`, or `technology`.
- `tools: {webSearch: boolean, codeInterpreter: boolean}`.
- Existing `instructions`, `language`, `name`, revision, request key and template fields.

Sector is task context, not a compliance certificate or independent specialist product. Existing `knowledgegrid`/`serviceflow` template identifiers remain. Customer-created agents use the flexible customer profile through `builder: true`. Old stored action snapshots are neither rewritten nor silently enriched; their optional missing sector/tools resolve to explicit defaults when applied.

## Customer-owned API credentials

`GET /api/v1/workspace/provider` reports configuration only. `PUT` accepts `{apiKey}` through a same-origin authenticated JSON request, checks access to the Terra model, encrypts the key with AES-256-GCM, binds ciphertext to the workspace ID as authenticated data, and stores it in a service-role-only table. The browser receives no key, suffix, token or ciphertext. `DELETE` removes it and immediately closes live publications for that workspace.

`AGYNEXA_CREDENTIAL_ENCRYPTION_KEY` must contain 32 random bytes encoded as base64. Losing or replacing it without a migration makes stored customer keys unreadable. The environment secret must be retained in the operator's secret-management/backup process. The model-list check proves an authenticated model lookup only; successful inference and adequate quota must still be tested.

Private runs use the customer key when connected, otherwise the platform's `OPENAI_API_KEY`. Production requires the customer's key. The platform never falls back to its key when a configured customer credential cannot be decrypted or is rejected.

## Activation and negotiation

`GET /api/v1/agents/{agentId}/activation` returns `status` (`sandbox`, `requested`, or `active`), `contactEmail`, `mailto`, `requestId`, `providerConfigured` and `canPublish`.

`POST` with `{requestKey}` records an idempotent activation request after at least one successful OpenAI trial for the agent's current saved revision. It does not send email. The mail link opens a draft addressed to `adham@agynexa.si` containing the agent and workspace references. Pricing, terms, scope and payment are negotiated by email; this release contains no fixed price and makes no payment-completed claim.

`POST /api/admin/agents/{agentId}/activation` accepts `{status, agreementReference}` from an authenticated operator allowlisted by `AGYNEXA_ACTIVATION_ADMIN_USER_IDS` (falling back to the existing owner-mail administrator list). Only the operator can record activation after the agreement. Workspace owners cannot approve themselves. Activation requires a connected customer key. The database also guards publication, so direct authenticated RPC use cannot bypass the application route. Withdrawing activation unpublishes and cancels live runs. No customer was activated by this implementation work.

## Sign in with ChatGPT

The implemented flow follows the official [website OIDC guide](https://developers.openai.com/siwc/website): registered client, authorization code, PKCE S256, nonce, server-side short-lived transaction, secure same-site cookie, one-time database consumption and verified issuer/audience/signature/expiration. The JWT library is `jose`. Discovery endpoints are restricted to `https://auth.openai.com`.

Routes:

- `GET /api/auth/providers`: exposes configured availability and `planUsage: false`.
- `GET /api/auth/chatgpt/start?locale=en|ar`: starts identity sign-in.
- Add `link=1` to explicitly link a currently authenticated account; callback requires the same still-active account.
- `GET /api/auth/chatgpt/callback`: registered callback; creates the application's existing secure Supabase session only after verifying OpenAI identity.

Unknown verified OpenAI identities may create a local account. An existing email is never silently linked to an unrelated account. The user must first sign in to that account and explicitly link it. Unverified provider email cannot create a new account. Identity records are keyed by issuer, client ID and subject, not by mutable email. ID/access/refresh tokens are not retained or exposed.

Required production configuration: `OPENAI_CLIENT_ID` (`oaiapp_...`), `OPENAI_CLIENT_AUTH_METHOD` (`none` or `client_secret_basic`), `OPENAI_CLIENT_SECRET` only for a confidential client, and exact registered callback `https://agynexa.si/api/auth/chatgpt/callback` (also accepted through `OPENAI_REDIRECT_URI`). Without an issued client, availability is false and sign-in is clearly unavailable. [Requesting a client](https://developers.openai.com/siwc/request-client-id) is separate from creating an API key or registering for the developer program.

ChatGPT subscription usage is a separate authorization contract. This implementation does not request inference scopes or claim a connected ChatGPT plan. Customers can connect their own OpenAI API key. Commercial subscription-funded inference remains dependent on OpenAI issuing and approving the appropriate access.

## Database and release sequence

Apply `20261105110000_studio_openai_runtime.sql` and `20261105110500_chatgpt_identity.sql` to the existing AGYNEXA Supabase project immediately before the coordinated release. Both are additive except replacement of compatible function bodies and expansion of a model allowlist. They do not erase agent history, customer work, sources, old proposals or owner mail. New secrets/OAuth tables have RLS enabled and no anonymous/authenticated grants. They are accessed only through scoped server code.

The first migration adds agent tool/sector columns, encrypted provider credentials, operator-controlled activation, publication/revocation enforcement and backward-compatible reviewed-action support. The second adds OIDC transactions and identity mappings. Legacy model identifiers remain accepted in storage to support source rollback, but never appear in the active model selector or provider transport.

Final validation is deferred to the coordinating production delivery as requested. Required evidence includes a successful Terra turn, actual search and code tool records, source links and file retrieval if produced, revision-bound activation request, blocked live publication without operator activation/customer key, account/workspace isolation, and private-secret visibility. Identity sign-in cannot be marked verified until an actual issued client completes the callback flow. The original mailbox reply policy, routing, leases and approval behavior are unchanged; only its model transport uses OpenAI.
