# Public navigation and catalogue design — 5 November 2026

On 5 November 2026 the owner authorized production release of the verified public navigation revision. The product commit is `f31d44dc17f0d3f8b1d464c463158e5585e93d11` on `codex/public-navigation-consistency`, based on `c61cc369bfa9f678ed794d71b0f0266423948b8f`. The release covers public navigation and layout. Studio remains paused and outside the release scope.

The release follows the [repository Git and Vercel workflow](../../WORKFLOW.md). At preflight, Vercel resolved the official domain to `dpl_ChMsf9dGxZrPEvcsVMfrVAiN1yF3`, READY in production from baseline `c61cc369`. That deployment is the known fallback if the new release fails. The production receipt records the merge, official aliases and observed checks separately from the local evidence.

## Problem and intended behavior

Solutions currently places three long explanations before the workflow choices. Capabilities, Industries and their detail pages cross-link without explaining their different purposes; repeated supporting links compete with the next useful action. Capability search/category and industry selection are lost when leaving and returning. Secondary pages use the same oversized opening and long reading pattern.

The first candidate (now superseded as a navigation approach) established three entry points: **Solutions** chooses a business outcome; **Industries** applies that work to a sector; **Capabilities** explains the supporting abilities. Shared compact public headers, catalog controls, section navigation and bounded supporting reading create consistency while retaining specialized workflow, industry, integration and reference layouts. The existing black/green identity, fonts, 1280px container, original video, both Hero files, ten capabilities, nine solutions, accepted meaning, deep routes and anchors remain protected.

## Reference and decision ledger

- `DESIGN.md` and the saved Kore reference evidence in `prior-research/` govern layout hierarchy and visual values. Borrow hierarchy and contextual navigation only; no artwork, competitor claims or identity is copied.
- Refero was checked by the coordinating agent and returned `NO_SUBSCRIPTION`; no upgrade or paid generation was attempted. Its available interaction guidance informed URL-backed filters/search, native links, focus, live result announcements, touch targets and anchor offsets.
- The 19 October market review was read in full (452 lines) and compared with current code, `STATUS.json`, `RESUME.md`, `BACKLOG.md`, `HANDOFF-2026-10-24.md` and `TECHNICAL-PLAN.md`. Its relevant recommendations are business-first language, early examples/outcomes, clear next actions, preserved routes/content, evidence-bounded integration language and risk-focused verification. The old RFQ-only implementation-agency strategy, prospecting, pricing, architecture expansion and embedded execution prompt are historical proposals. They do not override the current reusable self-service Agent Builder or authorize work on the paused Studio.
- Preserve the content rather than shorten by deletion: move extended catalog explanations into named supporting disclosures and give detail pages a navigable reading structure. Related destinations are subordinate and explain their purpose.
- Capability categories are an exclusive native radio group, not navigation tabs. Stable URL keys are `category` and `q` for capabilities, `q` for solutions, and `industry` for sector selection. Defaults/unknown values fall back safely. A validated `from` parameter carries catalog context to detail return links.

## Implementation plan

1. Add scoped public composition primitives and URL-state utilities; keep Studio and Hero styling outside their selectors.
2. Put the Solutions catalog first; give Solutions, Capabilities and Industries a concise explanation of their purpose and integrated controls.
3. Apply compact headers and section hierarchy to capability/solution details and public reference pages; consolidate supporting links and preserve all accepted content.
4. Record the local candidate in current working documentation. The coordinating agent runs one final build/typecheck and representative EN/AR desktop/mobile, navigation, keyboard and URL-state checks after implementation is complete.

## Verification

The final revised candidate built and typechecked successfully ([build log](evidence/build.log)). The [public contract](evidence/public-contract.json) verified 68 localized URLs, 2,570 rendered public links, 312 section targets, both legacy redirects and the accepted content and protected-file invariants. The first candidate reports in the evidence directory are historical.

[Final browser checks](evidence/final-browser.json) were performed in the in-app side browser. Finance → Connections → integration requirements stayed in Solutions. Switching workflows kept one primary panel open, and reload and locale switching preserved the workflow and supporting capability. On a 390px viewport, Solutions requirements rendered in both languages without horizontal overflow. Logistics had one column of facts, and changing language kept both Logistics and its open workflow. In the Arabic capability directory, browser Back from the standalone reference restored the category, search and open capability. The inner integration-requirements disclosure can be reopened after a language change; its expanded state is local to the document.

- [Arabic Solutions, desktop](evidence/local-workflow-capability-ar-desktop.jpg)
- [Arabic integration requirements, 390px](evidence/final-solutions-requirements-ar-390.jpg) · [English integration requirements, 390px](evidence/final-solutions-requirements-en-390.jpg)
- [Arabic Logistics, 390px](evidence/final-logistics-ar-390.jpg) · [English Logistics, 390px](evidence/final-logistics-en-390.jpg)
- Historical live baseline: [Home](evidence/production-home-desktop.jpg) · [Arabic Logistics, 390px](evidence/production-logistics-ar-390.jpg) · [English Logistics, 390px](evidence/production-logistics-en-390.jpg)

These checks cover the local public build. The historical live-site screenshots above predate the navigation release.


## First candidate source — historical presentation

- `@components/public-layout.tsx`: shared compact public headers, differentiated catalog lenses, collapsed native page index, contextual return and editorial/supporting layouts.
- `@components/catalog-state.ts`: hydration-safe URL values, native-history/popstate subscription including same-path query navigation, allowlisted catalog return context. Capability radios use `category=customer-experience|internal-operations|integration-control` (default all) and `q`; solutions use `q`; sectors use stable language-independent `industry` keys.
- Public page/catalog/program components: solution choices before extended explanations; integrated search/exclusive native radio controls; workflow/requirements/FAQ hierarchy; consolidated locale-normalized related destinations. Sector selection and detail return preserve context.
- Shared shell: Solutions, Industries, Capabilities and How to build as primary exploration; technical/reference destinations remain in the full menu/footer. Parent navigation is marked with `aria-current=location` on detail routes.
- `lib/legal-content.ts`: presentation uses the same public header/editorial structure, with the legal content object unchanged.
- `app/globals.css`: scoped public layout rules, visible focus, 48px controls and one-column mobile industry facts. No existing Hero/video rule changed.

Existing `/services/solutions` and Arabic redirects, public route inventory, metadata data, accepted copy data, `#main`, `#industry-detail` and procurement `#review-workspace` are preserved. No dependency changes, runtime/API edits, migration or external account action.


## Direct owner correction and revised interaction — 28 October 2026

The owner said the menus and buttons leading to other pages/content still made a maze. The source revision therefore changes the interaction, beyond restyling or retaining selection. **Solutions is the single exploration entry.** Its workflow cards are native, exclusive expandable panels. Each exposes the complete accepted workflow explanation and its supporting capabilities in the same page. Connections includes its operating/system requirements inline. Capabilities and Industries also reveal the relevant process/requirements in place. The separate deep pages remain valid for search, sharing and reference.

There is no repeated three-way catalog menu. The optional industry selector inside Solutions supplies the existing sector context and opens its mapped workflow, clearing search so that workflow is visible. Reference destinations remain grouped in the full menu and a collapsed footer library. Navigation-only paragraphs are omitted from catalog supporting reading; the substantive approved source text remains unchanged, and unique reference relationships are rendered as inline reading.

`@components/inline-details.tsx` supplies reusable workflow/capability bodies and bounded native disclosure groups. Workflow → capability explanations stop before reciprocal workflow relations; capability reference explanations similarly stop before further related content. The bodies have no `main`, h1, page header or repeated Studio CTA. All embedded section/demo IDs are namespaced; the standalone procurement page retains `#review-workspace`. Its comparison logic is unchanged; optional id/heading-level props only adapt presentation.

URL keys add `solution`, `capability` and `reading` to the existing `q`, `category` and `industry` state. Invalid panels remain closed. Exclusive native close events retain the newly opened sibling instead of clearing it. Small subordinate links explicitly offer a standalone page for sharing/reference, with the current catalog context retained.

The first candidate's successful build, public-route checks and browser checks describe that earlier presentation. The Verification section records the checks performed on the revised source before production publication.

## First production build and owner feedback

[PR #53](https://github.com/adham-younes/vzero/pull/53) merged as `693ee736ccef86e59b2727b1f2b7dd2d2a55fb68`. Vercel built it from Git and assigned `agynexa.si` and `www.agynexa.si` to READY production deployment [`dpl_EdviXEidWrYj4zUnzerneMivmcNS`](https://vercel.com/adhamlouxors-projects/vzero/EdviXEidWrYj4zUnzerneMivmcNS).

The owner rejected the reduction of desktop navigation to two destinations and pointed to the oversized Arabic Sales disclosure. The follow-up restores the five baseline destinations and places Industries alongside them. The three catalogues use the same spacing, typography and structure. At wide widths a compact list selects a separate reading area. At phone width a labelled selector sits above the details. Workflow summary facts use equal columns where space allows. A supporting capability and its integration requirements stay within the selected workflow. [Design contract](../../../../DESIGN.md).

## Production correction and verification

[PR #54](https://github.com/adham-younes/vzero/pull/54) merged the reviewed head `2500ee367247bcead7187e78b198192b6fd64b06` as `6a79a15edd247e0d1dd7497059c73be89c00eddd`. The matching Preview succeeded. Vercel Git integration built READY production deployment [`dpl_4UMQUBZ7s1SD7gv6YFm5p8kpPMGy`](https://vercel.com/adhamlouxors-projects/vzero/4UMQUBZ7s1SD7gv6YFm5p8kpPMGy). Both official aliases resolved to that deployment. [Deployment receipt](evidence/production-release.json).

The revised local build and TypeScript passed. The [local contract](evidence/catalogue-local-contract.json) covered 68 public URLs, 2,216 links and 312 section targets, and checked the six header links. All four procurement tests passed. [Production HTTP evidence](evidence/production-http.json) covers 17 read-only checks, including both Studio entry pages for anonymous visitors, the legacy redirects and a byte-for-byte SHA-256 match for the original video.

The [production side-browser checks](evidence/production-browser.json) cover both homepages, six links and playing video, the Sales view on desktop and mobile, Finance to Connections to requirements on one page, reload and locale state, the capability filter/search and browser Back, and the Logistics sector selection across languages. The Studio check was limited to the anonymous entry.

The owner subsequently rejected the sidebar in the published Arabic Capabilities view. After comparing a short card grid and a single selector locally, the owner asked for the display that matches the design system. The follow-up uses the project's Input, Label and Button components, one labelled native item selector and a shared reading layout. Search, filtering and selection share one row at wide widths and stack on phones.

## Shared catalogue controls in production

[PR #55](https://github.com/adham-younes/vzero/pull/55) merged reviewed head `18b2ebc90d6db7b79b30107fe39963ffec6616d3` as `6d9b13a76e222d5ceae42711b9da5e0cb0a85a46`. The matching Vercel Preview passed. Git integration built [`dpl_8rmPcjyi6oAHpaafvQrDwcnRrH3V`](https://vercel.com/adhamlouxors-projects/vzero/8rmPcjyi6oAHpaafvQrDwcnRrH3V) with state READY and target production. Both official aliases resolved to that deployment. [Release metadata](evidence/standard-catalogue-release.json).

[Local route checks](evidence/standard-catalogue-local-contract.json) passed on the reviewed layout before the English result-count wording change. The exact PR head passed its Vercel build. [17 read-only production HTTP checks](evidence/standard-catalogue-production-http.json) confirmed the shared control row in both languages, the canonical URLs and redirects, the signed-out Studio entry and the original video hash.

[Production browser evidence](evidence/standard-catalogue-production-browser.json) records the 48px aligned fields at 1280px and their 390px layout. Search by the short label, browser Back and switching languages preserve the query, category and selection. The Finance-to-Connections path and the Logistics example stay within their catalogues. [Arabic desktop](evidence/standard-capabilities-ar-desktop.jpg) · [Arabic mobile](evidence/standard-capabilities-ar-390.jpg).
