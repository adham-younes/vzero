-- Apply after the compatible source-authorized application is serving.
-- Old runtime/usage/cancel routes used direct authenticated table reads.
set lock_timeout='3s';
set statement_timeout='30s';
revoke select on public.agent_runs,public.support_requests from authenticated;
