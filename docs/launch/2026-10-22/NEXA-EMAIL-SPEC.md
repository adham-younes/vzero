# NEXA Agent inbox/outbox foundation

Date:22 October2026. Owner explicitly requested implementation; accidental trailing fragment clarified by the expanded inbox/outbox vision. This written design records that supplied scope and the chosen implementation, without authorizing transport/account/MX changes or autonomous sending.

## Outcome and scope

Authenticated owner/admin can inspect private threads/messages, mark read/archive, compose replies/new drafts, edit, approve an exact version and queue a manual send intent. Identity is exactly **NEXA Agent AI Business Assistant AGYNEXA <nexa.agent@agynexa.si>**, visibly AI. No AI/model/tool execution, autonomous sending, outreach campaign, ChatGPT connection or access to adham@agynexa.si is enabled. Those future actors require separately scoped delegation. No registration/IMAP/POP/full owner-mailbox migration claim.

Preserve Spacemail apexMX and Spaceship nameservers. Planned transport is exact NEXA mailbox/alias forwarding to a dedicated Resend account-managed ingress; actual mailbox/rule/address/account binding are NOT ESTABLISHED. Resend domain is pending/sending-enabled/receiving-disabled per connector; zero webhooks. Sensitive RESEND_API_KEY metadata exists for production, but its real account/access is unverified. No provider/forwarding/mailbox/DNS mutation or real mail test in this foundation delivery. No claim of receiving/sending readiness without transport evidence.

## Implementation choice

Reuse existing Next.js/Supabase server auth and design. Add Resend6.34.1, pinned lockfile; retain all prior dependency resolutions. Use its current webhook verification API, not the stale installed-skill example. SDK standardwebhooks verifies a ±300-second delivery timestamp; our durable event ledger handles replay. Bounded receiving REST retrieval targets the verified event's emailID at api.resend.com only. Only plain text and bounded metadata are stored; no attachment/raw/remote-image downloads, rawHTML execution or content logs.

POST `/api/webhooks/resend` reads <=64KiB exact UTF8 raw bytes with a deadline, verifies all three signature headers, then checks event shape/recipient. Receiving is disabled unless server flag, secret/key and exact ingress recipient are configured. Verify fetched ID and recipient again; To/Received/header sender fields are untrusted. Dedicated final ingress scopes routing; it does not authenticate original Spacemail recipient or sender. Unsupported signed events are safely ignored; malformed/forged/stale requests rejected; transient provider/DB failure produces retryable non2xx.

Database uses additive public `nexa_mail_*` tables with RLS and explicit service-only grants. No anon/authenticated direct table/RPC access, including ordinary workspace owners. Server APIs first validate Auth user AND existing live-session profilesRLS, then exact immutable UUID in NEXA_MAIL_ADMIN_USER_IDS; missing/invalid list denies access. Never authorize by user_metadata, published founder email, workspace-owner or evaluator status. Every read/mutation repeats authorization; browser mutations enforce sameOrigin/JSON/body bounds and no-store responses.

Event reservation locks unique eventID/payloadhash with a short lease. Completion atomically deduplicates provider-email/inbox, creates/finds a thread, inserts the message and completes the event. Failures stay retryable; success is not acknowledged before finalization. Sameemail/new-event cannot duplicate messages. Thread references are capped sender-controlled grouping hints, resolved only within exact inbox and same external sender; subject alone never groups, ambiguous/cross-recipient references create new threads.

Draft versions freeze fixed From, exact To/Cc/Bcc, subject/text and server-derived reply headers. Editing increments version and invalidates approval. Approval checks expectedversion/hash and records actual admin actor/time. Queue freezes the exact approved payload into one durable idempotent outbox intent, with audit trail. Dispatch accepts only stored intentID, not arbitrary sender/recipient/body. Manual dispatch is OFF by default behind NEXA_MAIL_SEND_ENABLED, never driven by inbound mail. Recheck admin/flag at dispatch; atomically claim intent before API call. Provider acceptance is not delivery. Ambiguous failures become delivery_unknown; no blind fresh-key retry. Same-key retry is constrained by Resend's24h window; expired uncertain results need reconciliation. No scheduler or autosend toggle exists.

## UI and configuration

Private pages `/admin/nexa-mail` and `/ar/admin/nexa-mail` use existing shell/panels/type/colors without global navigation/home/Hero/video changes. Inbox/Archive/Drafts/Outbox tabs, selected thread/plaintext, explicit untrusted-sender notice, compose/preview/version approval/queue, fixed identity and readiness states. Sending disabled when not activated. No rawHTML/attachment previews/remote images, clickable emailbody URLs or automatic action. Owner mailbox delegation and ChatGPT permissions visibly unconnected.

Server key names only: RESEND_API_KEY, RESEND_WEBHOOK_SECRET, NEXA_MAIL_ADMIN_USER_IDS, NEXA_MAIL_INGRESS_RECIPIENT, NEXA_MAIL_RECEIVE_ENABLED, NEXA_MAIL_SEND_ENABLED. No NEXT_PUBLIC secret. Flags defaultfalse; UI/admin draft access does not depend on activating transport. No invented retention/purge/backups policy; no automatic deletion job.

## Market review reconciliation

The mandatory19October market review was reread against current PR40 runtime and this explicit new owner request. Its useful constraints apply: one scoped channel, few necessary entities, source/authority/failure/idempotency evidence, native provider alternative considered, human approval before external sending, no fabricated customer demand or operational capability. The newer owner request selects this foundation; it does not adopt the review's RFQ pivot, change ten services/nine solutions or broaden outreach. Full original plan/review remain unchanged. Current architecture has no existing mailbox; customer workspace-owner rights do not make a global mail administrator.

## Verification and activation gates

Meaningful scoped batch: signed/tampered/missing/stale/future/oversize webhook; recipient/fetchedID mismatch; replay/conflict/concurrency/lease/partialretry/dedup; transactional threading isolation; real local Postgres roles+RLS; actual local Auth admin vs customer/anon/revoked session; draftedit/approval/hash/queue/retry/unknownoutcome; sender substitution/autosend/nooutbound; unsafe HTML literal rendering; one necessary optimized build and affected EN/AR privateUI sample. Local fixtures synthetic; no livecustomers/mail. Do not repeat old broad product/model suites.

External activation remains gated on trusted administratorUUID configuration, exact forwarding/ingress/account-key mapping, verified sending readiness, webhook registration/signing secret, and a separately approved minimal delivery test. Owner mailbox/ChatGPT/autonomous rules are future scopes. Rollback disables receive/send flags, retains private data/audit and reverts app code compatibly; no destructive down migration or mailbox/DNS changes.
