# NEXA foundation checkpoint — Studio prioritized by owner

Status: LOCAL_IMPLEMENTED_PARTIALLY_VERIFIED_NOT_PUBLISHED_NOT_ACTIVATED. Owner's latest priority is finishing Studio first; personal mailbox migration remains deferred. Preserve this branch separately.

Implemented: fixed disclosed NEXA identity; bounded signed inbound/received-content adapter; service-only additive mail schema and transactional event/thread/draft/approval/queue/dispatch state machines; live-session + immutableUUID admin gate; bounded read/mutation API routes; private EN/AR Inbox/Archive/Drafts/Outbox UI. No auto-send, arbitrary From, remote email HTML/images, owner mailbox or ChatGPT connection.

Evidence:22original inbound/provider checks plus safe-error and NUL focused regressions;39real local PostgreSQL/RLS/transaction checks;17draft normalization assertions;11UI SSR/security groups. No hosted schema, provider webhook/forwarding/mailbox/DNS or actual mail mutation. Only RESEND_API_KEY name/type/production presence verified; real server account/key readiness remains unestablished. Domain DNS setup proposal is separately handled by owner/coordinator; no DNS polling/writes here.

Incomplete before email release: integrated real local Auth/admin/API/body/partialretry/dispatch fixture batch, actual privateUI browser/build, final schema/advisor/review, authoritative adminUUID activation, verified ingress/forwarding/signing secret/sender readiness and minimal authorized delivery test. Known code review follow-up: thread read/archive + audit should become one transaction; send provider acceptance/message-ID/delivery synchronization and current state limits must be reported accurately. Fail-closed flags remain defaultfalse; production has no email surface from this checkpoint.

The local isolated database contains only synthetic mail test tables/data and is shared temporarily with Studio focused tests; no mail tables will be included in the Studio-only release. Keep full original plans untouched.
