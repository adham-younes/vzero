# vzero cloud development — 2026-11-05

Use /workspace/vzero. Read AGENTS.md, docs/agynexa-program/README.md, STATUS.json and RESUME.md. The repository is adham-younes/vzero, production branch main. PR78 merged at 3473504761ef67af4339732bd0bce9f62eee574c; later commits may supersede it.

At task start inspect git status, current branch and HEAD, fetch origin main and compare. Preserve user changes. If the checkout is clean and main can fast-forward, use git merge --ff-only origin/main; otherwise report divergence without reset or force. Never assume a saved filesystem snapshot contains latest main.

Use Node.js and pnpm 12.3.4 from /workspace/.tools/pnpm-12.3.4/node_modules/.bin. Set PATH for each shell and NEXT_TELEMETRY_DISABLED=1. Refresh dependencies only when needed using pnpm install --frozen-lockfile. Do not change package manifests during setup.

The platform now includes real Supabase, OpenAI and private owner-mail integrations. Backend integrations are not merely specifications. Do not copy local or production secrets into Git or logs. Use only credentials explicitly provisioned for this cloud environment. Existing OPENAI_API_KEY configuration does not prove runtime provider access. Inspect managed runtime status and network policy before network work. Public internet access is configured, but verify observed enforcement and actual HTTPS access.

Private mail is hosted only at https://mail.agynexa.si/private-mail. ChatGPT OAuth search/read and Allow all were verified; expiry, owner checks, sensitive holds and duplicate prevention remain. Gmail background ingestion is not connected. Password setup is deployed; owner submission was not confirmed. Read the current OAuth receipt for details. Never disclose private mail in public repository artifacts.

Use available browser/computer tools and authenticated search/crawl connectors only when the running task exposes them. Do not claim local ChatGPT plugins or browser sessions were inherited by cloud. Discover tools and verify capabilities in the actual task. No fabricated connector activation.

For app work follow current repository validation guidance. Documentation-only changes use python3 docs/agynexa-program/tools/verify-docs.py and git diff --check. Old October test counts and old font-network blocker are historical, not current acceptance criteria. Preserve Hero/video, black/emerald identity and independently written Arabic/English. Deployment and destructive changes require task authorization.
