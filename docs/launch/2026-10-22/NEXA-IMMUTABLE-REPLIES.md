# Native Inbox replies from the exact approved snapshot — 22 October 2026

Status: VERIFIED_LOCAL_CANDIDATE; production remains PR43 until this corrective increment is published. This necessary fix replaces the mutable provider-draft send contract; it does not add another agent runtime, service principal, schedule or notification system.

The owner already authorized NEXA mail read/send/reply within the dedicated mailbox and explicit approvals. Missing permission is not a gate. PR43's send flag remained off because checking a mutable remote draft then sending its ID could send different content after an external edit. The current documented native Inbox reply endpoint accepts the reply text, subject, Cc and Bcc in the send request itself, with a stable idempotency key. It selects To from the original message's immutable Reply-To, or its sender when absent. [Official contract](https://resend.com/docs/api-reference/inboxes/reply-thread-email).

## Corrective boundary

The normalized incoming message now retains bounded, validated Reply-To addresses as untrusted data. Creating an Inbox reply draft derives its actual To from that stored message and returns the saved recipients to the existing editor/preview. The owner must preview and approve that exact version/hash, then queue and separately manually dispatch. An incoming message alone cannot approve, queue or send anything. Editing a saved reply cannot substitute different To recipients; context or content changes invalidate approval through the existing database contract.

The approved hash includes the fixed provider Inbox ID, verified thread/email IDs and original SMTP Message-ID. Dispatch validates that context before claiming the intent. It reads the immutable original message through the fixed Inbox/thread/email API path, verifies ID/direction/Message-ID and compares actual effective Reply-To recipients with the approved To. Any mismatch fails before a send request. The final POST to that original message's `/reply` endpoint contains only the approved text, subject, Cc and Bcc. It does not read, create, alter, delete or send a provider draft; external draft edits therefore cannot change the transmitted snapshot. No arbitrary attachment, HTML, headers, URL fetch or recipient override is sent.

The existing local outbox lease, actor audit, acceptance-ID persistence and stable `nexa-mail/{intentId}` idempotency key remain. The existing 23-hour retry cutoff stays within the provider's 24-hour key window. An ambiguous POST is delivery_unknown and never causes a fresh intent or automatic duplicate send. Provider acceptance is not delivery; actual SMTP Message-ID synchronization of sent mail is still not implemented.

## Operational scope

Manual dispatch may be enabled for correctly bound, human-approved Inbox replies after the affected build and production verification. A standalone new message has no original Inbox message to reply to. Current official Inbox APIs expose mutable draft send for that case; no documented immutable standalone send or conditional/version-locked draft send was established. Standalone messages can still be saved and reviewed locally, but their dispatch fails before provider access. There is no generic `/emails` workaround or invented conditional header. The activity page states this reply-only scope. Existing mailbox UI source, public site and Studio remain unchanged.

The dedicated upstream Spacemail NEXA recipient route remains NOT ESTABLISHED after the bounded manager-list inspection. No personal mailbox contents/options/rules, DNS/MX, paid seats or real mail tests are changed. The returned NEXA assistant still cannot be woken automatically by Vercel; no autonomous or periodic check was added. These are separate from authorized manual reply dispatch.

## Focused verification

Real module/synthetic HTTP tests cover an external provider draft being edited after local approval without changing the final transmitted text; exact fixed Inbox/thread/parent API path and effective Reply-To recipients; wrong Inbox/parent/recipient/direction failures before POST; standalone denial; server-derived saved recipients and hashed reply context; recipient edit rejection; stable idempotency; bounded safe read/send errors and ambiguous POST outcomes. The 39 affected groups passed. Existing SQL/role/replay/lease/approval and browser evidence is reused because this fix changes no database schema or existing mailbox UI. Final optimized build/strict TypeScript, source-derived53-operation documentation and git diff --check PASS. Production source/flag checks are recorded on release. No actual email is sent during verification.

## Rollback

If manual dispatch needs containment, set the send flag false and redeploy the last verified source, or restore PR43's deployment (whose send flag is false). Preserve all messages, drafts, outbox intents and audit. Do not give delivery_unknown a fresh key. The existing correct receiving webhook stays separate; no new webhook, key, Inbox, DNS or personal forwarding change is required.

The already authorized manual-send flag is prepared true for the next production deployment, bundled with this necessary correctness fix. PR43 running functions retain their built false value until the new release. No other environment, credential, provider setting or webhook was changed.
