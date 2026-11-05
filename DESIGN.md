---
name: AGYNEXA
description: Enterprise agent services in the existing dark video-led identity
colors:
  primary: "#10B981"
  background: "#050505"
  foreground: "#EBEBEB"
  surface: "#0B0B0B"
  secondary-text: "#BFBFBF"
  border: "#EBEBEB26"
typography:
  body:
    fontFamily: "sans-serif"
    fontSize: "16px"
    lineHeight: 1.7
  headline:
    fontSize: "clamp(28px,3.5vw,44px)"
    lineHeight: 1.2
rounded:
  control: "8px"
  panel: "10px"
spacing:
  small: "12px"
  medium: "24px"
  large: "48px"
  section: "88px"
components:
  primary-action:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.control}"
    height: "48px"
---

# AGYNEXA design contract

## Overview
Primary authority: AGYNEXA existing video-led dark template and owner screenshots. Measured agynexa.si on 2026-10-19: accent rgb(16,185,129) / #10B981, background #050505, foreground #EBEBEB, surface #0B0B0B, secondary text #BFBFBF.

## Colors

One solid emerald token for headings, icons, borders indicating selection, links and actions. No independent teal/lime accents. Depth comes from charcoal surfaces, subtle white inset lines and offset black shadows. No decorative gradients outside the existing video.

## Typography

Preserve the video, centered Hero layout, wording, Almarai Arabic, sans English, 1280px max container, 24px gutters (20 on narrow mobile), 8–10px radii and existing Button API. Correct the overlay to reveal the video. Post-Hero content uses full-width black bands with clear section rhythm.

## Layout

Kore.ai reference (public homepage and saved Artemis sample): separate outcomes from architecture, large diagrams paired with concise text, distinct section compositions. Borrow hierarchy and contextual links, not typography, artwork, logos or claims. Refero unavailable (inactive subscription), no paid upgrade.

## Components

Component families: split architecture illustration; service category tabs and compact catalog rows; industry selector with focused detail and sector icon; integration directory; numbered delivery timeline; expandable technical reading sections; procurement comparison workspace; review-and-share brief. All copy remains available. No page should be a wall of identical rounded text cards.

Spacing: 8/12/16/24/32/48/64/88. Type: body16px/1.7, small14px, h3 22px, h2 clamp(28px,3.5vw,44px), internal h1 clamp(34px,4.8vw,64px). Arabic headings1.5. Visible focus; keyboard-operated selectors; reduced-motion support; no horizontal page scroll at390px.

## Owner-approved refinement — 20 October 2026

Wordmark 34px desktop / 29px mobile, always LTR. Compact AR/EN control 44×36px with extended touch target. Shared English sans and Almarai Arabic; existing foreground/secondary tokens retained. Inputs and primary controls target 48px. Semantic warning #F2C66D is reserved for missing evidence, not a new decorative accent. Readability overlay 46% desktop / 55% mobile. The owner explicitly requires original automatic looping video playback with no play/pause controls. [Release](docs/agynexa-program/releases/VISUAL-UPGRADE-2026-10-20.md).


## Public navigation composition — local candidate, 27 October 2026

This candidate applies the existing identity to a clearer information architecture. Solutions answers which business workflow to complete; Industries supplies sector context; Capabilities explains the underlying abilities. Compact public headers pair a 32–44px h1 with a short lead. Catalog search, result count and exclusive native radio filters form one responsive unit, with URL state for return/bookmark/language behavior. Catalog cards use the existing 8px radius and measured palette; editorial detail sections use side-by-side labels and reading columns rather than repeated text cards.

Detail pages offer an optional native page index, an overview/workflow, operating boundaries and supporting reading, then one primary Studio action. Contextual returns retain catalog state. All ten capabilities, nine solutions and approved meaning remain. Industry facts become one column on narrow screens in both languages. Public styles are under `.public-page`; the original Hero files, video and their CSS rules are unchanged. [Local scope and reference ledger](docs/agynexa-program/releases/public-navigation-2026-10-27/README.md). Final local visual/interaction checks and owner review remain; this addition does not claim a production release.


### Owner correction — 28 October: read related information in place

The first local candidate's repeated catalog lenses are superseded. Solutions is the exploration starting point; each workflow opens in a native exclusive panel with its related capabilities/requirements available inline. Capabilities and industry examples use the same principle. Optional sector context is selected inside Solutions; users do not need to traverse three catalogs to understand a process. Separate pages remain small explicit share/reference links. Reference navigation is subordinate in the full menu and collapsed footer library.

Use large, named, keyboard-operable summaries with a visible chevron, one open panel per directory, prefixed embedded IDs, appropriate heading levels and URL-backed open selection. Reuse complete approved detail content with bounded related depth; avoid reciprocal panels and repeated page CTAs. The source revision remains local pending final verification; identity and Hero/video protection continue unchanged.

### Intermediate catalogue layout with sidebar — 5 November 2026

Use the [list-detail pattern](https://developer.android.com/develop/adaptive-apps/guides/canonical-layouts#list-detail) for choosing a solution, capability or sector. The 272px index and the reading area align to the same top edge at desktop width, with a 48px gutter. At narrow widths a labelled native select precedes the same reading area. Logical properties and the document direction mirror the layout in Arabic. The user-supplied Arabic Sales view is the reference case for the correction.

Use 48px selection controls, a single 24–36px detail heading, 16px reading text and a 70-character maximum reading measure. Summarize information, process and outcome in three equal columns on desktop and one column on mobile. Use the existing emerald selection token and quiet rules between sections. Keep supporting capability choices shallow and expose one related reading area. Put the extended workflow behind one plain reading control. This follows the separation of outcome and technical reading recorded in the [Kore research](docs/agynexa-program/prior-research/agynexa-kore-page-evidence.json).

The desktop header lists Solutions, Capabilities, Industries, Architecture, How to build and Integrations. The mobile menu groups Solutions, Capabilities, Industries and How to build under Explore. Standalone references and URL selection remain available.

### Catalogue controls after owner review

Use the project's existing shadcn/ui Input, Label and Button. Use a labelled [native select](https://ui.shadcn.com/docs/components/base/native-select) for choosing a catalogue item. Put search, the area or context filter, and the item selector in one aligned row with 48px fields, 8px corners and 16px gaps. Stack those same controls in reading order on phones. Industries needs only the sector selector. Use the approved short catalogue names in selectors and the accepted explanatory titles in the reading area. The count sits beside the controls and formats numbers in the current language.

One detail area follows the row. Summary facts and reading rules use the same typography and neutral separators in Solutions and Capabilities. Supporting actions use the standard Button and open in place. The current catalogue layout has no sidebar, separate row of filter buttons or set of selectable cards.

## Full platform and Studio upgrade — 5 November 2026

The owner's new scope authorizes the complete public/Studio upgrade and production release. Retain the current dark neutral/emerald tokens, original Hero components and original video. A concise Hero introduction leads to a clearly labelled workspace illustration, workflow explorer, concrete tool capabilities, build/test/activate journey and factual FAQ. Existing capability/solution catalogues retain their single selected reading area.

Studio uses a dedicated full-height shell with readable chat, a two-step configuration form, saved instructions, optional public research/Python tools and a separate activation area. Eleven sector presets supply editable starting briefs. Draft, test, requested and activated states must be distinguishable without relying on colour. Display tool evidence only from returned runtime metadata. Render Arabic messages in Almarai independently of the navigation language. Long code and data tables scroll inside their own containers rather than widening the page.

Authentication uses a two-column explanation and form on desktop, one ordered column on mobile. ChatGPT sign-in is availability-aware and must never imply entitlement to customer plan billing. Activation is email negotiation, without invented prices, checkout success or implied contracts. Public aggregate telemetry excludes private routes and query strings; session replay is removed from the shared application layout.

References: Humanizer writing review and Better Design spacing/form/comprehension guidance. Mobbin was attempted but paid access was unavailable; no Mobbin screen was used. Production visual evidence belongs in the [release receipt](docs/agynexa-program/releases/platform-upgrade-2026-11-05/README.md), and is pending until the release is actually inspected.
