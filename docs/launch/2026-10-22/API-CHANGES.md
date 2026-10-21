# Customer release API changes

All private endpoints require a current authenticated owner session, same-origin JSON mutations (20,000 bytes), and derive organization/actor from the session. Caller actor/org/profile/tool fields are not authority. Existing public/API `{run}` envelopes and request allowlists remain.

| Operation | Contract |
|---|---|
| POST /api/v1/workspace/chat | Only `{locale:'en'|'ar'}` → `{workspace,agent}`. Idempotent reserved request creates a separate neutral customer assistant, never overwrites existing agents/knowledge. Feature-off503. |
| GET /api/v1/agents/{id}/conversations | Bounded keyset pagination → `{conversations:[{id,title,updatedAt}],nextCursor}`; title first user question max80. Exact org/agent/actor/studio scope. |
| GET /api/v1/agents/{id}/conversations/{conversationId} | `before` keyset cursor → `{runs,nextCursor}`; <=30 chronological runs/page. Current source provenance enforced before generated output. |
| DELETE same | Only `{}` after explicit interface confirmation. Atomic actor/org/agent/studio-scoped runs and dependent internal proposals deletion. Sources/publications/independent briefs unaffected. |
| POST /api/v1/agents | Existing settings plus optional `builder:true`. Server maps to customer_v1, only when feature enabled; distinct idempotent saved assistant. Public profile settings not accepted. |
| Existing activity/run reads | First-party server-authorized scoped reads replace direct raw-table access; no snapshots/prompts returned. Revoked generated answer/proposal redacted as knowledge_changed. Non-successful rows never emit generated chat. |
| Existing approval | Decision-only body unchanged. Database transaction rechecks original dependencies under shared agent lock; expired/revoked output cannot be approved. Internal decision only. |

Private visible run optionally adds `chat:{schemaVersion:2,parts:[{kind,text,basis,citations}],nextQuestion,briefDraft:null}` and `historyState:available|knowledge_changed|expired`. Existing answer/citations remain. `chat` is never returned to published API/widget callers. Failed/cancelled rows return no generated payload.

Context: latest6 complete successful currently authorized turns within18000 chars, before retrieval; current lexical words plus bounded prior user terms for continuations; up to6 original chunks, with prior cited evidence recovery. Arabic/Latin script boundaries normalized on query/index; no semantic/translation claim. Provenance conservatively includes every prior turn supplied to model, not only new citations.

Models: three server-only keys map to intended GPT-OSS120B/GPT-OSS20B/Qwen3.8-27B. Provider output maxima65536/65536/16384; concise default responses, supported response/body/source bounds remain. Ordinary turn uses one selected model. Strict structured output currently excludes streaming/tool use. Three keys do not remove provider/account capacity limits. Provider access evidence recorded separately.

Server feature switches `STUDIO_CUSTOMER_CHAT_V2_ENABLED` and `STUDIO_SEARCH_NORMALIZATION_V2_ENABLED` require verified additive schema. Shared revocation visibility remains enforced with flags off. New chat lifecycle uses Vercel maxDuration300 and lease295 seconds, no product response-time promise or artificial typing delay. Existing abuse/concurrency limits remain.

Retention: nullable expiry support, no policy timer/purge/cron enabled. No existing data rewritten. See release controls for ordered grants migration and security-compatible rollback.
