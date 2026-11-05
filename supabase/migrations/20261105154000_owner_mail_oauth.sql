create table public.owner_mail_oauth_codes (
 code_hash text primary key check(length(code_hash)=64),
 consent_hash text not null unique check(length(consent_hash)=64),
 owner_id uuid not null references auth.users(id),
 client_id text not null,
 redirect_uri text not null,
 challenge text not null check(length(challenge)=43),
 resource text not null,
 expires_at timestamptz not null,
 consumed_at timestamptz,
 created_at timestamptz not null default now()
);
alter table public.owner_mail_oauth_codes enable row level security;
revoke all on public.owner_mail_oauth_codes from public,anon,authenticated;
grant select,insert,update on public.owner_mail_oauth_codes to service_role;
