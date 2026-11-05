# AGYNEXA platform and OpenAI Studio upgrade — 5 November 2026

Status: deployed and verified within the documented scope. PR65 and its focused acceptance follow-up PR66 are merged. Final production source is `794c2b8299b95762e6eb173c3c1ff720d5731d7d`, READY deployment `dpl_AhhLWthKRjRskicjfNrqfy1RPFp8` on `https://agynexa.si`. Real OpenAI web/Python and Arabic knowledge acceptance passed; both database migrations are applied and permissions verified. See [production acceptance](PRODUCTION.md). This receipt supersedes older deferral and preview-only notes for this explicitly authorized work package. It does not imply that earlier test results validate the new runtime.

## Product behavior

AGYNEXA is a reusable bilingual Agent Builder Studio. A customer chooses a business workflow, defines an agent's instructions, adds approved text knowledge, enables public web research or sandboxed Python when useful, and tests the result inside an isolated owner workspace. Sector presets are starting configurations, not independently validated industry products.

The customer reviews answers, source evidence and tool outcomes before requesting production access. The application saves an activation request only after a successful OpenAI trial of the saved agent revision. A mail link prepares a message to `adham@agynexa.si`; the customer sends that message through their own mail application. The application does not claim that clicking the link sent an email or accepted an agreement. Pricing, operating scope and terms are discussed privately. No fixed price, payment processor, checkout charge or automatic commercial acceptance is introduced.

Actual external API/widget execution requires owner-admin activation plus an encrypted customer-owned OpenAI API connection. Publication creates a frozen version. Revoking activation or disconnecting the customer API credential closes external access. Public widgets remain limited to explicitly approved public knowledge and do not receive research/code tools. Private trials use the platform key until the customer connects their own API project.

## Implementation and boundaries

- Public content retains ten capabilities and nine solution workflows, with direct Studio entry, clearer inputs/outputs and explicit connection requirements. English and Arabic share the same information structure and dark emerald brand. Original hero components and video asset are preserved.
- Studio adds eleven sector presets, editable instructions, real web/Python switches, readable messages and code/tables, source disclosures, downloadable provider artifacts, saved conversations and a production activation area.
- Inference uses OpenAI Responses with `gpt-6.1-terra` and `reasoning.effort=high`. The registry exposes one production model. Historical model IDs remain readable for data compatibility; runtime normalization does not call Groq. Response/token/tool caps and distributed limits bound trials.
- OpenAI API keys are sent directly to the application server, validated against the selected model and encrypted with AES-256-GCM, using workspace identity as authenticated data. Private credential and OAuth tables have RLS and no anonymous/authenticated grants. The encryption secret is held only in the production environment.
- ChatGPT identity login is implemented with official OIDC discovery, PKCE, nonce/state validation, single-use server transactions and explicit account linking. It is disabled until an issued client ID and approved redirect are configured. No client ID was present in the inspected production environment. ChatGPT plan-funded inference is **not enabled or verified**; API billing and ChatGPT plan access remain distinct.
- Shared session replay is removed: a tracker loaded on a public SPA route could otherwise remain active after navigation into a private credential form. Aggregate Vercel telemetry drops private routes and query strings on every event.
- Existing owner-mail processing policies are preserved; its provider adapter follows OpenAI. The concurrent main updates removing mailbox UI and its archive API remain authoritative. No DNS, MX, forwarding or mailbox migration is part of this release.

These capabilities do not establish general CRM/ERP connectors, autonomous external business actions, team invitations/shared roles, regulatory certification, complete operational monitoring, payment settlement, guaranteed search ranking or unlimited agent execution. Workspaces remain single-owner. Knowledge ingestion is approved text, not arbitrary PDF/URL ingestion. Provider-generated files are temporary and may expire.

## Design and writing review

The initial production review found overlong homepage copy, weak build/test/activate continuity, small Arabic chat text and large unused Studio space. The new design uses consistent reading widths, a dedicated builder, task-oriented navigation and restrained disclosures. Humanizer guidelines were applied to avoid inflated claims and vague service promises. Better Design supplied spacing/form guidance and text-comprehension checks. Mobbin was explicitly attempted but its connector required a paid plan; no Mobbin reference was viewed or copied. Connector guidance is not a substitute for production visual acceptance.

## Source and release method

Initial supplied deployment: `d56b775`. Verified main at worktree creation: `45a37cde3423c582eba159359ba2a0d9845cb352`. A later fetch found `a5a503a5bc11f0a2d2926c877885e62a33bf072b` (PR63/64); those concurrent changes are retained in the release. The worktree is separate from the user's earlier checkout.

Required release build/type checks run before publication. Functional and visual acceptance runs against `https://agynexa.si` after the product release and its focused acceptance follow-up, using synthetic tasks. No preview is presented as production proof. Additive database migrations are applied individually after source review, with existing records retained. A code rollback must keep the compatible additive schema and preserve credential/activation records; encryption secret rotation requires deliberate re-encryption. No destructive database rollback is proposed.

The final deployment SHA, database receipts, actual production checks and unresolved external prerequisites are recorded in [PRODUCTION.md](PRODUCTION.md) and `evidence/`. Final documentation is committed separately from production application changes. Never copy user chats, API keys, raw environment values or mailbox data into this public repository.

## Sources for conditional provider features

- [Terra model documentation](https://developers.openai.com/api/docs/models/gpt-6.1-terra)
- [Sign in with ChatGPT](https://developers.openai.com/siwc/quickstart)
- [Requesting a ChatGPT client ID](https://developers.openai.com/siwc/request-client-id)

Official availability does not prove that this application has received commercial enrollment or that a specific production key can run a model. Those are separate checks.

## Resumed full-site visual scope

The owner reaffirmed all public pages, both languages and presentation on 5 November. Every public subject was source-reviewed, with input/role/output visuals on capabilities, workflows and industries. The homepage adds an accessible isometric four-layer explainer; architecture uses the actual current runtime flow. These are authored SVG/CSS, not generated Tripo assets. Tripo CLI0.7.2 device authorization completed. The API balance is0 while the separate Studio balance is200. The current Free plan limits exports and its public pricing labels output non-commercial; no generation or purchase was submitted and0 credits were spent. The original SVG/CSS visuals remain the published implementation; see PRODUCTION.md.
