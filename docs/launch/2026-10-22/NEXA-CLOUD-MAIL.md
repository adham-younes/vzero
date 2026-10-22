# NEXA cloud mail — independent infrastructure increment, 22 October 2026

Status: DEPLOYED_VERIFIED_INDEPENDENT_CLOUD_SCOPE. This record supersedes the earlier local-only email restriction for necessary NEXA infrastructure, following the owner's explicit cloud-email instruction. PR43 source `8bea79dfd3d57efb866f9f11485ad73043bcd549`, deployment `dpl_8FawJhwpVkvQd23jwbk4CcYBbQCc` READY and official aliases verified. Same webhook now ENABLED for `inbox.email.received` only. Actual forwarding/receiving/delivery remain NOT VERIFIED. The existing human draft approval and manual dispatch guards remain intact. The returned NEXA environment report explicitly states that Vercel events cannot automatically wake this assistant. No autonomous runtime connection or periodic check is active; no speculative agent adapter is built.

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

NEXA webhook `31f5ae0d-94a2-46e7-88b4-873a994e69bb` was created initially for the generic `email.received` event at `https://agynexa.si/api/webhooks/resend`, then held disabled during preparation. Its signing secret was transferred directly from connector output into a sensitive production Vercel variable without printing or saving its value. No duplicate webhook existed. The same webhook was corrected to the exact `inbox.email.received` contract and is now enabled; no replacement or secret rotation. Production environment additions: RESEND_WEBHOOK_SECRET (sensitive), exact NEXA_MAIL_INGRESS_RECIPIENT, receive flag true, send flag false. These affect the next deployment, not a previously built deployment.

Migration `20261022033751_nexa_mail_activity_identity.sql` is additive and backward compatible with PR41 sender payloads. Applied successfully to the hosted AGYNEXA project after the isolated checks; hosted role/view/constraint metadata verification follows. Application source/READY and existing-owner private UI verification passed before the same webhook was enabled.

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

## Production receipt

[PR43](https://github.com/adham-younes/vzero/pull/43) merged implementation `092e466d518a0e63c3ce3b7f654df24bc3134d0c` as `8bea79dfd3d57efb866f9f11485ad73043bcd549`. READY deployment `dpl_8FawJhwpVkvQd23jwbk4CcYBbQCc` serves the official, www and legacy aliases. [Sanitized source/config/owner-UI evidence](evidence/nexa-cloud-production-release.json), [five production HTTPS checks](evidence/nexa-cloud-production-public.json).

The existing owner's real browser session read audit, received and sent metadata successfully against the actual database, including Arabic navigation and periodic checkpoint advancement. These empty views establish authorized query behavior, not arrival of a real message. The unchanged mailbox's readiness button now verifies both the known sending domain and the exact Inbox ID/address/display/managed target using the existing server-held key; its successful production result was visible. This proves scoped metadata read, not an actual received-body or send call. Local output screenshots contain only these bounded UI results; no credentials/private mail bodies were published.

After these checks, webhook `31f5ae0d-94a2-46e7-88b4-873a994e69bb` was enabled and re-read as the sole account webhook with exactly `inbox.email.received`. The deployed receive flag is true; manual send remains false and auto-send remains false. No real mail was sent or ingested by verification. Incoming signature/recipient/body/thread behavior was tested with synthetic signed events and isolated SQL, not claimed as a production delivery test.

Protected homepage/Hero/video/global CSS/Studio/existing mailbox UI/master-plan source files remain unchanged. Own local app/database/VM stopped and Docker default context preserved. Remaining operational step: establish the existing dedicated NEXA Spacemail recipient route to the exact managed address, then verify an explicitly authorized legitimate incoming message. An automatic event wake path for this assistant is unsupported in the returned environment and is not implemented. Provider draft send remains disabled, including the unresolved external concurrent draft-edit caveat above.

Post-release receipt is a local documentation commit and this merged PR's updated description; it does not trigger another documentation-only production deployment.

Bounded final upstream inspection used the existing signed-in Spacemail Manager and stopped at the mailbox list. A dedicated NEXA recipient route was not established; no personal mailbox content, options or rules were opened. Account-specific capacity evidence stays only in the owner's local output packet, not public Git. This does not establish that an uninspected alias/rule is absent or misconfigured. [Sanitized boundary](evidence/nexa-cloud-upstream-boundary.json).

The manual-send flag is a technical hold, not a request for fresh sending permission: Inbox draft sending accepts a mutable draft ID after a separate snapshot read, without atomic comparison to the exact approved version/hash. External concurrent draft edits are not controlled by local idempotency. Resolve that contract before enabling this app's dispatch; this hold is distinct from unsupported automatic assistant wake. No extra deployment was made for this receipt.
