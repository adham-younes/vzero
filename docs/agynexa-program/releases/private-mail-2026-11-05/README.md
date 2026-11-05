# Private owner mail — 5 November 2026

Status: **DEPLOYED_SCOPED_PRODUCTION_VERIFIED_ACTIVATION_PENDING**. PR #72 is merged and production is READY: source `2ea5449e56438c1e6dc77ab248f2000e772ee6ff`, deployment `dpl_553QgPHhZnWtzjJ8ciQGCx5fDpAN`. Cloud build and TypeScript passed. Bounded HTTP/MCP and guarded-send acceptance passed in PR71; the additional one-time email login passed against PR72 production. Authenticated mailbox lists and both enabled automatic-reply settings were observed in the side browser. Private ChatGPT authentication, durable Gmail ingestion and downloads through the new UI remain separate pending checks. [Final login receipt](login-receipt.json).

## Scope and architecture

This is the owner's private operational mailbox, not a new public product. The existing Vercel project and Supabase archive serve `mail.agynexa.si`. Exact-host routing, the configured owner allowlist and a live authenticated owner profile protect access. The source returns 404 for private-mail routes on public hosts and excludes the public site wrapper on the mail host. There is no separate Vercel project, copied secret, new subscription or automatic message deletion.

The release operator verified the `mail.agynexa.si` CNAME to `ac841f8fbdec6782.vercel-dns-017.com`; Vercel reported `misconfigured: false`. DNS and a valid domain binding do not prove that the new HTTP routes are deployed. Production host isolation passed. The signed-out login and authenticated owner mailbox passed visual inspection; downloads through the new UI remain unverified. [Thirteen bounded HTTP/MCP checks](http-receipt.json) passed. The existing allowlisted account must be used; a mailbox address is not evidence that a corresponding login account exists.

## Database and preservation

The release operator applied all three additive migrations successfully:

- `20261105135029_owner_mail_console_view.sql`: service-only message projection and audit records.
- `20261105135308_owner_mail_connector_tokens.sql`: owner-bound hashed credentials, expiry and revocation.
- `20261105140000_owner_mail_knowledge_handoffs.sql`: approved/private knowledge, reply-policy state and shared manual/automatic leases.

The pre-acceptance database snapshot contained **427 archive records: 414 historical plus 13 newer records**. Later test traffic may increase this point-in-time total. RLS and service-only access were verified; no anonymous or ordinary authenticated grants were present on the new private tables. The existing leaked-password-protection advisory remains unchanged. No historical record or attachment was deleted.

The approved ZIP is separately verified as one delivered Resend inbox message containing 414 EML files, with matching downloaded bytes and valid ZIP CRC. It is not a native 414-message import. [Preserved migration receipt and remaining legacy gap](../../OWNER-MAIL-2026-11-05.md).

## Private API inventory

All paths below are under `/api/private-mail` on the dedicated host. Browser mutations require the same origin. Owner data requires an authenticated allowlisted owner; login and session discovery do not expose mailbox contents.

| Method | Suffix | Operation |
|---|---|---|
| POST | `/login` | Sign in to the existing allowed owner account |
| POST | `/login-link` | Send a one-time sign-in link only to an existing confirmed allowlisted owner |
| POST | `/login-link/verify` | Consume the one-time link and establish the owner session |
| GET | `/session` | Report authenticated-owner state |
| POST | `/logout` | End the local session |
| GET | `/messages` | Search and cursor-page archive metadata |
| GET | `/messages/{id}` | Read message and available thread history |
| GET | `/messages/{id}/download` | Download original or selected attachment |
| POST | `/messages/{id}/reply` | Send a policy-checked routine reply |
| POST | `/messages/{id}/hold` | Switch eligible unsent work between manual and automatic handling |
| GET, POST | `/knowledge` | Read owner knowledge or create a record |
| PATCH, DELETE | `/knowledge/{id}` | Update or disable a knowledge record; DELETE does not erase mail |
| GET, PATCH | `/settings` | Read settings or set automatic reply preference for an owned inbox |
| POST | `/connector/tokens` | Mint a credential returned once, with at most five active credentials |
| DELETE | `/connector/tokens/{id}` | Revoke an owner credential |
| POST | `/mcp` | Authenticated stateless MCP JSON-RPC |
| GET | `/mcp` | Returns 405; no SSE stream |

The private console is `/private-mail`; the dedicated host root routes to it. The existing signed Resend ingress and authenticated worker continue on their established routes. No public read API or unauthenticated discovery is introduced.

## MCP and plugin

The endpoint is `https://mail.agynexa.si/api/private-mail/mcp`; DNS, HTTP isolation and authenticated server-side tool discovery are verified. MCP negotiates `2025-03-26`, supports initialize/ping/tools discovery/calls and notification acknowledgement, and returns JSON. Request bodies are limited to 64 KiB, batches to eight entries and authenticated requests to 60 per minute. Nonmatching browser origins are rejected.

| Tool | Scope | Effect |
|---|---|---|
| `list_mail` | `mail:read` | Read a filtered archive page |
| `read_mail` | `mail:read` | Read one message and available history |
| `reply_to_mail` | `mail:reply` | External reply through the shared policy and ledger; text maximum 5,800 characters |
| `list_knowledge` | `knowledge:read` | Read only active, approved public-reply facts |

Bearer credentials are random, SHA-256 hashed in storage, owner-bound, revocable and valid for 30 days. The owner profile, allowlist, expiry and revocation are checked live. The source package is [NEXA Mail](../../../../tools/nexa-mail-plugin/README.md). Its endpoint now matches the verified domain, and its private account package was created at version 0.1.0. Installation, secure authentication and discovery inside ChatGPT remain pending; server-side discovery is already verified. No secrets are included. Plugin availability does not imply connection to ChatGPT memory or background ChatGPT execution.

## Reply and knowledge rules

Owner-private notes are excluded from the reply model and MCP knowledge results. Approved facts carry source and revision metadata; the service rechecks their shareability before sending. Public-reference knowledge does not authorize financial or legal commitments or invented project facts.

Automatic, manual-console and ChatGPT replies share the same canonical message ledger, lease, immutable recipient/payload and provider idempotency key. Sensitivity and uncertainty holds apply to all three. Manual invocation cannot bypass a hold. An uncertain send cannot transfer to another sending workflow, and changing text or request ID does not authorize a duplicate. Imported historical messages cannot be replied to through this service.

Gmail is **REQUIRES_CONNECTION_AND_VERIFIED_INGESTION**. Prior Gmail test messages establish platform round trips, not a durable Gmail backend grant. A separate authorized ingestion route must verify original sender, recipient and authentication before activation.

## Market review and remaining release evidence

The complete market review was reread. Its bounded-workflow, explicit-access, sourced-facts and immutable-action requirements apply here. Public offering expansion, pricing, sales automation and general multi-tenant integration remain outside this private operational increment. Existing public identity, content and prior receipts are preserved.

Deployment, the corrective build and the bounded acceptance below are verified. Pending: attachment downloads through the new UI, ChatGPT installation/authentication, and durable Gmail ingestion. Owner login by one-time email link passed. No application tests or deployment were performed by this documentation update.


## Bounded production acceptance and activation handoff

- The [HTTP/MCP receipt](http-receipt.json) records 13 passing checks: dedicated-host redirect/login headers, public/private host separation, anonymous access rejection, MCP initialization and discovery, complete historical pagination and approved knowledge/read behavior.
- A temporary 30-minute QA credential discovered exactly four tools. Pagination returned 414 distinct historical messages with four attachment metadata entries; all three returned knowledge facts were active and approved for public replies. This proves metadata/read access, not attachment download integrity through the new UI.
- A routine reply sent through MCP reached the owner-controlled Gmail inbox at **14:18:46 UTC**. Gmail reported **SPF, DKIM and DMARC pass** for that controlled message. This is message-specific authentication evidence, not a blanket deliverability guarantee.
- Replaying the identical send request returned `mail_claim_conflict`; no second send was observed.
- A synthetic financial message entered `review` with `sensitive_financial_review`. A manual MCP attempt was also blocked with `mail_owner_review_required`, with no sent identifier. Manual invocation did not override the sensitive hold.
- Both mailbox automatic-reply settings are enabled. The temporary test toggle for the personal mailbox was restored. The temporary QA credential was revoked at 14:22:17 UTC; a subsequent request returned 401. No credential value is recorded here.
- The one-time email link reached the existing owner Gmail inbox and authenticated the side browser. Both mailbox lists, historical archive labels and enabled automatic-reply settings were visible. The password was unchanged. Downloads through this new interface remain unverified.

The private personal-account plugin was created through Plugin Creator as **NEXA Mail 0.1.0**, identifier `plugins_6aec905359688191b39ffabc59232b22`: [open the private plugin](https://chatgpt.com/plugins/plugins_6aec905359688191b39ffabc59232b22). Creation is verified; installation and authenticated use inside ChatGPT are not. Server API acceptance with a QA token is separate evidence and must not be described as an installed ChatGPT connection. The submitted 0.1.0 archive predates this README receipt update; no duplicate upload is required for that documentation-only difference.
