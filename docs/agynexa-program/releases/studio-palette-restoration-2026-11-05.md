# Restore the original Studio palette — 5 November 2026

The owner rejected the green-tinted backgrounds and text added by the platform upgrade. The pre-upgrade source `a5a503a` used the shared design variables. This correction restores those variables throughout the Studio entry, builder, chat, knowledge, configuration and activation surfaces.

Palette: background `#050505`; card/popover `#0B0B0B`; muted `#111111`; secondary `#151515`; foreground `#EBEBEB`; muted foreground `#BFBFBF`; primary `#10B981`. Borders and form controls use the existing border/input tokens. Warning colours use the existing semantic warning token. Black backdrop/shadow opacity remains unchanged.

Only colour declarations change in `@components/studio-chat.module.css`. A source comparison confirmed unchanged selectors, layout, spacing, typography, component structure and behavior. No runtime, model, data, environment, public-page or Hero/video changes are included. The branch also carries the already completed platform release's final documentation receipt from `f473394`.

Pre-release checks: `pnpm build` including TypeScript passed. CSS diff review confirmed that only colour declarations changed and no custom green/grey palette literals remain. Functional/model tests are not repeated for a colour correction. Final acceptance is a production browser check of the actual computed palette and the Arabic/English surfaces; the result is appended to the release PR after deployment.

## Production acceptance

[PR67](https://github.com/adham-younes/vzero/pull/67) merged as `a7b2f0ab0517071dd521577e8d65f8331dc660a0`. Production deployment `dpl_2LE5xagbkjHc95kdRcmNJnX36aAz` reached READY at 2026-11-05T12:01:03.216Z, with agynexa.si and www.agynexa.si aliases.

The production sidebar browser confirmed background `rgb(5,5,5)`, sidebar/composer/inspector and configuration/activation surfaces `rgb(11,11,11)`, user messages `rgb(21,21,21)`, main text `rgb(235,235,235)`, secondary text `rgb(191,191,191)` and send action `rgb(16,185,129)`. Arabic conversation, English configuration and activation were reviewed. Existing saved content remained visible. No model execution or data mutation was needed. [Measured palette](studio-palette-restoration-2026-11-05.json).

The full viewport screenshot remains local because it contains the owner's account label. The public receipt includes only non-secret colour measurements and release identifiers. This final evidence is recorded on the delivery branch without another production deployment.
