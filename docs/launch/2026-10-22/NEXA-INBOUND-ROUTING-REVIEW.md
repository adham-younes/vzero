# NEXA inbound routing — current exact managed target, 22 October 2026

The owner's later cloud-email authorization supersedes the earlier local-only review restriction for necessary NEXA infrastructure. Current implementation, checks, provider configuration and release state: [cloud mail record](NEXA-CLOUD-MAIL.md). Studio PR42 remains a separate historical UI release.

Public identity: **NEXA Agent | AGYNEXA AI Assistant <nexa.agent@agynexa.si>**. Existing Resend inbox confirmed by connector; do not create another inbox. Its exact receiving address is **b24184f6@iejioorkau.resend.app**. This is the selected managed route; no subdomain/DNS proposal is needed.

Expected route: public NEXA address → dedicated Spacemail NEXA mailbox or documented exclusive recipient rule (NOT ESTABLISHED) → exact existing managed target → signed cloud webhook → durable deduplicated plain-text message and audit → authorized private mailbox/activity UI.

The apex domain remains at Spacemail with existing MX and nameservers unchanged. An alias on the owner's main mailbox plus ordinary all-mail forwarding is excluded: that would expose unrelated personal email. No personal mailbox, alias, forwarding or DNS was changed. Whether an existing unused dedicated mailbox seat is available remains unknown; no purchase is authorized. [Spacemail aliases](https://www.spaceship.com/en-GB/knowledgebase/setup-email-aliases-spacemail/) and [forwarding behavior](https://www.spaceship.com/knowledgebase/getting-started-with-spacemail/).

Both signed event and fetched message must have exactly one normalized matching final recipient. Empty/mixed/duplicate/wrong recipients fail. Original-To, Delivered-To, received_for and authentication headers never substitute for this check and do not establish forwarding provenance. The provider fetch uses only the verified event's exact UUID. Direct delivery to the managed target can satisfy the technical ingress check; it does not prove a forward from Spacemail.

The existing fixed sender and provider account are separate from technical ingress. No raw HTML, attachment contents, URL fetch or automatic tool/action is triggered by mail. No actual outgoing message/test/campaign is authorized as a verification shortcut. Actual controlled incoming verification can occur only after the dedicated upstream route exists; do not claim receiving from configuration alone.

The configuration example is inert documentation, with feature flags false. Production settings/release state and exact rollback are recorded in the cloud record. Signing secrets and provider credentials never belong in the example or repository. [Resend receiving contract](https://resend.com/docs/dashboard/receiving/create-receiving-webhook).
