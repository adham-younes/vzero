# Owner mail — migration receipt and private console, 5 November 2026

## Current increment: DEPLOYED_SCOPED_PRODUCTION_VERIFIED_ACTIVATION_PENDING

The owner subsequently authorized a private hosted mailbox and NEXA replies informed by approved project knowledge. The new source provides an owner console, original-message and attachment downloads, knowledge management, manual reply handling and a private ChatGPT MCP connection. This is private owner operation, not a new publicly available product or a claim that Gmail is connected. [Architecture, API inventory and release gates](releases/private-mail-2026-11-05/README.md).

The selected architecture uses the existing Vercel project and Supabase archive, with the dedicated host `mail.agynexa.si`, exact-host checks and a live authenticated owner allowlist. Public `agynexa.si` private-mail routes are designed to return 404. No Vercel secrets are copied into a second project, and no new subscription or mailbox deletion is part of this increment. The three additive migrations, service-only database permissions and DNS/domain binding are verified. Production host isolation and authenticated MCP behavior passed; owner-interface login and attachment download acceptance remain pending.

The pre-acceptance operational snapshot contained **427 archived records: 414 historical messages plus 13 newer records**. This is a point-in-time inventory, not a count of unique incoming conversations or proof of preservation of the legacy synchronization gap below. Messages, original files and attachments remain retained without an automatic deletion job.

The owner's approved ZIP delivery also completed: the 3,706,546-byte archive containing 414 EML files arrived in the Resend inbox for `adham@agynexa.si` at 13:38:16 UTC. The private receipt records `delivered`; verification at 13:38:45 UTC confirmed a matching SHA-256 after downloading the attachment, valid ZIP CRC and the same 414 EML files. It is **one inbox message with an archive attachment**, not 414 separately imported native Resend messages. The original local backup remains preserved. Private provider identifiers and message contents are excluded from this repository.

New reply logic distinguishes owner-private notes from active facts approved for public replies. Only approved facts reach the reply model or the ChatGPT knowledge tool. Sensitivity and uncertainty holds apply to manual console replies and ChatGPT replies as well as the automatic worker. All sending paths share the message ledger, frozen recipient/payload and provider idempotency key; an uncertain send cannot be transferred into a second sending path.

Gmail remains **REQUIRES_CONNECTION_AND_VERIFIED_INGESTION**. Earlier Gmail test messages prove the platform mail round trips, not durable access to the Gmail inbox. The private plugin was created in the owner’s personal account at version 0.1.0. Server-side MCP discovery passed, but installation and authenticated use inside ChatGPT remain pending. No ChatGPT memory connection or background ChatGPT execution is implied.

## New console production acceptance

PR71 production passed 13 bounded HTTP/MCP checks. The authenticated connector listed all 414 historical messages, four attachment metadata entries and three approved knowledge facts. A routine MCP reply reached the owner-controlled Gmail inbox at 14:18:46 UTC with SPF, DKIM and DMARC pass. Repeating the same request was blocked without a second send. A synthetic financial message remained held for review and a manual MCP attempt could not override that hold. Both automatic-reply settings are enabled after restoring the temporary test toggle.

The private NEXA Mail plugin was created at version 0.1.0, but installation/authentication within ChatGPT remain pending. The login screen passed visual inspection; owner-interface login and attachment downloads remain unverified. Gmail background ingestion is still unconnected. Temporary QA-token revocation awaits confirmation. [Detailed evidence and pending activation](releases/private-mail-2026-11-05/README.md).

## Preserved verified migration receipt

The following evidence predates the private-console increment and remains valid only for the scope and observations it records. It does not verify the new console, host isolation, migrations or plugin.

### Verified cutover state

Public DNS now advertises only `@ MX 0 receive-euw1.forge.rmta.net` with TTL 300, independently checked through Google and Cloudflare resolvers. Resend receiving initially retained a failed verification status; a fresh verification request completed and the domain and receiving record now report **verified**, with sending and receiving enabled.

A controlled message to the two actual public mailbox addresses was delivered and received separately by both inboxes. Both originals and their sample attachment were read-back verified in the private archive. A native send from the personal mailbox to the agent mailbox succeeded and was archived. Own-address diagnostics correctly produced no automatic reply, preventing loops. Both automatic-reply settings are enabled. An external-sender test from the owner-controlled Gmail account to `adham@agynexa.si` was sent at 15:22:17 Cairo time (13:22:17 UTC). Its automatic reply reached Gmail at 15:22:26 and Resend independently reported delivered. The inbound original (5,849 bytes, one attachment) and reply (763 bytes) were archived. The second owner-controlled Gmail test reached `nexa.agent@agynexa.si`: its job was created at 15:27:54 Cairo time, the automatic reply was sent at 15:28:04 and reached Gmail at 15:28:05. The inbound original (5,831 bytes, one attachment) was archived at 15:27:57; the outgoing reply (899 bytes) was archived at 15:28:08. Exactly one automatic reply was observed for each controlled test. Both mailbox external round trips are therefore verified. Native Resend agent actions remain disabled so they do not duplicate the application replies.

## Preserved legacy mail and the remaining gap

The verified snapshot covers `adham@agynexa.si` only; no historical backup for `nexa.agent@agynexa.si` has been established. All **414 historical messages**, **11,065,933 bytes**, and **four attachment MIME parts** in that snapshot are preserved in the private cloud archive and the original Mac EML backup. Folder counts: INBOX 282, Sent 5, Archive 1, Trash 124, Spam 2, Drafts 0. The source snapshot completed at **11:30 Cairo time** on 5 November; cloud import and read-back verification completed at 11:59 Cairo time.

On the final sync attempt at 15:07 Cairo time, SpaceMail rejected IMAP authentication. The owner then confirmed they had disconnected the service or deleted the old mailbox. We did not perform that deletion. Any messages arriving after the verified snapshot and before that disconnection were **not verified as preserved**. This is a bounded evidence gap, not a claim that additional messages existed or were lost. No repeated password prompt or further deletion is necessary for the now-completed MX cutover. After both external tests passed, automatic renewal was disabled for the SpaceMail Pro trial only. The logged-in Spaceship UI then showed renewal Off, zero connections and expiry 15 November 2026. Domain automatic renewal remains On, with domain expiry 16 October 2027. No email or service deletion was performed by this migration work.

## DNS authentication

At approximately 15:25 Cairo time (13:25 UTC), a TXT record was added at `_dmarc`, TTL 300: `v=DMARC1; p=none; adkim=r; aspf=r;`. The authoritative nameserver, Cloudflare and Google resolvers all returned that value. This is a monitoring policy, not a claim that all authentication failures are rejected. Existing MX, website records and domain renewal were preserved. The second Gmail delivery reported SPF and DKIM pass. Its headers did not yet report a DMARC result; the verified DNS record is not evidence of a DMARC header pass or removal of a Gmail warning banner.

## Privacy and operation

The owner rejected mailbox interfaces on the published AGYNEXA site. PR #64 removed /admin/mail, /ar/admin/mail, and the earlier Nexa mailbox/activity pages in both locales, together with the new archive reading/settings API. All seven removed routes were verified to return 404 on the deployed correction. Actual messages had required owner authentication before removal; the earlier UI nevertheless displayed mailbox addresses and controls before sign-in and was not owner-approved.

Authenticated native Resend inboxes are the mailbox interface. Historical mail remains in the private archive and local EML backup because the available Resend API has no historical message import. Background processing still uses the existing project infrastructure; no complete infrastructure separation is claimed. Storage is private, customer/anonymous table access is revoked, and no application message expiry/deletion job exists.

Reply knowledge is limited to verified owner/company context; ChatGPT memory is not automatically connected. Automatic replies are capped at 40/day, one per sender per five minutes, and five per sender per 24 hours, within provider quotas. Sensitive/uncertain requests remain for review. No new subscription was purchased. Old SpaceMail access is no longer assumed available.

This receipt documents operations and verification only; it adds no public mailbox UI and changes no product code. Original implementation: PR #62; model diagnostic: PR #63; privacy correction: PR #64. Final current checks: external receipt, automatic reply delivery and private archival passed for both mailboxes; SpaceMail renewal is off and domain renewal remains on. The legacy preservation limits above remain explicit. The latest production application was already READY and was not redeployed for these DNS, subscription and documentation changes.
