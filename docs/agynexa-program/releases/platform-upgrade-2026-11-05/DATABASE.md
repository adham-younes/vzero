# Production database receipt — 5 November 2026

Project: `xsyxvswbiptbyxyqhdim`. The original failed runtime migration left no new columns, tables or migration-history entry. Read-only inspection before retry confirmed the original model constraint and all 13 historical migrations.

The repaired validator uses explicit required/allowed key arrays, typed optional fields and complete PL/pgSQL terminators. Both migrations then applied successfully:

| Migration | Recorded database version | SHA-256 |
|---|---|---|
| studio_openai_runtime | 20261105110459 | ff2eba1c1273f15de914429a5ee344a5a670a1573f3ce9291ae007cdd0bb64c7 |
| chatgpt_identity | 20261105110509 | 6f2c1c8f4482b4310f8946971034ab8d99b07f940008662a82547a0d59ea2d9e |

Local migration filenames match the versions assigned by the database connector, preventing a later CLI migration from attempting to apply them again.

Post-apply catalog verification confirmed sector/tools columns; the activation, credential, OAuth transaction and identity tables; and the publication/disconnect/withdrawal triggers. All four new tables have RLS enabled, no SELECT privilege for anon or authenticated, and service_role access. No secret value or customer content was read for this verification. Existing data was preserved.

The historical leaked-password-protection warning remains; this task did not change that Auth configuration. Runtime behavior and user interactions are recorded separately after the application release.
