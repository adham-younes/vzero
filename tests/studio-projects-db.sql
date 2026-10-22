-- Synthetic fixtures and mutations roll back together; local DB only.
\set ON_ERROR_STOP on
begin;
create temporary table work_fixture(k text primary key,v uuid);
insert into work_fixture values ('actor',gen_random_uuid()),('other',gen_random_uuid()),('session',gen_random_uuid()),('other_session',gen_random_uuid()),('org',gen_random_uuid()),('other_org',gen_random_uuid()),('request',gen_random_uuid());
grant select on work_fixture to authenticated;
insert into auth.users(id,raw_user_meta_data) select v,'{"display_name":"Synthetic work fixture"}' from work_fixture where k in ('actor','other');
insert into auth.sessions(id,user_id) select s.v,a.v from work_fixture s join work_fixture a on (s.k='session' and a.k='actor') or (s.k='other_session' and a.k='other');
insert into public.organizations(id,owner_id) select o.v,a.v from work_fixture o join work_fixture a on (o.k='org' and a.k='actor') or (o.k='other_org' and a.k='other');
insert into public.memberships(org_id,user_id,role) select o.v,a.v,'owner' from work_fixture o join work_fixture a on (o.k='org' and a.k='actor') or (o.k='other_org' and a.k='other');
set local role authenticated;
select set_config('request.jwt.claims',jsonb_build_object('sub',(select v from work_fixture where k='actor'),'session_id',(select v from work_fixture where k='session'),'role','authenticated')::text,true);
do $$
declare a jsonb;b jsonb;r jsonb;pid uuid;tid uuid;
begin
 a:=public.studio_propose_work((select v from work_fixture where k='request'),'project.create','{"name":"Synthetic saved project","description":"Actual persisted work"}');
 if a->>'status'<>'proposed' or (select count(*) from public.studio_projects)<>0 then raise exception 'Proposal applied without review';end if;
 b:=public.studio_propose_work((select v from work_fixture where k='request'),'project.create','{"description":"Actual persisted work","name":"Synthetic saved project"}');
 if a->>'id'<>b->>'id' then raise exception 'Proposal replay duplicated';end if;
 begin perform public.studio_propose_work((select v from work_fixture where k='request'),'project.create','{"name":"Changed","description":""}');raise exception 'MISSING_CONFLICT';exception when others then if sqlerrm not like '%request_conflict%' then raise;end if;end;
 begin perform public.studio_apply_work((a->>'id')::uuid,1,repeat('0',64));raise exception 'MISSING_REVIEW_CHECK';exception when others then if sqlerrm not like '%review_conflict%' then raise;end if;end;
 r:=public.studio_apply_work((a->>'id')::uuid,1,a->>'snapshot_hash');pid:=(r->'result'->>'id')::uuid;
 b:=public.studio_apply_work((a->>'id')::uuid,1,a->>'snapshot_hash');if b->'result'<>r->'result' or (select count(*) from public.studio_projects)<>1 then raise exception 'Apply duplicated';end if;
 a:=public.studio_propose_work(gen_random_uuid(),'task.create',jsonb_build_object('projectId',pid,'title','Synthetic task','description','Review this task'));
 r:=public.studio_apply_work((a->>'id')::uuid,1,a->>'snapshot_hash');tid:=(r->'result'->>'id')::uuid;
 a:=public.studio_propose_work(gen_random_uuid(),'task.set_status',jsonb_build_object('projectId',pid,'taskId',tid,'status','done','expectedRevision',1));
 perform public.studio_apply_work((a->>'id')::uuid,1,a->>'snapshot_hash');if (select status from public.studio_tasks where id=tid)<>'done' then raise exception 'Task status not saved';end if;
 a:=public.studio_propose_work(gen_random_uuid(),'task.set_status',jsonb_build_object('projectId',pid,'taskId',tid,'status','blocked','expectedRevision',1));
 begin perform public.studio_apply_work((a->>'id')::uuid,1,a->>'snapshot_hash');raise exception 'MISSING_REVISION_CHECK';exception when others then if sqlerrm not like '%revision_conflict%' then raise;end if;end;
 if (select count(*) from public.studio_project_activity)<>3 then raise exception 'Activity incomplete';end if;
 begin perform public.studio_propose_work(gen_random_uuid(),'email.send','{}');raise exception 'MISSING_ACTION_DENIAL';exception when others then if sqlerrm not like '%invalid_action%' then raise;end if;end;
 begin insert into public.studio_projects(org_id,created_by,name,description) values((select v from work_fixture where k='org'),(select v from work_fixture where k='actor'),'Bypass','');raise exception 'MISSING_WRITE_DENIAL';exception when insufficient_privilege then null;end;
 a:=public.studio_propose_work(gen_random_uuid(),'agent.create','{"name":"Synthetic reviewed agent","instructions":"Only use supplied facts for drafts.","language":"ar","template":"serviceflow","model":"openai/gpt-oss-20b","builder":true}');
 r:=public.studio_apply_work((a->>'id')::uuid,1,a->>'snapshot_hash');b:=public.studio_apply_work((a->>'id')::uuid,1,a->>'snapshot_hash');
 if r->'result'<>b->'result' or (select count(*) from public.agents where id=(r->'result'->>'id')::uuid and chat_profile='customer_v1')<>1 then raise exception 'Agent creation not distinct/idempotent/customer';end if;
end $$;
select set_config('request.jwt.claims',jsonb_build_object('sub',(select v from work_fixture where k='other'),'session_id',(select v from work_fixture where k='other_session'),'role','authenticated')::text,true);
do $$ begin if (select count(*) from public.studio_projects)<>0 or (select count(*) from public.studio_tasks)<>0 or (select count(*) from public.studio_work_actions)<>0 then raise exception 'Cross owner read';end if;end $$;
reset role;
delete from auth.sessions where id=(select v from work_fixture where k='session');
set local role authenticated;
select set_config('request.jwt.claims',jsonb_build_object('sub',(select v from work_fixture where k='actor'),'session_id',(select v from work_fixture where k='session'),'role','authenticated')::text,true);
do $$ begin if (select count(*) from public.studio_projects)<>0 then raise exception 'Revoked session read';end if;begin perform public.studio_propose_work(gen_random_uuid(),'project.create','{"name":"Revoked","description":""}');raise exception 'MISSING_REVOCATION';exception when others then if sqlerrm not like '%sign_in_required%' then raise;end if;end;end $$;
reset role;
set local role anon;
do $$ begin begin perform * from public.studio_projects;raise exception 'MISSING_ANON_DENIAL';exception when insufficient_privilege then null;end;end $$;
reset role;
rollback;
\echo 'PASS: real local roles, scoped reads, proposals/review/replay/revisions/tasks/activity/agent creation/revocation; fixtures rolled back'
