# Public experience implementation

Date: 5 November 2026. Baseline: `45a37cd` on the shared upgrade worktree. This record describes implemented source changes; production verification belongs to the release receipt.

## Product and market review

The required 19 October market review was read alongside the current source and status records. Its useful recommendations remain: describe a business task, show the information and output, keep a responsible reviewer, and distinguish a draft from a confirmed external action. The owner's current direction retains a reusable self-service Agent Builder across companies and sectors. The review's proposed RFQ-only agency positioning is not the current product scope.

The public site now leads into the private Studio: configure a role, supply context, test the work, then discuss production activation by email. Pricing, payment arrangements and commercial terms are negotiated through `adham@agynexa.si`. No price, payment processor or activation entitlement is invented by the public interface.

## Changes

- Kept both original Hero component files and the original video. Shortened the Hero's editable content source to one paragraph.
- Replaced the long post-Hero prose with a clearly labelled fictional workspace illustration, an interactive nine-workflow explorer, the concrete Studio tools, a four-step build-to-activation path and practical questions.
- Preserved ten capabilities, nine solutions and ten sector contexts. Capability views distinguish what can be tested in Studio from the external setup required for connected operation. Workflow views link to the corresponding Studio preset.
- Rewrote the architecture, build process, integrations, security, resources, contact and getting-started copy in English and Arabic. Updated about/industry introductions and the offers and metadata of all ten capabilities. Reframed solution outputs as reviewable work rather than implied completed external actions.
- Added shared activation calls to action and a footer path to the commercial conversation. Email links explicitly open the user's email application.
- Updated privacy and usage descriptions for OpenAI processing, enabled research/code tools, references to generated artifacts, encrypted customer-owned API credentials and separate production activation. ChatGPT identity and customer-plan entitlement remain distinct; customer-plan use is not presented as enabled.
- Added public Open Graph/Twitter metadata and a generated brand image. Structured data uses the rendered content: WebPage, BreadcrumbList and visible FAQ content. Language alternates and production canonicals remain.
- Scoped new layout rules to public surfaces, retaining the approved black, emerald, typography and spacing values. Mobile layouts use logical spacing and mirrored RTL reading order.

## Tool and editorial checks

Humanizer was used in embedded/file mode to remove repeated framing, abstract claims and unnecessary text while preserving operating limits. No claims of search ranking, customer results or compliance certification were added.

Mobbin search was refused because the available plan did not permit the requested MCP access. No Mobbin image was used or presented as an approved reference. The redesign uses the existing identity and the production/source observations.

Better Design `check_comprehension` was run on the final visible Hero and activation panel copy independently. All four text-only checks returned `pass`, with zero findings:

| Panel | Language | Tool word count | Heuristic explanation time |
| --- | --- | ---: | ---: |
| Hero | English | 29 | 13 seconds |
| Activation | English | 28 | 12 seconds |
| Hero | Arabic | 24 | 11 seconds |
| Activation | Arabic | 23 | 11 seconds |

An initial combined Hero-plus-footer sample was over-dense and incorrectly combined actions from different sections. The final per-panel copy was shortened and checked separately. These are text heuristics, not measured user results or visual approval. No design-system replacement was adopted: the owner explicitly required the existing identity.

The installed Next.js CSS and metadata guides were read. No application tests or local visual verification were run by this workstream, following the owner's requirement to batch the required build and final production checks. The root release process must verify the actual rendered geometry, interactions, metadata image and RTL layouts.

## Production checks for this scope

Inspect English and Arabic home at desktop and narrow mobile widths; switch workflow choices and follow their Studio links. Check Solutions, Capabilities and Industries selection/readability; inspect one detail of each. Confirm email links, payment language and provider limitations on Contact, Integrations, Privacy and Terms. Verify `/opengraph-image`, production canonical/alternates and the visible FAQ/structured-data match. A build or HTTP status alone does not establish these outcomes.

## Follow-through across all public pages

The resumed source review covered 34 public page subjects in English and Arabic (68 language URLs): home; the Capabilities and Solutions catalogues; all ten capability details; all nine workflow details; Methodology, Architecture, Integrations, Security, Resources, About, AgentNexOS, Getting started, Contact, Industries, Privacy and Terms. Account and private Studio screens are owned by the Studio workstream. This is source coverage, not a claim that every rendered route has passed production verification.

- Reviewed bilingual headings, catalogue selection, related-page links, activation continuity and heading hierarchy. Fixed the Getting started breadcrumb and the untranslated orchestration catalogue fallback.
- Added readable, semantic input → agent responsibility → reviewable output diagrams for all ten capabilities and nine workflows. They share responsive CSS, become vertical on narrow screens and reverse horizontal arrows for RTL. Voice, orchestration and integration diagrams describe text testing, coordination design and connection requirements rather than claiming unimplemented execution.
- Replaced the former small-label abstract architecture SVG with an accessible HTML diagram of the actual private Studio path: instructions and company knowledge, configured OpenAI agent, enabled research/Python tools, then answer/evidence/tool activity/available files. Existing Architecture, Integrations and AgentNexOS placements all receive it.
- Added a workflow diagram to every industry selection, rewrote all ten industry outcomes as reviewable work, and added direct industry-specific Studio entry. The Studio workstream supplies bilingual task briefs for all ten industry keys.
- Rewrote all nine solution headings, leads and metadata around concrete inputs, work and review. Detailed context, reviewer, authority and activation content remains available underneath.
- Synchronized the Privacy and Terms copy mirror with the actual policy component so inline reference views describe the same processing and commercial terms.
- Kept the Hero components, original video and black/emerald identity. The new diagram styles are in an isolated CSS module. The separate home visual is root-owned; no Tripo asset or Tripo approval is claimed by this workstream.

No local application tests, local visual checks, build, commit or deployment were performed by this workstream. Final production checks should cover diagram wrapping/RTL, the nine workflow selections, ten capability selections, ten industry selections and their corresponding `/studio?industry=` presets, alongside the earlier page and metadata checks.

## Observed production HTTP acceptance

After the parent reported deployment of merged `main` `840c58d` (PR 65), this workstream performed read-only GET/source acceptance on `https://agynexa.si`. Evidence: `evidence/production-public-content.json` (timestamps included).

- All 68 public sitemap URLs returned 200 and had exactly one H1, a unique title, description, H1 and main-content body, and the expected canonical and English/Arabic language alternates. The shortest main body was 956 characters. No cross-language internal link, duplicate DOM ID or broken rendered fragment target was found.
- Every sitemap route appeared in the initial rendered internal-link graph. An additional 60 GET targets covered the public query links, account/Studio entries and all nine workflow plus ten industry Studio deep links in both languages. All returned 200 and preserved their query strings.
- JSON-LD parsed successfully; every rendered WebPage graph matched its page language, title and description. FAQ questions/answers matched the rendered text. The four legal URLs carry Organization JSON-LD only; adding their page/breadcrumb graph remains a nonblocking consistency opportunity.
- No user-blocking public-page defect was confirmed by these HTTP checks. A source review raised two Studio entry concerns for root's browser check: switching locale drops workflow/industry query context, and a saved browser-tab draft takes precedence over a newly followed industry/workflow link. These were not reproduced through browser interaction by this workstream.

These observations do not replace the root's production visual, interaction, authenticated runtime or security checks. In particular, Studio returns an authentication-loading shell in raw HTTP, so a successful GET does not prove the client populated the requested preset. No product mutation, commit or deployment was performed during this acceptance pass.

## Legal structured-data follow-up

At the root's request after production acceptance, the four explicit Privacy and Terms route files now emit the existing `pageSchema` helper output with their correct route and locale. This supplies the same WebPage and BreadcrumbList graph used by the other public pages, alongside the shared Organization schema. The JSON serialization uses the existing less-than escaping pattern. Policy text and metadata are unchanged.

This is a source change pending the parent's bundled follow-up build/deployment and production verification; the earlier HTTP evidence remains the unchanged observation of `840c58d`. No local tests, build, commit or deployment were performed by this workstream.
