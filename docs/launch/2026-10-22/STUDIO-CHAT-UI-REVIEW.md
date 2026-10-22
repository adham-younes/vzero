# Studio dedicated chat — local corrective candidate, 22 October 2026

**REVIEWED CANDIDATE — OWNER APPROVED FOR STUDIO UI RELEASE.** Production remains PR41 source `366ca1075809a2d01a0d2fdb643d199740bf43e1`. HEAD remains the existing post-release receipt `859dc64`; all routing/UI work is uncommitted and unpushed. The owner rejected the prior nested marketing/dashboard composition. Earlier functional checks did not establish acceptance of that design.

The authoritative EchoAI screenshot was visually inspected before implementation, along with the actual rejected production screenshot. The target is its spatial composition using AGYNEXA's existing approved tokens. This is a real local Next/React implementation, with controlled synthetic HTTP profile/history/response fixtures for visual testing. It is not a screenshot of live production data or new authenticated end-to-end delivery proof.

## Reference lock and decisions

| Decision | Authority | Implementation |
| --- | --- | --- |
| Dedicated full-height application canvas | Owner's exact EchoAI screenshot and latest correction | `/studio` and `/ar/studio` bypass only marketing header/footer; one100dvh chat app |
| Narrow navigation + broad central welcome | Screenshot | 232px desktop sidebar; new chat, recent saved conversations, compact Workspace menu and actual account link |
| Bottom anchored composer | Screenshot | Bounded-width composer inside the full-height main flex column; compact model/source/send controls; messages scroll independently |
| Black/emerald only | Current `DESIGN.md` and `app/globals.css` | Token variables `--background`, `--card`, `--foreground`, `--primary`; computed #050505/#10B981 confirmed. No purple, independent green or new global theme |
| One interface language per route | Explicit owner correction | English on `/studio`, Arabic/RTL on `/ar/studio`; model labels use locale-aware presentation rather than upstream English labels |
| Preserve user-authored content | Explicit owner constraint | Agent/account names and message text remain server-provided; no translation or rewriting of user data |
| Compact management without losing capabilities | Owner correction + existing contracts | Assistant menu: sources/settings/publication/activity/comparison/deletion. Workspace menu: create/saved assistants/projects/reviews. Per-response actions behind one ellipsis menu |
| Truthful account/control presentation | Owner constraint | Profile fetched through existing verified `/api/account`; neutral Account fallback, no fabricated person. Paperclip opens actual approved text-source management; no fake microphone/image/music/community/subscription controls |

Refero's reference-lock/visual-QA workflow was applied to the user-supplied target. No unrelated style research or variant exploration was added. The single reference's purple decoration and unsupported features were excluded under the owner's explicit constraints.

## Changed application files

- `@components/agynexa-shell.tsx`: one conditional for normalized `/studio` only, retaining its language provider. Marketing rendering for every other page stays intact.
- `@components/studio.tsx`: removes the nested marketing-style headings; retrieves the legitimate profile in the existing parallel bootstrap; passes the dedicated workspace presentation for selected assistants; compact creation notice; localized model labels.
- `@components/studio-agent.tsx`: retains chat/API/state/retry/cancel/history/source/publish/approval engine; adds dedicated presentation. Shared management markup is reused. Mobile navigation, keyboard Escape and deletion confirmation focus handling are included. Exact reviewed actions still use the existing callbacks.
- `@components/studio-chat.module.css`: isolated layout/styles and responsive rules using existing tokens. Mobile controls have44px targets. No global CSS edits.
- `@components/studio-work.tsx`: review-version label and saved review/activity dates respect the route locale; exact stored payload/hash/apply semantics unchanged.
- `tests/studio-ui-reference-review.py`: bounded actual-browser visual/interaction harness with synthetic API-boundary data.

The original homepage, Hero component files, video, global CSS, English homepage file and `DESIGN.md` have identical before/after SHA256 values. [Protection receipt](evidence/studio-ui-review/protected-files.json). The original architect/master plan is unchanged.

## Actual screenshots and comparison

The user-facing output packet contains the unchanged EchoAI reference and an unmodified pre-correction production screenshot, plus the following final local images:

- [English desktop welcome](evidence/studio-ui-review/en-desktop-welcome.png),1440×1000.
- [Arabic desktop welcome](evidence/studio-ui-review/ar-desktop-welcome.png),1440×1000.
- [English mobile welcome](evidence/studio-ui-review/en-mobile-welcome.png),390×844.
- [Arabic mobile welcome](evidence/studio-ui-review/ar-mobile-welcome.png),390×844.
- [English conversation](evidence/studio-ui-review/en-desktop-conversation.png), [Arabic conversation](evidence/studio-ui-review/ar-desktop-conversation.png).
- [Exact saved-action review](evidence/studio-ui-review/en-desktop-exact-review.png).

All four final viewport/locale screens were visually inspected against the reference: one sidebar, dominant central canvas, restrained three useful starters, compact anchored composer and no nested marketing header/breadcrumb/title/tab stack. Arabic mirrors the sidebar and controls for RTL. It is a faithful composition adaptation, not a claim of pixel-identical artwork or feature parity with EchoAI. Fictional profiles/history in these test images are explicitly synthetic; the product code obtains real profile data from the protected account API.

## Checks and limits

[Verification receipt](evidence/studio-ui-review/verification.json): optimized local build PASS; strict TypeScript PASS, including the final review-label/date-only localization;15 targeted browser groups PASS across both locales and desktop/mobile. These cover route-local shell removal, computed tokens, no document overflow, composer bounds, localized model labels, mobile navigation, sending/history refresh, unintrusive response actions, source-management/back-to-chat, and typed assistant intent → exact stored-payload review → exact version/hash apply callback → returned assistant (HTTP fixture). No browser runtime errors.

Two additional read-only local homepage render checks retained marketing header/footer/video on English/Arabic home. The changed shell is one route-specific branch. Prior valid backend/RLS/approval tests are retained, not rerun or falsely relabeled as new proof. No new model evaluation, production account, real mail or database mutation. This local UI review does not establish a fresh real Auth/DB flow, real mobile keyboard behavior, all landscape/zoom states, or universal model comprehension.

## MagicPath result

The owner explicitly requested MagicPath. One production MCP `create_project` call was attempted for `AGYNEXA Studio Chat Review`. It returned **`EXTERNAL_AGENT_API_QUOTA_EXCEEDED`**, limit50/used50. No project ID, component ID, revision ID, preview or canvas was created/opened. No repeated calls, upgrade, purchase, beta CLI or workaround was used. [Exact sanitized blocker](evidence/studio-ui-review/magicpath-status.json). These images come from the real local app, not a MagicPath artifact. A MagicPath canvas cannot be truthfully supplied while this quota block remains.

## Review boundary and next work

Owner explicitly approved this displayed Studio composition and said نعم-نفذ. That approval authorizes this Studio UI release only. The independent NEXA inbound-routing candidate, its tests and sample config remain local and unpublished pending separate routing review. Personal Spacemail, apex MX, provider/webhook/env settings and send/receive/auto-send OFF states were untouched.

After owner approval, perform the smallest affected release checks and an existing-owner real Auth flow before publication claims. Do not rerun the original broad suites or change the full program scope. Rollback before any release is a scoped restoration of these uncommitted UI changes, keeping the separately preserved routing checkpoint and post-PR41 documents; production needs no rollback now.

Final bounded cleanup: the review Version label/date formatting was localized after the layout build; strict TypeScript was checked, without rerunning the unchanged browser suite or build solely for that copy-only follow-up. The owned preview server is stopped (last local URL `http://127.0.0.1:3033`); no stack or helper is running.


Release approval and final evidence are tracked in [Studio UI release](STUDIO-CHAT-UI-RELEASE.md). The original local review images and scoped test limits above remain historical evidence.
