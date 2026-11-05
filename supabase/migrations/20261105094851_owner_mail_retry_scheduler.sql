-- Wake the durable queue only when work exists. No message cleanup or expiry.
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
select cron.schedule('owner-mail-retry','* * * * *', $cron$
 select net.http_post(
  url:='https://agynexa.si/api/owner-mail/worker',
  headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||s.decrypted_secret),
  body:='{}'::jsonb,
  timeout_milliseconds:=60000
 ) from vault.decrypted_secrets s
 where s.name='owner_mail_worker_token'
 and exists(select 1 from public.owner_mail_jobs where state='pending' and next_at<=now() and (lease_until is null or lease_until<now()));
$cron$);
