-- Service-only projection. Anonymous and normal authenticated users cannot query it.
create view public.owner_mail_console_messages with (security_invoker=true) as
select a.id,a.inbox,a.source,a.direction,a.folder,a.subject,a.sender,a.recipients,a.message_at,
left(a.text_body,240) as preview,jsonb_array_length(a.attachments) as attachment_count,
coalesce(j.state,case when a.direction='historical' then 'historical' else 'archived' end) as reply_state,
j.reason as review_reason
from public.owner_mail_archive a left join public.owner_mail_jobs j on j.id=a.id;
revoke all on public.owner_mail_console_messages from public,anon,authenticated;
grant select on public.owner_mail_console_messages to service_role;
create table public.owner_mail_console_audit(
 id uuid primary key default gen_random_uuid(),actor uuid not null,
 action text not null,resource_id text,created_at timestamptz not null default now()
);
alter table public.owner_mail_console_audit enable row level security;
revoke all on public.owner_mail_console_audit from public,anon,authenticated;
grant select,insert on public.owner_mail_console_audit to service_role;
