import type {MailCapabilities,NEXA_IDENTITY} from './types'
export type MailFeedKind='audit'|'received'|'sent'
export type MailActivityItem={id:string;createdAt:string;kind:string;objectId:string;actorId:string|null;threadId:string|null;subject:string;sender:string;recipients:string[];metadata:Record<string,string|number|null>}
export type MailFeed={identity:typeof NEXA_IDENTITY;capabilities:MailCapabilities;kind:MailFeedKind;items:MailActivityItem[];hasMore:boolean;nextCursor:string|null;latestCursor:string|null}
export function mergeMailActivity(current:MailActivityItem[],incoming:MailActivityItem[]){return [...new Map([...current,...incoming].map(x=>[x.id,x])).values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)||b.id.localeCompare(a.id)).slice(0,200)}
export function newInboundActivity(current:MailActivityItem[],incoming:MailActivityItem[]){const seen=new Set(current.map(x=>x.id));return incoming.filter(x=>x.kind==='received'&&!seen.has(x.id)).length}
