# AGYNEXA repository working instructions

Documentation is a delivery requirement explicitly requested by the owner. Start with `docs/agynexa-program/README.md`, `STATUS.json`, and `RESUME.md` before continuing work. Read `BACKLOG.md` for unimplemented work. Current direct user instructions take precedence over historical plan constraints; record material changes in `DECISIONS.md`.

- Preserve the original video and both Hero component files. A previous scoped CSS color/overlay correction is not permission to redesign the Hero.
- Preserve the AGYNEXA identity, approved bilingual content, ten services and nine solutions unless the owner requests a change. `DESIGN.md` describes the design contract.
- Follow actual aliases in `tsconfig.json`: active UI components are under `@components/` and `@ui/`.
- Distinguish `IMPLEMENTED`, `VERIFIED`, `SPECIFIED`, `REQUIRES_ACCESS`, and `BLOCKED`. The public site has two small APIs; it is not a connected enterprise agent platform.
- Use saved public reference research. Re-fetch only a specific missing or outdated item that affects the work.
- No secrets, customer data, private account output, dependencies or build artifacts in this public repository.
- Do not change external accounts, databases, paid services, protection settings or send messages without applicable authorization.
- Use proportionate verification. Documentation-only changes require document validation and `git diff --check`, not application build/lint/test. Product changes need checks appropriate to the affected behavior; do not claim checks that were not run.
- Update current status, stage/backlog entries, affected technical/API/route documentation, and a release/evidence record in the same delivery. Keep historical receipts dated, and separate the product release from documentation commits.
- Store shareable evidence in the repository with relative links and environment/commit labels. Do not leave the only evidence in a local task output folder.
- Follow `docs/agynexa-program/WORKFLOW.md` for Git, production verification and rollback. A successful build or HTTP 200 does not establish interactive correctness.
