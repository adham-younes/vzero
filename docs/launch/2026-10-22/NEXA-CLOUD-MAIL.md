# NEXA cloud mail — independent infrastructure increment, 22 October 2026

Status: PREPARED_FOR_RELEASE. This record supersedes the earlier local-only email restriction for necessary NEXA infrastructure, following the owner's explicit cloud-email instruction. Production publication, provider activation and live evidence are recorded separately below when completed. The existing human draft approval and manual dispatch guards remain intact. The returned NEXA environment report explicitly states that Vercel events cannot automatically wake this assistant. No autonomous runtime connection or periodic check is active; no speculative agent adapter is built.

## Scope and authority

- Reuse the existing Resend inbox `nexa.agent@agynexa.si`; no new inbox or API key. Exact display name: **NEXA Agent | AGYNEXA AI Assistant**.
- Existing managed receiving address confirmed by the inbox metadata API: `b24184f6@iejioorkau.resend.app`. The owner confirmed the existing server-held RESEND_API_KEY has Full Access; prior deployed domain check established its account binding. The app readiness check additionally verifies the exact existing Inbox metadata through the server-held key. Actual message read and delivery remain untested until a legitimate incoming event exists.
- Necessary mail-only deployment, additive checked database changes, NEXA webhook and server environment configuration are authorized. No paid service, actual outbound test/campaign, personal mailbox access, DNS/MX change, personal alias or global forwarding change.
- The connected Resend MCP is an operator tool. It is not handed to the future agent: its account access is broader than the dedicated NEXA mailbox. The provider credential stays server-only.

## Implementation

The PR41 signed webhook already verifies raw bounded UTF-8 bytes, timestamp/signature, provider UUID, durable event leases and deduplication before atomic storage. For the generic legacy parser, this increment additionally requires exactly one matching technical final recipient in both signed metadata and the fetched message. The deployed handler accepts only `inbox.email.received`: its signed `inbox_id` must equal the exact existing NEXA resource and its thread/message IDs must agree with nested metadata. It fetches the body only from `/inboxes/{fixedInboxId}/threads/{verifiedThreadId}/emails/{verifiedEmailId}`. This Inbox API reports delivered addresses; one canonical NEXA address or its exact managed target is accepted, with exact agreement between signed metadata and fetched message. Mixed/duplicate/foreign recipients fail. The generic receiving endpoint is not used for this Inbox flow. Mixed, duplicate, personal and unrelated recipients fail before storage; unrelated signed metadata fails before any provider-message fetch. A forwarding header never proves original-recipient provenance. Technical ingress accepts delivery to the exact configured address, including direct delivery there.

The new private `/admin/nexa-mail/activity` and Arabic counterpart expose bounded audit, received and provider-accepted sent metadata through GET `/api/admin/nexa-mail/activity`. Existing live-session verification and immutable admin UUID authorization precede database access. The audit view scopes each event through a real NEXA message/thread/draft/outbox object; anonymous and ordinary authenticated database roles cannot read it. Email bodies, raw HTML and attachment contents are absent from this feed.

The visible page polls every 15 seconds, remembers its cursor, deduplicates replay and displays new inbound activity. It preserves the last successful checkpoint on network failure and clears private data on session/access loss. This is an in-page notice while the page is visible, not a background notification or an autonomous agent worker. Older history remains separate from the bounded live window.

The additive migration preserves both historical and current exact sender strings. It does not rewrite approved/frozen payloads. New drafts freeze the new display name; an old queued From fails before claiming or contacting the provider. The outbound record derives display text from the exact frozen payload, so a historical snapshot never gets silently renamed. Existing mailbox UI and its approval/send controls are source-unchanged.

Inbox transport IDs persist in message metadata. A narrow additive completion-RPC migration serializes and groups messages by that fixed Inbox/thread identity; legacy header-based correlation remains only for historical generic messages. Local drafts freeze server-derived Inbox reply context in their reviewed hash; edits preserve context and invalidate approval. Manual dispatch prepares an Inbox draft with explicit reviewed To/Cc/Bcc and thread/reply message IDs, rereads the entire remote snapshot (including hidden HTML/attachments), then sends that draft with a distinct stable idempotency key. A pre-existing reply draft that differs is rejected, never silently overwritten. The provider's documented 24-hour idempotency window is bounded by the existing 23-hour local retry cutoff, and ambiguous outcomes never receive a fresh intent. Provider acceptance IDs persist in the local outbox/message. Local drafts remain the review authority; remote draft preparation occurs only at authorized manual dispatch, not on incoming mail. Provider draft concurrency is not an atomic compare-and-send contract; manual sending remains OFF in this increment pending a controlled operational review.

Incoming text and metadata are untrusted data. This release does not execute models, tools, incoming instructions, credentials or arbitrary URLs. Existing attachment handling remains metadata only. Provider acceptance is not delivery. Accepted outbound SMTP Message-ID synchronization is still absent; universal reply threading is not claimed.

## Provider and persistence checkpoint

Existing inbox metadata confirms the exact address, display name and target; no previous received message was reported at inspection. Its native agent settings contain no instructions, tone or actions. Therefore no existing Resend agent runtime connection is established.

NEXA webhook `31f5ae0d-94a2-46e7-88b4-873a994e69bb` was created initially for the generic `email.received` event at `https://agynexa.si/api/webhooks/resend`, then held disabled during preparation. Its signing secret was transferred directly from connector output into a sensitive production Vercel variable without printing or saving its value. No duplicate webhook existed. The same webhook is corrected to the exact `inbox.email.received` contract before activation; no replacement or secret rotation. Production environment additions: RESEND_WEBHOOK_SECRET (sensitive), exact NEXA_MAIL_INGRESS_RECIPIENT, receive flag true, send flag false. These affect the next deployment, not a previously built deployment.

Migration `20261022033751_nexa_mail_activity_identity.sql` is additive and backward compatible with PR41 sender payloads. Applied successfully to the hosted AGYNEXA project after the isolated checks; hosted role/view/constraint metadata verification follows. Application release state must be verified before enabling the webhook.

## Verification and limits

- Focused changed-module logic/routing: 21/21 PASS including the new Inbox contract; draft contracts 17 assertions and existing mail SSR 11 groups PASS. These use synthetic provider boundaries and make no actual sends.
- Activity browser: 10 groups PASS on real local Next UI with synthetic API responses, EN1440/AR390. Includes replay/no initial false notice, 15-second update, escaped malicious subject, bounded layout, failed refresh, access loss and polling stop.
- Actual isolated PostgreSQL: 15 focused checks PASS with both additive migrations in one rolled-back transaction: roles/security-invoker, exact mailbox scope, both sender identities, frozen payload/hash/display, audit linkage, rejected other sender and hidden cross-mailbox draft. [Sanitized SQL evidence](evidence/nexa-activity-db.json).
- Strict TypeScript and the final affected optimized build PASS, including the established Inbox contract. Source-derived 53-operation documentation check and git diff --check PASS. Final production checks are recorded with the release below.
- Reuse the prior unchanged foundation security, inbound/provider and manual approval evidence. No new model benchmark, real account creation, real outbound mail or broad old-suite repetition.

## Remaining connection facts

1. Upstream dedicated NEXA Spacemail mailbox and exclusive recipient-specific forwarding remain NOT ESTABLISHED. No owner-mailbox alias/global forwarding is acceptable. The managed technical target needs no DNS changes.
2. The actual NEXA environment replied: NEXA reports available manual Resend tools but no automatic event wake path. No Dot API, always-on computer, unrelated agent project, scheduled assistant check or autonomous mail access is configured.
3. No direct service principal is created for a nonexistent automatic wake channel. The cloud app retains live human session validation, immutable admin allowlist and account/session revocation. Any future autonomous connection requires a supported and verified project with scoped grants/revocation. Human review guards remain in place.
4. Real receiving, upstream provenance, reply/send delivery and accepted-message threading are not proved by a READY deployment, configured webhook, domain verification or empty mailbox.

## Rollback

Disable only this NEXA webhook and set NEXA_MAIL_RECEIVE_ENABLED=false in a new deployment if ingress needs containment. Send remains disabled. Preserve messages/audit and the additive compatible schema. Revert the scoped application commit or restore the previous verified deployment if necessary. Do not delete existing rows/inbox/key, change apex MX or alter personal forwarding. Provider webhook disable is immediate; changing Vercel environment alone requires redeployment to change running functions.

The affected original inbound/provider regression suite was reconciled to the new Inbox protocol and passed 24/24. The old generic reply fixture is explicitly rejected without Inbox context. [Repeatable isolated SQL harness](../../../tests/nexa-mail-activity-db.py).

## Contract sources

The current official contracts distinguish Inbox events from generic Receiving: [Inbox received event](https://resend.com/docs/webhooks/inboxes/email-received), [retrieve Inbox message](https://resend.com/docs/api-reference/inboxes/get-thread-email), [create Inbox/reply draft](https://resend.com/docs/api-reference/inboxes/create-draft), [send Inbox draft and idempotency](https://resend.com/docs/api-reference/inboxes/send-draft). No real outbound message was used to test these contracts.

Second additive migration `20261022034859_nexa_inbox_thread_contract.sql` was applied after its isolated thread/replay checks. Hosted source/grants are checked in the release receipt. Both local filenames match hosted migration history.
