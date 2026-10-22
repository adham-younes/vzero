export const NEXA_IDENTITY={address:'nexa.agent@agynexa.si',displayName:'NEXA Agent AI Business Assistant AGYNEXA',isAI:true} as const
export type AttachmentMetadata={id:string;filename:string|null;content_type:string;size:number}
export type VerifiedInbound={event_id:string;email_id:string;payload_hash:string;recipients:string[];created_at:string}
export type InboundMessage={provider_email_id:string;from_address:string;from_display:string;to:string[];cc:string[];subject:string;text:string;text_available:boolean;text_truncated:boolean;original_text_bytes:number;message_id:string|null;in_reply_to:string|null;references:string[];attachments:AttachmentMetadata[];provider_created_at:string}
export type SendPayload={from:string;to:string[];cc:string[];bcc:string[];subject:string;text:string;headers:Record<string,string>}
export type ProviderDomain={status:'verified'|'pending'|'unavailable';accountMatched:boolean}
export interface MailProvider{domain():Promise<ProviderDomain>;receive(emailId:string):Promise<unknown>;send(payload:SendPayload,idempotencyKey:string):Promise<{id:string}>}
export type MailThread={id:string;subject:string;external_sender:string;last_message_at:string;message_count:number;is_read:boolean;archived:boolean}
export type MailMessage=InboundMessage&{id:string;thread_id:string;created_at:string;direction:'inbound'|'outbound';sender_trust:'unverified'|'nexa'}
export type MailDraft={id:string;thread_id:string|null;version:number;payload:SendPayload;snapshot_hash:string;approved_version:number|null;approved_hash:string|null;status:'draft'|'approved'|'queued';created_at:string;updated_at:string}
export type OutboxStatus='queued'|'sending'|'accepted'|'rejected'|'delivery_unknown'
export type MailOutbox={id:string;draft_id:string;draft_version:number;payload:SendPayload;snapshot_hash:string;status:OutboxStatus;provider_id:string|null;error_code:string|null;first_attempt_at:string|null;created_at:string;updated_at:string}
export type MailCapabilities={receiveConfigured:boolean;sendEnabled:boolean;autoSend:false;ownerMailboxDelegated:false;chatGPTConnected:false}
export type MailOverview={providerDomain?:ProviderDomain;identity:typeof NEXA_IDENTITY;capabilities:MailCapabilities;threads:MailThread[];drafts:MailDraft[];outbox:MailOutbox[];hasMore:boolean;nextCursor:string|null;folder:string}
export type MailThreadDetail={thread:MailThread;messages:MailMessage[];hasMore:boolean;nextCursor:string|null}
