-- Existing platform DDL event trigger: clients need no EXECUTE permission.
-- Keep the event trigger and its automatic RLS behavior intact.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
