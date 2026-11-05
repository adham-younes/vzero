"""Isolated PostgreSQL checks; storage schema fixture only, no real mail."""
import subprocess,uuid,json,concurrent.futures
from pathlib import Path

DB='owner_mail_test_'+uuid.uuid4().hex
subprocess.run(['docker','exec','owner-mail-test-db','createdb','-U','postgres',DB],check=True)
def sql(s,fail=False):
 p=subprocess.run(['docker','exec','-i','owner-mail-test-db','psql','-U','postgres','-d',DB,'-q','-v','ON_ERROR_STOP=1','-At'],input=s,text=True,capture_output=True)
 if fail: assert p.returncode!=0;return
 assert p.returncode==0,p.stderr
 return p.stdout.strip().splitlines()[-1] if p.stdout.strip() else ''
sql("do $$ begin if not exists(select 1 from pg_roles where rolname='anon') then create role anon;create role authenticated;create role service_role bypassrls;end if;end $$;create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint);")
sql(Path('supabase/migrations/20261105094302_owner_mail_archive.sql').read_text())
for role in ['anon','authenticated']:
 for table in ['owner_mail_jobs','owner_mail_settings','owner_mail_archive']:
  sql(f'set role {role};select * from public.{table};',True)
 sql(f"set role {role};select public.owner_mail_claim(null,'{uuid.uuid4()}');",True)
assert sql("select count(*) from pg_class where relname like 'owner_mail_%' and relkind='r' and relrowsecurity")=='3'
sql("update public.owner_mail_settings set auto_reply=true")
uid=lambda:str(uuid.uuid4())
def add(n):
 eid=uid();sql(f"set role service_role;insert into public.owner_mail_jobs(id,inbox,inbox_id,thread_id,email_id,direction,folder) values ('{n}','adham@agynexa.si','{uid()}','{uid()}','{eid}','inbound','inbox')")
def claim(n,l):return json.loads(sql(f"set role service_role;select public.owner_mail_claim('{n}','{l}');") or 'null')
def reserve(n,l,sender='external@example.test',text='original'):
 return sql(f'''set role service_role;select public.owner_mail_reserve_send('{n}','{l}','{sender}','{{"text":"{text}"}}');''')
add('one');a,b=uid(),uid()
with concurrent.futures.ThreadPoolExecutor(2) as e:results=list(e.map(lambda l:claim('one',l),[a,b]))
assert sum(r is not None for r in results)==1
winner=next(r['lease'] for r in results if r)
assert reserve('one',winner)=='reserved'
assert reserve('one',winner,text='CHANGED')=='reserved'
assert sql("select reply->>'text' from owner_mail_jobs where id='one'")=='original'
sql("update owner_mail_jobs set lease_until=now()-interval '1 second' where id='one'")
new=uid();assert claim('one',new)
assert reserve('one',winner)=='lease_lost'
assert reserve('one',new)=='reserved'
sql("update owner_mail_jobs set first_send_at=now()-interval '24 hours' where id='one'")
assert reserve('one',new)=='send_uncertain'
add('two');l=uid();claim('two',l);assert reserve('two',l)=='reserved'
add('three');l=uid();claim('three',l);assert reserve('three',l)=='sender_limit'
sql("update owner_mail_settings set auto_reply=false where inbox='adham@agynexa.si'")
assert reserve('three',l,'other@example.test')=='disabled'
sql("set role service_role;delete from owner_mail_jobs",True)
assert sql("select public from storage.buckets where id='owner-mail'")=='f'
print('PASS: private roles/RLS, one concurrent claimant, immutable send reservation, expired leases, stale send cutoff, sender cooldown, disabling, no delete grants, private bucket')
