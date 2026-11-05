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
