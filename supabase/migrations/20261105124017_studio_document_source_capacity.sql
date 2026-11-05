-- Larger reviewed source text only. Ownership/RLS, approval and idempotency stay unchanged.
-- Existing rows already meet the expanded constraint; no content is rewritten.
alter table public.knowledge_sources drop constraint knowledge_sources_content_check;
alter table public.knowledge_sources add constraint knowledge_sources_content_check
 check(octet_length(content) between 1 and 1048576);
