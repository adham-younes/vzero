# Functional map — internal research

Checked 2026-10-19. DOCUMENTED means stated by the source, not independently executed. Marketing pages are vendor descriptions. Audience/problem and mapping to AGYNEXA are our INFERRED interpretation.

| Area | Source | Inputs → workflow → outputs | Proposed family | Evidence boundary |

|---|---|---|---|---|

| Customer service | [Customer service](https://kore.ai/customer-experience) | Customer request and approved service knowledge → Classify, retrieve, respond or route → Response or handoff | ServiceFlow | Marketing evidence; production behavior UNKNOWN |

| Employee operations | [Employee operations](https://kore.ai/employee-experience) | Employee question and permitted organizational context → Search or coordinate a bounded employee task → Answer or service request | WorkOps | Marketing evidence; permission implementation UNKNOWN |

| Process automation | [Process automation](https://kore.ai/ai-for-process/ap) | Invoice and business records → Review, reconcile and route exceptions → Review package | ProcessOps | Marketing evidence; private workflow UNKNOWN |

| Durable workflows | [Durable workflows](https://docs.kore.ai/agent-platform/workflows.md) | Versioned workflow, typed node inputs and policies → Execute agent/API/human steps with durable state and timeouts → State and node results | AgentFabric | DOCUMENTED pattern; not executed |

| Runtime | [Runtime](https://docs.kore.ai/agent-platform/runtime.md) | Validated request and runtime configuration → Execute, trace, categorize failure and retry within policy → Typed output and run trace | InsightLoop | DOCUMENTED; vendor runtime not tested |

| Knowledge retrieval | [Knowledge retrieval](https://docs.kore.ai/agent-platform/knowledge.md) | Files, websites, connectors and access metadata → Retrieve/rerank then apply documented permission filtering before delivery → Permitted retrieved context | KnowledgeGrid | DOCUMENTED; our proposed design prefilters tenant/ACL and rechecks before disclosure |

| HTTP tools | [HTTP tools](https://docs.kore.ai/agent-platform/tools/http.md) | REST/SOAP request schema and auth profile → Authenticate, invoke with bounded timeout and retry → Validated tool result | ConnectLayer | DOCUMENTED; endpoint access still required |

| MCP tools | [MCP tools](https://docs.kore.ai/agent-platform/tools/mcp.md) | Approved MCP server and auth configuration → Discover allowed tools; invoke validated calls → Tool result | ConnectLayer | DOCUMENTED; no public tools executed |

| SOAP services | [SOAP services](https://docs.kore.ai/agent-platform/tools/wsdl-repo.md) | WSDL document and reachable service → Parse operations and bind tool inputs to SOAP service → Operation result | ConnectLayer | DOCUMENTED; actual credentials UNKNOWN |

| Guardrails | [Guardrails](https://docs.kore.ai/agent-platform/safety-and-guardrails.md) | Policy and workflow inputs/outputs → Evaluate configured guardrails; distinguish guidance from enforcement → Allowed, blocked or escalated state | ControlPlane | DOCUMENTED; enforcement must be tested separately |

| Sensitive data | [Sensitive data](https://docs.kore.ai/agent-platform/pii-protection.md) | Configured sensitive fields and consumer policy → Redact or restrict data according to configuration → Minimized downstream data | ControlPlane | DOCUMENTED vendor controls; no equivalence claimed for AGYNEXA |

| Permissions | [Permissions](https://docs.kore.ai/agent-platform/permissions-reference.md) | Role/resource/action assignments → Authorize bounded resource actions → Allow/deny decision | ControlPlane | DOCUMENTED; our roles are an independent proposal |

| Webhook channels | [Webhook channels](https://docs.kore.ai/agent-platform/channels/webhook.md) | Authenticated event payload → Verify negotiated channel auth, accept at-least-once delivery, deduplicate → Queued event and callback | VoiceBridge | DOCUMENTED: channel auth is not automatically the async tool callback signature |

## Coverage and unresolved items
Voice, agent-assist and evaluation are distinct service scopes, not proven live capabilities of this website. Public service/work pages inform their business framing; provider API contracts come from provider documentation in architecture/integration-matrix.csv. Account-level latency, pricing, certification, tenant settings and proprietary implementations are UNKNOWN.

The site currently describes migration to Artemis. Preserve source date and URL; do not silently equate older product pages with current runtime semantics. Eleven inaccessible whitepapers stay marked HTTP 404. Research was public and read-only; no demo submitted and no vendor account used.
