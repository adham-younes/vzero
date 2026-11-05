# Production acceptance — 5 November 2026

## Release identity

Main product release: PR65, merge `840c58d1933f398425dd6d4f8f69e36f83692936`. Vercel deployment `dpl_CC3WWdPxh15yMuG56ANfAmhiSNeF` reached READY and served `https://agynexa.si`. The supplied historical deployment `d56b775` was not used as an assumed current checkout.

A focused acceptance follow-up preserves Studio briefs through language/auth transitions, hides provider sandbox URLs in readable responses, adds the four legal WebPage/Breadcrumb graphs and increases breadcrumb touch targets to44px. Its final production receipt is appended to the follow-up PR after deployment. These are two production application revisions within the same authorized upgrade; do not describe them as a single deployment.

## Demonstrated production behavior

- All68 sitemap pages returned200 with one H1, unique titles/descriptions/main content, correct locale/canonical/hreflang and valid structured JSON. Additional60 public query and entry destinations returned200. Public links and rendered fragment targets passed. The legal schema consistency gap found in this pass is addressed by the follow-up.
- Sidebar-browser review covered preserved video/brand, English and Arabic home, interactive agent layers, Arabic mobile navigation and capability selection, Arabic architecture, and authenticated Studio in both languages. Geometry was captured at390/1440/1728px. Connector measurement is not visual certification; default-spacing-scale warnings include deliberate responsive margins and existing project spacing.
- A synthetic private Operations agent was created through the builder, its exact proposed configuration reviewed and approved, and both tools enabled. Saving and reloading preserved agent/conversation data.
- Run `88660038-cbe4-44af-8355-b94594e15280` completed with OpenAI `gpt-6.1-terra`, high reasoning and platform trial billing. Web search and Code Interpreter completed, with13 stored sources and one artifact. Provider latency10652ms;11379 input and459 output tokens.
- Python calculated120+180+240=540 and mean180. The protected artifact link downloaded `shipment-verification.csv` through the authenticated browser. File contents contain A120, B180, C240 and total540. SHA256: `8e3760a6007b675883523a751fe4929bed11e375af04fdae9b0fe7b68111bc09`.
- A synthetic shipment policy was saved privately. After changing response language to Arabic and disabling optional tools, a second run answered from that source: cost240 exceeds the200 review threshold; cutoff14:00UTC. The UI exposed the exact supporting excerpt and correctly said the agent cannot approve or dispatch the shipment.
- An activation request was saved after the successful initial trial. The email link targets `adham@agynexa.si` with no fixed price or terms. No email was sent and no agreement or payment was made. Reopening an existing request returns its saved status; it is not evidence of a new revision test.
- The application displayed the customer OpenAI-key form and kept publication unavailable for the unactivated synthetic agent. Anonymous requests to credential, activation, operator and artifact routes returned401. Database health returned200/ok. Removed mailbox routes returned404.

## Database and provider state

Both repaired additive migrations are applied and recorded; see DATABASE.md. Four new sensitive tables have RLS and service-only privileges. Existing data was retained. The existing leaked-password-protection advisory was not changed.

The deployed platform key has now demonstrated actual Terra inference, web search, Python, artifact generation/download and grounded Arabic output. Presence of an environment variable alone was not accepted as proof.

## Boundaries

Customer-owned API connection, commercial operator activation, published customer-key execution, credential revocation during a concurrent run, widget publication, email delivery and payment settlement were not exercised with a real customer's credentials or commercial agreement. They must not be represented as tested business transactions. No card processor or fixed checkout is configured; the requested commercial flow is negotiation by email.

ChatGPT sign-in remains disabled because an issued client ID/approved redirect is not configured. OIDC and return-context code are implemented; no live ChatGPT login or subscription-funded runtime is verified.

Tripo device authorization completed. The API account reports0 credits; the separate Studio account shows200. Its Free pricing currently says non-commercial use and restricted exports, while a help article differs on attribution rights. No generation, purchase or subscription was submitted and0 credits were spent. Production diagrams are original SVG/CSS, not Tripo assets. See evidence/tripo-availability.json. Mobbin required a paid plan and supplied no viewed references.

Public metadata and content improvements are implemented and checked; search ranking, all-sector efficacy, general external-system execution and enterprise shared-team access are not established by these tests.

## Evidence handling

Only synthetic task content, public page metadata and redacted/non-secret operational identifiers appear in this receipt. No customer chat, API key, session cookie or raw environment value is committed. The test agent and its request remain private, clearly named as release verification, with no external publication.
