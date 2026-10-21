# Customer assistant release — 22 October 2026

The private customer chat, reviewed assistant builder, complete scoped conversations and source-safe history are deployed to [AGYNEXA](https://vzero-nine-beryl.vercel.app). [PR33](https://github.com/adham-younes/vzero/pull/33) merged reviewed head `6b37b01593110c2801787e7b90cc70112c956939` as `e48dc748feeae3511b76bb679ec30b0a1b0c8729`. The primary public hostname serves READY production deployment `dpl_CEFfHq2ur8D9HmiHf92iD8vrkzFa`, verified by Vercel alias and source metadata. A later documentation-only closure can redeploy identical application code; its Git/PR records identify that source without a self-referential SHA.

## Delivered behavior

- Sign-in enters a distinct private customer assistant without overwriting a personal assistant. Reviewed builder provisions a separate saved assistant with its own real ID, settings URL and private test.
- Complete scoped turns feed follow-up context before lexical retrieval. Mixed Arabic/Latin terms normalize consistently. Current source/chunk/hash authorization covers history, activity, replay, transitive derived answers and atomic internal approvals. Source deletion invalidates cached output. No external delivery is implied.
- User-fact drafting works without a source upload. Company facts require approved evidence. Brief prefill uses the user's words, with explicit review and consent. Private conversation deletion has explicit confirmation.
- Three selected server key slots expose GPT-OSS120B, GPT-OSS20B and Qwen3.8-27B (provider preview), output ceilings65536/65536/16384 tokens. The stale12000-character answer ceiling is removed. Whole buffered JSON fits the documented hosting capacity; over-limit output fails clearly. History pages honor byte and row limits. Normal chat uses one selected model.
- Ten services, nine solutions and ten sector selectors remain. Non-home bilingual copy states concrete inputs, outputs and human review. Privacy/terms routes are operational notices with unresolved legal facts stated. Entire protected homepage/Hero/video/navigation/identity remains unchanged.

## Evidence and its boundaries

| Gate | Result and actual environment |
|---|---|
| Build | Local and production-target candidate passed; merged Git deployment READY |
| Contracts |11 context/schema +4 account checks; affected strict-provider fault and long-output boundary checks PASS |
| Data/security |38 checks on real isolated PostgreSQL17/Auth/PostgREST/Kong, plus legacy and transitive replay regressions PASS; deterministic model boundary |
| Customer browser |8 journey groups PASS with real isolated Auth/data and deterministic provider;0 page errors;390/768/1440 EN/AR |
| Live model access |9 actual adapter/schema/policy samples PASS using all3 server-held Groq credentials inside Vercel; no key export; sample latency231–598ms, not full-request latency/SLA |
| Public candidate |68 localized HTTP/metadata routes PASS |
| Live production |8 affected public/account-entry routes200; Supabase health200/all3 checks ok;3 unauthenticated private API guards401 |
| Protected live home |6 EN/AR390/768/1440 comparisons exactly match pre-release text/lang/dir/overflow/video/style baseline;0 page errors |
| Authenticated live customer browser |NOT VERIFIED: authorized existing session unavailable; no production fixture account created |

Actual model checks and isolated customer-browser checks are separate evidence. They do not establish a fully authenticated production conversation E2E or general model semantic correctness. Consenting-reader comprehension and broad load/capacity testing remain NOT VERIFIED.

## Production database and configuration

Existing Supabase `xsyxvswbiptbyxyqhdim` retained its five original migrations. First `customer_chat_profile` applied hosted version`20261021225511` (source`20261021221316`). Verified additive profile/nullable expiry/search index, mixed-script boundary and compatible old read grants. Production Config flags `STUDIO_CUSTOMER_CHAT_V2_ENABLED=true` and `STUDIO_SEARCH_NORMALIZATION_V2_ENABLED=true` set before compatible Git deployment. Sensitive credentials unchanged.

After the compatible primary deployment was READY, `protected_history_reads` applied hosted version`20261021230003` (source`20261021222156`). Both authenticated and anon SELECT privileges on raw agent_runs/support_requests verified closed. Supported first-party server routes authorize exact scope. Seven hosted migrations total. No customer data rewrite, fixture account, purge/cron or Auth/SMTP change.

## Remaining operating decisions

Account recovery/SMTP remains deferred by owner. No billing/subscription or external CRM/helpdesk/email delivery integration is claimed. Legal operator, jurisdiction, contractual commercial/support terms, account-wide deletion policy and a retention schedule require real owner decisions before those commitments. Nullable expiry metadata installs no timer or purge. Construction remains research only. Retrieval remains lexical short-text retrieval, not semantic/vector or PDF ingestion.

## Rollback and cleanup

[Release controls](RELEASE-CONTROLS.md) define safe feature-disable/recovery. Preserve additive schema, customer records, source authorization and raw-read closure. Old baseline deployment is not a safe security rollback. No complete production restore drill claimed.

Own isolated application, four test containers and dedicated Colima VM are stopped after verification; default Docker context retained. Container OOM flags were all false. Synthetic volumes retained for reproducibility; no unrelated workloads touched.

Full accepted plan/spec/research remain byte-identical in this directory. [Execution ledger](EXECUTION.md), [API changes](API-CHANGES.md), [UI record](UI-RECORD.md), [content ledger](CONTENT-LEDGER.md), [live public evidence](evidence/production.json), [actual provider receipts](provider-access.json) and [database receipt](evidence/production-database.json) provide details. Exactly3 execution workers used GPT-6.1 Sol High, with one cross-worker review and coordinated affected verification.
