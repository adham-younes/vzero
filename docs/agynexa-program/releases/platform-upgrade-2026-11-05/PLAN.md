# AGYNEXA platform upgrade — 5 November 2026

Status: implementation in progress; production verification pending.

## Authorization and baseline

The owner explicitly authorizes one coordinated upgrade of the public platform and Studio through production deployment, compatible database changes, final production tests and documentation. Retain the brand colors and original video. Use OpenAI GPT-6.1 Terra with high reasoning, remove Groq from active runtime, and provide a customer activation path via adham@agynexa.si without listed prices or fixed commercial terms. This direction supersedes historical preview-only and Studio-deferral restrictions for this release.

The owner-provided deployment was main `d56b775794b3549cf3106b9a89c3fd20bdd5217a`. Current GitHub main and the latest READY production deployment had advanced to `45a37cde3423c582eba159359ba2a0d9845cb352` (PR62, private owner mail archive). Work starts from that newer source in an isolated worktree. Preserve its mailbox functionality and data.

## Market review reconciliation

Read the complete 19 October market review against the current source. Its RFQ-only agency strategy and sequential approval plan are superseded by the owner's reusable multi-company Agent Builder direction. Retain its useful requirements: explain the task, necessary inputs, observable result, human decision and next action; distinguish a draft from an external execution; show evidence and actual tools; avoid fictional customers, metrics, connectors or search-ranking guarantees. Keep the ten capabilities and nine solution routes as understandable parts of one platform.

## Initial findings

- The public homepage repeats conceptual prose, with weak distinction between useful immediate work and external-system configuration.
- Studio has real authenticated private agents, conversations, sources, runs, approvals and publication controls. It is a limited two-template Groq runtime; the existing data model and authorization should be extended, not replaced.
- In the existing production interface, Arabic response typography in the English shell is too small, conversation width and empty space are unbalanced, and configuration/tools are buried.
- The production Vercel environment contains OPENAI_API_KEY. Presence is verified; inference is not established until the production test.
- Supabase project xsyxvswbiptbyxyqhdim is ACTIVE_HEALTHY; 13 migrations include owner-mail archive and scheduler additions. Inspect current schema before applying only this release's migration.
- ChatGPT sign-in and ChatGPT-plan inference require an approved registered OAuth client and separate inference permission. Developer-program membership and an API key do not prove that registration. No ChatGPT OAuth configuration appeared in the Vercel environment-name inventory.
- Mobbin search refused access because the current plan does not include MCP. No Mobbin screen was viewed or used. Better Design extracted existing styles; the application's actual dark emerald tokens take precedence over its inferred theme classification.

## Parallel implementation ownership

1. Public content/design: homepage, catalogues, detail/reference pages, metadata and structured content; Humanizer editorial pass; scoped public CSS.
2. Studio frontend: authoring workspace, sector presets, system prompt, actual tool controls, conversation/results/activation UI; scoped Studio styles.
3. Backend: OpenAI Responses Terra high, search and code tools, authenticated persistence and execution limits, compatible migration, activation gate, configured ChatGPT OIDC.
4. Integration: auth presentation, review of shared contracts, source reconciliation, database migration, required release build, single product publication and final production evidence.

## Acceptance

Final production verification covers source/deployment/alias identity, representative EN/AR public and Studio views at desktop/mobile sizes, functional build/save/run/history with synthetic non-sensitive input in the existing owner session, actual OpenAI inference/tool evidence, unauthorized API boundaries, activation/payment-email behavior, and schema/RLS compatibility. No account creation, purchase, invented payment settlement or third-party business action is part of this verification. Any unavailable OAuth client, customer credentials or external business integration is reported explicitly.
