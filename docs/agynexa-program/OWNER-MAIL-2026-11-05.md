# Owner mailbox migration — 5 November 2026

The owner now explicitly authorizes migration of both personal and Nexa mailboxes, preservation of all historical mail, and content-aware automatic replies. This supersedes earlier mail deferral/personal-mail exclusions. No paid subscription, deletion, or unrelated public-site changes are authorized.

Market review implication: deliver the bounded mailbox workflow on the existing Vercel/Supabase/Resend stack. Its RFQ scenarios, proposed pricing and customer targets are hypotheses, not facts to include in replies. Knowledge is limited to owner-confirmed identity and AGYNEXA's public AI/workflow focus. ChatGPT conversation memory is not a runtime integration.

SpaceMail read-only backup is verified locally: 414 messages across six folders, four attachment MIME parts, complete EML files and verified ZIP. Content and credentials are excluded from this public repository.

Implemented and deployed: private durable archive, two allowlisted provider inboxes, signed event ingress, leased jobs, immutable/idempotent native replies, sender and loop checks, bounded AI context, private owner UI, historical import with no reply jobs, scheduled recovery. DNS is still on SpaceMail; user action is required because connected Chrome controls are unavailable in this session. General provider retention and account quotas apply; permanent archive means no application expiry, not unlimited storage or an uptime guarantee.

Verification before deployment: TypeScript/build passed; nine focused policy/service checks plus seven existing Inbox contract checks passed. Isolated PostgreSQL checks proved RLS/access denial, single concurrent claimant, frozen retry payload, expired-lease recovery, 23-hour ambiguous-send cutoff, sender cooldown and no service-role delete grant. Hosted archive/scheduler migrations applied; all three tables deny anon/authenticated SELECT. Storage is private. Pending: live archive/import and DNS. Local HTTP rejects missing import/worker tokens; archive fails closed without local credentials.

Operating limits: automatic replies capped at 40/day, one per sender per five minutes and five per sender per 24 hours, within the account's 100 daily/3000 monthly combined incoming/outgoing quota. Excess and sensitive requests stay for review. No automatic replay of historical imports or messages older than 48 hours. Server-authenticated DMARC pass (or gray with aligned DKIM pass) is required. Archive failure prevents sending. Provider timeouts retry with the same key/body; uncertain sends older than 23 hours require review. Raw inbound EML is preserved; outbound provider export and attachment binaries are retained. No automatic message expiry. Storage/provider/AI quotas and availability still apply.

Authenticated reading uses text only; raw HTML never renders in the application. Private downloads require the existing owner gate. Historical imports require a separate expiring server token and generate no send jobs. Temporary delivery URLs and credentials are not part of public documentation.

Production receipt: PR #62 merged as `45a37cde3423c582eba159359ba2a0d9845cb352`; deployment `dpl_GXG9nzikyb35M6oE7Lf7EmpbUNWu` READY with the official domain. Real incoming events for both mailboxes and a native outgoing test were acknowledged and archived, including the sample attachment. Self-address messages were skipped without auto-reply. Missing owner session returns 401; missing import/worker bearer tokens return 403; invalid webhook signatures return 400. Historical import is running from the owner's Mac with read-back SHA-256 verification. Native Nexa agent actions disabled to avoid competing automation. A separate authenticated static model diagnostic sends no mail.

Security advisor: service-only archive/job/settings tables deliberately have RLS with no customer policies and no anon/authenticated table grants ([Supabase advisor explanation](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)). The pre-existing Auth leaked-password-protection warning is outside this migration; no Auth configuration was changed.


## Final verified state before DNS cutover

- All **414** historical messages imported and read-back hash verified: **11,065,933 bytes**, four attachment MIME parts. Folder counts: INBOX 282, Sent 5, Archive 1, Trash 124, Spam 2, Drafts 0. Imported messages create no automated-reply jobs. Original Mac backup remains intact.
- Two inbound diagnostics and one native outgoing diagnostic preserved. Both mailbox webhooks succeeded. A sample outgoing attachment was downloaded and retained independently; incoming originals include attachments.
- Scheduled recovery invoked the production worker automatically with HTTP 200 and completed the diagnostic job's second attempt without replying to an own address.
- PR #63 merged as `cac030371d5e0c20b938d79a3af8ad1084de40fb`; production `dpl_BA2moCg5SaaDXEbvbans4ze7LFMp` READY and aliased to agynexa.si. The authenticated live model diagnostic produced a contextual Arabic reply (`action=reply`, `sent=false`). This is model verification, not proof of an external automatic reply's delivery.
- Automatic reply settings are **enabled for both inboxes**. Native provider agent actions are disabled to avoid overlapping drafts/folder changes. The dedicated worker performs automation.
- Private archive: https://agynexa.si/admin/mail (also /ar/admin/mail). The owner's existing platform login is required. The authenticated browser UI was not interactively verified in this session; access denial and backing storage/API were verified.
- Public DNS still advertises SpaceMail's two MX records (TTL 300). Required cutover: replace those MX entries with `@ MX 0 receive-euw1.forge.rmta.net`; retain unrelated records. Exact record re-read from Resend. User was asked to perform this change because Chrome controls are unavailable. No DNS change or SpaceMail cancellation has been performed.
- After public routing verifies, run the prepared local read-only delta-sync launcher to capture messages arriving since the snapshot. The mailbox password is entered locally, never stored. Historical import token expires automatically within 24 hours; the worker token stays private in Vercel/Vault. No new subscription was purchased.

Remaining acceptance: MX verification, external sender → each public mailbox → contextual reply and durable outgoing archive, final legacy delta sync. No claim of completed provider cutover or guaranteed unlimited/free/instant delivery.
