-- Owner-only MCP credentials. Raw bearer secrets never enter this table.
create table public.owner_mail_connector_tokens (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references public.profiles(id) on delete cascade,
 name text not null check (char_length(name) between 1 and 80),
 token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
 scopes text[] not null default array['mail:read','mail:reply','knowledge:read']::text[]
  check (cardinality(scopes) between 1 and 3 and array_position(scopes,null) is null
   and scopes <@ array['mail:read','mail:reply','knowledge:read']::text[]),
 created_at timestamptz not null default now(),
 expires_at timestamptz not null,
 revoked_at timestamptz,
 check (expires_at>created_at)
);
create index owner_mail_connector_tokens_owner on public.owner_mail_connector_tokens(owner_id,created_at desc);
alter table public.owner_mail_connector_tokens enable row level security;
revoke all on public.owner_mail_connector_tokens from public,anon,authenticated;
grant select,insert,update on public.owner_mail_connector_tokens to service_role;
