# NEXA Mail private plugin source

Version 0.1.1 is a private personal plugin connected to the verified NEXA Mail Connection app. `.app.json` references `asdk_app_6aeca1bd36408191a8583da02a0c31ac`; the obsolete API-key MCP configuration was removed. The owner-mail skill and existing presentation are preserved.

[Open NEXA Mail](https://chatgpt.com/plugins/plugins_6aec905359688191b39ffabc59232b22). Current release: `pluginrel_6aeca5801a9c8191872656638466d6b7`. Do not create a duplicate or publish it publicly.

OAuth uses required S256 PKCE, owner consent and revocable 30-day tokens. The production endpoint is `https://mail.agynexa.si/api/private-mail/mcp`. ChatGPT UI and the permission API confirm Allow all actions. Ordinary ChatGPT successfully searched and read the acceptance message without sending mail or changing settings.

Scopes are `mail:read`, `mail:reply`, and `knowledge:read`. Full access does not bypass sensitive-message review, duplicate prevention, owner validation or token expiry. No secrets belong in this source, archives, URLs or logs.

The package does not connect Gmail background ingestion or synchronize ChatGPT memory. Approved facts are managed in the private knowledge interface. Password setup is available in authenticated mailbox Settings; only the user enters and submits a new password.
