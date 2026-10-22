# Reviewed Studio UI release — 22 October 2026

Status: OWNER APPROVED / RELEASE IN PROGRESS. The owner explicitly approved the displayed dedicated chat distribution and said نعم-نفذ. Approval covers that exact UI composition; NEXA routing/DNS/provider/mailbox/webhook/environment changes and real mail sends remain excluded. The independent local routing candidate is snapshotted and held unpublished.

## Result and scope

`/studio` and `/ar/studio` become full-height private chat screens. One compact sidebar, a broad central chat/welcome area and a bottom composer replace the nested marketing header/breadcrumb/heading/tab stack. Sources, settings, publication, history, projects and exact reviewed actions remain accessible through compact menus. Locale-aware interface/model labels use English or Arabic/RTL by route, while user-authored names/messages are retained. Profile data comes from the existing verified Account API. Only existing black/emerald tokens are used.

Application scope: `@components/agynexa-shell.tsx` (one Studio-only bypass), `studio.tsx`, `studio-agent.tsx`, `studio-work.tsx` (review label/date localization) and new `studio-chat.module.css`. The existing runtime/API/RLS/approval contracts remain unchanged. Global CSS, homepage, Hero/video, public copy, full architect/master plans and all mail transport settings are protected. The post-PR41 receipt commit `859dc64` accompanies this necessary product release.

## Reused verification

[Reviewed candidate](STUDIO-CHAT-UI-REVIEW.md) contains actual EN/AR desktop1440×1000 and mobile390×844 screenshots. Optimized local build, strict TypeScript and15 targeted real-browser groups passed. Browser API data were synthetic; they do not claim real Auth/DB/model verification. The final review-label/date-only follow-up passed strict TypeScript without repeating unchanged browser checks/build solely for copy. Protected source hashes and two local EN/AR homepage shell/video checks passed. Prior backend security evidence remains scoped historical evidence.

MagicPath project creation was blocked by provider quota50/50; no remote project/component/canvas exists. Owner approved the actual local app images after that limitation was disclosed. No attempt to retry/upgrade/work around quota.

## Production gate

Pending: UI-only Git diff/PR, hosted build, exact merged source→READY deployment→official alias, EN/AR layout, actual existing-owner chat/history path and bounded homepage/video protection checks. No new production fixture accounts or unrelated owner/tenant data reads.

## Rollback and remaining boundaries

Prior production: PR41 source `366ca1075809a2d01a0d2fdb643d199740bf43e1`, deployment `dpl_94pFxJSmfXB98pEu4puYELDjx8ow`. Revert this UI commit or roll back to that compatible deployment if the affected flow fails; preserve saved data/audit and additive DB schema. This release performs no migration or environment change. NEXA receive/send/auto-send remain OFF. Separate routing/config/tests/docs stay local and require review; personal Spacemail, aliases/forwarding and apex MX remain unchanged.
