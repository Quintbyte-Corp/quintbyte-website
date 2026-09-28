-- Contact form submissions (written by the website's server action using the service role).
create table if not exists public.contact_submissions (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null check (char_length(name) between 1 and 120),
  company      text check (char_length(company) <= 160),
  email        text not null check (char_length(email) between 3 and 254),
  interest     text not null,
  message      text not null check (char_length(message) between 1 and 5000),
  source_path  text,
  user_agent   text,
  status       text not null default 'new' check (status in ('new', 'in_review', 'responded', 'closed'))
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

-- RLS on with no policies: the anon and authenticated roles can neither read nor write.
-- Only the service role (server-side, bypasses RLS) inserts rows.
alter table public.contact_submissions enable row level security;
