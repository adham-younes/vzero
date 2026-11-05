# Codex cloud configuration — 5 November 2026

## Repository and production

Repository: adham-younes/vzero, branch main. PR78 merged at `3473504761ef67af4339732bd0bce9f62eee574c`. Vercel production `dpl_F1VAsvMUudET3SbSPnbbKScrpT6C` was verified READY at that source. The OAuth and plugin acceptance is recorded in [the mail receipt](../releases/private-mail-2026-11-05/OAUTH.md).

## Saved environment

The update was published successfully on 5 November at approximately 16:05 UTC. The configuration UI confirmed publication and loaded a new draft based on that published version. This verifies the reusable configuration, not the runtime HEAD of an already-running task.

The existing private vzero environment was found ready and runnable, bound to main. Its start skill was outdated (19 October: backend integrations described as specifications). The replacement [start skill](START-SKILL.md) records the actual backend/mail implementation, bounded checks, preservation requirements and safe main refresh. The existing install script and pnpm 12.3.4 were preserved.

Public internet access was already enabled. Only the OPENAI_API_KEY variable name was inspected; no value was opened or copied. No HTTP secrets were configured. Runtime provider authorization has not been tested in this task.

## Capability boundaries

- Codex Cloud computer/browser use is currently unsupported according to [OpenAI documentation](https://learn.chatgpt.com/docs/environments/cloud-environments#current-limitations). No browser or computer activation is claimed for this environment.
- ChatGPT Work Cloud computer settings separately show website approvals Always allow, including an existing agynexa.si override. Those settings were observed, not changed, and do not enable Codex Cloud browser use.
- Public network access permits requests but does not grant connector credentials. No blanket activation of all connectors was performed or verified.
- Search/crawl connectors exposed in a local conversation are not evidence of their availability in a cloud task. Discover and verify them in the actual executor. Do not copy personal credentials to the repository or the environment.
- Official documentation says repository refresh runs in the background; existing tasks retain their own saved files. Updating the environment does not rewrite running tasks or establish their HEAD. Start instructions require fetching and comparing current main before work.

The environment update does not change public website content, production secrets, database state, mail data or connector permission scopes. Password submission and durable Gmail ingestion remain separate outstanding items in the mail receipt.
