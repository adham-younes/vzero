# Direct ChatGPT connection — 5 November 2026

Status: IMPLEMENTED_PENDING_PRODUCTION_ACCEPTANCE.

The private plugin archive contains API-key MCP configuration, but ChatGPT custom MCP setup offers OAuth and no-authentication, not an API-key prompt. The standalone archive is not evidence of a connected app. The existing Resend ChatGPT OAuth grants have full_access independently. Both backend mailbox auto_reply settings and the minute retry scheduler are enabled; two automatic sends and the guarded manual test are recorded.

This increment adds a private owner OAuth authorization-code flow with required S256 PKCE. Its public client is `nexa-mail-chatgpt`, using token endpoint authentication `none` and only `https://chatgpt.com/connector_platform_oauth_redirect`. Metadata and authorization responses identify issuer `https://mail.agynexa.si`; the resource is the exact private MCP URL. The owner signs in using the existing session and explicitly consents. A signed ten-minute form is owner-bound. Opaque five-minute codes are hashed and consumed atomically once; consent cannot be reused. Redirect, client, verifier, resource, expiry and owner access are checked. Tokens retain existing three scopes, 30-day expiry, revocation, rate limits and sensitive-message safeguards. No refresh token or anonymous mail access is introduced.

The additive OAuth-code table is service-only with RLS and no anonymous/authenticated grants. No mail or attachments are deleted. New read-only discovery paths are confined to the mail host. The original site, Studio and branding remain unchanged.

Final activation requires creating the private ChatGPT MCP connection with provided public client ID, approving the concrete owner consent, selecting full access for the resulting actual app, and a harmless tools/read check. Do not call archive installation or Resend access proof of this direct connection.

Reference: https://developers.openai.com/plugins/build/auth
