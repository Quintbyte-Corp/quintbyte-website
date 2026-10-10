-- Website enquiries (GDE-005 §5.1). Replaces contact_submissions from 0001.
-- Written by the website's server action with the service role only.
create table if not exists public.enquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 1 and 120),
  company       text check (char_length(company) <= 160),
  email         text not null check (char_length(email) between 3 and 254),
  service       text not null,
  message       text not null check (char_length(message) between 10 and 2000),
  -- Campaign tags from the landing URL (utm_source is the "source" in GDE-005)
  source        text,
  utm_medium    text,
  utm_campaign  text,
  page          text,
  user_agent    text,
  -- One-way hash of the sender's IP, for the 5-per-hour rate limit; never the raw IP
  ip_hash       text,
  status        text not null default 'new'
                check (status in ('new', 'in_review', 'responded', 'closed'))
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_ip_hash_created_at_idx
  on public.enquiries (ip_hash, created_at desc);

-- RLS on with no policies: the anon and authenticated roles can neither read nor write.
-- Only the service role (server-side, bypasses RLS) inserts and reads rows.
alter table public.enquiries enable row level security;

-- contact_submissions (0001) was never used in production; drop it only if it exists and
-- holds no rows. Dynamic SQL, so a project that never had the table doesn't fail here.
do $$
declare
  has_rows boolean;
begin
  if to_regclass('public.contact_submissions') is not null then
    execute 'select exists (select 1 from public.contact_submissions)' into has_rows;
    if not has_rows then
      execute 'drop table public.contact_submissions';
    end if;
  end if;
end $$;
