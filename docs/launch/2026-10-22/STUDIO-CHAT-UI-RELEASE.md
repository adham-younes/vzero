# Reviewed Studio UI release — 22 October 2026

Status: DEPLOYED / OWNER-APPROVED COMPOSITION / SCOPED LIVE VERIFICATION PASS. The owner explicitly approved the displayed dedicated chat distribution and said نعم-نفذ. Approval covers that exact UI composition; NEXA routing/DNS/provider/mailbox/webhook/environment changes and real mail sends remain excluded. The independent local routing candidate is snapshotted and held unpublished.

## Result and scope

`/studio` and `/ar/studio` become full-height private chat screens. One compact sidebar, a broad central chat/welcome area and a bottom composer replace the nested marketing header/breadcrumb/heading/tab stack. Sources, settings, publication, history, projects and exact reviewed actions remain accessible through compact menus. Locale-aware interface/model labels use English or Arabic/RTL by route, while user-authored names/messages are retained. Profile data comes from the existing verified Account API. Only existing black/emerald tokens are used.

Application scope: `@components/agynexa-shell.tsx` (one Studio-only bypass), `studio.tsx`, `studio-agent.tsx`, `studio-work.tsx` (review label/date localization) and new `studio-chat.module.css`. The existing runtime/API/RLS/approval contracts remain unchanged. Global CSS, homepage, Hero/video, public copy, full architect/master plans and all mail transport settings are protected. The post-PR41 receipt commit `859dc64` accompanies this necessary product release.

## Reused verification

[Reviewed candidate](STUDIO-CHAT-UI-REVIEW.md) contains actual EN/AR desktop1440×1000 and mobile390×844 screenshots. Optimized local build, strict TypeScript and15 targeted real-browser groups passed. Browser API data were synthetic; they do not claim real Auth/DB/model verification. The final review-label/date-only follow-up passed strict TypeScript without repeating unchanged browser checks/build solely for copy. Protected source hashes and two local EN/AR homepage shell/video checks passed. Prior backend security evidence remains scoped historical evidence.

MagicPath project creation was blocked by provider quota50/50; no remote project/component/canvas exists. Owner approved the actual local app images after that limitation was disclosed. No attempt to retry/upgrade/work around quota.

## Production gate

Completed: [PR42](https://github.com/adham-younes/vzero/pull/42), reviewed implementation `03ec51b5dfd46421250bbed2c071980b160325cf`, merged source `25b89709c3a65ef499c998a179ce3f2ef30deaad`, deployment `dpl_9LoGYjBSSzjj3A1Lt14xSeypnPCG` READY. Exact source and official `agynexa.si`/`www.agynexa.si` plus legacy alias matched. Preview and production builds passed. No manual duplicate deployment.

[Live Auth/UI receipt](evidence/studio-ui-release/auth-ui.json): actual existing-owner session loaded the dedicated English screen and prior history; a new controlled identity/capability message completed through real Auth/API/persistence. Switching to Arabic preserved the same conversation; Arabic labels/model options/RTL layout and hard-reload persistence passed. This product-authored identity response did not call a model; no new Groq benchmark was needed for a UI-only release. Actual production screenshots stay in the owner's local output packet to avoid publishing profile/history.

[Public route receipt](evidence/studio-ui-release/public-http.json): four normal-HTTPS route checks passed. Studio EN/AR have no marketing header/footer and remain noindex. English/Arabic home retain header/footer/video autoplay attributes without controls. Protected source hashes unchanged; this is not a newly repeated full playback/browser suite.

[Scope receipt](evidence/studio-ui-release/scope.json): released mail source blobs exactly match PR41. The local routing/config/test/docs candidate was excluded. No new production fixture accounts, real mail, DNS, mailbox/provider/webhook/environment changes, or unrelated tenant/message-body reads. [Deployment receipt](evidence/studio-ui-release/deployment.json).

The existing local optimized-build/types/15 focused browser groups and security evidence were reused at their original scope. Production authenticated mobile was not newly exercised; accepted local390px EN/AR evidence remains valid for unchanged layout CSS.

## Rollback and remaining boundaries

Prior production: PR41 source `366ca1075809a2d01a0d2fdb643d199740bf43e1`, deployment `dpl_94pFxJSmfXB98pEu4puYELDjx8ow`. Revert this UI commit or roll back to that compatible deployment if the affected flow fails; preserve saved data/audit and additive DB schema. This release performs no migration or environment change. NEXA receive/send/auto-send remain OFF. Separate routing/config/tests/docs stay local and require review; personal Spacemail, aliases/forwarding and apex MX remain unchanged.


Final delivery receipt is committed locally and appended to the merged PR description; no documentation-only push/deployment. Pending local NEXA work remains independent. One owned controlled verification conversation is retained; no records were deleted.
