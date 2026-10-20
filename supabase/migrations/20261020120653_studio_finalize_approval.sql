-- Resolve ambiguity between the run_id parameter and the support request unique key.
create or replace function public.finish_agent_run(run_id uuid,result jsonb) returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.agent_runs; sid uuid; proposal jsonb;
begin
 select * into r from public.agent_runs where id=run_id;
 if r.id is null then raise exception 'not_found'; end if;
 perform 1 from public.agents where id=r.agent_id for update;
 select * into r from public.agent_runs where id=run_id for update;
 if r.status<>'running' then return to_jsonb(r); end if;
 if r.expires_at<now() then result:=jsonb_build_object('status','failed','error_code','execution_timeout'); end if;
 if result->>'status'='succeeded' then
  if exists(select 1 from jsonb_array_elements(coalesce(result->'citations','[]')) c where not exists(select 1 from public.knowledge_sources s where s.id=(c->>'sourceId')::uuid and s.agent_id=r.agent_id and s.status='ready')) then
   result:=jsonb_build_object('status','cancelled','error_code','source_removed');
  end if;
  if r.access_kind<>'studio' and not exists(select 1 from public.agent_publications p where p.agent_id=r.agent_id and p.active and p.version_id=r.version_id and p.generation=(r.snapshot->>'generation')::integer) then
   result:=jsonb_build_object('status','cancelled','error_code','unpublished');
  end if;
  if r.access_kind='api' and not exists(select 1 from public.agent_api_keys k where k.id=(r.snapshot->>'keyId')::uuid and k.revoked_at is null and k.expires_at>now()) then result:=jsonb_build_object('status','cancelled','error_code','key_revoked'); end if;
 end if;
 update public.agent_runs set status=result->>'status',answer=result->>'answer',citations=coalesce(result->'citations','[]'),usage=coalesce(result->'usage','{}'),error_code=result->>'error_code',finished_at=now() where id=run_id returning * into r;
 proposal:=result->'support';
 if r.status='succeeded' and r.access_kind='studio' and r.snapshot->>'template'='serviceflow' and proposal->>'propose'='true' then
  insert into public.support_requests(org_id,agent_id,run_id,requested_by,title,details) values(r.org_id,r.agent_id,r.id,r.actor_id,proposal->>'title',proposal->>'details') on conflict on constraint support_requests_run_id_key do nothing;
 end if;
 return to_jsonb(r);
end $$;
