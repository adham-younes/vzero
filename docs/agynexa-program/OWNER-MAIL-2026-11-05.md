# Owner mailbox migration — verified cutover, 5 November 2026

## Current state

Public DNS now advertises only `@ MX 0 receive-euw1.forge.rmta.net` with TTL 300, independently checked through Google and Cloudflare resolvers. Resend receiving initially retained a failed verification status; a fresh verification request completed and the domain and receiving record now report **verified**, with sending and receiving enabled.

A controlled message to the two actual public mailbox addresses was delivered and received separately by both inboxes. Both originals and their sample attachment were read-back verified in the private archive. A native send from the personal mailbox to the agent mailbox succeeded and was archived. Own-address diagnostics correctly produced no automatic reply, preventing loops. Both automatic-reply settings are enabled. External acceptance succeeded at 13:22 UTC: a Gmail-origin test reached the personal inbox, the worker sent a contextual Arabic automatic reply in approximately 11 seconds, and that reply was independently read in Gmail INBOX (not Spam). Gmail reported passing SPF and DKIM. Incoming test and outgoing reply were archived. This establishes the personal mailbox round trip; a separate external-origin round trip for Nexa was not performed.

## Preserved legacy mail and the remaining gap

All **414 historical messages**, **11,065,933 bytes**, and **four attachment MIME parts** are preserved in the private cloud archive and the original Mac EML backup. Folder counts: INBOX 282, Sent 5, Archive 1, Trash 124, Spam 2, Drafts 0. The source snapshot completed at **11:30 Cairo time** on 5 November; cloud import and read-back verification completed at 11:59 Cairo time.

On the final sync attempt at 15:07 Cairo time, SpaceMail rejected IMAP authentication. The owner then confirmed they had disconnected the service or deleted the old mailbox. We did not perform that deletion. Any messages arriving after the verified snapshot and before that disconnection were **not verified as preserved**. This is a bounded evidence gap, not a claim that additional messages existed or were lost. No repeated password prompt or further deletion is necessary for the now-completed MX cutover. Subscription renewal/cancellation status was not independently verified.

## Privacy and operation

The owner rejected mailbox interfaces on the published AGYNEXA site. PR #64 removed /admin/mail, /ar/admin/mail, and the earlier Nexa mailbox/activity pages in both locales, together with the new archive reading/settings API. All seven removed routes were verified to return 404 on the deployed correction. Actual messages had required owner authentication before removal; the earlier UI nevertheless displayed mailbox addresses and controls before sign-in and was not owner-approved.

Authenticated native Resend inboxes are the mailbox interface. Historical mail remains in the private archive and local EML backup because the available Resend API has no historical message import. Background processing still uses the existing project infrastructure; no complete infrastructure separation is claimed. Storage is private, customer/anonymous table access is revoked, and no application message expiry/deletion job exists.

Reply knowledge is limited to verified owner/company context; ChatGPT memory is not automatically connected. Automatic replies are capped at 40/day, one per sender per five minutes, and five per sender per 24 hours, within provider quotas. Sensitive/uncertain requests remain for review. No new subscription was purchased. Old SpaceMail access is no longer assumed available.

This receipt documents operations and verification only; it adds no public mailbox UI and changes no product code. Original implementation: PR #62; model diagnostic: PR #63; privacy correction: PR #64. Remaining: confirmation of old subscription renewal status; historical mail is preserved in the private archive and local backup, not imported into native Resend.
