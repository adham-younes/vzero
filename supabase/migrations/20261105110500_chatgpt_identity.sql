-- Identity-only OIDC records. ChatGPT subscription tokens are not accepted or stored.
create table public.chatgpt_oauth_transactions(
 state_hash text primary key check(state_hash ~ '^[a-f0-9]{64}$'),browser_hash text not null check(browser_hash ~ '^[a-f0-9]{64}$'),
 code_verifier text not null,nonce text not null,locale text not null check(locale in ('ar','en')),
 user_id uuid references auth.users(id) on delete cascade,expires_at timestamptz not null,created_at timestamptz not null default now()
);
create index chatgpt_oauth_expiry on public.chatgpt_oauth_transactions(expires_at);
create table public.chatgpt_identities(
 issuer text not null check(issuer='https://auth.openai.com'),client_id text not null,subject text not null,
 user_id uuid not null references auth.users(id) on delete cascade,created_at timestamptz not null default now(),
 primary key(issuer,client_id,subject),unique(issuer,client_id,user_id)
);
alter table public.chatgpt_oauth_transactions enable row level security;
alter table public.chatgpt_identities enable row level security;
revoke all on public.chatgpt_oauth_transactions,public.chatgpt_identities from public,anon,authenticated;
grant all on public.chatgpt_oauth_transactions,public.chatgpt_identities to service_role;
