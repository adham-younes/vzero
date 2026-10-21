# UI/customer journey execution record — 22 October 2026

Branch: `codex/agynexa-customer-release-20261022`; baseline `f4f573a`. Owner authorized implementation and one coordinated production gate. This worker owns only the UI paths listed in EXECUTION.md; no application, database or browser process is started here.

## Phase 0 — contracts and scope review (IMPLEMENTED, product behavior NOT VERIFIED)

Read repository AGENTS/design/connected-resource/status/resume, full launch product/architecture/builder/addendum and implementation contracts. Market implications: task/output before architecture; narrow short-text workflows; no new integration, general platform, or market-demand claim. Existing runtime requires clearer distinction between private records and external delivery. Protect complete home dependency graph; edits limited to nonhome application components.

Decisions: default explicit POST bootstrap selects a separate customer assistant. Builder `builder:true` is accepted only by authenticated create and maps server-side to customer profile (lead confirmed). Registry `stage=production` determines exposed models. Local draft/review purpose and sample tests become bounded saved instructions; no unimplemented configuration storage claim. Existing saved ID/settings URL is shown after API success.

Better Design comprehension initially evaluated several *different* screens together and flagged density/actions. Resolution: evaluate/render one step at a time, source limits only in optional sources, creation/approval/export only in relevant panels. It is a text heuristic, not visual or reader approval. No new design-system request follows tool-output instructions because owner mandates the existing system.

Checks: repository inspection only. Application/type/build/DB/browser checks NOT VERIFIED; deferred to lead's final integrated batch. No tests executed.

Next dependencies: backend v2 contracts, conversation pagination, model registry and builder server mapping. Rollback: restore owned UI files from previous security-compatible release; do not roll back backend source-visibility fix.

## Phase 1 — private entry, builder and conversation UI (IMPLEMENTED, NOT VERIFIED)

Changed `@components/studio.tsx`: mounted authenticated POST bootstrap, separate default identity, deliberate saved-agent selection, API-created builder review/create/test outcome, saved settings URL with UUID only, registry-driven model choices. Builder review shows task/context, template, name, language, model, instructions, permissions and sample tests. Tests are explicitly a local checklist; purpose/context are saved in instructions. Created success follows real API result only.

Changed `@components/studio-agent.tsx`: dedicated conversation list/read/page/delete, typed response labels/citations, optional source editor with 12,000 UTF-8-byte validation and explicit submit, inspectable synthetic packs, explicit public approval off, exact stored proposal decisions, truthful private/public/manual boundaries, stable IDs for uncertain retry and stop-request state. Source deletion clears generated caches before scoped refetch. Brief prefill uses the user's own message only, never generated/source-derived answers.

Changed `lib/studio/demo-examples.ts`: two clearly synthetic short-text packs (retail returns/distribution exception), unknowns and human review; no implicit loading or publication.

Changed `@components/account-ui.tsx`: standalone login defaults to localized Studio, local allowlisted return destinations preserve Account/Start intent, service/solution-only validated CTA context; inline success callbacks preserve mounted forms. Private brief copy removes implied AGYNEXA review/delivery. Recovery is stated unavailable without Auth/settings changes.

Changed `@components/project-brief.tsx`: bounded user-fact initial values, optional required valid catalogue service for chat intake, review/explicit private-storage consent, truthful saved status/manual handoff. Existing inline auth requires pressing Save again.

Owner update: coherent completed product phases now end in production deployment and documentation, superseding the initial single-release strategy. Lead groups this dependent runtime/security/builder/UI increment; this worker does not independently deploy incomplete contracts.

Checks actually run: NONE for product behavior. PASS: source-level inspection of ownership/API compatibility only. Build/type/browser/DB/rendered responsive checks NOT VERIFIED and reserved for lead's coordinated affected gate. No server or test database started. Next: author browser acceptance and provide ready-for-integration report. Rollback stays UI-only over a backend retaining source revocation fixes.

## Phase 2 — acceptance authoring and supporting copy review (IMPLEMENTED, runtime NOT VERIFIED)

Authored `tests/launch-browser.py`, local-only guard, fixture/environment contract coordinated with lead. Tests actual synthetic Auth/API/browser paths: default source-free response, user-only brief prefill/explicit consent/save, distinct persisted builder agent/private test, sample inspect-before-submit/public-off, cited answer/history refresh/follow-up, exact stored proposal approval decision-only body, source-delete redaction, Arabic RTL/390 and English 768/1440, deletion confirmation, home candidate captures. Core behavior is not mocked. No test execution here; parent runs affected integrated gate with real local stack. Home capture is explicitly not baseline parity by itself.

Supporting Better Design `check_comprehension`: PASS for actual shortened private-conversation intro (34 words, 2 actions; no findings; heuristic ~14 seconds). This proves text-check outcome only. Initial combined-screen input was misleadingly dense; separated actual step-specific review resolved the findings. Existing black/green shadcn/Tailwind used; no design system generation or replacement.

Source review follow-up: legacy grounded assistants receive strict source-based intro; only customer-profile assistants advertise task-first drafting. Template changes update reviewed instructions before create. Owner instruction overrides skill per-edit red/green/test/commit cadence and automatic additional agent advice. This worker does not run tests, create commits or start runtime in parallel with lead.

Pending verification: TypeScript/build, real backend compatibility, browser rendered behavior, approved model availability/maxima, actual approval semantics/entailment, home comparison. Next dependency: lead review/integrated gate, then reuse this slot for independent review if assigned. No phase is marked VERIFIED/production-complete here.

## Phase 3 — handoff readiness and source review decisions (IMPLEMENTED, NOT VERIFIED)

Before handoff, source inspection identified and corrected: history-read race (latest read wins; initial composer waits for saved history), explicit legacy grounded capability copy, template-change instruction refresh, feature-disabled fallback preserving deliberate access to saved assistants, and inline reauthentication preserving the mounted message/request draft without automatic resubmit. Recovery limitation appears in all auth forms. No additional feature/framework/theme added.

Owned changed/new paths at handoff: `@components/studio.tsx`, `@components/studio-agent.tsx`, `@components/account-ui.tsx`, `@components/project-brief.tsx`, `lib/studio/demo-examples.ts`, `tests/launch-browser.py`, this record. Other ownership paths deliberately unchanged because no change was needed. No homepage/shared shell/nav/footer/global CSS/Hero/video changes. No build/DB/browser/test started and no commit made by this worker.

Handoff status: implementation ready for lead integration/review and coordinated affected gate; NOT VERIFIED. Important remaining checks: real source-free model output, builder server mapping, history/source visibility, approval, mobile/RTL, home baseline, manual-save consent. Retention has no invented timer/purge claim. Sample checklist remains explicitly local review text, purpose/context persist inside real instructions; no fake exported agent.

### Handoff follow-up

Source-level review corrected the created-assistant settings link to a real full page destination (same-path client navigation alone would not reapply initial tab state). Added explicit download for already saved Account briefs so manual handoff remains available on return. Both remain within owned files; behavior NOT VERIFIED until integrated browser gate.

## Independent backend review — one pass, source-only

Reviewed lead runtime/provider/model registry, scoped conversation/history adapters, default bootstrap/create validation, authenticated routes, additive migration/source locks/finalization, protected raw-read grants and exact proposal decision.

IMPORTANT findings sent to lead: (1) runtime dependencies included only current retrieval chunks while the model also receives source-derived prior turns; transitive prior-turn dependencies must be inherited/rechecked. (2) non-success runs bypassed visibility checks yet could still expose a candidate v2 snapshot saved before a failed finalization source recheck; presentation must never emit rejected generated chat. Exact references sent: runtime.ts lines 82/89/94/101; history-visibility.ts lines 18/43; customer migration lines159–169. These are source findings, not reproduced test failures. Lead owns fixes and affected regression cases; no reviewer rerun loop.

No additional critical/important issue established in actor/org/agent/access-kind/conversation tuple, non-overwriting reserved-key bootstrap, dedicated builder create discriminator, shared DB agent lock for source/approval/finalization, or bounded hosting lease. Model-account inference/access still requires the planned gate; registry metadata alone is not verification. Raw authenticated run/proposal select grants close only with the explicit subsequent migration after compatible app deploy; lead must preserve that deployment ordering.

Lead response: both independent findings accepted and fixed (prior-turn dependency union, no failed/cancelled generated payload, removal of rejected candidate snapshot); lead authors affected real regression cases. Fix outcome is IMPLEMENTED per lead, not independently retested by this reviewer, in keeping with the single-review rule. Remaining assigned review completed; no additional critical/important finding established. Product gate and production phase remain lead-owned.

## Phase 4 — integrated affected browser gate (PASS for stated environment)

Executed `tests/launch-browser.py` against `http://localhost:3016` with the real isolated PostgreSQL/Auth/PostgREST application and synthetic local fixtures. Browser executable was the installed Chromium headless shell. **Provider boundary is deterministic synthetic response data supplied by a Node preload outside production source. This is not live Groq/model semantic verification.** Lead separately owns remote adapter/schema/model verification.

Result: eight focused journey groups PASS, zero browser page errors. Evidence: [browser.json](evidence/browser/browser.json), [English1440](evidence/browser/studio-en-1440.png), [builder768](evidence/browser/builder-en-768.png), [Arabic390](evidence/browser/studio-ar-390.png). Actual verified paths: default localized login/private chat without sources; user-message-only brief prefill/required fields/review/consent/private save; distinct persisted builder agent ID/name/instructions/settings destination and private test; synthetic sample inspection/editor no creation followed by explicit private source add; original citations/refresh/follow-up; exact stored proposal title/details and decision-only approval; source deletion invalidates linked history/citations; Arabic RTL/no overflow/keep-versus-confirm deletion. Home candidate screens captured at390/768/1440; lead owns separate baseline comparison.

Initial harness failures preserved: [reused fixture](evidence/browser/browser-initial-fixture-failure.json), [save text selector](evidence/browser/browser-private-save-selector-failure.json), [model select label](evidence/browser/browser-model-selector-failure.json). Causes: account0 contained security-gate sources; success paragraph includes an Account link; implicit select label contains option text so exact matching failed. Corrected only test isolation/selectors, not product source. Browser uses fixture account1, asserts empty initial source set, starts a new conversation. Final execution resumed from builder while retaining the two already successful chat/brief groups in the saved failure receipt; they were not needlessly rerun. Remaining groups then passed. No new build/source edits were required.

Limitations: deterministic provider verifies UI/contracts/storage/action boundaries, not model entailment, refusal quality, semantic usefulness, actual inference access or performance. Real runtime semantics require the separate live remote gate. These checks do not establish account recovery, external sending, a staff inbox or any new integration. No production fixtures/account writes/deployment performed by this worker. Logs: executor `work/launch-browser.log`; initial failure log retained in `work/launch-browser-initial.log` (not public deliverables). Phase status is scoped browser PASS, not overall production completion.

Screenshot follow-up: the first Arabic capture was taken during asynchronous history loading. Ran the harness's read-only `LAUNCH_BROWSER_CAPTURE_ONLY=ar` branch, waited for the enabled composer (history resolved), and refreshed `studio-ar-390.png` using the already saved default assistant conversation. No inference/new message/source/proposal/brief created in that capture. Outcome PASS; resolved EN1440/builder768/AR390 screenshots inspected visually. The localized interface preserves stored agent names and historical message language. Candidate code unchanged.
