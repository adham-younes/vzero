# AGYNEXA first-release product specification

Status: proposed specification for owner review, 22 October 2026. Planning only; these upgrades are not implemented, commercially approved, deployed, priced, or validated for demand. The accompanying implementation plan turns this specification into staged work after explicit approval.

**Scope checkpoint:** the owner subsequently opened an AGYNEXA Agent Builder/Studio exploration. Preserve this specification as the two-template product baseline; it is not the owner's final selected packaging. See [agent-builder-options.md](agent-builder-options.md). KnowledgeGrid and ServiceFlow can become templates/products inside a hosted builder rather than three unrelated platforms. Do not implement this baseline until the parent consolidates the builder decision and the owner approves the resulting scope.

## What the customer can buy

Recommend two **scoped implementation/pilot offerings**, delivered through the existing AGYNEXA workspace. A public catalogue entry is an offer to scope this work; it is not evidence that an enterprise deployment, subscription or integration already exists. Do not launch a subscription checkout in this release. Owner approval is required for price, pilot duration, included setup/support, usage allowance, acceptance responsibility and any later recurring commercial terms.

The ten service entries remain the broader implementation-engagement catalogue. The nine solutions describe business tasks that could be scoped. Neither list represents ten ready SaaS products. Sector examples reuse these two products rather than creating eleven platforms.

### Product card 1: KnowledgeGrid — answers from your approved company information

**Buyer and end user:** a business owner, operations/support lead or knowledge owner commissions the pilot; the initial end user is the authenticated workspace owner. The current workspace is not a multi-employee portal. Another employee/team deployment requires separately scoped membership and access work.

**Customer job:** find an answer in a small approved set of company instructions, understand which source supports it, and identify what is missing before acting. A first concrete pilot might cover a retailer's return-policy questions.

**Inputs:** the business question and desired output first; optional short pasted text or UTF-8 TXT/MD when a company-specific answer needs evidence. Source title is 1–160 characters. Content must satisfy both the existing 12,000-character form limit and **12,000 UTF-8 bytes**; Arabic reaches the byte limit sooner. Questions remain 1–3,000 characters. Selecting a file fills the editor; explicit source submission creates knowledge. Adding knowledge, allowing public use and publishing remain separate explicit steps.

**Outputs:** a cited answer, a bounded source-based summary, a list of missing/conflicting information, or a clearly labeled draft using supplied facts. Citations open the original source excerpt. The user can continue with “repeat the previous list” and return to the saved private conversation.

**Complete customer journey:**

1. Sign in and reach a private conversation. The assistant explains what it can actually do and asks which task/result matters.
2. Describe the question without uploading anything. Receive clarification or a useful draft outline immediately; the assistant does not invent company policy.
3. When company facts are needed, see the reason for adding a particular source and the format/size limit before choosing to add it.
4. Review and submit the source. Public approval is off by default. Ask the company question and inspect its citations.
5. Ask a follow-up or summary. Confirm unknowns instead of receiving invented details. Refresh/navigate away and reopen the same private conversation.
6. Copy or download a reviewable output. Any external distribution is the user's deliberate manual action.

**Synthetic sample output:** given a demo policy stating “Unopened items may be returned within 14 days with proof of purchase,” answer: “The supplied policy allows unopened items within 14 days with proof of purchase [Policy excerpt]. It does not state whether opened faulty items qualify. Ask the policy owner to confirm that case.” These are demonstration facts, not AGYNEXA's policy or a real merchant's rules.

**Must work:** useful source-free introduction/discovery; real cited answers after supported ingestion; original citations; English term matching across the demonstrated Arabic/Latin boundary; contextual follow-up; durable authorized history; deleted sources unavailable through new answers, old-answer rendering and replay; no cross-workspace/private-to-public leakage.

**Boundaries:** lexical retrieval over supported short text; no PDF/OCR, vector/semantic search, website crawler, bulk repository sync, live account lookup or guaranteed arbitrary language translation. No guarantee every question is answerable. No claim of a team role model, enterprise certification or regulated-data production readiness. Existing public widget remains a separately configured approved-public-knowledge surface.

**Honest delivery/sales model:** a scoped pilot covers one named knowledge task, supported source preparation, assistant configuration, agreed representative questions/missing-evidence cases, evaluation and handover. The pilot can demonstrate an actual useful result, not just a chat interface. A buyer whose full need is an existing Microsoft/Intercom/Chatbase workflow should be told when that native product is sufficient; AGYNEXA need not recreate its platform.

**Owner commercial decisions:** confirm the exact pilot scope, price/charging method, acceptable usage and support ownership, client obligations for approved sources and review, and whether AGYNEXA is selling configuration of this bounded app or a separately contracted client-system implementation. No decision is filled with an invented number or SLA.

### Product card 2: ServiceFlow — turn a business issue into a reviewable request

**Buyer and end user:** an operations/support owner or small-business manager commissions the pilot; initially the authenticated workspace owner describes and reviews the issue. The first release does not promise a staffed shared queue.

**Customer job:** convert an incomplete account of an issue into a clear brief: what happened, desired result, known facts, missing evidence, proposed next step and the person who must decide. A first pilot might cover a distributor's weekly exception review.

**Inputs:** a conversational description before any file, the intended outcome and whatever facts the user can supply. Optional approved procedure/policy text provides factual constraints. Same short-text/source limits as KnowledgeGrid. Do not require personally identifying customer/employee records for discovery or demonstrations.

**Outputs:** a structured draft; one prioritized clarification question at a time; sourced procedure guidance where available; an exact internal request proposal with title/details; an explicit approve/reject decision and visible internal status. A separate project brief may be privately saved/downloaded using the existing consent-based form.

**Complete customer journey:**

1. Open the default private business assistant and describe a task, such as “Some orders are late and I need a review brief.” No document is demanded.
2. Clarify the result and ask for the most important missing fact. Reflect the user's facts as supplied statements, not verified live system status.
3. Draft the brief with known facts, unknowns, assumptions and proposed next steps. If company procedure matters, explain why an optional approved source would help.
4. If requested, show the exact proposed internal request. It is a pending draft, not an executed workflow. Keep the existing 15-minute approval expiry.
5. The authenticated owner explicitly approves or rejects the stored proposal. Approval uses the stored payload only and cannot silently substitute different title/details.
6. Display “Approved in your workspace” or the honest pending/rejected/expired state. Explain that nobody outside the workspace has received it. Allow manual export/copy for the user's existing process.
7. If the user wants to contact AGYNEXA, prepare a separate brief, review the required fields and consent, save privately, download and manually send using verified contact instructions. A saved record alone is not an enquiry receipt.

**Synthetic sample output:** “Distribution exception brief — supplied week ending 18 October. Known: order D-104 is marked two days late in your pasted list; no dispatch update is supplied. Missing: promised date, latest carrier update and named owner. Proposed next step: the operations owner checks dispatch status and chooses the customer response. No supplier or customer has been contacted.” Synthetic rows are visibly labeled; the assistant does not infer live inventory or shipment status.

**Must work:** a useful brief before sources; missing facts remain visible; company procedures require current evidence; exact-payload approval; replay creates at most one request; expired/rejected/cancelled proposals do not execute; statuses and manual handoff are clear; another account cannot read or decide the request.

**Boundaries:** approval records an internal decision only. No external helpdesk delivery, AGYNEXA inbox, assignment/notification promise, refund, purchase, account change, regulatory filing, credit decision, medical decision or live CRM/ERP/WMS state. An approval is not a completed service. No long-running autonomous workflow or ticket lifecycle is added.

**Honest delivery/sales model:** a scoped request-preparation pilot for one issue family, with an agreed brief template, missing-input rules, optional approved guidance, exact human approval and manual handover into the customer's current process. If the buyer requires shared queues, notifications or system updates before the output is useful, scope that separate integration engagement or recommend an existing tool; do not sell this pilot as already meeting that requirement.

**Owner commercial decisions:** confirm issue family, review owner, measurable acceptance, included setup/support and pricing. A staffed inbox or external delivery is an explicit expansion with receiving roles, receipt, abuse controls, retention and operational ownership; it is excluded from the recommended first release.

## Shared first experience and identity

Default new customer entry is a separate private ServiceFlow-based business assistant with a customer-discovery profile. It can help frame a task, draft a brief and use approved knowledge. Existing KnowledgeGrid/ServiceFlow assistants remain selectable and keep their settings; neither the owner's personal collaboration data nor private instructions become demonstration content.

Suggested introductory meaning, to be refined with Humanizer in EN/AR: “Tell me one task you need help with and the result you want. I can help clarify it, prepare a draft and answer from information you choose to add. I cannot access your business systems or send requests outside this workspace.” This is a truthful visible introduction, not an exact-match greeting regex that replaces the conversation.

The hierarchy is platform safety/capability policy, access-profile policy, private agent instructions, current task/conversation, then untrusted source/user content. Private instructions customize name, manner and task focus but cannot add tools, bypass evidence rules or appear in public prompts. Public widgets use their existing sanitized public instructions and approved source IDs; they do not inherit customer discovery, private history, briefs or persona.

## Intent and task policy

| Customer intent | Permitted behavior | Evidence/action boundary |
|---|---|---|
| Introduction or business discovery | Explain actual capabilities; clarify one task/outcome; ask a useful question without a file | Capability statements come from the server's real registry; no invented systems or company policy |
| Draft from supplied facts | Organize a brief/checklist/response for review; identify assumptions and unknowns | User statements are attributed as supplied; suggestions are not company facts |
| Company-specific factual question | Answer from currently authorized approved knowledge with original citations | No relevant evidence means an explicit gap and useful next step, not a general-model substitute |
| Mixed fact and draft request | Separate cited factual portions from proposed text/assumptions | A draft label does not authorize unsupported policy, price, status or eligibility claims |
| Repeat/explain previous answer | Use bounded complete turns and reauthorized original evidence | If the source was revoked, explain that the prior factual answer is unavailable and request current evidence |
| Internal request proposal | Prepare the exact stored proposal for explicit human review | Current expiry, replay, actor scope and atomic approval remain enforced |
| External action or live lookup | Explain the unavailable capability and prepare manual next steps if useful | Never claim a tool call, delivery, completed action or live status |

## Demonstrations and sector scope

The first two demonstration packs are retail return-policy review and distribution exception review. Both use plainly synthetic text, expected citations, unknowns and human decisions. A visitor may read the sample; loading it into private knowledge requires an explicit action and retains public approval off. No automatic source creation, publication or mixing with personal knowledge.

Research across banking, insurance, healthcare administration, telecommunications, energy, retail, hospitality, professional services, logistics, distribution and construction informs narrow examples and missing-input questions. It does not prove demand or justify eleven applications. A construction delay log does not solve worker shortages; shipment chronology does not establish a paperwork cause; a banking complaint prototype is not proof of regulated production readiness. Regulated examples remain proposed staff-side scopes and exclude sensitive real cases in the first demonstrations.

## Marketing and comprehension contract

Every editable page must identify the customer, recognizable problem, what they supply, concrete output, limit/reviewer and next action. Services explain an implementation deliverable; solutions explain a task; sector examples explain a possible application. Start with the user's job rather than internal architecture labels. “Describe a task” opens private discovery, not a company inbox.

Use the supplied Humanizer intent matrix for the eight program families, ten services and nine solutions. Rewrite headings, body, forms, states, metadata and local CTAs outside protected surfaces. Keep natural professional Arabic/English equivalent in capability, caution and next action. Suggested Arabic defaults: مساعد, مسودة, محفوظ في حسابك. Keep shared homepage navigation/footer/style strings frozen if changing them would alter the protected home surface.

SEO uses one primary intent per existing page, descriptive titles/headings, useful internal links and reciprocal locale/canonical mapping. Keyword ideas are unmeasured hypotheses; no invented search volume, ranking guarantee, customer proof or ROI. Construction gets no new page. Existing system/vendor names are clearly assessed candidates, not integration badges.

For review, a reader unfamiliar with AGYNEXA must be able to answer: “Who is this for?”, “What do I give it?”, “What do I get?”, “What still needs a person?” and “What does the button do?” A pass requires correct answers grounded in visible copy, not a model's general impression.

## Fixed implementation direction

- Preserve the entire homepage/opening screen, Hero components, video, colors, fonts and behavior, including indirect changes through shared components/styles. Other page text and section order may change inside the existing template.
- Reuse authenticated atomic workspace initialization. Create a separate default customer assistant once using an existing unique organization/request key; never overwrite or automatically select the owner's personal assistant or knowledge.
- Reuse `agent_runs` for scoped complete conversation turns; do not introduce a conversation platform. Add an agent chat-profile discriminator only to distinguish new customer discovery from existing strict agents.
- Authorize and load bounded complete turns before retrieval. Recheck source access before rendering, reusing or replaying any factual answer. Deleted knowledge must not return through history.
- Use one selected existing production model call per ordinary turn. Separate capability, discovery, draft, grounded and missing-evidence response parts; enforce citations and action boundaries server-side. Public/API behavior remains strict and public-source-only where applicable.
- Mixed Arabic/Latin normalization fixes a demonstrated lexical boundary problem. It is not semantic search or guaranteed arbitrary translation.
- Keep human approval bound to the exact stored proposal and expiry. No model-generated tool claim executes an action.
- Rewrite editable English/Arabic copy around customer problem, input, output, limits and next step. Preserve facts, taxonomy and routes. No fabricated integrations, prices, customer proof, ranking or ROI.

## Launch conditions and unresolved owner decisions

Approve the two proposed offers and their actual commercial terms; verify legal identity/contact and privacy/terms against real data flows; choose retention as specified in the implementation plan; explicitly resolve or accept a restricted rollout for the deferred signup/recovery/email boundary; and select the final domain before a domain action. These are real commercial/legal/launch decisions, not routine engineering questions.

The recommended first release has no new paid subscription, automatic email delivery or staff inbox. Product readiness requires the implementation plan's real local DB/Auth isolation tests, tenant/revocation checks, affected browser/mobile journeys, protected-home comparison, capability/copy mapping and verified release evidence. Planning research and currently working individual model paths do not establish that readiness.
