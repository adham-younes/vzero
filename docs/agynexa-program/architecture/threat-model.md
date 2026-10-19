# Security review and acceptance scenarios
Design only. None of these scenarios is claimed as a passed runtime test.

| Risk | Required control | Future acceptance test |
|---|---|---|
| Tenant mixup | Verified membership; composite tenant FKs; forced RLS | Another org's UUID returns no record, including caches/jobs |
| Stale source access | ACL-versioned ingestion/search/citations | Revoke permission during run; source and answer withheld |
| Prompt-injected tool action | Data/instruction separation; tool allowlist; external approval | Retrieved instruction cannot widen scopes or send |
| Approval substitution/replay | Immutable payload hash, expiry, CAS version, assigned reviewer | Changed recipient and second consumption both rejected |
| OAuth login/tenant confusion | State/PKCE, bound session, exact redirect, one-time transaction | Wrong user/provider/org/state cannot connect |
| Webhook forgery/duplicates | Provider verification, event uniqueness, durable outbox | Invalid signature rejected; duplicate produces one effect |
| SSRF | URL allowlist, DNS/IP and redirect validation | Loopback/private/metadata targets blocked |
| Ambiguous provider write | Receipt lookup and reconciliation | Timeout after write never blindly duplicates action |
| Sensitive logs | Redaction, minimum retention, restricted access | Tokens/contact data absent from normal traces |
| Resource exhaustion | Byte limits, budgets, queue backpressure | Oversized body 413; budget 429 with Retry-After |

Route review: existing /[...path] only accepts enumerated public pages. Future /api/v1 route handlers must live under app/api/v1 and must not be simulated by this catch-all. Separate public published catalog from authenticated application and internal worker operations. No service-role key is placed in the client.
