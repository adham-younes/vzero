# AGYNEXA launch planning brief

Status: planning only, 22 October 2026. No product implementation, migration, account change, publication, deployment or domain action is authorized by this document. The owner will review the plan and explicitly say “نفّذ” before implementation.

## Intended outcome

A customer signs in, reaches a usable private conversation, explains a business task without preparing a file, receives useful clarification and a reviewable draft, and can add approved business knowledge when the task requires it. The first release builds on KnowledgeGrid and ServiceFlow. Marketing must explain the task, concrete output and next step in natural Arabic and English. A service engagement, a live app capability and a proposed integration must be distinguishable.

The owner wants one coordinated implementation effort after a thoroughly reviewed plan. “One effort” means a coherent scope, staged dependencies and final release checks; it does not remove verification, rollback, uncertainty, or the need to correct a failed check. Launch timing and demand are not guaranteed.

## Fixed boundaries and latest permissions

- Preserve the entire homepage/opening screen, both Hero components, original video and their behavior. No text/layout or indirect shared-style change to these surfaces.
- Preserve approved black/green colors, fonts, identity and existing template. The owner permits redistribution of text and page sections on other pages inside this template.
- Preserve the ten-service and nine-solution taxonomy, public routes and Arabic/English parity. Construction is a research extension, not approval to create another sector page.
- Current authorization covers research and planning artifacts only. Production operations, database migrations, source changes and publication wait for execution scope approval. Domain connection remains a later explicit launch decision.
- No campaigns, email sending, private lead enrichment, purchases or new paid subscriptions. Research connectors are planning resources, not automatically shipped agent tools.
- Use Humanizer across editable copy without changing factual limits; use Karpathy principles to keep scope small and changes traceable; apply Product Design to the existing experience rather than inventing another theme.
- Batch necessary product checks at delivery; do not run application tests during planning or repeat successful broad suites without a changed risk.
- Do not disrupt the owner's Chrome work. Any later responsive/browser verification needs a truly isolated surface; a tab name is not a separate profile.

## Baseline and evidence

Fresh clone: `work/vzero`, `main`, commit `f4f573a158a66f200e6055cf530afa3faa2eac9f`, matched GitHub/Vercel production during the audit. Working tree was clean when checked during planning. Re-check before execution; never reuse the abandoned older checkout or copy an unverified migration from it.

Audit: [visible report](../independent-visible-audit/independent-visible-audit.md), [route ledger](../independent-visible-audit/page-ledger.json). All 64 sitemap routes have recorded visual/text review. Existing saved login succeeded under explicit authorization. The authenticated chat produced grounded answers and Compare-mode responses; a repeat-list follow-up refused. The widget completed with a refusal after about 30 seconds, so the initial pending screen is not a proven hang. Default procurement download is supported by matching file contents/timing. Mobile and most persistent mutations were not tested.

Confirmed findings to carry into execution:

1. Follow-up retrieval runs before conversation context and loses references.
2. An English term present in an approved source is indexed with an attached Arabic conjunction. This explains the specific term miss, not every bilingual retrieval failure.
3. Account copy promises AGYNEXA review of privately saved briefs, but no company-receiving workflow was established. Manual download/email directions on Start are accurate.
4. Four privacy/terms routes return branded 404s.
5. Customer entry is a setup journey, although chat and instructions already exist within an agent. The defect is not literal absence of chat or a system prompt.

## Existing technical contract

Next.js 16.4.0, React 19.2.4, TypeScript, existing `@components/` and `@ui/` aliases, Supabase Auth/Postgres 17/RLS and Groq. Existing workspace bootstrap is authenticated and idempotent per owner. Default standalone login goes to Account; inline Studio and brief login preserve their local context.

There are two existing agent templates, settings/instructions, text/TXT/MD knowledge up to 12KB, lexical retrieval, citations, run history, reviewed internal support proposals and immutable publication snapshots. There is no operational CRM/ERP/helpdesk, billing, PDF/OCR, vector search, external purchasing, shared team workspace or long-job system.

Advanced and Fast models worked in the current visible comparison. A third model is reserved for internal evaluation; neither registration in code nor a key slot proves current provider access. Keep one selected production model per ordinary turn; Compare remains deliberate. No new provider or framework is needed merely to improve conversation.

The runtime currently handles exact greeting/identity phrases with canned responses; other messages retrieve first and may refuse before a model call. Only prior questions are loaded, after retrieval. System instructions and citation validation already exist. Public widget instructions are deliberately separated from private saved instructions and public-approved sources are scoped. Preserve that boundary.

## Required product behavior

### Private conversation

The default customer path opens a chat, not a demand for a document. It explains actual capabilities, asks about one task and desired outcome, uses supplied facts to clarify or draft, and labels missing facts. It offers optional knowledge only when needed. Files must not be a prerequisite to introduction, task discovery or preparing a business brief.

Distinguish task discovery/drafting, source-backed company answers and human-reviewed proposals. A generated draft must not invent company policy, live account status, integrations, prices or completed actions. Mixed requests must retain grounding for their factual portions. No-source discovery is not permission to answer unsupported company facts. Public widget factual responses stay on the stricter approved-public-source path.

### KnowledgeGrid

A customer can add supported text, ask source questions, inspect original citations, continue a contextual conversation, get a bounded source-based summary or missing-information list and return to the saved conversation. Unsupported facts receive a useful explanation and next step. No claims of PDF or semantic retrieval until implemented and tested.

### ServiceFlow

A customer can describe a service issue, supply relevant facts, review a structured draft, explicitly approve a saved internal request and inspect its honest status. A private request record does not mean a message reached AGYNEXA, a merchant, a bank or an external helpdesk. Existing human approval, expiry and idempotency controls must survive changes. Do not add a full ticketing platform unless essential to this bounded deliverable.

### Project brief and company contact

Recommend retaining truthful private save + download + explicit manual sending for this first release, correcting the review promise and making the handoff understandable. A server-received company inbox is a separate scoped alternative requiring a named reviewer/access policy, receipt, abuse controls and retention. Never silently choose that alternative or call private storage a delivered enquiry.

### Demonstrations

Use two clearly synthetic, text-first examples: a retail returns-policy review and a distribution-exception brief. They demonstrate cited facts, missing inputs and a proposed next step without refunds, live inventory or supplier action. Banking/insurance/healthcare/energy examples remain proposed staff-side scopes, not proof of regulated production readiness. Keep personal collaboration data out of customer demonstrations.

## Content and discovery requirements

The owner explicitly reports that current content is confusing. An organized technical page is not proof of buyer comprehension. For every editable page, state who it serves, the recognizable problem, what the customer supplies, what AGYNEXA/app produces, limits, reviewer and next action. Simplify jargon in the opening; retain useful technical details lower down. Keep engagement deliverables separate from live app functions.

[Content review](content-strategy-review.md) maps eight program families, ten services and nine solutions to intent, headings, outputs and CTAs. It is a proposed editorial specification, not approved live copy. Its “send a summary” example must be revised to “prepare a summary for review” wherever delivery is not implemented.

Humanizer applies to body text, headings, forms, validation, empty/error/loading states, chat capability descriptions, metadata and localized calls to action outside protected surfaces. Arabic and English must communicate the same capability and caveats, using natural wording. Defaults for review: “مساعد” in customer language; “وكيل” only where a named product/technical term needs it; “مسودة” before approval; “محفوظ في حسابك” for private storage. Preserve vendor names as explicitly assessed candidates in technical detail, not visual proof of integration.

SEO: map one primary search intent to each existing page, avoid service/solution keyword cannibalization, use descriptive titles/headings, natural query language and crawlable relevant links; preserve reciprocal locales/canonicals. No thin autogenerated sector pages, invented volume/CPC, fabricated case studies, guaranteed ranking or customer counts. Current keyword suggestions are unmeasured hypotheses. Validate comprehension with simple user tasks, not a model's impression alone.

## Research reconciliation

The full 19 October market review was read along with current reconciliation/status/backlog. Retain its focus on concrete tasks, current-system alternatives, small scope, human review, real intake and evidence. Do not adopt its historic RFQ pivot, homepage edits, new market campaign or 90-day assumptions as current authorization. The latest owner direction is chat-first product utility and clearer existing-sector content.

[Regulated-sector matrix](regulated-sector-research.md) and [commercial-sector matrix](commercial-sector-research.md) cover all ten current sectors plus construction. Evidence describes particular countries, samples or industry benchmarks; it is not universal demand or proof an assistant fixes the underlying cause. Root verified selected primary retail, distribution, construction and banking sources. Re-rank prototype fit separately from production readiness and commercial accessibility: a bank complaint prototype is technically feasible but not a low-friction public bank launch.

Parallel Search worked. Exa returned exhausted credits and Semrush insufficient API units; neither was retried or topped up. Instantly is a lead/campaign service and was not used for irrelevant account access or outreach. No claim of measured keyword demand or identified willing customers follows from this research.

Official architecture guidance supports simple routed workflows, context with relevant user and assistant turns, clear instruction hierarchy and only real configured capabilities. PostgreSQL/Supabase documentation explains tokenization and matching. These are design inputs, not evidence our app has implemented a new feature. OpenAI documentation is consulted for prompting/context principles; the runtime remains Groq, so no Responses-specific parameter is transplanted blindly.

## Architecture questions the plan must settle

- Reuse existing bootstrap/idempotency and run records where possible. Decide the minimum additive schema for default assistant selection and conversation ownership; protect existing agents and published snapshots, rather than overwriting their instructions or source selections.
- Bound history to authenticated actor + workspace + agent + conversation + access kind. Recheck source visibility before rendering/reusing factual prior answers. Deleted/revoked sources cannot reappear from conversation history.
- Retrieve using contextualized current intent before refusing; normalize mixed Arabic/Latin boundaries consistently in query and index while preserving original source text/citations. Do not call a lexical fix semantic search.
- Extend the structured-output contract for discovery/drafts without silently accepting ungrounded company facts. A no-source schema must not contain an invalid empty citation enum. Keep provider failures/timeouts/cancellation and old public/API envelopes compatible.
- Keep each action tied to exact reviewed payload/version and explicit human action. A model proposal or tool availability is not permission to execute.
- Specify finite limits and retention semantics for new persisted data; do not claim deletion/retention guarantees absent an implementation. Avoid a new external dependency for each small feature.

## Release acceptance and decisions

The plan must include positive and negative journeys for a source-free new user, existing user, contextual follow-up, mixed-language retrieval, source deletion, tenant isolation, public/private boundaries, replay/concurrent bootstrap, cancelled/expired calls, reviewed internal requests, brief handoff, EN/AR copy, legal routes and isolated narrow/mobile layouts. Product checks are batched at delivery, with a real database-backed isolation check for schema changes. Missing Docker cannot be replaced by an unvalidated mock and called equivalent.

Before public launch, the owner must approve privacy/terms content grounded in actual data flows, identity/contact and retention arrangements. No jurisdiction, certification or legal promise may be invented. SMTP/password recovery was previously deferred; broad self-service launch must explicitly accept or resolve that account-recovery boundary. These decisions do not prevent completing the plan.

Execution requires owner approval of the final scope. Production promotion and domain connection are separately gated on verification and the owner's launch decision. Re-check repository/production baseline, use an additive migration with compatible rollback, retain data and record evidence in the repository at execution time. Planning artifacts are currently local outputs only; no repo commit, push or deployment is part of planning.
