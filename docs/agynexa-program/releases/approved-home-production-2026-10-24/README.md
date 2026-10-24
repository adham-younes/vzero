# Approved homepage and Studio alignment — production release

Status at source merge: OWNER_AUTHORIZED / LOCAL_VERIFICATION_PASS / AWAITING_MATCHING_PRODUCTION_RECEIPT. The owner explicitly requested production publication after approving the homepage draft. Final deployment metadata is recorded separately after release; the earlier global Preview receipt is historical.

## Scope

Publish the [reviewed global bilingual content](../global-content-preview-2026-10-24/README.md), with the replacement [Arabic homepage](HOME-AR.md) and independently authored [English homepage](HOME-EN.md). The homepage explains Studio's contribution, six stages of agent-system design, a clearly illustrative logistics workflow, sector problems/outcomes, company knowledge and human decisions. It retains the prerequisite distinction for coordination, external connections and permitted actions. No automatic whole-system generation or enterprise execution claim is added.

Homepage presentation uses existing typography, split sections, timeline, diagram and table. Six H3 steps remain under one H2. There is one closing Studio action; the duplicate knowledge-oriented closing and compact capability cards are removed from this page.

Studio retains the [owner-approved dedicated chat design](../../../launch/2026-10-22/STUDIO-CHAT-UI-RELEASE.md). Welcome, suggestions, composer and builder labels now describe business agent roles. Saved user names/instructions are not renamed. Studio CSS and all non-string AST nodes in its two changed components remain unchanged. No API/Auth/model policy, database, approval contract, mail behavior, dependencies, video component or video asset is changed.

## Verification

- Optimized Next build and TypeScript passed. The first build completed compilation/type generation and stopped at the existing Next.js 16.4.0 security-upgrade reminder; one normal retry exited 0. Upgrade remains recommended and is outside this copy/UI release.
- Document validator passed, including local file links, JSON, the 68 canonical URLs and the 53-operation source inventory. This is document/source inventory, not runtime acceptance.
- Existing `tests/studio-workspace-ui.cjs` passed: bilingual explicit/negated intent, exact apply snapshot, hostile text escaping, double-click guard and result callback. No live Auth, database or model call.
- [Actual local browser evidence](evidence/local-browser.json): Arabic390×844 and English1440×1000 home/Studio samples, no horizontal overflow, six subordinate steps, correct locale switch and one ending action. Video was playing automatically without controls.
- Studio browser uses a synthetic local API boundary, not production account data: suggestion prefill, builder entry, role/context review and save-proposal screen were exercised. The proposal was not applied. This establishes UI wiring only.
- [Source equivalence](evidence/source-check.json) and [protected source hashes](evidence/protected-source.json) preserve runtime/Studio CSS/video boundaries.
- [Fresh independent review](REVIEW.md) found no important or critical issue. The minor saved-agent terminology inconsistency was corrected as part of the authorized Studio text alignment; handlers and contracts remain unchanged.

Unchanged public-page/route evidence from the accepted global Preview is reused at its original scope. No new test account, provider inference, payment, integration acceptance, production saved-data write or mail send is part of this delivery.

## Release and rollback

Release through the existing Git integration: reviewed branch, attached PR, authorized merge to main, then verify the matching production build and aliases. Do not create a second manual deployment if the Git build exists. Prior verified production baseline: main `857356acc12b736ee1874cc21fa298690d98164a`, deployment `dpl_5aS1czntiDqv99dTReWRhc1hLNWy`, official alias agynexa.si.

If the affected public/Studio entry presentation fails, restore a compatible deployment or revert this content/UI source. Preserve all saved data and the additive database schema. No domain, protection, environment or provider change is required by this release.
