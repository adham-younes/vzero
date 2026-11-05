# Owner mailbox migration — corrected privacy scope

The owner rejected placing the mailbox interface on the public AGYNEXA site. Remove /admin/mail, /ar/admin/mail, the earlier Nexa mailbox/activity pages in both locales, and the newly added archive reading/settings API. Native authenticated Resend inboxes are the mailbox UI; Supabase archive and the local Mac backup remain private. No messages or attachments are deleted. Historical mail cannot be imported directly into native Resend with the available API, so it stays in the verified private archive and local EML backup.

Verified: all 414 historical messages (11,065,933 bytes, four attachment parts) were read-back hash verified in private storage. Both inbox receipt events and one outgoing diagnostic were archived. Scheduled retry completed with HTTP 200. The live model diagnostic produced a contextual reply without sending mail. Reply settings are enabled for both inboxes; native provider agent actions disabled to avoid overlap.

The removed public page displayed mailbox addresses and controls before sign-in. Actual messages and downloads were protected by the existing owner session gate; production anonymous archive requests returned 401. No evidence of public message access was observed. The owner did not authorize a public-facing mailbox interface; this correction supersedes that implementation choice.

DNS still routes to SpaceMail. No MX changes or subscription cancellations have been performed. Backend signed webhook/worker/import routes remain server-only and authenticated; they do not expose a mailbox interface or anonymous archive reads. Remaining: verify removed routes return 404, confirm preferred private reading arrangement if needed, then public MX cutover, external reply acceptance and final read-only SpaceMail delta sync.

Historical deployment: PR #62 introduced the archive; PR #63 added a no-send model diagnostic. This receipt records their corrected scope, not approval of their previous public UI.
