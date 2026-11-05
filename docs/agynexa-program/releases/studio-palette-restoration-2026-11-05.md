# Restore the original Studio palette — 5 November 2026

The owner rejected the green-tinted backgrounds and text added by the platform upgrade. The pre-upgrade source `a5a503a` used the shared design variables. This correction restores those variables throughout the Studio entry, builder, chat, knowledge, configuration and activation surfaces.

Palette: background `#050505`; card/popover `#0B0B0B`; muted `#111111`; secondary `#151515`; foreground `#EBEBEB`; muted foreground `#BFBFBF`; primary `#10B981`. Borders and form controls use the existing border/input tokens. Warning colours use the existing semantic warning token. Black backdrop/shadow opacity remains unchanged.

Only colour declarations change in `@components/studio-chat.module.css`. A source comparison confirmed unchanged selectors, layout, spacing, typography, component structure and behavior. No runtime, model, data, environment, public-page or Hero/video changes are included. The branch also carries the already completed platform release's final documentation receipt from `f473394`.

Pre-release checks: `pnpm build` including TypeScript passed. CSS diff review confirmed that only colour declarations changed and no custom green/grey palette literals remain. Functional/model tests are not repeated for a colour correction. Final acceptance is a production browser check of the actual computed palette and the Arabic/English surfaces; the result is appended to the release PR after deployment.
