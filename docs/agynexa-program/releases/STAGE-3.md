# Stage 3 — Architecture and integration design
Status SPECIFIED / REQUIRES_ACCESS. No connected database touched, no migrations executed, no production API handlers added.

OpenAPI3.1: 11 proposed operations and14 schemas; Zod request schema draft; 20-table private PostgreSQL/Supabase design and ERD; fail-closed review SQL; workflow and threat model. Covers identity/tenant boundaries, source ACL, approvals, outbox, idempotency, OAuth state/PKCE, webhook verification, retries, errors and trace privacy.

Provider matrix:20 candidates;19 official docs accessible and Salesforce source blocked403. General documentation availability is explicitly separated from endpoint-specific evidence. Unconfirmed endpoint paths/signatures/scopes/limits/prices remain TO_VERIFY. All require selected-account authorization and isolated implementation.

Checks: YAML parsed; all14 JSON Schemas validate structurally; local references and path parameters resolve; six positive/negative schema cases pass. SQL is a review artifact ending ROLLBACK, not executed or database-tested. Zod source is not imported into the app and needs future package/runtime tests. RLS defaults deny everything; future backend grants/procedures and security acceptance scenarios are required before implementation.

Outputs: architecture/openapi.yaml, contracts.zod.ts.example, integration-matrix.csv, provider-source-checks.json, data-model.md, schema-review.sql, workflow-contracts.md, threat-model.md.
