-- Table privileges for enquiries. Newer Supabase projects don't grant privileges on new
-- tables automatically, so the server key (service_role) needs an explicit grant.
-- The public roles get nothing: RLS already blocks them, and this removes the privilege too.
grant select, insert, update, delete on table public.enquiries to service_role;
revoke all on table public.enquiries from anon, authenticated;
