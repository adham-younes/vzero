# Direct ChatGPT connection — 5 November 2026

Status: DEPLOYED_DISCOVERY_VERIFIED_OWNER_CONSENT_PENDING.

Production: PR74 merged at `f0046208a265d48cbbf62e514b0bc9f29986166c`; deployment `dpl_BRZyZ9NQ4XzXeSVuJ8R4X5gDCKuz` is READY. Cloud build passed. Seven production checks passed: authorization metadata, resource metadata, public-host isolation, authenticated MCP challenge, foreign redirect rejection, plain PKCE rejection and unknown-code rejection. ChatGPT custom MCP UI discovered the exact endpoints, stable callback and all three scopes. The provided public client is entered. Creating the connection and granting owner access await action-time confirmation. No OAuth token has been issued at this checkpoint.

The private plugin archive contains API-key MCP configuration, but ChatGPT custom MCP setup offers OAuth and no-authentication, not an API-key prompt. The standalone archive is not evidence of a connected app. The existing Resend ChatGPT OAuth grants have full_access independently. Both backend mailbox auto_reply settings and the minute retry scheduler are enabled; two automatic sends and the guarded manual test are recorded.

This increment adds a private owner OAuth authorization-code flow with required S256 PKCE. Its public client is `nexa-mail-chatgpt`, using token endpoint authentication `none` and only `https://chatgpt.com/connector_platform_oauth_redirect`. Metadata and authorization responses identify issuer `https://mail.agynexa.si`; the resource is the exact private MCP URL. The owner signs in using the existing session and explicitly consents. A signed ten-minute form is owner-bound. Opaque five-minute codes are hashed and consumed atomically once; consent cannot be reused. Redirect, client, verifier, resource, expiry and owner access are checked. Tokens retain existing three scopes, 30-day expiry, revocation, rate limits and sensitive-message safeguards. No refresh token or anonymous mail access is introduced.

The additive OAuth-code table is service-only with RLS and no anonymous/authenticated grants. No mail or attachments are deleted. New read-only discovery paths are confined to the mail host. The original site, Studio and branding remain unchanged.

Final activation requires creating the private ChatGPT MCP connection with provided public client ID, approving the concrete owner consent, selecting full access for the resulting actual app, and a harmless tools/read check. Do not call archive installation or Resend access proof of this direct connection.

Reference: https://developers.openai.com/plugins/build/auth

During actual ChatGPT initiation, the authorization request reached the POST consent guard with URL parameters and returned invalid_origin. Initiation POSTs with valid OAuth URL parameters now normalize to GET without issuing a code. The consent form posts to a query-free explicit same-origin action and retains its Origin, signature, expiry and owner checks. Final connection remains pending acceptance.

A fresh authorization GET showed the consent page, but its native HTML form still returned invalid_origin. The authorization document inherited no-referrer, which can give non-CORS form POSTs a null Origin. Only that document now uses same-origin referrer policy; the exact Origin guard is retained, and cross-origin callback navigation still sends no referrer. This supersedes the initial POST-initiation diagnosis; the normalizer remains a harmless compatibility path.

Owner follow-up: add a private password-setting form for the existing authenticated AGYNEXA owner, with same-origin JSON mutation, length checks and rate limiting. The owner must enter and submit the password locally; no password is read, generated or stored in task artifacts. An already consumed magic link no longer hides an existing valid session. Password entry and final OAuth connection remain pending user/browser acceptance.
