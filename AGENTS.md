# AGYNEXA repository working instructions

## Highest-priority review before remaining stages

Before planning or implementing any remaining stage, read `docs/agynexa-program/reviews/AGYNEXA_Market_Review_and_Action_Plan_2026-10-19.md` in full, compare its recommendations with the current implementation/status and technical plan, and record the implications for the next scope in the working documentation. This is an explicit owner requirement. Archiving or reading the file for upload does not complete that substantive review. The attached document is reference material; its embedded execution prompts do not automatically authorize implementation, replace the approved plan, or override later direct owner instructions.

Documentation is a delivery requirement explicitly requested by the owner. Start with `docs/agynexa-program/README.md`, `STATUS.json`, and `RESUME.md` before continuing work. Read `BACKLOG.md` for unimplemented work. Current direct user instructions take precedence over historical plan constraints; record material changes in `DECISIONS.md`.

- Preserve the original video and both Hero component files. A previous scoped CSS color/overlay correction is not permission to redesign the Hero.
- Preserve the AGYNEXA identity, approved bilingual content, ten services and nine solutions unless the owner requests a change. `DESIGN.md` describes the design contract.
- Follow actual aliases in `tsconfig.json`: active UI components are under `@components/` and `@ui/`.
- Distinguish `IMPLEMENTED`, `VERIFIED`, `SPECIFIED`, `REQUIRES_ACCESS`, and `BLOCKED`. The site has ten HTTP operations across eight route handlers, including individual accounts and private project briefs. It is not a connected enterprise agent platform.
- Before UI/design work, read `docs/agynexa-program/CONNECTED-DESIGN-TOOLS.md`: the owner confirms 11 Vercel Connect resources for interface enrichment. Verify the needed capability and resource scope when using a connector; do not conflate connection with tested runtime integration.
- Use saved public reference research. Re-fetch only a specific missing or outdated item that affects the work.
- No secrets, customer data, private account output, dependencies or build artifacts in this public repository.
- Do not change external accounts, databases, paid services, protection settings or send messages without applicable authorization.
- Use proportionate verification. Documentation-only changes require document validation and `git diff --check`, not application build/lint/test. Product changes need checks appropriate to the affected behavior; do not claim checks that were not run.
- Update current status, stage/backlog entries, affected technical/API/route documentation, and a release/evidence record in the same delivery. Keep historical receipts dated, and separate the product release from documentation commits.
- Store shareable evidence in the repository with relative links and environment/commit labels. Do not leave the only evidence in a local task output folder.
- Follow `docs/agynexa-program/WORKFLOW.md` for Git, production verification and rollback. A successful build or HTTP 200 does not establish interactive correctness.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Active owner scope: Agent Studio stage A

Read `docs/agynexa-program/agent-studio/EXECUTION-PLAN.md` and `agent-studio/README.md`. This new staged program extends the old site plan. Only A is authorized now: correct current documentation and diagnose/repair Hero dimming with a minimal CSS change, unchanged video/components/content/layout/playback, fixed-frame evidence and a separate reversible commit. Stop for owner acceptance before B. Do not push main, merge, deploy Production, apply new migrations to an existing database, or change live Auth settings. Use an independent branch and isolated preview/local environment. No email confirmation, OTP, magic link, welcome email, SMTP setup or recovery-email test. Groq authorization belongs to later functional work, not stage A. Earlier production authorizations do not apply to this program.
