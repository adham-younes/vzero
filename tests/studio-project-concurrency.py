"""Real concurrent local Postgres sessions; synthetic fixtures only, exact cleanup."""
import concurrent.futures,json,subprocess,uuid
prefix=['docker','--context','colima-agynexa-release','exec','-i','agynexa-studio-local-db-1','psql','-U','postgres','-d','postgres','-Atq','-v','ON_ERROR_STOP=1']
def sql(value):
 p=subprocess.run(prefix,input=value,text=True,capture_output=True)
 if p.returncode:raise RuntimeError(p.stderr)
 return p.stdout.strip().splitlines()
actor,session,org,key=[str(uuid.uuid4()) for _ in range(4)]
claims=json.dumps({'sub':actor,'session_id':session,'role':'authenticated'},separators=(',',':'))
def auth(query):return sql("begin;set local role authenticated;select set_config('request.jwt.claims','"+claims+"',true);"+query+';commit;')[-1]
try:
 sql(f"begin;insert into auth.users(id,raw_user_meta_data) values('{actor}','{{\"display_name\":\"Synthetic concurrent work fixture\"}}');insert into auth.sessions(id,user_id) values('{session}','{actor}');insert into public.organizations(id,owner_id) values('{org}','{actor}');insert into public.memberships(org_id,user_id,role) values('{org}','{actor}','owner');commit;")
 query=f"select public.studio_propose_work('{key}','project.create','{{\"name\":\"Concurrent synthetic project\",\"description\":\"\"}}')"
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:proposals=list(pool.map(lambda _:json.loads(auth(query)),range(2)))
 assert proposals[0]['id']==proposals[1]['id'],'Concurrent proposals duplicated'
 a=proposals[0];query=f"select public.studio_apply_work('{a['id']}',1,'{a['snapshot_hash']}')"
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:results=list(pool.map(lambda _:json.loads(auth(query)),range(2)))
 assert results[0]['result']==results[1]['result'],'Concurrent apply returned different entities'
 counts=json.loads(sql(f"select jsonb_build_object('projects',(select count(*) from public.studio_projects where org_id='{org}'),'actions',(select count(*) from public.studio_work_actions where org_id='{org}'),'activity',(select count(*) from public.studio_project_activity where org_id='{org}'),'audit',(select count(*) from public.studio_work_audit where org_id='{org}'));")[-1])
 assert counts=={'projects':1,'actions':1,'activity':1,'audit':2},counts
 print('PASS: two real concurrent sessions converge on one proposal, one reviewed entity, one activity and two audit records')
finally:
 sql(f"begin;delete from public.studio_work_audit where org_id='{org}';delete from public.studio_project_activity where org_id='{org}';delete from public.studio_tasks where org_id='{org}';delete from public.studio_work_actions where org_id='{org}';delete from public.studio_projects where org_id='{org}';delete from public.memberships where org_id='{org}';delete from public.organizations where id='{org}';delete from auth.sessions where user_id='{actor}';delete from auth.users where id='{actor}';commit;")
 print('Synthetic concurrent fixture removed; no existing customer rows changed')
