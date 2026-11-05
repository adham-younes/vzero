# Agent Studio interface — 5 November 2026

Status: IMPLEMENTED; final build and production verification belong to the combined release receipt. This document does not claim deployed or tested behavior.

The Studio now has a dedicated bilingual authoring entry and an authenticated agent workspace. The existing charcoal/emerald identity is retained. Original public Hero components and video are untouched by this work.

## User journey

1. Select a sector or describe a task on the signed-out Studio entry. The interface is an editable brief, with no fabricated chat response. Sign-in is required to save or run the agent. The brief is stored only in this browser tab's sessionStorage while authentication completes, then consumed into the authenticated builder.
2. Configure the agent name, sector, language, working mode, system prompt and optional live web search/Python tools. The eleven starting points are custom/general, customer service, sales, operations, finance, HR, procurement, healthcare operations, education, real estate and technology. The two underlying existing templates remain distinct. Presets are editable task scaffolds, not pre-provisioned enterprise integrations.
3. Review the actual saved configuration in readable fields, then explicitly approve creation through the existing idempotent actions contract. The UI no longer presents raw JSON or a snapshot hash as the primary review experience.
4. Test in the private conversation. Existing history, source management, recovery, stop, retry and approval behavior is retained. Responses support safe rendered headings, lists, tables, code blocks and http/https links without interpreting HTML. Actual provider tool activity, web sources and authorized artifact download links appear when present in run usage. Revoked/expired source history suppresses associated tool evidence. Arabic response text uses the bundled Arabic font even within the English shell.
5. Request activation only after a successful test of the saved revision. The request is stored, and a mailto link opens a draft to adham@agynexa.si. The UI states that saving does not send an email, activate the agent or agree pricing. Price, terms and production scope are discussed by email.
6. Connect a customer-owned OpenAI API key when storage is configured. The password field is cleared before the request and never persisted in browser storage. ChatGPT plan use is described separately and is not represented as active.
7. After commercial activation and provider connection, publish an approved fixed version. Activated, published agents expose scoped API-key creation, a one-time copyable token, a server request example, actual expiry/revocation records, revocation controls and the actual published widget URL/embed snippet when enabled. API keys are created only through an explicit user click. No key or publication was created during implementation.

## Layout and accessibility

A persistent workspace rail, explicit agent tabs, anchored composer and optional wide-screen configuration inspector provide access to the same saved agent. Mobile uses an off-canvas rail and horizontally scrollable agent tabs. Logical properties support RTL. Form fields have labels, status/error text has live-region roles, keyboard focus is visible, and reduced motion disables smooth chat scrolling. The sign-in dialog uses the native dialog focus behavior. Final responsive and keyboard checks remain part of production verification.

## Public-to-Studio handoff

The nine solution workflow values (knowledge, documents, sales, service, finance, logistics, procurement, receivables and customer-operations) are recognized by the Studio entry and authenticated loader. They prefill a task and corresponding sector. No business text is put in URL parameters.

## Review implications and limits

The required 19 October market review advocated explicit outcomes, approved sources, testable examples, human authorization and truthful integration boundaries. Those principles are retained. Its procurement-only agency recommendation is superseded by the owner's current direction for a multi-sector self-service Agent Builder. The UI does not claim installed customer connectors, autonomous external execution, completed commercial agreements or successful ChatGPT subscription authorization.

Mobbin search was attempted by the release lead and refused for plan eligibility; no unseen screen was used or cited as a reference. Humanizer's embedded editing process was applied to the new product copy. Bundled Next.js use-client documentation was read after dependencies became available; official Next.js client/CSS documentation was consulted before then.

No interim application tests were run, per the owner's final-production-only verification instruction. No production account, model call, key creation, email send, data write or deployment was performed by this frontend subtask.
