# AGYNEXA architecture review and scope checkpoint

Status: planning review, 22 October 2026. No product work, repository inspection by this reviewer, tests or deployment. Based on the supplied audit/runtime adapters and planning research. The owner is exploring an Agent Builder; the two-template baseline is preserved pending that scope decision.

## Recommendation

Build a hosted, template-first configuration journey around two real outputs: KnowledgeGrid answers from approved short company text; ServiceFlow prepares a business issue for human review. If the builder is chosen, the customer must receive a distinct configured agent with a real saved identity, working private test entry and clear permissions. A helpful conversation with AGYNEXA's intake assistant alone does not satisfy that builder outcome.

The baseline runtime upgrades remain useful: source-free discovery, bounded complete-turn context before retrieval, grounded company facts, safe source revocation and exact internal approval. Reuse the current stack and `agent_runs`; do not add a general orchestration platform or arbitrary code tools to achieve configuration/provisioning.

## Five material failure modes

1. **A draft label can conceal invented company facts.** Response types and valid citation IDs are necessary but do not prove semantic truth. Evaluate mixed requests and unsupported policy/status/price claims explicitly. Keep missing facts visible and do not promise hallucination-free answers.
2. **Revocation can fail outside the main answer endpoint.** Context, activity, replay, proposal rendering and approval races must share source/access checks. Generated source-derived drafts require provenance too. A prior answer can leak even when current retrieval correctly excludes the deleted source.
3. **Rollback can restore the original security defect.** The baseline activity path lacks current per-citation redaction. Keep the visibility fix independent of new feature flags and retain it in the rollback target. Reverting blindly to the original deployment is not a safe response to a revocation incident.
4. **A configured agent is not an operational platform.** An SDK, Linux tool file, provider key or email connection path does not establish tenant isolation, budgets, durable approvals or actual delivery. Platform-funded inference needs tenant budget controls; BYOK and business-tool credentials are separate security boundaries.
5. **A saved record is not a received enquiry or completed service.** Internal approval/private save must be described accurately. A staffed queue, notifications and external delivery require an actual recipient workflow and operational owner. If that is essential to a customer's purchase, the bounded pilot is insufficient until separately scoped.

## Tradeoffs to retain in parent review

- A separate default/intake assistant protects the personal existing agent, but a builder must create a separate customer-configured output agent explicitly. Avoid confusing those two roles.
- Existing run records can support complete-turn history without a new conversation platform. Every query still needs org+agent+actor+access-kind+conversation binding, and replay-key collisions must not cross actors.
- Consistent Arabic/Latin boundary normalization addresses the demonstrated lexical failure. It does not establish arbitrary bilingual semantic search.
- A 90-day new-customer history policy is a **recommendation requiring owner approval and a tested purge path**, not an existing capability. Legacy personal records must not be purged by assumption. Keep source/standalone-brief/export/backups semantics explicit.
- Eight-GiB hardware makes isolated database verification a real release dependency. Locate/reuse the existing engine first, measure a minimal healthy stack and block the schema release if genuine DB/Auth isolation cannot be tested. Do not turn a resource proposal into a pass claim.
- Product copy can be reorganized inside the existing template, while the entire homepage and its shared dependencies stay frozen. SEO/query suggestions are hypotheses; sector evidence does not prove demand or causal benefit.

## Artifacts to review

- [Two-template product specification](product-spec.md): concrete product cards, journeys, samples, limits and honest pilot delivery.
- [Executable baseline implementation plan](implementation-plan.md): contracts, files, additive migration, ordered tasks, batched acceptance, security/resource gates and rollback.
- [Agent Builder exploration](agent-builder-options.md): bounded builder versus autonomous platform, configuration/provisioning, SDK boundaries, funding/secrets and delivery choices. This is an additive exploration, not final approved scope.

Parent consolidation must resolve the builder's first scope before implementation. Commercial terms, legal/contact/retention wording, recovery rollout and promotion/domain decisions still need real owner approval. No artifact claims product readiness, market demand or a successful new runtime feature.
