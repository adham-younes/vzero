# NEXA Mail private plugin source

This directory is source for the private, owner-authorized NEXA Mail plugin. Version 0.1.0 was packaged and created in the owner’s personal account through Plugin Creator. Installation and authentication inside ChatGPT remain pending.

The `url` in `mcp.json` uses the dedicated `mail.agynexa.si` host. DNS and the Vercel domain binding are verified; the application deployment is READY and bounded HTTP/MCP server acceptance passed. This is separate from installation and authenticated use inside ChatGPT, which remain pending.

The source preserves the existing server's Streamable HTTP transport and API-key bearer authentication. It does not provision hosting or introduce OAuth. The source-level server currently negotiates MCP `2025-03-26`; POST returns JSON and GET returns 405.

## Connection and credential handling

- Configure the dedicated console host with `NEXA_MAIL_CONSOLE_HOST=mail.agynexa.si`, apply the connector-token migration, and retain the configured owner allowlist. The host binding and production isolation require verification before release.
- Mint a connector token through the authenticated owner console. Store it only through the host's secure API-key connection flow. Never put it in this folder, an archive, Git, a URL, a prompt, or logs.
- The server stores a hash only. Tokens expire after 30 days and can be revoked by the owner. Each request checks expiry, revocation, the live owner profile, and the owner allowlist.
- Supported scopes are `mail:read`, `mail:reply`, and `knowledge:read`. The four tools are defined in the application source; live tool discovery and authentication remain unverified until connection.

## Release handoff

1. Confirm the deployed endpoint and authenticated MCP discovery; DNS alone is insufficient.
2. Parse the final JSON and skill frontmatter. Confirm all referenced files are contained in this directory and that no credentials, dependency folders, symlinks, or unrelated data are included.
3. Package this one plugin outside its source directory only after the endpoint is verified. The enclosing directory and root manifest name must agree.
4. Save it through the private plugin workflow. Do not submit it to a public directory. Record the returned plugin and release identifiers for future updates.
5. Connect through the host's secure credential flow. Verify tool discovery and read-only access first. An installation response alone is not proof that the connection works. Do not send an email merely to test authentication.

The owner workflow is in `skills/owner-mail/SKILL.md`. Knowledge supplied through MCP excludes owner-private notes. The shared sending service controls sensitive holds and duplicate sends. This package does not connect Gmail or ChatGPT memory and does not configure background execution.


## Created account package

NEXA Mail 0.1.0: [open the private plugin](https://chatgpt.com/plugins/plugins_6aec905359688191b39ffabc59232b22), identifier `plugins_6aec905359688191b39ffabc59232b22`. Do not create it again. The submitted archive predates this receipt update; its README retains the earlier handoff wording. The tools and configuration are unchanged, and this documentation-only update does not require republishing. Server QA discovered all four tools and verified guarded sending; connection inside ChatGPT still requires secure authentication and in-host verification.
