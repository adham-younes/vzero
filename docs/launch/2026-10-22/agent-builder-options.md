# AGYNEXA Agent Builder/Studio — additive architecture exploration

Status: planning exploration, 22 October 2026. The owner is still explaining the desired builder and has not chosen its final scope. No app, code, database, configuration, installation or deployment action is authorized here. Preserve [product-spec.md](product-spec.md) and [implementation-plan.md](implementation-plan.md) as the completed two-template baseline; do not replace them prematurely.

## The product distinction

The new idea is more than a conversation with AGYNEXA's own assistant. A customer describes a company task, reviews the proposed assistant's job and permissions, creates it, tests it and receives a usable hosted assistant for that company. KnowledgeGrid and ServiceFlow remain the first two bounded templates. The builder is the configuration/provisioning experience around them, not eleven sector-specific backends or arbitrary agent code generation.

Recommended direction for review: **a template-first hosted AGYNEXA Agent Builder**. The assistant may help draft configuration, but the server validates and provisions it. This can produce a real customer-owned instance with a saved identity, instructions, knowledge scope and testable behavior. Describing a company does not authorize reading its systems, creating new tools or taking external actions.

| Option | What the customer receives | Architectural fit | Recommendation |
|---|---|---|---|
| Template-first hosted builder | One configured private KnowledgeGrid or ServiceFlow assistant, a test conversation, and explicit optional publication/delivery choices | Reuses current agents, instructions, language/model settings, knowledge, versions, run history and approval primitives; requires the baseline conversation/entry/grounding work | Preferred bounded first version, subject to owner's final intent |
| Extensible workflow builder | A configured assistant plus a small reviewed registry of authenticated tools, permission scopes, durable approvals, usage budgets and delivery receipts | Needs tenant credentials, action lifecycle, connector-specific verification and operational ownership beyond the current baseline | A later scoped increment after a specific useful action and receiving system are chosen |
| Arbitrary autonomous agent platform | User-defined tools/code, Linux environments, multi-agent graphs, external messaging, long jobs and deployment destinations | Requires strong sandboxing, secret isolation, durable state, abuse controls, metering, monitoring and recovery; an SDK alone supplies none of these guarantees | Do not silently include in this release or promise every sector is ready |

This is a scope recommendation, not a claim that the first option is already implemented or commercially validated.

## A concrete bounded first journey

1. The customer signs in and chooses “Create an assistant.” They describe one business problem and desired result before any file. A sector choice changes examples/intake questions, not hidden tools or regulatory readiness.
2. Conversational discovery identifies who will use it, the task, allowed inputs, output, company facts that need sources, decisions reserved for people and unavailable systems/actions.
3. The builder prepares a **configuration draft** using one of the two templates. It shows name, purpose, language, model choice, instructions, supported knowledge, fixed capability boundaries and sample questions. This is configuration, not model training or autonomous code generation.
4. The customer reviews a plain permission summary: what it can read, what it can prepare, what requires a click, what it cannot access/do, and which model usage budget applies. “Connect our ERP” remains an unmet requirement unless a real approved connector exists.
5. Explicit “Create assistant” provisions a separate agent under the authenticated workspace using existing idempotent creation. Do not overwrite the default intake assistant, existing personal assistant or their knowledge. Repeat clicks create at most one intended instance.
6. The customer tests it with synthetic or supplied non-sensitive examples. KnowledgeGrid can explain its purpose before sources and asks for approved company text only for factual answers. ServiceFlow can clarify/draft immediately and propose an exact internally reviewed request. Both expose missing facts.
7. The customer receives a private hosted URL in Studio. They can return to the saved configuration/conversation. A public widget/API is an explicit separate publishing step with its existing stricter knowledge boundary, not an automatic consequence of creating the agent.

For the narrow version, configurable fields are the existing name/template/instructions/language/model plus the bounded chat profile. Tool capabilities are **fixed by reviewed template policy**, not arbitrary customer-authored tool JSON. Knowledge sources are added explicitly using the current supported text workflow. Variable tool permissions become meaningful only when real configured tools exist.

## Configuration contract and provisioning boundary

A proposed versioned specification can be represented as:

```ts
type AllowedProductionModel = 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b';
type AgentBlueprintV1 = {
  schemaVersion: 1;
  name: string;
  template: 'knowledgegrid' | 'serviceflow';
  purpose: string;
  language: 'en' | 'ar';
  model: AllowedProductionModel;
  instructions: string;
  knowledgePolicy: 'approved_private_text';
  capabilityProfile: 'knowledgegrid_v1' | 'serviceflow_internal_v1';
  testExamples: { question: string; expectedBehavior: string }[];
};
```

`purpose` and test examples are builder review artifacts; the existing runtime agent settings remain the source of execution truth. The final implementation must decide their minimal persisted home using existing version/configuration records after reviewing those actual records; this exploration does not authorize a new builder schema. Do not claim a field is persisted simply because a TypeScript type names it.

The provider drafts this specification; server validation enforces template/model allowlists, current field limits, supported policies, request identity and tenant scope. A blueprint cannot contain raw credentials, executable code, SQL, shell commands, arbitrary URLs/tools or instructions that grant permissions. Capability profiles are server definitions. Instructions cannot override them.

At minimum the customer sees three distinct states: **Draft configuration → Created private assistant → Explicitly published surface**, with version and permission summaries. Updating private instructions or knowledge does not silently change an existing immutable public snapshot. Existing revision checks and source/publication generation controls remain authoritative.

The baseline default customer assistant can act as the intake/configuration guide. The generated customer assistant is a distinct saved instance; the user is not merely returned to the guide's chat and told an agent was created. The UI must display the created agent's actual ID/name/settings and a working test entry. If provisioning fails, keep the draft and show an honest failure rather than a simulated success.

## Tools, approval and orchestration

The minimum tool vocabulary describes existing functions: retrieve authorized text, draft a brief, propose an internal request. Approval/rejection remains an authenticated user interface action on the exact stored proposal, not a model tool that grants its own approval. Adding/public-approving sources or publishing also requires explicit human action.

A future external tool needs a registered server implementation with typed input/output, tenant credential reference, read/write scope, validation, timeout, request idempotency and an approval policy. A durable proposal stores the exact payload/version and target. A human reviews that exact action; execution reauthorizes source/credential/permission and checks expiry before calling the tool. Record an actual provider receipt/status and handle ambiguous retry/delivery outcomes. “Approved” is not “delivered,” and generic retries cannot guarantee exactly-once external effects.

Linux/code tools need isolated per-tenant/job sandboxes, bounded CPU/RAM/disk/network/lifetime, no platform host access, controlled package installation, no ambient tenant secrets and clean teardown. Email needs tenant-authorized sending identity, recipient/content review, explicit send scope, abuse/rate controls and receipt/error handling. Merely importing an SDK or reusing a tool name does not provide these boundaries. Neither capability is in the recommended first builder version.

## Framework selection is subordinate to the product boundary

The following observations were supplied from the coordinator's official-document research; this architect did not browse or test the SDKs. Attach the coordinator's exact retrieved source links/evidence to the consolidated plan before using these as implementation dependencies.

| Candidate | What the verified research establishes | What it does not establish for AGYNEXA |
|---|---|---|
| Current direct Groq/Next/Supabase runtime | Existing short-text knowledge, bounded chat calls, private settings, publication snapshots and atomic internal approvals are available foundations | General external action orchestration or arbitrary customer tool execution |
| Vercel AI SDK 7 | `ToolLoopAgent`, tool approval configuration and signing support exist; documented provider-executed tools do not use the SDK approval mechanism; approval defaults can be overridden | Correct tenant isolation, always-on approval enforcement, durable business action state, safe provider-tool approval or free/unlimited usage |
| eve | Official docs contain a multi-tenant approvals pattern; AI SDK 7 material describes eve as built on AI SDK | That the owner's existing app's authorization, budgets, tools or deployment can be copied and considered verified |
| OpenAI Agents SDK | SDK runs the agent loop and supports guardrails/HITL; the application owns deployment, tools, storage and approval decisions | A hosted customer platform, compatible Groq configuration, persistence/permissions or a ready commercial builder |
| OpenAI hosted Agent Builder | Coordinator reports its branded product documentation is marked deprecating | A stable long-term foundation to choose without reviewing the replacement/deprecation path |
| Anthropic Agent SDK | Built around Claude Code binary/tools/permissions/sessions, distinct from a general model-client SDK | Direct operation with existing Groq keys or a drop-in upgrade for current chat |
| CrewAI | Named by owner; comparison not yet sufficiently sourced in the supplied evidence | A justified framework choice based on its name alone |

For a template-first builder, the current runtime can provision configuration without an orchestration rewrite. The recommended default is **no new agent framework solely to launch the builder**. If the owner confirms Linux/email/durable multi-step work as a required product, compare the concrete lifecycle/approval/provider requirements first. Existing eve/AI SDK familiarity is a reason to evaluate that path, not permission to copy every dependency or migrate the current AGYNEXA app blindly.

## Models, billing and credentials

Separate **who pays for inference**, **who owns a model API key**, and **who authorizes a business-system tool**. They are different contracts.

**Platform-funded launch recommendation:** keep existing server-held model credentials and the two tested production model choices. Enforce per-tenant usage/cost controls in addition to global/per-identity request limits. Reserve budget atomically before work, settle actual recorded usage after completion/failure and stop on quota exhaustion; do not treat three keys as three independent unlimited customer budgets. The owner must approve included usage and commercial terms. No invented cost/price or guarantee of profitability follows from current key access.

For narrow chat-only launch, existing rate limits can remain the base technical control, but they are not a cost budget. If charging customers for platform-funded usage, implement and test the tenant metering/reservation rule before making usage promises. Model prices/provider terms need current verification during that separate commercial design; no new paid service is authorized here.

**BYOK later:** accept keys only through an authenticated protected server flow, encrypt in an appropriate server secret store, return masked identifiers, never expose them in browser/local storage/logs/URLs/prompts/exports, bind to tenant and provider, and support rotation/revocation. Requests cannot name another tenant's secret reference. Clarify the customer's provider billing and the platform's own fee separately. BYOK is not required to configure a useful first assistant and does not solve tool permissions.

**Business tools:** connector credentials are customer-specific and least-privileged even if model inference is platform-funded. A platform research connector used while planning does not become a customer's runtime tool. Never export or reuse the owner's Linux/email/research credentials across companies.

## What “receive the agent” means

| Delivery | Honest first meaning | Boundary |
|---|---|---|
| Private hosted agent URL | Customer signs into AGYNEXA and opens their saved agent/configuration/chat | Not a shared team portal or self-hosted runtime |
| Public widget | Explicit publication of approved public knowledge using existing widget controls | No private instructions/history, sensitive case data or external action capability inherited |
| API | Existing scoped authenticated invoke surface, explicitly enabled and documented | Keys/quotas/access boundaries remain server controlled; no unrestricted admin/tool endpoint |
| Sanitized JSON export | Optional configuration manifest/test examples owned by that customer | Not a standalone deployable agent, trained model or secret export; importing elsewhere requires an implemented compatible runtime |
| Linux/email/other hosted worker | Future separately scoped operational capability | Requires durable action/sandbox/credentials/review/receipts and cost controls; not obtained by downloading the configuration |

Never label an exported prompt “a complete deployed agent” or a widget “the full private workspace.” If a client wants code handover/self-hosting, define it as a separate implementation engagement with dependencies and acceptance.

## Existing other project: relevant experience, not an approved transplant

The coordinator located a plausible owner project `/Users/adham/Documents/ChatGPT/adham-ai-agent-2026` and read it only. The owner has not conclusively confirmed that it is the project being described. Supplied source facts: AI SDK 7/eve/Mastra dependencies; an eve-defined agent with a configured Groq model; Linux sandbox/package-operation tools; email connection paths; research/subagent paths and configured limits. No secrets were read and no live behavior/multitenant isolation was verified.

Treat that as a candidate source of patterns only after the owner confirms its identity and relevant intent. Current source configuration, large token/cost limits or a tool file's presence does not prove a safe customer SaaS. Its AGENTS rules govern that project, not permission to import its entire application into AGYNEXA. Any concrete code/repository reuse belongs in the appropriate project execution after approval.

## Owner choices that would materially change the consolidated plan

The parent should finish the interactive intake rather than ask routine engineering questions again. The genuine scope fork is whether “builder” means configured hosted KnowledgeGrid/ServiceFlow assistants, or a customer-programmable external-action/code platform. Recommended first scope is the former. Also determine whether the initial deliverable is private hosted only or requires widget/API, whether platform-funded usage is part of a paid pilot, and whether any specific external action is essential to the first customer's output. No sector checkbox or SDK name resolves those choices.

Once scope is chosen, preserve the baseline's home protection, source-free discovery, exact grounding/context/revocation, local DB/security gates, copy clarity, retention/rollback and commercial/legal/recovery decisions. Add only the chosen blueprint→review→provision→test→deliver tasks. No implementation starts merely because this exploration is saved.
