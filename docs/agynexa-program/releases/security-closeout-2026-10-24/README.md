# Security maintenance and platform handoff — 24 October 2026

Status: PRODUCTION_VERIFIED. The authorized maintenance source was merged and its matching Git-triggered production deployment is READY.

## Owner scope

Apply necessary security updates, run bounded checks and document the complete result for a new conversation. Studio/agent redesign, orchestration and new product functionality are explicitly deferred to the owner's new plan. HeronSignal setup is deferred and neither open installation PR is part of this release.

Baseline production is the [approved global bilingual content release](../approved-home-production-2026-10-24/README.md), main `dc9ebe0f6ccd54f845cf73b859465d5f232b8afc`. The local documentation receipt `8d745dd` accompanies this maintenance branch; it changes no application source.

## Security changes

| Package | Before | After | Reason |
| --- | --- | --- | --- |
| Next.js | 16.4.0 | 16.4.1 | Official same-line security patch covering the three selected framework advisories |
| body-parser | 2.3.0 | 2.4.0 | Fix selected compressed-body denial-of-service advisory in the shadcn CLI dependency graph |
| fast-uri | 3.1.8 | 3.1.9 | Fix four selected normalization/parsing advisories in the shadcn CLI dependency graph |

Next's exact env/SWC companion packages and peer-context references follow the framework patch. No general dependency update, major/minor framework migration, codemod or future-default adoption was performed. Existing UI package versions and manifest specifiers were preserved after the package manager initially re-resolved two `latest` tags. React remains unchanged. The existing sharp resolution already met the patched upstream floor; framework patching still follows the vendor's recommendation.

The initial package-graph scan reported 8 advisory records: 2 critical, 2 high, 2 moderate and 2 low. The final scan reports zero across that selected graph. These counts describe installed/locked dependencies and reported advisory matches, not demonstrated exploitability of this application or a security certification. CLI transitive exposure is distinct from code reachable through a production page.

## Verification and evidence

- [Audit before](evidence/audit-before.json), [audit after](evidence/audit-after.json), [dependency diff](evidence/dependency-changes.json), and [command/version/lock-hash provenance](evidence/verification.json).
- Frozen install passed using declared pnpm12.3.4. The initial baseline audit used the installed global pnpm12.4.2; installation, final audit and build used the repository-declared version via npx.
- Optimized Next16.4.1 build/TypeScript passed without the former security-fatal reminder. No disabled security check or retry was required.
- 14 existing Node tests passed: bounded credentials/input/consent, cross-origin and oversized mutation rejection, Auth error classification and stateless comparison behavior.
- Existing review/apply snapshot, response-envelope/history capacity and provider-contract regression scripts passed. Provider responses were mocked; no live model, test account, external mail or payment was used.
- [74 readonly route/locale checks](evidence/local-public-checks.json) passed: exact title/description, one H1, language/direction, existing security headers and account noindex. Robots/sitemap returned200 and a missing page returned404. The harness first ran before the local listener was ready; after observing server readiness, the check passed. This was a test-startup ordering issue, not an application failure.
- [Actual browser samples](evidence/local-browser.json): EN desktop and AR390 homepage retained copy/video; Arabic menu opened, Escape closed it and returned focus; Arabic security-page navigation and layout passed without horizontal overflow.
- [Source guard](evidence/source-guard.json): all178 tracked first-party application/components/content/assets/schema/proxy/config files retain baseline hashes. Studio, Auth, APIs, data model, provider/mail policy, styling, Hero and video are unchanged.
- Fresh independent source/lockfile review found no critical or important issue. It verified compatible transitive ranges, exact companion versions and preserved UI dependency versions. Parent-owned execution receipts establish install/build/test results separately.

No production exploit probe, authenticated customer journey, database write, account operation, provider inference, message send, payment or protection/environment/domain modification is part of this maintenance release.

## Publication and rollback

Use the existing Git integration and one reviewed production merge. Verify the matching source and official aliases, a bounded public presentation sample and unauthenticated private-route rejection. Preserve prior content-production deployment `dpl_447stD3JsGD1hZHZsQEmQH8rNFFH` as the known compatibility reference; rolling back to its unpatched dependency versions reintroduces the selected advisories, so diagnose and prefer a compatible forward fix where practical.

## References

- [Next.js official October security patch](https://nextjs.org/blog/nextjs-security-update-october-14-2026)
- [Next image-optimization advisory](https://github.com/advisories/GHSA-2464-fhr4-w9xw)
- [Next cached typed-array advisory](https://github.com/advisories/GHSA-673q-mjm6-r5xr)
- [Next Server Actions denial-of-service advisory](https://github.com/advisories/GHSA-p3m5-59mp-jv5r)
- [body-parser advisory](https://github.com/advisories/GHSA-27r3-jxmh-p828)
- [fast-uri advisory and patched versions](https://github.com/advisories/GHSA-w74x-v6f9-j3xg)


## Final production receipt

[Security maintenance PR](https://github.com/adham-younes/vzero/pull/48) merged reviewed head `172a195ef3c89d8e3755df382b845d6b3b305ff0` as `445424ffd331d2d8da2673805e3f7cd2f831b742`. [Deployment](evidence/production-deployment.json): `dpl_97GBctYLSzVJ2usGnDRFEzVW4HmX`, READY/production/Git, official and legacy aliases assigned. No manual duplicate deployment.

[Readonly production checks](evidence/production-readonly-checks.json) passed: six public EN/AR pages return200 with the existing security headers; anonymous Account/Agents/Projects requests return401 and no-store. [Browser evidence](evidence/production-browser.json) confirms the official Arabic security page and layout. No authenticated or exploit test was run.

Final receipt/evidence is committed locally and summarized in the merged PR to avoid a documentation-only production rebuild. The owner subsequently requested a separate minimal HeronSignal snippet installation; that later scope does not change this security receipt.
