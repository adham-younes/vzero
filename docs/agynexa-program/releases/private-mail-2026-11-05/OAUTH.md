# Direct ChatGPT connection — verified 5 November 2026

Status: **CONNECTED_ALLOW_ALL_READ_VERIFIED**.

- Product PR77 merged at `a25c8c815d2f82c26aa96a810b788c175bf0df81`; Vercel `dpl_8ogX3jmQpPaesA9Ma2eTfLDYfRbq` verified READY.
- Actual app `asdk_app_6aeca1bd36408191a8583da02a0c31ac` connected through OAuth. Both ChatGPT settings and the permissions API confirm **Allow all actions**.
- OAuth code consumed at 15:45:14 UTC. The revocable 30-day token expires 2026-12-05T15:45:15.028Z. No token or code is included in this receipt.
- Ordinary ChatGPT searched and read only the acceptance message and reported its existing sent reply state. No mail was sent and no setting changed during this check.
- Private NEXA Mail plugin 0.1.1, release `pluginrel_6aeca5801a9c8191872656638466d6b7`, now references the actual app through `.app.json`. Readback verified the binding and removal of obsolete MCP key configuration; the owner-mail skill is preserved.
- Password setup is deployed under authenticated Settings. User entry/submission is still pending confirmation. Login uses the existing owner account, not the managed mailbox address.
- Gmail background ingestion remains unconnected. ChatGPT memory is not synchronized automatically. Sensitive holds, duplicate prevention, owner checks and token expiry remain enforced.

## Earlier implementation checkpoints

The following dated development notes are historical; pending-activation statements are superseded by the verified status above.

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

Consent now disables its button during submission and uses a same-origin fetch followed by top-level callback navigation. This avoids repeat native form submissions and makes return-to-ChatGPT explicit. The server keeps its same-origin/signature/owner checks and a standard 303 fallback. No token or code is logged.
