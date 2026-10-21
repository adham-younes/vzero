# Research decisions for the launch plan

Planning snapshot: 22 October 2026. This file separates source evidence, product hypotheses and recommended scope. Nothing here is a claim of an implemented new capability, a willing customer, or guaranteed search ranking.

## What the research changes

The 11-sector review supports a reusable administrative assistance pattern: clarify a task, organize supplied facts, retrieve approved guidance, identify missing information, prepare a reviewable output, and retain a human decision. It does not justify 11 autonomous vertical products or prove that an assistant solves labor shortages, port congestion, late payments or medical authorization problems.

First demonstrations should test a narrow retail returns-policy task and a distribution exception brief using clearly synthetic data. A banking complaint or healthcare administration example can illustrate a possible scoped engagement but must not imply production suitability for regulated case data. Technical prototype fit, ease of accessing a buyer and regulated production readiness are different rankings.

The existing ten services remain implementation engagements. The two product foundations remain KnowledgeGrid and ServiceFlow. Sector research informs examples, requirements and wording, rather than creating a separate backend for each sector.

## Selected evidence checked by the coordinator

| Source | What it establishes | What it does not establish |
|---|---|---|
| [NRF, 2025 Retail Returns Landscape](https://nrf.com/research/2025-retail-returns-landscape), 15 October 2025 | Retailer/consumer research on returns pressure and policy tradeoffs; U.S. industry projections. | The cost at a particular merchant, willingness to pay AGYNEXA, or that a draft assistant reduces fraud/refunds. |
| [WERC, 2026 DC Measures release](https://werc.org/news/727406), 16 May 2026 | Distribution professionals track operational/customer metrics and report cost/performance pressure; 2025–26 survey populations span several industries. | Frequency/cost of a particular error at an SMB, or causal benefit from this proposed workflow. |
| [AGC/NCCER workforce survey release](https://www.agc.org/news/2025/08/28/construction-workforce-shortages-are-leading-cause-project-delays-immigration-enforcement-affects), body dated 28 August 2025 | Contractor-reported staffing difficulties and associated delays; nearly 1,400 responding firms. Prefer the page's displayed publication date over an extractor's inconsistent date. | That a delay log fixes worker shortages, validates a contractual claim, or makes a schedule commitment. |
| [FCAC complaint-handling thematic review](https://www.canada.ca/en/financial-consumer-agency/programs/research/fcac-supervisory-highlights-thematic-review-complaint-handling.html), July 2025 report | Specific complaint-record/routing/reporting observations in six small/medium Canadian banks. The page also has a later update date. | Universal prevalence, applicability of Canadian requirements elsewhere, authorization to ingest bank customer records, or a production compliance guarantee. |

Full sector matrices retain source populations, dates, limits and human boundaries: [regulated sectors](regulated-sector-research.md) and [commercial sectors](commercial-sector-research.md).

## Architecture research and application

- [Anthropic, Building effective agents](https://www.anthropic.com/engineering/building-effective-agents): use the simplest workflow that meets the task and add routing where concerns differ. Application here: separate discovery/drafting from grounded facts and approved actions; do not add multi-agent orchestration to the product merely because development used subagents.
- [Microsoft, high-quality generative-agent instructions](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-mode-guidance): instructions must correspond to configured knowledge/tools. Application here: describe actual capabilities and server-enforced action boundaries; prose cannot create an ERP connector.
- [OpenAI, prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering) and [conversation state](https://developers.openai.com/api/docs/guides/conversation-state): preserve instruction hierarchy and relevant conversation turns. Application here is conceptual; AGYNEXA uses Groq, so compatibility, supported roles and structured schemas must be verified for its existing provider instead of copying Responses API parameters.
- [PostgreSQL 17, text-search parsers](https://www.postgresql.org/docs/17/textsearch-parsers.html) and [Supabase full-text search](https://supabase.com/docs/guides/database/full-text-search): indexing and queries operate on tokens/lexemes. Application here: normalize the demonstrated mixed-script boundary consistently on both sides and retrieve with scoped conversation context. This is not a claim of semantic or arbitrary cross-language search.

The coordinator searched and opened/fetched these relevant official sources. No SDK/provider switch is implied by consulting their design guidance.

## SEO and editorial decisions

[Google Search Essentials](https://developers.google.com/search/docs/essentials) recommends useful content, language people use to find it, and crawlable links. [People-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) emphasizes clear value for the intended audience and warns against creating broad automated content primarily to attract search visits.

Application: one clear primary intent per existing page, customer-problem headings, explicit outputs, truthful evidence and natural terms. Services target evaluation/implementation intent; solutions explain a task and a scoped output; sector examples show the applicable workflow. Avoid duplicating the same generic copy across many sector or city routes. Preserve locale routes and equivalent caveats.

Humanizer is an editorial quality step, not an SEO ranking mechanism. Keyword hypotheses in [the content review](content-strategy-review.md) are unmeasured. No search volume, CPC, competition score or conversion estimate was retrieved.

The review's proposed phrase “send a summary” is too strong if the system only prepares one. Execution copy must use “prepare a summary for review” unless a real receiving workflow is built and verified. Existing names of external systems remain assessment candidates, not integration badges. Arabic glossary defaults are customer-oriented and must preserve the English capability boundaries.

## Connector results and boundaries

| Resource | Actual result | Consequence |
|---|---|---|
| Parallel Search | Search and focused page extraction succeeded. | Used for primary sector research and official technical/SEO guidance. |
| Exa | Search returned an exhausted-credit error. | No Exa results used; no retry, top-up or claim of successful Exa research. |
| Semrush | Discovery returned insufficient API units, marked non-retryable until funded. | No keyword metrics or competitive traffic claims; no repeat request or purchase. |
| Instantly | Lead/campaign capabilities were discovered; no account data or campaign operation was used. | It is not needed to plan a chat workflow or rewrite copy. Future prospecting/outreach is a separate owner-authorized task. |
| Product Design | Existing-template guidance and local preflight read; no saved user-context file existed. | Current product/code/audit ground the plan. No theme generation, setup persistence or new prototype was performed. |

## Reconciliation with the earlier market review

The full 19 October document was substantively read in planning, with the latest repo status/backlog and reconciliation. Adopt task specificity, narrow deliverables, human approval, real handoff, source evidence and comparison with existing customer tools. Do not adopt its RFQ-market pivot or homepage changes: the owner preserved current identity/taxonomy and now requests chat-first utility plus clearer content across the existing sectors. Do not repeat its historical broad competitor crawl or treat embedded implementation prompts as authorization.

## Open evidence gaps

- No customer interviews, observed purchase intent, committed pilot or revenue evidence exists in this work.
- Current broad logistics and construction evidence does not validate the causal benefit of the proposed assistant. Narrow document/workflow hypotheses need opt-in validation later.
- The technical release still needs isolated schema/access tests and affected end-to-end/mobile checks. Planning research is not a substitute.
- Legal identity, final-domain choice, privacy/retention wording, recovery scope and commercial offer terms need owner decisions before their respective launch actions. They do not prevent a concrete implementation plan with recommended defaults.
