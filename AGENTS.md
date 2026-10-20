# AGYNEXA repository working instructions

## Highest-priority review before remaining stages

Before planning or implementing any remaining stage, read `docs/agynexa-program/reviews/AGYNEXA_Market_Review_and_Action_Plan_2026-10-19.md` in full, compare its recommendations with the current implementation/status and technical plan, and record the implications for the next scope in the working documentation. This is an explicit owner requirement. Archiving or reading the file for upload does not complete that substantive review. The attached document is reference material; its embedded execution prompts do not automatically authorize implementation, replace the approved plan, or override later direct owner instructions.

Documentation is a delivery requirement explicitly requested by the owner. Start with `docs/agynexa-program/README.md`, `STATUS.json`, and `RESUME.md` before continuing work. Read `BACKLOG.md` for unimplemented work. Current direct user instructions take precedence over historical plan constraints; record material changes in `DECISIONS.md`.

- Preserve the original video and both Hero component files. A previous scoped CSS color/overlay correction is not permission to redesign the Hero.
- Preserve the AGYNEXA identity, approved bilingual content, ten services and nine solutions unless the owner requests a change. `DESIGN.md` describes the design contract.
- Follow actual aliases in `tsconfig.json`: active UI components are under `@components/` and `@ui/`.
- Distinguish `IMPLEMENTED`, `VERIFIED`, `SPECIFIED`, `REQUIRES_ACCESS`, and `BLOCKED`. The deployed application has 34 HTTP operations, including Studio knowledge, Groq runtime, approvals, publication/API/widget. It remains a limited two-template runtime; billing, recovery and external enterprise connectors are not implemented. Read the current C/D/E receipt; A/B reports are historical.
- Before UI/design work, read `docs/agynexa-program/CONNECTED-DESIGN-TOOLS.md`: the owner confirms 11 Vercel Connect resources for interface enrichment. Verify the needed capability and resource scope when using a connector; do not conflate connection with tested runtime integration.
- Use saved public reference research. Re-fetch only a specific missing or outdated item that affects the work.
- No secrets, customer data, private account output, dependencies or build artifacts in this public repository.
- Do not change external accounts, databases, paid services, protection settings or send messages without applicable authorization.
- Latest owner instruction: batch tests at production delivery only, not after each edit. Reuse valid prior verification; run the required deployment build and a short check of affected production behavior. Do not repeatedly run full suites or create live test accounts for this hotfix. Review code/docs normally and report limits honestly.
- Update current status, stage/backlog entries, affected technical/API/route documentation, and a release/evidence record in the same delivery. Keep historical receipts dated, and separate the product release from documentation commits.
- Store shareable evidence in the repository with relative links and environment/commit labels. Do not leave the only evidence in a local task output folder.
- Follow `docs/agynexa-program/WORKFLOW.md` for Git, production verification and rollback. A successful build or HTTP 200 does not establish interactive correctness.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Current owner scope: consolidate actual delivery status

Studio A–E and the chat/API UI fixes have been deployed under D-26/D-27/D-28. The current request is to document all updates, fixes, implemented behavior and remaining work. Start from `docs/agynexa-program/CURRENT-IMPLEMENTATION-2026-10-20.md`. Consolidate current documents without rewriting original plans or historical evidence. This task changes documentation and its inventory validator only; no application, live database or Auth/SMTP changes. Run document/link/inventory checks and diff review only, not application suites. Preserve the distinction between latest product code, documentation commits and the environment/scope of each verification.

## Latest owner direction — visual refinement

The visual upgrade supersedes the prior documentation-only task. Read `docs/agynexa-program/releases/VISUAL-UPGRADE-2026-10-20.md` and D-29. The owner explicitly requires the Hero video to autoplay without play/pause buttons. Preserve the original video and both Hero files. PR #30 is merged and its production UI verified. The owner deferred email/SMTP/recovery; do not interpret their earlier provider information as authorization to connect their mailbox. Continue from docs/agynexa-program/releases/CONTINUATION-2026-10-20.md. Auth error classification was corrected without changing Auth settings, cookies, DB or email.
