-- Focused direct-RPC isolation and project status path; all fixtures rolled back.
\set ON_ERROR_STOP on
begin;
create temporary table iso_fixture(k text primary key,v uuid);
insert into iso_fixture values('actor',gen_random_uuid()),('other',gen_random_uuid()),('session',gen_random_uuid()),('other_session',gen_random_uuid()),('org',gen_random_uuid()),('other_org',gen_random_uuid());
grant select on iso_fixture to authenticated;
insert into auth.users(id,raw_user_meta_data) select v,'{"display_name":"Synthetic isolation fixture"}' from iso_fixture where k in ('actor','other');
insert into auth.sessions(id,user_id) select s.v,a.v from iso_fixture s join iso_fixture a on (s.k='session' and a.k='actor') or (s.k='other_session' and a.k='other');
insert into public.organizations(id,owner_id) select o.v,a.v from iso_fixture o join iso_fixture a on (o.k='org' and a.k='actor') or (o.k='other_org' and a.k='other');
insert into public.memberships(org_id,user_id,role) select o.v,a.v,'owner' from iso_fixture o join iso_fixture a on (o.k='org' and a.k='actor') or (o.k='other_org' and a.k='other');
set local role authenticated;
select set_config('request.jwt.claims',jsonb_build_object('sub',(select v from iso_fixture where k='actor'),'session_id',(select v from iso_fixture where k='session'),'role','authenticated')::text,true);
do $$declare a jsonb;r jsonb;pid uuid;begin
 a:=public.studio_propose_work(gen_random_uuid(),'project.create','{"name":"Isolation project","description":""}');r:=public.studio_apply_work((a->>'id')::uuid,1,a->>'snapshot_hash');pid:=(r->'result'->>'id')::uuid;
 a:=public.studio_propose_work(gen_random_uuid(),'project.set_status',jsonb_build_object('projectId',pid,'status','paused','expectedRevision',1));perform public.studio_apply_work((a->>'id')::uuid,1,a->>'snapshot_hash');
 if (select status from public.studio_projects where id=pid)<>'paused' or (select revision from public.studio_projects where id=pid)<>2 then raise exception 'Project status/revision not persisted';end if;
 begin perform public.studio_propose_work(gen_random_uuid(),'project.create','{"name":"Scope spoof","description":"","org_id":"11111111-1111-4111-8111-111111111111"}');raise exception 'MISSING_SCOPE_CHECK';exception when others then if sqlerrm not like '%invalid_input%' then raise;end if;end;
 begin perform public.studio_propose_work(gen_random_uuid(),'agent.create','{"name":"Unsafe","instructions":"Draft only.","language":"en","template":"serviceflow","model":"openai/gpt-oss-20b","builder":false}');raise exception 'MISSING_AGENT_PROFILE_CHECK';exception when others then if sqlerrm not like '%invalid_input%' then raise;end if;end;
 begin update public.studio_work_actions set payload='{}';raise exception 'MISSING_IMMUTABILITY';exception when insufficient_privilege then null;end;
end $$;
reset role;
insert into iso_fixture select 'known_action',id from public.studio_work_actions where org_id=(select v from iso_fixture where k='org') limit 1;
insert into iso_fixture select 'known_project',id from public.studio_projects where org_id=(select v from iso_fixture where k='org') limit 1;
set local role authenticated;
select set_config('request.jwt.claims',jsonb_build_object('sub',(select v from iso_fixture where k='other'),'session_id',(select v from iso_fixture where k='other_session'),'role','authenticated')::text,true);
do $$begin
 begin perform public.studio_apply_work((select v from iso_fixture where k='known_action'),1,repeat('a',64));raise exception 'MISSING_CROSS_ACTOR_APPLY_CHECK';exception when others then if sqlerrm not like '%not_found%' then raise;end if;end;
 begin perform public.studio_propose_work(gen_random_uuid(),'task.create',jsonb_build_object('projectId',(select v from iso_fixture where k='known_project'),'title','Cross actor','description',''));raise exception 'MISSING_CROSS_PROJECT_CHECK';exception when others then if sqlerrm not like '%not_found%' then raise;end if;end;
 if (select count(*) from public.studio_project_activity)<>0 or (select count(*) from public.studio_work_audit)<>0 then raise exception 'Cross actor activity/audit leaked';end if;
end $$;
reset role;
rollback;
\echo 'PASS: project status/revision, direct RPC scope/profile validation, immutable proposal, cross-actor apply/task and audit isolation'
