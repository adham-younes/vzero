# Owner-approved visual upgrade — 20 October 2026

Baseline: `main@063fc2e`. The owner approved the visual-audit recommendations and explicitly requested a larger AGYNEXA wordmark, a smaller AR/EN switch, consistent typography/text colors and symmetrical page spacing.

The complete market review (452 lines) was read against current STATUS, BACKLOG and TECHNICAL-PLAN before implementation. The current product already includes accounts, saved briefs and Studio A–E; the market review predates those features. Preserve them rather than recreating a speculative platform.

Adopt: preserve black/emerald identity and bilingual copy; make the example easy to reach; show outcomes and required inputs; improve form guidance and explicit review/sharing; use shared spacing/type tokens, readable Arabic and keyboard states. Preserve the original video and both Hero component files; the approved readability overlay is implemented in shared CSS; the owner subsequently explicitly required continuous autoplay with no play/pause controls. Add a labeled illustrative task/review/output journey to AgentNexOS, linked to the existing Studio.

Scope: shared header/navigation/footer, breadcrumbs, typography and controls, home explanation, procurement status, project-brief form/review, account password visibility and saved-brief details. Validate representative desktop/mobile Arabic/English once after the combined changes, then build and prepare a reviewable PR/Preview.

Dependencies: password recovery needs an approved email-delivery and verified-ownership policy because accounts currently open without email verification. No Auth/SMTP configuration, mail delivery or database migration is authorized by a visual upgrade. A full client project-delivery portal (stages/files/team approvals) has no current data contract and remains a separate implementation scope; do not invent operational status for saved briefs. The existing Studio remains the working execution surface. No RFQ-only pivot, new service claims, paid design assets, library upgrades or new external connectors.

Production merge/promotion remains a separate final delivery decision under WORKFLOW; complete code, verification and Preview first.
