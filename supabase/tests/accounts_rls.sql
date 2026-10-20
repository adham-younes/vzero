-- Synthetic fixtures exist only inside this rolled-back transaction.
begin;
insert into auth.users(id,raw_user_meta_data) values
 ('10000000-0000-4000-8000-000000000001','{"display_name":"Test A"}'),
 ('10000000-0000-4000-8000-000000000002','{"display_name":"Test B"}');
insert into auth.sessions(id,user_id) values
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001'),
 ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","session_id":"20000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
insert into public.project_briefs(owner_id,request_key,organization,contact_email,service,problem,sources,acceptance)
 values('10000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001','Synthetic','test@example.com','Test','Test problem','Synthetic','Test result');
do $$ begin
 if (select count(*) from public.profiles)<>1 or (select count(*) from public.project_briefs)<>1 then raise exception 'Own access failed'; end if;
 begin
  update public.project_briefs set owner_id='10000000-0000-4000-8000-000000000002';
  raise exception 'Unexpected update permission';
 exception when insufficient_privilege then null; end;
 begin
  perform public.consume_auth_limit(repeat('a',64),1);
  raise exception 'Public limiter execution allowed';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000002","session_id":"20000000-0000-4000-8000-000000000002","role":"authenticated"}',true);
do $$ declare affected integer; begin
 if (select count(*) from public.project_briefs)<>0 then raise exception 'Cross-user read allowed'; end if;
 delete from public.project_briefs where owner_id='10000000-0000-4000-8000-000000000001';get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Cross-user delete allowed'; end if;
 begin
  insert into public.project_briefs(owner_id,request_key,organization,contact_email,service,problem,sources,acceptance)
  values('10000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000002','Synthetic','test@example.com','Test','Test','Test','Test');
  raise exception 'Cross-user insert unexpectedly allowed';
 exception when raise_exception then
  if sqlerrm<>'Invalid owner' then raise; end if;
 end;
end $$;
reset role;
delete from auth.sessions where id='20000000-0000-4000-8000-000000000001';
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","session_id":"20000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$ begin
 if (select count(*) from public.profiles)<>0 or (select count(*) from public.project_briefs)<>0 then raise exception 'Revoked session still has data access'; end if;
end $$;
reset role;
set local role anon;
do $$ begin
 begin perform * from public.project_briefs;raise exception 'Anonymous read allowed';exception when insufficient_privilege then null;end;
 begin perform * from public.profiles;raise exception 'Anonymous profile access allowed';exception when insufficient_privilege then null;end;
end $$;
reset role;
set local role service_role;
do $$ begin
 if public.consume_auth_limit(repeat('b',64),1) is not true then raise exception 'First limit attempt failed'; end if;
 if public.consume_auth_limit(repeat('b',64),1) is not false then raise exception 'Rate limit not enforced'; end if;
end $$;
reset role;
select 'PASS' as rls_own_cross_user_revocation_anon_and_rate_limits;
rollback;
