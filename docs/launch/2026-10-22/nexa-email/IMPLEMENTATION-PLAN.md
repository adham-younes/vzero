# NEXA email implementation plan

Goal: deliver the explicitly requested safe inbox/outbox/draft/approval foundation, keeping transport and AI autosend inactive until their separate gates are met.
Spec: ../NEXA-EMAIL-SPEC.md. Execution: existing lead + existing content/interface roles only; no new worker. User-supplied implementation direction and MX/no-autosend constraints govern this local execution.

1. Content role: `lib/nexa-email/errors.ts`, `inbound.ts`, `provider.ts`, `tests/nexa-email-inbound.cjs`. Write meaningful failing security/provider tests first; implement currentSDK signature/raw bounds, fetched-content normalization and bounded fixed-endpoint provider transport. Shared DTOs are lead-owned `types.ts`.
2. Lead: additive migration, `config.ts`, `admin.ts`, `store.ts`, `service.ts`, `drafts.ts`, API handlers and DB/HTTP targeted tests. Event lease/finalize and draftapprove/queue/claim transitions are database transactions, service-only. Red tests first, then smallest implementation. No provider/hostedDB mutation before safe reviewed local batch.
3. Interface role: `@components/nexa-mail.tsx`, two private page wrappers and UI-only tests. Consume exact DTO/API contract, existing design, plaintext rendering, no sending activation or global shell changes. Readiness and forbidden future capabilities explicit.
4. Integrated local verification once: isolated real DB/Auth/RLS/API and transport fixture; necessary build/TypeScript; EN1440/AR390 protected privateUI with synthetic mail. Fix/repeat only affected failures. No mail sent, no model calls, no external accounts modified. Stop own app/containers/VM afterward.
5. Reconcile source/route/API/status/acceptance/evidence with exact local/hosted distinction. Make concrete reviewable delivery, record remaining exact activation requirements. No actual Spacemail/Resend receiving/sending activation or arbitrary admin role inference.

Review risks pinned in tests: forgedoroversize signedbody; competing/expired leases and rollback; header reference across sender/inbox; mutable or stale draft approvals and concurrent send; rendering rawHTML or relying on customereditable admin metadata. Preserve home/Hero/video/identity/otherdependency lock resolutions.
